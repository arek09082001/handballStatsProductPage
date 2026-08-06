import { CLUB_CONFIG } from '@/lib/club-config';

/**
 * The person behind the Ratgeber articles. Single source for the visible byline
 * (`ArticleHeader`), the author box (`ArticleAuthorBox`) and the `author`
 * Person node in the BlogPosting schema, so the three can never drift apart.
 *
 * `bio` is currently the product truth from PRODUCT.md ("Made by a handballer,
 * in Germany ... built out of real sideline practice"). Replace it with a
 * first-person handball background — playing/coaching history, club, level —
 * which is what actually carries experience signals. Do not invent one.
 *
 * `photoPath` is null until a real photo of the author is added to `public/`.
 * With no photo the box falls back to an initials monogram rather than showing
 * a broken image or a stand-in that is not a person.
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
  role: 'Handballer und Gründer von Statix',
  bio: 'Statix entsteht aus der Praxis am Spielfeldrand: Arkadiusz Weiss ist selbst Handballer und baut die App aus dem, was in der Halle wirklich gebraucht wird. Rückmeldungen von Trainerinnen und Trainern fließen direkt in das Produkt ein.',
  photoPath: null,
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
