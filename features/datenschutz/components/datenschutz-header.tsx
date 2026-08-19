'use client';

import Link from 'next/link';
import { CalendarClock, FileText, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { BoardKicker, CourtDiagram, Grain } from '@/features/landing-page/components/tactic';

/**
 * Court-ground header for the standalone Datenschutzerklärung — the same
 * signature band the Impressum and the Ratgeber Read register use (see
 * DESIGN.md): the handball court chalked behind the copy, the register set as
 * the coach's marker kicker, the H1 in Archivo chalk.
 *
 * The two badges are the two questions a Play Store reviewer and a coach both
 * arrive with: what happens to player data, and how current the policy is.
 */
export default function DatenschutzHeader() {
  const t = useTranslations('privacyPage.header');

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
            {t('pseudonymBadge')}
          </span>
          <span aria-hidden className='hidden h-1 w-1 rounded-full bg-chalk/30 sm:inline-block' />
          <span className='inline-flex items-center gap-2'>
            <CalendarClock className='h-4 w-4 text-primary' />
            {t('lastUpdated')}
          </span>
        </div>

        <nav aria-label={t('navLabel')} className='mt-8 flex flex-wrap gap-2.5'>
          <Link
            href='/impressum'
            title={t('imprintLink')}
            className='inline-flex items-center gap-2 rounded-lg border border-chalk/15 bg-chalk/[0.06] px-3.5 py-2 text-sm font-semibold text-chalk/85 transition-colors hover:border-chalk/30 hover:bg-chalk/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-court'>
            <FileText className='h-4 w-4 shrink-0 text-chalk/50' />
            {t('imprintLink')}
          </Link>
          <Link
            href='/agb'
            title={t('termsLink')}
            className='inline-flex items-center gap-2 rounded-lg border border-chalk/15 bg-chalk/[0.06] px-3.5 py-2 text-sm font-semibold text-chalk/85 transition-colors hover:border-chalk/30 hover:bg-chalk/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-court'>
            <FileText className='h-4 w-4 shrink-0 text-chalk/50' />
            {t('termsLink')}
          </Link>
        </nav>
      </div>
    </header>
  );
}
