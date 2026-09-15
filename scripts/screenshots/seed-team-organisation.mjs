/**
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS FILE BELONGS IN THE APP REPO (arek09082001/handballStats), not here.
 * It lives alongside the screenshot pipeline because the pipeline cannot
 * produce anything without it; copy it to `scripts/seed-team-organisation.mjs`
 * there and run it from that repo, where @prisma/client is installed.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Fills the three screens the product page had no picture of, on top of
 * `scripts/seed-demo.mjs`: the Mannschaftskasse, the Trikotschrank and the
 * Spieler-Zugang.
 *
 *   node scripts/seed-demo.mjs && node scripts/seed-team-organisation.mjs
 *
 * What it writes, all for the squad the demo seed created:
 *  - a Strafenkatalog of eight agreed lines and ~20 fines across the roster,
 *    a third of them already ticked off, so the Kasse shows an open balance
 *    beside a paid one instead of a zero,
 *  - two jersey sets (home/away) with numbered shirts, sizes, a goalkeeper
 *    shirt each, and an issue history — most shirts out, two still in the box,
 *    one returned and re-issued so the "wer es hatte" list has two rows,
 *  - four player accounts linked to their roster rows plus an active join
 *    link, so `/settings` shows the invite panel with a real "wer ist schon
 *    dabei" list rather than an empty state. One of them keeps the Kasse
 *    (`managesFines`).
 *
 * Everything here is invented demo data — the names come from the demo seed's
 * own roster. Deterministic: a re-run replaces the rows it wrote itself and
 * produces the same squad again.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

const COACH_EMAIL = process.env.SEED_EMAIL || 'demo@statix-app.de';
const PLAYER_PASSWORD = process.env.SEED_PASSWORD || 'StatixDemo!2026';

/** Deterministic PRNG — the same squad owes the same money on every run. */
let seed = 20260915;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
const pick = (list) => list[Math.floor(rnd() * list.length)];

/** Local-midnight-anchored date arithmetic, in whole days. */
const day = (base, offset) => {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
};

/**
 * The catalogue. A real one is not a tidy list: it grows out of evenings that
 * annoyed somebody, which is why `sortOrder` is set by hand here — training
 * first, then matchday, then the dressing room.
 */
const RULES = [
  { title: 'Zu spät zum Training', description: 'Ab 5 Minuten nach Trainingsbeginn.', cents: 500 },
  { title: 'Unentschuldigt gefehlt', description: 'Ohne Absage bis 12 Uhr am Trainingstag.', cents: 1000 },
  { title: 'Handy in der Kabine', description: null, cents: 200 },
  { title: 'Zu spät zur Abfahrt', description: 'Der Bus wartet fünf Minuten, danach kostet es.', cents: 1000 },
  { title: 'Trikot vergessen', description: null, cents: 500 },
  { title: 'Schmuck nicht abgelegt', description: 'Ohrringe, Uhr, Kette — Schiri schickt sonst raus.', cents: 300 },
  { title: 'Gelbe Karte für Meckern', description: null, cents: 500 },
  { title: 'Kabine nicht gefegt', description: 'Trifft die ganze Woche, nicht die Einzelne.', cents: 0 },
];

