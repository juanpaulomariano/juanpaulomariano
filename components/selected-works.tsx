"use client";

import { useEffect, useRef, useState } from "react";
import GalleryLightbox from "@/components/gallery-lightbox";
import LivingPipeline from "@/components/living-pipeline";
import VideoModal, { muxPoster } from "@/components/video-modal";
import { EASE, TOKENS, TYPE, TYPE_STYLE } from "@/lib/tokens";
import { PROJECTS, type Project, type Shot } from "@/lib/works";

/* ────────────────────────────────────────────────────────────────────────────
   Selected Works — a "switchboard": an index of systems on the left, an
   inspection stage on the right that swaps in place. Three stage types
   (video, in-progress, pipeline) render from the same typed config in
   lib/works.ts.

   The hero is the design law: pure white ground, bold grotesk headings (no
   serif anywhere), Manrope body, hairline rules, and one clay-red accent used
   for a single emphasis at a time. There is deliberately NO stat row — the
   descriptions carry every number inside a sentence rather than as isolated
   trophy figures. The living pipeline is the one bold element here; the
   hero's orbit is the page's other, and they must not compete.

   Stage height is reserved (min-height) so switching projects never shifts
   the page. Content lives in the config; nothing here needs editing to swap
   copy or images.
──────────────────────────────────────────────────────────────────────────── */

/* Reserved stage height — prevents the page shifting when you switch projects.

   The floor is whatever the TALLEST stage needs at a given width. Since every
   stage with a visual now runs two columns from xl, IronPulse (the longest
   pipeline) is the tallest one everywhere, and the video stage — previously
   the governing one at 791px full-bleed — is down to ~309px. Measured:

     width    video   pipeline   tallest
     1440      309      467        467
     1280      360      518        518
     1024      614      686        686   (single column below xl)
      768      630      671        671
      640      584      702        702

   Two values, because the pipeline stage is short and roughly flat once it is
   two columns, but tall below xl where it stacks. Each is the maximum measured
   anywhere inside its range, not at the range's edge — sampling only at a
   breakpoint's lower bound sets a floor that is short by the time you reach
   the upper one.

   Below sm the stages are long stacked columns of very different heights, so
   nothing is reserved there; a shared floor would only add empty scroll.

   THE VALUES LIVE IN app/globals.css, under `.stage-reserve` — 702px from sm,
   518px from xl. They are there rather than here because Tailwind only
   generates utilities it can find as literal strings in the source, so a class
   built by interpolating a constant silently produces no CSS at all. If you
   change a stage's content enough to alter its height, re-measure and update
   them there. */

