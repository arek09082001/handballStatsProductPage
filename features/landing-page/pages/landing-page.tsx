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
 * Section order tells the product story: tour the core flows first
 * (record → analyse → tournaments), then the outward-facing news (live
 * ticker, collaboration), then the complete feature index before the
 * FAQ/conversion blocks.
 */
export default function LandingPage() {
  return (
    <>
      <StructuredData />
      <div className='flex h-full w-full flex-col items-center'>
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
