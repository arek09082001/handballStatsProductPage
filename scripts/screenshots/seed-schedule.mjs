/**
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS FILE BELONGS IN THE APP REPO (arek09082001/handballStats), not here.
 * It lives alongside the screenshot pipeline because the pipeline cannot
 * produce anything without it; copy it to `scripts/seed-schedule.mjs` there and
 * run it from that repo, where @prisma/client is installed.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Adds a believable **Termine** month on top of `scripts/seed-demo.mjs`, so the
 * schedule screenshots show a squad that actually plans its week rather than a
 * calendar full of empty states.
 *
 *   node scripts/seed-demo.mjs && node scripts/seed-schedule.mjs
 *
 * What it writes, all for the squad the demo seed created:
 *  - two halls in the venue address book,
 *  - a Tue/Thu training series across the current and next month,
 *  - two matches and a team evening as standalone appointments,
 *  - RSVPs across the roster, so the tally rows read "12 dabei, 2 ab",
 *  - three absences (holiday, illness, an injury) that resolve into the
 *    appointments inside them without any response row being written.
 *
 * Everything here is invented demo data. Deterministic: a re-run replaces the
 * rows it wrote itself and produces the same month again.
 */
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const ZONE = 'Europe/Berlin';
const COACH_EMAIL = process.env.SEED_EMAIL || 'demo@statix-app.de';

/** Deterministic PRNG — the same squad answers the same way on every run. */
let seed = 20260827;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

/** Local-midnight-anchored date arithmetic, in whole days. */
const day = (base, offset) => {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
};

/** A wall-clock time on `date`, as an instant. Close enough for demo data. */
const at = (date, hours, minutes = 0) => {
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d;
};

