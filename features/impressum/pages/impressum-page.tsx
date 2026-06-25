import DatenschutzCard from '../components/datenschutz-card';
import ImpressumHeader from '../components/header';
import ImpressumCard from '../components/impressum-card';

export default function ImpressumPage() {
  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <ImpressumHeader />
      <ImpressumCard />
      <DatenschutzCard />
    </div>
  );
}
