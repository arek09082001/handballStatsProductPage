import type { CourtViewId } from '../interfaces';

/**
 * The court, built from real metres.
 *
 * Same construction and the same unit scale as the landing-page
 * `CourtDiagram` (10 SVG units = 1 metre), so the board and the rest of the
 * site draw the identical floor. The measurements are the ones the Ratgeber
 * article `handball-spielfeld-masse` states: 40 × 20 m, a 3 m goal, the
 * goal-area line at 6 m, the dashed free-throw line at 9 m, the 7 m mark and
 * the 4 m keeper line.
 *
 * Nothing here is eyeballed: every path is derived from the constants below,
 * which is why the 6 m line is two quarter circles centred on the posts joined
 * by a straight segment — not an oval — and why the 9 m line stops exactly
 * where it meets the sideline instead of spilling off the floor.
 */

/** 1 metre = 10 SVG units. */
const M = 10;

const COURT_WIDTH = 20 * M; // 20 m across
const HALF_DEPTH = 15 * M; // the attacking third that fits a phone screen
const FULL_LENGTH = 40 * M; // 40 m end to end
const GOAL_HALF = 1.5 * M; // the goal is 3 m wide
const GOAL_DEPTH = 0.8 * M; // drawn behind the goal line, not a real measure
const AREA_R = 6 * M; // Torraumlinie
const FREE_R = 9 * M; // Freiwurflinie (dashed)
const SEVEN_M = 7 * M;
const FOUR_M = 4 * M;
const MARK_HALF = 0.5 * M; // the 7 m line is 1 m long
const TICK_HALF = 0.1 * M; // the 4 m line is a short tick

/**
 * Where the 9 m arc meets the sideline. Pythagoras on the circle centred on a
 * post: the post sits `postOffset` from that sideline.
 */
function freeThrowSidelineOffset(postOffset: number): number {
  return Math.sqrt(FREE_R * FREE_R - postOffset * postOffset);
}

function round(value: number): string {
  return Number(value.toFixed(2)).toString();
}

// ---------------------------------------------------------------------------
// Halbfeld — goal at the bottom, the court running upwards. This is how half
// court diagrams are drawn in German coaching material, and it is the shape
// that fills a phone held upright.
// ---------------------------------------------------------------------------

const HALF_CENTRE_X = COURT_WIDTH / 2;
const HALF_POST_L = HALF_CENTRE_X - GOAL_HALF;
const HALF_POST_R = HALF_CENTRE_X + GOAL_HALF;
const HALF_GOAL_Y = HALF_DEPTH;
const HALF_AREA_Y = HALF_GOAL_Y - AREA_R;
const HALF_FREE_Y = HALF_GOAL_Y - FREE_R;
const HALF_FREE_SIDE_Y = HALF_GOAL_Y - freeThrowSidelineOffset(HALF_POST_L);

const HALBFELD = {
  viewBox: `-8 -10 ${COURT_WIDTH + 16} ${HALF_DEPTH + GOAL_DEPTH + 22}`,
  /** Both sidelines plus the goal line; the far edge is a cut, not a line. */
  boundary: `M 0 0 V ${HALF_GOAL_Y} M ${COURT_WIDTH} 0 V ${HALF_GOAL_Y} M 0 ${HALF_GOAL_Y} H ${COURT_WIDTH}`,
  goalArea: `M ${HALF_POST_L - AREA_R} ${HALF_GOAL_Y} A ${AREA_R} ${AREA_R} 0 0 1 ${HALF_POST_L} ${HALF_AREA_Y} L ${HALF_POST_R} ${HALF_AREA_Y} A ${AREA_R} ${AREA_R} 0 0 1 ${HALF_POST_R + AREA_R} ${HALF_GOAL_Y}`,
  freeThrow: `M 0 ${round(HALF_FREE_SIDE_Y)} A ${FREE_R} ${FREE_R} 0 0 1 ${HALF_POST_L} ${HALF_FREE_Y} L ${HALF_POST_R} ${HALF_FREE_Y} A ${FREE_R} ${FREE_R} 0 0 1 ${COURT_WIDTH} ${round(HALF_FREE_SIDE_Y)}`,
  marks: `M ${HALF_CENTRE_X - MARK_HALF} ${HALF_GOAL_Y - SEVEN_M} H ${HALF_CENTRE_X + MARK_HALF} M ${HALF_CENTRE_X - TICK_HALF} ${HALF_GOAL_Y - FOUR_M} H ${HALF_CENTRE_X + TICK_HALF}`,
  goal: `M ${HALF_POST_L} ${HALF_GOAL_Y} V ${HALF_GOAL_Y + GOAL_DEPTH} H ${HALF_POST_R} V ${HALF_GOAL_Y}`,
} as const;

// ---------------------------------------------------------------------------
// Ganzfeld — 40 × 20 m, both goals mirrored across the centre line. Same
// orientation as the landing-page court so the two never read as two floors.
// ---------------------------------------------------------------------------

const FULL_CENTRE_Y = COURT_WIDTH / 2;
const FULL_POST_T = FULL_CENTRE_Y - GOAL_HALF;
const FULL_POST_B = FULL_CENTRE_Y + GOAL_HALF;
const FULL_FREE_SIDE_X = freeThrowSidelineOffset(FULL_POST_T);

