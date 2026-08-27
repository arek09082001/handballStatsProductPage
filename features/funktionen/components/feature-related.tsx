import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  BoardCard,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import {
  FEATURES_PAGE_PATH,
  featureLabel,
  featurePath,
  relatedFeatures,
  type Feature,
} from '../data/features';
import FeatureStatusBadge from './feature-status-badge';

/**
 * The three features that answer the next question, as notes pinned to the
 * board. Kept to hand-picked slugs rather than "others in this group": what a
 * coach reading about Termine wants next is the Kader, not the Turniermodus,
 * and the group is too coarse to know that.
 * @returns A JSX element rendering links to neighbouring features on the paper ground.
 */
export default function FeatureRelated({ feature }: { feature: Feature }) {
  const related = relatedFeatures(feature);
  if (related.length === 0) return null;

  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-24'>
      <Grain tone='paper' />

      <div className='relative mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Passt dazu'
          title='Und dann noch'
        />

        <div className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {related.map((entry) => (
            <BoardCard
              key={entry.slug}
              tone='paper'
              pin='magnet'
              className='group transition-transform duration-200 hover:-translate-y-0.5'>
              <Link
                href={featurePath(entry.slug)}
                className='flex h-full flex-col gap-3 p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'>
                <FeatureStatusBadge status={entry.status} className='self-start' />
                <h3 className='font-display text-lg font-bold tracking-[-0.01em] text-ink'>
                  {featureLabel(entry)}
                </h3>
                <p className='text-[15px] leading-7 text-ink/70'>{entry.tagline}</p>
                <span className='mt-auto inline-flex items-center gap-1.5 pt-2 font-display text-[15px] font-bold tracking-tight text-primary'>
                  Ansehen
                  <ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                </span>
              </Link>
            </BoardCard>
          ))}
        </div>

        <Link
          href={FEATURES_PAGE_PATH}
          className='group mt-9 inline-flex items-center gap-2 font-display text-[15px] font-bold tracking-tight text-primary transition-colors hover:text-[#ea580c]'>
          Alle Funktionen im Überblick
          <ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
        </Link>
      </div>
    </section>
  );
}
