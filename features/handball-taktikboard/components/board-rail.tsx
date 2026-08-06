'use client';

import { MousePointer2, Spline, StickyNote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MAGNET_COLORS, arrowStroke } from '../data/board-palette';
import {
  ARROW_KIND_OPTIONS,
  BOARD_MODE_OPTIONS,
  MAGNET_KIND_OPTIONS,
} from '../data/taktikboard-content';
import type {
  ArrowColor,
  ArrowKind,
  BoardMode,
  MagnetKind,
} from '../interfaces';

/**
 * `Spline` — a path with control points — rather than a plain arrow glyph for
 * the drawing tool, so it cannot be mistaken for the "Laufweg" arrow type that
 * sits three buttons below it.
 */
const MODE_ICONS: Record<BoardMode, typeof MousePointer2> = {
  move: MousePointer2,
  arrow: Spline,
  note: StickyNote,
};

const ARROW_COLOR_OPTIONS: { value: ArrowColor; label: string }[] = [
  { value: 'marker', label: 'Orange – eigene Mannschaft' },
  { value: 'opponent', label: 'Blau – Gegner' },
  { value: 'neutral', label: 'Neutral' },
];

interface BoardRailProps {
  mode: BoardMode;
  arrowKind: ArrowKind;
  arrowColor: ArrowColor;
  onModeChange: (mode: BoardMode) => void;
  onArrowKindChange: (kind: ArrowKind) => void;
  onArrowColorChange: (color: ArrowColor) => void;
  onAddMagnet: (kind: MagnetKind) => void;
}

/**
 * The tool rail: a strip of icons beside the board on tablet and desktop, above
 * it on a phone.
 *
 * Icons and no labels, because a labelled row of controls was 170 px tall and
 * made the court — the thing the page exists for — look like an afterthought.
 * Every button still carries its full German name as its accessible name and as
 * a hover title, and the strip under the board spells out what the active tool
 * does, so nothing depends on guessing a glyph.
 * @returns A JSX element rendering the board's icon tool rail.
 */
export default function BoardRail({
  mode,
  arrowKind,
  arrowColor,
  onModeChange,
  onArrowKindChange,
  onArrowColorChange,
  onAddMagnet,
}: BoardRailProps) {
  const buttonClass =
    'inline-grid size-11 shrink-0 place-items-center rounded-xl border border-transparent text-ink/70 transition-colors hover:border-ink/15 hover:bg-paper-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
  const buttonActive = 'border-primary bg-primary/12 text-primary hover:bg-primary/12 hover:text-primary';
  const dividerClass = 'h-8 w-px shrink-0 self-center bg-ink/12 lg:h-px lg:w-8';

  return (
    <div
      className={cn(
        'mx-auto flex w-fit max-w-full shrink-0 items-center gap-1 overflow-x-auto rounded-2xl border border-ink/10 bg-paper p-1.5',
        'lg:mx-0 lg:w-auto lg:flex-col lg:items-stretch lg:overflow-visible',
      )}>
      <div className='flex gap-1 lg:flex-col' role='group' aria-label='Werkzeug'>
        {BOARD_MODE_OPTIONS.map((option) => {
          const Icon = MODE_ICONS[option.mode];
          return (
            <button
              key={option.mode}
              type='button'
              aria-pressed={mode === option.mode}
              aria-label={option.action}
              title={option.action}
              onClick={() => onModeChange(option.mode)}
              className={cn(buttonClass, mode === option.mode && buttonActive)}>
              <Icon className='size-5' aria-hidden='true' />
            </button>
          );
        })}
      </div>

      {mode === 'arrow' ? (
        <>
          <span aria-hidden='true' className={dividerClass} />
          <div className='flex gap-1 lg:flex-col' role='group' aria-label='Art des Pfeils'>
            {ARROW_KIND_OPTIONS.map((option) => (
              <button
                key={option.kind}
                type='button'
                aria-pressed={arrowKind === option.kind}
                aria-label={`${option.label}: ${option.hint}`}
                title={option.label}
                onClick={() => onArrowKindChange(option.kind)}
                className={cn(buttonClass, arrowKind === option.kind && buttonActive)}>
                <ArrowKindGlyph kind={option.kind} />
              </button>
            ))}
          </div>
          <span aria-hidden='true' className={dividerClass} />
          <div className='flex gap-1 lg:flex-col' role='group' aria-label='Farbe des Pfeils'>
            {ARROW_COLOR_OPTIONS.map((option) => (
              <button
                key={option.value}
                type='button'
                aria-pressed={arrowColor === option.value}
                aria-label={`Pfeilfarbe ${option.label}`}
                title={`Pfeilfarbe ${option.label}`}
                onClick={() => onArrowColorChange(option.value)}
                className={cn(buttonClass, arrowColor === option.value && buttonActive)}>
                <span
                  aria-hidden='true'
                  className='block size-4 rounded-full ring-1 ring-ink/20'
                  style={{ background: arrowStroke(option.value, 'paper') }}
                />
              </button>
            ))}
          </div>
        </>
      ) : null}

      <span aria-hidden='true' className={dividerClass} />

      <div className='flex gap-1 lg:flex-col' role='group' aria-label='Magnet aufs Feld setzen'>
        {MAGNET_KIND_OPTIONS.map((option) => (
          <button
            key={option.kind}
            type='button'
            aria-label={option.action}
            title={option.action}
            onClick={() => onAddMagnet(option.kind)}
            className={buttonClass}>
            <AddMagnetGlyph kind={option.kind} />
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * The three arrow types drawn as the line they actually produce — a solid run,
 * a dashed pass, a heavy shot. A picture of the stroke beats any icon-set
 * approximation of "line", and they are drawn horizontally because a dash
 * pattern and a stroke weight are far easier to tell apart along a straight
 * edge than on a 20 px diagonal.
 */
function ArrowKindGlyph({ kind }: { kind: ArrowKind }) {
  const heavy = kind === 'wurf';
  return (
    <svg viewBox='0 0 20 20' className='size-5' fill='none' aria-hidden='true'>
      <path
        d={`M2 10 H ${heavy ? 12 : 13}`}
        stroke='currentColor'
        strokeWidth={heavy ? 3.4 : 2}
        strokeLinecap='round'
        strokeDasharray={kind === 'pass' ? '3.5 3' : undefined}
      />
      {heavy ? (
        <path d='M18.5 10 L 11.5 6 L 11.5 14 Z' fill='currentColor' />
      ) : (
        <path
          d='M18 10 L 12.5 6.4 M 18 10 L 12.5 13.6'
          stroke='currentColor'
          strokeWidth={2}
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      )}
    </svg>
  );
}

/** The token you are about to place, with a plus on it. */
function AddMagnetGlyph({ kind }: { kind: MagnetKind }) {
  const colors = MAGNET_COLORS[kind];
  const isBall = kind === 'ball';
  return (
    <span
      aria-hidden='true'
      className='grid size-7 place-items-center rounded-full text-[15px] font-bold leading-none'
      style={{
        background: colors.surface,
        border: `1px solid ${colors.rim}`,
        color: isBall ? colors.text : 'hsla(0, 0%, 100%, 0.95)',
      }}>
      +
    </span>
  );
}
