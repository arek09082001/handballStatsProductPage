import type { Article } from '../../types';

export const handballExpectedGoalsXg: Article = {
  slug: 'handball-expected-goals-xg',
  title: 'Expected Goals im Handball: Chancenqualität statt Trefferglück',
  metaTitle: 'Expected Goals (xG) im Handball einfach erklärt',
  metaDescription:
    'Expected Goals im Handball: was xG misst, wie du Chancenqualität ohne Datenbank abschätzt, welche Zonenwerte realistisch sind und wo die Kennzahl an ihre Grenzen stößt.',
  keywords: [
    'expected goals handball',
    'xg handball',
    'chancenqualität handball',
    'handball wurfposition bewerten',
    'handball erwartete tore',
    'handball datenanalyse',
    'xg wert handball',
  ],
  category: 'Kennzahlen & Analyse',
  archetype: 'kennzahl',
  datePublished: '2026-07-26',
  dateModified: '2026-08-07',
  readingTimeMinutes: 7,
  excerpt:
    'Expected Goals beantworten die Frage, die die Wurfquote offenlässt: Waren die Chancen gut? Wie du Chancenqualität ohne Datenbank abschätzt – und wo die Kennzahl im Amateurbereich endet.',
  imagePath: '/shotMaps.png',
  imageAlt: 'Wurfbild mit Abschlusszonen einer Handballmannschaft in der Statix-App',
  body: `Zwei Mannschaften werfen beide 30 Tore aus 50 Würfen. Die eine hat sich diese Abschlüsse am Kreis und im Tempogegenstoß erarbeitet, die andere hat 50-mal aus neun Metern gegen den Block geworfen und einen sehr guten Tag gehabt. Die Wurfquote ist identisch, die Leistung nicht. Expected Goals sind der Versuch, genau diesen Unterschied messbar zu machen – und im Amateurhandball ist das einfacher, als der Begriff klingt.

## Was Expected Goals im Handball beantworten

Der xG-Wert eines Wurfs ist die Wahrscheinlichkeit, mit der ein Abschluss aus dieser Situation zum Tor führt. Ein Kreisanspiel aus zwei Metern hat einen hohen xG-Wert, ein Sprungwurf aus neun Metern gegen einen geschlossenen Block einen niedrigen. Addierst du die xG-Werte aller Abschlüsse eines Spiels, bekommst du die Torzahl, die "zu erwarten" gewesen wäre.

Die eigentliche Aussage steckt im Vergleich mit der tatsächlichen Torzahl:

- **Tore deutlich über xG:** Ihr habt gut abgeschlossen oder der Torwart des Gegners hatte einen schwachen Tag. Über wenige Spiele ist das oft Zufall.
- **Tore deutlich unter xG:** Die Chancen waren da, der Abschluss nicht. Das ist ein Trainingsauftrag.
- **Niedriger xG-Wert insgesamt:** Euer Angriff erarbeitet sich keine guten Positionen. Das ist der wichtigste Befund und hat mit Wurftraining nichts zu tun.

Für dich als Trainer ist der dritte Fall der interessanteste, weil er auf ein Spielproblem zeigt statt auf ein Technikproblem.

## Die Rechnung – und warum du keine Datenbank brauchst

In der Bundesliga wird xG aus großen Datensätzen modelliert. Im Amateurbereich hast du diese Daten nicht, und du brauchst sie auch nicht. Du kannst mit einer groben Zoneneinteilung arbeiten und die Trefferwahrscheinlichkeit je Zone durch die eigene Erfahrung ersetzen – oder, sauberer, durch deinen eigenen Saisonwert.

Das ist der entscheidende Punkt: Nimm nicht irgendwelche fremden Wahrscheinlichkeiten, sondern die Quoten, die deine Mannschaft in dieser Zone tatsächlich erreicht hat. Damit ist der Wert kein Zauberwert, sondern eine ehrliche Aussage über die Verteilung eurer Abschlüsse.

## Ein Spiel mit Zonenwerten durchgerechnet

Fünf Zonen reichen. Für jede Zone nimmst du die Trefferwahrscheinlichkeit aus deinem eigenen Saisonschnitt – hier als Beispiel:

| Zone | Würfe | Wahrscheinlichkeit | Erwartete Tore |
| --- | --- | --- | --- |
| Kreis / Nahdistanz | 6 | 0,70 | 4,2 |
| Tempogegenstoß | 5 | 0,85 | 4,3 |
| Außen | 9 | 0,60 | 5,4 |
| Rückraum 9 m | 22 | 0,48 | 10,6 |
| Rückraum gegen Block | 8 | 0,30 | 2,4 |
| **Gesamt** | **50** | | **26,9** |

Erwartet wären rund 27 Tore. Erzielt habt ihr 24. Die Differenz von drei Toren ist für ein einzelnes Spiel unauffällig – interessanter ist die Verteilung: 30 von 50 Abschlüssen kamen aus dem Rückraum, davon 8 gegen den geschlossenen Block. Das ist der eigentliche Befund. Euer Angriff erarbeitet zu wenige Nahdistanz- und Tempoabschlüsse, und kein Wurftraining der Welt gleicht das aus.

Genau so benutzt du xG im Amateurbereich: nicht, um einzelne Spieler zu bewerten, sondern um zu sehen, **wo** ihr abschließt.

## Realistische Zonenwerte als Startpunkt

Bis du deine eigenen Quoten hast, kannst du mit Erfahrungswerten anfangen. Ersetze sie, sobald du acht bis zehn eigene Spiele erfasst hast – dann rechnest du mit deiner Mannschaft statt mit einer Annahme.

Zwei Faktoren, die in großen Modellen enthalten sind und die du grob berücksichtigen solltest, ohne sie zu berechnen: ob der Werfer im Sprung frei war oder gegen Block geworfen hat, und ob die Abwehr sortiert stand. Ein Wurf aus neun Metern gegen eine sortierte 6:0 und einer aus neun Metern gegen eine im Rückzug befindliche Abwehr sind nicht dieselbe Chance.

## Wo die Kennzahl im Amateurbereich endet

**Kleine Stichproben.** xG ist eine Wahrscheinlichkeitsrechnung. Über ein Spiel schwankt sie stark; erst über zehn bis fünfzehn Spiele wird die Differenz zwischen Toren und erwarteten Toren interpretierbar.

**Selbstgemachte Wahrscheinlichkeiten.** Wenn deine Zonenwerte auf 40 eigenen Würfen beruhen, ist die Unsicherheit groß. Sag das dazu, statt den Wert als Präzision zu verkaufen.

**Der Torwart des Gegners fehlt im Modell.** Ein herausragender Torwart drückt deine Ausbeute unter xG, ohne dass ihr schlechter abgeschlossen habt. Über eine Saison mittelt sich das heraus, über drei Spiele nicht.

**Einzelne Spieler bewerten.** Bei 30 Abschlüssen einer Saison ist die Differenz zwischen Toren und xG für einen einzelnen Spieler fast reines Rauschen. Nutze xG auf Mannschaftsebene.

**Der Begriff selbst.** "Expected Goals" klingt nach einer Vorhersage. Es ist eine Beschreibung der Chancenqualität, keine Prognose für das nächste Spiel. Wer das in der Kabine nicht sauber erklärt, erzeugt Widerstand gegen eine eigentlich hilfreiche Zahl.

## Woran du im Spiel siehst, ob es sitzt

Wenn du an der Chancenqualität gearbeitet hast, zeigt sich das zuerst in der Verteilung, nicht im Ergebnis:

- **Der Anteil der Abschlüsse aus dem Rückraum gegen Block sinkt.** Das ist die direkteste Rückmeldung auf ein besseres Angriffsspiel.
- **Die Zahl der Kreisanspiele steigt, ohne dass die technischen Fehler steigen.** Wenn beides steigt, ist die Idee richtig und die Ausführung noch nicht so weit.
- **Der xG-Wert je Angriff steigt, auch wenn die Torzahl gleich bleibt.** Über mehrere Spiele folgen die Tore der Chancenqualität.
- **Die Wurfquote bleibt stabil, obwohl ihr mehr abschließt.** Dann habt ihr Tempo gewonnen, ohne Qualität zu verlieren.

Die Zonen mitzuschreiben ist der ganze Aufwand. Wenn du Abschlüsse ohnehin mit Position erfasst, etwa über das Wurfbild in einer [Handball-Statistik-App](/), fällt die Zonenverteilung als Nebenprodukt ab und du musst nur noch die Wahrscheinlichkeiten dranschreiben.`,
  modules: [
    {
      kind: 'answerBox',
      text: 'Expected Goals (xG) bewerten, wie gut eine Torchance war, statt nur, ob sie drin war. Im Amateurhandball reichen fünf Wurfzonen mit je einer Trefferwahrscheinlichkeit aus dem eigenen Saisonschnitt. Der wichtigste Befund ist nicht die Differenz zur Torzahl, sondern wo eure Abschlüsse entstehen.',
    },
    {
      after: 'Die Rechnung – und warum du keine Datenbank brauchst',
      kind: 'formula',
      label: 'Erwartete Tore je Spiel',
      formula: 'xG = Σ (Würfe je Zone × Trefferwahrscheinlichkeit der Zone)',
      example:
        '6 Kreiswürfe × 0,70 + 22 Rückraumwürfe × 0,48 ergibt allein aus diesen beiden Zonen 4,2 + 10,6 = 14,8 erwartete Tore.',
    },
    {
      after: 'Realistische Zonenwerte als Startpunkt',
      kind: 'benchmarkTable',
      caption: 'Startwerte, bis du eigene hast',
      columns: ['Zone', 'Trefferwahrscheinlichkeit', 'Anmerkung'],
      rows: [
        ['Tempogegenstoß', '0,80–0,90', 'freier Abschluss gegen den Torwart'],
        ['Kreis / Nahdistanz', '0,65–0,75', 'stark abhängig vom Anspielzeitpunkt'],
        ['Außen', '0,55–0,70', 'spitzer Winkel, dafür meist unbedrängt'],
        ['Rückraum 9 m, frei', '0,45–0,55', 'Sprungwurf ohne geschlossenen Block'],
        ['Rückraum gegen Block', '0,25–0,35', 'die teuerste Abschlussart im Handball'],
      ],
      note: 'Erfahrungswerte aus dem Amateurbereich als Startpunkt, keine erhobene Statistik. Ersetze sie durch die tatsächlichen Quoten deiner Mannschaft, sobald acht bis zehn Spiele erfasst sind.',
    },
  ],
  faqs: [
    {
      question: 'Was sind Expected Goals (xG) im Handball?',
      answer:
        'Expected Goals bewerten die Qualität einer Torchance: Jeder Abschluss bekommt die Wahrscheinlichkeit, mit der er aus dieser Position und Situation zum Tor führt. Die Summe aller Werte eines Spiels ergibt die Torzahl, die zu erwarten gewesen wäre – der Vergleich mit den tatsächlichen Toren zeigt, ob es an der Chancenqualität oder am Abschluss lag.',
    },
    {
      question: 'Kann ich xG auch als Amateurtrainer nutzen?',
      answer:
        'Ja, in vereinfachter Form. Du brauchst fünf Wurfzonen und je eine Trefferwahrscheinlichkeit. Die Wahrscheinlichkeiten nimmst du am besten aus dem eigenen Saisonschnitt deiner Mannschaft, dann rechnest du mit echten Zahlen statt mit fremden Annahmen. Der Aufwand liegt allein darin, zu jedem Wurf die Zone zu notieren.',
    },
    {
      question: 'Warum ist xG aussagekräftiger als die reine Trefferquote?',
      answer:
        'Weil die Trefferquote nicht unterscheidet, woher geworfen wurde. Zwei Mannschaften mit identischer Quote können völlig unterschiedlich gespielt haben – eine hat sich Nahdistanzabschlüsse erarbeitet, die andere aus neun Metern gegen den Block geworfen. xG macht diesen Unterschied sichtbar.',
    },
    {
      question: 'Ab wie vielen Spielen ist ein xG-Wert belastbar?',
      answer:
        'Für die Verteilung der Abschlusszonen genügen wenige Spiele – sie ist schon nach drei bis vier Partien aussagekräftig. Für die Differenz zwischen erzielten und erwarteten Toren brauchst du eher zehn bis fünfzehn Spiele, weil diese Differenz stark schwankt.',
    },
  ],
  relatedSlugs: ['wurfquote-berechnen', 'handball-spielanalyse', 'handball-ballbesitz-tempo'],
};
