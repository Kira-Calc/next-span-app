// Round 3 deliverable screenshots: 390 × 844 @2x, including state variants.
import puppeteer from 'puppeteer-core';
const [,, base, outDir] = process.argv;
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const clickText = async (text) => {
  await page.evaluate((t) => [...document.querySelectorAll('button')].find((b) => b.textContent.trim().startsWith(t)).click(), text);
  await wait(500);
};
const scrollTo = async (sel) => { await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), sel); await wait(200); };
async function shot(hash, file, before) {
  await page.goto(base + '#' + hash, { waitUntil: 'networkidle0' });
  await page.reload({ waitUntil: 'networkidle0' });
  if (before) await before();
  await wait(500);
  await page.screenshot({ path: `${outDir}/${file}` });
  console.log('saved', file);
}
await shot('/search', 'app_05_search.png');
await shot('/search', 'app_05_search_shortlisted.png', async () => { await clickText('+ Shortlist'); await scrollTo('.result-card'); });
await shot('/batch/NS-0412', 'app_06_batch.png');
await shot('/batch/NS-0412?m=07', 'app_06_batch_scan07.png');
await shot('/accept', 'app_07_accept_before.png');
await shot('/accept', 'app_07_accept_after.png', async () => { await clickText('Accept batch'); });
await shot('/accept', 'app_07_accept_rejection.png', async () => { await clickText('Report a grade mismatch'); });
await shot('/certificates', 'app_08_certificates.png');
await shot('/certificates', 'app_08_certificates_carbon.png', async () => { await clickText('Carbon certificate'); await wait(600); });
const audit = await page.evaluate(() => ({
  radius: [...document.querySelectorAll('*')].filter((e) => parseFloat(getComputedStyle(e).borderTopLeftRadius) > 0).length,
  emDash: document.body.innerText.includes('—'),
}));
console.log(JSON.stringify(audit));
await browser.close();
