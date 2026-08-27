import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  CourtDiagram,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { FEATURES, featurePath } from '../data/features';
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
  const upcoming = FEATURES.filter((feature) => feature.status === 'beta');
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
          kicker='Auf der Werkbank'
          title='Was gerade gebaut wird'
          description='Statix entsteht aus dem, was aus der Halle zurückkommt. Was noch nicht fertig ist, steht trotzdem hier — als das, was es ist.'
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
                Was schon geht, und was noch nicht
                <ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
              </span>
            </Link>
          ))}
        </div>

        <p className='mt-8 max-w-[62ch] text-[15px] leading-7 text-chalk/60'>
          Ihr wollt bei einer dieser Funktionen früh dabei sein und Rückmeldung
          geben?{' '}
          <Link
            href='/kontakt'
            className='font-semibold text-chalk underline underline-offset-4 transition-colors hover:text-primary'>
            Schreib uns
          </Link>{' '}
          — die Warteliste ist eine E-Mail.
        </p>
      </div>
    </section>
  );
}
