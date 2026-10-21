# Statix `/`: Jury-Scorecard vor der Umsetzung

21. Oktober 2026. **Unabhängige, evidenzbasierte Schätzung; nicht mit Awwwards verbunden und keine offizielle Wertung.** Bewertet wurde ausschließlich die deutsche Landingpage `/` eines lokalen Produktionsbuilds anhand von 62 Screenshots, Browsermessungen, axe, statischem Audit und Lighthouse. Unterseiten wurden nicht gestalterisch bewertet.

**Die Idee, wie der Kritiker sie liest:** Statix übersetzt Handballaktionen am Spielfeldrand unmittelbar in lesbare Spielverläufe, Wurfbilder und Trainerentscheidungen und erzählt diesen Weg als eine konkrete Spielminute auf einem digitalen Taktikbrett.

**Kritiker-Gesamtwertung: 6,70 / 10** = 0,4 × 7 + 0,3 × 6 + 0,2 × 7 + 0,1 × 7.

**Grobe kalibrierte Jury-Schätzung nach dem Skill: etwa 7,8 / 10.** Der Skill addiert 1,1 auf Basis von nur zwei zuvor bewerteten ausgezeichneten Websites. Das läge rechnerisch im Site-of-the-Day-Bereich, ist aber weder eine belastbare Award-Prognose noch eine Auszeichnung. Für Entwicklerbereiche wird kein Aufschlag verwendet. Die strengen Kritikerwerte und Befunde bleiben unverändert.

Die vollständige unabhängige Kritik mit allen Begründungen und der ursprünglichen Maßnahmenliste steht in [critic-baseline.md](critic-baseline.md). Der Kritiker erhielt nur Screenshots und Messberichte, keinen Quellcode, keine Produkt-/Designvorgaben, keine frühere Scorecard und keine Kalibrierung.

## Hauptkriterien

| Kriterium | Score | Konkrete Evidenz |
|---|---:|---|
| Design (40 %) | 7 | [Desktop-Hero](shots/home/d-01-hero.png): erkennbare Court-/Marker-Sprache und Gerätekomposition. [Mobiler Vergleich](shots/supplement/mobile-section-06.png): sehr blasse Papierkarte; nicht alle Details halten das Niveau des Einstiegs. |
| Usability (30 %) | 6 | [Mobiler Einstieg](shots/home/m-01-hero.png): große CTAs, Produktbild noch außerhalb des ersten Bildschirms. `home/report.json`: zwei schwerwiegende axe-Regelverstöße; Zusatzreport belegt verbleibende Reduced-Motion-Effekte. |
| Creativity (20 %) | 7 | [Hero](shots/home/d-01-hero.png) und [Spielminute](shots/supplement/mobile-showcase-copy-1.png): konkretes Handballmotiv und 46:27 → 46:28 → 46:33. Spätere Abschnitte kehren zu vertrauten Rastern, Vergleichskarten und FAQ zurück. |
| Content (10 %) | 7 | [Erfassungsfolge](shots/supplement/mobile-showcase-copy-1.png): konkrete Handballbegriffe und echter Produktbezug. [Kennzahlenband](shots/supplement/mobile-section-02.png): „1-Tap pro Aktion“ steht erklärungsbedürftig neben „Ein Tor in vier Tipps“. |

## Entwicklerbereiche

| Bereich | Score | Konkrete Evidenz |
|---|---:|---|
| Semantics/SEO | 7 | [Audit](audit.txt): 0 FAIL; spezifischer Titel und eine H1 im Browserreport; funktionierendes `MAIN#main-content` im Zusatztest. Meta-Beschreibung: 205 Zeichen. |
| Animations/Transitions | 6 | [Übergang](shots/home/d-90-transition-b.png), [CTA-Hover](shots/supplement/primary-1-hover.png): vorhandenes Feedback. Zusatzreport: Scroll-Reveals sowie `pulse`/`ping` trotz Reduced Motion. |
| Accessibility | 6 | [Browserreport](shots/home/report.json): acht Kontrasttreffer mit Weiß auf Orange bei 3,07:1 statt 4,5:1; zwei Treffer für abweichende zugängliche Namen. Tastaturfokus und deutscher Skip-Link funktionieren. |
| WPO | 6 | [Lighthouse](lighthouse-mobile.report.html): Performance 52, LCP 5,148 s, TBT 2.134 ms im simulierten Profil. [Audit](audit.txt): 954 KB gzip-JS. Tatsächlicher gedrosselter Browserlauf: LCP 2,132 s, CLS 0. |
| Responsive | 7 | [Mobile Bilder](shots/supplement/mobile-section-01.png): bewusst gestapelte Inhalte, kein horizontaler Overflow. Browserreport: mehrere Detail-/Datenschutzlinks nur 17–23 px hoch; Analysebilder mobil zu klein. |
| Markup/Meta-data | 7 | Audit ohne FAIL, beschreibender Titel und benanntes Sprungziel. Abweichende zugängliche Namen und ein `target=_blank` ohne `rel=noopener` bleiben Befunde; kein vollständiger Unterseiten-/OG-Einzelnachweis behauptet. |

