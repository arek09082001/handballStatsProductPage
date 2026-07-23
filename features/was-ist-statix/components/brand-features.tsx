import { APP_FEATURES } from '@/lib/seo';

/**
 * Feature grid generated from the same `APP_FEATURES` list that feeds the
 * SoftwareApplication schema and llms.txt, so this page never drifts from the
 * actual feature set.
 */
export default function BrandFeatures() {
  return (
    <section className='w-full bg-card/60'>
      <div className='mx-auto max-w-5xl px-6 py-14 sm:px-8 md:py-20'>
        <h2 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
          Was kann Statix?
        </h2>
        <p className='mt-4 max-w-2xl text-base leading-8 text-muted-foreground'>
          Alle Funktionen der Statix App auf einen Blick – von der
          Live-Erfassung bis zur KI-Analyse.
        </p>

        <div className='mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {APP_FEATURES.map((feature) => (
            <div
              key={feature.slug}
              className='rounded-2xl border border-border/60 bg-background p-5'>
              <h3 className='text-sm font-semibold text-foreground'>
                {feature.name}
              </h3>
              <p className='mt-2 text-sm leading-6 text-muted-foreground'>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
