import type {
  ArrowColor,
  ArrowKind,
  BoardArrow,
  BoardGround,
  BoardLabel,
  BoardMagnet,
  BoardState,
  CourtViewId,
  MagnetKind,
} from '../interfaces';
import {
  BOARD_CAPACITY,
  LABEL_MAX_CHARS,
} from '../data/taktikboard-content';

/**
 * The share link.
 *
 * The whole board is packed into the URL fragment, which means sharing costs
 * nothing and stores nothing: no account, no server, no database row. A
 * fragment is never sent to the server by the browser, so a board a coach
 * shares in a team chat exists only in the two browsers that opened it.
 *
 * The format is deliberately fixed-width and base-36 so a full board — a
 * keeper, six defenders, six attackers and a few arrows — stays around 200
 * characters and survives being pasted into WhatsApp without wrapping into
 * something unclickable.
 *
 *   tb1~<view><ground>~<magnets>~<arrows>~<labels>
 *
 * Section separators are `~` and `!`, both legal inside a fragment, so nothing
 * needs percent-encoding except the free text of a note.
 */

const VERSION = 'tb1';

const VIEW_CODES: Record<CourtViewId, string> = { halbfeld: 'h', ganzfeld: 'g' };
const GROUND_CODES: Record<BoardGround, string> = { court: 'd', paper: 'l' };
const MAGNET_CODES: Record<MagnetKind, string> = {
  home: 'h',
  away: 'a',
  keeper: 'k',
  ball: 'b',
};
const ARROW_KIND_CODES: Record<ArrowKind, string> = {
  laufweg: 'l',
  pass: 'p',
  wurf: 'w',
};
const ARROW_COLOR_CODES: Record<ArrowColor, string> = {
  marker: 'm',
  opponent: 'o',
  neutral: 'n',
};

function invert<T extends string>(codes: Record<T, string>): Record<string, T> {
  return Object.fromEntries(
    Object.entries(codes).map(([key, code]) => [code as string, key as T]),
  ) as Record<string, T>;
}

const VIEW_BY_CODE = invert(VIEW_CODES);
const GROUND_BY_CODE = invert(GROUND_CODES);
const MAGNET_BY_CODE = invert(MAGNET_CODES);
const ARROW_KIND_BY_CODE = invert(ARROW_KIND_CODES);
const ARROW_COLOR_BY_CODE = invert(ARROW_COLOR_CODES);

const MAGNET_RECORD = 7;
const ARROW_RECORD = 14;

export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0.5;
  return Math.min(1, Math.max(0, value));
}

/** A coordinate becomes two base-36 characters: 0–1 mapped onto 0–1000. */
function packCoord(value: number): string {
  return Math.round(clamp01(value) * 1000)
    .toString(36)
    .padStart(2, '0');
}

function unpackCoord(chunk: string): number | null {
  const parsed = Number.parseInt(chunk, 36);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1000) return null;
  return parsed / 1000;
}

function packNumber(value: number): string {
  const safe = Math.min(99, Math.max(0, Math.round(value) || 0));
  return safe.toString(36).padStart(2, '0');
}

function unpackNumber(chunk: string): number | null {
  const parsed = Number.parseInt(chunk, 36);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 99) return null;
  return parsed;
}

/**
 * Strips what would break the format or the URL out of a note. Coaches type
 * things like "Sperre außen!" — the exclamation mark separates label records,
 * so it goes.
 */
