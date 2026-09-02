import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq from '@/components/custom-ui/board-faq';
import PricingHeader from '../components/pricing-header';
import PricingWhy from '../components/pricing-why';
import PricingTiers from '../components/pricing-tiers';
import PricingFounder from '../components/pricing-founder';
import PricingCompare from '../components/pricing-compare';
import PricingClub from '../components/pricing-club';
import PricingAlternative from '../components/pricing-alternative';
import {
  FOUNDER_DEADLINE_LABEL,
  FOUNDER_FREE_UNTIL_LABEL,
  PRICING_FAQS,
} from '../data/pricing-content';

/**
 * Pricing page `/preise`. The section order follows the questions a coach
 * arrives with, in the order a price announcement creates them: why is there a
 * price at all, what does it cost, what happens to the account I already have,
 * what exactly is in each plan, what does a club pay — then the honest
 * comparison against the Zettel, the FAQ and the demo.
 *
 * Ground rhythm alternates court → paper throughout (see DESIGN.md), with the
 * price board on the dark court as the page's scoreboard and the founder
 * guarantee on paper as the note pinned next to it.
 * @returns A JSX element composing the ordered pricing sections.
 */
export default function PreisePage() {
  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <PricingHeader />
      <PricingWhy />
      <PricingTiers />
      <PricingFounder />
      <PricingCompare />
      <PricingClub />
      <PricingAlternative />
      <BoardFaq
        id='faq'
        kicker='Nachgefragt'
        title='Häufige Fragen zu den Preisen'
        description='Was Trainer wissen wollen, bevor der 1. Januar kommt.'
        items={PRICING_FAQS}
      />
      <BoardCta
        kicker='Jetzt oder ab Januar'
        title={`Bis zum ${FOUNDER_DEADLINE_LABEL} zählt jede Anmeldung`}
        description={`Registrieren kostet nichts und dauert eine Minute – es gibt kein Feld für Zahlungsdaten. Wer heute ein Konto anlegt, behält den Trainer-Plan kostenlos bis zum ${FOUNDER_FREE_UNTIL_LABEL}. Lieber erst schauen? Die Live-Demo läuft mit echten Spieldaten ganz ohne Account.`}
        linkHref='/#newsletter'
        linkLabel='Newsletter abonnieren und Änderungen zuerst erfahren'
      />
    </div>
  );
}
