import Link from 'next/link';
import { Grain, PlayerMagnet, SectionHeading } from '@/features/landing-page/components/tactic';
import { TEMPLATE_HOW_TO } from '../data/template-content';

/**
 * "So füllst du die Vorlage im Spiel aus" — the visible counterpart to the
 * HowTo JSON-LD emitted by the route. Same steps, same wording, so the markup
 * matches the page.
 * @returns A JSX element rendering the five filling steps.
 */
export default function TemplateHowTo() {
  return (
    <section className='relative w-full overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='In fünf Schritten'
          title='So füllst du die Vorlage im Spiel aus'
          description='Einmal einrichten, dann pro Aktion eine Zeile. Mehr ist es nicht.'
        />

        <ol className='mt-12 flex flex-col gap-8'>
          {TEMPLATE_HOW_TO.map((step, index) => (
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
          Wenn du beim Erfassen unsicher bist, was als Wurf zählt und was nicht:
          Im Ratgeber steht,{' '}
          <Link
            href='/ratgeber/handball-statistik-fuehren'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            wie du eine Handball-Statistik sauber führst
          </Link>{' '}
          – und wie du{' '}
          <Link
            href='/ratgeber/wurfquote-berechnen'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            die Wurfquote berechnest und richtig deutest
          </Link>
          . Für einzelne Werte zwischendurch gibt es den{' '}
          <Link
            href='/wurfquote-rechner'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Wurfquoten-Rechner
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
