<?php
/**
 * Endpoint "pekerja" yang menangani BATCH pekerjaan dari antrian impor CSV.
 */

require_once __DIR__ . '/../helpers/process_status_helper.php';

$status_file_path = dirname(dirname(__DIR__)) . '/temp/import_status.json';

if (!file_exists($status_file_path)) {
    json_response('error', 'File status impor tidak ditemukan.');
}

// --- Fungsi untuk Download Gambar ---
function download_image_from_url($url, $import_type) {
    if (empty($url) || !filter_var($url, FILTER_VALIDATE_URL)) {
        return ['status' => 'skip', 'path' => null];
    }
    $image_content = false;
    if (strpos($url, 'drive.google.com') !== false) {
        $fileId = null;
        if (preg_match('/\/d\/([a-zA-Z0-9_-]+)/', $url, $matches)) $fileId = $matches[1];
        if ($fileId) {
            $directDownloadUrl = 'https://drive.google.com/uc?export=download&id=' . $fileId;
            $ch = curl_init($directDownloadUrl);
            curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_FOLLOWLOCATION => true, CURLOPT_SSL_VERIFYPEER => false, CURLOPT_TIMEOUT => 60]);
            $image_content = curl_exec($ch);
            $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            if ($http_code !== 200) $image_content = false;
        }
    } else {
        $image_content = @file_get_contents($url);
    }
    if ($image_content === false) return ['status' => 'error', 'message' => 'Gagal mengunduh gambar dari URL.'];
    $image_info = @getimagesizefromstring($image_content);
    if ($image_info === false) return ['status' => 'error', 'message' => 'URL bukan gambar yang valid.'];
    $extension = image_type_to_extension($image_info[2]);
    if (!$extension) return ['status' => 'skip', 'path' => null];
    $sub_dir = ($import_type === 'history') ? 'assets/evidence/' : 'assets/img/';
    $safe_filename = uniqid('import_', true) . $extension;
    $target_dir = dirname(dirname(__DIR__)) . '/public/' . $sub_dir;
    $target_file = $target_dir . $safe_filename;
    if (!is_dir($target_dir)) @mkdir($target_dir, 0775, true);
    if (file_put_contents($target_file, $image_content)) {
        return ['status' => 'success', 'path' => $sub_dir . $safe_filename];
    }
    return ['status' => 'error', 'message' => 'Gagal menyimpan gambar ke server.'];
}


// --- PROSES UTAMA BATCH ---
$lock_result = lock_and_read_status($status_file_path);
if ($lock_result === null) {
    http_response_code(429);
    json_response('error', 'Server sedang sibuk memproses pekerjaan lain.');
}
$fp_status = $lock_result['fp'];
$status_data = $lock_result['data'];

if ($status_data['status'] === 'complete' || $status_data['status'] === 'error') {
    write_and_unlock_status($fp_status, $status_data);
    header('Content-Type: application/json');
    echo json_encode($status_data);
    exit();
}

$temp_csv_path = dirname($status_file_path) . '/' . $status_data['csv_file'];
if (!file_exists($temp_csv_path)) {
    $status_data['status'] = 'error';
    $status_data['message'] = 'File CSV sementara tidak ditemukan. Membatalkan impor.';
    $status_data['log'][] = ['time' => date('H:i:s'), 'message' => $status_data['message'], 'status' => 'error'];
    write_and_unlock_status($fp_status, $status_data);
    json_response('error', $status_data['message']);
}

$handle_csv = fopen($temp_csv_path, "r");
if ($handle_csv === false) {
    $status_data['status'] = 'error';
    $status_data['message'] = 'Gagal membuka file CSV sementara untuk diproses.';
    $status_data['log'][] = ['time' => date('H:i:s'), 'message' => $status_data['message'], 'status' => 'error'];
    write_and_unlock_status($fp_status, $status_data);
    json_response('error', $status_data['message']);
}

$current_offset = $status_data['current_offset'];
fseek($handle_csv, $current_offset);

$import_type = $status_data['import_type'];
$has_item_code = $status_data['has_item_code'] ?? false;
$last_transaction_data = $status_data['last_transaction_data'] ?? [];
$all_jobs_done = false;
$rows_processed_in_batch = 0;

