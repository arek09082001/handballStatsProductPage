import { SITE_URL } from '@/lib/seo';
import { CALCULATOR_PAGE_PATH } from '../data/calculator-content';
import WurfquoteCalculator from '../components/wurfquote-calculator';

/**
 * Standalone calculator for `/wurfquote-rechner/embed` — no navbar, no footer,
 * no page chrome, so it sits cleanly inside a club site's iframe (the layout
 * wrapper skips its chrome for this route).
 *
 * The attribution line is the deal: clubs get a working tool, this page carries
 * one followed link back to the canonical calculator. Do not add `nofollow` —
 * that link is the point of the embed.
 * @returns A JSX element rendering the embeddable calculator.
 */
export default function WurfquoteRechnerEmbedPage() {
  return (
    <div className='min-h-screen bg-paper-2 px-3 py-4'>
      <div className='mx-auto flex w-full max-w-[620px] flex-col gap-3'>
        <h1 className='font-display text-lg font-bold tracking-tight text-ink'>
          Wurfquote berechnen
        </h1>

        <WurfquoteCalculator variant='embed' className='border border-ink/10' />

        <p className='text-center text-[13px] leading-6 text-ink/60'>
          <a
            href={`${SITE_URL}${CALCULATOR_PAGE_PATH}`}
            target='_blank'
            rel='noopener'
            className='font-semibold text-primary underline underline-offset-4'>
            Wurfquoten-Rechner von Statix
          </a>{' '}
          – der Handball-Statistik-App für Trainer
        </p>
      </div>
    </div>
  );
}
