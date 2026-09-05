'use client';

import { Check } from 'lucide-react';
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
import LocaleFlag from './locale-flag';

type LanguageSwitcherProps = {
  className?: string;
  onLocaleChange?: () => void;
};

/**
 * Language picker for the site header and the mobile menu.
 *
 * A menu rather than the row of buttons it used to be: five 40 px buttons are
 * 200 px of navbar spent on a control most visitors never touch. The flags stay
 * — they are what people actually scan for — and each one is paired with the
 * language named in itself ("Polski", not "Polnisch"), because the person who
 * needs this control is the one who cannot read the language currently on
 * screen. The flag finds the row, the endonym confirms it.
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
        <LocaleFlag locale={activeLocale} />
        <span className='uppercase tracking-wide'>{activeLocale}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='min-w-48'>
        {APP_LOCALES.map((supportedLocale) => {
          const isActive = supportedLocale === activeLocale;

          return (
            <DropdownMenuItem
              key={supportedLocale}
              onSelect={() => handleLocaleChange(supportedLocale)}
              aria-current={isActive ? 'true' : undefined}
              className={cn('gap-2.5', isActive && 'font-semibold')}>
              <LocaleFlag locale={supportedLocale} />
              <span className='flex-1'>
                {APP_LOCALE_ENDONYMS[supportedLocale]}
              </span>
              <span className='text-xs uppercase tracking-wide text-muted-foreground'>
                {supportedLocale}
              </span>
              <Check
                className={cn('h-4 w-4', !isActive && 'opacity-0')}
                aria-hidden
              />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
