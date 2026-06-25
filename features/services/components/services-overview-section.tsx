'use client';

import { Code2, LayoutTemplate, MapPinned, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ServiceOverviewCard from './service-overview-card';

export default function ServicesOverviewSection() {
  const t = useTranslations('servicesPage');

  const serviceCards = [
    {
      id: 'webdesign',
      title: t('cards.webdesign.title'),
      description: t('cards.webdesign.description'),
      icon: LayoutTemplate,
      iconClass: 'bg-blue-50 text-blue-600',
      surfaceClass: 'from-blue-50/80 via-white to-white',
      accentClass: 'bg-blue-500/10 text-blue-700',
    },
    {
      id: 'entwicklung',
      title: t('cards.development.title'),
      description: t('cards.development.description'),
      icon: Code2,
      iconClass: 'bg-emerald-50 text-emerald-600',
      surfaceClass: 'from-emerald-50/80 via-white to-white',
      accentClass: 'bg-emerald-500/10 text-emerald-700',
    },
    {
      id: 'seo',
      title: t('cards.seo.title'),
      description: t('cards.seo.description'),
      icon: MapPinned,
      iconClass: 'bg-violet-50 text-violet-600',
      surfaceClass: 'from-violet-50/80 via-white to-white',
      accentClass: 'bg-violet-500/10 text-violet-700',
    },
    {
      id: 'wartung',
      title: t('cards.maintenance.title'),
      description: t('cards.maintenance.description'),
      icon: Wrench,
      iconClass: 'bg-orange-50 text-orange-600',
      surfaceClass: 'from-orange-50/80 via-white to-white',
      accentClass: 'bg-orange-500/10 text-orange-700',
    },
  ];

  return (
    <section id='service-overview' className='py-18 md:py-20'>
      <div className='mx-auto max-w-7xl px-6 sm:px-10'>
        <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
          {serviceCards.map((card, index) => (
            <ServiceOverviewCard
              key={card.id}
              id={card.id}
              title={card.title}
              description={card.description}
              icon={card.icon}
              iconClass={card.iconClass}
              surfaceClass={card.surfaceClass}
              accentClass={card.accentClass}
              index={index}
              readMoreLabel={t('overview.readMore')}
            />
          ))}
        </div>
      </div>
    </section>
  );
}