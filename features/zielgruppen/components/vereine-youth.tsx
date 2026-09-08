'use client';

import { useTranslations } from 'next-intl';
import {
  BoardScreenshot,
  Grain,
  PlayerMagnet,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { inlineLink } from '@/components/custom-ui/rich-text';
import type { ClubYouthPoint } from '../data/vereine-content';

/**
 * The youth-department argument — the one that decides whether a club sees
 * itself on this page at all. A club with two senior teams has a coach problem;
 * a club with ten youth squads has an *organisation* problem, and that is what
 * the club level solves.
 *
 * Three points, no more: the shared scheme, the transition between age groups,
 * and what the numbers are actually good for. Everything else about the club
 * area is one band up.
 * @returns A JSX element rendering the youth-department band on the paper ground.
 */
export default function VereineYouth() {
  const t = useTranslations('clubsPage.youth');
  const points = t.raw('points') as ClubYouthPoint[];

  return (
    <section
      id='jugendabteilung'
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-6xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
        />

        <div className='mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start'>
          <ul className='flex flex-col gap-8'>
            {points.map((point) => (
              <li key={point.number} className='flex items-start gap-4'>
                <PlayerMagnet
                  number={point.number}
                  size='md'
                  className='mt-0.5 shrink-0'
                />
                <div>
                  <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
                    {point.title}
                  </h3>
                  <p className='mt-1.5 max-w-[58ch] text-[15px] leading-7 text-ink/75'>
                    {point.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <BoardScreenshot
            src='/spielerprofil-verlauf.png'
            alt={t('progressAlt')}
            width={2560}
            height={2000}
            label={t('progressLabel')}
            pin='tape'
            sizes='(max-width: 1024px) 100vw, 45vw'
          />
        </div>

        <BoardScreenshot
          src='/verein-laufbahnen.png'
          alt={t('careersAlt')}
          width={2048}
          height={650}
          label={t('careersLabel')}
          pin='magnet'
          className='mt-12'
          sizes='(max-width: 1024px) 100vw, 70vw'
        />

        <p className='mt-10 max-w-[58ch] text-base leading-7 text-ink/70'>
          {t.rich('closing', { youth: inlineLink('/fuer-jugendtrainer') })}
        </p>
      </div>
    </section>
  );
}
