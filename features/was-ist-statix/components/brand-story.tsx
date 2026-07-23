import { BRAND_AUDIENCES } from '../data/brand-content';

/**
 * Audience cards plus the person behind Statix. The "Wer steckt hinter
 * Statix?" paragraph reinforces the brand entity (person + product + origin)
 * for search engines.
 */
export default function BrandStory() {
  return (
    <section className='mx-auto w-full max-w-5xl px-6 py-14 sm:px-8 md:py-20'>
      <h2 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
        Für wen ist Statix gemacht?
      </h2>

      <div className='mt-8 grid gap-5 sm:grid-cols-2'>
        {BRAND_AUDIENCES.map((audience) => (
          <div
            key={audience.title}
            className='rounded-2xl border border-border/60 bg-card p-6'>
            <h3 className='text-base font-semibold text-foreground'>
              {audience.title}
            </h3>
            <p className='mt-2 text-sm leading-7 text-muted-foreground'>
              {audience.description}
            </p>
          </div>
        ))}
      </div>

      <h2 className='mt-14 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
        Wer steckt hinter Statix?
      </h2>
      <div className='mt-6 space-y-4 text-base leading-8 text-muted-foreground'>
        <p>
          Statix wird von Arkadiusz Weiss entwickelt – einem Handballer aus
          Deutschland, der die App aus der eigenen Praxis am Spielfeldrand
          heraus gebaut hat. Der Name steht für das, was die App im Kern tut:
          Statistiken, die im Handball wirklich weiterhelfen.
        </p>
        <p>
          Statix ist kein anonymes Tool eines großen Konzerns: Feedback von
          Trainerinnen und Trainern aus der Halle fließt direkt in die
          Entwicklung ein, und neue Funktionen entstehen dort, wo sie gebraucht
          werden – auf der Bank, im Training und in der Nachbereitung.
        </p>
      </div>
    </section>
  );
}
