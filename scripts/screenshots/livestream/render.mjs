import { chromium } from 'playwright-core';
const CHROME = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
import fs from 'node:fs';
const browser = await chromium.launch({ executablePath: CHROME });
for (const [svg, png] of process.argv.slice(2).map((a) => a.split(':'))) {
  const page = await browser.newPage({ viewport: { width: Number(process.env.W||1280), height: Number(process.env.H||720) } });
  await page.setContent(`<style>body{margin:0}</style>${fs.readFileSync(svg, 'utf8')}`);
  await page.screenshot({ path: png });
  await page.close();
}
await browser.close();
