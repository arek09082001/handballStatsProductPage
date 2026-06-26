'use client';

import { useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';

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
              <div className='flex size-11 items-center justify-center rounded-xl bg-rose-100 text-rose-500'>
                <X className='size-5' />
              </div>
              <h3 className='mt-5 text-2xl font-bold tracking-tight text-foreground'>
                {t('oldTitle')}
              </h3>
              <ul className='mt-6 space-y-4'>
                {oldPoints.map((point) => (
                  <li key={point} className='flex items-start gap-3'>
                    <span className='mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white'>
                      <X className='size-3' />
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
            className='relative overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-[#0b1220] via-[#101a36] to-[#0b1220] px-7 py-7 text-white shadow-[0_30px_70px_-40px_rgba(15,23,42,0.7)]'>
            <div className='absolute right-0 top-0 h-24 w-24 rounded-bl-[3rem] bg-primary/20' />
            <div className='relative'>
              <div className='flex size-11 items-center justify-center rounded-xl bg-primary/20 text-[#fdba74]'>
                <Check className='size-5' />
              </div>
              <h3 className='mt-5 text-2xl font-bold tracking-tight text-white'>
                {t('newTitle')}
              </h3>
              <ul className='mt-6 space-y-4'>
                {newPoints.map((point) => (
                  <li key={point} className='flex items-start gap-3'>
                    <span className='mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white'>
                      <Check className='size-3' />
                    </span>
                    <span className='text-sm leading-7 text-slate-200'>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
