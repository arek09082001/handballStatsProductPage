import { CLUB_CONFIG } from '@/lib/club-config';
import { DE_MESSAGES } from '@/lib/messages';

/**
 * The person behind the Ratgeber articles. Single source for the visible byline
 * (`ArticleHeader`), the author box (`ArticleAuthorBox`) and the `author`
 * Person node in the BlogPosting schema, so the three can never drift apart.
 *
 * `bio` and `role` describe the author's real handball background, supplied by
 * him: goalkeeper for over ten years, also coaching, at Kreis-/Bezirksliga
 * level. Keep any edit to facts he has confirmed — an invented CV here is
 * exactly the kind of thing a manual action punishes. Both come from the
 * `author` namespace of the bundles: the byline is visible on every article
 * and every other page that names him, so it speaks the reader's language,
 * while this German read is what the `Person` node carries.
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
  role: DE_MESSAGES.author.role,
  bio: DE_MESSAGES.author.bio,
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
