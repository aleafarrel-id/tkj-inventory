/**
 * KONFIGURASI
 * Harap isi variabel di bawah ini sebelum melakukan deployment.
 */
const SECRET_KEY = "Kunci Rahasia Anda"; // Kunci rahasia

/**
 * Fungsi utama yang akan dijalankan saat ada request POST ke URL Web App.
 * Fungsi ini bertugas menerima file, membuat folder harian, dan menyimpannya ke Google Drive.
 * @param {object} e - Objek event yang berisi parameter request.
 * @returns {ContentService.TextOutput} - Respons JSON yang berisi status dan URL file.
 */
function doPost(e) {
  // 1. Validasi Keamanan & Parameter
  if (e.parameter.secret !== SECRET_KEY) {
    return createJsonResponse({
      status: 'error',
      message: 'Akses ditolak: Kunci rahasia tidak valid.'
    });
  }

  const { file, filename, mimetype, folderId, subfolder } = e.parameter;

  if (!file || !filename || !mimetype || !folderId) {
    return createJsonResponse({
      status: 'error',
      message: 'Request tidak lengkap. Parameter file, filename, mimetype, dan folderId wajib ada.'
    });
  }

  try {
    // 2. Dekode dan Buat Blob File
    const decodedFile = Utilities.base64Decode(file, Utilities.Charset.UTF_8);
    const blob = Utilities.newBlob(decodedFile, mimetype, filename);

    // 3. Tentukan Folder Tujuan Utama
    const targetFolder = DriveApp.getFolderById(folderId);
    
    // 4. Buat Subfolder Harian (jika belum ada)
    const now = new Date();
    const formattedDate = Utilities.formatDate(now, "GMT+7", "dd-MM-yyyy");
    const dailyFolderName = "Backup " + formattedDate;
    
    let dailyFolder;
    const dailyFolders = targetFolder.getFoldersByName(dailyFolderName);
    if (dailyFolders.hasNext()) {
      dailyFolder = dailyFolders.next();
    } else {
      dailyFolder = targetFolder.createFolder(dailyFolderName);
    }
    
    // 5. Tentukan Folder Penyimpanan Akhir (di dalam folder harian)
    let destinationFolder = dailyFolder;
    if (subfolder) {
        // Jika ada parameter subfolder (misal: "bukti" atau "gambar_stok"), 
        // buat atau gunakan subfolder tersebut di dalam folder harian.
        const subfolders = dailyFolder.getFoldersByName(subfolder);
        if(subfolders.hasNext()){
            destinationFolder = subfolders.next();
        } else {
            destinationFolder = dailyFolder.createFolder(subfolder);
        }
    }
    // Jika tidak ada parameter 'subfolder', file akan disimpan langsung di folder harian (untuk file CSV).

    // 6. Simpan File dan Atur Izin
    const newFile = destinationFolder.createFile(blob);
    newFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    // 7. Kirim Respons Sukses
    return createJsonResponse({
      status: 'success',
      url: newFile.getUrl()
    });

  } catch (error) {
    // Tangani Error
    console.error("Gagal mengunggah file: " + error.toString());
    return createJsonResponse({
      status: 'error',
      message: 'Terjadi kesalahan internal saat menyimpan file ke Drive: ' + error.toString()
    });
  }
}

/**
 * Fungsi helper untuk membuat respons dalam format JSON.
 * @param {object} data - Objek JavaScript yang akan diubah menjadi JSON.
 * @returns {ContentService.TextOutput} - Objek respons JSON.
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}