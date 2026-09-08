import type { BoardFaqItem } from '@/components/custom-ui/board-faq';
import { DE_MESSAGES } from '@/lib/messages';
import type {
  ArrowColor,
  ArrowKind,
  BoardMode,
  MagnetKind,
} from '../interfaces';

export const TAKTIKBOARD_PAGE_PATH = '/handball-taktikboard';
export const TAKTIKBOARD_EMBED_PATH = '/handball-taktikboard/embed';

/**
 * How much fits on one board. These are capacities, not a paywall: a handball
 * squad is fourteen players and this holds more than two full squads. They
 * exist so the share link stays short enough to survive a chat app.
 */
export const BOARD_CAPACITY = {
  magnets: 32,
  arrows: 20,
  labels: 12,
} as const;

export const LABEL_MAX_CHARS = 24;

/** The mark burned into every exported PNG. Stated openly on the page. */
export const EXPORT_WATERMARK = 'statix-app.de';

export const EXPORT_FILE_NAME = 'handball-taktikboard';

/**
 * Board width the PNG is rendered at, in CSS pixels, before the 2× scale.
 *
 * The export comes from an off-screen board of exactly this width rather than
 * from the one on screen, because token sizes carry a minimum and a maximum:
 * on a 325 px phone board a magnet is 8 % of the width, on an 860 px desktop
 * board 5.6 %. Exporting the live board therefore produced a visibly chunkier
 * picture on a small window. At 900 the proportions match a roomy desktop board
 * and the file lands at 1800 × 1500 — big enough for a beamer, small enough for
 * a chat app.
 */
export const EXPORT_BOARD_WIDTH = 900;

export interface MagnetKindOption {
  kind: MagnetKind;
  label: string;
  /** Screen-reader wording for the add button. */
  action: string;
}

export interface BoardModeOption {
  mode: BoardMode;
  /** Accessible name and hover title of the icon-only rail button. */
  action: string;
  /** Shown under the board, so it is clear what a drag will do next. */
  hint: string;
}

export interface ArrowKindOption {
  kind: ArrowKind;
  label: string;
  hint: string;
}

export interface ArrowColorOption {
  value: ArrowColor;
  /** Short name, for the on-board editor where the chip is 80 px wide. */
  label: string;
  /** Name plus who it stands for, for the rail's accessible name. */
  longLabel: string;
}

export interface CourtFact {
  element: string;
  measure: string;
  /** What that measurement looks like on this board. */
  onBoard: string;
}

export interface BoardStep {
  title: string;
  text: string;
}

export interface FormationNote {
  /** Matches the id in `data/formations.ts`. */
  id: string;
  title: string;
  text: string;
  articleLabel: string;
}

/** Where each formation note links, keyed by the note's id. */
export const FORMATION_ARTICLE_HREFS: Readonly<Record<string, string>> = {
  '6-0': '/ratgeber/handball-6-0-abwehr',
  '5-1': '/ratgeber/handball-5-1-abwehr',
  '3-2-1': '/ratgeber/handball-3-2-1-abwehr',
  '4-2': '/ratgeber/handball-angriffssysteme-einsteiger',
  tempogegenstoss: '/ratgeber/handball-tempogegenstoss',
};

/**
 * Snippet for club sites. The height is measured, not guessed: at 760 px the
 * board and its controls stack to about 1 950 px. An iframe cannot size itself
 * to its content, so the number has to cover the tallest case.
 */
export const EMBED_SNIPPET = `<iframe
  src="https://www.statix-app.de/handball-taktikboard/embed"
  title="Handball-Taktikboard von Statix"
  width="100%"
  height="1960"
  loading="lazy"
  style="border:0;max-width:760px"
></iframe>`;

/** The visible FAQ in German, for the route's `FAQPage` node. */
export const TAKTIKBOARD_FAQS: BoardFaqItem[] = DE_MESSAGES.boardPage.faq.items;
