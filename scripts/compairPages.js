const puppeteer = require('puppeteer');
const config = require('./config.json');
const looksSame = require('looks-same');
const fs = require('fs');

const date = new Date();
const timestamp = date.getTime();
const testDir = getDirectory();

function getDirectory() {
  if (config.settings.testDirectory && config.settings.testDirectory !== null) {
    return config.settings.testDirectory;
  } else {
    fs.mkdirSync(`./tests/${timestamp}`);
    return `./tests/${timestamp}`;
  }
}

async function getScreenshots() {
  const browser = await puppeteer.launch();
  console.log('Launching Browser');

  const page = await browser.newPage();
  console.log('Opening new page');
  // await page.emulate(device['iPhone 6']);

  await page.goto(config.reference.url, { timeout: 0 });
  console.log(`Navigating to ${config.reference.url}`);

  await page.screenshot({
    path: `${testDir}/${config.reference.filename}.png`,
    fullPage: true
  });
  console.log('📸  Taking reference screenshot');

  await page.goto(config.test.url, { timeout: 0 });
  console.log(`Navigating to ${config.test.url}`);
  await page.screenshot({
    path: `${testDir}/${config.test.filename}.png`,
    fullPage: true
  });
  console.log('📸  Taking test screenshot');

  await browser.close();
  console.log('Closing browser');
}

getScreenshots()
  .then(() => {
    console.log(`Saving diff image to ${testDir}`);
    looksSame(
      `${testDir}/${config.reference.filename}.png`,
      `${testDir}/${config.test.filename}.png`,
      function(error, equal) {
        if (equal === false) {
          looksSame.createDiff(
            {
              reference: `${testDir}/${config.reference.filename}.png`,
              current: `${testDir}/${config.test.filename}.png`,
              diff: `${testDir}/diff.png`,
              highlightColor: config.settings.highlightColor, //color to highlight the differences
              strict: config.settings.strict, //strict comparsion
              tolerance: config.settings.tolerance
            },
            function(error) {}
          );
        }
      }
    );
    console.log(
      `Test Completed! 🎉  Screenshots have been saved to ${testDir}`
    );
  })
  .catch(err => {
    console.log(err);
  });
