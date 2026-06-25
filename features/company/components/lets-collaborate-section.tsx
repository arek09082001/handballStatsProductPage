'use client';

import ContactDialog from '@/components/custom-ui/contact-dialog';
import { useTranslations } from 'next-intl';
import { heroFont } from '@/features/landing-page/components/hero-font';

export default function LetsCollaborateSection() {
  const t = useTranslations('companyPage');

  return (
    <section className='bg-[#ededed] py-20 md:py-24'>
      <div className='mx-auto max-w-5xl px-6 text-center sm:px-10'>
        <p className='text-sm font-medium text-black/70'>
          {t('rework.collaborate.eyebrow')}
        </p>
        <h2 className={`mx-auto mt-6 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.03em] text-black sm:text-4xl lg:text-5xl ${heroFont.className}`}>
          {t('rework.collaborate.title')}
        </h2>

        <ContactDialog
          defaultSubject={t('rework.collaborate.ctaSubject')}
          title={t('rework.collaborate.cta')}>
          <button
            type='button'
            className='mt-10 inline-flex h-12 items-center justify-center rounded-full bg-black px-8 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5'>
            {t('rework.collaborate.cta')}
          </button>
        </ContactDialog>
      </div>
    </section>
  );
}
