"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CallTransport from "@/components/call-transport";
import GalleryLightbox from "@/components/gallery-lightbox";
import TranscriptRail from "@/components/transcript-rail";
import { CAPABILITIES, CHANNELS, SECTION, SYSTEM_MAP } from "@/lib/conversation";
import { EASE, TOKENS, TYPE, TYPE_STYLE } from "@/lib/tokens";

/* ────────────────────────────────────────────────────────────────────────────
   Conversation AI — reconstructed around progressive disclosure.

   THREE BLOCKS, ONE GRID. The DOM order is the mobile and screen-reader
   order: intro (what is this) → demo (experience it) → proof (capabilities,
   evidence, close). At xl the demo takes the left track spanning both rows
   and the intro/proof stack on the right, which keeps this section's
   artifact-LEFT/text-RIGHT mirror of white-label intact.

   THE CALL SURFACE is a framed product panel, the same device as the
   white-label browser frame: a hairline frame that depicts a product, not a
   decorative card. Header names the practice like a caller ID; the transport
   and transcript live inside. While the recording is pending the frame still
   reads as a designed state, not a broken one.

   THE SYSTEM MAP is the "behind the scenes" layer: five numbered steps in
   the transcript rail's own row grammar (hairline rows, gutter, content).
   Step 03 links straight into the gallery at the named workflow canvases —
   wayfinding for the agency reader without a single icon.

   CAPABILITIES ARE BUTTONS. Clicking one opens the gallery at the canvas
   that implements it. The interaction teaches: claims become receipts.

   Still no waveform, still white, still one bold element (the transcript
   inking in sync with a real voice once the recording lands). See the
   design-law notes in lib/tokens.ts.
──────────────────────────────────────────────────────────────────────────── */

