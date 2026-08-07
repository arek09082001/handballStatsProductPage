/**
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS FILE BELONGS IN THE APP REPO (arek09082001/handballStats), not here.
 * It lives alongside the screenshot pipeline because the pipeline cannot
 * produce anything without it; copy it to `scripts/seed-demo.mjs` there and
 * run it from that repo, where @prisma/client and bcryptjs are installed.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Seeds a local Statix instance with a believable season so the product-page
 * screenshots show a real, internally consistent app rather than empty states.
 *
 *   node scripts/seed-demo.mjs
 *
 * Everything here is invented demo data — no real coach, player or club.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

const COACH_EMAIL = 'demo@statix-app.de';
const COACH_PASSWORD = 'StatixDemo!2026';
const SEASON = '2026/27';

const PLAYERS = [
  ['Lukas', 'Berg', 1, 'goalkeeper', true],
  ['Jonas', 'Frey', 12, 'goalkeeper', true],
  ['Tim', 'Sauer', 3, 'left_wing', false],
  ['Marco', 'Vogt', 7, 'right_back', false],
  ['David', 'Roth', 10, 'center_back', false],
  ['Ben', 'Kaiser', 9, 'pivot', false],
  ['Paul', 'Meier', 11, 'right_back', false],
  ['Nico', 'Kraus', 4, 'left_back', false],
  ['Erik', 'Lang', 8, 'right_wing', false],
  ['Felix', 'Wolf', 5, 'left_back', false],
  ['Sami', 'Diallo', 6, 'pivot', false],
  ['Jan', 'Huber', 2, 'left_wing', false],
  ['Tobias', 'Reich', 14, 'center_back', false],
  ['Luca', 'Fischer', 13, 'right_wing', false],
];

/** code, name, category, shot, goal, save, conceded, sort */
const STAT_TYPES = [
  ['goal', 'Tor', 'offensive', true, true, false, false, 10],
  ['shot_missed', 'Fehlwurf', 'offensive', true, false, false, false, 20],
  ['shot_saved', 'Wurf gehalten', 'offensive', true, false, false, false, 30],
  ['seven_m_goal', '7-Meter Tor', 'offensive', true, true, false, false, 40],
  ['seven_m_missed', '7-Meter verworfen', 'offensive', true, false, false, false, 50],
  ['fast_break_goal', 'Tempo-Gegenstoß Tor', 'offensive', true, true, false, false, 60],
  ['fast_break_missed', 'Tempo-Gegenstoß verworfen', 'offensive', true, false, false, false, 70],
  ['assist', 'Assist', 'offensive', false, false, false, false, 80],
  ['save', 'Parade', 'defensive', false, false, true, false, 90],
  ['goal_conceded', 'Gegentor', 'defensive', false, false, false, true, 100],
  ['steal', 'Ballgewinn', 'defensive', false, false, false, false, 110],
  ['block', 'Block', 'defensive', false, false, false, false, 120],
  ['stop_foul', 'Stoppfoul', 'defensive', false, false, false, false, 180],
  ['technical_fault', 'Technischer Fehler', 'technical_fault', false, false, false, false, 130],
  ['two_min', '2-Minuten-Strafe', 'penalty', false, false, false, false, 140],
  ['yellow_card', 'Gelbe Karte', 'penalty', false, false, false, false, 150],
  ['red_card', 'Rote Karte', 'penalty', false, false, false, false, 160],
  ['opponent_two_min', '2 Minuten Gegner', 'penalty', false, false, false, false, 170],
  ['opponent_yellow_card', 'Gelb Gegner', 'penalty', false, false, false, false, 172],
  ['opponent_red_card', 'Rot Gegner', 'penalty', false, false, false, false, 174],
  ['team_timeout', 'Team-Timeout', 'offensive', false, false, false, false, 190],
];

const ZONES = [
  'left_wing', 'left_back_6m', 'middle_back_6m', 'right_back_6m',
  'left_back_9m', 'middle_back_9m', 'right_back_9m', 'right_wing',
];

