"use client";

import { useRef, useState } from "react";
import GalleryLightbox from "@/components/gallery-lightbox";
import LivingPipeline from "@/components/living-pipeline";
import VideoModal, { muxPoster } from "@/components/video-modal";
import { TOKENS } from "@/lib/tokens";
import { PROJECTS, type Project, type Shot, type Stat } from "@/lib/works";

/* ────────────────────────────────────────────────────────────────────────────
   Selected Works — one framed "switchboard": a rail of projects on the left,
   a main stage on the right that swaps in place. Three stage types (video,
   in-progress, pipeline) render from the same typed config in lib/works.ts.

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
      className="px-6 py-20 sm:px-10 sm:py-28"
      style={{ background: TOKENS.warm }}
    >
      {/* Section header */}
      <div className="mx-auto max-w-[1180px]">
        <p
          className="text-[12px] tracking-[0.14em]"
          style={{ color: TOKENS.muted }}
        >
          Selected work
        </p>
        <h2
          className="mt-3 max-w-[16em] text-[clamp(2rem,3.6vw,3rem)] leading-[1.08]"
          style={{ fontFamily: "var(--font-serif)", color: TOKENS.ink }}
        >
          Systems I&apos;ve architected, end to end.
        </h2>

        {/* ── The switchboard ── */}
        <div
          className="mt-10 overflow-hidden rounded-xl border bg-white"
          style={{ borderColor: TOKENS.line }}
        >
          <div className="flex flex-col lg:flex-row">
            {/* LEFT RAIL — becomes a horizontal tab strip under lg */}
            <div
              ref={railRef}
              role="tablist"
              aria-label="Selected projects"
              aria-orientation="horizontal"
              className="flex shrink-0 overflow-x-auto border-b lg:w-[268px] lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r"
              style={{ borderColor: TOKENS.line }}
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
                    className="group relative shrink-0 border-l-2 px-5 py-4 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 lg:border-b lg:last:border-b-0"
                    style={{
                      borderLeftColor: selected ? TOKENS.accent : "transparent",
                      borderBottomColor: TOKENS.line,
                      background: selected ? "rgba(192,57,43,0.035)" : "transparent",
                      minWidth: 190,
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="text-[14px] font-medium"
                        style={{ color: TOKENS.ink }}
                      >
                        {p.railLabel}
                      </span>
                      {p.inProgress && <InProgressPill small />}
                    </span>
                    <span
                      className="mt-0.5 block text-[12px]"
                      style={{ color: TOKENS.muted }}
                    >
                      {p.railSublabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* MAIN STAGE */}
            <div
              id={`stage-${active.key}`}
              role="tabpanel"
              aria-labelledby={`tab-${active.key}`}
              tabIndex={0}
              className="min-w-0 flex-1 px-5 py-7 sm:px-8 sm:py-9"
              style={{ minHeight: STAGE_MIN_H }}
            >
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
  return (
    <div>
      <p
        className="text-[11px] uppercase tracking-[0.14em]"
        style={{ color: TOKENS.muted }}
      >
        {project.eyebrow}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h3
          className="text-[clamp(1.5rem,2.4vw,2rem)] leading-tight"
          style={{ fontFamily: "var(--font-serif)", color: TOKENS.ink }}
        >
          {project.title}
        </h3>
        {project.inProgress && <InProgressPill />}
      </div>
      <p className="mt-1.5 text-[14px]" style={{ color: TOKENS.muted }}>
        {project.subtitle}
      </p>
      <p
        className="mt-4 max-w-[52em] text-[14px] leading-[1.75]"
        style={{ color: TOKENS.body }}
      >
        {project.description}
      </p>

      {project.type === "video" && (
        <div className="mt-7">
          <VideoPoster project={project} onPlay={onPlay} />
          <StatRow stats={project.stats} />
        </div>
      )}

      {project.type === "progress" && (
        <div className="mt-7">
          <StatRow stats={project.stats} />
        </div>
      )}

      {project.type === "pipeline" && (
        <div className="mt-8">
          <LivingPipeline stages={project.stages} runKey={project.key} />
          <StatRow stats={project.stats} />
          <ProofWall
            sentence={project.proofSentence}
            shots={project.screenshots}
            onOpen={onOpenGallery}
          />
        </div>
      )}
    </div>
  );
}

/* ── Pieces ──────────────────────────────────────────────────────────────── */

function InProgressPill({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border ${
        small ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"
      }`}
      style={{ borderColor: TOKENS.line, color: TOKENS.muted, background: TOKENS.warm }}
    >
      In progress
    </span>
  );
}

function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <dl
      className="mt-7 grid gap-x-6 gap-y-4 border-t pt-5 sm:grid-cols-3"
      style={{ borderColor: TOKENS.line }}
    >
      {stats.map((s) => (
        <div key={s.label}>
          <dt className="sr-only">{s.label}</dt>
          <dd>
            <span
              className="block text-[20px] leading-none"
              style={{ fontFamily: "var(--font-serif)", color: TOKENS.ink }}
            >
              {s.value}
            </span>
            <span
              className="mt-1.5 block text-[12px]"
              style={{ color: TOKENS.muted }}
            >
              {s.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
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
      className="group relative block aspect-video w-full overflow-hidden rounded-lg border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ borderColor: TOKENS.line, background: "#EFEBE4" }}
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
          className="absolute inset-0 flex items-center justify-center text-[12px] uppercase tracking-[0.08em]"
          style={{ color: TOKENS.muted }}
        >
          Poster pending
        </span>
      )}

      {/* Play affordance — a triangle drawn with borders, not an icon set. */}
      <span className="absolute inset-0 flex items-center justify-center">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 transition-transform duration-200 group-hover:scale-[1.06]"
          style={{ boxShadow: "0 10px 30px -12px rgba(10,10,10,0.4)" }}
        >
          <span
            className="ml-[3px] block h-0 w-0"
            style={{
              borderTop: "8px solid transparent",
              borderBottom: "8px solid transparent",
              borderLeft: `13px solid ${TOKENS.ink}`,
            }}
          />
        </span>
      </span>
    </button>
  );
}

function ProofWall({
  sentence,
  shots,
  onOpen,
}: {
  sentence: string;
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
    <div className="mt-8 border-t pt-6" style={{ borderColor: TOKENS.line }}>
      <p className="text-[13px]" style={{ color: TOKENS.body }}>
        {sentence}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {previews.map((s) => (
          <button
            key={s.i}
            type="button"
            onClick={() => onOpen(s.i)}
            aria-label={`Open workflow ${s.i + 1} in the gallery`}
            className="h-[62px] w-[104px] overflow-hidden rounded border opacity-60 transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ borderColor: TOKENS.line, background: "#EFEBE4" }}
          >
            {s.src ? (
              <img
                src={s.src}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <span
                className="flex h-full w-full items-center justify-center text-[10px]"
                style={{ color: TOKENS.muted }}
              >
                {s.i + 1}
              </span>
            )}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onOpen(0)}
        className="mt-5 rounded-full px-5 py-2.5 text-[13px] font-medium text-white transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ background: TOKENS.ink }}
        onMouseEnter={(e) => (e.currentTarget.style.background = TOKENS.accent)}
        onMouseLeave={(e) => (e.currentTarget.style.background = TOKENS.ink)}
      >
        See all {shots.length} workflows
      </button>
    </div>
  );
}
