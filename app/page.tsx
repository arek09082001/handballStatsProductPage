import LandingPage from '@/features/landing-page/pages/landing-page';
import { createPageMetadata, HOME_TITLE } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: HOME_TITLE,
  description:
    'Statix ist die Handball-Statistik-App für Trainer & Vereine: Statistiken live per Tap erfassen, Wurfquoten & Wurfbilder automatisch ausgewertet – offline, kostenlos starten. Live-Demo ohne Account.',
  path: '/',
  absoluteTitle: true,
  keywords: [
    'statix',
    'statix app',
    'statix handball',
    'handball statistiken',
    'handball statistiken erfassen',
    'handball statistiken app',
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
});

export default function Page() {
  return <LandingPage />;
}
