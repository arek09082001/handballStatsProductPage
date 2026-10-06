import { chromium } from 'playwright-core';
const CHROME = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
import fs from 'node:fs';
const OUT = process.argv[2] || new URL('../../../.screenshots-livestream/out', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const only = process.argv[3] || null;
const browser = await chromium.launch({ executablePath: CHROME, args: ['--autoplay-policy=no-user-gesture-required'] });
const VP = {
  desktop: { viewport: { width: 1440, height: 810 } },
  phone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  across: { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true },
};
async function open(vpName, state) {
  const context = await browser.newContext({ ...VP[vpName], deviceScaleFactor: 2, locale: 'de-DE' });
  await context.addInitScript(() => localStorage.setItem('statix-ticker-consent', 'granted'));
  const page = await context.newPage();
  await page.goto(`http://localhost:3001/${state}`);
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
  return { page, context };
}
async function liveAt(vpName, second, name, slug = 'live') {
  await fetch(`http://localhost:4000/__reset?start=${Math.max(4, Math.ceil((second + 4) / 2))}`);
  const { page, context } = await open(vpName, slug);
  await page.waitForFunction((t) => { const v = document.querySelector('video'); return v && v.readyState >= 2 && v.currentTime >= t; }, second, { timeout: 60_000, polling: 50 });
  await page.waitForTimeout(700);
  const t = await page.evaluate(() => document.querySelector('video').currentTime);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(name, 'frame', t.toFixed(2));
  await context.close();
}
const jobs = {
  'desktop-goal': () => liveAt('desktop', 8.4, 'desktop-goal'),
  'desktop-timeout': () => liveAt('desktop', 62.5, 'desktop-timeout'),
  'phone-goal': () => liveAt('phone', 8.4, 'phone-goal'),
  'across-goal': () => liveAt('across', 8.4, 'across-goal'),
  'phone-scheduled': async () => { const { page, context } = await open('phone', 'scheduled'); await page.waitForTimeout(3000); await page.screenshot({ path: `${OUT}/phone-scheduled.png` }); await context.close(); },
  'desktop-scheduled': async () => { const { page, context } = await open('desktop', 'scheduled'); await page.waitForTimeout(3000); await page.screenshot({ path: `${OUT}/desktop-scheduled.png` }); await context.close(); },
  'sponsor-stream': () => liveAt('desktop', 8.4, 'sponsor-stream', 'sponsorstream'),
  'sponsor-ticker-desktop': async () => { const { page, context } = await open('desktop', 'sponsorticker'); await page.waitForTimeout(4000); await page.screenshot({ path: `${OUT}/sponsor-ticker-desktop.png`, fullPage: true }); await context.close(); },
  'sponsor-ticker-phone': async () => { const { page, context } = await open('phone', 'sponsorticker'); await page.waitForTimeout(4000); await page.screenshot({ path: `${OUT}/sponsor-ticker-phone.png` }); await context.close(); },
  'phone-ended': async () => { const { page, context } = await open('phone', 'ended'); await page.waitForTimeout(3000); await page.screenshot({ path: `${OUT}/phone-ended.png` }); await context.close(); },
};
for (const [k, fn] of Object.entries(jobs)) { if (only && !k.includes(only)) continue; try { await fn(); console.log('ok', k); } catch (e) { console.log('FAIL', k, e.message); } }
await browser.close();
