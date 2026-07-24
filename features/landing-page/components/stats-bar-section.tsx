'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import SmokeCursor from './smoke-cursor';

interface StatItem {
  value: string;
  label: string;
}

/** Split a value like "20+" / "100%" / "0 €" into a countable number and its
 *  surrounding text so we can animate just the numeric part. */
function parseValue(value: string) {
  const match = value.match(/^(\D*?)(\d+)(.*)$/);
  if (!match) return { prefix: value, number: null, suffix: '' };
  return { prefix: match[1], number: Number(match[2]), suffix: match[3] };
}

// Hairlines between the four scoreboard figures: columns on desktop, a 2×2 grid
// on mobile.
const DIVIDERS = [
  'border-r border-b sm:border-b-0',
  'border-b sm:border-b-0 sm:border-r',
  'border-r',
  '',
];

export default function StatsBarSection() {
  const t = useTranslations('productPage.stats');
  const items = t.raw('items') as StatItem[];

  const sectionRef = useRef<HTMLElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tiles = gsap.utils.toArray<HTMLElement>('[data-stat-tile]');
      gsap.fromTo(
        tiles,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
        },
      );

      // Count each numeric value up from zero when the scoreboard scrolls in.
      items.forEach((item, i) => {
        const el = numberRefs.current[i];
        const { prefix, number, suffix } = parseValue(item.value);
        if (!el || number === null) return;

        const counter = { v: 0 };
        gsap.to(counter, {
          v: number,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(counter.v)}${suffix}`;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [items]);

  return (
    <section
      ref={sectionRef}
      className='relative isolate w-full overflow-hidden bg-court py-16 text-chalk sm:py-20'>
      {/* Kept effect, re-themed: chalk/marker dust reacting to the pointer */}
      <SmokeCursor />

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
            const { prefix, number, suffix } = parseValue(item.value);
            return (
              <div
                key={item.label}
                data-stat-tile
                className={cn(
                  'flex flex-col items-center border-chalk/12 px-4 py-8 text-center sm:px-6 sm:py-4',
                  DIVIDERS[i] ?? '',
                )}>
                <span
                  ref={(el) => {
                    numberRefs.current[i] = el;
                  }}
                  className='block font-display text-[2.75rem] font-extrabold leading-none tracking-[-0.03em] text-chalk tabular-nums sm:text-6xl'>
                  {number === null ? prefix : `${prefix}0${suffix}`}
                </span>
                <span className='mt-3.5 flex max-w-[18ch] items-center gap-2 text-sm font-medium leading-6 text-chalk/60 sm:mt-4'>
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
