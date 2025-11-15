<?php
/**
 * File Keamanan Terpusat
 *
 * Menetapkan header keamanan HTTP
 */

header('X-Content-Type-Options: nosniff');

header('Referrer-Policy: strict-origin-when-cross-origin');

header('Permissions-Policy: camera=(self)');

header_remove('X-Powered-By');
?>