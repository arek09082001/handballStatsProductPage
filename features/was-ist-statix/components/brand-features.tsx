import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { APP_FEATURES } from '@/lib/seo';
import { FEATURES_PAGE_PATH } from '@/features/funktionen/data/features';
import FeatureStatusBadge from '@/features/funktionen/components/feature-status-badge';
import {
  CourtDiagram,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import Reveal from './reveal';

/**
 * The complete Statix feature set, chalked onto the court as a coach's spec
 * board — hairline rows with a ghost jersey numeral, no icon chrome. Generated
 * from the same `APP_FEATURES` list that feeds the SoftwareApplication schema
 * and llms.txt, so this page never drifts from the real feature set.
 *
 * Every row is a link into the feature's own page now. The list used to be the
 * end of the road: a visitor who read "Termine & Trainingsbeteiligung" here and
 * wanted to know what that looks like had nowhere left to go on the site.
 * @returns A JSX element rendering the full Statix feature index on the court ground.
 */
export default function BrandFeatures() {
  return (
    <section className='relative w-full overflow-hidden bg-court py-20 text-chalk md:py-28'>
      <CourtDiagram
        variant='goal'
        aria-hidden
        className='pointer-events-none absolute -right-[16%] top-1/2 h-[120%] w-auto -translate-y-1/2 text-chalk/[0.08] sm:-right-[9%] lg:-right-[3%]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto w-full max-w-6xl px-6 sm:px-10'>
        <Reveal>
          <SectionHeading
            kicker='Der volle Kader'
            title='Was kann Statix?'
            description='Alle Funktionen der Statix App auf einen Blick – von der Live-Erfassung bis zur KI-Analyse. Jede Zeile führt auf ihre eigene Seite.'
            tone='court'
          />
        </Reveal>

        <Reveal className='mt-14 grid gap-x-14 border-t border-chalk/15 sm:grid-cols-2'>
          {APP_FEATURES.map((feature, index) => (
            <Link
              key={feature.slug}
              href={feature.path}
              className='group flex gap-5 border-b border-chalk/12 py-6 transition-colors duration-200 hover:bg-chalk/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chalk/40'>
              <span
                aria-hidden
                className='shrink-0 font-display text-2xl font-extrabold leading-none tabular-nums text-primary/70'>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className='flex flex-wrap items-center gap-2.5 font-display text-lg font-bold tracking-[-0.01em] text-chalk'>
                  {feature.name}
                  {feature.status === 'live' ? null : (
                    <FeatureStatusBadge status={feature.status} tone='court' />
                  )}
                  <ArrowRight
                    aria-hidden
                    className='size-4 text-primary opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100'
                  />
                </h3>
                <p className='mt-2 text-sm leading-6 text-chalk/70'>
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </Reveal>

        <Reveal>
          <Link
            href={FEATURES_PAGE_PATH}
            className='group mt-10 inline-flex items-center gap-2 font-display text-[15px] font-bold tracking-tight text-primary transition-colors hover:text-[#fb923c]'>
            Zum Funktionsüberblick mit Screenshots
            <ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
