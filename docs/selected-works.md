# Selected Works — how the section works

Context file for the second section of the site (`#work`, directly below the
hero). Covers the architecture, the data flow, every decision that isn't
obvious from reading the code, and how to change things safely.

---

## The one page-level constraint

This section is the **only dark surface on the page** (`TOKENS.darkBg`,
`#0A0A0A`). The rhythm is white hero → dark work → white product demo → white
close, so the darkness is the page's single visual reset and it earns its
weight by being unique.

If you add a second dark section, this one stops being a reset and the page
turns into alternating stripes. The dark tokens (`darkInk`, `darkBody`,
`darkMuted`, `darkLine`, `darkHair`) exist so this surface has the same
two-weight hairline system as the light sections rather than ad-hoc `rgba`
values — they are not an invitation to build more dark surfaces.

---

## The shape of it

One framed container — a "switchboard" — split into two parts:

```
┌─────────────────────────────────────────────────────────────┐
│  RAIL            │  MAIN STAGE                              │
│  ─────           │  ──────────                              │
│  PSD Limo     ◄──┤  eyebrow / title / subtitle / description│
│  Mercer          │                                          │
│  IronPulse       │  …then one of three stage bodies,        │
│  Glow Theory     │     depending on project.type            │
└─────────────────────────────────────────────────────────────┘
```

Clicking a rail item swaps the stage **in place** — no navigation, no route
change, no data fetch. It is one React state variable (`activeKey`) selecting
one object out of an array.

Below the `lg` breakpoint the rail becomes a horizontally scrollable tab strip
above the stage. Same markup, different flex direction — there is no separate
mobile component to keep in sync.

---

## Files, and what each one owns

| File | Owns |
| --- | --- |
| `lib/works.ts` | **All content.** Copy, stats, stages, image lists, Mux ID. |
| `lib/tokens.ts` | Colors and easing curves, shared with the hero. |
| `components/selected-works.tsx` | Layout, rail, stage routing, modal state. |
| `components/living-pipeline.tsx` | The animated lead-journey track. |
| `components/modal.tsx` | Accessible dialog shell. Used by both overlays. |
| `components/video-modal.tsx` | Mux player, wrapped in the modal shell. |
| `components/gallery-lightbox.tsx` | Screenshot viewer, wrapped in the same shell. |

The split that matters: **`lib/works.ts` is the only file you edit to change
what the section says.** Everything else is mechanism. You can rewrite every
word, swap all 41 screenshots, and reorder the projects without opening a
component.

---

## Data flow

```
lib/works.ts  ──►  PROJECTS: Project[]
                        │
                        ├─► rail buttons          (one per project)
                        └─► active project object
                                 │
                                 ▼
                        Stage() reads project.type
                                 │
                 ┌───────────────┼───────────────┐
                 ▼               ▼               ▼
             "video"        "progress"      "pipeline"
          poster + modal    pill + stats    pipeline
                                            + stats
                                            + proof wall
```

`Project` is a **discriminated union** on `type`. That is what makes the three
stage shapes safe: a `video` project is the only kind with `muxPlaybackId`, a
`pipeline` project is the only kind with `stages` and `screenshots`. TypeScript
enforces this — if you add a pipeline project and forget `proofSentence`, the
build fails rather than rendering a blank area.

---

## The three stage types

### 1. `video` — PSD Limo

At rest: a poster image with a play button. The poster is either your
hand-supplied `posterSrc`, or — if that's empty — Mux's auto-generated
thumbnail at `posterTime` seconds:

```
https://image.mux.com/{playbackId}/thumbnail.jpg?width=1280&time={posterTime}
```

Clicking opens the video modal.

**The Mux player is not mounted until the modal opens.** It's loaded through
`next/dynamic` with `ssr: false`, so its JavaScript is a separate chunk that
isn't requested during page render. This protects the hero's LCP — the player
is a large dependency and the page would be measurably slower if it loaded
up front. Verified: page First Load JS is ~113 kB with the player excluded.

Three states are handled explicitly:
- **No playback ID configured** → readable "not configured" notice.
- **Stream fails** → "This video couldn't load", modal stays usable.
- **Loading** → spinner on black.

None of these is a silent black box.

### 2. `progress` — Mercer

The simplest stage: an "In progress" pill, the description, and the stat row.
No pipeline, no gallery. This exists so unfinished work can appear honestly
without being dressed up as a case study.

### 3. `pipeline` — IronPulse, Glow Theory

Three stacked elements:

1. **The living pipeline** (see below)
2. **Stat row** — three figures
3. **Proof wall** — one sentence, four labelled previews, one button

---

## The living pipeline

A dot representing one lead travels the track once, lighting each stage, then
**rests** at the end. It is not a loop.

### Why play-once and not a loop

The hero already has one continuously moving element (the logo orbit). A second
perpetual animation directly below it would compete for attention and make the
page feel restless. The pipeline earns attention once — when you select the
project — then goes quiet. A `Replay` control appears after it settles for
anyone who wants to see it again.

