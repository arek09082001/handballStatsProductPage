#!/usr/bin/env python3
"""Erzeugt die kostenlose Handball-Statistik Excel-Vorlage.

Ausgabe: public/downloads/handball-statistik-vorlage.xlsx

Die Vorlage besteht aus fünf Blättern:

  Start           – Anleitung, Farblegende und die beiden Einstellungen
  Kader           – Mannschaftsliste (Eingabe)
  Spielprotokoll  – eine Zeile pro Aktion (Eingabe)
  Auswertung      – Werte pro Spieler für EIN Spiel (Formeln)
  Saison          – Spielliste und rollierende Saisonwerte (Formeln)

Leitgedanke: Es gibt genau zwei Blätter, in die getippt wird (Kader und
Spielprotokoll), plus die Spieleliste oben auf dem Saisonblatt. Alles andere
rechnet sich. Damit das ohne Lesen einer Anleitung erkennbar ist, sind
Eingabefelder beige, Beispieldaten dunkler beige und Rechenfelder weiß – die
Legende steht auf dem Startblatt.

Mannschaftsname und Saison trägt man einmal auf dem Startblatt ein; die
Kopfzeilen aller Blätter ziehen sich beides per Formel daraus. So lässt sich
die Vorlage auf den eigenen Verein umschreiben, ohne fünf Überschriften
einzeln zu suchen.

Alle Kennzahlen werden per Formel aus dem Spielprotokoll berechnet – es gibt
keine hart eingetragenen Ergebnisse. Nach dem Erzeugen wird die Datei mit
LibreOffice neu berechnet (scripts/recalc.py der xlsx-Skill), damit
Vorschauen und Tabellen-Apps sofort Werte anzeigen.

Aufruf:  python3 scripts/generate-handball-statistik-vorlage.py
"""

from __future__ import annotations

from pathlib import Path

from openpyxl import Workbook
from openpyxl.formatting.rule import ColorScaleRule, DataBarRule, FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.workbook.defined_name import DefinedName
from openpyxl.worksheet.datavalidation import DataValidation

OUTPUT = Path(__file__).resolve().parents[1] / "public" / "downloads" / "handball-statistik-vorlage.xlsx"

# --- Design: Trainertafel-Farben (siehe DESIGN.md) -------------------------
COURT = "12333D"          # dunkler Hallenboden – Kopfzeilen
COURT_SOFT = "2C4A5E"     # eine Stufe heller – Gruppenzeile über den Köpfen
MARKER = "F97316"         # Marker-Orange – Akzente
PAPER_1 = "FBF8F3"        # heller Papierton – Flächen auf dem Startblatt
PAPER_2 = "F0EAE0"        # Papier-Panel – Eingabefelder
EXAMPLE = "E7E0D4"        # Beispielzeilen
INK = "1B2230"
MUTED = "5A6472"

FONT = "Arial"

HEAD_FONT = Font(name=FONT, size=10, bold=True, color="FFFFFF")
GROUP_FONT = Font(name=FONT, size=9, bold=True, color="FFFFFF")
TITLE_FONT = Font(name=FONT, size=16, bold=True, color=INK)
SECTION_FONT = Font(name=FONT, size=12, bold=True, color=INK)
NOTE_FONT = Font(name=FONT, size=9, italic=True, color=MUTED)
BODY_FONT = Font(name=FONT, size=10, color=INK)
BOLD_FONT = Font(name=FONT, size=10, bold=True, color=INK)
MARKER_FONT = Font(name=FONT, size=11, bold=True, color="C2410C")
SEASON_FONT = Font(name=FONT, size=10, bold=True, color=MUTED)

HEAD_FILL = PatternFill("solid", fgColor=COURT)
GROUP_FILL = PatternFill("solid", fgColor=COURT_SOFT)
INPUT_FILL = PatternFill("solid", fgColor=PAPER_2)
EXAMPLE_FILL = PatternFill("solid", fgColor=EXAMPLE)
CALC_FILL = PatternFill("solid", fgColor="FFFFFF")
PANEL_FILL = PatternFill("solid", fgColor=PAPER_1)
TOTAL_FILL = PatternFill("solid", fgColor="FDE4CE")
WARN_FILL = PatternFill("solid", fgColor="FCD5CE")

THIN = Side(style="thin", color="C9C2B6")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

# Zahlen: die Null wird als Gedankenstrich gezeigt. Eine Tabelle voller Nullen
# liest sich am Spielfeldrand deutlich schlechter als eine, in der nur die
# Werte stehen, die es wirklich gab.
COUNT = '0;-0;"–"'
PERCENT = '0.0%;;"–"'

# --- Datenbereiche des Spielprotokolls ------------------------------------
FIRST_ROW = 4
LAST_ROW = 403
P_SPIEL = f"Spielprotokoll!$A${FIRST_ROW}:$A${LAST_ROW}"
P_NR = f"Spielprotokoll!$C${FIRST_ROW}:$C${LAST_ROW}"
P_AKTION = f"Spielprotokoll!$E${FIRST_ROW}:$E${LAST_ROW}"

KADER_FIRST = 4
KADER_LAST = 23  # 20 Kaderplätze

# Einstellungen auf dem Startblatt – jede Kopfzeile liest sie aus.
TEAM_CELL = "Start!$C$5"
SEASON_CELL = "Start!$C$6"

