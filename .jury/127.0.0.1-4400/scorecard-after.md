# Statix `/`: Jury-Scorecard nach der Umsetzung

21. Oktober 2026. **Unabhängige Schätzung, nicht mit Awwwards verbunden, keine offizielle Wertung.** Bewertet wurde ausschließlich `/` im lokalen Produktionsbuild. Ein neuer Kritiker erhielt 60 finale Screenshots, Messberichte und Rubrik; keinen Quellcode, keine Designvorgaben, frühere Scores oder Kalibrierung.

**Strenge Kritikerwertung: 7,64 / 10**, vorher 6,70; Verbesserung **+0,94**. Die vom Kritiker erkannte Idee stimmt mit dem bestehenden Konzept „Die Trainertafel“ überein.

Die optionale Skill-Kalibrierung (+1,1, nur zwei Referenzseiten) ergäbe grob 8,7. Rechnerisch läge das im Site-of-the-Day-Bereich, ist aber keine belastbare Prognose oder Auszeichnung. Für den Vergleich verwenden wir ausschließlich die unveränderten strengen Kritikerwerte. Entwicklerbereiche erhalten keinen Aufschlag.

| Kriterium | Vorher | Nachher | Änderung |
|---|---:|---:|---:|
| Design | 7,0 | 7,6 | +0,6 |
| Usability | 6,0 | 7,8 | +1,8 |
| Creativity | 7,0 | 7,4 | +0,4 |
| Content | 7,0 | 7,8 | +0,8 |
| **Gewichtet gesamt** | **6,70** | **7,64** | **+0,94** |
| Semantics/SEO | 7,0 | 7,5 | +0,5 |
| Animations/Transitions | 6,0 | 7,0 | +1,0 |
| Accessibility | 6,0 | 8,0 | +2,0 |
| WPO | 6,0 | 7,0 | +1,0 |
| Responsive | 7,0 | 8,0 | +1,0 |
| Markup/Meta-data | 7,0 | 7,5 | +0,5 |

[Unveränderte Baseline](scorecard.md) · [Unabhängiger finaler Originalbericht](after/final/critic.md) · [Umsetzung, Messvergleich, Dateien und manuelle Prüfungen](after/final/implementation.md) · [Befehlsprüfung](after/final/validation.md).

## Messübersicht und Grenzen

- Tatsächlich gedrosselter Browser: mobiler LCP 1996 ms, CLS 0, Scrollen 60 fps, kein Overflow. Desktop-Scrollen in Software-Rendering: 49 fps.
- Separates Lighthouse-Mobilprofil: Performance 79, A11y 100, Best Practices 96, SEO 100; simulierter LCP 3833 ms, TBT 409 ms, CLS 0. Vergleich und Profilgrenzen stehen im Umsetzungsbericht; keine Feld-CWV/INP-Messung.
- axe: 0 Verstöße, 0 schwerwiegende; 156 nicht automatisch entscheidbare Kontrast-Prüffälle sind keine bestätigten Fehler. Ein vollständiger manueller WCAG-Nachweis ist damit nicht erbracht.
- Audit: 0 FAIL, 3 WARN; JS 434 KB gzip. Description und SEO-Werte wurden auftragsgemäß erhalten.
- Reduced Motion: keine laufende Bewegung, Video oder Canvas; sieben „hiddenText“-Treffer sind geschlossene FAQ-Antworten. Der deutsche erste Skip-Link funktioniert; die anderssprachige Heuristik erkennt ihn nicht.
- `noHoverChange`: 0. Der eine `colorOnly`-Treffer wurde visuell geprüft: volle Flächenreaktion, kein bloßer Textfarbwechsel; die zwei weiteren erfassten Ziele zeigen zusätzliche Bewegungs-/Konturreaktionen. Ergänzende CTA-Paare belegen Hintergrund-/Schattenfeedback.
- Ruhiger Hero ohne Dauerschweben ist eine dokumentierte Entscheidung. Lokale Vercel-Telemetrie-404s sind von App-Exceptions zu unterscheiden; der Funktionstest hat keine App-Exceptions.
- Keine externe Registrierung, kein Newsletterversand oder Kauf ausgeführt. PUBLIC_STATS_TOKEN fehlt; vorhandener Fallback bleibt unverändert.

## Unabhängige Wertung und verbleibende Verbesserungen

Statix wirkt wie ein digitales Trainerbrett für die Handballbank: Ein live erfasster Spielmoment wird unmittelbar zu Statistik, Wurfbild und einer Erklärung dafür, wo das Spiel kippt.

Unabhängige Schätzung anhand der vorgelegten Evidenz, ohne Verbindung zu Awwwards. Betrachtet wurden alle **60 PNG-Screenshots**, zunächst vollständig in beschrifteten Bildübersichten, zentrale Ansichten zusätzlich in Originalgröße. Bewertet wird ausschließlich `/`; die Navigationsbilder dienen nur dem Übergangstest. Ausgangspunkt jeder Bewertung ist 6; Zuschläge ergeben sich aus den genannten Belegen.

