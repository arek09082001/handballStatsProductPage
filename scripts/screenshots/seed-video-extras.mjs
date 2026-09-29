/**
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS FILE BELONGS IN THE APP REPO (arek09082001/handballStats), not here.
 * It lives alongside the screenshot pipeline because the pipeline cannot
 * produce anything without it; copy it to `scripts/seed-video-extras.mjs`
 * there and run it from that repo, where @prisma/client is installed.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * A layer on top of `seed-video.mjs` for the REST of the video area — the
 * library list, the sent clips, the filter and the player's side of
 * `/funktionen/video-tagging`. `seed-video.mjs` tags one half; a library of one
 * video, with no clip ever sent and nothing released to the squad, is three
 * empty states and not a feature page.
 *
 *   node scripts/seed-demo.mjs
 *   node scripts/seed-video.mjs
 *   node scripts/seed-team-organisation.mjs   # links spielerin1–4 to the squad
 *   node scripts/seed-video-extras.mjs
 *
 * What it adds:
 *  - one recording for each of the four previous finished games, in the states
 *    the library list distinguishes (released to the squad, with download,
 *    clock not yet synced, coaching staff only), three of them tagged;
 *  - a playbook of five set plays, tagged across three videos with outcomes;
 *  - three custom tags ("Abwehrverhalten", …) on two games and the training;
 *  - seven sent clips — to players, one to the coaching staff, one whole match
 *    with download — some opened, some not. One of them is addressed to
 *    jersey #2, which `seed-team-organisation.mjs` links to
 *    spielerin2@statix-app.de: that account's inbox is `mobil-clip-posteingang`.
 *
 * Everything is invented demo data. Deterministic, and a re-run replaces what
 * it wrote itself — except the recordings, which `seed-video.mjs` clears when
 * it runs again, so re-run both together.
 */
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'node:crypto';

const db = new PrismaClient();
const COACH_EMAIL = process.env.SEED_EMAIL || 'demo@statix-app.de';
const DAY = 86_400_000;

let seed = 20260929;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
const pick = (a) => a[Math.floor(rnd() * a.length)];
const daysAgo = (n) => new Date(Date.now() - n * DAY);

/** [code, side, rating, weight] — the same mix as `seed-video.mjs`. */
const MIX = [
  ['goal', 'own', 'good', 9], ['shot_saved', 'own', 'neutral', 5],
  ['shot_missed', 'own', 'bad', 4], ['shot_blocked', 'own', 'bad', 2],
  ['assist', 'own', 'good', 4], ['seven_m_goal', 'own', 'good', 2],
  ['turnover', 'own', 'bad', 4], ['technical_fault', 'own', 'bad', 3],
  ['steal', 'own', 'good', 3], ['block', 'own', 'good', 3],
  ['one_on_one_won', 'own', 'good', 2], ['one_on_one_lost', 'own', 'bad', 2],
  ['save', 'own', 'good', 5], ['goal_conceded', 'opponent', 'bad', 5],
  ['two_min', 'own', 'bad', 2], ['seven_m_drawn', 'own', 'good', 2],
];
const ORIGINS = [
  'left_wing', 'right_wing', 'left_back_9m', 'middle_back_9m',
  'right_back_9m', 'left_back_6m', 'middle_back_6m', 'right_back_6m',
];
const TARGETS = [
  'top_left', 'top_middle', 'top_right',
  'middle_left', 'middle_middle', 'middle_right',
  'bottom_left', 'bottom_middle', 'bottom_right',
];
const PHASES = ['positional', 'wave1', 'wave2', 'wave3', 'breakthrough'];
const DEFENSES = ['6-0', '5-1', '3-2-1'];
const SHOT_CODES = new Set([
  'goal', 'shot_saved', 'shot_missed', 'shot_blocked', 'save', 'goal_conceded',
]);

function drawScene() {
  const total = MIX.reduce((sum, m) => sum + m[3], 0);
  let roll = rnd() * total;
  for (const m of MIX) {
    roll -= m[3];
    if (roll <= 0) return m;
  }
  return MIX[0];
}

/** The library states the list view tells apart, one per extra recording. */
const RECORDINGS = [
  { scenes: 70, squad: true, download: false },
  { scenes: 54, squad: true, download: true },
  { scenes: 0, squad: false, download: false, unsynced: true },
  { scenes: 38, squad: false, download: false },
];

const PLAYS = [
  ['Kreuzen RL–RM', 'Rückraum links kreuzt mit der Mitte, Kreis sperrt rechts.'],
  ['Kempa rechts', 'Anspiel über Rückraum rechts in den Kempa von Außen links.'],
  ['Stoßen 2. Welle', 'Gegenstoß über die Mitte, Rückraum stößt auf die Nahtstellen.'],
  ['Einläufer Außen links', 'Außen läuft zum zweiten Kreis ein, Rückraum rechts übernimmt.'],
  ['7:6 – Tor leer', 'Siebte Feldspielerin für die Torhüterin, Spiel über den Kreis.'],
];

