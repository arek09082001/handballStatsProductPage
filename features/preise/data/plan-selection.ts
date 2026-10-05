import type {
  AppTierId,
  Cadence,
  PaidAppTierId,
  PaidVideoTierId,
  PriceSheet,
  VideoTierId,
} from './price-sheet';

/**
 * What a visitor has put together in the configurator — exactly the three
 * values the app's `/api/billing/intent` accepts.
 */
export interface PlanSelection {
  app: AppTierId;
  video: VideoTierId;
  cadence: Cadence;
}

export const DEFAULT_SELECTION: PlanSelection = {
  app: 'trainer',
  video: 'none',
  cadence: 'season',
};

/** Which season price of an app tier applies. */
export type AppVariant = 'standard' | 'pack';

export interface AppLine {
  kind: 'app';
  tier: PaidAppTierId;
  variant: AppVariant;
  /** The amount per cadence (season or month), in cents. */
  amount: number;
  /** The standalone season price when the package price applies, else `null`. */
  instead: number | null;
  /** Today's amount for the rest of the season; `null` monthly or without data. */
  rest: number | null;
}

export interface VideoLine {
  kind: 'video';
  tier: PaidVideoTierId;
  amount: number;
  rest: number | null;
}

export type PlanLine = AppLine | VideoLine;

export interface PlanQuote {
  lines: PlanLine[];
  /** Nothing paid selected: App Basis without video. */
  free: boolean;
  /** The recurring amount: per season from 1 July, or per month. */
  recurring: number;
  /**
   * What a purchase costs today, in cents: the sum of the app's `rest` values
   * on a season, the first month on a monthly plan. `null` when a season rest
   * is not known (fallback data) — never estimated.
   */
  today: number | null;
  /**
   * The founder season price of the app tier, when it could apply to this
   * selection (season, paid app tier, no video). The page cannot know whether
   * the visitor is a founder; the app's checkout decides.
   */
  founder: { amount: number; instead: number } | null;
}

/**
 * The price of a selection, line by line — no rule of the app's re-derived,
 * only its figures looked up and added:
 *
 * - App Basis is free and never a line.
 * - Next to any video tier, the app tier costs its PACKAGE price — on the
 *   season only. Monthly there is no discount of any kind.
 * - "Today" on a season is the sum of the `rest` values the app computed.
 */
export function quotePlan(selection: PlanSelection, sheet: PriceSheet): PlanQuote {
  const lines: PlanLine[] = [];
  const season = selection.cadence === 'season';
  const withVideo = selection.video !== 'none';

  if (selection.app !== 'basis') {
    const prices = sheet.app[selection.app];
    const variant: AppVariant = season && withVideo ? 'pack' : 'standard';
    const price = prices[variant];
    lines.push({
      kind: 'app',
      tier: selection.app,
      variant,
      amount: season ? price.season : prices.month,
      instead: variant === 'pack' ? prices.standard.season : null,
      rest: season ? price.rest : null,
    });
  }

  if (selection.video !== 'none') {
    const prices = sheet.video[selection.video];
    lines.push({
      kind: 'video',
      tier: selection.video,
      amount: season ? prices.season : prices.month,
      rest: season ? prices.rest : null,
    });
  }

  const recurring = lines.reduce((sum, line) => sum + line.amount, 0);
  const today = season
    ? lines.every((line) => line.rest !== null)
      ? lines.reduce((sum, line) => sum + (line.rest ?? 0), 0)
      : null
    : recurring;

  const founder =
    season && !withVideo && selection.app !== 'basis'
      ? {
          amount: sheet.app[selection.app].founder.season,
          instead: sheet.app[selection.app].standard.season,
        }
      : null;

  return { lines, free: lines.length === 0, recurring, today, founder };
}

/**
 * The buy button's target: the app's intent route with the selection as query
 * parameters. The app remembers it as a cookie, routes through login or
 * registration and opens its own checkout — whether anybody may buy is decided
 * there, never here.
 */
export function checkoutHref(selection: PlanSelection, sheet: PriceSheet): string {
  const params = new URLSearchParams({
    app: selection.app,
    video: selection.video,
    cadence: selection.cadence,
  });
  return `${sheet.checkoutUrl}?${params.toString()}`;
}