try {
    $pdo->beginTransaction();

    for ($i = 0; $i < JOB_BATCH_SIZE_IMPORT; $i++) {
        $data = fgetcsv($handle_csv, 2000, ",");

        if ($data === false) {
            $all_jobs_done = true;
            break;
        }

        if (empty(array_filter($data))) {
            $status_data['processed']++;
            continue;
        }

        // Tentukan preview log
        $log_preview = 'Item';
        if ($import_type === 'stock') {
             $name_idx = $has_item_code ? 1 : 0;
             $log_preview = $data[$name_idx] ?? 'N/A';
        } elseif ($import_type === 'history') {
             $log_preview = $data[1] ?? 'N/A';
        } elseif ($import_type === 'accounts') {
             $log_preview = $data[0] ?? 'N/A';
        }


        try {
            if ($import_type === 'stock') {
                // --- Logika Impor Stok dengan Item Code ---
                
                if ($has_item_code) {
                    $csv_item_code = isset($data[0]) ? sanitize_input(trim($data[0])) : null;
                    $name = isset($data[1]) ? sanitize_input($data[1]) : null;
                    $classifier = isset($data[2]) ? sanitize_input(trim($data[2])) : null;
                    $quantity = isset($data[3]) ? (int)$data[3] : null;
                    $image_url_source = isset($data[4]) ? trim($data[4]) : null;
                    
                    // Jika user mengosongkan kolom kode di CSV, generate baru
                    if (empty($csv_item_code)) {
                        $item_code = strtoupper(uniqid('INV-'));
                    } else {
                        $item_code = $csv_item_code;
                    }
                } else {
                    $name = isset($data[0]) ? sanitize_input($data[0]) : null;
                    $classifier = isset($data[1]) ? sanitize_input(trim($data[1])) : null;
                    $quantity = isset($data[2]) ? (int)$data[2] : null;
                    $image_url_source = isset($data[3]) ? trim($data[3]) : null;
                    
                    $item_code = strtoupper(uniqid('INV-'));
                }

                if (empty($name) || $quantity === null || $quantity < 1) {
                    throw new Exception("Data tidak valid (nama/jumlah).");
                }

                $image_result = download_image_from_url($image_url_source, $import_type);
                $saved_image_path = $image_result['path'] ?? 'assets/favicon/dummy.jpg';
                
                if ($image_result['status'] === 'error' && !empty($image_url_source)) {
                    $status_data['log'][] = ['time' => date('H:i:s'), 'message' => "{$name}: " . $image_result['message'] . ". Menggunakan gambar default.", 'status' => 'warning'];
                }
                
                // Insert termasuk item_code
                $sql = "INSERT INTO items (item_code, name, total_quantity, current_quantity, image_url, classifier) VALUES (?, ?, ?, ?, ?, ?)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$item_code, $name, $quantity, $quantity, $saved_image_path, empty($classifier) ? null : $classifier]);

            } elseif ($import_type === 'history') {
                // Logika History
                $borrower_nis = isset($data[0]) ? trim($data[0]) : null;
                $borrower_name = $data[1] ?? null; 
                $borrower_class = $data[2] ?? null; 
                $subject = $data[3] ?? null;
                $item_name = $data[4] ?? null;
                // $classifier = $data[5] (Tidak perlu disimpan ke history, hanya info di CSV)
                $status_penukaran_str = $data[6] ?? 'Tidak';
                $barang_pengganti_name = $data[7] ?? '-';
                $kondisi_akhir_str = $data[8] ?? 'Baik';
                $keterangan = ($data[9] !== '-' && !empty($data[9])) ? $data[9] : null;
                $quantity = isset($data[10]) ? (int)$data[10] : null;
                $borrow_date_str = $data[11] ?? null; 
                $return_date_str = $data[12] ?? null; 
                $proof_url = $data[13] ?? null;

                // Konversi Data ke Format Database
                $is_swap = (strtolower($status_penukaran_str) === 'ya') ? 1 : 0;
                $item_condition = (strtolower($kondisi_akhir_str) === 'rusak') ? 'bad' : 'good';
                
                // Cari User ID
                $user_id = null;
                if (!empty($borrower_nis)) {
                    $stmt_find_user = $pdo->prepare("SELECT id FROM users WHERE nis = ? LIMIT 1");
                    $stmt_find_user->execute([$borrower_nis]);
                    $user_id = $stmt_find_user->fetchColumn();
                }

                // Cari ID Barang Pengganti (Jika ada penukaran)
                $swap_new_item_id = null;
                if ($is_swap && !empty($barang_pengganti_name) && $barang_pengganti_name !== '-') {
                    $stmt_find_swap = $pdo->prepare("SELECT id FROM items WHERE name = ? LIMIT 1");
                    $stmt_find_swap->execute([$barang_pengganti_name]);
                    $swap_new_item_id = $stmt_find_swap->fetchColumn() ?: null;
                }

                // Proses Transaksi & Bukti Foto
                if (!empty($borrower_nis) || !empty($borrower_name)) {
                    $image_result = download_image_from_url($proof_url, $import_type);
                    $image_path_for_db = $image_result['path'];
                    
                    if ($image_result['status'] === 'error' && !empty($proof_url)) {
                        $status_data['log'][] = ['time' => date('H:i:s'), 'message' => "{$borrower_name} ({$item_name}): " . $image_result['message'], 'status' => 'warning'];
                    }
                    
                    $last_transaction_data = [
                        'borrower_name' => $borrower_name, 'borrower_class' => $borrower_class, 'subject' => $subject,
                        'borrow_date' => !empty($borrow_date_str) ? date('Y-m-d H:i:s', strtotime($borrow_date_str)) : null,
                        'return_date' => !empty($return_date_str) ? date('Y-m-d H:i:s', strtotime($return_date_str)) : null,
                        'proof_image_url' => $image_path_for_db, 'transaction_id' => 'imported-' . uniqid(), 'user_id' => $user_id
                    ];
                }

                if (empty($item_name) || empty($quantity)) throw new Exception("Nama barang atau jumlah kosong.");
                
                // Cari ID Barang Utama
                $stmt_find_item = $pdo->prepare("SELECT id FROM items WHERE name = ? LIMIT 1");
                $stmt_find_item->execute([$item_name]);
                $item_id = $stmt_find_item->fetchColumn();
                
                if (!$item_id) throw new Exception("Barang '{$item_name}' tidak ditemukan di database.");
                
                $sql_insert = "INSERT INTO history (
                    item_id, quantity, borrower_name, borrower_class, subject, 
                    borrow_date, return_date, proof_image_url, transaction_id, user_id,
                    is_swap, swap_new_item_id, item_condition, condition_remark
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                
                $stmt_insert = $pdo->prepare($sql_insert);
                $stmt_insert->execute([
                    $item_id, 
                    $quantity, 
                    $last_transaction_data['borrower_name'], 
                    $last_transaction_data['borrower_class'], 
                    $last_transaction_data['subject'], 
                    $last_transaction_data['borrow_date'], 
                    $last_transaction_data['return_date'], 
                    $last_transaction_data['proof_image_url'], 
                    $last_transaction_data['transaction_id'], 
                    $last_transaction_data['user_id'],
                    $is_swap,         
                    $swap_new_item_id,
                    $item_condition,  
                    $keterangan       
                ]);

            } elseif ($import_type === 'accounts') {
                 // Logika Akun
                $nis = isset($data[0]) ? trim($data[0]) : null;
                $password_from_csv = $data[1] ?? null;
                $nama = isset($data[2]) ? sanitize_input(trim($data[2])) : null;
                $kelas_nama = isset($data[3]) ? trim($data[3]) : null;
                if (empty($nis) || empty($password_from_csv) || empty($nama)) throw new Exception("Data tidak lengkap (NIS/Password/Nama).");
                $stmt_check = $pdo->prepare("SELECT id FROM users WHERE nis = ?");
                $stmt_check->execute([$nis]);
                if ($stmt_check->fetch()) throw new Exception("NIS '{$nis}' sudah terdaftar.");
                $password_info = password_get_info($password_from_csv);
                if ($password_info['algo']) { $password_to_store = $password_from_csv; } else {
                    if (strlen($password_from_csv) < 8) throw new Exception("Password minimal 8 karakter.");
                    $password_to_store = password_hash($password_from_csv, PASSWORD_DEFAULT);
                }
                $class_id = null;
                if (!empty($kelas_nama)) {
                    $stmt_find_class = $pdo->prepare("SELECT id FROM classes WHERE name = ?");
                    $stmt_find_class->execute([$kelas_nama]);
                    $class_id = $stmt_find_class->fetchColumn();
                    if (!$class_id) {
                        $stmt_create_class = $pdo->prepare("INSERT INTO classes (name) VALUES (?)");
                        $stmt_create_class->execute([$kelas_nama]);
                        $class_id = $pdo->lastInsertId();
                    }
                }
                $stmt = $pdo->prepare("INSERT INTO users (username, password, role, nama, nis, kelas) VALUES (?, ?, 'user', ?, ?, ?)");
                $stmt->execute([$nis, $password_to_store, $nama, $nis, $class_id]);
            }

            $status_data['success']++;
            $status_data['log'][] = ['time' => date('H:i:s'), 'message' => $log_preview, 'status' => 'success'];
        } catch (Exception $e) {
            $error_message = $e->getMessage();
            if ($e instanceof PDOException && $e->getCode() == 23000) {
                $error_message = "Data duplikat (Kode/NIS sudah ada).";
            }
            $status_data['failed']++;
            $status_data['log'][] = ['time' => date('H:i:s'), 'message' => $log_preview . ' - Gagal: ' . $error_message, 'status' => 'error'];
        }
        $status_data['processed']++;
        $rows_processed_in_batch++;
    }
    
    $pdo->commit();

} catch (Exception $batch_error) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    $status_data['log'][] = ['time' => date('H:i:s'), 'message' => 'Gagal memproses batch: ' . $batch_error->getMessage(), 'status' => 'error'];
}

$status_data['current_offset'] = ftell($handle_csv);
fclose($handle_csv);

$status_data['last_transaction_data'] = $last_transaction_data;

if ($all_jobs_done) {
    $status_data['status'] = 'complete';
    $status_data['endTime'] = date('c');
    $status_data['log'][] = ['time' => date('H:i:s'), 'message' => 'Impor Selesai!', 'status' => 'info'];
    unset($status_data['last_transaction_data']);
    unset($status_data['current_offset']);
    if (file_exists($temp_csv_path)) @unlink($temp_csv_path);
}

write_and_unlock_status($fp_status, $status_data);

header('Content-Type: application/json');
echo json_encode($status_data);
exit();