## Die acht wichtigsten Schwächen, nach Wirkung

1. **Kontraste und zugängliche Namen an den Einstiegen.** Weißer kleiner Text auf dem primären Orange erreicht 3,07:1. Kontrast von Normal-, Hover- und Fokuszuständen verbessern; sichtbaren Text in den zugänglichen Namen berücksichtigen. Evidenz: `home/report.json → a11y.violations`.
2. **Reduced Motion ist nicht durchgängig umgesetzt.** Scroll-Einblendungen, Zähler und Pulse-/Ping-Effekte laufen weiter. Bei dieser Präferenz unmittelbar die Endzustände zeigen. Den in drei frischen Reduced-Motion-Kontexten reproduzierten React-418-Hydrationfehler separat diagnostizieren. Geschlossene FAQ-Antworten bleiben legitim geschlossen. Evidenz: `supplement/report.json → modes.reduced.sections`, [runtime-checks.json](shots/runtime-checks.json).
3. **Zu viel JavaScript und blockierte Hauptthread-Zeit.** Der statische Audit erfasst 954 KB gzip-JS; Lighthouse meldet 2,13 s TBT. Nicht sofort benötigte Interaktivität und schwere Effekte verzögert laden, unnötige Hydration reduzieren und beide Testprofile erneut messen. Evidenz: [Audit](audit.txt), [Lighthouse](lighthouse-mobile.report.html).
4. **Mobiler Einstieg und Scrollweg sind zu lang.** Im ersten Screen ist kein Produktbild zu sehen; die gesamte Seite misst bei 390 px Breite 15.858 px. Vorhandenen Produktbeleg früher zeigen, Einleitung und Versicherungs-Badges kompakter anordnen und große Abstände straffen. Die konkrete Spielminute als Hauptgeschichte beibehalten. Evidenz: [Mobile Hero](shots/home/m-01-hero.png), `home/report.json → mobile.height`.
5. **„1-Tap“ und „vier Tipps“ wirken widersprüchlich.** Das Oberversprechen und die gezeigte detaillierte Torerfassung brauchen eine verständliche Einordnung anhand der tatsächlichen Bedienlogik. Erklären, was schnell erfasst wird und welche zusätzlichen Angaben die vier Eingaben liefern. Evidenz: [Kennzahlen](shots/supplement/mobile-section-02.png), [Erfassung](shots/supplement/mobile-showcase-copy-1.png). Keine neue Produktbehauptung ohne Prüfung einführen.
6. **Die Analysebeispiele beweisen mobil noch zu wenig.** Vollständige App-Screens sind als Echtheitsbeleg erkennbar, ihre Inhalte aber kaum lesbar. Vorhandene echte Aufnahmen gezielter zeigen und den relevanten Graphen/Wendepunkt mit einer kurzen Interpretation verbinden. Evidenz: [Mobiler Analyseabschnitt](shots/home/m-03-scroll.png).
7. **Einige Hover-Rückmeldungen bleiben zu schwach.** Logo, Sprachwahl und Angebotsband antworten weniger klar als die vorhandenen CTAs. Rahmen, Gesamtfüllung, Schatten und Pfeile konsistenter einsetzen; Reduced Motion respektieren. Die bereits wirksamen Hero-CTA-Zustände erhalten. Evidenz: `home/h-01-*`, `home/h-03-*`, `home/h-04-*`, `supplement/primary-*`.
8. **Kleine Touch-Ziele und blasse Nebeninhalte.** Detail-/Datenschutzlinks sind zum Teil nur 17–23 px hoch; die alte Zettelkarte ist schwer lesbar. Größere klickbare Flächen und mehr Kontrast schaffen, ohne die visuelle Hierarchie oder das Papiermotiv zu verlieren. Evidenz: `home/report.json → mobile.smallTargets`, [Vergleich](shots/supplement/mobile-section-06.png).

Die zwei größten Hebel laut Kritiker sind zugängliche Einstiege und vollständige Reduced-Motion-Unterstützung. Die erkannte Idee entspricht dem beabsichtigten Handball-/Trainertafel-Konzept; ein neues Konzept ist nicht nötig.

## Messwerte der Ausgangsbasis

