/**
 * The app's real game statistics (`StatsView`) over an invented, finished game.
 *
 * Built against the app repo like the live control room
 * (`node scripts/screenshots/livestream/regie/build.mjs <this file> statistik`).
 * Nothing here is drawn: the cards, tables and panels are the app's
 * components, fed through the recording store and a mocked API — the xG/xS
 * balance, the shot maps and the lineup analysis are computed by the app's
 * own rules from the events below.
 *
 * The game is invented on purpose (placeholder clubs, invented names) and
 * deterministic: a seeded generator, so two runs give the same picture.
 */
import { createRoot } from 'react-dom/client';
import { NextIntlClientProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import messages from '@/messages/de.json';
import StatsView from '@/features/games/recording/components/stats-view';
import { useRecordingStore } from '@/features/games/recording/store/recording-store';
import { useSettingsStore } from '@/lib/stores/settings-store';
import { STAT_TYPES, statId } from '@/scripts/shots/seed';
import type { GameEvent, GameSubstitution, RosterEntry } from '@/features/games/recording/types';
import type { PlayerPosition } from '@/lib/types/roster-player';

// ── a seeded generator ────────────────────────────────────────────────────
// `#seed=…` picks another game; the shots on the site use the default.
const SEED = Number(new URLSearchParams(location.hash.slice(1)).get('seed') ?? 17);
let state = SEED;
const rand = () => {
  state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
  return state / 4294967296;
};
const pick = <T,>(items: T[], weights: number[]) => {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < items.length; i += 1) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
};

// ── the squad ─────────────────────────────────────────────────────────────
interface P { first: string; last: string; nr: number; pos: PlayerPosition; starter: boolean; keeper?: boolean; skill: number }
const PLAYERS: P[] = [
  { first: 'Mira', last: 'Halden', nr: 1, pos: 'goalkeeper', starter: true, keeper: true, skill: 0.05 },
  { first: 'Jule', last: 'Behrens', nr: 7, pos: 'left_wing', starter: true, skill: 0.08 },
  { first: 'Nele', last: 'Arndt', nr: 9, pos: 'left_back', starter: true, skill: 0.04 },
  { first: 'Svea', last: 'Kroll', nr: 10, pos: 'center_back', starter: true, skill: 0.1 },
  { first: 'Tomke', last: 'Rieger', nr: 14, pos: 'right_back', starter: true, skill: -0.06 },
  { first: 'Lina', last: 'Vosskamp', nr: 18, pos: 'right_wing', starter: true, skill: 0.02 },
  { first: 'Frieda', last: 'Ostmann', nr: 22, pos: 'pivot', starter: true, skill: 0.06 },
  { first: 'Kea', last: 'Brandt', nr: 16, pos: 'goalkeeper', starter: false, keeper: true, skill: -0.02 },
  { first: 'Ronja', last: 'Selk', nr: 4, pos: 'left_back', starter: false, skill: 0.03 },
  { first: 'Hanna', last: 'Wiese', nr: 5, pos: 'center_back', starter: false, skill: -0.04 },
  { first: 'Ida', last: 'Pfeiffer', nr: 11, pos: 'right_wing', starter: false, skill: 0.05 },
  { first: 'Maret', last: 'Duhnen', nr: 23, pos: 'pivot', starter: false, skill: -0.02 },
  { first: 'Pia', last: 'Lorenz', nr: 3, pos: 'left_wing', starter: false, skill: 0 },
  { first: 'Wiebke', last: 'Sander', nr: 13, pos: 'right_back', starter: false, skill: 0.07 },
];
const id = (i: number) => `player-${i}`;
const byNr = (nr: number) => PLAYERS.findIndex((p) => p.nr === nr);

const ROSTER: RosterEntry[] = PLAYERS.map((p, i) => ({
  id: `roster-${i}`,
  playerId: id(i),
  firstName: p.first,
  lastName: p.last,
  jerseyNumber: p.nr,
  isGoalkeeper: Boolean(p.keeper),
  photoUrl: null,
  naturalPosition: p.pos,
  isStarter: p.starter,
  position: p.starter ? p.pos : null,
  secondsPlayed: 0,
  onCourtSince: p.starter ? 0 : null,
  attackPosition: p.starter ? p.pos : null,
  defensePosition: null,
}));

