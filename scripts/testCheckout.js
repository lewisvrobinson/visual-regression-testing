// TODO
// - integrate with config file
// - implement fix for bounding box issue when available

const puppeteer = require('puppeteer');
const config = require('./config.json');

const product = {};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250 // slow down by 250ms
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto('https://www.stanley-pmi.com/shop', { timeout: 0 });

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

  await page.waitFor('.add-to-cart', {timeout: 60000});

  // get `.product` container
  // get product name
  // get product price

  // try to add product to cart
  const addToCartButton = await page.$('.add-to-cart');
  await addToCartButton.click({ delay: 100 });

  // wait for modal
  await page.waitFor('.modal--addtocart', {visible: true});

  // proceed to checkout page
  const goToCartButton = await page.$(
    'a.submit__action[href="/index.php?action=prodcataloguecart"]'
  );
  // goToCartButton.click();
  console.log(goToCartButton)

  // check product in cart matches product clicked

  // login
  // enter details
  // check price

  await browser.close();
})();

// function getProductDetails() {
// 	var detailContainer = prodWrap.querySelector('.product-info')
// 	var productName = detailContainer.querySelector('.product-url h3').innerHTML
// 	var productPrice = detailContainer.querySelector('.product-price .prod-current-price').innerHTML
// 	var productVariant = detailContainer.querySelector('.variant-select .active').dataset.option
	
// 	return {
// 		"name": productName,
// 		"price": productPrice,
// 		"varient": productVariant
// 	}
// }