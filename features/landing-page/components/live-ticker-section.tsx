'use client';

import { useEffect, useRef } from 'react';
import { QrCode } from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { BoardCard, Grain, PlayerMagnet, SectionHeading } from './tactic';

interface Point {
  title: string;
  description: string;
}

interface TickerEvent {
  minute: string;
  text: string;
}

/** Accent per mock feed row: goal (marker), save (whistle), penalty (pending). */
const EVENT_DOTS = ['bg-primary', 'bg-success', 'bg-pending', 'bg-primary'];

export default function LiveTickerSection() {
  const t = useTranslations('productPage.liveTicker');
  const points = t.raw('points') as Point[];
  const events = t.raw('mock.events') as TickerEvent[];

  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const mockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [copyRef.current, mockRef.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        },
      );
      gsap.fromTo(
        '[data-ticker-event]',
        { opacity: 0, x: 16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.45,
          stagger: 0.16,
          ease: 'power2.out',
          scrollTrigger: { trigger: mockRef.current, start: 'top 75%', once: true },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id='liveticker'
      ref={sectionRef}
      className='relative w-full scroll-mt-24 overflow-hidden bg-court py-24 text-chalk md:py-32'>
      <Grain tone='court' />
      <div className='relative mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div className='grid items-center gap-14 lg:grid-cols-2 lg:gap-16'>
          <div ref={copyRef}>
            <SectionHeading
              tone='court'
              align='left'
              kicker={t('kicker')}
              title={t('title')}
              description={t('description')}
            />
            <div className='mt-10'>
              {points.map((point, index) => (
                <div
                  key={point.title}
                  className='flex items-start gap-4 border-t border-chalk/12 py-5'>
                  <PlayerMagnet number={index + 1} team='home' size='md' className='shrink-0' />
                  <div>
                    <p className='font-display text-lg font-bold tracking-tight text-chalk'>
                      {point.title}
                    </p>
                    <p className='mt-1 text-sm leading-7 text-chalk/70'>{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Illustrative live‑ticker mock (sample data) */}
          <div ref={mockRef} className='mx-auto w-full max-w-[420px]'>
            <BoardCard tone='court' pin='magnet' pinColor='marker' className='overflow-hidden'>
              {/* Live badge + game clock */}
              <div className='flex items-center justify-between border-b border-chalk/10 px-5 py-3.5'>
                <span className='inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary'>
                  <span className='size-1.5 animate-pulse rounded-full bg-primary' />
                  {t('mock.liveBadge')}
                </span>
                <span className='font-mono text-sm font-semibold tabular-nums text-chalk/80'>
                  {t('mock.minute')}
                </span>
              </div>

              {/* Scoreboard */}
              <div className='grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-6'>
                <div className='flex flex-col items-center gap-2'>
                  <span
                    className='flex size-11 items-center justify-center rounded-xl font-display text-xs font-extrabold text-white'
                    style={{
                      background:
                        'radial-gradient(120% 120% at 32% 26%, hsl(22 96% 60%), hsl(22 92% 46%))',
                    }}>
                    {t('mock.homeTeam').slice(0, 3).toUpperCase()}
                  </span>
                  <span className='text-center text-xs font-semibold leading-4 text-chalk/85'>
                    {t('mock.homeTeam')}
                  </span>
                </div>
                <div className='flex items-baseline gap-2 font-display text-4xl font-extrabold tabular-nums tracking-tight text-chalk'>
                  <span>{t('mock.homeScore')}</span>
                  <span className='text-2xl text-chalk/40'>:</span>
                  <span>{t('mock.awayScore')}</span>
                </div>
                <div className='flex flex-col items-center gap-2'>
                  <span
                    className='flex size-11 items-center justify-center rounded-xl font-display text-xs font-extrabold text-white'
                    style={{
                      background:
                        'radial-gradient(120% 120% at 32% 26%, hsl(221 90% 62%), hsl(221 83% 48%))',
                    }}>
                    {t('mock.awayTeam').slice(0, 2).toUpperCase()}
                  </span>
                  <span className='text-center text-xs font-semibold leading-4 text-chalk/85'>
                    {t('mock.awayTeam')}
                  </span>
                </div>
              </div>

              {/* Event feed */}
              <div className='border-t border-chalk/10 px-5 py-4'>
                <p className='font-hand text-lg text-chalk/60'>{t('mock.feedTitle')}</p>
                <ul className='mt-2 space-y-2.5'>
                  {events.map((event, index) => (
                    <li
                      key={event.minute + event.text}
                      data-ticker-event
                      className='flex items-center gap-3'>
                      <span className='w-9 shrink-0 rounded-md bg-chalk/8 px-1.5 py-0.5 text-center font-mono text-[11px] font-semibold tabular-nums text-chalk/75'>
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
                <span className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-chalk text-court'>
                  <QrCode className='size-8' />
                </span>
                <span className='text-sm font-semibold leading-6 text-chalk/85'>
                  {t('mock.qrLabel')}
                </span>
              </div>
            </BoardCard>

            <p className='mt-4 text-center font-hand text-base text-chalk/55'>
              {t('mock.footnote')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
