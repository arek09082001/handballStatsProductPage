'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import ContactDialog from '@/components/custom-ui/contact-dialog';
import { heroFont } from '@/features/landing-page/components/hero-font';
import HeroActionButton from '@/features/landing-page/components/hero-action-button';

export default function ServicesHeroSection() {
  const t = useTranslations('servicesPage');

  return (
    <section className='relative isolate overflow-hidden bg-muted/35 pb-20 pt-20 md:pb-24 md:pt-32'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_10%_0%,hsl(var(--primary)/0.12),transparent),radial-gradient(ellipse_45%_35%_at_100%_100%,rgba(34,197,94,0.08),transparent)]' />
      <div className='relative mx-auto grid max-w-7xl gap-12 px-6 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center'>
        <div className='text-center lg:text-left'>
          <p className='text-xs font-semibold uppercase tracking-[0.22em] text-primary'>
            {t('hero.eyebrow')}
          </p>
          <h1 className={`mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-[-0.03em] text-foreground sm:text-5xl lg:mx-0 lg:text-6xl ${heroFont.className}`}>
            {t('hero.title')}
          </h1>
          <p className='mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg lg:mx-0'>
            {t('hero.description')}
          </p>
          <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:items-center lg:justify-start'>
            <ContactDialog
              defaultSubject={t('hero.primaryCta')}
              title={t('hero.primaryCta')}>
              <HeroActionButton className='bg-green-500 text-white shadow-none hover:bg-green-400'>
                {t('hero.primaryCta')}
              </HeroActionButton>
            </ContactDialog>
            <Link
              href='#service-overview'
              title={t('hero.secondaryCta')}
              className='inline-flex h-14 w-full max-w-[300px] items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 text-sm font-bold tracking-[-0.02em] text-slate-950 shadow-[0_14px_26px_-22px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 active:scale-[0.98] sm:w-auto sm:min-w-[300px]'>
              {t('hero.secondaryCta')}
            </Link>
          </div>
        </div>

        <div className='relative mx-auto w-full max-w-2xl'>
          <div className='absolute -left-6 top-10 hidden h-24 w-24 rounded-full bg-primary/15 blur-3xl sm:block' />
          <div className='absolute -bottom-6 right-6 hidden h-28 w-28 rounded-full bg-cyan-200/40 blur-3xl sm:block' />

          <div className='relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-3 shadow-[0_30px_80px_-38px_rgba(15,23,42,0.3)] backdrop-blur supports-[backdrop-filter]:bg-white/72 sm:p-4'>
            <div className='relative overflow-hidden rounded-[1.6rem] bg-slate-950/5'>
              <Image
                src='/leistungHero.png'
                alt={t('hero.title')}
                title={t('hero.title')}
                width={1200}
                height={900}
                className='h-full w-full object-cover'
                priority
              />
              <div className='pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/18 to-transparent' />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}