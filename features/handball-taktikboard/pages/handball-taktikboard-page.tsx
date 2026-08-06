import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq from '@/components/custom-ui/board-faq';
import TaktikboardHeader from '../components/taktikboard-header';
import TaktikboardHowto from '../components/taktikboard-howto';
import TaktikboardCourt from '../components/taktikboard-court';
import TaktikboardFormations from '../components/taktikboard-formations';
import TaktikboardLimits from '../components/taktikboard-limits';
import TaktikboardEmbed from '../components/taktikboard-embed';
import { TAKTIKBOARD_FAQS } from '../data/taktikboard-content';

/**
 * Tool page `/handball-taktikboard`. The board sits above the fold; everything
 * below it — the steps, the court measurements, the formations and the limits —
 * answers the same query for a visitor who never drags a magnet, and renders
 * without JavaScript.
 * @returns A JSX element composing the ordered tactic-board sections.
 */
export default function HandballTaktikboardPage() {
  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <TaktikboardHeader />
      <TaktikboardHowto />
      <TaktikboardCourt />
      <TaktikboardFormations />
      <TaktikboardLimits />
      <TaktikboardEmbed />
      <BoardFaq
        id='faq'
        kicker='Nachgefragt'
        title='Häufige Fragen zum Taktikboard'
        description='Kurze Antworten auf das, was beim Zeichnen und Teilen aufkommt.'
        items={TAKTIKBOARD_FAQS}
      />
      <BoardCta
        kicker='Nach dem Zeichnen'
        title='Ob der Zug funktioniert hat, zeigen die Zahlen'
        description='In Statix erfasst du jede Aktion live per Tap und siehst nach dem Spiel, aus welchen Situationen eure Tore fallen – inklusive Wurfbild. Kostenlos registrieren, oder vorher in der Live-Demo ohne Account reinschauen.'
        linkHref='/wurfquote-rechner'
        linkLabel='Oder zuerst die Wurfquote ausrechnen'
      />
    </div>
  );
}