AKTIONEN = [
    "Tor",
    "Fehlwurf",
    "7m Tor",
    "7m Fehlwurf",
    "Assist",
    "Techn. Fehler",
    "Parade",
    "Gegentor",
    "2 Minuten",
    "Gelbe Karte",
    "Rote Karte",
]

ZONEN = [
    "Außen",
    "Kreis",
    "Rückraum",
    "Durchbruch",
    "Tempogegenstoß",
    "Siebenmeter",
]

POSITIONEN = [
    "Torwart",
    "Linksaußen",
    "Rückraum links",
    "Rückraum Mitte",
    "Rückraum rechts",
    "Rechtsaußen",
    "Kreisläufer",
]

BEISPIEL_KADER = [
    (1, "Tim Bergmann", "Torwart", 2003),
    (7, "Lukas Sander", "Rückraum Mitte", 2004),
    (9, "Nils Hofer", "Kreisläufer", 2002),
    (11, "Jan Weber", "Linksaußen", 2005),
]

BEISPIEL_PROTOKOLL = [
    ("Sp1", 3, 7, "Tor", "Rückraum", ""),
    ("Sp1", 5, 9, "Tor", "Kreis", ""),
    ("Sp1", 7, 7, "Fehlwurf", "Rückraum", "geblockt"),
    ("Sp1", 9, 1, "Parade", "", ""),
    ("Sp1", 11, 1, "Gegentor", "", ""),
    ("Sp1", 14, 11, "Tor", "Außen", ""),
    ("Sp1", 17, 7, "Techn. Fehler", "", "Schrittfehler"),
    ("Sp1", 19, 1, "Parade", "", ""),
    ("Sp1", 22, 9, "Fehlwurf", "Kreis", ""),
    ("Sp1", 24, 7, "7m Tor", "Siebenmeter", ""),
    ("Sp1", 26, 11, "Assist", "", ""),
    ("Sp1", 28, 7, "2 Minuten", "", ""),
    ("Sp1", 31, 1, "Gegentor", "", ""),
    ("Sp1", 35, 9, "Tor", "Kreis", ""),
]

BEISPIEL_HINWEIS = "Beispiel – überschreiben"


# --- kleine Bausteine ------------------------------------------------------
def style_group_row(ws, row: int, groups: list[tuple[str, int, int]]) -> None:
    """Zusammengefasste Überschrift über den eigentlichen Spaltenköpfen."""
    for label, first_column, last_column in groups:
        ws.merge_cells(
            start_row=row, start_column=first_column, end_row=row, end_column=last_column
        )
        for column in range(first_column, last_column + 1):
            cell = ws.cell(row=row, column=column)
            cell.fill = GROUP_FILL
            cell.border = BORDER
        cell = ws.cell(row=row, column=first_column, value=label)
        cell.font = GROUP_FONT
        cell.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[row].height = 16


def style_header(ws, row: int, headers: list[str]) -> None:
    for index, title in enumerate(headers, start=1):
        cell = ws.cell(row=row, column=index, value=title)
        cell.font = HEAD_FONT
        cell.fill = HEAD_FILL
        cell.border = BORDER
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    ws.row_dimensions[row].height = 30


def set_widths(ws, widths: dict[str, int]) -> None:
    for column, width in widths.items():
        ws.column_dimensions[column].width = width


def title_block(ws, title: str, note: str, last_column: int) -> None:
    """Kopfzeile eines Arbeitsblatts – Mannschaft und Saison kommen vom Start."""
    ws["A1"] = f'=IF({TEAM_CELL}="","{title}",{TEAM_CELL}&"  ·  {title}")'
    ws["A1"].font = TITLE_FONT
    ws.row_dimensions[1].height = 24

    season = ws.cell(row=1, column=last_column, value=f'=IF({SEASON_CELL}="","","Saison "&{SEASON_CELL})')
    season.font = SEASON_FONT
    season.alignment = Alignment(horizontal="right", vertical="center")

    ws.merge_cells(start_row=2, start_column=1, end_row=2, end_column=last_column)
    ws["A2"] = note
    ws["A2"].font = NOTE_FONT
    ws["A2"].alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    ws.row_dimensions[2].height = 28


def print_setup(ws, landscape: bool = False, repeat_row: str | None = None) -> None:
    ws.page_setup.orientation = "landscape" if landscape else "portrait"
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 0
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.page_margins.left = ws.page_margins.right = 0.4
    ws.page_margins.top = ws.page_margins.bottom = 0.5
    if repeat_row:
        ws.print_title_rows = repeat_row


def dropdown(ws, formula: str, target: str, error: str | None = None) -> None:
    validation = DataValidation(type="list", formula1=formula, allow_blank=True)
    if error:
        validation.error = error
        validation.errorTitle = "Bitte auswählen"
    validation.showErrorMessage = bool(error)
    ws.add_data_validation(validation)
    validation.add(target)


