import BrandHeader from '../components/brand-header';
import BrandOverview from '../components/brand-overview';
import BrandHighlights from '../components/brand-highlights';
import BrandFeatures from '../components/brand-features';
import BrandStory from '../components/brand-story';
import BrandFaq from '../components/brand-faq';
import BrandCta from '../components/brand-cta';

/**
 * Brand page `/was-ist-statix`. Section order tells the brand story: answer the
 * "what is Statix?" question in the hero, define it in 30 seconds, show the
 * product in action (highlights), list every feature, explain who it's for and
 * who's behind it, then answer FAQs and convert.
 * @returns A JSX element composing the ordered brand-page sections.
 */
export default function WasIstStatixPage() {
  return (
    <div className='flex w-full flex-col items-center justify-center'>
      <BrandHeader />
      <BrandOverview />
      <BrandHighlights />
      <BrandFeatures />
      <BrandStory />
      <BrandFaq />
      <BrandCta />
    </div>
  );
}
