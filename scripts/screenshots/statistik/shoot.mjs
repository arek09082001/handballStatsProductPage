/**
 * Takes the statistics shots from the harness (`harness.tsx`):
 *
 *   node scripts/screenshots/livestream/regie/build.mjs scripts/screenshots/statistik/harness.tsx statistik
 *   node scripts/screenshots/statistik/shoot.mjs            # → .screenshots-livestream/statistik/out
 *
 * Every shot is cut along a card of the real page (found by its heading), so
 * a layout change in the app moves the crop with it.
 */
import { chromium } from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const CHROME = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const DIST = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../../.screenshots-livestream/statistik');
const OUT = path.resolve(process.argv[2] || path.join(DIST, 'out'));
fs.mkdirSync(OUT, { recursive: true });

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const file = path.join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  } else res.writeHead(404).end();
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1328, height: 1000 }, deviceScaleFactor: 2 });
page.on('pageerror', (e) => console.log('pageerror', e.message));
await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
await page.waitForTimeout(3500);
// A finished game opens with the "player of the match" card; close it.
await page.getByRole('button', { name: 'Schließen' }).first().click({ timeout: 3000 }).catch(() => {});
await page.waitForTimeout(600);

/** The box around everything between two headings' cards, padded by 12 px. */
async function boxOf(first, last = first) {
  const card = (text) =>
    page.getByText(text, { exact: true }).first().locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
  const a = await card(first).boundingBox();
  const b = await card(last).boundingBox();
  const pad = 12;
  // `boundingBox` is relative to the viewport; the full-page clip wants page
  // coordinates, and clicking a tab scrolls.
  const scrollY = await page.evaluate(() => window.scrollY);
  return {
    x: Math.min(a.x, b.x) - pad,
    y: a.y + scrollY - pad,
    width: Math.max(a.x + a.width, b.x + b.width) - Math.min(a.x, b.x) + 2 * pad,
    height: b.y + b.height - a.y + 2 * pad,
  };
}

async function shot(name, clip) {
  await page.screenshot({ path: path.join(OUT, `${name}.png`), clip, fullPage: true });
  console.log(name, Math.round(clip.width * 2), 'x', Math.round(clip.height * 2));
}

await shot('xg-bilanz', await boxOf('xG-Bilanz', 'Paraden-Bilanz'));

// The overview tiles (rings, xG, xS) above the two balances — the hero of the
// xG page. The tiles' card has no heading, so it is found from its "xS" tile:
// the first ancestor as wide as the page column.
const overviewTop = await page.evaluate(() => {
  const label = [...document.querySelectorAll('*')].find(
    (el) => el.childElementCount === 0 && el.textContent?.trim() === 'xS',
  );
  let node = label;
  while (node && node.getBoundingClientRect().width < 1000) node = node.parentElement;
  return node.getBoundingClientRect().top + window.scrollY;
});
{
  const balances = await boxOf('xG-Bilanz', 'Paraden-Bilanz');
  await shot('xg-uebersicht', { ...balances, y: overviewTop - 12, height: balances.y + balances.height - overviewTop + 12 });
}
await shot('xg-tabelle', await boxOf('Feldspieler'));
await shot('xs-torhueter', await boxOf('Torhüter'));

for (const [tab, name] of [['Aufstellungen', 'aufstellungen'], ['Rückraum', 'rueckraum'], ['Zusammenspiel', 'zusammenspiel']]) {
  await page.getByRole('tab', { name: tab, exact: true }).first().click();
  await page.waitForTimeout(500);
  await shot(`lineup-${name}`, await boxOf('Aufstellungen & Zusammenspiel'));
}

await browser.close();
server.close();
