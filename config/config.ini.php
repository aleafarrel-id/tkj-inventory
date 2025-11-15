<?php
// --- FILE KONFIGURASI DATABASE ---

// Mencegah file diakses secara langsung melalui URL browser,
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    die('Akses langsung tidak diizinkan.');
}

/** * Basic function to load environment variables from the .env file.
 * The .env file is assumed to be located in the application's root folder.
 * Note: If you are using a library such as ‘vlucas/phpdotenv’ or a framework, this function is NOT required.
 * 
 * @param string $path Path to the directory where the .env file is located (e.g. __DIR__ . ‘/../’ if the config is in the config folder).
*/
function env($key, $default = null) {
    $value = getenv($key);
    if($value === false) {
        $value = $_ENV[$key] ?? $_SERVER[$key] ?? $default;
    }
    if(is_string($value)) {
        $value = trim($value);
        if($value === 'true') return true;
        if($value === 'false') return false;
        if($value === 'null') return null;
        if($value === '') return $default;
    }
    return $value;
}

function loadEnv($path = __DIR__ . '/../') {
    $envFile = rtrim($path, '/') . '/.env';
    if (!file_exists($envFile)) {
        return;
    }
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || str_starts_with($line, '#')) {
            continue;
        }
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value, " \t\n\r\0\x0B\"'");
        if (!isset($_ENV[$name]) && !isset($_SERVER[$name])) {
            putenv(sprintf('%s=%s', $name, $value));
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
    }
}

// Pengaturan Waktu Aplikasi
define('APP_TIMEZONE', env('APP_TIMEZONE', 'Asia/Jakarta'));

// Kredensial Database
define('DB_HOST_CONFIG', env("DB_HOST_CONFIG", 'localhost'));     # > Host
define('DB_NAME_CONFIG', env("DB_NAME_CONFIG", 'tkj_inventory')); # > Database
define('DB_USER_CONFIG', env("DB_USER_CONFIG", 'root'));          # > Username
define('DB_PASS_CONFIG', env("DB_PASS_CONFIG", ''));              # > Password
define('DB_CHARSET_CONFIG', env("DB_CHARSET_CONFIG", 'utf8mb4'));

// Krendensial Backup Google Drive
define('GOOGLE_SCRIPT_URL', env('GOOGLE_SCRIPT_URL', ''));
define('GOOGLE_SCRIPT_SECRET', env('GOOGLE_SCRIPT_SECRET', ''));

// Kredensial reCAPTCHA v2
define('RECAPTCHA_SITE_KEY', env('RECAPTCHA_SITE_KEY', ''));
define('RECAPTCHA_SECRET_KEY', env('RECAPTCHA_SECRET_KEY', ''));

// Pengaturan Folder
// ID Folder utama di Google Drive untuk menyimpan backup riwayat & bukti.
define('GOOGLE_DRIVE_HISTORY_BACKUP_FOLDER_ID', env("GOOGLE_DRIVE_HISTORY_BACKUP_FOLDER_ID", ''));

// ID Folder utama di Google Drive untuk menyimpan ekspor data alat & gambar.
define('GOOGLE_DRIVE_STOCK_EXPORT_FOLDER_ID', env("GOOGLE_DRIVE_STOCK_EXPORT_FOLDER_ID", ''));

// ID Folder utama di Google Drive untuk menyimpan ekspor data akun pengguna.
define('GOOGLE_DRIVE_ACCOUNTS_EXPORT_FOLDER_ID', env("GOOGLE_DRIVE_ACCOUNTS_EXPORT_FOLDER_ID", ''));

// ID Folder utama di Google Drive untuk menyimpan file Auto-Backup .zip
define('GOOGLE_DRIVE_AUTOBACKUP_FOLDER_ID', env("GOOGLE_DRIVE_AUTOBACKUP_FOLDER_ID", ''));

// Pengaturan Jumlah Pekerjaan per Batch
// Mengatur jumlah baris CSV yang diproses per request saat impor.
define('JOB_BATCH_SIZE_IMPORT', 2);

// Mengatur jumlah file/item database yang diproses per request saat backup.
define('JOB_BATCH_SIZE_BACKUP', 2);

// Mengatur jumlah file/item database yang diproses per request saat ekspor.
define('JOB_BATCH_SIZE_EXPORT', 2);
