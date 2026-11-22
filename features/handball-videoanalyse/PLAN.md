# Handball-Videoanalyse: SEO- und Demo-Plan

Stand: 22. November 2026. Ziel: Statix soll gefunden werden, wenn Trainer nach
„Handball-Videoanalyse“, „Videoanalyse Software/App“, „Videobesprechung“ oder
„Kamera für Handball“ suchen. Außerdem gibt es eine Demo mit echtem Spielvideo,
das rechtlich sauber zu Werbezwecken genutzt werden darf.

---

## 1. Was die Recherche ergeben hat

### Suchbegriffe (Google-Autocomplete, de-DE, 21.11.2026)

Echte Vorschläge, kein Keyword-Tool. Suchvolumen vor der Priorisierung in der
Search Console bzw. im Keyword-Planer prüfen.

| Cluster          | Begriffe aus dem Autocomplete                                                                                                          | Intention                     | Ziel-URL                                       |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ---------------------------------------------- |
| Head             | handball videoanalyse · videoanalyse handball · handball video analyse                                                                 | informativ + kommerziell      | `/handball-videoanalyse` (neu)                 |
| Software/App     | handball videoanalyse app · handball videoanalyse software · videoanalyse tool handball · videoanalyse sport app (kostenlos)           | kommerziell                   | `/handball-videoanalyse` (Checkliste + 3 Wege) |
| Kostenlos        | videoanalyse handball kostenlos                                                                                                        | kommerziell, preissensibel    | `/handball-videoanalyse` (Weg 1 + FAQ)         |
| Kamera           | handball kamera · kamera für handball · kamerasystem handball · automatische kamera handball · handball kamera ki · ai kamera handball | informativ / Kaufvorbereitung | `/ratgeber/handballspiel-filmen` (neu)         |
| Schneiden/Taggen | handball video schneiden · handball szenen taggen                                                                                      | transaktional nah             | `/funktionen/video-tagging`                    |
| Besprechung      | handball videobesprechung (kein Autocomplete → kleines Volumen)                                                                        | informativ                    | `/ratgeber/handball-videobesprechung` (neu)    |
| Spielanalyse     | handball spielanalyse (app, vorlage)                                                                                                   | informativ                    | `/ratgeber/handball-spielanalyse` (bestehend)  |

### Wettbewerb

Die Suchergebnisse werden von Profi- und Multisport-Anbietern geprägt
(Catapult, Dartfish, Hudl, Once, Spiideo) und von Store-Einträgen
(Handball.AI, THSA-X, videocoach+, LongoMatch). Eine deutschsprachige,
handballspezifische Ratgeberseite für Amateurtrainer, die Statistik und Video
zusammenbringt, gab es in den Treffern nicht. Diese Lücke füllt die neue
Themenseite.

---

## 2. Umgesetzt in diesem PR

- **Neue Themenseite `/handball-videoanalyse`** (5 Sprachen): Definition im
  ersten Absatz (für Featured Snippets und KI-Antworten), Ablauf in 5 Schritten,
  Checkliste „Was eine Videoanalyse-Software für Handball können muss“, drei
  Wege im Vergleich (kostenlos / allgemein / Handball-App), Screenshots, 8 FAQ
  und CTA zur Video-Beta.
  Schema: WebPage, BreadcrumbList, HowTo, ItemList und FAQPage, alles aus
  denselben Texten wie die sichtbare Seite.
- **Ratgeber `handballspiel-filmen`**: Kamera, Stativ, Position, KI-Kamera
  ja/nein, Einwilligung. Mit Entscheidungsmatrix und appBridge zum Video-Tagging.
- **Ratgeber `handball-videobesprechung`**: Ablauf von 20 Minuten als
  Zeitleiste, Bausteine einer Besprechung, appBridge zur Video-Besprechung.
- **Gegen Kannibalisierung**: `/funktionen/video-tagging` trägt im Titel jetzt
  „Video-Tagging“ statt des Head-Keywords; das Head-Keyword gehört der
  Themenseite.
