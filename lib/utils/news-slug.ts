/**
 * Utility functions for generating and parsing news article slugs
 * Format: [title-slug]-[YYYYMMDD]
 */

/**
 * Generate a URL-friendly slug from a title
 */
export function generateTitleSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .trim();
}

/**
 * Format date to YYYYMMDD
 */
export function formatDateSlug(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Generate complete news slug from title and creation date
 */
export function generateNewsSlug(
  title: string,
  createdAt: Date | string
): string {
  const titleSlug = generateTitleSlug(title);
  const dateSlug = formatDateSlug(createdAt);
  return `${titleSlug}-${dateSlug}`;
}

/**
 * Parse a news slug to extract components
 */
export function parseNewsSlug(
  slug: string | undefined | null
): { titleSlug: string; dateSlug: string } | null {
  // Guard against undefined/null slug
  if (!slug || typeof slug !== 'string') return null;
  
  // Match pattern: anything-YYYYMMDD
  const match = slug.match(/^(.*)-(\d{8})$/);
  if (!match) return null;

  const [, titleSlug, dateSlug] = match;
  return { titleSlug, dateSlug };
}

/**
 * Find news article by slug (title + date)
 */
export async function findNewsBySlug(slug: string | undefined | null) {
  // Guard against undefined/null slug
  if (!slug || typeof slug !== 'string') return null;
  
  const parsed = parseNewsSlug(slug);
  if (!parsed) return null;

  const { dateSlug } = parsed;

  // Convert YYYYMMDD to date range (start and end of day)
  const year = parseInt(dateSlug.substring(0, 4));
  const month = parseInt(dateSlug.substring(4, 6)) - 1; // Month is 0-indexed
  const day = parseInt(dateSlug.substring(6, 8));

  const startDate = new Date(year, month, day, 0, 0, 0);
  const endDate = new Date(year, month, day, 23, 59, 59);

  return {
    createdAt: {
      gte: startDate,
      lte: endDate,
    },
    titleSlug: parsed.titleSlug,
  };
}
