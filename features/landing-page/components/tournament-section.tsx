'use client';

import { useEffect, useRef } from 'react';
import { ListChecks, PlayCircle, Table2, Users, Trophy } from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';
import AppScreenshot from './app-screenshot';

interface Point {
  title: string;
  description: string;
}

const POINT_ICONS = [Table2, PlayCircle, ListChecks, Users];

export default function TournamentSection() {
  const t = useTranslations('productPage.tournament');
  const points = t.raw('points') as Point[];

  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [copyRef.current, imagesRef.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id='tournament'
      ref={sectionRef}
      className='w-full scroll-mt-24 bg-background py-20 md:py-24'>
      <div className='mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary'>
            <Trophy className='size-4' />
            {t('eyebrow')}
          </p>
          <h2 className='mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
            {t('title')}
          </h2>
          <p className='mt-4 text-base leading-7 text-muted-foreground'>
            {t('description')}
          </p>
        </div>

        <div className='mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-14'>
          <div ref={copyRef} className='space-y-6'>
            {points.map((point, index) => {
              const Icon = POINT_ICONS[index % POINT_ICONS.length];

              return (
                <div key={point.title} className='flex items-start gap-4'>
                  <span className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                    <Icon className='size-5' />
                  </span>
                  <div>
                    <p className='text-lg font-bold tracking-tight text-foreground'>
                      {point.title}
                    </p>
                    <p className='mt-1.5 text-sm leading-7 text-muted-foreground'>
                      {point.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div ref={imagesRef} className='space-y-6'>
            <AppScreenshot
              src='/tournamentTable.png'
              alt={t('imageOneLabel')}
              width={1875}
              height={874}
              label={t('imageOneLabel')}
            />
            <AppScreenshot
              src='/tournamentGameList.png'
              alt={t('imageTwoLabel')}
              width={1871}
              height={872}
              label={t('imageTwoLabel')}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
