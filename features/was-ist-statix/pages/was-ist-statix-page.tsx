import BrandHeader from '../components/brand-header';
import BrandOverview from '../components/brand-overview';
import BrandFeatures from '../components/brand-features';
import BrandStory from '../components/brand-story';
import BrandFaq from '../components/brand-faq';
import BrandCta from '../components/brand-cta';

export default function WasIstStatixPage() {
  return (
    <div className='flex w-full flex-col items-center justify-center'>
      <BrandHeader />
      <BrandOverview />
      <BrandFeatures />
      <BrandStory />
      <BrandFaq />
      <BrandCta />
    </div>
  );
}
