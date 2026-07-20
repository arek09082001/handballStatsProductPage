'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';
import { trackDemoClick } from '@/lib/analytics';
import { CLUB_CONFIG } from '@/lib/club-config';
import AppScreenshot from './app-screenshot';

interface ShowcaseItem {
  badge: string;
  title: string;
  description: string;
}

/**
 * Real in-app screenshots paired with the translated copy, in document order.
 * Entries flagged `pending` render a placeholder frame until the real shot is
 * dropped at `src` – then just remove the flag.
 */
const SHOTS = [
  {
    src: '/recordStatsInGame.png',
    width: 1916,
    height: 879,
  },
  {
    src: '/gameListOverview.png',
    width: 1899,
    height: 874,
  },
  {
    src: '/statsTableInGame.png',
    width: 1896,
    height: 874,
  },
  {
    src: '/shotMaps.png',
    width: 1900,
    height: 874,
  },
  {
    src: '/teamManagement.png',
    width: 1900,
    height: 874,
  },
  {
    src: '/exportShare.png',
    width: 1900,
    height: 874,
  },
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
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 82%',
              once: true,
            },
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
      className='w-full scroll-mt-24 bg-muted/30 py-24 md:py-32'>
      <div className='mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div className='mx-auto max-w-3xl text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
            {t('title')}
          </h2>
          <p className='mt-5 text-base leading-7 text-muted-foreground'>
            {t('description')}
          </p>
        </div>

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
                  <p className='flex items-center gap-3 text-sm font-semibold tabular-nums text-primary'>
                    {String(index + 1).padStart(2, '0')}
                    <span aria-hidden className='h-px w-10 bg-primary/40' />
                    <span className='font-medium text-muted-foreground'>{item.badge}</span>
                  </p>
                  <h3 className='mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
                    {item.title}
                  </h3>
                  <p className='mt-4 text-base leading-7 text-muted-foreground'>
                    {item.description}
                  </p>
                </div>

                <div className={reversed ? 'lg:order-1' : ''}>
                  <AppScreenshot
                    src={shot.src}
                    alt={item.title}
                    width={shot.width}
                    height={shot.height}
                    label={item.title}
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
            className='inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10'>
            {t('ctaLabel')}
            <ArrowUpRight className='size-4' />
          </a>
        </div>
      </div>
    </section>
  );
}
