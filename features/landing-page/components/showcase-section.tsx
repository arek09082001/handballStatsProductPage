'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';
import AppScreenshot from './app-screenshot';

interface ShowcaseItem {
  badge: string;
  title: string;
  description: string;
}

/** Real in-app screenshots paired with the translated copy, in document order. */
const SHOTS = [
  {
    src: '/recordStatsInGame.png',
    width: 1916,
    height: 879,
    labelKey: 'items.0',
  },
  {
    src: '/gameListOverview.png',
    width: 1899,
    height: 874,
    labelKey: 'items.1',
  },
  {
    src: '/statsTableInGame.png',
    width: 1896,
    height: 874,
    labelKey: 'items.2',
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
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id='features'
      ref={sectionRef}
      className='w-full scroll-mt-24 bg-muted/30 py-20 md:py-24'>
      <div className='mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-primary'>
            {t('eyebrow')}
          </p>
          <h2 className='mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
            {t('title')}
          </h2>
          <p className='mt-4 text-base leading-7 text-muted-foreground'>
            {t('description')}
          </p>
        </div>

        <div className='mt-16 flex flex-col gap-16 md:gap-24'>
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
                  <span className='inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary'>
                    {item.badge}
                  </span>
                  <h3 className='mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
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
      </div>
    </section>
  );
}
