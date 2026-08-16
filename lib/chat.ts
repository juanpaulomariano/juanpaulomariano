/* ────────────────────────────────────────────────────────────────────────────
   Chat AI section content (section 04).

   The bot: GoHighLevel Conversation AI, answering for Bright Hollow Family
   Dental — the SAME demonstration practice as the voice agent in section 03,
   deliberately, so the page reads as one machine on two surfaces rather than
   two unrelated features.

   STATUS: the bot is being built in the GHL sub-account. Nothing here claims
   a live conversation until `embed.enabled` is true and a real snippet
   exists. The section ships an honest pending state, same contract as the
   call stage did before its recording landed.

   Copy rules inherited from the rest of the site: no invented metrics, no
   "coming soon" theater, and the demonstration-practice disclosure travels
   with the practice's name wherever it appears.
──────────────────────────────────────────────────────────────────────────── */

export const CHAT = {
  titleTop: "Same practice.",
  titleBottom: "Now type to it.",
  lead:
    "The receptionist that answers Bright Hollow's phone also answers its website. One system, two surfaces: the chat books into the same calendar and writes the same records.",
  /** Honest pending state. Replaced by the live widget when the embed lands. */
  pendingNote:
    "The chat agent is being built in GoHighLevel. It goes live here once it is booking reliably.",
} as const;

/* ── The embed ──────────────────────────────────────────────────────────────
   Config for the live widget, kept as data so the section can be turned off
   in one edit. `enabled: false` ships the pending state above.

   ENTRY TREATMENT (owner's decision): the widget renders blurred and inert
   behind an overlaying control. Nothing loads until the visitor presses it,
   so crawlers, scrapers, and passing visitors never spend account credits.
   This is the site's half of the abuse defense; the GHL half is the message
   limit, the cheap model, the content filters, and a low-limit card on the
   wallet, since HighLevel offers no hard spend cap.

   `enabled` is also the kill switch: flipping it to false reverts the
   section to the honest pending state, so a bad night is one edit away from
   being over without the section looking broken. */
export const CHAT_EMBED = {
  enabled: false,
  /** The GHL widget snippet's src / widget id, filled when the bot ships. */
  src: "",
  /** Times one visitor may open the widget per day (localStorage-gated). */
  sessionsPerDay: 3,
} as const;
