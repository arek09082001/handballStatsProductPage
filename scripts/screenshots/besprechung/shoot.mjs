/**
 * Takes the briefing-mode shots from the harness (`harness.tsx`):
 *
 *   node scripts/screenshots/livestream/regie/build.mjs scripts/screenshots/besprechung/harness.tsx besprechung
 *   node scripts/screenshots/besprechung/shoot.mjs         # → .screenshots-livestream/besprechung/out
 *
 * The drawings are made the way a coach makes them: a tool from the rail
 * (keys 1–7, as in the app), a colour, and a real pointer drag over the
 * picture. Positions are given in pixels of the drawn hall (1920 × 1080,
 * `court.mjs`) and mapped onto wherever the picture lies on screen, zoomed or
 * not — so a layout change in the app moves the strokes with the picture.
 */
import { chromium } from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const CHROME = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const DIST = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../../.screenshots-livestream/besprechung');
const OUT = path.resolve(process.argv[2] || path.join(DIST, 'out'));
fs.mkdirSync(OUT, { recursive: true });

// A static server WITH byte ranges: the mode seeks to each clip's start, and
// Chromium will not seek a WebM it cannot fetch in parts.
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webm': 'video/webm' };
const server = http.createServer((req, res) => {
  const file = path.join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return res.writeHead(404).end();
  const size = fs.statSync(file).size;
  const type = TYPES[path.extname(file)] || 'application/octet-stream';
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
  if (range) {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Number(range[2]) : size - 1;
    res.writeHead(206, { 'content-type': type, 'accept-ranges': 'bytes', 'content-range': `bytes ${start}-${end}/${size}`, 'content-length': end - start + 1 });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { 'content-type': type, 'accept-ranges': 'bytes', 'content-length': size });
    fs.createReadStream(file).pipe(res);
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const BASE = `http://127.0.0.1:${server.address().port}/index.html`;

const browser = await chromium.launch({ executablePath: CHROME });

async function open(viewport, hash = 'present') {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
  page.on('pageerror', (e) => console.log('pageerror', e.message));
  await page.goto(`${BASE}#${hash}`);
  await page.waitForFunction(() => {
    const v = document.querySelector('video');
    return v && v.videoWidth > 0 && v.readyState >= 2;
  }, null, { timeout: 20000 });
  await page.waitForTimeout(1200);
  return page;
}

/** Hall pixels (1920 × 1080) → screen, through `object-contain` and any zoom. */
async function mapper(page) {
  const box = await page.evaluate(() => {
    const v = document.querySelector('video');
    const r = v.getBoundingClientRect();
    const scale = Math.min(r.width / v.videoWidth, r.height / v.videoHeight);
    const w = v.videoWidth * scale, h = v.videoHeight * scale;
    return { x: r.x + (r.width - w) / 2, y: r.y + (r.height - h) / 2, w, h };
  });
  return ([px, py]) => [box.x + (px / 1920) * box.w, box.y + (py / 1080) * box.h];
}

async function drag(page, from, to) {
  const at = await mapper(page);
  const [x0, y0] = at(from);
  const [x1, y1] = at(to);
  await page.mouse.move(x0, y0);
  await page.mouse.down();
  for (let i = 1; i <= 12; i++) await page.mouse.move(x0 + ((x1 - x0) * i) / 12, y0 + ((y1 - y0) * i) / 12);
  await page.mouse.up();
  await page.waitForTimeout(150);
}

const COLOURS = { red: 0, yellow: 1, white: 2, cyan: 3 };
async function tool(page, key, colour) {
  await page.keyboard.press(key);
  if (colour) await page.getByRole('button', { name: 'Farbe' }).nth(COLOURS[colour]).click();
  await page.waitForTimeout(100);
}

async function shot(page, name) {
  await page.mouse.move(1, 1);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  const size = page.viewportSize();
  console.log(name, size.width * 2, 'x', size.height * 2);
}

/** The play the room is talking about: #9 passes to #3, who runs into the gap between 17 and 4. */
async function drawPlay(page) {
  await tool(page, '6');                                   // Scheinwerfer
  await drag(page, [812, 540], [958, 690]);
  await tool(page, '2', 'yellow');                         // Pfeil: der Pass
  await drag(page, [848, 432], [872, 570]);
  await tool(page, '3', 'red');                            // Laufweg
  await drag(page, [920, 640], [1215, 668]);
}

// 1. Laptop, clip list beside the picture, the play drawn on the still.
{
  const page = await open({ width: 1440, height: 900 });
  await drawPlay(page);
  await shot(page, 'besprechung-zeichnen');
  await page.close();
}

// 2. Zoomed onto the middle of the 6:0 with the lupe, the gap marked as a zone.
{
  const page = await open({ width: 1440, height: 900 });
  await tool(page, '7');                                   // Lupe
  await drag(page, [760, 300], [1420, 760]);
  await page.waitForTimeout(500);
  await tool(page, '5', 'cyan');                           // Zone
  await drag(page, [1150, 600], [1300, 735]);
  await tool(page, '3', 'white');                          // Laufweg
  await drag(page, [905, 625], [1190, 668]);
  await shot(page, 'besprechung-lupe');
  await page.close();
}

// 3. After "Aufnahme beenden": name it, upload it to the game, or keep the file.
{
  const page = await open({ width: 1440, height: 900 }, 'saved');
  await shot(page, 'besprechung-aufnahme');
  await page.close();
}

// 4. „Vorlauf & Nachlauf“: the popover over the transport, 3 s before and
//    2 s after the moment of the action — cut around the popover and the
//    controls it belongs to, because at full frame it is a small card.
{
  const page = await open({ width: 1440, height: 900 });
  await drawPlay(page);
  await page.getByRole('button', { name: 'Vorlauf & Nachlauf' }).click();
  const popover = page.locator('[data-radix-popper-content-wrapper]');
  await popover.waitFor();
  const rows = popover.locator('div.space-y-1');
  await rows.nth(0).getByRole('button', { name: '3 s', exact: true }).click();
  await rows.nth(1).getByRole('button', { name: '2 s', exact: true }).click();
  await page.waitForTimeout(300);
  const box = await popover.boundingBox();
  const main = await page.locator('footer').first().boundingBox();
  const right = main.x + main.width;
  const clip = { x: right - 820, y: box.y - 24, width: 820, height: 900 - (box.y - 24) };
  await page.mouse.move(1, 1);
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, 'besprechung-vorlauf.png'), clip });
  console.log('besprechung-vorlauf', clip.width * 2, 'x', Math.round(clip.height * 2));
  await page.close();
}

const unknown = await (async () => {
  const page = await open({ width: 800, height: 600 }, 'saved');
  const list = await page.evaluate(() => window.__unknown || []);
  await page.close();
  return list;
})();
if (unknown.length) console.log('requests the stand-in does not know:', unknown);

await browser.close();
server.close();
