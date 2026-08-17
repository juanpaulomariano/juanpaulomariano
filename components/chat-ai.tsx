"use client";

import { useCallback, useEffect, useState } from "react";
import ChatStage, { type ChatPhase } from "@/components/chat-stage";
import { CHAT, CHAT_EMBED, CHAT_STACK } from "@/lib/chat";
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

        {/* Argument LEFT, panel right.

            The page's text column alternates edges: work LEFT, ai RIGHT,
            chat LEFT, white-label LEFT. Not a perfect zigzag — white-label's
            grid is tuned to its own headline wrap and browser frame and is
            not worth breaking for symmetry — but the two sections that
            actually invited the "this looks like the one above it" complaint
            were 03 and 04, which had become pixel-identical: text at 849,
            dark panel at 60, same ratio, same gap. Mirroring 04 separates
            the pair, and the two dark panels now sit on opposite sides so
            the eye tracks a switch rather than a repeat.

            Centring this was tried first and was worse: a centred column
            needs every block to share an axis AND a rough width, and the
            panel is locked to the widget's 760px, so it sat under a much
            narrower centred paragraph with nothing lining up.

            The panel column is sized to the widget, not to a fraction. The
            GoHighLevel widget is configured at 760px and does not shrink the
            way section 03's stage does, so an fr ratio let its white chat
            body bleed past the dark frame and past the 1320px content edge.
            `minmax(0, 760px)` gives it its natural width and lets it fall
            back gracefully on narrower screens; the text column absorbs
            whatever is left. */}
        <div className="mt-8 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,760px)] xl:items-start xl:gap-x-10 2xl:gap-x-16">
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
                className="mt-5 max-w-[46ch]"
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

            {/* ── What it runs on ──
                Section 03's capability ledger, in the same grammar: plain
                claim over the literal machine names. It is not interactive
                here — 03's rows open a workflow canvas, and these have
                nothing to open, so making them look pressable would be a
                lie the cursor tells.

                This is also the section's structural fix. The text column
                was ending 225px above the panel, which read as the live
                section being thinner than the recorded one beside it. The
                cause was that 03 carried five receipts and 04 carried none,
                while both are the same receptionist. */}
            {CHAT_EMBED.enabled && (
              <div
                className="mt-6 border-t pt-4 xl:mt-4"
                style={{ borderColor: TOKENS.line }}
              >
                {CHAT_STACK.map((c) => (
                  <div
                    key={c.label}
                    className="border-t py-2 first:border-t-0"
                    style={{ borderColor: TOKENS.hair }}
                  >
                    <span
                      className="block"
                      style={{
                        color: TOKENS.ink,
                        fontSize: TYPE.small,
                        fontWeight: 500,
                        lineHeight: TYPE_STYLE.small.lineHeight,
                      }}
                    >
                      {c.label}
                    </span>
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
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── The panel ──
              Absent entirely while the embed is disabled: an empty dark box
              saying "not configured" advertises an unfinished feature, where
              the pending sentence above simply tells the truth. */}
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
                  className="relative border-b pb-px transition-colors duration-200 before:absolute before:-inset-x-1 before:-inset-y-2 before:content-[''] hover:border-[#C0392B] hover:text-[#C0392B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
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
