import StructuredData from '@/components/seo/structured-data';
import ProductHero from '../components/product-hero';
import StatsBarSection from '../components/stats-bar-section';
import FeaturesSection from '../components/features-section';
import HowItWorksSection from '../components/how-it-works-section';
import ProsSection from '../components/pros-section';
import FaqSection from '../components/faq-section';
import NewsletterSection from '../components/newsletter-section';
import FinalCTASection from '../components/final-cta-section';

export default function LandingPage() {
  return (
    <>
      <StructuredData />
      <div className='flex h-full w-full flex-col items-center'>
        <ProductHero />
        <StatsBarSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ProsSection />
        <FaqSection />
        <NewsletterSection />
        <FinalCTASection />
      </div>
    </>
  );
}
