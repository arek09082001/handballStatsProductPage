import deMessages from '@/messages/de.json';

/**
 * The German bundle, for the places a translation cannot reach.
 *
 * The language of this site lives in client state, not in the URL, so anything
 * rendered on the server — page metadata, JSON-LD — is always German: that is
 * what the canonical URL serves and what a crawler indexes. Those places read
 * their copy from here instead of keeping a second German original next to the
 * bundle, which is how the on-page FAQ and its `FAQPage` markup used to drift
 * apart (Google requires them to match).
 */
export const DE_MESSAGES = deMessages;

/**
 * Fills `{name}` placeholders from a value map — the server-side twin of `t()`.
 *
 * Only the plain-argument form of ICU is supported, which is the only form the
 * bundles use. An unknown placeholder is left standing rather than replaced by
 * an empty string, so a typo shows up as `{founderDeadlin}` in the markup
 * instead of quietly deleting the date from a structured-data answer.
 */
export function fillPlaceholders(
  text: string,
  values: Readonly<Record<string, string>>,
): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match,
  );
}
