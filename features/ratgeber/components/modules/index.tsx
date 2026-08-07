import type { ArticleModule } from '../../types';
import AnswerBox from './answer-box';
import FormulaBox from './formula-box';
import BenchmarkTable from './benchmark-table';
import ExerciseCard from './exercise-card';
import SessionTimeline from './session-timeline';
import FormationDiagram from './formation-diagram';
import DecisionMatrix from './decision-matrix';
import ArticleEmbed from './article-embed';

/**
 * Dispatches an article module to its renderer. Every branch is a server
 * component — no module may introduce client JavaScript into the article body,
 * which stays static and fully crawlable (DESIGN.md, "Ratgeber / Read surface").
 */
export default function ArticleModuleBlock({ module }: { module: ArticleModule }) {
  switch (module.kind) {
    case 'answerBox':
      return <AnswerBox text={module.text} />;
    case 'formula':
      return (
        <FormulaBox label={module.label} formula={module.formula} example={module.example} />
      );
    case 'benchmarkTable':
      return (
        <BenchmarkTable
          caption={module.caption}
          columns={module.columns}
          rows={module.rows}
          note={module.note}
        />
      );
    case 'exercise':
      return (
        <ExerciseCard
          name={module.name}
          meta={module.meta}
          setup={module.setup}
          organisation={module.organisation}
          coachingPoints={module.coachingPoints}
          commonError={module.commonError}
          variation={module.variation}
        />
      );
    case 'sessionTimeline':
      return <SessionTimeline caption={module.caption} blocks={module.blocks} />;
    case 'formation':
      return <FormationDiagram system={module.system} caption={module.caption} />;
    case 'decisionMatrix':
      return (
        <DecisionMatrix
          caption={module.caption}
          criteria={module.criteria}
          options={module.options}
        />
      );
    case 'embed':
      return <ArticleEmbed target={module.target} caption={module.caption} />;
    default:
      return null;
  }
}
