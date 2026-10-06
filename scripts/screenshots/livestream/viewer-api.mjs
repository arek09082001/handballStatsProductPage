// Stand-in for the app's public live API, serving one match in several states
// over the drawn picture in ./media. Based on liveStatixMatches/scripts/stream-bench/states.mjs.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const PORT = Number(process.env.PORT || 4000);
const MEDIA = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../../.screenshots-livestream/media');
export const BASE_DATE = Date.UTC(2026, 9, 3, 18, 40, 0);
const CLOCK0 = 1400; // 23:20 of the first half when the picture starts
let t0 = Date.now();
let startChunks = 50;
const iso = (ms) => new Date(ms).toISOString();
const roster = [
  { playerId: 'p7', firstName: 'Anna', lastName: 'Becker', jerseyNumber: 7, isGoalkeeper: false, position: null },
  { playerId: 'p11', firstName: 'Lea', lastName: 'Schröder', jerseyNumber: 11, isGoalkeeper: false, position: null },
  { playerId: 'p9', firstName: 'Mia', lastName: 'Hoffmann', jerseyNumber: 9, isGoalkeeper: false, position: null },
  { playerId: 'p3', firstName: 'Jana', lastName: 'Wolf', jerseyNumber: 3, isGoalkeeper: false, position: null },
  { playerId: 'p13', firstName: 'Lena', lastName: 'Krüger', jerseyNumber: 13, isGoalkeeper: false, position: null },
  { playerId: 'p16', firstName: 'Sophie', lastName: 'Neumann', jerseyNumber: 16, isGoalkeeper: true, position: null },
];
let n = 0;
// s: seconds relative to the start of the picture (negative = before the stream).
function ev(s, statCode, counts = {}, playerId = null) {
  n += 1;
  return {
    id: `e${n}`, playerId, statCode,
    counts: { goal: false, goalConceded: false, save: false, shot: false, ...counts },
    period: 1, gameTimeSeconds: CLOCK0 + s, metadata: {},
    createdAt: iso(BASE_DATE + s * 1000 + 4000), recordedAt: iso(BASE_DATE + s * 1000),
  };
}
const G = (s, p) => ev(s, 'goal', { goal: true, shot: true }, p);
const M = (s, p) => ev(s, 'shot_missed', { shot: true }, p);
const C = (s) => ev(s, 'goal_conceded', { goalConceded: true }, 'p16');
const S = (s) => ev(s, 'save', { save: true }, 'p16');
// Before the stream: 12:11, Becker 3 goals from 4 shots (goal, miss, goal, goal).
const pre = [];
const ours = ['p9', 'p7', 'p11', 'p3', 'p9', 'p13', 'p7', 'p11', 'p9', 'p7', 'p13', 'p3'];
let s = -1300;
for (let i = 0; i < 12; i++) { pre.push(G(s, ours[i])); s += 45; pre.push(C(s)); s += 40; if (i === 3) { pre.push(M(s, 'p7')); s += 20; } if (i % 3 === 1) { pre.push(S(s)); s += 15; } if (i % 2 === 0) { pre.push(M(s, ['p9','p11','p3','p13'][(i/2)%4])); s += 12; } }
pre.pop(); // 12:11 instead of 12:12
const EVENTS = [
  ...pre.filter((e) => Date.parse(e.recordedAt) < BASE_DATE - 30_000),
  G(6, 'p7'),               // Becker: third goal in a row, 4/5
  C(24),
  ev(34, 'opponent_two_min'),
  S(44),
  ev(56, 'team_timeout'),
  G(96, 'p13'),
];
function snapshot(state) {
  const now = Date.now();
  const scheduled = state === 'scheduled';
  const played = state === 'live' || state === 'ended';
  const stream = {
    scheduled: { status: 'waiting', playlistUrl: null, startedAt: null },
    live: { status: 'live', playlistUrl: `http://localhost:${PORT}/media.m3u8`, startedAt: iso(BASE_DATE) },
    ended: { status: 'ended', playlistUrl: `http://localhost:${PORT}/media.m3u8?vod=1`, startedAt: iso(BASE_DATE) },
  }[state];
  const goals = (side) => EVENTS.filter((e) => (side === 'us' ? e.counts.goal : e.counts.goalConceded)).length;
  return {
    fingerprint: `f-${state}`,
    serverNow: iso(now),
    game: {
      slug: state, teamName: 'VfL Brambauer', teamLogoUrl: null, opponentName: 'TuS Westfalia', opponentLogoUrl: null,
      location: 'home', status: { scheduled: 'scheduled', live: 'live', ended: 'finished' }[state], type: 'league',
      scheduledAt: iso(scheduled ? now + (1 * 3600 + 12 * 60 + 41) * 1000 : now - 30 * 60_000),
      halves: 2, halfSeconds: 1800,
      ourScore: played ? (state === 'ended' ? 27 : goals('us')) : 0,
      opponentScore: played ? (state === 'ended' ? 23 : goals('them')) : 0,
      clock: { clockSeconds: played ? (state === 'ended' ? 3600 : CLOCK0 + 60) : 0, isRunning: state === 'live', period: state === 'ended' ? 2 : 1, clockUpdatedAt: iso(now) },
      ourShirtColor: 'orange', opponentShirtColor: 'blue',
      venue: { name: 'Sporthalle Brambauer', address: 'Wittekindstraße 12, 44536 Lünen' },
    },
    roster,
    events: played ? EVENTS : [],
    substitutions: [],
    format: 'stream',
    stream,
    clockLog: played ? [{ at: iso(BASE_DATE - 400_000), s: CLOCK0 - 400, run: true }] : undefined,
  };
}
function playlist(vod) {
  const count = vod ? 60 : Math.min(60, startChunks + Math.floor((Date.now() - t0) / 2000));
  const lines = ['#EXTM3U', '#EXT-X-VERSION:9', '#EXT-X-TARGETDURATION:2', '#EXT-X-MEDIA-SEQUENCE:0'];
  if (vod) lines.push('#EXT-X-PLAYLIST-TYPE:VOD');
  lines.push('#EXT-X-MAP:URI="/media/main/init.mp4"');
  for (let i = 0; i < count; i++) lines.push(`#EXT-X-PROGRAM-DATE-TIME:${iso(BASE_DATE + i * 2000)}`, '#EXTINF:2.000,', `/media/main/${i}.m4s`);
  if (vod) lines.push('#EXT-X-ENDLIST');
  return lines.join('\n') + '\n';
}
const STATES = ['scheduled', 'live', 'ended'];
http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const send = (status, body, type) => { res.writeHead(status, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type', 'Cache-Control': 'no-store', 'Content-Type': type }); res.end(body); };
  if (req.method === 'OPTIONS') return send(204, '', 'text/plain');
  const p = url.pathname;
  const snap = /^\/api\/public\/live\/([a-z]+)$/.exec(p);
  if (snap && STATES.includes(snap[1])) return send(200, JSON.stringify(snapshot(snap[1])), 'application/json');
  if (/^\/api\/public\/live\/[a-z]+\/sponsors$/.test(p)) return send(200, '{}', 'application/json');
  if (/^\/api\/public\/live\/[a-z]+\/heartbeat$/.test(p)) return send(204, '', 'text/plain');
  if (p === '/__reset') { t0 = Date.now(); startChunks = Number(url.searchParams.get('start') || 50); return send(204, '', 'text/plain'); }
  if (p === '/media.m3u8') return send(200, playlist(url.searchParams.has('vod')), 'application/vnd.apple.mpegurl');
  const m = /^\/media\/main\/(init\.mp4|\d+\.m4s)$/.exec(p);
  if (m) { const f = path.join(MEDIA, 'main', m[1]); if (!fs.existsSync(f)) return send(404, 'no', 'text/plain'); return send(200, fs.readFileSync(f), 'video/mp4'); }
  send(404, 'not found', 'text/plain');
}).listen(PORT, () => console.log(`stand-in API on :${PORT}`));
