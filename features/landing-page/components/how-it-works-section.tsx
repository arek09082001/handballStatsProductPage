'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';

interface Step {
  title: string;
  description: string;
}

export default function HowItWorksSection() {
  const t = useTranslations('productPage.how');
  const steps = t.raw('steps') as Step[];

  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
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
      id='how-it-works'
      ref={sectionRef}
      className='w-full scroll-mt-24 bg-muted/30 py-20 md:py-24'>
      <div className='mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-primary'>
            {t('eyebrow')}
          </p>
          <h2 className='mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
            {t('title')}
          </h2>
          <p className='mt-4 text-base leading-7 text-muted-foreground'>
            {t('description')}
          </p>
        </div>

        <div className='relative mt-14 grid gap-6 md:grid-cols-3'>
          {steps.map((step, index) => (
            <div
              key={step.title}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className='relative rounded-[1.4rem] border border-border bg-background px-7 py-8 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.5)]'>
              <div className='flex size-12 items-center justify-center rounded-2xl bg-primary text-lg font-black text-primary-foreground shadow-[0_14px_30px_-16px_hsl(var(--primary)/0.9)]'>
                {index + 1}
              </div>
              <h3 className='mt-5 text-xl font-bold tracking-tight text-foreground'>
                {step.title}
              </h3>
              <p className='mt-3 text-sm leading-7 text-muted-foreground'>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
