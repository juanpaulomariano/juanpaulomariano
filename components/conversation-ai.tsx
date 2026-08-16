"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CallTransport from "@/components/call-transport";
import GalleryLightbox from "@/components/gallery-lightbox";
import LivingPipeline from "@/components/living-pipeline";
import TranscriptRail from "@/components/transcript-rail";
import {
  CALL_STAGES,
  CAPABILITIES,
  CHANNELS,
  PROOF_PREVIEWS,
  SECTION,
} from "@/lib/conversation";
import { EASE, TOKENS, TYPE, TYPE_STYLE } from "@/lib/tokens";

/* ────────────────────────────────────────────────────────────────────────────
   Conversation AI — compressed to one laptop viewport.

   The previous build explained the system in prose: a five-row system map,
   an evidence citation with captions, an explainer per group. Reading it
   required scrolling inside the section, which kills the overview (the page's
   rule is section-per-screen). This build moves every explanation into an
   artifact the reader already knows how to use:

   · the SYSTEM MAP became the LivingPipeline track from Selected Work — five
     labels and a travelling dot, armed by an IntersectionObserver so the
     one-shot run happens in view, not off-screen;
   · the TRANSCRIPT lives in a fixed-height pane that scrolls internally and
     follows the current line during playback, so a long call cannot grow the
     section;
   · the EVIDENCE block became Selected Work's proof-wall grammar — one
     sentence, four small canvases, one "see all" control. The captions still
     exist; they live in the lightbox where the reader asked for them.

   DOM order is mobile/screen-reader order: intro → demo → proof. At xl the
   demo owns the left track across both rows and the text stacks on the
   right, keeping this section's artifact-LEFT/text-RIGHT mirror of
   white-label.
──────────────────────────────────────────────────────────────────────────── */

