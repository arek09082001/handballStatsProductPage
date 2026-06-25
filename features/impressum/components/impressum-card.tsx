'use client';

import { Gavel, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CLUB_CONFIG } from '@/lib/club-config';

export default function ImpressumCard() {
  const t = useTranslations('legalPage.impressum');
  const contentClassName = 'min-w-0 break-words [overflow-wrap:anywhere]';

  return (
    <div
      className='flex w-full items-center justify-center bg-muted py-12'
      data-download-section='impressum'>
      <div className='w-full max-w-4xl px-6 sm:px-8'>
        <div className='flex flex-col gap-8 md:gap-6 md:rounded-2xl md:bg-background md:p-8 md:shadow-lg'>
          <h2 className='flex items-center justify-center gap-2 text-center text-2xl font-bold text-primary md:justify-start md:text-left'>
            <div className='bg-primary rounded-full p-2'>
              <Gavel className='text-primary-foreground' />
            </div>
            {t('title')}
          </h2>

          <div className='w-full pt-2 md:rounded-2xl md:border md:border-border/60 md:bg-muted/50 md:p-6'>
            <p className='text-center text-sm font-semibold uppercase tracking-[0.18em] text-primary md:text-left'>
              {t('eyebrow')}
            </p>
            <div className='mt-4 grid gap-6 md:grid-cols-[1.05fr_0.95fr]'>
              <div className={`space-y-4 ${contentClassName}`}>
                <div className='flex items-start gap-3'>
                  <div className='mt-0.5 rounded-full bg-primary/10 p-2 text-primary'>
                    <UserRound className='h-4 w-4' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>{t('providerLabel')}</p>
                    <p className='text-lg font-semibold text-foreground'>
                      {CLUB_CONFIG.fullName}
                    </p>
                    <p className='mt-1 text-base text-foreground'>
                      {CLUB_CONFIG.legal.responsiblePerson}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {CLUB_CONFIG.legal.position}
                    </p>
                  </div>
                </div>

                <div className='border-t border-border/50 pt-4 md:rounded-xl md:border-0 md:bg-background md:p-4 md:pt-4 md:shadow-sm'>
                  <p className='text-sm font-medium text-muted-foreground'>{t('addressLabel')}</p>
                  <div className='mt-3 flex items-start gap-3'>
                    <MapPin className='mt-0.5 h-4 w-4 shrink-0 text-primary' />
                    <div className='space-y-1 text-base text-foreground break-words [overflow-wrap:anywhere]'>
                      <p>{CLUB_CONFIG.fullName}</p>
                      <p>{CLUB_CONFIG.address.contactName}</p>
                      <p>{CLUB_CONFIG.address.careOf}</p>
                      <p>{CLUB_CONFIG.address.street}</p>
                      <p>
                        {CLUB_CONFIG.address.postalCode} {CLUB_CONFIG.address.city}
                      </p>
                      <p>{CLUB_CONFIG.address.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='border-t border-border/50 pt-5 md:rounded-xl md:border-0 md:bg-background md:p-5 md:pt-5 md:shadow-sm'>
                <p className='text-sm font-medium text-muted-foreground'>{t('contactLabel')}</p>
                <div className={`mt-4 space-y-4 ${contentClassName}`}>
                  <div>
                    <p className='text-base font-semibold text-foreground'>
                      {t('contentResponsibilityLabel')}
                    </p>
                    <p className='mt-1 text-base text-foreground'>
                      {CLUB_CONFIG.legal.responsiblePerson}
                    </p>
                  </div>

                  <div className='space-y-3 border-t border-border/60 pt-4'>
                    <div className='flex items-center gap-3'>
                      <Mail className='h-4 w-4 text-primary' />
                      <a
                        href={`mailto:${CLUB_CONFIG.email.main}`}
                        className='text-base text-foreground break-all [overflow-wrap:anywhere] transition-colors hover:text-primary'>
                        {CLUB_CONFIG.email.main}
                      </a>
                    </div>

                    <div className='flex items-center gap-3'>
                      <Phone className='h-4 w-4 text-primary' />
                      <a
                        href={`tel:${CLUB_CONFIG.phone.main}`}
                        className='text-base text-foreground transition-colors hover:text-primary'>
                        {CLUB_CONFIG.phone.main}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
