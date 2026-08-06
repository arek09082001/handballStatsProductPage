import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq from '@/components/custom-ui/board-faq';
import TemplateHeader from '../components/template-header';
import TemplateMetrics from '../components/template-metrics';
import TemplateHowTo from '../components/template-howto';
import TemplateLimits from '../components/template-limits';
import TemplateUpgrade from '../components/template-upgrade';
import { TEMPLATE_FAQS } from '../data/template-content';

/**
 * Excel template page `/handball-statistik-excel-vorlage`. Download first (no
 * form in front of it), then what the file tracks, how to fill it during a
 * game, where a spreadsheet stops being enough, and only then the app.
 * @returns A JSX element composing the ordered template-page sections.
 */
export default function ExcelVorlagePage() {
  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <TemplateHeader />
      <TemplateMetrics />
      <TemplateHowTo />
      <TemplateLimits />
      <TemplateUpgrade />
      <BoardFaq
        id='faq'
        kicker='Nachgefragt'
        title='Häufige Fragen zur Excel-Vorlage'
        description='Alles, was Trainer vor dem Download wissen wollen.'
        items={TEMPLATE_FAQS}
      />
      <BoardCta
        kicker='Ohne Abtippen'
        title='Dieselben Aktionen, nur getippt'
        description='Registriere dich kostenlos und erfasse dein erstes Spiel, ohne abends etwas abzutippen. Oder sieh dir vorher in der Live-Demo an, wie sich das ohne Zellen anfühlt – ganz ohne Account.'
        linkHref='/preise'
        linkLabel='Was Statix kostet'
      />
    </div>
  );
}
