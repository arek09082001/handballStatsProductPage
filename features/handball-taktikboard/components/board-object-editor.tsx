'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Minus, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MAGNET_COLORS } from '../data/board-palette';
import {
  ARROW_KIND_OPTIONS,
  LABEL_MAX_CHARS,
  MAGNET_KIND_OPTIONS,
} from '../data/taktikboard-content';
import type {
  ArrowColor,
  ArrowKind,
  BoardArrow,
  BoardLabel,
  BoardMagnet,
  MagnetKind,
} from '../interfaces';

const ARROW_COLOR_OPTIONS: { value: ArrowColor; label: string }[] = [
  { value: 'marker', label: 'Orange' },
  { value: 'opponent', label: 'Blau' },
  { value: 'neutral', label: 'Neutral' },
];

export type EditorTarget =
  | { type: 'magnet'; object: BoardMagnet }
  | { type: 'arrow'; object: BoardArrow }
  | { type: 'label'; object: BoardLabel };

interface BoardObjectEditorProps {
  target: EditorTarget;
  /** Pixel size of the board, for placing the card next to its object. */
  boardWidth: number;
  boardHeight: number;
  onChangeMagnet: (id: string, patch: Partial<BoardMagnet>) => void;
  onChangeArrow: (id: string, patch: Partial<BoardArrow>) => void;
  onChangeLabel: (id: string, text: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

const CARD_WIDTH = 268;

/**
 * The editor that opens **on** the board, at the object you just double-tapped
 * or long-pressed.
 *
 * It sits where the coach is already looking instead of in a panel at the edge,
 * which is the difference between changing a jersey number in one gesture and
 * hunting for the right field. Deliberately not a modal: no overlay, no focus
 * trap, closes on Escape or on a tap anywhere else, and the board stays visible
 * and usable behind it.
 * @returns A JSX element rendering the on-board editor for the selected object.
 */
export default function BoardObjectEditor({
  target,
  boardWidth,
  boardHeight,
  onChangeMagnet,
  onChangeArrow,
  onChangeLabel,
  onRemove,
  onClose,
}: BoardObjectEditorProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const field = firstFieldRef.current;
    field?.focus();
    // A note opens on its text with the placeholder selected, because the card
    // pops up the instant the note is placed — the coach should be able to type
    // the word straight over it.
    if (field instanceof HTMLInputElement) field.select();
  }, [target.object.id]);

