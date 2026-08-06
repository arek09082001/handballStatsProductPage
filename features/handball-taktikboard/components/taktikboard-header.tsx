import {
  BoardKicker,
  CourtDiagram,
  Grain,
  MarkerUnderline,
} from '@/features/landing-page/components/tactic';
import TaktikboardTool from './taktikboard-tool';

/**
 * Court hero with the board itself above the fold. Nobody arrives here to read
 * an introduction — they arrive to move magnets — so the heading block stays
 * short and the board gets the full width underneath it.
 * @returns A JSX element rendering the hero with the tactic board.
 */
export default function TaktikboardHeader() {
  return (
    <header className='relative isolate w-full overflow-hidden bg-court text-chalk'>
      <CourtDiagram
        variant='full'
        aria-hidden
        className='pointer-events-none absolute inset-x-0 top-0 mx-auto h-auto w-[130%] max-w-none text-chalk/[0.07] sm:w-full'
      />
      <Grain tone='court' />

      <div className='relative mx-auto w-full max-w-7xl px-4 pb-16 pt-24 sm:px-8 lg:pb-24 lg:pt-28'>
        <div className='max-w-2xl'>
          <BoardKicker color='chalk'>Kostenloses Werkzeug</BoardKicker>

          <h1 className='mt-4 font-display text-[2.4rem] font-extrabold leading-[1.03] tracking-[-0.035em] text-chalk sm:text-[3.1rem]'>
            Handball-
            <span className='relative inline-block text-primary'>
              Taktikboard
              <MarkerUnderline color='marker' />
            </span>
          </h1>

          <p className='mt-5 max-w-[58ch] text-base leading-7 text-chalk/75 sm:text-lg sm:leading-8'>
            Aufstellung ziehen, Laufwege einzeichnen, fertig – auf einem
            maßstabsgetreuen Feld mit Sechs- und Neunmeterlinie an der richtigen
            Stelle. Als Bild speichern oder als Link in die Mannschafts-Gruppe,
            ohne Anmeldung.
          </p>
        </div>

        <div className='mt-9 lg:mt-11'>
          <TaktikboardTool />
        </div>
      </div>
    </header>
  );
}
