/**
 * Checks every `width`/`height` prop against the real pixel size of the image
 * it points at. Next/Image uses those numbers to reserve space before the file
 * loads, so a stale pair is a layout shift on a page a visitor is deciding on.
 *
 *   node scripts/screenshots/check-dimensions.mjs
 *
 * Exits non-zero when anything is off, so it can gate a re-capture.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const REPO = path.resolve(import.meta.dirname, '..', '..');
const PUBLIC_DIR = path.join(REPO, 'public');
const ROOTS = ['features', 'components', 'app'].map((d) => path.join(REPO, d));

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(tsx?|ts)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const dims = {};
for (const file of fs.readdirSync(PUBLIC_DIR)) {
  if (!/\.(png|jpe?g|webp|avif)$/i.test(file)) continue;
  const meta = await sharp(path.join(PUBLIC_DIR, file)).metadata();
  dims['/' + file] = { w: meta.width, h: meta.height };
}

// src, then the nearest width/height pair after it. Covers both JSX props
// (`src='/x.png' width={1} height={2}`) and data objects (`src: '/x.png',
// width: 1, height: 2`).
const PATTERN =
  /src[:=]\s*['"](\/[^'"]+\.(?:png|jpe?g|webp|avif))['"][\s\S]{0,260}?width[:=]\s*\{?(\d+)\}?[\s\S]{0,120}?height[:=]\s*\{?(\d+)\}?/g;

const problems = [];
let checked = 0;

for (const root of ROOTS) {
  if (!fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    const source = fs.readFileSync(file, 'utf8');
    for (const [, img, w, h] of source.matchAll(PATTERN)) {
      checked++;
      const real = dims[img];
      const where = path.relative(REPO, file);
      if (!real) {
        problems.push(`${where}: ${img} does not exist in public/`);
      } else if (real.w !== Number(w) || real.h !== Number(h)) {
        problems.push(
          `${where}: ${img} declared ${w}×${h}, file is ${real.w}×${real.h}`,
        );
      }
    }
  }
}

console.log(`checked ${checked} image reference(s)`);
for (const p of problems) console.log(`  ✗ ${p}`);
if (problems.length) {
  console.log(`\n${problems.length} mismatch(es)`);
  process.exitCode = 1;
} else {
  console.log('all width/height props match their files');
}