export function sanitizeLabel(text: string): string {
  return text
    .replace(/[~!#|\r\n\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trimStart()
    .slice(0, LABEL_MAX_CHARS);
}

export function encodeBoard(state: BoardState): string {
  const magnets = state.magnets
    .slice(0, BOARD_CAPACITY.magnets)
    .map(
      (magnet) =>
        `${MAGNET_CODES[magnet.kind] ?? 'h'}${packCoord(magnet.x)}${packCoord(magnet.y)}${packNumber(magnet.number)}`,
    )
    .join('');

  const arrows = state.arrows
    .slice(0, BOARD_CAPACITY.arrows)
    .map(
      (arrow) =>
        `${ARROW_KIND_CODES[arrow.kind] ?? 'l'}${ARROW_COLOR_CODES[arrow.color] ?? 'm'}` +
        `${packCoord(arrow.x1)}${packCoord(arrow.y1)}` +
        `${packCoord(arrow.cx)}${packCoord(arrow.cy)}` +
        `${packCoord(arrow.x2)}${packCoord(arrow.y2)}`,
    )
    .join('');

  const labels = state.labels
    .slice(0, BOARD_CAPACITY.labels)
    .filter((label) => label.text.trim() !== '')
    .map(
      (label) =>
        `${packCoord(label.x)}${packCoord(label.y)}${encodeURIComponent(sanitizeLabel(label.text))}`,
    )
    .join('!');

  return [
    VERSION,
    `${VIEW_CODES[state.view]}${GROUND_CODES[state.ground]}`,
    magnets,
    arrows,
    labels,
  ].join('~');
}

export interface DecodedBoard {
  state: BoardState;
  /** False when the fragment existed but could not be read as a board. */
  ok: boolean;
}

/**
 * Reads a fragment back into a board. Every record is validated on its own, so
 * one mangled magnet costs that magnet and not the whole setup — a link that
 * lost a character in a chat app still opens something usable.
 */
export function decodeBoard(raw: string): DecodedBoard | null {
  const payload = raw.replace(/^#/, '').trim();
  if (payload === '') return null;

  let decoded = payload;
  try {
    // Some chat apps re-encode the fragment; undo that before splitting.
    if (payload.includes('%7E') || payload.includes('%7e')) {
      decoded = decodeURIComponent(payload);
    }
  } catch {
    decoded = payload;
  }

  const sections = decoded.split('~');
  if (sections[0] !== VERSION || sections.length < 3) {
    return { state: emptyBoard(), ok: false };
  }

  const view = VIEW_BY_CODE[sections[1]?.[0]] ?? 'halbfeld';
  const ground = GROUND_BY_CODE[sections[1]?.[1]] ?? 'court';

  const magnets: BoardMagnet[] = [];
  const magnetChunk = sections[2] ?? '';
  for (
    let index = 0;
    index + MAGNET_RECORD <= magnetChunk.length && magnets.length < BOARD_CAPACITY.magnets;
    index += MAGNET_RECORD
  ) {
    const record = magnetChunk.slice(index, index + MAGNET_RECORD);
    const kind = MAGNET_BY_CODE[record[0]];
    const x = unpackCoord(record.slice(1, 3));
    const y = unpackCoord(record.slice(3, 5));
    const number = unpackNumber(record.slice(5, 7));
    if (!kind || x === null || y === null || number === null) continue;
    magnets.push({ id: `s${magnets.length}`, kind, number, x, y });
  }

  const arrows: BoardArrow[] = [];
  const arrowChunk = sections[3] ?? '';
  for (
    let index = 0;
    index + ARROW_RECORD <= arrowChunk.length && arrows.length < BOARD_CAPACITY.arrows;
    index += ARROW_RECORD
  ) {
    const record = arrowChunk.slice(index, index + ARROW_RECORD);
    const kind = ARROW_KIND_BY_CODE[record[0]];
    const color = ARROW_COLOR_BY_CODE[record[1]];
    const points = [
      unpackCoord(record.slice(2, 4)),
      unpackCoord(record.slice(4, 6)),
      unpackCoord(record.slice(6, 8)),
      unpackCoord(record.slice(8, 10)),
      unpackCoord(record.slice(10, 12)),
      unpackCoord(record.slice(12, 14)),
    ];
    if (!kind || !color || points.some((point) => point === null)) continue;
    const [x1, y1, cx, cy, x2, y2] = points as number[];
    arrows.push({ id: `t${arrows.length}`, kind, color, x1, y1, cx, cy, x2, y2 });
  }

  const labels: BoardLabel[] = [];
  const labelChunk = sections[4] ?? '';
  if (labelChunk !== '') {
    for (const record of labelChunk.split('!')) {
      if (labels.length >= BOARD_CAPACITY.labels || record.length < 5) continue;
      const x = unpackCoord(record.slice(0, 2));
      const y = unpackCoord(record.slice(2, 4));
      if (x === null || y === null) continue;
      let text = record.slice(4);
      try {
        text = decodeURIComponent(text);
      } catch {
        // A half-encoded note is still a note; keep the raw characters.
      }
      text = sanitizeLabel(text);
      if (text === '') continue;
      labels.push({ id: `l${labels.length}`, x, y, text });
    }
  }

  const readAnything = magnets.length > 0 || arrows.length > 0 || labels.length > 0;

  return {
    state: { view, ground, magnets, arrows, labels },
    // A deliberately emptied board is a valid board, so only a fragment that
    // carried content and yielded none counts as broken.
    ok: readAnything || (sections[2] === '' && sections[3] === ''),
  };
}

export function emptyBoard(): BoardState {
  return { view: 'halbfeld', ground: 'court', magnets: [], arrows: [], labels: [] };
}
