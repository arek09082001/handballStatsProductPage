/**
 * Optical centring for the jersey number on a magnet.
 *
 * Centring a line box is not the same as centring the digits inside it. A digit
 * sits on the baseline and has no descender, while the line box reserves the
 * font's descender space underneath — so a perfectly centred line box leaves
 * the number visibly high on the disc. How much depends entirely on the font's
 * metrics, which rules out a constant: the board renders in Archivo where it is
 * available and in whatever the browser falls back to where it is not, and the
 * two need different corrections.
 *
 * So it is measured in the browser, on the font that actually rendered:
 *
 *  1. A hidden probe with the magnet's exact typography carries a zero-height
 *     inline marker, whose top edge sits exactly on the baseline. That gives
 *     the baseline's position inside the centred box without assuming anything
 *     about half-leading.
 *  2. Canvas `measureText` reports the ink extent of the digits around that
 *     baseline.
 *
 * The result is the padding-top needed to move the ink onto the disc's centre,
 * as a fraction of the magnet — doubled, because a centred grid splits padding
 * between the two sides.
 */

/** Used for the server render and whenever measuring is not possible. */
export const DEFAULT_NUMBER_NUDGE = 0.05;

/** Measured once per page: the font does not change underneath us. */
let cachedNudge: number | null = null;

export function measureNumberNudge(): number {
  if (cachedNudge !== null) return cachedNudge;
  if (typeof document === 'undefined') return DEFAULT_NUMBER_NUDGE;

  try {
    // Large on purpose: the sub-pixel error of a layout read is a rounding
    // artefact at 20 px and irrelevant at 200.
    const BOX = 200;
    const FONT = BOX / 2; // the same ratio the magnet uses

    const probe = document.createElement('div');
    probe.className = 'font-display';
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = [
      'position:absolute',
      'left:-9999px',
      'top:0',
      'display:grid',
      'place-items:center',
      `width:${BOX}px`,
      `height:${BOX}px`,
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

    const boxTop = probe.getBoundingClientRect().top;
    const baselineFromTop = baselineMarker.getBoundingClientRect().top - boxTop;

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

    if (!Number.isFinite(baselineFromTop) || baselineFromTop <= 0) {
      return DEFAULT_NUMBER_NUDGE;
    }

    const inkCentreFromTop = baselineFromTop - inkCentreAboveBaseline;
    const nudge = (2 * (BOX / 2 - inkCentreFromTop)) / BOX;

    // A sane font never needs more than a few percent; anything beyond that is
    // a broken measurement, not a correction worth applying.
    cachedNudge = Math.max(-0.2, Math.min(0.2, nudge));
    return cachedNudge;
  } catch {
    return DEFAULT_NUMBER_NUDGE;
  }
}
