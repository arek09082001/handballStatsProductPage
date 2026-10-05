import { z } from 'zod';
import { CLUB_CONFIG } from '@/lib/club-config';

/**
 * The app's price list, as the pricing page reads it.
 *
 * The app owns every figure (`lib/billing/price-sheet.ts` in the app repo) and
 * publishes it at `CLUB_CONFIG.website.pricesApiUrl`. It also owns the rule for
 * buying mid-season — the rest of the running season by started months, floored
 * to whole euros — and sends the result along as `rest`. This page only ever
 * ADDS those values up. Re-deriving them here would put the season rule into a
 * second repository, and the two would drift at the next change.
 *
 * All amounts are integer cents and end prices: no VAT is stated, because under
 * the small-business rule (§ 19 UStG) none may be.
 */

export type AppTierId = 'basis' | 'trainer' | 'pro';
export type PaidAppTierId = Exclude<AppTierId, 'basis'>;
export type VideoTierId = 'none' | 'basis' | 'team' | 'analyse';
export type PaidVideoTierId = Exclude<VideoTierId, 'none'>;
/** Both axes share one cadence: a season (1 July – 30 June) or a month. */
export type Cadence = 'season' | 'month';

export const APP_TIER_IDS: readonly AppTierId[] = ['basis', 'trainer', 'pro'];
export const VIDEO_TIER_IDS: readonly VideoTierId[] = [
  'none',
  'basis',
  'team',
  'analyse',
];
export const PAID_VIDEO_TIER_IDS: readonly PaidVideoTierId[] = [
  'basis',
  'team',
  'analyse',
];

export interface SeasonPrice {
  /** The full season price in cents, charged every 1 July. */
  season: number;
  /**
   * What buying TODAY costs for the rest of the running season, in cents —
   * computed by the app. `null` when the page renders from the static fallback,
   * because then nobody has computed it, and this page must not guess.
   */
  rest: number | null;
}

export interface AppTierPrices {
  /** On its own. */
  standard: SeasonPrice;
  /** Next to any video tier, season only. */
  pack: SeasonPrice;
  /** For accounts registered before the launch, season only, without video. */
  founder: SeasonPrice;
  /** Per month, in cents. No discount of any kind applies monthly. */
  month: number;
}

export interface VideoTierPrices extends SeasonPrice {
  month: number;
  /** Storage held at any one time, for one team. */
  storageGb: number;
  /** Included compute credits per full season and per paid month. */
  credits: { season: number; month: number };
}

export interface CreditPack {
  credits: number;
  price: number;
}

export interface PriceSheet {
  /** `live` = read from the app; `fallback` = the static copy below. */
  source: 'live' | 'fallback';
  /** From this instant anybody can buy (ISO). */
  launchAt: string;
  /** Whether the app considered the launch passed when the list was built. */
  launched: boolean;
  season: {
    /** `false` in April–June: then only the monthly subscription is offered. */
    purchaseOpen: boolean;
    /** Started months left in the running season; `null` in the fallback. */
    remainingMonths: number | null;
    /** When a season subscription is first charged in full (ISO). */
    nextSeasonStart: string | null;
    /** From this many remaining months on, only monthly is offered. */
    monthlyOnlyRemainingMonths: number;
  };
  app: Record<PaidAppTierId, AppTierPrices>;
  video: Record<PaidVideoTierId, VideoTierPrices>;
  creditPacks: { small: CreditPack; large: CreditPack };
  founder: {
    /** Registered before this instant = founder (ISO). */
    registeredBefore: string;
    /** Trainer is free until this instant, exclusive (ISO). */
    freeUntil: string;
    /** The founder price can be taken until this instant (ISO). */
    priceRedeemableUntil: string;
  };
  /** The buy button's target; the selection travels as query parameters. */
  checkoutUrl: string;
}

const seasonOnly = (season: number): SeasonPrice => ({ season, rest: null });

/**
 * The static copy the page renders when the app cannot be reached — at build
 * time in a sandbox, or during an outage. Same figures as the app's catalog on
 * 2026-10-05; deliberately WITHOUT any `rest`, so the "today" line disappears
 * instead of showing an amount nobody computed.
 */
