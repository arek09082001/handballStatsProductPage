/**
 * Types for the Ratgeber (coach guide / blog) section.
 *
 * Articles are stored as data (one typed module per article under
 * `features/ratgeber/data/articles/`) and rendered by a single dynamic route.
 * The prose body is German markdown and is rendered with react-markdown inside
 * a Tailwind-typography `prose` container – see `components/article-body.tsx`.
 */

/**
 * Editorial categories used to group articles on the Ratgeber hub and to fill
 * the `articleSection` field of the BlogPosting structured data.
 */
export const ARTICLE_CATEGORIES = [
  'Statistik & Kennzahlen',
  'Training & Planung',
  'Technik & Wurf',
  'Taktik & Abwehr',
  'Spielanalyse',
  'Grundlagen & Regeln',
  'Jugend & Entwicklung',
  'Mannschaft & Mentales',
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export interface ArticleFaq {
  /** Question, rendered verbatim in the visible accordion AND the FAQPage schema. */
  question: string;
  /** Answer, rendered verbatim in the visible accordion AND the FAQPage schema. */
  answer: string;
}

export interface Article {
  /** URL slug, kebab-case, ASCII-folded (ä→ae). Path is `/ratgeber/<slug>`. */
  slug: string;
  /** On-page H1. */
  title: string;
  /** <title> tag – NO brand suffix (the root layout template appends "| Statix"). */
  metaTitle: string;
  /** Meta description, ~150–160 characters. */
  metaDescription: string;
  /** Page-specific keywords, merged with the global SEO_KEYWORDS set. */
  keywords: string[];
  category: ArticleCategory;
  /** ISO date 'YYYY-MM-DD'. */
  datePublished: string;
  /** ISO date 'YYYY-MM-DD' – drives sitemap lastModified and schema dateModified. */
  dateModified: string;
  /** Author-set reading time in minutes (avoids a runtime word count). */
  readingTimeMinutes: number;
  /** Short summary shown on cards and as the hero lede. */
  excerpt: string;
  /** Small pill label above the H1. Defaults to the category when omitted. */
  heroEyebrow?: string;
  /** Hero + OpenGraph image (a path under /public, e.g. '/shotMaps.png'). */
  imagePath: string;
  imageAlt: string;
  /** Long-form German markdown. Starts at `##` so the page has exactly one H1. */
  body: string;
  /** Optional FAQ – rendered as a visible accordion and as FAQPage schema. */
  faqs?: ArticleFaq[];
  /** Slugs of related articles for cross-linking (falls back to same category). */
  relatedSlugs?: string[];
}

export interface ArticleCategoryGroup {
  category: ArticleCategory;
  articles: Article[];
}
