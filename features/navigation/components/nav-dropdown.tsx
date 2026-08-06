'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { NavigationItem } from '../interfaces';

interface NavDropdownProperties {
  /** The navigation item; must carry `groups`. */
  item: NavigationItem;
  /** Whether the sliding pill currently rests on this entry. */
  highlighted: boolean;
  /** Whether one of the sub-links is the current route. */
  active: boolean;
  /** Reports pointer enter/leave so the pill can follow the cursor. */
  onHoverChange: (ident: number | null) => void;
}

/**
 * Desktop navigation entry that opens a panel of grouped sub-links.
 *
 * The panel is always present in the server-rendered HTML and only hidden with
 * CSS — that is the whole point of the dropdown: crawlers must see the links to
 * the commercial pages in the header, not just in the footer. While it is
 * closed the links are removed from the accessibility tree and the tab order.
 * @returns A JSX element rendering the trigger button and its link panel.
 */
export default function NavDropdown({
  item,
  highlighted,
  active,
  onHoverChange,
}: NavDropdownProperties) {
  const t = useTranslations('navigationSection');
  const pathname = usePathname();
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const shouldFocusFirstLink = useRef(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const focusFirstLink = () => {
    containerRef.current?.querySelector<HTMLAnchorElement>('a[href]')?.focus();
  };

  // Focus has to wait for the panel to actually become visible — a hidden
  // element cannot take focus — so it happens here rather than in the handler.
  useEffect(() => {
    if (!isOpen || !shouldFocusFirstLink.current) {
      return;
    }

    shouldFocusFirstLink.current = false;
    focusFirstLink();
  }, [isOpen]);

  const closeAndRestoreFocus = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key !== 'ArrowDown') {
      return;
    }

    event.preventDefault();

    // Already open (the pointer got there first): nothing re-renders, so the
    // effect above would never fire.
    if (isOpen) {
      focusFirstLink();
      return;
    }

    shouldFocusFirstLink.current = true;
    setIsOpen(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && isOpen) {
      event.stopPropagation();
      closeAndRestoreFocus();
    }
  };

  // Tabbing (or clicking) past the last link closes the panel again.
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className='relative'
      onMouseEnter={() => {
        onHoverChange(item.ident);
        setIsOpen(true);
      }}
      onMouseLeave={() => {
        onHoverChange(null);
        setIsOpen(false);
      }}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}>
      <button
        ref={triggerRef}
        type='button'
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-current={active ? 'page' : undefined}
        title={t(`items.${item.labelKey}`)}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          'relative inline-flex cursor-pointer items-center whitespace-nowrap rounded-full px-2 py-2 text-sm font-medium tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]/60 xl:px-3.5',
          highlighted
            ? 'text-slate-950'
            : 'text-slate-500 hover:text-slate-900',
        )}>
        {highlighted && (
          <motion.span
            layoutId='navActivePill'
            className='absolute inset-0 rounded-full bg-white shadow-sm'
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          />
        )}
        <span className='relative z-10 inline-flex items-center gap-1'>
          {t(`items.${item.labelKey}`)}
          <ChevronDown
            aria-hidden
            className={cn(
              'size-3.5 shrink-0 transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
          />
        </span>
      </button>

      <div
        id={panelId}
        aria-hidden={!isOpen}
        className={cn(
          // Only opacity and transform transition: a transitioned
          // `visibility` stays `hidden` for the first frame, and an element
          // that is still hidden cannot take focus on ArrowDown.
          'absolute left-1/2 top-[calc(100%+0.85rem)] z-20 w-64 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_48px_-28px_rgba(15,23,42,0.5)] transition-[opacity,transform] duration-200 ease-out',
          isOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-1 opacity-0',
        )}>
        {(item.groups ?? []).map((group) => (
          <div key={group.labelKey} className='p-1 first:pt-1.5 last:pb-1.5'>
            <p className='px-3 pb-1 font-display text-[13px] font-bold uppercase tracking-[0.08em] text-slate-400'>
              {t(`groups.${group.labelKey}`)}
            </p>
            {group.items.map((child) => (
              <Link
                key={child.ident}
                href={child.href}
                title={child.label ?? t(`items.${child.labelKey}`)}
                tabIndex={isOpen ? undefined : -1}
                aria-current={pathname === child.href ? 'page' : undefined}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block rounded-xl px-3 py-2 text-sm font-medium tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]/60',
                  pathname === child.href
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                )}>
                {child.label ?? t(`items.${child.labelKey}`)}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
