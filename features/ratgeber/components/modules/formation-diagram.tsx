import { CourtDiagram } from '@/features/landing-page/components/tactic';
import type { ArticleModule } from '../../types';

type Formation = Extract<ArticleModule, { kind: 'formation' }>;

const SYSTEM_TITLES: Record<Formation['system'], string> = {
  '6-0': 'Handballfeld mit einer 6:0-Abwehr gegen einen 3:3-Angriff mit Kreisläufer',
  '5-1': 'Handballfeld mit einer 5:1-Abwehr, vorgezogener Spieler auf neun Metern',
  '3-2-1': 'Handballfeld mit einer 3:2:1-Abwehr in drei gestaffelten Reihen',
  mann: 'Handballfeld mit Manndeckung, jeder Verteidiger torseitig an seinem Gegenspieler',
  angriff: 'Handballfeld mit einem 3:3-Angriff mit Kreisläufer gegen eine 6:0-Abwehr',
};

const SYSTEM_LABELS: Record<Formation['system'], string> = {
  '6-0': '6:0',
  '5-1': '5:1',
  '3-2-1': '3:2:1',
  mann: 'Manndeckung',
  angriff: '3:3-Angriff',
};

/**
 * The setup chalked onto the court instead of yet another app screenshot —
 * the point of a system article is the arrangement, and a screenshot of a
 * stats table cannot show it. Orange magnets are your team, blue the opponent,
 * green the keeper (DESIGN.md, two-marker logic).
 */
export default function FormationDiagram({ system, caption }: Omit<Formation, 'kind' | 'after'>) {
  return (
    <figure className='my-9 overflow-hidden rounded-2xl border border-ink/10 bg-court board-shadow-court'>
      <div className='flex items-center justify-between gap-4 border-b border-chalk/12 px-6 py-3.5'>
        <span className='font-hand text-xl leading-none text-primary'>Auf dem Feld</span>
        <span className='font-display text-[13px] font-bold uppercase tracking-[0.08em] text-chalk/60'>
          {SYSTEM_LABELS[system]}
        </span>
      </div>
      <div className='px-4 py-6 sm:px-8'>
        <CourtDiagram
          variant='goal'
          formation
          formationSystem={system}
          title={SYSTEM_TITLES[system]}
          className='mx-auto h-auto w-full max-w-lg text-chalk/45'
        />
      </div>
      <figcaption className='border-t border-chalk/12 px-6 py-4 text-[15px] leading-7 text-chalk/75'>
        {caption}
      </figcaption>
    </figure>
  );
}
