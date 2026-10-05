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
Statix is*, *why the sideline‑tap matters*, and *what to do next*.

The decisive action is **free registration** on the app domain — this is the
primary conversion goal since launch, and it is what `register_click` in
`lib/analytics.ts` measures. The **no‑account live demo** (a fully populated
demo with real game data) sits directly beside it in every CTA pair as the
zero‑friction way in for a visitor who will not create an account yet;
`demo_click` measures it. Third action, for whoever does neither today: the
launch‑offer newsletter for clubs.

The page carries **no price figure** — figures live on `/preise` (and in the
structured data and `llms.txt` that quote it). It says free, no credit card,
and links to `/preise` for the rest.

Length is a conversion constraint on this surface, not a content budget. The
page is deliberately about half the scroll it used to be: everything a coach
needs to decide is on it, and everything they only need *after* deciding lives
on its own route (`/funktionen` for the feature index and one page per feature,
`/was-ist-statix` for the brand story, `/preise`, `/kontakt`, `/erfahrungen`).
Adding a band here means arguing that a coach cannot decide without it.

## Feature scope

The catalogue is **one module**: `features/funktionen/data/features.ts`. It
feeds the `/funktionen` index, one route per feature, `APP_FEATURES` in
`lib/seo.ts` (and through it the `SoftwareApplication` schema and `llms.txt`),
the ruled list on `/was‑ist‑statix`, and the sitemap. Add a feature there or it
exists on none of them; add it twice and they drift, which is exactly how
"Termine & Trainingsbeteiligung" once sat in the schema with no page, no
screenshot and no navigation entry behind it.

Every entry carries a `status`, and the site shows it:

- **`live`** — finished, open to every account. Seventeen of the nineteen.
- **`beta`** — being built, restricted to named accounts. Listed anyway, marked
  "In Arbeit" on the card, in the hero and in `llms.txt`. Never described as
  something a new account gets today. Currently: **Video‑Tagging**.
- **`onRequest`** — finished, but set up for a club rather than self‑served.
  Currently: **Vereinsbereich**.

The scope itself:

- **Live erfassen:** 1‑tap capture, quick mode, shot position & 7‑m, 2‑minute
  timers, guided game assistant, post‑game action editing, offline, PWA install.
- **Halten & Wischen** (new, marked `isNew` and spotlighted in the header):
  hold a player on the court for half a second, swipe, let go — up 1gg1
  verloren, down 7m verursacht, left 7m rausgeholt, right 2 Min. rausgeholt.
  Cancel = back to the centre and release; every call comes with Undo. The
  stop foul is deliberately NOT on the gesture — it has its own panel button.
  The directions are the app's rule (`features/games/recording/hold-menu.ts`
  in the app repo); change them there first.
- **Auswerten:** live player & team stats, shot maps/heatmaps, dashboards
  (attack success, save quota, goal difference), season trends.
- **KI‑Analyse:** four scopes — single game, whole team, single player (scouting
  profile), whole tournament. Player names are pseudonymised before any data
  reaches an AI; reports are deletable and generated in the background.
- **Termine & Trainingsbeteiligung:** team calendar with weekly/fortnightly
  training series, match appointments with meeting time and a venue address
  book, player RSVPs with a reason, absences entered once as a date range
  (holiday/illness/injury) that cover every appointment inside them, RSVP
  deadlines with push reminders, and a read‑only ICS calendar subscription.
- **Turniere:** multi‑team tournaments, auto‑updating table, start live games
  from the bracket, enter third‑party results, matchday squad selection.
- **Strafen & Mannschaftskasse:** a squad's own fine catalogue, fines written
  against a roster row in two taps with a backdatable day and a note, open/paid
  totals per player and for the squad, and a player‑side account of her own.
  Amounts are cents and frozen at the moment of writing — the catalogue is
  today's price list, the fine the invoice from back then. The duty of running
  the kitty can sit on a player (`manages_fines`) without making her a coach.
- **Trikotverwaltung:** jersey sets with a home/away role and separate field and
  goalkeeper colours, shirts with number, size and kind, handing them out to
  players with a date, the per‑shirt history of who had it, and retirement
  instead of deletion.
- **Spieler‑Zugang:** one expiring join link per squad (QR code, WhatsApp
  text), players pick their own roster row and set a password, and then reach
  their own side of the app — schedule with RSVPs, their own stats, surveys,
  fine account. A coach sees who is linked and can unlink; a player controls
  whether her name shows on public pages, and that overrides the team setting.
- **Live‑Ticker:** publish a game as a public live ticker; share by link or QR;
  score & timeline in real time; coach controls publish/stop.
- **Zusammenarbeit:** share games with other coaches (read‑only, by link/email,
  lands in their Statix inbox), invite a coaching staff, player surveys
  (no‑account answers), PDF export & revocable share links.
- **Video & Tagging — BETA, not generally available:** upload a recording, sync
  it to the game clock, tag scenes (action + player + qualifiers such as phase,
  defence, strength, shot origin), read them as lanes, save filters as
  playlists, and send one player a compilation of only her scenes. Gated to an
  allowlist while it is built. Anything the site says about it must say that
  too. Around the bench the area has grown — and `/funktionen/video-tagging`
  lists it in `capabilities`: uploads in blocks, resumable, trimmed and
  rotated before upload; recordings of trainings; the team's own set plays and
  custom tags; power play / short-handed derived from the log; scene search
  across every video; building the match log from the video (only on a game
  without one); a TV-style score overlay; a briefing mode with drawing and
  recording; clips to players or the coaching staff with open tracking; a
  squad library with optional download; MP4 download. The **analysis from the
  picture** (court calibration, running paths & heatmaps, ball flight and
  point of impact, two-camera panorama, follow-cam version) is the youngest
  part: it runs on a rented GPU in the EU and only ever *suggests* — it never
  creates a scene or a statistic entry by itself. Say so wherever it is named.

