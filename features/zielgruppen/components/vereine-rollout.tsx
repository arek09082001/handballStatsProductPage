import {
  Grain,
  PlayerMagnet,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { ROLLOUT_STEPS } from '../data/vereine-content';

/**
 * How a club actually starts. The band exists because the club level is the one
 * part of Statix that is *not* self-service: a club is created by hand and its
 * administrators are appointed by hand, so a visitor who wants it needs to know
 * what happens after they write — otherwise "auf Anfrage" reads as a wall.
 *
 * The same four steps are emitted as `HowTo` by the route, so the visible text
 * and the schema stay one source.
 * @returns A JSX element rendering the rollout steps on the paper ground.
 */
export default function VereineRollout() {
  return (
    <section
      id='einfuehrung'
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-5xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Einführung'
          title='In vier Schritten im Verein'
          description='Kein Projekt, kein Stichtag, kein Datenimport. Ihr könnt mit zwei Mannschaften anfangen und den Rest nachziehen, wenn es passt.'
        />

        {/* No connecting arrow between the steps: in a two-column grid it can
            only point from one step to its right-hand neighbour, which is the
            wrong direction for half the sequence and reads as decoration. The
            numbered magnets carry the order. */}
        <ol className='mt-12 grid gap-8 sm:grid-cols-2'>
          {ROLLOUT_STEPS.map((step) => (
            <li key={step.number} className='flex items-start gap-4'>
              <PlayerMagnet number={step.number} size='md' className='mt-0.5 shrink-0' />
              <div>
                <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
                  {step.title}
                </h3>
                <p className='mt-1.5 max-w-[52ch] text-[15px] leading-7 text-ink/75'>
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
