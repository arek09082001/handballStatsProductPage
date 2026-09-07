/**
 * The vocabulary the form routes answer with when something goes wrong.
 *
 * The routes used to answer with a German sentence and the forms showed it
 * verbatim, which meant a reader who had switched the site to Polish got the
 * form in Polish and the failure in German. The sentence stays in the response
 * for the logs and for anyone reading the endpoint with curl; `code` is what
 * the browser renders, through `common.apiErrors` in the message bundles.
 */
export const API_ERROR_CODES = [
  'spam',
  'rateLimited',
  'unavailable',
  'invalidInput',
  'invalidEmail',
  'invalidLink',
  'sendFailed',
  'unknown',
] as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

export function isApiErrorCode(value: unknown): value is ApiErrorCode {
  return (
    typeof value === 'string' &&
    (API_ERROR_CODES as readonly string[]).includes(value)
  );
}

/** What a form mutation rejects with, so the code survives to the component. */
export class ApiError extends Error {
  readonly code: ApiErrorCode;
  /** Minutes until the next attempt is allowed. Only on `rateLimited`. */
  readonly retryMinutes?: number;

  constructor(message: string, code: ApiErrorCode, retryMinutes?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.retryMinutes = retryMinutes;
  }
}

/** Reads an error response body into an `ApiError`, whatever shape it is in. */
export function apiErrorFrom(body: unknown, fallbackMessage: string): ApiError {
  const payload = (body ?? {}) as {
    error?: unknown;
    code?: unknown;
    retryMinutes?: unknown;
  };

  return new ApiError(
    typeof payload.error === 'string' ? payload.error : fallbackMessage,
    isApiErrorCode(payload.code) ? payload.code : 'unknown',
    typeof payload.retryMinutes === 'number' ? payload.retryMinutes : undefined,
  );
}