/** Days from `from` to the next given ISO weekday (1 = Mon … 7 = Sun). */
const nextWeekday = (from, isoWeekday) => {
  const current = ((from.getDay() + 6) % 7) + 1;
  return (isoWeekday - current + 7) % 7;
};

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

  console.log('Clearing previous schedule demo data…');
  // Only the standalone appointments: a match ANCHOR belongs to a game and is
  // the game seed's row, not ours.
  await db.playerAbsence.deleteMany({ where: { teamId } });
  await db.teamEvent.deleteMany({ where: { teamId, gameId: null } });
  await db.teamEventSeries.deleteMany({ where: { teamId } });
  await db.teamVenue.deleteMany({ where: { teamId } });

  const home = await db.teamVenue.create({
    data: {
      teamId,
      name: 'Sporthalle Nordfeld',
      address: 'Nordfeldstraße 12, 44536 Musterstadt',
      notes: 'Halle 2, Eingang Nordseite. Schlüssel beim Hausmeister.',
      createdBy: coach.id,
    },
  });
  const away = await db.teamVenue.create({
    data: {
      teamId,
      name: 'Rundsporthalle Bergheim',
      address: 'Am Sportpark 4, 50126 Bergheim',
      notes: 'Parken hinter der Halle, Gästekabine 3.',
      createdBy: coach.id,
    },
  });

  const today = day(new Date(), 0);
  // Four weeks back, four forward: the list has history to scroll into and the
  // month view is full whichever month the screenshot lands in.
  const firstMonday = day(today, -28 + nextWeekday(day(today, -28), 1));
  const untilDate = day(today, 35);

  const series = await db.teamEventSeries.create({
    data: {
      teamId,
      weekdays: [2, 4],
      intervalWeeks: 1,
      timeZone: ZONE,
      untilDate,
      createdBy: coach.id,
    },
  });

  /** Every Tue/Thu training between `firstMonday` and `untilDate`. */
  const trainings = [];
  for (let offset = 0; ; offset += 7) {
    const monday = day(firstMonday, offset);
    if (monday > untilDate) break;
    for (const [weekday, label] of [
      [2, 'Training'],
      [4, 'Training'],
    ]) {
      const date = day(monday, weekday - 1);
      if (date > untilDate) continue;
      trainings.push({
        teamId,
        kind: 'training',
        title: label,
        startAt: at(date, 19, 30),
        endAt: at(date, 21, 0),
        venueId: home.id,
        seriesId: series.id,
        rsvpDefault: 'yes',
        rsvpDeadline: at(day(date, -1), 18, 0),
        createdBy: coach.id,
      });
    }
  }

  // One evening a week ahead runs long — a real season has exceptions, and the
  // series row is materialised precisely so one occurrence can differ.
  const nextTuesday = trainings.find((t) => t.startAt > today);
  if (nextTuesday) {
    nextTuesday.title = 'Training — Wurfserie & Standards';
    nextTuesday.notes = 'Bringt beide Trikotsätze mit, wir spielen 6:0 gegen 5:1.';
  }

  await db.teamEvent.createMany({ data: trainings });

  const standalone = [
    {
      teamId,
      kind: 'match',
      title: 'Heimspiel gegen TuS Bergheim',
      startAt: at(day(today, 2), 18, 0),
      endAt: at(day(today, 2), 20, 0),
      meetAt: at(day(today, 2), 16, 45),
      venueId: home.id,
      matchLocation: 'home',
      matchType: 'championship',
      notes: 'Trikot rot, Aufwärmen ab 17:00. Kuchenspende: Jahrgang 2009.',
      rsvpDefault: 'none',
      rsvpDeadline: at(day(today, 1), 20, 0),
      createdBy: coach.id,
    },
    {
      teamId,
      kind: 'match',
      title: 'Auswärts bei der SG Rheinbach',
      startAt: at(day(today, 9), 17, 15),
      endAt: at(day(today, 9), 19, 15),
      meetAt: at(day(today, 9), 15, 0),
      venueId: away.id,
      matchLocation: 'away',
      matchType: 'championship',
      notes: 'Abfahrt 15:00 ab Halle, Fahrgemeinschaften bitte eintragen.',
      rsvpDefault: 'none',
      rsvpDeadline: at(day(today, 8), 20, 0),
      createdBy: coach.id,
    },
    {
      teamId,
      kind: 'other',
      title: 'Mannschaftsabend',
      startAt: at(day(today, 16), 19, 0),
      endAt: at(day(today, 16), 23, 0),
      location: 'Vereinsheim, Nordfeldstraße 12',
      notes: 'Wichteln, 10 € Grenze. Bringt Anhang mit.',
      rsvpDefault: 'none',
      createdBy: coach.id,
    },
    {
      teamId,
      kind: 'other',
      title: 'Athletik im Kraftraum',
      startAt: at(day(today, 5), 18, 0),
      endAt: at(day(today, 5), 19, 15),
      venueId: home.id,
      rsvpDefault: 'yes',
      createdBy: coach.id,
    },
    {
      teamId,
      kind: 'training',
      title: 'Training — fällt aus (Halle belegt)',
      startAt: at(day(today, -3), 19, 30),
      endAt: at(day(today, -3), 21, 0),
      venueId: home.id,
      status: 'cancelled',
      rsvpDefault: 'yes',
      createdBy: coach.id,
    },
  ];
  await db.teamEvent.createMany({ data: standalone });

  // ── Who answered what ────────────────────────────────────────────────────
  // Only the appointments a squad actually replies to: the ones ahead of today
  // plus the last two weeks, so the past rows carry a tally too.
  const answerable = await db.teamEvent.findMany({
    where: {
      teamId,
      gameId: null,
      status: 'scheduled',
      startAt: { gte: day(today, -14) },
    },
    orderBy: { startAt: 'asc' },
  });

  const responses = [];
  for (const event of answerable) {
    for (const player of roster) {
      const roll = rnd();
      // A match pulls a squad in; a Thursday training in the rain does not.
      const yesChance = event.kind === 'match' ? 0.88 : 0.74;
      let status;
      if (roll < yesChance) status = 'yes';
      else if (roll < yesChance + 0.1) status = 'maybe';
      else if (roll < yesChance + 0.2) status = 'no';
      else continue; // no answer at all — the "offen" row the coach chases
      responses.push({
        teamEventId: event.id,
        playerId: player.id,
        status,
        comment:
          status === 'no' && rnd() < 0.4
            ? ['Spätschicht bis 20 Uhr', 'Klausur am Morgen danach', 'Erkältet'][
                Math.floor(rnd() * 3)
              ]
            : null,
        respondedByProfileId: null,
        respondedAt: new Date(event.startAt.getTime() - 3 * 864e5),
      });
    }
  }
  await db.teamEventResponse.createMany({ data: responses, skipDuplicates: true });

  // ── Away for a stretch ───────────────────────────────────────────────────
  const absences = [
    {
      teamId,
      playerId: roster[3].id,
      kind: 'vacation',
      startDate: day(today, -2),
      endDate: day(today, 8),
      timeZone: ZONE,
      note: 'Familienurlaub, schon im Sommer gebucht.',
      createdBy: coach.id,
    },
    {
      teamId,
      playerId: roster[6].id,
      kind: 'injury',
      startDate: day(today, -9),
      endDate: day(today, 25),
      timeZone: ZONE,
      note: 'Reha nach Bänderriss, kommt zum Zuschauen.',
      createdBy: coach.id,
    },
    {
      teamId,
      playerId: roster[9].id,
      kind: 'illness',
      startDate: day(today, 0),
      endDate: day(today, 4),
      timeZone: ZONE,
      note: null,
      createdBy: coach.id,
    },
    {
      teamId,
      playerId: roster[1].id,
      kind: 'vacation',
      startDate: day(today, -24),
      endDate: day(today, -17),
      timeZone: ZONE,
      note: null,
      createdBy: coach.id,
    },
  ];
  await db.playerAbsence.createMany({ data: absences });

  const total = trainings.length + standalone.length;
  console.log('\nDone.');
  console.log(`  Appointments: ${total} (${trainings.length} from the Tue/Thu series)`);
  console.log(`  Responses:    ${responses.length} across ${roster.length} players`);
  console.log(`  Absences:     ${absences.length}`);
  console.log(`  Venues:       ${home.name}, ${away.name}`);

  const nextUp = await db.teamEvent.findFirst({
    where: { teamId, gameId: null, startAt: { gte: new Date() } },
    orderBy: { startAt: 'asc' },
  });
  if (nextUp) console.log(`  EVENT_ID=${nextUp.id}   # for the detail screenshot`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
