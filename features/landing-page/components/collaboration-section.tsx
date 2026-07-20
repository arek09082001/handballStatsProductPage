'use client';

import { useEffect, useRef } from 'react';
import {
  ClipboardList,
  FileDown,
  Inbox,
  Share2,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';

interface Point {
  title: string;
  description: string;
}

const POINT_ICONS = [Share2, UserPlus, ClipboardList, FileDown];

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
    <section
      id='collaboration'
      ref={sectionRef}
      className='w-full scroll-mt-24 bg-muted/30 py-20 md:py-24'>
      <div className='mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary'>
            <Users className='size-4' />
            {t('eyebrow')}
          </p>
          <h2 className='mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
            {t('title')}
          </h2>
          <p className='mt-4 text-base leading-7 text-muted-foreground'>
            {t('description')}
          </p>
        </div>

        <div className='mt-14 grid items-center gap-12 lg:grid-cols-2 lg:gap-16'>
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

          {/* Illustrative inbox + survey mocks (sample data) */}
          <div ref={mockRef} className='mx-auto w-full max-w-[440px] space-y-5'>
            <div className='overflow-hidden rounded-2xl border border-border bg-background shadow-[0_24px_60px_-35px_rgba(15,23,42,0.35)]'>
              <div className='flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3'>
                <span className='inline-flex items-center gap-2 text-sm font-semibold text-foreground'>
                  <Inbox className='size-4 text-primary' />
                  {t('mock.inboxTitle')}
                </span>
                <span className='rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary'>
                  {t('mock.inboxUnread')}
                </span>
              </div>
              <div className='flex items-start gap-3.5 px-5 py-4'>
                <span className='mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-600/25 text-xs font-extrabold text-blue-700'>
                  SG
                </span>
                <div className='min-w-0'>
                  <p className='truncate text-sm font-bold text-foreground'>
                    {t('mock.inboxGame')}
                  </p>
                  <p className='mt-0.5 text-xs text-muted-foreground'>
                    {t('mock.inboxShared')}
                  </p>
                  <div className='mt-2.5 flex flex-wrap gap-1.5'>
                    <span className='rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground'>
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
            </div>

            <div className='overflow-hidden rounded-2xl border border-border bg-background shadow-[0_24px_60px_-35px_rgba(15,23,42,0.35)]'>
              <div className='px-5 py-4'>
                <span className='inline-flex items-center gap-2 text-sm font-semibold text-foreground'>
                  <ClipboardList className='size-4 text-primary' />
                  {t('mock.surveyTitle')}
                </span>
                <p className='mt-2 text-xs text-muted-foreground'>
                  {t('mock.surveyAnswered')}
                </p>
                <div className='mt-2.5 h-2 overflow-hidden rounded-full bg-muted'>
                  <div className='h-full w-[64%] rounded-full bg-primary' />
                </div>
                <div className='mt-3 flex gap-1.5'>
                  <span className='rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700'>
                    {t('mock.surveyYes')}
                  </span>
                  <span className='rounded-full bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-700'>
                    {t('mock.surveyNo')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
