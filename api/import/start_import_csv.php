<?php
/**
 * Endpoint untuk MEMULAI proses impor CSV (Stok, Riwayat, atau Akun).
 * Bertugas memvalidasi file, mendeteksi tipe CSV berdasarkan header,
 * dan membuat file status antrian.
 */

// Lokasi file status/antrian.
$status_file_path = dirname(dirname(__DIR__)) . '/temp/import_status.json';
$temp_dir = dirname($status_file_path);

// --- Validasi ---
if (!isset($_FILES['csv_file']) || $_FILES['csv_file']['error'] !== UPLOAD_ERR_OK) {
    json_response('error', 'File CSV tidak ditemukan atau gagal diunggah.');
}

$expected_type = $_POST['import_type'] ?? null;
if (empty($expected_type) || !in_array($expected_type, ['stock', 'history', 'accounts'])) {
    if (isset($_FILES['csv_file']['tmp_name']) && file_exists($_FILES['csv_file']['tmp_name'])) {
        @unlink($_FILES['csv_file']['tmp_name']);
    }
    json_response('error', 'Tipe impor tidak spesifik atau tidak valid. Silakan coba lagi.');
}

if (!is_dir($temp_dir)) {
    if (!@mkdir($temp_dir, 0775, true)) {
        json_response('error', 'Kritis: Gagal membuat direktori sementara. Periksa izin folder.');
    }
}

if (file_exists($status_file_path)) {
    $current_status_raw = @file_get_contents($status_file_path);
    $current_status = $current_status_raw ? json_decode($current_status_raw, true) : null;
    if ($current_status && isset($current_status['status']) && $current_status['status'] === 'running') {
        json_response('error', 'Proses impor lain sedang berjalan. Harap tunggu hingga selesai.');
    }
}

$file = $_FILES['csv_file'];

$mime_type = mime_content_type($file['tmp_name']);
$allowed_mime_types = ['text/csv', 'text/plain', 'application/csv', 'text/x-csv', 'application/vnd.ms-excel'];
if (!in_array($mime_type, $allowed_mime_types) && strpos($file['name'], '.csv') === false) {
    json_response('error', 'Tipe file tidak valid. Harap unggah file .csv');
}

$temp_csv_filename = 'import_queue_' . uniqid() . '.csv';
$temp_csv_path = $temp_dir . '/' . $temp_csv_filename;

if (!move_uploaded_file($file['tmp_name'], $temp_csv_path)) {
    json_response('error', 'Gagal memindahkan file CSV ke direktori sementara.');
}


try {
    $handle = fopen($temp_csv_path, "r");
    if ($handle === false) {
        throw new Exception("Gagal membuka file CSV sementara.");
    }
    
    // --- Deteksi Tipe CSV Berdasarkan Header ---
    $header = fgetcsv($handle);
    $header_offset = ftell($handle);

    $detected_type = null;
    $has_item_code = false;

    // Definisi Header
    $stock_header_old = ['Nama Barang', 'Jenis Barang', 'Jumlah', 'Link Gambar'];
    $stock_header_new = ['Kode Barang', 'Nama Barang', 'Jenis Barang', 'Jumlah', 'Link Gambar'];
    
    $history_header = ['NIS', 'Nama Peminjam', 'Kelas', 'Mata Pelajaran', 'Nama Barang', 'Jenis Alat', 'Status Penukaran', 'Barang Pengganti', 'Kondisi Akhir', 'Keterangan', 'Jumlah', 'Tanggal Pinjam', 'Tanggal Kembali', 'Link Bukti'];
    $account_header = ['NIS', 'Password', 'Nama', 'Kelas'];

    if (is_array($header)) {
        // Cek Stok (Ada Kode)
        if (count($header) === count($stock_header_new) && !array_diff($header, $stock_header_new)) {
            $detected_type = 'stock';
            $has_item_code = true;
        } 
        // Cek Stok (Tanpa Kode)
        elseif (count($header) === count($stock_header_old) && !array_diff($header, $stock_header_old)) {
            $detected_type = 'stock';
            $has_item_code = false;
        }
        // Cek History
        elseif (count($header) === count($history_header) && !array_diff($header, $history_header)) {
            $detected_type = 'history';
        }
        // Cek Akun
        elseif (count($header) === count($account_header) && !array_diff($header, $account_header)) {
            $detected_type = 'accounts';
        }
    }
    
    if ($detected_type === null) {
        fclose($handle);
        @unlink($temp_csv_path);
        json_response('error', 'Format CSV tidak dikenali. Pastikan header file sesuai dengan template.');
    }

    if ($detected_type !== $expected_type) {
        fclose($handle);
        @unlink($temp_csv_path);
        $type_map = ['stock' => 'Stok Barang', 'history' => 'Riwayat', 'accounts' => 'Akun'];
        $expected_name = $type_map[$expected_type] ?? 'Tidak Dikenali';
        $detected_name = $type_map[$detected_type] ?? 'Tidak Dikenali';
        json_response('error', "File salah! Anda mencoba mengunggah file '{$detected_name}' ke dalam fitur impor '{$expected_name}'.");
    }

    $import_type = $detected_type;

    // --- Hitung Total Baris ---
    $row_number = 0;
    while (fgetcsv($handle, 2000, ",") !== false) {
        $row_number++;
    }
    $total_rows = $row_number;
    fclose($handle);

    if ($total_rows === 0) {
        @unlink($temp_csv_path);
        json_response('error', 'File CSV kosong atau tidak memiliki data yang valid (selain header).');
    }
    
    $initial_status = [
        'status' => 'running',
        'import_type' => $import_type,
        'has_item_code' => $has_item_code,
        'csv_file' => $temp_csv_filename,
        'total' => $total_rows,
        'processed' => 0,
        'success' => 0,
        'failed' => 0,
        'current_offset' => $header_offset,
        'startTime' => date('c'),
        'endTime' => null,
        'log' => [
            ['time' => date('H:i:s'), 'message' => "Impor {$import_type} dimulai. Ditemukan {$total_rows} baris data.", 'status' => 'info']
        ],
        'last_transaction_data' => []
    ];

    if (@file_put_contents($status_file_path, json_encode($initial_status, JSON_PRETTY_PRINT)) === false) {
        throw new Exception("Gagal menulis file status. Periksa izin folder 'temp'.");
    }

    json_response('success', 'Proses impor berhasil dimulai.');

} catch (Exception $e) {
    if (file_exists($temp_csv_path)) @unlink($temp_csv_path);
    error_log('CSV Import Initiation Error: ' . $e->getMessage());
    json_response('error', 'Gagal memulai proses impor: ' . $e->getMessage());
}