<?php
// --- FILE KONFIGURASI DATABASE ---

// Mencegah file diakses secara langsung melalui URL browser,
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    die('Akses langsung tidak diizinkan.');
}

// Pengaturan Waktu Aplikasi
define('APP_TIMEZONE', 'Asia/Jakarta');

// Kredensial Database
define('DB_HOST_CONFIG', 'localhost');
define('DB_NAME_CONFIG', 'database_name');
define('DB_USER_CONFIG', 'your_username');
define('DB_PASS_CONFIG', 'your_password');
define('DB_CHARSET_CONFIG', 'utf8mb4');

// Kredensial reCAPTCHA v2
define('RECAPTCHA_SITE_KEY', 'Kunci Situs Anda');
define('RECAPTCHA_SECRET_KEY', 'Kunci Rahasia Anda');

// Krendensial Backup Google Drive
define('GOOGLE_SCRIPT_URL', 'URL App Script Anda');
define('GOOGLE_SCRIPT_SECRET', 'Kunci Rahasia Anda');

// Pengaturan Folder
// ID Folder utama di Google Drive untuk menyimpan backup riwayat & bukti.
define('GOOGLE_DRIVE_HISTORY_BACKUP_FOLDER_ID', 'ID Folder Backup Anda');

// ID Folder utama di Google Drive untuk menyimpan ekspor data alat & gambar.
define('GOOGLE_DRIVE_STOCK_EXPORT_FOLDER_ID', 'ID Folder Ekspor Anda');

// ID Folder utama di Google Drive untuk menyimpan ekspor data akun pengguna.
define('GOOGLE_DRIVE_ACCOUNTS_EXPORT_FOLDER_ID', 'ID Folder Ekspor Akun Anda');

// ID Folder utama di Google Drive untuk menyimpan file Auto-Backup .zip
define('GOOGLE_DRIVE_AUTOBACKUP_FOLDER_ID', 'ID Folder Auto Backup Anda');

// Pengaturan Jumlah Pekerjaan per Batch
// Mengatur jumlah baris CSV yang diproses per request saat impor.
define('JOB_BATCH_SIZE_IMPORT', 2);

// Mengatur jumlah file/item database yang diproses per request saat backup.
define('JOB_BATCH_SIZE_BACKUP', 2);

// Mengatur jumlah file/item database yang diproses per request saat ekspor.
define('JOB_BATCH_SIZE_EXPORT', 2);