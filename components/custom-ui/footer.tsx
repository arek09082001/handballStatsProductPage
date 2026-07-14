'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Mail, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { trackDemoClick } from '@/lib/analytics';
import { CLUB_CONFIG } from '@/lib/club-config';

export default function Footer() {
  const t = useTranslations('footerSection');

  const productLinks: { href: string; label: string; external?: boolean }[] = [
    { href: CLUB_CONFIG.website.demoUrl, label: t('product.demo'), external: true },
    { href: '/#features', label: t('product.features') },
    { href: '/#how-it-works', label: t('product.how') },
    { href: '/ratgeber', label: t('product.ratgeber') },
    { href: '/#faq', label: t('product.faq') },
    { href: '/#newsletter', label: t('product.newsletter') },
    { href: '/#contact', label: t('product.contact') },
  ];

  return (
    <footer className='w-full bg-[#0b1220] text-white'>
      <div className='mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12'>
        <div className='grid gap-10 border-b border-white/10 pb-8 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr] lg:gap-12'>
          <div className='space-y-5'>
            <div className='flex items-center gap-3'>
              <span className='relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl'>
                <Image
                  src={CLUB_CONFIG.branding.logo.path}
                  alt={CLUB_CONFIG.display.logoAlt}
                  title={CLUB_CONFIG.display.logoAlt}
                  fill
                  sizes='36px'
                  className='object-contain p-1.5'
                />
              </span>
              <span className='text-base font-semibold tracking-[-0.03em] text-white'>
                {CLUB_CONFIG.name}
              </span>
            </div>

            <p className='max-w-[280px] text-[13px] leading-6 text-slate-300'>
              {t('description')}
            </p>
          </div>

          <div>
            <p className='mb-4 text-sm font-semibold text-white'>{t('headings.product')}</p>
            <div className='space-y-3'>
              {productLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  title={item.label}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  onClick={item.external ? () => trackDemoClick('footer') : undefined}
                  className='block rounded-sm text-[13px] text-slate-300 transition-all duration-300 hover:translate-x-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className='mb-4 text-sm font-semibold text-white'>{t('headings.legal')}</p>
            <div className='space-y-3'>
              <Link
                href='/impressum'
                title={t('titles.impressum')}
                className='block rounded-sm text-[13px] text-slate-300 transition-all duration-300 hover:translate-x-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'>
                {t('legal.impressumAndPrivacy')}
              </Link>
              <Link
                href='/agb'
                title={t('titles.agb')}
                className='block rounded-sm text-[13px] text-slate-300 transition-all duration-300 hover:translate-x-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'>
                {t('legal.agb')}
              </Link>
              <Link
                href='/newsletter/unsubscribe'
                title={t('legal.newsletterUnsubscribe')}
                className='block rounded-sm text-[13px] text-slate-300 transition-all duration-300 hover:translate-x-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'>
                {t('legal.newsletterUnsubscribe')}
              </Link>
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

        <div className='flex flex-col gap-4 pt-5 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-center'>
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}
