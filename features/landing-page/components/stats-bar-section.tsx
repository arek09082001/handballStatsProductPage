'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { compactFigure, LIVE_STAT_KEYS, type LiveStats } from '../data/live-stats';
const SmokeCursor = dynamic(() => import('./smoke-cursor'), { ssr: false });

interface StatItem {
  value: string;
  label: string;
}

/** One scoreboard figure: what the counter animates and what it ends on. */
interface Figure {
  label: string;
  prefix: string;
  number: number | null;
  decimals: number;
  /** Text right after the number ("+", "%" …). */
  suffix: string;
  /** Smaller unit after the number ("Tsd.", "k") for compacted live figures. */
  unit: string;
}

/** Split a value like "20+" / "100%" / "0 €" into a countable number and its
 *  surrounding text so we can animate just the numeric part. */
function parseValue(item: StatItem): Figure {
  const match = item.value.match(/^(\D*?)(\d+)(.*)$/);
  if (!match) return { label: item.label, prefix: item.value, number: null, decimals: 0, suffix: '', unit: '' };
  return { label: item.label, prefix: match[1], number: Number(match[2]), decimals: 0, suffix: match[3], unit: '' };
}

// Hairlines between the four scoreboard figures: columns on desktop, a 2×2 grid
// on mobile.
const DIVIDERS = [
  'border-r border-b sm:border-b-0',
  'border-b sm:border-b-0 sm:border-r',
  'border-r',
  '',
];

/**
 * The scoreboard band on the smoke. With `stats` (read from the app, at most
 * every 15 minutes — see `fetchLiveStats`) it shows real usage, compacted
 * ("29 Tsd."); without, the static product claims from the messages.
 */
export default function StatsBarSection({ stats }: { stats?: LiveStats | null }) {
  const t = useTranslations('productPage.stats');
  const locale = useLocale();

  const items = useMemo<Figure[]>(() => {
    if (!stats) return (t.raw('items') as StatItem[]).map(parseValue);
    const units = { thousand: t('live.thousand'), million: t('live.million') };
    return LIVE_STAT_KEYS.map((key) => ({
      label: t(`live.labels.${key}`),
      prefix: '',
      suffix: '',
      ...compactFigure(stats[key], units),
    }));
  }, [stats, t]);

  const format = useCallback(
    (f: Figure, n: number) =>
      `${f.prefix}${n.toLocaleString(locale, { minimumFractionDigits: f.decimals, maximumFractionDigits: f.decimals })}${f.suffix}`,
    [locale],
  );

  const sectionRef = useRef<HTMLElement>(null);
  const [showDust, setShowDust] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const preference = window.matchMedia('(prefers-reduced-motion: no-preference) and (pointer: fine)');
    let visible = false;
    const update = () => setShowDust(visible && preference.matches);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
      update();
    }, { threshold: 0.25 });
    observer.observe(section);
    preference.addEventListener('change', update);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', update);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className='relative isolate w-full overflow-hidden bg-court py-8 text-chalk sm:py-12'>
      {/* Kept effect, re-themed: chalk/marker dust reacting to the pointer */}
      {showDust && <SmokeCursor />}

      {/* Depth vignette + scoreboard hairlines to seat the band */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 bg-[radial-gradient(120%_130%_at_50%_50%,transparent_52%,hsl(199_50%_7%/0.9)_100%)]'
      />
      <div className='pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-chalk/18 to-transparent' />
      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-chalk/12 to-transparent' />

      <div className='relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-10'>
        <h2 className='sr-only'>{t('srTitle')}</h2>
        <div className='grid grid-cols-2 sm:grid-cols-4'>
          {items.map((item, i) => {
            return (
              <div
                key={item.label}
                data-stat-tile
                className={cn(
                  'flex flex-col items-center border-chalk/12 px-4 py-5 text-center sm:px-6 sm:py-4',
                  DIVIDERS[i] ?? '',
                )}>
                <span className='flex items-baseline gap-1.5 font-display leading-none text-chalk'>
                  <span
                    className='block text-[2.75rem] font-extrabold tracking-[-0.03em] tabular-nums sm:text-6xl'>
                    {item.number === null ? item.prefix : format(item, item.number)}
                  </span>
                  {item.unit && (
                    <span className='text-xl font-bold tracking-tight text-primary sm:text-2xl'>{item.unit}</span>
                  )}
                </span>
                <span className='mt-3.5 flex max-w-[18ch] items-center gap-2 text-sm font-medium leading-6 text-chalk/75 sm:mt-4'>
                  <span aria-hidden className='size-1.5 shrink-0 rounded-[3px] bg-primary' />
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
