import {
  BoardKicker,
  CourtDiagram,
  Grain,
  MarkerUnderline,
} from '@/features/landing-page/components/tactic';
import WurfquoteCalculator from './wurfquote-calculator';

/**
 * Court hero with the calculator itself above the fold — the reason someone
 * lands here is to get a number, not to read an intro. The formula is stated in
 * the lede so it can be lifted as a snippet even before the tool is used.
 * @returns A JSX element rendering the hero with the calculator.
 */
export default function CalculatorHeader() {
  return (
    <header className='relative isolate w-full overflow-hidden bg-court text-chalk'>
      <CourtDiagram
        variant='goal'
        aria-hidden
        className='pointer-events-none absolute -left-[24%] top-1/2 h-[96%] w-auto -translate-y-1/2 text-chalk/[0.12] sm:-left-[16%] lg:-left-[10%]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 pb-16 pt-28 sm:px-10 lg:flex-row lg:items-start lg:gap-14 lg:pb-24 lg:pt-32'>
        <div className='w-full shrink-0 text-center lg:w-[46%] lg:text-left'>
          <BoardKicker color='chalk' className='justify-center lg:justify-start'>
            Kostenloser Rechner
          </BoardKicker>

          <h1 className='mt-5 font-display text-[2.4rem] font-extrabold leading-[1.03] tracking-[-0.035em] text-chalk sm:text-[3.1rem]'>
            Wurfquote{' '}
            <span className='relative inline-block text-primary'>
              berechnen
              <MarkerUnderline color='marker' />
            </span>
          </h1>

          <p className='mx-auto mt-6 max-w-[54ch] text-base leading-7 text-chalk/75 sm:text-lg sm:leading-8 lg:mx-0'>
            Tore durch Würfe, mal 100 – das ist die ganze Formel. Der Rechner
            nimmt dir das Kopfrechnen ab und sagt dir dazu, wie der Wert für die
            jeweilige Position einzuordnen ist. Ohne Anmeldung, auch für die
            eigene Vereinsseite.
          </p>
        </div>

        <div className='w-full lg:min-w-0 lg:flex-1'>
          <WurfquoteCalculator />
        </div>
      </div>
    </header>
  );
}
