import {
  Grain,
  PlayerMagnet,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { STAT_STEPS } from '../data/stats-content';

/**
 * The five steps from "ich zähle nichts" to a statistic that changes a
 * training session. Rendered as an ordered list with jersey magnets as the
 * numbers, and mirrored into `HowTo` schema by the route.
 * @returns A JSX element rendering the numbered how-to band on paper.
 */
export default function StatsHowTo() {
  return (
    <section
      id='anleitung'
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='In fünf Schritten'
          title='So führst du eine Handball-Statistik, die etwas ändert'
          description='Nicht mehr Zahlen sind das Ziel, sondern eine Entscheidung pro Spiel, die du ohne die Zahlen nicht getroffen hättest.'
        />

        <ol className='mt-12 flex flex-col'>
          {STAT_STEPS.map((step, index) => (
            <li
              key={step.title}
              className='flex items-start gap-4 border-t border-ink/10 py-6'>
              <PlayerMagnet
                number={index + 1}
                team='home'
                size='md'
                className='shrink-0'
              />
              <div>
                <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
                  {step.title}
                </h3>
                <p className='mt-1.5 max-w-[64ch] text-[15px] leading-7 text-ink/70'>
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