| Bereich | Wert / 10 | Begründung und Evidenz |
|---|---:|---|
| Design | **7,6** | `home/d-01-hero.png`: starke Kombination aus dunklem Spielfeld, orangefarbenem Marker und echten Geräteansichten; klare Hierarchie und erkennbare Bildidee. `d-02`–`d-07`: bewusster Wechsel zwischen hellem Erklärraum und dunkler Analyse, durchgehaltene handschriftliche Randnotizen und Klebebanddetails. `d-11`: sorgfältiger Footer. Für 8 fehlt noch die durchgehende Prägnanz: ähnliche zentrierte Überschriften, Karten und CTAs wiederholen sich; die zentrale Analyse in `d-05` bleibt optisch dicht. |
| Usability | **7,8** | `m-01`, `supplement/mobile-showcase-copy-1`–`3`: verständliche, große CTAs und gut lesbare Erklärung in sinnvoller Reihenfolge. `home/report.json`: mobile LCP 1996 ms, CLS 0, 60 fps, keine Überbreite; Keyboard ohne unsichtbaren Fokus oder Falle. `supplement/report.json.skipLink` belegt den funktionierenden Sprung zu MAIN. Keine 8 wegen der langen Strecke von 15108 px und fehlendem Nachweis vollständiger externer Registrierung/Demo bzw. Formularübermittlung; `functional.json` prüft ausdrücklich nur Teilabläufe. |
| Creativity | **7,4** | `d-01` verbindet den eingekreisten Wendepunkt des Diagramms mit der Headline; `mobile-showcase-copy-1`–`3` führen 46:27 → 46:28 → 46:33 als konkrete Spielminute weiter. Spielfeldlinien, Marker und handschriftliche Trainerkommentare sind thematisch begründet. Die Grundstruktur bleibt aber die bekannte Produktseite mit Gerätebild, Feature-Reihen, Vergleich und FAQ; die Idee prägt bislang stärker Bildsprache und Text als eine eigene Interaktion. |
| Content | **7,8** | `mobile-showcase-copy-1`–`3`: konkrete Aussagen zu Rückraum, Torwartparaden, Sofortberechnung und Rückgängig-Funktion. `d-05`: nachvollziehbare Spielanalyse mit Ergebnis 28:26 und kritischen Phasen; `m-04`: Entwickler und Herkunft werden benannt. `mobile-section-07`: sachliche FAQ. Für 8 fehlt ein stärker verdichteter, lesbarer Beleg des Trainer-Nutzens direkt neben der Analyse; mehrere lange Überschriften wiederholen die Suchphrase „Handball-Statistiken“. |

**Gewichtetes Gesamturteil: 7,64 / 10** = 0,4 × 7,6 + 0,3 × 7,8 + 0,2 × 7,4 + 0,1 × 7,8. Das ist eine überzeugende, eigenständig eingefärbte Produktseite; eine Auszeichnung oder tatsächliche Juryentscheidung lässt sich daraus nicht ableiten.

| Entwicklerbereich | Wert / 10 | Begründung und Evidenz |
|---|---:|---|
| Semantics/SEO | **7,5** | `audit.txt`: 0 FAIL; `home/report.json.desktop.h1`: genau eine verständliche H1; `supplement/report.json.skipLink`: echtes MAIN-Ziel. Lighthouse SEO 100 stützt die Grundlagen. Die Meta-Beschreibung ist mit 205 Zeichen zu lang. Der zusammengefasste Audit weist die einzelnen Canonical-/404-/Sitemap-Prüfungen nicht aus; für die volle 8 ist ein realer 404-Status hier nicht separat nachprüfbar. |
| Animations/Transitions | **7,0** | `h-01` zeigt eine echte Flächenaufhellung des Markenbuttons, `h-02` eine neue Kapsel samt Pfeilreaktion, `h-03` Kontur/Flächenreaktion. `supplement/primary-1` und `primary-2` zeigen reale Hintergrundänderung; beim Start-CTA zusätzlich Schattenänderung im Report. Kein Abzug als bloßer Textfarbwechsel. `d-90-transition-a/b/c` zeigen dagegen bereits nahezu denselben Zielzustand: Eine durchgehende, charakteristische Seitenchoreografie ist damit nicht belegt. Mobile Scrollmessung: 60 fps; Desktop 49 fps bei Software-Rendering, keine Aussage über reale Hardware. |
| Accessibility | **8,0** | `home/report.json.a11y`: keine axe-Verletzungen; `k-01`–`04`: sichtbarer Fokus. `supplement/report.json.skipLink`: erster Sprunglink mit 175 × 44 px im Fokus und Enter zu MAIN. Sämtliche ergänzenden Reduced-Abschnitte enthalten ihre Überschriften; dort keine aktiven CSS-Animationen oder Videos. `functional.json`: auch laufender Präferenzwechsel beendet Videos/Canvas/CSS-Animationen. Geschlossene FAQ-Antworten und das absichtlich versteckte Skip-Link-Ruhebild sind keine Mängel. Die 156 automatischen Kontrast-Prüffälle sind kein Beleg für 156 Fehler. |
| WPO | **7,0** | Hauptprofil mit echter CPU-/Netzdrosselung: LCP 1996 ms, CLS 0, kein Loader, 60 fps (`home/report.json.mobile`). `audit.txt`: nur ca. 1357 KB Gesamtgewicht, aber **434 KB JS gzip** statt unter 300 KB. Separates simuliertes Lighthouse-Profil: Performance 79, LCP **3833 ms**, TBT **409 ms**, CLS 0. Diese Profile werden nicht vermischt: Das erste ist schnell sichtbar, das zweite zeigt reale Optimierungsreserve unter seiner Modellierung. Keine Feld-CWV oder INP vorhanden. |
| Responsive | **8,0** | `m-01`, alle neun `mobile-section-*` und drei `mobile-showcase-copy-*`: eigenständig gestapelte Komposition, lesbare Erklärtexte, breite Bedienelemente; kein zusammengeschobener Desktop. `home/report.json`: keine Überbreite und keine echten kleinen Touchziele. `functional.json` bestätigt gleiche Seiten-/Viewportbreite bei 320, 390, 768, 1024, 1440 und 1920 px. Detailtabellen in Produktbildern bleiben mobil klein; die Analyse besitzt allerdings einen expliziten Vergrößerungslink (`m-03`). |
| Markup/Meta-data | **7,5** | `audit.txt`: keine FAILs, Lighthouse SEO 100 und Best Practices 96; `home/report.json` liefert einen spezifischen Seitentitel. Der vorliegende Audit ist nur eine Zusammenfassung und nennt keine einzeln bestätigte ladende OG-Grafik. Deshalb keine volle 8 aufgrund unaufgeschlüsselter Metadaten-Evidenz; dies ist eine Nachweisgrenze, kein behaupteter Defekt. |

