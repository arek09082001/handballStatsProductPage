import Image from 'next/image';
import Link from 'next/link';
import { BoardKicker, Grain } from '@/features/landing-page/components/tactic';

/**
 * The founder story — the same one told on the home page and the brand page,
 * because it is the honest substitute for reviews a young product does not
 * have yet. Nothing here goes beyond PRODUCT.md.
 * @returns A JSX element rendering the founder story on the paper panel ground.
 */
export default function ErfahrungenStory() {
  return (
    <section className='relative w-full overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-5xl px-6 sm:px-10'>
        <figure className='board-shadow relative overflow-hidden rounded-3xl border border-ink/10 bg-paper'>
          <span
            aria-hidden
            className='absolute -top-3 left-10 z-10 h-6 w-24 -rotate-6 rounded-[2px] bg-chalk/50 ring-1 ring-black/5 backdrop-blur-[1px]'
            style={{
              maskImage:
                'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
            }}
          />
          <div className='grid items-stretch lg:grid-cols-2'>
            <div className='relative min-h-64 lg:min-h-full'>
              <Image
                src='/1000000920.jpg'
                alt='Handball in der Halle – Statix entsteht aus der Praxis am Spielfeldrand'
                fill
                sizes='(max-width: 1024px) 100vw, 50vw'
                className='object-cover'
              />
              <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-court/40 to-transparent lg:bg-gradient-to-r' />
            </div>

            <div className='p-8 sm:p-10'>
              <BoardKicker>Von einem Handballer entwickelt</BoardKicker>
              <h2 className='mt-3 font-display text-[1.75rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.1rem]'>
                Wer hinter Statix steht
              </h2>
              <div className='mt-5 space-y-4 text-base leading-8 text-ink/75'>
                <p>
                  Statix wird von Arkadiusz Weiss entwickelt – einem Handballer
                  aus Deutschland, der die App aus der eigenen Praxis am
                  Spielfeldrand heraus gebaut hat. Der Anlass war banal: Die
                  Zahlen, die ein Trainer nach dem Spiel braucht, standen
                  nirgends. Auf dem Zettel war die Hälfte nicht lesbar, und
                  abends hatte niemand Lust, sie abzutippen.
                </p>
                <p>
                  Statix ist deshalb kein Tool aus einem Produktplan, sondern
                  aus einer Sporthalle. Feedback von Trainerinnen und Trainern
                  fließt direkt in die Entwicklung ein, und neue Funktionen
                  entstehen dort, wo sie gebraucht werden – auf der Bank, im
                  Training und in der Nachbereitung.
                </p>
                <p className='text-[15px]'>
                  Mehr über die App:{' '}
                  <Link
                    href='/was-ist-statix'
                    className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
                    Was ist Statix?
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
