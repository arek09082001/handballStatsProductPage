'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import type { VideoAnalysisCriterion } from '../data/video-analysis-content';

/**
 * "Was muss die Software können?" — the buying checklist for the commercial
 * half of the query ("handball videoanalyse software", "… app"). Written as
 * criteria a coach can hold any product against, not as a feature list of
 * ours; the route mirrors it into an `ItemList`.
 * @returns A JSX element rendering the six criteria as a ruled list on paper.
 */
export default function VideoChecklist() {
  const t = useTranslations('videoAnalysisPage.checklist');
  const items = t.raw('items') as VideoAnalysisCriterion[];

  return (
    <section
      id='software'
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-6xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
        />

        <ul className='mt-12 grid gap-x-10 md:grid-cols-2'>
          {items.map((item) => (
            <li
              key={item.title}
              className='flex items-start gap-4 border-t border-ink/10 py-6'>
              <span className='mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary'>
                <Check className='size-4' aria-hidden />
              </span>
              <div>
                <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
                  {item.title}
                </h3>
                <p className='mt-1.5 text-[15px] leading-7 text-ink/70'>
                  {item.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
