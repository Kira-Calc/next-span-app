import puppeteer from 'puppeteer-core';
const [,, base, outDir] = process.argv;
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
async function shot(hash, file, before) {
  await page.goto(base + '#' + hash, { waitUntil: 'networkidle0' });
  await page.reload({ waitUntil: 'networkidle0' });
  if (before) await before();
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: `${outDir}/${file}` });
  console.log('saved', file);
}
if (process.argv[4]) { const hs = process.argv[4].split(','); for (const h of hs) { await page.goto(base + '#' + h, { waitUntil: 'networkidle0' }); await page.reload({ waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 300)); await page.addStyleTag({ content: '.stage .screen, .screen { height: auto !important; } .screen-body { overflow: visible !important; }' }); const f = h.replace(/\W+/g, '_') + '_FULL.png'; await page.screenshot({ path: outDir + '/' + f, fullPage: true }); console.log('saved', f); } await browser.close(); process.exit(0); }
await shot('/', 'entry.png');
await shot('/estimate', 'app_01_estimate.png');
await shot('/estimate', 'app_01_estimate_r1.png', async () => {
  await page.click('button[aria-controls="r1-panel"]');
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
});
// Self-check: any non-zero border radius, and any em dash in the text
const audit = await page.evaluate(() => {
  const bad = [...document.querySelectorAll('*')].filter(e => parseFloat(getComputedStyle(e).borderTopLeftRadius) > 0).length;
  return { radiusViolations: bad, emDash: document.body.innerText.includes('—'), proto: document.body.innerText.includes('Prototype. All amounts and data are illustrative.') };
});
console.log(JSON.stringify(audit));
await browser.close();
