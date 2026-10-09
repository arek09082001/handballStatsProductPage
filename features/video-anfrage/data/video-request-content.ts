/**
 * Shared vocabulary of the video access request.
 *
 * The video area — tagging bench, livestream, analysis from the picture — is
 * finished enough to run, but it runs as a closed beta: an account sees it
 * only once it is on the app's allowlist. Until this form existed the site
 * said "schreib uns" in four places and offered no button; the request now has
 * its own route (`/video-anfrage`), and the pricing configurator, the two
 * video feature pages and the "in progress" band all point here.
 *
 * The ids live in this module because both ends need them: the client renders
 * the tiers as radio chips (labels from `videoRequestPage.tiers.*`, so the UI
 * stays in the reader's language) and `POST /api/video-request` validates the
 * submitted value against them before it reaches the notification mail.
 * Kept free of React so the API route can import it.
 */

/** Route of the request page. */
export const VIDEO_REQUEST_PAGE_PATH = '/video-anfrage';

/**
 * The tier a visitor has in mind. The three paid video tiers of the price
 * list plus "unsure", which is the honest default for somebody who has only
 * just read that the video exists.
 */
export const VIDEO_REQUEST_TIER_IDS = [
  'basis',
  'team',
  'analyse',
  'unsure',
] as const;

export type VideoRequestTierId = (typeof VIDEO_REQUEST_TIER_IDS)[number];

export const DEFAULT_VIDEO_REQUEST_TIER: VideoRequestTierId = 'unsure';

/**
 * Where the visitor came from, for the notification mail. A closed list, not
 * free text: the value travels in the URL and ends up in a mail to the team.
 */
export const VIDEO_REQUEST_SOURCE_IDS = [
  'preise',
  'video-tagging',
  'livestream',
  'funktionen',
] as const;

export type VideoRequestSourceId = (typeof VIDEO_REQUEST_SOURCE_IDS)[number];

/** Query parameter the request page reads the preselected tier from. */
export const VIDEO_REQUEST_TIER_PARAM = 'stufe';
/** Query parameter naming the page the visitor came from. */
export const VIDEO_REQUEST_SOURCE_PARAM = 'von';

export function isVideoRequestTierId(
  value: unknown,
): value is VideoRequestTierId {
  return (
    typeof value === 'string' &&
    (VIDEO_REQUEST_TIER_IDS as readonly string[]).includes(value)
  );
}

export function isVideoRequestSourceId(
  value: unknown,
): value is VideoRequestSourceId {
  return (
    typeof value === 'string' &&
    (VIDEO_REQUEST_SOURCE_IDS as readonly string[]).includes(value)
  );
}

/**
 * The request page with the tier and the origin in the query, so a visitor who
 * has just picked "Video Team" in the configurator finds it preselected and
 * the team sees which page the request came from.
 *
 * @param options.tier The video tier the visitor has in mind, if any.
 * @param options.source The page the button sits on.
 * @returns The internal href of the request page.
 */
export function videoRequestHref(
  options: {
    tier?: VideoRequestTierId | 'none';
    source?: VideoRequestSourceId;
  } = {},
): string {
  const params = new URLSearchParams();
  if (options.tier && options.tier !== 'none') {
    params.set(VIDEO_REQUEST_TIER_PARAM, options.tier);
  }
  if (options.source) {
    params.set(VIDEO_REQUEST_SOURCE_PARAM, options.source);
  }
  const query = params.toString();
  return query
    ? `${VIDEO_REQUEST_PAGE_PATH}?${query}`
    : VIDEO_REQUEST_PAGE_PATH;
}

/**
 * German labels for the notification e-mail. Deliberately not read from
 * `messages/*.json`: the mail goes to the team, and the team reads German —
 * every other transactional template is German-only for the same reason. The
 * visitor-facing labels stay in the message catalogue.
 */
export const VIDEO_REQUEST_TIER_EMAIL_LABELS: Record<
  VideoRequestTierId,
  string
> = {
  basis: 'Video Basis',
  team: 'Video Team',
  analyse: 'Video Analyse',
  unsure: 'Noch unklar',
};

export const VIDEO_REQUEST_SOURCE_EMAIL_LABELS: Record<
  VideoRequestSourceId,
  string
> = {
  preise: 'Preisseite (Konfigurator)',
  'video-tagging': 'Funktionsseite Video & Tagging',
  livestream: 'Funktionsseite Livestream',
  funktionen: 'Funktionsübersicht',
};

/** Field limits, mirrored by the client's validation. */
export const VIDEO_REQUEST_MIN_NAME_LENGTH = 2;
export const VIDEO_REQUEST_MAX_NAME_LENGTH = 100;
export const VIDEO_REQUEST_MAX_TEAM_LENGTH = 150;
export const VIDEO_REQUEST_MAX_MESSAGE_LENGTH = 2000;
