'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Mail, MapPin, UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { trackDemoClick, trackRegisterClick } from '@/lib/analytics';
import { CLUB_CONFIG } from '@/lib/club-config';
import { siteLinkGroups } from '@/features/navigation';

/**
 * Bottom-bar links. `titleKey` points at `footerSection.titles`; without one
 * the link's own label doubles as its title.
 */
const legalLinks: { href: string; labelKey: string; titleKey?: string }[] = [
  { href: '/impressum', labelKey: 'impressum', titleKey: 'impressum' },
  // The privacy policy gets its own entry rather than sharing the imprint's:
  // it is the link a visitor (and a Play Store review) looks for by name.
  { href: '/datenschutz', labelKey: 'privacy', titleKey: 'privacy' },
  { href: '/agb', labelKey: 'agb', titleKey: 'agb' },
  { href: '/newsletter/unsubscribe', labelKey: 'newsletterUnsubscribe' },
];

const linkClassName =
  'block rounded-sm text-[13px] text-slate-300 transition-all duration-300 hover:translate-x-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-court';

/**
 * The site footer. Its columns render from `siteLinkGroups` — the same
 * taxonomy the mobile menu uses — so the two never drift apart and no column
 * grows into the seventeen-link run this used to be. Legal links sit in the
 * bottom bar, where visitors look for them.
 * @returns A JSX element rendering the footer.
 */
export default function Footer() {
  const t = useTranslations('footerSection');
  const tNav = useTranslations('navigationSection');

  return (
    <footer className='w-full bg-court text-white'>
      <div className='mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14'>
        <div className='grid gap-x-8 gap-y-12 border-b border-white/10 pb-10 lg:grid-cols-[1.1fr_2.9fr] lg:gap-x-16'>
          <div className='space-y-6'>
            <div className='space-y-4'>
              <Link
                href='/'
                title={CLUB_CONFIG.display.logoAlt}
                className='inline-flex items-center gap-3 rounded-sm transition-opacity duration-300 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-court'>
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
              </Link>

              <p className='max-w-[300px] text-[13px] leading-6 text-slate-300'>
                {t('description')}
              </p>
            </div>

            <Link
              href={CLUB_CONFIG.website.appUrl}
              target='_blank'
              rel='noopener noreferrer'
              title={t('registerCta')}
              onClick={() => trackRegisterClick('footer')}
              className='inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#f97316] px-5 text-sm font-semibold text-white shadow-[0_4px_16px_-4px_rgba(249,115,22,0.55)] ring-1 ring-orange-500/20 transition-all duration-200 hover:-translate-y-px hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-court active:translate-y-0 active:scale-95'>
              <UserPlus className='size-4 shrink-0' />
              {t('registerCta')}
            </Link>

            <div className='space-y-3 border-t border-white/10 pt-5'>
              <Link
                href={`mailto:${CLUB_CONFIG.email.main}`}
                title={`${t('titles.email')} ${CLUB_CONFIG.email.main}`}
                className='flex items-start gap-3 rounded-sm text-[13px] text-slate-300 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-court'>
                <Mail className='mt-0.5 size-4 shrink-0' />
                <span>
                  {t('titles.email')} {CLUB_CONFIG.email.main}
                </span>
              </Link>

              <Link
                href={CLUB_CONFIG.social.instagram.url}
                target='_blank'
                rel='noreferrer'
                title={`${t('contact.instagram')} ${CLUB_CONFIG.social.instagram.handle}`}
                className='flex items-start gap-3 rounded-sm text-[13px] text-slate-300 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-court'>
                <Instagram className='mt-0.5 size-4 shrink-0' />
                <span>
                  {t('contact.instagram')} {CLUB_CONFIG.social.instagram.handle}
                </span>
              </Link>

              <p className='flex items-start gap-3 text-[13px] text-slate-400'>
                <MapPin className='mt-0.5 size-4 shrink-0' />
                <span>{t('contact.location')}</span>
              </p>
            </div>
          </div>

          {/* Two columns already on the smallest phone: seventeen links in one
           * stack is the scroll this footer used to be. */}
          <div className='grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-4 sm:gap-x-8'>
            {siteLinkGroups.map((group) => (
              <div key={group.labelKey}>
                <p className='mb-4 font-display text-[13px] font-bold uppercase tracking-[0.08em] text-slate-400'>
                  {tNav(`groups.${group.labelKey}`)}
                </p>

                <div className='space-y-3'>
                  {group.items.map((link) => {
                    const label = link.label ?? tNav(`items.${link.labelKey}`);

                    return (
                      <Link
                        key={link.ident}
                        href={link.href}
                        title={label}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        // The only external entry is the live demo.
                        onClick={
                          link.external
                            ? () => trackDemoClick('footer')
                            : undefined
                        }
                        className={linkClassName}>
                        {link.external ? (
                          <span className='inline-flex items-center gap-2'>
                            <span className='size-1.5 shrink-0 animate-pulse rounded-full bg-[#f97316]' />
                            {label}
                          </span>
                        ) : (
                          label
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='flex flex-col items-center gap-4 pt-6 text-[13px] text-slate-400 sm:flex-row sm:justify-between'>
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>

          <div className='flex flex-wrap items-center justify-center gap-x-5 gap-y-2'>
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                title={
                  link.titleKey
                    ? t(`titles.${link.titleKey}`)
                    : t(`legal.${link.labelKey}`)
                }
                className='rounded-sm underline-offset-4 transition-colors duration-300 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-court'>
                {t(`legal.${link.labelKey}`)}
              </Link>
            ))}

            {/* Plain anchor, not `Link`: /llms.txt is a route handler, not a
             * page, so there is nothing for the client router to prefetch. The
             * link exists so crawlers and answer engines find the file at all —
             * it is otherwise only referenced from robots.txt. */}
            <a
              href='/llms.txt'
              title={t('titles.llmsTxt')}
              className='rounded-sm underline-offset-4 transition-colors duration-300 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-court'>
              {t('legal.llmsTxt')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
