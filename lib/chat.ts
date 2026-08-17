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
  /* Short on purpose. This section's text column is the narrow one — the
     panel takes the wide track — so every extra line costs more here than it
     would in section 03. The earlier lead spent two of its three sentences
     explaining sub-account architecture to a reader whose only job is to
     start typing.

     What was cut: "on a client build, voice and chat share one calendar and
     one contact record". That precision existed to stop the section claiming
     a shared calendar it does not have in this demo. The claim is simply
     gone now rather than hedged, which settles the same honesty problem
     without spending three lines on it. Do not reintroduce the plumbing
     here; if it needs saying, it belongs in the receipts, not above the
     thing itself. */
  lead:
    "The receptionist that answers Bright Hollow's phone also answers its website. Try it.",
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

  /* ── The close ──
     The section used to end in silence: a visitor could talk to the live
     agent, be convinced, and then be offered nothing — while section 03,
     which only replays a recording, closes with a bridge to the contact
     form. This arrives after the visitor actually engages, so it reads as a
     response to what they just did rather than a banner that was always
     there. */
  closeText: "That's the same agent that answers the phone.",
  closeLinkLabel: "Have one built for your business",

  /* Above the panel once the chat is live. Carries the only two facts a
     visitor needs BEFORE typing: this is not a real dentist, and a third
     party reads what they write.

     It used to run three sentences and say "GoHighLevel" three times, which
     was the third telling — the panel header already names the practice and
     the widget's own subtitle already calls it a demonstration. The full
     detail lives at /privacy, linked from the footer, which is where
     someone who wants it will look. */
  liveNote:
    "A real agent, on a demonstration practice. What you type goes to GoHighLevel and OpenAI.",

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

/* ── What the chat agent runs on ────────────────────────────────────────────
   The same grammar as section 03's CAPABILITIES: a plain claim over the
   literal machine names underneath. There it reads check_availability ·
   book_appointment; here it reads the GoHighLevel objects and the knowledge
   base that actually back this widget.

   This exists because section 04's text column ran 225px shorter than its
   panel, which made the live section — the one thing on the page a visitor
   can operate — read as thinner than the recorded one beside it. The honest
   fix was not padding; it was that section 03 had five receipts and section
   04 had none, while both are the same receptionist.

   EVERY LINE IS CHECKABLE against assets/bright-hollow-bot-prompts.md and
   assets/bright-hollow-knowledge-base.md. Nothing here is aspirational: the
   calendar id and sub-account are in the prompts file, the knowledge base is
   seven topic sections and ~1,060 words, and the last row states the two
   limits rather than hiding them. If a value changes in GoHighLevel, it
   changes in those files and then here. */
export const CHAT_STACK: { label: string; detail: string }[] = [
  {
    label: "Books into a real calendar",
    detail: "GoHighLevel Conversation AI · 60-minute new-patient slots",
  },
  {
    label: "Answers from a written knowledge base",
    detail: "Seven topics: hours, location, services, insurance, team, safety",
  },
  {
    label: "Same receptionist as the phone",
    detail: "June · one prompt, versioned in assets/",
  },
  {
    label: "Stops where the demo stops",
    detail: "No confirmation email · conversation capped at 12 messages",
  },
];

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
