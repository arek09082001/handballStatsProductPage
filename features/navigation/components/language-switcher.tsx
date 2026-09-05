'use client';

import { Check, Languages } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  APP_LOCALES,
  APP_LOCALE_ENDONYMS,
  type AppLocale,
} from '@/i18n/config';
import { useAppLocale } from '@/app/locale-provider';
import { cn } from '@/lib/utils';

type LanguageSwitcherProps = {
  className?: string;
  onLocaleChange?: () => void;
};

/**
 * Language picker for the site header and the mobile menu.
 *
 * A menu rather than the row of flag buttons it used to be. Five 40 px buttons
 * are 200 px of navbar spent on a control most visitors never touch, and the
 * flags were wrong in the first place: they came from `react-world-flags`,
 * which embeds every country flag on earth as a data URI to draw two 22×16
 * rectangles, and they answered the wrong question — Spanish is not Spain, and
 * English was flying a British flag at readers anywhere but Britain.
 *
 * The names are endonyms, so the one person who needs this control — the one
 * who cannot read the language currently on screen — can find their own.
 */
export default function LanguageSwitcher({
  className,
  onLocaleChange,
}: LanguageSwitcherProps) {
  const { locale: activeLocale, setLocale } = useAppLocale();
  const t = useTranslations('navigationSection.languageSwitcher');

  const handleLocaleChange = (nextLocale: AppLocale) => {
    if (nextLocale === activeLocale) {
      return;
    }

    setLocale(nextLocale);
    onLocaleChange?.();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('label')}
        title={APP_LOCALE_ENDONYMS[activeLocale]}
        className={cn(
          'inline-flex items-center gap-2 rounded-2xl border border-slate-200/90 bg-white/90 px-3 py-2 text-sm font-semibold text-slate-700 shadow-[0_12px_28px_-20px_rgba(15,23,42,0.45)] backdrop-blur transition-colors',
          'hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60',
          className,
        )}>
        <Languages className='h-4 w-4 text-slate-500' aria-hidden />
        <span className='uppercase tracking-wide'>{activeLocale}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='min-w-44'>
        {APP_LOCALES.map((supportedLocale) => {
          const isActive = supportedLocale === activeLocale;

          return (
            <DropdownMenuItem
              key={supportedLocale}
              onSelect={() => handleLocaleChange(supportedLocale)}
              aria-current={isActive ? 'true' : undefined}
              className={cn('gap-2', isActive && 'font-semibold')}>
              <Check
                className={cn('h-4 w-4', !isActive && 'opacity-0')}
                aria-hidden
              />
              <span className='flex-1'>
                {APP_LOCALE_ENDONYMS[supportedLocale]}
              </span>
              <span className='text-xs uppercase tracking-wide text-slate-400'>
                {supportedLocale}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
