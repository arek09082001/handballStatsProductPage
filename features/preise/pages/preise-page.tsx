import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq from '@/components/custom-ui/board-faq';
import PricingHeader from '../components/pricing-header';
import PricingFree from '../components/pricing-free';
import PricingPlan from '../components/pricing-plan';
import PricingClub from '../components/pricing-club';
import PricingStart from '../components/pricing-start';
import PricingAlternative from '../components/pricing-alternative';
import { PRICING_FAQS } from '../data/pricing-content';

/**
 * Pricing page `/preise`. Section order follows the buying question: what does
 * it cost right now (nothing, with the real limits), what would a subscription
 * change, what does that mean for a club, what "kostenlos starten" actually
 * involves, how it compares to the Zettel/Excel a coach uses today — then FAQ
 * and the demo.
 * @returns A JSX element composing the ordered pricing sections.
 */
export default function PreisePage() {
  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <PricingHeader />
      <PricingFree />
      <PricingPlan />
      <PricingClub />
      <PricingStart />
      <PricingAlternative />
      <BoardFaq
        id='faq'
        kicker='Nachgefragt'
        title='Häufige Fragen zu den Preisen'
        description='Was Trainer wissen wollen, bevor sie ein Konto anlegen.'
        items={PRICING_FAQS}
      />
      <BoardCta
        kicker='Selbst ausprobieren'
        title='Erst schauen, dann entscheiden'
        description='Registrieren kostet nichts und dauert eine Minute – es gibt kein Feld für Zahlungsdaten. Lieber erst schauen? Die Live-Demo läuft mit echten Spieldaten ganz ohne Account.'
        linkHref='/#newsletter'
        linkLabel='Newsletter abonnieren und Konditionen zuerst erfahren'
      />
    </div>
  );
}
