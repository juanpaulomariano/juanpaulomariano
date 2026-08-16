"use client";

import { useEffect, useRef, useState } from "react";
import TranscriptRail from "@/components/transcript-rail";
import { EASE, TOKENS, TYPE, TYPE_STYLE } from "@/lib/tokens";
import { STAGE } from "@/lib/conversation";
import type { VoiceChannel } from "@/lib/conversation";

/* ────────────────────────────────────────────────────────────────────────────
   The call stage: a phone at night, receiving a call.

   One night panel, three faces:

   INCOMING  an overlay staged like a call screen — "Incoming call", the
             caller, the practice — with a ringing answer control. The ring
             pulses exactly three times when the stage scrolls into view,
             then rests; nothing loops uninvited.
   LIVE      answering collapses the overlay (opacity + scale only, the
             live face is always mounted underneath) into the call: a
             ticking clock in the header, the transcript inking in sync
             inside a fixed-height pane, the CRM ticker writing the real
             events at their real moments.
   ENDED     the header settles to "Call ended · m:ss", the outcome line
             stands, the answer control becomes "Replay".

   ONE CONTROL DRIVES EVERYTHING. The answer button is the section's only
   actor: press it and the overlay lift, the clock, the transcript ink, and
   the ticker are all consequences of the same audio clock. No element keeps
   private timing.

   HONESTY RULES. The clock ticks the real file's time; ticker events are
   real CRM writes at their transcribed moments (empty until the recording
   lands, and the row simply doesn't render); the rail label under the
   transcript says "recording" in as many words, so the staging never
   pretends to be live telephony. While no recording is attached the overlay
   holds the honest pending state — same contract as before the redesign.

   Audio mechanics (preload="none", the rAF integer-cursor sync loop, the
   ended/errored settling) are carried over verbatim from the retired
   call-transport.tsx — proven code, new clothes.
──────────────────────────────────────────────────────────────────────────── */

type State =
  | "unconfigured"
  | "incoming"
  | "loading"
  | "live"
  | "paused"
  | "ended"
  | "errored";

/** The three coarse phases the parent cares about (rack focus). */
export type StagePhase = "rest" | "live" | "ended";

/** Seconds to `m:ss`. */
function clock(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* The handset: two earpieces joined by a bar, tilted the way a receiver hangs.
   Drawn from three divs and a rotation because this site imports no icon
   library and ships no decorative SVG — the play triangle, the pause bars, and
   the arrows are all CSS geometry, and the one glyph that says "answer" is
   built the same way. It rocks with the lift while the call is ringing. */
function Handset({ color, rocking }: { color: string; rocking: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`block ${rocking ? "stage-handset" : ""}`}
      style={{ transform: "rotate(0deg)" }}
    >
      <span
        className="relative block"
        style={{ width: 22, height: 22, transform: "rotate(-45deg)" }}
      >
        {/* The neck: a thick arc bowing to the LEFT, drawn as a ring with its
            left half kept and its right half cut away. The two pads cap its
            ends on the right, so the silhouette is the receiver everyone
            knows: pads facing one way, the body curving the other. A straight
            bar between two pads reads as a dumbbell at this size. */}
        <span
          className="absolute"
          style={{
            top: 2,
            left: 6,
            width: 13,
            height: 18,
            border: `2.5px solid ${color}`,
            borderRadius: "50%",
            borderRightColor: "transparent",
            borderTopColor: "transparent",
            borderBottomColor: "transparent",
          }}
        />
        {/* Earpiece and mouthpiece: the flared ends capping the arc. */}
        <span
          className="absolute"
          style={{
            top: 1,
            left: 5,
            width: 10,
            height: 6.5,
            background: color,
            borderRadius: "3.25px",
          }}
        />
        <span
          className="absolute"
          style={{
            bottom: 1,
            left: 5,
            width: 10,
            height: 6.5,
            background: color,
            borderRadius: "3.25px",
          }}
        />
      </span>
    </span>
  );
}

type Props = {
  channel: VoiceChannel;
  reduced: boolean;
  /** Fired on coarse phase changes so the parent can pull focus. */
  onPhase: (phase: StagePhase) => void;
};

