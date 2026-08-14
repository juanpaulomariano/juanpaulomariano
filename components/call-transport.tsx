"use client";

import { useEffect, useRef, useState } from "react";
import { EASE, TOKENS, TYPE, TYPE_STYLE } from "@/lib/tokens";
import type { Line } from "@/lib/conversation";

/* ────────────────────────────────────────────────────────────────────────────
   The audio transport for the voice channel.

   There is no <audio controls> and no player library, for three reasons:

   - Native controls are a rounded grey capsule with icons that renders
     differently on every OS, so the section's appearance stops being under the
     design's control. This page uses hairlines, not capsules.
   - Mux Player is ~100 kB for a 45-second mono clip. The video player is
     code-split precisely to keep that weight off the page, and this control is
     visible at rest rather than behind a click, so it would either load
     eagerly or stall.
   - The play mark and the progress rule are already solved here: the mark is
     the CSS-border triangle from the video poster, and the fill is the
     pipeline's `scaleX` rail. No SVG, no icons.

   `preload="none"` means the page costs zero audio bytes until the visitor
   presses play.

   THE TRANSCRIPT IS PRIMARY CONTENT, NOT A CAPTION TRACK. Every failure state
   below leaves the full transcript readable. Audio that will not load degrades
   to a complete artifact rather than an empty box.
──────────────────────────────────────────────────────────────────────────── */

type State =
  | "unconfigured"
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "ended"
  | "errored";

/** Seconds to `m:ss`. */
function clock(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Props = {
  src: string;
  /** Real duration, used for the resting label and the fill before metadata
      loads (preload="none" leaves duration NaN until play). */
  durationSec: number;
  lines: Line[];
  /** Called with the index of the line currently being spoken, or -1. */
  onCursor: (index: number) => void;
  reduced: boolean;
};

export default function CallTransport({
  src,
  durationSec,
  lines,
  onCursor,
  reduced,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number | null>(null);
  const [state, setState] = useState<State>(src ? "idle" : "unconfigured");
  const [elapsed, setElapsed] = useState(0);

  /* Sync is an INTEGER, not a time. The loop reads currentTime every frame but
     only reports when the derived line index actually changes, so a 47-second
     clip pushes ~18 updates (one per spoken line) instead of ~2800.

     rAF rather than `timeupdate` because the latter's rate is unspecified and
     browser-dependent (~4Hz in Safari), which the ear notices as the highlight
     lagging the voice.

     This is not a second perpetual animation: the loop exists only while audio
     is playing, which is user-initiated, finite, and ends at a rest state. */
  useEffect(() => {
    if (state !== "playing") return;
    const el = audioRef.current;
    if (!el) return;

    let lastIndex = -2;

    const tick = () => {
      const t = el.currentTime;
      setElapsed(t);

      let next = -1;
      for (let i = 0; i < lines.length; i++) {
        const at = lines[i].at;
        if (at !== undefined && at <= t) next = i;
        else break;
      }
      if (next !== lastIndex) {
        lastIndex = next;
        onCursor(next);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [state, lines, onCursor]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el || state === "unconfigured" || state === "errored") return;

    if (state === "playing") {
      el.pause();
      return;
    }
    if (state === "ended") {
      el.currentTime = 0;
      setElapsed(0);
      onCursor(-1);
    }
    setState("loading");
    void el.play().catch(() => setState("errored"));
  };

  /* Total is the configured duration until the file reports its own, so the
     fill rule and the clock are correct before any metadata exists. */
  const total =
    audioRef.current && Number.isFinite(audioRef.current.duration)
      ? audioRef.current.duration
      : durationSec;
  const pct = total > 0 ? Math.min(100, (elapsed / total) * 100) : 0;

  const label = (() => {
    switch (state) {
      case "unconfigured":
        return "Recording not attached yet";
      case "loading":
        return "Loading…";
      case "playing":
      case "paused":
        return `${clock(elapsed)} / ${clock(total)}`;
      case "ended":
        return "Play again";
      case "errored":
        return "This recording couldn't load";
      default:
        return `Play the call · ${clock(total)}`;
    }
  })();

  const dead = state === "unconfigured" || state === "errored";
  const isPlaying = state === "playing";

  return (
    <div>
      {src && (
        <audio
          ref={audioRef}
          src={src}
          preload="none"
          onPlaying={() => setState("playing")}
          onPause={() =>
            setState((s) => (s === "ended" ? s : "paused"))
          }
          onEnded={() => {
            setState("ended");
            /* Rest at the complete end state: rule full, every line revealed. */
            setElapsed(total);
            onCursor(lines.length - 1);
          }}
          onError={() => setState("errored")}
        />
      )}

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          disabled={dead}
          aria-pressed={isPlaying}
          aria-label={
            isPlaying ? "Pause the call" : `Play the call, ${clock(total)}`
          }
          className="group flex h-11 w-11 shrink-0 items-center justify-center border transition-colors duration-200 disabled:cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            borderColor: dead ? TOKENS.hair : TOKENS.ink,
            background: TOKENS.white,
          }}
        >
          {isPlaying ? (
            /* Pause: two bars, no icon font, no SVG. */
            <span aria-hidden="true" className="flex gap-[3px]">
              <span
                className="block h-[13px] w-[3px]"
                style={{ background: TOKENS.ink }}
              />
              <span
                className="block h-[13px] w-[3px]"
                style={{ background: TOKENS.ink }}
              />
            </span>
          ) : (
            /* Play: the CSS-border triangle from the video poster. */
            <span
              aria-hidden="true"
              className="ml-[3px] block h-0 w-0"
              style={{
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderLeft: `10px solid ${dead ? TOKENS.muted : TOKENS.ink}`,
              }}
            />
          )}
        </button>

        <div className="min-w-0 flex-1">
          {/* Height reserved so the label swapping between states never nudges
              the rule below it. */}
          <p
            className="flex min-h-[1.25rem] items-center tabular-nums"
            style={{
              color: dead ? TOKENS.muted : TOKENS.body,
              fontSize: TYPE.ui,
              ...TYPE_STYLE.ui,
            }}
          >
            {label}
          </p>

          {/* Progress: a hairline that fills, built exactly like the pipeline's
              rail. Transform only, so it composites and never triggers
              layout. */}
          <div
            aria-hidden="true"
            className="mt-2 h-px w-full overflow-hidden"
            style={{ background: TOKENS.line }}
          >
            <div
              className="h-full w-full origin-left"
              style={{
                background: TOKENS.ink,
                transform: `scaleX(${pct / 100})`,
                /* No transition while playing: the rAF loop already updates
                   every frame, and a transition on top would lag the audio. */
                transition:
                  reduced || isPlaying ? "none" : `transform 200ms ${EASE.move}`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
