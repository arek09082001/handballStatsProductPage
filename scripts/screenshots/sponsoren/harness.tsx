/**
 * The app's real sponsor settings (`SponsorsSection`) with the invented
 * sponsors of `logos.mjs`. Built against the app repo:
 *
 *   node scripts/screenshots/livestream/regie/build.mjs scripts/screenshots/sponsoren/harness.tsx sponsoren
 */
import { createRoot } from 'react-dom/client';
import { NextIntlClientProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import messages from '@/messages/de.json';
import SponsorsSection from '@/features/settings/sections/sponsors-section';
import { LOGOS } from './logos.mjs';

const sponsor = (id: string, slot: string, name: string, logoUrl: string, extra: object = {}) => ({
  id, slot, name, logoUrl, linkUrl: null, isActive: true, stream: null, ...extra,
});

const SETTINGS = {
  isPro: true,
  canEdit: true,
  uploadEnabled: true,
  slots: ['banner', 'goal', 'timeout', 'stream'],
  sponsors: [
    sponsor('s1', 'banner', 'Autohaus Muster', LOGOS.autohaus, { linkUrl: 'https://example.org/autohaus' }),
    sponsor('s2', 'banner', 'Bäckerei Beispiel', LOGOS.baeckerei),
    sponsor('s3', 'banner', 'Physio am Musterpark', LOGOS.physio, { linkUrl: 'https://example.org/physio' }),
    sponsor('s4', 'goal', 'Sport Muster', LOGOS.sport),
    sponsor('s5', 'timeout', 'Bäckerei Beispiel', LOGOS.baeckerei),
    sponsor('s6', 'stream', 'Stadtwerke Musterstadt', LOGOS.stadtwerke, {
      linkUrl: 'https://example.org/stadtwerke',
      stream: { size: 7, corner: 'top', mode: 'cycle', label: 'presented' },
    }),
  ],
  clubName: null,
  clubId: null,
  canEditClubSponsors: false,
  inherited: [],
};

const unknown = new Set<string>();
axios.defaults.adapter = async (config) => {
  const p = new URL((config.baseURL || '') + (config.url || ''), location.href).pathname;
  let data: unknown = {};
  if (p === '/api/teams/sponsors') data = SETTINGS;
  else unknown.add(`${(config.method || 'get').toUpperCase()} ${p}`);
  (window as unknown as { __unknown: string[] }).__unknown = [...unknown];
  return { data, status: 200, statusText: 'OK', headers: {}, config, request: {} } as never;
};

const qc = new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } } });
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={qc}>
    <NextIntlClientProvider locale='de' messages={messages} timeZone='Europe/Berlin'>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: 24 }}>
        <SponsorsSection />
      </div>
    </NextIntlClientProvider>
  </QueryClientProvider>,
);
