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

        {/* MIRRORED: the stage takes the left track and the text the right,
            so the page's composition travels middle → left → right → middle
            instead of anchoring four consecutive sections to the same edge.
            The columns swap by grid order, not by DOM order: the claim still
            comes first in the markup and for a screen reader, because the
            argument reads before the demonstration regardless of which side
            the eye finds it on. Stacked below xl, where order is reading
            order and the text must lead. */}
        <div className="mt-8 xl:grid xl:grid-cols-[58fr_42fr] xl:gap-x-14 2xl:gap-x-16">
          {/* ── The claim, the receipts, the close ── */}
          <div className="min-w-0 xl:order-2" style={recede}>
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
              className="mt-3 max-w-[46ch] xl:mt-2"
              style={{
                color: TOKENS.body,
                fontSize: TYPE.small,
                ...TYPE_STYLE.small,
              }}
            >
              {SECTION.factLine}
            </p>

            <div className="mt-5 flex items-center gap-3 xl:mt-4">
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
            {/* The ledger's top gap is where this column's length is tuned.
                The gallery opposite ends 51px above the last ledger row at
                its natural spacing, and the fix belongs here rather than on
                the gallery: pushing the thumbnails DOWN to meet the ledger
                opened a dead gap under the receipts line, which reads worse
                than a small difference in column length ever did. */}
            <div
              className="mt-6 border-t pt-4 xl:mt-2 xl:pt-2"
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
          <div className="mt-9 min-w-0 xl:order-1 xl:mt-0">
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
                  {/* The before: pseudo expands the tap area to ~44px without
                      touching the ruled-text visual; measured 21.9px tall
                      before, which is half the touch floor. */}
                  <button
                    type="button"
                    onClick={() => openGallery()}
                    className="group/all relative inline-flex shrink-0 items-center gap-2 border-b pb-0.5 transition-colors duration-300 before:absolute before:-inset-x-1 before:-inset-y-3 before:content-[''] hover:border-[#C0392B] hover:text-[#C0392B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
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

              {/* ── The workflow gallery ──
                  Under the stage, replacing a limitation paragraph and a
                  bridge line. Eleven canvases a visitor can open are a
                  better argument than a sentence claiming the agent is
                  fast, and the section already had the screenshots — they
                  were reachable only through a text control most visitors
                  never pressed.

                  Deliberately not a card grid: no borders, no shadows, no
                  rounded corners. Each thumbnail is the raster itself on
                  the section's white. The canvases are dark, so they read
                  as a row of windows rather than a component.

                  The row is the last thing in this column, and its bottom
                  is what aligns with the capability ledger opposite. */}
              {hasEvidence && (
                <div className="mt-5 xl:mt-2">
                  {/* One row of four. Two rows of four ran this column ~64px
                      past the ledger opposite; six across aligned but shrank
                      each canvas to ~112px, where an n8n graph is a dark
                      smudge rather than evidence. Four lands ~174px, the
                      smallest a canvas can be and still read as a workflow.
                      The rest stay one press away in the lightbox.

                      Two across on phones: four at 375px puts each canvas at
                      76px, a texture swatch rather than a screenshot, and a
                      stacked column has no ledger to align to anyway. */}
                  <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-x-3">
                    {shots.slice(0, 4).map((s, i) => (
                      <li key={s.label} className="min-w-0">
                        <button
                          type="button"
                          onClick={() => {
                            setGalleryStart(i);
                            setLightboxOpen(true);
                          }}
                          aria-label={`Open ${s.label} in the gallery`}
                          className="group/shot block w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                          {/* Fixed aspect so one tall canvas cannot set the
                              height of the whole row. */}
                          <span
                            className="block w-full overflow-hidden"
                            style={{
                              aspectRatio: "4 / 3",
                              background: TOKENS.stageBg,
                            }}
                          >
                            <img
                              src={s.src}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover object-left-top opacity-80 transition-opacity duration-300 group-hover/shot:opacity-100 group-focus-visible/shot:opacity-100"
                            />
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
