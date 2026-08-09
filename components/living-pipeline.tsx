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

type Props = {
  stages: string[];
  /** Changing this key restarts the run (used when the project switches). */
  runKey: string;
};

export default function LivingPipeline({ stages, runKey }: Props) {
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
    for (let s = 1; s <= last; s++) {
      timers.current.push(
        setTimeout(() => setStep(s), START_DELAY_MS + s * SEGMENT_MS),
      );
    }
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [runKey, runId, reduced, last]);

  const done = step >= last;
  /* Track spans between the first and last node centers, so the fill starts
     and ends exactly under a node rather than at the container edge. */
  const pct = last > 0 ? (step / last) * 100 : 100;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p
          className="text-[11px] uppercase tracking-[0.16em]"
          style={{ color: TOKENS.muted }}
        >
          Lead journey
        </p>
        {!reduced && (
          <button
            type="button"
            onClick={() => setRunId((v) => v + 1)}
            disabled={!done}
            className="rounded-full px-2 py-1 text-[11px] transition-opacity duration-200 disabled:opacity-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: TOKENS.muted }}
          >
            Replay
          </button>
        )}
      </div>

      {/* Desktop / tablet: horizontal track ───────────────────────────────── */}
      <div className="relative mt-5 hidden sm:block">
        {/* Rail + fill live in the node-center band (half a node inset). */}
        <div
          className="absolute top-[7px] h-px"
          style={{
            left: `${50 / stages.length}%`,
            right: `${50 / stages.length}%`,
            background: TOKENS.line,
          }}
        >
          <div
            className="h-full origin-left"
            style={{
              background: TOKENS.accent,
              transform: `scaleX(${pct / 100})`,
              transition: reduced
                ? "none"
                : `transform ${SEGMENT_MS}ms ${EASE.move}`,
            }}
          />
          {/* The lead. translateX only — never `left`. */}
          <div
            className="absolute top-1/2 h-[9px] w-[9px] rounded-full"
            style={{
              left: 0,
              marginTop: -4.5,
              marginLeft: -4.5,
              background: TOKENS.accent,
              boxShadow: "0 0 0 4px rgba(192,57,43,0.14)",
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
            return (
              <li key={label} className="flex flex-col items-center gap-2.5 text-center">
                <span
                  className="block h-[15px] w-[15px] rounded-full border"
                  style={{
                    background: lit ? TOKENS.accent : "#FFFFFF",
                    borderColor: lit ? TOKENS.accent : TOKENS.line,
                    transition: reduced
                      ? "none"
                      : `background-color 320ms ${EASE.enter}, border-color 320ms ${EASE.enter}`,
                  }}
                />
                <span
                  className="px-1 text-[12px] leading-tight"
                  style={{
                    color: lit ? TOKENS.ink : TOKENS.muted,
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
      <ol className="mt-4 sm:hidden">
        {stages.map((label, i) => {
          const lit = i <= step;
          return (
            <li key={label} className="relative flex gap-3 pb-3 last:pb-0">
              {i < stages.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[7px] top-[15px] w-px"
                  style={{
                    bottom: 0,
                    background: i < step ? TOKENS.accent : TOKENS.line,
                    transition: reduced ? "none" : "background-color 320ms ease",
                  }}
                />
              )}
              <span
                className="relative z-10 mt-0.5 block h-[15px] w-[15px] shrink-0 rounded-full border"
                style={{
                  background: lit ? TOKENS.accent : "#FFFFFF",
                  borderColor: lit ? TOKENS.accent : TOKENS.line,
                  transition: reduced ? "none" : `background-color 320ms ${EASE.enter}`,
                }}
              />
              <span
                className="text-[13px] leading-[15px]"
                style={{ color: lit ? TOKENS.ink : TOKENS.muted }}
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
