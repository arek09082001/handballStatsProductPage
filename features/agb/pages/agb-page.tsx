import AgbContent from '../components/agb-content';
import AgbHeader from '../components/header';

export default function AgbPage() {
  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <AgbHeader />
      <AgbContent />
    </div>
  );
}
