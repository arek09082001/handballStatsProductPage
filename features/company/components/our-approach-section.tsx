'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { heroFont } from '@/features/landing-page/components/hero-font';
import { SiNextdotjs, SiFigma, SiVercel, SiSupabase, SiReact, SiGithub } from 'react-icons/si';

export default function OurApproachSection() {
  const t = useTranslations('companyPage');

  const brands = [
    { name: 'nextjs', icon: SiNextdotjs },
    { name: 'figma', icon: SiFigma },
    { name: 'vercel', icon: SiVercel },
    { name: 'supabase', icon: SiSupabase },
    { name: 'react', icon: SiReact },
    { name: 'github', icon: SiGithub },
  ];

  return (
    <section id='arbeitsweise' className='bg-black py-20 text-white md:py-24'>
      <div className='mx-auto max-w-7xl px-6 sm:px-10'>
        <p className='text-center text-sm font-semibold uppercase tracking-[0.2em] text-white/55'>
          {t('rework.approach.eyebrow')}
        </p>
        <h2 className={`mx-auto mt-4 max-w-4xl text-center text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl ${heroFont.className}`}>
          {t('rework.approach.title')}
        </h2>

        <div className='mt-14 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center'>
          <div className='grid grid-cols-3 gap-6 self-center'>
            {brands.map(({ name, icon: Icon }) => (
              <div key={name} className='flex h-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] text-sm font-semibold uppercase tracking-[0.18em] text-white/70'>
                <Icon className='h-8 w-8 text-white/80' />
              </div>
            ))}
          </div>

          <div className='flex flex-col items-start justify-center'>
            <p className='max-w-2xl text-lg leading-9 text-white/75'>
              {t('rework.approach.description')}
            </p>
            <Link
              href='/leistungen'
              title={t('rework.approach.cta')}
              className='mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black transition-transform duration-200 hover:-translate-y-0.5'>
              {t('rework.approach.cta')}
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
