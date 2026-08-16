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
  /* The claim is stated as CAPABILITY, not as a description of this demo.
     A client build puts voice and chat in one sub-account sharing one
     calendar and one contact record; this demo runs them in two accounts,
     so "the chat books into the same calendar" — the earlier wording —
     would have been false as shipped. A visitor who checks a claim against
     the evidence and finds them disagreeing has caught the site lying, and
     that costs more than the sentence was worth. */
  lead:
    "The receptionist that answers Bright Hollow's phone also answers its website. On a client build, voice and chat share one calendar and one contact record; here they run side by side so you can try the chat yourself.",
  /** Honest pending state. Replaced by the live widget when the embed lands. */
  pendingNote:
    "The chat agent is being built in GoHighLevel. It goes live here once it is booking reliably.",
} as const;

/* ── The embed ──────────────────────────────────────────────────────────────
   Config for the live widget, kept as data so the section can be turned off
   in one edit.

   ENTRY TREATMENT: the panel sits hatched and inert behind an overlaying
   control; nothing loads until the visitor presses it, so crawlers,
   scrapers, and passing visitors never spend account credits. (Hatched, not
   blurred: a blurred preview needs something to blur, and every candidate —
   a screenshot of a conversation, a mocked-up window — is invented UI on a
   site whose whole claim is that nothing is staged.)

   This is the site's half of the abuse defense. The GHL half is the
   10-message limit, GPT-5 Mini, content filters, and a low-limit card on the
   wallet, since HighLevel offers NO hard spend cap: their own docs state
   wallet auto-recharge cannot be disabled, so the card is the only ceiling
   that exists.

   `enabled` is the kill switch: false reverts the section to the pending
   state above, so a bad night is one edit away from being over without the
   section looking broken. */
export type ChatEmbedConfig = {
  /** Master switch and kill switch. False ships CHAT.pendingNote. */
  enabled: boolean;
  /** From GHL: Sites → Chat Widget → Get Code. */
  widgetId: string;
  /** The GHL sub-account (location) id from the same snippet. This bot lives
      in its OWN sub-account, separate from the voice agent's. */
  locationId: string;
  /** Loader script and its resources URL, kept as data so a GHL CDN change
      is one edit rather than a code change. */
  loaderSrc: string;
  resourcesSrc: string;
  /** Reserved panel height. MUST equal the Custom height set in the GHL
      widget style panel — two systems agreeing by convention is fragile, so
      the convention is named here and checked by eye at verification. */
  heightPx: number;
  /** Times one visitor may open the widget per day (localStorage-gated).
      Politeness, NOT security: a private window resets it. It stops the
      enthusiastic-reload case, never the adversarial one. The real guards
      are the message limit, the cheap model, and the card. */
  sessionsPerDay: number;
};

/* Annotated, deliberately NOT `as const`/`satisfies`: either would give
   `enabled` the literal type `false`, which narrows the live branch to
   `never` and silently stops TypeScript checking the code that matters. */
export const CHAT_EMBED: ChatEmbedConfig = {
  enabled: false,
  widgetId: "",
  locationId: "",
  loaderSrc: "",
  resourcesSrc: "",
  heightPx: 416,
  sessionsPerDay: 3,
};
