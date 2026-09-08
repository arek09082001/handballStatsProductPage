'use client';

import { useTranslations } from 'next-intl';
import { SITE_URL } from '@/lib/seo';
import { TAKTIKBOARD_PAGE_PATH } from '../data/taktikboard-content';
import TaktikboardTool from '../components/taktikboard-tool';

/**
 * Standalone board for `/handball-taktikboard/embed` — no navbar, no footer, no
 * page chrome, so it sits cleanly inside a club site's iframe (the layout
 * wrapper skips its chrome for this route).
 *
 * The attribution line is the deal: clubs get the full board, this page carries
 * one followed link back to the canonical page. Do not add `nofollow` — that
 * link is the point of the embed.
 * @returns A JSX element rendering the embeddable tactic board.
 */
export default function HandballTaktikboardEmbedPage() {
  const t = useTranslations('boardPage.tool');

  return (
    <div className='min-h-screen bg-paper-2 px-3 py-4'>
      <div className='mx-auto flex w-full max-w-[740px] flex-col gap-3'>
        <h1 className='font-display text-lg font-bold tracking-tight text-ink'>
          {t('embedTitle')}
        </h1>

        <TaktikboardTool variant='embed' />

        <p className='text-center text-[13px] leading-6 text-ink/60'>
          <a
            href={`${SITE_URL}${TAKTIKBOARD_PAGE_PATH}`}
            target='_blank'
            rel='noopener'
            className='font-semibold text-primary underline underline-offset-4'>
            {t('embedAttributionLink')}
          </a>{' '}
          {t('embedAttributionSuffix')}
        </p>
      </div>
    </div>
  );
}
