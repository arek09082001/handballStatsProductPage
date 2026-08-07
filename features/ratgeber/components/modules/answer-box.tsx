/**
 * The short answer, set as a note torn off the coach's pad: a paper-2 panel
 * held by the marker rule on the left. Sits above the lede in `referenz` and
 * `kennzahl` articles so the answer is inside the first sentences — for the
 * reader on a sideline as much as for a snippet or an AI answer.
 */
export default function AnswerBox({ text }: { text: string }) {
  return (
    <aside className='my-9 rounded-2xl border border-ink/10 border-l-[5px] border-l-primary bg-paper-2 px-6 py-5 board-shadow'>
      <p className='font-hand text-xl leading-none text-primary'>Kurz beantwortet</p>
      <p className='mt-3 text-[17px] font-medium leading-8 text-ink'>{text}</p>
    </aside>
  );
}
