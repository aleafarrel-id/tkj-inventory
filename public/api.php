<?php
/**
 * Gerbang utama untuk semua permintaan API.
 * Bertanggung jawab untuk routing, keamanan (CSRF), dan memuat endpoint.
 */

require_once __DIR__ . '/../config/security_headers.php';

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

/* * System Dependency 
 * Memuat semua fungsi helper yang dibutuhkan.
 */
require_once __DIR__ . '/../api/helpers/image_utility.php';
require_once __DIR__ . '/../api/helpers/http_utility.php';
require_once __DIR__ . '/../api/helpers/auth_utility.php';
require_once __DIR__ . '/../api/helpers/api_config.php';


$action = $_REQUEST['action'] ?? '';

// Untuk permintaan non-ekspor, tipe konten adalah JSON.
if ($action !== 'export_history' && $action !== 'get_lock_stream') {
    header('Content-Type: application/json');
}
header('Cache-Control: no-cache, must-revalidate');


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
if (in_array($action, $admin_only_actions)) {
    require_admin();
}

// Panggil validasi
if (in_array($action, $user_write_actions)) {
    validate_borrowing_access($pdo);
}

// --- EKSEKUSI ENDPOINT ---
$api_dir = dirname(__DIR__) . '/api/';

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