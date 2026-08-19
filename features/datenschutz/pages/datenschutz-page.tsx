import DatenschutzContent from '../components/datenschutz-content';
import DatenschutzHeader from '../components/datenschutz-header';

export default function DatenschutzPage() {
  return (
    <div className='w-full'>
      <DatenschutzHeader />
      <DatenschutzContent />
    </div>
  );
}
