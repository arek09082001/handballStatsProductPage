'use client';

import { useTranslations } from 'next-intl';
import { CLUB_CONFIG } from '@/lib/club-config';
import {
  BoardCard,
  CourtDiagram,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { externalLink, inlineLink } from '@/components/custom-ui/rich-text';
import {
  VEREINE_MAIL_ARGS,
  type ClubPrivacyPoint,
} from '../data/vereine-content';

/**
 * Data protection for a club board — the question that decides whether a club
 * rolls something out. Every statement here mirrors what already stands in the
 * AGB (§ 7, Auftragsverarbeitung nach Art. 28 DSGVO) and the privacy policy;
 * nothing is promised beyond that.
 *
 * One pinned note, not four cards. The four points are the answer to a single
 * question, and giving each its own box with the same shield icon in the corner
 * made a checklist look like a feature grid — four identical icons carry no
 * information the headings do not. As one note with four hanging entries it
 * reads the way the document it stands for reads.
 * @returns A JSX element rendering the data-protection band on the court ground.
 */
export default function VereinePrivacy() {
  const t = useTranslations('clubsPage.privacy');
  const points = t.raw('points') as ClubPrivacyPoint[];

  return (
    <section className='relative w-full overflow-hidden bg-court py-20 text-chalk md:py-28'>
      <CourtDiagram
        variant='full'
        aria-hidden
        className='pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-auto w-[94%] max-w-5xl text-chalk/[0.06]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          tone='court'
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
        />

        <BoardCard tone='court' pin='tape' className='mt-12 p-7 sm:p-9'>
          <ul className='flex flex-col gap-7'>
            {points.map((point) => (
              <li key={point.title}>
                <h3 className='font-display text-lg font-bold tracking-tight text-chalk'>
                  {point.title}
                </h3>
                <p className='mt-1.5 max-w-[58ch] text-[15px] leading-7 text-chalk/70'>
                  {point.text}
                </p>
              </li>
            ))}
          </ul>
        </BoardCard>

        <p className='mt-10 max-w-[60ch] text-base leading-7 text-chalk/75'>
          {t.rich('closing', {
            ...VEREINE_MAIL_ARGS,
            terms: inlineLink('/agb'),
            privacy: inlineLink('/datenschutz'),
            mail: externalLink(`mailto:${CLUB_CONFIG.email.main}`),
          })}
        </p>
      </div>
    </section>
  );
}
