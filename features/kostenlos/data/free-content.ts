import type { BoardFaqItem } from '@/components/custom-ui/board-faq';
import { DE_MESSAGES } from '@/lib/messages';

export const FREE_PAGE_PATH = '/handball-statistik-app-kostenlos';

export interface FreeScopeRow {
  feature: string;
  /** The real cap, or the "no limit" wording when there genuinely is none. */
  limit: string;
}

export interface FreeAlternative {
  name: string;
  cost: string;
  good: string;
  bad: string;
}

/**
 * The honest scope table in German, for whatever the server needs it for: what
 * a free account gets **until 31.12.2026**. Every cap in the bundle is the
 * value the app enforces today.
 *
 * From 1.1.2027 the free tier becomes "Basis" and its caps tighten (one squad,
 * 20 players, 10 games); those numbers live under `pricingPage.compare` and are
 * stated on `/preise`. Two dates, two tables — do not merge them, and when a
 * limit changes in the app, change it in whichever of the two actually moved.
 */
export const FREE_SCOPE: FreeScopeRow[] = DE_MESSAGES.freePage.scope.rows;

/** The visible FAQ in German, for the route's `FAQPage` node. */
export const FREE_FAQS: BoardFaqItem[] = DE_MESSAGES.freePage.faq.items;
