import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * The one look an inline link has inside body copy on this site.
 *
 * Kept as a constant rather than repeated per call site: it appears in every
 * closing paragraph of every commercial page, and the pages drifted apart on it
 * once already (`underline-offset-4` in some, nothing in others).
 */
export const INLINE_LINK_CLASS =
  'font-semibold text-primary underline underline-offset-4 hover:text-primary/80';

/**
 * A next-intl rich-text tag that renders an internal link.
 *
 * Sentences with a link in them are written as one message with a tag around
 * the anchor text — `"… steht auf der Seite <club>App für Vereine</club>."` —
 * instead of being cut into a lead, a label and a tail. Three fragments cannot
 * be translated: Polish and French put the clause in a different order, and a
 * translator handed `closingMiddle: ". Für Trainerteams …"` has no way to see
 * what it attaches to.
 *
 * @param href Internal route the tag should link to.
 * @returns A tag function for `t.rich`.
 */
export function inlineLink(href: string) {
  return function renderInlineLink(chunks: ReactNode) {
    return (
      <Link href={href} className={INLINE_LINK_CLASS}>
        {chunks}
      </Link>
    );
  };
}

/**
 * A next-intl rich-text tag for an external link — the app, the demo, a mail
 * address. Same look, but it leaves the site, so it carries `rel`.
 */
export function externalLink(href: string) {
  return function renderExternalLink(chunks: ReactNode) {
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className={INLINE_LINK_CLASS}>
        {chunks}
      </a>
    );
  };
}