- **Interne Verlinkung**: Footer und mobiles Menü (Ressourcen), „Kostenlos
  dazu“ auf den Funktionsseiten Video-Tagging, Video-Besprechung und
  Livestream, die Artikel Spielanalyse und Livestream, Sitemap, `SITE_LINKS`
  und `llms.txt`.
- **Video-Anfrage**: Quelle `videoanalyse`, damit die Benachrichtigungsmail
  zeigt, dass eine Anfrage von der Themenseite kommt.

---

## 3. Demo-Video: woher, was erlaubt ist, wie umsetzen

### Kernproblem

Die Screenshots der Video-Funktionen laufen heute über eine **gezeichnete Halle**
(`scripts/screenshots/besprechung/`), weil kein echtes Spielvideo vorhanden ist.
Für Vertrauen und Konversion braucht die Seite ein **echtes Hallenvideo**.
Frei lizenziertes Handball-Material ist selten: Pexels, Pixabay, Mixkit und
Coverr haben keine passenden Clips, Getty und Pond5 verkaufen nur kurze
Ausschnitte für viel Geld. Für eine Analyse-Demo braucht man aber ein
**ganzes Spiel aus Tribünenperspektive**.

### Option A: komplettes Spiel unter CC BY 3.0 (sofort nutzbar)

**„Mrk Krka–Slovan (prijateljska tekma)“** auf Wikimedia Commons

- 62,5 Minuten, 1280×720, Freundschaftsspiel (Herren), Slowenien, 11.08.2013
- Lizenz **CC BY 3.0**, Urheber **Blaž Boltez**; ursprünglich auf YouTube
  unter CC BY veröffentlicht, Lizenzprüfung auf Commons am 08.02.2019
- Perspektive: Tribüne auf Höhe der Mittellinie, geschwenkt, Anzeigetafel
  sichtbar. Das entspricht genau dem typischen Vereinsvideo, also dem, was
  Zielkunden selbst filmen würden.
- Datei: https://commons.wikimedia.org/wiki/File:Mrk_Krka-Slovan_(prijateljska_tekma).webm (~985 MB)

**Was CC BY 3.0 erlaubt:** kommerzielle Nutzung, Bearbeitung (schneiden,
Overlay, Tags), auch in Werbung. **Pflicht:** Namensnennung mit Link zur
Lizenz und Hinweis auf Änderungen, z. B.:

> Spielvideo: Blaž Boltez, „Mrk Krka-Slovan (prijateljska tekma)“,
> CC BY 3.0 (creativecommons.org/licenses/by/3.0), via Wikimedia Commons;
> geschnitten und mit Statix-Einblendungen versehen.

**Was CC BY nicht abdeckt:** die **Persönlichkeitsrechte** der abgebildeten
Spieler und Zuschauer und **Markenrechte** an den Sponsorenbannern. Deshalb:

- Für die **In-App-Demo und Produkt-Screenshots** (Software bei der Arbeit)
  ist das Video gut geeignet. Zuschauerköpfe im Vordergrund wegschneiden oder
  weichzeichnen.
- Für **bezahlte Anzeigen** (Meta, Google, YouTube-Ads), in denen einzelne
  Spieler groß zu sehen sind: lieber Option B nehmen. Werbung ist bei § 23 KUG
  der heikle Fall.
- Nie den Eindruck erwecken, KK Krka oder Slovan würden Statix nutzen oder
  empfehlen. Sponsorenlogos nicht in den Mittelpunkt stellen.
- Optional und empfehlenswert: Blaž Boltez kurz anschreiben (über den
  YouTube-Kanal) und um die Originaldatei bitten. Das bringt bessere Qualität
  und eine schriftliche Bestätigung.

Weitere Treffer auf Commons, alle schwächer:

