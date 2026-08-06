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
import type {
  ArrowHandle,
  BoardArrow,
  BoardSelection,
  BoardState,
} from '../interfaces';

/** Keyboard nudge: one press ≈ 1.7 % of the court, Shift ≈ 8 %. */
const NUDGE = 1 / 60;
const NUDGE_COARSE = NUDGE * 5;

/** Hit area of every grab handle. Never below the 44 px touch floor. */
const HANDLE_HIT = 44;

interface DragContext {
  pointerId: number;
  rect: DOMRect;
  /** Offset between the pointer and the object's stored centre, normalised. */
  dx: number;
  dy: number;
  /** Half the object's size in normalised units, so it cannot leave the court. */
  insetX: number;
  insetY: number;
  moved: boolean;
}

interface BoardCanvasProps {
  state: BoardState;
  selection: BoardSelection;
  onSelect: (selection: BoardSelection) => void;
  onMoveMagnet: (id: string, x: number, y: number) => void;
  onMoveArrow: (id: string, handle: ArrowHandle, x: number, y: number) => void;
  onMoveLabel: (id: string, x: number, y: number) => void;
  onRemove: (selection: BoardSelection) => void;
  /** html2canvas renders exactly this node. */
  boardRef: React.RefObject<HTMLDivElement | null>;
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
  selection,
  onSelect,
  onMoveMagnet,
  onMoveArrow,
  onMoveLabel,
  onRemove,
  boardRef,
  describedById,
}: BoardCanvasProps) {
  const view: CourtView = COURT_VIEWS[state.view];
  const ground = BOARD_GROUNDS[state.ground];
  const dragRef = useRef<DragContext | null>(null);
  const [boardWidth, setBoardWidth] = useState(0);

  // The magnet has to be a real pixel size, not a percentage: it carries the
  // 44 px touch floor on a phone and must not grow into a beer mat on a beamer.
  useEffect(() => {
    const node = boardRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      setBoardWidth(width);
    });
    observer.observe(node);
    setBoardWidth(node.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, [boardRef]);

  // Tokens are sized off the board's *height*, which is the short side in both
  // views. Sizing off the width would put the same 62 px magnet on a 700 px
  // tall half court and on a 420 px tall full court, where it reads as three
  // metres of player.
  const shortSide = (boardWidth || 520) / view.aspectRatio;

  // The visible token and the thing you grab are two different sizes on
  // purpose. A 6:0 chain is six players across eleven metres; on a phone that
  // is less than 44 px each, so forcing the disc to the touch floor would turn
  // the defence into one orange blob. The disc shrinks with the board, the
  // invisible hit area never drops below 44 px, and overlapping hit areas are
  // harmless — you still aim at a disc you can see.
  const magnetSize = Math.round(Math.min(62, Math.max(32, shortSide * 0.095)));
  const magnetHit = Math.max(HANDLE_HIT, magnetSize);
  const noteFontSize = Math.round(Math.min(26, Math.max(15, shortSide * 0.042)));

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
        moved: false,
      };
    },
    [boardRef],
  );

  const readDrag = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return null;
    drag.moved = true;
    const x = (event.clientX - drag.rect.left) / drag.rect.width - drag.dx;
    const y = (event.clientY - drag.rect.top) / drag.rect.height - drag.dy;
    return { x: clampTo(x, drag.insetX), y: clampTo(y, drag.insetY) };
  }, []);

  const endDrag = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

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

  return (
    <div
      ref={boardRef}
      role='group'
      aria-label='Taktikboard – Spielfeld mit Magneten'
      onPointerDown={(event) => {
        // A tap on the floor itself clears the selection; taps on magnets stop
        // propagation before they get here.
        if (event.target === event.currentTarget) onSelect(null);
      }}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${view.aspectRatio}`,
        background: ground.surface,
        borderRadius: 16,
        overflow: 'hidden',
        touchAction: 'manipulation',
      }}>
      <svg
        viewBox={view.viewBox}
        preserveAspectRatio='none'
        aria-hidden='true'
        focusable='false'
        onPointerDown={() => onSelect(null)}
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
          strokeDasharray='6 7'
          strokeLinecap='round'
        />
        <path d={view.marks} fill='none' stroke={ground.line} strokeWidth={2.4} strokeLinecap='round' />
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
        const noteHeight = Math.max(HANDLE_HIT, Math.round(noteFontSize * 2.1));
        return (
            <button
              key={label.id}
              type='button'
              aria-label={`Notiz: ${label.text}`}
              aria-describedby={describedById}
              onPointerDown={(event) => {
                event.stopPropagation();
                onSelect({ type: 'label', id: label.id });
                beginDrag(event, label, { width: HANDLE_HIT, height: HANDLE_HIT });
              }}
              onPointerMove={(event) => {
                const next = readDrag(event);
                if (next) onMoveLabel(label.id, next.x, next.y);
              }}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onClick={() => onSelect({ type: 'label', id: label.id })}
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
                zIndex: 1,
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
              aria-label={name}
              aria-describedby={describedById}
              onPointerDown={(event) => {
                event.stopPropagation();
                onSelect({ type: 'magnet', id: magnet.id });
                beginDrag(event, magnet, { width: magnetSize, height: magnetSize });
              }}
              onPointerMove={(event) => {
                const next = readDrag(event);
                if (next) onMoveMagnet(magnet.id, next.x, next.y);
              }}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onClick={() => onSelect({ type: 'magnet', id: magnet.id })}
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
                zIndex: 2,
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
                  color: colors.text,
                  fontSize: Math.round(magnetSize * 0.46),
                  fontWeight: 800,
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}>
                {isBall ? <BallToken size={Math.round(magnetSize * 0.72)} /> : magnet.number}
              </span>
            </button>
        );
      })}

      {/* Arrow grab handles. Marked as chrome so the PNG shows the arrows
          alone, the way they would be drawn on a real board. */}
      {state.arrows.map((arrow) => {
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
            onPointerDown={(event) => {
              event.stopPropagation();
              onSelect({ type: 'arrow', id: arrow.id });
              beginDrag(event, { x, y }, { width: 0, height: 0 });
            }}
            onPointerMove={(event) => {
              const next = readDrag(event);
              if (next) onMoveArrow(arrow.id, handle, next.x, next.y);
            }}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClick={() => onSelect({ type: 'arrow', id: arrow.id })}
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
              zIndex: 3,
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
            }}>
            <span
              aria-hidden='true'
              style={{
                display: 'block',
                width: handle === 'control' ? 15 : 18,
                height: handle === 'control' ? 15 : 18,
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
  );
}

/** The handball: a light disc with the two seams, small enough to read as a ball. */
function BallToken({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' aria-hidden='true'>
      <circle cx='12' cy='12' r='11' fill='hsla(40, 33%, 96%, 1)' stroke='hsla(222, 24%, 20%, 0.55)' strokeWidth='1.5' />
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
 * tip, so a bent arrow still aims where the coach pointed it.
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
  const width = heavy ? 5 : 3.4;

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
        strokeDasharray={arrow.kind === 'pass' ? '9 8' : undefined}
      />
      <g transform={`translate(${end.x} ${end.y}) rotate(${angle})`}>
        {heavy ? (
          <path d='M 0 0 L -14 -7.5 L -10 0 L -14 7.5 Z' fill={stroke} stroke='none' />
        ) : (
          <path
            d='M 0 0 L -11 -6.5 M 0 0 L -11 6.5'
            fill='none'
            stroke={stroke}
            strokeWidth={width}
            strokeLinecap='round'
          />
        )}
      </g>
    </g>
  );
}
