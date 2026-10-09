/**
 * The app's real briefing mode (`PresentationMode`) over the DRAWN hall of
 * `livestream/court.mjs`, played as a video. Built against the app repo:
 *
 *   node scripts/screenshots/livestream/regie/build.mjs scripts/screenshots/besprechung/harness.tsx besprechung
 *
 * Recorded match footage does not exist in this pipeline (it lives in object
 * storage), and somebody else's video under our tools would be an invented
 * session — so the picture is the trainer-board court with magnets as
 * players, and the captions on the product page say so. Everything around it
 * — header, clip list, tool rail, the drawing itself, zoom and the save panel
 * after a recording — is the app's own component.
 *
 * The clips are a compilation on one theme of a fictional match: placeholder
 * names, numbers matching the magnets of the drawn picture (orange attacks a
 * blue 6:0).
 */
import { createRoot } from 'react-dom/client';
import { NextIntlClientProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import messages from '@/messages/de.json';
import PresentationMode, {
  type PresentationScene,
} from '@/features/videos/presentation/presentation-mode';
import BriefingSavePanel from '@/features/videos/presentation/briefing-save-panel';

const VIDEO = {
  id: 'video-1',
  gameId: 'game-1',
  game: { id: 'game-1', opponentName: 'SV Beispiel', scheduledAt: '2026-09-26T16:00:00.000Z' },
  teamEventId: null,
  teamEvent: null,
  title: null,
  status: 'ready',
  rotationDegrees: 0,
  probedFpsMeasured: 30,
  playback: { kind: 'source', url: './clip.webm' },
};

const TOPIC = 'Angriff gegen 6:0';
// [title, number, name, half, minute:second] — numbers are the orange magnets.
const CLIPS: [string, number, string, number, string][] = [
  [TOPIC, 9, 'Nele Arndt', 1, '3:12'],
  [TOPIC, 11, 'Ida Pfeiffer', 1, '6:48'],
  [TOPIC, 13, 'Wiebke Sander', 1, '9:05'],
  [TOPIC, 3, 'Pia Lorenz', 1, '14:31'],
  [TOPIC, 9, 'Nele Arndt', 1, '21:57'],
  [TOPIC, 7, 'Jule Behrens', 2, '2:40'],
  [TOPIC, 5, 'Hanna Wiese', 2, '11:16'],
  [TOPIC, 11, 'Ida Pfeiffer', 2, '17:02'],
  [TOPIC, 13, 'Wiebke Sander', 2, '24:39'],
];
const SCENES: PresentationScene[] = CLIPS.map(([title, nr, name, half, clock], i) => ({
  id: `scene-${i}`,
  code: 'custom_tag',
  startSeconds: 4 + i * 6,
  endSeconds: 9 + i * 6,
  title,
  subtitle: `#${nr} ${name} · ${half}. HZ · ${clock}`,
}));

// The save panel only asks the server once "Hochladen" is pressed, which the
// shots never do; anything else that is asked is listed for the shoot script.
const unknown = new Set<string>();
axios.defaults.adapter = async (config) => {
  const p = new URL((config.baseURL || '') + (config.url || ''), location.href).pathname;
  unknown.add(`${(config.method || 'get').toUpperCase()} ${p}`);
  (window as unknown as { __unknown: string[] }).__unknown = [...unknown];
  return { data: {}, status: 200, statusText: 'OK', headers: {}, config, request: {} } as never;
};

const mode = location.hash.replace('#', '') || 'present';
const qc = new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } } });

// `#saved` is the panel the coach sees after stopping a recording: the same
// component the mode mounts over itself, here with a recording of 3:41 at the
// ~3 Mbit/s the recorder writes (the bytes are not a video; the panel only
// measures them). It sits in a layer over the mode exactly where the mode's
// own `absolute inset-0` would put it.
const recording = new Blob([new Uint8Array(86_900_000)], { type: 'video/mp4' });

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={qc}>
    <NextIntlClientProvider locale='de' messages={messages} timeZone='Europe/Berlin' now={new Date('2026-09-28T19:30:00+02:00')}>
      <PresentationMode
        video={VIDEO as never}
        scenes={SCENES}
        initialIndex={2}
        sessionTitle={TOPIC}
        scoreboard={null}
        onClose={() => {}}
      />
      {mode === 'saved' ? (
        <div className='fixed inset-0 z-[90] text-white'>
          <BriefingSavePanel
            blob={recording}
            durationSeconds={221}
            defaultTitle={`Besprechung: ${TOPIC} · 28.09.2026`}
            gameId='game-1'
            teamEventId={null}
            onDiscard={() => {}}
            onClose={() => {}}
          />
        </div>
      ) : null}
    </NextIntlClientProvider>
  </QueryClientProvider>,
);
