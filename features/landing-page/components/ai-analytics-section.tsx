'use client';

import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { BoardScreenshot, CourtDiagram, Grain, PlayerMagnet, SectionHeading } from './tactic';

interface Scope {
  title: string;
  description: string;
}

export default function AiAnalyticsSection() {
  const t = useTranslations('productPage.ai');
  const scopes = t.raw('scopes') as Scope[];

  return (
    <section
      id='ai'
      className='relative w-full scroll-mt-24 overflow-hidden bg-court py-20 text-chalk md:py-28'>
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
        <div className='mx-auto mt-10 grid max-w-4xl gap-x-14 sm:grid-cols-2'>
          {scopes.map((scope, index) => (
            <div
              key={scope.title}
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

        <p className='mx-auto mt-6 flex max-w-2xl items-start justify-center gap-2.5 text-center text-sm leading-6 text-chalk/60'>
          <ShieldCheck className='mt-0.5 size-4 shrink-0 text-success' />
          <span>{t('privacyNote')}</span>
        </p>

        {/* The real reports, pinned to the board. The sub-heading that used to
            sit here restated the band's own standfirst, so the screenshots now
            speak for themselves under their labels. */}
        <div className='mt-16'>
          <div className='mx-auto grid max-w-4xl gap-10'>
            <div>
              <BoardScreenshot
                src='/aiAnalyze.png'
                alt={t('showcase.imageOneLabel')}
                width={2560}
                height={2000}
                label={t('showcase.imageOneLabel')}
                sizes='(max-width: 1024px) 90vw, 900px'
                tone='court'
                pin='tape'
              />
              <a href='/aiAnalyze.png' target='_blank' rel='noopener noreferrer'
                className='board-detail-link mt-3 inline-flex items-center gap-2 text-sm font-semibold text-chalk'>
                {t('showcase.openImage')}<ArrowUpRight className='size-4' aria-hidden='true' />
              </a>
            </div>
            <details className='group border-t border-chalk/20 pt-2'>
              <summary className='flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-3 font-display text-base font-bold text-chalk focus-visible:outline-2 focus-visible:outline-offset-4'>
                {t('showcase.more')}
                <span aria-hidden='true' className='text-2xl text-primary group-open:rotate-45'>+</span>
              </summary>
              <div className='pt-6'>
                <BoardScreenshot
                  src='/aiAnalyze2.png'
                  alt={t('showcase.imageTwoLabel')}
                  width={2560}
                  height={2000}
                  label={t('showcase.imageTwoLabel')}
                  sizes='(max-width: 1024px) 90vw, 900px'
                  tone='court'
                  pin='magnet'
                />
                <a href='/aiAnalyze2.png' target='_blank' rel='noopener noreferrer'
                  className='board-detail-link mt-3 inline-flex items-center gap-2 text-sm font-semibold text-chalk'>
                  {t('showcase.openImage')}<ArrowUpRight className='size-4' aria-hidden='true' />
                </a>
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
