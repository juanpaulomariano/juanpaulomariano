"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { EASE, TOKENS, TYPE, TYPE_STYLE } from "@/lib/tokens";
import {
  CAPABILITIES,
  CAPTIONS,
  CHANGE_LABELS,
  WHITELABEL_EXAMPLES,
} from "@/lib/whitelabel";

/* ────────────────────────────────────────────────────────────────────────────
   White-label — a capability demo, not a client case study. One toggle flips
   between what a client sees and what sits underneath, crossfading two real
   screenshots while the address bar changes with them.

   The flip is this section's one bold moment; the hero's orbit is the page's
   other. Everything else here stays quiet.

   Nav controls are deliberately absent while there is a single example:
   arrows and dots over one item read as filler. The config is an array so a
   second example turns them on without a rewrite.
──────────────────────────────────────────────────────────────────────────── */

const CROSSFADE_MS = 550;
/** How long the "what changed" labels hold before fading out. */
const FLASH_HOLD_MS = 1200;
const FLASH_STAGGER_MS = 80;

/** Where each flash label sits, as % of the frame. All four stay INSIDE the
    frame and clear of the left sidebar, so they annotate the nav rather than
    covering the thing they are pointing at. */
const LABEL_POSITIONS = [
  { top: "1.5%", left: "10%" }, // custom domain — left of the address bar
  { top: "40%", left: "19%" }, // reorganized navigation — right of the menu
  { top: "68%", left: "19%" }, // branded sidebar — right of the menu, lower
  { top: "28%", left: "19%" }, // custom logo — right of the logo mark
];

type View = "client" | "stock";

