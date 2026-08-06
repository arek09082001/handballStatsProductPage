'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy, Download, Link2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import BoardCanvas from './board-canvas';
import { COURT_VIEW_LIST } from '../data/court-geometry';
import { BOARD_GROUNDS, MAGNET_COLORS } from '../data/board-palette';
import {
  DEFAULT_FORMATION_ID,
  FORMATION_PRESETS,
  findFormation,
} from '../data/formations';
import {
  ARROW_KIND_OPTIONS,
  BOARD_CAPACITY,
  EXPORT_FILE_NAME,
  LABEL_MAX_CHARS,
  MAGNET_KIND_OPTIONS,
  TAKTIKBOARD_PAGE_PATH,
} from '../data/taktikboard-content';
import { clamp01, decodeBoard, encodeBoard, sanitizeLabel } from '../lib/board-share';
import type {
  ArrowColor,
  ArrowHandle,
  ArrowKind,
  BoardGround,
  BoardSelection,
  BoardState,
  CourtViewId,
  MagnetKind,
} from '../interfaces';

const ARROW_COLOR_OPTIONS: { value: ArrowColor; label: string }[] = [
  { value: 'marker', label: 'Orange (eigene)' },
  { value: 'opponent', label: 'Blau (Gegner)' },
  { value: 'neutral', label: 'Neutral' },
];

const GROUND_OPTIONS: { value: BoardGround; label: string }[] = [
  { value: 'court', label: 'Hallenboden' },
  { value: 'paper', label: 'Papier' },
];

function buildDefaultBoard(): BoardState {
  return {
    view: 'halbfeld',
    ground: 'court',
    magnets: findFormation(DEFAULT_FORMATION_ID)?.build() ?? [],
    arrows: [],
    labels: [],
  };
}

/** Next free jersey number for a side, so adding players is one tap. */
function nextNumber(state: BoardState, kind: MagnetKind): number {
  if (kind === 'ball') return 0;
  const used = new Set(
    state.magnets.filter((magnet) => magnet.kind === kind).map((magnet) => magnet.number),
  );
  for (let candidate = 1; candidate <= 99; candidate += 1) {
    if (!used.has(candidate)) return candidate;
  }
  return 99;
}

/** New magnets land in a tidy row at the far end, like a bench, not on top of each other. */
function spawnSpot(index: number): { x: number; y: number } {
  return {
    x: clamp01(0.13 + (index % 6) * 0.15),
    y: clamp01(0.1 + Math.floor(index / 6) * 0.11),
  };
}

interface TaktikboardToolProps {
  /** 'embed' drops the outer card chrome and never touches the address bar. */
  variant?: 'page' | 'embed';
  className?: string;
}

/**
 * The Taktikboard: board, controls, PNG export and share link.
 *
 * All state lives in React and, when the coach asks for it, in the URL
 * fragment — nothing is posted anywhere, which is what makes the share link
 * possible without an account. The default board is a real 6:0 against a 3:3
 * attack rather than an empty rectangle, so the tool teaches before it is
 * touched.
 * @returns A JSX element rendering the interactive tactic board and its controls.
 */
