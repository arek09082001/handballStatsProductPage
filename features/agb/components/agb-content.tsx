'use client';

import { ScrollText } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { CLUB_CONFIG } from '@/lib/club-config';

const SECTION_KEYS = [
  'scope',
  'subject',
  'registration',
  'availability',
  'pricing',
  'obligations',
  'dataProtection',
  'ai',
  'ipRights',
  'dataExport',
  'liability',
  'term',
  'withdrawal',
  'changes',
  'final',
] as const;

// Sections that carry an additional block of paragraphs after their bullet list.
const SECTIONS_WITH_AFTER = new Set(['subject', 'dataProtection']);

export default function AgbContent() {
  const t = useTranslations('agbPage');

  const contentClassName = 'min-w-0 break-words [overflow-wrap:anywhere]';
  const linkClassName =
    'text-primary underline break-all [overflow-wrap:anywhere] hover:no-underline';
  const firstSectionClassName =
    'w-full pt-2 md:rounded-xl md:border md:border-muted md:p-6 md:pt-6';
  const sectionClassName =
    'w-full border-t border-border/50 pt-6 md:rounded-xl md:border md:border-muted md:p-6 md:pt-6';

  return (
    <div
      className='flex w-full items-center justify-center bg-muted pb-12'
      data-download-section='agb'>
      <div className='w-full max-w-4xl px-6 sm:px-8'>
        <div className='flex flex-col gap-8 md:gap-6 md:overflow-hidden md:rounded-xl md:bg-background md:p-8 md:shadow-lg'>
          <h2 className='flex max-w-full flex-wrap items-center justify-center gap-2 text-center text-3xl font-bold text-primary [overflow-wrap:anywhere] md:justify-start md:text-left'>
            <div className='bg-primary rounded-full p-2'>
              <ScrollText className='text-primary-foreground' />
            </div>
            <span className='md:hidden'>{t('documentTitleShort')}</span>
            <span className='hidden md:inline'>{t('documentTitle')}</span>
          </h2>

          {/* Präambel */}
          <div className={firstSectionClassName}>
            <h2 className='mb-4 text-center text-xl font-semibold text-primary md:text-left'>
              {t('intro.title')}
            </h2>
            <p className={`mb-4 ${contentClassName}`}>{t('intro.paragraph1')}</p>
            <p className={`mb-4 ${contentClassName}`}>{t('intro.paragraph2')}</p>
            <p className='text-sm text-muted-foreground'>{t('intro.updatedAt')}</p>
          </div>

          {SECTION_KEYS.map(key => {
            const paragraphs = t.raw(`sections.${key}.paragraphs`) as string[];
            const items = t.raw(`sections.${key}.items`) as string[];
            const paragraphsAfter = SECTIONS_WITH_AFTER.has(key)
              ? (t.raw(`sections.${key}.paragraphsAfter`) as string[])
              : [];

            return (
              <div key={key} className={sectionClassName}>
                <h2 className='mb-4 text-center text-xl font-semibold text-primary md:text-left'>
                  {t(`sections.${key}.title`)}
                </h2>

                {paragraphs.map((paragraph, index) => (
                  <p key={index} className={`mb-4 ${contentClassName}`}>
                    {paragraph}
                  </p>
                ))}

                {/* Anbieterangaben in § 1 */}
                {key === 'scope' && (
                  <div className='mt-2 rounded-xl border border-border/60 bg-muted/50 p-5'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      {t('providerLabel')}
                    </p>
                    <div className={`mt-2 space-y-1 ${contentClassName}`}>
                      <p className='font-semibold text-foreground'>
                        {CLUB_CONFIG.fullName}
                      </p>
                      <p>{CLUB_CONFIG.legal.responsiblePerson}</p>
                      <p>{CLUB_CONFIG.address.careOf}</p>
                      <p>{CLUB_CONFIG.address.street}</p>
                      <p>
                        {CLUB_CONFIG.address.postalCode} {CLUB_CONFIG.address.city}
                      </p>
                      <p>{CLUB_CONFIG.address.country}</p>
                      <p className='pt-2'>
                        E-Mail:{' '}
                        <a
                          href={`mailto:${CLUB_CONFIG.email.main}`}
                          className={linkClassName}>
                          {CLUB_CONFIG.email.main}
                        </a>
                      </p>
                      <p>
                        Telefon:{' '}
                        <a
                          href={`tel:${CLUB_CONFIG.phone.main}`}
                          className='text-primary hover:underline'>
                          {CLUB_CONFIG.phone.main}
                        </a>
                      </p>
                    </div>
                  </div>
                )}

                {items.length > 0 && (
                  <ul className='list-disc space-y-2 pl-6'>
                    {items.map((item, index) => (
                      <li key={index} className={contentClassName}>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {paragraphsAfter.map((paragraph, index) => (
                  <p key={index} className={`mt-4 ${contentClassName}`}>
                    {paragraph}
                  </p>
                ))}

                {/* Verweis auf die Datenschutzerklärung in § 7 */}
                {key === 'dataProtection' && (
                  <p className={`mt-4 ${contentClassName}`}>
                    <Link href='/impressum' className={linkClassName}>
                      {t('privacyLinkLabel')}
                    </Link>
                  </p>
                )}

                {/* OS-Plattform-Link in § 15 */}
                {key === 'final' && (
                  <p className={`mt-2 ${contentClassName}`}>
                    <a
                      href='https://ec.europa.eu/consumers/odr/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className={linkClassName}>
                      {t('odrLinkLabel')}
                    </a>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
