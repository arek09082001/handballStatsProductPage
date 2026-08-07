/**
 * Statix product-page screenshot pipeline.
 *
 * Captures real app screens from a running Statix instance and writes them into
 * `public/`, so the marketing surface never drifts from the product. Run it
 * again whenever the app UI changes.
 *
 *   node scripts/screenshots/capture.mjs explore          # discover the UI
 *   node scripts/screenshots/capture.mjs capture          # write public/*.png
 *   node scripts/screenshots/capture.mjs capture --only kader
 *
 * Target instance defaults to the public live demo (no account needed) and can
 * be pointed anywhere with STATIX_URL.
 *
 * ── Proxy note ───────────────────────────────────────────────────────────────
 * Inside the Claude Code sandbox, Chromium cannot complete a CONNECT against the
 * session's egress proxy (every HTTPS request returns ERR_CONNECTION_RESET)
 * although curl and Node can. When HTTPS_PROXY is set, this script therefore
 * starts a local CONNECT bridge that forwards to that very same proxy — egress
 * policy, TLS re-termination and the CA bundle all still apply; it only bridges
 * the transport. With no HTTPS_PROXY set (a normal dev machine) no bridge is
 * started and Chromium connects directly.
 */
import net from 'node:net';
import http from 'node:http';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const PUBLIC_DIR = path.join(REPO, 'public');
const EXPLORE_DIR = path.join(REPO, '.screenshots-explore');

const BASE = (process.env.STATIX_URL || 'https://demo.statix-app.de').replace(/\/$/, '');
const CHROME =
  process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const MODE = process.argv[2] || 'explore';
const DEBUG = process.argv.includes('--debug') || Boolean(process.env.DEBUG);
const ONLY = process.argv.includes('--only')
  ? process.argv[process.argv.indexOf('--only') + 1]
  : null;

/* ─────────────────────────────────────────────────────── the CONNECT bridge ── */

// Chromium's startup telemetry opens a burst of CONNECTs that are useless here
// and crowd out the ones we want; they never reach the upstream proxy.
const TELEMETRY =
  /(^|\.)(google\.com|gstatic\.com|googleapis\.com|doubleclick\.net|google-analytics\.com|gvt1\.com|gvt2\.com)$/i;

async function startBridge(upstreamUrl) {
  const upstream = new URL(upstreamUrl);
  const server = http.createServer((req, res) => {
    const up = http.request(
      {
        host: upstream.hostname,
        port: upstream.port,
        method: req.method,
        path: req.url,
        headers: req.headers,
      },
      (upRes) => {
        res.writeHead(upRes.statusCode || 502, upRes.headers);
        upRes.pipe(res);
      },
    );
    up.on('error', () => res.destroy());
    req.pipe(up);
  });

  server.on('connect', (req, clientSocket, head) => {
    if (TELEMETRY.test(req.url.replace(/:\d+$/, ''))) {
      clientSocket.end('HTTP/1.1 403 Forbidden\r\n\r\n');
      return;
    }
    const up = net.connect(Number(upstream.port), upstream.hostname, () => {
      up.write(`CONNECT ${req.url} HTTP/1.1\r\nHost: ${req.url}\r\n\r\n`);
    });
    let buf = Buffer.alloc(0);
    const onData = (chunk) => {
      buf = Buffer.concat([buf, chunk]);
      const end = buf.indexOf('\r\n\r\n');
      if (end === -1) return;
      up.removeListener('data', onData);
      const status = buf.slice(0, buf.indexOf('\r\n')).toString();
      if (DEBUG) console.log(`[bridge] ${req.url} <- ${status}`);
      if (!/ 2\d\d /.test(status)) {
        clientSocket.end('HTTP/1.1 502 Bad Gateway\r\n\r\n');
        up.destroy();
        return;
      }
      clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
      const rest = buf.slice(end + 4);
      if (rest.length) clientSocket.write(rest);
      if (head?.length) up.write(head);
      up.pipe(clientSocket);
      clientSocket.pipe(up);
    };
    up.on('data', onData);
    up.on('error', (e) => {
      if (DEBUG) console.log(`[bridge] ${req.url} upstream error: ${e.message}`);
      clientSocket.destroy();
    });
    clientSocket.on('error', () => up.destroy());
  });

  await new Promise((res) => server.listen(0, '127.0.0.1', res));
  const { port } = server.address();
  console.log(`[bridge] 127.0.0.1:${port} -> ${upstream.origin}`);
  return { port, close: () => server.close() };
}

/* ───────────────────────────────────────────────────────────── browser setup ── */

const CHROME_ARGS = [
  '--no-sandbox',
  '--disable-background-networking',
  '--disable-component-update',
  '--disable-client-side-phishing-detection',
  '--disable-sync',
  '--disable-default-apps',
  '--no-first-run',
  '--no-default-browser-check',
  '--metrics-recording-only',
  '--disable-domain-reliability',
  '--font-render-hinting=none',
];

async function launch() {
  const upstream = process.env.HTTPS_PROXY || process.env.https_proxy;
  const bridge = upstream ? await startBridge(upstream) : null;
  const browser = await chromium.launch({
    executablePath: CHROME,
    args: CHROME_ARGS,
    proxy: bridge
      ? { server: `http://127.0.0.1:${bridge.port}`, bypass: 'localhost,127.0.0.1' }
      : undefined,
  });
  return { browser, bridge };
}

/** Settle a page: fonts loaded, images decoded, entrance animations finished. */
async function settle(page, ms = 2200) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page
    .evaluate(async () => {
      await document.fonts?.ready;
      await Promise.all(
        [...document.images]
          .filter((i) => !i.complete)
          .map((i) => new Promise((r) => {
            i.onload = i.onerror = r;
          })),
      );
    })
    .catch(() => {});
  await page.waitForTimeout(ms);
}

