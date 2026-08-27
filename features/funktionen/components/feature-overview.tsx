import { BoardCard, Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import type { Feature } from '../data/features';

/**
 * The paper band under the hero: what the feature is, in prose, beside a
 * "Kurz gesagt" panel a coach can scan without reading the prose at all.
 *
 * The two are deliberately not the same content in two shapes. The paragraphs
 * carry the reasoning ("why it works this way"); the panel carries the facts
 * somebody checks before deciding whether to keep reading.
 * @returns A JSX element rendering the feature's overview on the paper ground.
 */
export default function FeatureOverview({ feature }: { feature: Feature }) {
  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-24'>
      <Grain tone='paper' />

      <div className='relative mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div className='grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16'>
          <div>
            <SectionHeading
              align='left'
              kicker='Worum es geht'
              title={feature.headline}
            />

            <div className='mt-8 space-y-5'>
              {feature.intro.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className='max-w-[68ch] text-base leading-8 text-ink/75'>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <BoardCard tone='paper' pin='magnet' className='h-fit p-6 sm:p-7'>
            <p className='font-hand text-2xl text-primary'>Kurz gesagt</p>
            <dl className='mt-5 border-t border-ink/12'>
              {feature.facts.map((fact) => (
                <div
                  key={fact.term}
                  className='flex flex-col gap-1 border-b border-ink/12 py-3.5'>
                  <dt className='text-[13px] font-semibold uppercase tracking-[0.06em] text-ink/45'>
                    {fact.term}
                  </dt>
                  <dd className='text-[15px] font-medium leading-6 text-ink'>
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </BoardCard>
        </div>
      </div>
    </section>
  );
}
