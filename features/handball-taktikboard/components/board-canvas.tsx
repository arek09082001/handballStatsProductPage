'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { COURT_VIEWS, toViewBoxPoint, type CourtView } from '../data/court-geometry';
import {
  BOARD_GROUNDS,
  MAGNET_COLORS,
  MAGNET_SHADOW,
  NOTE_FONT_FAMILY,
  arrowStroke,
} from '../data/board-palette';
import { EXPORT_WATERMARK, MAGNET_KIND_OPTIONS } from '../data/taktikboard-content';
import BoardObjectEditor, { type EditorTarget } from './board-object-editor';
import { DEFAULT_NUMBER_NUDGE, measureNumberNudge } from '../lib/number-centring';
import type {
  ArrowColor,
  ArrowHandle,
  ArrowKind,
  BoardArrow,
  BoardLabel,
  BoardMagnet,
  BoardMode,
  BoardSelection,
  BoardState,
} from '../interfaces';

/** Keyboard nudge: one press ≈ 1.7 % of the court, Shift ≈ 8 %. */
const NUDGE = 1 / 60;
const NUDGE_COARSE = NUDGE * 5;

/** Hit area of every grab handle. Never below the 44 px touch floor. */
const HANDLE_HIT = 44;

/** Below this many pixels a pointer gesture counts as a tap, not a drag. */
const TAP_SLOP = 10;

/** Two taps closer together than this open the editor. */
const DOUBLE_TAP_MS = 400;

/** Hold this long without moving and the editor opens — the tablet gesture. */
const LONG_PRESS_MS = 500;

interface DragContext {
  pointerId: number;
  rect: DOMRect;
  /** Offset between the pointer and the object's stored centre, normalised. */
  dx: number;
  dy: number;
  /** Half the object's size in normalised units, so it cannot leave the court. */
  insetX: number;
  insetY: number;
  startClientX: number;
  startClientY: number;
  moved: boolean;
}

interface DrawContext {
  pointerId: number;
  rect: DOMRect;
  x1: number;
  y1: number;
  startClientX: number;
  startClientY: number;
}

interface BoardCanvasProps {
  state: BoardState;
  mode: BoardMode;
  arrowKind: ArrowKind;
  arrowColor: ArrowColor;
  selection: BoardSelection;
  onSelect: (selection: BoardSelection) => void;
  onMoveMagnet: (id: string, x: number, y: number) => void;
  onMoveArrow: (id: string, handle: ArrowHandle, x: number, y: number) => void;
  onMoveLabel: (id: string, x: number, y: number) => void;
  onRemove: (selection: BoardSelection) => void;
  onCreateArrow: (x1: number, y1: number, x2: number, y2: number) => void;
  onCreateLabel: (x: number, y: number) => void;
  onChangeMagnet: (id: string, patch: Partial<BoardMagnet>) => void;
  onChangeArrow: (id: string, patch: Partial<BoardArrow>) => void;
  onChangeLabel: (id: string, text: string) => void;
  /** Id of the object whose on-board editor is open, or null. Owned by the
   *  tool so that switching a tool or loading a formation can close it. */
  editorId: string | null;
  onEditorChange: (id: string | null) => void;
  /** html2canvas renders exactly this node. */
  boardRef: React.RefObject<HTMLDivElement | null>;
  /**
   * Forces the board's pixel width instead of measuring it. Set only by the
   * off-screen copy the PNG is rendered from, so an export looks the same
   * whether the coach is on a phone or a beamer.
   */
  renderWidth?: number;
  /** Id of the hidden paragraph that explains the keyboard controls. */
  describedById: string;
}

function clampTo(value: number, inset: number): number {
  return Math.min(1 - inset, Math.max(inset, value));
}

function kindLabel(kind: string): string {
  return MAGNET_KIND_OPTIONS.find((option) => option.kind === kind)?.label ?? 'Magnet';
}

/**
 * The board itself: a to-scale court with draggable magnets, arrows and notes
 * on top of it.
 *
 * Two rendering layers on purpose. The court and the arrows are one SVG so the
 * geometry stays exact at any size; the magnets and notes are ordinary HTML
 * buttons so they are keyboard-reachable, carry real accessible names, and — as
 * html2canvas draws HTML text with the page's own fonts but rasterises an SVG
 * into an isolated image — so the jersey numbers survive the PNG export in
 * Archivo instead of a fallback face.
 *
 * Dragging uses raw pointer events rather than the installed
 * `@hello-pangea/dnd`: that library reorders items in a list, and a tactic
 * board needs free two-dimensional placement, pointer capture, and an
 * immediate response on touch instead of the hold delay a list drag needs to
 * stay compatible with scrolling.
 * @returns A JSX element rendering the interactive tactic board.
 */
