# Statix — Design system: "Die Trainertafel"

The landing page is built as a **coach's tactic board**. A handball coach draws
plays on a magnetic board: the court with its 6‑m and 9‑m arcs, player magnets
with jersey numbers, marker arrows, quick hand‑written notes. Statix turns that
analog ritual into live data — so the marketing surface *is* the board.

This file owns durable visual rules for the landing page and any surface that
adopts the world. Product facts live in `PRODUCT.md`. The `ratgeber` guide
pages adopt this world in a **Read** register — see "Ratgeber (Read surface)"
below.

## THESIS

Statix is the coach's tactic board that keeps score. The page refuses the
generic dark‑SaaS arrangement (gradient headline, radial‑blob glows,
glassmorphism cards, faux‑browser screenshot chrome) and instead reads like a
real board: chalk court lines, marker ink, jersey numbers, magnets and arrows,
alternating between the dark **court** and warm **paper** grounds.

## Grounds (the two sides of the board)

Light‑dominant page (bright hall is the primary scene); the dark court is used
for signature/immersive bands in a deliberate rhythm.

- **Paper** — warm clipboard off‑white, the primary reading ground. Faint paper
  grain, ink text. Sections: showcase, tournament, collaboration, features,
  pros, faq, contact.
- **Court** — deep desaturated blue‑green playing floor, the dark signature
  ground. Chalk‑white court markings, marker accents. Sections: hero, stats
  scoreboard, AI, live‑ticker, newsletter, final CTA.

Rhythm: court → court(scoreboard) → paper → court → paper → court → paper ×4 →
court → paper → court. Never more than two courts in a row except the
hero+scoreboard unit.

## Color tokens (HSL triplets, in `app/globals.css`)

| role | token | value | use |
|---|---|---|---|
| Paper ground | `--paper` | `40 33% 96%` | primary light surface |
| Paper panel | `--paper-2` | `38 30% 92%` | inset panels, table zebra |
| Ink | `--ink` | `222 24% 13%` | text on paper |
| Court ground | `--court` | `199 46% 12%` | primary dark surface |
| Court panel | `--court-2` | `200 42% 17%` | cards/panels on court |
| Court line | `--chalk` | `0 0% 100%` | court markings, text on court (use ≤ full alpha) |
| Marker (primary) | `--primary` | `22 92% 52%` | CTAs, "your team", key figures, kicker underline |
| Opponent (secondary) | `--secondary` | `221 83% 53%` | opponent, second data series, second marker |
| Whistle/positive | `--success` | `142 55% 42%` | available/positive states |

Orange is the coach's marker and carries the accent role at page scale (CTAs,
your‑team magnets, headline underlines, key numbers). Blue is the opponent /
second series — it always means "the other side", never decoration. Two‑marker
logic (orange = us, blue = them) is a system rule, not a palette accident.

## Type

- **Display — `--font-display` = Archivo** (600–900). Athletic grotesque for all
  headings, jersey numbers, the scoreboard. Tracking `-0.02em` to `-0.04em`,
  heavy weights for poster moments. Replaces Space Grotesk on the landing page.
- **Body/UI — Inter.** Workhorse for body, controls, dense data. Body measure
  65–75ch.
- **Hand — `--font-hand` = Caveat** (500–700). The coach's marker: kickers,
  arrow labels, circled callouts, margin notes. Used sparingly and never for
  body or primary headlines.
- **Numerals:** always `tabular-nums`. Jersey/score numbers set in Archivo; data
  tables in Inter tabular.
- **Size floor: 13px.** Nothing user‑facing goes below `text-[13px]` — not
  captions, not chips, not uppercase micro‑labels, not the copyright line. The
  reader is a coach glancing at a phone on a bright sideline, not a designer at
  a 27″ display. Use weight, colour or `tracking` to make a label recede, never
  size. (`text-xs` and the `text-[10/11/12px]` arbitraries are therefore out.)

## Signature primitives (`features/landing-page/components/tactic/`)

- **CourtDiagram** — SVG handball court to real 40×20 m proportions (6‑m
  goal‑area arc, 9‑m dashed free‑throw line trimmed to the sideline, centre line,
  goal). Chalk on court, ink on paper. The recurring motif: hero canvas, band
  backgrounds, dividers, final CTA. With `formation`, a real setup is chalked on
  — the opponent's 6:0 defence + keeper (blue) vs. your attack with a pivot at
  the line (orange) — as calm, organized board‑play, never scattered magnets.
