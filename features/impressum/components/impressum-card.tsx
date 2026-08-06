'use client';

import { Mail, MapPin, Phone, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CLUB_CONFIG } from '@/lib/club-config';
import { BoardCard, BoardKicker, Grain, MarkerUnderline } from '@/features/landing-page/components/tactic';

/**
 * The Impressum block on the paper ground — the mandatory § 5 DDG details set as
 * a single note pinned to the tactic board. Ink text, an Archivo heading with a
 * marker swipe, restrained icons (no orange-filled circles), warm paper texture.
 * Follows the Trainertafel Read register (see DESIGN.md).
 */
export default function ImpressumCard() {
  const t = useTranslations('legalPage.impressum');
  const wrap = 'min-w-0 break-words [overflow-wrap:anywhere]';
  const fieldLabel = 'text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/45';

  return (
    <section
      id='impressum'
      data-download-section='impressum'
      className='relative w-full overflow-hidden bg-paper scroll-mt-24'>
      <Grain tone='paper' />

      <div className='relative mx-auto max-w-3xl px-6 py-14 sm:px-8 md:py-20'>
        <BoardKicker color='marker'>{t('eyebrow')}</BoardKicker>
        <h2 className='mt-3 font-display text-[1.9rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.2rem]'>
          <span className='relative inline-block'>
            {t('title')}
            <MarkerUnderline color='marker' />
          </span>
        </h2>

        <BoardCard tone='paper' pin='magnet' pinColor='marker' className='mt-8 p-6 sm:p-8'>
          <div className='grid gap-8 sm:grid-cols-2 sm:gap-10'>
            {/* Anbieter + Anschrift */}
            <div className='space-y-7'>
              <div>
                <p className={fieldLabel}>{t('providerLabel')}</p>
                <div className='mt-2 flex items-start gap-3'>
                  <UserRound className='mt-0.5 h-4 w-4 shrink-0 text-ink/40' />
                  <div className={wrap}>
                    <p className='font-display text-lg font-bold tracking-tight text-ink'>
                      {CLUB_CONFIG.fullName}
                    </p>
                    <p className='mt-0.5 text-base text-ink'>
                      {CLUB_CONFIG.legal.responsiblePerson}
                    </p>
                    <p className='text-sm text-ink/60'>{CLUB_CONFIG.legal.position}</p>
                  </div>
                </div>
              </div>

              <div className='border-t border-ink/10 pt-5'>
                <p className={fieldLabel}>{t('addressLabel')}</p>
                <div className='mt-2 flex items-start gap-3'>
                  <MapPin className='mt-0.5 h-4 w-4 shrink-0 text-ink/40' />
                  <div className={`space-y-0.5 text-base leading-7 text-ink ${wrap}`}>
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

            {/* Kontakt + Verantwortlichkeit */}
            <div className='space-y-7 sm:border-l sm:border-ink/10 sm:pl-10'>
              <div>
                <p className={fieldLabel}>{t('contactLabel')}</p>
                <div className='mt-2'>
                  <p className='text-sm font-semibold text-ink'>
                    {t('contentResponsibilityLabel')}
                  </p>
                  <p className='mt-0.5 text-base text-ink'>
                    {CLUB_CONFIG.legal.responsiblePerson}
                  </p>
                </div>
              </div>

              <div className={`space-y-3 border-t border-ink/10 pt-5 ${wrap}`}>
                <a
                  href={`mailto:${CLUB_CONFIG.email.main}`}
                  className='group inline-flex items-center gap-3 text-base text-ink transition-colors hover:text-primary'>
                  <Mail className='h-4 w-4 shrink-0 text-primary' />
                  <span className='break-all [overflow-wrap:anywhere]'>
                    {CLUB_CONFIG.email.main}
                  </span>
                </a>
                <a
                  href={`tel:${CLUB_CONFIG.phone.main}`}
                  className='group inline-flex items-center gap-3 text-base text-ink transition-colors hover:text-primary'>
                  <Phone className='h-4 w-4 shrink-0 text-primary' />
                  {CLUB_CONFIG.phone.main}
                </a>
              </div>
            </div>
          </div>
        </BoardCard>
      </div>
    </section>
  );
}
