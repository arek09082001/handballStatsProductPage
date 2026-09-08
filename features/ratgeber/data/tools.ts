import { DE_MESSAGES } from '@/lib/messages';

/**
 * Free tools promoted above the article list on the Ratgeber hub.
 *
 * Only the routes live here. Title and description come from the `guidePage`
 * namespace of the bundles, because the hub's chrome speaks the reader's
 * language even though the articles behind it are German. The routes are the
 * join key, so a reordered bundle cannot label the tactics board with the
 * calculator's description.
 */
export interface RatgeberTool {
  href: string;
  title: string;
  description: string;
}

/** The routes, in the order the hub shows them. */
export const RATGEBER_TOOL_PATHS = [
  '/wurfquote-rechner',
  '/handball-taktikboard',
  '/handball-statistik-excel-vorlage',
] as const;

/** The German wording, for anything rendered on the server. */
export const RATGEBER_TOOLS: RatgeberTool[] = DE_MESSAGES.guidePage.tools.items;
