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

// Divider classes tuned for the fixed four-item bar: hairlines between columns
// on desktop, plus a row divider between the two rows on mobile (2×2).
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
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );

      // Count each numeric value up from zero when the band scrolls in.
      items.forEach((item, i) => {
        const el = numberRefs.current[i];
        const { prefix, number, suffix } = parseValue(item.value);
        if (!el || number === null) return;

        const counter = { v: 0 };
        gsap.to(counter, {
          v: number,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
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
      className='relative isolate w-full overflow-hidden bg-[#0a1020] py-20 sm:py-28'>
      {/* Live fluid-smoke layer (transparent where there is no smoke) */}
      <SmokeCursor />

      {/* Depth + brand tint, and hairlines to seat the band on the page */}
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(100%_130%_at_50%_-10%,rgba(249,115,22,0.14),transparent_58%),radial-gradient(90%_120%_at_100%_120%,rgba(37,99,235,0.14),transparent_60%)]' />
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_50%,transparent_55%,rgba(10,16,32,0.85)_100%)]' />
      <div className='pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent' />
      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent' />

      <div className='relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-10'>
        <div className='grid grid-cols-2 sm:grid-cols-4'>
          {items.map((item, i) => {
            const { prefix, number, suffix } = parseValue(item.value);
            return (
              <div
                key={item.label}
                data-stat-tile
                className={cn(
                  'flex flex-col items-center px-4 py-8 text-center border-white/10 sm:px-6 sm:py-4',
                  DIVIDERS[i] ?? ''
                )}>
                <span
                  ref={(el) => {
                    numberRefs.current[i] = el;
                  }}
                  className='block bg-linear-to-br from-white via-orange-100 to-orange-400 bg-clip-text text-4xl font-extrabold leading-none tracking-tight text-transparent drop-shadow-[0_2px_30px_rgba(249,115,22,0.35)] sm:text-6xl'>
                  {number === null ? prefix : `${prefix}0${suffix}`}
                </span>
                <span className='mt-3 max-w-[18ch] text-sm font-medium leading-6 text-slate-400 sm:mt-4 sm:text-base'>
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
