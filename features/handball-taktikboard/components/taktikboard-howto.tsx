import {
  Grain,
  PlayerMagnet,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import {
  ARROW_KIND_OPTIONS,
  BOARD_STEPS,
  MAGNET_KIND_OPTIONS,
} from '../data/taktikboard-content';

/**
 * "So erstellst du eure Aufstellung" — the four steps plus the legend, written
 * so the page answers the query for a visitor who never touches the board (and
 * so it still reads with JavaScript switched off).
 * @returns A JSX element rendering the how-to band on the paper ground.
 */
export default function TaktikboardHowto() {
  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='In vier Schritten'
          title='So erstellst du eure Aufstellung'
          description='Das Board startet nicht leer, sondern mit einer 6:0-Abwehr gegen einen 3:3-Angriff. Von da an ist alles Ziehen und Tippen.'
        />

        <ol className='mt-10 space-y-7'>
          {BOARD_STEPS.map((step, index) => (
            <li key={step.title} className='flex gap-4 sm:gap-5'>
              <PlayerMagnet
                number={index + 1}
                team={index % 2 === 0 ? 'home' : 'away'}
                size='md'
                className='mt-0.5 shrink-0'
              />
              <div>
                <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
                  {step.title}
                </h3>
                <p className='mt-1.5 max-w-[64ch] text-[15px] leading-7 text-ink/75'>
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <h3 className='mt-14 font-display text-xl font-bold tracking-tight text-ink'>
          Was welche Farbe und welche Linie bedeutet
        </h3>
        <p className='mt-2 max-w-[64ch] text-[15px] leading-7 text-ink/75'>
          Die Zeichensprache ist die, die auf jeder Taktiktafel in der Halle
          hängt – damit ein Board auch ohne Erklärung lesbar ist.
        </p>

        <dl className='mt-6 grid gap-x-10 gap-y-3 sm:grid-cols-2'>
          {MAGNET_KIND_OPTIONS.map((option) => (
            <div key={option.kind} className='flex items-baseline gap-3 border-b border-ink/10 pb-3'>
              <dt className='min-w-20 font-display text-[15px] font-bold text-ink'>
                {option.label}
              </dt>
              <dd className='text-[15px] leading-7 text-ink/70'>
                {option.kind === 'home'
                  ? 'Orange – eure Mannschaft.'
                  : option.kind === 'away'
                    ? 'Blau – der Gegner.'
                    : option.kind === 'keeper'
                      ? 'Türkis – der Torwart, damit er sich nicht in der Kette verliert.'
                      : 'Der Ball, kleiner als ein Spieler.'}
              </dd>
            </div>
          ))}
          {ARROW_KIND_OPTIONS.map((option) => (
            <div key={option.kind} className='flex items-baseline gap-3 border-b border-ink/10 pb-3'>
              <dt className='min-w-20 font-display text-[15px] font-bold text-ink'>
                {option.label}
              </dt>
              <dd className='text-[15px] leading-7 text-ink/70'>{option.hint}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