| Video                                                 | Länge             | Lizenz       | Bewertung                                                |
| ----------------------------------------------------- | ----------------- | ------------ | -------------------------------------------------------- |
| Rokometna tekma Slovenija–Romunija, 2012 (HANDBALLSI) | 6,4 Min., 960×720 | CC BY 3.0    | Zusammenschnitt Nationalteam, gut für kurze Clips        |
| Bosna – Lokomotiva Brčko, Visoko 2018                 | 24 s, 1080p       | CC BY-SA 4.0 | zu kurz; Share-Alike vererbt die Lizenz an Bearbeitungen |
| Championnat de France U18 féminin, 2017               | 26 s, 1080p       | CC0          | **Minderjährige**, für Werbung meiden                    |
| Russian Superliga CSKA–Ufa-Alisa, 2021                | 11 s, 1080p       | CC BY-SA 4.0 | nur Torszenen, Share-Alike                               |
| Beach handball Euro 2019                              | ~1–2 Min.         | CC BY-SA 3.0 | andere Disziplin                                         |

### Option B: eigenes Spiel filmen (beste Lösung für Werbung)

1. Ein **Herren- oder Damenteam** (keine Minderjährigen) aus dem eigenen
   Umfeld fragen, idealerweise mit Tribüne. Angebot: ein Jahr Video Team
   kostenlos.
2. **Eigene Einwilligung für Statix einholen.** Die Vorlage
   `public/vorlagen/einwilligung-video.html` deckt nur die Nutzung durch den
   **Verein** ab (interne Auswertung, Szenen, Livestream), **nicht** Werbung
   oder Demos durch Statix. Für die Demo braucht es eine separate Erklärung
   jeder Person im Bild plus Zustimmung des Vereins und des Gegners: Zweck
   „Produktdemo und Werbung für Statix“, Medien (Website, Social Media,
   Anzeigen), Dauer, Widerruf. Rechtlich prüfen lassen.
3. Aufbau wie im Artikel `handballspiel-filmen`: zwei Handys an der
   Mittellinie, so hoch wie möglich, gleichzeitig live erfassen. Dann sind
   Panorama, Sprungmarken, Overlay und Livestream-Aufzeichnung mit echtem
   Material zeigbar.
4. Hallenmusik ausschalten oder den Ton ersetzen (GEMA).

### Option C: weiteres CC-Material auf YouTube finden

YouTube → Suche („handball full match“, „Handball Spiel komplett“, „rukomet
utakmica“, „rokomet tekma“, „piłka ręczna mecz“) → Filter → **Creative
Commons**. Die Lizenz unter dem Video prüfen, einen Screenshot davon
archivieren und die Datei über den Urheber oder Wikimedia Commons
(video2commons) beziehen statt per Downloader.

### Option D: Partnerverein, der schon streamt

Vereine, die Spiele aufzeichnen, gegen Freischaltung um Nutzungsrechte bitten.
Achtung: Streams auf Plattformen wie sportdeutschland.tv sind
rechtegebunden, also nur mit schriftlicher Zustimmung des Vereins **und** der
Plattform nutzen.

### Umsetzung der Demo (Reihenfolge)

1. Krka-Video in ein Demo-Konto laden, Spielprotokoll aus dem Video erstellen
   (die Funktion gibt es für Spiele ohne Protokoll), etwa 150 Szenen taggen,
   3–4 Playlists anlegen (z. B. „Gegenstöße“, „Würfe Rückraum“, „Paraden“),
   eine Besprechung mit Stimme aufnehmen und einen Clip „an einen Spieler“
   senden.
2. **Screenshot-Pipeline neu laufen lassen** mit echtem Bild statt
   gezeichneter Halle. Die Captions auf den Funktionsseiten und
   `/handball-videoanalyse` entsprechend anpassen, Namensnennung in die
   Bildunterschrift.
3. **60–90-Sekunden-Produktvideo** („Vom Spielvideo zur Besprechung“) für
   `/handball-videoanalyse` und YouTube. Danach `VideoObject`-Schema auf der
   Themenseite ergänzen; ein eigenes YouTube-Video rankt zusätzlich in der
   Video-Suche für „handball videoanalyse“.
4. **Video-Spiel in die Live-Demo ohne Account aufnehmen** (nur lesend). Eine
   „Videoanalyse-Demo ohne Account“ ist für Trainer, die die Beta noch nicht
   bekommen, der stärkste Einstieg und eine eigene CTA auf der Themenseite
   wert.

