'use client';

import { cn } from '@/lib/utils';
import { MAGNET_COLORS } from '../data/board-palette';
import {
  ARROW_KIND_OPTIONS,
  BOARD_MODE_OPTIONS,
  MAGNET_KIND_OPTIONS,
} from '../data/taktikboard-content';
import type { ArrowColor, ArrowKind, BoardMode, MagnetKind } from '../interfaces';

const ARROW_COLOR_OPTIONS: { value: ArrowColor; label: string }[] = [
  { value: 'marker', label: 'Orange (eigene)' },
  { value: 'opponent', label: 'Blau (Gegner)' },
  { value: 'neutral', label: 'Neutral' },
];

interface BoardToolbarProps {
  mode: BoardMode;
  arrowKind: ArrowKind;
  arrowColor: ArrowColor;
  onModeChange: (mode: BoardMode) => void;
  onArrowKindChange: (kind: ArrowKind) => void;
  onArrowColorChange: (color: ArrowColor) => void;
  onAddMagnet: (kind: MagnetKind) => void;
}

/**
 * The tool strip that sits directly above the board.
 *
 * A tool switch instead of a hidden gesture, because the same drag has to mean
 * two different things and a tablet has no hover to disambiguate them: in
 * `Verschieben` the court keeps its native scrolling so a phone can scroll past
 * a board that fills the screen, and only in `Pfeil` or `Notiz` does the board
 * swallow the gesture.
 * @returns A JSX element rendering the board's tool strip.
 */
export default function BoardToolbar({
  mode,
  arrowKind,
  arrowColor,
  onModeChange,
  onArrowKindChange,
  onArrowColorChange,
  onAddMagnet,
}: BoardToolbarProps) {
  const chipClass =
    'inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-xl border border-ink/15 bg-paper px-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-paper-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:gap-2 sm:px-3.5 sm:text-sm';
  const chipActive = 'border-primary bg-primary/12 text-primary hover:bg-primary/12';
  const legendClass =
    'text-[12px] font-semibold uppercase tracking-wide text-ink/55';
  const selectClass =
    'h-11 rounded-xl border border-ink/15 bg-paper px-3 text-sm text-ink outline-none transition-colors hover:border-ink/30 focus:border-primary focus:ring-2 focus:ring-primary/25';

  const activeMode = BOARD_MODE_OPTIONS.find((option) => option.mode === mode);

  return (
    <div className='rounded-2xl border border-ink/10 bg-paper p-3 sm:p-4'>
      <div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
        <div className='flex flex-wrap gap-2' role='group' aria-label='Werkzeug'>
          {BOARD_MODE_OPTIONS.map((option) => (
            <button
              key={option.mode}
              type='button'
              aria-pressed={mode === option.mode}
              aria-label={option.action}
              onClick={() => onModeChange(option.mode)}
              className={cn(chipClass, mode === option.mode && chipActive)}>
              {option.label}
            </button>
          ))}
        </div>

        {mode === 'arrow' ? (
          <div className='flex flex-wrap items-center gap-2'>
            <label className='sr-only' htmlFor='taktikboard-pfeilart'>
              Art des Pfeils
            </label>
            <select
              id='taktikboard-pfeilart'
              value={arrowKind}
              onChange={(event) => onArrowKindChange(event.target.value as ArrowKind)}
              className={cn(selectClass, 'cursor-pointer')}>
              {ARROW_KIND_OPTIONS.map((option) => (
                <option key={option.kind} value={option.kind}>
                  {option.label}
                </option>
              ))}
            </select>
            <label className='sr-only' htmlFor='taktikboard-pfeilfarbe'>
              Farbe des Pfeils
            </label>
            <select
              id='taktikboard-pfeilfarbe'
              value={arrowColor}
              onChange={(event) => onArrowColorChange(event.target.value as ArrowColor)}
              className={cn(selectClass, 'cursor-pointer')}>
              {ARROW_COLOR_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      <p aria-live='polite' className='mt-2 text-[12.5px] leading-5 text-ink/65'>
        {activeMode?.hint}
      </p>

      <div className='mt-2.5 border-t border-ink/10 pt-2.5'>
        <span className={cn(legendClass, 'sr-only sm:not-sr-only sm:mb-1.5 sm:block')} id='taktikboard-magnet-legende'>
          Magnet aufs Feld
        </span>
        {/* A four-column grid rather than a wrapping row: at 375 px an equal
            split keeps all four on one line and the board above the fold. */}
        <div
          className='grid grid-cols-4 gap-1.5 sm:flex sm:flex-wrap sm:gap-2'
          role='group'
          aria-labelledby='taktikboard-magnet-legende'>
          {MAGNET_KIND_OPTIONS.map((option) => (
            <button
              key={option.kind}
              type='button'
              onClick={() => onAddMagnet(option.kind)}
              aria-label={option.action}
              className={cn(chipClass, 'px-1 text-[12px] sm:px-3.5 sm:text-sm')}>
              <span
                aria-hidden='true'
                className='size-3 shrink-0 rounded-full border border-ink/15 sm:size-3.5'
                style={{ background: MAGNET_COLORS[option.kind].surface }}
              />
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
