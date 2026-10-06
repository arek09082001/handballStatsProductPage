/**
 * Invented sponsor logos for the sponsor shots — "Muster"/"Beispiel" names on
 * purpose, so no real business ends up on the product page. Plain SVG as data
 * URLs: the app and the ticker take any image URL, and nothing has to be
 * uploaded anywhere.
 */
const svg = (body, w = 240, h = 80) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`,
  )}`;
const font = `font-family="Helvetica, Arial, sans-serif"`;

export const LOGOS = {
  autohaus: svg(
    `<rect width="240" height="80" rx="10" fill="#0b3b8c"/>` +
      `<path d="M22 50 q14 -22 38 -22 h18 q14 0 24 14 l8 8 z" fill="#fff"/>` +
      `<circle cx="42" cy="52" r="7" fill="#0b3b8c" stroke="#fff" stroke-width="3"/><circle cx="92" cy="52" r="7" fill="#0b3b8c" stroke="#fff" stroke-width="3"/>` +
      `<text x="122" y="38" ${font} font-size="18" font-weight="700" fill="#fff">AUTOHAUS</text>` +
      `<text x="122" y="60" ${font} font-size="18" fill="#9cc2ff">Muster</text>`,
  ),
  baeckerei: svg(
    `<rect width="240" height="80" rx="10" fill="#fff7ea"/>` +
      `<circle cx="40" cy="40" r="26" fill="#b45f1b"/>` +
      `<path d="M40 22 v36 M40 30 l-8 -6 M40 30 l8 -6 M40 40 l-9 -6 M40 40 l9 -6 M40 50 l-9 -6 M40 50 l9 -6" stroke="#ffe2b8" stroke-width="3" stroke-linecap="round" fill="none"/>` +
      `<text x="76" y="38" ${font} font-size="17" font-weight="700" fill="#7a3d0e">Bäckerei</text>` +
      `<text x="76" y="60" ${font} font-size="17" fill="#b45f1b">Beispiel</text>`,
  ),
  sport: svg(
    `<rect width="240" height="80" rx="10" fill="#ea580c"/>` +
      `<circle cx="40" cy="40" r="22" fill="#fff"/><path d="M18 40 h44 M40 18 q-12 22 0 44 M40 18 q12 22 0 44" stroke="#ea580c" stroke-width="3" fill="none"/>` +
      `<text x="74" y="50" ${font} font-size="26" font-weight="800" fill="#fff">SPORT MUSTER</text>`,
    300,
  ),
  stadtwerke: svg(
    `<rect width="260" height="80" rx="10" fill="#0f766e"/>` +
      `<path d="M38 16 l-14 28 h12 l-6 22 l20 -30 h-12 l8 -20 z" fill="#facc15"/>` +
      `<text x="66" y="38" ${font} font-size="18" font-weight="700" fill="#fff">Stadtwerke</text>` +
      `<text x="66" y="60" ${font} font-size="16" fill="#99f6e4">Musterstadt</text>`,
    260,
  ),
  physio: svg(
    `<rect width="240" height="80" rx="10" fill="#fff"/>` +
      `<circle cx="38" cy="40" r="24" fill="#16a34a"/><path d="M38 26 v28 M24 40 h28" stroke="#fff" stroke-width="7" stroke-linecap="round"/>` +
      `<text x="74" y="38" ${font} font-size="18" font-weight="700" fill="#166534">Physio</text>` +
      `<text x="74" y="60" ${font} font-size="16" fill="#16a34a">am Musterpark</text>`,
  ),
};

/** The public sponsors payload as the ticker reads it (`SponsorsResponse`). */
export const PUBLIC_SPONSORS = {
  banners: [
    { name: 'Autohaus Muster', logoUrl: LOGOS.autohaus, linkUrl: 'https://example.org/autohaus' },
    { name: 'Bäckerei Beispiel', logoUrl: LOGOS.baeckerei, linkUrl: null },
    { name: 'Physio am Musterpark', logoUrl: LOGOS.physio, linkUrl: 'https://example.org/physio' },
  ],
  goal: { name: 'Sport Muster', logoUrl: LOGOS.sport, linkUrl: null },
  timeout: { name: 'Bäckerei Beispiel', logoUrl: LOGOS.baeckerei, linkUrl: null },
  stream: {
    name: 'Stadtwerke Musterstadt',
    logoUrl: LOGOS.stadtwerke,
    linkUrl: 'https://example.org/stadtwerke',
    size: 7,
    corner: 'top',
    mode: 'permanent',
    label: 'presented',
  },
};
