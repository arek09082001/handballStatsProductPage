import CompanyHeroSection from '../components/company-hero-section';
import CoreValuesSection from '../components/core-values-section';
import LetsCollaborateSection from '../components/lets-collaborate-section';
import OurApproachSection from '../components/our-approach-section';

export default function CompanyPage() {
  return (
    <div className='w-full'>
      <CompanyHeroSection />
      <CoreValuesSection />
      <OurApproachSection />
      <LetsCollaborateSection />
    </div>
  );
}
