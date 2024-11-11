// require("dotenv").config({ path: "local.env" });

const scrapeCategory = (browser, url) => {
  return new Promise(async (resolve, reject) => {
    try {
      let page = await browser.newPage();
      console.log(">> Mở tab mới...");

      await page.goto(url);
      console.log("Truy cập vào " + url);

      await page.waitForSelector(process.env.WAIT_FOR_SELECTOR);
      console.log(">> Website đã load xong...");

      await page.$$eval(process.env.EVAL_ARRAY_ITEM, (el) => console.log(el));

      const dataCategory = await page.$$eval(
        process.env.EVAL_ARRAY_ITEM,
        // (divs) => divs.length
        (els) => {
          dataCategory = els.map((el) => {
            return el.innerText;
          });
          return dataCategory;
        }
      );

      console.log("Count: ", dataCategory.length);

      await page.close();
      console.log(">> Tab đã đóng!");

      resolve(dataCategory);
    } catch (error) {
      console.log("Lỗi ở scrape category: " + error);
      reject(error);
    }
  });
};

module.exports = { scrapeCategory };
