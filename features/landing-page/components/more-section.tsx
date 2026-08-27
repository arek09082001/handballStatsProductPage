'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';
import { Grain, PlayerMagnet, SectionHeading } from './tactic';
import TickerMock from './ticker-mock';

interface Point {
  title: string;
  description: string;
}

/**
 * "Und dann noch" — one band for everything past the single game: tournaments,
 * the public live ticker and the coaching staff.
 *
 * These were three full bands (tournament, live ticker, collaboration) with six
 * screenshots between them, roughly three viewports of scroll a visitor had to
 * cross before reaching the decision. A coach browsing on a phone does not need
 * to be sold on the tournament table before registering — they need to know it
 * exists. So the three collapse into three ruled entries and keep the one
 * visual that actually earns its place: the ticker a parent sees in the stands.
 *
 * The old `#tournament`, `#liveticker` and `#collaboration` anchors are kept as
 * zero-height targets so links from the footer, the 404 page and anywhere off
 * site still land on the right band instead of the top of the page.
 */
export default function MoreSection() {
  const t = useTranslations('productPage.more');
  const points = t.raw('points') as Point[];

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-more-row]',
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
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
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id='mehr'
      ref={sectionRef}
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper py-20 md:py-28'>
      {/* Legacy anchors — the three bands this one replaced. */}
      <span id='tournament' aria-hidden className='block scroll-mt-24' />
      <span id='liveticker' aria-hidden className='block scroll-mt-24' />
      <span id='collaboration' aria-hidden className='block scroll-mt-24' />

      <Grain tone='paper' />
      <div className='relative mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div className='grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20'>
          <div>
            <SectionHeading
              align='left'
              kicker={t('kicker')}
              title={t('title')}
              description={t('description')}
            />

            <div className='mt-10'>
              {points.map((point, index) => (
                <div
                  key={point.title}
                  data-more-row
                  className='flex items-start gap-4 border-t border-ink/10 py-5'>
                  <PlayerMagnet number={index + 1} team='home' size='md' className='shrink-0' />
                  <div>
                    <p className='font-display text-lg font-bold tracking-tight text-ink'>
                      {point.title}
                    </p>
                    <p className='mt-1 max-w-[58ch] text-sm leading-7 text-ink/70'>
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href='/funktionen'
              title='Alle Funktionen von Statix im Detail'
              className='group mt-8 inline-flex items-center gap-2 font-display text-[15px] font-bold tracking-tight text-primary transition-colors hover:text-[#ea580c]'>
              {t('linkLabel')}
              <ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
            </Link>
          </div>

          <TickerMock />
        </div>
      </div>
    </section>
  );
}
