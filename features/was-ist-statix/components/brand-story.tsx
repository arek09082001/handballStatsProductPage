import Image from 'next/image';
import {
  ClipboardCheck,
  Heart,
  ShieldCheck,
  Users2,
  type LucideIcon,
} from 'lucide-react';
import { BRAND_AUDIENCES } from '../data/brand-content';
import Reveal from './reveal';

/** Icon per audience, keyed by the `icon` field in {@link BRAND_AUDIENCES}. */
const AUDIENCE_ICONS: Record<string, LucideIcon> = {
  coach: ClipboardCheck,
  club: ShieldCheck,
  player: Users2,
  fans: Heart,
};

/**
 * Audience cards plus the person behind Statix. The "Wer steckt hinter Statix?"
 * block pairs the founder story with a real handball photo, reinforcing the
 * brand entity (person + product + origin) for search engines.
 * @returns A JSX element rendering the audience cards and the founder story with a photo.
 */
export default function BrandStory() {
  return (
    <section className='w-full bg-muted/30'>
      <div className='mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 md:py-24'>
        <Reveal className='mx-auto max-w-3xl text-center'>
          <h2 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            Für wen ist Statix gemacht?
          </h2>
          <p className='mt-4 text-base leading-7 text-muted-foreground'>
            Vom Trainer an der Bank bis zu den Fans auf der Tribüne – Statix
            bringt allen rund ums Team echte Zahlen.
          </p>
        </Reveal>

        <div className='mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {BRAND_AUDIENCES.map((audience, index) => {
            const Icon = AUDIENCE_ICONS[audience.icon] ?? Users2;

            return (
              <Reveal
                key={audience.title}
                delay={(index % 4) * 0.05}
                className='h-full rounded-2xl border border-border/60 bg-card p-6'>
                <span className='flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                  <Icon className='size-5' />
                </span>
                <h3 className='mt-4 text-base font-semibold text-foreground'>
                  {audience.title}
                </h3>
                <p className='mt-2 text-sm leading-7 text-muted-foreground'>
                  {audience.description}
                </p>
              </Reveal>
            );
          })}
        </div>

        <Reveal className='mt-16 overflow-hidden rounded-3xl border border-border/60 bg-card'>
          <div className='grid items-stretch gap-0 lg:grid-cols-2'>
            <div className='relative min-h-64 lg:min-h-full'>
              <Image
                src='/1000000918.jpg'
                alt='Handball in der Halle – Statix entsteht aus der Praxis am Spielfeldrand'
                fill
                sizes='(max-width: 1024px) 100vw, 50vw'
                className='object-cover'
              />
              <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:bg-gradient-to-r' />
            </div>

            <div className='p-8 sm:p-10'>
              <h2 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
                Wer steckt hinter Statix?
              </h2>
              <div className='mt-5 space-y-4 text-base leading-8 text-muted-foreground'>
                <p>
                  Statix wird von Arkadiusz Weiss entwickelt – einem Handballer
                  aus Deutschland, der die App aus der eigenen Praxis am
                  Spielfeldrand heraus gebaut hat. Der Name steht für das, was
                  die App im Kern tut: Statistiken, die im Handball wirklich
                  weiterhelfen.
                </p>
                <p>
                  Statix ist kein anonymes Tool eines großen Konzerns: Feedback
                  von Trainerinnen und Trainern aus der Halle fließt direkt in
                  die Entwicklung ein, und neue Funktionen entstehen dort, wo sie
                  gebraucht werden – auf der Bank, im Training und in der
                  Nachbereitung.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