# --- Startblatt ------------------------------------------------------------
SCHRITTE = [
    (
        "1. Kader eintragen",
        "Blatt „Kader“: Rückennummer, Name und Position. Einmal pro Saison, fünf Minuten. "
        "Die Rückennummer ist der Schlüssel – überall sonst tippst du nur noch die Nummer.",
    ),
    (
        "2. Spiel anlegen",
        "Blatt „Saison“, obere Tabelle: eine kurze Bezeichnung (Sp1, Sp2 …), Datum und Gegner. "
        "Diese Bezeichnung taucht danach in jeder Auswahlliste auf.",
    ),
    (
        "3. Aktionen erfassen",
        "Blatt „Spielprotokoll“: pro Aktion eine Zeile – Spiel, Nummer, Aktion. "
        "Minute, Zone und Notiz sind freiwillig. Name und Auswertung laufen automatisch mit.",
    ),
    (
        "4. Ansehen und ausdrucken",
        "Blatt „Auswertung“ oben das Spiel auswählen: Quoten, Torwartwerte und das Ergebnis stehen da. "
        "Das Blatt „Saison“ zeigt dieselben Werte über alle Spiele.",
    ),
]

BLAETTER = [
    ("Kader", "Deine Mannschaft", "Du trägst ein – einmal pro Saison"),
    ("Spielprotokoll", "Jede Aktion eine Zeile", "Du trägst ein – während des Spiels"),
    ("Auswertung", "Ein Spiel, alle Spieler", "Rechnet automatisch – nur Spiel auswählen"),
    ("Saison", "Spieleliste und Saisonwerte", "Spiele einträgst du, der Rest rechnet"),
]

LEGENDE = [
    (INPUT_FILL, "Beige", "Hier trägst du etwas ein."),
    (EXAMPLE_FILL, "Dunkler beige", "Beispieldaten. Überschreiben oder Inhalte löschen – die Formeln bleiben."),
    (CALC_FILL, "Weiß mit Rahmen", "Rechnet sich selbst. Am besten nicht hineintippen."),
    (TOTAL_FILL, "Orange", "Summenzeile der Mannschaft."),
]


def build_start(ws) -> None:
    ws["B1"] = "Handball-Statistik – die Vorlage"
    ws["B1"].font = Font(name=FONT, size=18, bold=True, color=INK)
    ws.row_dimensions[1].height = 26

    ws.merge_cells("B2:D2")
    ws["B2"] = (
        "Zwei Blätter zum Ausfüllen, drei die rechnen. Du brauchst keine Excel-Kenntnisse: "
        "Kader eintragen, Spiel anlegen, Aktionen tippen – Quoten und Saisonwerte entstehen von selbst."
    )
    ws["B2"].font = NOTE_FONT
    ws["B2"].alignment = Alignment(wrap_text=True, vertical="center")
    ws.row_dimensions[2].height = 30

    # --- Einstellungen ----------------------------------------------------
    ws["B4"] = "1 · Deine Einstellungen"
    ws["B4"].font = SECTION_FONT

    for row, (label, value, hint) in enumerate(
        [
            ("Mannschaft", "TSV Musterstadt", "Steht danach oben auf jedem Blatt."),
            ("Saison", "2026/27", "Erscheint rechts oben auf jedem Blatt."),
        ],
        start=5,
    ):
        ws.cell(row=row, column=2, value=label).font = BOLD_FONT
        cell = ws.cell(row=row, column=3, value=value)
        cell.font = MARKER_FONT
        cell.fill = INPUT_FILL
        cell.border = BORDER
        cell.alignment = Alignment(horizontal="left", vertical="center")
        note = ws.cell(row=row, column=4, value=hint)
        note.font = NOTE_FONT
        note.alignment = Alignment(vertical="center")
        ws.row_dimensions[row].height = 20

    # --- Schritte ---------------------------------------------------------
    ws["B8"] = "2 · In vier Schritten zur Statistik"
    ws["B8"].font = SECTION_FONT

    row = 9
    for label, text in SCHRITTE:
        cell = ws.cell(row=row, column=2, value=label)
        cell.font = BOLD_FONT
        cell.fill = PANEL_FILL
        cell.border = BORDER
        cell.alignment = Alignment(vertical="center", wrap_text=True)

        ws.merge_cells(start_row=row, start_column=3, end_row=row, end_column=4)
        text_cell = ws.cell(row=row, column=3, value=text)
        text_cell.font = BODY_FONT
        text_cell.fill = PANEL_FILL
        text_cell.alignment = Alignment(vertical="center", wrap_text=True)
        ws.cell(row=row, column=4).fill = PANEL_FILL
        for column in (3, 4):
            ws.cell(row=row, column=column).border = BORDER
        ws.row_dimensions[row].height = 34
        row += 1

    # --- Farblegende ------------------------------------------------------
    row += 1
    ws.cell(row=row, column=2, value="3 · Woran du Eingabefelder erkennst").font = SECTION_FONT
    row += 1
    for fill, label, text in LEGENDE:
        swatch = ws.cell(row=row, column=2, value=label)
        swatch.fill = fill
        swatch.border = BORDER
        swatch.font = BOLD_FONT
        swatch.alignment = Alignment(horizontal="center", vertical="center")
        ws.merge_cells(start_row=row, start_column=3, end_row=row, end_column=4)
        described = ws.cell(row=row, column=3, value=text)
        described.font = BODY_FONT
        described.alignment = Alignment(vertical="center", wrap_text=True)
        ws.row_dimensions[row].height = 20
        row += 1

    # --- Blattübersicht ---------------------------------------------------
    row += 1
    ws.cell(row=row, column=2, value="4 · Die Blätter der Vorlage").font = SECTION_FONT
    row += 1
    for index, title in enumerate(["Blatt", "Wofür es da ist", "Was du tust"], start=2):
        cell = ws.cell(row=row, column=index, value=title)
        cell.font = HEAD_FONT
        cell.fill = HEAD_FILL
        cell.border = BORDER
        cell.alignment = Alignment(horizontal="left", vertical="center")
    ws.row_dimensions[row].height = 20
    row += 1
    for name, purpose, doing in BLAETTER:
        ws.cell(row=row, column=2, value=name).font = BOLD_FONT
        ws.cell(row=row, column=3, value=purpose).font = BODY_FONT
        ws.cell(row=row, column=4, value=doing).font = BODY_FONT
        for column in (2, 3, 4):
            cell = ws.cell(row=row, column=column)
            cell.border = BORDER
            cell.alignment = Alignment(vertical="center", wrap_text=True)
        ws.row_dimensions[row].height = 18
        row += 1

    # --- Kleingedrucktes --------------------------------------------------
    row += 1
    ws.merge_cells(start_row=row, start_column=2, end_row=row, end_column=4)
    ws.cell(
        row=row,
        column=2,
        value=(
            "Platz: 20 Kaderplätze, 400 Aktionszeilen, 30 Spiele. Reicht das nicht, markierst du die letzte "
            "Zeile und ziehst sie nach unten – die Formeln wandern mit. Eigene Vereinsfarben: Zellen markieren "
            "und wie gewohnt einfärben, an den Formeln ändert das nichts."
        ),
    ).font = NOTE_FONT
    ws.cell(row=row, column=2).alignment = Alignment(wrap_text=True, vertical="center")
    ws.row_dimensions[row].height = 30

    set_widths(ws, {"A": 3, "B": 24, "C": 34, "D": 52})
    print_setup(ws)


