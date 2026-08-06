import { BoardCard, Grain, SectionHeading } from '@/features/landing-page/components/tactic';

/**
 * "Die Formel" — stated as plain text (not an image, not a canvas) so search
 * engines can lift it as a featured snippet, plus the two follow-up formulas a
 * coach asks for right after.
 * @returns A JSX element rendering the formula band on the paper ground.
 */
export default function CalculatorFormula() {
  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Kopfrechnen'
          title='Die Formel'
          description='Eine Zeile, die jeder Trainer im Kopf haben sollte.'
        />

        <BoardCard pin='magnet' className='mt-10 p-6 text-center sm:p-8'>
          <p className='font-display text-[1.5rem] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[2rem]'>
            Wurfquote (%) = Tore ÷ Würfe × 100
          </p>
        </BoardCard>

        <div className='mt-8 grid gap-4 sm:grid-cols-2'>
          <BoardCard pin='none' className='p-5'>
            <h3 className='font-display text-base font-bold tracking-tight text-ink'>
              Was als Wurf zählt
            </h3>
            <p className='mt-2 text-[15px] leading-7 text-ink/75'>
              Jeder echte Torabschluss: Tor, gehaltener Ball, Pfosten oder Latte
              und klarer Fehlwurf. Ein technischer Fehler ohne Abschluss zählt
              nicht mit – der senkt die Quote sonst zu Unrecht.
            </p>
          </BoardCard>
          <BoardCard pin='none' className='p-5'>
            <h3 className='font-display text-base font-bold tracking-tight text-ink'>
              Die Paradenquote daneben
            </h3>
            <p className='mt-2 text-[15px] leading-7 text-ink/75'>
              Für den Torwart gilt: Paradenquote (%) = Paraden ÷ (Paraden +
              Gegentore) × 100. Über 33 Prozent sind im Amateurbereich stark,
              über 40 Prozent herausragend.
            </p>
          </BoardCard>
        </div>
      </div>
    </section>
  );
}
