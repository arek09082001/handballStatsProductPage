import { Download, FileSpreadsheet } from 'lucide-react';
import {
  BoardCard,
  BoardKicker,
  CourtDiagram,
  Grain,
  MarkerUnderline,
} from '@/features/landing-page/components/tactic';
import { TEMPLATE_FILE } from '../data/template-content';
import TemplateNewsletterOptin from './template-newsletter-optin';

/**
 * Court hero for the Excel template page. The download sits above the fold and
 * is a plain link to the file — no form, no e-mail address, no consent in
 * between (Kopplungsverbot). The optional newsletter form sits beside it.
 * @returns A JSX element rendering the hero with the download block.
 */
export default function TemplateHeader() {
  return (
    <header className='relative isolate w-full overflow-hidden bg-court text-chalk'>
      <CourtDiagram
        variant='goal'
        aria-hidden
        className='pointer-events-none absolute -left-[22%] top-1/2 h-[95%] w-auto -translate-y-1/2 text-chalk/[0.12] sm:-left-[14%] lg:-left-[8%]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 pb-16 pt-28 sm:px-10 lg:flex-row lg:items-start lg:gap-14 lg:pb-24 lg:pt-32'>
        <div className='w-full shrink-0 text-center lg:w-[52%] lg:text-left'>
          <BoardKicker color='chalk' className='justify-center lg:justify-start'>
            Kostenloser Download
          </BoardKicker>

          <h1 className='mt-5 font-display text-[2.4rem] font-extrabold leading-[1.03] tracking-[-0.035em] text-chalk sm:text-[3.1rem]'>
            Handball-Statistik{' '}
            <span className='relative inline-block text-primary'>
              Excel-Vorlage
              <MarkerUnderline color='marker' />
            </span>{' '}
            kostenlos
          </h1>

          <p className='mx-auto mt-6 max-w-[58ch] text-base leading-7 text-chalk/75 sm:text-lg sm:leading-8 lg:mx-0'>
            Vier Blätter, fertige Formeln, deutsche Spaltenköpfe: Kader,
            Spielprotokoll, Auswertung und Saison. Wurfquote, Siebenmeter-Quote
            und Paradenquote rechnen sich selbst – du trägst nur ein, was auf
            dem Feld passiert. Ohne Anmeldung, ohne E-Mail-Adresse.
          </p>

          <ul className='mx-auto mt-6 flex max-w-[58ch] flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-chalk/70 lg:mx-0 lg:justify-start'>
            <li>{TEMPLATE_FILE.squadSlots} Kaderplätze</li>
            <li aria-hidden className='text-chalk/25'>
              ·
            </li>
            <li>{TEMPLATE_FILE.actionRows} Aktionszeilen</li>
            <li aria-hidden className='text-chalk/25'>
              ·
            </li>
            <li>{TEMPLATE_FILE.games} Spiele pro Saison</li>
            <li aria-hidden className='text-chalk/25'>
              ·
            </li>
            <li>druckfertig eingerichtet</li>
          </ul>
        </div>

        <div className='w-full lg:min-w-0 lg:flex-1'>
          <BoardCard tone='court' pin='tape' className='p-6 sm:p-7'>
            <div className='flex items-start gap-4'>
              <span className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary'>
                <FileSpreadsheet className='size-6' />
              </span>
              <div className='min-w-0'>
                <h2 className='font-display text-lg font-bold tracking-tight text-chalk'>
                  Vorlage herunterladen
                </h2>
                <p className='mt-1 break-all text-[13px] text-chalk/60'>
                  {TEMPLATE_FILE.name} · XLSX
                </p>
              </div>
            </div>

            <a
              href={TEMPLATE_FILE.path}
              download
              className='mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 font-display text-[15px] font-bold tracking-tight text-white shadow-[0_14px_26px_-14px_hsl(22_90%_45%/0.85)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-court sm:h-14'>
              <Download className='size-4' />
              Excel-Vorlage kostenlos laden
            </a>

            <p className='mt-3 text-center text-[13px] leading-6 text-chalk/60'>
              Sofortiger Download. Keine Anmeldung, kein Newsletter-Zwang.
            </p>

            <div className='mt-6 border-t border-chalk/12 pt-5'>
              <TemplateNewsletterOptin />
            </div>
          </BoardCard>
        </div>
      </div>
    </header>
  );
}
