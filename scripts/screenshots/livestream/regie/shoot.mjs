import { chromium } from 'playwright-core';
const CHROME = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const DIST = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../../../.screenshots-livestream/regie');
const OUT = path.resolve(process.argv[2] || path.join(DIST, 'out')); fs.mkdirSync(OUT, { recursive: true });
const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };
const server = http.createServer((req, res) => { const f = path.join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '') || 'index.html'); if (fs.existsSync(f) && fs.statSync(f).isFile()) { res.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res); } else { res.writeHead(404).end(); } });
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const local = `http://127.0.0.1:${server.address().port}`;
const origin = 'https://app.statix-app.de';
const browser = await chromium.launch({ executablePath: CHROME });
const width = Number(process.env.W || 1280), height = Number(process.env.H || 800);
async function shot(hash, name, act) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  page.on('pageerror', (e) => console.log('pageerror', e.message, (e.stack || '').split('\n').slice(0, 4).join(' | ')));
  page.on('console', (m) => { if (m.type() === 'error') console.log('console', m.text().slice(0, 200)); });
  await page.route('https://app.statix-app.de/**', async (route) => { const u = new URL(route.request().url()); const r = await fetch(local + u.pathname); route.fulfill({ status: r.status, headers: { 'content-type': r.headers.get('content-type') || 'text/plain' }, body: Buffer.from(await r.arrayBuffer()) }); });
  await page.goto(`${origin}/index.html#${hash}`);
  await page.waitForTimeout(2500);
  if (act) await act(page);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: !process.env.CROP });
  console.log(name, await page.evaluate(() => window.__unknown));
  await page.close();
}
const which = process.argv[3];
if (!which || which === 'start') await shot('setup', 'regie-start');
if (!which || which === 'setup') await shot('setup', 'regie-setup', async (p) => {
  const btns = await p.$$eval('button', (b) => b.map((x) => x.innerText.trim()).filter(Boolean)); console.log(btns.join(' | '));
  if (process.env.CLICKS) for (const label of process.env.CLICKS.split('|')) { await p.getByRole('button', { name: label }).first().click(); await p.waitForTimeout(1500); }
  await p.waitForTimeout(2500);
});
if (!which || which === 'live') await shot('live', 'regie-live');
await browser.close(); server.close();
