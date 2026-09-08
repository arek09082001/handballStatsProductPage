'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ApiError } from '@/lib/api-errors';

/**
 * Turns whatever a form mutation rejected with into a sentence in the reader's
 * language.
 *
 * Anything that is not an `ApiError` — a dropped connection, a parse failure —
 * lands on `unknown` rather than showing the exception's own text, which is
 * English at best and a stack-shaped string at worst.
 */
export function useApiErrorMessage(): (error: unknown) => string {
  const t = useTranslations('common.apiErrors');

  return useCallback(
    (error: unknown) => {
      if (!(error instanceof ApiError)) return t('unknown');

      if (error.code === 'rateLimited') {
        return t('rateLimited', { minutes: error.retryMinutes ?? 1 });
      }

      return t(error.code);
    },
    [t],
  );
}
