import { CLUB_CONFIG } from '@/lib/club-config';

/**
 * The person behind the Ratgeber articles. Single source for the visible byline
 * (`ArticleHeader`), the author box (`ArticleAuthorBox`) and the `author`
 * Person node in the BlogPosting schema, so the three can never drift apart.
 *
 * `bio` and `role` describe the author's real handball background, supplied by
 * him: goalkeeper for over ten years, also coaching, at Kreis-/Bezirksliga
 * level. Keep any edit to facts he has confirmed — an invented CV here is
 * exactly the kind of thing a manual action punishes.
 *
 * `photoPath` may be null; the author box then falls back to an initials
 * monogram rather than showing a broken image or a stand-in that is not a
 * person.
 */
export interface ArticleAuthor {
  name: string;
  role: string;
  bio: string;
  /** Path under /public, e.g. '/arkadiusz-weiss.jpg'. Null while unavailable. */
  photoPath: string | null;
  /** Where "more about the author" points. */
  profilePath: string;
}

export const ARTICLE_AUTHOR: ArticleAuthor = {
  name: CLUB_CONFIG.legal.responsiblePerson,
  role: 'Torwart, Trainer und Gründer von Statix',
  bio: 'Arkadiusz Weiss steht seit über zehn Jahren im Handballtor und trainiert selbst eine Mannschaft in der Kreis- und Bezirksliga – genau der Alltag, für den diese Ratgeber geschrieben sind. Statix ist aus diesem Alltag entstanden: aus dem Zettel am Spielfeldrand, aus dem nach dem Abpfiff nie eine brauchbare Auswertung wurde.',
  photoPath: '/arkadiusz-weiss.jpg',
  profilePath: '/was-ist-statix',
};

/** "AW" – used by the author box while there is no photo. */
export function authorInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
