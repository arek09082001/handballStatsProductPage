import AgbContent from '../components/agb-content';
import AgbHeader from '../components/header';
import TranslationNotice from '@/features/legal/components/translation-notice';

export default function AgbPage() {
  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <AgbHeader />
      {/* Between the header and the terms, at the content's own width: the
          reader meets it before the first clause, not after them. */}
      <div className='flex w-full items-center justify-center bg-muted pt-8'>
        <div className='w-full max-w-4xl px-6 sm:px-8'>
          <TranslationNotice />
        </div>
      </div>
      <AgbContent />
    </div>
  );
}