export default function BoardCanvas({
  state,
  mode,
  arrowKind,
  arrowColor,
  selection,
  onSelect,
  onMoveMagnet,
  onMoveArrow,
  onMoveLabel,
  onRemove,
  onCreateArrow,
  onCreateLabel,
  onChangeMagnet,
  onChangeArrow,
  onChangeLabel,
  editorId,
  onEditorChange,
  boardRef,
  renderWidth,
  describedById,
}: BoardCanvasProps) {
  const view: CourtView = COURT_VIEWS[state.view];
  const ground = BOARD_GROUNDS[state.ground];
  const dragRef = useRef<DragContext | null>(null);
  const drawRef = useRef<DrawContext | null>(null);
  const lastTapRef = useRef<{ id: string; at: number }>({ id: '', at: 0 });
  const longPressRef = useRef<number | undefined>(undefined);
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const [draft, setDraft] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(
    null,
  );
  const [numberNudge, setNumberNudge] = useState(DEFAULT_NUMBER_NUDGE);

  /**
   * True for the off-screen copy the PNG is rendered from: a fixed width, no
   * grab handles, nothing in the tab order. Everything else — geometry, colours,
   * token sizing — runs through exactly the same code as the live board, which
   * is what keeps the export honest.
   */
  const isStatic = renderWidth !== undefined;
  const drawing = !isStatic && mode !== 'move';
  const boardWidth = renderWidth ?? measuredWidth;

  // The magnet has to be a real pixel size, not a percentage: it carries the
  // 44 px touch floor on a phone and must not grow into a beer mat on a beamer.
  useEffect(() => {
    const node = boardRef.current;
    if (!node || isStatic) return;
    const observer = new ResizeObserver((entries) => {
      setMeasuredWidth(entries[0]?.contentRect.width ?? 0);
    });
    observer.observe(node);
    setMeasuredWidth(node.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, [boardRef, isStatic]);

  useEffect(() => () => window.clearTimeout(longPressRef.current), []);

  // Optical centring for the jersey numbers, measured on the font that actually
  // rendered. Waits for the web font, because calibrating against the fallback
  // and then swapping in Archivo would leave the numbers off by the difference.
  useEffect(() => {
    let cancelled = false;
    const apply = () => {
      if (!cancelled) setNumberNudge(measureNumberNudge());
    };
    document.fonts?.ready.then(apply, apply) ?? apply();
    return () => {
      cancelled = true;
    };
  }, []);

  // Tokens are sized off the board's *height*, which is the short side in both
  // views. Sizing off the width would put the same magnet on a 700 px tall half
  // court and on a 420 px tall full court, where it reads as three metres of
  // player. Kept small on purpose: the court is the information, the magnets
  // are markers on it.
  const shortSide = (boardWidth || 520) / view.aspectRatio;

  // The visible token and the thing you grab are two different sizes. A 6:0
  // chain is six players across eleven metres; on a phone that is less than
  // 44 px each, so forcing the disc to the touch floor would turn the defence
  // into one orange blob. The disc shrinks with the board, the invisible hit
  // area never drops below 44 px, and overlapping hit areas are harmless — you
  // still aim at a disc you can see.
  const magnetSize = Math.round(Math.min(48, Math.max(26, shortSide * 0.072)));
  const magnetHit = Math.max(HANDLE_HIT, magnetSize);
  const numberFontSize = Math.round(magnetSize * 0.5);
  const noteFontSize = Math.round(Math.min(22, Math.max(14, shortSide * 0.034)));
  const boardHeight = boardWidth / view.aspectRatio;

  /** Normalised radius of a magnet, used to snap an arrow end onto a player. */
  const snapRadius = boardWidth > 0 ? magnetSize / 1.6 / boardWidth : 0.05;

  const toNormalised = useCallback((clientX: number, clientY: number, rect: DOMRect) => {
    return {
      x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
    };
  }, []);

  /**
   * Snaps an arrow end to a nearby magnet, so "Laufweg von der Sieben" does not
   * require hitting a 30 px disc exactly.
   */
  const snap = useCallback(
    (point: { x: number; y: number }) => {
      let best: { x: number; y: number } | null = null;
      let bestDistance = snapRadius;
      for (const magnet of state.magnets) {
        const dx = (magnet.x - point.x) * (boardWidth || 1);
        const dy = (magnet.y - point.y) * (boardHeight || 1);
        const distance = Math.hypot(dx, dy) / (boardWidth || 1);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = { x: magnet.x, y: magnet.y };
        }
      }
      return best ?? point;
    },
    [state.magnets, snapRadius, boardWidth, boardHeight],
  );

  /**
   * Moves an arrow end that snapped onto a player out to the edge of that
   * player's token, pointing at the other end.
   *
   * Two reasons, and both matter on a board. A line that starts in the middle
   * of a disc reads as a line *through* the player rather than *from* them; and
   * an arrow grab handle parked on a magnet's centre covers it, so after
   * drawing one Laufweg the coach could no longer pick that player up.
   */
  const pushOutOfMagnet = useCallback(
    (point: { x: number; y: number }, towards: { x: number; y: number }) => {
      const onMagnet = state.magnets.some(
        (magnet) => magnet.x === point.x && magnet.y === point.y,
      );
      if (!onMagnet || boardWidth === 0) return point;

      const dx = (towards.x - point.x) * boardWidth;
      const dy = (towards.y - point.y) * boardHeight;
      const length = Math.hypot(dx, dy);
      if (length < 1) return point;

      const push = magnetSize / 2 + 5;
      return {
        x: Math.min(1, Math.max(0, point.x + ((dx / length) * push) / boardWidth)),
        y: Math.min(1, Math.max(0, point.y + ((dy / length) * push) / boardHeight)),
      };
    },
    [state.magnets, boardWidth, boardHeight, magnetSize],
  );

  // ---------------------------------------------------------------------
  // Drawing on the court
  // ---------------------------------------------------------------------

  const handleCourtPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement | SVGElement>) => {
      onEditorChange(null);
      if (!drawing) {
        onSelect(null);
        return;
      }
      const node = boardRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      if (rect.width === 0) return;

      event.preventDefault();
      const start = snap(toNormalised(event.clientX, event.clientY, rect));
      drawRef.current = {
        pointerId: event.pointerId,
        rect,
        x1: start.x,
        y1: start.y,
        startClientX: event.clientX,
        startClientY: event.clientY,
      };
      node.setPointerCapture(event.pointerId);
      if (mode === 'arrow') setDraft({ x1: start.x, y1: start.y, x2: start.x, y2: start.y });
    },
    [drawing, mode, onSelect, onEditorChange, boardRef, snap, toNormalised],
  );

  const handleCourtPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const draw = drawRef.current;
      if (!draw || draw.pointerId !== event.pointerId || mode !== 'arrow') return;
      const end = toNormalised(event.clientX, event.clientY, draw.rect);
      const start = pushOutOfMagnet({ x: draw.x1, y: draw.y1 }, end);
      setDraft({ x1: start.x, y1: start.y, x2: end.x, y2: end.y });
    },
    [mode, pushOutOfMagnet, toNormalised],
  );

  const handleCourtPointerUp = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const draw = drawRef.current;
      if (!draw || draw.pointerId !== event.pointerId) return;
      drawRef.current = null;
      setDraft(null);
      if (boardRef.current?.hasPointerCapture(event.pointerId)) {
        boardRef.current.releasePointerCapture(event.pointerId);
      }

      const travelled = Math.hypot(
        event.clientX - draw.startClientX,
        event.clientY - draw.startClientY,
      );

      if (mode === 'note') {
        onCreateLabel(draw.x1, draw.y1);
        return;
      }

      if (travelled < TAP_SLOP) {
        // A tap and not a drag: lay down an arrow of a usable default length,
        // pointing towards the goal, so a single tap is never a dead gesture.
        const dy = state.view === 'halbfeld' ? 0.13 : 0;
        const dx = state.view === 'halbfeld' ? 0 : 0.13;
        onCreateArrow(
          Math.min(1, Math.max(0, draw.x1 - dx)),
          Math.min(1, Math.max(0, draw.y1 - dy)),
          Math.min(1, Math.max(0, draw.x1 + dx)),
          Math.min(1, Math.max(0, draw.y1 + dy)),
        );
        return;
      }

      const rawEnd = snap(toNormalised(event.clientX, event.clientY, draw.rect));
      const start = pushOutOfMagnet({ x: draw.x1, y: draw.y1 }, rawEnd);
      const end = pushOutOfMagnet(rawEnd, start);
      onCreateArrow(start.x, start.y, end.x, end.y);
    },
    [
      mode,
      state.view,
      onCreateArrow,
      onCreateLabel,
      boardRef,
      snap,
      pushOutOfMagnet,
      toNormalised,
    ],
  );

  // ---------------------------------------------------------------------
  // Moving objects
  // ---------------------------------------------------------------------

  const beginDrag = useCallback(
    (
      event: React.PointerEvent<HTMLElement>,
      position: { x: number; y: number },
      size: { width: number; height: number },
    ) => {
      const node = boardRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = {
        pointerId: event.pointerId,
        rect,
        dx: (event.clientX - rect.left) / rect.width - position.x,
        dy: (event.clientY - rect.top) / rect.height - position.y,
        insetX: size.width / 2 / rect.width,
        insetY: size.height / 2 / rect.height,
        startClientX: event.clientX,
        startClientY: event.clientY,
        moved: false,
      };
    },
    [boardRef],
  );

  const readDrag = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return null;
    if (
      Math.hypot(event.clientX - drag.startClientX, event.clientY - drag.startClientY) > TAP_SLOP
    ) {
      drag.moved = true;
      window.clearTimeout(longPressRef.current);
    }
    const x = (event.clientX - drag.rect.left) / drag.rect.width - drag.dx;
    const y = (event.clientY - drag.rect.top) / drag.rect.height - drag.dy;
    return { x: clampTo(x, drag.insetX), y: clampTo(y, drag.insetY) };
  }, []);

  const endDrag = useCallback((event: React.PointerEvent<HTMLElement>) => {
    window.clearTimeout(longPressRef.current);
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  /**
   * The three ways onto the editor without a menu: hold, tap twice, or
   * right-click. All of them land on the object itself.
   */
  const armGestures = useCallback(
    (event: React.PointerEvent<HTMLElement>, id: string) => {
      window.clearTimeout(longPressRef.current);
      longPressRef.current = window.setTimeout(() => {
        if (!dragRef.current?.moved) onEditorChange(id);
      }, LONG_PRESS_MS);

      const now = event.timeStamp;
      const last = lastTapRef.current;
      if (last.id === id && now - last.at < DOUBLE_TAP_MS) {
        window.clearTimeout(longPressRef.current);
        onEditorChange(id);
        lastTapRef.current = { id: '', at: 0 };
      } else {
        lastTapRef.current = { id, at: now };
      }
    },
    [onEditorChange],
  );

  /** Arrow-key nudging, shared by magnets, notes and arrow handles. */
  const nudge = useCallback(
    (
      event: React.KeyboardEvent,
      position: { x: number; y: number },
      apply: (x: number, y: number) => void,
      remove?: () => void,
    ) => {
      const step = event.shiftKey ? NUDGE_COARSE : NUDGE;
      let { x, y } = position;

      switch (event.key) {
        case 'ArrowLeft':
          x -= step;
          break;
        case 'ArrowRight':
          x += step;
          break;
        case 'ArrowUp':
          y -= step;
          break;
        case 'ArrowDown':
          y += step;
          break;
        case 'Delete':
        case 'Backspace':
          if (!remove) return;
          event.preventDefault();
          remove();
          return;
        default:
          return;
      }

      event.preventDefault();
      apply(Math.min(1, Math.max(0, x)), Math.min(1, Math.max(0, y)));
    },
    [],
  );

  /**
   * The selected object wears a ring drawn as a box-shadow rather than an
   * outline, so it never collides with the keyboard focus ring — a coach
   * tabbing through the board has to be able to tell "focused" from "selected".
   * The export clears the selection first, so no ring reaches the PNG.
   */
  const selectionRing = (isSelected: boolean, base?: string) => {
    const ring = `0 0 0 3px ${ground.selection}`;
    if (!isSelected) return base;
    return base ? `${ring}, ${base}` : ring;
  };

  const editorTarget: EditorTarget | null = (() => {
    if (!editorId) return null;
    const magnet = state.magnets.find((item) => item.id === editorId);
    if (magnet) return { type: 'magnet', object: magnet };
    const arrow = state.arrows.find((item) => item.id === editorId);
    if (arrow) return { type: 'arrow', object: arrow };
    const label = state.labels.find((item) => item.id === editorId);
    if (label) return { type: 'label', object: label };
    return null;
  })();

  /** In a drawing mode the objects step aside so the gesture reaches the court. */
  const objectPointerEvents = drawing ? ('none' as const) : ('auto' as const);

  return (
    /* The width cap lives on the tool's container, which also has to fit the
       rail beside the board; here the canvas fills the column it is given. */
    <div className='relative w-full'>
      <div
        ref={boardRef}
        // The off-screen export copy is not a second board as far as assistive
        // technology is concerned: no group role, no name, and its wrapper is
        // aria-hidden, so a screen reader hears one court and not two.
        role={isStatic ? undefined : 'group'}
        aria-label={isStatic ? undefined : 'Taktikboard – Spielfeld mit Magneten'}
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) handleCourtPointerDown(event);
        }}
        onPointerMove={handleCourtPointerMove}
        onPointerUp={handleCourtPointerUp}
        onPointerCancel={handleCourtPointerUp}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: `${view.aspectRatio}`,
          background: ground.surface,
          borderRadius: 16,
          overflow: 'hidden',
          // In move mode the court keeps its native scrolling so a phone can
          // scroll past the board; while drawing it has to swallow the gesture.
          touchAction: drawing ? 'none' : 'manipulation',
          cursor: drawing ? 'crosshair' : 'default',
        }}>
        <svg
          viewBox={view.viewBox}
          preserveAspectRatio='none'
          aria-hidden='true'
          focusable='false'
          onPointerDown={handleCourtPointerDown}
          // Explicit stacking: html2canvas orders positioned siblings by z-index,
          // and without one it painted the arrows over the magnets in the export
          // while the browser painted them underneath.
          style={{ position: 'absolute', zIndex: 0, inset: 0, width: '100%', height: '100%' }}>
          {/* Court markings. Every colour is an explicit attribute — a serialised
              SVG has no access to the page's CSS custom properties. */}
          <path
            d={view.boundary}
            fill='none'
            stroke={ground.lineSoft}
            strokeWidth={1.8}
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          {view.centre ? (
            <path d={view.centre} fill='none' stroke={ground.lineSoft} strokeWidth={1.8} />
          ) : null}
          <path
            d={view.goalArea}
            fill='none'
            stroke={ground.line}
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d={view.freeThrow}
            fill='none'
            stroke={ground.line}
            strokeWidth={2}
            strokeDasharray='4 4.5'
            strokeLinecap='round'
          />
          <path
            d={view.marks}
            fill='none'
            stroke={ground.line}
            strokeWidth={2.4}
            strokeLinecap='round'
          />
          <path
            d={view.goal}
            fill='none'
            stroke={ground.goalLine}
            strokeWidth={3}
            strokeLinecap='round'
            strokeLinejoin='round'
          />

          {state.arrows.map((arrow) => (
            <ArrowPath key={arrow.id} arrow={arrow} view={view} groundKey={state.ground} />
          ))}

          {draft ? (
            <g opacity={0.65}>
              <ArrowPath
                arrow={{
                  id: 'draft',
                  kind: arrowKind,
                  color: arrowColor,
                  x1: draft.x1,
                  y1: draft.y1,
                  cx: (draft.x1 + draft.x2) / 2,
                  cy: (draft.y1 + draft.y2) / 2,
                  x2: draft.x2,
                  y2: draft.y2,
                }}
                view={view}
                groundKey={state.ground}
              />
            </g>
          ) : null}
        </svg>

        {/* Notes sit under the magnets so a magnet is never trapped behind text. */}
        {state.labels.map((label) => {
          const isSelected = selection?.type === 'label' && selection.id === label.id;
          // Explicit width and height, centred with negative margins. Neither a
          // transform nor a zero-size flex wrapper survives html2canvas: it takes
          // an element's box from its own declared size, so an auto-width chip
          // exported as a 44 px stub with the text hanging outside it.
          const noteWidth = Math.round(
            Math.min(
              Math.max(HANDLE_HIT, noteFontSize * (0.48 * label.text.length + 1.6)),
              Math.max(HANDLE_HIT * 2, (boardWidth || 520) * 0.62),
            ),
          );
          // Roomier than the text strictly needs: html2canvas sets a baseline
          // slightly lower than the browser does, and Caveat has a deep
          // descender, so a tight chip clips the "p" in the exported PNG.
          const noteHeight = Math.max(HANDLE_HIT, Math.round(noteFontSize * 2.5));
          return (
            <button
              key={label.id}
              type='button'
              tabIndex={isStatic ? -1 : undefined}
              aria-label={`Notiz: ${label.text}`}
              aria-describedby={describedById}
              onContextMenu={(event) => {
                event.preventDefault();
                onEditorChange(label.id);
              }}
              onDoubleClick={() => onEditorChange(label.id)}
              onPointerDown={(event) => {
                event.stopPropagation();
                onSelect({ type: 'label', id: label.id });
                beginDrag(event, label, { width: HANDLE_HIT, height: HANDLE_HIT });
                armGestures(event, label.id);
              }}
              onPointerMove={(event) => {
                const next = readDrag(event);
                if (next) onMoveLabel(label.id, next.x, next.y);
              }}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onClick={(event) => {
                // detail 0 means the click came from the keyboard, where there
                // is no double-tap and no long press.
                if (event.detail === 0) onEditorChange(label.id);
                else onSelect({ type: 'label', id: label.id });
              }}
              onKeyDown={(event) =>
                nudge(
                  event,
                  label,
                  (x, y) => onMoveLabel(label.id, x, y),
                  () => onRemove({ type: 'label', id: label.id }),
                )
              }
              className='focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
              style={{
                position: 'absolute',
                zIndex: 2,
                left: `${label.x * 100}%`,
                top: `${label.y * 100}%`,
                marginLeft: -noteWidth / 2,
                marginTop: -noteHeight / 2,
                width: noteWidth,
                height: noteHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                padding: '0 12px',
                borderRadius: 12,
                background: ground.chipSurface,
                border: `1px solid ${ground.chipBorder}`,
                boxShadow: selectionRing(isSelected),
                color: ground.chipText,
                // Caveat is the marker hand DESIGN.md reserves for arrow labels
                // and margin notes, one step larger than the UI size so it
                // still reads across a hall.
                fontFamily: NOTE_FONT_FAMILY,
                fontSize: Math.round(noteFontSize * 1.25),
                fontWeight: 700,
                lineHeight: 1,
                textAlign: 'center',
                cursor: 'grab',
                touchAction: 'none',
                userSelect: 'none',
                pointerEvents: objectPointerEvents,
              }}>
              {label.text}
            </button>
          );
        })}

        {state.magnets.map((magnet) => {
          const colors = MAGNET_COLORS[magnet.kind];
          const isBall = magnet.kind === 'ball';
          const isSelected = selection?.type === 'magnet' && selection.id === magnet.id;
          const name = isBall ? 'Ball' : `${kindLabel(magnet.kind)} Nummer ${magnet.number}`;

          return (
            <button
              key={magnet.id}
              type='button'
              tabIndex={isStatic ? -1 : undefined}
              aria-label={name}
              aria-describedby={describedById}
              onContextMenu={(event) => {
                event.preventDefault();
                onEditorChange(magnet.id);
              }}
              onDoubleClick={() => onEditorChange(magnet.id)}
              onPointerDown={(event) => {
                event.stopPropagation();
                onSelect({ type: 'magnet', id: magnet.id });
                beginDrag(event, magnet, { width: magnetSize, height: magnetSize });
                armGestures(event, magnet.id);
              }}
              onPointerMove={(event) => {
                const next = readDrag(event);
                if (next) onMoveMagnet(magnet.id, next.x, next.y);
              }}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onClick={(event) => {
                if (event.detail === 0) onEditorChange(magnet.id);
                else onSelect({ type: 'magnet', id: magnet.id });
              }}
              onKeyDown={(event) =>
                nudge(
                  event,
                  magnet,
                  (x, y) => onMoveMagnet(magnet.id, x, y),
                  () => onRemove({ type: 'magnet', id: magnet.id }),
                )
              }
              className='focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
              style={{
                position: 'absolute',
                zIndex: 3,
                left: `${magnet.x * 100}%`,
                top: `${magnet.y * 100}%`,
                marginLeft: -magnetHit / 2,
                marginTop: -magnetHit / 2,
                width: magnetHit,
                height: magnetHit,
                display: 'grid',
                placeItems: 'center',
                background: 'transparent',
                border: 'none',
                borderRadius: '9999px',
                padding: 0,
                cursor: 'grab',
                touchAction: 'none',
                userSelect: 'none',
                pointerEvents: objectPointerEvents,
              }}>
              <span
                className='font-display'
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: magnetSize,
                  height: magnetSize,
                  borderRadius: '9999px',
                  background: isBall ? 'transparent' : colors.surface,
                  border: isBall ? 'none' : `1px solid ${colors.rim}`,
                  boxShadow: selectionRing(isSelected, isBall ? undefined : MAGNET_SHADOW),
                  paddingTop: isBall ? 0 : numberFontSize * numberNudge,
                  color: colors.text,
                  fontSize: numberFontSize,
                  fontWeight: 800,
                  fontVariantNumeric: 'tabular-nums',
                  // No negative tracking: it shortens the advance after the last
                  // digit, so a centred two-digit number ends up off to the right.
                  letterSpacing: 'normal',
                  lineHeight: 1,
                }}>
                {isBall ? <BallToken size={Math.round(magnetSize * 0.78)} /> : magnet.number}
              </span>
            </button>
          );
        })}

        {/* Arrow grab handles. Marked as chrome so the PNG shows the arrows
            alone, the way they would be drawn on a real board. */}
        {(isStatic ? [] : state.arrows).map((arrow) => {
          const isSelected = selection?.type === 'arrow' && selection.id === arrow.id;
          const stroke = arrowStroke(arrow.color, state.ground);
          const handles: { handle: ArrowHandle; x: number; y: number; name: string }[] = [
            { handle: 'start', x: arrow.x1, y: arrow.y1, name: 'Anfang' },
            { handle: 'end', x: arrow.x2, y: arrow.y2, name: 'Spitze' },
          ];
          if (isSelected) {
            handles.push({ handle: 'control', x: arrow.cx, y: arrow.cy, name: 'Krümmung' });
          }

          return handles.map(({ handle, x, y, name }) => (
            <button
              key={`${arrow.id}-${handle}`}
              type='button'
              data-board-chrome
              aria-label={`Pfeil ${name} verschieben`}
              aria-describedby={describedById}
              onContextMenu={(event) => {
                event.preventDefault();
                onEditorChange(arrow.id);
              }}
              onDoubleClick={() => onEditorChange(arrow.id)}
              onPointerDown={(event) => {
                event.stopPropagation();
                onSelect({ type: 'arrow', id: arrow.id });
                beginDrag(event, { x, y }, { width: 0, height: 0 });
                armGestures(event, arrow.id);
              }}
              onPointerMove={(event) => {
                const next = readDrag(event);
                if (next) onMoveArrow(arrow.id, handle, next.x, next.y);
              }}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onClick={(event) => {
                if (event.detail === 0) onEditorChange(arrow.id);
                else onSelect({ type: 'arrow', id: arrow.id });
              }}
              onKeyDown={(event) =>
                nudge(
                  event,
                  { x, y },
                  (nx, ny) => onMoveArrow(arrow.id, handle, nx, ny),
                  () => onRemove({ type: 'arrow', id: arrow.id }),
                )
              }
              className='focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
              style={{
                position: 'absolute',
                // Under the magnets on purpose. If a handle ever lands on a
                // player, picking the player up has to keep working.
                zIndex: 1,
                left: `${x * 100}%`,
                top: `${y * 100}%`,
                marginLeft: -HANDLE_HIT / 2,
                marginTop: -HANDLE_HIT / 2,
                width: HANDLE_HIT,
                height: HANDLE_HIT,
                display: 'grid',
                placeItems: 'center',
                background: 'transparent',
                border: 'none',
                borderRadius: '9999px',
                cursor: 'grab',
                touchAction: 'none',
                pointerEvents: objectPointerEvents,
              }}>
              <span
                aria-hidden='true'
                style={{
                  display: 'block',
                  width: handle === 'control' ? 12 : 13,
                  height: handle === 'control' ? 12 : 13,
                  borderRadius: '9999px',
                  background: handle === 'control' ? ground.chipSurface : stroke,
                  // A ring in the floor colour so a handle stays findable when it
                  // lands on a magnet or on its own arrow.
                  border: `2px solid ${isSelected ? ground.selection : ground.surface}`,
                  boxShadow: `0 0 0 1px ${stroke}`,
                }}
              />
            </button>
          ));
        })}

        <span
          aria-hidden='true'
          style={{
            position: 'absolute',
            zIndex: 4,
            right: 10,
            bottom: 8,
            padding: '2px 8px',
            borderRadius: 8,
            background: ground.chipSurface,
            color: ground.chipText,
            fontSize: Math.round(Math.min(13, Math.max(10, (boardWidth || 520) * 0.024))),
            fontWeight: 600,
            // Tracked on purpose: html2canvas draws this string glyph by glyph and
            // loses the "st" kern, so a mark set solid exports as "s tatix". A
            // deliberate letterspace makes the corner mark read as a wordmark
            // instead of as broken text.
            letterSpacing: '0.07em',
            opacity: 0.92,
            pointerEvents: 'none',
          }}>
          {EXPORT_WATERMARK}
        </span>
      </div>

      {/* Outside the board box on purpose: the board clips its own corners, and
          an editor that opens near the edge must not be cut in half. */}
      {editorTarget && boardWidth > 0 ? (
        <BoardObjectEditor
          key={editorTarget.object.id}
          target={editorTarget}
          boardWidth={boardWidth}
          boardHeight={boardHeight}
          onChangeMagnet={onChangeMagnet}
          onChangeArrow={onChangeArrow}
          onChangeLabel={onChangeLabel}
          onRemove={() => {
            onRemove(
              editorTarget.type === 'magnet'
                ? { type: 'magnet', id: editorTarget.object.id }
                : editorTarget.type === 'arrow'
                  ? { type: 'arrow', id: editorTarget.object.id }
                  : { type: 'label', id: editorTarget.object.id },
            );
            onEditorChange(null);
          }}
          onClose={() => onEditorChange(null)}
        />
      ) : null}
    </div>
  );
}

