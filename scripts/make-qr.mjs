// Four label QR codes. Each opens the batch page with the member highlighted.
import QRCode from 'qrcode';
import { writeFileSync, mkdirSync } from 'node:fs';

const APP_BATCH_URL = 'https://kira-calc.github.io/next-span-app/#/batch/NS-0412';
const MEMBERS = { A: '03', B: '07', C: '15', D: '21' };

mkdirSync('qr', { recursive: true });
for (const [grade, m] of Object.entries(MEMBERS)) {
  const url = `${APP_BATCH_URL}?m=${m}`;
  const svg = await QRCode.toString(url, { type: 'svg', errorCorrectionLevel: 'M', margin: 2, color: { dark: '#111111', light: '#FFFFFF' } });
  const file = `qr/qr-NS-0412-${grade}-${m}.svg`;
  writeFileSync(file, svg);
  console.log(file, url);
}