export default function ConversationAi() {
  const [activeKey, setActiveKey] = useState(CHANNELS[0].key);
  const [cursor, setCursor] = useState(-1);
  const [reduced, setReduced] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [galleryStart, setGalleryStart] = useState(0);
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

  /* Stable identity so the transport's rAF effect does not tear down and
     restart on every parent render. */
  const handleCursor = useCallback((i: number) => setCursor(i), []);

  /* The citation shows the first captured shot; the lightbox carries every
     captured shot. While nothing is captured, the whole block unmounts. */
  const shots = active.evidence.filter((e) => e.src);
  const primary = shots[0];
  const hasEvidence = shots.length > 0;

  /* Open the gallery at a named workflow's canvas (or at the start). The
     capabilities rows and the system map both route through this. */
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

        {/* DOM: intro → demo → proof (the mobile priority order).
            xl: demo owns the left track across both rows; intro and proof
            stack on the right. */}
        <div className="mt-10 xl:grid xl:grid-cols-[52fr_48fr] xl:gap-x-12 2xl:grid-cols-[56fr_44fr] 2xl:gap-x-14">
          {/* ── LEVEL 1: what this is ── */}
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
              className="mt-5 max-w-[46ch]"
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
              className="mt-4 max-w-[46ch]"
              style={{
                color: TOKENS.body,
                fontSize: TYPE.small,
                ...TYPE_STYLE.small,
              }}
            >
              {SECTION.factLine}
            </p>

            <div className="mt-7 flex items-center gap-3">
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

          {/* ── LEVEL 2: the demonstration ── */}
          <div className="mt-10 min-w-0 xl:col-start-1 xl:row-span-2 xl:row-start-1 xl:mt-0">
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

            {/* ── LEVEL 3: the system, in call order ──
                The transcript rail's row grammar reused: hairline rows, a
                gutter, content. The map reads as a transcript of the system
                itself. */}
            <div className="mt-9">
              <p
                className="uppercase tracking-[0.16em]"
                style={{
                  color: TOKENS.muted,
                  fontSize: TYPE.micro,
                  ...TYPE_STYLE.micro,
                }}
              >
                What happens during a call
              </p>
              <ol className="mt-2">
                {SYSTEM_MAP.map((s) => (
                  <li
                    key={s.step}
                    className="flex gap-4 border-t py-3.5 first:border-t-0 sm:gap-6"
                    style={{ borderColor: TOKENS.hair }}
                  >
                    <span
                      className="w-[3.25rem] shrink-0 tabular-nums"
                      style={{
                        color: TOKENS.muted,
                        fontSize: TYPE.micro,
                        ...TYPE_STYLE.micro,
                      }}
                    >
                      {s.step}
                    </span>
                    <div className="min-w-0">
                      <p
                        style={{
                          color: TOKENS.ink,
                          fontSize: TYPE.small,
                          fontWeight: 500,
                          lineHeight: TYPE_STYLE.small.lineHeight,
                        }}
                      >
                        {s.label}
                      </p>
                      <p
                        className="mt-0.5 max-w-[52ch]"
                        style={{
                          color: TOKENS.muted,
                          fontSize: TYPE.small,
                          ...TYPE_STYLE.small,
                        }}
                      >
                        {s.detail}
                      </p>
                      {s.links && hasEvidence && (
                        <p
                          className="mt-1.5"
                          style={{
                            fontSize: TYPE.micro,
                            ...TYPE_STYLE.micro,
                          }}
                        >
                          {s.links.map((name) => (
                            <button
                              key={name}
                              type="button"
                              onClick={() => openGallery(name)}
                              className="mr-3 border-b pb-px transition-colors duration-200 hover:border-[#C0392B] hover:text-[#C0392B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                              style={{
                                color: TOKENS.body,
                                borderColor: TOKENS.line,
                              }}
                            >
                              {name}
                            </button>
                          ))}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Evidence citation rides the demo track: it is an artifact, and
                here it balances the columns instead of stacking a second
                gallery entry point beside the capabilities. */}
            {hasEvidence && primary && (
              <div className="mt-9 border-t pt-6" style={{ borderColor: TOKENS.hair }}>
                <button
                  type="button"
                  onClick={() => openGallery()}
                  aria-label={
                    shots.length > 1
                      ? `Open ${primary.label} and ${shots.length - 1} more screenshots`
                      : `Open ${primary.label} full size`
                  }
                  className="group block w-full max-w-[24rem] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <span
                    className="block overflow-hidden border"
                    style={{
                      borderColor: TOKENS.line,
                      aspectRatio: `${primary.width} / ${primary.height}`,
                    }}
                  >
                    <img
                      src={primary.src}
                      alt=""
                      className="h-full w-full object-cover object-top transition-opacity duration-200 group-hover:opacity-90"
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span
                    className="mt-2 block"
                    style={{
                      color: TOKENS.ink,
                      fontSize: TYPE.small,
                      ...TYPE_STYLE.small,
                    }}
                  >
                    {primary.label}
                    {shots.length > 1 && (
                      <span style={{ color: TOKENS.muted }}>
                        {" "}
                        · {shots.length} screenshots
                      </span>
                    )}
                  </span>
                </button>

                <p
                  className="mt-1 max-w-[42ch]"
                  style={{
                    color: TOKENS.muted,
                    fontSize: TYPE.small,
                    ...TYPE_STYLE.small,
                  }}
                >
                  {primary.caption}
                </p>
                <p
                  className="mt-1 max-w-[42ch]"
                  style={{
                    color: TOKENS.muted,
                    fontSize: TYPE.micro,
                    ...TYPE_STYLE.micro,
                  }}
                >
                  {primary.redactionNote}
                </p>
              </div>
            )}
          </div>

          {/* ── LEVELS 4-5: receipts, honesty, close ── */}
          <div className="mt-10 min-w-0 xl:col-start-2 xl:row-start-2 xl:mt-9">
            {/* Capabilities open the gallery at the canvas that implements
                them: the row is the claim, the click is the receipt. ONE
                explainer line carries the affordance for the whole group —
                five identical arrows at rest were noise, so the arrow now
                appears only on the row under the pointer. */}
            <div className="border-t pt-6" style={{ borderColor: TOKENS.line }}>
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
              <div className="mt-4 grid gap-y-4 sm:grid-cols-2 sm:gap-x-6 xl:grid-cols-1">
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
                className="mt-8 max-w-[58ch] border-t pt-6"
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
              className="mt-6"
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
          title={primary?.label ?? active.railLabel}
          startIndex={galleryStart}
        />
      )}
    </section>
  );
}
