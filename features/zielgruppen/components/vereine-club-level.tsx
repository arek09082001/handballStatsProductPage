import {
  BarChart3,
  Building2,
  CalendarRange,
  KeyRound,
  Layers,
  Route,
  Sparkles,
  Users2,
} from 'lucide-react';
import {
  BoardCard,
  BoardScreenshot,
  CourtDiagram,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { CLUB_CAPABILITIES } from '../data/vereine-content';

/**
 * The club area, screen by screen — the band that has to make "eine Ebene über
 * allen Mannschaften" concrete rather than aspirational. It sits on the court
 * ground because it is the page's signature claim; the two audience pages
 * otherwise alternate paper bands.
 *
 * Icons are ordered to match `CLUB_CAPABILITIES` and carry no meaning of their
 * own — they are the card's fastener, not a taxonomy. Copy lives in the data
 * module so the visible text and the schema stay one source.
 * @returns A JSX element rendering the club-area band on the court ground.
 */
const ICONS = [
  Building2,
  Layers,
  Users2,
  BarChart3,
  Route,
  Sparkles,
  KeyRound,
  CalendarRange,
] as const;

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
          description='Die Trainer arbeiten weiter in ihrer eigenen Mannschaft. Darüber liegt eine Ebene, die es ohne Verein nicht gibt — und die niemand von Hand pflegt.'
        />

        <div className='mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {CLUB_CAPABILITIES.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];

            return (
              <BoardCard key={item.title} tone='court' pin='none' className='p-6'>
                <span className='flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary'>
                  <Icon className='size-5' />
                </span>
                <h3 className='mt-4 font-display text-lg font-bold tracking-tight text-chalk'>
                  {item.title}
                </h3>
                <p className='mt-2 text-[15px] leading-7 text-chalk/75'>{item.text}</p>
              </BoardCard>
            );
          })}
        </div>

        <div className='mt-14 grid gap-8 lg:grid-cols-2'>
          <BoardScreenshot
            src='/verein-auswertung.png'
            alt='Vereinsauswertung mit Kennzahlen aller Handball-Mannschaften eines Vereins'
            width={2560}
            height={2000}
            label='Die Auswertung des Vereins: jede Saison, jede Mannschaft nebeneinander'
            tone='court'
            pin='tape'
            sizes='(max-width: 1024px) 100vw, 45vw'
          />
          <BoardScreenshot
            src='/verein-spieler.png'
            alt='Vereinsweite Spielerliste aller Mannschaften eines Handballvereins'
            width={2560}
            height={2000}
            label='Alle Spielerinnen und Spieler des Vereins, über alle Kader hinweg'
            tone='court'
            pin='magnet'
            sizes='(max-width: 1024px) 100vw, 45vw'
          />
        </div>
      </div>
    </section>
  );
}
