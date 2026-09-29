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
      // Next.js paints a dev-only badge ("N 1 Issue") over the bottom-left
      // corner of every page served by `next dev`. It is not product UI, and a
      // local instance is the only way to reach the screens the public demo
      // has not been redeployed with — so it is removed rather than shot.
      document
        .querySelectorAll('nextjs-portal, [data-nextjs-toast], #__next-build-watcher')
        .forEach((el) => el.remove());
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
  // The club area. Only reachable for an account with a club role — sign in as
  // the club admin the app's seed creates (`club-admin@statix-app.de`), not as
  // the coach, or every one of these answers with a redirect.
  '/club',
  '/club/teams',
  '/club/players',
  '/club/insights',
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
  // Printed by `scripts/seed-schedule.mjs` and `scripts/seed-video.mjs` in the
  // app repo. Both screens only exist on an instance those seeds have run
  // against — the public demo carries neither.
  event: process.env.EVENT_ID,
  video: process.env.VIDEO_ID,
};

/**
 * The page from its top down to the lowest piece of content in `<main>`, for
 * list screens: cropping to the viewport ships a band of empty page under a
 * short list, or cuts a long one through a row. Runs in the page.
 */
function contentBox() {
  const main = document.querySelector('main');
  if (!main) return null;
  // Leaves only: the scroll containers around a list are as tall as the
  // screen, and the page's decorative glow layer is too.
  let bottom = 0;
  for (const el of main.querySelectorAll('*')) {
    if (el.childElementCount > 0 || el.closest('.pointer-events-none')) continue;
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) bottom = Math.max(bottom, r.bottom);
  }
  return {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: Math.min(bottom + 32, window.innerHeight),
  };
}

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

/**
 * Tap a player on the court so the quick-action popover opens — the single
 * gesture the whole product is built around.
 */
async function tapPlayer(page, name) {
  const card = page
    .locator('button:visible, [role="button"]:visible')
    .filter({ hasText: name })
    .first();
  await card.waitFor({ state: 'visible', timeout: 15000 });
  await card.click();
  await page.waitForTimeout(1200);
}

/**
 * Press and hold a court token, then swipe — the hold gesture of the recording
 * screen (`features/games/recording/hold-menu.ts` in the app repo).
 *
 * The touches go through CDP rather than `page.touchscreen`, which can only
 * tap: a hold-then-swipe needs start, moves and end kept apart in time, and the
 * shot is taken WHILE the finger is still down — that is the only moment the
 * menu and its highlighted target exist. So by default nothing is released:
 * the context is closed after the shot and the gesture dies with it, which
 * records nothing. With `release: true` the finger lifts and the call is
 * written — that is the shot of the undo toast, and it does add one event to
 * the instance it runs against.
 *
 * Scoped to `.court-area`: the bench squares carry the same classes and a
 * bench token deliberately never arms the hold.
 */
async function holdAndSwipe(page, name, { dx = 0, dy = 0, release = false } = {}) {
  const token = page.locator('.court-area button.touch-none', { hasText: name });
  await token.waitFor({ state: 'visible', timeout: 15000 });
  const box = await token.boundingBox();
  if (!box) throw new Error(`court token "${name}" has no box`);
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  const at = (x, y) => [{ x, y, id: 1, force: 1 }];

  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: at(cx, cy) });
  // HOLD_ARM_MS is 500; the rest is room for the menu to render.
  await page.waitForTimeout(900);
  if (dx || dy) {
    // In steps, like a real finger — one jump can skip the wedge the highlight
    // is meant to cross into.
    for (const f of [0.34, 0.67, 1]) {
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: at(cx + dx * f, cy + dy * f),
      });
      await page.waitForTimeout(80);
    }
  }
  if (release) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page
      .locator('[data-sonner-toast]')
      .first()
      .waitFor({ state: 'visible', timeout: 8000 });
    // Long enough for the outbox to hand the event over — otherwise the header
    // shows a pending-sync "1" that has nothing to do with the gesture — and
    // well inside the toast's own few seconds.
    await page.waitForTimeout(1500);
  }
  await page.waitForTimeout(500);
}

/**
 * Bring a section heading to the top of the frame, so the shot is about it.
 *
 * The app shell keeps the window at a fixed height and scrolls an inner
 * container, so `window.scrollTo` does nothing — the first version of this
 * silently produced four byte-identical tournament screenshots. It now walks up
 * from the heading to the ancestor that actually scrolls, and throws when the
 * heading is missing rather than returning a shot of the wrong thing.
 */
