import Link from 'next/link';
import { BoardScreenshot, Grain, SectionHeading } from '@/features/landing-page/components/tactic';

/**
 * The bridge from the spreadsheet to the app: what changes when the same
 * actions are tapped instead of typed. Keeps the template's dignity — it says
 * "wenn sie nicht mehr reicht", not "wirf sie weg".
 * @returns A JSX element rendering the hand-off from template to app.
 */
export default function TemplateUpgrade() {
  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto grid max-w-6xl gap-12 px-6 sm:px-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-14'>
        <div>
          <SectionHeading
            align='left'
            kicker='Der nächste Schritt'
            title='Wenn die Vorlage nicht mehr reicht'
            description='Dieselben Aktionen, nur getippt statt geschrieben – und die Auswertung steht, wenn die Sirene geht.'
          />

          <p className='mt-6 max-w-[62ch] text-base leading-7 text-ink/75'>
            Statix ist im Kern dieselbe Idee wie diese Vorlage: eine Zeile pro
            Aktion. Nur dass die Zeile ein Tap auf dem Handy ist, dass die
            Wurfposition mitkommt und daraus ein Wurfbild entsteht, und dass
            nach dem Spiel niemand mehr etwas abtippt. Offline in der Halle
            funktioniert es auch – die Daten wandern hoch, sobald wieder Netz
            da ist.
          </p>

          <p className='mt-4 max-w-[62ch] text-base leading-7 text-ink/75'>
            Was das kostet, steht auf der Seite{' '}
            <Link
              href='/preise'
              className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
              Preise für die Handball-Statistik-App
            </Link>{' '}
            – kurz gesagt: aktuell nichts. Wie weit du damit{' '}
            <Link
              href='/handball-statistik-app-kostenlos'
              className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
              kostenlos kommst
            </Link>
            , steht dort im Detail. Und wenn du erst wissen willst, was die App
            überhaupt macht:{' '}
            <Link
              href='/was-ist-statix'
              className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
              Was ist Statix?
            </Link>
          </p>
        </div>

        <BoardScreenshot
          src='/statsTableInGame.png'
          alt='Spielerstatistiken und Wurfquoten in der Statix Handball-App statt in einer Excel-Tabelle'
          width={2560}
          height={2000}
          label='Auswertung direkt nach dem Schlusspfiff'
          tone='paper'
          pin='magnet'
          sizes='(max-width: 1024px) 100vw, 48vw'
        />
      </div>
    </section>
  );
}