// ── substitutions: [minute, in, out] by jersey number ──────────────────────
const SUBS: Array<[number, number, number]> = [
  [11, 4, 9], [16, 11, 18], [21, 23, 22], [25, 13, 14],
  [30, 9, 4], [30, 18, 11], [30, 22, 23], [30, 14, 13],
  [37, 5, 10], [41, 3, 7], [44, 16, 1], [47, 10, 5], [49, 13, 14],
  [53, 7, 3], [55, 4, 9],
];
const SUBSTITUTIONS: GameSubstitution[] = SUBS.map(([m, pin, pout], i) => ({
  id: `sub-${i}`,
  playerInId: id(byNr(pin)),
  playerOutId: id(byNr(pout)),
  period: m < 30 ? 1 : 2,
  gameTimeSeconds: m * 60 + (i % 3) * 7,
}));

function onCourt(seconds: number): number[] {
  const court = new Set(PLAYERS.map((p, i) => (p.starter ? i : -1)).filter((i) => i >= 0));
  for (const sub of SUBSTITUTIONS) {
    if ((sub.gameTimeSeconds ?? 0) > seconds) break;
    court.delete(Number(sub.playerOutId.split('-')[1]));
    court.add(Number(sub.playerInId.split('-')[1]));
  }
  return [...court];
}

// ── the events ─────────────────────────────────────────────────────────────
const XG: Record<string, number> = {
  left_wing: 0.62, right_wing: 0.63, left_back_6m: 0.5, middle_back_6m: 0.49, right_back_6m: 0.5,
  left_back_9m: 0.44, middle_back_9m: 0.43, right_back_9m: 0.42, seven_m: 0.75,
};
const ORIGINS: Record<string, string[]> = {
  left_wing: ['left_wing'], right_wing: ['right_wing'], pivot: ['middle_back_6m'],
  left_back: ['left_back_9m', 'left_back_9m', 'left_back_6m'],
  center_back: ['middle_back_9m', 'middle_back_6m', 'middle_back_9m'],
  right_back: ['right_back_9m', 'right_back_9m', 'right_back_6m'],
};
const SHOOT_WEIGHT: Record<string, number> = {
  left_wing: 1.1, right_wing: 1.1, pivot: 1.2, left_back: 1.6, center_back: 1.4, right_back: 1.5,
};
const ZONES = ['top_left', 'top_center', 'top_right', 'middle_left', 'middle_center', 'middle_right', 'bottom_left', 'bottom_center', 'bottom_right'];

let seq = 0;
const START = Date.UTC(2026, 9, 3, 17, 0, 0);
function ev(code: string, s: number, player: number | null, metadata: Record<string, unknown> = {}): GameEvent {
  seq += 1;
  return {
    id: `ev-${seq}`,
    gameId: 'g1',
    playerId: player == null ? null : id(player),
    statTypeId: statId(code),
    statCode: code,
    period: s < 1800 ? 1 : 2,
    gameTimeSeconds: s,
    value: 1,
    metadata,
    createdAt: new Date(START + s * 1000).toISOString(),
  };
}

