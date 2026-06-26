import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Providers from '@/app/providers';
import LocaleProvider from '@/app/locale-provider';
import { ThemeProvider } from 'next-themes';
import LayoutWrapper from '@/components/wrapper/layout-wrapper';
import { Toaster } from 'sonner';
import { CLUB_CONFIG } from '@/lib/club-config';
import OrganizationSchema from '@/components/seo/organization-schema';
import WebsiteSchema from '@/components/seo/website-schema';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { DEFAULT_HTML_LANG } from '@/i18n/config';
import { DEFAULT_OG_IMAGE, SEO_KEYWORDS, SITE_URL } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-space-grotesk',
});

export const revalidate = 60 * 60 * 24;
export const dynamic = 'force-static';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      'HandballStats – Handball-Statistik App zum Live-Erfassen',
    template: `%s | ${CLUB_CONFIG.fullName}`,
  },
  description: CLUB_CONFIG.seo.description,
  applicationName: CLUB_CONFIG.fullName,
  keywords: SEO_KEYWORDS,
  authors: [{ name: CLUB_CONFIG.fullName }],
  creator: CLUB_CONFIG.fullName,
  publisher: CLUB_CONFIG.fullName,
  category: 'sports',
  classification: 'Handball-Statistik-App für Trainer, Vereine und Teams',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: CLUB_CONFIG.branding.favicons.ico,
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        url: CLUB_CONFIG.branding.favicons.png,
        sizes: '768x768',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: CLUB_CONFIG.branding.favicons.appleTouchIcon,
        sizes: '768x768',
        type: 'image/png',
      },
    ],
    shortcut: [CLUB_CONFIG.branding.favicons.shortcut],
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: SITE_URL,
    title: 'HandballStats – Handball-Statistik App zum Live-Erfassen',
    description: CLUB_CONFIG.seo.description,
    siteName: CLUB_CONFIG.fullName,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${CLUB_CONFIG.fullName} Startseite`,
      },
    ],
    countryName: 'Germany',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HandballStats – Handball-Statistik App zum Live-Erfassen',
    description: CLUB_CONFIG.seo.description,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${CLUB_CONFIG.fullName} Startseite`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: CLUB_CONFIG.fullName,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={DEFAULT_HTML_LANG} suppressHydrationWarning>
      <head suppressHydrationWarning>
        <meta name='theme-color' content={CLUB_CONFIG.branding.themeColor} />
        <meta
          name='msapplication-TileColor'
          content={CLUB_CONFIG.branding.themeColor}
        />
        <link
          rel='icon'
          type='image/x-icon'
          href={CLUB_CONFIG.branding.favicons.ico}
          sizes='any'
        />
        <link
          rel='icon'
          type='image/png'
          href={CLUB_CONFIG.branding.favicons.png}
          sizes='768x768'
        />
        <link
          rel='apple-touch-icon'
          href={CLUB_CONFIG.branding.favicons.appleTouchIcon}
        />
        <link rel='shortcut icon' href={CLUB_CONFIG.branding.favicons.shortcut} />
      </head>
      <body className={`${inter.className} ${spaceGrotesk.variable} bg-muted text-foreground`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem={false}>
          <LocaleProvider>
            <Providers>
              <LayoutWrapper>{children}</LayoutWrapper>
            </Providers>
          </LocaleProvider>
          <Toaster />
          <OrganizationSchema />
          <WebsiteSchema />
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