async function scrollTo(page, headingText) {
  const moved = await page.evaluate((text) => {
    const el = [...document.querySelectorAll('h1,h2,h3,h4')].find((h) =>
      h.textContent.trim().startsWith(text),
    );
    if (!el) return { found: false };

    let node = el.parentElement;
    while (node && node !== document.body) {
      const style = getComputedStyle(node);
      const scrolls = /(auto|scroll|overlay)/.test(style.overflowY);
      if (scrolls && node.scrollHeight > node.clientHeight + 8) {
        const top =
          el.getBoundingClientRect().top - node.getBoundingClientRect().top;
        node.scrollTop += top - 20;
        return { found: true, via: 'container', to: node.scrollTop };
      }
      node = node.parentElement;
    }

    const y = el.getBoundingClientRect().top + window.scrollY - 20;
    window.scrollTo(0, y);
    return { found: true, via: 'window', to: y };
  }, headingText);

  if (!moved.found) throw new Error(`heading not found: "${headingText}"`);
  if (DEBUG) console.log(`  [scroll] "${headingText}" via ${moved.via} -> ${moved.to}`);
  await page.waitForTimeout(900);
}

/**
 * The shot manifest — also the inventory of every product image. `file` is the
 * name written into public/; the first block keeps the names the product page
 * already references, the rest are new and named for reuse elsewhere.
 */
