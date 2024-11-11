const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { getFileNameFromURL } = require("./funcConvertURL.js");

let linkValid = 0;
let linkNoValid = 0;

let arrOptionsValue = [];

async function fetchAndSaveTextFromLinks(links) {
  // Khởi tạo trình duyệt Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (let i = 0; i < links.length; i++) {
    try {
      // Mở trang web từ liên kết
      await page.goto(links[i]);

      // Lấy toàn bộ văn bản trên trang
      const pageText = await page.evaluate(() => {
        const queryText =
          document.querySelector("h1")?.innerText ||
          document.querySelector("pre")?.innerText;

        if (Object.is(queryText, "404 Not Found")) return null;

        return queryText;
        //   return document.body.innerHTML;
      });

      // Nếu không có nội dung hợp lệ, bỏ qua và tiếp tục
      if (!pageText) {
        console.log(`${i}. No content: ${getFileNameFromURL(links[i])}`);
        linkNoValid++;
        continue;
      }

      // Chuyển văn bản thành một kiểu CSS nào đó. Ví dụ như tạo một thuộc tính giả để lưu nội dung.
      const cssContent = `
      /* link: ${links[i]} */

      ${pageText}`;

      // Tạo tên file dựa trên URL
      const fileName = getFileNameFromURL(links[i]);

      // Đường dẫn đầy đủ đến tệp sẽ được lưu
      const filePath = path.join("css", fileName);

      //   const fileName = `output_${i + 1}.css`;
      fs.writeFileSync(filePath, cssContent);

      // Gắn tên file css vào value của option trong html
      // const optionValue = `"<option value="${getFileNameFromURL(
      //   links[i]
      // )}">Style 1</option>"`;

      arrOptionsValue.push(`"${getFileNameFromURL(links[i])}"`);

      linkValid++;

      console.log(`${i}. Saved content to ${fileName}`);
    } catch (err) {
      console.error(`${i}. Error while processing ${links[i]}:`, err);
    }
  }

  let fileOption = `const optionValue = [${arrOptionsValue}];
  export default optionValue;`;

  console.log(arrOptionsValue);
  // Xuất file optionValue
  const filePathOption = path.join("optionValue", "optionValue.js");
  fs.writeFileSync(filePathOption, fileOption);

  console.log("linkValid", linkValid);
  console.log("linkNoValid", linkNoValid);

  // Đóng trình duyệt
  await browser.close();
}

module.exports = { fetchAndSaveTextFromLinks };
