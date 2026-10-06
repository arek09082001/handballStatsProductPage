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

## Die Termin-Screenshots (`--only termine`)

Die Gruppe `termine` (`termine-liste.png`, `termine-kalender.png`,
`termine-detail.png`, `termine-teilnahme.png`, `termine-abwesenheiten.png`,
`mobil-termine.png`) braucht eine lokale Instanz: die öffentliche Demo hat
keinen einzigen Termin, und ein Kalender voller Leerzustände ist schlechter als
gar kein Bild.

`scripts/screenshots/seed-schedule.mjs` legt den Monat an, den die Aufnahmen
zeigen — zwei Hallen im Adressbuch, eine Di/Do-Trainingsserie über neun Wochen,
zwei Spiele, ein Mannschaftsabend, Rückmeldungen über den ganzen Kader und vier
Abwesenheiten. **Die Datei gehört ins App-Repo** (siehe Kopf der Datei); dort:

```bash
cp <hier>/scripts/screenshots/seed-schedule.mjs scripts/seed-schedule.mjs
node scripts/seed-demo.mjs && node scripts/seed-schedule.mjs
```

Das Skript druckt am Ende die `EVENT_ID` des nächsten Termins — die braucht die
Detailaufnahme:

```bash
STATIX_URL=http://localhost:3000 \
STATIX_EMAIL=demo@statix-app.de STATIX_PASSWORD='StatixDemo!2026' \
EVENT_ID=<aus dem Seed> \
node scripts/screenshots/capture.mjs capture --only termine
```

## Kasse, Trikots, Spieler-Zugang (`--only organisation`, `--only spielerin`)

Die Gruppen `organisation` (`strafen-kasse.png`, `strafen-erfassen.png`,
`strafen-katalog.png`, `trikots-schrank.png`, `spieler-zugang.png`) und
`spielerin` (`mobil-meine-statistik.png`, `mobil-meine-strafen.png`) brauchen
eine lokale Instanz: die öffentliche Demo hat keine Strafen, keinen
Trikotschrank und keine verknüpften Spielerkonten — und drei Leerzustände sind
keine Feature-Seite.

`scripts/screenshots/seed-team-organisation.mjs` legt beides an (Katalog mit
acht Zeilen und rund zwanzig Strafen, zwei Trikotsätze mit Ausgabe und
Historie, vier verknüpfte Spielerkonten samt Beitrittslink). **Die Datei gehört
ins App-Repo**; dort:

```bash
cp <hier>/scripts/screenshots/seed-team-organisation.mjs scripts/seed-team-organisation.mjs
node scripts/seed-demo.mjs && node scripts/seed-team-organisation.mjs
```

Wichtig: Die Instanz muss mit `NEXT_PUBLIC_APP_URL=https://app.statix-app.de`
**gebaut** sein — der Einladungslink im Screenshot wird daraus erzeugt, und
Next backt `NEXT_PUBLIC_*` beim Build ein. Mit der lokalen Adresse steht
`http://localhost:3000/join/…` im Bild.

Die Spielerinnen-Ansicht ist ein **zweiter Durchlauf mit einem anderen Konto**
— das Trainerkonto hat keine Kaderzeile und bekäme unter `/my-stats` nur den
Leerzustand:

```bash
STATIX_URL=http://localhost:3000 \
STATIX_EMAIL=demo@statix-app.de STATIX_PASSWORD='StatixDemo!2026' \
node scripts/screenshots/capture.mjs capture --only organisation

STATIX_URL=http://localhost:3000 \
STATIX_EMAIL=spielerin1@statix-app.de STATIX_PASSWORD='StatixDemo!2026' \
node scripts/screenshots/capture.mjs capture --only spielerin
```

`--only` matcht auch Dateinamen-Fragmente: `--only strafen` nimmt deshalb
`mobil-meine-strafen.png` mit — als Trainer aufgenommen ist das der
Leerzustand. Die Gruppe `spielerin` danach noch einmal laufen lassen.

## Halten & Wischen (`--only halten`)

Die Gruppe `halten` (`halten-wischen-tablet.png`, `halten-wischen-menue.png`,
`-oben`, `-unten`, `-links`, `-rechts`, `-rueckgaengig`) zeigt die Halte-Geste
der Live-Erfassung: eine Spielerin gehalten, das Menü offen, je Aufnahme eine
andere Richtung hervorgehoben. Die Seite `/funktionen/halten-und-wischen`
wechselt zwischen diesen Bildern — sie müssen also denselben Moment zeigen und
dürfen sich nur im leuchtenden Ziel unterscheiden.

