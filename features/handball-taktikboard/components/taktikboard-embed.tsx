'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import {
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { BOARD_CAPACITY, EXPORT_WATERMARK } from '../data/taktikboard-content';
import EmbedSnippet from './embed-snippet';

/** The lead-in of each paragraph, set in the display face. */
function lead(chunks: ReactNode) {
  return <strong className='font-semibold text-ink'>{chunks}</strong>;
}

/**
 * "Was das Board kostet" — the exchange, stated plainly before the snippet:
 * the small mark on an exported PNG and the attribution line under an embed
 * are the whole price. Nothing here is a teaser for a paid version, because
 * there is none.
 * @returns A JSX element rendering the embed instructions on the paper ground.
 */
export default function TaktikboardEmbed() {
  const t = useTranslations('boardPage.embed');

  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
        />

        <div className='mt-10 space-y-4'>
          <p className='max-w-[70ch] text-base leading-7 text-ink/75'>
            {t.rich('watermarkStrong', { watermark: EXPORT_WATERMARK, lead })}{' '}
            {t('watermarkText')}
          </p>
          <p className='max-w-[70ch] text-base leading-7 text-ink/75'>
            {t.rich('noAccountStrong', { lead })}{' '}
            {t('noAccountText', {
              magnets: BOARD_CAPACITY.magnets,
              arrows: BOARD_CAPACITY.arrows,
              labels: BOARD_CAPACITY.labels,
            })}
          </p>
        </div>

        <h3 className='mt-14 font-display text-xl font-bold tracking-tight text-ink'>
          {t('embedTitle')}
        </h3>
        <p className='mt-2 max-w-[70ch] text-base leading-7 text-ink/75'>
          {t('embedText')}
        </p>

        <div className='mt-8'>
          <EmbedSnippet />
        </div>

        <p className='mt-6 max-w-[70ch] text-base leading-7 text-ink/70'>
          {t('wideHint')}
        </p>
      </div>
    </section>
  );
}