def build_kader(ws) -> None:
    title_block(
        ws,
        "Kader",
        "Deine Mannschaft – einmal pro Saison eintragen. Die Rückennummer ist der Schlüssel für alle anderen "
        "Blätter und muss eindeutig sein. Position wählst du aus der Liste. Die dunkler hinterlegten Zeilen "
        "sind Beispiele: überschreiben oder Inhalte löschen.",
        5,
    )
    style_header(ws, 3, ["Nr.", "Name", "Position", "Jahrgang", "Notiz"])

    for row in range(KADER_FIRST, KADER_LAST + 1):
        is_example = row - KADER_FIRST < len(BEISPIEL_KADER)
        values = BEISPIEL_KADER[row - KADER_FIRST] if is_example else ("", "", "", "")
        for column, value in enumerate(values, start=1):
            cell = ws.cell(row=row, column=column, value=value if value != "" else None)
            cell.font = BODY_FONT
            cell.border = BORDER
            cell.fill = EXAMPLE_FILL if is_example else INPUT_FILL
            cell.alignment = Alignment(horizontal="center" if column in (1, 4) else "left")
        notiz = ws.cell(row=row, column=5, value=BEISPIEL_HINWEIS if is_example else None)
        notiz.border = BORDER
        notiz.font = NOTE_FONT if is_example else BODY_FONT
        notiz.fill = EXAMPLE_FILL if is_example else INPUT_FILL
        ws.row_dimensions[row].height = 18

    dropdown(
        ws,
        '"' + ",".join(POSITIONEN) + '"',
        f"C{KADER_FIRST}:C{KADER_LAST}",
        "Bitte eine Position aus der Liste wählen.",
    )

    # Eine doppelte Rückennummer macht die Auswertung still falsch – deshalb
    # färbt die Vorlage sie rot, sobald sie ein zweites Mal auftaucht.
    ws.conditional_formatting.add(
        f"A{KADER_FIRST}:A{KADER_LAST}",
        FormulaRule(
            formula=[
                f'AND($A{KADER_FIRST}<>"",COUNTIF($A${KADER_FIRST}:$A${KADER_LAST},$A{KADER_FIRST})>1)'
            ],
            fill=WARN_FILL,
            font=Font(name=FONT, size=10, bold=True, color="9B1C1C"),
        ),
    )

    ws.cell(
        row=KADER_LAST + 2,
        column=1,
        value="Rot hinterlegte Nummer = doppelt vergeben. Jede Rückennummer darf nur einmal vorkommen.",
    ).font = NOTE_FONT

    set_widths(ws, {"A": 6, "B": 26, "C": 18, "D": 10, "E": 30})
    ws.freeze_panes = "A4"
    print_setup(ws, repeat_row="3:3")