Die Berührung läuft über CDP (`holdAndSwipe` in `capture.mjs`): halten, wischen,
und aufgenommen wird, SOLANGE der Finger unten ist. Losgelassen wird nur für
`-rueckgaengig` — diese Aufnahme schreibt deshalb ein „7m verursacht“ in das
laufende Spiel der Instanz. Gebraucht wird eine lokale Instanz mit dem Seed der
App und einem laufenden Spiel, auf der alle vier Codes erfassbar sind
(`seven_m_caused` seit `db/2026-09-29_seven_m_caused_recordable.sql`):

```bash
STATIX_URL=http://localhost:3000 \
STATIX_EMAIL=demo@statix-app.de STATIX_PASSWORD='StatixDemo!2026' \
LIVE_GAME_ID=<laufendes Spiel aus dem Seed> \
node scripts/screenshots/capture.mjs capture --only halten
```

## Die Video-Screenshots (`--only video`, `--only mediathek`)

Alle Video-Aufnahmen sind Screens **ohne** das bewegte Bild: die Wiedergabe
läuft über eine signierte R2-URL, und R2 hat eine lokale Instanz nicht — die
Bühne bleibt also auf „Der Upload ist nicht abgeschlossen“ stehen. Aufgenommen
wird deshalb nur, was echt ist; das bewegte Bild auf der Produktseite ist eine
**gezeichnete** Darstellung
(`features/funktionen/components/tagging-bench-mock.tsx`) und sagt das auch.

- `video-tagging-spuren.png` und `video-tagging-katalog.png` sind
  **Ausschnitte** der Tagging-Werkbank (Spuren bzw. rechte Spalte).
- `video-filter.png` ist das offene Filterblatt der Werkbank.
- `video-bibliothek.png` und `video-versendet.png` sind die Listen unter
  `/videos` und `/videos/shares`, abgeschnitten nach der letzten Zeile.
- `mobil-clip-posteingang.png` und `mobil-mediathek.png` zeigen die Seite der
  Spielerin und brauchen deshalb einen **zweiten Durchlauf mit ihrem Konto**.

Dafür braucht es drei Seeds im App-Repo, in dieser Reihenfolge:
`seed-video.mjs` füllt die Werkbank (eine getaggte Halbzeit, vier Playlists,
drei Marken), `seed-team-organisation.mjs` verknüpft vier Spielerkonten, und
`scripts/screenshots/seed-video-extras.mjs` legt den Rest des Videobereichs an
(vier weitere Aufnahmen in verschiedenen Ständen, Spielzugbuch, eigene Tags,
sieben versendete Clips, Freigaben für die Mannschaft). Die beiden letzten
liegen nur hier — ins App-Repo kopieren. Wichtig: die Videorouten hängen an
einer Allowlist — ohne `VIDEO_BETA_EMAILS=demo@statix-app.de` in der `.env`
antwortet jede von ihnen mit 403.

```bash
cp <hier>/scripts/screenshots/seed-team-organisation.mjs scripts/
cp <hier>/scripts/screenshots/seed-video-extras.mjs scripts/
node scripts/seed-demo.mjs && node scripts/seed-video.mjs \
  && node scripts/seed-team-organisation.mjs && node scripts/seed-video-extras.mjs
```

`seed-video-extras.mjs` druckt am Ende die `VIDEO_ID`. Dann hier:

```bash
VIDEO_ID=<aus dem Seed> \
STATIX_URL=http://localhost:3000 \
STATIX_EMAIL=demo@statix-app.de STATIX_PASSWORD='StatixDemo!2026' \
node scripts/screenshots/capture.mjs capture --only video

STATIX_URL=http://localhost:3000 \
STATIX_EMAIL=spielerin2@statix-app.de STATIX_PASSWORD='StatixDemo!2026' \
node scripts/screenshots/capture.mjs capture --only mediathek
```