const SHOTS = [
  // ── The product page's own eleven ────────────────────────────────────────
  // Both recording shots show the same moment on purpose: a player tapped and
  // the quick-action popover open. That is the product's whole claim — one tap
  // per action — and a bare court does not show it. The two files stay separate
  // because the site references them in different places (OG images, guide
  // articles, `/was-ist-statix`), not because the pictures differ.
  {
    group: 'core', file: 'heroImage.png', ...TABLET,
    route: () => `/games/${ID.live}`,
    prepare: (page) => tapPlayer(page, 'Erik L.'),
    note: 'Live recording with the quick-action popover open.',
  },
  {
    group: 'core', file: 'recordStatsInGame.png', ...TABLET,
    route: () => `/games/${ID.live}`,
    prepare: (page) => tapPlayer(page, 'Erik L.'),
    note: 'Same moment as heroImage — used by the showcase and the guides.',
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
    group: 'turnier', file: 'turnier-uebersicht.png', ...TABLET_TALL,
    route: () => `/tournaments/${ID.tournament}`,
    prepare: (page) => scrollTo(page, 'Tabelle'),
    note: 'Table and schedule together — the tournament at a glance.',
  },
  {
    group: 'turnier', file: 'turnier-tabelle.png', ...TABLET_TALL,
    route: () => `/tournaments/${ID.tournament}`,
    section: 'Tabelle',
  },
  {
    group: 'turnier', file: 'turnier-spielplan.png', ...TABLET_TALL,
    route: () => `/tournaments/${ID.tournament}`,
    section: 'Spiele',
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
    group: 'kader', file: 'spielerprofil-verlauf.png', ...TABLET_TALL,
    route: () => `/players/${ID.player}`,
  },
  {
    group: 'kader', file: 'spielerprofil-ki.png', ...TABLET_TALL,
    route: () => `/players/${ID.player}`,
    section: 'KI-Spieler-Intelligenz',
  },
  {
    group: 'kader', file: 'aufstellung-feld.png', ...TABLET,
    route: () => `/games/${ID.live}`,
    note: 'The court with the current line-up — the tactic board in the app.',
  },

  // ── Sharing and the coaching staff ───────────────────────────────────────
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

  // ── The club area, for /fuer-vereine ─────────────────────────────────────
  // Shot as the club admin (STATIX_EMAIL=club-admin@statix-app.de) against a
  // local instance seeded with `npm run db:seed && node
  // scripts/seed-club-demo.mjs` in the app repo — the club screens are about
  // comparing squads, and the public demo has exactly one.
  {
    group: 'verein', file: 'verein-uebersicht.png', ...TABLET_TALL,
    route: () => '/club',
    note: 'The Monday overview: every squad\'s results, coming fixtures, table.',
  },
  {
    group: 'verein', file: 'verein-mannschaften.png', ...TABLET_TALL,
    route: () => '/club/teams',
    note: 'Every squad of the club with roster size, staff and next fixture.',
  },
  {
    group: 'verein', file: 'verein-spieler.png', ...TABLET_TALL,
    route: () => '/club/players',
    note: 'Club-wide player list across all squads, searchable.',
  },
  {
    group: 'verein', file: 'verein-auswertung.png', ...TABLET_TALL,
    route: () => '/club/insights',
    note: 'Club Auswertung: record, rates, how the goals are made.',
  },
  {
    group: 'verein', file: 'verein-saisonvergleich.png', ...TABLET_TALL,
    route: () => '/club/insights',
    prepare: (page) => tap(page, 'Saisonvergleich'),
    note: 'The seasons of one squad side by side.',
  },
  {
    group: 'verein', file: 'verein-laufbahnen.png', ...TABLET,
    route: () => '/club',
    section: 'Laufbahnen im Verein',
    note: 'People who have played in more than one squad of the club.',
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

  // ── Termine, for /funktionen/termine-trainingsbeteiligung ────────────────
  // Needs an instance `scripts/seed-schedule.mjs` has run against: the public
  // demo has no appointments at all, and a calendar of empty states is worse
  // than no picture.
  {
    group: 'termine', file: 'termine-liste.png', ...TABLET_TALL,
    route: () => '/schedule',
    note: 'The week list: series badge, meet/start/end rail, the RSVP tally.',
  },
  {
    group: 'termine', file: 'termine-kalender.png', ...TABLET_TALL,
    route: () => '/schedule',
    prepare: (page) => tap(page, 'Kalender'),
    note: 'The month at a glance — trainings, matches and who is away.',
  },
  {
    group: 'termine', file: 'termine-detail.png', ...TABLET_TALL,
    route: () => `/schedule/${ID.event}`,
    note: 'One appointment: hall with navigation, notes, the full attendance list.',
  },
  {
    group: 'termine', file: 'termine-teilnahme.png', ...TABLET,
    route: () => `/schedule/${ID.event}`,
    prepare: (page) => scrollTo(page, 'Wer kommt?'),
    note: 'Who answered what, with the absence reason beside each declined name.',
  },
  {
    group: 'termine', file: 'termine-abwesenheiten.png', ...TABLET,
    route: () => '/schedule/absences',
    note: 'Holiday, illness and injuries as ranges — entered once, not per training.',
  },
  {
    group: 'termine', file: 'mobil-termine.png', ...PHONE,
    route: () => '/schedule',
    note: 'How a player actually answers: two taps on the phone.',
  },

  // ── Video-Tagging (beta), for /funktionen/video-tagging ──────────────────
  // The stage stays empty on a local instance — playback is a presigned R2 URL
  // and R2 is not something localhost has. So these two crop to the WORKBENCH,
  // which is real and is the feature; the moving picture on the product page is
  // a drawn mock, not a doctored screenshot.
  {
    group: 'video', file: 'video-tagging-spuren.png',
    viewport: { width: 1800, height: 1300 }, scale: 2,
    route: () => `/videos/${ID.video}/tagging`,
    clip: (page) =>
      page.evaluate(() => {
        const grid = document.querySelector('main div.grid.flex-1');
        const rail = grid?.children[0];
        // The left column stacks stage → playlist bar → lanes. Dropping the
        // first child drops the stage, which on a localhost instance is the
        // "upload not finished" placeholder rather than a match.
        const bar = rail?.children[1];
        if (!rail || !bar) return null;
        const r = rail.getBoundingClientRect();
        const top = bar.getBoundingClientRect().top;
        return { x: r.x, y: top, width: r.width, height: r.bottom - top };
      }),
    note: 'Lanes and playlists: every scene of the half, grouped by action.',
  },
  // ── Mannschaftskasse, Trikotschrank, Spieler-Zugang ─────────────────────
  // All three need a local instance `scripts/seed-team-organisation.mjs` has
  // run against: the public demo has no fines, no jerseys and no linked player
  // accounts, and three empty states are not a feature page.
  {
    group: 'organisation', file: 'strafen-kasse.png', ...TABLET_TALL,
    route: () => '/fines',
    prepare: (page) => tap(page, 'Nach Spielerin'),
    note: 'The Kasse: open beside paid, and who owes what.',
  },
  {
    group: 'organisation', file: 'strafen-erfassen.png', ...TABLET,
    route: () => '/fines',
    note: 'Writing one up: pick the line, pick the player. That is the whole act.',
  },
  {
    group: 'organisation', file: 'strafen-katalog.png', ...TABLET,
    route: () => '/fines',
    prepare: (page) => tap(page, 'Katalog'),
    note: 'The agreed price list — what costs what, in the squad\'s own order.',
  },
  {
    group: 'organisation', file: 'trikots-schrank.png', ...TABLET_TALL,
    route: () => '/jerseys',
    note: 'Both sets, who wears which number, what is still in the box.',
  },
  {
    group: 'organisation', file: 'spieler-zugang.png',
    // Taller than the other two so the whole panel — link, controls and the
    // full roster — fits in one frame and the crop ends on a row rather than
    // through one.
    viewport: { width: 1280, height: 1300 }, scale: 2,
    route: () => '/settings#playerAccess',
    // Cropped to the panel: settings opens with the recording-mode block above
    // it, and a shot of both is a picture about neither. The invite URL in it
    // is only the real domain when the instance runs with
    // NEXT_PUBLIC_APP_URL=https://app.statix-app.de — see the README.
    section: 'Spielerinnen einladen',
    note: 'One invite link for the squad, plus who has signed up already.',
  },

  // ── The player app, shot as a player ─────────────────────────────────────
  // A different account, so these run in their own pass:
  //   STATIX_EMAIL=spielerin1@statix-app.de … capture --only spielerin
  // Shot on the phone on purpose: nobody checks her own shot quota on a
  // laptop.
  {
    group: 'spielerin', file: 'mobil-meine-statistik.png', ...PHONE,
    route: () => '/my-stats',
    note: 'What a player sees of herself: quota, shots, minutes, attendance.',
  },
  {
    group: 'spielerin', file: 'mobil-meine-strafen.png', ...PHONE,
    route: () => '/my-fines',
    note: 'Her own fine account — open, paid, and the catalogue behind it.',
  },

  // ── Halten & Wischen ─────────────────────────────────────────────────────
  // The hold gesture on the court: one token held, the menu open, and each
  // direction lit in turn — the showcase on `/funktionen/halten-und-wischen`
  // switches between these five, so they must show the same player at the same
  // moment and differ in nothing but the highlighted target. Any instance with
  // the app's seed and a live game will do (`LIVE_GAME_ID`); the stat types
  // behind the four targets must be recordable there, or a chip is not drawn.
  //
  // David R. on the phone because he stands centred with room on both sides,
  // so every chip sits beside the token instead of moving to a second row.
  {
    group: 'halten', file: 'halten-wischen-tablet.png', ...TABLET, touch: true,
    route: () => `/games/${ID.live}`,
    prepare: (page) => holdAndSwipe(page, 'Ben K.', { dy: 60 }),
    note: 'Hold on the tablet, swiped down: "7m verursacht" lit.',
  },
  {
    group: 'halten', file: 'halten-wischen-menue.png', ...PHONE,
    route: () => `/games/${ID.live}`,
    prepare: (page) => holdAndSwipe(page, 'David R.'),
    note: 'The menu just opened: four targets, none chosen yet.',
  },
  {
    group: 'halten', file: 'halten-wischen-oben.png', ...PHONE,
    route: () => `/games/${ID.live}`,
    prepare: (page) => holdAndSwipe(page, 'David R.', { dy: -60 }),
    note: 'Up: 1gg1 verloren.',
  },
  {
    group: 'halten', file: 'halten-wischen-unten.png', ...PHONE,
    route: () => `/games/${ID.live}`,
    prepare: (page) => holdAndSwipe(page, 'David R.', { dy: 60 }),
    note: 'Down: 7m verursacht.',
  },
  {
    group: 'halten', file: 'halten-wischen-links.png', ...PHONE,
    route: () => `/games/${ID.live}`,
    prepare: (page) => holdAndSwipe(page, 'David R.', { dx: -60 }),
    note: 'Left: 7m rausgeholt.',
  },
  {
    group: 'halten', file: 'halten-wischen-rechts.png', ...PHONE,
    route: () => `/games/${ID.live}`,
    prepare: (page) => holdAndSwipe(page, 'David R.', { dx: 60 }),
    note: 'Right: 2 Min. rausgeholt.',
  },
  {
    group: 'halten', file: 'halten-wischen-rueckgaengig.png', ...PHONE,
    route: () => `/games/${ID.live}`,
    // Released: this one writes a "7m verursacht" into the live game.
    prepare: (page) => holdAndSwipe(page, 'David R.', { dy: 60, release: true }),
    note: 'Released: the call is written and offers to undo itself.',
  },

  {
    group: 'video', file: 'video-tagging-katalog.png',
    viewport: { width: 1600, height: 1150 }, scale: 2,
    route: () => `/videos/${ID.video}/tagging`,
    clip: (page) =>
      page.evaluate(() => {
        const grid = document.querySelector('main div.grid.flex-1');
        const panel = grid?.children[1];
        if (!panel) return null;
        const r = panel.getBoundingClientRect();
        // The panel is a full-height column and the catalogue only fills the
        // top of it; cropping to the column would ship a third of empty board.
        const bottom = [...panel.querySelectorAll('button, [role="button"]')]
          .map((el) => el.getBoundingClientRect().bottom)
          .reduce((max, b) => Math.max(max, b), r.top);
        return {
          x: r.x,
          y: r.y,
          width: r.width,
          height: Math.min(r.height, bottom - r.y + 8),
        };
      }),
    note: 'The tagging catalogue: side, squad, action — one tap each.',
  },

  // ── Der Rest des Videobereichs ───────────────────────────────────────────
  // Everything here is a screen WITHOUT the moving picture, so it is real on a
  // local instance too. Needs `seed-video.mjs` plus `seed-video-extras.mjs`
  // (more tagged games, plays, custom tags, sent clips, squad releases) — see
  // the README.
  {
    group: 'video', file: 'video-filter.png', ...TABLET_TALL,
    route: () => `/videos/${ID.video}/tagging`,
    prepare: (page) =>
      page.locator('button[aria-label="Filter"]:visible').first().click(),
    // The sheet covers the page from below the stage's top edge; the strip of
    // bench above it is the page behind, not the filter.
    clip: (page) =>
      page.evaluate(() => {
        const sheet = document.querySelector('[role="dialog"]');
        if (!sheet) return null;
        const r = sheet.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      }),
    note: 'The filter: a number on every button, plays, own tags, power play.',
  },
  {
    group: 'video', file: 'video-bibliothek.png',
    viewport: { width: 1280, height: 1500 }, scale: 2,
    route: () => '/videos',
    // Down to the last row, not the viewport: the list ends where the videos
    // end, and a band of empty page under it reads as a missing row.
    clip: (page) => page.evaluate(contentBox),
    note: 'The library as a list: who sees it, how far it is, what went out.',
  },
  {
    group: 'video', file: 'video-versendet.png',
    viewport: { width: 1280, height: 1300 }, scale: 2,
    route: () => '/videos/shares',
    clip: (page) => page.evaluate(contentBox),
    note: 'Every clip that went out, to whom, and whether it was opened.',
  },

  // ── The player side of the video area, shot as a player ──────────────────
  // Its own pass with a linked player account (seed-team-organisation.mjs):
  //   STATIX_EMAIL=spielerin2@statix-app.de … capture --only mediathek
  // spielerin2 because the extras seed addresses one of the clips to her row.
  {
    group: 'mediathek', file: 'mobil-clip-posteingang.png', ...PHONE,
    route: () => '/inbox',
    note: 'A clip from the coach lands in her inbox, next to the team library.',
  },
  {
    group: 'mediathek', file: 'mobil-mediathek.png', ...PHONE,
    route: () => '/team-videos',
    note: 'What the coaching staff released to the squad, some with download.',
  },
];

async function capture() {
  // `--only` takes a group name ("kader") or a file-name fragment ("heroImage"),
  // so a single shot can be re-taken without redoing the whole set.
  const wanted = ONLY
    ? SHOTS.filter((s) => s.group === ONLY || s.file.includes(ONLY))
    : SHOTS;
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
      // `touch` gives a tablet shot a touchscreen without the phone's mobile
      // viewport — the hold gesture only exists for a finger.
      hasTouch: Boolean(shot.mobile || shot.touch),
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

      // `section` crops to the block a heading belongs to. The tournament page
      // puts the table and the schedule side by side, so a viewport shot of
      // either is the same picture — cropping is what makes them two usable
      // assets instead of one duplicated twice.
      let target = page;
      if (shot.section) {
        const handle = await page.evaluateHandle((text) => {
          const h = [...document.querySelectorAll('h1,h2,h3,h4')].find((el) =>
            el.textContent.trim().startsWith(text),
          );
          if (!h) return null;
          let node = h.parentElement;
          // Climb until the block is big enough to be the section itself.
          while (node && node.getBoundingClientRect().height < 220) {
            node = node.parentElement;
          }
          return node;
        }, shot.section);
        const el = handle.asElement();
        if (!el) throw new Error(`section not found: "${shot.section}"`);
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        target = el;
      } else if (shot.selector) {
        target = await page.$(shot.selector);
      }
      // `clip` crops to a box the shot computes from the live layout. Needed
      // where the interesting panel has no heading to climb from and no stable
      // selector of its own — an app-side `data-shot` hook would be product
      // code existing only for this pipeline.
      if (shot.clip) {
        const box = await shot.clip(page);
        if (!box) throw new Error('clip returned no box');
        await page.screenshot({
          path: path.join(PUBLIC_DIR, shot.file),
          clip: box,
        });
        console.log(`✓ ${shot.file}`);
        done++;
        continue;
      }
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
