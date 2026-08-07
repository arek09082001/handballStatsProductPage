/**
 * Optical centring for the jersey number on a magnet.
 *
 * Centring a line box is not the same as centring the digits inside it. A digit
 * sits on the baseline and has no descender, while the line box reserves the
 * font's descender space underneath — so a perfectly centred line box can leave
 * the number visibly off on the disc. How much, and in which direction, depends
 * entirely on the font's metrics, which rules out a constant: the board renders
 * in Archivo where it is available and in whatever the browser falls back to
 * where it is not, and the two need different corrections.
 *
 * So it is measured in the browser, on the font that actually rendered:
 *
 *  1. A hidden probe with the magnet's exact typography carries a zero-height
 *     inline marker whose top edge sits exactly on the baseline. That gives the
 *     baseline's position inside the line box straight from the engine, without
 *     assuming anything about half-leading — the probe must be a *block*, so
 *     that the digit and the marker share one line box. (An earlier version laid
 *     the probe out as a grid, which quietly put the two in separate rows and
 *     made the reading meaningless.)
 *  2. Canvas `measureText` reports the ink extent of the digits around that
 *     baseline.
 *
 * The result is the padding-top needed to move the ink onto the disc's centre,
 * expressed per em so it holds at every magnet size — doubled, because a centred
 * grid item splits the padding between the two sides.
 */

/**
 * Used for the server render and whenever measuring is not possible. Zero, not
 * a guess: the correction is a fraction of a pixel for the fonts this ever falls
 * back to, so a wrong guess shifts the number further than doing nothing.
 */
export const DEFAULT_NUMBER_NUDGE = 0;

/** Measured once per page: the font does not change underneath us. */
let cachedNudge: number | null = null;

/**
 * Measures the padding-top, per em of the number's font size, that puts the
 * digits' ink on the middle of the magnet.
 * @returns The padding as a multiple of font size; 0 when it cannot be measured.
 */
export function measureNumberNudge(): number {
  if (cachedNudge !== null) return cachedNudge;
  if (typeof document === 'undefined') return DEFAULT_NUMBER_NUDGE;

  try {
    // Large on purpose: the sub-pixel error of a layout read is a rounding
    // artefact at 20 px and irrelevant at 400.
    const FONT = 400;

    const probe = document.createElement('div');
    probe.className = 'font-display';
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = [
      'position:absolute',
      'left:-9999px',
      'top:0',
      'display:block',
      'white-space:nowrap',
      'line-height:1',
      `font-size:${FONT}px`,
      'font-weight:800',
      'font-variant-numeric:tabular-nums',
      'visibility:hidden',
      'pointer-events:none',
    ].join(';');

    const baselineMarker = document.createElement('i');
    baselineMarker.style.cssText =
      'display:inline-block;width:0;height:0;vertical-align:baseline';
    probe.append('0', baselineMarker);
    document.body.appendChild(probe);

    const box = probe.getBoundingClientRect();
    const baselineFromTop = baselineMarker.getBoundingClientRect().top - box.top;
    const lineBoxHeight = box.height;

    let inkCentreAboveBaseline = 0;
    const context = document.createElement('canvas').getContext('2d');
    if (context) {
      const style = getComputedStyle(probe);
      context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const metrics = context.measureText('0123456789');
      inkCentreAboveBaseline =
        (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
    }

    probe.remove();

    if (!Number.isFinite(baselineFromTop) || lineBoxHeight <= 0) {
      return DEFAULT_NUMBER_NUDGE;
    }

    // The line box is centred on the disc, so the ink sits `baseline - inkCentre`
    // below the box's top edge; the padding that closes the remaining gap is
    // twice the gap, because centring gives half of it back.
    const padding =
      lineBoxHeight - 2 * baselineFromTop + 2 * inkCentreAboveBaseline;

    // A sane font never needs more than a few percent of an em; anything beyond
    // that is a broken measurement, not a correction worth applying.
    cachedNudge = Math.max(-0.2, Math.min(0.2, padding / FONT));
    return cachedNudge;
  } catch {
    return DEFAULT_NUMBER_NUDGE;
  }
}
