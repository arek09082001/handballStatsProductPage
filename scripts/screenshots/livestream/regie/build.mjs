import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
// The app repo next to this one — its components, messages and node_modules.
const APP = path.resolve(process.env.STATIX_APP_DIR || path.join(path.dirname(new URL(import.meta.url).pathname), '../../../../../handballStats'));
const req = createRequire(APP + '/package.json');
const { build } = req('esbuild');
const postcss = req('postcss');
const tailwind = req('@tailwindcss/postcss');
const HERE = path.dirname(new URL(import.meta.url).pathname);
const WORK = path.resolve(HERE, '../../../../.screenshots-livestream');
const OUT = path.join(WORK, 'regie'); mkdirSync(OUT, { recursive: true });
const css = await postcss([tailwind({ base: APP })]).process(readFileSync(path.join(APP, 'app/globals.css'), 'utf8'), { from: path.join(APP, 'app/globals.css') });
writeFileSync(path.join(OUT, 'shots.css'), css.css);
await build({
  entryPoints: [path.join(HERE, 'harness.tsx')], bundle: true, outfile: path.join(OUT, 'shots.js'), format: 'iife', jsx: 'automatic',
  loader: { '.json': 'json', '.svg': 'dataurl', '.png': 'dataurl' }, define: { 'process.env.NODE_ENV': '"production"' },
  banner: { js: "globalThis.process = globalThis.process || { env: { NODE_ENV: 'production' } };" },
  nodePaths: [path.join(APP, 'node_modules')], tsconfig: path.join(APP, 'tsconfig.json'),
  alias: {
    '@': APP,
    'next/navigation': path.join(APP, 'scripts/shots/stubs/next-navigation.ts'),
    // The harness sits in this repo, the components in the app: one copy of
    // each context-carrying package, the app's, or a provider and its hooks
    // end up in two different modules.
    ...Object.fromEntries(
      ['react', 'react-dom', 'next-intl', '@tanstack/react-query', 'axios'].map((pkg) => [pkg, path.join(APP, 'node_modules', pkg)]),
    ),
  },
  logLevel: 'warning',
});
writeFileSync(path.join(OUT, 'index.html'), `<!doctype html><html lang="de" data-theme="dark" class="dark"><head><meta charset="utf-8"/><link rel="stylesheet" href="./shots.css"/><style>body{margin:0;background:hsl(var(--background));}</style></head><body><div id="root"></div><script src="./shots.js"></script></body></html>`);
for (const f of ['left.png', 'right.png']) copyFileSync(path.join(WORK, f), path.join(OUT, f));
console.log('built');
