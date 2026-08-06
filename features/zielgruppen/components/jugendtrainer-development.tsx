import Link from 'next/link';
import { BoardScreenshot, Grain, SectionHeading } from '@/features/landing-page/components/tactic';

/**
 * The youth-specific argument: development you can show a 14-year-old, backed
 * by the player cards that already exist in the app. Also the hand-off into the
 * Ratgeber articles a youth coach is most likely to want next.
 * @returns A JSX element rendering the development band on the paper panel ground.
 */
export default function JugendtrainerDevelopment() {
  return (
    <section className='relative w-full overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto grid max-w-6xl gap-12 px-6 sm:px-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-14'>
        <div>
          <SectionHeading
            align='left'
            kicker='Über eine Saison'
            title='Entwicklung sichtbar machen'
            description='Ein einzelnes Spiel sagt wenig. Zwölf Spiele sagen, ob dein Training ankommt.'
          />

          <p className='mt-6 max-w-[62ch] text-base leading-7 text-ink/75'>
            Im Jugendbereich schwankt Leistung von Woche zu Woche – das gehört
            dazu. Deshalb ist der Verlauf die eigentliche Information: Wie hat
            sich die Wurfquote von außen entwickelt, seit ihr im Training an den
            Winkeln arbeitet? Wer übernimmt inzwischen Abschlüsse, der vor drei
            Monaten nur abgespielt hat? Das sind die Sätze, die ein Kind
            weiterbringen – und die du im Elterngespräch belegen kannst.
          </p>

          <p className='mt-4 max-w-[62ch] text-base leading-7 text-ink/75'>
            Praxisnah weiterlesen:{' '}
            <Link
              href='/ratgeber/handball-spielerentwicklung-messen'
              className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
              Spielerentwicklung im Handball messen
            </Link>
            ,{' '}
            <Link
              href='/ratgeber/jugendhandball-trainieren'
              className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
              Jugendhandball trainieren
            </Link>{' '}
            und für die Kleinsten{' '}
            <Link
              href='/ratgeber/handball-minihandball-kinder'
              className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
              Minihandball mit Kindern
            </Link>
            .
          </p>
        </div>

        <BoardScreenshot
          src='/teamManagement.png'
          alt='Kader als Kartenalbum: Spielerkarten mit Werten aus echten Handballspielen'
          width={1916}
          height={879}
          label='Kader mit Spielerkarten und Werten'
          tone='paper'
          pin='magnet'
          sizes='(max-width: 1024px) 100vw, 48vw'
        />
      </div>
    </section>
  );
}
