import { APP_FEATURES } from '@/lib/seo';
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
            description='Alle Funktionen der Statix App auf einen Blick – von der Live-Erfassung bis zur KI-Analyse.'
            tone='court'
          />
        </Reveal>

        <Reveal className='mt-14 grid gap-x-14 border-t border-chalk/15 sm:grid-cols-2'>
          {APP_FEATURES.map((feature, index) => (
            <div
              key={feature.slug}
              className='flex gap-5 border-b border-chalk/12 py-6'>
              <span
                aria-hidden
                className='shrink-0 font-display text-2xl font-extrabold leading-none tabular-nums text-primary/70'>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className='font-display text-lg font-bold tracking-[-0.01em] text-chalk'>
                  {feature.name}
                </h3>
                <p className='mt-2 text-sm leading-6 text-chalk/70'>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
