'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';
import { BoardScreenshot, Grain, PlayerMagnet, SectionHeading } from './tactic';

interface Point {
  title: string;
  description: string;
}

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
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id='tournament'
      ref={sectionRef}
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper py-24 md:py-32'>
      <Grain tone='paper' />
      <div className='relative mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div className='grid items-center gap-14 lg:grid-cols-2 lg:gap-16'>
          <div ref={copyRef}>
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
                  className='flex items-start gap-4 border-t border-ink/10 py-5'>
                  <PlayerMagnet number={index + 1} team='home' size='md' className='shrink-0' />
                  <div>
                    <p className='font-display text-lg font-bold tracking-tight text-ink'>
                      {point.title}
                    </p>
                    <p className='mt-1 text-sm leading-7 text-ink/70'>{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div ref={imagesRef} className='space-y-6'>
            <BoardScreenshot
              src='/tournamentTable.png'
              alt={t('imageOneLabel')}
              width={1875}
              height={874}
              label={t('imageOneLabel')}
              tone='paper'
              pin='tape'
            />
            <BoardScreenshot
              src='/tournamentGameList.png'
              alt={t('imageTwoLabel')}
              width={1871}
              height={872}
              label={t('imageTwoLabel')}
              tone='paper'
              pin='magnet'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
