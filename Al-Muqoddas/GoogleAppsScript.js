/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT WEBHOOK FULL CODE FOR REBANA AL-MUQODDAS
 * ==============================================================================
 */

// Helper Function: Mengubah URL Google Drive ke Link Direct Thumbnail (Public)
function formatDriveUrl(url) {
  if (!url) return "";
  const urlString = String(url);
  const match = urlString.match(/[-\w]{25,}/);
  if (match) {
    const fileId = match[0];
    // Format CDN Google Drive Direct Image yang mendukung CORS & Embed
    return "https://lh3.googleusercontent.com/d/" + fileId + "=s1000";
  }
  return urlString;
}

// Helper Function: Response JSON Standard
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const action = e && e.parameter ? e.parameter.action : null;

    // -------------------------------------------------------------
    // 1. GET KOMENTAR GLOBAL (4 TERBARU)
    // -------------------------------------------------------------
    if (action === "getComments") {
      const sheetKomentar = ss.getSheetByName("komentar");
      if (!sheetKomentar) {
        return createJsonResponse({ status: "success", data: [] });
      }

      const data = sheetKomentar.getDataRange().getValues();
      const comments = [];

      for (let i = data.length - 1; i >= 1; i--) {
        if (!data[i][3]) continue; // Skip jika pesan kosong
        comments.push({
          timestamp: data[i][0],
          id: data[i][1] || "ANONIM",
          name: data[i][2] || "Anonim",
          pesan: data[i][3],
          tanggal: data[i][4] || ""
        });
        if (comments.length === 4) break;
      }

      return createJsonResponse({ status: "success", data: comments });
    }

    // -------------------------------------------------------------
    // 2. GET DATA PENDAFTAR / ANGGOTA (Sheet Pertama)
    // -------------------------------------------------------------
    const sheetPendaftaran = ss.getSheets()[0];
    const data = sheetPendaftaran.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createJsonResponse({ status: "success", data: [] });
    }

    const headers = data[0];

    const rows = data.slice(1)
      .filter(row => row[2]) // Filter baris yang Nama-nya tidak kosong
      .map((row, i) => {
        const obj = {};
        headers.forEach((h, idx) => { obj[h] = row[idx]; });

        const rawPhoto = obj["foto-ukuran-3x4"] || obj["Foto"] || obj["foto"] || "";

        return {
          id: i + 1,
          name: obj["Nama"] || "",
          kelas: obj["Kelas"] || "",
          reason: obj["Alasan Bergabung"] || "",
          quote: obj["kasih kata-katanya guys"] || "",
          photo: formatDriveUrl(rawPhoto) // <--- PANGGUL HELPER URL DI SINI
        };
      });

    return createJsonResponse({ status: "success", data: rows });

  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

// -------------------------------------------------------------
// 3. POST KOMENTAR
// -------------------------------------------------------------
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ status: "error", message: "No post data received" });
    }

    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (payload.action === "addComment") {
      let sheetKomentar = ss.getSheetByName("komentar");
      if (!sheetKomentar) {
        sheetKomentar = ss.insertSheet("komentar");
        sheetKomentar.appendRow(["timestamp", "id", "name", "pesan", "tanggal"]);
      }

      const now = new Date();
      const timestamp = now.getTime();
      const tanggalFormatted = now.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      const nama = payload.name || payload.nama || "Anonim";
      const pesan = payload.pesan || "";

      if (!pesan.trim()) {
        return createJsonResponse({ status: "error", message: "Pesan tidak boleh kosong" });
      }

      sheetKomentar.appendRow([
        timestamp,
        payload.id || "ANONIM",
        nama,
        pesan,
        tanggalFormatted
      ]);

      return createJsonResponse({ status: "success", message: "Komentar berhasil disimpan!" });
    }

    return createJsonResponse({ status: "error", message: "Action tidak dikenal" });

  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}