function buildEvents(): GameEvent[] {
  const events: GameEvent[] = [];
  let ours = 0;
  let theirs = 0;
  for (let s = 35; s < 3590; s += 38 + Math.floor(rand() * 34)) {
    const court = onCourt(s);
    const field = court.filter((i) => !PLAYERS[i].keeper);
    const keeper = court.find((i) => PLAYERS[i].keeper) ?? 0;
    // Our attack.
    if (rand() < 0.78) {
      const fastBreak = rand() < 0.1;
      const sevenM = !fastBreak && rand() < 0.08;
      const shooter = sevenM
        ? (court.includes(byNr(10)) ? byNr(10) : byNr(5))
        : pick(field, field.map((i) => SHOOT_WEIGHT[PLAYERS[i].pos] ?? 1));
      const origin = sevenM ? 'seven_m' : fastBreak ? 'middle_back_6m' : pick(ORIGINS[PLAYERS[shooter].pos], ORIGINS[PLAYERS[shooter].pos].map(() => 1));
      const chance = (fastBreak ? 0.85 : XG[origin]) + PLAYERS[shooter].skill;
      const goal = rand() < chance;
      const meta: Record<string, unknown> = { shotOrigin: origin };
      if (goal || rand() < 0.6) meta.goalTarget = pick(ZONES, [3, 1, 3, 1.5, 0.5, 1.5, 3, 1, 3]);
      if (goal && !sevenM && !fastBreak && rand() < 0.55) {
        const passers = field.filter((i) => i !== shooter && ['center_back', 'left_back', 'right_back', 'pivot'].includes(PLAYERS[i].pos));
        if (passers.length) meta.assistBy = id(pick(passers, passers.map((i) => (PLAYERS[i].pos === 'center_back' ? 3 : 1))));
      }
      const code = sevenM
        ? goal ? 'seven_m_goal' : 'seven_m_missed'
        : fastBreak
          ? goal ? 'fast_break_goal' : 'fast_break_missed'
          : goal ? 'goal' : pick(['shot_saved', 'shot_missed', 'shot_blocked'], [5, 3, 1.5]);
      events.push(ev(code, s, shooter, meta));
      // The assist is its own event in the app, pointing back at the scorer.
      if (typeof meta.assistBy === 'string') {
        events.push(ev('assist', s, Number(meta.assistBy.split('-')[1]), { assistFor: id(shooter) }));
      }
      if (goal) ours += 1;
    } else if (rand() < 0.5) {
      events.push(ev('technical_fault', s, pick(field, field.map(() => 1))));
    }
    // Their attack, 20 seconds later.
    const t = s + 18 + Math.floor(rand() * 10);
    if (rand() < 0.66) {
      const origin = pick(Object.keys(XG), [1, 1, 1, 1.3, 1, 1.6, 1.8, 1.6, 0.6]);
      const scored = rand() < XG[origin] + 0.02 - PLAYERS[keeper].skill;
      const meta = { shotOrigin: origin, opponentNumber: pick([4, 7, 9, 11, 17, 23], [1, 2, 3, 1, 2, 1]), goalTarget: pick(ZONES, [2, 1, 2, 1, 1, 1, 2, 1, 2]) };
      events.push(ev(scored ? 'goal_conceded' : 'save', t, keeper, meta));
      if (scored) theirs += 1;
    } else {
      const defenders = field.filter((i) => PLAYERS[i].pos !== 'left_wing' && PLAYERS[i].pos !== 'right_wing');
      events.push(ev(rand() < 0.6 ? 'steal' : 'block', t, pick(defenders, defenders.map(() => 1))));
    }
  }
  (window as unknown as { __score: [number, number] }).__score = [ours, theirs];
  return events;
}

const EVENTS = buildEvents();

// Minutes played from the same substitutions, so the table's minutes column is filled.
for (const [index, entry] of ROSTER.entries()) {
  let seconds = 0;
  for (let t = 0; t < 3600; t += 10) if (onCourt(t).includes(index)) seconds += 10;
  entry.secondsPlayed = seconds;
  (entry as RosterEntry & { playingTimeSeconds?: number }).playingTimeSeconds = seconds;
  entry.onCourtSince = null;
}

useRecordingStore.getState().hydrate({
  gameId: 'g1',
  teamId: 'team-1',
  info: {
    teamName: 'HSG Muster',
    opponentName: 'SV Beispiel',
    status: 'finished',
    type: 'championship',
    halves: 2,
    halfSeconds: 1800,
    isPublic: false,
    detailMode: true,
    location: 'home',
  } as never,
  statTypes: STAT_TYPES,
  roster: ROSTER,
  events: EVENTS,
  clock: { clockSeconds: 3600, isRunning: false, period: 2 },
});
useSettingsStore.getState().setRecordingMode('detailed');

// ── the API, mocked ────────────────────────────────────────────────────────
const unknown = new Set<string>();
axios.defaults.adapter = async (config) => {
  const url = new URL((config.baseURL || '') + (config.url || ''), location.href);
  const p = url.pathname;
  let data: unknown = {};
  if (p === '/api/games/g1/substitutions') data = { substitutions: SUBSTITUTIONS };
  else if (p === '/api/teams/plan') data = {};
  else unknown.add(`${(config.method || 'get').toUpperCase()} ${p}`);
  (window as unknown as { __unknown: string[] }).__unknown = [...unknown];
  return { data, status: 200, statusText: 'OK', headers: {}, config, request: {} } as never;
};

const qc = new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } } });
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={qc}>
    <NextIntlClientProvider locale='de' messages={messages} timeZone='Europe/Berlin' now={new Date(START + 7200_000)}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 24 }}>
        <StatsView />
      </div>
    </NextIntlClientProvider>
  </QueryClientProvider>,
);
