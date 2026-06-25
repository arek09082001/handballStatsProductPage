'use client';

import { useTranslations } from 'next-intl';
import ServiceDetailCard from './service-detail-card';

export default function ServicesDetailSections() {
  const t = useTranslations('servicesPage');

  const detailSections = [
    {
      id: 'webdesign',
      eyebrow: t('details.webdesign.eyebrow'),
      title: t('details.webdesign.title'),
      description: t('details.webdesign.description'),
      points: [
        t('details.webdesign.point1'),
        t('details.webdesign.point2'),
        t('details.webdesign.point3'),
      ],
      outcome: t('details.webdesign.outcome'),
      accent: 'from-blue-100 via-white to-blue-50',
      imageSrc: '/webdesignImage.png',
    },
    {
      id: 'entwicklung',
      eyebrow: t('details.development.eyebrow'),
      title: t('details.development.title'),
      description: t('details.development.description'),
      points: [
        t('details.development.point1'),
        t('details.development.point2'),
        t('details.development.point3'),
      ],
      outcome: t('details.development.outcome'),
      accent: 'from-emerald-100 via-white to-emerald-50',
      imageSrc: '/entwicklungImage.png',
    },
    {
      id: 'seo',
      eyebrow: t('details.seo.eyebrow'),
      title: t('details.seo.title'),
      description: t('details.seo.description'),
      points: [
        t('details.seo.point1'),
        t('details.seo.point2'),
        t('details.seo.point3'),
      ],
      outcome: t('details.seo.outcome'),
      accent: 'from-violet-100 via-white to-violet-50',
      imageSrc: '/seoImage.png',
    },
    {
      id: 'wartung',
      eyebrow: t('details.maintenance.eyebrow'),
      title: t('details.maintenance.title'),
      description: t('details.maintenance.description'),
      points: [
        t('details.maintenance.point1'),
        t('details.maintenance.point2'),
        t('details.maintenance.point3'),
      ],
      outcome: t('details.maintenance.outcome'),
      accent: 'from-orange-100 via-white to-orange-50',
      imageSrc: '/wartungImage.png',
    },
  ];

  return (
    <section className='pb-20 md:pb-24'>
      <div className='mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:px-10'>
        {detailSections.map((section, index) => (
          <ServiceDetailCard
            key={section.id}
            id={section.id}
            eyebrow={section.eyebrow}
            title={section.title}
            description={section.description}
            points={section.points}
            outcome={section.outcome}
            outcomeLabel={t('details.outcomeLabel')}
            accent={section.accent}
            imageSrc={section.imageSrc}
            reverse={index % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}