export default function CallStage({ channel, reduced, onPhase }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>(
    channel.audioSrc ? "incoming" : "unconfigured",
  );
  const [elapsed, setElapsed] = useState(0);
  const [cursor, setCursor] = useState(-1);
  const [tickerIndex, setTickerIndex] = useState(-1);
  /* The ring arms when the stage is actually on screen, so the three pulses
     are not spent off-screen. */
  const [armed, setArmed] = useState(false);

  const hasAudio = Boolean(channel.audioSrc);
  const answered =
    state === "loading" ||
    state === "live" ||
    state === "paused" ||
    state === "ended" ||
    state === "errored";

  useEffect(() => {
    onPhase(
      state === "live" || state === "paused" || state === "loading"
        ? "live"
        : state === "ended" || state === "errored"
          ? "ended"
          : "rest",
    );
  }, [state, onPhase]);

  useEffect(() => {
    if (reduced || armed || !rootRef.current || !hasAudio) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setArmed(true);
        io.disconnect();
      },
      { threshold: 0.35 },
    );
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, [reduced, armed, hasAudio]);

  /* The one clock. `elapsed` updates every frame ON PURPOSE — the progress
     rule reads it and a stepped rule would judder. The cursor and ticker
     index are the gated ones: they report only when the derived integer
     changes, so the transcript and ticker re-render a few dozen times per
     call, not thousands. */
  useEffect(() => {
    if (state !== "live") return;
    const el = audioRef.current;
    if (!el) return;

    let lastCursor = -2;
    let lastTicker = -2;

    const tick = () => {
      const t = el.currentTime;
      setElapsed(t);

      let nextCursor = -1;
      for (let i = 0; i < channel.lines.length; i++) {
        const at = channel.lines[i].at;
        if (at !== undefined && at <= t) nextCursor = i;
        else break;
      }
      if (nextCursor !== lastCursor) {
        lastCursor = nextCursor;
        setCursor(nextCursor);
      }

      let nextTicker = -1;
      for (let i = 0; i < channel.tickerEvents.length; i++) {
        if (channel.tickerEvents[i].at <= t) nextTicker = i;
        else break;
      }
      if (nextTicker !== lastTicker) {
        lastTicker = nextTicker;
        setTickerIndex(nextTicker);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [state, channel.lines, channel.tickerEvents]);

  /* Follow the current line inside the pane. Manual scrollTop math, not
     scrollIntoView: scrollIntoView walks every scrollable ancestor and would
     yank the page toward the stage during playback. */
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

  const answer = () => {
    const el = audioRef.current;
    if (!el || state === "unconfigured" || state === "errored") return;

    if (state === "live") {
      el.pause();
      return;
    }
    if (state === "ended") {
      el.currentTime = 0;
      setElapsed(0);
      setCursor(-1);
      setTickerIndex(-1);
    }
    setState("loading");
    void el.play().catch(() => {
      setState("errored");
      setCursor(channel.lines.length);
      setTickerIndex(channel.tickerEvents.length - 1);
    });
  };

  const total =
    audioRef.current && Number.isFinite(audioRef.current.duration)
      ? audioRef.current.duration
      : channel.durationSec;

  const settle = () => {
    setElapsed(total);
    setCursor(channel.lines.length);
    setTickerIndex(channel.tickerEvents.length - 1);
  };

  const pct = total > 0 ? Math.min(100, (elapsed / total) * 100) : 0;
  const isLive = state === "live";
  const overlayHidden = answered;
  /* The control rings only when there is genuinely a call to answer: a phone
     that rings and cannot be picked up is the section lying in its loudest
     moment. So the pending state stays still, and so does reduced motion. */
  const ringing = hasAudio && armed && !reduced && state === "incoming";
  /* Reduced motion never auto-runs anything, but the states themselves are
     all reachable; only the transitions are cut. */
  const fade = reduced ? "none" : `opacity 480ms ${EASE.enter}, transform 480ms ${EASE.enter}`;

  /* Header right slot: the stage's status line. */
  const status = (() => {
    switch (state) {
      case "live":
      case "paused":
      case "loading":
        return (
          <span className="flex items-center gap-2 tabular-nums">
            <span
              aria-hidden="true"
              className={isLive && !reduced ? "stage-live-dot" : ""}
              style={{
                width: 6,
                height: 6,
                background: TOKENS.accent,
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
            {clock(elapsed)} / {clock(total)}
          </span>
        );
      case "ended":
        return (
          <span className="tabular-nums">
            {STAGE.endedLabel} · {clock(total)}
          </span>
        );
      default:
        return <span>{channel.switchLabel}</span>;
    }
  })();

  return (
    <div
      ref={rootRef}
      className="border"
      style={{ borderColor: TOKENS.stageLine, background: TOKENS.stageBg }}
    >
      {/* Header: the practice's line, like a caller ID bar. */}
      <div
        className="flex items-baseline justify-between gap-4 border-b px-4 py-3 sm:px-5"
        style={{ borderColor: TOKENS.stageHair }}
      >
        <span
          className="min-w-0 truncate"
          style={{
            color: TOKENS.stageInk,
            fontSize: TYPE.ui,
            ...TYPE_STYLE.ui,
          }}
        >
          {channel.surfaceTitle}
        </span>
        <span
          className="shrink-0 uppercase tracking-[0.16em]"
          style={{
            color:
              isLive || state === "paused" || state === "loading"
                ? TOKENS.stageInk
                : TOKENS.stageMuted,
            fontSize: TYPE.micro,
            ...TYPE_STYLE.micro,
          }}
        >
          {status}
        </span>
      </div>

      {/* Body: the live face underneath, the incoming overlay above. Fixed
          height, so answering changes what the panel shows, never how much
          page it takes. */}
      <div className="relative h-[430px] sm:h-[416px]">
        {/* ── The live call ── */}
        {/* `inert` (not just aria-hidden) while the overlay covers it, so the
            invisible transport can't take keyboard focus through the overlay. */}
        <div
          className="flex h-full flex-col px-4 py-4 sm:px-5"
          inert={!answered}
          style={{
            opacity: overlayHidden ? 1 : 0,
            transition: fade,
          }}
        >
          {/* Transcript pane: a long call scrolls in here; the pane follows
              the current line while the audio plays. */}
          <div
            ref={paneRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
          >
            <TranscriptRail
              lines={channel.lines}
              cursor={reduced && answered ? channel.lines.length : cursor}
              showTimestamps
              speakerLabels={channel.speakerLabels}
              reduced={reduced}
              railLabel={channel.railLabel}
              surface="dark"
            />
          </div>

          {/* The CRM ticker: real writes at their real moments. Absent until
              the recording (and its authored events) exist. */}
          {channel.tickerEvents.length > 0 && (
            <div
              className="mt-3 flex items-baseline gap-3 border-t pt-3"
              style={{ borderColor: TOKENS.stageHair }}
            >
              {/* The label stays "CRM" in every state — the final event's own
                  text carries the outcome, and a second "appointment booked"
                  in the label would say it twice. */}
              <span
                className="shrink-0 uppercase tracking-[0.16em]"
                style={{
                  color: TOKENS.stageMuted,
                  fontSize: TYPE.micro,
                  ...TYPE_STYLE.micro,
                }}
              >
                CRM
              </span>
              <span
                className="min-w-0 truncate tabular-nums"
                style={{
                  color: TOKENS.stageBody,
                  fontSize: TYPE.micro,
                  ...TYPE_STYLE.micro,
                }}
              >
                {tickerIndex >= 0
                  ? channel.tickerEvents[tickerIndex].text
                  : "·"}
              </span>
            </div>
          )}

          {/* Transport row: pause/replay + the progress rule. */}
          <div className="mt-3 flex items-center gap-4 border-t pt-3" style={{ borderColor: TOKENS.stageHair }}>
            <button
              type="button"
              onClick={answer}
              disabled={state === "errored"}
              aria-pressed={isLive}
              aria-label={
                isLive
                  ? "Pause the recording"
                  : state === "ended"
                    ? "Replay the recording"
                    : "Resume the recording"
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center border transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default"
              style={{
                borderColor:
                  state === "errored" ? TOKENS.stageHair : TOKENS.stageLine,
                color: TOKENS.stageInk,
              }}
            >
              {isLive ? (
                <span aria-hidden="true" className="flex gap-[3px]">
                  <span className="block h-[12px] w-[3px]" style={{ background: TOKENS.stageInk }} />
                  <span className="block h-[12px] w-[3px]" style={{ background: TOKENS.stageInk }} />
                </span>
              ) : (
                <span
                  aria-hidden="true"
                  className="ml-[3px] block h-0 w-0"
                  style={{
                    borderTop: "5px solid transparent",
                    borderBottom: "5px solid transparent",
                    borderLeft: `9px solid ${TOKENS.stageInk}`,
                  }}
                />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <p
                className="flex min-h-[1.1rem] items-center"
                style={{
                  color: TOKENS.stageMuted,
                  fontSize: TYPE.micro,
                  ...TYPE_STYLE.micro,
                }}
              >
                {state === "errored"
                  ? "The recording couldn't load. The transcript above is complete."
                  : state === "ended"
                    ? "Replay"
                    : state === "paused"
                      ? "Paused"
                      : " "}
              </p>
              <div
                aria-hidden="true"
                className="mt-1.5 h-px w-full overflow-hidden"
                style={{ background: TOKENS.stageHair }}
              >
                <div
                  className="h-full w-full origin-left"
                  style={{
                    background: TOKENS.stageInk,
                    transform: `scaleX(${pct / 100})`,
                    transition:
                      reduced || isLive ? "none" : `transform 200ms ${EASE.move}`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── The incoming overlay ── */}
        <div
          inert={answered}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          style={{
            background: TOKENS.stageBg,
            opacity: overlayHidden ? 0 : 1,
            transform: overlayHidden ? "scale(0.985)" : "scale(1)",
            pointerEvents: overlayHidden ? "none" : "auto",
            transition: fade,
          }}
        >
          <p
            className="uppercase tracking-[0.2em]"
            style={{
              color: TOKENS.stageMuted,
              fontSize: TYPE.micro,
              ...TYPE_STYLE.micro,
            }}
          >
            {STAGE.incomingLabel}
          </p>
          <p
            className="mt-3"
            style={{
              fontFamily: "var(--font-grotesk)",
              color: TOKENS.stageInk,
              fontSize: TYPE.subsection,
              ...TYPE_STYLE.subsection,
            }}
          >
            {STAGE.callerLabel}
          </p>
          <p
            className="mt-2"
            style={{
              color: TOKENS.stageMuted,
              fontSize: TYPE.small,
              ...TYPE_STYLE.small,
            }}
          >
            {STAGE.calleeLine}
          </p>

          {/* The answer control. Square, like every control on this site; the
              rings are scaled copies of its own outline, and the whole control
              lifts on a ring cadence while a call is waiting.

              NOT green, and not a play triangle. Green-answer is phone-OS
              chrome and would make this stage read as a mockup of a phone
              rather than a real system, which is the one thing this section
              cannot afford; it would also spend a second colour meaning on a
              panel where red already means "the call is live". The glyph is a
              handset because the verb here is answer, not play. */}
          <div className={`relative mt-9 ${ringing ? "stage-ringing" : ""}`}>
            {ringing && (
              <>
                <span aria-hidden="true" className="stage-ring" />
                <span aria-hidden="true" className="stage-ring stage-ring--late" />
              </>
            )}
            <button
              type="button"
              onClick={answer}
              disabled={!hasAudio}
              aria-label={
                hasAudio
                  ? `Answer the call. Plays the recording, ${clock(total)}.`
                  : STAGE.pendingNote
              }
              className="relative flex h-14 w-14 items-center justify-center border transition-transform duration-200 enabled:hover:scale-[1.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-default"
              style={{
                borderColor: hasAudio ? TOKENS.stageInk : TOKENS.stageLine,
                color: TOKENS.stageInk,
              }}
            >
              <Handset
                color={hasAudio ? TOKENS.stageInk : TOKENS.stageMuted}
                rocking={ringing}
              />
            </button>
          </div>

          <p
            className="mt-5"
            style={{
              color: hasAudio ? TOKENS.stageInk : TOKENS.stageMuted,
              fontSize: TYPE.ui,
              ...TYPE_STYLE.ui,
            }}
          >
            {hasAudio
              ? `${STAGE.answerLabel} · ${clock(total)}`
              : STAGE.pendingNote}
          </p>
        </div>
      </div>

      {hasAudio && (
        <audio
          ref={audioRef}
          src={channel.audioSrc}
          preload="none"
          onPlaying={() => setState("live")}
          onPause={() => setState((s) => (s === "ended" ? s : "paused"))}
          onEnded={() => {
            setState("ended");
            settle();
          }}
          onError={() => {
            setState("errored");
            settle();
          }}
        />
      )}
    </div>
  );
}
