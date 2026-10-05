'use client';

import { useCallback, useRef, type KeyboardEvent } from 'react';

export interface RadioItemProps {
  role: 'radio';
  'aria-checked': boolean;
  'aria-disabled'?: true;
  tabIndex: number;
  onClick: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  ref: (node: HTMLElement | null) => void;
}

const NEXT_KEYS = new Set(['ArrowRight', 'ArrowDown']);
const PREVIOUS_KEYS = new Set(['ArrowLeft', 'ArrowUp']);

/**
 * Radio-group behaviour for buttons that are styled as cards or a switch: one
 * tab stop for the whole group (the checked option), arrow keys move AND
 * select — as a native radio group does — Home and End jump to the ends, and a
 * disabled option is skipped rather than landed on.
 *
 * The container carries `role="radiogroup"` and a label; this hook hands out
 * the per-option props.
 */
export function useRadioGroup<T extends string>(
  ids: readonly T[],
  value: T,
  onChange: (next: T) => void,
  isDisabled: (id: T) => boolean = () => false,
) {
  const nodes = useRef<Array<HTMLElement | null>>([]);

  const select = useCallback(
    (index: number) => {
      onChange(ids[index]);
      nodes.current[index]?.focus();
    },
    [ids, onChange],
  );

  const step = useCallback(
    (from: number, delta: number) => {
      for (let offset = 1; offset <= ids.length; offset += 1) {
        const index = (from + delta * offset + ids.length * offset) % ids.length;
        if (!isDisabled(ids[index])) return select(index);
      }
    },
    [ids, isDisabled, select],
  );

  return (id: T, index: number): RadioItemProps => {
    const disabled = isDisabled(id);
    return {
      role: 'radio',
      'aria-checked': id === value,
      ...(disabled ? { 'aria-disabled': true as const } : {}),
      tabIndex: id === value ? 0 : -1,
      onClick: () => {
        if (!disabled) onChange(id);
      },
      onKeyDown: (event) => {
        if (NEXT_KEYS.has(event.key)) {
          event.preventDefault();
          step(index, 1);
        } else if (PREVIOUS_KEYS.has(event.key)) {
          event.preventDefault();
          step(index, -1);
        } else if (event.key === 'Home') {
          event.preventDefault();
          step(-1 + ids.length, 1);
        } else if (event.key === 'End') {
          event.preventDefault();
          step(0 + ids.length, -1);
        } else if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault();
          if (!disabled) onChange(id);
        }
      },
      ref: (node) => {
        nodes.current[index] = node;
      },
    };
  };
}