const CUSTOM_TAGS = ['Abwehrverhalten', 'Rückzug', 'Körpersprache'];

async function main() {
  const coach = await db.profile.findFirst({ where: { email: COACH_EMAIL } });
  if (!coach) throw new Error(`No profile for ${COACH_EMAIL} — run seed-demo.mjs first.`);
  const membership = await db.teamMember.findFirst({
    where: { profileId: coach.id },
    orderBy: { createdAt: 'asc' },
  });
  const teamId = membership.teamId;

  const roster = await db.player.findMany({
    where: { teamId, leftAt: null },
    orderBy: { jerseyNumber: 'asc' },
  });
  const keepers = roster.filter((p) => p.position === 'goalkeeper');
  const field = roster.filter((p) => p.position !== 'goalkeeper');
  const staff = await db.teamMember.findMany({
    where: { teamId, profileId: { not: coach.id }, role: { not: 'player' } },
  });

  const main = await db.gameVideo.findFirst({
    where: { teamId, gameId: { not: null } },
    orderBy: { createdAt: 'asc' },
  });
  const training = await db.gameVideo.findFirst({ where: { teamId, gameId: null } });
  if (!main || !training) throw new Error('Run seed-video.mjs first.');

  const games = await db.game.findMany({
    where: { teamId, status: 'finished', id: { not: main.gameId } },
    orderBy: { scheduledAt: 'desc' },
    take: RECORDINGS.length,
  });

  console.log('Clearing previous extras…');
  await db.videoClipShare.deleteMany({ where: { teamId } });
  await db.videoPlay.deleteMany({ where: { teamId } });
  await db.videoTag.deleteMany({ where: { teamId, code: 'custom_tag' } });
  await db.gameVideo.deleteMany({
    where: { teamId, gameId: { in: games.map((g) => g.id) } },
  });

  // ── More recordings, one per earlier game ──────────────────────────────
  const videos = [main];
  for (const [i, game] of games.entries()) {
    const state = RECORDINGS[i];
    const video = await db.gameVideo.create({
      data: {
        teamId,
        gameId: game.id,
        title: `${game.location === 'away' ? 'Auswärts bei' : 'Heimspiel gegen'} ${game.opponentName}`,
        status: 'ready',
        assetKey: randomBytes(16).toString('hex'),
        sourceKey: `raw/${randomBytes(16).toString('hex')}.mp4`,
        contentType: 'video/mp4',
        durationSeconds: (64 + i * 3) * 60,
        sizeBytes: BigInt(2_400_000_000 + i * 310_000_000),
        offsetP1Seconds: state.unsynced ? null : 35 + i * 7,
        offsetP2Seconds: state.unsynced ? null : 33 * 60 + i * 21,
        leadInSeconds: 3,
        uploadedBy: coach.id,
        createdAt: daysAgo((i + 1) * 5),
        readyAt: daysAgo((i + 1) * 5),
        squadVisible: state.squad,
        squadDownload: state.download,
        squadReleasedAt: state.squad ? daysAgo((i + 1) * 4) : null,
      },
    });
    videos.push(video);

    const tags = [];
    let cursor = 60;
    for (let n = 0; n < state.scenes; n++) {
      const [code, side, rating] = drawScene();
      const length = 8 + Math.floor(rnd() * 8);
      const player =
        code === 'save' || code === 'goal_conceded' ? pick(keepers) : pick(field);
      const metadata = {};
      if (SHOT_CODES.has(code)) {
        metadata.shotOrigin = pick(ORIGINS);
        metadata.goalTarget = pick(TARGETS);
      }
      if (rnd() < 0.75) metadata.phase = pick(PHASES);
      if (rnd() < 0.6) metadata.defense = pick(DEFENSES);
      tags.push({
        videoId: video.id, teamId, playerId: player?.id ?? null, code, side,
        startSeconds: cursor, endSeconds: cursor + length, rating,
        label: null, metadata, createdBy: coach.id,
      });
      cursor += length + 14 + Math.floor(rnd() * 30);
    }
    if (tags.length) await db.videoTag.createMany({ data: tags });
  }

  // The first half and the training are released to the squad as well — the
  // player's library needs more than the two extra games in it. Both are
  // backdated too: `seed-video.mjs` creates them "now", and a library whose
  // newest upload is "vor 29 Sekunden" reads like a seed, not a season.
  await db.gameVideo.update({
    where: { id: main.id },
    data: {
      status: 'ready', createdAt: daysAgo(3), readyAt: daysAgo(3),
      squadVisible: true, squadDownload: true, squadReleasedAt: daysAgo(1),
    },
  });
  await db.gameVideo.update({
    where: { id: training.id },
    data: {
      status: 'ready', createdAt: daysAgo(2), readyAt: daysAgo(2),
      squadVisible: true, squadReleasedAt: daysAgo(2),
    },
  });

  // ── The playbook, and where it was run ─────────────────────────────────
  const plays = [];
  for (const [name, description] of PLAYS) {
    plays.push(await db.videoPlay.create({ data: { teamId, name, description, createdBy: coach.id } }));
  }
  const playTags = [];
  for (const video of videos.slice(0, 3)) {
    let at = 120;
    for (let n = 0; n < 14; n++) {
      playTags.push({
        videoId: video.id, teamId, playerId: null, code: 'set_play', side: 'own',
        startSeconds: at, endSeconds: at + 14 + Math.floor(rnd() * 8),
        rating: 'neutral', label: null, metadata: {}, createdBy: coach.id,
        playId: pick(plays).id, playSuccess: rnd() < 0.58,
      });
      at += 150 + Math.floor(rnd() * 90);
    }
  }
  await db.videoTag.createMany({ data: playTags });

  // ── Custom tags: one code, the name in the label ───────────────────────
  const customTags = [];
  for (const video of [...videos.slice(0, 2), training]) {
    let at = 200;
    for (let n = 0; n < 9; n++) {
      customTags.push({
        videoId: video.id, teamId, playerId: pick(roster).id, code: 'custom_tag',
        side: 'own', startSeconds: at, endSeconds: at + 10,
        rating: pick(['good', 'bad', 'neutral']), label: pick(CUSTOM_TAGS),
        metadata: {}, createdBy: coach.id,
      });
      at += 240 + Math.floor(rnd() * 120);
    }
  }
  await db.videoTag.createMany({ data: customTags });

  // ── Sent clips ─────────────────────────────────────────────────────────
  const byNumber = (n) => roster.find((p) => p.jerseyNumber === n) ?? pick(field);
  const SHARES = [
    { video: main, to: byNumber(2), title: 'Deine Abschlüsse aus dem Rückraum', note: 'Schau dir die Wurfauswahl ab Minute 40 an.', filter: { codes: ['goal', 'shot_saved', 'shot_missed'] }, opened: true, ago: 1 },
    { video: main, to: keepers[0], title: 'Paraden 2. Halbzeit', note: 'Stark gegen die Außen!', filter: { codes: ['save'] }, opened: true, ago: 1 },
    { video: main, to: byNumber(4), title: 'Ballverluste gegen 5:1', note: null, filter: { codes: ['turnover', 'technical_fault'] }, opened: false, ago: 2 },
    { video: videos[1], to: field[4], title: 'Gegenstöße – Laufwege', note: 'Früher lösen, dann kommt der Ball.', filter: { codes: ['goal', 'shot_missed'], phases: ['wave1', 'wave2'] }, opened: true, ago: 4 },
    { video: videos[1], to: field[6], title: 'Abwehr 1gg1', note: null, filter: { codes: ['one_on_one_won', 'one_on_one_lost'] }, opened: false, ago: 5, download: true },
    { video: videos[2], to: byNumber(3), title: 'Ganzes Spiel', note: 'Zum Nacharbeiten, gern herunterladen.', whole: true, filter: {}, opened: true, ago: 8, download: true },
  ];
  const rows = SHARES.map((s) => ({
    videoId: s.video.id, teamId, sharedByProfileId: coach.id, recipientPlayerId: s.to.id,
    wholeVideo: Boolean(s.whole), allowDownload: Boolean(s.download),
    title: s.title, note: s.note,
    filter: s.whole ? {} : { ...s.filter, playerIds: [s.to.id] },
    pinnedTagIds: [], excludedTagIds: [], status: 'active',
    createdAt: daysAgo(s.ago),
    readAt: s.opened ? new Date(daysAgo(s.ago).getTime() + 3_600_000) : null,
    openedAt: s.opened ? new Date(daysAgo(s.ago).getTime() + 3_700_000) : null,
  }));
  if (staff[0]) {
    rows.push({
      videoId: main.id, teamId, sharedByProfileId: coach.id, recipientProfileId: staff[0].profileId,
      wholeVideo: false, allowDownload: false,
      title: 'Unsere Kreuzungen – zum Durchsprechen', note: 'Für Donnerstag.',
      filter: { codes: ['set_play'] }, pinnedTagIds: [], excludedTagIds: [], status: 'active',
      createdAt: daysAgo(3), readAt: daysAgo(2), openedAt: daysAgo(2),
    });
  }
  await db.videoClipShare.createMany({ data: rows });

  console.log('\nDone.');
  console.log(`  Recordings: ${videos.length} game videos + the training`);
  console.log(`  Plays:      ${plays.length}, run ${playTags.length} times`);
  console.log(`  Clips sent: ${rows.length}`);
  console.log(`  VIDEO_ID=${main.id}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
