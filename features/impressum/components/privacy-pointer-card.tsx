'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { BoardCard, Grain } from '@/features/landing-page/components/tactic';

/**
 * The Datenschutzerklärung used to be the second half of this page, which is
 * why `statix-app.de/impressum#datenschutz` is printed in the app, in the Play
 * Store listing and in older emails. The policy has its own page now, so this
 * card takes over the `datenschutz` anchor: anyone arriving on the old fragment
 * still lands on a block about privacy — one that hands them the real page
 * instead of a 404 or a silent scroll to nowhere.
 */
export default function PrivacyPointerCard() {
  const t = useTranslations('legalPage.privacyPointer');

  return (
    <section
      id='datenschutz'
      className='relative w-full overflow-hidden bg-paper pb-16 scroll-mt-24 sm:pb-20'>
      <Grain tone='paper' />

      <div className='relative mx-auto max-w-3xl px-6 sm:px-8'>
        <BoardCard tone='paper' pin='magnet' pinColor='marker' className='p-6 sm:p-8'>
          <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
            <div className='min-w-0'>
              <div className='flex items-center gap-2.5'>
                <ShieldCheck className='h-5 w-5 shrink-0 text-success' />
                <h2 className='font-display text-xl font-bold tracking-tight text-ink sm:text-2xl'>
                  {t('title')}
                </h2>
              </div>
              <p className='mt-3 text-[1.0625rem] leading-[1.7] text-ink/75'>
                {t('description')}
              </p>
            </div>

            <Link
              href='/datenschutz'
              title={t('cta')}
              className='inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:translate-y-0 active:scale-95'>
              {t('cta')}
              <ArrowRight className='h-4 w-4 shrink-0' />
            </Link>
          </div>
        </BoardCard>
      </div>
    </section>
  );
}