| Messung | Ergebnis |
|---|---|
| Browserprofil mobil | 390 × 844, 4× CPU, Slow 4G, tatsächliche Browser-Drosselung |
| Browser-LCP / CLS mobil | 2.132 ms / 0 |
| Browser-Scroll-FPS mobil | 58; schlechtester Frame 50 ms |
| Browser-Scroll-FPS Desktop | 55; schlechtester Frame 83 ms, Software-GPU |
| Loader | Keiner |
| Mobiler Load-Event | 6.694 ms; nicht mit sichtbarer Wartezeit/LCP gleichzusetzen |
| Idle Motion | Vorhanden, im Hauptskript bei 35 % Scrollposition erkannt |
| Horizontaler Overflow | Keiner auf Desktop oder Mobil |
| Tastaturprüfung | Erste 12 Stopps, keine unsichtbaren Stopps oder fehlenden sichtbaren Fokuszustände; nicht festgefahren |
| Skip-Link | Sichtbar fokussiert und funktionierend; automatisches `false` wegen deutscher Beschriftung widerlegt |
| axe | 2 schwerwiegende Regeltypen: 8 Kontrasttreffer und 2 Label-/Name-Treffer; 95 Kontraststellen benötigen manuelle Prüfung |
| Hover-Hauptskript | 4 Ziele ausgewählt, `noHoverChange=[]`, ein `colorOnly`-Hinweis; Hero-CTAs separat ergänzt |
| Reduced Motion | Hero am Messzeitpunkt ruhig; weiterer Scrollweg enthält dennoch Reveals und aktive Pulse-/Ping-Effekte |
| Statischer Audit | 0 FAIL / 4 WARN, nur 1 HTML-Seite gecrawlt |
| Statisches Gesamtgewicht | Etwa 1.898 KB; davon 954 KB gzip-JS, 176 KB Fonts und 704 KB Bilder |
| Lighthouse Mobile 13.5.0 | Performance 52 / Accessibility 97 / Best Practices 96 / SEO 100 |
| Lighthouse-Profil | Eigenes simuliertes Mobilprofil, 412 × 823, CPU-Faktor 4 |
| Lighthouse LCP / CLS / TBT | 5.148 ms / 0 / 2.134 ms |

Browser-LCP und Lighthouse-LCP stammen aus unterschiedlichen Profilen und werden nicht verrechnet. Ein einzelner lokaler Labortest belegt weder Feld-Core-Web-Vitals noch INP. Das subjektive Bewegungsgefühl und Sound werden aus Standbildern nicht bewertet.

## Durchgeführte Arbeit und Grenzen

- Die vom Nutzer einzeln freigegebene Änderung ist ausschließlich `app/layout.tsx:42`: `revalidate = 86400` statt des gleichwertigen Ausdrucks `60 * 60 * 24`.
- `npm run build -- --webpack` erfolgreich; [Buildprotokoll](logs/build-webpack-approved.txt). `npm run start -- --port 4400` läuft, `/` liefert HTTP 200 und das erwartete HTML. Next warnt wegen `output: standalone` beim Startbefehl, die lokalen funktionalen Aufrufe funktionieren.
- Der Standard-Turbopack-Build ist damit nicht als erfolgreich geprüft. Die vorherigen Fontfehler stehen im [historischen Blockerbericht](scorecard-blocked.md). Keine Font-Mocks oder abgeschalteten Verifikationsprüfungen verwendet.
- `npm run lint` scheiterte bereits vor dieser Freigabe an der bestehenden zirkulären ESLint-Konfiguration und wurde nicht repariert. `npm run check-messages` bestand mit fünf Bundles und 4.069 Schlüsseln. Der Build überspringt gemäß bestehender Konfiguration Typfehler; sein Erfolg ist kein eigenständiger Typprüfungsnachweis.
- Keine Designänderungen, neuen Projektabhängigkeiten, Übersetzungsänderungen, API-/SEO-Änderungen, Commits, Pushes oder Deployments. Audit-Werkzeuge wurden außerhalb des Repositories installiert.
- `PUBLIC_STATS_TOKEN` ist nicht gesetzt; die bestehende Logik zeigt ihre vorhandenen statischen Produktangaben. Echte Nutzungskennzahlen wurden nicht erfunden oder ersetzt. E-Mail-Versand wurde nicht ausgelöst.
- Vercel-Telemetrie-Endpunkte fehlen lokal und erzeugen 404-/MIME-Konsolenmeldungen. Das belegt keinen Fehler ihres Hostings. Der React-418-Fehler unter Reduced Motion wurde davon getrennt in drei frischen Browserkontexten reproduziert; H1 und 16 FAQ-Buttons waren vorhanden.
- [Messhinweise](shots/measurement-notes.md) erklären die erkannten automatischen Fehlklassifikationen, FAQ-Grenzen, Hover-Ergänzungen und unterschiedlichen Messverfahren. [run.json](run.json) hält Versionen und Prüfumfang fest.

**Stopp vor Schritt 2:** Die Jury-Ausgangsbewertung ist abgeschlossen. Umsetzung mit `awwwards` erst nach dem weiteren OK des Nutzers, innerhalb von „Die Trainertafel“, im bestehenden Stack und unter Erhalt von Registrierungsziel, Tracking, Links, echten Daten, Metadaten und strukturierten Daten.