const OPPONENTS = [
  'Ratingen 2020', 'TV Musterstadt', 'HSG Nordwest', 'TuS Bergheim',
  'SG Rheinbach', 'TV Aldekerk', 'HC Weiden',
];

/** Deterministic PRNG so a re-seed produces the same screenshots. */
let seed = 20260807;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
const pick = (a) => a[Math.floor(rnd() * a.length)];
const int = (min, max) => min + Math.floor(rnd() * (max - min + 1));

async function main() {
  console.log('Clearing previous demo data…');
  await db.$executeRawUnsafe('TRUNCATE profiles CASCADE');

  const coach = await db.profile.create({
    data: {
      fullName: 'Arkadiusz Weiss',
      email: COACH_EMAIL,
      password: await bcrypt.hash(COACH_PASSWORD, 10),
      emailVerified: new Date(),
    },
  });

  const team = await db.team.create({
    data: { coachId: coach.id, name: 'HSG Statix', season: SEASON, isPro: true },
  });

  // The app resolves the active team through `team_members`, not `teams.coach_id`
  // — without this row the coach lands on the "create your team" onboarding.
  await db.teamMember.create({
    data: { teamId: team.id, profileId: coach.id, role: 'owner' },
  });

  await db.statType.createMany({
    data: STAT_TYPES.map(([code, name, , shot, goal, save, conceded, sort]) => ({
      coachId: coach.id, code, name,
      countsAsShot: shot, countsAsGoal: goal,
      countsAsSave: save, countsAsGoalConceded: conceded,
      isSystem: true, isActive: true, sortOrder: sort,
    })),
  });
  // `category` is not modelled in the Prisma schema (see schema.prisma), so it
  // is written directly — the materialised stats views group on it.
  for (const [code, , category] of STAT_TYPES) {
    await db.$executeRawUnsafe(
      `UPDATE stat_types SET category = $1::stat_category WHERE coach_id = $2::uuid AND code = $3`,
      category, coach.id, code,
    );
  }
  const stats = Object.fromEntries(
    (await db.statType.findMany({ where: { coachId: coach.id } })).map((s) => [s.code, s.id]),
  );

  const players = [];
  for (const [firstName, lastName, jerseyNumber, position, isGoalkeeper] of PLAYERS) {
    players.push(
      await db.player.create({
        data: {
          teamId: team.id, firstName, lastName, jerseyNumber,
          position, isGoalkeeper: isGoalkeeper && position === 'goalkeeper',
          isActive: true,
        },
      }),
    );
  }
  const keepers = players.filter((p) => p.isGoalkeeper);
  const outfield = players.filter((p) => !p.isGoalkeeper);

  const opponents = [];
  for (const name of OPPONENTS) {
    opponents.push(await db.opponent.create({ data: { teamId: team.id, name } }));
  }

  /** Builds one finished game with a full event log. */
  async function playGame({ opponent, daysAgo, homeGoals, awayGoals, location, isPublic = false }) {
    const scheduledAt = new Date(Date.now() - daysAgo * 864e5);
    const game = await db.game.create({
      data: {
        coachId: coach.id, teamId: team.id,
        opponentName: opponent.name, opponentId: opponent.id,
        location, status: 'finished', type: 'championship',
        scheduledAt, season: SEASON, halves: 2, halfSeconds: 1800,
        period: 2, clockSeconds: 3600, clockRunning: false,
        isPublic, publicSlug: isPublic ? `hsg-statix-${opponent.id.slice(0, 8)}` : null,
        publishedAt: isPublic ? scheduledAt : null,
        liveViewUnique: isPublic ? 187 : 0, liveViewPeak: isPublic ? 64 : 0,
      },
    });

    const squad = [keepers[0], ...outfield.slice(0, 12)];
    await db.gameRoster.createMany({
      data: squad.map((p, i) => ({
        gameId: game.id, playerId: p.id,
        isStarter: i < 7,
        position: p.position,
        playingTimeSeconds: i < 7 ? int(2100, 3400) : int(400, 1800),
      })),
    });

    const events = [];
    const at = (i, total) => Math.floor((i / total) * 3540) + int(0, 12);
    const period = (t) => (t < 1800 ? 1 : 2);

    // Our goals, spread over real court zones.
    for (let i = 0; i < homeGoals; i++) {
      const t = at(i, homeGoals);
      const scorer = pick(outfield);
      const sevenM = rnd() < 0.12;
      const fastBreak = !sevenM && rnd() < 0.18;
      const code = sevenM ? 'seven_m_goal' : fastBreak ? 'fast_break_goal' : 'goal';
      const metadata = sevenM
        ? { shotOrigin: 'seven_m', goalTarget: String(int(1, 9)) }
        : { shotOrigin: pick(ZONES), goalTarget: String(int(1, 9)) };
      events.push({
        gameId: game.id, playerId: scorer.id, statTypeId: stats[code],
        period: period(t), gameTimeSeconds: t, value: 1, metadata,
      });
      if (!sevenM && rnd() < 0.45) {
        const assistant = pick(outfield.filter((p) => p.id !== scorer.id));
        events.push({
          gameId: game.id, playerId: assistant.id, statTypeId: stats.assist,
          period: period(t), gameTimeSeconds: t, value: 1, metadata: {},
        });
      }
    }

    // Our misses and saved shots — these make the shot map read honestly.
    const misses = Math.round(homeGoals * 0.75);
    for (let i = 0; i < misses; i++) {
      const t = at(i, misses);
      events.push({
        gameId: game.id, playerId: pick(outfield).id,
        statTypeId: stats[rnd() < 0.55 ? 'shot_saved' : 'shot_missed'],
        period: period(t), gameTimeSeconds: t, value: 1,
        metadata: { shotOrigin: pick(ZONES) },
      });
    }

    // Keeper: saves and conceded goals.
    for (let i = 0; i < awayGoals; i++) {
      const t = at(i, awayGoals);
      events.push({
        gameId: game.id, playerId: keepers[0].id, statTypeId: stats.goal_conceded,
        period: period(t), gameTimeSeconds: t, value: 1,
        metadata: { shotOrigin: pick(ZONES), goalTarget: String(int(1, 9)) },
      });
    }
    const saves = int(Math.round(awayGoals * 0.4), Math.round(awayGoals * 0.6));
    for (let i = 0; i < saves; i++) {
      const t = at(i, saves);
      events.push({
        gameId: game.id, playerId: keepers[0].id, statTypeId: stats.save,
        period: period(t), gameTimeSeconds: t, value: 1,
        metadata: { shotOrigin: pick(ZONES), goalTarget: String(int(1, 9)) },
      });
    }

    // Defensive work, faults and penalties.
    const extras = [
      ['steal', int(4, 9)], ['block', int(3, 7)], ['technical_fault', int(6, 12)],
      ['two_min', int(2, 4)], ['stop_foul', int(2, 5)],
      ['opponent_two_min', int(2, 5)], ['yellow_card', int(1, 2)],
    ];
    for (const [code, n] of extras) {
      for (let i = 0; i < n; i++) {
        const t = at(i, n);
        events.push({
          gameId: game.id,
          playerId: code.startsWith('opponent_') ? null : pick(outfield).id,
          statTypeId: stats[code], period: period(t), gameTimeSeconds: t,
          value: 1, metadata: {},
        });
      }
    }

    await db.gameEvent.createMany({ data: events });
    return game;
  }

  console.log('Playing the season…');
  const season = [
    { opponent: opponents[0], daysAgo: 3, homeGoals: 28, awayGoals: 26, location: 'home', isPublic: true },
    { opponent: opponents[1], daysAgo: 10, homeGoals: 31, awayGoals: 24, location: 'away' },
    { opponent: opponents[2], daysAgo: 17, homeGoals: 25, awayGoals: 27, location: 'home' },
    { opponent: opponents[3], daysAgo: 24, homeGoals: 33, awayGoals: 29, location: 'away' },
    { opponent: opponents[4], daysAgo: 31, homeGoals: 22, awayGoals: 22, location: 'home' },
    { opponent: opponents[5], daysAgo: 38, homeGoals: 30, awayGoals: 21, location: 'away' },
    { opponent: opponents[6], daysAgo: 45, homeGoals: 27, awayGoals: 30, location: 'home' },
  ];
  const games = [];
  for (const g of season) games.push(await playGame(g));
  const featured = games[0];

  // One game left live and mid-second-half: the recording screenshots need a
  // running clock, a score on the board and players already on court.
  const liveOpponent = opponents[1];
  const live = await db.game.create({
    data: {
      coachId: coach.id, teamId: team.id,
      opponentName: liveOpponent.name, opponentId: liveOpponent.id,
      location: 'home', status: 'live', type: 'championship',
      scheduledAt: new Date(), season: SEASON, halves: 2, halfSeconds: 1800,
      period: 2, clockSeconds: 2787, clockRunning: false,
      clockUpdatedAt: new Date(), isPublic: true,
      publicSlug: 'hsg-statix-live', publishedAt: new Date(),
      liveViewUnique: 143, liveViewPeak: 58,
    },
  });
  const liveSquad = [keepers[0], ...outfield.slice(0, 12)];
  await db.gameRoster.createMany({
    data: liveSquad.map((p, i) => ({
      gameId: live.id, playerId: p.id, isStarter: i < 7,
      position: p.position, playingTimeSeconds: i < 7 ? int(1800, 2700) : int(300, 1400),
    })),
  });
  const liveEvents = [];
  for (let i = 0; i < 24; i++) {
    const t = Math.floor((i / 24) * 2700) + int(0, 20);
    liveEvents.push({
      gameId: live.id, playerId: pick(outfield).id,
      statTypeId: stats[rnd() < 0.2 ? 'fast_break_goal' : 'goal'],
      period: t < 1800 ? 1 : 2, gameTimeSeconds: t, value: 1,
      metadata: { shotOrigin: pick(ZONES), goalTarget: String(int(1, 9)) },
    });
  }
  for (let i = 0; i < 21; i++) {
    const t = Math.floor((i / 21) * 2700);
    liveEvents.push({
      gameId: live.id, playerId: keepers[0].id, statTypeId: stats.goal_conceded,
      period: t < 1800 ? 1 : 2, gameTimeSeconds: t, value: 1,
      metadata: { shotOrigin: pick(ZONES), goalTarget: String(int(1, 9)) },
    });
  }
  for (let i = 0; i < 11; i++) {
    const t = Math.floor((i / 11) * 2700);
    liveEvents.push({
      gameId: live.id, playerId: keepers[0].id, statTypeId: stats.save,
      period: t < 1800 ? 1 : 2, gameTimeSeconds: t, value: 1,
      metadata: { shotOrigin: pick(ZONES), goalTarget: String(int(1, 9)) },
    });
  }
  for (const [code, n] of [['steal', 5], ['block', 4], ['technical_fault', 7], ['two_min', 3], ['opponent_two_min', 4]]) {
    for (let i = 0; i < n; i++) {
      const t = Math.floor((i / n) * 2700);
      liveEvents.push({
        gameId: live.id,
        playerId: code.startsWith('opponent_') ? null : pick(outfield).id,
        statTypeId: stats[code], period: t < 1800 ? 1 : 2,
        gameTimeSeconds: t, value: 1, metadata: {},
      });
    }
  }
  await db.gameEvent.createMany({ data: liveEvents });

  console.log('Building the tournament…');
  const tournament = await db.tournament.create({
    data: {
      coachId: coach.id, teamId: team.id,
      name: 'Herbstturnier Ratingen',
    },
  });
  const tTeams = [];
  for (const name of ['HSG Statix', 'Ratingen 2020', 'TV Musterstadt', 'HSG Nordwest', 'TuS Bergheim', 'SG Rheinbach']) {
    tTeams.push(
      await db.tournamentTeam.create({
        data: { tournamentId: tournament.id, name, isOwnTeam: name === 'HSG Statix' },
      }),
    );
  }
  const results = [
    [0, 1, 28, 26], [2, 3, 24, 24], [4, 5, 31, 27],
    [0, 2, 30, 22], [1, 4, 25, 29], [3, 5, 20, 26],
    [0, 3, 27, 25], [1, 2, 33, 28], [4, 5, 22, 24],
  ];
  for (const [h, a, hg, ag] of results) {
    await db.tournamentMatch.create({
      data: {
        tournamentId: tournament.id,
        homeTeamId: tTeams[h].id, awayTeamId: tTeams[a].id,
        homeScore: hg, awayScore: ag, status: 'finished',
      },
    });
  }

  console.log('Writing the AI reports…');

  const matchBlocks = [
    {
      type: 'timeline', title: 'Spielverlauf: Punkte und kritische Phasen',
      layout: 'full', priority: 'high',
      data: {
        points: [
          { minute: 5, us: 3, them: 0 }, { minute: 10, us: 5, them: 3 },
          { minute: 15, us: 7, them: 6 }, { minute: 20, us: 9, them: 9 },
          { minute: 25, us: 11, them: 12, note: 'Ballverlust-Phase' },
          { minute: 30, us: 14, them: 13 }, { minute: 35, us: 17, them: 16 },
          { minute: 40, us: 18, them: 18 },
          { minute: 45, us: 23, them: 19, note: '5-Tore-Lauf' },
          { minute: 50, us: 25, them: 22 }, { minute: 55, us: 26, them: 24 },
          { minute: 60, us: 28, them: 26 },
        ],
      },
    },
    {
      type: 'heatmap', title: 'Unsere Schusszonen: Effizienz nach Position',
      layout: 'half', priority: 'high',
      data: {
        zones: [
          { position: 'left_wing', shots: 7, goals: 5 },
          { position: 'right_wing', shots: 3, goals: 2 },
          { position: 'left_back_6m', shots: 2, goals: 1 },
          { position: 'middle_back_6m', shots: 8, goals: 6 },
          { position: 'right_back_6m', shots: 9, goals: 4 },
          { position: 'left_back_9m', shots: 15, goals: 10 },
          { position: 'middle_back_9m', shots: 6, goals: 4 },
          { position: 'right_back_9m', shots: 4, goals: 2 },
          { position: 'seven_m', shots: 4, goals: 3 },
        ],
      },
    },
    {
      type: 'stat-card', title: 'Rückraum-Dominanz', layout: 'half', priority: 'high',
      data: {
        value: '66,7 %', label: 'Schussquote Mitteldistanz (6m + 9m)',
        trend: 'up', context: '24 Schüsse, 16 Tore – das Rückgrat des Angriffs',
      },
    },
    {
      type: 'insight', title: 'Ballverlust-Krise', layout: 'half', priority: 'high',
      data: {
        text: 'Sechs Turnover zwischen Minute 15 und 25. Ratingen kam von 0:3 auf 11:12 heran – die kritische Phase des Spiels.',
        severity: 'critical',
      },
    },
    {
      type: 'comparison', title: 'David Roth vs. Paul Meier: Rückraum-Kontrast',
      layout: 'half', priority: 'medium',
      data: {
        left: 'David Roth (Center-Back)', right: 'Paul Meier (Right-Back)',
        rows: [
          { label: 'Tore', leftValue: 8, rightValue: 3 },
          { label: 'Schüsse', leftValue: 11, rightValue: 7 },
          { label: 'Schussquote', leftValue: '72,7 %', rightValue: '42,9 %' },
          { label: 'Technische Fehler', leftValue: 0, rightValue: 5 },
          { label: 'Spielzeit (Min)', leftValue: 40, rightValue: 45 },
        ],
      },
    },
    {
      type: 'key-moments', title: 'Wendepunkt: Minuten 40–45',
      layout: 'half', priority: 'high',
      data: {
        moments: [
          { minute: 40, score: '18:18', title: 'Auszeit nach Ausgleich', detail: 'Umstellung auf offensive 5:1-Deckung.' },
          { minute: 43, score: '21:18', title: '5-Tore-Lauf', detail: 'Nur ein Ballverlust in fünf Minuten – über den zweiten Rückraum ausgelöst.' },
          { minute: 45, score: '23:19', title: 'Psychologischer Bruch', detail: 'Ratingen nimmt Auszeit, findet aber nicht mehr zurück.' },
        ],
      },
    },
    {
      type: 'chart', title: 'Fehler-Verteilung über das Spiel',
      layout: 'full', priority: 'medium',
      data: {
        kind: 'bar',
        categories: ['0–5', '5–10', '10–15', '15–20', '20–25', '25–30', '30–35', '35–40', '40–45', '45–50', '50–55', '55–60'],
        series: [
          { name: 'Ballverluste', values: [1, 1, 1, 2, 3, 0, 1, 2, 0, 1, 1, 1] },
          { name: 'Fehlwürfe', values: [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0] },
        ],
      },
    },
    {
      type: 'leaderboard', title: 'Spieler-Performance: Top 3 Akteure',
      layout: 'half', priority: 'medium',
      data: {
        unit: 'Tore',
        entries: [
          { label: 'David Roth', value: 8, display: '8', context: '11 Schüsse · 72,7 %' },
          { label: 'Ben Kaiser', value: 6, display: '6', context: '7 Schüsse · 85,7 %' },
          { label: 'Tim Sauer', value: 5, display: '5', context: '7 Schüsse · 71,4 %' },
        ],
      },
    },
    {
      type: 'stat-card', title: 'Keeper-Leistung Lukas Berg',
      layout: 'half', priority: 'medium',
      data: { value: '34,4 %', label: 'Paradequote', trend: 'up', context: '11 Paraden bei 32 Würfen aufs Tor' },
    },
  ];

  const SUMMARY_MATCH =
    'Ein 28:26, das über die Phase zwischen Minute 40 und 45 entschieden wurde: fünf Tore in Folge bei nur einem Ballverlust. Davor lief Ratingen von 0:3 auf 11:12 heran – sechs Turnover zwischen Minute 15 und 25 waren die kritische Phase des Spiels.';

  await db.aIAnalysisResult.create({
    data: {
      teamId: team.id, matchId: featured.id, type: 'MATCH', status: 'COMPLETED',
      title: 'Spielanalyse HSG Statix – Ratingen 2020',
      summary: SUMMARY_MATCH,
      rawInput: { note: 'Demo-Seed – keine echten Modellaufrufe.' },
      aiOutput: {
        summary: SUMMARY_MATCH,
        keyInsights: [
          'Rückraum-Dominanz: 66,7 % Schussquote aus der Mitteldistanz.',
          'Ballverlust-Krise Minute 15–25: sechs Turnover.',
          'Wendepunkt Minute 40–45: 5-Tore-Lauf bei nur einem Ballverlust.',
          'Paul Meier fällt unter Druck ab: 42,9 % Quote, fünf technische Fehler.',
        ],
        recommendations: [
          'Ballsicherung unter Zeitdruck trainieren – die Turnover fielen fast alle in den letzten zehn Sekunden des Angriffs.',
          'Wurfauswahl von Paul Meier aufarbeiten: aus dem Rückraum rechts deutlich unter Teamstandard.',
          'Den 5-Tore-Lauf als Muster festhalten: schneller zweiter Pass, Kreisläufer bindet zwei Abwehrspieler.',
        ],
        uiBlocks: matchBlocks,
      },
      uiBlocks: matchBlocks,
    },
  });

  const teamBlocks = [
    {
      type: 'chart', title: 'Tore und Gegentore über die Saison',
      layout: 'full', priority: 'high',
      data: {
        kind: 'line',
        categories: ['Weiden', 'Aldekerk', 'Rheinbach', 'Bergheim', 'Nordwest', 'Musterstadt', 'Ratingen'],
        series: [
          { name: 'Tore', values: [27, 30, 22, 33, 25, 31, 28] },
          { name: 'Gegentore', values: [30, 21, 22, 29, 27, 24, 26] },
        ],
      },
    },
    {
      type: 'stat-card', title: 'Angriff', layout: 'half', priority: 'high',
      data: { value: '27,9', label: 'Tore pro Spiel', trend: 'up', context: 'In keinem Spiel unter 22 Toren' },
    },
    {
      type: 'stat-card', title: 'Abwehr', layout: 'half', priority: 'high',
      data: { value: '25,6', label: 'Gegentore pro Spiel', trend: 'down', context: 'Schwankt deutlich stärker als der Angriff' },
    },
    {
      type: 'insight', title: 'Der klarste Verlustindikator',
      layout: 'full', priority: 'high',
      data: {
        text: 'Über zehn technische Fehler bedeuteten in dieser Saison bisher immer Punktverlust – in allen drei Niederlagen lag die Fehlerzahl bei elf oder höher.',
        severity: 'warning',
      },
    },
    {
      type: 'strengths-weaknesses', title: 'Stärken und Baustellen',
      layout: 'full', priority: 'medium',
      data: {
        strengths: [
          'Konstanter Angriff: in keinem Spiel unter 22 Toren.',
          'Tempo-Gegenstoß: 18 % aller Tore fallen im ersten Angriff.',
          'Rückraum trägt das Spiel über die gesamte Saison.',
        ],
        weaknesses: [
          'Paradequote schwankt zwischen 28 % und 41 %.',
          'Auswärts deutlich fehleranfälliger als zu Hause.',
          'Schlussphasen: in zwei Spielen einen Vorsprung noch abgegeben.',
        ],
      },
    },
  ];

  const SUMMARY_TEAM =
    'Über sieben Spiele steht ein stabiler Angriff (27,9 Tore im Schnitt) gegen eine schwankende Abwehr (25,6 Gegentore). Die Niederlagen fallen alle in Spiele mit mehr als zehn technischen Fehlern.';

  await db.aIAnalysisResult.create({
    data: {
      teamId: team.id, type: 'TEAM', status: 'COMPLETED',
      title: 'Teamanalyse Saison 2026/27',
      summary: SUMMARY_TEAM,
      rawInput: { note: 'Demo-Seed – keine echten Modellaufrufe.' },
      aiOutput: {
        summary: SUMMARY_TEAM,
        keyInsights: [
          'Angriff konstant: in keinem Spiel unter 22 Toren.',
          'Technische Fehler sind der klarste Verlustindikator.',
          'Paradequote schwankt zwischen 28 % und 41 %.',
        ],
        recommendations: [
          'Fehlerquote als Wochenziel führen statt Torausbeute.',
          'Auswärts früher auf den zweiten Torhüter wechseln, wenn die Quote nach 20 Minuten unter 30 % liegt.',
        ],
        uiBlocks: teamBlocks,
      },
      uiBlocks: teamBlocks,
    },
  });

  console.log('Refreshing materialised views…');
  await db.$executeRawUnsafe('SELECT 1');

  console.log(`\nDone.\n  Login: ${COACH_EMAIL} / ${COACH_PASSWORD}`);
  console.log(`  Games: ${games.length} finished + 1 live`);
  console.log(`  Featured game id: ${featured.id}`);
  console.log(`  Live game id: ${live.id}`);
  console.log(`  Tournament id: ${tournament.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
