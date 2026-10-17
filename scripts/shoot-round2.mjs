// Round 2 deliverable screenshots: 390 × 844 @2x, including state variants.
import puppeteer from 'puppeteer-core';
const [,, base, outDir] = process.argv;
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const clickText = async (text) => {
  await page.evaluate((t) => [...document.querySelectorAll('button')].find((b) => b.textContent.trim().startsWith(t)).click(), text);
  await wait(400);
};
const scrollTo = async (sel) => { await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), sel); await wait(200); };
async function shot(hash, file, before) {
  await page.goto(base + '#' + hash, { waitUntil: 'networkidle0' });
  await page.reload({ waitUntil: 'networkidle0' });
  if (before) await before();
  await wait(400);
  await page.screenshot({ path: `${outDir}/${file}` });
  console.log('saved', file);
}
await shot('/checklist', 'app_02_checklist.png');
await shot('/checklist', 'app_02_checklist_lodged.png', async () => { await clickText('Attach to demolition'); await scrollTo('.lodged'); });
await shot('/checklist', 'app_02_checklist_zoom.png', async () => { await page.click('.doc-thumb'); });
await shot('/grade', 'app_03_grade.png');
await shot('/grade', 'app_03_grade_downgrade.png', async () => {
  await page.click('button[aria-label="Decay: fails"]'); await wait(300); await scrollTo('.downgrade');
});
await shot('/grade', 'app_03_grade_label.png', async () => { await clickText('Print label'); });
await shot('/listing', 'app_04_listing_calculated.png', async () => { await scrollTo('.rebate-meter'); });
await shot('/listing', 'app_04_listing_locked.png', async () => { await clickText('List batch'); await scrollTo('.rebate-meter'); });
const audit = await page.evaluate(() => ({
  radius: [...document.querySelectorAll('*')].filter((e) => parseFloat(getComputedStyle(e).borderTopLeftRadius) > 0).length,
  emDash: document.body.innerText.includes('—'),
  smallTaps: [...document.querySelectorAll('button, a')].filter((e) => { const r = e.getBoundingClientRect(); return r.height && r.height < 56; }).map((e) => e.textContent.trim() || e.getAttribute('aria-label')),
}));
console.log(JSON.stringify(audit));
await browser.close();
