import LandingPage from '@/features/landing-page/pages/landing-page';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Handball-Statistik-App: Spiele live erfassen & analysieren | Statix',
  description:
    'Handball-Statistiken live per Tap erfassen: Wurfquoten, Wurfbilder & Spielerwerte automatisch ausgewertet – offline, kostenlos starten. Live-Demo ohne Account.',
  path: '/',
  absoluteTitle: true,
  keywords: [
    'handball statistik erfassen',
    'handball statistik app',
    'handball statistik aufnehmen',
    'handball stats',
    'handball scouting app',
    'handball trainer app',
    'spielerstatistik handball',
    'handball spielanalyse',
    'handball statistik app kostenlos testen',
    'handball statistik demo',
  ],
  imagePath: '/heroImage.png',
});

export default function Page() {
  return <LandingPage />;
}
