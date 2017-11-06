const puppeteer = require('puppeteer');

async function getScreenShots() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // await page.emulate(devices['iPhone 6']);

  await page.goto('https://www.seek.com.au/');
  await page.screenshot({ path: 'AU.png', fullPage: true });

  await page.goto('https://www.seek.co.nz/');
  await page.screenshot({ path: 'NZ.png', fullPage: true });

  await browser.close();

  console.log(process.argv);
}

getScreenShots()