---

## 4. Content-Plan (12 Wochen)

| Woche | Inhalt                                                                             | Ziel-Keyword                                                 | Format                                          |
| ----- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------- |
| 1     | ✅ Themenseite + 2 Artikel (dieser PR)                                             | handball videoanalyse, kamera für handball, videobesprechung | Pillar + Ratgeber                               |
| 2     | Demo-Konto + echte Screenshots (Option A)                                          | –                                                            | Produkt                                         |
| 3     | Produktvideo + `VideoObject`                                                       | handball videoanalyse                                        | Video                                           |
| 4     | Gegner-Scouting per Video                                                          | handball gegneranalyse video                                 | Ratgeber (`rezept`)                             |
| 5     | Torwart-Videoanalyse                                                               | torwart videoanalyse handball                                | Ratgeber (`kennzahl`)                           |
| 6     | Handball-Video schneiden: Szenen für Spieler                                       | handball video schneiden                                     | Ratgeber                                        |
| 7     | Videoanalyse im Jugendhandball (Einwilligung, Dauer, Ton)                          | videoanalyse jugend handball                                 | Ratgeber                                        |
| 8     | KI-Kamera für Handball: worauf achten                                              | handball kamera ki, automatische kamera handball             | Ratgeber (`entscheidung`), ohne Markenvergleich |
| 9     | Trainingseinheiten filmen und auswerten                                            | handball training filmen                                     | Ratgeber                                        |
| 10–12 | Search-Console-Auswertung, Titel nachschärfen, FAQ um echte Suchanfragen erweitern | –                                                            | Pflege                                          |

Erst wenn die Video-Funktionen buchbar sind:
**„Handball-Videoanalyse-Software im Vergleich“**. Diese Seite hat die höchste
Kaufabsicht, braucht aber faire und belegte Angaben zu anderen Anbietern.

### Reichweite außerhalb der eigenen Seite

- Kostenloses **Webinar „Videoanalyse im Amateurhandball“** für Landesverbände
  bzw. Trainerlehrgänge (C-Lizenz-Fortbildung). Das bringt Backlinks von
  Verbandsseiten.
- Gastbeiträge und Erwähnungen bei Handball-Trainerportalen und in
  Trainer-Gruppen (Facebook, WhatsApp-Communities).
- Den YouTube-Kanal mit kurzen Anleitungen („Kamera richtig aufstellen“,
  „Szene in 10 s an Spieler schicken“) füllen; die Videos werden in den
  Artikeln eingebettet.

### Messen

- Search Console: Impressionen, Position und CTR für die Begriffe aus der
  Tabelle oben; die URL `/handball-videoanalyse` beobachten.
- Anfragen über `/video-anfrage?von=videoanalyse` (Quelle in der Mail).
- PostHog: Klicks auf „Zugang zur Video-Beta anfragen“ auf der Themenseite.

---

## Quellen

- Wikimedia Commons, Datei- und Lizenzseiten der genannten Videos (API-Abfrage
  vom 21.11.2026), u. a.
  https://commons.wikimedia.org/wiki/File:Mrk_Krka-Slovan_(prijateljska_tekma).webm
- Lizenztext CC BY 3.0: https://creativecommons.org/licenses/by/3.0/deed.de
- Bildrechte im Verein (LSB/VIBSS): https://www.vibss.de/vereinsmanagement/recht/datenschutz-internet/datenschutz/bildrechte-und-videoueberwachung
- DFB-Positionspapier Foto- und Videoaufnahmen: https://www.wuerttfv.de/app/uploads/2024/03/DFB-Positionspapier-Foto-und-Videoaufnahmen.pdf
- Anbieter: https://www.catapult.com/sports/handball · https://once.sport/handball-video-analysis/ · https://www.dartfish.com/handball-guide-website-en/
- Store-Einträge: https://apps.apple.com/de/app/handball-ai/id1603618186 · https://apps.apple.com/de/app/videocoach/id1603129956
