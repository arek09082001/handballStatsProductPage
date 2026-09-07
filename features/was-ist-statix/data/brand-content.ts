import { CLUB_CONFIG } from '@/lib/club-config';
import { DE_MESSAGES, fillPlaceholders } from '@/lib/messages';

/**
 * Shape and server-side copy of the brand page `/was-ist-statix`.
 *
 * The page targets brand-intent searches ("statix", "was ist statix",
 * "statix app", "statix handball"), so people who hear about Statix and google
 * the name land here or on the home page. Every sentence it shows now lives
 * under `brandPage` in `messages/*.json` — the page answers "what is Statix?"
 * in whichever language the reader picked. What stays here is the part a
 * translation has no business owning: which screenshot goes with which
 * highlight, and the German the route needs for its `FAQPage` node.
 *
 * Facts mirror `lib/seo.ts` (HOMEPAGE_FAQS, APP_FEATURES) and
 * `lib/club-config.ts` — keep them in sync when the product changes.
 */

export const BRAND_PAGE_PATH = '/was-ist-statix';

/**
 * The three site addresses that appear inside brand-page sentences, as ICU
 * arguments. They are arguments rather than text because a domain is not
 * translated and must not drift between five bundles.
 */
export const BRAND_LINK_ARGS = {
  domain: CLUB_CONFIG.website.domain,
  appUrl: CLUB_CONFIG.website.appUrlWithoutProtocol,
  instagram: CLUB_CONFIG.social.instagram.handle,
} as const;

export interface BrandFact {
  label: string;
  value: string;
}

export interface BrandHighlightCopy {
  badge: string;
  title: string;
  description: string;
}

export interface BrandAudience {
  title: string;
  description: string;
}

/**
 * The screenshot behind each highlight row, in the order the copy lists them.
 *
 * Dimensions mirror the ones used by the landing-page showcase so Next.js can
 * reserve the correct aspect ratio, and they must match the file on disk —
 * `npm run check-images` fails the build's honesty check otherwise.
 */
export const BRAND_HIGHLIGHT_MEDIA = [
  { src: '/recordStatsInGame.png', width: 2560, height: 1600 },
  { src: '/statsTableInGame.png', width: 2560, height: 2000 },
  { src: '/shotMaps.png', width: 2560, height: 2000 },
  { src: '/aiAnalyze.png', width: 2560, height: 2000 },
] as const;

/**
 * Brand-intent FAQ for the route's `FAQPage` node: German, with the addresses
 * substituted, and word for word what a German reader sees in the accordion.
 *
 * Deliberately phrased around the brand name (not around generic "handball
 * app" queries, which the home page FAQ already covers) so the page answers
 * what people googling "statix" actually want to know.
 */
export const BRAND_FAQS = DE_MESSAGES.brandPage.faq.items.map((item) => ({
  question: fillPlaceholders(item.question, BRAND_LINK_ARGS),
  answer: fillPlaceholders(item.answer, BRAND_LINK_ARGS),
}));
