# Screenshot-Pipeline

Nimmt echte App-Screens auf und schreibt sie nach `public/`, damit die Product
Page nicht vom Produkt abdriftet. Bei jeder größeren UI-Änderung in der App neu
laufen lassen.

## Voraussetzungen

- Node 20+
- Ein Chromium. Standard ist der vorinstallierte Pfad aus der Claude-Umgebung;
  auf einem normalen Rechner setz `CHROMIUM_PATH`, oder installier einmalig
  `npx playwright install chromium` und zeig darauf.

```bash
export CHROMIUM_PATH="$(node -e "console.log(require('playwright-core').chromium.executablePath())")"
```

## Benutzung

```bash
# 1. UI erkunden — schreibt Screenshots + report.json nach .screenshots-explore/
node scripts/screenshots/capture.mjs explore

# 2. Aufnehmen — schreibt nach public/
node scripts/screenshots/capture.mjs capture
node scripts/screenshots/capture.mjs capture --only kader

# Diagnose, falls nichts lädt
node scripts/screenshots/capture.mjs selftest
```

Ziel ist standardmäßig die öffentliche Live-Demo (kein Account nötig).
Woanders hin:

```bash
STATIX_URL=http://localhost:3000 node scripts/screenshots/capture.mjs explore
```

## Die Vereins-Screenshots (`--only verein`)

Die Gruppe `verein` (`verein-uebersicht.png`, `verein-mannschaften.png`,
`verein-spieler.png`, `verein-auswertung.png`, `verein-saisonvergleich.png`,
`verein-laufbahnen.png`) lässt sich **nicht** gegen die Live-Demo aufnehmen:
Der Vereinsbereich vergleicht Mannschaften miteinander, und die Demo hat genau
eine. Dafür braucht es eine lokale Instanz mit mehreren Kadern unter einem
Verein — im App-Repo:

```bash
npm run db:setup
npm run db:seed                      # Trainer-Saison + ein Verein mit einer Mannschaft
node scripts/seed-club-demo.mjs      # sieben weitere Kader, Laufbahnen, zwei Saisons
npm run build && npm start           # Produktionsbuild: kein Dev-Overlay im Bild
```

Und hier:

```bash
STATIX_URL=http://localhost:3000 \
STATIX_EMAIL=club-admin@statix-app.de \
STATIX_PASSWORD='StatixDemo!2026' \
node scripts/screenshots/capture.mjs capture --only verein
```

Wichtig ist die **Anmeldung als Vereinsverwaltung**: Ein Trainerkonto ohne
Vereinsrolle wird auf `/games` umgeleitet, und die Aufnahme schriebe dann die
falsche Seite nach `public/`.

## Ablauf

`explore` ist der erste Schritt: es besucht die Hauptrouten, hält Überschriften,
Tab-Beschriftungen und interne Links fest und legt je einen Screenshot ab. Aus
diesem Report wird das `SHOTS`-Manifest in `capture.mjs` gefüllt — dort steht pro
Aufnahme die Route, das Viewport, ein optionaler Selektor für den Bildausschnitt
und der Dateiname unter `public/`. Das Manifest ist damit gleichzeitig das
Inventar aller Produktbilder.

Danach:

```bash
npm run optimize-images   # WebP/AVIF-Varianten erzeugen
```

Wenn sich Bildmaße ändern, müssen die `width`/`height`-Props der
`BoardScreenshot`-Aufrufe mitgezogen werden — Next/Image braucht die echten
Maße, sonst springt das Layout.

## Warum eine Proxy-Bridge drin ist

Nur relevant innerhalb der Claude-Code-Sandbox. Dort läuft ausgehendes HTTPS
über einen Policy-Proxy, und **Chromium kommt da nicht durch**: der CONNECT-Tunnel
wird sauber aufgebaut (`200 Connection Established`), der Upstream schließt die
Verbindung aber, sobald Chromiums TLS-Handshake beginnt. `curl` und Node kommen
über denselben Proxy zum selben Host problemlos auf 200 — nachweisbar mit
`capture.mjs selftest`, das eine Node-HTTPS-Anfrage durch exakt dieselbe Bridge
schickt.

Das Skript startet deshalb bei gesetztem `HTTPS_PROXY` eine lokale
CONNECT-Bridge, die an genau diesen Policy-Proxy weiterreicht: Egress-Policy,
TLS-Re-Terminierung und CA-Bundle gelten unverändert, überbrückt wird nur der
Transport. Die Bridge blockt zusätzlich Chromiums Telemetrie-Hosts, damit sie
den Verbindungspool nicht zustopfen.

**Auf einem normalen Rechner ist ohne `HTTPS_PROXY` keine Bridge aktiv** —
Chromium verbindet direkt, und das Ganze ist ein gewöhnliches Playwright-Skript.

Stand heute bleibt die Aufnahme gegen die Live-Demo aus der Sandbox heraus an
Chromiums TLS-Handshake hängen. Aus der Sandbox funktioniert nur `localhost`
(dafür braucht es eine lokal laufende App mit Daten); von außerhalb funktioniert
alles.
