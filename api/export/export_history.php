<?php
// Endpoint untuk menghasilkan dan mengunduh file CSV dari data riwayat.

header('Content-Type: text/csv; charset=utf-8');
// Nama file dinamis berdasarkan tanggal ekspor.
header('Content-Disposition: attachment; filename="riwayat_peminjaman_' . date('Y-m-d') . '.csv"');

// Buat file pointer yang terhubung ke output stream PHP.
$output = fopen('php://output', 'w');

// HEADER CSV
fputcsv($output, [
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
]);

// Ambil data riwayat dari database.
try {
    $base_url = get_base_url();

    $stmt = $pdo->query("
        SELECT 
            h.transaction_id,
            u.nis as borrower_nis,
            h.borrower_name, 
            h.borrower_class, 
            h.subject,
            i.name as item_name, 
            i.classifier,
            h.quantity, 
            h.borrow_date, 
            h.return_date,
            h.proof_image_url,
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
    
    $last_transaction_id = null;
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if (!empty($row['proof_image_url'])) {
            $row['proof_image_url'] = $base_url . '/' . ltrim($row['proof_image_url'], '/');
        }

        // Logika visual: Kosongkan data berulang jika dalam satu transaksi yang sama
        if (!empty($row['transaction_id']) && $row['transaction_id'] === $last_transaction_id) {
            $row['borrower_nis'] = '';
            $row['borrower_name'] = '';
            $row['borrower_class'] = '';
            $row['subject'] = '';
            $row['borrow_date'] = '';
            $row['return_date'] = '';
            $row['proof_image_url'] = '';
        } else {
            $last_transaction_id = $row['transaction_id'];
        }
        
        // --- KONVERSI DATA AGAR READABLE ---
        
        $status_penukaran = $row['is_swap'] ? 'Ya' : 'Tidak';       
        $barang_pengganti = !empty($row['swap_item_name']) ? $row['swap_item_name'] : '-';
        $kondisi_akhir = ($row['item_condition'] === 'bad') ? 'Rusak' : 'Baik';
        $keterangan = !empty($row['condition_remark']) ? $row['condition_remark'] : '-';

        // Susun baris CSV sesuai urutan Header
        $csv_row = [
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
            $row['proof_image_url']
        ];

        fputcsv($output, $csv_row);
    }

} catch (PDOException $e) {
    error_log("Export History Error: " . $e->getMessage());
}

fclose($output);
exit();