export default function TaktikboardTool({
  variant = 'page',
  className,
}: TaktikboardToolProps) {
  const [board, setBoard] = useState<BoardState>(buildDefaultBoard);
  const [selection, setSelection] = useState<BoardSelection>(null);
  const [formationId, setFormationId] = useState(DEFAULT_FORMATION_ID);
  const [arrowKind, setArrowKind] = useState<ArrowKind>('laufweg');
  const [notice, setNotice] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [origin, setOrigin] = useState('');

  const boardRef = useRef<HTMLDivElement | null>(null);
  const idRef = useRef(1);
  const announceTimer = useRef<number | undefined>(undefined);
  const hashTimer = useRef<number | undefined>(undefined);
  const isEmbed = variant === 'embed';

  const nextId = useCallback((prefix: string) => {
    idRef.current += 1;
    return `${prefix}${idRef.current}`;
  }, []);

  // A shared board arrives as a fragment. Read it once on mount — never during
  // render, so the server-rendered default and the first client render match.
  useEffect(() => {
    setOrigin(window.location.origin);
    const decoded = decodeBoard(window.location.hash);
    if (!decoded) return;
    if (!decoded.ok) {
      setNotice(
        'Der geteilte Link liess sich nicht lesen – vermutlich wurde er beim Weiterleiten abgeschnitten. Du startest mit der Standardaufstellung.',
      );
      return;
    }
    setBoard(decoded.state);
    setFormationId('');
  }, []);

  // Keep the address bar in step with the board, so the page is bookmarkable
  // and a coach can grab the link without hunting for a button. Debounced and
  // `replaceState`, so dragging a magnet does not fill the back button.
  useEffect(() => {
    if (isEmbed) return;
    window.clearTimeout(hashTimer.current);
    hashTimer.current = window.setTimeout(() => {
      try {
        window.history.replaceState(null, '', `#${encodeBoard(board)}`);
      } catch {
        // Some embedded browsers block history writes; the copy button still works.
      }
    }, 500);
    return () => window.clearTimeout(hashTimer.current);
  }, [board, isEmbed]);

  useEffect(() => () => window.clearTimeout(announceTimer.current), []);

  const announceLater = useCallback((message: string) => {
    window.clearTimeout(announceTimer.current);
    announceTimer.current = window.setTimeout(() => setAnnouncement(message), 400);
  }, []);

  const shareUrl = useMemo(
    () => `${origin}${TAKTIKBOARD_PAGE_PATH}#${encodeBoard(board)}`,
    [origin, board],
  );

  const selectedMagnet =
    selection?.type === 'magnet'
      ? board.magnets.find((magnet) => magnet.id === selection.id)
      : undefined;
  const selectedArrow =
    selection?.type === 'arrow'
      ? board.arrows.find((arrow) => arrow.id === selection.id)
      : undefined;
  const selectedLabel =
    selection?.type === 'label'
      ? board.labels.find((label) => label.id === selection.id)
      : undefined;

  const handleSelect = useCallback(
    (next: BoardSelection) => {
      setSelection(next);
      setNotice(null);
      if (!next) setAnnouncement('Auswahl aufgehoben.');
    },
    [],
  );

  const moveMagnet = useCallback(
    (id: string, x: number, y: number) => {
      setBoard((current) => ({
        ...current,
        magnets: current.magnets.map((magnet) =>
          magnet.id === id ? { ...magnet, x, y } : magnet,
        ),
      }));
      announceLater(
        `Verschoben auf ${Math.round(x * 100)} Prozent von links, ${Math.round(y * 100)} Prozent von oben.`,
      );
    },
    [announceLater],
  );

  const moveArrow = useCallback(
    (id: string, handle: ArrowHandle, x: number, y: number) => {
      setBoard((current) => ({
        ...current,
        arrows: current.arrows.map((arrow) => {
          if (arrow.id !== id) return arrow;
          if (handle === 'start') {
            // Dragging an end drags the curve with it, so the arrow does not
            // suddenly snap into a shape nobody asked for.
            return { ...arrow, x1: x, y1: y, cx: (x + arrow.x2) / 2, cy: (y + arrow.y2) / 2 };
          }
          if (handle === 'end') {
            return { ...arrow, x2: x, y2: y, cx: (arrow.x1 + x) / 2, cy: (arrow.y1 + y) / 2 };
          }
          return { ...arrow, cx: x, cy: y };
        }),
      }));
      announceLater('Pfeil angepasst.');
    },
    [announceLater],
  );

  const moveLabel = useCallback(
    (id: string, x: number, y: number) => {
      setBoard((current) => ({
        ...current,
        labels: current.labels.map((label) =>
          label.id === id ? { ...label, x, y } : label,
        ),
      }));
      announceLater('Notiz verschoben.');
    },
    [announceLater],
  );

  const removeObject = useCallback((target: BoardSelection) => {
    if (!target) return;
    setBoard((current) => ({
      ...current,
      magnets:
        target.type === 'magnet'
          ? current.magnets.filter((magnet) => magnet.id !== target.id)
          : current.magnets,
      arrows:
        target.type === 'arrow'
          ? current.arrows.filter((arrow) => arrow.id !== target.id)
          : current.arrows,
      labels:
        target.type === 'label'
          ? current.labels.filter((label) => label.id !== target.id)
          : current.labels,
    }));
    setSelection(null);
    setAnnouncement('Vom Feld genommen.');
  }, []);

  const applyFormation = useCallback((id: string) => {
    const preset = findFormation(id);
    if (!preset) return;
    setFormationId(id);
    setSelection(null);
    setNotice(null);
    setBoard((current) => ({
      ...current,
      view: preset.view,
      magnets: preset.build(),
    }));
    setAnnouncement(`Aufstellung geladen: ${preset.label}.`);
  }, []);

  const addMagnet = useCallback(
    (kind: MagnetKind) => {
      setNotice(null);
      if (board.magnets.length >= BOARD_CAPACITY.magnets) {
        setNotice(
          `Mehr als ${BOARD_CAPACITY.magnets} Magnete passen nicht auf ein Board – das sind schon zwei komplette Kader. Nimm erst einen herunter.`,
        );
        return;
      }
      const spot = spawnSpot(board.magnets.length);
      const magnet = {
        id: nextId('m'),
        kind,
        number: nextNumber(board, kind),
        x: spot.x,
        y: spot.y,
      };
      setBoard((current) => ({ ...current, magnets: [...current.magnets, magnet] }));
      setSelection({ type: 'magnet', id: magnet.id });
      setAnnouncement(
        kind === 'ball' ? 'Ball aufs Feld gelegt.' : `Magnet ${magnet.number} aufs Feld gesetzt.`,
      );
    },
    [board, nextId],
  );

  const addArrow = useCallback(() => {
    setNotice(null);
    if (board.arrows.length >= BOARD_CAPACITY.arrows) {
      setNotice(`Mehr als ${BOARD_CAPACITY.arrows} Pfeile werden unleserlich. Nimm erst einen weg.`);
      return;
    }
    const shift = (board.arrows.length % 5) * 0.05;
    const x1 = clamp01(0.3 + shift);
    const y1 = clamp01(0.62 - shift);
    const x2 = clamp01(0.58 + shift);
    const y2 = clamp01(0.36 - shift);
    const arrow = {
      id: nextId('a'),
      kind: arrowKind,
      color: 'marker' as ArrowColor,
      x1,
      y1,
      cx: (x1 + x2) / 2,
      cy: (y1 + y2) / 2,
      x2,
      y2,
    };
    setBoard((current) => ({ ...current, arrows: [...current.arrows, arrow] }));
    setSelection({ type: 'arrow', id: arrow.id });
    setAnnouncement('Pfeil hinzugefügt. Anfang und Spitze lassen sich ziehen.');
  }, [arrowKind, board, nextId]);

  const addLabel = useCallback(() => {
    setNotice(null);
    if (board.labels.length >= BOARD_CAPACITY.labels) {
      setNotice(`Mehr als ${BOARD_CAPACITY.labels} Notizen passen nicht aufs Feld.`);
      return;
    }
    const label = {
      id: nextId('l'),
      x: clamp01(0.5 + (board.labels.length % 3) * 0.08),
      y: clamp01(0.18 + (board.labels.length % 4) * 0.09),
      text: 'Sperre',
    };
    setBoard((current) => ({ ...current, labels: [...current.labels, label] }));
    setSelection({ type: 'label', id: label.id });
    setAnnouncement('Notiz hinzugefügt. Text im Feld darunter ändern.');
  }, [board, nextId]);

  const clearBoard = useCallback(() => {
    setSelection(null);
    setFormationId('leer');
    setNotice(null);
    setBoard((current) => ({ ...current, magnets: [], arrows: [], labels: [] }));
    setAnnouncement('Feld geleert.');
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setAnnouncement('Link kopiert.');
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
      setNotice('Kopieren hat der Browser abgelehnt. Der Link steht im Feld daneben – markieren und kopieren.');
    }
  }, [shareUrl]);

  const exportPng = useCallback(async () => {
    const node = boardRef.current;
    if (!node) return;
    setSelection(null);
    setNotice(null);
    setIsExporting(true);
    try {
      // Let the cleared selection paint, and make sure the board's own fonts
      // are decoded — html2canvas draws text with the page's fonts, so a
      // pending web font would export the jersey numbers in a fallback face.
      await document.fonts?.ready;
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(node, {
        // The board paints its own ground; a transparent canvas keeps the
        // rounded corners from turning into white triangles.
        backgroundColor: null,
        scale: 2,
        logging: false,
        ignoreElements: (element) => element.hasAttribute?.('data-board-chrome') ?? false,
      });
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `${EXPORT_FILE_NAME}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setAnnouncement('PNG heruntergeladen.');
    } catch {
      setNotice(
        'Das Bild liess sich nicht erzeugen. Ein Screenshot vom Board tut es genauso – oder du teilst den Link.',
      );
    } finally {
      setIsExporting(false);
    }
  }, []);

  const labelClass = 'block text-[13px] font-semibold uppercase tracking-wide text-ink/60';
  const fieldClass =
    'h-12 w-full rounded-xl border border-ink/15 bg-paper px-3.5 text-base text-ink outline-none transition-colors placeholder:text-ink/40 hover:border-ink/25 focus:border-primary focus:ring-2 focus:ring-primary/25';
  const actionClass =
    'inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-xl border border-ink/15 bg-paper px-3 text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-paper-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-55';
  const blockTitleClass = 'font-display text-[15px] font-bold tracking-tight text-ink';

  return (
    <div className={cn('w-full', className)}>
      <div className='grid gap-5 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:gap-6'>
        {/* The board sits in a frame, the way a magnetic board hangs in a rail —
            and so it stays visible when its own ground matches the band behind it. */}
        <div className='rounded-[1.25rem] border border-chalk/15 bg-court-2 p-2 shadow-[0_20px_46px_-28px_hsl(222_40%_4%/0.9)] sm:p-2.5'>
          <BoardCanvas
            state={board}
            selection={selection}
            onSelect={handleSelect}
            onMoveMagnet={moveMagnet}
            onMoveArrow={moveArrow}
            onMoveLabel={moveLabel}
            onRemove={removeObject}
            boardRef={boardRef}
            describedById='taktikboard-keyboard-hilfe'
          />
        </div>

        <div className='rounded-2xl border border-ink/10 bg-paper p-4 sm:p-5'>
          <p id='taktikboard-keyboard-hilfe' className='sr-only'>
            Mit Tab erreichst du jeden Magneten, jeden Pfeilgriff und jede Notiz.
            Die Pfeiltasten verschieben das ausgewählte Objekt, mit gedrückter
            Umschalttaste in größeren Schritten. Entfernen-Taste nimmt es vom
            Feld.
          </p>
          <p aria-live='polite' className='sr-only'>
            {announcement}
          </p>

          <div>
            <label className={labelClass} htmlFor='taktikboard-aufstellung'>
              Fertige Aufstellung
            </label>
            <select
              id='taktikboard-aufstellung'
              value={formationId}
              onChange={(event) => applyFormation(event.target.value)}
              className={cn(fieldClass, 'mt-1.5 cursor-pointer font-semibold')}>
              {formationId === '' ? (
                <option value=''>Geteiltes Board</option>
              ) : null}
              {/* Grouped by court, so it is obvious which setup switches the
                  view — a Tempogegenstoß cannot be shown on a half field. */}
              {COURT_VIEW_LIST.map((courtView) => (
                <optgroup key={courtView.id} label={courtView.label}>
                  {FORMATION_PRESETS.filter((preset) => preset.view === courtView.id).map(
                    (preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.label}
                      </option>
                    ),
                  )}
                </optgroup>
              ))}
            </select>
            <p className='mt-2 text-[13px] leading-6 text-ink/60'>
              {findFormation(formationId)?.hint ??
                'Dieses Board kommt aus einem geteilten Link. Wähl eine Aufstellung, wenn du neu anfangen willst.'}
            </p>
          </div>

          <div className='mt-5 border-t border-ink/10 pt-4'>
            <p className={blockTitleClass}>Magnet aufs Feld</p>
            <div className='mt-2.5 grid grid-cols-2 gap-2'>
              {MAGNET_KIND_OPTIONS.map((option) => (
                <button
                  key={option.kind}
                  type='button'
                  onClick={() => addMagnet(option.kind)}
                  aria-label={option.action}
                  className={actionClass}>
                  <span
                    aria-hidden='true'
                    className='size-3.5 shrink-0 rounded-full border border-ink/15'
                    style={{ background: MAGNET_COLORS[option.kind].surface }}
                  />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className='mt-5 border-t border-ink/10 pt-4'>
            <p className={blockTitleClass}>Pfeile und Notizen</p>
            <label className={cn(labelClass, 'mt-3')} htmlFor='taktikboard-pfeilart'>
              Art des Pfeils
            </label>
            <select
              id='taktikboard-pfeilart'
              value={arrowKind}
              onChange={(event) => setArrowKind(event.target.value as ArrowKind)}
              className={cn(fieldClass, 'mt-1.5 cursor-pointer')}>
              {ARROW_KIND_OPTIONS.map((option) => (
                <option key={option.kind} value={option.kind}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className='mt-2 text-[13px] leading-6 text-ink/60'>
              {ARROW_KIND_OPTIONS.find((option) => option.kind === arrowKind)?.hint}
            </p>
            <div className='mt-3 grid grid-cols-2 gap-2'>
              <button type='button' onClick={addArrow} className={actionClass}>
                Pfeil hinzufügen
              </button>
              <button type='button' onClick={addLabel} className={actionClass}>
                Notiz hinzufügen
              </button>
            </div>
          </div>

          <div className='mt-5 border-t border-ink/10 pt-4'>
            <p className={blockTitleClass}>Ausgewähltes Objekt</p>
            {selectedMagnet ? (
              <div className='mt-3'>
                {selectedMagnet.kind === 'ball' ? (
                  <p className='text-[15px] leading-7 text-ink/75'>
                    Der Ball ist ausgewählt. Zieh ihn an seinen Platz.
                  </p>
                ) : (
                  <>
                    <label className={labelClass} htmlFor='taktikboard-nummer'>
                      Rückennummer
                    </label>
                    <input
                      id='taktikboard-nummer'
                      type='number'
                      inputMode='numeric'
                      min={0}
                      max={99}
                      value={selectedMagnet.number}
                      onChange={(event) => {
                        const parsed = Number.parseInt(event.target.value, 10);
                        const number = Number.isFinite(parsed)
                          ? Math.min(99, Math.max(0, parsed))
                          : 0;
                        setBoard((current) => ({
                          ...current,
                          magnets: current.magnets.map((magnet) =>
                            magnet.id === selectedMagnet.id ? { ...magnet, number } : magnet,
                          ),
                        }));
                      }}
                      className={cn(fieldClass, 'mt-1.5 w-28 font-semibold tabular-nums')}
                    />
                  </>
                )}
                <button
                  type='button'
                  onClick={() => removeObject(selection)}
                  className={cn(actionClass, 'mt-3 w-full')}>
                  <Trash2 className='size-4' aria-hidden='true' />
                  Vom Feld nehmen
                </button>
              </div>
            ) : selectedArrow ? (
              <div className='mt-3 space-y-3'>
                <div>
                  <label className={labelClass} htmlFor='taktikboard-pfeilfarbe'>
                    Farbe
                  </label>
                  <select
                    id='taktikboard-pfeilfarbe'
                    value={selectedArrow.color}
                    onChange={(event) =>
                      setBoard((current) => ({
                        ...current,
                        arrows: current.arrows.map((arrow) =>
                          arrow.id === selectedArrow.id
                            ? { ...arrow, color: event.target.value as ArrowColor }
                            : arrow,
                        ),
                      }))
                    }
                    className={cn(fieldClass, 'mt-1.5 cursor-pointer')}>
                    {ARROW_COLOR_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type='button'
                  onClick={() => removeObject(selection)}
                  className={cn(actionClass, 'w-full')}>
                  <Trash2 className='size-4' aria-hidden='true' />
                  Pfeil löschen
                </button>
              </div>
            ) : selectedLabel ? (
              <div className='mt-3 space-y-3'>
                <div>
                  <label className={labelClass} htmlFor='taktikboard-notiz'>
                    Text der Notiz
                  </label>
                  <input
                    id='taktikboard-notiz'
                    type='text'
                    maxLength={LABEL_MAX_CHARS}
                    value={selectedLabel.text}
                    onChange={(event) => {
                      const text = sanitizeLabel(event.target.value);
                      setBoard((current) => ({
                        ...current,
                        labels: current.labels.map((label) =>
                          label.id === selectedLabel.id ? { ...label, text } : label,
                        ),
                      }));
                    }}
                    className={cn(fieldClass, 'mt-1.5')}
                  />
                  <p className='mt-1.5 text-[13px] text-ink/55'>
                    Höchstens {LABEL_MAX_CHARS} Zeichen – auf dem Board soll ein Wort stehen, kein Satz.
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => removeObject(selection)}
                  className={cn(actionClass, 'w-full')}>
                  <Trash2 className='size-4' aria-hidden='true' />
                  Notiz löschen
                </button>
              </div>
            ) : (
              <p className='mt-3 text-[15px] leading-7 text-ink/70'>
                Tipp einen Magneten, einen Pfeilgriff oder eine Notiz an – dann
                kannst du hier die Nummer, die Farbe oder den Text ändern.
              </p>
            )}
          </div>

          <div className='mt-5 border-t border-ink/10 pt-4'>
            <p className={blockTitleClass}>Feld und Untergrund</p>
            <div className='mt-2.5 grid grid-cols-2 gap-2'>
              {COURT_VIEW_LIST.map((courtView) => (
                <button
                  key={courtView.id}
                  type='button'
                  aria-pressed={board.view === courtView.id}
                  onClick={() =>
                    setBoard((current) => ({ ...current, view: courtView.id as CourtViewId }))
                  }
                  className={cn(
                    actionClass,
                    board.view === courtView.id && 'border-primary bg-primary/10 text-primary',
                  )}>
                  {courtView.label}
                </button>
              ))}
            </div>
            <div className='mt-2 grid grid-cols-2 gap-2'>
              {GROUND_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type='button'
                  aria-pressed={board.ground === option.value}
                  onClick={() => setBoard((current) => ({ ...current, ground: option.value }))}
                  className={cn(
                    actionClass,
                    board.ground === option.value && 'border-primary bg-primary/10 text-primary',
                  )}>
                  <span
                    aria-hidden='true'
                    className='size-3.5 shrink-0 rounded-full border border-ink/20'
                    style={{ background: BOARD_GROUNDS[option.value].surface }}
                  />
                  {option.label}
                </button>
              ))}
            </div>
            <p className='mt-2 text-[13px] leading-6 text-ink/60'>
              {COURT_VIEW_LIST.find((courtView) => courtView.id === board.view)?.hint}{' '}
              Papier spart Druckertinte, wenn das Board an die Kabinenwand soll.
            </p>
          </div>

          <div className='mt-5 border-t border-ink/10 pt-4'>
            <p className={blockTitleClass}>Board weitergeben</p>
            <div className='mt-2.5 grid gap-2 sm:grid-cols-2'>
              <button
                type='button'
                onClick={exportPng}
                disabled={isExporting}
                className={cn(
                  actionClass,
                  'border-primary bg-primary text-white hover:border-primary hover:brightness-95',
                )}>
                <Download className='size-4' aria-hidden='true' />
                {isExporting ? 'Wird erzeugt …' : 'PNG herunterladen'}
              </button>
              <button type='button' onClick={copyLink} className={actionClass}>
                {copied ? (
                  <Check className='size-4' aria-hidden='true' />
                ) : (
                  <Link2 className='size-4' aria-hidden='true' />
                )}
                {copied ? 'Link kopiert' : 'Link kopieren'}
              </button>
            </div>
            <label className={cn(labelClass, 'mt-3')} htmlFor='taktikboard-link'>
              Teilen-Link
            </label>
            <div className='mt-1.5 flex gap-2'>
              <input
                id='taktikboard-link'
                type='text'
                readOnly
                value={shareUrl}
                onFocus={(event) => event.currentTarget.select()}
                className={cn(fieldClass, 'flex-1 text-[13px]')}
              />
              <button
                type='button'
                onClick={copyLink}
                aria-label='Teilen-Link in die Zwischenablage kopieren'
                className={cn(actionClass, 'shrink-0 px-3')}>
                <Copy className='size-4' aria-hidden='true' />
              </button>
            </div>
            <p className='mt-2 text-[13px] leading-6 text-ink/60'>
              Im Link steckt das komplette Board. Nichts davon wird gespeichert –
              der Teil hinter dem Rautezeichen verlässt deinen Browser nie.
            </p>
            <button
              type='button'
              onClick={clearBoard}
              className={cn(actionClass, 'mt-3 w-full')}>
              <Trash2 className='size-4' aria-hidden='true' />
              Feld leeren
            </button>
          </div>

          {notice ? (
            <p
              role='status'
              className='mt-4 rounded-xl border border-secondary/30 bg-secondary/10 px-3.5 py-3 text-[14px] leading-6 text-ink'>
              {notice}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
