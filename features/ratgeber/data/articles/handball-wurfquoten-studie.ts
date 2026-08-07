/**
 * GERÜST – NICHT VERÖFFENTLICHT.
 *
 * Dieses Modul ist bewusst **nicht** in `features/ratgeber/data/articles.ts`
 * registriert. Es erscheint deshalb weder im Hub noch in der Sitemap, in
 * llms.txt oder unter einer URL. Es existiert, damit Struktur, Methodik und
 * Tabellenaufbau schon stehen, wenn die Daten vorliegen.
 *
 * ================= WAS DER BETREIBER LIEFERN MUSS =================
 * Alle mit «TODO(daten)» markierten Stellen sind Platzhalter. Es sind
 * ausschließlich **aggregierte** Werte einzusetzen – keine Vereins-, Spiel-
 * oder Spielernamen, keine personenbezogenen Daten. Benötigt werden:
 *
 *  1. Grundgesamtheit
 *     - Anzahl ausgewerteter Spiele
 *     - Zeitraum (von / bis, Monat und Jahr)
 *     - Anzahl beteiligter Mannschaften
 *     - Verteilung nach Spielklasse (grob: Kreis-/Bezirks-/Landesebene)
 *     - Verteilung nach Alter (Jugend / Erwachsene) und Geschlecht
 *  2. Je Wurfzone (Tempogegenstoß, Kreis, Außen, Rückraum 9 m frei,
 *     Rückraum gegen Block, Siebenmeter):
 *     - Anzahl Würfe
 *     - Anzahl Tore
 *     - daraus Trefferquote
 *  3. Dieselbe Aufschlüsselung getrennt nach Jugend und Erwachsenen
 *  4. Streuung je Zone (z. B. 25. und 75. Perzentil der Mannschaftswerte),
 *     damit die Werte nicht als Punktwert missverstanden werden
 *  5. Erhebungsweg: Wie sind die Daten entstanden, welche Zählregeln galten,
 *     wie wurde ausgeschlossen (z. B. abgebrochene Spiele)
 *  6. Freigabe: Bestätigung, dass die Aggregation veröffentlicht werden darf
 *
 * Solange auch nur ein «TODO(daten)» offen ist, wird der Artikel NICHT
 * registriert. Keine der Zahlen im Text unten darf geschätzt, gerundet oder
 * aus fremden Quellen ergänzt werden – ohne echte Erhebung erscheint die
 * Studie nicht.
 * ==================================================================
 */
import type { Article } from '../../types';

