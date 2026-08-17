"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { CHAT, CHAT_EMBED } from "@/lib/chat";
import { EASE, TOKENS, TYPE, TYPE_STYLE } from "@/lib/tokens";

/* ────────────────────────────────────────────────────────────────────────────
   The chat panel: a live agent, framed.

   Same geometry as the call stage in section 03 — bordered panel on the
   night ground, header with a status on the right, fixed-height body. That
   is deliberate: it is the same receptionist, so the two sections should
   read as one machine on two surfaces. What it does not borrow is the call
   stage's fiction; that panel receives a call, this one holds a chat window.

   THE WIDGET LOADS ON SCROLL, NOT ON PAGE LOAD. It costs ~30 requests to
   GoHighLevel's CDNs plus their own analytics, so a visitor who never
   reaches section 04 should never pay for it. The IntersectionObserver
   below is the compromise: no press required (the widget asks for a name
   and email itself, which is the real friction layer), but nothing fires
   until the panel is actually on screen.

   The visitor's consent point is therefore the widget's own contact form,
   and the disclosure line sits under the panel where they will read it
   before typing.
──────────────────────────────────────────────────────────────────────────── */

/* Only requested once armed, so the chunk stays out of the initial page. */
const ChatEmbed = dynamic(() => import("@/components/chat-embed"), {
  ssr: false,
});

type State = "idle" | "loading" | "live" | "failed";

export type ChatPhase = "rest" | "live";

type Props = {
  reduced: boolean;
  onPhase: (phase: ChatPhase) => void;
  /** Fires once the visitor has actually engaged with the widget, so the
      section can offer them a next step. The widget's own conversation is in
      a shadow root we cannot read, so engagement is the honest proxy: they
      clicked or focused into it, which on this panel means they typed. */
  onEngage?: () => void;
};

export default function ChatStage({ reduced, onPhase, onEngage }: Props) {
  const [state, setState] = useState<State>("idle");
  /* Rack focus keys off ENGAGEMENT, not readiness. The widget goes live on
     scroll for everyone, and dimming the claim column — including the privacy
     disclosure a visitor should read BEFORE typing — on mere arrival punished
     everyone for a conversation they had not started. The room darkens when
     someone actually sits down: first pointer or focus inside the panel. */
  const [engaged, setEngaged] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    onPhase(state === "live" && engaged ? "live" : "rest");
  }, [state, engaged, onPhase]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || engaged) return;
    const mark = () => {
      setEngaged(true);
      onEngage?.();
    };
    el.addEventListener("pointerdown", mark, { once: true });
    el.addEventListener("focusin", mark, { once: true });
    return () => {
      el.removeEventListener("pointerdown", mark);
      el.removeEventListener("focusin", mark);
    };
  }, [engaged, onEngage]);

  /* Arm on visibility. Fires once, then disconnects. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || state !== "idle") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("loading");
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [state]);

  /* Holds the hatch face mounted for exactly one wake cycle after the widget
     goes live, so the sweep has a surface to leave. Without it React unmounts
     the face on the same tick and there is nothing to animate. */
  const [waking, setWaking] = useState(false);

  const handleStatus = useCallback((status: "ready" | "failed") => {
    if (status !== "ready") {
      setState("failed");
      return;
    }
    setState("live");
    setWaking(true);
    window.setTimeout(() => setWaking(false), 560);
  }, []);

  const fade = reduced ? "none" : `opacity 420ms ${EASE.enter}`;

  const statusText =
    state === "live"
      ? CHAT.status.live
      : state === "failed"
        ? CHAT.status.failed
        : CHAT.status.loading;

  return (
    <div
      ref={rootRef}
      className="night-panel border"
      style={{ borderColor: TOKENS.stageLine, background: TOKENS.stageBg }}
    >
      <div
        className="flex items-baseline justify-between gap-4 border-b px-4 py-3 sm:px-5"
        style={{ borderColor: TOKENS.stageHair }}
      >
        <span
          className="min-w-0 truncate"
          style={{ color: TOKENS.stageInk, fontSize: TYPE.ui, ...TYPE_STYLE.ui }}
        >
          {CHAT.lockedTitle}
        </span>
        <span
          aria-live="polite"
          className="flex shrink-0 items-center gap-2 uppercase tracking-[0.16em]"
          style={{
            color: state === "live" ? TOKENS.stageInk : TOKENS.stageMuted,
            fontSize: TYPE.micro,
            ...TYPE_STYLE.micro,
          }}
        >
          {state === "live" && (
            <span
              aria-hidden="true"
              className={reduced ? "" : "stage-live-dot"}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: TOKENS.accent,
                display: "inline-block",
              }}
            />
          )}
          {statusText}
        </span>
      </div>

      {/* Fixed height, matching the widget's configured height in GHL, so the
          panel never resizes as the widget mounts or fails. */}
      <div className="relative" style={{ height: CHAT_EMBED.heightPx }}>
        {/* The panel WAKES rather than cross-fades: the hatch sweeps off while
            the chat surface comes up beneath it, so the widget arriving reads
            as a screen powering on instead of one thing swapping for another.
            The two overlap by design — see the keyframes in globals.css. */}
        <div
          className={`h-full w-full ${
            state === "live" && !reduced ? "chat-wake-surface" : ""
          }`}
          style={{
            opacity: state === "live" ? 1 : 0,
            transition: reduced ? "none" : fade,
          }}
        >
          {state !== "idle" && state !== "failed" && (
            <ChatEmbed onStatus={handleStatus} />
          )}
        </div>

        {/* Loading and failure both render here, over the hatch, so the panel
            is never an empty dark rectangle with no explanation. The face is
            kept mounted for one wake cycle after going live so the hatch has
            something to sweep off; `waking` unmounts it when the sweep ends. */}
        {(state !== "live" || waking) && (
          <div
            className={`chat-lock absolute inset-0 flex flex-col items-center justify-center px-6 text-center ${
              state === "live" && !reduced ? "chat-wake" : ""
            }`}
            style={{
              background: TOKENS.stageBg,
              pointerEvents: state === "live" ? "none" : "auto",
            }}
          >
            <p
              className="max-w-[46ch]"
              style={{
                color: TOKENS.stageMuted,
                fontSize: TYPE.small,
                ...TYPE_STYLE.small,
              }}
            >
              {state === "failed" ? CHAT.failedNote : CHAT.loadingNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
