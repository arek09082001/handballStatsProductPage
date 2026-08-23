import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  BoardCard,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { STAT_WAYS } from '../data/stats-content';

/**
 * "Womit erfasse ich das?" — the three real options side by side, each with the
 * part that does not work. A comparison that only lists advantages is a sales
 * sheet, and a coach who has tried a spreadsheet spots it immediately.
 * @returns A JSX element rendering the three recording methods on paper.
 */
export default function StatsWays() {
  return (
    <section
      id='erfassen'
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-6xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Drei Wege'
          title='Womit Trainer Handball-Statistiken führen'
          description='Zettel, Tabelle oder App – alle drei funktionieren. Sie unterscheiden sich darin, was am Montag noch übrig ist.'
        />

        <div className='mt-12 grid gap-6 md:grid-cols-3'>
          {STAT_WAYS.map((way, index) => (
            <BoardCard
              key={way.name}
              pin='magnet'
              pinColor={index === 2 ? 'marker' : 'ink'}
              className='flex h-full flex-col p-6'>
              <p className='font-hand text-lg text-primary'>{way.effort}</p>
              <h3 className='mt-1 font-display text-xl font-bold tracking-tight text-ink'>
                {way.name}
              </h3>
              <p className='mt-3 text-[15px] leading-7 text-ink/75'>
                {way.good}
              </p>
              <p className='mt-3 flex-1 text-[15px] leading-7 text-ink/60'>
                {way.bad}
              </p>
              {way.href && way.linkLabel ? (
                <Link
                  href={way.href}
                  className='group mt-5 inline-flex items-center gap-1.5 font-display text-[14px] font-bold text-primary transition-colors hover:text-[#ea580c]'>
                  {way.linkLabel}
                  <ArrowRight className='size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Link>
              ) : null}
            </BoardCard>
          ))}
        </div>
      </div>
    </section>
  );
}
