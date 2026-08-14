"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CallTransport from "@/components/call-transport";
import GalleryLightbox from "@/components/gallery-lightbox";
import TranscriptRail from "@/components/transcript-rail";
import { CHANNELS, SECTION } from "@/lib/conversation";
import { EASE, TOKENS, TYPE, TYPE_STYLE } from "@/lib/tokens";

/* ────────────────────────────────────────────────────────────────────────────
   Conversation AI.

   Voice and text are not two features. They are one machine with the channel
   as a variable: a lead who DMs and a lead who calls both get a real
   conversation that collects a phone number and an email, then hands a
   qualified contact to the workflows. So this is ONE channel switch over ONE
   transcript rail, structurally the twin of the white-label toggle — that one
   crossfades two screenshots, this one crossfades two transcripts.

   Building it as two side-by-side demos was the obvious alternative and the
   wrong one: it doubles the height, forces two things playing at once, and
   makes the section read as two half-sections stapled together.

   WHITE, not dark. A voice demo instinctively wants a dark surface and it
   cannot have one: Selected Work is the page's single dark reset, and a second
   dark section turns the page into stripes. See lib/tokens.ts.

   NO WAVEFORM. It would be decorative SVG on a page with no icons, it is hard
   to draw without looping, and it depicts "audio" rather than proving
   anything. The transcript is the waveform — it shows what the bot actually
   said, which is the claim.

   The one bold element is the transcript revealing itself in time with a real
   voice. Everything else stays quiet.
──────────────────────────────────────────────────────────────────────────── */

export default function ConversationAi() {
  const [activeKey, setActiveKey] = useState(CHANNELS[0].key);
  const [cursor, setCursor] = useState(-1);
  const [reduced, setReduced] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
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
     from the previous channel can never fire into the new one.

     Reduced motion jumps straight to the end state — every line revealed —
     which is exactly where the run finishes anyway. */
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

  const evidence = active.evidence;
  const hasEvidence = Boolean(evidence.src);

  return (
    <section
      id="ai"
      className="px-6 py-20 sm:px-10 sm:py-24"
      style={{ background: TOKENS.white }}
    >
      <div className="mx-auto max-w-[1320px]">
        {/* Numeral only. The page numbers its sections 01-05; it does not
            label them, because a text eyebrow beside every headline is what
            made everything whisper at the same pitch. */}
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

        {/* Right-heavy 38/62, the mirror of white-label's left-heavy split, so
            two adjacent white sections have opposite centres of gravity rather
            than rhyming into one long stripe. */}
        {/* 44/56 rather than the 38/62 first drafted: at the section title size
            "You get a booked call." wrapped to three lines in a 38fr track and
            orphaned the last word. Still right-heavy, so it remains the mirror
            of white-label's left-heavy split and the two white sections keep
            opposite centres of gravity. */}
        <div className="mt-10 xl:grid xl:grid-cols-[48fr_52fr] xl:gap-12 2xl:grid-cols-[44fr_56fr] 2xl:gap-14">
          {/* ── The written case ── */}
          <div className="min-w-0">
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

            {/* The stack, named. The Vapi mark is already on the page in the
                hero orbit, so it is not a new icon — and naming the stack is
                what this audience actually wants to know. */}
            <div className="mt-8 flex items-center gap-3">
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

            {/* ── Evidence: a citation, not a hero image ──
                Plain hairline border, no browser chrome (that device belongs
                to white-label), caption required. */}
            {hasEvidence && (
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  aria-label={`Open ${evidence.label} full size`}
                  className="group block w-full max-w-[22rem] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <span
                    className="block overflow-hidden border"
                    style={{
                      borderColor: TOKENS.line,
                      aspectRatio: `${evidence.width} / ${evidence.height}`,
                    }}
                  >
                    <img
                      src={evidence.src}
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
                    {evidence.label}
                  </span>
                </button>

                {/* Height reserved for two lines so switching channels never
                    shifts the column. */}
                <p
                  className="mt-1 min-h-[3rem] max-w-[38ch]"
                  style={{
                    color: TOKENS.muted,
                    fontSize: TYPE.small,
                    ...TYPE_STYLE.small,
                  }}
                >
                  {evidence.caption}
                </p>
                <p
                  className="mt-1 max-w-[38ch]"
                  style={{
                    color: TOKENS.muted,
                    fontSize: TYPE.micro,
                    ...TYPE_STYLE.micro,
                  }}
                >
                  {evidence.redactionNote}
                </p>
              </div>
            )}
          </div>

          {/* ── The demo ── */}
          <div className="mt-10 min-w-0 xl:mt-0">
            {/* Channel switch. Hidden entirely while there is one channel:
                a toggle over a single option is filler. */}
            {multiple && (
              <div
                role="group"
                aria-label="Switch between the voice call and the message thread"
                className="relative inline-flex border p-1"
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

            {/* Voice gets a transport; text runs on its own timer and needs
                none. Both drive the same cursor. */}
            {active.kind === "voice" && (
              <div className="mt-6">
                <p
                  className="mb-4"
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

            <div className="mt-7 border-t pt-2" style={{ borderColor: TOKENS.line }}>
              <TranscriptRail
                lines={active.lines}
                cursor={cursor}
                showTimestamps={active.kind === "voice"}
                reduced={reduced}
                railLabel={active.railLabel}
              />
            </div>

            {SECTION.limitation && (
              <p
                className="mt-7 max-w-[62ch]"
                style={{
                  color: TOKENS.muted,
                  fontSize: TYPE.micro,
                  ...TYPE_STYLE.micro,
                }}
              >
                {SECTION.limitation}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Reuses the gallery lightbox: a one-item array works unchanged and
          brings zoom-to-100% with it, which matters because DM text is small. */}
      {hasEvidence && lightboxOpen && (
        <GalleryLightbox
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          shots={[
            {
              src: evidence.src,
              label: evidence.label,
              caption: evidence.caption,
            },
          ]}
          title={evidence.label}
          startIndex={0}
        />
      )}
    </section>
  );
}
