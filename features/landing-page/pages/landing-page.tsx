import DynamicHeroSection from '../components/dynamic-hero-section';
import StructuredData from '@/components/seo/structured-data';
import TransformationSection from '../components/transformation-section';
import PerformanceAuditSection from '../components/performance-audit-section';
import WhyUsSection from '../components/why-us-section';
import CommonQuestionsSection from '../components/common-questions-section';
import CostOfOutdatedWebsiteSection from '../components/cost-of-outdated-website-section';
import FinalCTASection from '../components/final-cta-section';

export default function LandingPage() {
  return (
    <>
      <StructuredData />
      <div className='h-full flex flex-col w-full items-center'>
        <DynamicHeroSection />
        <TransformationSection />
        <PerformanceAuditSection />
        <WhyUsSection />
        <CommonQuestionsSection />
        <CostOfOutdatedWebsiteSection />
        <FinalCTASection />
      </div>
    </>
  );
}
