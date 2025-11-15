<?php
/**
 * Gerbang utama untuk semua permintaan API.
 * Bertanggung jawab untuk routing, keamanan (CSRF), dan memuat endpoint.
 */

require_once __DIR__ . '/../config/security_headers.php';

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

$action = $_REQUEST['action'] ?? '';

// Untuk permintaan non-ekspor, tipe konten adalah JSON.
if ($action !== 'export_history' && $action !== 'get_lock_stream') {
    header('Content-Type: application/json');
}
header('Cache-Control: no-cache, must-revalidate');


/**
 * Memastikan pengguna sudah login dan sesi valid sebelum melanjutkan.
 */
function require_login() {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401); // Unauthorized
        global $action;
        if ($action === 'get_lock_stream') {
            echo "event: error\n";
            echo "data: " . json_encode(['message' => 'Sesi tidak valid atau telah kedaluwarsa.']) . "\n\n";
            header("Location: /login");
            flush();
            exit();
        }
        json_response('error', 'Akses ditolak. Anda harus login terlebih dahulu.');
    }
}

/**
 * Memastikan pengguna memiliki peran 'admin'.
 */
function require_admin() {
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        http_response_code(403); // Forbidden
        json_response('error', 'Akses ditolak. Anda tidak memiliki hak akses untuk aksi ini.');
    }
}

/**
 * Memvalidasi apakah peminjaman diizinkan.
 */
function validate_borrowing_access($pdo) {
    // Admin selalu diizinkan.
    if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin') {
        return;
    }

    try {
        $stmt = $pdo->query("SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('is_manually_locked', 'borrow_start_time', 'borrow_end_time')");
        $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

        // Cek kunci manual dari admin.
        if (!empty($settings['is_manually_locked']) && (bool)$settings['is_manually_locked']) {
            json_response('error', 'Aplikasi sedang ditutup oleh admin. Coba lagi nanti.');
        }

        // Cek jadwal peminjaman.
        $start_time_str = $settings['borrow_start_time'] ?? '06:30';
        $end_time_str = $settings['borrow_end_time'] ?? '17:00';

        $now = new DateTime('now');
        $start_time = DateTime::createFromFormat('H:i', $start_time_str);
        $end_time = DateTime::createFromFormat('H:i', $end_time_str);

        if ($now < $start_time || $now > $end_time) {
            json_response('error', "Peminjaman hanya dapat dilakukan antara jam $start_time_str - $end_time_str WIB.");
        }

    } catch (Exception $e) {
        error_log('Borrowing Access Validation Error: ' . $e->getMessage());
        json_response('error', 'Gagal memvalidasi status aplikasi.');
    }
}


function get_base_url() {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
    $host = $_SERVER['HTTP_HOST'];
    // Ambil path direktori dari skrip saat ini dan hapus nama file 'api.php'
    $path = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
    // Hapus '/public' jika ada, untuk mendapatkan root aplikasi
    $path = str_replace('/public', '', $path);
    return $protocol . $host . $path;
}