export default function SelectedWorks() {
  const [activeKey, setActiveKey] = useState(PROJECTS[0].key);
  const [videoOpen, setVideoOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStart, setGalleryStart] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);

  const active = PROJECTS.find((p) => p.key === activeKey) ?? PROJECTS[0];

  const openGallery = (index: number) => {
    setGalleryStart(index);
    setGalleryOpen(true);
  };

  return (
    <section
      id="work"
      /* py trimmed at xl so the section fits a 900px laptop viewport: at that
         width the stage is two columns and short, and the padding is the only
         slack left that isn't content. */
      className="px-6 py-20 sm:px-10 sm:py-24 xl:py-[68px]"
      style={{ background: TOKENS.darkBg }}
    >
      <div className="mx-auto max-w-[1320px]">
        {/* ── Section header ──────────────────────────────────────────────
            A numeral, and no text eyebrow. The eyebrow used to read "Selected
            work" in the same small uppercase tracked voice as the project
            eyebrow and the pipeline label, so several things whispered at the
            same pitch and nothing led. The headline says what the section is.

            The numeral stays because the page numbers its sections 01-06 and a
            single figure against a rule cannot compete with a headline. */}
        <div className="border-t pt-5" style={{ borderColor: TOKENS.darkLine }}>
          <div className="flex justify-end">
            <span
              className="tabular-nums tracking-[0.2em]"
              style={{
                color: TOKENS.darkMuted,
                fontSize: TYPE.micro,
                ...TYPE_STYLE.micro,
              }}
            >
              02
            </span>
          </div>
        </div>

        <div className="mt-5">
          {/* Bold grotesk, matching the hero's face and weight exactly. Set on
              two lines so it establishes this as the main section without
              growing large enough to overpower the work below. */}
          <h2
            className="max-w-[13em]"
            style={{
              fontFamily: "var(--font-grotesk)",
              color: TOKENS.darkInk,
              fontSize: TYPE.section,
              ...TYPE_STYLE.section,
            }}
          >
            Systems I&apos;ve built,
            <br />
            start to finish.
          </h2>
        </div>

        {/* ── The switchboard: two columns of one composition, joined by a
               single hairline. No outer card, no rounded container. ── */}
        <div className="mt-10 flex flex-col lg:flex-row lg:gap-14 xl:mt-9 xl:gap-16">
          {/* LEFT RAIL — an index of systems. Horizontal strip under lg. */}
          <div
            ref={railRef}
            role="tablist"
            aria-label="Selected projects"
            aria-orientation="horizontal"
            className="flex shrink-0 overflow-x-auto pb-2 lg:w-[236px] lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {PROJECTS.map((p) => {
              const selected = p.key === activeKey;
              return (
                <button
                  key={p.key}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`stage-${p.key}`}
                  id={`tab-${p.key}`}
                  type="button"
                  onClick={() => setActiveKey(p.key)}
                  /* The whole row is the target, and the accent rule slides
                     along the left edge on desktop rather than capping the top
                     border, so selecting a project reads as moving a marker
                     down an index instead of relighting a box. */
                  className="group relative shrink-0 border-t py-4 pr-6 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 lg:border-l lg:border-t-0 lg:pl-5 lg:pr-0"
                  style={{
                    borderColor: selected ? TOKENS.darkInk : TOKENS.darkHair,
                    minWidth: 176,
                  }}
                >
                  {/* Active marker. Vertical on desktop where the rail is a
                      column, horizontal under lg where it is a tab strip. */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-px w-full origin-left transition-transform duration-300 ease-out lg:h-full lg:w-px lg:origin-top"
                    style={{
                      background: TOKENS.accent,
                      transform: selected ? "scale(1)" : "scaleX(0)",
                    }}
                  />
                  {/* Name carries the weight now: one size up, and the
                      selected/unselected difference is colour, not opacity, so
                      an inactive project stays legible instead of dimming into
                      the background. */}
                  <span
                    className="block transition-colors duration-300"
                    style={{
                      fontFamily: "var(--font-grotesk)",
                      color: selected ? TOKENS.darkInk : TOKENS.darkBody,
                      fontSize: TYPE.indexItem,
                      ...TYPE_STYLE.indexItem,
                    }}
                  >
                    {p.railLabel}
                  </span>
                  <span
                    className="mt-1.5 block transition-colors duration-300"
                    style={{
                      color: selected ? TOKENS.darkBody : TOKENS.darkMuted,
                      fontSize: TYPE.micro,
                      ...TYPE_STYLE.micro,
                    }}
                  >
                    {p.railSublabel}
                    {/* Status as a word, not a coloured dot. The dot was
                        decoration that needed the sublabel to explain it. */}
                    {p.inProgress && (
                      <span style={{ color: TOKENS.accent }}> · In progress</span>
                    )}
                  </span>
                </button>
              );
            })}
            {/* Runs the rail's spine past the last project so the index reads
                as a continuous column rather than stopping at the final row.
                Only on desktop, where the rail is vertical. */}
            <span
              aria-hidden="true"
              className="hidden border-l lg:block lg:h-10"
              style={{ borderColor: TOKENS.darkHair }}
            />
          </div>

          {/* MAIN STAGE — the inspection area. The dividing hairline now lives
              on the rail's own rows (which each carry a left border), so the
              stage no longer draws a second vertical rule beside it; two
              parallel lines a few pixels apart read as a rendering fault. */}
          <div
            id={`stage-${active.key}`}
            role="tabpanel"
            aria-labelledby={`tab-${active.key}`}
            tabIndex={0}
            className="stage-reserve relative min-w-0 flex-1 border-t pt-7 lg:border-t-0 lg:pt-0"
            style={{ borderColor: TOKENS.darkHair }}
          >
            {/* Height reservation — see STAGE_H_SM / STAGE_H_XL. Floated and
                zero-width so it contributes height without taking part in the
                stage's normal flow. Hidden below sm, where the stages are
                stacked columns and no shared floor makes sense. */}
            <div
              aria-hidden="true"
              className="pointer-events-none float-left hidden w-0 sm:block"
              style={{ paddingTop: `var(--stage-h)` }}
            />
            {/* key remounts on selection so the entrance replays; see
                `.stage-in` in globals.css for why it exists. */}
            <div key={active.key} className="stage-in">
              <Stage
                project={active}
                onPlay={() => setVideoOpen(true)}
                onOpenGallery={openGallery}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals — mounted only while open so nothing loads at page render. */}
      {active.type === "video" && (
        <VideoModal
          open={videoOpen}
          onClose={() => setVideoOpen(false)}
          playbackId={active.muxPlaybackId}
          posterSrc={active.posterSrc}
          posterTime={active.posterTime}
          title={`${active.title} — walkthrough`}
        />
      )}
      {active.type === "pipeline" && galleryOpen && (
        <GalleryLightbox
          open={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          shots={active.screenshots}
          title={active.title}
          startIndex={galleryStart}
        />
      )}
    </section>
  );
}

