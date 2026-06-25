'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CLUB_CONFIG } from '@/lib/club-config';

export default function Footer() {
  const t = useTranslations('footerSection');

  const servicesLinks = [
    { href: '/leistungen#webdesign', label: t('services.webDesign') },
    { href: '/leistungen#entwicklung', label: t('services.development') },
    { href: '/leistungen#seo', label: t('services.localSeo') },
    { href: '/leistungen#wartung', label: t('services.maintenance') },
  ];

  const companyLinks = [
    { href: '/unternehmen#ueber-mich', label: t('company.about') },
    { href: '/unternehmen#werte', label: t('company.values') },
    { href: '/unternehmen#arbeitsweise', label: t('company.approach') },
  ];

  const resourceLinks = [
    {
      href: 'https://www.seobility.net/de/seocheck/',
      label: t('resources.seobility'),
    },
    {
      href: 'https://developers.google.com/search?hl=de',
      label: t('resources.googleSearchCentral'),
    },
    {
      href: 'https://www.w3.org/',
      label: t('resources.w3c'),
    },
  ];

  return (
    <footer className='w-full bg-[#0f172a] text-white'>
      <div className='mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12'>
        <div className='grid gap-10 border-b border-white/10 pb-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr_1fr] lg:gap-12'>
          <div className='space-y-5'>
            <div className='flex items-center gap-3'>
              <span className='relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#2563eb]'>
                <Image
                  src={CLUB_CONFIG.branding.logo.path}
                  alt={CLUB_CONFIG.display.logoAlt}
                  title={CLUB_CONFIG.display.logoAlt}
                  fill
                  sizes='32px'
                  className='object-contain p-1'
                />
              </span>
              <span className='text-base font-semibold tracking-[-0.03em] text-white'>
                {CLUB_CONFIG.name}
              </span>
            </div>

            <p className='max-w-[260px] text-[13px] leading-6 text-slate-300'>
              {t('description')}
            </p>
          </div>

          <div>
            <Link
              href={'/leistungen'}
              title={t('titles.servicesOverview')}>
              <p className='mb-4 text-sm font-semibold text-white'>{t('headings.services')}</p>
            </Link>
            <div className='space-y-3'>
              {servicesLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  title={item.label}
                  className='block rounded-sm text-[13px] text-slate-300 transition-all duration-300 hover:translate-x-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <Link
              href={'/unternehmen'}
              title={t('titles.companyOverview')}>
              <p className='mb-4 text-sm font-semibold text-white'>{t('headings.company')}</p>
            </Link>
            <div className='space-y-3'>
              {companyLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  title={item.label}
                  className='block rounded-sm text-[13px] text-slate-300 transition-all duration-300 hover:translate-x-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className='mb-4 text-sm font-semibold text-white'>{t('headings.resources')}</p>
            <div className='space-y-3'>
              {resourceLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target='_blank'
                  rel='noreferrer'
                  title={item.label}
                  className='block rounded-sm text-[13px] text-slate-300 transition-all duration-300 hover:translate-x-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className='mb-4 text-sm font-semibold text-white'>{t('headings.contact')}</p>
            <div className='space-y-4'>
              <Link
                href={`mailto:${CLUB_CONFIG.email.main}`}
                title={`${t('titles.email')} ${CLUB_CONFIG.email.main}`}
                className='flex items-start gap-3 rounded-sm text-[13px] text-slate-300 transition-all duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'>
                <Mail className='mt-0.5 size-4 shrink-0' />
                <span>{CLUB_CONFIG.email.main}</span>
              </Link>

              <div className='flex items-start gap-3 text-[13px] text-slate-300'>
                <Phone className='mt-0.5 size-4 shrink-0' />
                <span>{t('contact.projectCalls')}</span>
              </div>

              <div className='flex items-start gap-3 text-[13px] text-slate-300'>
                <MapPin className='mt-0.5 size-4 shrink-0' />
                <span>{t('contact.location')}</span>
              </div>

              <Link
                href={CLUB_CONFIG.social.instagram.url}
                target='_blank'
                rel='noreferrer'
                title={`${t('contact.instagram')} ${CLUB_CONFIG.social.instagram.handle}`}
                className='flex items-start gap-3 rounded-sm text-[13px] text-slate-300 transition-all duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'>
                <Instagram className='mt-0.5 size-4 shrink-0' />
                <span>
                  {t('contact.instagram')} {CLUB_CONFIG.social.instagram.handle}
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-4 pt-5 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between'>
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>

          <div className='flex items-center gap-5'>
            <Link
              href='/impressum'
              title={t('titles.impressum')}
              className='rounded-sm transition-colors duration-300 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'>
              {t('legal.impressumAndPrivacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
