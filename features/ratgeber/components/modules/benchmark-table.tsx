/**
 * Reference values as a scoresheet: ink header rule, warm zebra, tabular
 * figures — the same table voice `.article-prose` gives markdown tables, but
 * with a marker caption and a source note, because a benchmark that does not
 * say where its ranges come from is a made-up number.
 */
export default function BenchmarkTable({
  caption,
  columns,
  rows,
  note,
}: {
  caption: string;
  columns: string[];
  rows: string[][];
  note?: string;
}) {
  return (
    <figure className='my-9'>
      <figcaption className='font-hand text-xl leading-none text-primary'>
        {caption}
      </figcaption>
      <div className='mt-3 overflow-x-auto rounded-2xl border border-ink/10 bg-paper board-shadow'>
        <table className='w-full border-collapse text-left text-[15px]'>
          <thead>
            <tr className='border-b-2 border-ink/25'>
              {columns.map((column) => (
                <th
                  key={column}
                  scope='col'
                  className='px-5 py-3.5 font-display text-[13px] font-bold uppercase tracking-[0.06em] text-ink/70'>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.join('|')} className='border-b border-ink/8 last:border-b-0 odd:bg-paper-2/60'>
                {row.map((cell, index) => (
                  <td
                    key={index}
                    className={
                      index === 0
                        ? 'px-5 py-3 font-semibold text-ink'
                        : 'px-5 py-3 tabular-nums text-ink/75'
                    }>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note ? <p className='mt-2.5 text-[13px] leading-6 text-ink/60'>{note}</p> : null}
    </figure>
  );
}
