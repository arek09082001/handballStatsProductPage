import {
  CourtDiagram,
  Grain,
  PlayerMagnet,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { cn } from '@/lib/utils';
import type { Feature } from '../data/features';

/**
 * "So läuft das" — the feature's steps as the coach's roster: a numbered magnet
 * per row, hairline rules between them. Same point-list grammar as the landing
 * page's operate bands (see DESIGN.md), so a feature page reads as part of the
 * board rather than as a generic icon grid.
 *
 * `tone` exists for the three features that have exactly one screenshot: the
 * hero pins it, the shot band renders nothing, and the page would then run five
 * paper bands in a row. There the steps take the court instead, which restores
 * the light/dark rhythm without inventing a picture that does not exist.
 * @returns A JSX element rendering the numbered steps.
 */
export default function FeatureSteps({
  feature,
  tone = 'paper',
}: {
  feature: Feature;
  tone?: 'paper' | 'court';
}) {
  const onPaper = tone === 'paper';

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden py-20 md:py-24',
        onPaper ? 'bg-paper' : 'bg-court text-chalk',
      )}>
      {onPaper ? null : (
        <CourtDiagram
          variant='goal'
          aria-hidden
          className='pointer-events-none absolute -right-[18%] top-1/2 h-[118%] w-auto -translate-y-1/2 text-chalk/[0.07] sm:-right-[10%] lg:-right-[4%]'
        />
      )}
      <Grain tone={tone} />

      <div className='relative mx-auto w-full max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Der Ablauf'
          title='So läuft das in der Praxis'
          tone={tone}
        />

        <div
          className={cn(
            'mt-10 border-t',
            onPaper ? 'border-ink/10' : 'border-chalk/15',
          )}>
          {feature.steps.map((step, index) => (
            <div
              key={step.title}
              className={cn(
                'flex items-start gap-5 border-b py-6',
                onPaper ? 'border-ink/10' : 'border-chalk/12',
              )}>
              <PlayerMagnet
                number={index + 1}
                team='home'
                size='md'
                className='shrink-0'
              />
              <div>
                <h3
                  className={cn(
                    'font-display text-lg font-bold tracking-[-0.01em]',
                    onPaper ? 'text-ink' : 'text-chalk',
                  )}>
                  {step.title}
                </h3>
                <p
                  className={cn(
                    'mt-1.5 max-w-[64ch] text-[15px] leading-7',
                    onPaper ? 'text-ink/70' : 'text-chalk/70',
                  )}>
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
