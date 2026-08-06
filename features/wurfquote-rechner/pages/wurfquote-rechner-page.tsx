import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq from '@/components/custom-ui/board-faq';
import CalculatorHeader from '../components/calculator-header';
import CalculatorFormula from '../components/calculator-formula';
import CalculatorExample from '../components/calculator-example';
import CalculatorBenchmarks from '../components/calculator-benchmarks';
import CalculatorLimits from '../components/calculator-limits';
import CalculatorEmbed from '../components/calculator-embed';
import { CALCULATOR_FAQS } from '../data/calculator-content';

/**
 * Calculator page `/wurfquote-rechner`. The tool sits above the fold; the
 * formula, the worked example and the position benchmarks below it answer the
 * same query for readers who never touch an input field.
 * @returns A JSX element composing the ordered calculator-page sections.
 */
export default function WurfquoteRechnerPage() {
  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <CalculatorHeader />
      <CalculatorFormula />
      <CalculatorExample />
      <CalculatorBenchmarks />
      <CalculatorLimits />
      <CalculatorEmbed />
      <BoardFaq
        id='faq'
        kicker='Nachgefragt'
        title='Häufige Fragen zur Wurfquote'
        description='Kurze Antworten auf die Fragen, die beim Rechnen aufkommen.'
        items={CALCULATOR_FAQS}
      />
      <BoardCta
        kicker='Statt Kopfrechnen'
        title='Quoten, die sich selbst ausrechnen'
        description='In Statix entsteht die Wurfquote beim Tippen – pro Spieler, pro Position, dazu das Wurfbild. In der Live-Demo siehst du es mit echten Spieldaten, ohne Account.'
        secondaryHref='/#newsletter'
        secondaryLabel='Launch-Angebot sichern'
      />
    </div>
  );
}
