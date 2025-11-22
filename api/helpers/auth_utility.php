<?php
/**
 * File Helper untuk semua fungsi terkait Autentikasi dan Otorisasi.
 */

if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    die('Akses langsung tidak diizinkan.');
}

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
 * Memvalidasi apakah peminjaman diizinkan berdasarkan jam buka dan kunci manual.
 * @param PDO $pdo Instance PDO yang di-pass dari api.php
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