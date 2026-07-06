import LandingPage from '@/features/landing-page/pages/landing-page';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Handball-Statistik App – Spiele live erfassen | Statix',
  description:
    'Mit Statix erfasst du Handball-Statistiken live: Tore, Würfe, Paraden & Wurfquoten – automatisch ausgewertet, offline-fähig. Jetzt kostenlos starten.',
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
  ],
  imagePath: '/heroImage.png',
});

export default function Page() {
  return <LandingPage />;
}