/** Notes that make a line recognisable weeks later. */
const NOTES = [
  'Dienstagstraining',
  'Auswärtsspiel, zehn Minuten zu spät',
  'Donnerstag, kurz vor Schluss',
  null,
  null,
  'Heimspiel, zweite Halbzeit',
];

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
  if (roster.length === 0) throw new Error('The demo squad has no players.');

  const today = day(new Date(), 0);

  /* ─────────────────────────────────────────── Strafen und Mannschaftskasse ── */

  console.log('Clearing previous organisation demo data…');
  await db.playerFine.deleteMany({ where: { teamId } });
  await db.fineRule.deleteMany({ where: { teamId } });
  await db.jerseyAssignment.deleteMany({ where: { teamId } });
  await db.jersey.deleteMany({ where: { teamId } });
  await db.jerseySet.deleteMany({ where: { teamId } });

  console.log('Writing the Strafenkatalog…');
  const rules = [];
  for (const [index, rule] of RULES.entries()) {
    rules.push(
      await db.fineRule.create({
        data: {
          teamId,
          title: rule.title,
          description: rule.description,
          defaultAmountCents: rule.cents,
          sortOrder: index,
          createdBy: coach.id,
        },
      }),
    );
  }

  console.log('Writing fines across the roster…');
  // Priced lines only: "Kabine nicht gefegt" is on the list at 0 € on purpose,
  // and a Kasse full of zero rows would say nothing about what a Kasse is.
  const priced = rules.filter((r) => r.defaultAmountCents > 0);
  let written = 0;
  for (const [index, player] of roster.entries()) {
    // The first four are the ones with an account (see below), and their own
    // screen is what the player-side screenshot shows — an empty one says
    // nothing. Everybody else owes something or does not: a squad where all
    // fifteen are in the red reads like a punishment app rather than a
    // Mannschaftskasse.
    const linkedPlayer = index < 4;
    const count = linkedPlayer ? 2 : index % 4 === 0 ? 0 : 1 + Math.floor(rnd() * 2);
    for (let n = 0; n < count; n += 1) {
      const rule = pick(priced);
      const occurredOn = day(today, -2 - Math.floor(rnd() * 40));
      // A third is ticked off, and the paid ones are the older ones — which is
      // what a Kasse actually looks like halfway through a season. The four
      // with an account get one of each, so their screen shows both states.
      const paid = linkedPlayer ? n === 0 : rnd() < 0.34;
      await db.playerFine.create({
        data: {
          teamId,
          playerId: player.id,
          ruleId: rule.id,
          reason: rule.title,
          amountCents: rule.defaultAmountCents,
          note: pick(NOTES),
          occurredOn,
          paidAt: paid ? day(occurredOn, 3 + Math.floor(rnd() * 5)) : null,
          createdBy: coach.id,
        },
      });
      written += 1;
    }
  }

  /* ────────────────────────────────────────────────────────── Trikotschrank ── */

  console.log('Filling the Trikotschrank…');
  const homeSet = await db.jerseySet.create({
    data: {
      teamId,
      name: 'Heimsatz rot',
      usage: 'home',
      fieldColor: 'red',
      goalkeeperColor: 'green',
      notes: 'Liegt im Geräteraum, Schlüssel beim Zeugwart.',
    },
  });
  const awaySet = await db.jerseySet.create({
    data: {
      teamId,
      name: 'Auswärtssatz weiß',
      usage: 'away',
      fieldColor: 'white',
      goalkeeperColor: 'blue',
      notes: 'Fährt in der blauen Kiste mit.',
    },
  });

  const SIZES = ['S', 'M', 'M', 'L', 'L', 'XL'];
  const keepers = roster.filter((p) => p.isGoalkeeper);
  const fieldPlayers = roster.filter((p) => !p.isGoalkeeper);

  for (const set of [homeSet, awaySet]) {
    const shirts = [];
    // Numbers are the print on the textile, not players.jerseyNumber — the two
    // are deliberately unrelated, so the set is simply numbered through.
    for (let number = 2; number <= 15; number += 1) {
      shirts.push(
        await db.jersey.create({
          data: { teamId, setId: set.id, number, kind: 'field', size: pick(SIZES) },
        }),
      );
    }
    const keeperShirt = await db.jersey.create({
      data: { teamId, setId: set.id, number: 1, kind: 'goalkeeper', size: 'L' },
    });

    // Issue most of the set, leave two shirts in the box: full coverage hides
    // the one number a coach opens this screen for — what is still out there.
    const issued = shirts.slice(0, Math.max(0, fieldPlayers.length - 1));
    for (const [index, shirt] of issued.entries()) {
      const player = fieldPlayers[index];
      if (!player) break;
      await db.jerseyAssignment.create({
        data: {
          teamId,
          jerseyId: shirt.id,
          playerId: player.id,
          playerName: `${player.firstName} ${player.lastName}`.trim(),
          issuedAt: day(today, -120),
          createdBy: coach.id,
        },
      });
    }
    if (keepers[0]) {
      await db.jerseyAssignment.create({
        data: {
          teamId,
          jerseyId: keeperShirt.id,
          playerId: keepers[0].id,
          playerName: `${keepers[0].firstName} ${keepers[0].lastName}`.trim(),
          issuedAt: day(today, -120),
          createdBy: coach.id,
        },
      });
    }

    // One shirt that has been around: handed back at the winter break and
    // given to somebody else, so "wer es hatte" is a history and not one line.
    const passedOn = shirts.at(-1);
    if (passedOn && fieldPlayers.length >= 2) {
      await db.jerseyAssignment.create({
        data: {
          teamId,
          jerseyId: passedOn.id,
          playerId: fieldPlayers.at(-2).id,
          playerName: `${fieldPlayers.at(-2).firstName} ${fieldPlayers.at(-2).lastName}`.trim(),
          issuedAt: day(today, -120),
          returnedAt: day(today, -35),
          note: 'Zurück zur Winterpause',
          createdBy: coach.id,
        },
      });
      await db.jerseyAssignment.create({
        data: {
          teamId,
          jerseyId: passedOn.id,
          playerId: fieldPlayers.at(-1).id,
          playerName: `${fieldPlayers.at(-1).firstName} ${fieldPlayers.at(-1).lastName}`.trim(),
          issuedAt: day(today, -34),
          createdBy: coach.id,
        },
      });
    }
  }

  /* ───────────────────────────────────────────────────────── Spieler-Zugang ── */

  console.log('Linking player accounts…');
  const password = await bcrypt.hash(PLAYER_PASSWORD, 10);
  // Four of the squad have signed up. Not all of them: the panel's whole point
  // is that it shows who is still missing.
  const linked = roster.slice(0, 4);
  for (const [index, player] of linked.entries()) {
    const email = `spielerin${index + 1}@statix-app.de`;
    const existing = await db.profile.findFirst({ where: { email } });
    const profile =
      existing ??
      (await db.profile.create({
        data: {
          fullName: `${player.firstName} ${player.lastName}`.trim(),
          email,
          password,
          emailVerified: new Date(),
        },
      }));
    await db.player.update({
      where: { id: player.id },
      data: { profileId: profile.id },
    });
    await db.teamMember.upsert({
      where: { teamId_profileId: { teamId, profileId: profile.id } },
      // The first of them keeps the Mannschaftskasse — the Strafen duty is a
      // job beside the rank, not a fourth rank.
      update: { role: 'player', managesFines: index === 0 },
      create: { teamId, profileId: profile.id, role: 'player', managesFines: index === 0 },
    });
  }

  console.log('Creating the join link…');
  const token = 'demo-beitritt-statix-2026';
  await db.teamJoinLink.upsert({
    where: { teamId },
    update: {
      token,
      expiresAt: day(today, 21),
      revokedAt: null,
      useCount: linked.length,
    },
    create: {
      teamId,
      token,
      createdBy: coach.id,
      expiresAt: day(today, 21),
      useCount: linked.length,
    },
  });

  console.log('\nDone.');
  console.log(`  Strafen:     ${written} über ${rules.length} Katalogzeilen`);
  console.log(`  Trikots:     2 Sätze, je 14 Feld + 1 TW`);
  console.log(`  Spieler-Zugang: ${linked.length} verknüpfte Konten, Passwort ${PLAYER_PASSWORD}`);
  console.log(`  Spielerinnen-Login: spielerin1@statix-app.de (führt die Kasse)`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
