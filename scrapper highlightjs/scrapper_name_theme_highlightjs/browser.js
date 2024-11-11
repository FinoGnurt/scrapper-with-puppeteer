const puppeteer = require("puppeteer");

const startBrowser = async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      // Có hiện ui của Chromium hay không, false là có
      headless: true,

      // Chrome sử dụng multiple layers của sandbox để tránh những nội dung web không đáng tin cậy, nếu tin tưởng content dung thì set như vầy
      args: ["--disable-setuid-sandbox"],

      // Truy cập website bỏ qua lỗi liên quan http secure
      ignoreHTTPSErrors: true,
    });
  } catch (error) {
    console.log("Không tạo được browser: " + error);
  }

  return browser;

  //   return new Promise((resolve, reject) => {
  //     (async () => {
  //       try {
  //         const browser = await puppeteer.launch({
  //           headless: true,
  //           args: ["--no-sandbox", "--disable-setuid-sandbox"],
  //         });
  //         resolve(browser);
  //       } catch (error) {
  //         reject(error);
  //       }
  //     })();
  //   });
};

module.exports = startBrowser;
