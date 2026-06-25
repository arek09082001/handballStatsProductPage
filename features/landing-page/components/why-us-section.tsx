'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-config';
import { Users, TrendingUp, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface WhyUsCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function WhyUsSection() {
  const t = useTranslations('whyUsSection');
  const whyUsCards: WhyUsCard[] = [
    {
      icon: <Users className='h-8 w-8' />,
      title: t('card1Title'),
      description: t('card1Description'),
    },
    {
      icon: <TrendingUp className='h-8 w-8' />,
      title: t('card2Title'),
      description: t('card2Description'),
    },
    {
      icon: <Sparkles className='h-8 w-8' />,
      title: t('card3Title'),
      description: t('card3Description'),
    },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className='w-full bg-muted/30 py-20 md:py-24'>
      <div className='mx-auto w-full max-w-7xl px-6 sm:px-10'>
        {/* Header */}
        <div className='mx-auto max-w-2xl text-center'>
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-primary'>
            {t('eyebrow')}
          </p>
          <h2 className='mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
            {t('title')}
          </h2>
          <p className='mt-4 text-base leading-7 text-muted-foreground'>
            {t.rich('description', {
              roi: (chunks) => <span className='text-primary'>{chunks}</span>,
            })}
          </p>
        </div>

        {/* Cards Grid */}
        <div className='mt-14 grid gap-8 md:grid-cols-3'>
          {whyUsCards.map((card, index) => (
            <div
              key={card.title}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className='card-surface rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_62px_-38px_hsl(var(--primary)/0.45)]'>
              {/* Icon */}
              <div className='flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                {card.icon}
              </div>

              {/* Title */}
              <p className='mt-6 text-xl font-semibold text-foreground'>{card.title}</p>

              {/* Description */}
              <p className='mt-3 text-base leading-7 text-muted-foreground'>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
