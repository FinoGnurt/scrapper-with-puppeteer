const scrapers = require("./scrapper");
const fs = require("fs");

const scrapeController = async (browserInstance) => {
  const url = process.env.URL_WEB;
  try {
    let browser = await browserInstance;
    // gọi hàm cạo ở file scrape
    let categories = await scrapers.scrapeCategory(browser, url);

    // Save dataCategory to a JSON file
    fs.writeFile(
      "dataCategory.json",
      JSON.stringify(categories, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing to file", err);
          return reject(err);
        }
        console.log("Data saved to dataCategory.json");
      }
    );
  } catch (error) {
    console.log("Lỗi ở scrape controller:" + error);
  }
};

module.exports = scrapeController;
