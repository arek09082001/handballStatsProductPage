'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import BoardCanvas from './board-canvas';
import BoardRail from './board-rail';
import BoardSettings from './board-settings';
import {
  DEFAULT_FORMATION_ID,
  findFormation,
} from '../data/formations';
import {
  BOARD_CAPACITY,
  BOARD_MODE_OPTIONS,
  EXPORT_FILE_NAME,
  TAKTIKBOARD_PAGE_PATH,
} from '../data/taktikboard-content';
import { COURT_VIEWS } from '../data/court-geometry';
import { clamp01, decodeBoard, encodeBoard, sanitizeLabel } from '../lib/board-share';
import type {
  ArrowColor,
  ArrowHandle,
  ArrowKind,
  BoardArrow,
  BoardMagnet,
  BoardMode,
  BoardSelection,
  BoardState,
  CourtViewId,
  MagnetKind,
} from '../interfaces';

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
  /** 'embed' never touches the address bar. */
  variant?: 'page' | 'embed';
  className?: string;
}

/**
 * The Taktikboard: tool strip, board, setup and the two ways out.
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
  const [mode, setMode] = useState<BoardMode>('move');
  const [editorId, setEditorId] = useState<string | null>(null);
  const [arrowKind, setArrowKind] = useState<ArrowKind>('laufweg');
  const [arrowColor, setArrowColor] = useState<ArrowColor>('marker');
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

  const activeMode = BOARD_MODE_OPTIONS.find((option) => option.mode === mode);

  /**
   * Room for a board that still fits on screen, plus the rail on one side and
   * the spacer that balances it on the other. The half court is nearly square,
   * so a board sized off the column width alone runs off the bottom of a
   * laptop; the height is what binds. 8.5rem is the rail and its gap counted
   * twice, so the court lands on the page's centre line instead of half a rail
   * to the right of it.
   */
  const containerMaxWidth = `min(100%, calc(82vh * ${COURT_VIEWS[board.view].aspectRatio} + 8.5rem), 1200px)`;

  const handleSelect = useCallback((next: BoardSelection) => {
    setSelection(next);
    setNotice(null);
  }, []);

  /** Picking up a different tool always leaves the board in a known state. */
  const changeMode = useCallback((next: BoardMode) => {
    setMode(next);
    setEditorId(null);
  }, []);

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

  const changeMagnet = useCallback((id: string, patch: Partial<BoardMagnet>) => {
    setBoard((current) => ({
      ...current,
      magnets: current.magnets.map((magnet) =>
        magnet.id === id ? { ...magnet, ...patch } : magnet,
      ),
    }));
  }, []);

  const changeArrow = useCallback((id: string, patch: Partial<BoardArrow>) => {
    setBoard((current) => ({
      ...current,
      arrows: current.arrows.map((arrow) => (arrow.id === id ? { ...arrow, ...patch } : arrow)),
    }));
  }, []);

  const changeLabel = useCallback((id: string, text: string) => {
    const clean = sanitizeLabel(text);
    setBoard((current) => ({
      ...current,
      labels: current.labels.map((label) =>
        label.id === id ? { ...label, text: clean } : label,
      ),
    }));
  }, []);

  const removeObject = useCallback((target: BoardSelection) => {
    if (!target) return;
    setEditorId(null);
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
    setEditorId(null);
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
      setMode('move');
      setAnnouncement(
        kind === 'ball' ? 'Ball aufs Feld gelegt.' : `Magnet ${magnet.number} aufs Feld gesetzt.`,
      );
    },
    [board, nextId],
  );

  const createArrow = useCallback(
    (x1: number, y1: number, x2: number, y2: number) => {
      setNotice(null);
      if (board.arrows.length >= BOARD_CAPACITY.arrows) {
        setNotice(`Mehr als ${BOARD_CAPACITY.arrows} Pfeile werden unleserlich. Nimm erst einen weg.`);
        return;
      }
      const arrow = {
        id: nextId('a'),
        kind: arrowKind,
        color: arrowColor,
        x1,
        y1,
        cx: (x1 + x2) / 2,
        cy: (y1 + y2) / 2,
        x2,
        y2,
      };
      setBoard((current) => ({ ...current, arrows: [...current.arrows, arrow] }));
      setSelection({ type: 'arrow', id: arrow.id });
      setAnnouncement('Pfeil gezeichnet.');
    },
    [arrowColor, arrowKind, board.arrows.length, nextId],
  );

  const createLabel = useCallback(
    (x: number, y: number) => {
      setNotice(null);
      if (board.labels.length >= BOARD_CAPACITY.labels) {
        setNotice(`Mehr als ${BOARD_CAPACITY.labels} Notizen passen nicht aufs Feld.`);
        return;
      }
      const label = { id: nextId('l'), x: clamp01(x), y: clamp01(y), text: 'Sperre' };
      setBoard((current) => ({ ...current, labels: [...current.labels, label] }));
      setSelection({ type: 'label', id: label.id });
      // Placing a note is never the whole intent — the text is. Open the editor
      // on it straight away and hand the move tool back, so the coach types and
      // is done instead of hunting for a second gesture.
      setEditorId(label.id);
      setMode('move');
      setAnnouncement('Notiz gesetzt. Text eingeben und mit Fertig bestätigen.');
    },
    [board.labels.length, nextId],
  );

  const clearBoard = useCallback(() => {
    setSelection(null);
    setEditorId(null);
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
    setEditorId(null);
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

  return (
    <div className={cn('w-full', className)}>
      <p id='taktikboard-keyboard-hilfe' className='sr-only'>
        Mit Tab erreichst du jeden Magneten, jeden Pfeilgriff und jede Notiz. Die
        Pfeiltasten verschieben das ausgewählte Objekt, mit gedrückter
        Umschalttaste in größeren Schritten. Die Eingabetaste öffnet Nummer und
        Farbe, die Entfernen-Taste nimmt das Objekt vom Feld.
      </p>
      <p aria-live='polite' className='sr-only'>
        {announcement}
      </p>

      {/* Rail beside the board from lg up, above it on a phone. The container
          is only as wide as the rail plus a board that still fits the viewport
          height, so the court reads as the main object on the page instead of
          sitting inside a full-width card. */}
      <div className='mx-auto w-full' style={{ maxWidth: containerMaxWidth }}>
        <div className='flex flex-col gap-3 lg:flex-row lg:items-start'>
          <BoardRail
            mode={mode}
            arrowKind={arrowKind}
            arrowColor={arrowColor}
            onModeChange={changeMode}
            onArrowKindChange={setArrowKind}
            onArrowColorChange={setArrowColor}
            onAddMagnet={addMagnet}
          />

          <div className='min-w-0 flex-1'>
            {/* The board sits in a frame, the way a magnetic board hangs in a
                rail — and so it stays visible when its own ground matches the
                band behind it. */}
            <div className='rounded-[1.25rem] border border-chalk/15 bg-court-2 p-2 shadow-[0_20px_46px_-28px_hsl(222_40%_4%/0.9)] sm:p-2.5'>
              <BoardCanvas
                state={board}
                mode={mode}
                arrowKind={arrowKind}
                arrowColor={arrowColor}
                selection={selection}
                onSelect={handleSelect}
                onMoveMagnet={moveMagnet}
                onMoveArrow={moveArrow}
                onMoveLabel={moveLabel}
                onRemove={removeObject}
                onCreateArrow={createArrow}
                onCreateLabel={createLabel}
                onChangeMagnet={changeMagnet}
                onChangeArrow={changeArrow}
                onChangeLabel={changeLabel}
                editorId={editorId}
                onEditorChange={setEditorId}
                boardRef={boardRef}
                describedById='taktikboard-keyboard-hilfe'
              />
            </div>

            {/* The rail has no labels, so the active tool says out loud what a
                drag will do. */}
            <p aria-live='polite' className='mt-2 text-[12.5px] leading-5 text-chalk/60'>
              {activeMode?.hint}
            </p>
          </div>

          {/* Balances the rail so the court sits on the page's centre line and
              not half a rail to the right of it. */}
          <span aria-hidden='true' className='hidden w-14 shrink-0 lg:block' />
        </div>

        {notice ? (
          <p
            role='status'
            className='mt-3 rounded-xl border border-secondary/30 bg-secondary/10 px-3.5 py-3 text-[14px] leading-6 text-ink'>
            {notice}
          </p>
        ) : null}

      </div>

      {/* Outside the board-width wrapper on purpose: the board is capped by the
          viewport height, and a select plus three buttons squeezed into that
          same narrow column wrapped into a tall stack for no reason. */}
      <BoardSettings
        className='mt-4'
        formationId={formationId}
        view={board.view}
        shareUrl={shareUrl}
        copied={copied}
        isExporting={isExporting}
        onFormationChange={applyFormation}
        onViewChange={(view: CourtViewId) => {
          setEditorId(null);
          setBoard((current) => ({ ...current, view }));
        }}
        onExport={exportPng}
        onCopyLink={copyLink}
        onClear={clearBoard}
      />
    </div>
  );
}
