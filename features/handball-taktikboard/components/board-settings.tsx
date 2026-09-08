'use client';

import { Check, Copy, Download, Link2, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useBoardOptions } from '../data/use-board-options';
import type { CourtViewId } from '../interfaces';

interface BoardSettingsProps {
  formationId: string;
  view: CourtViewId;
  shareUrl: string;
  copied: boolean;
  isExporting: boolean;
  onFormationChange: (id: string) => void;
  onViewChange: (view: CourtViewId) => void;
  onExport: () => void;
  onCopyLink: () => void;
  onClear: () => void;
  className?: string;
}

/**
 * Everything you set up once, below the board: which formation to start from,
 * which court, and the two ways out — a PNG and a link.
 *
 * Deliberately **not** tied to the board's width. The board is capped by the
 * viewport height so the whole court stays visible, which on a wide screen
 * leaves it narrower than the page; a select and three buttons squeezed into
 * that same column wrapped into a tall stack for no reason. This card takes the
 * full text column instead.
 * @returns A JSX element rendering the board's setup and export controls.
 */
export default function BoardSettings({
  formationId,
  view,
  shareUrl,
  copied,
  isExporting,
  onFormationChange,
  onViewChange,
  onExport,
  onCopyLink,
  onClear,
  className,
}: BoardSettingsProps) {
  const t = useTranslations('boardPage.tool.settings');
  const { courtViews, formations } = useBoardOptions();
  const activeFormation = formations.find(
    (preset) => preset.id === formationId,
  );

  const labelClass =
    'block text-[13px] font-semibold uppercase tracking-wide text-ink/55';
  const fieldClass =
    'h-11 w-full rounded-xl border border-ink/15 bg-paper px-3 text-sm text-ink outline-none transition-colors hover:border-ink/30 focus:border-primary focus:ring-2 focus:ring-primary/25';
  const chipClass =
    'inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-xl border border-ink/15 bg-paper px-4 text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-paper-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
  const chipActive =
    'border-primary bg-primary/12 text-primary hover:bg-primary/12';

  return (
    <div
      className={cn(
        'rounded-2xl border border-ink/10 bg-paper p-4 sm:p-5',
        className,
      )}>
      <div className='flex flex-wrap items-end gap-x-5 gap-y-4'>
        <div className='min-w-60 flex-1 sm:max-w-xs'>
          <label className={labelClass} htmlFor='taktikboard-aufstellung'>
            {t('formationLabel')}
          </label>
          <select
            id='taktikboard-aufstellung'
            value={formationId}
            onChange={(event) => onFormationChange(event.target.value)}
            className={cn(fieldClass, 'mt-1.5 cursor-pointer font-semibold')}>
            {formationId === '' ? (
              <option value=''>{t('sharedBoard')}</option>
            ) : null}
            {/* Grouped by court, so it is obvious which setup switches the
                view — a Tempogegenstoß cannot be shown on a half field. */}
            {courtViews.map((courtView) => (
              <optgroup key={courtView.id} label={courtView.label}>
                {formations
                  .filter((preset) => preset.view === courtView.id)
                  .map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.label}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <span className={labelClass} id='taktikboard-feld-legende'>
            {t('courtLabel')}
          </span>
          <div
            className='mt-1.5 flex gap-2'
            role='group'
            aria-labelledby='taktikboard-feld-legende'>
            {courtViews.map((courtView) => (
              <button
                key={courtView.id}
                type='button'
                aria-pressed={view === courtView.id}
                title={courtView.hint}
                onClick={() => onViewChange(courtView.id)}
                className={cn(chipClass, view === courtView.id && chipActive)}>
                {courtView.label}
              </button>
            ))}
          </div>
        </div>

        <div className='flex flex-wrap gap-2 lg:ml-auto'>
          <button
            type='button'
            onClick={onExport}
            disabled={isExporting}
            className={cn(
              chipClass,
              'border-primary bg-primary text-white hover:border-primary hover:bg-primary hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-55',
            )}>
            <Download className='size-4' aria-hidden='true' />
            {isExporting ? t('exportBusy') : t('export')}
          </button>
          <button type='button' onClick={onCopyLink} className={chipClass}>
            {copied ? (
              <Check className='size-4' aria-hidden='true' />
            ) : (
              <Link2 className='size-4' aria-hidden='true' />
            )}
            {copied ? t('linkCopied') : t('copyLink')}
          </button>
          <button type='button' onClick={onClear} className={chipClass}>
            <Trash2 className='size-4' aria-hidden='true' />
            {t('clear')}
          </button>
        </div>
      </div>

      <p className='mt-3 max-w-[80ch] text-[13px] leading-6 text-ink/60'>
        {activeFormation?.hint ?? t('sharedHint')}
      </p>

      <div className='mt-4 border-t border-ink/10 pt-4'>
        <label className={labelClass} htmlFor='taktikboard-link'>
          {t('shareLinkLabel')}
        </label>
        <div className='mt-1.5 flex gap-2'>
          <input
            id='taktikboard-link'
            type='text'
            readOnly
            value={shareUrl}
            onFocus={(event) => event.currentTarget.select()}
            className={cn(fieldClass, 'flex-1 text-[13px]')}
          />
          <button
            type='button'
            onClick={onCopyLink}
            aria-label={t('copyAria')}
            className={cn(chipClass, 'w-11 shrink-0 px-0')}>
            <Copy className='size-4' aria-hidden='true' />
          </button>
        </div>
        <p className='mt-2 max-w-[80ch] text-[13px] leading-6 text-ink/60'>
          {t('shareNote')}
        </p>
      </div>
    </div>
  );
}
