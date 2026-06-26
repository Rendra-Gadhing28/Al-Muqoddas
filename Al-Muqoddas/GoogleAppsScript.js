/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT WEBHOOK TEMPLATE FOR REBANA AL-MUQODDAS
 * ==============================================================================
 * File ini berisi skrip backend untuk Google Sheets. Skrip ini akan bertindak sebagai
 * API (Webhook) yang menerima data komentar atau pendaftaran dari landing page React
 * dan menulisnya secara otomatis ke spreadsheet Anda.
 * 
 * CARA DEPLOY:
 * 1. Buka Google Spreadsheet Anda.
 * 2. Buat dua Sheet baru dengan nama (case-sensitive):
 *    - "Komentar" -> Beri header di baris 1: | ID | Tanggal | Nama | Pesan |
 *    - "Pendaftaran" -> Beri header di baris 1: | ID | Tanggal | Nama | Kelas | Kontak | Catatan |
 * 3. Klik menu "Ekstensi" -> "Apps Script" (Extension -> Apps Script).
 * 4. Hapus semua kode default di editor, lalu salin (copy) seluruh kode di bawah ini.
 * 5. Klik ikon Simpan (Disk).
 * 6. Klik tombol "Terapkan" -> "Penerapan Baru" (Deploy -> New Deployment).
 * 7. Pilih tipe penerapan: "Aplikasi Web" (Web App).
 * 8. Konfigurasi Aplikasi Web:
 *    - Deskripsi: Webhook Al-Muqoddas API
 *    - Jalankan sebagai (Execute as): Saya (Your Google Account)
 *    - Siapa yang memiliki akses (Who has access): Siapa saja (Anyone)
 *    - PENTING: Pilih "Siapa saja" (Anyone) agar React App bisa mengirim data secara publik.
 * 9. Klik "Terapkan" (Deploy). Google akan meminta otorisasi akses spreadsheet, setujui saja.
 * 10. Salin URL Aplikasi Web yang diberikan (formatnya: https://script.google.com/macros/s/.../exec).
 * 11. Tempelkan URL tersebut ke React App Anda di variabel `GOOGLE_SHEET_WEBHOOK_URL`.
 */

function doGet(e) {
  var sheetName = e.parameter.sheet || "Komentar";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return createJsonResponse({ status: "error", message: "Sheet '" + sheetName + "' tidak ditemukan." });
  }
  
  var data = [];
  var rows = sheet.getDataRange().getValues();
  var headers = rows[0];
  
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var record = {};
    for (var j = 0; j < headers.length; j++) {
      record[headers[j].toString().toLowerCase()] = row[j];
    }
    data.push(record);
  }
  
  // Balas data dalam format JSON (Urutkan dari komentar terbaru jika sheet Komentar)
  if (sheetName === "Komentar") {
    data.reverse(); // Membalik agar komentar terbaru di atas
  }
  
  return createJsonResponse({ status: "success", data: data });
}

function doPost(e) {
  try {
    var jsonString = e.postData.contents;
    var payload = JSON.parse(jsonString);
    var action = payload.action; // "addComment" atau "register"
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var timestamp = new Date();
    
    if (action === "addComment") {
      var sheet = ss.getSheetByName("Komentar");
      if (!sheet) {
        return createJsonResponse({ status: "error", message: "Sheet 'Komentar' tidak ditemukan." });
      }
      
      var nextId = sheet.getLastRow(); // ID sederhana menggunakan nomor baris
      var nama = payload.nama || "Anonimous";
      var pesan = payload.pesan || "";
      
      if (!pesan.trim()) {
        return createJsonResponse({ status: "error", message: "Pesan komentar tidak boleh kosong." });
      }
      
      // Tambahkan ke spreadsheet: [ID, Tanggal, Nama, Pesan]
      sheet.appendRow([nextId, timestamp, nama, pesan]);
      
      // Ambil inisial nama untuk avatar di React
      var inisial = nama.trim().substring(0, 2).toUpperCase();
      
      return createJsonResponse({
        status: "success",
        message: "Komentar berhasil disimpan ke Google Sheets!",
        data: {
          id: nextId,
          name: nama,
          text: pesan,
          time: "Baru saja",
          ini: inisial
        }
      });
      
    } else if (action === "register") {
      var sheet = ss.getSheetByName("Pendaftaran");
      if (!sheet) {
        return createJsonResponse({ status: "error", message: "Sheet 'Pendaftaran' tidak ditemukan." });
      }
      
      var nextId = sheet.getLastRow();
      var nama = payload.Nama.trim() || "";
      var email = payload.Email.trim() || "";
      var kelas = payload.Kelas.trim() || "";
      var alasan = payload.Alasan_Bergabung.trim() || "";
      var catatan = payload.catatan.trim() || "-";
      
      if (!nama.trim()) {
        return createJsonResponse({ status: "error", message: "Nama pendaftar tidak boleh kosong." });
      }
      
      // Tambahkan ke spreadsheet: [ID, Tanggal, Nama, Kelas, Kontak, Catatan]
      sheet.appendRow([nextId, timestamp, nama, kelas, kontak, catatan]);
      
      return createJsonResponse({
        status: "success",
        message: "Pendaftaran berhasil disimpan ke Google Sheets!"
      });
      
    } else {
      return createJsonResponse({ status: "error", message: "Action tidak dikenal." });
    }
    
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

// Helper untuk membungkus respon dengan format JSON dan CORS header
function createJsonResponse(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Mengizinkan CORS secara manual untuk aplikasi web
  return output;
}
