import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq from '@/components/custom-ui/board-faq';
import StatsHeader from '../components/stats-header';
import StatsCatalog from '../components/stats-catalog';
import StatsFormulas from '../components/stats-formulas';
import StatsWays from '../components/stats-ways';
import StatsHowTo from '../components/stats-howto';
import StatsGuides from '../components/stats-guides';
import { STATS_FAQS } from '../data/stats-content';

/**
 * Pillar page `/handball-statistiken` — the topic hub for the head term. It
 * answers the informational question first (which statistics exist, how they
 * are calculated, what a normal value is) and only then shows how Statix
 * records them; the product pages `/`, `/handball-statistik-app-kostenlos` and
 * `/preise` keep the commercial intents, so the two do not compete.
 * @returns A JSX element composing the ordered pillar-page sections.
 */
export default function HandballStatistikenPage() {
  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <StatsHeader />
      <StatsCatalog />
      <StatsFormulas />
      <StatsWays />
      <StatsHowTo />
      <StatsGuides />
      <BoardFaq
        id='faq'
        kicker='Nachgefragt'
        title='Häufige Fragen zu Handball-Statistiken'
        description='Was Trainer wissen wollen, bevor sie das erste Spiel mitschreiben.'
        items={STATS_FAQS}
      />
      <BoardCta
        kicker='Statt Strichliste'
        title='Deine Zahlen entstehen im Spiel, nicht danach'
        description='Erfasse jede Aktion mit einem Tap – Wurfquoten, Wurfbild und Spielerwerte stehen beim Schlusspfiff fertig da. Registrierung kostenlos, oder erst einmal die Live-Demo mit echten Spieldaten ansehen.'
        linkHref='/handball-statistik-app-kostenlos'
        linkLabel='Was der kostenlose Zugang enthält'
      />
    </div>
  );
}
