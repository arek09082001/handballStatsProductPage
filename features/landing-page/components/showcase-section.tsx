'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';
import { trackDemoClick } from '@/lib/analytics';
import { CLUB_CONFIG } from '@/lib/club-config';
import { BoardScreenshot, Grain, SectionHeading } from './tactic';

interface ShowcaseItem {
  badge: string;
  title: string;
  description: string;
}

const SHOTS = [
  { src: '/recordStatsInGame.png', width: 1916, height: 879 },
  { src: '/gameListOverview.png', width: 1899, height: 874 },
  { src: '/statsTableInGame.png', width: 1896, height: 874 },
  { src: '/shotMaps.png', width: 1900, height: 874 },
  { src: '/teamManagement.png', width: 1900, height: 874 },
  { src: '/exportShare.png', width: 1900, height: 874 },
] as const;

export default function ShowcaseSection() {
  const t = useTranslations('productPage.showcase');
  const items = t.raw('items') as ShowcaseItem[];

  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      rowsRef.current.forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 82%', once: true },
          },
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id='features'
      ref={sectionRef}
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper py-24 md:py-32'>
      <Grain tone='paper' />
      <div className='relative mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <SectionHeading kicker={t('kicker')} title={t('title')} description={t('description')} />

        <div className='mt-20 flex flex-col gap-20 md:gap-28'>
          {items.map((item, index) => {
            const shot = SHOTS[index];
            const reversed = index % 2 === 1;

            return (
              <div
                key={item.title}
                ref={(el) => {
                  if (el) rowsRef.current[index] = el;
                }}
                className='grid items-center gap-8 lg:grid-cols-2 lg:gap-14'>
                <div className={reversed ? 'lg:order-2' : ''}>
                  <div className='flex items-baseline gap-3'>
                    <span className='font-display text-5xl font-extrabold leading-none tracking-tighter text-primary/25 tabular-nums'>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className='inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary'>
                      <span aria-hidden className='size-1.5 rounded-[3px] bg-primary' />
                      {item.badge}
                    </span>
                  </div>
                  <h3 className='mt-4 font-display text-2xl font-extrabold tracking-[-0.02em] text-ink sm:text-[1.75rem]'>
                    {item.title}
                  </h3>
                  <p className='mt-3.5 max-w-[52ch] text-base leading-7 text-ink/70'>
                    {item.description}
                  </p>
                </div>

                <div className={reversed ? 'lg:order-1' : ''}>
                  <BoardScreenshot
                    src={shot.src}
                    alt={item.title}
                    width={shot.width}
                    height={shot.height}
                    label={item.title}
                    tone='paper'
                    pin={reversed ? 'magnet' : 'tape'}
                    priority={index === 0}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className='mt-20 text-center'>
          <a
            href={CLUB_CONFIG.website.demoUrl}
            target='_blank'
            rel='noopener noreferrer'
            onClick={() => trackDemoClick('showcase')}
            className='inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-paper px-6 py-3.5 font-display text-sm font-bold text-ink transition-colors hover:border-primary hover:text-primary'>
            {t('ctaLabel')}
            <ArrowUpRight className='size-4' />
          </a>
        </div>
      </div>
    </section>
  );
}
