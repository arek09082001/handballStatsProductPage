import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq from '@/components/custom-ui/board-faq';
import FreeHeader from '../components/free-header';
import FreeScope from '../components/free-scope';
import FreeDemo from '../components/free-demo';
import FreeWhy from '../components/free-why';
import FreeAlternatives from '../components/free-alternatives';
import { FREE_FAQS } from '../data/free-content';

/**
 * Free-tier page `/handball-statistik-app-kostenlos`. Answers "gibt es eine
 * kostenlose Handball-Statistik-App?" in the hero, then the honest scope table,
 * the no-account demo, why a free version exists at all, and the other free
 * options. `/preise` answers the sibling question ("was kostet es") — the two
 * cross-link instead of repeating each other.
 * @returns A JSX element composing the ordered free-tier sections.
 */
export default function KostenlosPage() {
  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <FreeHeader />
      <FreeScope />
      <FreeDemo />
      <FreeWhy />
      <FreeAlternatives />
      <BoardFaq
        id='faq'
        kicker='Nachgefragt'
        title='Häufige Fragen zur kostenlosen Nutzung'
        description='Was Trainer wissen wollen, bevor sie ihr erstes Spiel erfassen.'
        items={FREE_FAQS}
      />
      <BoardCta
        kicker='Ohne Anmeldung'
        title='Zwei Minuten, kein Konto'
        description='Die Live-Demo läuft mit echten Spieldaten direkt im Browser. Danach weißt du, ob Statix zu deiner Mannschaft passt – ohne eine einzige Angabe von dir.'
        secondaryHref='/preise'
        secondaryLabel='Was Statix kostet'
      />
    </div>
  );
}
