'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { startPostHog, stopPostHog } from '@/lib/posthog';
import {
  OPEN_CONSENT_EVENT,
  readConsent,
  subscribeConsent,
  writeConsent,
  type AnalyticsConsent,
} from '../lib/consent';

/**
 * Asks once whether PostHog may measure the visit and record it as a session
 * replay. Until the answer is yes, PostHog is not even downloaded.
 *
 * Both buttons share one style on purpose: German regulators read a reject
 * button that is smaller or paler than accept as steering, which voids the
 * consent.
 */
export default function ConsentBanner() {
  const t = useTranslations('consentBanner');
  // `undefined` on the server and during hydration: render nothing until the
  // stored answer is known, so the banner never flashes for someone who chose.
  const consent = useSyncExternalStore<AnalyticsConsent | null | undefined>(
    subscribeConsent,
    readConsent,
    () => undefined,
  );
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    if (consent === 'granted') void startPostHog();
  }, [consent]);

  useEffect(() => {
    const reopen = () => setReopened(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  function choose(value: AnalyticsConsent) {
    writeConsent(value);
    if (value === 'denied') stopPostHog();
    setReopened(false);
  }

  if (consent !== null && !reopened) return null;

  const buttonClass =
    'inline-flex min-h-10 flex-1 items-center justify-center rounded-md bg-ink px-4 text-sm font-semibold text-paper transition-colors hover:bg-ink/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:flex-none';

  return (
    <div
      role='dialog'
      aria-modal='false'
      aria-labelledby='consent-banner-title'
      className='fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-xl rounded-lg border border-ink/10 bg-paper p-4 text-ink shadow-[0_18px_44px_-20px_hsl(var(--ink)/0.45)] sm:p-5'>
      <h2
        id='consent-banner-title'
        className='font-display text-base font-bold tracking-tight'>
        {t('title')}
      </h2>
      <p className='mt-1.5 text-sm leading-relaxed text-ink/75'>
        {t('description')}
      </p>
      {/* Provider and replay details sit one click away: the purpose has to be
       * on the first layer for the consent to count, the rest may fold. */}
      <details className='group mt-2 text-sm text-ink/75'>
        <summary className='cursor-pointer select-none font-semibold text-ink underline underline-offset-4 marker:content-none'>
          {t('detailsToggle')}
        </summary>
        <p className='mt-2 leading-relaxed'>
          {t('details')}{' '}
          <Link
            href='/datenschutz#posthog'
            className='font-semibold text-ink underline underline-offset-4'>
            {t('privacyLink')}
          </Link>
        </p>
      </details>
      <div className='mt-3 flex flex-wrap gap-3'>
        <button type='button' className={buttonClass} onClick={() => choose('denied')}>
          {t('reject')}
        </button>
        <button type='button' className={buttonClass} onClick={() => choose('granted')}>
          {t('accept')}
        </button>
      </div>
    </div>
  );
}
