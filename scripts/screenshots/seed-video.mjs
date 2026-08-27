/**
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS FILE BELONGS IN THE APP REPO (arek09082001/handballStats), not here.
 * It lives alongside the screenshot pipeline because the pipeline cannot
 * produce anything without it; copy it to `scripts/seed-video.mjs` there and
 * run it from that repo, where @prisma/client is installed.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Seeds the **video tagging** beta with a tagged match, so the marketing
 * screenshots show a populated tagging bench — lanes, scenes, playlists —
 * instead of the empty state a fresh account sees.
 *
 *   node scripts/seed-demo.mjs && node scripts/seed-video.mjs
 *
 * What it does NOT do is put a file in object storage. Playback goes through
 * a presigned R2 URL (`lib/video/playback.ts`), and R2 is not something a
 * local instance has — so the stage stays on its pending state and every shot
 * taken here is of the WORKBENCH: the catalogue, the lanes, the filter, the
 * playlists. The moving picture on the product page is a drawn mock
 * (`features/funktionen/components/tagging-bench-mock.tsx`) that says so itself
 * — the honest way to show a beta whose storage tier the screenshot machine
 * cannot reach.
 *
 * Everything here is invented demo data. Deterministic: a re-run replaces the
 * rows it wrote itself and produces the same bench again.
 */
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'node:crypto';

const db = new PrismaClient();

const COACH_EMAIL = process.env.SEED_EMAIL || 'demo@statix-app.de';

/** Deterministic PRNG — the same match gets tagged the same way every run. */
let seed = 20260827;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
const pick = (a) => a[Math.floor(rnd() * a.length)];

/**
 * The scenes a coach actually files, in the mix a real second half produces:
 * mostly finishes, a run of turnovers, the keeper, and the two possession
 * sequences that frame them.
 */
