import type { BoardMagnet, CourtViewId, MagnetKind } from '../interfaces';
import { COURT_VIEWS, fromCourtPoint } from './court-geometry';

/**
 * Ready-made setups, so the board is never an empty rectangle.
 *
 * Positions are written in **court units** (10 units = 1 m, exactly the scale
 * of `court-geometry.ts`) and converted to normalised board coordinates on
 * load. That way "the pivot stands on the 6 m line" is a number you can check
 * against the geometry — the goal-area line of the Halbfeld sits at y = 90, and
 * the pivot below is at y = 90.
 *
 * The 6:0 defence and the 3:3 attack are the same arrangement the landing-page
 * `CourtDiagram` chalks on, rotated into the goal-at-the-bottom view. The
 * remaining systems follow the descriptions in the Ratgeber articles
 * `handball-5-1-abwehr`, `handball-3-2-1-abwehr` and
 * `handball-angriffssysteme-einsteiger`.
 */

/** `[x, y, jersey number]` in court units. */
type Spot = readonly [number, number, number];

// -- Halbfeld: x runs 0–200 across the 20 m width, y runs 0–150 with the goal
// line at 150. The 6 m line is at y = 90, the 9 m line at y = 60.

const HALF_KEEPER: Spot = [100, 144, 16];

/** Flat 6:0 — six defenders shoulder to shoulder just outside the 6 m line. */
const HALF_DEFENCE_60: Spot[] = [
  [44, 95, 4],
  [70, 85, 3],
  [92, 79, 6],
  [108, 79, 5],
  [130, 85, 8],
  [156, 95, 2],
];

/** 5:1 — a five-chain on the 6 m line plus one player up at the 9 m line. */
const HALF_DEFENCE_51: Spot[] = [
  [44, 92, 4],
  [70, 82, 3],
  [100, 79, 6],
  [130, 82, 8],
  [156, 92, 2],
  [100, 57, 5],
];

/** 3:2:1 — three at the 6 m line, two in front of them, one at the point. */
const HALF_DEFENCE_321: Spot[] = [
  [52, 92, 4],
  [100, 79, 6],
  [148, 92, 2],
  [74, 68, 3],
  [126, 68, 8],
  [100, 50, 5],
];

/** 3:3 — three backs, two wings, one pivot on the line. */
const HALF_ATTACK_33: Spot[] = [
  [20, 95, 11],
  [52, 50, 7],
  [100, 32, 10],
  [148, 50, 14],
  [180, 95, 13],
  [100, 90, 9],
];

/** 4:2 — the wings move in, two pivots work the line. */
const HALF_ATTACK_42: Spot[] = [
  [34, 75, 11],
  [74, 44, 7],
  [126, 44, 14],
  [166, 75, 13],
  [78, 90, 9],
  [122, 90, 10],
];

// -- Ganzfeld: x runs 0–400 along the 40 m length, y runs 0–200 across. Own
// goal on the left, the attack rolls to the right.

const FULL_OWN_KEEPER: Spot = [10, 100, 16];
const FULL_AWAY_KEEPER: Spot = [390, 100, 1];

/** First wave: wings gone at the moment of the save, one carrier in the middle. */
const FULL_FASTBREAK_HOME: Spot[] = [
  [120, 100, 10],
  [255, 28, 11],
  [255, 172, 13],
  [70, 62, 7],
  [70, 138, 14],
  [40, 100, 9],
];

const FULL_FASTBREAK_AWAY: Spot[] = [
  [300, 66, 3],
  [300, 134, 8],
  [335, 100, 6],
  [265, 100, 5],
];

export interface FormationPreset {
  id: string;
  view: CourtViewId;
  label: string;
  /** One line under the picker, so the choice is informed. */
  hint: string;
  build: () => BoardMagnet[];
}

function place(
  view: CourtViewId,
  kind: MagnetKind,
  spots: readonly Spot[],
  offset: number,
): BoardMagnet[] {
  return spots.map((spot, index) => {
    const point = fromCourtPoint(COURT_VIEWS[view], spot[0], spot[1]);
    return {
      id: `p${offset + index}`,
      kind,
      number: spot[2],
      x: point.x,
      y: point.y,
    };
  });
}

function halbfeld(
  away: readonly Spot[],
  home: readonly Spot[],
  options: { awayKeeper?: boolean } = {},
): BoardMagnet[] {
  const keeper = options.awayKeeper === false ? [] : place('halbfeld', 'keeper', [HALF_KEEPER], 0);
  return [
    ...keeper,
    ...place('halbfeld', 'away', away, 10),
    ...place('halbfeld', 'home', home, 20),
  ];
}

export const FORMATION_PRESETS: FormationPreset[] = [
  {
    id: '6-0',
    view: 'halbfeld',
    label: '6:0-Abwehr gegen Angriff 3:3',
    hint: 'Die Standardsituation im Amateur- und Jugendbereich.',
    build: () => halbfeld(HALF_DEFENCE_60, HALF_ATTACK_33),
  },
  {
    id: '5-1',
    view: 'halbfeld',
    label: '5:1-Abwehr gegen Angriff 3:3',
    hint: 'Fünferkette am Kreis, ein Vorgezogener auf Höhe der Freiwurflinie.',
    build: () => halbfeld(HALF_DEFENCE_51, HALF_ATTACK_33),
  },
  {
    id: '3-2-1',
    view: 'halbfeld',
    label: '3:2:1-Abwehr gegen Angriff 3:3',
    hint: 'Drei am Sechsmeter, zwei davor, einer vorgezogen am Neunmeter.',
    build: () => halbfeld(HALF_DEFENCE_321, HALF_ATTACK_33),
  },
  {
    id: '4-2',
    view: 'halbfeld',
    label: 'Angriff 4:2 gegen 6:0-Abwehr',
    hint: 'Zwei Kreisläufer binden die Mitte, vier stehen in der hinteren Reihe.',
    build: () => halbfeld(HALF_DEFENCE_60, HALF_ATTACK_42),
  },
  {
    id: 'eigene-abwehr',
    view: 'halbfeld',
    label: 'Nur eigene 6:0-Abwehr',
    hint: 'Ohne Gegner – für die Abwehrbesprechung in der Kabine.',
    build: () => [
      ...place('halbfeld', 'keeper', [HALF_KEEPER], 0),
      ...place('halbfeld', 'home', HALF_DEFENCE_60, 10),
    ],
  },
  {
    id: 'tempogegenstoss',
    view: 'ganzfeld',
    label: 'Tempogegenstoß über das ganze Feld',
    hint: 'Erste Welle über die Außen, zweite Welle hinterher, Gegner im Rückzug.',
    build: () => [
      ...place('ganzfeld', 'keeper', [FULL_OWN_KEEPER, FULL_AWAY_KEEPER], 0),
      ...place('ganzfeld', 'away', FULL_FASTBREAK_AWAY, 10),
      ...place('ganzfeld', 'home', FULL_FASTBREAK_HOME, 20),
    ],
  },
  {
    id: 'leer',
    view: 'halbfeld',
    label: 'Leeres Feld',
    hint: 'Nur der Boden – du setzt alles selbst.',
    build: () => [],
  },
];

export const DEFAULT_FORMATION_ID = '6-0';

export function findFormation(id: string): FormationPreset | undefined {
  return FORMATION_PRESETS.find((preset) => preset.id === id);
}
