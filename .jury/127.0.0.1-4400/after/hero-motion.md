# Hero-Gerätebewegung wiederhergestellt

Auf Wunsch bleiben das langsame Schweben von Tablet/Handy und die sanfte Mausneigung erhalten. Beide Produktbilder sind direkt im serverseitigen Ausgangsbild sichtbar; es gibt keine verdeckte Einflugphase. Die vorhandene Framer-Motion-Abhängigkeit steuert die begrenzte Neigung, CSS das Schweben (6/7 Sekunden, bis 6 px).

Das Schweben startet nach drei Sekunden und pausiert außerhalb des Viewports. Mausneigung gilt nur für feine Zeiger. Reduced Motion deaktiviert beides und setzt die Neigung auch bei laufendem Einstellungswechsel unmittelbar zurück. Keine neue Abhängigkeit, kein zusätzlicher GSAP-Import für den Hero. DESIGN.md dokumentiert diese Präferenz statt der zuvor vereinbarten komplett ruhigen Gerätepose.

Produktionsbuild und Lint bestanden (0 Fehler, 18 bestehende Warnungen). Browserprüfung: beide Float-Animationen laufen, Pointer verändert die 3D-Pose, dynamisches Reduced Motion stoppt alle Hero-Animationen und setzt den Transform zurück; außerhalb des Viewports pausieren beide Geräte. Kein Overflow und keine App-Exceptions im Desktoptest. Rohdaten: [hero-motion-check.json](hero-motion-check.json).

Die frühere unabhängige Jury-Scorecard beschreibt den damaligen Stand mit ruhender Gerätepose; diese kleine Nachkorrektur erhält keine erfundene neue Jury-Wertung.

Separater Lighthouse-Nachtest: Performance 78, Accessibility 100, Best Practices 96, SEO 100; simulierter LCP 4.246 ms, TBT 343 ms, CLS 0. Damit weiterhin über der ursprünglichen Baseline (Performance 52, LCP 5.148 ms); gegenüber dem vorangegangenen einzelnen Lauf (79 / 3.833 ms) schwanken Score/LCP. Keine Behauptung identischer Performance und keine Feld-CWV-Messung. Daten: [hero-motion-lighthouse.json](hero-motion-lighthouse.json).
