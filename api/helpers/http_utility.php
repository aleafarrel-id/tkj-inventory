<?php
/**
 * File Helper untuk fungsi utilitas HTTP, JSON, dan sanitasi input.
 */

if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    die('Akses langsung tidak diizinkan.');
}

/**
 * Mendapatkan URL dasar (base URL) dari aplikasi.
 * @return string
 */
function get_base_url() {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
    $host = $_SERVER['HTTP_HOST'];
    $path = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
    $path = str_replace('/public', '', $path);
    return $protocol . $host . $path;
}

/**
 * Mengirim respons JSON terstandar dan menghentikan eksekusi.
 * @param string $status ('success' atau 'error')
 * @param string $message Pesan yang akan dikirim.
 * @param mixed|null $data Data opsional untuk dikirim.
 */
function json_response($status, $message, $data = null) {
    $response = ['status' => $status, 'message' => $message];
    if ($data !== null) {
        $response['data'] = $data;
    }
    if (!headers_sent()) {
        header('Content-Type: application/json');
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
    exit();
}

/**
 * Membersihkan input string dasar.
 * @param string $input
 * @return string
 */
function sanitize_input($input) {
    return trim($input);
}