/**
 * Free tools promoted above the article list on the Ratgeber hub. Static copy
 * lives here so the hub page stays a thin composition of components.
 */
export interface RatgeberTool {
  href: string;
  title: string;
  description: string;
}

export const RATGEBER_TOOLS: RatgeberTool[] = [
  {
    href: '/wurfquote-rechner',
    title: 'Wurfquoten-Rechner',
    description:
      'Tore und Würfe eintragen, Quote ablesen – für einzelne Spieler oder die ganze Mannschaft.',
  },
  {
    href: '/handball-taktikboard',
    title: 'Handball-Taktikboard',
    description:
      'Aufstellung auf ein maßstabsgetreues Feld ziehen, Laufwege einzeichnen und als Bild oder Link an die Mannschaft geben.',
  },
  {
    href: '/handball-statistik-excel-vorlage',
    title: 'Excel-Vorlage für die Handball-Statistik',
    description:
      'Fertige Tabelle mit den wichtigsten Kennzahlen, wenn du erst einmal auf Papier und Excel starten willst.',
  },
];
