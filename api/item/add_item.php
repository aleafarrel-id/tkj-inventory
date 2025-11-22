<?php
// Endpoint untuk menambahkan barang baru ke inventaris.

$name = isset($_POST['name']) ? sanitize_input($_POST['name']) : null;
$total_quantity = $_POST['total_quantity'] ?? null;
$image = $_FILES['image'] ?? null;
$classifier = isset($_POST['classifier']) ? sanitize_input(trim($_POST['classifier'])) : null;

if (empty($name) || !$total_quantity) {
    json_response('error', 'Nama dan jumlah barang harus diisi.');
}
if (!filter_var($total_quantity, FILTER_VALIDATE_INT) || $total_quantity < 1) {
    json_response('error', 'Jumlah total tidak valid.');
}

$image_url = null;
if ($image && $image['error'] === UPLOAD_ERR_OK) {
    // Unggah file gambar dengan aman menggunakan helper.
    $upload_result = handle_secure_upload($image, 'assets/img/');
    if ($upload_result['status'] === 'error') {
        json_response('error', $upload_result['message']);
    }
    $image_url = $upload_result['url'];
}

try {
    $item_code = strtoupper(uniqid('INV-'));

    $sql = "INSERT INTO items (item_code, name, total_quantity, current_quantity, image_url, classifier) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    // Masukkan item_code yang baru dibuat ke database
    $stmt->execute([$item_code, $name, $total_quantity, $total_quantity, $image_url, empty($classifier) ? null : $classifier]);
    
    json_response('success', 'Barang berhasil ditambahkan.');

} catch (PDOException $e) {
    // Hapus gambar jika query database gagal.
    if ($image_url && file_exists(dirname(dirname(__DIR__)) . '/public/' . $image_url)) {
        unlink(dirname(dirname(__DIR__)) . '/public/' . $image_url);
    }
    error_log('Input Item Error: ' . $e->getMessage());
    json_response('error', 'Gagal menambahkan barang ke database.');
}