'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import {
  Grain,
  MarkerUnderline,
  SectionHeading,
} from '@/features/landing-page/components/tactic';

/**
 * The lead-in of each paragraph, set in the display face — it carries the claim
 * so the band still scans in a glance without borrowing card chrome to do it.
 */
function lead(chunks: ReactNode) {
  return <strong className='font-display font-bold text-ink'>{chunks}</strong>;
}

/**
 * Training, appointments and who shows up — the half of a club's week that has
 * nothing to do with match day and is nevertheless the reason a coach keeps
 * three tools open.
 *
 * Set as two columns of prose rather than four cards: the four points are one
 * argument (the calendar and the replies live where the games live), and
 * cutting it into four boxes with the same icon in each made it look like four
 * unrelated features.
 *
 * The claim is deliberately precise: every squad runs its schedule inside
 * Statix. There is no club-wide attendance rollup yet, so this band does not
 * promise one.
 * @returns A JSX element rendering the training band on the paper-2 ground.
 */
export default function VereineTraining() {
  const t = useTranslations('clubsPage.training');

  return (
    <section
      id='training'
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-5xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
        />

        <div className='mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2'>
          {(['paragraph1', 'paragraph2', 'paragraph3', 'paragraph4'] as const).map(
            (key) => (
              <p
                key={key}
                className='max-w-[54ch] text-[15px] leading-7 text-ink/75'>
                {t.rich(key, { lead })}
              </p>
            ),
          )}
        </div>

        <p className='mt-12 max-w-[60ch] text-base leading-7 text-ink/70'>
          {t.rich('closing', {
            mark: (chunks) => (
              <span className='relative inline-block font-semibold text-ink'>
                {chunks}
                <MarkerUnderline color='marker' />
              </span>
            ),
          })}
        </p>
      </div>
    </section>
  );
}
