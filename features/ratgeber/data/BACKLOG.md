# Ratgeber-Backlog: Trainer-Intent

Redaktionsplan für die nächsten zwölf Inhalte. Kein Code, keine Artikel – nur
Briefs. Jeder Brief ist so geschrieben, dass er ohne Rückfragen umgesetzt werden
kann.

## Warum dieser Plan existiert

Stand heute (70 Artikel):

| Kategorie | Artikel |
| --- | --- |
| Training & Planung | 16 |
| Technik & Wurf | 15 |
| Taktik & Abwehr | 14 |
| Grundlagen & Regeln | 9 |
| Statistik & Kennzahlen | 6 |
| Mannschaft & Mentales | 5 |
| Jugend & Entwicklung | 4 |
| Spielanalyse | 1 |

Sieben von 70 Artikeln (10 %) sprechen den Menschen an, der die App am Ende
bezahlt: den Trainer. Die anderen 63 erklären einem Spieler, wie er einen
Kempa-Trick lernt. Das ist gute Reichweite und schlechte Nachfrage – niemand,
der „Kempa-Trick lernen" googelt, kauft danach eine Statistik-App für seinen
Verein.

Dieser Backlog dreht das Verhältnis nicht um, aber er verschiebt es: sechs neue
Artikel, drei kommerzielle Seiten, drei Erweiterungen bestehender Artikel. Nach
Umsetzung liegt der Trainer-Anteil bei rund 17 % der Bibliothek – und, wichtiger,
es gibt zum ersten Mal Artikel, die auf eine Geldseite zeigen statt ins Leere.

**Ab jetzt keine Spieler-Technikartikel mehr.** Die Stop-Liste steht am Ende.

## Wie die Briefs zu lesen sind

Jeder Brief hat ein **Format**. Drei Werte:

- **Artikel** – neuer Eintrag unter `features/ratgeber/data/articles/`, läuft
  über den bestehenden `Article`-Typ, die Registrierung in `articles.ts` und
  damit automatisch in Hub, Sitemap, `llms.txt` und Cross-Links.
- **Commercial Page** – eigene Route unter `app/<route>/page.tsx` als dünne
  Hülle, UI in `features/<feature>/pages/` + `components/`, Copy in
  `features/<feature>/data/`. Kein Ratgeber-Artikel, keine BlogPosting-Auszeichnung.
- **Erweiterung** – kein neuer URL. Ein bestehender Artikel bekommt Kapitel
  dazu, ein neues `dateModified` und geschärfte Keywords. Bewusst so gewählt:
  wo bereits ein Artikel rankt, ist ein zweiter URL Kannibalisierung, kein
  Zuwachs.

Zur Nachfrage-Einschätzung: Die Angaben **schmal / mittel / breit** sind eine
redaktionelle Einschätzung aus der Nische, **keine Zahlen aus einem
Keyword-Tool**. Vor der Umsetzung gegen echte Daten prüfen, falls verfügbar.

## Regeln, die für jeden Brief gelten

**Titel.** Das Root-Layout hängt ` | Statix` an (9 Zeichen). Die Vorgabe
„Titel ≤ 60 Zeichen" heißt deshalb: **`metaTitle` ≤ 51 Zeichen.** Alle unten
vorgeschlagenen `metaTitle` sind ausgezählt und halten das ein. Der sichtbare
H1 (`title`) darf länger sein – die bestehenden Artikel machen das auch so.
`absoluteTitle: true` nur, wenn „Statix" schon im Titel steht.

**Meta-Description.** 150–160 Zeichen, wie im `Article`-Typ dokumentiert. Die
Vorschläge unten liegen in dem Fenster.

**Schema.** Artikel: `ArticleSchema` (BlogPosting + BreadcrumbList, plus
FAQPage wenn `faqs` gesetzt sind) – passiert automatisch, nichts zu tun.
Commercial Pages: `PageSchema` (`WebPage` + BreadcrumbList) aus
`components/seo/page-schema.tsx`; eine FAQ auf einer Commercial Page wird als
separates `JsonLdScript` mit `FAQPage` ausgegeben, genau wie in
`app/was-ist-statix/page.tsx`. Sichtbarer FAQ-Text und Schema-Text müssen
wortgleich sein.

**Verboten in jedem Schema und in jeder Copy:** `AggregateRating`, `Review`,
`offers.price`, Nutzerzahlen, Vereinszahlen, Testimonials. Es gibt dafür keine
belegten Werte – Preise sind laut `PRODUCT.md` bewusst noch nicht öffentlich.
Erfundene Bewertungs-Auszeichnung ist ein Manual-Action-Risiko, ein erfundener
Preis ein rechtliches. Belegt und damit erlaubt: „kostenlos starten, ohne
Kreditkarte", „Live-Demo ohne Account", „offline in der Halle", „aus Deutschland".

**Ton.** Wie auf der Startseite und im bestehenden Ratgeber: du-Ansprache,
Trainer zu Trainer, kurze Sätze, konkrete Zahlenbeispiele. Kein „revolutionär",
kein „game-changer", keine Superlative über das eigene Produkt.

## Verifizierte Link-Ziele

Diese Routen existieren heute:

`/` · `/was-ist-statix` · `/ratgeber` · `/ratgeber/<slug>` (70 Slugs) ·
`/newsletter` · `/impressum` · `/agb`

Die Demo liegt extern unter `CLUB_CONFIG.website.demoUrl`
(`lib/club-config.ts`). **Nie hart verdrahten** – immer aus der Config lesen.
Beachten: PR #35 verschiebt das Konversionsziel auf eine andere Subdomain; vor
der Umsetzung prüfen, welcher Wert dann aktuell ist.

Diese drei Ziele existieren **noch nicht** – sie werden von diesem Backlog
selbst definiert (Briefs 4, 6, 9):

`/handball-statistik-jugend` · `/handball-spielbericht` · `/handball-wurfbild`

> Falls aus früheren Phasen bereits Geldseiten mit anderen Slugs existieren:
> die Link-Ziele in den Briefs entsprechend umbiegen, bevor geschrieben wird.
> Die Slugs unten sind Vorschläge, keine Fakten.

## Priorisierung

| # | Prio | Thema | Format | Zielkeyword | Aufwand |
| --- | --- | --- | --- | --- | --- |
| 4 | P1 | 5 Kennzahlen für Jugendtrainer | Commercial Page | handball statistik app jugend | L |
| 9 | P1 | Wurfbild sagt: Angriff ändern | Commercial Page | wurfbild handball | M |
| 1 | P1 | Gegner aus einer Aufzeichnung scouten | Artikel | gegneranalyse handball | M |
| 8 | P2 | Torwart jenseits der Paradenquote | Erweiterung | torwart statistik handball | S |
| 7 | P2 | Abwehrsystem aus eigenen Daten | Artikel | welches abwehrsystem handball | M |
| 6 | P2 | Spielbericht für den Vorstand | Commercial Page | handball spielbericht schreiben | M |
| 12 | P3 | Gegen sich selbst vergleichen | Artikel | handball saisonauswertung | M |
| 2 | P3 | 60 Sekunden Auszeit mit Zahlen | Erweiterung | handball auszeit ansprache | S |
| 10 | P3 | Statistik im Training | Artikel | handball training auswerten | M |
| 5 | P3 | Entwicklung über die Saison | Erweiterung | spielerentwicklung handball saison | S |
| 11 | P4 | Die ersten 10 Minuten | Artikel | handball anfangsphase | M |
| 3 | P4 | Zahlen vor der Mannschaft | Artikel | spielauswertung mit mannschaft | M |

