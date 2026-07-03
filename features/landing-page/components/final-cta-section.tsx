'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';
import { CLUB_CONFIG } from '@/lib/club-config';
import HeroActionButton from './hero-action-button';
import DemoPreview from './demo-preview';

function scrollToNewsletter() {
  const target = document.getElementById('newsletter');
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.setTimeout(() => {
    document.getElementById('newsletter-email')?.focus();
  }, 450);
}

export default function FinalCTASection() {
  const t = useTranslations('productPage.finalCta');
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id='demo'
      className='w-full scroll-mt-24 bg-background py-20 md:py-24'>
      <div className='mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div
          ref={cardRef}
          className='relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f97316] via-[#fb8c3c] to-[#ea580c] px-6 py-12 shadow-[0_28px_80px_-40px_rgba(249,115,22,0.7)] sm:px-10 md:px-14 md:py-16'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.28),transparent_45%)]' />
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] bg-[length:18px_18px] opacity-30' />

          <div className='relative grid items-center gap-10 lg:grid-cols-2 lg:gap-14'>
            {/* Copy + actions */}
            <div className='text-center lg:text-left'>
              <span className='inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white ring-1 ring-white/25 backdrop-blur-sm'>
                <span className='relative flex size-2'>
                  <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80' />
                  <span className='relative inline-flex size-2 rounded-full bg-white' />
                </span>
                {t('badge')}
              </span>

              <h2 className='mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl'>
                {t('title')}
              </h2>
              <p className='mx-auto mt-4 max-w-xl text-base leading-7 text-white/90 sm:text-lg lg:mx-0'>
                {t('description')}
              </p>

              <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start'>
                <a
                  href={CLUB_CONFIG.website.demoUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group inline-flex h-14 w-full max-w-[300px] items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold tracking-[-0.02em] text-slate-950 shadow-[0_18px_34px_-18px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-[0_22px_40px_-18px_rgba(15,23,42,0.5)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#ea580c] sm:w-auto sm:min-w-[240px]'>
                  <Play className='size-4 fill-current' />
                  <span>{t('demoCta')}</span>
                  <ArrowUpRight className='size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                </a>
                <HeroActionButton
                  variant='secondary'
                  className='border-white/40 bg-white/10 text-white hover:border-white/60 hover:bg-white/20'
                  onClick={scrollToNewsletter}>
                  {t('primaryCta')}
                </HeroActionButton>
              </div>

              <p className='mt-5 text-sm text-white/85'>{t('note')}</p>
            </div>

            {/* Live demo preview */}
            <div className='relative'>
              <DemoPreview
                url={CLUB_CONFIG.website.demoUrlWithoutProtocol}
                liveLabel={t('previewLabel')}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
