'use client';

import { useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';

export default function CostOfOutdatedWebsiteSection() {
  const t = useTranslations('costOfOutdatedWebsiteSection');
  const oldWayPoints = [t('oldPoint1'), t('oldPoint2'), t('oldPoint3')];
  const betterWayPoints = [t('newPoint1'), t('newPoint2'), t('newPoint3')];

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
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className='w-full bg-background py-20 md:py-24'>
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

        <div className='mt-12 grid gap-6 lg:grid-cols-2'>
          <div
            ref={(el) => {
              if (el) cardsRef.current[0] = el;
            }}
            className='card-surface relative overflow-hidden rounded-[1.4rem] px-7 py-7'>
            <div className='absolute right-0 top-0 h-20 w-20 rounded-bl-[3rem] bg-rose-100/80' />
            <div className='relative'>
              <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-500'>
                <X className='h-5 w-5' />
              </div>
              <p className='mt-5 text-2xl font-bold tracking-tight text-foreground'>
                {t('oldWayTitle')}
              </p>

              <ul className='mt-6 space-y-4'>
                {oldWayPoints.map((point) => (
                  <li key={point} className='flex items-start gap-3'>
                    <span className='mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500 text-white'>
                      <span className='h-1.5 w-1.5 rounded-full bg-white' />
                    </span>
                    <span className='text-sm leading-7 text-muted-foreground'>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            ref={(el) => {
              if (el) cardsRef.current[1] = el;
            }}
            className='card-surface-dark rounded-[1.4rem] px-7 py-7 text-white'>
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-950/70 text-emerald-400'>
              <Check className='h-5 w-5' />
            </div>
            <p className='mt-5 text-2xl font-bold tracking-tight text-white'>{t('newWayTitle')}</p>

            <ul className='mt-6 space-y-4'>
              {betterWayPoints.map((point) => (
                <li key={point} className='flex items-start gap-3'>
                  <span className='mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500 text-white'>
                    <Check className='h-3 w-3' />
                  </span>
                  <span className='text-sm leading-7 text-slate-200'>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}