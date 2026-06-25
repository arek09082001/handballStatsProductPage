'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { heroFont } from '@/features/landing-page/components/hero-font';
import { CLUB_CONFIG } from '@/lib/club-config';

export default function CompanyHeroSection() {
  const t = useTranslations('companyPage');

  return (
    <section id='ueber-mich' className='bg-[#ededed] pb-16 pt-20 md:pb-24 md:pt-32'>
      <div className='mx-auto grid max-w-7xl gap-10 px-6 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center'>
        <div className='text-center lg:text-left'>
          <h1 className={`text-3xl font-extrabold leading-tight tracking-[-0.03em] text-black sm:text-4xl lg:text-5xl ${heroFont.className}`}>
            {t('rework.hero.title')}
          </h1>
          <p className='mx-auto mt-6 max-w-2xl text-base leading-8 text-black/70 sm:text-lg lg:mx-0'>
            {t('rework.hero.description')}
          </p>
        </div>

        <div className='relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] bg-black/5 p-3 sm:p-4'>
          <div className='overflow-hidden rounded-[1.6rem] bg-black'>
            <Image
              src='/arkadiusz_weiss.jpg'
              alt={t('rework.hero.imageAlt')}
              title={t('rework.hero.imageAlt')}
              width={700}
              height={900}
              className='h-full w-full object-cover'
              priority
            />
          </div>
          <p className='px-2 pb-1 pt-4 text-center text-sm font-medium tracking-[-0.01em] text-black/68'>
            {CLUB_CONFIG.shortName}
          </p>
        </div>
      </div>
    </section>
  );
}
