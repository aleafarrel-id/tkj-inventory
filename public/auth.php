<?php
// Mencegah caching pada sisi klien untuk memastikan sesi selalu baru
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

require_once __DIR__ . '/../config/security_headers.php';

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (!file_exists(__DIR__ . '/../config/connect.php')) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Kesalahan konfigurasi server.']);
    exit();
}
require_once __DIR__ . '/../config/connect.php';

header('Content-Type: application/json');

function json_response($status, $message, $data = null) {
    echo json_encode(['status' => $status, 'message' => $message, 'data' => $data]);
    exit();
}

function set_user_session($user_id, $nama, $role, $username, $kelas) {
    session_regenerate_id(true);
    $_SESSION['user_id'] = $user_id;
    $_SESSION['username'] = htmlspecialchars_decode($nama, ENT_QUOTES);
    $_SESSION['role'] = $role;
    $_SESSION['login_username'] = $username;
    $_SESSION['kelas'] = $kelas;
}

$action = $_REQUEST['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($action === 'login') {
        $username = trim($_POST['username'] ?? '');
        $password = trim($_POST['password'] ?? '');

        if (empty($username) || empty($password)) {
            json_response('error', 'Username dan password harus diisi.');
        }

        // Cek apakah kunci reCAPTCHA ada
        $recaptcha_secret = defined('RECAPTCHA_SECRET_KEY') ? RECAPTCHA_SECRET_KEY : '';
        $recaptcha_site_key_defined = defined('RECAPTCHA_SITE_KEY') && RECAPTCHA_SITE_KEY;

        if (!empty($recaptcha_secret) && $recaptcha_site_key_defined) {
            
            if (isset($_POST['g-recaptcha-response'])) {
                
                $recaptcha_response = $_POST['g-recaptcha-response'];

                // Validasi tambahan jika token dikirim tapi kosong
                if (empty($recaptcha_response)) {
                    json_response('error', 'Verifikasi reCAPTCHA tidak valid. Coba lagi.');
                }

                $verification_url = 'https://www.google.com/recaptcha/api/siteverify';
                $post_data = http_build_query([
                    'secret' => $recaptcha_secret,
                    'response' => $recaptcha_response,
                    'remoteip' => $_SERVER['REMOTE_ADDR']
                ]);

                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $verification_url);
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                $response = curl_exec($ch);
                curl_close($ch);

                $result = json_decode($response, true);

                if (!$result || !isset($result['success']) || $result['success'] !== true) {
                    // Kirim pesan error spesifik jika terdeteksi bot
                    $error_codes = $result['error-codes'] ?? [];
                    if (in_array('timeout-or-duplicate', $error_codes)) {
                        json_response('error', 'Verifikasi reCAPTCHA kedaluwarsa. Muat ulang halaman.');
                    } else {
                        json_response('error', 'Verifikasi reCAPTCHA gagal. Silakan coba lagi.');
                    }
                }
            }
        }

        try {
            // Ambil pengguna berdasarkan username dan join dengan tabel kelas untuk mendapatkan nama kelas.
            $stmt = $pdo->prepare("
                SELECT u.*, c.name AS kelas_name 
                FROM users u 
                LEFT JOIN classes c ON u.kelas = c.id 
                WHERE u.username = ?
            ");
            $stmt->execute([$username]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Verifikasi password, kemudian atur sesi dengan role dan kelas dari database.
            if ($user && password_verify($password, $user['password'])) {
                set_user_session($user['id'], $user['nama'], $user['role'], $user['username'], $user['kelas_name']);
                json_response('success', 'Login berhasil.');
            } else {
                json_response('error', 'Username atau password salah.');
            }
        } catch (PDOException $e) {
            error_log('Login PDO Error: ' . $e->getMessage());
            json_response('error', 'Terjadi kesalahan pada database.');
        }
    }
}

if ($action === 'logout') {
    session_unset();
    session_destroy();
    json_response('success', 'Logout berhasil.');
}

if ($action === 'get_session') {
    if (isset($_SESSION['user_id']) && isset($_SESSION['role'])) {
        json_response('success', 'Sesi aktif.', [
            'user_id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'],
            'role' => $_SESSION['role'],
            'login_username' => $_SESSION['login_username'],
            'kelas' => $_SESSION['kelas'] ?? null
        ]);
    } else {
        http_response_code(401);
        json_response('error', 'Tidak ada sesi aktif.');
    }
}