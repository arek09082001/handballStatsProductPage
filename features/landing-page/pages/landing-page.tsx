import StructuredData from '@/components/seo/structured-data';
import ProductHero from '../components/product-hero';
import StatsBarSection from '../components/stats-bar-section';
import FeaturesSection from '../components/features-section';
import ShowcaseSection from '../components/showcase-section';
import AiAnalyticsSection from '../components/ai-analytics-section';
import TournamentSection from '../components/tournament-section';
import HowItWorksSection from '../components/how-it-works-section';
import ProsSection from '../components/pros-section';
import FaqSection from '../components/faq-section';
import NewsletterSection from '../components/newsletter-section';
import ContactSection from '../components/contact-section';
import FinalCTASection from '../components/final-cta-section';

export default function LandingPage() {
  return (
    <>
      <StructuredData />
      <div className='flex h-full w-full flex-col items-center'>
        <ProductHero />
        <StatsBarSection />
        <FeaturesSection />
        <ShowcaseSection />
        <AiAnalyticsSection />
        <TournamentSection />
        <HowItWorksSection />
        <ProsSection />
        <FaqSection />
        <NewsletterSection />
        <ContactSection />
        <FinalCTASection />
      </div>
    </>
  );
}