def build_protokoll(ws) -> None:
    title_block(
        ws,
        "Spielprotokoll",
        "Eine Zeile pro Aktion – live am Spielfeldrand oder hinterher vom Video. Pflicht sind nur Spiel, "
        "Nr. und Aktion; Minute, Zone und Notiz kannst du weglassen. Spiel, Aktion und Zone wählst du aus "
        "Listen, der Name kommt automatisch aus dem Kader.",
        7,
    )
    style_header(
        ws,
        3,
        [
            "Spiel",
            "Minute (optional)",
            "Nr.",
            "Name (automatisch)",
            "Aktion",
            "Zone (optional)",
            "Notiz (optional)",
        ],
    )

    for row in range(FIRST_ROW, LAST_ROW + 1):
        example_index = row - FIRST_ROW
        is_example = example_index < len(BEISPIEL_PROTOKOLL)
        fill = EXAMPLE_FILL if is_example else INPUT_FILL

        if is_example:
            spiel, minute, nummer, aktion, zone, notiz = BEISPIEL_PROTOKOLL[example_index]
            ws.cell(row=row, column=1, value=spiel)
            ws.cell(row=row, column=2, value=minute)
            ws.cell(row=row, column=3, value=nummer)
            ws.cell(row=row, column=5, value=aktion)
            ws.cell(row=row, column=6, value=zone or None)
            ws.cell(row=row, column=7, value=notiz or None)

        # Name wird immer aus dem Kader gezogen (Nachschlag über die Nummer).
        ws.cell(
            row=row,
            column=4,
            value=(
                f'=IF($C{row}="","",'
                f'IFERROR(INDEX(Kader!$B${KADER_FIRST}:$B${KADER_LAST},'
                f'MATCH($C{row},Kader!$A${KADER_FIRST}:$A${KADER_LAST},0)),"Nr. nicht im Kader"))'
            ),
        )

        for column in range(1, 8):
            cell = ws.cell(row=row, column=column)
            cell.font = BODY_FONT
            cell.border = BORDER
            cell.fill = CALC_FILL if column == 4 else fill
            cell.alignment = Alignment(horizontal="center" if column in (2, 3) else "left")

    dropdown(ws, "=Spiele", f"A{FIRST_ROW}:A{LAST_ROW}")
    dropdown(
        ws,
        '"' + ",".join(AKTIONEN) + '"',
        f"E{FIRST_ROW}:E{LAST_ROW}",
        "Bitte eine Aktion aus der Liste wählen.",
    )
    dropdown(ws, '"' + ",".join(ZONEN) + '"', f"F{FIRST_ROW}:F{LAST_ROW}")

    # Tippfehler in der Rückennummer sind der häufigste Fehler beim Erfassen.
    ws.conditional_formatting.add(
        f"C{FIRST_ROW}:D{LAST_ROW}",
        FormulaRule(
            formula=[f'$D{FIRST_ROW}="Nr. nicht im Kader"'],
            fill=WARN_FILL,
            font=Font(name=FONT, size=10, bold=True, color="9B1C1C"),
        ),
    )

    ws.auto_filter.ref = f"A3:G{LAST_ROW}"
    set_widths(ws, {"A": 14, "B": 10, "C": 6, "D": 24, "E": 15, "F": 17, "G": 26})
    ws.freeze_panes = "A4"
    print_setup(ws, repeat_row="3:3")


def counts(criteria: str, nr_cell: str, spiel_cell: str | None) -> str:
    """COUNTIFS über das Protokoll – optional auf ein Spiel eingegrenzt."""
    if spiel_cell:
        return f'COUNTIFS({P_SPIEL},{spiel_cell},{P_NR},{nr_cell},{P_AKTION},"{criteria}")'
    return f'COUNTIFS({P_NR},{nr_cell},{P_AKTION},"{criteria}")'


def game_lookup(column: int, first_game: int, last_game: int) -> str:
    """Datum, Gegner oder Toranzahl des oben gewählten Spiels."""
    return (
        f'=IFERROR(INDEX(Saison!${get_column_letter(column)}${first_game}:'
        f'${get_column_letter(column)}${last_game},'
        f'MATCH($B$3,Saison!$A${first_game}:$A${last_game},0)),"")'
    )