export const FALLBACK_PRICE_SHEET: PriceSheet = {
  source: 'fallback',
  launchAt: '2026-12-31T23:00:00.000Z',
  launched: false,
  season: {
    // Unknown without the app. Offering the season is the safer default: the
    // app's checkout refuses it in April–June anyway.
    purchaseOpen: true,
    remainingMonths: null,
    nextSeasonStart: null,
    monthlyOnlyRemainingMonths: 3,
  },
  app: {
    trainer: {
      standard: seasonOnly(7900),
      pack: seasonOnly(3900),
      founder: seasonOnly(5900),
      month: 990,
    },
    pro: {
      standard: seasonOnly(14900),
      pack: seasonOnly(7500),
      founder: seasonOnly(10900),
      month: 1490,
    },
  },
  video: {
    basis: {
      ...seasonOnly(14900),
      month: 1490,
      storageGb: 100,
      credits: { season: 0, month: 0 },
    },
    team: {
      ...seasonOnly(39900),
      month: 3990,
      storageGb: 300,
      credits: { season: 40, month: 3 },
    },
    analyse: {
      ...seasonOnly(84900),
      month: 8490,
      storageGb: 500,
      credits: { season: 180, month: 15 },
    },
  },
  creditPacks: {
    small: { credits: 10, price: 1900 },
    large: { credits: 30, price: 4900 },
  },
  founder: {
    registeredBefore: '2026-12-31T23:00:00.000Z',
    freeUntil: '2027-06-30T22:00:00.000Z',
    priceRedeemableUntil: '2027-09-30T22:00:00.000Z',
  },
  checkoutUrl: CLUB_CONFIG.website.checkoutIntentUrl,
};

const cents = z.number().int().nonnegative();
const isoDate = z.string().refine((value) => !Number.isNaN(Date.parse(value)));
const withRest = z.object({ season: cents, rest: cents });
const appTier = z.object({
  standard: withRest,
  pack: withRest,
  founder: withRest,
  month: cents,
});
const videoTier = z.object({
  season: cents,
  rest: cents,
  month: cents,
  storageGb: z.number().int().positive(),
  credits: z.object({ season: cents, month: cents }),
});
const creditPack = z.object({ credits: z.number().int().positive(), price: cents });

/** The response of `GET /api/public/billing/prices`, checked at the border. */
const apiSchema = z.object({
  launchAt: isoDate,
  launched: z.boolean(),
  currency: z.literal('EUR'),
  season: z.object({
    purchaseOpen: z.boolean(),
    remainingMonths: z.number().int().min(1).max(12),
    nextSeasonStart: isoDate,
    monthlyOnlyRemainingMonths: z.number().int().nonnegative(),
  }),
  app: z.object({ trainer: appTier, pro: appTier }),
  video: z.object({ basis: videoTier, team: videoTier, analyse: videoTier }),
  creditPacks: z.object({ credits_10: creditPack, credits_30: creditPack }),
  founder: z.object({
    registeredBefore: isoDate,
    freeUntil: isoDate,
    priceRedeemableUntil: isoDate,
  }),
  checkoutUrl: z.string(),
});

/**
 * The buy button may only ever point into the app. A response that names any
 * other target is ignored in favour of the configured one — the list is
 * public data from another deployment, and a link to a checkout is the one
 * place on this site where a wrong URL costs somebody money.
 */
function trustedCheckoutUrl(value: string): string {
  try {
    const url = new URL(value);
    const app = new URL(CLUB_CONFIG.website.appUrl);
    if (url.origin === app.origin && url.protocol === 'https:') {
      return `${url.origin}${url.pathname}`;
    }
  } catch {
    // fall through to the configured target
  }
  return CLUB_CONFIG.website.checkoutIntentUrl;
}

/**
 * Turns an API response into a `PriceSheet`, or `null` when it does not have
 * the expected shape (in which case the caller renders the fallback).
 */
export function parsePriceSheet(payload: unknown): PriceSheet | null {
  const parsed = apiSchema.safeParse(payload);
  if (!parsed.success) return null;
  const data = parsed.data;

  return {
    source: 'live',
    launchAt: data.launchAt,
    launched: data.launched,
    season: { ...data.season },
    app: data.app,
    video: data.video,
    creditPacks: {
      small: data.creditPacks.credits_10,
      large: data.creditPacks.credits_30,
    },
    founder: data.founder,
    checkoutUrl: trustedCheckoutUrl(data.checkoutUrl),
  };
}
