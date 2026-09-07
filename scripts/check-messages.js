/**
 * Verify every message bundle carries the identical key shape.
 *
 * Usage: node scripts/check-messages.js
 *
 * `merge-messages.js` guards one namespace at a time, which is the right check
 * while a namespace is being written. This one walks the finished bundles, so a
 * key added to `messages/de.json` by hand cannot leave the other four short —
 * a bundle missing a key renders the key name to a reader instead of a
 * sentence, and nothing else in the build notices.
 */
const fs = require('fs');
const path = require('path');

const LOCALES = ['de', 'en', 'es', 'fr', 'pl'];

/** Leaf paths of a JSON value, arrays indexed, so two shapes can be compared. */
function shape(value, prefix = '', out = []) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => shape(entry, `${prefix}[${index}]`, out));
  } else if (value && typeof value === 'object') {
    for (const key of Object.keys(value).sort()) {
      shape(value[key], prefix ? `${prefix}.${key}` : key, out);
    }
  } else {
    out.push(`${prefix}:${typeof value}`);
  }
  return out;
}

const bundles = Object.fromEntries(
  LOCALES.map((locale) => [
    locale,
    JSON.parse(fs.readFileSync(path.join('messages', `${locale}.json`), 'utf8')),
  ]),
);

const reference = shape(bundles.de);
let failed = false;

for (const locale of LOCALES) {
  if (locale === 'de') continue;

  const current = shape(bundles[locale]);
  const missing = reference.filter((line) => !current.includes(line));
  const extra = current.filter((line) => !reference.includes(line));

  if (missing.length || extra.length) {
    failed = true;
    console.error(`shape mismatch in ${locale}`);
    if (missing.length) console.error('  missing:', missing.slice(0, 20));
    if (extra.length) console.error('  extra  :', extra.slice(0, 20));
  }
}

if (failed) process.exit(1);

console.log(
  `all ${LOCALES.length} bundles agree on ${reference.length} message keys`,
);
