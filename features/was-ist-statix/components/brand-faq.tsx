import { HelpCircle } from 'lucide-react';
import { BRAND_FAQS } from '../data/brand-content';
import Reveal from './reveal';

/**
 * Visible brand FAQ, rendered as hairline cards. The matching FAQPage JSON-LD
 * is emitted from the route (`app/was-ist-statix/page.tsx`) from the same data,
 * so markup and content always match – a Google requirement for FAQ structured
 * data.
 * @returns A JSX element rendering the brand FAQ as a two-column card grid.
 */
export default function BrandFaq() {
  return (
    <section className='w-full bg-background'>
      <div className='mx-auto max-w-5xl px-6 py-16 sm:px-8 md:py-24'>
        <Reveal className='mx-auto max-w-3xl text-center'>
          <h2 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            Häufige Fragen zu Statix
          </h2>
          <p className='mt-4 text-base leading-7 text-muted-foreground'>
            Alles, was Leute wissen wollen, die zum ersten Mal von Statix hören.
          </p>
        </Reveal>

        <div className='mt-12 grid gap-4 sm:grid-cols-2'>
          {BRAND_FAQS.map((faq, index) => (
            <Reveal
              key={faq.question}
              delay={(index % 2) * 0.05}
              className='h-full rounded-2xl border border-border/60 bg-card p-6'>
              <div className='flex items-start gap-3'>
                <span className='mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                  <HelpCircle className='size-4' />
                </span>
                <div>
                  <h3 className='text-base font-semibold text-foreground'>
                    {faq.question}
                  </h3>
                  <p className='mt-2 text-sm leading-7 text-muted-foreground'>
                    {faq.answer}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
