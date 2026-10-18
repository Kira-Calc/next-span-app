// Web screenshots matching the iOS shot list: 390 × 844 @2x, including state variants.
// Usage: node scripts/shoot-web.mjs [base url] [outDir]
import puppeteer from 'puppeteer-core';
const base = process.argv[2] || 'http://localhost:5181/';
const outDir = process.argv[3] || 'screenshots/web';
import { mkdirSync } from 'node:fs';
mkdirSync(outDir, { recursive: true });
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const click = async (sel) => { await page.click(sel); await wait(450); };
const clickText = async (text) => {
  await page.evaluate((t) => [...document.querySelectorAll('button')].find((b) => b.textContent.trim().includes(t)).click(), text);
  await wait(450);
};
const scrollTo = async (sel, block = 'center') => {
  await page.evaluate((s, b) => document.querySelector(s).scrollIntoView({ block: b }), sel, block);
  await wait(250);
};
async function shot(hash, file, before) {
  await page.goto(base + '#' + hash, { waitUntil: 'networkidle0' });
  await page.reload({ waitUntil: 'networkidle0' });
  if (before) await before();
  await wait(500);
  await page.screenshot({ path: `${outDir}/${file}.png` });
  console.log('saved', file);
}
await shot('/', 'web_00_welcome');
await shot('/estimate', 'web_01_estimate');
await shot('/estimate', 'web_01_estimate_r1', async () => { await click('button[aria-controls="r1-panel"]'); await scrollTo('#r1-panel', 'end'); });
await shot('/checklist', 'web_02_checklist');
await shot('/checklist', 'web_02_checklist_lodged', async () => { await clickText('Attach to demolition'); await scrollTo('.lodged'); });
await shot('/grade', 'web_03_grade');
await shot('/grade', 'web_03_grade_downgrade', async () => { await click('button[aria-label="Decay: fails"]'); await scrollTo('.downgrade'); });
await shot('/grade', 'web_03_grade_label', async () => { await click('button[aria-label="Print label"]'); });
await shot('/listing', 'web_04_listing');
await shot('/listing', 'web_04_listing_locked', async () => { await clickText('List batch'); await scrollTo('.rebate-meter', 'start'); });
await shot('/search', 'web_05_search');
await shot('/search', 'web_05_search_shortlisted', async () => { await clickText('Shortlist'); await scrollTo('.result-card'); });
await shot('/batch/NS-0412', 'web_06_batch');
await shot('/batch/NS-0412?m=07', 'web_06_batch_scan07');
await shot('/accept', 'web_07_accept');
await shot('/accept', 'web_07_accept_after', async () => { await clickText('Accept batch'); });
await shot('/accept', 'web_07_accept_rejection', async () => { await clickText('Report a grade mismatch'); });
await shot('/certificates', 'web_08_certificates');
await shot('/certificates', 'web_08_certificates_carbon', async () => { await clickText('Carbon'); await wait(500); });
const audit = await page.evaluate(() => ({
  emDash: document.body.innerText.includes('—'),
  smallTaps: [...document.querySelectorAll('button, a')].filter((e) => { const r = e.getBoundingClientRect(); return r.height && r.height < 36; }).map((e) => e.getAttribute('aria-label') || e.textContent.trim()).slice(0, 10),
}));
console.log(JSON.stringify(audit));
await browser.close();
