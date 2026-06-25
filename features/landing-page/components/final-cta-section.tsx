'use client';

import { useEffect, useRef } from 'react';
import { Apple, Play } from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';
import HeroActionButton from './hero-action-button';

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
    <section ref={sectionRef} className='w-full bg-background py-12 md:py-24'>
      <div className='mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div
          ref={cardRef}
          className='relative overflow-hidden rounded-[1.75rem] bg-gradient-to-r from-[#f97316] via-[#fb8c3c] to-[#ea580c] px-7 py-12 text-center shadow-[0_28px_80px_-40px_rgba(249,115,22,0.7)] sm:px-10 md:px-14 md:py-16'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_45%)]' />
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] bg-[length:18px_18px] opacity-30' />

          <div className='relative mx-auto max-w-2xl'>
            <h2 className='text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl'>
              {t('title')}
            </h2>
            <p className='mx-auto mt-4 max-w-xl text-base leading-7 text-white/90 sm:text-lg'>
              {t('description')}
            </p>

            <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row'>
              <HeroActionButton
                variant='secondary'
                className='bg-white text-slate-950 hover:bg-slate-50'
                onClick={scrollToNewsletter}
                icon={<Apple className='size-4' />}>
                {t('primaryCta')}
              </HeroActionButton>
              <HeroActionButton
                variant='secondary'
                className='border-white/40 bg-white/10 text-white hover:bg-white/20'
                onClick={scrollToNewsletter}
                icon={<Play className='size-4' />}>
                {t('secondaryCta')}
              </HeroActionButton>
            </div>

            <p className='mt-5 text-sm text-white/85'>{t('note')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
