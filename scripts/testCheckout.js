// TODO
// - integrate with config file
// - implement fix for bounding box issue when available

const puppeteer = require('puppeteer');
const config = require('./config.json');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250 // slow down by 250ms
  });

  const page = await browser.newPage();
  await page.setViewport({width: 1600, height: 900});
  await page.goto('https://www.stanley-pmi.com/shop',{ timeout: 0 });

  // https://github.com/GoogleChrome/puppeteer/issues/1082
  const elementHandle = await page.$('body');
  elementHandle.constructor.prototype.boundingBox = async function() {
    const box = await this.executionContext().evaluate(element => {
      const rect = element.getBoundingClientRect();
      const x = Math.max(rect.left, 0);
      const width = Math.min(rect.right, window.innerWidth) - x;
      const y = Math.max(rect.top, 0);
      const height = Math.min(rect.bottom, window.innerHeight) - y;
      return { x: x, width: width, y: y, height: height };
    }, this);
    return box;
  };

  await page.waitFor('.add-to-cart')

  // get `.product` container
  // get product name
  // get product price

  // try to add product to cart
  const addToCartButton = await page.$('.add-to-cart')
  await addToCartButton.click({delay: 100})

  // wait for modal
  await page.waitFor('.modal--addtocart')

  // proceed to checkout page
  const goToCartButton = await page.$('a.submit__action[href="/index.php?action=prodcataloguecart"]')
  goToCartButton.click()

  // check product in cart matches product clicked

  // login
  // enter details
  // check price

  await browser.close();
})();