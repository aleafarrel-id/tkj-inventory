<?php
/**
 * Endpoint untuk menghasilkan token sekali pakai (nonce) untuk login via scan.
 * Ini mencegah bot melakukan brute-force pada endpoint login
 * dengan berpura-pura sebagai scanner.
 */

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

try {
    // Buat token acak yang aman secara kriptografis
    $token = bin2hex(random_bytes(32));
    
    // Simpan token di sesi pengguna
    $_SESSION['scan_token'] = $token;

    // Kirim token ke frontend
    json_response('success', 'Token generated', ['scan_token' => $token]);

} catch (Exception $e) {
    error_log('Failed to generate scan token: ' . $e->getMessage());
    json_response('error', 'Gagal memulai sesi scan.');
}