/* ────────────────────────────────────────────────────────────────── explore ── */

const EXPLORE_ROUTES = [
  '/games',
  '/players',
  '/team',
  '/tournaments',
  '/opponents',
  '/surveys',
  '/inbox',
  '/settings',
];

async function explore() {
  const { browser, bridge } = await launch();
  await mkdir(EXPLORE_DIR, { recursive: true });
  const ctx = await browser.newContext({
    viewport: { width: 1920, height: 1000 },
    deviceScaleFactor: 1,
    locale: 'de-DE',
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  const report = [];

  for (const route of EXPLORE_ROUTES) {
    const entry = { route };
    try {
      const res = await page.goto(BASE + route, {
        waitUntil: 'domcontentloaded',
        timeout: 45000,
      });
      entry.status = res?.status();
      await settle(page);
      Object.assign(
        entry,
        await page.evaluate(() => ({
          url: location.href,
          title: document.title,
          headings: [...document.querySelectorAll('h1,h2,h3')]
            .slice(0, 8)
            .map((h) => h.textContent.trim().slice(0, 70)),
          tabs: [...document.querySelectorAll('[role="tab"],button,a')]
            .map((b) => b.textContent.trim())
            .filter((t) => t && t.length < 30)
            .slice(0, 45),
          internalLinks: [
            ...new Set(
              [...document.querySelectorAll('a[href^="/"]')].map((a) =>
                a.getAttribute('href'),
              ),
            ),
          ].slice(0, 30),
          textStart: document.body.innerText.replace(/\s+/g, ' ').slice(0, 200),
        })),
      );
      const file = `explore${route.replace(/\//g, '-')}.png`;
      await page.screenshot({ path: path.join(EXPLORE_DIR, file), fullPage: false });
      entry.shot = file;
    } catch (err) {
      entry.error = err.message.split('\n')[0].slice(0, 140);
    }
    console.log(`${route.padEnd(14)} ${entry.status ?? '—'}  ${entry.error ?? entry.title ?? ''}`);
    report.push(entry);
  }

  await writeFile(
    path.join(EXPLORE_DIR, 'report.json'),
    JSON.stringify(report, null, 2),
  );
  console.log(`\nWrote ${EXPLORE_DIR}/report.json`);
  await browser.close();
  bridge?.close();
}

/* ────────────────────────────────────────────────────────────────── capture ── */

// Filled in once `explore` has shown the real UI. Each shot names the file it
// writes into public/, so the manifest doubles as the image inventory.
const SHOTS = [];

async function capture() {
  const wanted = ONLY ? SHOTS.filter((s) => s.group === ONLY) : SHOTS;
  if (!wanted.length) {
    console.error(
      'No shots defined yet. Run `explore` first and fill in the SHOTS manifest.',
    );
    process.exitCode = 1;
    return;
  }
  const { browser, bridge } = await launch();
  for (const shot of wanted) {
    const ctx = await browser.newContext({
      viewport: shot.viewport ?? { width: 1920, height: 900 },
      deviceScaleFactor: shot.scale ?? 1,
      locale: 'de-DE',
      isMobile: Boolean(shot.mobile),
      hasTouch: Boolean(shot.mobile),
      reducedMotion: 'reduce',
    });
    const page = await ctx.newPage();
    await page.goto(BASE + shot.route, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await settle(page);
    if (shot.prepare) await shot.prepare(page);
    await settle(page, 900);
    const target = shot.selector ? await page.$(shot.selector) : page;
    await target.screenshot({ path: path.join(PUBLIC_DIR, shot.file) });
    console.log(`✓ public/${shot.file}`);
    await ctx.close();
  }
  await browser.close();
  bridge?.close();
}

/* ───────────────────────────────────────────────────────────────────── main ── */

/**
 * Isolates who is at fault when nothing loads: sends a plain Node HTTPS request
 * through the very same bridge Chromium uses. If this succeeds and Chromium
 * still fails, the bridge is sound and the difference is Chromium's TLS
 * handshake; if this fails too, the bridge itself is wrong.
 */
async function selftest() {
  const upstream = process.env.HTTPS_PROXY || process.env.https_proxy;
  if (!upstream) {
    console.log('No HTTPS_PROXY set — nothing to bridge.');
    return;
  }
  const bridge = await startBridge(upstream);
  const { default: https } = await import('node:https');
  const target = new URL(BASE + '/games');

  await new Promise((resolve) => {
    const req = http.request(
      {
        host: '127.0.0.1',
        port: bridge.port,
        method: 'CONNECT',
        path: `${target.hostname}:443`,
      },
      () => {},
    );
    req.on('connect', (res, socket) => {
      console.log(`[selftest] tunnel -> ${res.statusCode}`);
      const tls = https.request(
        { socket, servername: target.hostname, host: target.hostname, path: target.pathname, agent: false },
        (r) => {
          console.log(`[selftest] HTTPS through bridge -> ${r.statusCode}`);
          r.resume();
          r.on('end', resolve);
        },
      );
      tls.on('error', (e) => {
        console.log(`[selftest] TLS error: ${e.message}`);
        resolve();
      });
      tls.end();
    });
    req.on('error', (e) => {
      console.log(`[selftest] CONNECT error: ${e.message}`);
      resolve();
    });
    req.end();
  });

  bridge.close();
}

console.log(`target: ${BASE}\nmode:   ${MODE}\n`);
if (MODE === 'selftest') await selftest();
else if (MODE === 'explore') await explore();
else if (MODE === 'capture') await capture();
else {
  console.error(`Unknown mode "${MODE}". Use "explore" or "capture".`);
  process.exitCode = 1;
}
