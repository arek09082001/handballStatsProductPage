/**
 * Types for the Ratgeber (coach guide / blog) section.
 *
 * Articles are stored as data (one typed module per article under
 * `features/ratgeber/data/articles/`) and rendered by a single dynamic route.
 * The prose body is German markdown and is rendered with react-markdown inside
 * a Tailwind-typography `prose` container – see `components/article-body.tsx`.
 *
 * An article is not just prose: `archetype` names its build shape (which H2
 * skeleton it follows) and `modules` carries the structured parts – formula,
 * benchmark table, exercise card, session timeline, court formation, decision
 * matrix, tool embed – that plain markdown cannot express. Modules render as
 * server components between the body sections, so the article body stays free
 * of client JavaScript.
 */

/**
 * Editorial categories used to group articles on the Ratgeber hub and to fill
 * the `articleSection` field of the BlogPosting structured data. The order is
 * the hub order: what a coach measures first, then plans, then teaches.
 *
 * `Grundlagen & Regeln` is the last surviving pre-2026 label and is kept for
 * `handball-spielfeld-masse`, which is deliberately frozen and keeps its
 * original category.
 */
export const ARTICLE_CATEGORIES = [
  'Kennzahlen & Analyse',
  'Trainingsplanung',
  'Technik vermitteln',
  'Taktik & Systeme',
  'Regelwissen',
  'Grundlagen & Regeln',
  'Jugend & Ausbildung',
  'Team & Führung',
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

/**
 * The build shape of an article. Each archetype has its own binding H2
 * skeleton (see the Ratgeber section of DESIGN.md), its own module set and its
 * own page layout, so two articles never read as the same template.
 *
 * - `kennzahl`     – metric explainer: answer, formula, worked example, benchmarks
 * - `system`       – tactical system: setup, roles, principle, strengths, drills
 * - `rezept`       – training recipe: goal, timeline, exercise cards, load
 * - `referenz`     – rule/reference: answer box, table, edge cases
 * - `entscheidung` – decision aid: starting points, criteria, matrix, recommendation
 */
export type ArticleArchetype =
  | 'kennzahl'
  | 'system'
  | 'rezept'
  | 'referenz'
  | 'entscheidung';

/** Short badge label per archetype, shown on cards and in the article header. */
export const ARCHETYPE_LABELS: Record<ArticleArchetype, string> = {
  kennzahl: 'Kennzahl',
  system: 'System',
  rezept: 'Trainingsrezept',
  referenz: 'Nachschlagen',
  entscheidung: 'Entscheidungshilfe',
};

/** Rating used in a decision matrix cell. */
export type DecisionScore = 'gut' | 'geht' | 'schlecht';

/**
 * A structured block rendered between the markdown sections of an article.
 *
 * `after` anchors the module to an H2: it renders directly below the section
 * whose heading text matches. Omitted, the module renders above the lede –
 * which is where an `answerBox` belongs so the answer is in the first 60 words.
 */
export type ArticleModule = { after?: string } & (
  | {
      /** Short direct answer for featured snippets and AI answers. */
      kind: 'answerBox';
      text: string;
    }
  | {
      /** A metric's definition, set as a formula with an optional worked example. */
      kind: 'formula';
      label: string;
      formula: string;
      example?: string;
    }
  | {
      /** Reference values as a scoresheet table. */
      kind: 'benchmarkTable';
      caption: string;
      columns: string[];
      rows: string[][];
      /** Optional note under the table, e.g. where the ranges come from. */
      note?: string;
    }
  | {
      /** One drill of a session, as the card a coach would take to the hall. */
      kind: 'exercise';
      name: string;
      /** Duration/age hint, e.g. '8 Min. · ab D-Jugend'. */
      meta?: string;
      setup: string;
      organisation: string;
      coachingPoints: string[];
      commonError: string;
      variation?: string;
    }
  | {
      /** A session as a minute-by-minute timeline. */
      kind: 'sessionTimeline';
      caption?: string;
      blocks: { minutes: number; label: string; note?: string }[];
    }
  | {
      /** A setup chalked onto the court diagram instead of another screenshot. */
      kind: 'formation';
      system: '6-0' | '5-1' | '3-2-1' | 'mann' | 'angriff';
      caption: string;
    }
  | {
      /** Options scored against weighted criteria. */
      kind: 'decisionMatrix';
      caption?: string;
      criteria: string[];
      options: { name: string; scores: DecisionScore[]; verdict?: string }[];
    }
  | {
      /** One of the existing noindex tool routes, embedded in the article. */
      kind: 'embed';
      target: 'wurfquote-rechner' | 'handball-taktikboard';
      caption: string;
    }
);

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
  /**
   * Build shape – drives the H2 skeleton, the module set and the page layout.
   * Optional only for `handball-spielfeld-masse`, which predates the archetypes
   * and renders in the pre-archetype layout.
   */
  archetype?: ArticleArchetype;
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
  /** Structured blocks interleaved with the body – see `ArticleModule`. */
  modules?: ArticleModule[];
  /** Optional FAQ – rendered as a visible accordion and as FAQPage schema. */
  faqs?: ArticleFaq[];
  /** Slugs of related articles for cross-linking (falls back to same category). */
  relatedSlugs?: string[];
}

export interface ArticleCategoryGroup {
  category: ArticleCategory;
  articles: Article[];
}
