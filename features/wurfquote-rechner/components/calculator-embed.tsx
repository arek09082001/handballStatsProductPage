import { Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import EmbedSnippet from './embed-snippet';

/**
 * "Rechner einbinden" — the calculator is free to reuse on club sites. Keeps
 * the exchange plain: their page gets a working tool, ours gets a link back.
 * @returns A JSX element rendering the embed instructions on the paper ground.
 */
export default function CalculatorEmbed() {
  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Für eure Homepage'
          title='Rechner auf der Vereinsseite einbinden'
          description='Kopier den Code, setz ihn auf eure Seite – fertig. Kostenlos, ohne Anmeldung, ohne Tracking-Skript.'
        />

        <div className='mt-10'>
          <EmbedSnippet />
        </div>

        <p className='mt-6 max-w-[68ch] text-base leading-7 text-ink/70'>
          Der eingebettete Rechner kann genau das, was er hier kann: Wurfquote
          ausrechnen, nach Position einordnen und die Zielquote rückwärts
          rechnen. Unter dem Rechner steht ein Hinweis „Wurfquoten-Rechner von
          Statix“ mit Link auf diese Seite – das ist die einzige Bedingung.
          Passt die Höhe nicht zu eurem Layout, ändert einfach den
          height-Wert im Code.
        </p>
      </div>
    </section>
  );
}
