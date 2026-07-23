import { BRAND_FAQS } from '../data/brand-content';

/**
 * Visible brand FAQ. The matching FAQPage JSON-LD is emitted from the route
 * (`app/was-ist-statix/page.tsx`) from the same data, so markup and content
 * always match – a Google requirement for FAQ structured data.
 */
export default function BrandFaq() {
  return (
    <section className='w-full bg-card/60'>
      <div className='mx-auto max-w-3xl px-6 py-14 sm:px-8 md:py-20'>
        <h2 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
          Häufige Fragen zu Statix
        </h2>

        <div className='mt-8 space-y-8'>
          {BRAND_FAQS.map((faq) => (
            <div key={faq.question}>
              <h3 className='text-base font-semibold text-foreground'>
                {faq.question}
              </h3>
              <p className='mt-2 text-sm leading-7 text-muted-foreground'>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
