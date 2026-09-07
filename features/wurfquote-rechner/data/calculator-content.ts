import type { BoardFaqItem } from '@/components/custom-ui/board-faq';
import { DE_MESSAGES } from '@/lib/messages';

export const CALCULATOR_PAGE_PATH = '/wurfquote-rechner';
export const CALCULATOR_EMBED_PATH = '/wurfquote-rechner/embed';

export interface BenchmarkRange {
  id: string;
  /** Lower end of the typical range in percent. */
  min: number;
  /** Upper end; omitted where only a floor is meaningful (team quota). */
  max?: number;
}

/** Label and one-line reason for a benchmark, in the reader's language. */
export interface BenchmarkCopy {
  id: string;
  label: string;
  hint: string;
}

/** A benchmark ready to render: the range plus the copy that belongs to it. */
export type PositionBenchmark = BenchmarkRange & BenchmarkCopy;

/**
 * The ranges from the Ratgeber article `wurfquote-berechnen` — amateur up to
 * ambitious league level. Deliberately the same numbers as the article: two
 * sources with different ranges would be worthless to a coach.
 *
 * The figures live here rather than in the bundles because they are the same in
 * every language, and a percentage that drifted between two translations would
 * be a different claim, not a different wording. Only the labels and the reason
 * behind each range are translated.
 */
export const BENCHMARK_RANGES: readonly BenchmarkRange[] = [
  { id: 'tempo', min: 85, max: 95 },
  { id: 'siebenmeter', min: 75, max: 85 },
  { id: 'kreis', min: 65, max: 75 },
  { id: 'aussen', min: 55, max: 70 },
  { id: 'rueckraum', min: 45, max: 55 },
  { id: 'team', min: 60 },
];

export const DEFAULT_BENCHMARK_ID = 'rueckraum';

/** Snippet for club sites – the same height as the embed layout. */
export const EMBED_SNIPPET = `<iframe
  src="https://www.statix-app.de/wurfquote-rechner/embed"
  title="Wurfquoten-Rechner von Statix"
  width="100%"
  height="760"
  loading="lazy"
  style="border:0;max-width:640px"
></iframe>`;

/** The visible FAQ in German, for the route's `FAQPage` node. */
export const CALCULATOR_FAQS: BoardFaqItem[] =
  DE_MESSAGES.calculatorPage.faq.items;
