import DatenschutzContent from '../components/datenschutz-content';
import DatenschutzHeader from '../components/datenschutz-header';
import TranslationNotice from '@/features/legal/components/translation-notice';

export default function DatenschutzPage() {
  return (
    <div className='w-full'>
      <DatenschutzHeader />
      {/* Between the header and the policy, at the content's own width: the
          reader meets it before the first legal basis, not after them. */}
      <div className='bg-paper pt-10'>
        <div className='mx-auto max-w-3xl px-6 sm:px-8'>
          <TranslationNotice />
        </div>
      </div>
      <DatenschutzContent />
    </div>
  );
}
