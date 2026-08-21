import {
  BoardScreenshot,
  CourtDiagram,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { CLUB_CAPABILITIES } from '../data/vereine-content';

/**
 * The club area, screen by screen — the band that has to make "eine Ebene über
 * allen Mannschaften" concrete rather than aspirational.
 *
 * Written as the club's **team sheet**: a term column carrying the name the
 * club's own navigation uses, a line beside it, a chalk hairline between rows.
 * It replaced eight icon cards, which were wrong twice over — a grid of
 * identical icon-plus-heading-plus-paragraph cards is the generic scaffold this
 * world exists to refuse (DESIGN.md), and the icons carried no meaning that the
 * headings did not already carry. A list of screens is what this is, so it is
 * set as one, and it scans in the time a club actually gives a section.
 *
 * Semantically a description list: the term is the screen, the description is
 * what stands on it.
 * @returns A JSX element rendering the club-area band on the court ground.
 */
export default function VereineClubLevel() {
  return (
    <section
      id='vereinsbereich'
      className='relative w-full scroll-mt-24 overflow-hidden bg-court py-20 text-chalk md:py-28'>
      <CourtDiagram
        variant='full'
        aria-hidden
        className='pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-auto w-[96%] max-w-6xl -translate-y-1/2 text-chalk/[0.05]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto max-w-6xl px-6 sm:px-10'>
        <SectionHeading
          tone='court'
          align='left'
          kicker='Der Vereinsbereich'
          title='Alle Mannschaften auf einer Seite'
          description='Die Trainer arbeiten weiter in ihrer eigenen Mannschaft. Darüber liegt eine Ebene, die es ohne Verein nicht gibt und die niemand von Hand pflegt.'
        />

        <dl className='mt-12 border-b border-chalk/12'>
          {CLUB_CAPABILITIES.map((item) => (
            <div
              key={item.term}
              className='grid gap-1 border-t border-chalk/12 py-5 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] md:gap-8 md:py-6'>
              <dt className='font-display text-lg font-bold tracking-tight text-chalk'>
                {item.term}
              </dt>
              <dd className='max-w-[52ch] text-[15px] leading-7 text-chalk/70'>
                {item.text}
              </dd>
            </div>
          ))}
        </dl>

        <div className='mt-14 grid gap-8 lg:grid-cols-2'>
          <BoardScreenshot
            src='/verein-auswertung.png'
            alt='Vereinsauswertung mit Kennzahlen aller Handball-Mannschaften eines Vereins'
            width={2560}
            height={2000}
            label='Jede Saison, jede Mannschaft nebeneinander'
            tone='court'
            pin='tape'
            sizes='(max-width: 1024px) 100vw, 45vw'
          />
          <BoardScreenshot
            src='/verein-spieler.png'
            alt='Vereinsweite Spielerliste aller Mannschaften eines Handballvereins'
            width={2560}
            height={2000}
            label='Alle Spieler des Vereins, über alle Kader hinweg'
            tone='court'
            pin='magnet'
            sizes='(max-width: 1024px) 100vw, 45vw'
          />
        </div>
      </div>
    </section>
  );
}
