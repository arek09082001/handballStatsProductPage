import Link from 'next/link';
import { BoardCard, Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import { FREE_ALTERNATIVES } from '../data/free-content';

/**
 * The three genuinely free options a coach weighs — including the two that
 * aren't ours, with their real strengths named. Hands off to the Excel template
 * page so the visitor gets something either way.
 * @returns A JSX element rendering the free-alternatives comparison on paper.
 */
export default function FreeAlternatives() {
  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-6xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Fair verglichen'
          title='Kostenlose Alternativen im Vergleich'
          description='Statix ist nicht die einzige Möglichkeit, ohne Geld an Handball-Statistiken zu kommen. Hier stehen alle drei nebeneinander.'
        />

        <div className='mt-12 grid gap-6 md:grid-cols-3'>
          {FREE_ALTERNATIVES.map((option, index) => (
            <BoardCard
              key={option.name}
              pin='magnet'
              pinColor={index === 2 ? 'marker' : 'opponent'}
              className='flex flex-col p-6'>
              <h3 className='font-display text-xl font-bold tracking-tight text-ink'>
                {option.name}
              </h3>
              <p className='mt-1 font-hand text-xl text-primary'>{option.cost}</p>
              <p className='mt-4 text-[15px] leading-7 text-ink/75'>
                <span className='font-semibold text-ink'>Dafür gut: </span>
                {option.good}
              </p>
              <p className='mt-3 text-[15px] leading-7 text-ink/75'>
                <span className='font-semibold text-ink'>Der Haken: </span>
                {option.bad}
              </p>
            </BoardCard>
          ))}
        </div>

        <p className='mt-10 max-w-[70ch] text-base leading-7 text-ink/70'>
          Wenn du bei der Tabelle bleiben willst, nimm eine, die schon rechnet:
          Unsere{' '}
          <Link
            href='/handball-statistik-excel-vorlage'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            kostenlose Handball-Statistik Excel-Vorlage
          </Link>{' '}
          bringt Kader, Spielprotokoll, Auswertung und Saisonblatt mit fertigen
          Formeln mit – Download ohne Anmeldung. Für eine einzelne Quote
          zwischendurch reicht der{' '}
          <Link
            href='/wurfquote-rechner'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Wurfquoten-Rechner
          </Link>
          , und im Ratgeber steht, wie du{' '}
          <Link
            href='/ratgeber/handball-statistik-fuehren'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            eine Handball-Statistik sauber führst
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
