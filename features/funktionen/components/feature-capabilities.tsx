'use client';

import { useTranslations } from 'next-intl';
import {
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import type { Feature } from '../data/features';

/**
 * "Was noch dazugehört" — the rest of a feature's area as a list, for the one
 * feature that has grown an area around itself (`video-tagging`).
 *
 * A list and not a grid of cards: these are two dozen functions of very
 * different weight, and a card each would make "Vorlauf & Nachlauf" look as big
 * as the panorama stitch. Each group reads as a column of a scoresheet — the
 * group name over a heavy ink rule, one hairline row per function — the same
 * grammar as the "Kurz gesagt" panel and the limits band, so the page keeps one
 * way of listing things.
 *
 * It sits between the drawn bench and the screenshot band on purpose: the
 * reader learns what exists first, and the captures below then show several of
 * these functions (the library, the sent clips, the filter, the player's side)
 * rather than introducing them.
 * @returns A JSX element rendering the grouped capabilities on the paper ground, or nothing.
 */
export default function FeatureCapabilities({ feature }: { feature: Feature }) {
  const t = useTranslations('featuresPage.detail');
  const capabilities = feature.capabilities;
  if (!capabilities) return null;

  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-24'>
      <Grain tone='paper' />

      <div className='relative mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('capabilitiesKicker')}
          title={capabilities.title}
          description={capabilities.intro}
        />

        <div className='mt-12 grid gap-x-14 gap-y-14 md:grid-cols-2'>
          {capabilities.groups.map((group) => (
            <div key={group.name}>
              <h3 className='border-b-2 border-ink/80 pb-2.5 font-display text-xl font-extrabold tracking-[-0.02em] text-ink sm:text-[1.4rem]'>
                {group.name}
              </h3>
              <p className='mt-3 max-w-[56ch] text-[15px] leading-6 text-ink/60'>
                {group.intro}
              </p>

              <ul className='mt-3'>
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className='border-b border-ink/10 py-4 last:border-b-0'>
                    <p className='font-display text-base font-bold tracking-[-0.01em] text-ink'>
                      {item.name}
                    </p>
                    <p className='mt-1 max-w-[62ch] text-[15px] leading-6 text-ink/70'>
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
