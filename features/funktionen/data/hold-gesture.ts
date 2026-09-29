/**
 * The frames of the hold-gesture showcase on `/funktionen/halten-und-wischen`.
 *
 * Every frame is a real capture from `scripts/screenshots/capture.mjs` (group
 * `halten`): the same live game, the same player held, the same second on the
 * clock — the only thing that changes between them is which target is lit.
 * That sameness is the point. The showcase swaps one frame for the next, and a
 * reader should see a single screen reacting to a thumb, not six screenshots.
 *
 * The directions are the app's own rule (`features/games/recording/hold-menu.ts`
 * in the app repo): up 1gg1 verloren, down 7m verursacht, left 7m rausgeholt,
 * right 2 Min. rausgeholt. Change them there and this file is wrong.
 *
 * `width`/`height` are checked against the files by `npm run check-images`.
 * What a frame says — alt text, direction, label, explanation — lives in the
 * `featuresPage.holdGesture` namespace of the bundles, keyed by `id`.
 */

export type HoldGestureFrameId =
  | 'hold'
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'release';

/** The four swipe directions, in the order the pad reads them. */
export type HoldGestureDirection = Extract<
  HoldGestureFrameId,
  'up' | 'down' | 'left' | 'right'
>;

export interface HoldGestureFrame {
  id: HoldGestureFrameId;
  src: string;
  width: number;
  height: number;
  /**
   * The app's colour for the target — the chip lights up in exactly this tone
   * in the capture, so the pad on the page uses the same one.
   */
  tone: 'neutral' | 'warning' | 'negative' | 'positive';
}

export const HOLD_GESTURE_FRAMES: HoldGestureFrame[] = [
  {
    id: 'hold',
    src: '/halten-wischen-menue.png',
    width: 780,
    height: 1688,
    tone: 'neutral',
  },
  {
    id: 'up',
    src: '/halten-wischen-oben.png',
    width: 780,
    height: 1688,
    tone: 'warning',
  },
  {
    id: 'down',
    src: '/halten-wischen-unten.png',
    width: 780,
    height: 1688,
    tone: 'negative',
  },
  {
    id: 'left',
    src: '/halten-wischen-links.png',
    width: 780,
    height: 1688,
    tone: 'positive',
  },
  {
    id: 'right',
    src: '/halten-wischen-rechts.png',
    width: 780,
    height: 1688,
    tone: 'positive',
  },
  {
    id: 'release',
    src: '/halten-wischen-rueckgaengig.png',
    width: 780,
    height: 1688,
    tone: 'neutral',
  },
];

/**
 * The order the showcase walks through on its own until a reader takes over:
 * open, the four directions, then what letting go does.
 */
export const HOLD_GESTURE_TOUR: HoldGestureFrameId[] = [
  'hold',
  'up',
  'down',
  'left',
  'right',
  'release',
];

/** Jersey number of the player held in every frame — the pad's centre magnet. */
export const HOLD_GESTURE_JERSEY = 10;
