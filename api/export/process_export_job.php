<?php
// Endpoint "pekerja" yang menangani BATCH pekerjaan dari antrian ekspor stok atau ekspor akun.

$status_file_path = dirname(dirname(__DIR__)) . '/temp/export_status.json';

// Memuat helper uploader Google Drive dan helper proses status
require_once __DIR__ . '/../helpers/google_drive_uploader.php';
require_once __DIR__ . '/../helpers/process_status_helper.php';

if (!file_exists($status_file_path)) {
    json_response('error', 'File status ekspor tidak ditemukan.');
}

$lock_result = lock_and_read_status($status_file_path);
if ($lock_result === null) {
    http_response_code(429);
    json_response('error', 'Server sedang sibuk memproses pekerjaan lain.');
}
$fp = $lock_result['fp'];
$status_data = $lock_result['data'];

// Jika sudah selesai, kembalikan status terakhir
if ($status_data['status'] === 'complete' || $status_data['status'] === 'error') {
    write_and_unlock_status($fp, $status_data);
    header('Content-Type: application/json');
    echo json_encode($status_data);
    exit();
}

$export_type = $status_data['export_type'] ?? 'stock';
$all_jobs_done = false;

// Periksa apakah ini ekspor stok DAN masih ada pekerjaan yang harus diproses
if ($export_type === 'stock' && $status_data['processed'] < $status_data['total']) {
    // Ambil dan proses BATCH pekerjaan (hanya untuk 'stock')
    $current_page = $status_data['page'];
    $offset = ($current_page - 1) * JOB_BATCH_SIZE_EXPORT;

    // Ambil batch pekerjaan dari database
    $stmt_batch = $pdo->prepare("
        SELECT id, image_url 
        FROM items 
        WHERE image_url IS NOT NULL AND image_url != '' AND image_url != 'assets/favicon/dummy.jpg'
        LIMIT :limit OFFSET :offset
    ");
    $stmt_batch->bindValue(':limit', JOB_BATCH_SIZE_EXPORT, PDO::PARAM_INT);
    $stmt_batch->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt_batch->execute();
    $batch_jobs = $stmt_batch->fetchAll(PDO::FETCH_ASSOC);

    if (empty($batch_jobs)) {
        $all_jobs_done = true;
    } else {
        // Proses setiap pekerjaan dalam batch
        foreach ($batch_jobs as $job) {
            $local_file_path = dirname(dirname(__DIR__)) . '/public/' . ltrim($job['image_url'], '/');
            $file_name_for_log = basename($local_file_path);

            $logCallback = function($msg) use (&$status_data, $file_name_for_log) {
                if (strpos(strtolower($msg), 'gagal') !== false) {
                    $status_data['log'][] = ['time' => date('H:i:s'), 'message' => $msg, 'status' => 'info'];
                }
            };
            
            $upload_result = upload_single_file_to_drive(
                $local_file_path, 
                @mime_content_type($local_file_path) ?: 'application/octet-stream', 
                GOOGLE_DRIVE_STOCK_EXPORT_FOLDER_ID, 
                'gambar_stok',
                $logCallback
            );

            if (isset($upload_result['status']) && $upload_result['status'] === 'success') {
                $status_data['drive_urls_map'][$job['id']] = $upload_result['url']; // Simpan URL berdasarkan item_id
                $status_data['success']++;
                $status_data['log'][] = ['time' => date('H:i:s'), 'message' => $file_name_for_log, 'status' => 'success'];
            } else {
                $status_data['drive_urls_map'][$job['id']] = 'GAGAL_UPLOAD: ' . ($upload_result['message'] ?? 'N/A');
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
    // BUAT DAN UPLOAD CSV (Finalisasi)
    $status_data['status'] = 'finalizing';
    $csv_filename = '';
    $csv_data = [];
    $folder_id = '';
    $subfolder = null;

    if ($export_type === 'stock') {
        $status_data['log'][] = ['time' => date('H:i:s'), 'message' => 'Semua gambar selesai diunggah. Membuat file CSV stok...', 'status' => 'info'];
        $drive_urls_map = $status_data['drive_urls_map'] ?? [];
        
        $stmt = $pdo->query("SELECT id, item_code, name, classifier, total_quantity FROM items ORDER BY classifier, name");
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $csv_data = [['Kode Barang', 'Nama Barang', 'Jenis Barang', 'Jumlah', 'Link Gambar']];
        
        foreach ($items as $item) {
            $image_link = $drive_urls_map[$item['id']] ?? '';
            $csv_data[] = [$item['item_code'], $item['name'], $item['classifier'], $item['total_quantity'], $image_link];
        }
        $csv_filename = 'ekspor_stok_' . date('Y-m-d_H-i-s') . '.csv';
        $folder_id = GOOGLE_DRIVE_STOCK_EXPORT_FOLDER_ID;

    } elseif ($export_type === 'accounts') {
        $status_data['log'][] = ['time' => date('H:i:s'), 'message' => 'Membuat file CSV akun...', 'status' => 'info'];
        
        $stmt = $pdo->query("
            SELECT u.nis, u.password, u.nama, c.name AS kelas 
            FROM users u
            LEFT JOIN classes c ON u.kelas = c.id
            WHERE u.role = 'user' 
            ORDER BY c.name, u.nama
        ");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $csv_data = [['NIS', 'Password', 'Nama', 'Kelas']];
        foreach ($users as $user) {
            $decoded_nama = htmlspecialchars_decode($user['nama'], ENT_QUOTES);
            $csv_data[] = [$user['nis'], $user['password'], $decoded_nama, $user['kelas']];
        }

        $csv_filename = 'ekspor_akun_siswa_' . date('Y-m-d_H-i-s') . '.csv';
        $folder_id = GOOGLE_DRIVE_ACCOUNTS_EXPORT_FOLDER_ID;
        $status_data['processed'] = 1;
        $status_data['total'] = 1;
    }

    if (!empty($csv_data) && count($csv_data) > 1) {
        $temp_csv_path = dirname($status_file_path) . '/' . $csv_filename;
        $csv_fp = fopen($temp_csv_path, 'w');
        foreach ($csv_data as $fields) fputcsv($csv_fp, $fields);
        fclose($csv_fp);
        
        $csv_upload_result = upload_single_file_to_drive(
            $temp_csv_path, 
            'text/csv', 
            $folder_id, 
            $subfolder,
            null
        );

        if ($csv_upload_result['status'] === 'success') {
            $status_data['csv_url'] = $csv_upload_result['url'];
            $status_data['log'][] = ['time' => date('H:i:s'), 'message' => 'Ekspor Selesai! File CSV berhasil diunggah.', 'status' => 'success'];
            $status_data['status'] = 'complete';
        } else {
            $status_data['log'][] = ['time' => date('H:i:s'), 'message' => 'Gagal mengunggah file CSV akhir: ' . ($csv_upload_result['message'] ?? ''), 'status' => 'error'];
            $status_data['status'] = 'error';
        }
        @unlink($temp_csv_path);
    } else {
        $status_data['status'] = 'error';
        $status_data['message'] = 'Tidak ada data untuk diekspor ke CSV.';
        $status_data['log'][] = ['time' => date('H:i:s'), 'message' => 'Tidak ada data untuk ditulis ke CSV.', 'status' => 'error'];
    }
    $status_data['endTime'] = date('c');
}

write_and_unlock_status($fp, $status_data);

header('Content-Type: application/json');
echo json_encode($status_data);
exit();