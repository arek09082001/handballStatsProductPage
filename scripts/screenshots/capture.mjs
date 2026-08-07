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
    // Both halves need a handler for the whole life of the tunnel, not just
    // during the handshake: once the two sockets are piped together a reset on
    // either side is an unhandled 'error' event, which takes down the process.
    up.on('error', (e) => {
      if (DEBUG) console.log(`[bridge] ${req.url} upstream error: ${e.message}`);
      clientSocket.destroy();
    });
    clientSocket.on('error', () => up.destroy());
    up.on('close', () => clientSocket.destroy());
    clientSocket.on('close', () => up.destroy());
  });

  server.on('clientError', (_e, socket) => socket.destroy());

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
  // A local target never needs the proxy — and starting a bridge for it only
  // adds a process that can die mid-run.
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)/.test(BASE);
  const upstream = isLocal ? null : process.env.HTTPS_PROXY || process.env.https_proxy;
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

/**
 * Signs in when credentials are supplied. The public live demo needs none; a
 * local instance seeded with `scripts/seed-demo.mjs` does. Set STATIX_EMAIL and
 * STATIX_PASSWORD to enable.
 */
async function signIn(ctx, browser) {
  const email = process.env.STATIX_EMAIL;
  const password = process.env.STATIX_PASSWORD;
  if (!email || !password) return null;

  const page = await ctx.newPage();
  await page.goto(BASE + '/login', { waitUntil: 'networkidle', timeout: 45000 });

  const inputs = await page.$$eval('input', (els) =>
    els.map((e) => ({ type: e.type, name: e.name, id: e.id, ph: e.placeholder })),
  );
  if (DEBUG) console.log('  [login] inputs:', JSON.stringify(inputs));

  // The fields are rendered by a form library, so target them positionally
  // rather than by a name attribute that may not exist.
  const emailBox = page.locator('input[type="email"], input[name="email"]').first();
  const passBox = page.locator('input[type="password"], input[name="password"]').first();
  await emailBox.waitFor({ state: 'visible', timeout: 15000 });
  await emailBox.click();
  await emailBox.fill(email);
  await passBox.click();
  await passBox.fill(password);

  const filled = await page.evaluate(() => {
    const v = [...document.querySelectorAll('input')].map((i) => i.value);
    return v;
  });
  if (DEBUG) console.log('  [login] values:', JSON.stringify(filled));

  await page.click('button[type="submit"]');
  await page
    .waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 30000 })
    .catch(() => {});

  if (page.url().includes('/login')) {
    const err = await page
      .locator('[role="alert"], .text-destructive, [data-error]')
      .first()
      .textContent()
      .catch(() => null);
    await page.close();
    // Hard failure. A soft warning here is how a run ends up writing the login
    // screen into public/ as if it were the product.
    throw new Error(`login failed${err ? `: ${err.trim()}` : ''}`);
  }
  console.log(`  [login] ${email} -> ${page.url()}`);
  const state = await ctx.storageState();
  await page.close();
  return state;
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

/**
 * Shot formats. A tablet in landscape — not a 1920 desktop — is the frame the
 * app is shot in: at the same rendered width on the marketing page, every
 * control, number and label comes out around 1.5× larger, which is what makes
 * a screenshot readable once it is scaled down into a section. Captured at
 * 2× density so it stays sharp on retina.
 */
const TABLET = { viewport: { width: 1280, height: 800 }, scale: 2 };
const TABLET_TALL = { viewport: { width: 1280, height: 1000 }, scale: 2 };
const PHONE = { viewport: { width: 390, height: 844 }, scale: 2, mobile: true };

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
  // Detail routes, when the seed's ids are handed in — these are where the
  // screenshots that actually sell the product live (recording, stats, shot
  // maps, AI reports).
  ...(process.env.LIVE_GAME_ID ? [`/games/${process.env.LIVE_GAME_ID}`] : []),
  ...(process.env.GAME_ID ? [`/games/${process.env.GAME_ID}`] : []),
  ...(process.env.TOURNAMENT_ID ? [`/tournaments/${process.env.TOURNAMENT_ID}`] : []),
  ...(process.env.PLAYER_ID ? [`/players/${process.env.PLAYER_ID}`] : []),
];

