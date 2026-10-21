'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Grain, PlayerMagnet, SectionHeading } from './tactic';

interface Point {
  title: string;
  description: string;
}

/**
 * "Und dann noch" — one band for everything past the single game: tournaments
 * and the coaching staff. The live ticker left this band again for its own
 * (`live-ticker-section.tsx`, with a film); its old `#liveticker` anchor now
 * belongs to that section.
 *
 * These were three full bands (tournament, live ticker, collaboration) with six
 * screenshots between them, roughly three viewports of scroll a visitor had to
 * cross before reaching the decision. A coach browsing on a phone does not need
 * to be sold on the tournament table before registering — they need to know it
 * exists. So the three collapse into three ruled entries and keep the one
 * visual that actually earns its place: the ticker a parent sees in the stands.
 *
 * The old `#tournament` and `#collaboration` anchors are kept as
 * zero-height targets so links from the footer, the 404 page and anywhere off
 * site still land on the right band instead of the top of the page.
 */
export default function MoreSection() {
  const t = useTranslations('productPage.more');
  const points = t.raw('points') as Point[];

  return (
    <section
      id='mehr'
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper py-14 md:py-24'>
      {/* Legacy anchors — the bands this one replaced. */}
      <span id='tournament' aria-hidden className='block scroll-mt-24' />
      <span id='collaboration' aria-hidden className='block scroll-mt-24' />

      <Grain tone='paper' />
      <div className='relative mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div>
          <div>
            <SectionHeading
              align='left'
              kicker={t('kicker')}
              title={t('title')}
              description={t('description')}
            />

            <div className='mt-10 grid gap-x-12 md:grid-cols-2'>
              {points.map((point, index) => (
                <div
                  key={point.title}
                  data-more-row
                  className='flex items-start gap-4 border-t border-ink/10 py-5'>
                  <PlayerMagnet number={index + 1} team='home' size='md' className='shrink-0' />
                  <div>
                    <p className='font-display text-lg font-bold tracking-tight text-ink'>
                      {point.title}
                    </p>
                    <p className='mt-1 max-w-[58ch] text-sm leading-7 text-ink/70'>
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href='/funktionen'
              title={t('linkTitle')}
              className='board-detail-link group mt-6 inline-flex items-center gap-2 font-display text-[15px] font-bold tracking-tight text-primary transition-colors hover:text-[#ea580c]'>
              {t('linkLabel')}
              <ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
