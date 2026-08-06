/**
 * Types for the Handball-Taktikboard.
 *
 * Every position on the board is stored **normalised** (0–1 relative to the
 * court box), never in pixels and never in court units. Two reasons: the board
 * has to survive a resize between phone and beamer without recomputing
 * anything, and the share link stays short because a coordinate is two base-36
 * characters instead of a float.
 */

/** Which court is drawn. Both are to scale – see `data/court-geometry.ts`. */
export type CourtViewId = 'halbfeld' | 'ganzfeld';

/** Board ground. `paper` exists so a printed board does not eat toner. */
export type BoardGround = 'court' | 'paper';

/**
 * Token kinds. `home`/`away` follow the two-marker rule from DESIGN.md
 * (orange = us, blue = them); `keeper` reuses the teal keeper token the
 * landing-page `CourtDiagram` already uses.
 */
export type MagnetKind = 'home' | 'away' | 'keeper' | 'ball';

/** German tactic-board notation: solid run, dashed pass, heavy shot. */
export type ArrowKind = 'laufweg' | 'pass' | 'wurf';

/** `neutral` resolves to chalk on the dark court and to ink on paper. */
export type ArrowColor = 'marker' | 'opponent' | 'neutral';

export interface BoardMagnet {
  id: string;
  kind: MagnetKind;
  /** Jersey number 0–99. Ignored for `ball`. */
  number: number;
  x: number;
  y: number;
}

export interface BoardArrow {
  id: string;
  kind: ArrowKind;
  color: ArrowColor;
  x1: number;
  y1: number;
  /** Quadratic control point – the coach drags it to bend the arrow. */
  cx: number;
  cy: number;
  x2: number;
  y2: number;
}

export interface BoardLabel {
  id: string;
  x: number;
  y: number;
  text: string;
}

export interface BoardState {
  view: CourtViewId;
  ground: BoardGround;
  magnets: BoardMagnet[];
  arrows: BoardArrow[];
  labels: BoardLabel[];
}

/** What the toolbar is currently editing. `null` = nothing selected. */
export type BoardSelection =
  | { type: 'magnet'; id: string }
  | { type: 'arrow'; id: string }
  | { type: 'label'; id: string }
  | null;

/** Which grab handle of an arrow a pointer is dragging. */
export type ArrowHandle = 'start' | 'control' | 'end';

/**
 * What a drag on the empty court does.
 *
 * A mode switch rather than a clever gesture, because the board has to behave
 * the same under a finger and under a mouse: in `move` the court keeps its
 * native scrolling so a phone can scroll past the board, in `arrow` and `note`
 * it swallows the gesture and draws.
 */
export type BoardMode = 'move' | 'arrow' | 'note';
