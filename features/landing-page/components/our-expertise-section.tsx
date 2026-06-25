'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowRight, Code2, PenTool, Search, ShieldCheck } from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';

export default function OurExpertiseSection() {
  const t = useTranslations('ourExpertiseSection');
  const expertiseCards = [
    {
      href: '/leistungen#webdesign',
      title: t('card1Title'),
      description: t('card1Description'),
      icon: PenTool,
      iconWrapClass: 'bg-blue-50 text-blue-600',
    },
    {
      href: '/leistungen#entwicklung',
      title: t('card2Title'),
      description: t('card2Description'),
      icon: Code2,
      iconWrapClass: 'bg-green-50 text-green-600',
    },
    {
      href: '/leistungen#seo',
      title: t('card3Title'),
      description: t('card3Description'),
      icon: Search,
      iconWrapClass: 'bg-violet-50 text-violet-600',
    },
    {
      href: '/leistungen#wartung',
      title: t('card4Title'),
      description: t('card4Description'),
      icon: ShieldCheck,
      iconWrapClass: 'bg-orange-50 text-orange-600',
    },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.12,
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
    <section ref={sectionRef} className='w-full bg-muted/25 py-20 md:py-24'>
      <div className='mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
          <div className='max-w-xl text-center md:text-left'>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-primary'>
              {t('eyebrow')}
            </p>
            <h2 className='mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-5xl'>
              {t('title')}
            </h2>
          </div>

          <Link
            href='/leistungen'
            title={t('viewAll')}
            className='inline-flex items-center gap-2 self-center text-sm font-semibold text-foreground transition-all duration-300 hover:gap-3 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 md:self-auto'>
            <span>{t('viewAll')}</span>
            <ArrowRight className='h-4 w-4' />
          </Link>
        </div>

        <div className='mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
          {expertiseCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                href={card.href}
                title={card.title}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className='card-surface group flex min-h-[250px] flex-col rounded-[1.4rem] px-6 py-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_62px_-38px_hsl(var(--primary)/0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2'>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconWrapClass}`}>
                  <Icon className='h-5 w-5' />
                </div>

                <p className='mt-6 text-xl font-bold tracking-tight text-foreground'>
                  {card.title}
                </p>
                <p className='mt-3 max-w-[17rem] text-sm leading-7 text-muted-foreground'>
                  {card.description}
                </p>

                <div className='mt-auto pt-8'>
                  <span className='inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:border-primary group-hover:text-primary'>
                    <ArrowRight className='h-4 w-4' />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}