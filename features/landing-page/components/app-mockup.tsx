'use client';

import { useTranslations } from 'next-intl';
import BoardScreenshot from './tactic/board-screenshot';

/**
 * The hero's in‑app preview — the live match‑recording view, pinned to the
 * board the way a coach reviews it on the sideline. Kept at native aspect ratio.
 */
export default function AppMockup() {
  const t = useTranslations('productPage.hero');

  return (
    <BoardScreenshot
      src='/heroImage.png'
      alt={t('mockupAlt')}
      width={2560}
      height={1600}
      label={t('mockupLabel')}
      tone='court'
      pin='tape'
      live
      priority
      sizes='(max-width: 1024px) 100vw, 640px'
      className='mx-auto w-full'
    />
  );
}
