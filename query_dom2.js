import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // Wait for IntroAnimation to finish (it disappears when showIntro becomes false)
  await page.waitForSelector('nav.shrink-0', { timeout: 10000 });
  
  const selector = "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1)";
  
  const html = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return 'Element not found';
    return el.outerHTML;
  }, selector);
  
  console.log(html);
  
  await browser.close();
})();
