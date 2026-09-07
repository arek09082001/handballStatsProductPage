'use client';

import { useTranslations } from 'next-intl';
import { BoardCard, Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import { inlineLink } from '@/components/custom-ui/rich-text';
import type { FreeAlternative } from '../data/free-content';

/**
 * The three genuinely free options a coach weighs — including the two that
 * aren't ours, with their real strengths named. Hands off to the Excel template
 * page so the visitor gets something either way.
 * @returns A JSX element rendering the free-alternatives comparison on paper.
 */
export default function FreeAlternatives() {
  const t = useTranslations('freePage.alternatives');
  const options = t.raw('items') as FreeAlternative[];

  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-6xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
        />

        <div className='mt-12 grid gap-6 md:grid-cols-3'>
          {options.map((option, index) => (
            <BoardCard
              key={option.name}
              pin='magnet'
              pinColor={index === 2 ? 'marker' : 'opponent'}
              className='flex flex-col p-6'>
              <h3 className='font-display text-xl font-bold tracking-tight text-ink'>
                {option.name}
              </h3>
              <p className='mt-1 font-hand text-xl text-primary'>{option.cost}</p>
              <p className='mt-4 text-[15px] leading-7 text-ink/75'>
                <span className='font-semibold text-ink'>{t('goodLabel')}</span>
                {option.good}
              </p>
              <p className='mt-3 text-[15px] leading-7 text-ink/75'>
                <span className='font-semibold text-ink'>{t('badLabel')}</span>
                {option.bad}
              </p>
            </BoardCard>
          ))}
        </div>

        <p className='mt-10 max-w-[70ch] text-base leading-7 text-ink/70'>
          {t.rich('closing', {
            template: inlineLink('/handball-statistik-excel-vorlage'),
            calculator: inlineLink('/wurfquote-rechner'),
            guide: inlineLink('/ratgeber/handball-statistik-fuehren'),
          })}
        </p>
      </div>
    </section>
  );
}
