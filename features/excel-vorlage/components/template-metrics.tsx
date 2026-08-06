import { Check } from 'lucide-react';
import { BoardCard, Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import { TEMPLATE_METRICS } from '../data/template-content';

/**
 * "Welche Kennzahlen die Vorlage erfasst" — one card per sheet, so a coach can
 * see before downloading whether the file covers what they track.
 * @returns A JSX element listing the tracked metrics per sheet.
 */
export default function TemplateMetrics() {
  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-6xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Vier Blätter'
          title='Welche Kennzahlen die Vorlage erfasst'
          description='Nichts davon musst du selbst zusammenbauen – die Formeln sind drin und rechnen, sobald du die erste Zeile einträgst.'
        />

        <div className='mt-12 grid gap-6 md:grid-cols-2'>
          {TEMPLATE_METRICS.map((group, index) => (
            <BoardCard
              key={group.sheet}
              pin='magnet'
              pinColor={index % 2 === 0 ? 'marker' : 'opponent'}
              className='p-6 sm:p-7'>
              <h3 className='font-display text-xl font-bold tracking-tight text-ink'>
                {group.sheet}
              </h3>
              <p className='mt-2 text-[15px] leading-7 text-ink/70'>{group.description}</p>
              <ul className='mt-4 flex flex-col gap-2'>
                {group.metrics.map((metric) => (
                  <li
                    key={metric}
                    className='flex items-start gap-2.5 text-[15px] leading-6 text-ink/80'>
                    <span className='mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success'>
                      <Check className='size-3' strokeWidth={3} />
                    </span>
                    {metric}
                  </li>
                ))}
              </ul>
            </BoardCard>
          ))}
        </div>
      </div>
    </section>
  );
}