## Commercial truth (do not invent beyond this)

- **Free to start**, no credit card; first game recorded without commitment.
- **Buyable from 1.1.2027, through the app.** Until then nothing can be bought:
  every feature is open to every account until 31.12.2026. From the launch,
  `/preise` is the start of the purchase — the visitor puts a plan together
  there, and the buy button hands over to the app
  (`${appUrl}/api/billing/intent?app=…&video=…&cadence=…`), which handles
  login or registration and the Stripe checkout. This site never takes payment
  details. The button opens by itself at the launch instant the app names
  (`launchAt`); before that it reads "Buchbar ab 1. Januar 2027", next to the
  registration that secures the founder terms. `?kasse=vorschau` makes it
  clickable early — harmless, because the app refuses anybody not on its
  internal preview list. Everywhere else the action stays registration.
- **One product, two dials, and the figures are decided.** App tier: Basis 0 €
  (permanent), Trainer 79 € per season or 9,90 € per month, Pro 149 € per
  season or 14,90 € per month. Video tier, for EVERY team in which the buying
  account is head coach (`team_members.role = 'head_coach'`) — those teams
  share one pool of storage and credits; a team with several head coaches
  gets the best tier among them; there is no team picker. Each tier includes
  App Basis: Video Basis 149 € (14,90 €/month, 100 GB), Video Team 399 € (39,90 €,
  300 GB, 40 compute credits per season / 3 per month, panorama, follow-cam,
  score overlay, live stream), Video Analyse 849 € (84,90 €, 500 GB, 180
  credits / 15 per month, court calibration, running paths, ball detection
  (beta), retraining). Next to any video tier the app tier costs the PACKAGE
  price on a season: Trainer 39 €, Pro 75 €. Monthly has no discount of any
  kind. Credits top up from Video Team: 10 for 19 €, 30 for 49 € (a credit is
  one GPU hour; trial runs free, failed runs refunded). Video is no longer part
  of Pro.
- **The season rule belongs to the app.** A season runs 1 July – 30 June and
  renews every 1 July. Buying mid-season costs the rest by started months,
  floored to whole euros; April–June only monthly is offered. The app sends the
  rest pre-computed — this site adds `rest` values up and never re-derives the
  rule. The old "Rumpfsaison 39 €/79 €" wording is gone.
- **These are end prices and carry no VAT**: under the small-business rule
  (§ 19 UStG) none may be stated, and stating it anyway would be owed under
  § 14c UStG. When the switch to standard taxation comes, the gross figures
  have to be re-checked, because German price-display rules require the end
  price for consumers.
- **The figures have one source.** The configurator, the compare headers and
  the founder card read the app's public price list
  (`GET ${appUrl}/api/public/billing/prices`, fetched on the server with
  hourly revalidation in `features/preise/data/fetch-price-sheet.ts`), with a
  static fallback of the same figures in `features/preise/data/price-sheet.ts`
  that hides the "today" amount instead of guessing it. The prose in
  `messages/*.json` (`pricingPage`), the JSON-LD offers, `lib/seo.ts` and
  `llms.txt` quote the same figures in words and change with the app's
  catalog (`lib/billing/catalog.ts` and `docs/zahlungsstart.md` in the app
  repo) — never round, pad or invent a limit.
- **Grandfathering is a promise the site makes.** Any account created before
  1.1.2027 keeps the Trainer plan at no cost until 30.6.2027 — the end of
  the 26/27 season, and not a day of the season after it. Nothing is charged
  then, because no card is stored. After that, founders keep a **permanent
  founder price** on a season subscription without video — Trainer 59 €
  instead of 79 €, Pro 109 € instead of 149 € — for as long as it runs without
  interruption; it can be taken until 30.9.2027. Do not weaken or quietly drop
  either half.
- **Recording is never gated.** In no tier is live capture limited, and a limit
  is checked when a game is created, never during one. A paywall in the 58th
  minute costs the match record, not the customer.
- **Club conditions are quoted, not listed.** A club enquires via
  `/fuer-vereine`; what a club with twelve squads needs is not what a club with
  two needs. The site names ~390 € per season for five squads as an order of
  magnitude to budget against, never as a list price; Video Verein starts at
  1.490 € per season (1 TB, 300 credits shared), also on request — it is for
  clubs whose teams have different head coaches, which one coach's video
  tier does not cover.
- The launch offer for clubs is collected via the newsletter.
- Live demo runs at the URL in `lib/club-config.ts` (`CLUB_CONFIG.website`).

## Brand commitments (preserved across any redesign)

- Wordmark **"Statix"**; logo assets in `public/`, configured in
  `lib/club-config.ts`.
- Brand colours: **energetic orange** (primary) + **court blue** (secondary).
- German‑first voice: direct, practical, coach‑to‑coach ("du"), never hypey.
- Real in‑app screenshots are the proof; the app UI is dark‑themed.
