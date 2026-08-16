"use client";

import { useEffect, useRef, useState } from "react";
import { EASE, TOKENS } from "@/lib/tokens";

/* ────────────────────────────────────────────────────────────────────────────
   Living pipeline: one lead travels the track once, lighting each stage, then
   RESTS at the end. Not a loop — an infinite loop would compete with the
   hero's orbit and pull the eye forever.

   Implementation is CSS transitions on transform/opacity driven by a single
   `step` state, deliberately not keyframes: switching projects retargets the
   dot from wherever it is instead of restarting from zero, and there is no
   animation to cancel. Duration is ~1s per segment (illustrative motion, so
   above the routine-UI ceiling is correct here).

   Reduced motion: no travel at all — the track renders fully lit with the dot
   resting at the final stage, which is the same end state the animation
   reaches.
──────────────────────────────────────────────────────────────────────────── */

const SEGMENT_MS = 1000;
const START_DELAY_MS = 260;

/* The track renders on two grounds: the dark Selected Work panel (its home)
   and the white Conversation AI section. Same geometry, same run, different
   token set — a third colour scheme would be a redesign, so the map stays a
   strict light/dark swap of the existing tokens. */
const SURFACES = {
  dark: {
    line: TOKENS.darkLine,
    ink: TOKENS.darkInk,
    muted: TOKENS.darkMuted,
    bg: TOKENS.darkBg,
  },
  light: {
    line: TOKENS.line,
    ink: TOKENS.ink,
    muted: TOKENS.muted,
    bg: TOKENS.white,
  },
} as const;

type Props = {
  stages: string[];
  /** Changing this key restarts the run (used when the project switches). */
  runKey: string;
  /** Which ground the track sits on. Defaults preserve Selected Work. */
  surface?: keyof typeof SURFACES;
  /** The small label above the track. */
  title?: string;
  /** While false the run holds at the first stage — used to wait for the
      track to scroll into view so the one-shot travel is not spent
      off-screen. Flipping to true starts the run. Reduced motion ignores
      this and renders settled, as always. */
  armed?: boolean;
};

export default function LivingPipeline({
  stages,
  runKey,
  surface = "dark",
  title = "Lead journey",
  armed = true,
}: Props) {
  const T = SURFACES[surface];
  const last = stages.length - 1;
  const [step, setStep] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [runId, setRunId] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* One run: advance a step at a time, then rest. Re-runs whenever the
     selected project changes or the user hits replay. */
  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    if (reduced) {
      setStep(last); // fully lit, dot at the end
      return;
    }

    setStep(0);
    if (!armed) return; // hold at the start until the caller arms the run

    for (let s = 1; s <= last; s++) {
      timers.current.push(
        setTimeout(() => setStep(s), START_DELAY_MS + s * SEGMENT_MS),
      );
    }
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [runKey, runId, reduced, last, armed]);

  const done = step >= last;
  /* Track spans between the first and last node centers, so the fill starts
     and ends exactly under a node rather than at the container edge. */
  const pct = last > 0 ? (step / last) * 100 : 100;

  return (
    <div>
      <div
        className="flex items-baseline justify-between border-t pt-4"
        style={{ borderColor: T.line }}
      >
        {/* Sentence case, not a tracked uppercase eyebrow: this section had
            five small caps labels competing at the same pitch, and this one
            names a diagram rather than titling a section. */}
        <p className="text-[13px]" style={{ color: T.muted }}>
          {title}
        </p>
        {!reduced && (
          <button
            type="button"
            onClick={() => setRunId((v) => v + 1)}
            disabled={!done}
            className="text-[12.5px] transition-opacity duration-200 disabled:opacity-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{ color: T.muted }}
          >
            Replay
          </button>
        )}
      </div>

      {/* Desktop / tablet: horizontal track ─────────────────────────────────
          Technical diagram treatment: a hairline rail, small precise nodes
          (hollow until traversed), and the travelling lead as the one
          emphatic red mark. Motion mechanics are unchanged. */}
      <div className="relative mt-7 hidden sm:block">
        {/* Rail + fill live in the node-center band (half a node inset). */}
        <div
          className="absolute top-[5px] h-px"
          style={{
            left: `${50 / stages.length}%`,
            right: `${50 / stages.length}%`,
            background: T.line,
          }}
        >
          {/* Traversed rail is ink, not red: red is reserved for the lead's
              current position, so a completed run reads as an architectural
              diagram rather than a fully-coloured progress bar. */}
          <div
            className="h-full origin-left"
            style={{
              background: T.ink,
              transform: `scaleX(${pct / 100})`,
              transition: reduced
                ? "none"
                : `transform ${SEGMENT_MS}ms ${EASE.move}`,
            }}
          />
          {/* The lead. translateX only — never `left`. */}
          <div
            className="absolute top-1/2 h-[7px] w-[7px] rounded-full"
            style={{
              left: 0,
              marginTop: -3.5,
              marginLeft: -3.5,
              background: TOKENS.accent,
              boxShadow: "0 0 0 3px rgba(192,57,43,0.12)",
              transform: `translateX(${pct}%)`,
              transition: reduced
                ? "none"
                : `transform ${SEGMENT_MS}ms ${EASE.move}`,
            }}
          />
        </div>

        <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0,1fr))` }}>
          {stages.map((label, i) => {
            const lit = i <= step;
            const current = i === step;
            return (
              <li key={label} className="flex flex-col items-center gap-3.5 text-center">
                <span
                  className="block h-[11px] w-[11px] rounded-full border"
                  style={{
                    /* Passed = ink, current = red, ahead = hollow. Only one
                       node carries the accent at any moment. */
                    background: current
                      ? TOKENS.accent
                      : lit
                        ? T.ink
                        : T.bg,
                    borderColor: current
                      ? TOKENS.accent
                      : lit
                        ? T.ink
                        : T.line,
                    transition: reduced
                      ? "none"
                      : `background-color 320ms ${EASE.enter}, border-color 320ms ${EASE.enter}`,
                  }}
                />
                {/* Sentence case: at 10px with 0.13em tracking, a two-word
                    stage like "Consultation booked" wrapped to two cramped
                    lines of caps. Same information, one line, easier to read
                    at a glance, which is what a diagram label is for. */}
                <span
                  className="px-1 text-[12px] leading-[1.35] tracking-[0.01em]"
                  style={{
                    color: lit ? T.ink : T.muted,
                    transition: reduced ? "none" : "color 320ms ease",
                  }}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile: the same run, stacked vertically ─────────────────────────── */}
      <ol className="mt-6 sm:hidden">
        {stages.map((label, i) => {
          const lit = i <= step;
          const current = i === step;
          return (
            <li key={label} className="relative flex gap-3.5 pb-4 last:pb-0">
              {i < stages.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[5px] top-[13px] w-px"
                  style={{
                    bottom: 0,
                    background: i < step ? T.ink : T.line,
                    transition: reduced ? "none" : "background-color 320ms ease",
                  }}
                />
              )}
              <span
                className="relative z-10 mt-[3px] block h-[11px] w-[11px] shrink-0 rounded-full border"
                style={{
                  background: current
                    ? TOKENS.accent
                    : lit
                      ? T.ink
                      : T.bg,
                  borderColor: current
                    ? TOKENS.accent
                    : lit
                      ? T.ink
                      : T.line,
                  transition: reduced ? "none" : `background-color 320ms ${EASE.enter}`,
                }}
              />
              <span
                className="text-[10px] uppercase leading-[15px] tracking-[0.13em]"
                style={{ color: lit ? T.ink : T.muted }}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
