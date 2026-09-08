'use client';

import { useTranslations } from 'next-intl';
import {
  Grain,
  PlayerMagnet,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { useBoardOptions } from '../data/use-board-options';
import type { BoardStep } from '../data/taktikboard-content';

/**
 * "So erstellst du eure Aufstellung" — the four steps plus the legend, written
 * so the page answers the query for a visitor who never touches the board (and
 * so it still reads with JavaScript switched off).
 * @returns A JSX element rendering the how-to band on the paper ground.
 */
export default function TaktikboardHowto() {
  const t = useTranslations('boardPage.howTo');
  const { magnetKinds, arrowKinds } = useBoardOptions();
  const steps = t.raw('steps') as BoardStep[];
  const magnetLegend = t.raw('legendMagnets') as Record<string, string>;

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

        <ol className='mt-10 space-y-7'>
          {steps.map((step, index) => (
            <li key={step.title} className='flex gap-4 sm:gap-5'>
              <PlayerMagnet
                number={index + 1}
                team={index % 2 === 0 ? 'home' : 'away'}
                size='md'
                className='mt-0.5 shrink-0'
              />
              <div>
                <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
                  {step.title}
                </h3>
                <p className='mt-1.5 max-w-[64ch] text-[15px] leading-7 text-ink/75'>
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <h3 className='mt-14 font-display text-xl font-bold tracking-tight text-ink'>
          {t('legendTitle')}
        </h3>
        <p className='mt-2 max-w-[64ch] text-[15px] leading-7 text-ink/75'>
          {t('legendIntro')}
        </p>

        <dl className='mt-6 grid gap-x-10 gap-y-3 sm:grid-cols-2'>
          {magnetKinds.map((option) => (
            <div
              key={option.kind}
              className='flex items-baseline gap-3 border-b border-ink/10 pb-3'>
              <dt className='min-w-20 font-display text-[15px] font-bold text-ink'>
                {option.label}
              </dt>
              <dd className='text-[15px] leading-7 text-ink/70'>
                {magnetLegend[option.kind]}
              </dd>
            </div>
          ))}
          {arrowKinds.map((option) => (
            <div
              key={option.kind}
              className='flex items-baseline gap-3 border-b border-ink/10 pb-3'>
              <dt className='min-w-20 font-display text-[15px] font-bold text-ink'>
                {option.label}
              </dt>
              <dd className='text-[15px] leading-7 text-ink/70'>
                {option.hint}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
