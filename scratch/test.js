const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.message));
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText);
  });
  
  await page.goto('https://zero-trust-host-production.up.railway.app/', {waitUntil: 'networkidle2'});
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
