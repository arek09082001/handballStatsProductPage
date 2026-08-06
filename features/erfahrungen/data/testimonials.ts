/**
 * Real, attributable coach testimonials — and nothing else.
 *
 * RULES (do not relax them):
 * - Only add an entry for a quote a real person actually gave and agreed to
 *   have published with their name and club. No composites, no "typical"
 *   coaches, no rewritten praise.
 * - `ratingValue` is only set when that person actually gave a rating on a
 *   1–5 scale. Never estimate one from the tone of a quote.
 * - While this array is empty, `/erfahrungen` renders as an honest "so
 *   entsteht Statix" page and the home page section renders nothing. Neither
 *   emits `Review` or `AggregateRating` markup — fabricated review markup is a
 *   manual-action risk with Google and a legal risk in Germany.
 * - `aggregateRating` is only emitted from three real ratings upwards and is
 *   always computed from this data (see `getAggregateRating`), never written
 *   by hand.
 */
export interface Testimonial {
  /** Full name of the coach, as they agreed to be published. */
  name: string;
  /** Role, e.g. 'Trainer A-Jugend männlich'. */
  role: string;
  /** Club name. */
  club: string;
  /** The quote, verbatim. Light typo fixes are fine; rewriting is not. */
  quote: string;
  /** Optional rating on a 1–5 scale, only if the person actually gave one. */
  ratingValue?: number;
  /** ISO date 'YYYY-MM-DD' the feedback was given. */
  date: string;
}

/** Empty until real coaches have given quotes. See the rules above. */
export const TESTIMONIALS: Testimonial[] = [];

/** Minimum number of real ratings before an aggregate is meaningful. */
export const MIN_RATINGS_FOR_AGGREGATE = 3;

export const BEST_RATING = 5;
export const WORST_RATING = 1;

export function hasTestimonials(): boolean {
  return TESTIMONIALS.length > 0;
}

export interface AggregateRating {
  ratingValue: number;
  reviewCount: number;
}

/**
 * Averages the ratings that actually exist. Returns null below
 * `MIN_RATINGS_FOR_AGGREGATE`, so the route emits no `aggregateRating` until
 * there is something real to aggregate.
 * @returns The computed average and count, or null when there is not enough real data.
 */
export function getAggregateRating(): AggregateRating | null {
  const rated = TESTIMONIALS.filter(
    (testimonial): testimonial is Testimonial & { ratingValue: number } =>
      typeof testimonial.ratingValue === 'number',
  );

  if (rated.length < MIN_RATINGS_FOR_AGGREGATE) {
    return null;
  }

  const sum = rated.reduce((total, testimonial) => total + testimonial.ratingValue, 0);

  return {
    ratingValue: Math.round((sum / rated.length) * 10) / 10,
    reviewCount: rated.length,
  };
}
