import StructuredData from '@/components/seo/structured-data';
import ProductHero from '../components/product-hero';
import StatsBarSection from '../components/stats-bar-section';
import ShowcaseSection from '../components/showcase-section';
import AiAnalyticsSection from '../components/ai-analytics-section';
import MoreSection from '../components/more-section';
import ProsSection from '../components/pros-section';
import TestimonialsSection from '../components/testimonials-section';
import FaqSection from '../components/faq-section';
import NewsletterSection from '../components/newsletter-section';
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
 * STORY: a coach sees the sideline tap turn into live stats, shot maps and AI
 *   analysis, learns what else is in the box, and registers.
 * FIRST VIEWPORT: the court board — a marker headline in the attacking zone,
 *   the live‑recording app pinned beside it, a move drawn toward it, free
 *   registration the primary action and the no‑account demo right beside it.
 * FORM: alternating paper/court bands paced dense→quiet; the page opens and
 *   closes on the dark board (hero + final CTA) as bookends.
 *
 * SECTION ORDER — one decision, reached fast. Hero states the mechanism and
 * offers the two ways in; the scoreboard makes it concrete; three screenshots
 * tell the whole product story (tap → stats → shot maps); AI is the thing no
 * scoresheet can do; "und dann noch" covers tournaments, ticker and the
 * coaching staff without three more bands; the scoresheet comparison and the
 * maker's note carry the sell and the trust; FAQ clears the objections; the
 * newsletter catches whoever will not register today; the final CTA asks.
 *
 * WHAT WAS CUT, AND WHERE IT WENT (the page was fourteen bands):
 * - The 32‑item feature index duplicated `/was-ist-statix`, which generates the
 *   canonical list from `APP_FEATURES`. The "und dann noch" band links there.
 * - Tournament, live ticker and collaboration were three full bands with six
 *   screenshots; they are one band now, keeping the ticker mock as its visual.
 * - Three showcase rows (dashboard, roster, export) left; they are in the demo
 *   and on `/was-ist-statix`.
 * - The contact form moved to its own route, `/kontakt`. A four‑field form has
 *   no business standing between a convinced visitor and the CTA.
 * `TestimonialsSection` stays in the order and renders nothing while there are
 * no real coach quotes — the maker's note in `ProsSection` carries trust until
 * there are.
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
        <MoreSection />
        <ProsSection />
        <TestimonialsSection />
        <FaqSection />
        <NewsletterSection />
        <FinalCTASection />
      </div>
    </>
  );
}
