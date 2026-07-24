# Statix — Product truth

Durable facts about the product. Visual decisions live in `DESIGN.md`; route‑ or
surface‑specific strategy lives in surface briefs. Copy is German‑first (`de`),
with an English mirror (`en`) in `messages/`.

## What it is

Statix is a **handball statistics app for coaches, clubs and teams**. During a
match a coach records every action with a single tap — goals, shots, saves,
fast breaks, technical faults, 2‑minute penalties, substitutions — and Statix
turns that into shot quotas, shot maps/heatmaps, live player and team stats,
tournament tables, a public live ticker, AI match analysis, and shareable
reports. It runs in the browser (installable as a PWA), works **offline in the
hall**, and syncs when back online.

- **Unique mechanism:** the sideline tap → live, auto‑computed handball stats.
  What a coach used to scrawl on a scoresheet (Zettel) or lose entirely, Statix
  captures live and analyses instantly.
- **Made by a handballer, in Germany.** Built by Arkadiusz Weiss out of real
  sideline practice; feedback from the hall goes straight into the product.

## Who it's for

Handball coaches, co‑coaches, clubs and teams across every level — youth and
amateur through performance sport. No technical knowledge required; a coach is
recording their first game within minutes.

The real scene: a coach on the bench in a bright sports hall, phone or tablet in
hand, eyes on the game — and later reviewing the match at home on a laptop.
Fans, parents and club‑mates follow live from the stands via a shared ticker
link or a QR code on the beamer.

## What this surface (the landing page `/`) must prove

Persuade mode. A first‑time visitor must, within seconds, understand *what
Statix is*, *why the sideline‑tap matters*, and *what to do next*. The decisive
action is **"Live‑Demo starten"** — a fully populated demo with real game data,
no account. Secondary action: the launch‑offer newsletter for clubs.

## Feature scope (all real, shipping)

- **Live erfassen:** 1‑tap capture, quick mode, shot position & 7‑m, 2‑minute
  timers, guided game assistant, post‑game action editing, offline, PWA install.
- **Auswerten:** live player & team stats, shot maps/heatmaps, dashboards
  (attack success, save quota, goal difference), season trends.
- **KI‑Analyse:** four scopes — single game, whole team, single player (scouting
  profile), whole tournament. Player names are pseudonymised before any data
  reaches an AI; reports are deletable and generated in the background.
- **Turniere:** multi‑team tournaments, auto‑updating table, start live games
  from the bracket, enter third‑party results, matchday squad selection.
- **Live‑Ticker:** publish a game as a public live ticker; share by link or QR;
  score & timeline in real time; coach controls publish/stop.
- **Zusammenarbeit:** share games with other coaches (read‑only, by link/email,
  lands in their Statix inbox), invite a coaching staff, player surveys
  (no‑account answers), PDF export & revocable share links.

## Commercial truth (do not invent beyond this)

- **Free to start**, no credit card; first game recorded without commitment.
- Fair, planned subscriptions for whole teams and clubs are coming; the launch
  offer is collected via the newsletter. Prices are not yet public — never
  fabricate a number.
- Live demo runs at the URL in `lib/club-config.ts` (`CLUB_CONFIG.website`).

## Brand commitments (preserved across any redesign)

- Wordmark **"Statix"**; logo assets in `public/`, configured in
  `lib/club-config.ts`.
- Brand colours: **energetic orange** (primary) + **court blue** (secondary).
- German‑first voice: direct, practical, coach‑to‑coach ("du"), never hypey.
- Real in‑app screenshots are the proof; the app UI is dark‑themed.