`spielerin2`, weil der Extras-Seed einen der Clips an ihre Kaderzeile (#2)
adressiert — ihr Posteingang ist sonst leer.

## Ablauf

`explore` ist der erste Schritt: es besucht die Hauptrouten, hält Überschriften,
Tab-Beschriftungen und interne Links fest und legt je einen Screenshot ab. Aus
diesem Report wird das `SHOTS`-Manifest in `capture.mjs` gefüllt — dort steht pro
Aufnahme die Route, das Viewport, ein optionaler Selektor oder eine `clip`-
Funktion für den Bildausschnitt und der Dateiname unter `public/`. Das Manifest
ist damit gleichzeitig das Inventar aller Produktbilder.

`clip` bekommt die Seite und gibt eine Box aus dem echten Layout zurück. Das
braucht es dort, wo das interessante Panel weder eine Überschrift zum
Hochklettern noch einen stabilen Selektor hat — ein `data-shot`-Attribut in der
App wäre Produktcode, den es nur für diese Pipeline gäbe.

Aufnahmen gegen `next dev` sind erlaubt: `settle()` entfernt vorher das
Next.js-Entwickler-Abzeichen („N 1 Issue“) unten links. Das ist kein Produkt-UI,
und für die Screens, mit denen die Demo noch nicht neu ausgerollt ist, ist eine
lokale Instanz der einzige Weg.

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

## Livestream (`scripts/screenshots/livestream/`)

Die Seite `/funktionen/handball-livestream` zeigt zwei Oberflächen, die
`capture.mjs` nicht erreicht: die **Zuschauerseite** (Repo liveStatixMatches)
und die **Live-Regie** der App. Beide werden mit ECHTEN Komponenten
aufgenommen, die Daten kommen von einem Stand-in.

Das Bild unter der Einblendung ist **gezeichnet** (`court.mjs`: das Spielfeld
der Trainertafel in Perspektive, Magnete als Spielerinnen) — echte
Spielaufnahmen gibt es in dieser Pipeline nicht, und ein fremdes Video unter
unserer Einblendung wäre eine erfundene Übertragung. Die Bildunterschriften
sagen das. Alles andere im Bild ist echt.

Alle Zwischenstände landen in `.screenshots-livestream/` (gitignored).

```bash
WD=.screenshots-livestream; mkdir -p $WD/media/main
D=scripts/screenshots/livestream
# 1. Das gezeichnete Bild: TV-Ausschnitt in 1080p, dazu die beiden Hälften
node $D/court.mjs $WD/tv1080.svg tv 1920 1080
node $D/court.mjs $WD/left.svg left && node $D/court.mjs $WD/right.svg right
W=1920 H=1080 node $D/render.mjs $WD/tv1080.svg:$WD/tv1080.png   # W/H = Viewport
node $D/render.mjs $WD/left.svg:$WD/left.png $WD/right.svg:$WD/right.png
# 2. Als HLS in 2-s-Stücken (VP9: Playwrights Chromium hat kein H.264)
ffmpeg -loop 1 -framerate 30 -i $WD/tv1080.png -f lavfi -i anullsrc=r=48000:cl=stereo -t 120 \
  -vf format=yuv420p -c:v libvpx-vp9 -b:v 4000k -deadline realtime -cpu-used 8 -g 60 \
  -c:a libopus -f hls -hls_time 2 -hls_segment_type fmp4 -hls_playlist_type vod \
  -hls_fmp4_init_filename init.mp4 -hls_segment_filename "$WD/media/main/%d.m4s" $WD/media/main/index.m3u8
```

**Zuschauerseite.** `viewer-api.mjs` ist ein Stand-in der öffentlichen
Live-API (nach `scripts/stream-bench/states.mjs` in liveStatixMatches): ein
Spiel 13:11 mit Kader, Toren, Fehlwürfen, Paraden, einer Zeitstrafe und einer
Auszeit — so gesetzt, dass Becker ihr drittes Tor in Folge wirft (Karte mit
Serie und Quote) und die Auszeit Wurf- und Paradenquote zeigt. `/__reset?start=N`
legt die Live-Kante fest, damit der Spieler genau am gewünschten Moment steht
(ein Sprung per `currentTime` wird vom Live-Spieler überstimmt).

```bash
node $D/viewer-api.mjs &                                   # :4000
# im Repo liveStatixMatches:
NEXT_PUBLIC_STATS_API_URL=http://localhost:4000 STATS_API_URL=http://localhost:4000 npx next dev -p 3001 &
node $D/viewer-shots.mjs                                   # → .screenshots-livestream/out
```

`desktop-goal` → `livestream-einblendung-tor.png`, `desktop-timeout` →
`livestream-auszeit-quoten.png`, `phone-goal` → `mobil-livestream.png`,
`phone-ended` → `mobil-livestream-aufzeichnung.png`.

**Live-Regie.** `regie/harness.tsx` mountet die echte `LiveDirectorPage` der
App; die Antworten der API baut der echte `serializeLiveSession` aus
Datenbankzeilen, die der Harness von Hand füllt (`#setup`: links gekoppelt,
rechts wartet mit QR-Code; `#live`: beide senden, Pod liefert, 143
Zuschauer). Gebaut wird gegen das App-Repo daneben (`STATIX_APP_DIR`, Vorgabe
`../handballStats`, dort `npm ci`). Ausgeliefert unter
`https://app.statix-app.de` (per Playwright-Route), damit der QR-Code und der
Link im Bild die echte Adresse tragen.

```bash
node $D/regie/build.mjs
CROP=1 W=1280 H=1000 CLICKS='Kameras koppeln' node $D/regie/shoot.mjs '' setup   # → livestream-kameras-koppeln.png
CROP=1 W=1280 H=1100 node $D/regie/shoot.mjs '' live                              # → livestream-regie-live.png
```

`livestream-panorama-naht.jpg` ist ein Ausschnitt aus
`docs/bilder/live-panorama-einrichten.jpg` im App-Repo (echte Aufnahme des
Dialogs „Panorama einrichten“ an der künstlichen Testhalle der Entwicklung).
