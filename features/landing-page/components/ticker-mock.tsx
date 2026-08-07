'use client';

import { QrCode } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { BoardCard } from './tactic';

interface TickerEvent {
  minute: string;
  text: string;
}

/** Accent per mock feed row: goal (marker), save (whistle), penalty (pending). */
const EVENT_DOTS = ['bg-primary', 'bg-success', 'bg-pending', 'bg-primary'];

/**
 * Illustrative live‑ticker card (sample data) — the one visual of the "und dann
 * noch" band. It is a court panel pinned onto the paper ground, so the thing a
 * parent sees on their phone reads as a board note on the coach's clipboard.
 */
export default function TickerMock() {
  const t = useTranslations('productPage.more.mock');
  const events = t.raw('events') as TickerEvent[];

  return (
    <div className='mx-auto w-full max-w-[380px]'>
      <BoardCard tone='court' pin='magnet' pinColor='marker' className='overflow-hidden'>
        {/* Live badge + game clock */}
        <div className='flex items-center justify-between border-b border-chalk/10 px-5 py-3.5'>
          <span className='inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[13px] font-bold uppercase tracking-wider text-primary'>
            <span className='size-1.5 animate-pulse rounded-full bg-primary' />
            {t('liveBadge')}
          </span>
          <span className='font-mono text-sm font-semibold tabular-nums text-chalk/80'>
            {t('minute')}
          </span>
        </div>

        {/* Scoreboard */}
        <div className='grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-6'>
          <div className='flex flex-col items-center gap-2'>
            <span
              className='flex size-11 items-center justify-center rounded-xl font-display text-[13px] font-extrabold text-white'
              style={{
                background:
                  'radial-gradient(120% 120% at 32% 26%, hsl(22 96% 60%), hsl(22 92% 46%))',
              }}>
              {t('homeTeam').slice(0, 3).toUpperCase()}
            </span>
            <span className='text-center text-[13px] font-semibold leading-5 text-chalk/85'>
              {t('homeTeam')}
            </span>
          </div>
          <div className='flex items-baseline gap-2 font-display text-4xl font-extrabold tabular-nums tracking-tight text-chalk'>
            <span>{t('homeScore')}</span>
            <span className='text-2xl text-chalk/40'>:</span>
            <span>{t('awayScore')}</span>
          </div>
          <div className='flex flex-col items-center gap-2'>
            <span
              className='flex size-11 items-center justify-center rounded-xl font-display text-[13px] font-extrabold text-white'
              style={{
                background:
                  'radial-gradient(120% 120% at 32% 26%, hsl(221 90% 62%), hsl(221 83% 48%))',
              }}>
              {t('awayTeam').slice(0, 2).toUpperCase()}
            </span>
            <span className='text-center text-[13px] font-semibold leading-5 text-chalk/85'>
              {t('awayTeam')}
            </span>
          </div>
        </div>

        {/* Event feed */}
        <div className='border-t border-chalk/10 px-5 py-4'>
          <p className='font-hand text-lg text-chalk/60'>{t('feedTitle')}</p>
          <ul className='mt-2 space-y-2.5'>
            {events.map((event, index) => (
              <li
                key={event.minute + event.text}
                data-ticker-event
                className='flex items-center gap-3'>
                <span className='w-10 shrink-0 rounded-md bg-chalk/8 px-1.5 py-0.5 text-center font-mono text-[13px] font-semibold tabular-nums text-chalk/75'>
                  {event.minute}
                </span>
                <span
                  className={cn(
                    'size-1.5 shrink-0 rounded-full',
                    EVENT_DOTS[index % EVENT_DOTS.length],
                  )}
                />
                <span className='truncate text-[13px] leading-6 text-chalk/85'>
                  {event.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* QR hint */}
        <div className='flex items-center gap-3 border-t border-chalk/10 bg-chalk/[0.03] px-5 py-4'>
          <span className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-chalk text-court'>
            <QrCode className='size-7' />
          </span>
          <span className='text-sm font-semibold leading-6 text-chalk/85'>{t('qrLabel')}</span>
        </div>
      </BoardCard>

      <p className='mt-4 text-center font-hand text-base text-ink/55'>{t('footnote')}</p>
    </div>
  );
}
