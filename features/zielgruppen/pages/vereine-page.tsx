import Link from 'next/link';
import BoardFaq from '@/components/custom-ui/board-faq';
import SegmentHeader from '../components/segment-header';
import SegmentBenefits from '../components/segment-benefits';
import SegmentObjections from '../components/segment-objections';
import VereineClubLevel from '../components/vereine-club-level';
import VereineYouth from '../components/vereine-youth';
import VereineTraining from '../components/vereine-training';
import VereinePrivacy from '../components/vereine-privacy';
import VereineRollout from '../components/vereine-rollout';
import VereineContact from '../components/vereine-contact';
import {
  CLUB_BENEFITS,
  CLUB_OBJECTIONS,
  VEREINE_CONTACT_ANCHOR,
  VEREINE_FAQS,
} from '../data/vereine-content';

/**
 * Club page `/fuer-vereine`.
 *
 * Written for one reader: the club with many youth teams that wants the same
 * statistics kept in all of them, training attendance in the same place, and
 * one screen the Abteilungsleitung can open on a Monday. That club is the one
 * for which the club level exists, and it is the one that pays for it.
 *
 * The page carries **no price figure** and asks for an enquiry rather than a
 * registration — not as a sales tactic but because it is true: a club is set up
 * by hand (see the rollout band), and what a club with twelve squads needs is
 * not what a club with two needs. The coach-level pricing lives on `/preise`
 * and is linked from the objections band for whoever came here looking for it.
 *
 * Band order follows the questions a club asks in sequence: what changes for us
 * → what exactly is this club area → does it fit our youth department → what
 * about training and attendance → is the data protection sorted → how do we
 * start → what will get said in the Vorstand → the rest → and only then the ask.
 * @returns A JSX element composing the ordered club-page sections.
 */
export default function VereinePage() {
  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <SegmentHeader
        kicker='Für Vereine'
        titleLead='Handball-Statistik für den ganzen'
        titleHighlight='Verein'
        lede='Zehn Jugendmannschaften, zehn Systeme: einer führt Excel, der nächste einen Zettel, der dritte gar nichts. Der Vereinsbereich von Statix legt eine Ebene über alle Mannschaften — alle erfassen nach demselben Schema, Kader und Trainingsbeteiligung liegen im selben Werkzeug, Spieler behalten ihre Laufbahn über die Jugenden hinweg, und die Abteilungsleitung sieht jede Mannschaft auf einer Seite. Was das für euren Verein heißt, klären wir im Gespräch.'
        trust={[
          'Persönlich eingerichtet',
          'AVV nach Art. 28 DSGVO',
          'Alle Mannschaften auf einer Seite',
        ]}
        primaryAction={{
          href: `#${VEREINE_CONTACT_ANCHOR}`,
          label: 'Verein anfragen',
        }}
        screenshot={{
          src: '/gameListOverview.png',
          alt: 'Spielübersicht mehrerer Handball-Mannschaften in der Statix App',
          label: 'Alle Spiele einer Mannschaft auf einen Blick',
        }}
      />

      <SegmentBenefits
        kicker='Was sich ändert'
        title='Ein Verein, ein Standard'
        description='Sechs Dinge, die erst funktionieren, wenn nicht jede Mannschaft ihr eigenes System fährt.'
        items={[...CLUB_BENEFITS]}
      />

      <VereineClubLevel />

      <VereineYouth />

      <VereineTraining />

      <VereinePrivacy />

      <VereineRollout />

      <SegmentObjections
        kicker='Klartext'
        title='Was im Vorstand gesagt wird'
        description='Die Sätze, an denen Einführungen scheitern — hier stehen sie mit Antwort.'
        items={[...CLUB_OBJECTIONS]}>
        <>
          Was der Einstieg für eine einzelne Trainerin kostet und wo die Grenzen
          des kostenlosen Zugangs liegen, steht auf der Seite{' '}
          <Link
            href='/preise'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Preise für die Handball-Statistik-App
          </Link>
          ; was ohne Bezahlung dauerhaft geht, unter{' '}
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
          . Und wenn ihr erst noch klären wollt, worauf ihr euch im Verein
          einigen müsst, bevor jemand etwas erfasst:{' '}
          <Link
            href='/ratgeber/handball-statistik-verein-einfuehren'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Statistiken im Verein einführen
          </Link>
          .
        </>
      </SegmentObjections>

      <BoardFaq
        id='faq'
        kicker='Nachgefragt'
        title='Häufige Fragen von Vereinen'
        description='Was Abteilungsleitungen und Vorstände wissen wollen, bevor sie Statix im Verein einführen.'
        items={VEREINE_FAQS}
      />

      <VereineContact />
    </div>
  );
}