function json_response($status, $message, $data = null) {
    $response = ['status' => $status, 'message' => $message];
    if ($data !== null) {
        $response['data'] = $data;
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    exit();
}

function sanitize_input($input) {
    return trim($input);
}


/**
 * Mengompres dan mengubah ukuran gambar.
 */
function compress_and_resize_image($source_path, $target_path, $max_dimension = 1280, $quality = 75) {
    list($width, $height, $type) = getimagesize($source_path);

    if ($width <= $max_dimension && $height <= $max_dimension) {
        $max_dimension = max($width, $height);
    }

    if ($width > $height) {
        $new_width = $max_dimension;
        $new_height = floor($height * ($max_dimension / $width));
    } else {
        $new_height = $max_dimension;
        $new_width = floor($width * ($max_dimension / $height));
    }

    $thumb = imagecreatetruecolor($new_width, $new_height);
    
    switch ($type) {
        case IMAGETYPE_JPEG:
            $source = imagecreatefromjpeg($source_path);
            break;
        case IMAGETYPE_PNG:
            $source = imagecreatefrompng($source_path);
            imagealphablending($thumb, false);
            imagesavealpha($thumb, true);
            break;
        case IMAGETYPE_WEBP:
            $source = imagecreatefromwebp($source_path);
            break;
        case IMAGETYPE_GIF:
            $source = imagecreatefromgif($source_path);
            break;
        default:
            return copy($source_path, $target_path);
    }
    
    imagecopyresampled($thumb, $source, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
    
    $success = false;
    switch ($type) {
        case IMAGETYPE_JPEG:
            $success = imagejpeg($thumb, $target_path, $quality);
            break;
        case IMAGETYPE_PNG:
            $png_quality = floor(($quality / 100) * 9);
            $success = imagepng($thumb, $target_path, $png_quality);
            break;
        case IMAGETYPE_WEBP:
            $success = imagewebp($thumb, $target_path, $quality);
            break;
        case IMAGETYPE_GIF:
            $success = imagegif($thumb, $target_path);
            break;
    }

    imagedestroy($source);
    imagedestroy($thumb);
    return $success;
}

function handle_secure_upload($file_input, $target_subdirectory) {
    if (!$file_input || $file_input['error'] !== UPLOAD_ERR_OK) {
        return ['status' => 'error', 'message' => 'Tidak ada file yang diunggah atau terjadi error.'];
    }
    $max_file_size = 20 * 1024 * 1024;
    if ($file_input['size'] > $max_file_size) {
        return ['status' => 'error', 'message' => 'Ukuran file tidak boleh lebih dari 20MB.'];
    }
    $allowed_types = [
        'image/jpeg' => 'jpg', 'image/png'  => 'png',
        'image/webp' => 'webp', 'image/gif'  => 'gif'
    ];
    $file_info = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($file_info, $file_input['tmp_name']);
    finfo_close($file_info);
    if (!isset($allowed_types[$mime_type])) {
        return ['status' => 'error', 'message' => 'Tipe file tidak valid. Hanya JPG, PNG, WEBP dan GIF yang diizinkan.'];
    }
    $extension = $allowed_types[$mime_type];
    $safe_filename = uniqid('file_', true) . '.' . $extension;
    $target_dir = dirname(__DIR__) . '/public/' . $target_subdirectory;
    $target_file = $target_dir . $safe_filename;
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0775, true);
    }
    
    if (move_uploaded_file($file_input['tmp_name'], $target_file)) {
        compress_and_resize_image($target_file, $target_file, 1280, 75);
        return ['status' => 'success', 'url' => $target_subdirectory . $safe_filename];
    } else {
        return ['status' => 'error', 'message' => 'Gagal memindahkan file yang diunggah.'];
    }
}


// --- ROUTING & KEAMANAN ---

if (empty($action)) {
    json_response('error', 'Parameter action tidak ditemukan.');
}

if ($action === 'get_csrf_token') {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    json_response('success', 'Token retrieved', ['token' => $_SESSION['csrf_token']]);
}

if ($action === 'get_scan_token') {
    require __DIR__ . '/../api/system/get_scan_token.php';
    exit();
}

if ($action === 'get_backup_status') {
    require __DIR__ . '/../api/backup/get_backup_status.php';
    exit();
}

if ($action === 'get_export_status') {
    require __DIR__ . '/../api/export/get_export_status.php';
    exit();
}

if ($action === 'get_import_status') {
    require __DIR__ . '/../api/import/get_import_status.php';
    exit();
}


// Semua endpoint lain memerlukan login
require_login();

if ($action === 'get_lock_stream') {
    session_write_close();
}

// --- PROTEKSI CSRF ---

$csrf_protected_post = [
    'add_item', 'edit_item', 'delete_item', 'borrow_item', 'add_to_borrowal',
    'return_item', 'flush_history', 'update_credentials', 'delete_history_item',
    'update_settings', 'edit_borrowal', 'delete_borrowal', 
    'start_import_csv', 'clear_import_status',
    'clear_backup_status', 'backup_to_drive', 'start_export', 'clear_export_status',
    'add_account', 'edit_account', 'delete_account', 'delete_multiple_accounts',
    'add_class', 'edit_class', 'delete_class',
    'save_autobackup_config'
];

if (in_array($action, $csrf_protected_post)) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_response('error', 'Metode request tidak valid.');
    }
    $token = $_POST['csrf_token'] ?? '';
    if (empty($token) || !isset($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
        http_response_code(403);
        json_response('error', 'Sesi tidak valid atau telah kedaluwarsa. Silakan muat ulang halaman.');
    }
}


require_once __DIR__ . '/../config/connect.php';
if (!isset($pdo)) {
    json_response('error', 'Koneksi database tidak tersedia.');
}

// --- OTORISASI BERBASIS PERAN DAN JADWAL ---

