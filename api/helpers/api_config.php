<?php
/**
 * File Konfigurasi Terpusat untuk API Router.
 * Mendefinisikan rute, proteksi CSRF, dan hak akses admin.
 */

if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    die('Akses langsung tidak diizinkan.');
}

// --- PROTEKSI CSRF ---
// Daftar 'action' yang memerlukan validasi token CSRF (hanya untuk request POST)
$csrf_protected_post = [
    'add_item', 'edit_item', 'delete_item', 'borrow_item', 'add_to_borrowal',
    'return_item', 'flush_history', 'update_credentials', 'delete_history_item',
    'update_settings', 'edit_borrowal', 'delete_borrowal', 
    'start_import_csv', 'clear_import_status',
    'clear_backup_status', 'backup_to_drive', 'start_export', 'clear_export_status',
    'add_account', 'edit_account', 'delete_account', 'delete_multiple_accounts',
    'add_class', 'edit_class', 'delete_class',
    'save_autobackup_config', 'swap_item'
];

// --- OTORISASI BERBASIS PERAN ---
// Daftar 'action' yang hanya bisa diakses oleh 'admin'
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

// Daftar 'action' oleh 'user' yang perlu divalidasi jam peminjaman
$user_write_actions = ['borrow_item', 'return_item', 'add_to_borrowal', 'swap_item'];


// --- EKSEKUSI ENDPOINT (ACTION MAP) ---
// Peta utama yang menghubungkan 'action' dengan file endpoint yang sesuai
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
    'swap_item'                  => 'borrow/swap_item.php',
    
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