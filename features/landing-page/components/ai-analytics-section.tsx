'use client';

import { useEffect, useRef } from 'react';
import { Check, ShieldCheck, Sparkles, TrendingUp, Trophy, User, Users } from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';
import AppScreenshot from './app-screenshot';

interface Scope {
  title: string;
  description: string;
  points: string[];
}

const SCOPE_ICONS = [TrendingUp, Users, User, Trophy];

export default function AiAnalyticsSection() {
  const t = useTranslations('productPage.ai');
  const scopes = t.raw('scopes') as Scope[];

  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const showcaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        showcaseRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: showcaseRef.current,
            start: 'top 84%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id='ai'
      ref={sectionRef}
      className='relative w-full scroll-mt-24 overflow-hidden bg-gradient-to-b from-[#0b1220] via-[#0e1730] to-[#0b1220] py-20 text-white md:py-24'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_15%_0%,rgba(249,115,22,0.18),transparent),radial-gradient(ellipse_45%_45%_at_100%_100%,rgba(37,99,235,0.18),transparent)]' />

      <div className='relative mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#fdba74] ring-1 ring-white/15'>
            <Sparkles className='size-3.5' />
            {t('eyebrow')}
          </p>
          <h2 className='mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl'>
            {t('title')}
          </h2>
          <p className='mt-4 text-base leading-7 text-slate-300'>
            {t('description')}
          </p>
        </div>

        {/* Four analysis scopes: match, team, player, tournament */}
        <div className='mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
          {scopes.map((scope, index) => {
            const Icon = SCOPE_ICONS[index % SCOPE_ICONS.length];

            return (
              <div
                key={scope.title}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className='rounded-[1.4rem] border border-white/10 bg-white/5 px-7 py-8 backdrop-blur-sm transition-colors duration-300 hover:border-white/20'>
                <div className='flex size-12 items-center justify-center rounded-2xl bg-primary/20 text-[#fdba74]'>
                  <Icon className='size-6' />
                </div>
                <p className='mt-5 text-xl font-bold tracking-tight text-white'>
                  {scope.title}
                </p>
                <p className='mt-3 text-sm leading-7 text-slate-300'>
                  {scope.description}
                </p>
                <ul className='mt-5 space-y-2.5'>
                  {scope.points.map((point) => (
                    <li key={point} className='flex items-start gap-2.5'>
                      <span className='mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300'>
                        <Check className='size-3' />
                      </span>
                      <span className='text-sm leading-6 text-slate-200'>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className='mx-auto mt-8 flex max-w-2xl items-start justify-center gap-2.5 text-center text-sm leading-6 text-slate-400'>
          <ShieldCheck className='mt-0.5 size-4 shrink-0 text-emerald-400' />
          <span>{t('privacyNote')}</span>
        </p>

        {/* In-depth single-game analysis showcase */}
        <div ref={showcaseRef} className='mt-20'>
          <div className='mx-auto max-w-3xl text-center'>
            <span className='inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#fdba74]'>
              {t('showcase.badge')}
            </span>
            <h3 className='mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl'>
              {t('showcase.title')}
            </h3>
            <p className='mt-4 text-base leading-7 text-slate-300'>
              {t('showcase.description')}
            </p>
          </div>

          <div className='mt-12 grid gap-6 lg:grid-cols-2'>
            <AppScreenshot
              src='/aiAnalyze.png'
              alt={t('showcase.imageOneLabel')}
              width={1032}
              height={803}
              label={t('showcase.imageOneLabel')}
            />
            <AppScreenshot
              src='/aiAnalyze2.png'
              alt={t('showcase.imageTwoLabel')}
              width={1027}
              height={808}
              label={t('showcase.imageTwoLabel')}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
