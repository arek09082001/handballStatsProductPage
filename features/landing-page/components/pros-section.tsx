'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight, Check, X } from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';
import { trackDemoClick } from '@/lib/analytics';
import { CLUB_CONFIG } from '@/lib/club-config';
import { BoardCard, Grain, SectionHeading } from './tactic';

export default function ProsSection() {
  const t = useTranslations('productPage.pros');
  const oldPoints = t.raw('oldPoints') as string[];
  const newPoints = t.raw('newPoints') as string[];

  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className='relative w-full overflow-hidden bg-paper py-24 md:py-32'>
      <Grain tone='paper' />
      <div className='relative mx-auto w-full max-w-6xl px-6 sm:px-10'>
        <SectionHeading kicker={t('kicker')} title={t('title')} description={t('description')} />

        <div className='mx-auto mt-16 grid max-w-5xl items-start gap-8 lg:grid-cols-2'>
          {/* The old way — a ruled paper scrap, taped to the board */}
          <div
            ref={(el) => {
              if (el) cardsRef.current[0] = el;
            }}
            className='lg:-rotate-1'>
            <BoardCard tone='paper' pin='tape' className='overflow-hidden'>
              <div
                aria-hidden
                className='pointer-events-none absolute inset-0 opacity-[0.5]'
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(hsl(222 24% 13% / 0.06) 0 1px, transparent 1px 30px)',
                  backgroundPosition: '0 44px',
                }}
              />
              <div className='relative px-7 py-8'>
                <div className='flex size-11 items-center justify-center rounded-xl bg-ink/8 text-ink/50'>
                  <X className='size-5' />
                </div>
                <p className='mt-5 font-display text-2xl font-extrabold tracking-tight text-ink/55'>
                  {t('oldTitle')}
                </p>
                <ul className='mt-6 space-y-4'>
                  {oldPoints.map((point) => (
                    <li key={point} className='flex items-start gap-3'>
                      <span className='mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-ink/15 text-paper'>
                        <X className='size-3' strokeWidth={3} />
                      </span>
                      <span className='text-sm leading-7 text-ink/55 line-through decoration-ink/25'>
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </BoardCard>
          </div>

          {/* The new way — the board itself */}
          <div
            ref={(el) => {
              if (el) cardsRef.current[1] = el;
            }}
            className='lg:rotate-1'>
            <BoardCard tone='court' pin='magnet' pinColor='marker' className='overflow-hidden'>
              <div className='px-7 py-8'>
                <div className='flex size-11 items-center justify-center rounded-xl bg-primary/20 text-primary'>
                  <Check className='size-5' strokeWidth={2.5} />
                </div>
                <p className='mt-5 font-display text-2xl font-extrabold tracking-tight text-chalk'>
                  {t('newTitle')}
                </p>
                <ul className='mt-6 space-y-4'>
                  {newPoints.map((point) => (
                    <li key={point} className='flex items-start gap-3'>
                      <span className='mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-success text-white'>
                        <Check className='size-3' strokeWidth={3} />
                      </span>
                      <span className='text-sm leading-7 text-chalk/85'>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </BoardCard>
          </div>
        </div>

        <div className='mt-12 text-center'>
          <a
            href={CLUB_CONFIG.website.demoUrl}
            target='_blank'
            rel='noopener noreferrer'
            onClick={() => trackDemoClick('pros')}
            className='inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-display text-sm font-bold text-white shadow-[0_14px_26px_-14px_hsl(22_90%_45%/0.85)] transition-all hover:-translate-y-0.5 hover:bg-[#ea580c]'>
            {t('cta')}
            <ArrowUpRight className='size-4' />
          </a>
        </div>
      </div>
    </section>
  );
}
