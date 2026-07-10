'use client';

import { CalendarClock, ScrollText, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AgbHeader() {
  const t = useTranslations('agbPage.header');

  return (
    <section className='relative isolate w-full overflow-hidden border-b border-border/50 bg-slate-950 pb-12 pt-6 text-white md:py-12'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_12%_0%,rgba(59,130,246,0.25),transparent),radial-gradient(ellipse_40%_35%_at_92%_100%,rgba(16,185,129,0.16),transparent)]' />

      <div className='relative mx-auto max-w-7xl px-6 py-10 text-center sm:px-10 sm:py-16 md:text-left md:py-20'>
        <div className='mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/85 md:mx-0'>
          <ScrollText className='h-4 w-4' />
          {t('eyebrow')}
        </div>

        <h1 className='mx-auto mt-6 max-w-3xl text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl lg:mx-0 lg:text-5xl'>
          {t('title')}
        </h1>

        <p className='mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg md:mx-0'>
          {t('description')}
        </p>

        <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:items-center md:justify-start'>
          <div className='inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90'>
            <ShieldCheck className='h-4 w-4 text-emerald-300' />
            {t('transparencyBadge')}
          </div>
          <div className='inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90'>
            <CalendarClock className='h-4 w-4 text-sky-300' />
            {t('lastUpdated')}
          </div>
        </div>
      </div>
    </section>
  );
}
