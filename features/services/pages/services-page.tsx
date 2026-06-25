import ServicesDetailSections from '../components/services-detail-sections';
import ServicesHeroSection from '../components/services-hero-section';
import ServicesOverviewSection from '../components/services-overview-section';

export default function ServicesPage() {
  return (
    <div className='w-full bg-background'>
      <ServicesHeroSection />
      <ServicesOverviewSection />
      <ServicesDetailSections />
    </div>
  );
}
