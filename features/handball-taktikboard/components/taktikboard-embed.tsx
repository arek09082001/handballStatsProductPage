import { Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import {
  BOARD_CAPACITY,
  EMBED_SNIPPET_WIDE_HINT,
  EXPORT_WATERMARK,
} from '../data/taktikboard-content';
import EmbedSnippet from './embed-snippet';

/**
 * "Was das Board kostet" — the exchange, stated plainly before the snippet:
 * the small mark on an exported PNG and the attribution line under an embed
 * are the whole price. Nothing here is a teaser for a paid version, because
 * there is none.
 * @returns A JSX element rendering the embed instructions on the paper ground.
 */
export default function TaktikboardEmbed() {
  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Der ganze Preis'
          title='Was das Board kostet'
          description='Nichts – und zwar ohne Kleingedrucktes. Zwei Dinge gehören trotzdem offen auf den Tisch.'
        />

        <div className='mt-10 space-y-4'>
          <p className='max-w-[70ch] text-base leading-7 text-ink/75'>
            <strong className='font-semibold text-ink'>
              Auf jedem exportierten PNG steht klein „{EXPORT_WATERMARK}“ in der Ecke.
            </strong>{' '}
            Das ist die Gegenleistung dafür, dass hier niemand nach einer
            E-Mail-Adresse fragt. Es gibt keine Bezahlversion, in der die Zeile
            verschwindet, keine Begrenzung, wie oft du exportierst, und keinen
            Zähler, der irgendwann leer ist.
          </p>
          <p className='max-w-[70ch] text-base leading-7 text-ink/75'>
            <strong className='font-semibold text-ink'>
              Es gibt keine Anmeldung und keinen Speicherplatz.
            </strong>{' '}
            Dein Board lebt im Browser und im Teilen-Link. Auf ein Feld passen{' '}
            {BOARD_CAPACITY.magnets} Magnete, {BOARD_CAPACITY.arrows} Pfeile und{' '}
            {BOARD_CAPACITY.labels} Notizen – das ist die Grenze der Lesbarkeit
            und des Links, nicht die einer Gratisstufe.
          </p>
        </div>

        <h3 className='mt-14 font-display text-xl font-bold tracking-tight text-ink'>
          Board auf der Vereinsseite einbinden
        </h3>
        <p className='mt-2 max-w-[70ch] text-base leading-7 text-ink/75'>
          Kopier den Code, setz ihn auf eure Homepage – fertig. Kostenlos, ohne
          Anmeldung, ohne Tracking-Skript. Unter dem eingebetteten Board steht
          ein Hinweis mit Link auf diese Seite; das ist die einzige Bedingung.
          Passt die Höhe nicht zu eurem Layout, ändert einfach den height-Wert.
        </p>

        <div className='mt-8'>
          <EmbedSnippet />
        </div>

        <p className='mt-6 max-w-[70ch] text-base leading-7 text-ink/70'>
          {EMBED_SNIPPET_WIDE_HINT}
        </p>
      </div>
    </section>
  );
}
