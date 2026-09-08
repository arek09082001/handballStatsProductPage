import type { BoardFaqItem } from '@/components/custom-ui/board-faq';
import { DE_MESSAGES } from '@/lib/messages';

/** Route of the Handball-Statistiken pillar page. */
export const STATS_PAGE_PATH = '/handball-statistiken';

export interface StatDefinition {
  /** The metric as a coach names it – also the `DefinedTerm` in the schema. */
  term: string;
  /** One sentence: what it counts, and what it is good for. */
  definition: string;
}

export interface StatGroup {
  /** Group name, used as the card heading. */
  name: string;
  /** What the group as a whole answers. */
  intro: string;
  stats: StatDefinition[];
}

export interface StatFormula {
  metric: string;
  formula: string;
  benchmark: string;
}

export interface StatStep {
  title: string;
  text: string;
}

/** One recording method, as the comparison band shows it. */
export interface StatWayCopy {
  name: string;
  effort: string;
  good: string;
  bad: string;
  /** Empty when the site has no page for this way — paper has none. */
  linkLabel: string;
}

/** Where each way links, in the order the bundle lists them. */
export const STAT_WAY_LINKS: readonly (string | null)[] = [
  null,
  '/handball-statistik-excel-vorlage',
  '/handball-statistik-app-kostenlos',
];

/**
 * The catalogue in German, for the route's `DefinedTermSet`. Grouped the way a
 * coach reads a game: attack first, then the goal that has to be defended, then
 * rhythm, discipline and the season. Every term is one Statix records – nothing
 * aspirational.
 */
export const STAT_GROUPS: StatGroup[] = DE_MESSAGES.statsPage.catalog.groups;

/**
 * The formulas in German, with the reference ranges the Ratgeber articles use.
 * The ranges are experience values from the amateur game, not a measured data
 * set – keep them identical to `wurfquote-berechnen`,
 * `handball-torwart-statistik` and `handball-ballbesitz-tempo` in every
 * language, so the site never quotes two different numbers for the same metric.
 */
export const STAT_FORMULAS: StatFormula[] = DE_MESSAGES.statsPage.formulas.rows;

/** The five steps in German, for the route's `HowTo` node. */
export const STAT_STEPS: StatStep[] = DE_MESSAGES.statsPage.howTo.steps;

/**
 * The Ratgeber articles this page hands off to, in reading order: the metric a
 * coach starts with, then the ones that put it in context. Resolved against
 * the article data at render time so titles never drift.
 */
export const STAT_GUIDE_SLUGS = [
  'handball-statistik-fuehren',
  'wurfquote-berechnen',
  'handball-torwart-statistik',
  'handball-ballbesitz-tempo',
  'handball-expected-goals-xg',
  'handball-spielanalyse',
  'handball-statistik-zettel-excel-app',
  'handball-spielerentwicklung-messen',
  'handball-statistik-verein-einfuehren',
] as const;

/** The visible FAQ in German, for the route's `FAQPage` node. */
export const STATS_FAQS: BoardFaqItem[] = DE_MESSAGES.statsPage.faq.items;
