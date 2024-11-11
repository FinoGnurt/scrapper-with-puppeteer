// Hàm để lấy tên file từ URL
function getFileNameFromURL(url) {
  // Tách phần cuối của URL (tên file)
  const fileName = url.split("/").pop();

  // Loại bỏ "-min" nếu có trong tên file
  const cleanFileName = fileName.replace("-min.css", ".css");

  return cleanFileName;
}

module.exports = { getFileNameFromURL };
