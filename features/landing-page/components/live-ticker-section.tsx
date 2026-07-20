'use client';

import { useEffect, useRef } from 'react';
import {
  Activity,
  Link2,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface Point {
  title: string;
  description: string;
}

interface TickerEvent {
  minute: string;
  text: string;
}

const POINT_ICONS = [Link2, QrCode, Activity, ShieldCheck];

/** Accent per mock feed row, matched by index to `liveTicker.mock.events`. */
const EVENT_DOTS = [
  'bg-orange-400',
  'bg-emerald-400',
  'bg-yellow-400',
  'bg-orange-400',
];

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
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            once: true,
          },
        }
      );

      // Feed rows tick in one after another, like live events arriving.
      gsap.fromTo(
        '[data-ticker-event]',
        { opacity: 0, x: 16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.45,
          stagger: 0.16,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: mockRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id='liveticker'
      ref={sectionRef}
      className='relative w-full scroll-mt-24 overflow-hidden bg-gradient-to-b from-[#0a1020] via-[#111b34] to-[#0a1020] py-24 text-white md:py-32'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_85%_0%,rgba(249,115,22,0.16),transparent),radial-gradient(ellipse_45%_45%_at_0%_100%,rgba(37,99,235,0.16),transparent)]' />

      <div className='relative mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div className='mx-auto max-w-3xl text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>
            {t('title')}
          </h2>
          <p className='mt-5 text-base leading-7 text-slate-300'>
            {t('description')}
          </p>
        </div>

        <div className='mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-16'>
          <div ref={copyRef} className='space-y-7'>
            {points.map((point, index) => {
              const Icon = POINT_ICONS[index % POINT_ICONS.length];

              return (
                <div key={point.title} className='flex items-start gap-4'>
                  <span className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-[#fdba74]'>
                    <Icon className='size-5' />
                  </span>
                  <div>
                    <p className='text-lg font-bold tracking-tight text-white'>
                      {point.title}
                    </p>
                    <p className='mt-1.5 text-sm leading-7 text-slate-300'>
                      {point.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Illustrative live-ticker mock (sample data, no real screenshot needed) */}
          <div ref={mockRef} className='relative mx-auto w-full max-w-[420px]'>
            <div className='absolute -inset-6 rounded-[40px] bg-[radial-gradient(circle_at_25%_15%,rgba(249,115,22,0.3),transparent_60%),radial-gradient(circle_at_80%_95%,rgba(37,99,235,0.28),transparent_55%)] blur-2xl' />

            <div className='relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#0d1526]/95 shadow-[0_40px_90px_-45px_rgba(0,0,0,0.9)]'>
              {/* Header: live badge + game clock */}
              <div className='flex items-center justify-between border-b border-white/10 bg-white/5 px-5 py-3.5'>
                <span className='inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-300'>
                  <span className='size-1.5 animate-pulse rounded-full bg-rose-400' />
                  {t('mock.liveBadge')}
                </span>
                <span className='font-mono text-sm font-semibold tabular-nums text-slate-200'>
                  {t('mock.minute')}
                </span>
              </div>

              {/* Scoreboard */}
              <div className='grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-6'>
                <div className='flex flex-col items-center gap-2'>
                  <span className='flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-orange-400/80 to-orange-600/80 text-xs font-extrabold text-white'>
                    {t('mock.homeTeam').slice(0, 3).toUpperCase()}
                  </span>
                  <span className='text-center text-xs font-semibold leading-4 text-slate-200'>
                    {t('mock.homeTeam')}
                  </span>
                </div>
                <div className='flex items-baseline gap-2 text-4xl font-extrabold tabular-nums tracking-tight text-white'>
                  <span>{t('mock.homeScore')}</span>
                  <span className='text-2xl text-slate-500'>:</span>
                  <span>{t('mock.awayScore')}</span>
                </div>
                <div className='flex flex-col items-center gap-2'>
                  <span className='flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/80 to-blue-700/80 text-xs font-extrabold text-white'>
                    {t('mock.awayTeam').slice(0, 2).toUpperCase()}
                  </span>
                  <span className='text-center text-xs font-semibold leading-4 text-slate-200'>
                    {t('mock.awayTeam')}
                  </span>
                </div>
              </div>

              {/* Event feed */}
              <div className='border-t border-white/10 px-5 py-4'>
                <p className='text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500'>
                  {t('mock.feedTitle')}
                </p>
                <ul className='mt-3 space-y-2.5'>
                  {events.map((event, index) => (
                    <li
                      key={event.minute + event.text}
                      data-ticker-event
                      className='flex items-center gap-3'>
                      <span className='w-8 shrink-0 rounded-md bg-white/8 px-1.5 py-0.5 text-center font-mono text-[11px] font-semibold tabular-nums text-slate-300'>
                        {event.minute}
                      </span>
                      <span
                        className={cn(
                          'size-1.5 shrink-0 rounded-full',
                          EVENT_DOTS[index % EVENT_DOTS.length]
                        )}
                      />
                      <span className='truncate text-[13px] leading-6 text-slate-200'>
                        {event.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* QR hint */}
              <div className='flex items-center gap-3 border-t border-white/10 bg-white/5 px-5 py-4'>
                <span className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#0d1526]'>
                  <QrCode className='size-8' />
                </span>
                <span className='text-sm font-semibold leading-6 text-slate-200'>
                  {t('mock.qrLabel')}
                </span>
              </div>
            </div>

            <p className='mt-4 text-center text-xs text-slate-500'>
              {t('mock.footnote')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