### How the motion is built

State is a single integer `step` (0 → last). A chain of `setTimeout` calls
advances it, one stage per second. Everything visual derives from `step`:

- the fill line's `transform: scaleX(step / last)`
- the dot's `transform: translateX(pct%)`
- each node's background/border color (lit if `index <= step`)

**CSS transitions, not keyframes.** This is deliberate. Keyframe animations
restart from frame zero when interrupted; transitions retarget from wherever
the element currently is. Since switching projects restarts the run mid-flight,
transitions are the only choice that doesn't produce a visible snap.

**Transform only.** The dot moves with `translateX`, never `left`. Animating
`left` would trigger layout recalculation on every frame; `transform` is
composited and stays smooth.

### Restart behavior

The `runKey` prop is the project key. When it changes, the effect tears down
pending timers and starts a fresh run. The cleanup is what prevents a stale
timer from the previous project firing into the new one.

### Reduced motion

With `prefers-reduced-motion: reduce`, the pipeline renders **fully lit with
the dot at the final stage** — no travel, no timers, and the Replay button is
hidden. This is the same end state the animation reaches, so nothing is
withheld from the user; only the movement is.

### Mobile

Below `sm`, the same `step` state drives a vertically stacked list instead of a
horizontal track. One state, two layouts.

---

## The proof wall, and why it stays calm

IronPulse has 20 workflows across 23 canvases; Glow Theory has 16 across 18.
Showing all 41 at rest would turn a portfolio into a contact sheet — visually
exhausting and impossible to read.

So at rest the wall shows:

- **one sentence** stating the count ("All 20 workflows, one by one.")
- **four previews** with their workflow labels, at 80% opacity, rising to full
  on hover
- **one button** — "See all 20 workflows"

The previews are deliberately **larger than a typical thumbnail**, four-up from
`sm` and single-column on phones. A GoHighLevel canvas is around 2500px wide; at
postage-stamp size the graph reads as grey noise, which undercuts the claim
instead of supporting it. At this size the branch structure is legible as a
diagram and the workflow's real name carries the specifics.

The full set is opt-in. The claim is made in words; the evidence is one click
away for anyone who wants it.

The preview thumbnails are chosen by the `preview: true` flag in the config,
**not** by taking the first N. The first workflow in a build is usually the
simplest one; the flag lets you surface the visually complex canvases that
actually demonstrate the work.

---

## The shared modal

The video player and the screenshot lightbox are **the same dialog component**
configured differently (`variant="media"` vs `variant="gallery"`).

This matters because accessible modals have a long list of requirements, and
implementing them twice means getting them subtly different twice. One
component owns all of it:

| Requirement | Where |
| --- | --- |
| Focus moves into the dialog on open | `useEffect` → `closeRef.current.focus()` |
| Focus trapped inside (Tab cycles) | `onKeyDown`, Tab branch |
| Focus restored to the trigger on close | `restoreRef`, captured on open |
| Escape closes | `onKeyDown`, Escape branch |
| Backdrop click closes | full-size backdrop button |
| Body scroll locked | `useEffect`, with scrollbar-width padding |
| `role="dialog"`, `aria-modal`, `aria-labelledby` | on the portal root |

Rendered through `createPortal` into `document.body` so it escapes any parent
stacking or overflow context.

The gallery passes an `onArrow` callback; the modal routes ArrowLeft/ArrowRight
to it. That's the only content-specific keyboard behavior, and the gallery gets
it without reimplementing any dialog mechanics.

The gallery adds one control the video modal has no use for: a **Zoom to 100% /
Fit to screen** toggle. Fitted is the default so the whole canvas is visible on
open; zoomed shows the WebP at native resolution for reading individual nodes.
This is why the source images are stored losslessly — the zoom has to hold up.

**Scroll-lock detail:** locking `overflow: hidden` removes the scrollbar, which
would shift the page content sideways. The lock measures the scrollbar width
and compensates with `padding-right`, so nothing moves.

---

## Image loading strategy

Nothing loads 41 screenshots up front.

- **Page render:** only the four proof-wall thumbnails per pipeline project.
  They're `loading="lazy"` and they request the small `previewSrc` copy, not the
  lossless canvas.
- **Lightbox closed:** the gallery component is unmounted entirely — the parent
  renders it only when `galleryOpen` is true. Zero requests.
- **Lightbox open:** the current image loads eagerly. Its immediate neighbours
  are mounted in a hidden container so the browser has already fetched them by
  the time you arrow across. Thumbnail rail images are lazy and use
  `previewSrc`.

This is why arrowing through the gallery doesn't stutter while still keeping
the page itself light.

---

## No layout shift

`STAGE_MIN_H` (620px) reserves the stage height. Without it, switching from the
tall pipeline stage to the short Mercer stage would collapse the container and
jump the page under the user's cursor.

If you add content that makes a stage taller than 620px, raise this constant to
match the new tallest stage.

---

## Editing content

