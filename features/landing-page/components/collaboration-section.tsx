'use client';

import { useEffect, useRef } from 'react';
import { ClipboardList, Inbox, Sparkles } from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';
import { BoardCard, Grain, PlayerMagnet, SectionHeading } from './tactic';

interface Point {
  title: string;
  description: string;
}

export default function CollaborationSection() {
  const t = useTranslations('productPage.collab');
  const points = t.raw('points') as Point[];

  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const mockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [copyRef.current, mockRef.current],
        { opacity: 0, y: 30 },
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
      id='collaboration'
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

          {/* Illustrative inbox + survey mocks (sample data) */}
          <div ref={mockRef} className='mx-auto w-full max-w-[440px] space-y-6'>
            <BoardCard tone='paper' pin='tape'>
              <div className='flex items-center justify-between border-b border-ink/10 px-5 py-3'>
                <span className='inline-flex items-center gap-2 text-sm font-semibold text-ink'>
                  <Inbox className='size-4 text-primary' />
                  {t('mock.inboxTitle')}
                </span>
                <span className='rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary'>
                  {t('mock.inboxUnread')}
                </span>
              </div>
              <div className='flex items-start gap-3.5 px-5 py-4'>
                <span
                  className='mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl font-display text-xs font-extrabold text-white'
                  style={{
                    background:
                      'radial-gradient(120% 120% at 32% 26%, hsl(221 90% 62%), hsl(221 83% 46%))',
                  }}>
                  SG
                </span>
                <div className='min-w-0'>
                  <p className='truncate text-sm font-bold text-ink'>{t('mock.inboxGame')}</p>
                  <p className='mt-0.5 text-xs text-ink/60'>{t('mock.inboxShared')}</p>
                  <div className='mt-2.5 flex flex-wrap gap-1.5'>
                    <span className='rounded-full bg-paper-2 px-2.5 py-1 text-[11px] font-semibold text-ink/70'>
                      {t('mock.inboxChipStats')}
                    </span>
                    <span className='inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary'>
                      <Sparkles className='size-3' />
                      {t('mock.inboxChipAi')}
                    </span>
                  </div>
                </div>
                <span className='ml-auto mt-1.5 size-2 shrink-0 rounded-full bg-primary' />
              </div>
            </BoardCard>

            <BoardCard tone='paper' pin='magnet' pinColor='success'>
              <div className='px-5 py-4'>
                <span className='inline-flex items-center gap-2 text-sm font-semibold text-ink'>
                  <ClipboardList className='size-4 text-primary' />
                  {t('mock.surveyTitle')}
                </span>
                <p className='mt-2 text-xs text-ink/60'>{t('mock.surveyAnswered')}</p>
                <div className='mt-2.5 h-2 overflow-hidden rounded-full bg-paper-2'>
                  <div className='h-full w-[64%] rounded-full bg-primary' />
                </div>
                <div className='mt-3 flex gap-1.5'>
                  <span className='rounded-full bg-success/12 px-2.5 py-1 text-[11px] font-semibold text-success'>
                    {t('mock.surveyYes')}
                  </span>
                  <span className='rounded-full bg-ink/8 px-2.5 py-1 text-[11px] font-semibold text-ink/60'>
                    {t('mock.surveyNo')}
                  </span>
                </div>
              </div>
            </BoardCard>
          </div>
        </div>
      </div>
    </section>
  );
}
