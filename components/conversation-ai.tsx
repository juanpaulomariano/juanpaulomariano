"use client";

import { useCallback, useEffect, useState } from "react";
import CallStage, { type StagePhase } from "@/components/call-stage";
import GalleryLightbox from "@/components/gallery-lightbox";
import { CAPABILITIES, CHANNELS, SECTION, STAGE } from "@/lib/conversation";
import { EASE, TOKENS, TYPE, TYPE_STYLE } from "@/lib/tokens";
import type { VoiceChannel } from "@/lib/conversation";

/* ────────────────────────────────────────────────────────────────────────────
   DIRECTION CONTRACT — The Incoming Call (seed d9fab242, re-roll 1, card 4/7)

   THESIS: The section receives a dental call instead of describing one; the
   category default (feature grid beside a player widget) is refused.

   OWN-WORLD: A blue-black night panel (#0D1117) inside the white section;
   paper-white text, square hairline controls, ring pulses as scaled squares;
   red means exactly one thing: the call is live. Space Grotesk / Manrope.

   STORY: A practice owner watches a new-patient call get answered, inked
   into a transcript, and written into GoHighLevel; they open the receipts,
   read the demo-practice disclosure, and leave for the contact form
   believing the agent answers when nobody else can.

   FIRST VIEWPORT: Text column left (claim, one fact, five capability
   receipts, bridge). Right, the stage: "Incoming call · New patient", a
   ringing answer square. One press collapses the overlay into the live
   call — ticking clock, synced transcript, CRM ticker — while the rest of
   the section pulls back. The receipts strip sits under the stage.

   FORM: The Incoming Call; candidate 4 of 7, round 2 of the surface roll.

   FINISH: unreviewed and undocumented is unfinished; this build ends with
   the finish review, the verdict, DESIGN.md, and every shipping raster
   carrying its provenance.
──────────────────────────────────────────────────────────────────────────── */

export default function ConversationAi() {
  const [phase, setPhase] = useState<StagePhase>("rest");
  const [reduced, setReduced] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [galleryStart, setGalleryStart] = useState(0);

  /* This section stages the voice channel. A text surface is section 04's
     live GHL widget, which gets its own treatment rather than a switch
     bolted onto a phone. */
  const voice: VoiceChannel | undefined = CHANNELS[0];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handlePhase = useCallback((p: StagePhase) => setPhase(p), []);

  if (!voice) return null;

  const shots = voice.evidence.filter((e) => e.src);
  const hasEvidence = shots.length > 0;

  const openGallery = (target?: string) => {
    let index = 0;
    if (target) {
      const i = shots.findIndex((s) => s.label.includes(target));
      if (i >= 0) index = i;
    }
    setGalleryStart(index);
    setLightboxOpen(true);
  };

  /* Rack focus: while the call is live, everything that is not the stage
     recedes. Opacity only — nothing moves — and reduced motion opts out. */
  const recede = {
    opacity: phase === "live" && !reduced ? 0.4 : 1,
    transition: reduced ? "none" : `opacity 480ms ${EASE.enter}`,
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

        <div className="mt-8 xl:grid xl:grid-cols-[42fr_58fr] xl:gap-x-14 2xl:gap-x-16">
          {/* ── The claim, the receipts, the close ── */}
          <div className="min-w-0" style={recede}>
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

            {/* Capabilities as quiet receipts: plain-language claim over the
                real workflow names, each row opening the canvas that runs
                it. One column — the stage carries the section's weight now,
                and these read as a ledger, not a feature grid. */}
            <div
              className="mt-6 border-t pt-4"
              style={{ borderColor: TOKENS.line }}
            >
              {CAPABILITIES.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => openGallery(c.galleryTarget)}
                  disabled={!hasEvidence}
                  aria-label={`${c.label}. Opens the ${c.galleryTarget} workflow in the gallery.`}
                  className="group/cap block w-full border-t py-2 text-left first:border-t-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default"
                  style={{ borderColor: TOKENS.hair }}
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
                  {/* The snake_case names are the receipts; a cut-off name is
                      texture, so they wrap rather than truncate. */}
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

          {/* ── The stage, then the close ──
              Reading order after the demo IS the conversion order: the
              receipts, the honesty line, the bridge. */}
          <div className="mt-9 min-w-0 xl:mt-0">
            <CallStage channel={voice} reduced={reduced} onPhase={handlePhase} />

            <div style={recede}>
              {/* The receipts strip: one line and one control, no thumbnail
                  wall — the capabilities column already opens specific
                  canvases, and this section refuses borrowed grammar. */}
              {hasEvidence && (
                <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <p
                    className="min-w-0"
                    style={{
                      color: TOKENS.muted,
                      fontSize: TYPE.small,
                      ...TYPE_STYLE.small,
                    }}
                  >
                    {STAGE.receiptsLine}
                  </p>
                  <button
                    type="button"
                    onClick={() => openGallery()}
                    className="group/all inline-flex shrink-0 items-center gap-2 border-b pb-0.5 transition-colors duration-300 hover:border-[#C0392B] hover:text-[#C0392B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                    style={{
                      borderColor: TOKENS.ink,
                      color: TOKENS.ink,
                      fontSize: TYPE.ui,
                      ...TYPE_STYLE.ui,
                    }}
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

              {SECTION.limitation && (
                <p
                  className="mt-4 max-w-[64ch]"
                  style={{
                    color: TOKENS.muted,
                    fontSize: TYPE.micro,
                    ...TYPE_STYLE.micro,
                  }}
                >
                  {SECTION.limitation}
                </p>
              )}

              <p
                className="mt-4"
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
          title={voice.railLabel}
          startIndex={galleryStart}
        />
      )}
    </section>
  );
}