Begründung der Reihenfolge: zuerst die beiden Geldseiten mit klarer
Werkzeug-Absicht (4, 9), dann der Artikel mit der breitesten Trainer-Nachfrage,
der auf beide zeigt (1). Danach billige Hebel auf bestehenden Assets (8) und
der Artikel, der fünf verwaiste Taktik-Artikel endlich an eine Geldseite
anschließt (7). P4 sind Inhalte mit dünner Nachfrage, die trotzdem in den Plan
gehören: Sie beantworten Fragen, die kein Wettbewerber beantwortet, und sind
verlinkbar.

---

# Brief 1 — Gegner aus einer einzigen Aufzeichnung scouten

**Format: Artikel** · Slug `handball-gegner-scouten` · Kategorie `Spielanalyse`
· Prio P1

**Zielkeyword:** `gegneranalyse handball`
**Neben-Keywords:** `handball gegner analysieren`, `gegner scouten handball`,
`handball scouting`, `scouting bogen handball`, `handball gegner beobachten`

**Suchintention:** Informational mit Werkzeug-Anschluss. Nachfrage: mittel –
für Trainerthemen die breiteste, die es in der Nische gibt. Wer so sucht, hat
Samstag ein Spiel und heute Abend zwei Stunden Zeit.

**Kannibalisierung – vorher lesen:** `handball-spielanalyse` führt
`handball gegneranalyse` und `handball scouting` heute in den Keywords und
behandelt Scouting in einem H2. Beim Anlegen dieses Artikels: aus
`handball-spielanalyse` die Scouting-Keywords entfernen, den H2 dort auf drei
Sätze kürzen und mit einem Textlink hierher auflösen. Der bestehende Artikel
bleibt die Übersicht, dieser wird die Tiefenseite.

**metaTitle (40):** `Gegneranalyse Handball: ein Spiel reicht`
**H1:** Gegneranalyse im Handball: was du aus einer einzigen Spielaufzeichnung
wirklich herausholst

**Meta-Description (160):**
Gegneranalyse im Handball mit nur einer Spielaufzeichnung: In 90 Minuten zu
drei Erkenntnissen, die deine Mannschaft am Samstag auch umsetzen kann – mit
Ablauf.

**Gliederung:**

- H2 Warum ein Spiel reicht – und fünf zu viel sind
  - H3 Was du aus einem Spiel sicher ablesen kannst
  - H3 Was Zufall ist und dich in die Irre führt
- H2 Der 90-Minuten-Ablauf
  - H3 Durchgang 1: nur Abschlüsse (30 Minuten)
  - H3 Durchgang 2: nur die zwei Hauptschützen (30 Minuten)
  - H3 Durchgang 3: Abwehrverhalten und Umschaltmoment (30 Minuten)
- H2 Was du erfassen musst – und was du weglässt
  - H3 Die sechs Felder, die reichen
  - H3 Warum Ballverluste des Gegners die schlechteste Investition sind
- H2 Von Notizen zu drei Sätzen für die Kabine
- H2 Der Siebenmeter-Zettel für den Torwart
- H2 Wenn du kein Video hast: live von der Tribüne scouten
- H2 Was du nach dem Spiel prüfst: hat das Scouting gestimmt?

**Interne Links – rein:**
`handball-spielanalyse`, `handball-abwehrsysteme`, `handball-timeout-nutzen`,
`handball-statistik-fuehren` (jeweils ein Textlink im Fließtext)

