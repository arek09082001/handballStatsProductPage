'use client';

import { CalendarClock, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { BoardKicker, CourtDiagram, Grain } from '@/features/landing-page/components/tactic';

/**
 * Court-ground header for the legal page — a signature band of the Trainertafel
 * world, matching the Ratgeber Read register (see DESIGN.md). The handball court
 * is chalked behind the copy, the register is set as the coach's marker kicker,
 * and the H1 sits in Archivo chalk. Two anchor chips jump straight to the
 * Impressum and Datenschutz blocks — a real navigation aid on a long legal page.
 * Replaces the old slate-950 + radial-blob-glow hero (a banned generic look).
 */
export default function ImpressumHeader() {
  const t = useTranslations('legalPage.header');
  const impressumT = useTranslations('legalPage.impressum');
  const privacyT = useTranslations('legalPage.privacy');

  return (
    <header className='relative isolate w-full overflow-hidden bg-court text-chalk'>
      <CourtDiagram
        variant='goal'
        aria-hidden
        className='pointer-events-none absolute -right-[16%] top-1/2 h-[135%] w-auto -translate-y-1/2 text-chalk/[0.09] sm:-right-[9%] lg:-right-[2%]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto max-w-3xl px-6 py-14 sm:px-8 sm:py-16 md:py-20'>
        <BoardKicker color='chalk'>{t('eyebrow')}</BoardKicker>

        <h1 className='mt-4 max-w-2xl text-balance font-display text-[2rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-chalk sm:text-[2.5rem] lg:text-[2.9rem] lg:leading-[1.05]'>
          {t('title')}
        </h1>

        <p className='mt-5 max-w-2xl text-base leading-8 text-chalk/75 sm:text-lg'>
          {t('description')}
        </p>

        <div className='mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-chalk/60'>
          <span className='inline-flex items-center gap-2'>
            <ShieldCheck className='h-4 w-4 text-success' />
            {t('transparencyBadge')}
          </span>
          <span aria-hidden className='hidden h-1 w-1 rounded-full bg-chalk/30 sm:inline-block' />
          <span className='inline-flex items-center gap-2'>
            <CalendarClock className='h-4 w-4 text-primary' />
            {t('lastUpdated')}
          </span>
        </div>

        <nav
          aria-label={t('title')}
          className='mt-8 flex flex-wrap gap-2.5'>
          <a
            href='#impressum'
            className='inline-flex items-center rounded-lg border border-chalk/15 bg-chalk/[0.06] px-3.5 py-2 text-sm font-semibold text-chalk/85 transition-colors hover:border-chalk/30 hover:bg-chalk/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-court'>
            {impressumT('title')}
          </a>
          <a
            href='#datenschutz'
            className='inline-flex items-center rounded-lg border border-chalk/15 bg-chalk/[0.06] px-3.5 py-2 text-sm font-semibold text-chalk/85 transition-colors hover:border-chalk/30 hover:bg-chalk/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-court'>
            {privacyT('shortTitle')}
          </a>
        </nav>
      </div>
    </header>
  );
}
