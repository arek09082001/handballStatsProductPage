import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  BoardCard,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { cn } from '@/lib/utils';
import {
  FEATURE_GROUPS,
  featureLabel,
  featurePath,
  featuresOfGroup,
} from '../data/features';
import FeatureStatusBadge from './feature-status-badge';

/**
 * The index itself: four groups, every feature a note pinned to the board.
 *
 * Ordered the way a season asks its questions — erfassen, auswerten,
 * organisieren, teilen — rather than alphabetically or by how impressive a
 * feature is. A coach arrives with a question ("kann das Trainingsbeteiligung?")
 * and the grouping is what turns fifteen entries into one glance.
 *
 * The bands alternate paper and paper panel so the four groups read as four
 * blocks without a heading rule doing all the work.
 * @returns A JSX element rendering every feature, grouped, on the paper grounds.
 */
export default function FeatureIndexGroups() {
  return (
    <>
      {FEATURE_GROUPS.map((group, index) => {
        const features = featuresOfGroup(group.id);
        const onPanel = index % 2 === 1;

        return (
          <section
            key={group.id}
            id={group.id}
            className={cn(
              'relative w-full scroll-mt-24 overflow-hidden py-18 md:py-22',
              onPanel ? 'bg-paper-2' : 'bg-paper',
            )}>
            <Grain tone='paper' />

            <div className='relative mx-auto w-full max-w-7xl px-6 py-2 sm:px-10'>
              <SectionHeading
                align='left'
                kicker={`${index + 1} von ${FEATURE_GROUPS.length}`}
                title={group.name}
                description={group.intro}
              />

              <div className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {features.map((feature) => (
                  <BoardCard
                    key={feature.slug}
                    tone='paper'
                    pin='magnet'
                    pinColor={feature.status === 'live' ? 'marker' : 'opponent'}
                    className='group transition-transform duration-200 hover:-translate-y-0.5'>
                    <Link
                      href={featurePath(feature.slug)}
                      className='flex h-full flex-col gap-3 p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'>
                      <FeatureStatusBadge
                        status={feature.status}
                        className='self-start'
                      />
                      <h3 className='font-display text-xl font-bold tracking-[-0.015em] text-ink'>
                        {featureLabel(feature)}
                      </h3>
                      <p className='text-[15px] leading-7 text-ink/70'>
                        {feature.summary}
                      </p>
                      <span className='mt-auto inline-flex items-center gap-1.5 pt-2 font-display text-[15px] font-bold tracking-tight text-primary'>
                        Zur Funktion
                        <ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                      </span>
                    </Link>
                  </BoardCard>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