Verbesserungen nach erwartetem Gewinn für das bestehende Konzept:

1. **Die Spielminute zum noch klareren roten Faden machen.** In `d-02`–`d-05` und `mobile-showcase-copy-1`–`3` ist die Abfolge bereits vorhanden; die KI-Auswertung verliert anschließend den unmittelbaren Bezug zu Eriks Wurf. Direkt am Diagramm einen gut lesbaren vorhandenen Wendepunkt und die daraus folgende konkrete Trainerentscheidung herausstellen. Das stärkt gleichzeitig Kreativität, Inhalt und Design, ohne eine neue Idee einzuführen.
2. **Den mobilen Erklärweg kürzen.** `supplement/report.json.modes.mobile` misst allein 2855 px für die Spielminute, 1962 px KI und 1970 px FAQ; die Gesamtseite erreicht 15108 px. Wiederholte Start-Karten und große Einleitungsabstände reduzieren, den Vergleich knapper fassen und weiterführende Details über bestehende Vertiefungslinks anbieten. Die drei konkreten Spielmomente erhalten Vorrang vor wiederholten allgemeinen Nutzenbehauptungen.
3. **JavaScript und spätere Hauptinhalte gezielt entlasten.** `audit.txt`: 434 KB gzip; Lighthouse LCP 3833 ms und TBT 409 ms. Nicht unmittelbar benötigte Module erst bei Bedarf laden und anschließend dasselbe Lighthouse-Profil erneut messen. Ziel: unter 300 KB initiales JS und weniger Hauptthread-Blockierung; die gute erste Messung ersetzt diesen zweiten Leistungsbefund nicht.
4. **Den Seitenwechsel mit derselben Markersprache ausarbeiten und messen.** `d-90-a/b/c` belegt keinen sichtbar durchgängigen Übergang. Einen kurzen, unterbrechbaren Übergang aus dem vorhandenen Marker-/Spielfeldmotiv entwickeln; Reduced Motion erhält den direkten, ruhigen Wechsel. Die bereits sichtbaren vollständigen Hover-Flächen beibehalten.
5. **Analyse auf dem Telefon vor dem Öffnen verständlicher machen.** `m-03`, `d-05`: Die Originalansicht transportiert Substanz, ihre vielen Zeilen benötigen aber Zoom. Direkt daneben zwei bis drei vorhandene Ergebnisse als lesbaren Textauszug hervorheben; den bestehenden Vollbildlink behalten.
6. **Metadaten-Nachweis vervollständigen.** `audit.txt` nennt eine 205 Zeichen lange Beschreibung: auf eine präzise Suchvorschau kürzen. Im nächsten Evidenzpaket echte 404-Antwort, ladende OG-Grafik und einzelne Meta-Prüfergebnisse aufführen; nicht pauschal aus einer Punktzahl ableiten.

Messgrenzen: Vercel-Analytics-404/MIME-Meldungen gehören laut `measurement-notes.md` zum lokalen Server und belegen keinen Produktionsfehler. Abgebrochene Prefetches beim Schließen der Messkontexte sind kein belegter Navigationsfehler. Die Ergänzungsbilder liefern keine gedrosselten Leistungswerte. Der ruhige Hero ist für dieses Produkt plausibel; `idleMotion:false` wird nicht als Fehler gewertet. Ungeprüfte Übermittlung, externe App-Funktionen und das zeitliche Gefühl der Bewegung erhalten keine erfundenen Pluspunkte.
