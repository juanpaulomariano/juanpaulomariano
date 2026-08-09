# juanpaulomariano

Portfolio site — Next.js (App Router), TypeScript, Tailwind v4.

No database. All content is static: copy lives in TypeScript config files,
images are files under `public/`, and the walkthrough video is hosted by Mux.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

## Layout

| Path | What |
| --- | --- |
| `app/` | Root layout (fonts, metadata), page, global CSS |
| `components/hero.tsx` | Hero with the 3D tilted logo orbit |
| `components/selected-works.tsx` | "Selected work" switchboard section |
| `components/living-pipeline.tsx` | Play-once lead-journey pipeline |
| `components/modal.tsx` | Shared accessible modal (focus trap, scroll lock) |
| `components/video-modal.tsx` | Mux player, mounted only when opened |
| `components/gallery-lightbox.tsx` | Workflow screenshot gallery |
| `lib/works.ts` | **All Selected Works content** — edit here |
| `lib/tokens.ts` | Shared design tokens (color, easing) |
| `public/logos/` | Tool logos (normalized SVGs) |
| `public/works/` | Project screenshots and posters |

## Editing content

`lib/works.ts` is the single source of truth for the works section. Copy,
stats, pipeline stages, and image lists all live there — no layout code needs
touching to change them.

Gallery order is the array order (curated, best-first — deliberately not
filename order). `preview: true` marks the few thumbnails shown on the calm
proof wall at rest.

### Adding workflow screenshots

Drop files into `public/works/ironpulse/` or `public/works/glowtheory/`, then
fill in the `src` fields in `lib/works.ts`. Entries with an empty `src` render
as labeled placeholder boxes, so the section works before the images land.

### Mux video

`muxPlaybackId` is a **playback ID** — public and safe in client code. Never
put a Mux API token or token secret in this repo; those are server-side
credentials and this project has no server-side Mux calls.

Set `posterSrc` to use a hand-picked poster image, or leave it empty to fall
back to Mux's auto-thumbnail at `posterTime` seconds.

## Dev-only controls

The hero renders a tuning panel (orbit tilt, radii, layers, depth scaling,
headline font) in development builds only — it is gated on `NODE_ENV` and
never ships to production.

## Notes

- Don't run `npm run build` while `npm run dev` is live; the production build
  overwrites `.next` and the dev server then serves stale chunks. Stop dev
  first, or clear `.next` and restart.
