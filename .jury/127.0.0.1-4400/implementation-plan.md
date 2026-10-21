# Umsetzung innerhalb von „Die Trainertafel“

Das bestehende Konzept ist verbindlich; es wird keine neue Konzeptauswahl vorgenommen.
Stack: Next.js App Router, Tailwind, next-intl, bestehendes GSAP/Framer Motion.
Primäres Ziel: kostenlose Registrierung; alle bisherigen Tracking-Orte und Linkziele bleiben.

Art-Direction-Prüfung: Court/Papier, orange Eigenmannschaft und blaue Gegenseite,
Archivo/Inter/Caveat, echte App-Aufnahmen und der markierte Wendepunkt bleiben.
Der Signature Moment ist weiterhin das Sichtbarmachen des Spielverlaufs und die
konkrete Folge 46:27 → 46:28 → 46:33. Kein neues WebGL, kein Loader, kein Smooth-Scroll-Framework.

Komposition:
- Hero: kurze Aussage + CTA-Paar | echte Geräte; mobil direkt darunter, dann Vertrauensnotizen.
- Scoreboard: ruhige Endwerte, unveränderte Live-Datenquelle, Markerdust nur bei geeigneten Geräten.
- Spielminute: drei echte Produkt-Loops und präzisere Beschreibung der detaillierten Erfassung.
- KI: vorhandene echte Analysebilder in voller Breite, mit zugänglichem Link zum Original.
- Mehr/Pro/FAQ: dichtere Papierabschnitte, lesbare Vergleiche, größere Linkflächen.
- Finale: erhaltenes CTA-Paar, Deadline und echte Produktansicht.

Performance: zusätzliche Sprach-Bundles erst bei Sprachwahl, Shader erst bei Sichtbarkeit
und feinem Zeiger. Keine neuen Projektabhängigkeiten. Bilder bleiben next/image.
Bewegung: ruhige SSR-Gerätepose, ein Markerzug; Wiederholte Landing-Reveals entfallen. Reduced Motion deaktiviert
Video-Loops, WebGL und Dauereffekte und reagiert auf Einstellungswechsel.

Notwendige Wartung: ESLint-native Flat Config statt nicht kompatiblem FlatCompat;
CommonJS-Skripte erhalten die passende Sprachkonfiguration. Kleine bestehende React-
Initialisierungsfehler werden berichtigt, ohne Formulardaten oder API-Verträge zu ändern.
Webpack wird als unterstützter Build-Modus im Skript verwendet, weil Turbopack 16.0.10
an der vorhandenen Caveat-Font-Auflösung scheitert. Metadaten und SEO-Dateien bleiben erhalten.

QA: mehrere Produktionsdurchläufe mit Desktop, Mobil, Reduced Motion und Tastatur,
Sprachwechsel, registrierungsbezogenen Tracking-Ereignissen und Query-Vorbelegungen.
Lighthouse bleibt separat von den tatsächlich gedrosselten Browserwerten.
Frischer unabhängiger Jury-Kritiker am Ende; kein Zugriff auf frühere Scores oder Quellcode.
