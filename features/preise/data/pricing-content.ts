import type { BoardFaqItem } from '@/components/custom-ui/board-faq';
import { DE_MESSAGES, fillPlaceholders } from '@/lib/messages';

export const PRICING_PAGE_PATH = '/preise';

/**
 * Shape and server-side copy of `/preise`, in one module.
 *
 * The commercial truth itself — every figure, every limit, every sentence —
 * now lives under `pricingPage` in `messages/*.json`, because the page speaks
 * five languages and a price table that exists only in German is a price table
 * four fifths of the readers cannot check. What stays here are the types the
 * components read the bundle back into, and the German text the server needs
 * for structured data.
 *
 * The figures the configurator computes with are not in the bundle either:
 * they come from the app's public price list (`price-sheet.ts`, read on the
 * server in `fetch-price-sheet.ts`), with a static fallback of the same
 * figures. The prose in the bundle quotes those figures in words ("79 € je
 * Saison") and has to be changed with them.
 *
 * Rules that survive the move (they belong to the bundle now, not to this file):
 *  - **Never round, pad or invent a number.** Every limit is a plan limit the
 *    app will enforce; every price is an end price.
 *  - **Buyable from the launch, through the app.** The buy button opens on
 *    1 January 2027 by itself, or earlier with `?kasse=vorschau` (the app
 *    refuses anybody not on its preview list, so the flag is cosmetic). It
 *    hands over to the app — login or registration, then Stripe — and never
 *    takes payment details on this site. Before the launch the action is
 *    registration, which is what the founder guarantee rewards.
 *  - **The season rule lives in the app.** What a purchase mid-season costs is
 *    sent pre-computed (`rest`); this site only adds those values up.
 *  - **No VAT is shown.** Under the small-business rule (§ 19 UStG) none may be
 *    stated; showing it anyway would be owed under § 14c UStG.
 */
const PRICING = DE_MESSAGES.pricingPage;

/**
 * The labels that recur across the page's sentences, as ICU arguments.
 *
 * They are arguments rather than baked-in text for the same reason they used
 * to be constants: the launch date appears in nine sentences, and nine
 * sentences are nine chances to move one of them and not the others.
 */
export const PRICING_LABEL_KEYS = [
  'launchDate',
  'founderDeadline',
  'founderFreeUntil',
  'founderRedeemUntil',
  'coachCount',
] as const;

export type PricingLabels = Record<(typeof PRICING_LABEL_KEYS)[number], string>;

/** The German values of those labels, for server-rendered copy. */
export const DE_PRICING_LABELS: PricingLabels = {
  launchDate: PRICING.launchDate,
  founderDeadline: PRICING.founderDeadline,
  founderFreeUntil: PRICING.founderFreeUntil,
  founderRedeemUntil: PRICING.founderRedeemUntil,
  coachCount: PRICING.coachCount,
};

/** `true` = included, `false` = not included, string = the figure behind it. */
export type CompareValue = boolean | string;

export interface CompareRowBase {
  label: string;
  /** Reads under the label — what a number counts, or what a limit really does. */
  hint?: string;
}

/** A row of the app-tier comparison: one value per app tier. */
export interface AppCompareRow extends CompareRowBase {
  basis: CompareValue;
  trainer: CompareValue;
  pro: CompareValue;
}

/** A row of the video-tier comparison: one value per paid video tier. */
export interface VideoCompareRow extends CompareRowBase {
  basis: CompareValue;
  team: CompareValue;
  analyse: CompareValue;
}

export interface CompareGroup<Row extends CompareRowBase = AppCompareRow> {
  id: string;
  title: string;
  /** One sentence on why this block is cut the way it is. */
  note: string;
  rows: readonly Row[];
}

export interface FounderStep {
  number: number;
  title: string;
  text: string;
}

export interface ComparisonRow {
  aspect: string;
  paper: string;
  excel: string;
  statix: string;
}

/**
 * The FAQ as the route's `FAQPage` node needs it: German, with the date
 * arguments already substituted, and identical word for word to what the
 * German reader sees in the accordion.
 */
export const PRICING_FAQS: BoardFaqItem[] = PRICING.faq.items.map((item) => ({
  question: fillPlaceholders(item.question, DE_PRICING_LABELS),
  answer: fillPlaceholders(item.answer, DE_PRICING_LABELS),
}));
