'use client';

import { useEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';
import { BoardScreenshot, CourtDiagram, Grain, PlayerMagnet, SectionHeading } from './tactic';

interface Scope {
  title: string;
  description: string;
}

export default function AiAnalyticsSection() {
  const t = useTranslations('productPage.ai');
  const scopes = t.raw('scopes') as Scope[];

  const sectionRef = useRef<HTMLElement>(null);
  const scopesRef = useRef<HTMLDivElement[]>([]);
  const showcaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        scopesRef.current,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        },
      );
      gsap.fromTo(
        showcaseRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: showcaseRef.current, start: 'top 84%', once: true },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id='ai'
      ref={sectionRef}
      className='relative w-full scroll-mt-24 overflow-hidden bg-court py-24 text-chalk md:py-32'>
      <CourtDiagram
        variant='full'
        aria-hidden
        className='pointer-events-none absolute inset-x-0 top-8 mx-auto h-auto w-[92%] max-w-5xl text-chalk/[0.06]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto w-full max-w-6xl px-6 sm:px-10'>
        <SectionHeading
          tone='court'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
        />

        {/* Four scopes as scouting entries — hairline‑ruled, no card chrome */}
        <div className='mx-auto mt-16 grid max-w-4xl gap-x-14 sm:grid-cols-2'>
          {scopes.map((scope, index) => (
            <div
              key={scope.title}
              ref={(el) => {
                if (el) scopesRef.current[index] = el;
              }}
              className='flex items-start gap-4 border-t border-chalk/12 py-7'>
              <PlayerMagnet number={index + 1} team='home' size='md' className='shrink-0' />
              <div>
                <p className='font-display text-lg font-bold tracking-tight text-chalk'>
                  {scope.title}
                </p>
                <p className='mt-1.5 text-sm leading-7 text-chalk/70'>{scope.description}</p>
              </div>
            </div>
          ))}
        </div>

        <p className='mx-auto mt-14 flex max-w-2xl items-start justify-center gap-2.5 text-center text-sm leading-6 text-chalk/60'>
          <ShieldCheck className='mt-0.5 size-4 shrink-0 text-success' />
          <span>{t('privacyNote')}</span>
        </p>

        {/* In‑depth single‑game analysis, pinned to the board */}
        <div ref={showcaseRef} className='mt-24'>
          <div className='mx-auto max-w-3xl text-center'>
            <h3 className='text-balance font-display text-2xl font-extrabold tracking-[-0.02em] text-chalk sm:text-[1.75rem]'>
              {t('showcase.title')}
            </h3>
            <p className='mx-auto mt-4 max-w-[54ch] text-base leading-7 text-chalk/70'>
              {t('showcase.description')}
            </p>
          </div>
          <div className='mt-12 grid gap-8 lg:grid-cols-2'>
            <BoardScreenshot
              src='/aiAnalyze.png'
              alt={t('showcase.imageOneLabel')}
              width={1032}
              height={803}
              label={t('showcase.imageOneLabel')}
              tone='court'
              pin='tape'
            />
            <BoardScreenshot
              src='/aiAnalyze2.png'
              alt={t('showcase.imageTwoLabel')}
              width={1027}
              height={808}
              label={t('showcase.imageTwoLabel')}
              tone='court'
              pin='magnet'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