/** The handball: a light disc with the two seams, small enough to read as a ball. */
function BallToken({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' aria-hidden='true'>
      <circle
        cx='12'
        cy='12'
        r='11'
        fill='hsla(40, 33%, 96%, 1)'
        stroke='hsla(222, 24%, 20%, 0.55)'
        strokeWidth='1.5'
      />
      <path
        d='M4 7 C 10 11, 14 13, 20 17 M 7 20 C 9 14, 12 9, 16 3.5'
        fill='none'
        stroke='hsla(222, 24%, 20%, 0.5)'
        strokeWidth='1.4'
        strokeLinecap='round'
      />
    </svg>
  );
}

/**
 * One arrow: a quadratic curve plus a head that points along the tangent at the
 * tip, so a bent arrow still aims where the coach pointed it. Stroke weights are
 * kept lean — an arrow is an annotation over the court, not a second court.
 */
function ArrowPath({
  arrow,
  view,
  groundKey,
}: {
  arrow: BoardArrow;
  view: CourtView;
  groundKey: BoardState['ground'];
}) {
  const start = toViewBoxPoint(view, arrow.x1, arrow.y1);
  const control = toViewBoxPoint(view, arrow.cx, arrow.cy);
  const end = toViewBoxPoint(view, arrow.x2, arrow.y2);
  const stroke = arrowStroke(arrow.color, groundKey);
  const heavy = arrow.kind === 'wurf';
  const width = heavy ? 3.6 : 2.4;

  let dx = end.x - control.x;
  let dy = end.y - control.y;
  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
    dx = end.x - start.x;
    dy = end.y - start.y;
  }
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return (
    <g>
      <path
        d={`M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`}
        fill='none'
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap='round'
        strokeDasharray={arrow.kind === 'pass' ? '4.5 4' : undefined}
      />
      <g transform={`translate(${end.x} ${end.y}) rotate(${angle})`}>
        <path
          d={heavy ? 'M 0 0 L -12 -5 L -12 5 Z' : 'M 0 0 L -9 -3.7 L -9 3.7 Z'}
          fill={stroke}
          stroke={stroke}
          strokeWidth={0.8}
          strokeLinejoin='round'
        />
      </g>
    </g>
  );
}
