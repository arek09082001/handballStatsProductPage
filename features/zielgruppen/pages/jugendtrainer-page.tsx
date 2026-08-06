import Link from 'next/link';
import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq from '@/components/custom-ui/board-faq';
import SegmentHeader from '../components/segment-header';
import SegmentBenefits from '../components/segment-benefits';
import SegmentObjections from '../components/segment-objections';
import JugendtrainerDevelopment from '../components/jugendtrainer-development';
import {
  JUGENDTRAINER_FAQS,
  YOUTH_BENEFITS,
  YOUTH_OBJECTIONS,
} from '../data/jugendtrainer-content';

/**
 * Youth-coach page `/fuer-jugendtrainer`. Different buyer than the club page:
 * no budget question, but time on the bench, simplicity, and showing a
 * 14-year-old their own progress.
 * @returns A JSX element composing the ordered youth-coach sections.
 */
export default function JugendtrainerPage() {
  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <SegmentHeader
        kicker='Für Jugendtrainer'
        titleLead='Handball-Statistik für'
        titleHighlight='Jugendtrainer'
        lede='Du coachst, wechselst und redest – und sollst nebenbei mitschreiben. Statix macht daraus einen Tap pro Aktion. Nach dem Spiel siehst du, wer sich entwickelt, deine Spieler sehen ihre eigenen Werte im Kartenalbum, und die Eltern verfolgen das Spiel im Live-Ticker. Kostet aktuell nichts.'
        trust={['Ein Tap pro Aktion', 'Aktuell 0 €', 'Ohne Schulung']}
        screenshot={{
          src: '/recordStatsInGame.png',
          alt: 'Jugendtrainer erfasst Handball-Statistiken live per Tap von der Bank',
          label: 'Erfassen, während du coachst',
        }}
      />

      <SegmentBenefits
        kicker='Aus der Halle'
        title='Was du im Jugendbereich davon hast'
        description='Sechs Dinge, die sich am Samstag und in der Woche danach wirklich ändern.'
        items={[...YOUTH_BENEFITS]}
      />

      <JugendtrainerDevelopment />

      <SegmentObjections
        kicker='Ehrlich gefragt'
        title='Was Jugendtrainer zu Recht einwenden'
        description='Vier Einwände, die ich selbst hatte – und wie ich sie beantworte.'
        items={[...YOUTH_OBJECTIONS]}
        ground='paper'>
        <>
          Was der kostenlose Zugang genau umfasst, steht unter{' '}
          <Link
            href='/handball-statistik-app-kostenlos'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Handball-Statistik-App kostenlos
          </Link>
          . Wenn ihr im Verein mehrere Mannschaften auf einen Stand bringen
          wollt, lies{' '}
          <Link
            href='/fuer-vereine'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Statix für Vereine
          </Link>
          . Und wer erstmal auf Papier anfangen will, nimmt die{' '}
          <Link
            href='/handball-statistik-excel-vorlage'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            kostenlose Excel-Vorlage
          </Link>
          .
        </>
      </SegmentObjections>

      <BoardFaq
        id='faq'
        kicker='Nachgefragt'
        title='Häufige Fragen von Jugendtrainern'
        description='Von der Altersklasse bis zum Elterngespräch.'
        items={JUGENDTRAINER_FAQS}
      />

      <BoardCta
        kicker='Vor dem nächsten Spiel'
        title='Vor dem Samstag noch schnell einrichten'
        description='Konto anlegen, Kader eintippen, fertig – das dauert weniger als eine Trainingsvorbereitung. Oder sieh dir vorher in der Live-Demo an, ob du das an der Bank bedienen kannst.'
        linkHref='/handball-statistik-app-kostenlos'
        linkLabel='Was kostenlos enthalten ist'
      />
    </div>
  );
}
