// Checks a deployed build: each label link shows its scan banner, and the entry page loads.
// Usage: node scripts/check-live.mjs [base url]
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || 'https://kira-calc.github.io/next-span-app/';
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
for (const m of ['03', '07', '15', '21']) {
  await page.goto(`${BASE}#/batch/NS-0412?m=${m}`, { waitUntil: 'networkidle0' });
  const t = await page.evaluate(() => document.querySelector('.scan-banner')?.innerText || 'NO BANNER');
  console.log(m, '->', t);
}
await page.goto(BASE, { waitUntil: 'networkidle0' });
console.log('entry ->', await page.evaluate(() => document.querySelector('.entry-tagline')?.innerText));
console.log('logo loaded ->', await page.evaluate(() => document.querySelector('.entry-head img').naturalWidth > 0));
await browser.close();
