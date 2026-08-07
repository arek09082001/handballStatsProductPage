import type { ArticleModule, DecisionScore } from '../../types';

type Matrix = Extract<ArticleModule, { kind: 'decisionMatrix' }>;

/**
 * Options against criteria, scored the way a coach scores them on the board:
 * a marker tick, a neutral dash, a crossed circle. The symbol is decorative —
 * every cell carries the rating as text as well, so the table is readable by
 * screen readers and by anyone who cannot separate the colours.
 */
const SCORE_STYLES: Record<DecisionScore, { mark: string; label: string; className: string }> = {
  gut: { mark: '✓', label: 'gut geeignet', className: 'bg-success/12 text-success' },
  geht: { mark: '~', label: 'bedingt geeignet', className: 'bg-ink/8 text-ink/65' },
  schlecht: { mark: '✕', label: 'ungeeignet', className: 'bg-secondary/12 text-secondary' },
};

export default function DecisionMatrix({
  caption,
  criteria,
  options,
}: Omit<Matrix, 'kind' | 'after'>) {
  return (
    <figure className='my-9'>
      <figcaption className='font-hand text-xl leading-none text-primary'>
        {caption ?? 'Die Entscheidung im Überblick'}
      </figcaption>
      <div className='mt-3 overflow-x-auto rounded-2xl border border-ink/10 bg-paper board-shadow'>
        <table className='w-full border-collapse text-left text-[15px]'>
          <thead>
            <tr className='border-b-2 border-ink/25'>
              <th
                scope='col'
                className='px-5 py-3.5 font-display text-[13px] font-bold uppercase tracking-[0.06em] text-ink/70'>
                Option
              </th>
              {criteria.map((criterion) => (
                <th
                  key={criterion}
                  scope='col'
                  className='px-4 py-3.5 font-display text-[13px] font-bold uppercase tracking-[0.06em] text-ink/70'>
                  {criterion}
                </th>
              ))}
              <th
                scope='col'
                className='px-5 py-3.5 font-display text-[13px] font-bold uppercase tracking-[0.06em] text-ink/70'>
                Fazit
              </th>
            </tr>
          </thead>
          <tbody>
            {options.map((option) => (
              <tr
                key={option.name}
                className='border-b border-ink/8 last:border-b-0 odd:bg-paper-2/60'>
                <th scope='row' className='px-5 py-3.5 text-left font-semibold text-ink'>
                  {option.name}
                </th>
                {option.scores.map((score, index) => {
                  const style = SCORE_STYLES[score];
                  return (
                    <td key={criteria[index] ?? index} className='px-4 py-3.5'>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-semibold ${style.className}`}>
                        <span aria-hidden='true'>{style.mark}</span>
                        {style.label}
                      </span>
                    </td>
                  );
                })}
                <td className='px-5 py-3.5 text-[15px] leading-6 text-ink/75'>
                  {option.verdict ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