def build_auswertung(ws, first_game: int, last_game: int) -> None:
    title_block(
        ws,
        "Auswertung (ein Spiel)",
        "Oben das Spiel auswählen – alles darunter rechnet sich neu. Würfe = Tore + Fehlwürfe aus dem Feld, "
        "Siebenmeter zählen separat. ± = Tore (inkl. 7 m) − Fehlwürfe (inkl. 7 m) − technische Fehler. "
        "In diesem Blatt musst du außer dem Spiel nichts eintragen.",
        15,
    )

    # --- Kopfzeile: Spielauswahl und Ergebnis ------------------------------
    ws["A3"] = "Spiel:"
    ws["A3"].font = BOLD_FONT
    ws["A3"].alignment = Alignment(horizontal="right", vertical="center")
    ws["B3"] = "Sp1"
    ws["B3"].font = MARKER_FONT
    ws["B3"].fill = INPUT_FILL
    ws["B3"].border = BORDER
    ws["B3"].alignment = Alignment(horizontal="center", vertical="center")

    dropdown(ws, "=Spiele", "B3")

    tore = game_lookup(4, first_game, last_game)[1:]
    gegentore = game_lookup(5, first_game, last_game)[1:]
    info = [
        (3, "Datum:", game_lookup(2, first_game, last_game), 4),
        (5, "Gegner:", game_lookup(3, first_game, last_game), 6),
        (
            8,
            "Ergebnis:",
            # Nur zeigen, wenn die Bezeichnung wirklich in der Spieleliste
            # steht – sonst stünde hier ein nacktes " : ".
            f'=IF(COUNTIF(Spiele,$B$3)=0,"",{tore}&" : "&{gegentore})',
            9,
        ),
    ]
    for label_column, label, formula, value_column in info:
        head = ws.cell(row=3, column=label_column, value=label)
        head.font = BOLD_FONT
        head.alignment = Alignment(horizontal="right", vertical="center")
        value = ws.cell(row=3, column=value_column, value=formula)
        value.font = MARKER_FONT if value_column == 9 else BODY_FONT
        value.alignment = Alignment(horizontal="left", vertical="center")
    ws.row_dimensions[3].height = 22

    ws.merge_cells("D3:E3")
    ws.merge_cells("F3:G3")
    ws.merge_cells("I3:K3")

    headers = [
        "Nr.",
        "Name",
        "Würfe",
        "Tore",
        "Wurfquote",
        "7m Würfe",
        "7m Tore",
        "7m-Quote",
        "Assists",
        "Techn. Fehler",
        "Zeitstrafen",
        "±",
        "Paraden",
        "Gegentore",
        "Paradenquote",
    ]
    group_row = 5
    header_row = 6
    style_group_row(
        ws,
        group_row,
        [
            ("Spieler", 1, 2),
            ("Feldwürfe", 3, 5),
            ("Siebenmeter", 6, 8),
            ("Spielgestaltung", 9, 12),
            ("Torwart", 13, 15),
        ],
    )
    style_header(ws, header_row, headers)

    first = header_row + 1
    last = first + (KADER_LAST - KADER_FIRST)

    for offset, row in enumerate(range(first, last + 1)):
        kader_row = KADER_FIRST + offset
        nr = f"$A{row}"
        guard = f'IF($A{row}="","",'

        tore = counts("Tor", nr, "$B$3")
        fehl = counts("Fehlwurf", nr, "$B$3")
        sieben_tor = counts("7m Tor", nr, "$B$3")
        sieben_fehl = counts("7m Fehlwurf", nr, "$B$3")
        techn = counts("Techn. Fehler", nr, "$B$3")

        formulas = {
            1: f'=IF(Kader!$A{kader_row}="","",Kader!$A{kader_row})',
            2: f'=IF(Kader!$B{kader_row}="","",Kader!$B{kader_row})',
            3: f"={guard}{tore}+{fehl})",
            4: f"={guard}{tore})",
            5: f'={guard}IFERROR($D{row}/$C{row},""))',
            6: f"={guard}{sieben_tor}+{sieben_fehl})",
            7: f"={guard}{sieben_tor})",
            8: f'={guard}IFERROR($G{row}/$F{row},""))',
            9: f'={guard}{counts("Assist", nr, "$B$3")})',
            10: f"={guard}{techn})",
            11: f'={guard}{counts("2 Minuten", nr, "$B$3")})',
            12: f"={guard}($D{row}+$G{row})-($C{row}-$D{row})-($F{row}-$G{row})-$J{row})",
            13: f'={guard}{counts("Parade", nr, "$B$3")})',
            14: f'={guard}{counts("Gegentor", nr, "$B$3")})',
            15: f'={guard}IFERROR($M{row}/($M{row}+$N{row}),""))',
        }

        for column, formula in formulas.items():
            cell = ws.cell(row=row, column=column, value=formula)
            cell.font = BODY_FONT
            cell.border = BORDER
            cell.fill = CALC_FILL
            cell.alignment = Alignment(horizontal="center" if column != 2 else "left")
            if column in (5, 8, 15):
                cell.number_format = PERCENT
            elif column >= 3:
                cell.number_format = COUNT
        ws.row_dimensions[row].height = 18

    total_row = last + 1
    ws.cell(row=total_row, column=1, value="")
    ws.cell(row=total_row, column=2, value="Mannschaft gesamt")
    for column in (3, 4, 6, 7, 9, 10, 11, 12, 13, 14):
        letter = get_column_letter(column)
        ws.cell(row=total_row, column=column, value=f"=SUM({letter}{first}:{letter}{last})")
    ws.cell(row=total_row, column=5, value=f'=IFERROR($D{total_row}/$C{total_row},"")')
    ws.cell(row=total_row, column=8, value=f'=IFERROR($G{total_row}/$F{total_row},"")')
    ws.cell(
        row=total_row,
        column=15,
        value=f'=IFERROR($M{total_row}/($M{total_row}+$N{total_row}),"")',
    )
    for column in range(1, 16):
        cell = ws.cell(row=total_row, column=column)
        cell.font = BOLD_FONT
        cell.fill = TOTAL_FILL
        cell.border = BORDER
        cell.alignment = Alignment(horizontal="center" if column != 2 else "left")
        if column in (5, 8, 15):
            cell.number_format = PERCENT
        elif column >= 3:
            cell.number_format = COUNT

    # Quoten farbig: rot unter 40 %, grün ab 70 %. Das ersetzt das Vergleichen
    # von fünfzehn Prozentzahlen mit dem Finger auf dem Bildschirm.
    for column in ("E", "H", "O"):
        ws.conditional_formatting.add(
            f"{column}{first}:{column}{last}",
            ColorScaleRule(
                start_type="num", start_value=0.2, start_color="F8B4B4",
                mid_type="num", mid_value=0.45, mid_color="FDE68A",
                end_type="num", end_value=0.75, end_color="A7D8A0",
            ),
        )
    ws.conditional_formatting.add(
        f"D{first}:D{last}",
        DataBarRule(start_type="num", start_value=0, end_type="max", color=MARKER, showValue=True),
    )

    ws.cell(
        row=total_row + 2,
        column=1,
        value="Wurfquote = Tore ÷ Würfe. Paradenquote = Paraden ÷ (Paraden + Gegentore). "
        "Ein „–“ heißt: in diesem Spiel keine Aktion dieser Art erfasst.",
    ).font = NOTE_FONT

    set_widths(
        ws,
        {
            "A": 6,
            "B": 24,
            "C": 8,
            "D": 8,
            "E": 11,
            "F": 10,
            "G": 9,
            "H": 10,
            "I": 9,
            "J": 13,
            "K": 12,
            "L": 7,
            "M": 9,
            "N": 11,
            "O": 13,
        },
    )
    ws.freeze_panes = "C7"
    print_setup(ws, landscape=True, repeat_row="5:6")


