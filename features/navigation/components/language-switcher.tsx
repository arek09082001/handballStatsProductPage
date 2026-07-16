'use client';

import { useTranslations } from 'next-intl';
import Flag from 'react-world-flags';
import { APP_LOCALES, type AppLocale } from '@/i18n/config';
import { useAppLocale } from '@/app/locale-provider';
import { cn } from '@/lib/utils';

type LanguageSwitcherProps = {
  className?: string;
  onLocaleChange?: () => void;
};

const LOCALE_FLAG_CODES: Record<AppLocale, string> = {
  de: 'DE',
  en: 'GB',
};

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
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-2xl border border-slate-200/90 bg-white/90 p-1 shadow-[0_12px_28px_-20px_rgba(15,23,42,0.45)] backdrop-blur',
        className,
      )}
      aria-label={t('label')}
      role='group'>
      {APP_LOCALES.map((supportedLocale) => {
        const isActive = supportedLocale === activeLocale;

        return (
          <button
            key={supportedLocale}
            type='button'
            onClick={() => handleLocaleChange(supportedLocale)}
            className={cn(
              'inline-flex h-9 w-10 items-center justify-center rounded-xl border transition-all duration-150',
              isActive
                ? 'border-slate-200 bg-slate-950/4 shadow-sm'
                : 'border-transparent bg-transparent hover:border-slate-200 hover:bg-slate-50/80',
            )}
            aria-pressed={isActive}
            aria-label={
              supportedLocale === 'de'
                ? t('switchToGerman')
                : t('switchToEnglish')
            }
            disabled={isActive}>
            <span
              className={cn(
                'overflow-hidden rounded-[7px] ring-1 ring-black/10 transition-transform duration-150',
                isActive ? 'scale-105' : 'scale-100',
              )}>
              <Flag
                code={LOCALE_FLAG_CODES[supportedLocale]}
                alt={
                  supportedLocale === 'de'
                    ? t('germanFlagAlt')
                    : t('englishFlagAlt')
                }
                width='22'
                height='16'
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
