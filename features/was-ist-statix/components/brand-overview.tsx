'use client';

import { useTranslations } from 'next-intl';
import {
  BoardScreenshot,
  Grain,
  PlayerMagnet,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { BRAND_LINK_ARGS, type BrandFact } from '../data/brand-content';
import Reveal from './reveal';

/**
 * "Statix in 30 Sekunden" – a compact definition paired with a real in-app
 * shot pinned to the board, plus a machine-readable quick-facts list set as a
 * coach's scoresheet (label/value rows) so answer engines can extract the brand
 * facts directly.
 * @returns A JSX element rendering the brand definition, a product screenshot and a quick-facts scoresheet.
 */
export default function BrandOverview() {
  const t = useTranslations('brandPage.overview');
  const points = t.raw('points') as string[];
  const facts = t.raw('facts') as BrandFact[];

  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto w-full max-w-6xl px-6 sm:px-8'>
        <div className='grid items-center gap-10 lg:grid-cols-2 lg:gap-16'>
          <Reveal>
            <SectionHeading
              kicker={t('kicker')}
              title={t('title')}
              tone='paper'
              align='left'
            />

            <div className='mt-6 space-y-4 text-base leading-8 text-ink/75'>
              <p>{t('paragraph1')}</p>
              <p>{t('paragraph2')}</p>
            </div>

            <ul className='mt-7 space-y-3.5'>
              {points.map((point, index) => (
                <li key={point} className='flex items-center gap-3.5'>
                  <PlayerMagnet number={index + 1} team='home' size='sm' />
                  <span className='text-[15px] leading-6 text-ink'>
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <BoardScreenshot
              src='/gameListOverview.png'
              alt={t('screenshotAlt')}
              width={2560}
              height={2000}
              label={t('screenshotLabel')}
              tone='paper'
              pin='magnet'
            />
          </Reveal>
        </div>

        <Reveal className='mt-16'>
          <p className='font-hand text-2xl text-ink/60'>{t('factsKicker')}</p>
          <dl className='mt-4 grid gap-x-10 border-t border-ink/12 sm:grid-cols-2 lg:grid-cols-3'>
            {facts.map((fact, index) => (
              <div
                key={fact.label}
                className='border-b border-ink/12 py-4 sm:[&:nth-last-child(-n+1)]:border-b-0 lg:[&:nth-last-child(-n+1)]:border-b'>
                <dt className='font-display text-[13px] font-bold uppercase tracking-[0.14em] text-primary'>
                  {fact.label}
                </dt>
                <dd className='mt-1.5 text-[15px] leading-6 text-ink/80'>
                  {t(`facts.${index}.value`, BRAND_LINK_ARGS)}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