export default function ConversationAi() {
  const [activeKey, setActiveKey] = useState(CHANNELS[0].key);
  const [cursor, setCursor] = useState(-1);
  const [reduced, setReduced] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [galleryStart, setGalleryStart] = useState(0);
  /* The pipeline holds at stage one until the track is actually visible —
     a one-shot travel spent off-screen is motion nobody saw. */
  const [pipelineArmed, setPipelineArmed] = useState(false);
  const pipelineRef = useRef<HTMLDivElement | null>(null);
  const paneRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const active = CHANNELS.find((c) => c.key === activeKey) ?? CHANNELS[0];
  const multiple = CHANNELS.length > 1;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* Arm the pipeline once it scrolls into view. Fires once, then disconnects:
     replay after that belongs to the track's own Replay control. */
  useEffect(() => {
    const el = pipelineRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPipelineArmed(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* The text channel advances on a timer, the same shape as the living
     pipeline: absolute offsets scheduled up front so they cannot drift, and
     the array cleared both at effect start and in cleanup so a stale timer
     from the previous channel can never fire into the new one. */
  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    if (active.kind !== "text") {
      setCursor(-1);
      return;
    }

    const last = active.lines.length - 1;
    if (reduced) {
      setCursor(last);
      return;
    }

    setCursor(-1);
    for (let i = 0; i <= last; i++) {
      timers.current.push(
        setTimeout(() => setCursor(i), (i + 1) * active.cadenceMs),
      );
    }
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [active, reduced]);

  /* Follow the current line inside the pane. Manual scrollTop math instead of
     scrollIntoView: scrollIntoView walks every scrollable ancestor and would
     yank the PAGE toward the pane during playback, which is exactly the kind
     of scroll theft this pane exists to prevent. */
  useEffect(() => {
    const pane = paneRef.current;
    if (!pane || cursor < 0) return;
    const row = pane.querySelector<HTMLElement>("[data-current]");
    if (!row) return;
    const pr = pane.getBoundingClientRect();
    const rr = row.getBoundingClientRect();
    if (rr.top < pr.top || rr.bottom > pr.bottom) {
      pane.scrollTo({
        top: pane.scrollTop + (rr.top - pr.top) - pr.height / 2 + rr.height / 2,
        behavior: reduced ? "auto" : "smooth",
      });
    }
  }, [cursor, reduced]);

  /* Stable identity so the transport's rAF effect does not tear down and
     restart on every parent render. */
  const handleCursor = useCallback((i: number) => setCursor(i), []);

  /* The lightbox carries every captured shot; the page shows only the proof
     wall's four previews. While nothing is captured, both unmount. */
  const shots = active.evidence.filter((e) => e.src);
  const hasEvidence = shots.length > 0;
  const previews = PROOF_PREVIEWS.map((name) =>
    shots.find((s) => s.label.includes(name)),
  ).filter((s): s is NonNullable<typeof s> => Boolean(s));

  /* Open the gallery at a named workflow's canvas (or at the start). The
     capabilities rows and the proof wall both route through this. */
  const openGallery = (target?: string) => {
    let index = 0;
    if (target) {
      const i = shots.findIndex((s) => s.label.includes(target));
      if (i >= 0) index = i;
    }
    setGalleryStart(index);
    setLightboxOpen(true);
  };

  return (
    <section
      id="ai"
      className="px-6 py-20 sm:px-10 sm:py-24"
      style={{ background: TOKENS.white }}
    >
      <div className="mx-auto max-w-[1320px]">
        {/* Numeral only — the page numbers its sections, it does not label
            them. */}
        <div className="border-t pt-5" style={{ borderColor: TOKENS.ink }}>
          <div className="flex justify-end">
            <span
              className="tabular-nums tracking-[0.2em]"
              style={{
                color: TOKENS.muted,
                fontSize: TYPE.micro,
                ...TYPE_STYLE.micro,
              }}
            >
              03
            </span>
          </div>
        </div>

        <div className="mt-8 xl:grid xl:grid-cols-[52fr_48fr] xl:gap-x-12 2xl:grid-cols-[56fr_44fr] 2xl:gap-x-14">
          {/* ── Intro: what this is ── */}
          <div className="min-w-0 xl:col-start-2 xl:row-start-1">
            <h2
              style={{
                fontFamily: "var(--font-grotesk)",
                color: TOKENS.ink,
                fontSize: TYPE.section,
                ...TYPE_STYLE.section,
              }}
            >
              <span className="block" style={{ color: TOKENS.muted }}>
                {SECTION.titleTop}
              </span>
              <span className="block text-balance">{SECTION.titleBottom}</span>
            </h2>

            <p
              className="mt-4 max-w-[46ch]"
              style={{
                color: TOKENS.muted,
                fontSize: TYPE.body,
                ...TYPE_STYLE.body,
              }}
            >
              {SECTION.lead}
            </p>

            {/* One operational fact where a lesser page would put a stat
                block. A demonstration practice has no honest ROI numbers. */}
            <p
              className="mt-3 max-w-[46ch]"
              style={{
                color: TOKENS.body,
                fontSize: TYPE.small,
                ...TYPE_STYLE.small,
              }}
            >
              {SECTION.factLine}
            </p>

            <div className="mt-5 flex items-center gap-3">
              <img
                src="/logos/vapi.svg"
                alt="Vapi"
                width={54}
                style={{ width: 54, height: "auto" }}
                loading="lazy"
                decoding="async"
              />
              <p
                className="min-w-0"
                style={{
                  color: TOKENS.muted,
                  fontSize: TYPE.small,
                  ...TYPE_STYLE.small,
                }}
              >
                {SECTION.stackNote}
              </p>
            </div>
          </div>

          {/* ── Demo: the call surface, then the call's journey ── */}
          <div className="mt-8 min-w-0 xl:col-start-1 xl:row-span-2 xl:row-start-1 xl:mt-0">
            {multiple && (
              <div
                role="group"
                aria-label="Switch between the voice call and the message thread"
                className="relative mb-5 inline-flex border p-1"
                style={{ borderColor: TOKENS.line }}
              >
                <span
                  aria-hidden="true"
                  className="absolute bottom-1 top-1 w-[calc(50%-0.25rem)]"
                  style={{
                    left: "0.25rem",
                    background: TOKENS.accent,
                    transform:
                      active.key === CHANNELS[0].key
                        ? "translateX(0)"
                        : "translateX(100%)",
                    transition: reduced
                      ? "none"
                      : `transform 420ms ${EASE.enter}`,
                  }}
                />
                {CHANNELS.map((c) => {
                  const on = c.key === active.key;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setActiveKey(c.key)}
                      aria-pressed={on}
                      className="relative z-10 px-4 py-2.5 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-6"
                      style={{
                        color: on ? TOKENS.white : TOKENS.muted,
                        fontSize: TYPE.ui,
                        ...TYPE_STYLE.ui,
                      }}
                    >
                      {c.switchLabel}
                    </button>
                  );
                })}
              </div>
            )}

            {/* The call surface: a product panel, not a card. Same framing
                device as the white-label browser window. */}
            <div className="border" style={{ borderColor: TOKENS.line }}>
              <div
                className="flex items-baseline justify-between gap-4 border-b px-4 py-3 sm:px-5"
                style={{ borderColor: TOKENS.line, background: "#FCFCFC" }}
              >
                <span
                  className="min-w-0 truncate"
                  style={{
                    color: TOKENS.ink,
                    fontSize: TYPE.ui,
                    ...TYPE_STYLE.ui,
                  }}
                >
                  {active.surfaceTitle}
                </span>
                <span
                  className="shrink-0 uppercase tracking-[0.16em]"
                  style={{
                    color: TOKENS.muted,
                    fontSize: TYPE.micro,
                    ...TYPE_STYLE.micro,
                  }}
                >
                  {active.switchLabel}
                </span>
              </div>

              <div className="px-4 py-5 sm:px-5">
                {active.kind === "voice" && (
                  <div>
                    <p
                      className="mb-4 max-w-[52ch]"
                      style={{
                        color: TOKENS.muted,
                        fontSize: TYPE.small,
                        ...TYPE_STYLE.small,
                      }}
                    >
                      {active.callContext}
                    </p>
                    <CallTransport
                      src={active.audioSrc}
                      durationSec={active.durationSec}
                      lines={active.lines}
                      onCursor={handleCursor}
                      reduced={reduced}
                    />
                  </div>
                )}

                {/* Fixed-height pane: a long call scrolls IN HERE and the
                    section keeps its height. During playback the pane follows
                    the current line (effect above); at rest the whole
                    transcript is still reachable by the reader's own scroll. */}
                <div
                  ref={paneRef}
                  className="max-h-[300px] overflow-y-auto overscroll-contain"
                >
                  <TranscriptRail
                    lines={active.lines}
                    cursor={cursor}
                    showTimestamps={active.kind === "voice"}
                    speakerLabels={active.speakerLabels}
                    reduced={reduced}
                    railLabel={active.railLabel}
                  />
                </div>
              </div>
            </div>

            {/* The call's journey: the same living track Selected Work uses
                for lead journeys, on the light surface. Five labels and one
                travelling dot replace what used to be five rows of prose. */}
            <div ref={pipelineRef} className="mt-8">
              <LivingPipeline
                stages={CALL_STAGES}
                runKey={active.key}
                surface="light"
                title="What happens during a call"
                armed={pipelineArmed}
              />
            </div>

            {/* Proof wall, in Selected Work's grammar and position: under the
                pipeline in the demo column — one sentence, four small
                canvases, one ruled "see all" control. The captions the page
                used to carry live in the lightbox now. */}
            {hasEvidence && (
              <div className="mt-8 border-t pt-5" style={{ borderColor: TOKENS.hair }}>
                <p
                  style={{
                    color: TOKENS.body,
                    fontSize: TYPE.ui,
                    ...TYPE_STYLE.ui,
                  }}
                >
                  {SECTION.proofSentence}
                </p>

                <div className="mt-3.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {previews.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => openGallery(s.label)}
                      aria-label={`Open ${s.label} in the gallery`}
                      className="group/thumb text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      <span
                        className="block aspect-[16/10] overflow-hidden border"
                        style={{
                          borderColor: TOKENS.line,
                          background: TOKENS.white,
                        }}
                      >
                        <img
                          src={s.src}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover object-left opacity-80 transition-opacity duration-200 group-hover/thumb:opacity-100"
                        />
                      </span>
                      <span
                        className="mt-1.5 block truncate text-[11px] transition-colors duration-200 group-hover/thumb:text-[#111111]"
                        style={{ color: TOKENS.muted }}
                      >
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => openGallery()}
                  className="group/all mt-4 inline-flex items-center gap-3 border-b pb-1.5 text-[13px] transition-colors duration-300 hover:border-[#C0392B] hover:text-[#C0392B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{ borderColor: TOKENS.ink, color: TOKENS.ink }}
                >
                  See all {shots.length} screenshots
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover/all:translate-x-1"
                  >
                    →
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* ── Proof: receipts, evidence, honesty, close ── */}
          <div className="mt-8 min-w-0 xl:col-start-2 xl:row-start-2 xl:mt-7">
            {/* Capabilities open the gallery at the canvas that implements
                them: the row is the claim, the click is the receipt. ONE
                explainer line carries the affordance for the whole group. */}
            <div className="border-t pt-5" style={{ borderColor: TOKENS.line }}>
              {hasEvidence && (
                <p
                  className="uppercase tracking-[0.16em]"
                  style={{
                    color: TOKENS.muted,
                    fontSize: TYPE.micro,
                    ...TYPE_STYLE.micro,
                  }}
                >
                  Each row opens the workflow that runs it
                </p>
              )}
              {/* Two columns at every width with room for them: five rows in
                  one column was a third of the section's height. */}
              <div className="mt-4 grid gap-y-3.5 sm:grid-cols-2 sm:gap-x-6">
                {CAPABILITIES.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => openGallery(c.galleryTarget)}
                    disabled={!hasEvidence}
                    aria-label={`Open the ${c.galleryTarget} workflow in the gallery`}
                    className="group/cap block text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default"
                  >
                    <span
                      className="flex items-baseline gap-2"
                      style={{
                        color: TOKENS.ink,
                        fontSize: TYPE.small,
                        fontWeight: 500,
                        lineHeight: TYPE_STYLE.small.lineHeight,
                      }}
                    >
                      <span className="transition-colors duration-200 group-hover/cap:text-[#C0392B]">
                        {c.label}
                      </span>
                      {hasEvidence && (
                        <span
                          aria-hidden="true"
                          className="opacity-0 transition-[opacity,transform] duration-200 group-hover/cap:translate-x-1 group-hover/cap:opacity-100 group-focus-visible/cap:opacity-100"
                          style={{ color: TOKENS.accent, fontSize: TYPE.micro }}
                        >
                          →
                        </span>
                      )}
                    </span>
                    <span
                      className="mt-0.5 block break-words"
                      style={{
                        color: TOKENS.muted,
                        fontSize: TYPE.micro,
                        ...TYPE_STYLE.micro,
                      }}
                    >
                      {c.detail}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {SECTION.limitation && (
              <p
                className="mt-6 max-w-[58ch] border-t pt-5"
                style={{
                  borderColor: TOKENS.hair,
                  color: TOKENS.muted,
                  fontSize: TYPE.micro,
                  ...TYPE_STYLE.micro,
                }}
              >
                {SECTION.limitation}
              </p>
            )}

            <p
              className="mt-5"
              style={{
                color: TOKENS.muted,
                fontSize: TYPE.small,
                ...TYPE_STYLE.small,
              }}
            >
              {SECTION.bridgeText}{" "}
              <a
                href="#contact"
                className="border-b pb-px transition-colors duration-200 hover:border-[#C0392B] hover:text-[#C0392B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{ color: TOKENS.ink, borderColor: TOKENS.ink }}
              >
                {SECTION.bridgeLinkLabel}
              </a>{" "}
              <span aria-hidden="true">→</span>
            </p>
          </div>
        </div>
      </div>

      {hasEvidence && lightboxOpen && (
        <GalleryLightbox
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          shots={shots.map((e) => ({
            src: e.src,
            label: e.label,
            caption: e.caption,
          }))}
          title={active.railLabel}
          startIndex={galleryStart}
        />
      )}
    </section>
  );
}
