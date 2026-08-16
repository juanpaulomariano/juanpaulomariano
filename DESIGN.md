---
name: juanpaulomariano.com
description: Portfolio of a GoHighLevel automation architect — running systems shown live, receipts one click away.
colors:
  white: "#FFFFFF"
  warm: "#FAFAFA"
  ink: "#0A0A0A"
  body: "#444444"
  muted: "#767676"
  faint: "#5E5E5E"
  accent: "#C0392B"
  line: "#E4E4E4"
  hair: "#EFEFEF"
  darkBg: "#0A0A0A"
  darkInk: "#FFFFFF"
  darkBody: "#B4B4B4"
  darkMuted: "#8A8A8A"
  darkLine: "rgba(255,255,255,0.20)"
  darkHair: "rgba(255,255,255,0.10)"
  stageBg: "#0D1117"
  stageInk: "#F2F4F7"
  stageBody: "#B6BEC9"
  stageMuted: "#8B93A1"
  stageLine: "rgba(255,255,255,0.16)"
  stageHair: "rgba(255,255,255,0.08)"
typography:
  hero:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(2.45rem, 4.5vw, 3.8rem)"
    fontWeight: 800
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  section:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(2.1rem, 4.2vw, 3.4rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  subsection:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(1.7rem, 2.8vw, 2.3rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "Manrope, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.005em"
  indexItem:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "14.5px"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  small:
    fontFamily: "Manrope, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  ui:
    fontFamily: "Manrope, sans-serif"
    fontSize: "13.5px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  micro:
    fontFamily: "Manrope, sans-serif"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  none: "0px"
  pill: "9999px"
spacing:
  gutter: "24px"
  gutter-sm: "40px"
  section-y: "80px"
  section-y-sm: "96px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
    typography: "{typography.ui}"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
    typography: "{typography.ui}"
  link-ruled:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
  link-ruled-hover:
    textColor: "{colors.accent}"
---

# Design System: juanpaulomariano.com

Recorded from the built code after the fact; where this file and the code disagree, the code wins.
Normative sources: `lib/tokens.ts` (TOKENS, TYPE, TYPE_STYLE, EASE), `app/globals.css`, `app/layout.tsx`.
Content contracts live in `lib/works.ts` and `lib/conversation.ts`. Machine extensions (motion, shadows,
breakpoints, component snippets) are in `.impeccable/design.json`.

## Overview

**Creative North Star: "The Inspection Floor"**

The site is a showroom floor for running machines. Everything shown is a real deployed system — a
recorded call, live n8n canvases, real GoHighLevel writes — and the design's job is to stage each
machine once, let it run, and put the receipts one click behind it. The ground is technical white
paper: hairline rules and negative space do all the grouping, sections are numbered rather than
labelled, and numbers live inside sentences instead of stat blocks. Honesty is a visual feature:
pending states render as stated pending states, redactions are announced, and nothing is staged to
look live when it is a recording.

Each section owns exactly one bold element (the hero's orbit, the living pipeline, the incoming
call, the white-label flip) and everything around it stays quiet. Motion is demonstration, not
decoration: a thing plays once when the visitor arrives or acts, then rests.

**Key Characteristics:**
- White paper ground end to end; one dark section (02) as the page's single visual reset; a second, blue-black night *panel* inside white section 03.
- One accent (#C0392B) with exactly one meaning per context.
- Hairline grammar: two rule weights per surface do the structural work; no cards, no outer rounded containers, no shadows on layout.
- No icon libraries and no glyph icons — controls draw their own geometry, status is written in words.
- Play-once-then-rest motion with full reduced-motion end-state contracts.
- Every section comprehensible in one laptop viewport; long content behind opt-in disclosure (lightbox, modal).

## Colors

A neutral grey system on white, one clay-red accent, and two deliberately different dark materials. All values live in `lib/tokens.ts`; components must consume TOKENS, never re-declare hex.

### Primary
- **Clay Red — `accent`** (#C0392B): the page's only color. Each context spends it on one meaning and nothing else: the hero headline's "can't do" emphasis and filled-button hover; the Selected Work rail's active marker and "In progress" word; the travelling lead's current position in the pipeline (node + dot); "the agent is speaking right now" in the transcript; the live-call dot on the stage; the active thumbnail border in the lightbox; hover state of ruled text links.

### Neutral (the white page)
- **`white`** (#FFFFFF): the page ground and every media plate (posters, canvases sit on white).
- **`warm`** (#FAFAFA): barely-there grey available for an adjacent light surface that must still read as the same sheet of paper. `#FCFCFC` appears once as browser-chrome fill in the white-label frame.
- **`ink`** (#0A0A0A): headings, primary text, filled buttons, section-opening rules, selection background.
- **`body`** (#444444): running text and nav links.
- **`muted`** (#767676): secondary text, captions, section numerals, un-current transcript lines.
- **`faint`** (#5E5E5E): the hero's tracked kicker line only.
- **`line`** (#E4E4E4) / **`hair`** (#EFEFEF): the two hairline weights — `line` for visible structure, `hair` for the faintest technical rules that register as texture, not borders.

### Dark section (Selected Work only)
- **`darkBg`** (#0A0A0A) with **`darkInk`** (#FFFFFF), **`darkBody`** (#B4B4B4), **`darkMuted`** (#8A8A8A), **`darkLine`** (rgba(255,255,255,0.20)), **`darkHair`** (rgba(255,255,255,0.10)). A gallery wall: the page's single reset between white surfaces, so contrast comes from purpose rather than constant color changes.

### Stage panel (Conversation AI's night surface)
- **`stageBg`** (#0D1117) with **`stageInk`** (#F2F4F7), **`stageBody`** (#B6BEC9), **`stageMuted`** (#8B93A1), **`stageLine`** (rgba(255,255,255,0.16)), **`stageHair`** (rgba(255,255,255,0.08)). A phone at night — a bordered PANEL inside white section 03, not a section ground. The cast is deliberately blue-black so the two dark surfaces never read as the same material.

### Named Rules
**The One Dark Section Rule.** Exactly one section ground is dark (#0A0A0A, Selected Work). Do not introduce a second dark section; a new dark surface may only be a panel inside a white section, and it must be a different material (see `stageBg`).

**The One-Meaning Red Rule.** Red is never a theme color. Before using `accent`, name the single thing it means in that context; if the context already spends red on a meaning, the new element doesn't get it. Traversed pipeline rail is ink, not red — red marks only the current position.

**The Token Source Rule.** Surfaces come in complete sets (bg/ink/body/muted/line/hair). A component that renders on two grounds swaps token sets (`SURFACES` maps in `living-pipeline.tsx`, `transcript-rail.tsx`); it never invents a third scheme.

## Typography

**Display Font:** Space Grotesk (`--font-grotesk`) — section titles, subsection titles, rail index items.
**Body Font:** Manrope (`--font-sans`) — everything else, including the hero headline at weight 800.
**Loaded but unused:** Instrument Serif (`--font-serif`) is loaded in `app/layout.tsx` only as a switchable hero alternate; it appears nowhere on the shipped page. "No serif anywhere" is the working rule.

**Character:** Bold, tight-tracked grotesk headings over a quiet humanist body. Negative tracking on everything display-sized (−0.025em); tracked-out uppercase exists only at micro size for tiny functional labels (section numerals, "Incoming call", "CRM", the scroll cue) — never as section eyebrows.

### Hierarchy
Roles, not sizes — defined in `TYPE` / `TYPE_STYLE` in `lib/tokens.ts`. Two elements doing the same job must use the same role; the steps between roles are the hierarchy.

- **hero** (800, clamp(2.45rem, 4.5vw, 3.8rem), 1.06): the page's single largest element. Hero only, never reused. Manrope.
- **section** (700, clamp(2.1rem, 4.2vw, 3.4rem), 1.05): top-level section headings; all sections share it exactly. Space Grotesk. Two-line construction with the first line in `muted` is the recurring pattern ("Your brand on top. / GoHighLevel out of sight.").
- **subsection** (700, clamp(1.7rem, 2.8vw, 2.3rem), 1.08): a project or subsection heading, subordinate to a section title. Space Grotesk.
- **indexItem** (600, 17px, 1.3): an item in a navigable index (the Selected Work rail). Space Grotesk.
- **lead** (400, 16px, 1.5): the one line that states what a thing is, above the body copy.
- **body** (400, 14.5px, 1.75): default running text. Measure capped ~46em/46ch unless a grid track is the measure.
- **ui** (500, 13.5px, 1.4): interface text — nav, buttons, controls.
- **small** (400, 13px, 1.6): captions, sublabels, supporting detail.
- **micro** (400, 12.5px, 1.5): metadata, numerals, ticker text, footnotes. Tabular figures (`tabular-nums`) whenever it shows a number.

### Named Rules
**The Role Rule.** If you need a size that is not in `TYPE`, you are either adding a genuinely new role (add it to `lib/tokens.ts` and name it) or you are re-drifting (use the closest existing role). Do not inline a one-off px value.

**The Numeral Rule.** The page numbers its sections (01–05); it does not label them. No text eyebrows, no small-caps kickers above titles — a right-aligned tabular numeral (micro, 0.2em tracking, muted) over the section's opening rule is the entire header apparatus. The headline itself says what the section is.

## Layout

- **Container:** `max-w-[1320px]`, centered. Gutters `px-6` (24px), `sm:px-10` (40px). Section padding `py-20` (80px), `sm:py-24` (96px) — trimmed per-section when needed to hit the viewport rule (Selected Work runs `xl:py-[68px]`).
- **Section scaffold:** every section after the hero opens with a full-width top rule (ink-colored on white sections, `darkLine` on the dark one) carrying the right-aligned numeral, then the title, then content. The hero is 01 (min-h-screen, no numeral); 02 Work (dark), 03 AI, 04 White-label, 05 Contact.
- **Page rhythm:** white · black · white · white · white. The single dark section is the reset.
- **Breakpoints in active use:** sm 640, lg 1024, xl 1280, 2xl 1536. Showcase sections go two-column at `xl`, not `lg` — measured: at 1024 the split leaves ~32ch text columns and illegible thumbnails; at 1280 it holds (~48ch).
- **Two-column stages:** demo on one side, written case on the other, mirrored between sections — Selected Work `[42fr_58fr]` (text left), Conversation AI `[42fr_58fr]` (text left, stage right), White-label `[58fr_42fr]` (text left, frame right; drops to `[52fr_48fr]` at 2xl once the title line clears). The Selected Work rail is a fixed 236px index column at lg; a horizontal tab strip below.
- **The One-Viewport Rule.** Every section must be comprehensible in one laptop viewport (~900px content height at 1440×900). Long content goes behind opt-in disclosure — the lightbox, the modal, the transcript's scroll pane — never into page height. This rule drives the two-column splits, the trimmed paddings, and the poster living in a 58% track instead of full-bleed.
- **The Swap-In-Place Rule.** Switching content never shifts the page. Reserved heights hold the floor of the tallest state: `.stage-reserve` (799px from sm, 548px from xl — measured at each range's *narrowest* width, values in `app/globals.css` because Tailwind can't see interpolated classes), `.transcript-reserve` (same mechanism, values pending real transcripts), the call stage's fixed body (430px, 416px from sm), the white-label caption's two-line `min-h`. Re-measure when content changes.

## Elevation & Depth

Flat. Depth is conveyed by ground changes (white page → dark section → night panel) and by the two hairline weights, never by shadow or blur on layout. Media does not float: the video poster explicitly takes a light border instead of a shadow so "the bright build sits ON the dark canvas, not above it as a card."

### Shadow Vocabulary
Shadows exist on exactly two kinetic objects, both signals of physical position, not elevation:
- **Orbit tile** (`box-shadow: 0 20px 40px -16px rgba(10,10,10,var(--tile-shadow-a)), 0 2px 8px -2px rgba(10,10,10,0.06)`): hero logo tiles; the first alpha is depth-cued (0.10–0.32) from orbital position.
- **Lead halo** (`box-shadow: 0 0 0 3px rgba(192,57,43,0.12)`): the travelling red lead on the living pipeline.

### Focus
Focus is an outline, not a glow: `outline: 2px solid #0A0A0A; outline-offset: 3px` globally, swapped to white inside `#work` (scoped in `app/globals.css` so a control added to the dark section cannot forget it). Utility-level `focus-visible:outline-2` with 2–4px offsets on individual controls.

### Named Rules
**The Flat Paper Rule.** Surfaces are flat; structure is drawn with rules. If a group needs separation, reach for `hair`, then `line`, then a ground change — never a drop shadow, never a filled card.

## Shapes

Square by default. Panels, frames, stages, thumbnails, toggles, and every in-section control are hard-cornered (0px) with 1px hairline borders. The night stage's ring pulses are scaled square copies of the answer control's own outline — on this site even the ringing is square.

Rounding carries exactly two sanctioned meanings:
- **Pill (9999px):** the conversion controls only — nav "Book a call", the hero CTA pair, the final CTA pair (and the lightbox's floating overlay buttons). A filled ink pill is the page's conversion signature; inside proof sections, controls are hairline squares and ruled text links instead.
- **Circle:** diagram dots — pipeline nodes (11px, hollow ahead / ink passed / accent current), the 7px travelling lead, the 6px live dot, the browser-chrome dots, orbit-path nodes.

One contained exception: the hero's orbiting logo tiles are 80px white squares at `rounded-xl` (12px) with a hairline `border-black/10`. That radius belongs to the orbit world and is not reused elsewhere.

Glyphs are drawn, not imported: play triangles are CSS border tricks, pause is two 3px bars, arrows are the text characters → and ←, the scroll cue is a drawn outline. There are no icon fonts, no Lucide/Heroicons, and no decorative SVG outside the hero's orbit geometry and the real brand logo files in `/public/logos/`.

## Components

### Motion grammar (binds every component)
- **Play once, then rest.** Nothing loops uninvited. The hero's orbit (110s/rev, rAF) is the page's one perpetual element, with its scroll-cue wheel as resident ambient; every other motion is one-shot: the assemble stagger (500ms, 50ms/logo), the stage swap (420ms rise-and-fade, replays per selection), the play-mark prime (620ms swell, once), the white-label nudge (once), the flash labels (brief, then gone), the pipeline's single run (then a Replay control appears), the stage ring (exactly 3 pulses — "a call just arrived", a loop would nag). The live dot may breathe only while audio the user started is actually playing.
- **One bold element per section.** Orbit (01), living pipeline (02), the incoming call (03), the flip (04). A new bold element must not compete with an existing one.
- **Curves:** `EASE.enter` cubic-bezier(0.22, 1, 0.36, 1) for entrances and transform hovers; `EASE.move` cubic-bezier(0.4, 0, 0.2, 1) for travel along a track. **Durations:** responses 200–300ms; entrances 420–620ms; content crossfade 550ms; rack-focus 480ms; illustrative travel ~1000ms per segment (above the routine-UI ceiling on purpose).
- **Transform/opacity only.** Travel is `transform: translateX/scaleX`, never `left`. When an animation and a transition want the same property, each drives its own registered custom property and the transform composes them (`--prime-scale` × `--hover-scale`).
- **Arm on visibility.** One-shot moments arm via IntersectionObserver (thresholds 0.35–0.5) so they are not spent off-screen.
- **Reduced motion is a contract, not an off-switch.** Every animation ships its end state: the pipeline renders fully lit with the lead resting at the last stage, the transcript renders settled, reserved-height swaps still swap, transitions become `none`, autoplay never happens — every state remains reachable; only the motion is withheld.
- **Rack focus:** while the call is live, everything that is not the stage drops to opacity 0.4 (480ms, opacity only, nothing moves); reduced motion opts out entirely.

### Section header
A 1px top rule (ink on white, `darkLine` on dark) with the section numeral right-aligned above it in micro/tabular/0.2em-tracking muted; then the section title (role `section`, Space Grotesk). No eyebrow text ever.

### Buttons
- **Shape:** pill (9999px) for conversion CTAs; square for everything in-section.
- **Primary:** ink fill, white text, `ui` type, 12px 24px padding (nav variant 6px 16px). Hover: fill turns `accent` (300ms color transition). This is the page's only filled control.
- **Ghost:** 0.5px `rgba(0,0,0,0.2)` border pill, ink text; hover deepens border to /45 and washes ground `black/[0.03]`.
- **Square control:** 1px hairline border, drawn glyph inside (answer 56px, transport 40px); hover `scale(1.06)` at 200ms; disabled keeps the border at `hair` weight and swaps glyph color to muted — no opacity dimming.
- **Ruled text control:** inline text with a 1px bottom border in ink and a trailing → ; hover shifts text and border to `accent` and slides the arrow 4px. Used for "See all N →" and inline bridges — "a solid capsule reads as SaaS UI" inside proof sections.

### Rail / index (tablist)
Rows carry the hairline themselves (left border on desktop column, top border as a horizontal strip): selected row's border turns ink and a 1px `accent` marker slides along the edge (scale transform, 300ms). Selection is encoded as *color* (name `darkInk` vs `darkBody`), never opacity — inactive items stay legible. The spine extends 40px past the last row so the index reads as a continuous column. Status ("· In progress") is an accent-colored word, not a dot.

### Proof wall
Calm at rest: one sentence (`ui` role), up to four *flagged* preview thumbnails (`preview: true` — the legible canvases, not the first N), one ruled text control. Thumbs are 16:10, hairline-bordered, white-backed, at 80% opacity resting / 100% on hover, deliberately larger than typical thumbnails so a ~2500px canvas reads as a diagram rather than grey noise; each carries its real workflow name at 11px below. Small lossy `previewSrc` copies on cards; lossless originals only in the lightbox.

### Gallery lightbox
White ground. Two viewing modes — FIT (whole canvas, `min(78vh, 780px)`) and 100% (native pixels in a scrollable pane) — because zoom is the point, not a nicety. Caption bar is required reading: uppercase micro label (the workflow's real name), then up-to-70ch caption at 13.5px/1.7. Counter counts workflows, not image files (`continuation` shots don't increment), so "4 / 20" agrees with the "See all 20 workflows" button. Thumbnail rail with accent-bordered current item; neighbors prefetched one step ahead; mounted only while open.

### Living pipeline
A technical diagram, not a progress bar: hairline rail spanning node centers, 11px nodes (hollow ahead, ink passed, accent current), sentence-case 12px labels (uppercase micro only in the stacked mobile variant), the traversed rail filling in *ink*. One lead travels the track once (~1s/segment, `EASE.move`), lights each stage, and rests at the end; Replay appears only when done. Renders on both grounds via a strict token-set swap.

### The call stage
A bordered panel on `stageBg` — the phone at night. Caller-ID header (title left, status right in tracked micro; tabular clock). Fixed-height body (430px / 416px sm) holding two faces: the live call underneath (transcript pane, CRM ticker, transport row) and the incoming overlay above ("Incoming call" tracked micro, caller in `subsection` grotesk, square answer control with 3 ring pulses). Answering collapses the overlay (opacity + scale 0.985, 480ms; `inert` on the hidden face). One control drives everything — clock, transcript ink, ticker, progress rule are all consequences of the same audio clock; no element keeps private timing. Progress is a 1px hairline whose fill scales in `stageInk`. Ticker label stays "CRM" in every state; the event text carries the outcome.

### Transcript rail
Hairline-ruled rows, never chat bubbles. Fixed-width tabular gutters (timestamp 3.25rem, speaker 2.5rem) so the text column starts at the same x on every row. Every line is visible always — playback *inks* the transcript rather than revealing it: color encodes state, opacity encodes nothing (ahead = muted, passed = body, current = ink; 220ms color transitions). The accent means one thing: the current line's gutter turns `accent` only while the agent is speaking. Renders on both grounds via the same token-set swap.

### Video poster
16:9 plate with a light border (never a shadow) on white. Two stacked scrims (rest 0.34, hover 0.58 — layers cross-fade because gradients don't interpolate dependably). White 44px square play plate, drawn triangle; label unfurls from the plate on hover/focus via `0fr → 1fr` grid-column transition and becomes the accessible name. The mark primes once on visibility (620ms swell on the plate only — the screenshot itself is never in motion).

### Browser frame & flip (white-label)
Hairline-bordered frame: slim chrome strip (#FCFCFC, three 9px dots, a live address bar — hairline border, near-black text, because the domain is the strongest proof and gets more weight than real chrome). Both screenshots stay mounted; the flip is a 550ms opacity crossfade so the frame never resizes. Toggle is a square hairline group whose accent knob slides (`translateX`, 420ms `EASE.enter`); active label white-on-accent, `aria-pressed`. "What changed" labels flash inside the frame (staggered 80ms, hold 1200ms, then gone).

### Evidence surfaces (content contract, binds all proof)
The `Shot` (lib/works.ts) and `Evidence` (lib/conversation.ts) shapes are the law of proof:
- `label` + `caption` are **required** — an uncaptioned screenshot is texture, not evidence. Evidence adds a required `redactionNote`, stated plainly because the reader is already wondering what was removed, plus required natural `width`/`height` to reserve aspect-ratio and prevent reflow.
- Prose is FINAL and verbatim — transcripts keep false starts; cleaning them up is how a section starts looking fabricated. Masked values must match verbatim between transcript and screenshot (the redaction contract). Ticker events are real CRM writes at their transcribed moments.
- Pending states ship honestly: empty `src` renders a stated placeholder ("Recording not attached yet", "image pending"); captions are written only once the image exists.
- Evidence is a *set*: outcome first, then provenance, then machinery — the page shows the calm citation, the lightbox carries the rest.
- Config is data: discriminated unions (`Project` on `type`, `Channel` on `kind`), arrays whose length gates chrome (nav dots and switches render only at length > 1 — controls over one item read as filler).

## Do's and Don'ts

### Do:
- **Do** pull every color, size, and curve from `lib/tokens.ts` (TOKENS / TYPE / TYPE_STYLE / EASE) and spread the full role (`fontSize` + `...TYPE_STYLE.x`); a role is a complete style, not just a number.
- **Do** open every new section with the rule-and-numeral scaffold, an ink top rule, and a `section`-role Space Grotesk title — then make it fit ~900px of content height, pushing overflow behind opt-in disclosure.
- **Do** give every one-shot animation its three contracts: an IntersectionObserver arm, a rest state, and a reduced-motion end-state render.
- **Do** reserve the height of the tallest state before letting content swap in place, and re-measure the reserves at each range's narrowest width when content changes.
- **Do** state limitations and redactions plainly, in `muted` micro/small text, once, without hedging — honesty lines are credibility instruments, not disclaimers.
- **Do** draw control glyphs from CSS geometry or text characters (→, two bars, border-trick triangles), sized to the control.

### Don't:
- **Don't** add a second dark section ground, or reuse `#0A0A0A` and `#0D1117` interchangeably — one is a gallery wall, the other a phone at night.
- **Don't** spend `accent` on a second meaning in the same context, tint the traversed pipeline rail red, or use red as decoration. One meaning, one place, per context.
- **Don't** add text eyebrows, kickers, coloured status dots, icon libraries, chat bubbles, filled cards, rounded containers, or drop shadows on layout — the grammar is rules, words, and negative space.
- **Don't** loop anything uninvited, animate `left`, or let two effects fight over one `transform` — compose registered custom properties instead.
- **Don't** invent metrics, stat rows, or trophy figures; numbers live inside sentences, and a demonstration practice has no honest ROI.
- **Don't** rewrite, tighten, or "improve" content-layer prose (transcripts, captions, descriptions) — it is verbatim and pre-audited; a mismatch with a screenshot is the site caught lying.
- **Don't** inline a one-off font size or re-declare a token's hex in a component; both are drift.
