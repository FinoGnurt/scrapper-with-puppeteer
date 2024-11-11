const puppeteer = require("puppeteer");
const fs = require("fs");
const { fetchAndSaveTextFromLinks } = require("./scrapperGoToArrLink");

async function scrapeHighlightJS() {
  // Mở trình duyệt và tạo trang mới
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Truy cập trang web
  await page.goto("https://cdnjs.com/libraries/highlight.js");

  // Đảm bảo trang đã sẵn sàng
  await page.waitForSelector("#__layout");

  // Đảm bảo trang đã sẵn sàng
  await page.focus("#vs2__combobox > .vs__selected-options > .vs__search");

  // Bấm phím mũi tên xuống (arrow down)
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  // const fullTitle = await page.$$eval(
  //   `#__nuxt > #__layout > #__app > main > section > .content > span > .assets > li.asset:not([style="display: none"])`,
  //   (els) => els.map((el) => el.querySelector("span").innerText)
  // );

  /**
   * Trong đoạn mã của bạn, vấn đề là bộ chọn :not([style="display: none"]) chỉ lọc các thẻ có thuộc tính style="display: none". Tuy nhiên, nếu thẻ <li> có thuộc tính display: none nhưng với cách khai báo khác (chẳng hạn như thông qua CSS bên ngoài hoặc qua JavaScript động), bộ chọn này sẽ không hoạt động.
   *
   * Thay vì chỉ lọc theo thuộc tính style, bạn có thể kiểm tra trực tiếp thuộc tính CSS display của từng phần tử bằng cách sử dụng window.getComputedStyle trong page.evaluate
   */

  // Lấy tất cả các URL không có display: none
  const arrLink = await page.$$eval(
    `#__nuxt > #__layout > #__app > main > section > .content > span > .assets > li.asset`,
    (els) => {
      const visibleUrls = [];
      els.forEach((el) => {
        // Kiểm tra thuộc tính display của phần tử
        const style = window.getComputedStyle(el);
        if (style.display !== "none") {
          const url = el.querySelector("span")?.innerText;
          if (url) {
            visibleUrls.push(url);
          }
        }
      });
      return visibleUrls;
    }
  );

  console.log("Count: ", arrLink.length);
  fetchAndSaveTextFromLinks(arrLink);

  // Đóng trình duyệt
  await browser.close();
}

// Chạy hàm scrapeHighlightJS
scrapeHighlightJS().catch(console.error);