export const handballWurfquotenStudie: Article = {
  slug: 'handball-wurfquoten-studie',
  title: 'Wurfquoten nach Position: Auswertung aus erfassten Amateurspielen',
  metaTitle: 'Wurfquoten nach Position: Daten aus Amateurspielen',
  metaDescription:
    'Wurfquoten nach Position aus mit Statix erfassten Amateurspielen: Methodik, Trefferquoten je Wurfzone, Unterschiede zwischen Jugend und Erwachsenen und die Streuung.',
  keywords: [
    'wurfquote nach position handball',
    'handball wurfquoten studie',
    'handball daten amateur',
    'trefferquote wurfzone handball',
    'handball statistik auswertung',
    'wurfquote richtwerte handball',
  ],
  category: 'Kennzahlen & Analyse',
  archetype: 'kennzahl',
  datePublished: 'TODO(daten): Veröffentlichungsdatum',
  dateModified: 'TODO(daten): Veröffentlichungsdatum',
  readingTimeMinutes: 8,
  excerpt:
    'Richtwerte für Wurfquoten kursieren viele, erhoben ist kaum einer. Diese Auswertung basiert auf tatsächlich erfassten Amateurspielen – mit offener Methodik und ausgewiesener Streuung.',
  imagePath: '/shotMaps.png',
  imageAlt: 'Wurfbild mit Abschlusszonen aus erfassten Handballspielen',
  body: `Wenn du als Trainer wissen willst, ob 52 % aus dem Rückraum gut sind, findest du im Netz viele Zahlen und fast keine Quelle. Die meisten Richtwerte sind Erfahrungswerte, die von Artikel zu Artikel weitergereicht wurden – auch die in unseren eigenen Ratgebern, wo sie ausdrücklich als solche gekennzeichnet sind.

Diese Auswertung ist der Versuch, das für den Amateurbereich zu ändern: Sie basiert auf Spielen, die mit Statix erfasst wurden, und legt Methodik, Grundgesamtheit und Streuung offen, damit du selbst beurteilen kannst, wie weit die Zahlen tragen.

## Grundgesamtheit und Zeitraum

Ausgewertet wurden **TODO(daten): Anzahl** Spiele aus dem Zeitraum **TODO(daten): von – bis**, erfasst von **TODO(daten): Anzahl** Mannschaften.

Die Verteilung der Grundgesamtheit:

| Merkmal | Anteil |
| --- | --- |
| Jugend | TODO(daten) |
| Erwachsene | TODO(daten) |
| weiblich | TODO(daten) |
| männlich | TODO(daten) |
| Kreis- und Bezirksebene | TODO(daten) |
| Landesebene und höher | TODO(daten) |

Was diese Auswertung **nicht** ist: keine repräsentative Stichprobe des deutschen Amateurhandballs. Die Mannschaften, die eine Statistik-App nutzen, sind eine Selbstauswahl – sie trainieren tendenziell häufiger und arbeiten datenorientierter als der Durchschnitt. Die Werte sind deshalb als Orientierung für vergleichbare Mannschaften zu lesen, nicht als Norm.

## Wie erhoben wurde

Die Daten stammen aus der Live-Erfassung während des Spiels. Jeder Torabschluss wird mit Position erfasst; die Zuordnung zur Zone erfolgt über die Wurfposition auf dem Spielfeld.

Die Zählregeln:

- Als **Wurf** zählt jeder Torabschluss, der im Tor landet, gehalten wird, an Pfosten oder Latte geht oder das Tor verfehlt.
- **Technische Fehler** ohne Abschluss zählen nicht.
- **Geblockte Bälle**: TODO(daten): Wie wurden geblockte Würfe behandelt – als Wurf gezählt oder ausgeschlossen?
- **Siebenmeter** werden getrennt geführt und sind in keiner Feldzone enthalten.
- Ausgeschlossen wurden: TODO(daten): Ausschlusskriterien, z. B. abgebrochene Spiele, Spiele mit unvollständiger Erfassung, Spiele unterhalb einer Mindestzahl erfasster Ereignisse.

Die Erfassung erfolgt durch die Vereine selbst. Das bedeutet eine gewisse Uneinheitlichkeit in Grenzfällen – ein bekannter und nicht vollständig ausräumbarer Schwachpunkt jeder Erhebung dieser Art.

## Trefferquoten je Wurfzone

| Zone | Würfe | Tore | Trefferquote |
| --- | --- | --- | --- |
| Tempogegenstoß | TODO(daten) | TODO(daten) | TODO(daten) |
| Kreis / Nahdistanz | TODO(daten) | TODO(daten) | TODO(daten) |
| Außen | TODO(daten) | TODO(daten) | TODO(daten) |
| Rückraum 9 m, frei | TODO(daten) | TODO(daten) | TODO(daten) |
| Rückraum gegen Block | TODO(daten) | TODO(daten) | TODO(daten) |
| Siebenmeter | TODO(daten) | TODO(daten) | TODO(daten) |
| **Gesamt (ohne Siebenmeter)** | **TODO(daten)** | **TODO(daten)** | **TODO(daten)** |

## Jugend und Erwachsene im Vergleich

| Zone | Jugend | Erwachsene | Differenz |
| --- | --- | --- | --- |
| Tempogegenstoß | TODO(daten) | TODO(daten) | TODO(daten) |
| Kreis / Nahdistanz | TODO(daten) | TODO(daten) | TODO(daten) |
| Außen | TODO(daten) | TODO(daten) | TODO(daten) |
| Rückraum 9 m, frei | TODO(daten) | TODO(daten) | TODO(daten) |
| Rückraum gegen Block | TODO(daten) | TODO(daten) | TODO(daten) |
| Siebenmeter | TODO(daten) | TODO(daten) | TODO(daten) |

TODO(daten): Zwei bis drei Sätze zur Einordnung – nur das beschreiben, was die Zahlen tatsächlich zeigen, ohne Ursachen zu behaupten, die nicht erhoben wurden.

## Wie stark die Werte streuen

Ein Durchschnittswert ohne Streuung führt in die Irre: Er suggeriert eine Zielmarke, die für die Hälfte aller Mannschaften nicht erreichbar ist. Deshalb hier die Bandbreite der Mannschaftswerte je Zone.

| Zone | 25. Perzentil | Median | 75. Perzentil |
| --- | --- | --- | --- |
| Tempogegenstoß | TODO(daten) | TODO(daten) | TODO(daten) |
| Kreis / Nahdistanz | TODO(daten) | TODO(daten) | TODO(daten) |
| Außen | TODO(daten) | TODO(daten) | TODO(daten) |
| Rückraum 9 m, frei | TODO(daten) | TODO(daten) | TODO(daten) |
| Rückraum gegen Block | TODO(daten) | TODO(daten) | TODO(daten) |

Lies die Tabelle so: Die Hälfte aller erfassten Mannschaften liegt zwischen dem 25. und dem 75. Perzentil. Wenn deine Mannschaft dort liegt, ist ihr Wert unauffällig – unabhängig davon, ob er über oder unter dem Median liegt.

## Was das für deine Auswertung bedeutet

Drei Konsequenzen für die Arbeit mit den eigenen Zahlen:

**Vergleiche zuerst mit dir selbst.** Sobald du acht bis zehn eigene Spiele erfasst hast, ist der Durchschnitt deiner Mannschaft die bessere Referenz als jede fremde Tabelle. Diese Auswertung ist dafür gedacht, den ersten Einstieg einzuordnen – nicht, um dauerhaft dagegen zu messen.

**Nimm die Streuung ernst, nicht den Mittelwert.** Ein Wert innerhalb der mittleren Hälfte ist kein Handlungsbedarf.

**Nutze die Zonenverteilung, nicht nur die Quoten.** Der aussagekräftigere Befund ist meist, *wo* eine Mannschaft abschließt – dazu ausführlich unter [Expected Goals im Handball](/ratgeber/handball-expected-goals-xg).

TODO(daten): Abschließender Absatz mit dem Hinweis, ab wann die Auswertung aktualisiert wird und wie Vereine ihre eigenen aggregierten Daten beisteuern können, falls das vorgesehen ist.`,
  modules: [
    {
      kind: 'answerBox',
      text: 'TODO(daten): Kurzantwort mit den zwei bis drei wichtigsten Zahlen der Auswertung, sobald sie vorliegen. Ohne echte Werte bleibt dieser Platzhalter stehen und der Artikel unveröffentlicht.',
    },
    {
      after: 'Trefferquoten je Wurfzone',
      kind: 'benchmarkTable',
      caption: 'TODO(daten): Erhobene Trefferquoten je Zone',
      columns: ['Zone', 'Würfe', 'Tore', 'Trefferquote'],
      rows: [
        ['Tempogegenstoß', 'TODO(daten)', 'TODO(daten)', 'TODO(daten)'],
        ['Kreis / Nahdistanz', 'TODO(daten)', 'TODO(daten)', 'TODO(daten)'],
        ['Außen', 'TODO(daten)', 'TODO(daten)', 'TODO(daten)'],
        ['Rückraum 9 m, frei', 'TODO(daten)', 'TODO(daten)', 'TODO(daten)'],
        ['Rückraum gegen Block', 'TODO(daten)', 'TODO(daten)', 'TODO(daten)'],
        ['Siebenmeter', 'TODO(daten)', 'TODO(daten)', 'TODO(daten)'],
      ],
      note: 'TODO(daten): Grundgesamtheit, Zeitraum und Erhebungsweg in einem Satz. Ohne diese Angabe wird die Tabelle nicht veröffentlicht.',
    },
  ],
  faqs: [
    {
      question: 'Woher stammen die Daten dieser Auswertung?',
      answer:
        'TODO(daten): Anzahl Spiele, Zeitraum, Anzahl Mannschaften und Erhebungsweg in zwei bis drei Sätzen. Ausdrücklich mit angeben, dass es sich um eine Selbstauswahl von Mannschaften handelt, die eine Statistik-App nutzen, und nicht um eine repräsentative Stichprobe.',
    },
    {
      question: 'Was ist eine gute Wurfquote aus dem Rückraum?',
      answer:
        'TODO(daten): Antwort erst nach Vorliegen der erhobenen Werte formulieren, mit Median und der mittleren Hälfte der Mannschaftswerte statt eines einzelnen Zielwerts.',
    },
    {
      question: 'Sind die Werte auf meine Mannschaft übertragbar?',
      answer:
        'Nur eingeschränkt. Die Auswertung beruht auf Mannschaften, die ihre Spiele digital erfassen – eine Selbstauswahl, die tendenziell häufiger trainiert und datenorientierter arbeitet. Sobald du acht bis zehn eigene Spiele erfasst hast, ist der Durchschnitt deiner Mannschaft die bessere Referenz als jede fremde Tabelle.',
    },
  ],
  relatedSlugs: [
    'wurfquote-berechnen',
    'handball-expected-goals-xg',
    'handball-statistik-fuehren',
  ],
};
