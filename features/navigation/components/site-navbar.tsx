'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Menu, Rocket, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CLUB_CONFIG } from '@/lib/club-config';
import { cn } from '@/lib/utils';
import LanguageSwitcher from './language-switcher';
import { siteNavigationItems } from '../config';
import { useSiteNavbar } from '../hooks/use-site-navbar';

export default function SiteNavbar() {
  const t = useTranslations('navigationSection');
  const {
    isOpen,
    isScrolled,
    isScrollingUp,
    toggleMenu,
    closeMenu,
    isItemActive,
    handleBrandClick,
  } = useSiteNavbar();

  const [hoveredIdent, setHoveredIdent] = useState<number | null>(null);

  const isNavInFocus = isOpen || isScrollingUp || !isScrolled;

  // The highlight pill rests on the active (scroll-spy) item, but follows the
  // hovered item while the pointer is over the nav — so Live-Demo takes the
  // pill too even though it has no page section of its own.
  const activeItem = siteNavigationItems.find((item) => isItemActive(item));
  const highlightedIdent = hoveredIdent ?? activeItem?.ident ?? null;

  return (
    <>
      <nav
        className={cn(
          'fixed inset-x-0 top-0 z-50 flex justify-end px-4 pt-4 transition-transform duration-500 ease-out sm:px-6 lg:block lg:justify-start lg:translate-y-0',
          isNavInFocus ? 'translate-y-0' : '-translate-y-1',
        )}>
        <div
          className={cn(
            'relative isolate ml-auto flex h-auto w-auto items-center justify-end gap-2 overflow-visible border-0 bg-transparent px-0 shadow-none transition-all duration-500 ease-out sm:gap-3 sm:px-0 lg:mx-auto lg:h-16 lg:w-auto lg:max-w-7xl lg:justify-normal lg:overflow-hidden lg:rounded-[28px] lg:border lg:px-8',
            'lg:scale-100 lg:border-slate-200/85 lg:bg-white lg:shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] lg:backdrop-blur-none lg:supports-[backdrop-filter]:bg-white',
            isNavInFocus
              ? 'lg:bg-white/94 lg:shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] lg:backdrop-blur-[2px] lg:supports-[backdrop-filter]:bg-white/78'
              : 'lg:border-white/55 lg:bg-white/72 lg:shadow-[0_20px_52px_-34px_rgba(15,23,42,0.38)] lg:backdrop-blur-[4px] lg:supports-[backdrop-filter]:bg-white/54',
            !isNavInFocus && 'lg:scale-[0.95]',
          )}>
          <div
            className={cn(
              'pointer-events-none hidden absolute inset-0 transition-opacity duration-500 supports-[backdrop-filter]:backdrop-saturate-150 lg:hidden',
              isNavInFocus
                ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.36)_100%)] backdrop-blur-[2px]'
                : 'bg-[linear-gradient(135deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.34)_40%,rgba(226,232,240,0.22)_100%)] backdrop-blur-[4px]',
            )}
          />

          <div
            className={cn(
              'pointer-events-none hidden absolute inset-[1px] rounded-[27px] transition-opacity duration-500 lg:hidden',
              isNavInFocus
                ? 'opacity-75 bg-[linear-gradient(180deg,rgba(255,255,255,0.58)_0%,rgba(255,255,255,0.22)_100%)]'
                : 'opacity-90 bg-[linear-gradient(135deg,rgba(255,255,255,0.74)_0%,rgba(255,255,255,0.36)_42%,rgba(203,213,225,0.16)_100%)]',
            )}
          />

          <div className='relative z-10 hidden min-w-0 flex-1 lg:block lg:w-60 lg:flex-none'>
            <button
              type='button'
              onClick={handleBrandClick}
              className='flex max-w-[calc(100vw-7.5rem)] min-w-0 items-center gap-3 text-left transition-opacity hover:opacity-85'>
              <span className='relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl'>
                <Image
                  src={CLUB_CONFIG.branding.logo.path}
                  alt={CLUB_CONFIG.display.logoAlt}
                  title={CLUB_CONFIG.display.logoAlt}
                  fill
                  sizes='44px'
                  priority
                  className='object-contain p-1.5'
                />
              </span>

              <span className='flex min-w-0 flex-col items-start leading-none'>
                <span className='relative h-7 w-28 sm:w-32'>
                  <Image
                    src={CLUB_CONFIG.branding.logoName.path}
                    alt={CLUB_CONFIG.display.logoAlt}
                    title={CLUB_CONFIG.display.logoAlt}
                    fill
                    className='object-contain'
                    sizes='128px'
                    priority
                  />
                </span>

                <span className='mt-1 hidden text-left text-xs font-medium text-slate-500 sm:block'>
                  {CLUB_CONFIG.display.brandTagline}
                </span>
              </span>
            </button>
          </div>

          <div className='hidden flex-1 items-center justify-center lg:flex'>
            <div
              className='flex items-center gap-1 rounded-full bg-slate-100/80 p-1'
              onMouseLeave={() => setHoveredIdent(null)}>
              {siteNavigationItems.map((item) => {
                const active = isItemActive(item);
                const highlighted = item.ident === highlightedIdent;

                return (
                  <Link
                    key={item.ident}
                    href={item.href}
                    title={t(`items.${item.labelKey}`)}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    aria-current={active ? 'page' : undefined}
                    onMouseEnter={() => setHoveredIdent(item.ident)}
                    className={cn(
                      'relative inline-flex items-center rounded-full px-3.5 py-2 text-sm font-medium tracking-[-0.01em] transition-colors duration-200',
                      highlighted
                        ? 'text-slate-950'
                        : item.external
                          ? 'text-[#ea580c] hover:text-[#c2410c]'
                          : 'text-slate-500 hover:text-slate-900',
                    )}>
                    {highlighted && (
                      <motion.span
                        layoutId='navActivePill'
                        className='absolute inset-0 rounded-full bg-white shadow-sm'
                        transition={{
                          type: 'spring',
                          stiffness: 420,
                          damping: 34,
                        }}
                      />
                    )}
                    <span className='relative z-10 inline-flex items-center gap-1.5'>
                      {item.external && (
                        <span
                          className={cn(
                            'size-1.5 animate-pulse rounded-full',
                            highlighted ? 'bg-[#ea580c]' : 'bg-[#f97316]',
                          )}
                        />
                      )}
                      {t(`items.${item.labelKey}`)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className='ml-auto hidden items-center justify-end gap-3 lg:flex lg:w-60'>
            <LanguageSwitcher />
            <Link
              href='/#newsletter'
              title={t('contactCta')}
              className='inline-flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#f97316] px-5 text-sm font-semibold text-white shadow-[0_4px_16px_-4px_rgba(249,115,22,0.55)] ring-1 ring-orange-500/20 transition-all duration-200 hover:-translate-y-px hover:bg-[#ea580c] hover:shadow-[0_8px_22px_-4px_rgba(249,115,22,0.5)] active:translate-y-0 active:scale-95'>
              <Rocket className='size-3.5 shrink-0' />
              {t('contactCta')}
            </Link>
          </div>

          <button
            type='button'
            onClick={toggleMenu}
            className={cn(
              'relative z-10 ml-auto inline-flex size-11 shrink-0 items-center justify-center rounded-full border text-slate-700 transition-colors duration-300 hover:bg-slate-50 lg:hidden',
              isNavInFocus
                ? 'border-slate-200 bg-white'
                : 'border-white/50 bg-white/72 supports-[backdrop-filter]:bg-white/56',
            )}
            aria-label={isOpen ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={isOpen}>
            {isOpen ? <X className='size-5' /> : <Menu className='size-5' />}
          </button>
        </div>
      </nav>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-950/12 backdrop-blur-[1px] transition-opacity duration-200 lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={closeMenu}
      />

      <div
        className={cn(
          'fixed left-4 right-4 top-24 z-40 overflow-y-auto overscroll-contain rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_48px_-32px_rgba(15,23,42,0.45)] transition-all duration-200 sm:left-6 sm:right-6 lg:hidden max-h-[calc(100vh-112px)]',
          isOpen
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0',
        )}>
        <div className='space-y-2 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]'>
          <button
            type='button'
            onClick={() => {
              handleBrandClick();
              closeMenu();
            }}
            className='flex w-full min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100'>
            <span className='relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl'>
              <Image
                src={CLUB_CONFIG.branding.logo.path}
                alt={CLUB_CONFIG.display.logoAlt}
                title={CLUB_CONFIG.display.logoAlt}
                fill
                sizes='44px'
                className='object-contain p-1.5'
              />
            </span>

            <span className='min-w-0'>
              <span className='block truncate text-base font-semibold tracking-[-0.03em] text-slate-950'>
                {CLUB_CONFIG.name}
              </span>
              <span className='block truncate text-xs font-medium text-slate-500'>
                {CLUB_CONFIG.display.brandTagline}
              </span>
            </span>
          </button>

          {siteNavigationItems.map((item) => {
            const active = isItemActive(item);

            return (
              <Link
                key={item.ident}
                href={item.href}
                title={t(`items.${item.labelKey}`)}
                onClick={closeMenu}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium tracking-[-0.01em] transition-colors',
                  item.external
                    ? 'bg-orange-50 text-[#ea580c] hover:bg-orange-100'
                    : active
                      ? 'bg-slate-950 text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-950',
                )}>
                <span className='inline-flex items-center gap-2'>
                  {item.external && (
                    <span className='size-1.5 animate-pulse rounded-full bg-[#f97316]' />
                  )}
                  {t(`items.${item.labelKey}`)}
                </span>
                {item.external ? (
                  <ArrowUpRight className='size-4' />
                ) : (
                  active && <span className='size-2 rounded-full bg-white' />
                )}
              </Link>
            );
          })}

          <Link
            href='/#newsletter'
            title={t('contactCta')}
            onClick={closeMenu}
            className='inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f97316] px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_-4px_rgba(249,115,22,0.55)] ring-1 ring-orange-500/20 transition-all duration-200 hover:bg-[#ea580c] active:scale-95'>
            <Rocket className='size-4 shrink-0' />
            {t('contactCta')}
          </Link>

          <div className='flex justify-center pt-2'>
            <LanguageSwitcher onLocaleChange={closeMenu} />
          </div>
        </div>
      </div>
    </>
  );
}
