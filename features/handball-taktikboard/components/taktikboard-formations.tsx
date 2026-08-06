import Link from 'next/link';
import { BoardCard, Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import { FORMATION_NOTES } from '../data/taktikboard-content';

/**
 * "Die fertigen Aufstellungen" — one paragraph per preset, each pointing at the
 * Ratgeber article that explains the system properly. A board shows an
 * arrangement; it does not explain when to use it.
 * @returns A JSX element rendering the formation notes on the paper ground.
 */
export default function TaktikboardFormations() {
  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-5xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Nicht bei null anfangen'
          title='Die fertigen Aufstellungen'
          description='Fünf Systeme liegen im Board bereit. Du lädst eins, schiebst zwei Magnete an eure Gegebenheiten und bist fertig – statt dreizehn Kreise von Hand zu setzen.'
        />

        <div className='mt-10 grid gap-5 md:grid-cols-2'>
          {FORMATION_NOTES.map((note, index) => (
            <BoardCard
              key={note.id}
              pin='none'
              className={
                // An odd count leaves the last note alone in a two-column row;
                // let it run the full width instead of hanging half-empty.
                index === FORMATION_NOTES.length - 1 && FORMATION_NOTES.length % 2 === 1
                  ? 'p-6 md:col-span-2'
                  : 'p-6'
              }>
              <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
                {note.title}
              </h3>
              <p className='mt-2 text-[15px] leading-7 text-ink/75'>{note.text}</p>
              <Link
                href={note.articleHref}
                className='mt-2 inline-flex min-h-11 items-center text-[15px] font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
                {note.articleLabel}
              </Link>
            </BoardCard>
          ))}
        </div>

        <p className='mt-10 max-w-[70ch] text-base leading-7 text-ink/70'>
          Welches System zu eurer Mannschaft passt, entscheidet nicht das Board,
          sondern euer Kader. Der Vergleich der drei gängigen Abwehrformationen
          steht im Ratgeber:{' '}
          <Link
            href='/ratgeber/handball-abwehrsysteme'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Abwehrsysteme im Handball: 6:0, 5:1 und 3:2:1 im Vergleich
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
