'use client';

import { useTranslations } from 'next-intl';
import { Grain, PlayerMagnet, SectionHeading } from '@/features/landing-page/components/tactic';
import { inlineLink } from '@/components/custom-ui/rich-text';
import type { HowToStep } from '../data/template-content';

/**
 * "So füllst du die Vorlage im Spiel aus" — the visible counterpart to the
 * HowTo JSON-LD emitted by the route. Same steps, same wording, so the markup
 * matches the page.
 * @returns A JSX element rendering the five filling steps.
 */
export default function TemplateHowTo() {
  const t = useTranslations('templatePage.howTo');
  const steps = t.raw('steps') as HowToStep[];

  return (
    <section className='relative w-full overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
        />

        <ol className='mt-12 flex flex-col gap-8'>
          {steps.map((step, index) => (
            <li
              key={step.name}
              id={`schritt-${index + 1}`}
              className='flex scroll-mt-24 items-start gap-4 sm:gap-5'>
              <PlayerMagnet number={index + 1} size='lg' className='shrink-0' />
              <div>
                <h3 className='font-display text-xl font-bold tracking-tight text-ink'>
                  {step.name}
                </h3>
                <p className='mt-2 max-w-[64ch] text-[15px] leading-7 text-ink/75'>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className='mt-10 max-w-[68ch] text-base leading-7 text-ink/70'>
          {t.rich('closing', {
            guide: inlineLink('/ratgeber/handball-statistik-fuehren'),
            rate: inlineLink('/ratgeber/wurfquote-berechnen'),
            calculator: inlineLink('/wurfquote-rechner'),
          })}
        </p>
      </div>
    </section>
  );
}
