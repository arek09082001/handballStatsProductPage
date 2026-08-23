import {
  BoardCard,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { STAT_GROUPS } from '../data/stats-content';

/**
 * The catalogue band: every handball statistic worth keeping, grouped by the
 * question it answers. Definition lists rather than bullet points, so the term
 * and its meaning stay paired for screen readers and for answer engines.
 * @returns A JSX element rendering the grouped metric catalogue on paper.
 */
export default function StatsCatalog() {
  return (
    <section
      id='kennzahlen'
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-6xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Der Überblick'
          title='Welche Handball-Statistiken es gibt'
          description='Fünf Gruppen, und jede beantwortet eine andere Frage. Wer alles auf einmal erfasst, hört nach vier Spieltagen auf – such dir eine Gruppe aus und bau von dort aus weiter.'
        />

        <div className='mt-12 grid gap-6 md:grid-cols-2'>
          {STAT_GROUPS.map((group, index) => (
            <BoardCard
              key={group.name}
              pin='magnet'
              pinColor={index % 2 === 0 ? 'marker' : 'opponent'}
              className='p-6 sm:p-7'>
              <h3 className='font-display text-xl font-bold tracking-tight text-ink'>
                {group.name}
              </h3>
              <p className='mt-2 text-[15px] leading-7 text-ink/70'>
                {group.intro}
              </p>
              <dl className='mt-5 flex flex-col gap-3'>
                {group.stats.map((stat) => (
                  <div key={stat.term} className='border-t border-ink/10 pt-3'>
                    <dt className='font-display text-[15px] font-bold tracking-tight text-ink'>
                      {stat.term}
                    </dt>
                    <dd className='mt-1 text-[15px] leading-6 text-ink/70'>
                      {stat.definition}
                    </dd>
                  </div>
                ))}
              </dl>
            </BoardCard>
          ))}
        </div>
      </div>
    </section>
  );
}
