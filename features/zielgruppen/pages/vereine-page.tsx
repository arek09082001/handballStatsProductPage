import Link from 'next/link';
import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq from '@/components/custom-ui/board-faq';
import SegmentHeader from '../components/segment-header';
import SegmentBenefits from '../components/segment-benefits';
import SegmentObjections from '../components/segment-objections';
import VereinePrivacy from '../components/vereine-privacy';
import {
  CLUB_BENEFITS,
  CLUB_OBJECTIONS,
  VEREINE_FAQS,
} from '../data/vereine-content';

/**
 * Club page `/fuer-vereine`. Argues the club case: one standard across all
 * teams, coaches sharing games, the board seeing development — then the data
 * protection answer and the two sentences that actually block a rollout.
 * @returns A JSX element composing the ordered club-page sections.
 */
export default function VereinePage() {
  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <SegmentHeader
        kicker='Für Vereine'
        titleLead='Handball-Statistik-App für'
        titleHighlight='Vereine'
        lede='Wenn jede Mannschaft anders mitschreibt, hat der Verein am Ende nichts. Statix gibt allen Teams dasselbe Schema: Spiele werden live per Tap erfasst, Trainer teilen Auswertungen untereinander, und der Vorstand sieht Entwicklung statt nur Tabellenplätze. Datenschutz ist geregelt, Kosten entstehen aktuell keine.'
        trust={['Aktuell 0 €', 'AVV auf Anforderung', 'Bis zu 3 Teams pro Konto']}
        screenshot={{
          src: '/gameListOverview.png',
          alt: 'Spielübersicht mehrerer Handball-Mannschaften in der Statix App',
          label: 'Alle Spiele einer Mannschaft auf einen Blick',
        }}
      />

      <SegmentBenefits
        kicker='Was sich ändert'
        title='Ein Verein, ein Standard'
        description='Fünf Dinge, die erst funktionieren, wenn nicht jeder Trainer sein eigenes System fährt.'
        items={[...CLUB_BENEFITS]}
      />

      <VereinePrivacy />

      <SegmentObjections
        kicker='Klartext'
        title='Was im Vorstand gesagt wird'
        description='Die Sätze, an denen Einführungen scheitern – hier stehen sie mit Antwort.'
        items={[...CLUB_OBJECTIONS]}>
        <>
          Zahlen und Grenzen im Detail stehen auf der Seite{' '}
          <Link
            href='/preise'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Preise für die Handball-Statistik-App
          </Link>
          ; was ohne Bezahlung dauerhaft geht, steht unter{' '}
          <Link
            href='/handball-statistik-app-kostenlos'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Handball-Statistik-App kostenlos
          </Link>
          . Für die Trainerinnen und Trainer eurer Jugendmannschaften gibt es
          eine eigene Seite:{' '}
          <Link
            href='/fuer-jugendtrainer'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Handball-Statistik für Jugendtrainer
          </Link>
          .
        </>
      </SegmentObjections>

      <BoardFaq
        id='faq'
        kicker='Nachgefragt'
        title='Häufige Fragen von Vereinen'
        description='Was Abteilungsleitungen und Vorstände wissen wollen, bevor sie Statix im Verein empfehlen.'
        items={VEREINE_FAQS}
      />

      <BoardCta
        kicker='Ohne Beschluss'
        title='Eine Mannschaft reicht für den Anfang'
        description='Ein Trainer, ein Spiel, kein Budgetantrag. Zeig die Live-Demo im nächsten Trainerabend – sie läuft im Browser, mit echten Spieldaten und ohne Account.'
        secondaryHref='/preise'
        secondaryLabel='Kosten für Vereine'
      />
    </div>
  );
}
