'use client';

import { useTranslations } from 'next-intl';
import { MAIN_CONTENT_ID } from '../config';

/**
 * The first focusable element on every page: it jumps keyboard and screen-
 * reader users past the fixed navbar straight into the page content. Invisible
 * until it takes focus, then it lands as a normal-sized button in the top-left
 * corner — deliberately not a 12-pixel hairline.
 * @returns A JSX element rendering the skip link.
 */
export default function SkipLink() {
  const t = useTranslations('navigationSection');

  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:inline-flex focus:h-11 focus:items-center focus:rounded-full focus:bg-[#f97316] focus:px-5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-[0_8px_24px_-8px_rgba(15,23,42,0.6)] focus:outline-none focus:ring-2 focus:ring-slate-950/25 focus:ring-offset-2'>
      {t('skipToContent')}
    </a>
  );
}
