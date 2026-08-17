/* ────────────────────────────────────────────────────────────────────────────
   Chat AI section content (section 04).

   The bot: GoHighLevel Conversation AI, answering for Bright Hollow Family
   Dental — the SAME demonstration practice as the voice agent in section 03,
   deliberately, so the page reads as one machine on two surfaces rather than
   two unrelated features.

   The bot is named June, the same name the receptionist gives in the
   recorded call, and answers over GHL's Live Chat channel. Its prompt
   fields and knowledge base are version-controlled in assets/, because
   GoHighLevel exposes no API for bot configuration and the live values
   otherwise exist only inside its UI with no history.

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
  /** Honest pending state, shown when CHAT_EMBED.enabled is false. */
  pendingNote:
    "The chat agent is being built in GoHighLevel. It goes live here once it is booking reliably.",

  /* ── The panel ──
     The widget loads when the panel scrolls into view rather than on a
     press: it asks for a name and email itself, which is the real friction
     layer, so a second gate in front of it was two doors to the same room. */
  lockedLabel: "Live chat",
  lockedTitle: "Bright Hollow Family Dental",
  loadingNote: "Loading the chat agent.",

  /** Under the panel once the chat is live. */
  liveNote:
    "This is a live GoHighLevel Conversation AI agent answering as Bright Hollow Family Dental, a demonstration practice I built to spec. Loading it contacts GoHighLevel, and what you type is processed by GoHighLevel and OpenAI. Don't type anything you wouldn't send a stranger.",

  /* ── Failure states. Neither invents a reason; both leave the visitor
     somewhere useful. ── */
  failedNote:
    "The chat widget didn't load. It runs on GoHighLevel's servers, that's a real dependency, and this is what it looks like when a dependency is down.",

  /** Status words, right side of the panel header. */
  status: {
    loading: "Loading",
    live: "Live",
    failed: "Unavailable",
  },
} as const;

/* ── The embed ──────────────────────────────────────────────────────────────
   Config for the live widget, kept as data so the section can be turned off
   in one edit.

   ENTRY: the widget loads when the panel scrolls into view, not on page
   load. It costs ~30 requests to GoHighLevel's CDNs plus their own Google
   Analytics events, so a visitor who never reaches section 04 should never
   pay for it. There is no press gate: the widget asks for a name and email
   before the agent engages, and a second door to the same room was friction
   without a matching gain.

   Abuse defense therefore lives entirely on the GHL side: the 12-message
   limit per conversation, content filters, that name-and-email form, and a
   low-limit card on the wallet — since HighLevel offers NO hard spend cap
   (their own docs state wallet auto-recharge cannot be disabled), the card
   is the only true ceiling.

   `enabled` is the kill switch: false reverts the section to the pending
   state above, so a bad night is one edit away from being over without the
   section looking broken. */
export type ChatEmbedConfig = {
  /** Master switch and kill switch. False ships CHAT.pendingNote. */
  enabled: boolean;
  /** From GHL: Sites → Chat Widget → Get Code. The loader resolves the
      sub-account from this id, so no location id is needed here. */
  widgetId: string;
  /** Loader script and the resources url it is given, kept as data so a GHL
      CDN change is one edit rather than a code change. */
  loaderSrc: string;
  resourcesSrc: string;
  /** Reserved panel height. MUST equal the Custom height set in the GHL
      widget style panel — two systems agreeing by convention is fragile, so
      the convention is named here and checked by eye at verification. */
  heightPx: number;
};

/* Annotated, deliberately NOT `as const`/`satisfies`: either would give
   `enabled` the literal type `false`, which narrows the live branch to
   `never` and silently stops TypeScript checking the code that matters. */
export const CHAT_EMBED: ChatEmbedConfig = {
  enabled: true,
  widgetId: "6a82b0a2b7fff8e529e88b43",
  loaderSrc: "https://widgets.leadconnectorhq.com/loader.js",
  resourcesSrc: "https://widgets.leadconnectorhq.com/chat-widget/loader.js",
  /* Matches the Custom height set on the widget in GHL (760 x 416). */
  heightPx: 416,
};