/* ── Stage router ────────────────────────────────────────────────────────── */

function Stage({
  project,
  onPlay,
  onOpenGallery,
}: {
  project: Project;
  onPlay: () => void;
  onOpenGallery: (i: number) => void;
}) {
  /* Every stage with a visual runs two columns from `xl`: context on the left,
     the working system on the right. It reclaims the empty right-hand band and
     collapses the stage height enough that the whole section fits a laptop
     viewport without scrolling — the description, the visual, and (for
     pipelines) the first row of workflow thumbnails all read together.

     Why `xl` and not `lg`: on desktop the rail (236px) already takes a column,
     so splitting the stage makes three zones across. Measured at 1024 that
     leaves the text column at ~32 characters per line and the pipeline's five
     nodes at ~69px — too narrow for "Consultation booked" to sit on one line,
     and thumbnails shrink to the size where a GHL canvas is grey noise. At
     1280 the same split gives ~48 characters and ~96px nodes, which holds.

     The video poster is here too, rather than staying full-bleed. Full width
     it is ~556px of 16:9 on its own, which cannot fit the viewport alongside
     the masthead; in the 58% track it is ~325px and stays uncropped. It reads
     smaller, but it reads whole — and PSD Limo now matches the other three
     projects instead of being the one stage with a different shape. */
  const media =
    project.type === "pipeline" ? (
      <>
        <LivingPipeline stages={project.stages} runKey={project.key} />
        <ProofWall
          intro={project.galleryIntro}
          buttonLabel={project.galleryButton}
          shots={project.screenshots}
          onOpen={onOpenGallery}
        />
      </>
    ) : project.type === "video" ? (
      <VideoPoster project={project} onPlay={onPlay} />
    ) : null;

  /* The in-progress stage is text only — nothing to put in a second column, so
     it stays one column and simply runs short. */
  if (!media) {
    return (
      <div>
        <StageIntro project={project} />
      </div>
    );
  }

  return (
    <div className="xl:grid xl:grid-cols-[42fr_58fr] xl:gap-10">
      {/* min-w-0 on both cells: grid children default to min-width:auto, so
          without it the thumbnail row would push the column wider than its
          track instead of fitting inside it. */}
      <div className="min-w-0">
        <StageIntro project={project} />
      </div>
      <div className="mt-7 min-w-0 xl:mt-0">{media}</div>
    </div>
  );
}

/* The written half of every stage. Shared so the one-column and two-column
   layouts can never drift apart. */
