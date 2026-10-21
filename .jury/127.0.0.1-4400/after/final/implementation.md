# Umsetzung und Übergabe

## Ergebnis

„Die Trainertafel“ bleibt das Konzept: Court und Papier, Archivo/Inter/Caveat, Marker und echte App-Aufnahmen. Der Hero formuliert den Nutzen kürzer und zeigt mobil das Produkt direkt nach dem CTA-Paar. Die konkrete Spielminute bleibt erhalten. Analysebelege nutzen die verfügbare Breite; das zweite Original ist per Tastatur als Vertiefung aufklappbar. Keine erfundenen Aussagen, Referenzen oder Zahlen.

Orange CTAs erhalten lesbare dunkle Schrift, Nebenlinks größere Trefferflächen, Navigation passende zugängliche Namen und sichtbares Fokus-/Hoverfeedback. Reduced Motion zeigt den fertigen Inhalt, entfernt Video-Loops und Kreidestaub und reagiert auch auf einen Wechsel der Systemeinstellung. Wiederholte Scroll-Einblendungen entfallen zugunsten der einzelnen Hero-Markierung. Kennzahlen erscheinen direkt mit ihren Endwerten; deren Datenlader und Fallback bleiben unverändert.

Zusätzliche Sprachen laden erst bei Auswahl. LCP-Bild und responsive Bildgrößen sind optimiert. Der vorhandene optionale Kreidestaub lädt nur im sichtbaren Band bei feinem Zeiger ohne Reduced Motion, pausiert außerhalb und nutzt bei Software-Grafik die statische Darstellung. Keine neue Projektabhängigkeit.

## Dateien und Umfang

Die vollständige Liste der 44 geänderten Quelldateien steht in [changed-files.txt](changed-files.txt). Schwerpunkte:

- Landing-Komponenten unter `features/landing-page/`, scoped Regeln in `app/globals.css`, Ergänzungen in `DESIGN.md`.
- Texte in `messages/de.json` und gespiegelte Schlüssel in EN/ES/FR/PL.
- Geteilte Navigation/Footer, Motion-Provider, PageTransition und LocaleProvider.
- `next.config.mjs` für Bildgrößen, `app/layout.tsx` für statisch auswertbares Revalidate und Font-Preload.
- `package.json`, native ESLint-Flat-Config und Entfernung der veralteten `.eslintignore`, um die verlangten Build-/Lint-Befehle zuverlässig auszuführen.
- Eng begrenzte bestehende Lint-Fehler: React-Initialisierung in Kontakt-/Videoanfrage-/Checkout-/Navigations-Hooks, Next-Link im Excel-Header, dokumentierte Hard-Reload-Ausnahme im Root-Fehlerbildschirm. Formulare, API-Verträge, Preiswerte und Versandlogik bleiben erhalten. Vorbelegung, Bearbeitbarkeit und Preisvorschau wurden im Browser ohne Versand/Kauf geprüft.

API, Auth, Brevo/Newsletter-Backend, Live-Stats-Lader, Analytics-Implementierung, Sitemap, robots, llms und strukturierte Daten sind unverändert. Alle 31 bisherigen Meta-/Canonical-Tags bleiben erhalten; Next ergänzt ein internes `next-size-adjust`-Tag.

## Messungen

| Profil / Messgröße | Vorher | Nachher |
|---|---:|---:|
| Lighthouse mobil Performance | 52 | 79 |
| Lighthouse Accessibility | 97 | 100 |
| Lighthouse Best Practices | 96 | 96 |
| Lighthouse SEO | 100 | 100 |
| Lighthouse simulierter LCP | 5.148 ms | 3.833 ms |
| Lighthouse TBT | 2.134 ms | 409 ms |
| Lighthouse CLS | 0 | 0 |
| Tatsächlich gedrosselter Browser LCP, 390 px | 2.132 ms | 1.996 ms |
| Tatsächlich gedrosselter Browser CLS | 0 | 0 |
| Browser Scroll-FPS mobil | 58 | 60 |
| JS im statischen Audit, gzip | 954 KB | 434 KB |
| axe schwerwiegende Regelverstöße | 2 | 0 |

Die Profile sind getrennte lokale Labormessungen. Es gibt keine neue Feldmessung von INP oder Core Web Vitals. Simulierter LCP ist verbessert, bleibt aber über 2,5 Sekunden. 434 KB gzip-JS überschreiten den 300-KB-Richtwert des Skills. Der Desktop-Scrolltest erreicht in der Software-Umgebung 49 fps; echte Hardware wurde nicht vermessen. Der Audit hat 0 FAIL und 3 WARN: 205-Zeichen-Meta-Beschreibung, typografische Gedankenstriche als Stilheuristik, JS-Gewicht. Metadaten wurden auftragsgemäß erhalten.

## Prüfung und Grenzen

[validation.md](validation.md), [functional.json](functional.json), [pricing-gate-check.json](pricing-gate-check.json) sowie die Screenshot-Reports dokumentieren die Prüfung. Keine App-Laufzeitfehler im Funktionstest. Lokale Vercel-Telemetrie-Endpunkte liefern 404, weil `next start` diese Hosting-Endpunkte nicht bereitstellt; Tracking wurde deshalb nicht entfernt.

Keine neuen Platzhalter. Keine neuen Bibliotheken oder Änderungen an der Lockdatei. PUBLIC_STATS_TOKEN fehlt in dieser Umgebung: sichtbar ist der bereits vorhandene Fallback; die echte Statistikabfrage wurde weder verändert noch mit einem erfundenen Wert ersetzt.

Manuell prüfen: Safari/iOS mit Touch und Videos; reale Desktop-GPU für den optionalen Kreidestaub; Anmeldung und Demo auf ihren externen Zielseiten; echte Kennzahlen mit vorhandenem PUBLIC_STATS_TOKEN in der vorgesehenen Umgebung. Kein Formular wurde abgesendet und kein Checkout ausgelöst. Newsletter-/E-Mail-Versand und externe Registrierung wurden nicht Ende-zu-Ende getestet.

Kein Push, kein Deployment. Lokaler Start: `npm run build`, anschließend `npm run start -- --port 4400`. Die bestehende Standalone-Ausgabe bleibt erhalten; Next meldet bei `next start` seinen Hinweis auf den bevorzugten Standalone-Server. Die Seite wurde dennoch erfolgreich als Produktionsbuild geprüft.
