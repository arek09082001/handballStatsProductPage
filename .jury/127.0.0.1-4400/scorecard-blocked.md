# Statix `/`: Jury-Ausgangsbewertung — blockiert

Stand: 21. Oktober 2026. Keine Verbindung zu Awwwards. Dieser Bericht enthält **keine vergebenen Scores**: Ein lauffähiger Produktionsbuild fehlt. Weder eine unabhängige Bewertung noch ein Self-Score wurde durchgeführt.

## Umfang und unveränderte Ausgangsbasis

- Ziel: ausschließlich Landingpage `/`, Desktop 1440 × 900, Mobil 390 × 844 mit 4× CPU/Slow 4G, reduzierte Bewegung, Tastatur, Hover und Performance.
- Repository-HEAD: `2f52c358fdba124ad9434d806f7f1bfde5c98a8b`.
- Skills: `jury` und `awwwards` aus `juliobsz/skills`, gelesener Stand `ea8f1455c2b0e71469d4ecfd32f47862b834d2d0`.
- PRODUCT.md, DESIGN.md, CODE_STANDARDS_AND_PROJECT_STRUCTURE.txt, app/page.tsx und die Landingpage-Komponenten wurden gelesen. Das bestehende Konzept „Die Trainertafel“ bleibt verbindlich.
- Node 24.19.0, npm 11.9.0, Next.js 16.0.10. Audit-Werkzeuge außerhalb des Repositories unter `/tmp/statix-jury-tools`; System-Chromium 154 wurde erfolgreich gestartet.
- `npm install --package-lock=false` ausgeführt. Anschließend `npm ci` erfolgreich ausgeführt, um für die Ausgangsbewertung exakt den Lockfile-Stand wiederherzustellen. Keine Änderungen an Abhängigkeitsdeklarationen oder Lockfile.
- Keine Änderungen an Anwendungscode, DESIGN.md, Übersetzungen, API-Routen oder SEO-Dateien. Kein Commit, Push oder Deployment.

## Prüfstatus

| Prüfung | Ergebnis | Beleg |
|---|---|---|
| Installation mit Lockfile | Bestanden | [npm-ci.txt](logs/npm-ci.txt) |
| `npm run check-messages` | Bestanden: 5 Sprachdateien, 4.069 Schlüssel | Befehlsausgabe der aktuellen Prüfung |
| `npm run build` | Fehlgeschlagen: Google-Fonts-TLS-Vertrauen in Turbopack | [build-turbopack.txt](logs/build-turbopack.txt) |
| Build mit `NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1` | Fehlgeschlagen: Caveat-Font-Auflösung, `next/font/google queries have exactly one entry` | [build-turbopack-system-tls.txt](logs/build-turbopack-system-tls.txt) |
| `npm run build -- --webpack` | Kompilierung erfolgreich, danach Abbruch wegen ungültiger Segmentkonfiguration | [build-webpack.txt](logs/build-webpack.txt) |
| `npm run start -- --port 4400` | Fehlgeschlagen: kein abgeschlossener Produktionsbuild | [start.txt](logs/start.txt) |
| `npm run lint` | Fehlgeschlagen vor der eigentlichen Codeprüfung: zirkuläre ESLint-Konfiguration | [lint.txt](logs/lint.txt) |
| Browser-Audit, Desktop, Mobil, Reduced Motion, axe | Nicht ausgeführt: Produktionsserver fehlt | Keine Browser-Evidenz erzeugt |
| Lighthouse, LCP, CLS, FPS | Nicht gemessen | Keine Performance-Baseline behauptet |

Die Build-Konfiguration überspringt TypeScript-Buildfehler bereits im Bestand; eine erfolgreiche Kompilierung wäre daher allein kein Typprüfungsnachweis.

## Reproduzierte Blocker nach Abhängigkeit

1. **Produktionsbuild nicht startfähig.** Next.js akzeptiert `export const revalidate = 60 * 60 * 24` in `app/layout.tsx:42` nicht als statisch auswertbare Segmentkonfiguration. Webpack meldet den Fehler beim Verarbeiten von `/agb/page`; dort ist keine entsprechende Deklaration vorhanden, die gemeinsame Root-Layout-Deklaration enthält den Ausdruck. Eine semantisch gleichwertige Zahl `86400` wäre die kleinste zu prüfende Korrektur. Sie wurde wegen des ausdrücklich angeordneten Stopps vor Codeänderungen nicht vorgenommen.
2. **Turbopack-Font-Auflösung.** Die erlaubten Schrift-Domains antworten über curl. Die Aktivierung der empfohlenen Systemzertifikate behebt den ersten TLS-Fehler, legt aber einen weiteren Fehler bei den Caveat-Font-URLs offen. Der alternative Webpack-Produktionsbuild kompiliert denselben Anwendungscode ohne diesen Font-Fehler; er scheitert anschließend an Punkt 1. Keine Schrift-Mocks, Ersatzfonts oder deaktivierte TLS-Prüfung verwendet.
3. **Lint-Konfiguration inkompatibel.** ESLint 9.39.1 bricht in FlatCompat/ConfigValidator mit `TypeError: Converting circular structure to JSON` ab. Die Konfiguration wurde nicht geändert. Vor einem späteren Abschluss mit fehlerfreiem `npm run lint` ist eine Korrektur nötig.

## Noch keine gestalterische Scorecard

| Kriterium | Score |
|---|---|
| Design (40 %) | Nicht bewertet |
| Usability (30 %) | Nicht bewertet |
| Creativity (20 %) | Nicht bewertet |
| Content (10 %) | Nicht bewertet |
| Semantics/SEO | Nicht bewertet |
| Animations/Transitions | Nicht bewertet |
| Accessibility | Nicht bewertet |
| WPO | Nicht bewertet |
| Responsive | Nicht bewertet |
| Markup/Meta-data | Nicht bewertet |

Gewichteter Gesamtscore und kalibrierte Jury-Schätzung: nicht verfügbar. Ohne Screenshots und Browsermessungen wäre eine Liste vermeintlicher visueller Schwächen keine Bewertung nach `jury`. Insbesondere wird kein Entwicklungsserver als Produktions-Baseline ausgegeben.

## Daten und Grenzen

`PUBLIC_STATS_TOKEN` ist in diesem Prozess nicht gesetzt. Die bestehende Kennzahlenlogik verwendet damit ihre vorhandenen statischen Produktangaben. Echte Nutzungskennzahlen wurden nicht abgerufen, erfunden oder ersetzt. Keine E-Mail-Übermittlung getestet.

## Nächster Schritt — vor Designänderungen

Die ausdrückliche Nutzeranweisung verlangt ein OK vor Codeänderungen. Nötig ist zunächst die eng begrenzte Freigabe, den Root-Layout-Wert auf das gleichwertige Literal `86400` zu ändern. Danach den Webpack-Produktionsbuild erneut prüfen und mit `npm run start -- --port 4400` starten. Diese Freigabe wäre noch keine Freigabe zur Landingpage-Umgestaltung.

Erst mit erfolgreichem Produktionsstart: Jury-Screenshots und Audit nur für `/` erstellen, von einem frischen unabhängigen Kritiker bewerten lassen, diese blockierte Karte archivieren, die echte Scorecard schreiben und die 5–10 wichtigsten Schwächen nach Wirkung vorlegen. Anschließend erneut bis zum OK zur Umsetzung stoppen.
