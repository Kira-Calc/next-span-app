// app_flow_overview.png from the report screenshots in <dir>.
// Flow: developer row 1 → 2 → 3 → 4, specifier row 5 → 6 → 7 → 8, demo link 4 → 6.
// Screen 7 is enlarged with a rebate-colour frame. No text besides the screens.
import puppeteer from 'puppeteer-core';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
const [,, base, dir] = process.argv;
// Inline the screenshots: a page built with setContent cannot read file:// images.
const abs = (f) => 'data:image/png;base64,' + readFileSync(resolve(dir, f)).toString('base64');
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();


const W = 234, H = 507;           // thumbnail, 0.6 of 390 × 844
const BW = 312, BH = 676;         // screen 7, 0.8
const GAP = 120, PAD = 100, ROWGAP = 300;
const top = [1, 2, 3, 4].map((n, i) => ({ n, x: PAD + i * (W + GAP), y: PAD, w: W, h: H }));
const y2 = PAD + H + ROWGAP;
const bottom = [];
let x = PAD;
for (const n of [5, 6, 7, 8]) {
  const big = n === 7;
  const w = big ? BW : W, h = big ? BH : H;
  bottom.push({ n, x, y: big ? y2 - (BH - H) / 2 : y2, w, h });
  x += w + GAP;
}
const all = [...top, ...bottom];
const width = Math.ceil(Math.max(...all.map((s) => s.x + s.w)) + PAD);
const height = Math.ceil(Math.max(...all.map((s) => s.y + s.h)) + PAD);
const src = {
  1: 'app_01_estimate.png', 2: 'app_02_checklist.png', 3: 'app_03_grade.png', 4: 'app_04_listing_locked.png',
  5: 'app_05_search.png', 6: 'app_06_batch.png', 7: 'app_07_accept_after.png', 8: 'app_08_certificates.png',
};
const by = Object.fromEntries(all.map((s) => [s.n, s]));
const S = 6; // stroke
const arrow = (pts) => {
  const d = 'M' + pts.map((p) => p.join(' ')).join(' L');
  return `<path d="${d}" fill="none" stroke="#111111" stroke-width="${S}" stroke-linejoin="miter" marker-end="url(#head)"/>`;
};
const paths = [];
for (const [a, b] of [[1, 2], [2, 3], [3, 4], [5, 6], [6, 7], [7, 8]]) {
  const A = by[a], B = by[b];
  const yA = A.y + A.h / 2, yB = B.y + B.h / 2;
  const pad = (n) => (n === 7 ? 14 : 2) + 26; // clear the frame plus the arrowhead
  if (Math.abs(yA - yB) < 1) paths.push(arrow([[A.x + A.w + pad(a) - 12, yA], [B.x - pad(b), yB]]));
  else {
    const mx = A.x + A.w + GAP / 2;
    paths.push(arrow([[A.x + A.w + 14, yA], [mx, yA], [mx, yB], [B.x - 22, yB]]));
  }
}
// Demo link: from the bottom of 4 down, left to above 6, then down into 6.
{
  const A = by[4], B = by[6];
  const midY = A.y + A.h + 70; // stays above the enlarged screen 7 and its frame
  paths.push(arrow([[A.x + A.w / 2, A.y + A.h + 14], [A.x + A.w / 2, midY], [B.x + B.w / 2, midY], [B.x + B.w / 2, B.y - 22]]));
}
const imgs = all.map((s) => {
  const frame = s.n === 7 ? `<rect x="${s.x - 14}" y="${s.y - 14}" width="${s.w + 28}" height="${s.h + 28}" fill="#B8651B"/>` : `<rect x="${s.x - 2}" y="${s.y - 2}" width="${s.w + 4}" height="${s.h + 4}" fill="#111111"/>`;
  return `${frame}<image href="${abs(src[s.n])}" x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" preserveAspectRatio="none"/>`;
}).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<defs><marker id="head" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#111111"/></marker></defs>
<rect width="100%" height="100%" fill="#FFFFFF"/>${paths.join('')}${imgs}</svg>`;
await page.setViewport({ width, height, deviceScaleFactor: 2 });
await page.setContent(`<body style="margin:0">${svg}</body>`, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 500));
await page.screenshot({ path: `${dir}/app_flow_overview.png` });
console.log('saved app_flow_overview.png', width, height);
await browser.close();
