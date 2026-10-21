# Korrektur: KPI-Kreidestaub neben dem Cursor

Ursache war Commit `b1ec312`: Die Canvas-Auflösung wurde auf maximal einen Geräte-Pixel pro CSS-Pixel begrenzt, aber die Eingabekoordinaten weiterhin mit dem vollständigen `devicePixelRatio` multipliziert. Bei DPR 2 wurde deshalb ein Zeiger bei 25 % Canvasbreite an 50 % Breite an den Shader übergeben. Im ursprünglichen Stand `2f52c35` waren beide Skalierungen noch gleich.

`getCanvasPos` rechnet jetzt vom angezeigten Canvas-Rechteck in die tatsächlichen Buffer-Abmessungen um. So stimmen beide Achsen auch bei hoher Pixeldichte, Browser-Zoom oder CSS-Skalierung überein. Die Begrenzung der Renderauflösung bleibt erhalten.

Prüfung am lokalen Produktionsbuild: 18 Mausereignis-zu-Shader-Prüfungen bestanden (DPR 1 / 1,5 / 2; CSS-Skalierung 1 / 0,8; Positionen links/Mitte/rechts mit unterschiedlichen Höhen). Gemessen wurden die tatsächlichen `point`-Uniforms des WebGL-Solvers. Dafür wurde ausschließlich im Browser-Prüfskript die Software-Renderer-Erkennung überschrieben, um den echten Solver unter Headless Chromium auszuführen. Das ist ein Eingabe-Koordinatentest, kein Nachweis visueller Qualität oder GPU-Performance auf echter Hardware. Ergebnisse: [smoke-cursor-regression.json](smoke-cursor-regression.json).

`npm run lint`: Exit 0, 0 Fehler / 18 bestehende Warnungen. `npm run build`: Exit 0. `git diff --check`: Exit 0. Keine zusätzlichen Projektabhängigkeiten.