def build_saison(ws) -> tuple[int, int]:
    title_block(
        ws,
        "Saison",
        "Oben legst du die Spiele an – genau diese Bezeichnungen erscheinen danach als Auswahlliste im "
        "Protokoll und in der Auswertung. Tore und Gegentore je Spiel rechnen sich aus dem Protokoll, "
        "ebenso die Saisonwerte weiter unten.",
        5,
    )

    game_header = 3
    style_header(
        ws,
        game_header,
        ["Spiel", "Datum", "Gegner", "Eigene Tore", "Gegentore"],
    )

    first_game = game_header + 1
    last_game = first_game + 29  # 30 Spiele

    for row in range(first_game, last_game + 1):
        is_example = row == first_game
        fill = EXAMPLE_FILL if is_example else INPUT_FILL
        if is_example:
            ws.cell(row=row, column=1, value="Sp1")
            ws.cell(row=row, column=2, value="12.09.2026")
            ws.cell(row=row, column=3, value="TSV Musterstadt")

        ws.cell(
            row=row,
            column=4,
            value=(
                f'=IF($A{row}="","",'
                f'COUNTIFS({P_SPIEL},$A{row},{P_AKTION},"Tor")'
                f'+COUNTIFS({P_SPIEL},$A{row},{P_AKTION},"7m Tor"))'
            ),
        )
        ws.cell(
            row=row,
            column=5,
            value=(
                f'=IF($A{row}="","",COUNTIFS({P_SPIEL},$A{row},{P_AKTION},"Gegentor"))'
            ),
        )

        for column in range(1, 6):
            cell = ws.cell(row=row, column=column)
            cell.font = BODY_FONT
            cell.border = BORDER
            cell.alignment = Alignment(horizontal="center" if column in (1, 4, 5) else "left")
            cell.fill = fill if column <= 3 else CALC_FILL
            if column >= 4:
                cell.number_format = COUNT
        ws.row_dimensions[row].height = 18

    # --- Saisonwerte pro Spieler ------------------------------------------
    season_title = last_game + 2
    ws.cell(row=season_title, column=1, value="Saisonwerte pro Spieler").font = SECTION_FONT
    ws.cell(
        row=season_title + 1,
        column=1,
        value="Alle Spiele zusammen – nichts einzutragen, alles gerechnet.",
    ).font = NOTE_FONT

    group_row = season_title + 2
    season_header = group_row + 1

    headers = [
        "Nr.",
        "Name",
        "Spiele",
        "Würfe",
        "Tore (Feld)",
        "Wurfquote",
        "7m Würfe",
        "7m Tore",
        "Tore gesamt",
        "Assists",
        "Techn. Fehler",
        "Zeitstrafen",
        "±",
        "Paraden",
        "Gegentore",
        "Paradenquote",
    ]
    style_group_row(
        ws,
        group_row,
        [
            ("Spieler", 1, 3),
            ("Feldwürfe", 4, 6),
            ("Siebenmeter", 7, 9),
            ("Spielgestaltung", 10, 13),
            ("Torwart", 14, 16),
        ],
    )
    style_header(ws, season_header, headers)

    first = season_header + 1
    last = first + (KADER_LAST - KADER_FIRST)
    game_list = f"$A${first_game}:$A${last_game}"

    for offset, row in enumerate(range(first, last + 1)):
        kader_row = KADER_FIRST + offset
        nr = f"$A{row}"
        guard = f'IF($A{row}="","",'

        tore = counts("Tor", nr, None)
        fehl = counts("Fehlwurf", nr, None)
        sieben_tor = counts("7m Tor", nr, None)
        sieben_fehl = counts("7m Fehlwurf", nr, None)

        formulas = {
            1: f'=IF(Kader!$A{kader_row}="","",Kader!$A{kader_row})',
            2: f'=IF(Kader!$B{kader_row}="","",Kader!$B{kader_row})',
            # Spiele mit mindestens einer erfassten Aktion.
            3: (
                f"={guard}SUMPRODUCT(({game_list}<>\"\")*"
                f"(COUNTIFS({P_SPIEL},{game_list},{P_NR},{nr})>0)))"
            ),
            4: f"={guard}{tore}+{fehl})",
            5: f"={guard}{tore})",
            6: f'={guard}IFERROR($E{row}/$D{row},""))',
            7: f"={guard}{sieben_tor}+{sieben_fehl})",
            8: f"={guard}{sieben_tor})",
            9: f"={guard}$E{row}+$H{row})",
            10: f'={guard}{counts("Assist", nr, None)})',
            11: f'={guard}{counts("Techn. Fehler", nr, None)})',
            12: f'={guard}{counts("2 Minuten", nr, None)})',
            13: f"={guard}($E{row}+$H{row})-($D{row}-$E{row})-($G{row}-$H{row})-$K{row})",
            14: f'={guard}{counts("Parade", nr, None)})',
            15: f'={guard}{counts("Gegentor", nr, None)})',
            16: f'={guard}IFERROR($N{row}/($N{row}+$O{row}),""))',
        }

        for column, formula in formulas.items():
            cell = ws.cell(row=row, column=column, value=formula)
            cell.font = BODY_FONT
            cell.border = BORDER
            cell.fill = CALC_FILL
            cell.alignment = Alignment(horizontal="center" if column != 2 else "left")
            if column in (6, 16):
                cell.number_format = PERCENT
            elif column >= 3:
                cell.number_format = COUNT
        ws.row_dimensions[row].height = 18

    total_row = last + 1
    ws.cell(row=total_row, column=2, value="Mannschaft gesamt")
    for column in (4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15):
        letter = get_column_letter(column)
        ws.cell(row=total_row, column=column, value=f"=SUM({letter}{first}:{letter}{last})")
    ws.cell(row=total_row, column=6, value=f'=IFERROR($E{total_row}/$D{total_row},"")')
    ws.cell(
        row=total_row,
        column=16,
        value=f'=IFERROR($N{total_row}/($N{total_row}+$O{total_row}),"")',
    )
    for column in range(1, 17):
        cell = ws.cell(row=total_row, column=column)
        cell.font = BOLD_FONT
        cell.fill = TOTAL_FILL
        cell.border = BORDER
        cell.alignment = Alignment(horizontal="center" if column != 2 else "left")
        if column in (6, 16):
            cell.number_format = PERCENT
        elif column >= 3:
            cell.number_format = COUNT

    for column in ("F", "P"):
        ws.conditional_formatting.add(
            f"{column}{first}:{column}{last}",
            ColorScaleRule(
                start_type="num", start_value=0.2, start_color="F8B4B4",
                mid_type="num", mid_value=0.45, mid_color="FDE68A",
                end_type="num", end_value=0.75, end_color="A7D8A0",
            ),
        )
    ws.conditional_formatting.add(
        f"I{first}:I{last}",
        DataBarRule(start_type="num", start_value=0, end_type="max", color=MARKER, showValue=True),
    )

    ws.cell(
        row=total_row + 2,
        column=1,
        value="„Spiele“ zählt alle Partien, in denen für die Nummer mindestens eine Aktion erfasst wurde. "
        "± = Tore (inkl. 7 m) − Fehlwürfe (inkl. 7 m) − technische Fehler.",
    ).font = NOTE_FONT

    set_widths(
        ws,
        {
            "A": 8,
            "B": 24,
            "C": 8,
            "D": 8,
            "E": 12,
            "F": 11,
            "G": 10,
            "H": 9,
            "I": 12,
            "J": 9,
            "K": 13,
            "L": 12,
            "M": 7,
            "N": 9,
            "O": 11,
            "P": 13,
        },
    )
    # Kein Fixieren: unter der Spieleliste folgt eine zweite Tabelle, eine
    # eingefrorene Kopfzeile aus der ersten würde beim Scrollen stören.
    print_setup(ws, landscape=True)

    return first_game, last_game


