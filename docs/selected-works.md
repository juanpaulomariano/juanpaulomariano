# Selected Works — how the section works

Context file for the second section of the site (`#work`, directly below the
hero). Covers the architecture, the data flow, every decision that isn't
obvious from reading the code, and how to change things safely.

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
word, swap all 36 screenshots, and reorder the projects without opening a
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
3. **Proof wall** — one sentence, 3–4 faded thumbnails, one button

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

IronPulse has 20 workflow screenshots; Glow Theory has 16. Showing 36 thumbnails
at rest would turn a portfolio into a contact sheet — visually exhausting and
impossible to read.

So at rest the wall shows:

- **one sentence** stating the count ("All 20 workflows, individually built and
  documented.")
- **3–4 thumbnails at 60% opacity**, as texture rather than content
- **one button** — "See all 20 workflows"

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

**Scroll-lock detail:** locking `overflow: hidden` removes the scrollbar, which
would shift the page content sideways. The lock measures the scrollbar width
and compensates with `padding-right`, so nothing moves.

---

## Image loading strategy

Nothing loads 36 screenshots up front.

- **Page render:** only the 3–4 proof-wall thumbnails per pipeline project, and
  they're `loading="lazy"`.
- **Lightbox closed:** the gallery component is unmounted entirely — the parent
  renders it only when `galleryOpen` is true. Zero requests.
- **Lightbox open:** the current image loads eagerly; its two immediate
  neighbours prefetch so arrow navigation feels instant. Thumbnail rail images
  are lazy.

This is why arrowing through the gallery doesn't stutter while still keeping
the page itself light.

---

## No layout shift

`STAGE_MIN_H` (545px) reserves the stage height. Without it, switching from the
tall pipeline stage to the short Mercer stage would collapse the container and
jump the page under the user's cursor.

If you add content that makes a stage taller than 545px, raise this constant to
match the new tallest stage.

---

## Editing content

Everything below is `lib/works.ts`.

### Change copy or numbers

Edit the string in place. The stats render exactly as given — they're real
audit figures, so they're written as data (`value` + `label`), not baked into
prose.

### Add workflow screenshots

1. Drop files into `public/works/ironpulse/` or `public/works/glowtheory/`.
2. Replace the empty `src` strings in that project's `screenshots` array.

Entries with an empty `src` render as numbered placeholder boxes — the section
works fully before any images exist, which is how it's currently running.

Currently the arrays are generated by a `pending()` helper. Once you have real
files, replace the call with a literal array:

```ts
screenshots: [
  { src: "/works/ironpulse/enrollment.png",
    caption: "Enrollment — fires 6 workflows", preview: true },
  { src: "/works/ironpulse/dm-capture.png", preview: true },
  // …
]
```

### Gallery order

**Array order is display order.** It's curated best-first, deliberately not
filename order — `wf-01` is rarely your strongest canvas. Reorder the array to
reorder the lightbox.

### Captions

Optional, per screenshot. Shown under the large image in the lightbox only.

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
