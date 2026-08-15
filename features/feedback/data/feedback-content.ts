/**
 * Shared vocabulary of the feedback form.
 *
 * The ids live here because both ends need them: the client renders them as
 * radio chips (labels from `feedbackPage.categories.*`, so the UI stays
 * bilingual) and `POST /api/feedback` validates the submitted value against
 * them before it ever reaches the summary mail.
 */
export const FEEDBACK_CATEGORY_IDS = [
  'app',
  'recording',
  'analysis',
  'usability',
  'bug',
  'feature',
  'other',
] as const;

export type FeedbackCategoryId = (typeof FEEDBACK_CATEGORY_IDS)[number];

/**
 * German labels for the summary e-mail. Deliberately not read from
 * `messages/*.json`: the mail is written to the team, and the team reads
 * German — every other transactional template is German-only for the same
 * reason. The visitor-facing labels stay in the message catalogue.
 */
export const FEEDBACK_CATEGORY_EMAIL_LABELS: Record<
  FeedbackCategoryId,
  string
> = {
  app: 'Statix allgemein',
  recording: 'Live-Erfassung im Spiel',
  analysis: 'Auswertungen & Statistiken',
  usability: 'Bedienung & Design',
  bug: 'Fehler / Bug',
  feature: 'Feature-Wunsch',
  other: 'Sonstiges',
};

/** The five rating steps, low to high. */
export const FEEDBACK_RATING_VALUES = [1, 2, 3, 4, 5] as const;

export const FEEDBACK_MIN_RATING = 1;
export const FEEDBACK_MAX_RATING = 5;

/** Minimum length of the free-text field, mirrored by the client's validation. */
export const FEEDBACK_MIN_MESSAGE_LENGTH = 10;
export const FEEDBACK_MAX_MESSAGE_LENGTH = 5000;

/** German rating captions for the summary e-mail. */
export const FEEDBACK_RATING_EMAIL_LABELS: Record<number, string> = {
  1: 'Sehr unzufrieden',
  2: 'Unzufrieden',
  3: 'Neutral',
  4: 'Zufrieden',
  5: 'Begeistert',
};
