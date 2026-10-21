import { CLUB_CONFIG } from '@/lib/club-config';

/** The app's CDN holds the figures for 15 minutes; the page follows suit. */
export const LIVE_STATS_REVALIDATE_SECONDS = 900;

export interface LiveStats {
  users: number;
  games: number;
  events: number;
  goals: number;
}

export const LIVE_STAT_KEYS = ['users', 'games', 'events', 'goals'] as const;

function parseLiveStats(json: unknown): LiveStats | null {
  if (!json || typeof json !== 'object') return null;
  const o = json as Record<string, unknown>;
  const ok = LIVE_STAT_KEYS.every((k) => typeof o[k] === 'number' && Number.isFinite(o[k]) && (o[k] as number) > 0);
  return ok ? { users: o.users as number, games: o.games as number, events: o.events as number, goals: o.goals as number } : null;
}

/**
 * Reads the app's usage figures on the server (`GET /api/public/stats`),
 * re-fetched at most every 15 minutes through ISR. Never throws: anything
 * unexpected returns `null` and the band falls back to its static claims.
 */
export async function fetchLiveStats(): Promise<LiveStats | null> {
  // Shared secret with the app; only ever read here on the server.
  const token = process.env.PUBLIC_STATS_TOKEN;
  if (!token) return null;
  try {
    const response = await fetch(`${CLUB_CONFIG.website.appUrl}/api/public/stats`, {
      headers: { accept: 'application/json', authorization: `Bearer ${token}` },
      next: { revalidate: LIVE_STATS_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    return parseLiveStats(await response.json());
  } catch {
    return null;
  }
}

export interface CompactFigure {
  /** The number the counter animates to (already divided, e.g. 29.4). */
  number: number;
  decimals: number;
  /** Unit after the number, e.g. "Tsd." / "k" / "Mio." – empty below 1 000. */
  unit: string;
}

/**
 * 124 → "124", 5 990 → "5,9 Tsd.", 29 382 → "29 Tsd.", 1 250 000 → "1,2 Mio.".
 * Always rounds DOWN, so the band never claims more than there is; one
 * decimal only while it carries information (below 10 of the unit).
 */
export function compactFigure(value: number, units: { thousand: string; million: string }): CompactFigure {
  const pick = (divisor: number, unit: string): CompactFigure => {
    const scaled = value / divisor;
    const decimals = scaled < 10 ? 1 : 0;
    const factor = 10 ** decimals;
    return { number: Math.floor(scaled * factor) / factor, decimals, unit };
  };
  if (value >= 1_000_000) return pick(1_000_000, units.million);
  if (value >= 1_000) return pick(1_000, units.thousand);
  return { number: Math.floor(value), decimals: 0, unit: '' };
}
