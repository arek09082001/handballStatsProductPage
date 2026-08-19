import ImpressumHeader from '../components/header';
import ImpressumCard from '../components/impressum-card';
import PrivacyPointerCard from '../components/privacy-pointer-card';

export default function ImpressumPage() {
  return (
    <div className='w-full'>
      <ImpressumHeader />
      <ImpressumCard />
      <PrivacyPointerCard />
    </div>
  );
}