const GANZFELD = {
  viewBox: `-14 -8 ${FULL_LENGTH + 28} ${COURT_WIDTH + 16}`,
  boundary: `M 0 0 H ${FULL_LENGTH} V ${COURT_WIDTH} H 0 Z`,
  centre: `M ${FULL_LENGTH / 2} 0 V ${COURT_WIDTH}`,
  goalArea: [
    `M 0 ${FULL_POST_T - AREA_R} A ${AREA_R} ${AREA_R} 0 0 1 ${AREA_R} ${FULL_POST_T} L ${AREA_R} ${FULL_POST_B} A ${AREA_R} ${AREA_R} 0 0 1 0 ${FULL_POST_B + AREA_R}`,
    `M ${FULL_LENGTH} ${FULL_POST_T - AREA_R} A ${AREA_R} ${AREA_R} 0 0 0 ${FULL_LENGTH - AREA_R} ${FULL_POST_T} L ${FULL_LENGTH - AREA_R} ${FULL_POST_B} A ${AREA_R} ${AREA_R} 0 0 0 ${FULL_LENGTH} ${FULL_POST_B + AREA_R}`,
  ].join(' '),
  freeThrow: [
    `M ${round(FULL_FREE_SIDE_X)} 0 A ${FREE_R} ${FREE_R} 0 0 1 ${FREE_R} ${FULL_POST_T} L ${FREE_R} ${FULL_POST_B} A ${FREE_R} ${FREE_R} 0 0 1 ${round(FULL_FREE_SIDE_X)} ${COURT_WIDTH}`,
    `M ${round(FULL_LENGTH - FULL_FREE_SIDE_X)} 0 A ${FREE_R} ${FREE_R} 0 0 0 ${FULL_LENGTH - FREE_R} ${FULL_POST_T} L ${FULL_LENGTH - FREE_R} ${FULL_POST_B} A ${FREE_R} ${FREE_R} 0 0 0 ${round(FULL_LENGTH - FULL_FREE_SIDE_X)} ${COURT_WIDTH}`,
  ].join(' '),
  marks: [
    `M ${SEVEN_M} ${FULL_CENTRE_Y - MARK_HALF} V ${FULL_CENTRE_Y + MARK_HALF}`,
    `M ${FOUR_M} ${FULL_CENTRE_Y - TICK_HALF} V ${FULL_CENTRE_Y + TICK_HALF}`,
    `M ${FULL_LENGTH - SEVEN_M} ${FULL_CENTRE_Y - MARK_HALF} V ${FULL_CENTRE_Y + MARK_HALF}`,
    `M ${FULL_LENGTH - FOUR_M} ${FULL_CENTRE_Y - TICK_HALF} V ${FULL_CENTRE_Y + TICK_HALF}`,
  ].join(' '),
  goal: [
    `M 0 ${FULL_POST_T} H ${-GOAL_DEPTH} V ${FULL_POST_B} H 0`,
    `M ${FULL_LENGTH} ${FULL_POST_T} H ${FULL_LENGTH + GOAL_DEPTH} V ${FULL_POST_B} H ${FULL_LENGTH}`,
  ].join(' '),
} as const;

export interface CourtView {
  id: CourtViewId;
  /** Short label for the view switch. */
  label: string;
  /** Longer description, used as the switch's helper text. */
  hint: string;
  viewBox: string;
  /** width ÷ height of the viewBox – drives the board's CSS aspect ratio. */
  aspectRatio: number;
  boundary: string;
  goalArea: string;
  freeThrow: string;
  marks: string;
  goal: string;
  /** Only the full court has one. */
  centre?: string;
}

function aspectOf(viewBox: string): number {
  const [, , width, height] = viewBox.split(' ').map(Number);
  return width / height;
}

export const COURT_VIEWS: Record<CourtViewId, CourtView> = {
  halbfeld: {
    id: 'halbfeld',
    label: 'Halbfeld',
    hint: 'Tor unten, 15 Meter Feldtiefe – für Abwehr und Angriff.',
    viewBox: HALBFELD.viewBox,
    aspectRatio: aspectOf(HALBFELD.viewBox),
    boundary: HALBFELD.boundary,
    goalArea: HALBFELD.goalArea,
    freeThrow: HALBFELD.freeThrow,
    marks: HALBFELD.marks,
    goal: HALBFELD.goal,
  },
  ganzfeld: {
    id: 'ganzfeld',
    label: 'Ganzes Feld',
    hint: '40 × 20 Meter mit beiden Toren – für Tempogegenstoß und Rückzug.',
    viewBox: GANZFELD.viewBox,
    aspectRatio: aspectOf(GANZFELD.viewBox),
    boundary: GANZFELD.boundary,
    goalArea: GANZFELD.goalArea,
    freeThrow: GANZFELD.freeThrow,
    marks: GANZFELD.marks,
    goal: GANZFELD.goal,
    centre: GANZFELD.centre,
  },
};

export const COURT_VIEW_LIST: CourtView[] = [
  COURT_VIEWS.halbfeld,
  COURT_VIEWS.ganzfeld,
];

/**
 * Maps a normalised board position (0–1) onto the view's SVG user space, so
 * arrows drawn in the SVG land exactly under the HTML magnets above them. The
 * SVG is stretched over the whole board box (`preserveAspectRatio="none"` on a
 * container whose aspect ratio already matches the viewBox), so this is an
 * exact mapping, not an approximation.
 */
export function toViewBoxPoint(
  view: CourtView,
  x: number,
  y: number,
): { x: number; y: number } {
  const [minX, minY, width, height] = view.viewBox.split(' ').map(Number);
  return { x: minX + x * width, y: minY + y * height };
}

/**
 * The inverse: a position given in court units (10 units = 1 m) becomes a
 * normalised board position. Formations are written in court units because
 * "the pivot stands on the 6 m line" is checkable and `0.5, 0.555` is not.
 */
export function fromCourtPoint(
  view: CourtView,
  courtX: number,
  courtY: number,
): { x: number; y: number } {
  const [minX, minY, width, height] = view.viewBox.split(' ').map(Number);
  return { x: (courtX - minX) / width, y: (courtY - minY) / height };
}