Everything below is `lib/works.ts`.

### Change copy or numbers

Edit the string in place. The stats render exactly as given — they're real
audit figures, so they're written as data (`value` + `label`), not baked into
prose.

### Add workflow screenshots

All screenshots are real and in place — `IRONPULSE_SHOTS` and
`GLOWTHEORY_SHOTS` are literal arrays. To add one:

1. Drop the full canvas into `public/works/ironpulse/` or
   `public/works/glowtheory/` as **lossless WebP at native resolution**. These
   canvases are deliberately zoomed out, so re-compressing them destroys the
   node labels that make them worth showing.
2. If the shot is a proof-wall preview, also export a small lossy copy to
   `public/works/previews/` and point `previewSrc` at it.
3. Append a `Shot` to the array.

```ts
{
  src: "/works/ironpulse/wf-07.webp",
  label: "WF-07",
  caption: "Enrollment — fires six downstream workflows",
  preview: true,
  previewSrc: "/works/previews/ironpulse-wf-07.webp",
}
```

An entry whose `src` is an empty string still renders as a numbered placeholder
box, so the section degrades safely — but nothing currently relies on that.

### The two image sizes

`src` is the lossless canvas the lightbox opens. `previewSrc` is a small lossy
copy used for the proof-wall card and the lightbox thumbnail rail, both of which
render around 260px wide. Both call sites fall back to `src` when `previewSrc`
is absent, so it's an optimisation, not a requirement.

### Captions and labels

**Both are required** on every shot, and that's a deliberate constraint rather
than an oversight. These canvases are zoomed out far enough that the node text
isn't readable at rest; the caption is what carries the meaning. A screenshot
without one is just texture.

### Workflow count vs. image count

IronPulse has 23 canvases but claims **20 workflows**; Glow Theory has 18
canvases and claims **16**. The difference is `continuation: true`, which marks
a canvas as a continuation of the previous entry's workflow — WF-01A spans three
canvases, and two Glow Theory workflows span two each.

The lightbox counter filters those out, so "4 / 20" agrees with the
"See all 20 workflows" button instead of counting image files. If you add a
multi-canvas workflow and forget the flag, the counter and the button copy in
`galleryIntro` / `galleryButton` will silently disagree.

### Gallery order

**Array order is display order.** It's curated best-first, deliberately not
filename order — `wf-01` is rarely your strongest canvas. Reorder the array to
reorder the lightbox. Keep continuation canvases immediately after the entry
they continue, since the counter assumes that adjacency.

### The Mux video

`muxPlaybackId` is a **playback ID** — public, safe in client-side code.

> Never put a Mux API **token ID** or **token secret** in this repo. Those are
> server-side credentials that grant account access, and this project makes no
> server-side Mux calls. A playback ID is the only Mux value that belongs here.

Note that an **Asset ID** and a **Playback ID** look similar but are not
interchangeable — an Asset ID returns HTTP 400 from the stream endpoint. To
check one quickly:

```bash
curl -s -o /dev/null -w "%{http_code}\n" "https://stream.mux.com/<ID>.m3u8"
# 200 = valid playback ID
```

Set `posterTime` to pick which second the auto-thumbnail is grabbed from, or
set `posterSrc` to override it with a hand-picked image.

---

## Adding a fifth project

1. Append an object to `PROJECTS` in `lib/works.ts`.
2. Give it a unique `key` and one of the three `type` values.
3. Include the fields that type requires — TypeScript will tell you if any are
   missing.

No component changes. The rail and the stage router both derive from the array.

If you need a **fourth stage type**, that's a real change: add the variant to
the `Project` union in `lib/works.ts`, then add a branch in `Stage()` in
`selected-works.tsx`.

---

## Accessibility notes

- The rail is a proper `role="tablist"` with `role="tab"` buttons, wired to the
  stage via `aria-controls` / `aria-labelledby`.
- The stage is `role="tabpanel"` and focusable.
- Stat values use a `<dl>`, with `<dt>` screen-reader-only labels.
- No icon fonts or decorative SVG anywhere — the play triangle is drawn with
  CSS borders, so there's nothing for a screen reader to misread.
- Every interactive element has a visible `focus-visible` outline.

Verified by driving the real page: Tab reaches every rail item, both overlays
open and close by keyboard, arrows navigate the gallery, Escape closes both,
and focus returns to the triggering element afterwards.

---

## Gotchas

- **Don't run `npm run build` while `npm run dev` is live.** The production
  build overwrites `.next` and the dev server then serves stale chunk paths,
  producing 404s on Next's own JavaScript. Symptom: components silently fail to
  mount. Fix: stop dev, delete `.next`, restart.
- **The hero's dev panel is `absolute`, not `fixed`.** It was `fixed` at first,
  which made it float over this section while scrolling. If you ever move it,
  keep it scoped to the hero.
- **`STAGE_MIN_H` is a hand-tuned constant.** It doesn't measure anything. Adding
  a long description or a fourth stat row can overflow it.