export default function Whitelabel() {
  const [view, setView] = useState<View>("client");
  const [flashing, setFlashing] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [nudged, setNudged] = useState(false);
  const [nudgeOn, setNudgeOn] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const example = WHITELABEL_EXAMPLES[0];
  const multiple = WHITELABEL_EXAMPLES.length > 1;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* One nudge on scroll-into-view: the knob slides across and back so the
     control reads as interactive. Fires once, never loops. */
  useEffect(() => {
    if (reduced || nudged || !sectionRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNudged(true);
        io.disconnect();
        const a = setTimeout(() => setNudgeOn(true), 550);
        const b = setTimeout(() => setNudgeOn(false), 1050);
        return () => {
          clearTimeout(a);
          clearTimeout(b);
        };
      },
      { threshold: 0.35 },
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, [reduced, nudged]);

  const flip = (next: View) => {
    if (next === view) return;
    setView(next);
    /* Flash the change labels only when moving to the underneath view — that
       is the moment the restructured nav becomes visible by comparison. */
    if (next === "stock") {
      if (flashTimer.current) clearTimeout(flashTimer.current);
      setFlashing(true);
      const total = reduced
        ? FLASH_HOLD_MS
        : FLASH_HOLD_MS + CHANGE_LABELS.length * FLASH_STAGGER_MS + 400;
      flashTimer.current = setTimeout(() => setFlashing(false), total);
    } else {
      if (flashTimer.current) clearTimeout(flashTimer.current);
      setFlashing(false);
    }
  };

  useEffect(
    () => () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    },
    [],
  );

  const isClient = view === "client";
  /* The knob sits right while flipped, and also during the one-time nudge. */
  const knobRight = !isClient || nudgeOn;

  return (
    <section
      ref={sectionRef}
      id="whitelabel"
      className="px-6 py-20 sm:px-10 sm:py-24"
      style={{ background: TOKENS.white }}
    >
      {/* Two columns from xl: the written case on the left, the proof on the
          right. Stacked and centered below that, exactly as before.

          The split is what lets the section fit a laptop viewport. Stacked,
          the browser frame alone is ~709px tall and the section runs to
          1623px; in the 55% track the same frame is ~390px and everything
          fits without shrinking the screenshot to the point where the CRM
          navigation — the actual proof of white-labeling — stops being
          readable. */}
      {/* The text column takes more of the grid at the narrow end of xl and
          gives it back once there is room. "GoHighLevel out of sight." needs
          ~600px at the section-title size; at 1280 a 52fr track is 591px, so
          the line wrapped and orphaned "sight." on a third line. 58fr clears it
          at 1280, and from 2xl the column drops back to 52fr so the browser
          frame gets the width instead. */}
      <div className="mx-auto mb-10 max-w-[1320px]">
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
              04
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] xl:grid xl:grid-cols-[58fr_42fr] xl:items-center xl:gap-12 2xl:grid-cols-[52fr_48fr]">
        <div className="min-w-0">
        {/* Header. Centered while stacked, left-aligned once beside the frame. */}
        <div className="mx-auto max-w-[46rem] text-center xl:mx-0 xl:text-left">
          {/* The "White-label" text eyebrow is gone; the headline directly
              below says it. The page carries numerals only. */}
          {/* Same size as the other two section titles. It was previously
              stepped down at xl to fit the narrower column, which made the page
              read as though this section mattered a third less than the ones
              around it; the column carries the larger type instead. */}
          {/* text-balance on the second line: at the narrow end of xl the
              column is ~591px and "GoHighLevel out of sight." needs ~600px, so
              it wrapped to a third line with "sight." orphaned. Balancing
              splits it evenly instead of leaving one word stranded. */}
          <h2
            className="mx-auto mt-4 xl:mx-0"
            style={{
              fontFamily: "var(--font-grotesk)",
              color: TOKENS.ink,
              fontSize: TYPE.section,
              ...TYPE_STYLE.section,
            }}
          >
            <span className="block" style={{ color: TOKENS.muted }}>
              Your brand on top.
            </span>
            <span className="block text-balance">
              GoHighLevel out of sight.
            </span>
          </h2>
          <p
            className="mx-auto mt-5 max-w-[46ch] xl:mx-0"
            style={{ color: TOKENS.muted, fontSize: TYPE.body, ...TYPE_STYLE.body }}
          >
            Turn GoHighLevel into an environment your clients know as yours.
            Domain, branding, navigation, the whole client-facing layer, without
            pretending the platform underneath isn&apos;t GoHighLevel.
          </p>
        </div>

        {/* Toggle */}
        <div className="mt-8 flex flex-col items-center xl:mt-7 xl:items-start">
          <div
            role="group"
            aria-label="Switch between the client view and the platform underneath"
            className="relative inline-flex border p-1"
            style={{ borderColor: TOKENS.line }}
          >
            {/* Sliding knob. transform only. */}
            <span
              aria-hidden="true"
              className="absolute bottom-1 top-1 w-[calc(50%-0.25rem)]"
              style={{
                left: "0.25rem",
                background: TOKENS.accent,
                transform: knobRight ? "translateX(100%)" : "translateX(0)",
                transition: reduced
                  ? "none"
                  : `transform 420ms ${EASE.enter}`,
              }}
            />
            {(
              [
                ["client", "Your brand"],
                ["stock", "Under the hood"],
              ] as const
            ).map(([key, label]) => {
              const active = view === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => flip(key)}
                  aria-pressed={active}
                  className="relative z-10 px-4 py-2.5 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-6"
                  style={{
                    color: active ? "#FFFFFF" : TOKENS.muted,
                    fontSize: TYPE.ui,
                    ...TYPE_STYLE.ui,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <p className="mt-3" style={{ color: TOKENS.muted, fontSize: TYPE.small, ...TYPE_STYLE.small }}>
            Flip it. Same platform, different business.
          </p>
        </div>

        {/* Capabilities and the limitation note ride with the written column
            from xl, so the proof column carries only the frame and its
            caption. Below xl they fall back under everything, in order. */}
        <div className="hidden xl:block">
          <WhitelabelDetails />
        </div>
        </div>

        {/* Browser frame — the proof column. No max-width at xl: the grid track
            is the constraint there, and an inherited cap would shrink the
            screenshot below the size where the CRM navigation stays readable. */}
        <div className="relative mx-auto mt-8 w-full min-w-0 max-w-[1320px] xl:mt-0 xl:max-w-none">
          <div className="border" style={{ borderColor: TOKENS.line }}>
            {/* Slim chrome: dots + the live address bar */}
            <div
              className="flex items-center gap-3 border-b px-3 py-2.5 sm:px-4"
              style={{ borderColor: TOKENS.line, background: "#FCFCFC" }}
            >
              <span className="flex shrink-0 gap-1.5" aria-hidden="true">
                {[0, 1, 2].map((n) => (
                  <span
                    key={n}
                    className="block h-[9px] w-[9px] rounded-full"
                    style={{ background: "#DFDFDF" }}
                  />
                ))}
              </span>
              {/* The domain change is the strongest single piece of proof in
                  this section, so the bar carries a little more weight than
                  real browser chrome would: a hairline border and near-black
                  text rather than a flat grey strip. */}
              <span
                className="min-w-0 flex-1 truncate border px-3 py-1.5 text-center text-[12px] sm:text-[13px]"
                style={{
                  background: "#FFFFFF",
                  borderColor: TOKENS.line,
                  color: TOKENS.ink,
                }}
              >
                {/* Live, not baked into the screenshot. */}
                {isClient ? example.clientDomain : example.stockDomain}
              </span>
              <span className="w-[42px] shrink-0" aria-hidden="true" />
            </div>

            {/* Viewport. Both images stacked; opacity crossfades between them,
                so the frame never resizes and nothing shifts. */}
            <div className="relative aspect-[2560/1378] w-full overflow-hidden">
              <img
                src={example.clientSrc}
                alt={`${example.brandName} CRM, white-labeled`}
                className="absolute inset-0 h-full w-full object-cover object-top"
                loading="lazy"
                decoding="async"
                style={{
                  opacity: isClient ? 1 : 0,
                  transition: reduced
                    ? "none"
                    : `opacity ${CROSSFADE_MS}ms ${EASE.enter}`,
                }}
              />
              <img
                src={example.stockSrc}
                alt="The same CRM without the white-label layer"
                className="absolute inset-0 h-full w-full object-cover object-top"
                loading="lazy"
                decoding="async"
                style={{
                  opacity: isClient ? 0 : 1,
                  transition: reduced
                    ? "none"
                    : `opacity ${CROSSFADE_MS}ms ${EASE.enter}`,
                }}
              />
            </div>
          </div>

          {/* "What changed" flash labels — brief, then gone. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden sm:block"
          >
            {CHANGE_LABELS.map((label, i) => (
              <span
                key={label}
                className="absolute whitespace-nowrap border px-2.5 py-1 text-[11px]"
                style={
                  {
                    ...LABEL_POSITIONS[i],
                    borderColor: TOKENS.line,
                    background: "rgba(255,255,255,0.96)",
                    color: TOKENS.ink,
                    opacity: flashing ? 1 : 0,
                    transform: flashing ? "translateY(0)" : "translateY(4px)",
                    transition: reduced
                      ? "none"
                      : `opacity 260ms ${EASE.enter} ${flashing ? i * FLASH_STAGGER_MS : 0}ms, transform 260ms ${EASE.enter} ${flashing ? i * FLASH_STAGGER_MS : 0}ms`,
                  } as CSSProperties
                }
              >
                {label}
              </span>
            ))}
          </div>

        {/* Caption. Height reserved for two lines so flipping never shifts. */}
        <p
          className="mx-auto mt-5 flex min-h-[3rem] max-w-[42ch] items-start justify-center text-center text-[13.5px] leading-[1.6]"
          style={{ color: TOKENS.muted }}
          aria-live="polite"
        >
          {isClient ? CAPTIONS.client : CAPTIONS.stock}
        </p>

          {/* Stacked fallback for the same details below xl, where they cannot
              ride the written column. */}
          <div className="xl:hidden">
            <WhitelabelDetails />
          </div>

          {/* Nav controls appear only once there is more than one example. */}
          {multiple && (
            <div className="mt-8 flex justify-center gap-2">
              {WHITELABEL_EXAMPLES.map((ex) => (
                <span
                  key={ex.brandName}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: TOKENS.line }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* Capabilities row plus the limitation note. One component so the two-column
   and stacked layouts can never drift apart. Centered while stacked,
   left-aligned and single-column when it rides the written column at xl. */
function WhitelabelDetails() {
  return (
    <>
      {/* One quiet row, hairline-separated. No cards, no icons. */}
      <div
        className="mt-12 grid gap-y-8 border-t pt-8 sm:grid-cols-2 lg:grid-cols-4 xl:mt-8 xl:grid-cols-2 xl:gap-y-5 xl:pt-6"
        style={{ borderColor: TOKENS.line }}
      >
        {CAPABILITIES.map((c, i) => (
          <div
            key={c.label}
            className={i > 0 ? "lg:border-l lg:pl-6 xl:border-l-0 xl:pl-0" : ""}
            style={{ borderColor: TOKENS.hair }}
          >
            <p style={{ color: TOKENS.ink, fontSize: TYPE.small, ...TYPE_STYLE.small }}>
              {c.label}
            </p>
            <p className="mt-1.5" style={{ color: TOKENS.muted, fontSize: TYPE.micro, ...TYPE_STYLE.micro }}>
              {c.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Honest limitation. Stated once, without hedging around it. */}
      <p
        className="mx-auto mt-7 max-w-[62ch] text-center text-[11px] leading-[1.7] xl:mx-0 xl:mt-6 xl:text-left"
        style={{ color: TOKENS.muted }}
      >
        White-labeling covers the client-facing brand layer. Some native
        HighLevel settings and system-level pages stay platform-specific.
      </p>
    </>
  );
}
