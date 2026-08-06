import type { ArrowColor, BoardGround, MagnetKind } from '../interfaces';

/**
 * The board's own colour table.
 *
 * Every value mirrors a token in `app/globals.css` — the comment on each line
 * names which one. They are written out as literal `hsla()` instead of
 * `hsl(var(--token) / …)` for one concrete reason: the PNG export runs the
 * board through html2canvas, which (a) serialises the court `<svg>` into a
 * standalone image where CSS custom properties no longer exist, and (b) cannot
 * parse the `color-mix(in oklab, …)` that a Tailwind opacity modifier compiles
 * to. A board styled with `stroke-chalk/70` would export with black lines.
 *
 * This is the same trade-off the shipped tactic primitives already make —
 * `court-diagram.tsx`, `player-magnet.tsx` and `marker-arrow.tsx` all carry
 * literal `hsl()` tables for their SVG. Keep this file in sync with the tokens
 * if the brand colours ever move; nothing else in the feature hardcodes colour.
 */

export interface BoardGroundPalette {
  /** The playing surface itself. */
  surface: string;
  /** Court markings. */
  line: string;
  /** The dashed 9 m line and the boundary, one step quieter. */
  lineSoft: string;
  /** Goal frame — the heaviest stroke on the floor. */
  goalLine: string;
  /** Note chips and the attribution mark. */
  chipSurface: string;
  chipBorder: string;
  chipText: string;
  /** Focus ring drawn around a selected object. */
  selection: string;
}

export const BOARD_GROUNDS: Record<BoardGround, BoardGroundPalette> = {
  // --court / --court-2 / --chalk
  court: {
    surface: 'hsla(199, 46%, 12%, 1)',
    line: 'hsla(0, 0%, 100%, 0.74)',
    lineSoft: 'hsla(0, 0%, 100%, 0.42)',
    goalLine: 'hsla(0, 0%, 100%, 0.92)',
    chipSurface: 'hsla(200, 40%, 17%, 0.96)',
    chipBorder: 'hsla(0, 0%, 100%, 0.28)',
    chipText: 'hsla(0, 0%, 100%, 0.96)',
    selection: 'hsla(22, 92%, 62%, 1)',
  },
  // --paper / --paper-2 / --ink
  paper: {
    surface: 'hsla(40, 33%, 96%, 1)',
    line: 'hsla(222, 24%, 13%, 0.62)',
    lineSoft: 'hsla(222, 24%, 13%, 0.34)',
    goalLine: 'hsla(222, 24%, 13%, 0.86)',
    chipSurface: 'hsla(38, 30%, 91.5%, 0.98)',
    chipBorder: 'hsla(222, 24%, 13%, 0.22)',
    chipText: 'hsla(222, 24%, 13%, 0.94)',
    selection: 'hsla(22, 92%, 46%, 1)',
  },
};

export interface MagnetPalette {
  /** Flat token colour — see the note below on why this is not a gradient. */
  surface: string;
  rim: string;
  text: string;
}

/**
 * Magnet colours as flat fills.
 *
 * The landing-page `PlayerMagnet` gets its magnet look from a radial sheen.
 * Here the token has to survive the PNG export, and html2canvas draws neither a
 * radial gradient nor an inset shadow the way the browser does: both flood the
 * disc and an exported board came out in salmon and pastel blue, which destroys
 * the whole point of orange = us, blue = them. Measured on the built page, a
 * flat fill plus an ordinary offset shadow exports as rgb(245, 96, 10) — the
 * same pixel the browser paints.
 */
export const MAGNET_COLORS: Record<MagnetKind, MagnetPalette> = {
  // --primary: your team
  home: {
    surface: 'hsla(22, 92%, 50%, 1)',
    rim: 'hsla(22, 90%, 30%, 0.85)',
    text: 'hsla(30, 60%, 99%, 1)',
  },
  // --secondary: the opponent
  away: {
    surface: 'hsla(221, 83%, 50%, 1)',
    rim: 'hsla(221, 80%, 28%, 0.85)',
    text: 'hsla(210, 60%, 99%, 1)',
  },
  // The keeper token of the shipped `CourtDiagram`, darkened a step so the
  // white jersey number clears the contrast floor on it too.
  keeper: {
    surface: 'hsla(168, 54%, 34%, 1)',
    rim: 'hsla(168, 52%, 18%, 0.85)',
    text: 'hsla(180, 40%, 99%, 1)',
  },
  ball: {
    surface: 'hsla(40, 33%, 96%, 1)',
    rim: 'hsla(222, 24%, 20%, 0.6)',
    text: 'hsla(222, 24%, 18%, 1)',
  },
};

/**
 * Magnet depth: one real offset shadow, and deliberately nothing inset. Inset
 * shadows are the one box-shadow form html2canvas renders as a full-surface
 * wash, which is what tinted the exported tokens.
 */
export const MAGNET_SHADOW = '0 6px 12px -6px hsla(222, 30%, 8%, 0.75)';

/**
 * Caveat with the `ui-rounded` generic stripped out. The board's note chips set
 * this inline rather than using the `font-hand` token: html2canvas draws text
 * through the canvas font shorthand, Chrome's parser rejects `ui-rounded`, and
 * a rejected shorthand silently falls back — exporting the coach's marker notes
 * in a system sans.
 */
export const NOTE_FONT_FAMILY = "var(--font-caveat), 'Caveat', cursive";

/**
 * Arrow ink, one step lighter on the dark floor and one step darker on paper.
 * Not decoration: the mid tones of `--primary` and `--secondary` clear 3:1
 * against the court but fall under it against paper, and an arrow a coach
 * cannot see from the bench is a broken arrow. `neutral` flips outright —
 * chalk on the floor, ink on paper.
 */
export function arrowStroke(color: ArrowColor, ground: BoardGround): string {
  const onCourt = ground === 'court';
  if (color === 'marker') {
    return onCourt ? 'hsla(22, 94%, 56%, 1)' : 'hsla(22, 92%, 44%, 1)'; // --primary
  }
  if (color === 'opponent') {
    return onCourt ? 'hsla(221, 88%, 64%, 1)' : 'hsla(221, 83%, 46%, 1)'; // --secondary
  }
  return onCourt ? 'hsla(0, 0%, 100%, 0.94)' : 'hsla(222, 24%, 13%, 0.88)';
}