- **PlayerMagnet** — round token, jersey number in Archivo, team colour (orange
  us / blue them). Restrained magnet look: one soft radial + a thin rim + a real
  offset shadow. Numbered magnets are the point‑list bullet across the operate
  bands (the coach's roster), replacing generic icon squares.
- **MarkerArrow** — slightly rough hand‑drawn SVG arrow (orange/blue/chalk) with
  optional draw‑on. Connects steps, points at actions, shows flow.
- **MarkerLabel / Kicker** — Caveat label, optional marker underline/circle. The
  one section kicker grammar (not a tracked uppercase eyebrow).
- **BoardCard** — pinned‑to‑the‑board surface: paper or court panel, one magnet
  dot **or** a strip of tape at a corner, a real soft board shadow. Restrained;
  never nested.
- **BoardScreenshot** — frames a real app screenshot as a shot pinned to the
  board (flat frame + magnet/tape accent, thin chalk/ink border). **No**
  macOS traffic‑light chrome.

## Ratgeber (Read surface)

The guide pages (`/ratgeber` hub + `/ratgeber/[slug]` articles) are the world's
**Read** register: the same two grounds and marker grammar as the landing page,
tuned for long‑form comprehension and kept fully static / zero‑JS (only the FAQ
accordion is client) so every article stays crawlable.

- **Ground rhythm** mirrors the landing page: court signature bands for the
  hero header and the foot CTA, paper for the reading body, FAQ and related
  grid. Article: court hero → paper prose → paper FAQ → court CTA → paper
  related. The hub: court hero → paper board of category groups.
- **Heroes** are court bands with the `CourtDiagram` chalked behind (formation
  on the hub + CTA, plain goal‑end on article headers), a `BoardKicker` for the
  category, and the Archivo H1 in chalk — never the old `slate-950` +
  radial‑blob glow.
- **`.article-prose`** is the reading voice (`app/globals.css`): warm ink on
  paper, **Archivo** headings (not Space Grotesk), a short marker swipe under
  each `h2`, links with a soft marker highlight, the key‑takeaway blockquote
  restyled as a magnet‑pinned note (no bordered quote), and data tables set as
  a scoresheet (ink header rule, warm zebra, tabular figures).
- **Article cards** are notes pinned to the board: a paper card, one real board
  shadow, a single magnet dot. The category shows as a Caveat marker label only
  where cards are ungrouped (related); on the hub the section heading already
  names it.
- The foot CTA reuses the landing page's final‑CTA language — a court band with
  one solid orange action to the no‑account live demo.

## Motion — one language: "drawn on the board"

- Marker strokes, arrows and court lines draw in (stroke‑dashoffset) on scroll;
  magnets settle with a small overshoot. One orchestrated entrance per band from
  an already‑visible default, exponential ease‑out — not an identical fade on
  every section.
- Kept effects, re‑themed: the WebGL fluid ("SmokeCursor") stays on the dark
  **stats scoreboard** band as chalk/marker dust in brand hues, and respects
  `prefers-reduced-motion` and WebGL/GPU guards. Nothing covers the page before
  first paint — the hero is the first thing a visitor sees, always.
- Reach past transform/opacity: blur, clip‑path/mask (marker reveal), shadow.

## Bans (this world's anti‑patterns; the brief still wins over any of these)

The tactic board natively uses marker strokes, hand lettering, arrows, magnets,
tape, chalk lines and paper/board texture — those are *not* banned. Banned
because they are the discarded generic look, not this world:

- Gradient / clip‑text type. Emphasis = weight, size, or a marker underline.
- Radial‑blob glow backgrounds. Structure comes from court lines and grain.
- Glassmorphism (backdrop‑blur + stacked halo shadows) as card chrome.
- macOS faux‑browser chrome on screenshots.
- The violet→teal "AI" gradient (removed from tokens).
- Zero‑offset colored halos standing in for depth; shadows carry offset + blur.
- Neon‑on‑near‑black. The court is a real floor colour, not a black canvas.

## Accessibility & performance

Contrast: body/placeholder ≥ 4.5:1, large ≥ 3:1 — tint secondary text from the
ground's hue (chalk on court, warm ink on paper), never flat gray on colour.
Keep the app screenshots as the real proof; keep semantics, focus states, i18n
(`de`/`en`), PWA and offline behavior intact.
