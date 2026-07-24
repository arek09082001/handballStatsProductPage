import StructuredData from '@/components/seo/structured-data';
import ProductHero from '../components/product-hero';
import StatsBarSection from '../components/stats-bar-section';
import ShowcaseSection from '../components/showcase-section';
import AiAnalyticsSection from '../components/ai-analytics-section';
import TournamentSection from '../components/tournament-section';
import LiveTickerSection from '../components/live-ticker-section';
import CollaborationSection from '../components/collaboration-section';
import FeatureGridSection from '../components/feature-grid-section';
import ProsSection from '../components/pros-section';
import FaqSection from '../components/faq-section';
import NewsletterSection from '../components/newsletter-section';
import ContactSection from '../components/contact-section';
import FinalCTASection from '../components/final-cta-section';

/**
 * DIRECTION CONTRACT — "Die Trainertafel" (see DESIGN.md)
 *
 * THESIS: This landing page IS a coach's tactic board that keeps score. It
 *   refuses the generic dark‑SaaS arrangement (gradient headline, radial‑blob
 *   glows, glassmorphism cards, faux‑browser chrome) that the old page shipped.
 * OWN‑WORLD: two board grounds — warm paper (bright hall) and a deep court
 *   floor — with chalk court lines, marker ink (orange = your team, blue = the
 *   opponent), jersey magnets and hand‑drawn arrows. Archivo display + Inter
 *   body + Caveat as the coach's marker hand.
 * STORY: a coach sees the sideline tap turn into live stats, shot maps, AI
 *   analysis, tournaments and a live ticker, then starts the real demo.
 * FIRST VIEWPORT: the court board — a marker headline in the attacking zone,
 *   the live‑recording app pinned beside it, a move drawn toward it, the
 *   Live‑Demo the primary action.
 * FORM: alternating paper/court bands paced dense→quiet; the page opens and
 *   closes on the dark board (hero + final CTA) as bookends.
 *
 * Section order tells the product story: tour the core flows first
 * (record → analyse → tournaments), then the outward-facing news (live
 * ticker, collaboration), then the complete feature index before the
 * FAQ/conversion blocks.
 */
export default function LandingPage() {
  return (
    <>
      <StructuredData />
      <div className='flex h-full w-full flex-col items-center bg-paper'>
        <ProductHero />
        <StatsBarSection />
        <ShowcaseSection />
        <AiAnalyticsSection />
        <TournamentSection />
        <LiveTickerSection />
        <CollaborationSection />
        <FeatureGridSection />
        <ProsSection />
        <FaqSection />
        <NewsletterSection />
        <ContactSection />
        <FinalCTASection />
      </div>
    </>
  );
}
