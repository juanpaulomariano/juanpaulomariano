"use client";

import { useRef, useState } from "react";
import GalleryLightbox from "@/components/gallery-lightbox";
import LivingPipeline from "@/components/living-pipeline";
import VideoModal, { muxPoster } from "@/components/video-modal";
import { TOKENS } from "@/lib/tokens";
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
      className="px-6 py-20 sm:px-10 sm:py-24 xl:py-[76px]"
      style={{ background: TOKENS.darkBg }}
    >
      <div className="mx-auto max-w-[1320px]">
        {/* ── Section header: a ruled masthead, not a card heading ── */}
        <div
          className="border-t pt-5"
          style={{ borderColor: TOKENS.darkLine }}
        >
          <div className="flex items-baseline justify-between gap-6">
            <p
              className="text-[11px] tracking-[0.2em]"
              style={{ color: TOKENS.darkMuted }}
            >
              Selected work
            </p>
            {/* Section number — architectural, set in the same tabular voice
                as the rail numerals so it reads as a coordinate. */}
            <span
              className="text-[11px] tabular-nums tracking-[0.2em]"
              style={{ color: TOKENS.darkMuted }}
            >
              02
            </span>
          </div>

          {/* Bold grotesk, matching the hero's face and weight exactly.
              Set on two lines so it establishes this as the main section
              without growing large enough to overpower the work below. */}
          <h2
            className="mt-6 max-w-[13em] font-bold text-[clamp(2.3rem,4.8vw,3.9rem)] leading-[1.04] tracking-[-0.025em]"
            style={{ fontFamily: "var(--font-grotesk)", color: TOKENS.darkInk }}
          >
            Systems I&apos;ve built,
            <br />
            start to finish.
          </h2>
        </div>

        {/* ── The switchboard: two columns of one composition, joined by a
               single hairline. No outer card, no rounded container. ── */}
        <div className="mt-10 flex flex-col lg:flex-row lg:gap-12 xl:mt-8">
          {/* LEFT RAIL — an index of systems. Horizontal strip under lg. */}
          <div
            ref={railRef}
            role="tablist"
            aria-label="Selected projects"
            aria-orientation="horizontal"
            className="flex shrink-0 overflow-x-auto pb-2 lg:w-[236px] lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {PROJECTS.map((p, idx) => {
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
                  className="group relative shrink-0 border-t py-3.5 pr-6 text-left transition-opacity duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 lg:pr-0"
                  style={{
                    borderColor: selected ? TOKENS.darkLine : TOKENS.darkHair,
                    minWidth: 176,
                    opacity: selected ? 1 : 0.55,
                  }}
                >
                  {/* Active marker: a short red rule riding the top border —
                      a state indicator, not a filled background. */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-px transition-all duration-300 ease-out"
                    style={{
                      width: selected ? 26 : 0,
                      background: TOKENS.accent,
                    }}
                  />
                  <span
                    className="block text-[10px] tabular-nums tracking-[0.18em]"
                    style={{ color: selected ? TOKENS.accent : TOKENS.darkMuted }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-2 flex items-center gap-2">
                    <span
                      className="text-[15px] tracking-[-0.01em] transition-colors duration-200"
                      style={{
                        color: selected ? TOKENS.darkInk : TOKENS.darkBody,
                        fontWeight: selected ? 600 : 400,
                      }}
                    >
                      {p.railLabel}
                    </span>
                    {p.inProgress && <StatusDot />}
                  </span>
                  <span
                    className="mt-1 block text-[12px]"
                    style={{ color: TOKENS.darkMuted }}
                  >
                    {p.railSublabel}
                  </span>
                </button>
              );
            })}
            {/* Close the index with a rule so it reads as a finished list. */}
            <span
              aria-hidden="true"
              className="hidden border-t lg:block"
              style={{ borderColor: TOKENS.darkHair }}
            />
          </div>

          {/* MAIN STAGE — the inspection area. Separated from the rail by one
              hairline on desktop; no border, no radius, no shadow. */}
          <div
            id={`stage-${active.key}`}
            role="tabpanel"
            aria-labelledby={`tab-${active.key}`}
            tabIndex={0}
            className="stage-reserve relative min-w-0 flex-1 border-t pt-7 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0"
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
            <Stage
              project={active}
              onPlay={() => setVideoOpen(true)}
              onOpenGallery={openGallery}
            />
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
      <p
        className="text-[10px] uppercase tracking-[0.2em]"
        style={{ color: TOKENS.darkMuted }}
      >
        {project.eyebrow}
      </p>
      <div className="mt-2.5 flex flex-wrap items-center gap-3">
        <h3
          className="font-bold text-[clamp(1.5rem,2.5vw,2rem)] leading-[1.12] tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-grotesk)", color: TOKENS.darkInk }}
        >
          {project.title}
        </h3>
        {project.inProgress && <InProgressTag />}
      </div>
      <p className="mt-2 text-[14px]" style={{ color: TOKENS.darkMuted }}>
        {project.subtitle}
      </p>
      {/* Capped at 46em while the stage is one column; from xl the grid track
          is the measure, so the cap is released rather than fighting it. */}
      <p
        className="mt-4 max-w-[46em] text-[14.5px] leading-[1.75] xl:max-w-none"
        style={{ color: TOKENS.darkBody }}
      >
        {project.description}
      </p>
    </>
  );
}

/* ── Pieces ──────────────────────────────────────────────────────────────── */

/* Status marker for in-progress work. A small red dot plus a label reads as a
   system status light; a bordered pill reads as a SaaS badge. */
function StatusDot() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-[5px] w-[5px] shrink-0 rounded-full"
      style={{ background: TOKENS.accent }}
    />
  );
}

function InProgressTag() {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 text-[10px] uppercase tracking-[0.18em]"
      style={{ color: TOKENS.darkMuted }}
    >
      <StatusDot />
      In progress
    </span>
  );
}


function VideoPoster({
  project,
  onPlay,
}: {
  project: Extract<Project, { type: "video" }>;
  onPlay: () => void;
}) {
  const poster = project.posterSrc || muxPoster(project.muxPlaybackId, project.posterTime);

  return (
    <button
      type="button"
      onClick={onPlay}
      className="group relative block aspect-video w-full overflow-hidden border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      /* Light border, not a shadow: the bright build should sit ON the dark
         canvas, not float above it as a card. */
      style={{ borderColor: TOKENS.darkLine, background: TOKENS.white }}
      aria-label={`Play the ${project.title} walkthrough`}
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

      {/* Media control: a flat bar anchored bottom-left rather than a large
          centred circle. Reads as a portfolio caption with a play affordance,
          not a video-platform overlay. */}
      <span className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 px-4 pb-4">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center transition-colors duration-200"
          style={{ background: TOKENS.ink }}
        >
          <span
            className="ml-[2px] block h-0 w-0"
            style={{
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              borderLeft: "8px solid #FFFFFF",
            }}
          />
        </span>
        <span
          className="text-[10px] uppercase tracking-[0.18em] transition-opacity duration-200"
          style={{
            color: TOKENS.ink,
            textShadow: "0 1px 8px rgba(255,255,255,0.9)",
          }}
        >
          Play walkthrough
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
      <p className="text-[13.5px]" style={{ color: TOKENS.darkBody }}>
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
