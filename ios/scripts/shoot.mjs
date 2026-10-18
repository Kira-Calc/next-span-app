// Screenshots from the dedicated "Next Span · iPhone 17e" simulator (390 × 844 pt).
// Each shot relaunches the app with NS_* environment variables; nothing is persisted,
// so a normal launch afterwards starts clean. Usage: node scripts/shoot.mjs [outDir] [only]
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';

const UDID = readFileSync(new URL('../.sim-udid', import.meta.url), 'utf8').trim();
const BUNDLE = 'app.nextspan.prototype';
const out = process.argv[2] || 'screenshots';
const only = process.argv[3];
mkdirSync(out, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const sim = (...a) => execFileSync('xcrun', ['simctl', ...a], { stdio: 'pipe' });

const SHOTS = [
  ['ios_00_welcome', {}],
  ['ios_01_estimate', { NS_SCREEN: 'estimate' }],
  ['ios_01_estimate_r1', { NS_SCREEN: 'estimate', NS_STATE: 'r1' }],
  ['ios_02_checklist', { NS_SCREEN: 'checklist' }],
  ['ios_02_checklist_lodged', { NS_SCREEN: 'checklist', NS_STATE: 'lodged' }],
  ['ios_03_grade', { NS_SCREEN: 'grade' }],
  ['ios_03_grade_downgrade', { NS_SCREEN: 'grade', NS_STATE: 'downgrade' }],
  ['ios_04_listing', { NS_SCREEN: 'listing' }],
  ['ios_04_listing_locked', { NS_SCREEN: 'listing', NS_STATE: 'locked' }],
  ['ios_05_search', { NS_SCREEN: 'search' }],
  ['ios_05_search_shortlisted', { NS_SCREEN: 'search', NS_STATE: 'shortlisted' }],
  ['ios_06_batch', { NS_SCREEN: 'batch' }],
  ['ios_06_batch_scan07', { NS_SCREEN: 'batch', NS_MEMBER: '07' }],
  ['ios_07_accept', { NS_SCREEN: 'accept' }],
  ['ios_07_accept_after', { NS_SCREEN: 'accept', NS_STATE: 'accepted' }],
  ['ios_08_certificates', { NS_SCREEN: 'certificates' }],
];

for (const [name, env] of SHOTS) {
  if (only && !name.includes(only)) continue;
  try { sim('terminate', UDID, BUNDLE); } catch {}
  execFileSync('xcrun', ['simctl', 'launch', UDID, BUNDLE], {
    stdio: 'pipe',
    env: { ...process.env, ...Object.fromEntries(Object.entries(env).map(([k, v]) => [`SIMCTL_CHILD_${k}`, v])) },
  });
  await wait(2800);
  const file = `${out}/${name}.png`;
  sim('io', UDID, 'screenshot', '--type=png', file);
  // Native @3x → 390 × 844 @2x, the size the report uses.
  execFileSync('sips', ['-z', '1688', '780', file], { stdio: 'pipe' });
  console.log('saved', file);
}
// Leave the app running from a clean, argument-free launch.
try { sim('terminate', UDID, BUNDLE); } catch {}
sim('launch', UDID, BUNDLE);
