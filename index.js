import { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import BlockResourcesPlugin from "puppeteer-extra-plugin-block-resources";
import open from "open";

puppeteer.use(StealthPlugin());
puppeteer.use(
  BlockResourcesPlugin({
    blockedTypes: new Set([]),
    // interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
  })
);

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("https://coldplayinjakarta.com", {
    waitUntil: "domcontentloaded",
  });
  let shouldSearch = true;
  let loop = 1;
  while (shouldSearch) {
    const start = performance.now();
    console.log(`====== Execution number ${loop} ======\n`);
    await page.waitForSelector(".elements");
    const end = performance.now();
    console.log(`Load Time: ${end - start} ms\n`);
    const anchor = await page.$x("//a[contains(@href, 'widget')]");

    if (anchor.length > 0) {
      const hrefProperty = await anchor[0].getProperty("href");
      const href = await hrefProperty.jsonValue();
      console.log(`FOUND: ${href}`);
      open(href);
      shouldSearch = false;
    } else {
      await delay(1000);
      await page.reload({ waitUntil: "domcontentloaded" });
    }

    loop = loop + 1;
  }
})();

const delay = (timeMs) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, timeMs);
  });
};
