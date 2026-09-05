'use client';

import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DEFAULT_LOCALE } from '@/i18n/config';
import { useAppLocale } from '@/app/locale-provider';
import { cn } from '@/lib/utils';

/**
 * "The German version is the authoritative one" — on the three legal pages
 * (GTC, privacy policy, imprint), in every language but German.
 *
 * These documents are operative, not marketing: the GTC carry the statutory
 * withdrawal instructions, the privacy policy names legal bases and
 * processors, and the imprint is the § 5 DDG provider identification. They are
 * drafted in German for a German provider under German law, so a translation
 * is a reading aid and has to say so. Without that sentence each translation
 * would read as a document in its own right, and a defective withdrawal
 * instruction extends the withdrawal period by law.
 *
 * Not rendered in German, where the sentence would be telling the reader that
 * the page they are on is the page they are on. The string still exists in
 * `de.json` so every bundle carries the same keys.
 */
export default function TranslationNotice({ className }: { className?: string }) {
  const { locale } = useAppLocale();
  const t = useTranslations('legalTranslationNotice');

  if (locale === DEFAULT_LOCALE) {
    return null;
  }

  return (
    <aside
      className={cn(
        'flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm leading-6 text-amber-950',
        className,
      )}>
      <Info className='mt-0.5 h-4 w-4 shrink-0 text-amber-600' aria-hidden />
      <p>
        <strong className='font-semibold'>{t('title')}:</strong> {t('body')}
      </p>
    </aside>
  );
}
