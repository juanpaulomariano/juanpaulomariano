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

/** Tallest stage governs the reserved height — prevents layout shift. */
const STAGE_MIN_H = 545;

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
      className="px-6 py-24 sm:px-10 sm:py-32"
      style={{ background: TOKENS.white }}
    >
      <div className="mx-auto max-w-[1180px]">
        {/* ── Section header: a ruled masthead, not a card heading ── */}
        <div
          className="border-t pt-5"
          style={{ borderColor: TOKENS.ink }}
        >
          <div className="flex items-baseline justify-between gap-6">
            <p
              className="text-[11px] tracking-[0.2em]"
              style={{ color: TOKENS.muted }}
            >
              Selected work
            </p>
            {/* Section number — architectural, set in the same tabular voice
                as the stats so it reads as a coordinate, not decoration. */}
            <span
              className="text-[11px] tabular-nums tracking-[0.2em]"
              style={{ color: TOKENS.muted }}
            >
              02
            </span>
          </div>

          {/* Bold grotesk, matching the hero's face and weight exactly. */}
          <h2
            className="mt-7 max-w-[13em] font-bold text-[clamp(2.1rem,4.4vw,3.4rem)] leading-[1.06] tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-grotesk)", color: TOKENS.ink }}
          >
            Systems I&apos;ve built, start to finish.
          </h2>
        </div>

        {/* ── The switchboard: two columns of one composition, joined by a
               single hairline. No outer card, no rounded container. ── */}
        <div className="mt-16 flex flex-col lg:flex-row lg:gap-14">
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
                  className="group relative shrink-0 border-t py-4 pr-6 text-left transition-opacity duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 lg:pr-0"
                  style={{
                    borderColor: selected ? TOKENS.ink : TOKENS.hair,
                    minWidth: 176,
                    opacity: selected ? 1 : 0.62,
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
                    style={{ color: selected ? TOKENS.accent : TOKENS.muted }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-2 flex items-center gap-2">
                    <span
                      className="text-[15px] tracking-[-0.01em] transition-colors duration-200"
                      style={{
                        color: TOKENS.ink,
                        fontWeight: selected ? 600 : 400,
                      }}
                    >
                      {p.railLabel}
                    </span>
                    {p.inProgress && <StatusDot />}
                  </span>
                  <span
                    className="mt-1 block text-[12px]"
                    style={{ color: TOKENS.muted }}
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
              style={{ borderColor: TOKENS.hair }}
            />
          </div>

          {/* MAIN STAGE — the inspection area. Separated from the rail by one
              hairline on desktop; no border, no radius, no shadow. */}
          <div
            id={`stage-${active.key}`}
            role="tabpanel"
            aria-labelledby={`tab-${active.key}`}
            tabIndex={0}
            className="min-w-0 flex-1 border-t pt-8 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0"
            style={{ borderColor: TOKENS.hair, minHeight: STAGE_MIN_H }}
          >
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
  return (
    <div>
      <p
        className="text-[10px] uppercase tracking-[0.2em]"
        style={{ color: TOKENS.muted }}
      >
        {project.eyebrow}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h3
          className="font-bold text-[clamp(1.5rem,2.5vw,2rem)] leading-[1.12] tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-grotesk)", color: TOKENS.ink }}
        >
          {project.title}
        </h3>
        {project.inProgress && <InProgressTag />}
      </div>
      <p className="mt-2 text-[14px]" style={{ color: TOKENS.muted }}>
        {project.subtitle}
      </p>
      <p
        className="mt-5 max-w-[46em] text-[14.5px] leading-[1.8]"
        style={{ color: TOKENS.body }}
      >
        {project.description}
      </p>

      {project.type === "video" && (
        <div className="mt-9">
          <VideoPoster project={project} onPlay={onPlay} />
        </div>
      )}

      {project.type === "pipeline" && (
        <div className="mt-10">
          <LivingPipeline stages={project.stages} runKey={project.key} />
          <ProofWall
            intro={project.galleryIntro}
            buttonLabel={project.galleryButton}
            shots={project.screenshots}
            onOpen={onOpenGallery}
          />
        </div>
      )}
    </div>
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
      style={{ color: TOKENS.muted }}
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
      style={{ borderColor: TOKENS.hair, background: TOKENS.white }}
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
    <div className="mt-10 border-t pt-7" style={{ borderColor: TOKENS.hair }}>
      <p className="text-[13.5px]" style={{ color: TOKENS.body }}>
        {intro}
      </p>

      {/* Previews are deliberately larger than a typical thumbnail: a GHL
          canvas is ~2500px wide, so at postage-stamp size the graph reads as
          grey noise and undercuts the claim rather than supporting it. At this
          size the branch structure is legible as a diagram, and the workflow's
          real name carries the specifics. The full canvas is one click away. */}
      {/* Single column on phones (screenshot + label reads as a list),
          four-up from sm where the canvases have room to be diagrams. */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-4 sm:gap-3">
        {previews.map((s) => (
          <button
            key={s.i}
            type="button"
            onClick={() => onOpen(s.i)}
            aria-label={`Open ${s.label} in the gallery`}
            className="group/thumb text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <span
              className="block aspect-[16/10] overflow-hidden border transition-colors duration-200 group-hover/thumb:border-[#0A0A0A]"
              style={{ borderColor: TOKENS.hair, background: TOKENS.white }}
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
              className="mt-1.5 block truncate text-[11px] transition-colors duration-200 group-hover/thumb:text-[#0A0A0A]"
              style={{ color: TOKENS.muted }}
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
        className="group/all mt-7 inline-flex items-center gap-3 border-b pb-1.5 text-[13px] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{ borderColor: TOKENS.ink, color: TOKENS.ink }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = TOKENS.accent;
          e.currentTarget.style.borderColor = TOKENS.accent;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = TOKENS.ink;
          e.currentTarget.style.borderColor = TOKENS.ink;
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
