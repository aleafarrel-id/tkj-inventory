<?php
// Endpoint "pekerja" yang menangani satu pekerjaan dari antrian.
// File ini akan dipanggil berulang kali oleh frontend.

// --- PENGATURAN & KEAMANAN ---
$status_file_path = dirname(dirname(__DIR__)) . '/temp/backup_status.json';

// Memuat helper uploader Google Drive dan helper proses status
require_once __DIR__ . '/../helpers/google_drive_uploader.php';
require_once __DIR__ . '/../helpers/process_status_helper.php';

// --- PROSES UTAMA ---
$lock_result = lock_and_read_status($status_file_path);
if ($lock_result === null) {
    http_response_code(429); // Too Many Requests
    json_response('error', 'Server sedang sibuk memproses pekerjaan lain.');
}
$fp = $lock_result['fp'];
$status_data = $lock_result['data'];

if ($status_data['status'] === 'complete' || $status_data['status'] === 'error') {
    write_and_unlock_status($fp, $status_data);
    header('Content-Type: application/json');
    echo json_encode($status_data);
    exit();
}

$all_jobs_done = false;

if ($status_data['processed'] < $status_data['total']) {
    $current_page = $status_data['page'];
    $offset = ($current_page - 1) * JOB_BATCH_SIZE_BACKUP;

    // Ambil batch pekerjaan dari database (Upload Gambar)
    $stmt_batch = $pdo->prepare("
        SELECT DISTINCT transaction_id, proof_image_url 
        FROM history 
        WHERE proof_image_url IS NOT NULL AND proof_image_url != '' AND transaction_id IS NOT NULL
        LIMIT :limit OFFSET :offset
    ");
    $stmt_batch->bindValue(':limit', JOB_BATCH_SIZE_BACKUP, PDO::PARAM_INT);
    $stmt_batch->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt_batch->execute();
    $batch_jobs = $stmt_batch->fetchAll(PDO::FETCH_ASSOC);

    if (empty($batch_jobs)) {
        $all_jobs_done = true;
    } else {
        // Proses setiap pekerjaan dalam batch
        foreach ($batch_jobs as $job) {
            $local_file_path = dirname(dirname(__DIR__)) . '/public/' . ltrim($job['proof_image_url'], '/');
            $file_name_for_log = basename($local_file_path);
            
            $logCallback = function($msg) use (&$status_data, $file_name_for_log) {
                if (strpos(strtolower($msg), 'gagal') !== false) {
                     $status_data['log'][] = ['time' => date('H:i:s'), 'message' => $msg, 'status' => 'info'];
                }
            };
            
            $upload_result = upload_single_file_to_drive(
                $local_file_path, 
                @mime_content_type($local_file_path) ?: 'application/octet-stream', 
                GOOGLE_DRIVE_HISTORY_BACKUP_FOLDER_ID, 
                'bukti',
                $logCallback
            );

            if (isset($upload_result['status']) && $upload_result['status'] === 'success') {
                $status_data['drive_urls_map'][$job['transaction_id']] = $upload_result['url'];
                $status_data['success']++;
                $status_data['log'][] = ['time' => date('H:i:s'), 'message' => $file_name_for_log, 'status' => 'success'];
            } else {
                $status_data['drive_urls_map'][$job['transaction_id']] = 'GAGAL_UPLOAD: ' . ($upload_result['message'] ?? 'N/A');
                $status_data['failed']++;
                $status_data['log'][] = ['time' => date('H:i:s'), 'message' => $file_name_for_log . ' - Gagal: ' . ($upload_result['message'] ?? 'Unknown error'), 'status' => 'error'];
            }
            $status_data['processed']++;
        }
        
        // Update halaman untuk request berikutnya
        $status_data['page']++;
        if ($status_data['processed'] >= $status_data['total']) {
            $all_jobs_done = true;
        }
    }
} else {
    $all_jobs_done = true;
}


if ($all_jobs_done && $status_data['status'] !== 'finalizing') {
    // ---Buat dan Unggah CSV ---
    $status_data['status'] = 'finalizing';
    $status_data['log'][] = ['time' => date('H:i:s'), 'message' => 'Semua bukti selesai diunggah. Membuat file CSV...', 'status' => 'info'];
    
    $drive_urls_map = $status_data['drive_urls_map'] ?? [];
    
    // Ambil data lengkap termasuk kondisi dan keterangan
    $stmt = $pdo->query("
        SELECT 
            h.id, 
            h.transaction_id, 
            i.name as item_name, 
            i.classifier, 
            h.borrower_name, 
            h.borrower_class, 
            h.subject, 
            h.quantity, 
            h.borrow_date, 
            h.return_date, 
            u.nis as borrower_nis,
            h.is_swap,
            h.item_condition,
            h.condition_remark,
            i_new.name as swap_item_name
        FROM history h 
        JOIN items i ON h.item_id = i.id 
        LEFT JOIN items i_new ON h.swap_new_item_id = i_new.id
        LEFT JOIN users u ON h.user_id = u.id 
        ORDER BY h.return_date DESC, h.transaction_id DESC
    ");
    $history_records = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // HEADER CSV
    $csv_data = [[
        'NIS', 
        'Nama Peminjam', 
        'Kelas', 
        'Mata Pelajaran', 
        'Nama Barang', 
        'Jenis Alat', 
        'Status Penukaran',
        'Barang Pengganti',
        'Kondisi Akhir',   
        'Keterangan',      
        'Jumlah', 
        'Tanggal Pinjam', 
        'Tanggal Kembali', 
        'Link Bukti'
    ]];

    $last_transaction_id = null;
    foreach ($history_records as $row) {
        $drive_url = $drive_urls_map[$row['transaction_id']] ?? 'Tidak ada bukti';
        
        // Logika visual untuk mengosongkan data berulang dalam satu transaksi
        if (!empty($row['transaction_id']) && $row['transaction_id'] === $last_transaction_id) {
            $row['borrower_nis'] = ''; 
            $row['borrower_name'] = ''; 
            $row['borrower_class'] = ''; 
            $row['subject'] = '';
            $row['borrow_date'] = ''; 
            $row['return_date'] = ''; 
            $drive_url = '';
        } else {
            $last_transaction_id = $row['transaction_id'];
        }
        
        // --- KONVERSI DATA ---
        
        $status_penukaran = $row['is_swap'] ? 'Ya' : 'Tidak';
        $barang_pengganti = !empty($row['swap_item_name']) ? $row['swap_item_name'] : '-';
        $kondisi_akhir = ($row['item_condition'] === 'bad') ? 'Rusak' : 'Baik';
        $keterangan = !empty($row['condition_remark']) ? $row['condition_remark'] : '-';

        // Susun baris CSV
        $csv_data[] = [
            $row['borrower_nis'], 
            $row['borrower_name'], 
            $row['borrower_class'], 
            $row['subject'], 
            $row['item_name'], 
            $row['classifier'], 
            $status_penukaran,
            $barang_pengganti,
            $kondisi_akhir,
            $keterangan,
            $row['quantity'], 
            $row['borrow_date'], 
            $row['return_date'], 
            $drive_url
        ];
    }
    
    $csv_filename = 'backup_riwayat_' . date('Y-m-d_H-i-s') . '.csv';
    $temp_csv_path = dirname($status_file_path) . '/' . $csv_filename;
    $csv_fp = fopen($temp_csv_path, 'w');
    foreach ($csv_data as $fields) fputcsv($csv_fp, $fields);
    fclose($csv_fp);
    
    $csv_upload_result = upload_single_file_to_drive($temp_csv_path, 'text/csv', GOOGLE_DRIVE_HISTORY_BACKUP_FOLDER_ID);
    if (isset($csv_upload_result['status']) && $csv_upload_result['status'] === 'success') {
        $status_data['csv_url'] = $csv_upload_result['url'];
        $status_data['log'][] = ['time' => date('H:i:s'), 'message' => 'Backup Selesai! File CSV berhasil diunggah.', 'status' => 'success'];
        $status_data['status'] = 'complete';
    } else {
        $status_data['log'][] = ['time' => date('H:i:s'), 'message' => 'Gagal mengunggah file CSV akhir: ' . ($csv_upload_result['message'] ?? ''), 'status' => 'error'];
        $status_data['status'] = 'error';
    }
    $status_data['endTime'] = date('c');
    @unlink($temp_csv_path);
}

write_and_unlock_status($fp, $status_data);

header('Content-Type: application/json');
echo json_encode($status_data);
exit();