async function explore() {
  const { browser, bridge } = await launch();
  await mkdir(EXPLORE_DIR, { recursive: true });
  const ctx = await browser.newContext({
    viewport: TABLET.viewport,
    deviceScaleFactor: 1,
    locale: 'de-DE',
    reducedMotion: 'reduce',
  });
  await signIn(ctx).catch((e) => console.log(`  ${e.message}`));
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

const ID = {
  live: process.env.LIVE_GAME_ID,
  game: process.env.GAME_ID,
  tournament: process.env.TOURNAMENT_ID,
  player: process.env.PLAYER_ID,
};

/** Click the first visible control whose trimmed text matches exactly. */
async function tap(page, label) {
  const hit = page
    .locator(`button:visible, [role="tab"]:visible, a:visible`)
    .filter({ hasText: new RegExp(`^\\s*${label}\\s*$`) })
    .first();
  await hit.waitFor({ state: 'visible', timeout: 15000 });
  await hit.click();
  await page.waitForTimeout(1400);
}

/**
 * Click the first visible control that *contains* the label. Needed where the
 * control's text carries a trailing icon glyph ("Bericht öffnen →"), which no
 * exact match will ever hit.
 */
async function tapLoose(page, label) {
  const hit = page
    .locator('button:visible, a:visible')
    .filter({ hasText: label })
    .first();
  await hit.waitFor({ state: 'visible', timeout: 15000 });
  await hit.click();
  await page.waitForTimeout(2000);
}

/**
 * Click a control by its accessible name. The AI view is opened by the Statix
 * mark in the recording header rather than a labelled tab, so there is no text
 * to match on — only `aria-label`.
 */
async function tapAria(page, name) {
  const hit = page.locator(`[aria-label="${name}"]:visible`).first();
  await hit.waitFor({ state: 'visible', timeout: 15000 });
  await hit.click();
  await page.waitForTimeout(2500);
}

/** Bring a section heading to the top of the frame, so the shot is about it. */
async function scrollTo(page, headingText) {
  await page.evaluate((text) => {
    const el = [...document.querySelectorAll('h1,h2,h3,h4')].find((h) =>
      h.textContent.trim().startsWith(text),
    );
    if (el) el.scrollIntoView({ block: 'start', behavior: 'instant' });
    window.scrollBy(0, -24);
  }, headingText);
  await page.waitForTimeout(900);
}

/**
 * The shot manifest — also the inventory of every product image. `file` is the
 * name written into public/; the first block keeps the names the product page
 * already references, the rest are new and named for reuse elsewhere.
 */
const SHOTS = [
  // ── The product page's own eleven ────────────────────────────────────────
  {
    group: 'core', file: 'heroImage.png', ...TABLET,
    route: () => `/games/${ID.live}`,
    note: 'Live recording — the sideline tap, mid second half.',
  },
  {
    group: 'core', file: 'recordStatsInGame.png', ...TABLET,
    route: () => `/games/${ID.live}`,
    prepare: (page) => tap(page, '7-Meter-Wurf'),
    note: 'Recording with the 7-metre panel open.',
  },
  {
    group: 'core', file: 'gameListOverview.png', ...TABLET_TALL,
    route: () => '/games',
    note: 'Season dashboard: balance, form, shot and save quota, every game.',
  },
  {
    group: 'core', file: 'statsTableInGame.png', ...TABLET_TALL,
    route: () => `/games/${ID.game}`,
    prepare: async (page) => {
      await tap(page, 'Statistik');
      await scrollTo(page, 'Feldspieler');
    },
    note: 'Per-player table for a finished game.',
  },
  {
    group: 'core', file: 'shotMaps.png', ...TABLET_TALL,
    route: () => `/games/${ID.game}`,
    prepare: async (page) => {
      await tap(page, 'Statistik');
      await scrollTo(page, 'Wurfbild');
    },
    note: 'Shot map / heatmap on the court.',
  },
  {
    group: 'core', file: 'teamManagement.png', ...TABLET_TALL,
    route: () => '/players',
    note: 'Roster as the card album.',
  },
  {
    group: 'core', file: 'exportShare.png', ...TABLET,
    route: () => `/games/${ID.game}`,
    prepare: (page) => tap(page, 'Teilen'),
    note: 'Share a finished game by link or with another coach.',
  },
  {
    group: 'core', file: 'tournamentTable.png', ...TABLET_TALL,
    route: () => `/tournaments/${ID.tournament}`,
    prepare: (page) => scrollTo(page, 'Tabelle'),
    note: 'Auto-updating tournament standings.',
  },
  {
    group: 'core', file: 'tournamentGameList.png', ...TABLET_TALL,
    route: () => `/tournaments/${ID.tournament}`,
    prepare: (page) => scrollTo(page, 'Spiele'),
    note: 'Tournament schedule and results.',
  },
  {
    group: 'core', file: 'aiAnalyze.png', ...TABLET_TALL,
    route: () => `/games/${ID.game}`,
    // The AI tab lands on the report *list*; the charts live one click deeper.
    prepare: async (page) => {
      await tapAria(page, 'KI');
      await tapLoose(page, 'Bericht öffnen');
      await page.waitForTimeout(1800);
    },
    note: 'AI match report: game flow and shot-zone efficiency.',
  },
  {
    group: 'core', file: 'aiAnalyze2.png', ...TABLET_TALL,
    route: () => `/games/${ID.game}`,
    prepare: async (page) => {
      await tapAria(page, 'KI');
      await tapLoose(page, 'Bericht öffnen');
      await page.waitForTimeout(1800);
      await scrollTo(page, 'Wendepunkt');
    },
    note: 'AI match report: turning points, error spread, player performance.',
  },

  // ── Tournament, for /fuer-vereine and the tournament guide ───────────────
  {
    group: 'turnier', file: 'turnier-tabelle.png', ...TABLET_TALL,
    route: () => `/tournaments/${ID.tournament}`,
    prepare: (page) => scrollTo(page, 'Tabelle'),
  },
  {
    group: 'turnier', file: 'turnier-spielplan.png', ...TABLET_TALL,
    route: () => `/tournaments/${ID.tournament}`,
    prepare: (page) => scrollTo(page, 'Spiele'),
  },
  {
    group: 'turnier', file: 'turnier-mannschaften.png', ...TABLET,
    route: () => `/tournaments/${ID.tournament}`,
    prepare: (page) => scrollTo(page, 'Mannschaften'),
  },
  {
    group: 'turnier', file: 'turnier-ki-analyse.png', ...TABLET_TALL,
    route: () => `/tournaments/${ID.tournament}`,
    prepare: async (page) => {
      await tap(page, 'KI-Analyse');
      await tapLoose(page, 'Bericht öffnen').catch(() => {});
    },
  },

  // ── Kader and player profiles, for /fuer-jugendtrainer ───────────────────
  {
    group: 'kader', file: 'kader-kartenalbum.png', ...TABLET_TALL,
    route: () => '/players',
  },
  {
    group: 'kader', file: 'spielerprofil-verlauf.png', ...TABLET_TALL,
    route: () => `/players/${ID.player}`,
  },
  {
    group: 'kader', file: 'spielerprofil-ki.png', ...TABLET_TALL,
    route: () => `/players/${ID.player}`,
    prepare: (page) => scrollTo(page, 'KI-Spieler-Intelligenz'),
  },
  {
    group: 'kader', file: 'aufstellung-feld.png', ...TABLET,
    route: () => `/games/${ID.live}`,
    note: 'The court with the current line-up — the tactic board in the app.',
  },

  // ── Sharing and the coaching staff ───────────────────────────────────────
  {
    group: 'teilen', file: 'spiel-teilen-freigabelink.png', ...TABLET,
    route: () => `/games/${ID.game}`,
    prepare: (page) => tap(page, 'Teilen'),
  },
  {
    group: 'teilen', file: 'posteingang-geteilte-spiele.png', ...TABLET,
    route: () => '/inbox',
  },
  {
    group: 'teilen', file: 'gegner-uebersicht.png', ...TABLET,
    route: () => '/opponents',
  },
  {
    group: 'teilen', file: 'spielerumfragen.png', ...TABLET,
    route: () => '/surveys',
  },

  // ── Phone: how a coach actually holds it on the bench ────────────────────
  {
    group: 'mobil', file: 'mobil-live-erfassung.png', ...PHONE,
    route: () => `/games/${ID.live}`,
  },
  {
    group: 'mobil', file: 'mobil-spielliste.png', ...PHONE,
    route: () => '/games',
  },
  {
    group: 'mobil', file: 'mobil-spielerstatistiken.png', ...PHONE,
    route: () => `/games/${ID.game}`,
    prepare: async (page) => {
      await tap(page, 'Statistik');
      await scrollTo(page, 'Feldspieler');
    },
  },
  {
    group: 'mobil', file: 'mobil-wurfbild.png', ...PHONE,
    route: () => `/games/${ID.game}`,
    prepare: async (page) => {
      await tap(page, 'Statistik');
      await scrollTo(page, 'Wurfbild');
    },
  },
  {
    group: 'mobil', file: 'mobil-kader.png', ...PHONE,
    route: () => '/players',
  },
];

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
  let done = 0;
  const failed = [];

  // Sign in ONCE and reuse the session for every shot. Logging in per shot
  // trips the app's own auth rate limit ("Zu viele Versuche") a few shots in,
  // after which every remaining page is the login screen.
  const authCtx = await browser.newContext({ locale: 'de-DE' });
  const storageState = await signIn(authCtx, browser);
  await authCtx.close();

  for (const shot of wanted) {
    const ctx = await browser.newContext({
      viewport: shot.viewport ?? TABLET.viewport,
      deviceScaleFactor: shot.scale ?? 1,
      locale: 'de-DE',
      isMobile: Boolean(shot.mobile),
      hasTouch: Boolean(shot.mobile),
      reducedMotion: 'reduce',
      ...(storageState ? { storageState } : {}),
    });
    try {
      const page = await ctx.newPage();
      const route = typeof shot.route === 'function' ? shot.route() : shot.route;
      await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await settle(page);
      // Never write a screenshot of the login or onboarding screen into
      // public/ — that is a product image that silently lies.
      if (/\/login|\/onboarding/.test(page.url())) {
        throw new Error(`not signed in — landed on ${new URL(page.url()).pathname}`);
      }
      if (shot.prepare) await shot.prepare(page);
      await settle(page, 800);
      const target = shot.selector ? await page.$(shot.selector) : page;
      await target.screenshot({ path: path.join(PUBLIC_DIR, shot.file) });
      console.log(`✓ ${shot.file}`);
      done++;
    } catch (err) {
      // One bad shot must not cost the whole run — record it and carry on, so
      // the summary says exactly what is missing instead of silently shipping
      // a short set.
      console.log(`✗ ${shot.file} — ${err.message.split('\n')[0].slice(0, 90)}`);
      failed.push(shot.file);
    } finally {
      await ctx.close();
    }
  }

  await browser.close();
  bridge?.close();
  console.log(`\n${done}/${wanted.length} written to public/`);
  if (failed.length) console.log(`missing: ${failed.join(', ')}`);
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
