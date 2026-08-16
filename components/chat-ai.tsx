import { TOKENS, TYPE, TYPE_STYLE } from "@/lib/tokens";
import { CHAT } from "@/lib/chat";

/* ────────────────────────────────────────────────────────────────────────────
   Chat AI (section 04) — PLACEHOLDER.

   The GHL Conversation AI bot for Bright Hollow is being built in the
   sub-account; the embed does not exist yet. This section reserves the
   numeral, gives the nav's "Chat AI" link a real destination, and states
   plainly what is coming. It claims nothing it cannot show: there is no
   fake chat window, no sample conversation, no "coming soon" badge
   pretending to be a product.

   When the embed snippet lands this file is replaced by the real section,
   which gets its own direction pass rather than inheriting the call
   stage's — a live widget a visitor types into is a different object from
   a recording they replay.

   The planned entry treatment (owner's decision): the widget renders
   blurred and inert behind an overlaying control; nothing loads until the
   visitor presses it, so crawlers and passing visitors never touch the
   account's credits.
──────────────────────────────────────────────────────────────────────────── */

export default function ChatAi() {
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

        <div className="mt-8 max-w-[46ch]">
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
            className="mt-4"
            style={{
              color: TOKENS.muted,
              fontSize: TYPE.body,
              ...TYPE_STYLE.body,
            }}
          >
            {CHAT.lead}
          </p>

          <p
            className="mt-4"
            style={{
              color: TOKENS.muted,
              fontSize: TYPE.small,
              ...TYPE_STYLE.small,
            }}
          >
            {CHAT.pendingNote}
          </p>
        </div>
      </div>
    </section>
  );
}