  /**
   * Escape and a tap anywhere else close the card. Both listen on the document
   * rather than on the card, so the card carries no handlers of its own and a
   * tap on the board behind it dismisses instead of being swallowed. The
   * timestamp guard keeps the very gesture that opened the card — the second
   * tap of a double-tap — from closing it again in the same frame.
   */
  useEffect(() => {
    const openedAt = performance.now();

    const onPointerDown = (event: PointerEvent) => {
      if (performance.now() - openedAt < 300) return;
      if (cardRef.current?.contains(event.target as Node)) return;
      onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const anchor =
    target.type === 'arrow'
      ? { x: (target.object.x1 + target.object.x2) / 2, y: (target.object.y1 + target.object.y2) / 2 }
      : { x: target.object.x, y: target.object.y };

  // Below the object when there is room, above it otherwise, and always inside
  // the board — a card that opens off the bottom is detached from the thing it
  // edits. The height is measured rather than estimated: the card is a
  // different size for a magnet, an arrow and a note, and a guess that is 60 px
  // short puts it in the wrong place.
  const [cardHeight, setCardHeight] = useState(0);
  // Measured through the ref callback rather than an effect: it runs once when
  // the card mounts, and the card is keyed on the object it edits, so a new
  // target remounts and re-measures.
  const attachCard = useCallback((node: HTMLDivElement | null) => {
    cardRef.current = node;
    setCardHeight(node?.offsetHeight ?? 0);
  }, []);

  const anchorX = anchor.x * boardWidth;
  const anchorY = anchor.y * boardHeight;
  const left = Math.max(4, Math.min(anchorX - CARD_WIDTH / 2, boardWidth - CARD_WIDTH - 4));
  const below = anchorY + 46;
  const top =
    cardHeight === 0 || below + cardHeight <= boardHeight - 4
      ? below
      : Math.max(4, Math.min(anchorY - 46 - cardHeight, boardHeight - cardHeight - 4));

  const chipClass =
    'inline-flex h-11 min-w-11 flex-1 items-center justify-center gap-1.5 rounded-lg border border-ink/15 bg-paper px-2 text-[13px] font-semibold text-ink transition-colors hover:border-ink/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
  const chipActive = 'border-primary bg-primary/12 text-primary';

  return (
    <div
      ref={attachCard}
      role='dialog'
      aria-label='Objekt bearbeiten'
      data-board-editor
      className='board-shadow absolute z-30 rounded-xl border border-ink/15 bg-paper p-3'
      style={{ left, top, width: CARD_WIDTH }}>
      {target.type === 'magnet' ? (
        <>
          <p className='text-[12px] font-semibold uppercase tracking-wide text-ink/55'>
            Magnet
          </p>
          {/* Two by two rather than four across: at 268 px wide a four-column
              row squeezes "Torwart" into 58 px and clips it. */}
          <div className='mt-2 grid grid-cols-2 gap-1.5'>
            {MAGNET_KIND_OPTIONS.map((option, index) => (
              <button
                key={option.kind}
                ref={index === 0 ? (node) => { firstFieldRef.current = node; } : undefined}
                type='button'
                aria-pressed={target.object.kind === option.kind}
                onClick={() =>
                  onChangeMagnet(target.object.id, { kind: option.kind as MagnetKind })
                }
                className={cn(chipClass, target.object.kind === option.kind && chipActive)}>
                <span
                  aria-hidden='true'
                  className='size-3 shrink-0 rounded-full border border-ink/20'
                  style={{ background: MAGNET_COLORS[option.kind].surface }}
                />
                {option.label}
              </button>
            ))}
          </div>

          {target.object.kind === 'ball' ? (
            <p className='mt-3 text-[13px] leading-6 text-ink/65'>
              Der Ball trägt keine Nummer.
            </p>
          ) : (
            <div className='mt-3'>
              <label
                className='block text-[12px] font-semibold uppercase tracking-wide text-ink/55'
                htmlFor='taktikboard-editor-nummer'>
                Rückennummer
              </label>
              <div className='mt-1.5 flex items-center gap-1.5'>
                <button
                  type='button'
                  aria-label='Nummer eins kleiner'
                  onClick={() =>
                    onChangeMagnet(target.object.id, {
                      number: Math.max(0, target.object.number - 1),
                    })
                  }
                  className={cn(chipClass, 'max-w-11 flex-none')}>
                  <Minus className='size-4' aria-hidden='true' />
                </button>
                <input
                  id='taktikboard-editor-nummer'
                  type='number'
                  inputMode='numeric'
                  min={0}
                  max={99}
                  value={target.object.number}
                  onChange={(event) => {
                    const parsed = Number.parseInt(event.target.value, 10);
                    onChangeMagnet(target.object.id, {
                      number: Number.isFinite(parsed) ? Math.min(99, Math.max(0, parsed)) : 0,
                    });
                  }}
                  className='h-11 w-full rounded-lg border border-ink/15 bg-paper px-2 text-center text-base font-bold tabular-nums text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/25'
                />
                <button
                  type='button'
                  aria-label='Nummer eins größer'
                  onClick={() =>
                    onChangeMagnet(target.object.id, {
                      number: Math.min(99, target.object.number + 1),
                    })
                  }
                  className={cn(chipClass, 'max-w-11 flex-none')}>
                  <Plus className='size-4' aria-hidden='true' />
                </button>
              </div>
            </div>
          )}
        </>
      ) : target.type === 'arrow' ? (
        <>
          <p className='text-[12px] font-semibold uppercase tracking-wide text-ink/55'>
            Pfeil
          </p>
          <div className='mt-2 flex gap-1.5'>
            {ARROW_KIND_OPTIONS.map((option, index) => (
              <button
                key={option.kind}
                ref={index === 0 ? (node) => { firstFieldRef.current = node; } : undefined}
                type='button'
                aria-pressed={target.object.kind === option.kind}
                onClick={() => onChangeArrow(target.object.id, { kind: option.kind as ArrowKind })}
                className={cn(chipClass, target.object.kind === option.kind && chipActive)}>
                {option.label}
              </button>
            ))}
          </div>
          <div className='mt-2 flex gap-1.5'>
            {ARROW_COLOR_OPTIONS.map((option) => (
              <button
                key={option.value}
                type='button'
                aria-pressed={target.object.color === option.value}
                onClick={() => onChangeArrow(target.object.id, { color: option.value })}
                className={cn(chipClass, target.object.color === option.value && chipActive)}>
                {option.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <label
            className='block text-[12px] font-semibold uppercase tracking-wide text-ink/55'
            htmlFor='taktikboard-editor-notiz'>
            Notiz
          </label>
          <input
            id='taktikboard-editor-notiz'
            ref={(node) => {
              firstFieldRef.current = node;
            }}
            type='text'
            maxLength={LABEL_MAX_CHARS}
            value={target.object.text}
            onChange={(event) => onChangeLabel(target.object.id, event.target.value)}
            className='mt-1.5 h-11 w-full rounded-lg border border-ink/15 bg-paper px-3 text-base text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/25'
          />
          <p className='mt-1.5 text-[12px] text-ink/55'>
            Höchstens {LABEL_MAX_CHARS} Zeichen – ein Wort, kein Satz.
          </p>
        </>
      )}

      <div className='mt-3 flex gap-1.5 border-t border-ink/10 pt-3'>
        <button
          type='button'
          onClick={onRemove}
          className={cn(chipClass, 'hover:border-secondary/50 hover:text-secondary')}>
          <Trash2 className='size-4' aria-hidden='true' />
          Entfernen
        </button>
        <button
          type='button'
          onClick={onClose}
          className={cn(chipClass, 'border-primary bg-primary text-white hover:brightness-95')}>
          <Check className='size-4' aria-hidden='true' />
          Fertig
        </button>
      </div>
    </div>
  );
}