**Interne Links – raus:**
`/handball-wurfbild` (aus H2 „Von Notizen zu drei Sätzen"),
`/ratgeber/handball-siebenmeter-halten` (Torwart-Zettel),
`/ratgeber/handball-abwehrsystem-entscheiden` (Brief 7),
`/was-ist-statix` im Schlussabschnitt

**relatedSlugs:** `handball-spielanalyse`, `handball-abwehrsysteme`,
`handball-torwart-statistik`

**Schema:** BlogPosting + BreadcrumbList + FAQPage (4 FAQs) – automatisch über
`ArticleSchema`. **imagePath:** `/shotMaps.png`

**Der Winkel, den nur ein Trainer schreiben kann:**
Jeder Artikel im Netz sagt „analysiere den Gegner". Keiner sagt, dass du beim
ersten Durchlauf **nichts** notieren sollst außer Abschlüssen – weil man sonst
nach zwanzig Minuten drei Seiten voll hat und am Samstag nichts davon abrufbar
ist. Und keiner sagt den unbequemen Teil: Der Gegner spielt gegen dich anders
als gegen den Tabellenletzten, den du auf dem Video gesehen hast. Der Artikel
soll ehrlich benennen, welche drei Dinge trotzdem stabil bleiben
(Siebenmeterschütze, Abwehrgrundordnung, Tempo-Präferenz) und welche nicht.
Dazu die Regel, die in keinem Leitfaden steht: Mehr als drei Erkenntnisse an
die Mannschaft weiterzugeben, macht sie langsamer, nicht besser.

---

# Brief 2 — Was du in 60 Sekunden Auszeit sagst, mit Zahlen

**Format: Erweiterung** von `handball-timeout-nutzen` · Prio P3

**Warum kein neuer Artikel:** `handball-timeout-nutzen` deckt das Thema mit
„Was du in 60 Sekunden ansprichst" und „Entscheidungen auf Datenbasis treffen"
bereits an – beides je fünf Zeilen. Ein zweiter URL zu
`handball auszeit ansprache` würde gegen den eigenen, bereits indexierten
Artikel antreten. Nachfrage für die Ansprache-Keywords: schmal. Ein starker URL
schlägt hier zwei schwache.

**Zielkeyword (neu aufzunehmen):** `handball auszeit ansprache`
**Neben-Keywords:** `timeout ansprache handball`, `was sagt man in der auszeit
handball`, `handball auszeit taktik`

**Titel:** `metaTitle` bleibt `Team-Timeout im Handball nutzen` (31). Nicht
anfassen – der Artikel rankt auf das Regelthema, das soll er weiter tun.

**Meta-Description:** neu fassen, damit die Ansprache mit drinsteht, weiter
150–160 Zeichen. Vorschlag (154):
Team-Timeout im Handball: Regeln, der richtige Moment und was du in den 60
Sekunden wirklich sagst – ein Aufbau aus drei Sätzen, gestützt auf drei Zahlen.

**Was dazukommt:**

- H2 Die drei Zahlen, auf die du vor der Auszeit schaust (neu, direkt vor
  „Was du in 60 Sekunden ansprichst")
  - H3 Torfolge der letzten fünf Minuten
  - H3 Abschlüsse ohne Torerfolg in Serie
  - H3 Woher die Gegentore kamen – Zone, nicht Gefühl
- H2 Was du in 60 Sekunden ansprichst (bestehend, ausbauen)
  - H3 Satz 1: der Zustandssatz
  - H3 Satz 2: der eine Auftrag
  - H3 Satz 3: wer ihn ausführt – namentlich
  - H3 Drei Beispiel-Ansprachen im Wortlaut (neu)
- H2 Zahlen ansagen, ohne dass es nach Vorlesung klingt (neu)
- H2 Nach dem Spiel prüfen: hat die Auszeit gewirkt? (neu, ersetzt Teile des
  bestehenden Datenabschnitts)

`dateModified` hochsetzen, `readingTimeMinutes` anpassen, zwei FAQs ergänzen
(„Was sagt man in einer Handball-Auszeit?", „Soll man in der Auszeit Zahlen
nennen?").

**Interne Links – raus (neu zu setzen):**
`/ratgeber/handball-gegner-scouten` (Brief 1), `/handball-wurfbild` (Brief 9)
aus dem Abschnitt „Woher die Gegentore kamen", `/ratgeber/handball-erste-10-minuten`
(Brief 11)

**Schema:** unverändert – BlogPosting + FAQPage über `ArticleSchema`.

**Der Winkel, den nur ein Trainer schreiben kann:**
Drei Ansprachen im Wortlaut, wie man sie wirklich sagt – nicht „kommuniziere
klar". Also: „Wir haben vier Angriffe hintereinander von außen abgeschlossen
und keiner ist drin. Nächster Ball geht über den Kreis. Jonas, du ziehst zuerst."
Dazu die Wahrheit, die kein Ratgeber ausspricht: In der Auszeit nennst du
höchstens **eine** Zahl, und nie eine Prozentzahl – „viermal hintereinander"
versteht eine Mannschaft mit Puls 180, „38 Prozent Wurfquote" nicht.
Prozentwerte gehören in die Kabine nach dem Spiel, nicht an die Tafel.

---

# Brief 3 — Zahlen vor der Mannschaft präsentieren, ohne sie zu verlieren

**Format: Artikel** · Slug `handball-statistik-mannschaft-besprechen` ·
Kategorie `Spielanalyse` · Prio P4

**Zielkeyword:** `spielauswertung mit mannschaft besprechen`
**Neben-Keywords:** `handball spielauswertung besprechung`,
`mannschaftsbesprechung handball`, `handball statistik spielern zeigen`,
`feedback handball mannschaft`

**Suchintention:** Informational, Problemlösung. Nachfrage: schmal – deshalb
P4. Der Wert liegt nicht im Traffic, sondern darin, dass die Seite eine Frage
beantwortet, die jeder Trainer hat und niemand online behandelt. Guter Kandidat
für Verlinkung aus Trainerforen und Verbands-Newslettern.

**metaTitle (45):** `Statistik der Mannschaft richtig präsentieren`
**H1:** Statistiken vor der Mannschaft präsentieren, ohne den Raum zu verlieren

**Meta-Description (152):**
Spielauswertung mit der Mannschaft besprechen: welche Zahlen vor die Gruppe
gehören, welche ins Einzelgespräch – und wie du in zehn Minuten fertig bist.

**Gliederung:**

- H2 Die Grundregel: Teamzahlen vor die Gruppe, Spielerzahlen ins Gespräch
- H2 Der Zehn-Minuten-Aufbau
  - H3 Zwei Minuten: was gut war, mit Beleg
  - H3 Fünf Minuten: die eine Baustelle
  - H3 Drei Minuten: was wir Dienstag deshalb trainieren
- H2 Drei Zahlen sind das Maximum
- H2 Welche Zahlen niemals vor die Gruppe gehören
  - H3 Individuelle Fehlerquoten
  - H3 Torwart-Gegentorzahlen ohne Zonen
  - H3 Einsatzzeiten
- H2 Wenn die Zahl einen einzelnen Spieler bloßstellt
- H2 Jugend: ab welchem Alter Zahlen überhaupt sinnvoll sind
- H2 Was du im Raum ablesen kannst: die Besprechung selbst auswerten

**Interne Links – rein:**
`handball-spielerentwicklung-messen`, `handball-mannschaft-motivieren`,
`handball-kommunikation-spielfeld`, `jugendhandball-trainieren`

**Interne Links – raus:**
`/ratgeber/handball-statistik-fuehren`, `/handball-statistik-jugend` (Brief 4,
aus dem Jugend-H2), `/handball-wurfbild` (Brief 9 – das Wurfbild ist das eine
Bild, das eine Mannschaft ohne Erklärung versteht)

**relatedSlugs:** `handball-spielerentwicklung-messen`,
`handball-mannschaft-motivieren`, `handball-spielanalyse`

**Schema:** BlogPosting + BreadcrumbList + FAQPage (3 FAQs).
**imagePath:** `/statsTableInGame.png`

**Der Winkel, den nur ein Trainer schreiben kann:**
Die Erfahrung, dass eine Mannschaft nach der zweiten Folie abschaltet und dass
der Spieler mit der schlechtesten Quote die Besprechung als Bestrafung erlebt,
egal wie freundlich man formuliert. Daraus die harte Regel: Vor der Gruppe gibt
es nur Zahlen, die **niemand einzelnem** zuzuordnen sind – Teamwurfquote,
Ballverluste gesamt, Gegentore nach Zone. Alles, wo ein Name drübersteht, ist
ein Vieraugengespräch. Dazu der Punkt, den kein Coaching-Ratgeber macht: Die
beste Auswertung endet nicht mit einer Erkenntnis, sondern mit einem
Trainingstermin. „Wir waren schlecht im Rückraum" ohne „deshalb machen wir
Dienstag 20 Minuten Wurf gegen Block" ist verlorene Zeit.

---

# Brief 4 — Statistik für Jugendtrainer: die fünf Kennzahlen

**Format: Commercial Page** · Route `/handball-statistik-jugend` ·
Feature `features/handball-statistik-jugend/` · Prio P1

**Warum Geldseite und nicht Artikel:** „Welche fünf Kennzahlen soll ich
tracken" ist keine Wissensfrage, sondern eine Werkzeugfrage – wer das sucht,
hat sich schon entschieden zu messen und sucht das Womit. Jugendtrainer sind
zugleich die größte und am schlechtesten bediente Trainergruppe im deutschen
Handball. Es gibt heute keine einzige Seite auf `statix-app.de`, die dieses
Segment anspricht. Die Seite trägt beides: die redaktionelle Antwort (fünf
Kennzahlen, plus die, die man weglässt) **und** den Produktbeweis.

**Zielkeyword:** `handball statistik app jugend`
**Neben-Keywords:** `statistik jugendhandball`, `handball statistik c jugend`,
`welche statistik jugendhandball`, `handball app jugendtrainer`,
`jugendhandball auswertung`

**Suchintention:** Kommerziell. Nachfrage: schmal bis mittel, aber die
Kaufabsicht pro Suche ist die höchste in diesem ganzen Backlog.

**metaTitle (36):** `Handball-Statistik für Jugendtrainer`
**H1:** Handball-Statistik im Jugendbereich: fünf Kennzahlen, die reichen

**Meta-Description (154):**
Handball-Statistik im Jugendbereich: die fünf Kennzahlen, die Entwicklung
zeigen – und die, die du weglässt. Live per Tap erfasst, kostenlos ohne
Account.

**Gliederung:**

- H2 Fünf Kennzahlen reichen im Jugendhandball
  - H3 Wurfquote nach Position
  - H3 Technische Fehler
  - H3 Ballgewinne
  - H3 Einsatzzeit
  - H3 Wurfbild – wo geworfen wurde, nicht nur ob es drin war
- H2 Was du im Jugendbereich bewusst nicht misst
  - H3 Plus-Minus
  - H3 Zweikampfquote
  - H3 Alles, was einen Zehnjährigen zur Zahl macht
- H2 Warum Einsatzzeit die wichtigste Zahl im Nachwuchs ist
- H2 So sieht das in Statix aus (Produktabschnitt, echte Screenshots)
  - H3 Erfassen: ein Tap pro Aktion, offline in der Halle
  - H3 Auswerten: Verläufe über die Saison statt Momentaufnahmen
  - H3 Teilen: was Eltern sehen dürfen und was nicht
- H2 Datenschutz: Statistik über Minderjährige
- H2 In zehn Minuten zum ersten erfassten Jugendspiel
- H2 Häufige Fragen (FAQ, sichtbar + FAQPage-Schema)

**Interne Links – rein (jeweils ein kontextueller Textlink im Fließtext,
nicht als Linkliste am Ende):**
`jugendhandball-trainieren`, `handball-minihandball-kinder`,
`handball-trainer-werden`, `handball-spielerentwicklung-messen`,
`handball-statistik-fuehren`, `handball-training-planen`

**Interne Links – raus:**
`/was-ist-statix`, `/ratgeber/handball-spielerentwicklung-messen`,
`/ratgeber/handball-statistik-fuehren`, `/handball-wurfbild`,
`/ratgeber` (Hub), Demo-Link aus `CLUB_CONFIG.website.demoUrl`

**Schema:**
`PageSchema` mit `type="WebPage"`, `path="/handball-statistik-jugend"`,
`imagePath="/statsTableInGame.png"`, Breadcrumbs
`[{ name: 'Startseite', path: '/' }, { name: 'Statistik für Jugendtrainer',
path: '/handball-statistik-jugend' }]`.
Zusätzlich ein `JsonLdScript` mit `FAQPage` nach dem Muster aus
`app/was-ist-statix/page.tsx` – Fragen wortgleich mit dem sichtbaren
Accordion.
**Kein** `SoftwareApplication` auf dieser Seite: das steht bereits im
`@graph` der Startseite, eine zweite Instanz ohne eigene `offers` bringt
nichts. **Kein** `offers`, **kein** `AggregateRating`.

**Komponenten:** Server Component. Kein `framer-motion`, kein `gsap`.
Metadaten über `createPageMetadata()`. Screenshots aus `/public`
(`statsTableInGame.png`, `recordStatsInGame.png`, `teamManagement.png`).
Zur Sitemap: Eintrag in `app/sitemap.ts` ergänzen, `priority: 0.8`,
`changeFrequency: 'monthly'`.

**Der Winkel, den nur ein Trainer schreiben kann:**
Der Mut, Kennzahlen **abzuraten**. Jede Statistik-Seite im Netz listet auf, was
alles geht; diese sagt einem D-Jugend-Trainer, dass Plus-Minus bei zwölf
Feldspielern mit rotierenden Einsatzzeiten reines Rauschen ist und dass die
Zweikampfquote bei Kindern mehr über die Körpergröße aussagt als über die
Entwicklung. Und der Satz, der die Seite trägt: Im Nachwuchs ist die wichtigste
Zahl nicht die Wurfquote, sondern die **Einsatzzeit** – weil sie die einzige
ist, die der Trainer selbst zu 100 % steuert, und weil ein Elterngespräch über
Spielzeit ohne Zahlen immer verliert. Dazu die Datenschutzfrage ehrlich
behandeln, statt sie zu umgehen: Was darf über einen Zwölfjährigen erfasst und
mit wem geteilt werden.

---

# Brief 5 — Entwicklung über eine ganze Saison verfolgen

**Format: Erweiterung** von `handball-spielerentwicklung-messen` · Prio P3

**Warum kein neuer Artikel:** Der bestehende Artikel behandelt bereits „Was du
messen kannst", „Entwicklungsziele richtig setzen", „Den Verlauf
dokumentieren" und „Feedbackgespräche mit Daten führen". Ein neuer URL zu
„Spielerentwicklung über die Saison" wäre derselbe Artikel mit anderem Titel.
Die Lücke ist nicht das Thema, sondern die **Zeitachse**: Der Artikel erklärt
das Messen, nicht den Saisonrhythmus.

**Zielkeywords (neu aufzunehmen):** `spielerentwicklung handball saison`,
`entwicklungsgespräch handball`, `handball saisongespräch spieler`

**Titel:** `metaTitle` bleibt `Spielerentwicklung im Handball messen & fördern`
(47). Unverändert lassen.

**Was dazukommt:**

- H2 Der Saisonrhythmus: vier Zeitpunkte, die reichen (neu, nach „Den Verlauf
  dokumentieren")
  - H3 Vorbereitung: Ausgangswerte festhalten
  - H3 Nach Spiel 5: erste belastbare Tendenz
  - H3 Winterpause: das Halbzeitgespräch
  - H3 Saisonende: Bilanz und Ziel für die nächste Runde
- H2 Warum acht Spiele die Untergrenze sind (neu)
- H2 Wenn ein Spieler stagniert – und wann das normal ist (neu)
- H2 Das Halbzeitgespräch: Aufbau und Gesprächsleitfaden (neu)
- H2 Positionswechsel aus Daten begründen (neu)

`dateModified` hochsetzen, `readingTimeMinutes` anpassen, zwei FAQs ergänzen.

**Interne Links – raus (neu zu setzen):**
`/handball-statistik-jugend` (Brief 4) aus dem Nachwuchs-Abschnitt,
`/ratgeber/handball-statistik-mannschaft-besprechen` (Brief 3) aus dem
Gesprächsabschnitt, `/ratgeber/handball-saisonvergleich-eigenes-team` (Brief 12)

**Schema:** unverändert.

**Der Winkel, den nur ein Trainer schreiben kann:**
Die Zeitachse ist die eigentliche Erkenntnis. Kein Trainer führt wöchentlich
Entwicklungsgespräche – er hat vier Gelegenheiten im Jahr, und wenn er die
verpasst, findet Entwicklung im Kopf statt und nirgends sonst. Dazu die
unbequeme Ehrlichkeit über Stagnation: Ein Spieler, dessen Wurfquote über zwölf
Spiele gleich bleibt, hat sich oft trotzdem entwickelt – er wirft jetzt gegen
bessere Abwehrspieler oder aus schwierigeren Positionen. Ein Verlauf ohne
Kontext ist ein Urteil ohne Beweis, und genau das machen die meisten
Auswertungen.

---

# Brief 6 — Der Spielbericht, den der Vorstand tatsächlich liest

**Format: Commercial Page** · Route `/handball-spielbericht` ·
Feature `features/handball-spielbericht/` · Prio P2

**Warum Geldseite:** „Vorlage" und „schreiben" sind Werkzeug-Absichten. Wer
einen Spielbericht schreiben muss, sucht etwas, das ihm die Arbeit abnimmt –
und PDF-Export und widerrufbare Share-Links sind reale Funktionen. Die Seite
liefert die Struktur (redaktionell) und den Weg dorthin (Produkt).

**SERP-Warnung – vor der Umsetzung lesen:** Der Kopfbegriff
`handball spielbericht` gehört im deutschen Handball dem **Spielbericht Online
(SBO / nuLiga)**, dem offiziellen elektronischen Spielbericht. Gegen dieses
Ergebnis anzutreten ist aussichtslos und würde nur Traffic mit falscher
Absicht bringen. Konsequenz: **nicht** auf den Kopfbegriff optimieren. Der
erste Absatz muss aktiv abgrenzen („Hier geht es nicht um den Spielbericht
Online des Verbands, sondern um…"), und die Seite zielt ausschließlich auf den
Long Tail.

**Zielkeyword:** `handball spielbericht schreiben`
**Neben-Keywords:** `handball spielbericht vorlage`, `handball
spielzusammenfassung schreiben`, `handball saisonbericht verein`,
`handball spielauswertung pdf`

**Suchintention:** Kommerziell/transaktional (Vorlage suchen). Nachfrage:
schmal im sauberen Long Tail.

**metaTitle (40):** `Handball-Spielbericht schreiben & teilen`
**H1:** Der Handball-Spielbericht, den im Verein wirklich jemand liest

**Meta-Description (150):**
Handball-Spielbericht schreiben: sechs Blöcke, die Vorstand und Eltern wirklich
lesen – plus PDF-Export und Share-Link direkt aus dem erfassten Spiel.

**Gliederung:**

- H2 Nicht gemeint: der Spielbericht Online des Verbands (Abgrenzung, kurz)
- H2 Warum die meisten Spielberichte ungelesen bleiben
- H2 Die sechs Blöcke eines Berichts, den man zu Ende liest
  - H3 Ergebnis und Spielverlauf in drei Sätzen
  - H3 Die eine Zahl, die das Spiel erklärt
  - H3 Zwei Spieler namentlich – und warum
  - H3 Was der Gegner besser gemacht hat
  - H3 Woran wir jetzt arbeiten
  - H3 Nächster Termin
- H2 Für wen du schreibst: Vorstand, Eltern, Presse, Mannschaft
  - H3 Wo dieselbe Zahl unterschiedlich gelesen wird
- H2 Vom erfassten Spiel zum fertigen Bericht (Produktabschnitt)
  - H3 PDF-Export mit Wurfbild und Quoten
  - H3 Share-Link statt Anhang – und wie du ihn wieder abschaltest
  - H3 Was der Live-Ticker schon während des Spiels erledigt
- H2 Struktur zum Abschreiben (Textvorlage auf der Seite, kein Download-Gate)
- H2 Häufige Fragen (FAQ, sichtbar + FAQPage-Schema)

**Interne Links – rein:**
`handball-spielanalyse`, `handball-statistik-fuehren`,
`handball-kommunikation-spielfeld`, `handball-trainer-werden`

**Interne Links – raus:**
`/was-ist-statix`, `/ratgeber/handball-spielanalyse`, `/handball-wurfbild`,
`/ratgeber/handball-statistik-mannschaft-besprechen` (Brief 3), Demo-Link aus
`CLUB_CONFIG.website.demoUrl`

**Schema:** `PageSchema` (`WebPage`) + Breadcrumbs + separates `JsonLdScript`
mit `FAQPage`. Die Textvorlage **nicht** als `HowTo` auszeichnen – HowTo-Rich-
Results sind in der Google-Suche abgeschaltet, das Markup bringt nichts und
kostet Pflege. Kein `offers`.
**imagePath:** `/exportShare.png`

**Komponenten:** Server Component, `createPageMetadata()`, Sitemap-Eintrag mit
`priority: 0.7`.

**Der Winkel, den nur ein Trainer schreiben kann:**
Die Einsicht, dass ein Spielbericht vier verschiedene Leser hat, die dieselbe
Zahl gegensätzlich lesen: Der Vorstand liest „38 % Wurfquote" als Ergebnis, die
Eltern als Urteil über ihr Kind, die Mannschaft als Vorwurf. Deshalb steht in
einem guten Bericht **keine** Einzelspielerquote – aber zwei Spieler namentlich
gelobt, weil ein Bericht ohne Namen niemand liest. Dazu die Regel gegen den
eigenen Ehrgeiz: Wer mehr als eine Bildschirmseite schreibt, schreibt für sich
selbst. Und die Beobachtung aus der Praxis, dass ein Link, den man am
Sonntagvormittag in die Vereins-Gruppe schickt, mehr Wirkung hat als das beste
PDF am Mittwoch.

---

# Brief 7 — Das Abwehrsystem aus den eigenen Daten entscheiden

**Format: Artikel** · Slug `handball-abwehrsystem-entscheiden` ·
Kategorie `Spielanalyse` · Prio P2

**Warum jetzt:** Es gibt fünf Abwehr-Artikel (`handball-abwehrsysteme`,
`handball-6-0-abwehr`, `handball-5-1-abwehr`, `handball-3-2-1-abwehr`,
`handball-manndeckung`), die zusammen den größten Themencluster der Bibliothek
bilden – und keiner davon zeigt auf eine Geldseite. Dieser Artikel ist das
fehlende Scharnier: Er beantwortet die Entscheidungsfrage, auf die alle fünf
Beschreibungsartikel hinauslaufen, und leitet von dort ins Produkt.

**Zielkeyword:** `welches abwehrsystem handball`
**Neben-Keywords:** `abwehrsystem umstellen handball`,
`handball abwehr wechseln`, `abwehrsystem wählen handball`,
`handball abwehr entscheidung`

**Suchintention:** Informational, Entscheidungshilfe. Nachfrage: mittel –
profitiert vom bestehenden Abwehr-Cluster.

**metaTitle (42):** `Welches Abwehrsystem? Deine Daten sagen es`
**H1:** Welches Abwehrsystem passt zu deiner Mannschaft? Frag deine eigenen
Zahlen

**Meta-Description (156):**
Welches Abwehrsystem im Handball passt zu deinem Kader? Vier Zahlen aus den
eigenen Spielen entscheiden das besser als jede Systemdiskussion im
Trainerteam.

**Gliederung:**

- H2 Die Systemfrage ist eine Kaderfrage, keine Geschmacksfrage
- H2 Vier Zahlen, die die Entscheidung tragen
  - H3 Gegentore nach Zone: Distanz gegen Nahwurf
  - H3 Eigene Zeitstrafen pro Spiel
  - H3 Tempogegenstöße nach Ballgewinn
  - H3 Torwartquote getrennt nach Distanz und Nahwurf
- H2 Die Entscheidungstabelle: welches Muster zu welchem System führt
- H2 Wann 6:0 die richtige Antwort ist, auch wenn es langweilig aussieht
- H2 Wann du offensiver stehen musst, obwohl der Kader es nicht hergibt
- H2 Systemwechsel im Spiel: woran du merkst, dass es Zeit ist
- H2 Nach vier Spielen prüfen: hat die Umstellung gewirkt?

**Interne Links – rein:**
`handball-abwehrsysteme`, `handball-6-0-abwehr`, `handball-5-1-abwehr`,
`handball-3-2-1-abwehr`, `handball-manndeckung`, `handball-torwart-statistik`
– jeweils ein kontextueller Textlink aus dem passenden Abschnitt. Zusätzlich
in allen fünf Abwehr-Artikeln `relatedSlugs` um diesen Slug ergänzen.

**Interne Links – raus:**
`/ratgeber/handball-torwart-statistik`, `/handball-wurfbild`,
`/ratgeber/handball-gegner-scouten` (Brief 1), `/was-ist-statix`

**relatedSlugs:** `handball-abwehrsysteme`, `handball-torwart-statistik`,
`handball-spielanalyse`

**Schema:** BlogPosting + BreadcrumbList + FAQPage (4 FAQs).
**imagePath:** `/shotMaps.png`

**Der Winkel, den nur ein Trainer schreiben kann:**
Die Systemdiskussion im Trainerteam ist meistens eine Diskussion über
Vorlieben – jeder verteidigt das System, in dem er selbst gespielt hat. Dieser
Artikel dreht sie zu einer Rechnung um: Wenn 60 % deiner Gegentore aus dem
Rückraum kommen und dein Torwart dort unter 30 % hält, hilft dir kein
kompaktes 6:0, dann musst du raus. Kommen 60 % vom Kreis, ist offensiv
verteidigen Selbstmord. Dazu die zweite Zahl, die niemand mitdenkt: eigene
Zeitstrafen. Eine Mannschaft, die im 3:2:1 fünf Zeitstrafen pro Spiel kassiert,
verteidigt de facto ein Drittel des Spiels in Unterzahl – dann ist das
theoretisch bessere System praktisch das schlechtere. Und die ehrliche
Einschränkung: Ein Systemwechsel braucht vier bis sechs Wochen Training,
deshalb ist die Zahl, die man zuerst braucht, der Kalender.

---

# Brief 8 — Torwartbewertung jenseits der Paradenquote

**Format: Erweiterung** von `handball-torwart-statistik` · Prio P2

**Warum Erweiterung:** So im Auftrag vorgegeben – und sachlich richtig. Der
Artikel deckt Paradenquote, Wurfzonen, Abwehr-Kontext und Ecken bereits ab und
ist mit acht Minuten Lesezeit eher knapp. Ein zweiter URL zum selben
Keyword-Set wäre direkte Kannibalisierung. Billigster Hebel im ganzen Backlog:
bestehendes Ranking-Asset vertiefen statt neu anfangen.

**Zielkeywords (zu ergänzen):** `torwartquote handball berechnen`,
`torwart bewerten handball`, `handball torwart vergleichen`,
`torwart wechsel handball entscheidung`

**Titel:** `metaTitle` bleibt `Torwart-Statistik im Handball auswerten` (39).

**Was dazukommt:**

- H2 Erwartete Paraden: die Quote gegen die Wurfqualität rechnen (neu, nach
  „Warum die Quote nach Wurfzonen entscheidend ist")
  - H3 Wie du ohne xG-Modell zu einer fairen Erwartung kommst
  - H3 Rechenbeispiel mit einem kompletten Spiel
- H2 Zwei Torhüter fair vergleichen (neu)
  - H3 Warum die Gesamtquote hier immer lügt
  - H3 Vergleich nach Zone und Spielabschnitt
- H2 Die Wechselentscheidung: wann du den Torwart wirklich ziehst (neu)
  - H3 Drei Gegentore in Serie sind kein Kriterium
  - H3 Was ein Wechsel psychologisch kostet
- H2 Der Anteil am ersten Tempo (bestehenden Stichpunkt „Anwurf-Beitrag" zu
  einem eigenen H2 ausbauen)
- H2 Was du dem Torwart zeigst – und was nicht (neu)

`dateModified` hochsetzen, `readingTimeMinutes` von 8 auf 12 anheben, zwei
FAQs ergänzen („Wie vergleicht man zwei Handball-Torhüter fair?", „Wann sollte
man im Handball den Torwart wechseln?").

**Interne Links – raus (neu zu setzen):**
`/handball-wurfbild` (Brief 9), `/ratgeber/handball-abwehrsystem-entscheiden`
(Brief 7), `/ratgeber/handball-expected-goals-xg` (bestehend, passt zum neuen
Erwartungs-Kapitel), `/ratgeber/handball-statistik-mannschaft-besprechen`
(Brief 3, aus „Was du dem Torwart zeigst")

**Schema:** unverändert – BlogPosting + FAQPage.

**Der Winkel, den nur ein Trainer schreiben kann:**
Der Wechselabschnitt. Jeder Trainer hat schon einmal nach drei Gegentoren in
Serie gewechselt und wusste hinterher nicht, ob es das Spiel gedreht hat oder
den Torwart für vier Wochen zerstört. Der Artikel soll das sauber trennen: Drei
Gegentore aus Nahdistanz sind eine Abwehrinformation, drei Gegentore aus neun
Metern eine Torwartinformation – und nur letztere rechtfertigt einen Wechsel.
Dazu der Vergleichsteil, der in der Praxis ständig gebraucht wird und den
niemand sauber löst: Zwei Keeper mit 32 % und 38 % zu vergleichen ist wertlos,
wenn der eine hinter einer 6:0 und der andere hinter einer 3:2:1 steht. Und
zuletzt die Ehrlichkeit gegenüber der eigenen Zunft: Torhüter bekommen die
schlechtesten Daten und die härtesten Urteile im ganzen Handball.

---

# Brief 9 — Wenn das Wurfbild sagt: ändert den Angriff

**Format: Commercial Page** · Route `/handball-wurfbild` ·
Feature `features/handball-wurfbild/` · Prio P1

**Warum Geldseite:** `wurfbild handball` und `handball heatmap` sind
Werkzeug-Absichten – ein Wurfbild ist nichts, was man liest, sondern etwas, das
man haben will. Das Feature existiert (Shot Maps / Heatmaps), das Bildmaterial
existiert (`/public/shotMaps.png`), und `shotMaps.png` wird heute schon von
mehreren Artikeln als Hero benutzt, ohne dass es eine Zielseite dafür gibt. Das
ist die günstigste Geldseite im Backlog.

**Zielkeyword:** `wurfbild handball`
**Neben-Keywords:** `handball heatmap`, `shot map handball`,
`wurfbild erstellen handball`, `handball wurfpositionen auswerten`,
`handball wurfverteilung`

**Suchintention:** Kommerziell/Feature. Nachfrage: schmal, aber sauber – wer
„Wurfbild Handball" sucht, meint genau das.

**metaTitle (30):** `Wurfbild & Heatmap im Handball`
**H1:** Das Wurfbild im Handball: wann es sagt, dass ihr den Angriff ändern
müsst

**Meta-Description (153):**
Wurfbild im Handball lesen und selbst erstellen: welche Muster einen
Angriffswechsel erzwingen – und wie du jeden Wurf live per Tap auf dem Feld
erfasst.

**Gliederung:**

- H2 Was ein Wurfbild zeigt, was eine Wurfquote verschweigt
- H2 Fünf Muster und was sie bedeuten
  - H3 Alles von außen: der Rückraum kommt nicht durch
  - H3 Ein leeres Zentrum: kein Kreisanspiel
  - H3 Streuung ohne Schwerpunkt: kein Spielzug, nur Einzelaktionen
  - H3 Viele Abschlüsse aus neun Metern: die Abwehr steht zu weit vorn
  - H3 Ein Loch auf der linken Seite: euer Linkshänder-Problem
- H2 Wann ein Muster wirklich ein Muster ist (Stichprobengröße)
- H2 Das Wurfbild des Gegners lesen
- H2 So entsteht dein Wurfbild in Statix (Produktabschnitt, echte Screenshots)
  - H3 Wurfposition per Tap auf dem Feld
  - H3 Filter nach Spieler, Position, Halbzeit
  - H3 Torfläche: wo im Tor der Ball landet
- H2 Wurfbild und Torwart: dieselbe Karte, andere Frage
- H2 Häufige Fragen (FAQ, sichtbar + FAQPage-Schema)

**Interne Links – rein (die Artikel, die heute `/shotMaps.png` nutzen oder
Wurfbilder erwähnen, bekommen je einen kontextuellen Textlink hierher):**
`handball-spielanalyse`, `handball-torwart-statistik`, `wurfquote-berechnen`,
`handball-expected-goals-xg`, `handball-statistik-fuehren`,
`handball-wurftraining-sprungwurf`, `handball-wurfarten`

**Interne Links – raus:**
`/was-ist-statix`, `/ratgeber/wurfquote-berechnen`,
`/ratgeber/handball-expected-goals-xg`, `/ratgeber/handball-spielanalyse`,
`/ratgeber/handball-abwehrsystem-entscheiden` (Brief 7), Demo-Link aus
`CLUB_CONFIG.website.demoUrl`

**Schema:** `PageSchema` (`WebPage`) + Breadcrumbs + separates `JsonLdScript`
mit `FAQPage`. `imagePath="/shotMaps.png"`. Kein `offers`, kein
`AggregateRating`.

**Komponenten:** Server Component. Die Musterbeispiele als statische Grafiken
oder als reines CSS/SVG umsetzen – kein `framer-motion`, kein `gsap`, keine
Client-Interaktivität nötig. Sitemap-Eintrag mit `priority: 0.8`.

**Der Winkel, den nur ein Trainer schreiben kann:**
Die fünf Muster sind das Herz der Seite, und sie sind nur schreibbar, wenn man
sie selbst am Sonntagabend gesehen hat. Vor allem das vierte: Wenn sich die
Abschlüsse auf neun Metern häufen, ist das kein Wurfproblem, sondern ein
Zeichen, dass eure Angreifer gar nicht erst in den Zweikampf gehen – und die
Antwort ist Stoßverhalten im Training, nicht Wurftraining. Dazu die
Einschränkung, die eine ehrliche Seite machen muss und eine Werbeseite nicht
macht: Ein Wurfbild aus einem Spiel mit 28 Abschlüssen ist eine Anekdote. Erst
ab drei, vier Spielen wird daraus ein Muster, auf das man ein Training
umstellt. Wer nach einem Spiel den Angriff umbaut, jagt Rauschen.

---

# Brief 10 — Statistik im Training, nicht nur im Spiel

**Format: Artikel** · Slug `handball-statistik-im-training` ·
Kategorie `Statistik & Kennzahlen` · Prio P3

**⚠ Vor dem Schreiben klären:** Ob und wie sich eine Trainingseinheit in Statix
erfassen lässt – oder ob der Weg ausschließlich über „Trainingsspiel als Spiel
anlegen" führt. `PRODUCT.md` beschreibt Spiel- und Turniererfassung, sagt zum
Training nichts. Der Produktabschnitt darf **nur** beschreiben, was es
tatsächlich gibt. Im Zweifel auf Trainings- und Testspiele beschränken.

**Zielkeyword:** `handball training auswerten`
**Neben-Keywords:** `trainingsstatistik handball`,
`handball trainingsspiel auswerten`, `handball training messen`,
`wurfquote training handball`

**Suchintention:** Informational. Nachfrage: schmal.

**metaTitle (41):** `Handballtraining auswerten statt schätzen`
**H1:** Statistik im Training: warum du nicht bis Samstag warten musst

**Meta-Description (154):**
Handballtraining auswerten: Wie du im Trainingsspiel dieselben Zahlen erfasst
wie am Spieltag – und was du daraus über Fortschritt und Belastung erfährst.

**Gliederung:**

- H2 Warum sechs Trainingseinheiten mehr Daten liefern als ein Spieltag
- H2 Was sich im Training überhaupt sinnvoll messen lässt
  - H3 Wurfserien unter Standardbedingungen
  - H3 Das Trainingsspiel als vollwertige Erfassung
  - H3 Was du bewusst nicht misst
- H2 Der Wurftest, den du alle sechs Wochen wiederholst
- H2 Trainingsdaten mit Spieldaten vergleichen – und wo der Vergleich kippt
- H2 Belastung sichtbar machen, ohne Pulsgurte
- H2 Wenn Messen das Training kaputtmacht
- H2 Vom Trainingswert zur Trainingsentscheidung

**Interne Links – rein:**
`handball-training-planen`, `handball-spielformen-training`,
`handball-wurftraining-sprungwurf`, `handball-statistik-fuehren`,
`handball-saisonvorbereitung`

**Interne Links – raus:**
`/ratgeber/handball-statistik-fuehren`, `/handball-wurfbild` (Brief 9),
`/ratgeber/handball-spielerentwicklung-messen`, `/was-ist-statix`

**relatedSlugs:** `handball-training-planen`, `handball-statistik-fuehren`,
`handball-spielformen-training`

**Schema:** BlogPosting + BreadcrumbList + FAQPage (3 FAQs).
**imagePath:** `/recordStatsInGame.png`

**Der Winkel, den nur ein Trainer schreiben kann:**
Das Kapitel „Wenn Messen das Training kaputtmacht". Jeder, der einmal versucht
hat, im Training mitzuschreiben, kennt das Ergebnis: Man steht am Rand mit dem
Tablet, korrigiert niemanden mehr, und die Einheit wird schlechter, obwohl die
Daten besser werden. Daraus die Regel: Im Training wird entweder gecoacht oder
erfasst, nie beides gleichzeitig – deshalb erfasst man nur das Trainingsspiel
am Ende, und dafür braucht man einen Co-Trainer oder einen verletzten Spieler
mit dem Tablet. Dazu der Wurftest mit festen Bedingungen (gleiche Position,
gleiche Anzahl, gleicher Torwart, alle sechs Wochen), weil das die einzige
Trainingszahl ist, die über Monate wirklich vergleichbar bleibt.

---

# Brief 11 — Was die ersten zehn Minuten jedes Spiels verraten

**Format: Artikel** · Slug `handball-erste-10-minuten` ·
Kategorie `Spielanalyse` · Prio P4

**Zielkeyword:** `handball anfangsphase`
**Neben-Keywords:** `handball spielstart analysieren`,
`handball schlechter start`, `handball anfangsphase verbessern`,
`handball spielverlauf phasen`

**Suchintention:** Informational, Problemlösung („wir starten immer schlecht").
Nachfrage: schmal. P4 wegen des Volumens, aber inhaltlich einer der stärksten
Briefs – und ein guter Anlass, die Phasenanalyse aus `handball-spielanalyse` zu
einer eigenen Tiefenseite auszubauen.

**metaTitle (43):** `Die ersten 10 Minuten im Handball auswerten`
**H1:** Was dir die ersten zehn Minuten über deine Mannschaft verraten

**Meta-Description (157):**
Die Anfangsphase im Handball auswerten: Warum die ersten zehn Minuten mehr über
Vorbereitung und Matchplan aussagen als der Rest – und was du daraus änderst.

**Gliederung:**

- H2 Warum ausgerechnet die ersten zehn Minuten
  - H3 Hier wirkt dein Matchplan noch unverfälscht
  - H3 Hier ist noch niemand müde
- H2 Die vier Zahlen für den Startblock
  - H3 Torverhältnis nach zehn Minuten
  - H3 Ballverluste in den ersten fünf Angriffen
  - H3 Woher die ersten fünf Abschlüsse kamen
  - H3 Zeitstrafen in der Anfangsphase
- H2 Drei typische Startmuster und ihre Ursache
  - H3 Der kalte Start: Aufwärmen oder Anspannung
  - H3 Der Blitzstart mit Einbruch: zu hohes Tempo
  - H3 Der Fehlstart nur auswärts
- H2 Vergleich über die Saison: ist es ein Muster oder Pech?
- H2 Was du am Aufwärmen änderst – und was nichts bringt
- H2 Der Start nach der Halbzeit ist ein zweiter Spielbeginn
- H2 Wie du das misst, ohne extra Aufwand

**Interne Links – rein:**
`handball-spielanalyse`, `handball-aufwaermen-uebungen`,
`handball-nervositaet-vor-spielen`, `handball-mannschaft-motivieren`,
`handball-ballbesitz-tempo`

**Interne Links – raus:**
`/ratgeber/handball-spielanalyse`, `/ratgeber/handball-timeout-nutzen`,
`/ratgeber/handball-saisonvergleich-eigenes-team` (Brief 12),
`/handball-wurfbild` (Brief 9), `/was-ist-statix`

**relatedSlugs:** `handball-spielanalyse`, `handball-aufwaermen-uebungen`,
`handball-ballbesitz-tempo`

**Schema:** BlogPosting + BreadcrumbList + FAQPage (3 FAQs).
**imagePath:** `/statsTableInGame.png`

**Der Winkel, den nur ein Trainer schreiben kann:**
Die Beobachtung, dass „wir kommen immer schlecht rein" fast nie stimmt, wenn
man es über zehn Spiele nachrechnet – meistens gibt es zwei katastrophale
Starts, die alle erinnern, und acht unauffällige, die niemand erinnert. Der
Artikel soll dem Trainer genau dieses Werkzeug geben: die eigene Erzählung über
die Mannschaft überprüfen, bevor man das Aufwärmen umbaut. Und wenn das Muster
doch echt ist, die unbequeme Differenzierung: Ein kalter Start liegt fast nie
am Aufwärmen (das dauert überall gleich lang), sondern an der Frage, ob die
Mannschaft weiß, was der erste Angriff werden soll. Dazu der zweite Anpfiff –
die ersten Minuten nach der Halbzeit sind derselbe Startblock, und dort
verlieren Amateurmannschaften mehr Spiele als in der Schlussphase.

---

# Brief 12 — Gegen sich selbst vergleichen statt gegen die Tabelle

**Format: Artikel** · Slug `handball-saisonvergleich-eigenes-team` ·
Kategorie `Statistik & Kennzahlen` · Prio P3

**Zielkeyword:** `handball saisonauswertung`
**Neben-Keywords:** `handball team entwicklung saison`,
`handball saisonbilanz mannschaft`, `handball tabelle aussagekraft`,
`handball entwicklung messen team`

**Suchintention:** Informational, saisonal (Winterpause und Saisonende sind die
Nachfragespitzen – Veröffentlichung entsprechend timen). Nachfrage: schmal bis
mittel.

**metaTitle (39):** `Handball-Saisonauswertung für dein Team`
**H1:** Vergleicht euch mit euch selbst, nicht mit der Tabelle

**Meta-Description (152):**
Handball-Saisonauswertung: Warum der Tabellenplatz die schlechteste Kennzahl
für Entwicklung ist – und welche fünf eigenen Werte den Fortschritt zeigen.

**Gliederung:**

- H2 Warum der Tabellenplatz nichts über deine Arbeit sagt
  - H3 Die Liga verändert sich, deine Mannschaft auch
  - H3 Zwei Punkte Unterschied, dreißig Prozent Interpretation
- H2 Die fünf Werte, die ihr gegen euch selbst messt
  - H3 Wurfquote nach Position
  - H3 Ballverluste je Angriff
  - H3 Gegentore nach Zone
  - H3 Anteil Tempogegenstoß-Tore
  - H3 Torwartquote nach Distanz
- H2 Der Vergleich Hinrunde gegen Rückrunde
- H2 Dasselbe Duell zweimal: was das Rückspiel zeigt
- H2 Wenn ihr besser werdet und trotzdem absteigt
- H2 Die Saisonbilanz, die du der Mannschaft zeigst
- H2 Ausgangswerte für die nächste Saison festhalten

**Interne Links – rein:**
`handball-statistik-fuehren`, `handball-spielerentwicklung-messen`,
`handball-spielanalyse`, `handball-saisonvorbereitung`,
`wurfquote-berechnen`

**Interne Links – raus:**
`/ratgeber/handball-statistik-fuehren`,
`/ratgeber/handball-statistik-mannschaft-besprechen` (Brief 3),
`/handball-spielbericht` (Brief 6, aus „Saisonbilanz"),
`/ratgeber/handball-erste-10-minuten` (Brief 11), `/was-ist-statix`

**relatedSlugs:** `handball-statistik-fuehren`,
`handball-spielerentwicklung-messen`, `handball-spielanalyse`

**Schema:** BlogPosting + BreadcrumbList + FAQPage (4 FAQs).
**imagePath:** `/gameListOverview.png`

**Der Winkel, den nur ein Trainer schreiben kann:**
Das Kapitel „Wenn ihr besser werdet und trotzdem absteigt". Das ist die
Situation, in der Trainerentlassungen passieren und in der niemand Daten hat,
um sich zu wehren. Der Artikel gibt dem Trainer die Argumentation: Wurfquote
von 44 auf 51 %, Ballverluste von 16 auf 11 pro Spiel, und trotzdem zwei Punkte
zu wenig – weil drei Vereine im Sommer aufgerüstet haben. Dazu der
Rückspiel-Vergleich als ehrlichster Maßstab, den es im Amateurhandball gibt:
dieselbe Mannschaft, dieselbe Halle, ein halbes Jahr Arbeit dazwischen. Und
die Warnung vor dem Selbstbetrug: Wer sich nur mit sich selbst vergleicht,
übersieht, dass die Liga auch besser wird – deshalb gehört neben jeden eigenen
Wert der Gegner, gegen den er zustande kam.

---

# Stop-Liste

Nicht mehr schreiben, egal wie gut das Keyword aussieht:

- Spieler-Technikartikel jeder Art (Würfe, Finten, Sprungkraft, Ballhandling).
  Davon gibt es 15, sie ranken, sie konvertieren nicht. Fertig.
- Positionsratgeber („Tipps für Außenspieler"). Jede Position ist abgedeckt.
- Regel- und Grundlagenartikel. Neun Stück, vollständig abgedeckt.
- Fitness, Ernährung, Regeneration. Nicht unser Thema, nicht unsere Nachfrage.
- „Welche Position passt zu mir"-Formate. Zielgruppe ist der Spieler.

Bestehende Artikel dürfen selbstverständlich weiter gepflegt werden – neue
Einträge in diesen Kategorien aber nicht mehr.

# Was nach diesen zwölf Inhalten gilt

- Bibliothek: 76 Artikel, davon 13 mit Trainer-Intent (17 % statt 10 %).
- Erstmals zeigen Artikel auf Geldseiten: die drei Commercial Pages bekommen
  kontextuelle Links aus 13 bestehenden Artikeln und aus allen neun neuen bzw.
  erweiterten Inhalten.
- Der Abwehr-Cluster (fünf Artikel) hängt über Brief 7 an einer Geldseite.
- `shotMaps.png` hat endlich eine Zielseite (Brief 9).

Für die Runde danach: `Spielanalyse` wächst von 1 auf 5 Artikel und
`Statistik & Kennzahlen` von 6 auf 8. Wenn beide zusammen zweistellig werden,
lohnt eine eigene Kategorie `Trainer & Coaching` in `ARTICLE_CATEGORIES`
(`features/ratgeber/types.ts`) plus ein Trainer-Einstieg auf dem Ratgeber-Hub.
Jetzt noch nicht – dafür sind es zu wenige.

# Offene Fragen

Vor der Umsetzung zu klären, weil hier nichts erfunden werden darf:

1. **Slugs der Geldseiten.** `/handball-statistik-jugend`,
   `/handball-spielbericht` und `/handball-wurfbild` sind Vorschläge aus diesem
   Backlog. Falls aus früheren Phasen bereits kommerzielle Seiten existieren
   oder geplant sind, gilt deren Struktur – dann alle Link-Ziele in den Briefs
   umbiegen.
2. **Konversionsziel.** Aktuell `CLUB_CONFIG.website.demoUrl`
   (`demo.statix-app.de`). PR #35 verschiebt das. Welcher Wert gilt beim
   Schreiben?
3. **Training erfassen (Brief 10).** Lässt sich eine Trainingseinheit in Statix
   abbilden, oder nur ein Trainingsspiel als reguläres Spiel? Der
   Produktabschnitt richtet sich danach.
4. **Preise (Briefs 4, 6, 9).** Bleiben laut `PRODUCT.md` bis auf Weiteres
   nicht öffentlich. Die drei Commercial Pages arbeiten deshalb mit „kostenlos
   starten" und dem Newsletter als Preis-Platzhalter. Sobald es echte Preise
   gibt: Seiten überarbeiten, dann erst `offers` ins Schema.
5. **Autorenangabe.** Die Briefs 4, 6 und 9 leben von Trainer-Erfahrung. Wenn
   es eine namentliche Autorenzeile geben soll (E-E-A-T), muss dafür eine
   reale Person mit realer Trainerbiografie hinterlegt werden – sonst gar
   keine.
