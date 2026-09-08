'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  CourtDiagram,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { inlineLink } from '@/components/custom-ui/rich-text';
import { featurePath } from '../data/features';
import { useFeatures } from '../data/use-features';
import FeatureStatusBadge from './feature-status-badge';

/**
 * "Was gerade gebaut wird" — the band for everything not generally available.
 *
 * It is a band and not a footnote on purpose. Statix is built out of what comes
 * back from the hall, and the honest version of that is a page that says which
 * part is finished and which part is currently being built — including that the
 * unfinished part runs with a handful of teams and not with everybody.
 *
 * Renders nothing when every feature is `live`, so the band disappears by
 * itself once the beta ends instead of standing there as an empty promise.
 * @returns A JSX element rendering the in-progress features, or null.
 */
export default function FeatureIndexInProgress() {
  const t = useTranslations('featuresPage.inProgress');
  const upcoming = useFeatures().filter((feature) => feature.status === 'beta');
  if (upcoming.length === 0) return null;

  return (
    <section className='relative w-full overflow-hidden bg-court py-20 text-chalk md:py-24'>
      <CourtDiagram
        variant='goal'
        aria-hidden
        className='pointer-events-none absolute -left-[18%] top-1/2 h-[118%] w-auto -translate-y-1/2 text-chalk/[0.07] sm:-left-[10%] lg:-left-[4%]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto w-full max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
          tone='court'
        />

        <div className='mt-10 space-y-5'>
          {upcoming.map((feature) => (
            <Link
              key={feature.slug}
              href={featurePath(feature.slug)}
              className='board-shadow-court group block rounded-2xl border border-primary/25 bg-court-2 p-6 transition-colors duration-200 hover:border-primary/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:p-7'>
              <FeatureStatusBadge status={feature.status} tone='court' />
              <h3 className='mt-3 font-display text-xl font-bold tracking-[-0.015em] text-chalk sm:text-2xl'>
                {feature.name}
              </h3>
              <p className='mt-2.5 max-w-[62ch] text-[15px] leading-7 text-chalk/70'>
                {feature.tagline}
              </p>
              <span className='mt-4 inline-flex items-center gap-1.5 font-display text-[15px] font-bold tracking-tight text-primary'>
                {t('cardCta')}
                <ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
              </span>
            </Link>
          ))}
        </div>

        <p className='mt-8 max-w-[62ch] text-[15px] leading-7 text-chalk/60'>
          {t.rich('contact', {
            contact: inlineLink('/kontakt', 'court'),
          })}
        </p>
      </div>
    </section>
  );
}
