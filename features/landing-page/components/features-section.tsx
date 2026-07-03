'use client';

import { useEffect, useRef } from 'react';
import {
  BarChart3,
  Gauge,
  Share2,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';

interface FeatureItem {
  title: string;
  description: string;
}

const ICONS = [Zap, BarChart3, Target, Users, Gauge, Share2, Trophy, Sparkles];

export default function FeaturesSection() {
  const t = useTranslations('productPage.features');
  const items = t.raw('items') as FeatureItem[];

  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
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
      id='features'
      ref={sectionRef}
      className='w-full scroll-mt-24 bg-background py-20 md:py-24'>
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

        <div className='mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
          {items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];

            return (
              <div
                key={item.title}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className='card-surface group rounded-[1.4rem] px-7 py-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_62px_-38px_hsl(var(--primary)/0.5)]'>
                <div className='flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground'>
                  <Icon className='size-6' />
                </div>
                <h3 className='mt-5 text-xl font-bold tracking-tight text-foreground'>
                  {item.title}
                </h3>
                <p className='mt-3 text-sm leading-7 text-muted-foreground'>
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
