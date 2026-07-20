'use client';

import { useEffect, useRef } from 'react';
import { ShieldCheck, TrendingUp, Trophy, User, Users } from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';
import AppScreenshot from './app-screenshot';

interface Scope {
  title: string;
  description: string;
}

const SCOPE_ICONS = [TrendingUp, Users, User, Trophy];

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
        { opacity: 0, y: 24 },
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
      className='relative w-full scroll-mt-24 overflow-hidden bg-gradient-to-b from-[#0b1220] via-[#0e1730] to-[#0b1220] py-24 text-white md:py-32'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_15%_0%,rgba(249,115,22,0.18),transparent),radial-gradient(ellipse_45%_45%_at_100%_100%,rgba(37,99,235,0.18),transparent)]' />

      <div className='relative mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div className='mx-auto max-w-3xl text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>
            {t('title')}
          </h2>
          <p className='mt-5 text-base leading-7 text-slate-300'>
            {t('description')}
          </p>
        </div>

        {/* Four analysis scopes: match, team, player, tournament */}
        <div className='mx-auto mt-20 grid max-w-4xl gap-x-16 gap-y-14 md:grid-cols-2'>
          {scopes.map((scope, index) => {
            const Icon = SCOPE_ICONS[index % SCOPE_ICONS.length];

            return (
              <div
                key={scope.title}
                ref={(el) => {
                  if (el) scopesRef.current[index] = el;
                }}
                className='flex items-start gap-5'>
                <span className='flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-[#fdba74]'>
                  <Icon className='size-6' />
                </span>
                <div>
                  <p className='text-xl font-bold tracking-tight text-white'>
                    {scope.title}
                  </p>
                  <p className='mt-2.5 text-sm leading-7 text-slate-300'>
                    {scope.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className='mx-auto mt-16 flex max-w-2xl items-start justify-center gap-2.5 text-center text-sm leading-6 text-slate-400'>
          <ShieldCheck className='mt-0.5 size-4 shrink-0 text-emerald-400' />
          <span>{t('privacyNote')}</span>
        </p>

        {/* In-depth single-game analysis showcase */}
        <div ref={showcaseRef} className='mt-24'>
          <div className='mx-auto max-w-3xl text-center'>
            <h3 className='text-2xl font-bold tracking-tight text-white sm:text-3xl'>
              {t('showcase.title')}
            </h3>
            <p className='mt-5 text-base leading-7 text-slate-300'>
              {t('showcase.description')}
            </p>
          </div>

          <div className='mt-14 grid gap-8 lg:grid-cols-2'>
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
