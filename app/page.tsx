import LandingPage from '@/features/landing-page/pages/landing-page';
import { createPageMetadata, HOME_TITLE } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: HOME_TITLE,
  description:
    'Statix ist die Handball-Statistik- und Videoanalyse-App für Trainer & Vereine: Statistiken live per Tap erfassen, Wurfquoten & Wurfbilder automatisch, Spielszenen im Video taggen und besprechen – offline, kostenlos starten.',
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
    'handball videoanalyse',
    'handball videoanalyse app',
  ],
});

export default function Page() {
  return <LandingPage />;
}
