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

      // Keep clicking "Xem thêm" button until all products are loaded
      const loadMoreSelector =
        ".button.btn-show-more.button__show-more-product";

      // Check if the "Xem thêm" button exists
      let isLoadMoreVisible = (await page.$(loadMoreSelector)) !== null;

      while (isLoadMoreVisible) {
        await page.click(loadMoreSelector);
        console.log("Đã nhấn vào nút 'Xem thêm'...");

        // Wait for additional products to load
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Adjust timeout if needed

        // Check again if "Xem thêm" button is still present
        isLoadMoreVisible = (await page.$(loadMoreSelector)) !== null;
      }

      const dataCategory = await page.$$eval(
        process.env.EVAL_ARRAY_ITEM,
        (els) => {
          dataCategory = els.map((el) => {
            return {
              image: el.querySelector("img").getAttribute("src"),
              name: el.querySelector(".product__name > h3").innerText,
              inches: el.querySelectorAll(".product__more-info__item")[0]
                .innerText,
              gb: el.querySelectorAll(".product__more-info__item")[1].innerText,
              memory: el.querySelectorAll(".product__more-info__item")[2]
                .innerText,
              priceAfterDiscount: el.querySelector(
                ".block-box-price > .box-info__box-price > .product__price--show"
              ).innerText,
              originalPrice: el.querySelector(
                ".block-box-price > .box-info__box-price > div > .product__price--through"
              )?.innerText,
              discount: el.querySelector(
                ".block-box-price > .box-info__box-price > div > .product__price--percent > .product__price--percent-detail"
              )?.innerText,

              //   link: el.querySelector("a").href
              //   link: el.querySelector("a").getAttribute("href")
            };
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