TAB_COLORS = {
    "Start": MARKER,
    "Kader": COURT,
    "Spielprotokoll": COURT,
    "Auswertung": COURT_SOFT,
    "Saison": COURT_SOFT,
}


def main() -> None:
    workbook = Workbook()

    start = workbook.active
    start.title = "Start"
    kader = workbook.create_sheet("Kader")
    protokoll = workbook.create_sheet("Spielprotokoll")
    auswertung = workbook.create_sheet("Auswertung")
    saison = workbook.create_sheet("Saison")

    build_start(start)
    build_kader(kader)
    build_protokoll(protokoll)
    first_game, last_game = build_saison(saison)
    build_auswertung(auswertung, first_game, last_game)

    # Benannter Bereich für die Spiel-Auswahllisten (Protokoll + Auswertung).
    workbook.defined_names["Spiele"] = DefinedName(
        "Spiele", attr_text=f"Saison!$A${first_game}:$A${last_game}"
    )

    for sheet in workbook.worksheets:
        sheet.sheet_view.showGridLines = False
        sheet.sheet_properties.tabColor = TAB_COLORS[sheet.title]

    start.sheet_view.zoomScale = 110
    workbook.active = 0

    # Die Datei wird ohne zwischengespeicherte Ergebnisse geschrieben (openpyxl
    # kann Formeln nicht rechnen). Mit fullCalcOnLoad rechnet jede Tabellen-App
    # beim Öffnen einmal komplett durch, sodass sofort Werte im Blatt stehen.
    workbook.calculation.fullCalcOnLoad = True

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    workbook.save(OUTPUT)
    print(f"geschrieben: {OUTPUT}")


if __name__ == "__main__":
    main()