function StageIntro({ project }: { project: Project }) {
  return (
    <>
      {/* Title first. The category used to sit above it as a third small
          uppercase label, competing with the rail and the section header; it
          is more useful as a plain caption under the name, where it reads as
          information rather than as chrome. */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3
          style={{
            fontFamily: "var(--font-grotesk)",
            color: TOKENS.darkInk,
            fontSize: TYPE.subsection,
            ...TYPE_STYLE.subsection,
          }}
        >
          {project.title}
        </h3>
        {project.inProgress && <InProgressTag />}
      </div>
      <p
        className="mt-2.5"
        style={{
          color: TOKENS.darkMuted,
          fontSize: TYPE.small,
          ...TYPE_STYLE.small,
          letterSpacing: "0.02em",
        }}
      >
        {project.eyebrow}
      </p>

      {/* Subtitle is the one line that states what the thing IS, so it gets
          real size and the body colour rather than being greyed out under the
          title where it read as a caption. */}
      <p
        className="mt-5"
        style={{
          color: TOKENS.darkInk,
          fontSize: TYPE.lead,
          ...TYPE_STYLE.lead,
        }}
      >
        {project.subtitle}
      </p>

      {/* Capped at 46em while the stage is one column; from xl the grid track
          is the measure, so the cap is released rather than fighting it. */}
      <p
        className="mt-4 max-w-[46em] xl:max-w-none"
        style={{
          color: TOKENS.darkBody,
          fontSize: TYPE.body,
          ...TYPE_STYLE.body,
        }}
      >
        {project.description}
      </p>
    </>
  );
}

/* ── Pieces ──────────────────────────────────────────────────────────────── */

/* Status marker for in-progress work. Set in the accent and sized to sit on
   the title's baseline: the word alone carries the state, so there is no
   coloured dot needing a label to explain what it means. */
function InProgressTag() {
  return (
    <span
      className="shrink-0"
      style={{ color: TOKENS.accent, fontSize: TYPE.small, ...TYPE_STYLE.small }}
    >
      In progress
    </span>
  );
}


/* The poster is a screenshot of a website with a small white mark on it, and a
   screenshot is a thing you look at, not a thing you click. Three changes make
   it read as a control without adding decoration:

   1. The mark primes once when the poster arrives — one swell and settle, then
      it rests. Same one-shot shape as the white-label toggle's nudge, and not
      a loop for the same reason the pipeline is not one.
   2. A label unfurls out of the mark on hover and on focus.
   3. The scrim actually deepens now. It never did: an inline opacity beat the
      hover class, so the transition ran against a value it could not change.

   On the label. One was deliberately removed from this exact spot before, as
   "another small uppercase tracked string burnt over the screenshot". This is
   a different object: sentence case at the interface type role, ink on white
   INSIDE the plate rather than burnt over the image, and present only on hover
   and focus, so it is never part of the resting composition that had the
   whisper problem.

   It also becomes the button's accessible name, which is why the aria-label is
   gone: a visible label matching the announced one is the stronger version
   (WCAG 2.5.3), and keeping both made the button state its purpose twice. The
   project name is not lost — this sits inside a tabpanel labelled by its rail
   tab, so the panel already supplies that context. */
function VideoPoster({
  project,
  onPlay,
}: {
  project: Extract<Project, { type: "video" }>;
  onPlay: () => void;
}) {
  const poster = project.posterSrc || muxPoster(project.muxPlaybackId, project.posterTime);
  const [reduced, setReduced] = useState(false);
  const [primed, setPrimed] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* Prime once, when the poster is actually on screen. Tied to visibility
     rather than to mount: the stage swaps in place, so mounting fires every
     time you click back to this project — including while the section is
     scrolled past, which would spend the animation on nobody. */
  useEffect(() => {
    if (reduced || primed || !ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPrimed(true);
        io.disconnect();
      },
      { threshold: 0.5 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [reduced, primed]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onPlay}
      className="group relative block aspect-video w-full overflow-hidden border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      /* Light border, not a shadow: the bright build should sit ON the dark
         canvas, not float above it as a card. */
      style={{ borderColor: TOKENS.darkLine, background: TOKENS.white }}
    >
      {poster ? (
        <img
          src={poster}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span
          className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.18em]"
          style={{ color: TOKENS.muted }}
        >
          Poster pending
        </span>
      )}

      {/* Rest scrim: always on, holds the mark legible against any frame. */}
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,10,0.34), rgba(10,10,10,0) 42%)",
        }}
      />
      {/* Hover scrim, cross-fading over the rest one. Two stacked layers rather
          than one animated gradient: gradients do not interpolate dependably
          across browsers, and opacity is composited. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,10,0.58), rgba(10,10,10,0) 64%)",
        }}
      />

      {/* The plate and the label are one horizontal unit, so the label grows
          out of the mark instead of appearing beside it. */}
      <span className="absolute bottom-4 left-4 flex items-stretch">
        {/* Two scales act on this plate: the one-shot prime and the hover
            response. An animation's value always beats a transition's on the
            same property, so if both drove `transform` the prime would pin the
            plate at scale(1) and the hover would never show. Instead the prime
            animates `--prime-scale` (see globals.css) and the hover animates
            `--hover-scale`, and the transform multiplies them. */}
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center transition-[--hover-scale] duration-300 ease-out group-hover:[--hover-scale:1.08] group-focus-visible:[--hover-scale:1.08] ${
            primed ? "play-prime" : ""
          }`}
          style={{
            background: TOKENS.white,
            transform: "scale(calc(var(--prime-scale, 1) * var(--hover-scale, 1)))",
          }}
        >
          <span
            aria-hidden="true"
            className="ml-[3px] block h-0 w-0"
            style={{
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderLeft: `10px solid ${TOKENS.ink}`,
            }}
          />
        </span>

        {/* 0fr -> 1fr is the one way to transition to CONTENT width without
            hard-coding a px value the copy then has to fit. The inner cell
            needs min-w-0 and overflow-hidden or the text refuses to compress
            and the track never collapses. */}
        <span
          className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-300 group-hover:grid-cols-[1fr] group-focus-visible:grid-cols-[1fr]"
          style={
            reduced
              ? { gridTemplateColumns: "1fr", transitionDuration: "0ms" }
              : { transitionTimingFunction: EASE.enter }
          }
        >
          <span className="min-w-0 overflow-hidden">
            <span
              className="flex h-11 items-center whitespace-nowrap px-3.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
              style={{
                background: TOKENS.white,
                color: TOKENS.ink,
                fontSize: TYPE.ui,
                ...TYPE_STYLE.ui,
                transitionDuration: reduced ? "0ms" : undefined,
              }}
            >
              Watch the walkthrough
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}

function ProofWall({
  intro,
  buttonLabel,
  shots,
  onOpen,
}: {
  intro: string;
  buttonLabel: string;
  shots: Shot[];
  onOpen: (i: number) => void;
}) {
  /* Calm at rest: one sentence, a few faded thumbs as texture, one button.
     The previews are the flagged complex canvases, not the first N. */
  const previews = shots
    .map((s, i) => ({ ...s, i }))
    .filter((s) => s.preview)
    .slice(0, 4);

  return (
    <div className="mt-7 border-t pt-5" style={{ borderColor: TOKENS.darkHair }}>
      <p style={{ color: TOKENS.darkBody, fontSize: TYPE.ui, ...TYPE_STYLE.ui }}>
        {intro}
      </p>

      {/* Previews are deliberately larger than a typical thumbnail: a GHL
          canvas is ~2500px wide, so at postage-stamp size the graph reads as
          grey noise and undercuts the claim rather than supporting it. At this
          size the branch structure is legible as a diagram, and the workflow's
          real name carries the specifics. The full canvas is one click away. */}
      {/* Single column on phones (screenshot + label reads as a list),
          four-up from sm where the canvases have room to be diagrams. */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4 sm:gap-3">
        {previews.map((s) => (
          <button
            key={s.i}
            type="button"
            onClick={() => onOpen(s.i)}
            aria-label={`Open ${s.label} in the gallery`}
            className="group/thumb text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <span
              className="block aspect-[16/10] overflow-hidden border transition-colors duration-200"
              style={{ borderColor: TOKENS.darkHair, background: TOKENS.white }}
            >
              {s.src ? (
                <img
                  src={s.previewSrc || s.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-left opacity-80 transition-opacity duration-200 group-hover/thumb:opacity-100"
                />
              ) : (
                <span
                  className="flex h-full w-full items-center justify-center text-[10px]"
                  style={{ color: TOKENS.muted }}
                >
                  {s.i + 1}
                </span>
              )}
            </span>
            <span
              className="mt-1.5 block truncate text-[11px] transition-colors duration-200 group-hover/thumb:text-white"
              style={{ color: TOKENS.darkMuted }}
            >
              {s.label}
            </span>
          </button>
        ))}
      </div>

      {/* A ruled text control, not a filled pill: the section's only other
          affordances are hairlines, and a solid capsule reads as SaaS UI. */}
      <button
        type="button"
        onClick={() => onOpen(0)}
        className="group/all mt-5 inline-flex items-center gap-3 border-b pb-1.5 text-[13px] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{ borderColor: TOKENS.darkInk, color: TOKENS.darkInk }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = TOKENS.accent;
          e.currentTarget.style.borderColor = TOKENS.accent;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = TOKENS.darkInk;
          e.currentTarget.style.borderColor = TOKENS.darkInk;
        }}
      >
        {buttonLabel}
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover/all:translate-x-1"
        >
          →
        </span>
      </button>
    </div>
  );
}
