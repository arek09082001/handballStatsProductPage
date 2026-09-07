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
 * Rules that survive the move (they belong to the bundle now, not to this file):
 *  - **Never round, pad or invent a number.** Every limit is a plan limit the
 *    app will enforce; every price is an end price.
 *  - **Nothing is buyable yet.** No CTA may read like a checkout — the action
 *    on this page is registration, and registration before the deadline is what
 *    the founder guarantee rewards.
 *  - **No VAT is shown.** Under the small-business rule (§ 19 UStG) none may be
 *    stated; showing it anyway would be owed under § 14c UStG.
 */
const PRICING = DE_MESSAGES.pricingPage;

/**
 * The four labels that recur across the page's sentences, as ICU arguments.
 *
 * They are arguments rather than baked-in text for the same reason they used
 * to be constants: the launch date appears in nine sentences, and nine
 * sentences are nine chances to move one of them and not the others.
 */
export const PRICING_LABEL_KEYS = [
  'launchDate',
  'founderDeadline',
  'founderFreeUntil',
  'coachCount',
] as const;

export type PricingLabels = Record<(typeof PRICING_LABEL_KEYS)[number], string>;

/** The German values of those labels, for server-rendered copy. */
export const DE_PRICING_LABELS: PricingLabels = {
  launchDate: PRICING.launchDate,
  founderDeadline: PRICING.founderDeadline,
  founderFreeUntil: PRICING.founderFreeUntil,
  coachCount: PRICING.coachCount,
};

/** The two ways to pay. A "year" is a season here: 1 July – 30 June. */
export type BillingPeriod = 'monat' | 'jahr';

export type TierId = 'basis' | 'trainer' | 'pro';

export interface TierPrice {
  /** The figure itself, pre-formatted per language so SSR and client agree. */
  amount: string;
  /** What the figure buys, e.g. "im Monat". */
  unit: string;
  /** One line under the price — the per-month equivalent or the commitment. */
  note: string;
}

export interface Tier {
  id: TierId;
  name: string;
  /** Who this is, in one line. */
  audience: string;
  price: Record<BillingPeriod, TierPrice>;
  /** Two or three sentences on what the tier is for. */
  summary: string;
  /** The short list on the card — the differences, not the catalogue. */
  highlights: readonly string[];
  /** Label of the card's action. */
  ctaLabel: string;
  /** Marked as the one most coaches want. */
  recommended?: boolean;
}

/** `true` = included, `false` = not included, string = the figure behind it. */
export type CompareValue = boolean | string;

export interface CompareRow {
  label: string;
  /** Reads under the label — what a number counts, or what a limit really does. */
  hint?: string;
  basis: CompareValue;
  trainer: CompareValue;
  pro: CompareValue;
}

export interface CompareGroup {
  id: string;
  title: string;
  /** One sentence on why this block is cut the way it is. */
  note: string;
  rows: readonly CompareRow[];
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
