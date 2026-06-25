'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { CircleHelp } from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';
import HeroActionButton from './hero-action-button';

export default function CommonQuestionsSection() {
  const t = useTranslations('commonQuestionsSection');
  const questionCards = [
    {
      title: t('q1Title'),
      description: t('q1Description'),
    },
    {
      title: t('q2Title'),
      description: t('q2Description'),
    },
    {
      title: t('q3Title'),
      description: t('q3Description'),
    },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const handleAnalysisClick = () => {
    window.dispatchEvent(
      new CustomEvent('landing-page:request-type', {
        detail: { requestType: 'analysis' },
      })
    );

    document.getElementById('final-cta-form')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    window.setTimeout(() => {
      document.getElementById('cta-name')?.focus();
    }, 450);
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bannerRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className='w-full bg-background py-20 md:py-24'>
      <div className='mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div
          ref={bannerRef}
          className='relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(135deg,#2563eb_0%,#3468f5_52%,#2563eb_100%)] px-7 py-8 text-white shadow-[0_20px_60px_rgba(37,99,235,0.28)] sm:px-9 md:px-12 md:py-10'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.16)_1px,transparent_0)] bg-[length:16px_16px] opacity-30' />
          <div className='relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
            <div className='max-w-2xl'>
              <p className='text-3xl font-bold tracking-tight sm:text-[2rem]'>
                {t('bannerTitle')}
              </p>
              <p className='mt-3 max-w-xl text-sm leading-7 text-white/85 sm:text-base'>
                {t('bannerDescription')}
              </p>
            </div>
            <HeroActionButton className='bg-green-500 text-white shadow-none hover:bg-green-400' onClick={handleAnalysisClick}>
              {t('bannerCta')}
            </HeroActionButton>
          </div>
        </div>

        <div
          ref={contentRef}
          className='mt-16 grid gap-12 lg:grid-cols-[0.95fr_1.25fr] lg:items-stretch lg:gap-14'>
          <div className='flex h-full flex-col'>
            <p className='text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary lg:text-left'>
              {t('eyebrow')}
            </p>
            <h2 className='mx-auto mt-3 max-w-md text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:mx-0 lg:text-left'>
              {t('title')}
            </h2>
            <p className='mx-auto mt-5 max-w-md text-center text-base leading-7 text-muted-foreground lg:mx-0 lg:text-left'>
              {t('description')}
            </p>

            <div className='relative mt-10 aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-muted lg:min-h-0 lg:flex-1 lg:aspect-auto'>
              <Image
                src='/commonQuestion.png'
                alt={t('imageAlt')}
                title={t('imageAlt')}
                fill
                sizes='(max-width: 1023px) 100vw, 40vw'
                className='object-cover grayscale'
              />
            </div>
          </div>

          <div className='space-y-4'>
            {questionCards.map((card, index) => (
              <div
                key={card.title}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className='card-surface rounded-3xl px-6 py-5'>
                <div className='flex items-start gap-4'>
                  <div className='mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground'>
                    <CircleHelp className='h-3.5 w-3.5' />
                  </div>

                  <div>
                    <p className='text-base font-bold leading-6 text-foreground'>
                      &quot;{card.title}&quot;
                    </p>
                    <p className='mt-3 text-sm leading-7 text-muted-foreground'>
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}