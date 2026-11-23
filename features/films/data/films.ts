/**
 * Die Schritt-Filme: kurze Filme (1600 × 900), die auf einer Seite die
 * Textliste „So läuft das“ ersetzen. Gerendert in Remotion (Repo
 * remotion-statix, `src/compositions/steps/`, `npm run render:films`), die
 * Dateien liegen unter `public/videos/films/<name>{.mp4,-sm.mp4,.webm,-sm.webm,.jpg}`.
 *
 * Jeder Film zeigt die Schritte der Seite in DERSELBEN Reihenfolge — Schritt
 * n des Films ist Kapitel n der Leiste, beschriftet mit dem Titel des Schritts
 * aus dem Sprachpaket. Deshalb steht hier nur, welcher Film zu welcher Seite
 * gehört; die Kapitel rechnet `stepsFilmBounds` aus der Zahl der Schritte.
 */

/**
 * Der Zeitplan der Vorlage in Bildern bei 30 fps — gespiegelt aus
 * `src/compositions/steps/steps-film-timeline.ts` in remotion-statix. Wer dort
 * eine Länge ändert, ändert sie hier mit.
 */
const FPS = 30;
const INTRO = 75;
const STEP = 165;
const OUTRO = 90;

const boundsCache = new Map<number, [number, number][]>();

/**
 * Kapitel je Schritt in Sekunden: das erste schliesst den Hook ein, das
 * letzte den Schluss mit dem Logo.
 */
export function stepsFilmBounds(steps: number): [number, number][] {
  // Dieselbe Liste für dieselbe Zahl: die Kapitelleiste hängt Rückrufe daran
  const known = boundsCache.get(steps);
  if (known) return known;
  const bounds = Array.from({ length: steps }, (_, i) => {
    const from = i === 0 ? 0 : INTRO + i * STEP;
    const to = i === steps - 1 ? INTRO + steps * STEP + OUTRO : INTRO + (i + 1) * STEP;
    return [from / FPS, to / FPS] as [number, number];
  });
  boundsCache.set(steps, bounds);
  return bounds;
}

/** Funktionsseite (`/funktionen/<slug>`) → Datei des Films */
export const FEATURE_FILMS: Record<string, string> = {
  'live-erfassung': 'live-erfassung',
  'halten-und-wischen': 'halten-und-wischen',
  'offline-und-app': 'offline-und-app',
  'live-ticker': 'live-ticker',
  'handball-livestream': 'handball-livestream',
  spielerstatistiken: 'spielerstatistiken',
  wurfbilder: 'wurfbilder',
  'ki-analyse': 'ki-analyse',
  'gegner-bilanz': 'gegner-bilanz',
  'expected-goals': 'expected-goals',
  'aufstellungs-analyse': 'aufstellungs-analyse',
  'video-tagging': 'video-tagging',
  'video-besprechung': 'video-besprechung',
  'termine-und-teilnahme': 'termine-und-teilnahme',
  'team-management': 'team-management',
  'kader-kartenalbum': 'kader-kartenalbum',
  turniere: 'turniere',
  mannschaftskasse: 'mannschaftskasse',
  trikotverwaltung: 'trikotverwaltung',
  'spieler-zugang': 'spieler-zugang',
  vereinsbereich: 'vereinsbereich',
  'trainer-zusammenarbeit': 'trainer-zusammenarbeit',
  sponsoren: 'sponsoren',
};

/** Der Film der Themenseite `/handball-videoanalyse` (ihre fünf Schritte) */
export const VIDEO_ANALYSIS_FILM = 'videoanalyse';

export const FILM_W = 1600;
export const FILM_H = 900;
export const filmPath = (name: string) => `/videos/films/${name}`;