$admin_only_actions = [
    'add_item', 
    'edit_item', 
    'delete_item', 
    'flush_history',
    'delete_history_item',
    'update_settings',
    'edit_borrowal',
    'delete_borrowal',
    'get_statistics',
    'get_disk_usage',
    'start_import_csv',
    'process_import_job',
    'clear_import_status',
    'backup_to_drive',
    'process_backup_job',
    'clear_backup_status',
    'delete_multiple_items',
    'start_export',
    'process_export_job',
    'clear_export_status',
    'get_accounts',
    'add_account',
    'edit_account',
    'delete_account',
    'delete_multiple_accounts',
    'add_class',
    'edit_class',
    'delete_class',
    'search_user',
    'get_autobackup_config',
    'save_autobackup_config',
    'get_autobackup_status',
    'clear_autobackup_status'
];
if (in_array($action, $admin_only_actions)) {
    require_admin();
}

// Panggil validasi "kunci"
$user_write_actions = ['borrow_item', 'return_item', 'add_to_borrowal'];
if (in_array($action, $user_write_actions)) {
    validate_borrowing_access($pdo);
}

// --- EKSEKUSI ENDPOINT ---

$api_dir = dirname(__DIR__) . '/api/';
$action_map = [
    // System
    'get_data'                   => 'system/get_data.php',
    'get_captcha'                => 'system/get_captcha.php',
    'get_settings'               => 'system/get_settings.php',
    'get_statistics'             => 'system/get_statistics.php',
    'get_disk_usage'             => 'system/get_disk_usage.php',
    'search_user'                => 'system/search_user.php',
    'update_credentials'         => 'system/update_credentials.php',
    'update_settings'            => 'system/update_settings.php',

    // Item (Stok)
    'add_item'                   => 'item/add_item.php',
    'edit_item'                  => 'item/edit_item.php',
    'delete_item'                => 'item/delete_item.php',
    'delete_multiple_items'      => 'item/delete_multiple_items.php',

    // Borrow (Peminjaman)
    'borrow_item'                => 'borrow/borrow_item.php',
    'add_to_borrowal'            => 'borrow/add_to_borrowal.php',
    'return_item'                => 'borrow/return_item.php',
    'edit_borrowal'              => 'borrow/edit_borrowal.php',
    'delete_borrowal'            => 'borrow/delete_borrowal.php',
    
    // History (Riwayat)
    'flush_history'              => 'history/flush_history.php',
    'delete_history_item'        => 'history/delete_history_item.php',
    
    // Account
    'get_accounts'               => 'account/get_accounts.php',
    'add_account'                => 'account/add_account.php',
    'edit_account'               => 'account/edit_account.php',
    'delete_account'             => 'account/delete_account.php',
    'delete_multiple_accounts'   => 'account/delete_multiple_accounts.php',
    
    // Class
    'add_class'                  => 'class/add_class.php',
    'edit_class'                 => 'class/edit_class.php',
    'delete_class'               => 'class/delete_class.php',
    
    // Backup
    'backup_to_drive'            => 'backup/backup_to_drive.php',
    'process_backup_job'         => 'backup/process_backup_job.php',
    'clear_backup_status'        => 'backup/clear_backup_status.php',

    // Export
    'start_export'               => 'export/start_export.php',
    'process_export_job'         => 'export/process_export_job.php',
    'clear_export_status'        => 'export/clear_export_status.php',
    'export_history'             => 'export/export_history.php',

    // Import
    'start_import_csv'           => 'import/start_import_csv.php',
    'process_import_job'         => 'import/process_import_csv_job.php',
    'clear_import_status'        => 'import/clear_import_status.php',

    // Helpers (Hanya untuk SSE)
    'get_lock_stream'            => 'helpers/sse_lock_stream.php',

    // Auto-Backup
    'get_autobackup_config'      => 'autobackup/get_config.php',
    'save_autobackup_config'     => 'autobackup/save_config.php',
    'get_autobackup_status'      => 'autobackup/get_status.php',
    'clear_autobackup_status'    => 'autobackup/clear_status.php',
];

if (!isset($action_map[$action])) {
    json_response('error', 'Action tidak valid: ' . htmlspecialchars($action));
}
$file = $api_dir . $action_map[$action];
if (!file_exists($file)) {
    json_response('error', 'Endpoint API tidak ditemukan.');
}
try {
    require $file;
} catch (Exception $e) {
    error_log('API Error for action ' . $action . ': ' . $e->getMessage());
    if ($action !== 'get_lock_stream') {
        json_response('error', 'Terjadi kesalahan sistem.');
    }
}