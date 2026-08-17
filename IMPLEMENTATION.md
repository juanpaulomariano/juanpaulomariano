# Blueprint Motion Kit — Implementation Map

Concept: **the drawing drafts itself.** Hairlines stroke in, labels stamp, logs print. No bounces, no parallax, no ambient loops. Two files: `blueprint-motion.css` (import into globals) and `useReveal.ts` (drop into hooks/).

## Priority order

| # | Section | What to do | Kit pieces |
|---|---------|------------|------------|
| 1 | Hero | Staggered one-time entrance: eyebrow → headline → sub → CTAs → logo strip | `.hero-enter`, `[data-hero]`, `--i` 0-4 |
| 2 | Section reveals (02-06) | Per section: number stamps in, hairline draws left→right, heading + body rise. Same pattern every section | `useReveal` + `.reveal`, variants `stamp` / `draw` / `rise` |
| 3 | Logo marquee | Duplicate logo set inside `.marquee-track`, 36s linear loop, pause on hover, edge mask | `.marquee`, `.marquee-track` |
| 4 | Voice AI transcript | First rows print in on scroll (`data-reveal="print"`, cap `--i` at 8). Ring pulse on the incoming-call icon | `print` variant, `.call-ring` |
| 5 | CTAs + nav | Nav underline draws in; buttons get corner ticks on hover + scale on press; arrows nudge | `.nav-link`, `.cta-ticks`, `.link-arrow` |
| 6 | White-label flip | Stack both screenshots, toggle `.show-alt` on the container; branded layer wipes off via clip-path | `.wl-stack`, `.wl-top` |
| 7 | Scroll indicator | Replace static "scroll to explore" mark with drifting tick on a rail | `.scroll-rail`, `.scroll-tick` |

## Rules honored (don't break these when wiring up)

- Only `transform` and `opacity` animate. One deliberate `clip-path` exception (white-label wipe), compositor-friendly.
- No `transition: all` anywhere.
- Asymmetric easing: steep start, slow settle (`--ease-out-quint`, `--ease-draft`).
- Reveals fire **once** (observer disconnects). Never re-trigger on scroll-up.
- One entrance per container: if a card rises, its children don't also stagger inside it. Stagger siblings, not nested layers.
- Hero entrance is the only mount animation on the site. Everything else is scroll- or hover-triggered.
- Full `prefers-reduced-motion` block ships with the CSS. Don't strip it.
- `useReveal` components are isolated `'use client'` leaves; page stays RSC.

## Validation checklist (DevTools, not vibes)

- [ ] Animations panel at 10% speed: hairline draws origin-left, stamp settles without overshoot artifacts
- [ ] Rendering panel → emulate `prefers-reduced-motion: reduce`: everything visible, nothing moves
- [ ] Rapid hover on/off nav links: underline retargets, doesn't restart from zero
- [ ] Marquee: no seam at the -50% loop point (both logo sets identical, no trailing margin)
- [ ] Grep diff for `transition: all`, `width`, `height`, `top`, `left` transitions: zero hits
- [ ] Mobile: transcript stagger cap holds (no row waiting > ~1s), marquee doesn't jank on low-end Android
