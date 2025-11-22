<?php
/**
 * File Helper untuk semua fungsi terkait manipulasi dan upload gambar.
 */

if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    die('Akses langsung tidak diizinkan.');
}

if (!defined('PROJECT_ROOT')) {
    define('PROJECT_ROOT', dirname(dirname(__DIR__)));
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

/**
 * Menangani upload file yang aman (memeriksa MIME, ukuran, dll)
 */
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

    $target_dir = PROJECT_ROOT . '/public/' . $target_subdirectory;

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