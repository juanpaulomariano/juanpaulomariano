"use client";

import { useCallback, useEffect, useState } from "react";
import ChatStage, { type ChatPhase } from "@/components/chat-stage";
import { CHAT, CHAT_EMBED } from "@/lib/chat";
import { EASE, TOKENS, TYPE, TYPE_STYLE } from "@/lib/tokens";

/* ────────────────────────────────────────────────────────────────────────────
   Chat AI (section 04): the same receptionist, on the website.

   Section 03 plays a recording. This one is live — a visitor types and a
   GoHighLevel Conversation AI agent answers, books into a real calendar, and
   says so. That difference is the section's whole argument, so the panel
   deliberately shares the call stage's geometry (night ground, header with a
   status, fixed-height body, two faces swapping under `inert`) while
   refusing its fiction: no ringing, no caller ID, no handset.

   The section is otherwise the quietest on the page. The call stage earns a
   ring and a travelling dot because a recording has to invite a press; a
   live thing you can type into does not.
──────────────────────────────────────────────────────────────────────────── */

export default function ChatAi() {
  const [phase, setPhase] = useState<ChatPhase>("rest");
  const [reduced, setReduced] = useState(false);
  /* Set once the visitor has engaged the widget. The section then offers a
     next step: this is the page's only live system, and it used to end in
     silence while the recorded call got a bridge to the contact form. */
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handlePhase = useCallback((p: ChatPhase) => setPhase(p), []);
  const handleEngage = useCallback(() => setEngaged(true), []);

  /* Rack focus, the same gesture as section 03: while the visitor is talking
     to the agent, everything that is not the conversation recedes. Opacity
     only, and reduced motion opts out. */
  const recede = {
    opacity: phase === "live" && !reduced ? 0.4 : 1,
    transition: reduced ? "none" : `opacity 480ms ${EASE.enter}`,
  };

  return (
    <section
      id="chat"
      className="px-6 py-20 sm:px-10 sm:py-24"
      style={{ background: TOKENS.white }}
    >
      <div className="mx-auto max-w-[1320px]">
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

        <div className="mt-8 xl:grid xl:grid-cols-[42fr_58fr] xl:gap-x-14 2xl:gap-x-16">
          {/* ── The claim ── */}
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
                {CHAT.titleTop}
              </span>
              <span className="block text-balance">{CHAT.titleBottom}</span>
            </h2>

            <p
              className="mt-4 max-w-[46ch]"
              style={{
                color: TOKENS.muted,
                fontSize: TYPE.body,
                ...TYPE_STYLE.body,
              }}
            >
              {CHAT.lead}
            </p>

            {CHAT_EMBED.enabled ? (
              <p
                className="mt-5 max-w-[52ch]"
                style={{
                  color: TOKENS.muted,
                  fontSize: TYPE.micro,
                  ...TYPE_STYLE.micro,
                }}
              >
                {CHAT.liveNote}
              </p>
            ) : (
              <p
                className="mt-4 max-w-[46ch]"
                style={{
                  color: TOKENS.muted,
                  fontSize: TYPE.small,
                  ...TYPE_STYLE.small,
                }}
              >
                {CHAT.pendingNote}
              </p>
            )}
          </div>

          {/* ── The panel ──
              Absent entirely while the embed is disabled: an empty dark box
              saying "not configured" advertises an unfinished feature, where
              the pending sentence on the left simply tells the truth. */}
          <div className="mt-9 min-w-0 xl:mt-0">
            {CHAT_EMBED.enabled && (
              <ChatStage
                reduced={reduced}
                onPhase={handlePhase}
                onEngage={handleEngage}
              />
            )}

            {/* The close. Arrives after engagement, not on load, so it reads
                as a response to the conversation rather than a banner that
                was always sitting there. It stays out of the rack-focus dim:
                this is the one thing that should get brighter, not dimmer,
                once someone has been convinced. */}
            {CHAT_EMBED.enabled && engaged && (
              <p
                className={`mt-4 ${reduced ? "" : "chat-close-in"}`}
                style={{
                  color: TOKENS.muted,
                  fontSize: TYPE.small,
                  ...TYPE_STYLE.small,
                }}
              >
                {CHAT.closeText}{" "}
                <a
                  href="#contact"
                  className="press relative border-b pb-px transition-colors duration-200 before:absolute before:-inset-x-1 before:-inset-y-2 before:content-[''] hover:border-[#C0392B] hover:text-[#C0392B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{ color: TOKENS.ink, borderColor: TOKENS.ink }}
                >
                  {CHAT.closeLinkLabel}
                </a>{" "}
                <span aria-hidden="true">→</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
