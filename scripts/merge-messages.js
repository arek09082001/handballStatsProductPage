/**
 * Merge a translation fragment into every message bundle.
 *
 * Usage: node scripts/merge-messages.js <namespace> <fragmentDir> [<basename>]
 *
 * Reads `<fragmentDir>/<basename>.<locale>.json` for each app locale and writes
 * it under `<namespace>` in `messages/<locale>.json`. Refuses to write unless
 * every locale carries the identical key shape, because a bundle that is one
 * key short renders the key name to a reader instead of a sentence.
 */
const fs = require('fs');
const path = require('path');

const LOCALES = ['de', 'en', 'es', 'fr', 'pl'];
const [namespace, fragmentDir, basename = namespace] = process.argv.slice(2);

if (!namespace || !fragmentDir) {
  console.error('usage: node scripts/merge-messages.js <namespace> <fragmentDir> [<basename>]');
  process.exit(1);
}

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

const fragments = Object.fromEntries(
  LOCALES.map((locale) => [
    locale,
    JSON.parse(
      fs.readFileSync(path.join(fragmentDir, `${basename}.${locale}.json`), 'utf8'),
    ),
  ]),
);

const reference = shape(fragments.de).join('\n');
for (const locale of LOCALES) {
  const current = shape(fragments[locale]).join('\n');
  if (current !== reference) {
    const refLines = reference.split('\n');
    const curLines = current.split('\n');
    const missing = refLines.filter((line) => !curLines.includes(line));
    const extra = curLines.filter((line) => !refLines.includes(line));
    console.error(`shape mismatch in ${locale}`);
    if (missing.length) console.error('  missing:', missing.slice(0, 10));
    if (extra.length) console.error('  extra  :', extra.slice(0, 10));
    process.exit(1);
  }
}

for (const locale of LOCALES) {
  const file = path.join('messages', `${locale}.json`);
  const bundle = JSON.parse(fs.readFileSync(file, 'utf8'));
  bundle[namespace] = fragments[locale];
  fs.writeFileSync(file, `${JSON.stringify(bundle, null, 2)}\n`);
}

console.log(`merged "${namespace}" into ${LOCALES.length} bundles`);
