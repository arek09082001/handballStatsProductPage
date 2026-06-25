'use client';

import { Brain, Lightbulb, Rocket, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { heroFont } from '@/features/landing-page/components/hero-font';

const valueIcons = [Lightbulb, Brain, Users, Rocket];
const iconStyles = [
  'bg-blue-100 text-blue-600',
  'bg-amber-100 text-amber-600',
  'bg-emerald-100 text-emerald-600',
  'bg-orange-100 text-orange-600',
];

export default function CoreValuesSection() {
  const t = useTranslations('companyPage');

  const values = [
    {
      title: t('rework.coreValues.value1Title'),
      description: t('rework.coreValues.value1Description'),
    },
    {
      title: t('rework.coreValues.value2Title'),
      description: t('rework.coreValues.value2Description'),
    },
    {
      title: t('rework.coreValues.value3Title'),
      description: t('rework.coreValues.value3Description'),
    },
    {
      title: t('rework.coreValues.value4Title'),
      description: t('rework.coreValues.value4Description'),
    },
  ];

  return (
    <section id='werte' className='bg-[#ededed] py-20 md:py-24'>
      <div className='mx-auto max-w-7xl px-6 sm:px-10'>
        <h2 className={`text-center text-2xl font-semibold tracking-[-0.03em] text-black sm:text-3xl ${heroFont.className}`}>
          {t('rework.coreValues.title')}
        </h2>

        <div className='mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
          {values.map((value, index) => {
            const Icon = valueIcons[index];
            return (
              <article key={value.title} className='rounded-[1.7rem] bg-white/65 p-6'>
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${iconStyles[index]}`}>
                  <Icon className='h-6 w-6' />
                </div>
                <h3 className={`mt-6 text-lg font-semibold leading-snug tracking-[-0.02em] text-black ${heroFont.className}`}>
                  {value.title}
                </h3>
                <p className='mt-5 text-base leading-8 text-slate-600'>
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
