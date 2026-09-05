import ImpressumHeader from '../components/header';
import ImpressumCard from '../components/impressum-card';
import PrivacyPointerCard from '../components/privacy-pointer-card';
import TranslationNotice from '@/features/legal/components/translation-notice';

export default function ImpressumPage() {
  return (
    <div className='w-full'>
      <ImpressumHeader />
      {/* Between the header and the provider details, at the card's own width:
          the reader meets it before the § 5 DDG block, not after it. */}
      <div className='bg-paper pt-10'>
        <div className='mx-auto max-w-3xl px-6 sm:px-8'>
          <TranslationNotice />
        </div>
      </div>
      <ImpressumCard />
      <PrivacyPointerCard />
    </div>
  );
}
