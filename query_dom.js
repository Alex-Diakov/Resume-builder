import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  // Wait until the dev server is likely up and the page has rendered
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // Also click any buttons to ensure the sidebar is fully expanded if needed? 
  // It starts open by default.
  
  const selector = "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1)";
  
  const html = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return 'Element not found';
    return el.outerHTML;
  }, selector);
  
  console.log(html);
  
  await browser.close();
})();
