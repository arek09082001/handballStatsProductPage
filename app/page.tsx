import LandingPage from '@/features/landing-page/pages/landing-page';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Website erstellen lassen für Unternehmen und Handwerker',
  description:
    'Individuelles Webdesign und lokale SEO für Unternehmen, Handwerker und Dienstleister, die bei Google sichtbar werden und mehr Anfragen gewinnen.',
  path: '/',
  keywords: [
    'neue website',
    'website erstellen lassen',
    'webdesign handwerker',
    'webdesign dienstleister',
    'unternehmenswebsite erstellen lassen',
  ],
  imagePath: '/heroImage.png',
});

export default function Page() {
  return <LandingPage />;
}