const SCENE_MIX = [
  { code: 'goal', side: 'own', rating: 'good', weight: 9 },
  { code: 'shot_saved', side: 'own', rating: 'neutral', weight: 5 },
  { code: 'shot_missed', side: 'own', rating: 'bad', weight: 4 },
  { code: 'shot_blocked', side: 'own', rating: 'bad', weight: 2 },
  { code: 'post', side: 'own', rating: 'neutral', weight: 1 },
  { code: 'assist', side: 'own', rating: 'good', weight: 4 },
  { code: 'seven_m_goal', side: 'own', rating: 'good', weight: 2 },
  { code: 'turnover', side: 'own', rating: 'bad', weight: 4 },
  { code: 'technical_fault', side: 'own', rating: 'bad', weight: 3 },
  { code: 'steal', side: 'own', rating: 'good', weight: 3 },
  { code: 'block', side: 'own', rating: 'good', weight: 3 },
  { code: 'one_on_one_won', side: 'own', rating: 'good', weight: 2 },
  { code: 'one_on_one_lost', side: 'own', rating: 'bad', weight: 2 },
  { code: 'save', side: 'own', rating: 'good', weight: 5 },
  { code: 'goal_conceded', side: 'opponent', rating: 'bad', weight: 5 },
  { code: 'two_min', side: 'own', rating: 'bad', weight: 2 },
  { code: 'seven_m_drawn', side: 'own', rating: 'good', weight: 2 },
  { code: 'timeout', side: 'own', rating: 'neutral', weight: 1 },
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
const PHASES = ['positional', 'wave1', 'wave2', 'wave3', 'breakthrough', 'fast_throw_off'];
const DEFENSES = ['6-0', '5-1', '3-2-1', '4-2'];
const TACTICS = ['crossing', 'parallel', 'pivot_pass', 'screen', 'runner', 'one_on_one'];
const STRENGTHS = ['even', 'even', 'even', 'power_play', 'short_handed'];

/** A weighted draw over `SCENE_MIX`. */
function drawScene() {
  const total = SCENE_MIX.reduce((sum, s) => sum + s.weight, 0);
  let roll = rnd() * total;
  for (const scene of SCENE_MIX) {
    roll -= scene.weight;
    if (roll <= 0) return scene;
  }
  return SCENE_MIX[0];
}

const SHOT_CODES = new Set([
  'goal', 'shot_saved', 'shot_missed', 'shot_blocked', 'post',
  'save', 'goal_conceded',
]);

async function main() {
  const coach = await db.profile.findFirst({ where: { email: COACH_EMAIL } });
  if (!coach) {
    throw new Error(
      `No profile for ${COACH_EMAIL} — run \`node scripts/seed-demo.mjs\` first.`,
    );
  }

  const membership = await db.teamMember.findFirst({
    where: { profileId: coach.id },
    orderBy: { createdAt: 'asc' },
  });
  if (!membership) throw new Error('The demo coach has no team membership.');
  const teamId = membership.teamId;

  const roster = await db.player.findMany({
    where: { teamId, leftAt: null },
    orderBy: { jerseyNumber: 'asc' },
  });
  const keepers = roster.filter((p) => p.position === 'goalkeeper');
  const field = roster.filter((p) => p.position !== 'goalkeeper');

  const game = await db.game.findFirst({
    where: { teamId, status: 'finished' },
    orderBy: { scheduledAt: 'desc' },
  });

  console.log('Clearing previous video demo data…');
  await db.videoTag.deleteMany({ where: { teamId } });
  await db.videoPlaylist.deleteMany({ where: { teamId } });
  await db.videoMarker.deleteMany({ where: { teamId } });
  await db.gameVideo.deleteMany({ where: { teamId } });

  // 62 minutes of match, the length of a phone recording of a second half plus
  // warm-up. `queued` is the first status the player treats as playable, which
  // is what puts the bench into its working state rather than its upload state.
  const DURATION = 62 * 60;

  const video = await db.gameVideo.create({
    data: {
      teamId,
      gameId: game?.id ?? null,
      title: game
        ? `Heimspiel gegen ${game.opponentName} — 2. Halbzeit`
        : 'Heimspiel — 2. Halbzeit',
      status: 'queued',
      assetKey: randomBytes(16).toString('hex'),
      sourceKey: `raw/${randomBytes(16).toString('hex')}.mp4`,
      contentType: 'video/mp4',
      durationSeconds: DURATION,
      sizeBytes: BigInt(2_950_000_000),
      offsetP1Seconds: 42,
      offsetP2Seconds: 31 * 60 + 18,
      leadInSeconds: 3,
      uploadedBy: coach.id,
      readyAt: new Date(),
    },
  });

  // A second recording, unassigned: the library is a library, not a game list.
  await db.gameVideo.create({
    data: {
      teamId,
      gameId: null,
      title: 'Training — Abwehrverschieben 5:1',
      status: 'queued',
      assetKey: randomBytes(16).toString('hex'),
      sourceKey: `raw/${randomBytes(16).toString('hex')}.mp4`,
      contentType: 'video/mp4',
      durationSeconds: 24 * 60,
      sizeBytes: BigInt(1_120_000_000),
      leadInSeconds: 3,
      uploadedBy: coach.id,
      readyAt: new Date(),
    },
  });

  // ── The scenes ───────────────────────────────────────────────────────────
  const tags = [];
  let cursor = 90;
  while (cursor < DURATION - 120) {
    const scene = drawScene();
    const length = scene.code === 'timeout' ? 20 : 8 + Math.floor(rnd() * 8);
    const isKeeperCode = scene.code === 'save' || scene.code === 'goal_conceded';
    const player =
      scene.code === 'timeout'
        ? null
        : isKeeperCode
          ? pick(keepers.length ? keepers : roster)
          : pick(field.length ? field : roster);

    const metadata = {};
    if (SHOT_CODES.has(scene.code)) {
      metadata.shotOrigin = pick(ORIGINS);
      if (scene.code === 'goal' || scene.code === 'goal_conceded') {
        metadata.goalTarget = pick(TARGETS);
      }
    }
    if (scene.code === 'turnover' || scene.code === 'technical_fault') {
      metadata.shotOrigin = pick(ORIGINS);
    }
    if (rnd() < 0.75) metadata.phase = pick(PHASES);
    if (rnd() < 0.6) metadata.defense = pick(DEFENSES);
    if (rnd() < 0.4) metadata.tactic = pick(TACTICS);
    if (rnd() < 0.5) metadata.strength = pick(STRENGTHS);

    tags.push({
      videoId: video.id,
      teamId,
      playerId: player?.id ?? null,
      code: scene.code,
      side: scene.side,
      startSeconds: cursor,
      endSeconds: cursor + length,
      rating: scene.rating,
      label: null,
      metadata,
      createdBy: coach.id,
    });

    cursor += length + 12 + Math.floor(rnd() * 40);
  }

  // The two possession sequences that everything above sits inside. Filed as
  // durations, so the lanes show the rhythm of the half rather than confetti.
  let phase = 90;
  let attacking = true;
  while (phase < DURATION - 150) {
    const length = 24 + Math.floor(rnd() * 30);
    tags.push({
      videoId: video.id,
      teamId,
      playerId: null,
      code: attacking ? 'attack_sequence' : 'defense_sequence',
      side: attacking ? 'own' : 'opponent',
      startSeconds: phase,
      endSeconds: phase + length,
      rating: 'neutral',
      label: null,
      metadata: attacking ? { phase: pick(PHASES) } : { defense: pick(DEFENSES) },
      createdBy: coach.id,
    });
    phase += length + 6;
    attacking = !attacking;
  }

  await db.videoTag.createMany({ data: tags });

  // ── Saved questions, not clip folders ────────────────────────────────────
  const playlists = [
    {
      name: 'Gegenstöße gegen 5:1',
      filter: { codes: ['goal', 'shot_saved', 'shot_missed'], phases: ['wave1', 'wave2'] },
    },
    { name: 'Alle Ballverluste', filter: { codes: ['turnover', 'technical_fault'] } },
    { name: 'Paraden der Torhüterinnen', filter: { codes: ['save'] } },
    {
      name: 'Kreisanspiele',
      filter: { codes: ['goal', 'assist', 'shot_saved'], tactics: ['pivot_pass'] },
    },
  ];
  await db.videoPlaylist.createMany({
    data: playlists.map((p) => ({
      videoId: video.id,
      teamId,
      name: p.name,
      filter: p.filter,
      createdBy: coach.id,
    })),
  });

  // ── A couple of free notes, the other kind of mark on a video ────────────
  await db.videoMarker.createMany({
    data: [
      { videoId: video.id, teamId, atSeconds: 8 * 60 + 12, label: 'Auszeit — Umstellung auf 3:2:1', kind: 'note', createdBy: coach.id },
      { videoId: video.id, teamId, atSeconds: 21 * 60 + 40, label: 'Hier kippt das Spiel', kind: 'bad', createdBy: coach.id },
      { videoId: video.id, teamId, atSeconds: 44 * 60 + 5, label: 'Sperre läuft endlich sauber', kind: 'good', createdBy: coach.id },
    ],
  });

  console.log('\nDone.');
  console.log(`  Video:     ${video.title}`);
  console.log(`  Scenes:    ${tags.length}`);
  console.log(`  Playlists: ${playlists.length}`);
  console.log(`  VIDEO_ID=${video.id}`);
  console.log(
    '\n  Playback needs R2 — without it the stage stays on "Noch nichts abspielbar".',
  );
  console.log('  Add the coach to VIDEO_BETA_EMAILS or every /videos route answers 403.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
