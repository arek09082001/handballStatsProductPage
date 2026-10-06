import { createRoot } from 'react-dom/client';
import { NextIntlClientProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import messages from '@/messages/de.json';
import LiveDirectorPage from '@/features/games/live/live-director-page';
import { serializeLiveSession } from '@/lib/live/serialize';
import axios from 'axios';
import { colourHallPair } from './colour-hall';
import { defaultCalibration, type StitchCalibration } from '@/lib/video/stitch-calibration';
import { fitSeam, grayFromRgba, seamImage } from '@/lib/video/stitch-autofit';

const scenario = location.hash.slice(1) || 'setup';
const NOW = Date.now();
const ago = (s: number) => new Date(NOW - s * 1000);
let created = scenario === 'live' || scenario === 'panorama';
const panorama = scenario === 'panorama';
let hall: { left: string; right: string } | null = null;
let stitch: StitchCalibration | null = null;

/**
 * The seam for the rendered rig, found the way the app's tests find it
 * (`stitch-autofit.test.ts`): from the default position, with the lens the
 * hall was filmed with (equidistant fisheye, focal = half the width).
 */
async function fitHall(canvases: { left: HTMLCanvasElement; right: HTMLCanvasElement }, scale: number) {
  const w = canvases.left.width;
  const h = canvases.left.height;
  const base = defaultCalibration(w, h);
  const lens = { ...base.left_uniforms, fx: w / 2, fy: w / 2 };
  const from: StitchCalibration = { ...base, left_uniforms: lens, right_uniforms: { ...lens } };
  const gray = (c: HTMLCanvasElement) =>
    seamImage(grayFromRgba(c.getContext('2d')!.getImageData(0, 0, w, h).data, w, h));
  const fit = await fitSeam(from, gray(canvases.left), gray(canvases.right));
  (window as any).__fit = { verdict: fit.verdict };
  // Fitted at the tests' 320 × 180; only the lens is in pixels.
  const up = (u: StitchCalibration['left_uniforms']) => ({
    ...u, width: u.width * scale, height: u.height * scale,
    fx: u.fx * scale, fy: u.fy * scale, cx: u.cx * scale, cy: u.cy * scale,
  });
  return { ...fit.calibration, left_uniforms: up(fit.calibration.left_uniforms), right_uniforms: up(fit.calibration.right_uniforms) };
}

function cam(role: 'left' | 'right', paired: boolean, sending: boolean) {
  return {
    role, pairExpiresAt: new Date(NOW + 3600_000), pairedAt: paired ? ago(300) : null, lastSeenAt: paired ? ago(1) : null,
    batteryLevel: paired ? (role === 'left' ? 0.86 : 0.74) : null, batteryCharging: paired ? true : null,
    levelPitch: paired ? -9.5 : null, levelRoll: paired ? 0.4 : null,
    captureWidth: paired ? 3840 : null, captureHeight: paired ? 2160 : null, captureFps: paired ? 30 : null,
    captureMaxWidth: paired ? 3840 : null, captureMaxHeight: paired ? 2160 : null, captureMaxFps: paired ? 60 : null,
    uplinkKbps: paired ? 18400 : null, uplinkAt: paired ? ago(200) : null,
    clockOffsetMs: paired ? 12 : null, clockRttMs: paired ? 38 : null,
    previewKey: paired ? `p-${role}` : null, previewAt: paired ? ago(1) : null,
    calibSeq: panorama ? 1 : null, calibKey: panorama ? `c-${role}` : null, calibCapturedAt: panorama ? ago(20) : null,
    calibWidth: panorama ? 1280 : null, calibHeight: panorama ? 720 : null, calibLevelPitch: panorama ? -16 : null, calibLevelRoll: panorama ? 0 : null,
    queueCount: sending ? 0 : null, queueBytes: sending ? BigInt(0) : null, queueOldestAt: null, queueEmpty: sending ? true : null,
    sendRung: sending ? '1080p30' : null, bitrateKbps: sending ? 6000 : null, encoderState: sending ? 'encoding' : null,
    storageFreeBytes: paired ? BigInt(41_000_000_000) : null,
    lowState: null, lowBitrateKbps: null, lowQueueCount: null, lowBacklogMs: null,
    lockCommand: null, lockReport: null, encoderError: null, lensCommand: null, lensReport: paired ? { seq: 0, available: ['main', 'ultrawide'], active: 'ultrawide', error: null } : null,
  };
}

function state() {
  if (!created) return { publicFormat: 'stream', session: null, publicLink: { isPublic: true, url: 'https://live.statix-app.de/hsg-muster-sv-beispiel' } };
  const live = scenario === 'live';
  const session = {
    id: 's1', gameId: 'g1', mode: 'panorama', status: live ? 'live' : 'setup', createdAt: ago(900), leaseUntil: new Date(NOW + 60_000), endedAt: null,
    tabletClockOffsetMs: 8, tabletClockRttMs: 31, captureProfile: 'uhd30', uplinkProbeRequestedAt: null,
    stitchCalibration: stitch, stitchCalibratedAt: live ? ago(700) : stitch ? ago(5) : null, stitchFromVenueAt: null, calibShotSeq: panorama ? 1 : 0, calibShotAt: panorama ? ago(24) : null,
    panoramaActiveUntil: null, isTrial: false, captureStartedAt: live ? ago(1532) : null, captureStoppedAt: null, trialReport: null,
    programRole: null, lowRendition: true, audioMode: 'ambient', autoLock: true,
    podWorkerId: live ? 'w1' : null, podHeartbeatAt: live ? ago(2) : null, podRequestedAt: live ? ago(800) : null, podReleasedAt: null,
    podState: live ? 'running' : null, podDetail: live ? { lagSeconds: 12, width: 1920, height: 1080, encoder: 'nvenc', confirmed: 760, failed: 0 } : null,
    podError: null, programRecording: null, libraryImportedAt: null,
  };
  const cams = [cam('left', true, live), cam('right', live || panorama, live)];
  const stats = new Map(live ? [
    ['left', { count: 766, bytes: 1_150_000_000, lastCapturedEnd: ago(2), audioCodec: 'mp4a.40.2', latency: { p50Ms: 2600, p95Ms: 3400, samples: 60 }, recentKbps: 5900 }],
    ['right', { count: 765, bytes: 1_140_000_000, lastCapturedEnd: ago(2), audioCodec: 'mp4a.40.2', latency: { p50Ms: 2800, p95Ms: 3700, samples: 60 }, recentKbps: 5800 }],
  ] : []);
  const viewers = live ? { viewers: 143, reporting: 131, lagP50Ms: 9800, lagP95Ms: 14200, stallsPerMin: 0.1, errors: {}, lowShare: 0.18 } : null;
  const s = serializeLiveSession(session as never, cams as never, new Date(NOW), panorama && hall
      ? { preview: { left: hall.left, right: hall.right }, calib: { left: hall.left, right: hall.right } }
      : { preview: { left: '/left.png', right: live ? '/right.png' : null } },
    { id: 'v1', name: 'Sporthalle Nord' }, stats as never, viewers as never, live ? { output: 'delivering', covered: true } : null);
  return { publicFormat: 'stream', session: s, publicLink: { isPublic: true, url: 'https://live.statix-app.de/hsg-muster-sv-beispiel' } };
}

const unknown = new Set<string>();
const realFetch = window.fetch.bind(window);
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url, location.href);
  const method = (init?.method || 'GET').toUpperCase();
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body, (_k, v) => (typeof v === 'bigint' ? Number(v) : v)), { status, headers: { 'content-type': 'application/json' } });
  const p = url.pathname;
  if (!p.startsWith('/api/')) return realFetch(input, init);
  if (p === '/api/live/games/g1' && method === 'GET') return json(state());
  if (p === '/api/live/sessions' && method === 'POST') { created = true; const st = state(); return json({ session: st.session, tokens: { left: 'tokL3ft9x', right: 'tokR1ght7y' } }); }
  if (p === '/api/games/g1') return json({ id: 'g1', teamName: 'HSG Muster', opponentName: 'SV Beispiel', opponentScore: 0, ourScore: 0, status: 'live', scheduledAt: new Date(NOW).toISOString(), location: 'home', halves: 2, halfSeconds: 1800, isPublic: true, publicFormat: 'stream' });
  if (p === '/api/teams/sponsors') return json({ sponsors: [], inherited: [] });
  if (p.includes('/library')) return json({ state: 'none', sessionId: null, videos: [] });
  if (p.includes('clock')) return json({ serverTime: new Date().toISOString(), now: Date.now() });
  unknown.add(`${method} ${p}`);
  (window as any).__unknown = [...unknown];
  return json({});
};

axios.defaults.adapter = async (config) => {
  const url = (config.baseURL || '') + (config.url || '');
  const res = await window.fetch(url, { method: config.method, body: config.data });
  const data = await res.json();
  if (res.status >= 400) throw Object.assign(new Error('mock ' + res.status), { response: { status: res.status, data }, config });
  return { data, status: res.status, statusText: 'OK', headers: {}, config, request: {} } as never;
};
async function main() {
if (panorama) {
  hall = await colourHallPair();
  stitch = await fitHall((await colourHallPair(320, 180)).canvases, 4);
}
const qc = new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } } });
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={qc}>
    <NextIntlClientProvider locale='de' messages={messages} timeZone='Europe/Berlin' now={new Date(NOW)}>
      <LiveDirectorPage gameId='g1' />
    </NextIntlClientProvider>
  </QueryClientProvider>,
);
}
void main();
