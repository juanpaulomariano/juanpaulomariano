/* ────────────────────────────────────────────────────────────────────────────
   Conversation AI section content.

   Two channels — a real Vapi voice call and a real Instagram DM thread —
   rendered through the SAME transcript rail. That is the whole idea of the
   section: it is one machine that qualifies a lead, and the channel is a
   variable, not a second product. A visitor who reads the IronPulse
   description in lib/works.ts has just been told the system "runs two bots
   that hold a real conversation to collect the details". This section is where
   that claim gets proved.

   Nothing in this file touches layout.

   The voice transcript is PRIMARY CONTENT, not a caption track. `at` is the
   second each line begins in the recording and the rail highlights from it,
   but if the audio is missing or fails to load the transcript still renders
   complete and readable. That is deliberate — see components/call-transport.tsx.

   Line order is playback order and `at` must be ASCENDING. The sync loop finds
   the last line whose `at` has passed, so an out-of-order entry silently
   breaks the highlight without erroring.

   All prose here is REAL: a verbatim transcription of a recorded call and of a
   redacted thread. Do not rewrite, tighten, or "improve" any line. If a line
   is awkward or has a false start, that is what was actually said, and
   cleaning it up is the fastest way to make the section look fabricated.

   REDACTION CONTRACT: where a value is masked in the screenshot, the transcript
   must carry the SAME placeholder text. A reader who compares the rail against
   the image and finds them disagreeing has caught the site in a lie, which
   costs more than the section is worth.
──────────────────────────────────────────────────────────────────────────── */

/** Who is speaking. Two values only: a third speaker would need a third colour
    and this page spends its one accent elsewhere. */
export type Speaker = "bot" | "lead";

export type Line = {
  speaker: Speaker;
  /** Verbatim. Not summarised, not tidied. */
  text: string;
  /** Voice only: seconds into the recording when this line begins. Ascending,
      first line at 0. Omitted on text channels, where the rail advances on a
      timer rather than a clock. */
  at?: number;
};

/** A captioned image. Deliberately the same shape as `Shot` in lib/works.ts:
    `label` and `caption` are both required for the same reason they are there.
    An uncaptioned screenshot is texture, not evidence. */
export type Evidence = {
  src: string;
  /** Natural pixel width. Required, not optional: it feeds the aspect-ratio
      box that stops the section reflowing when the image decodes. */
  width: number;
  /** Natural pixel height. */
  height: number;
  /** Short label above the caption. */
  label: string;
  /** What this image proves. Required. */
  caption: string;
  /** Stated plainly under the caption, because the reader is already
      wondering what was removed and why. */
  redactionNote: string;
};

type ChannelBase = {
  /** Stable key; also the switch button's identity. */
  key: string;
  /** Switch button label. Two words maximum — it sits inside a knobbed
      toggle and a third word breaks the knob geometry. */
  switchLabel: string;
  /** One line under the rail naming what the reader is looking at. */
  railLabel: string;
  /** What each speaker is called in the rail's gutter. Context-specific:
      a receptionist call reads "Agent / Caller", a DM thread "Bot / Lead" —
      one generic pair would be wrong in both places. */
  speakerLabels: { bot: string; lead: string };
  lines: Line[];
  /** An evidence SET, not a single image. The page stays calm — only the
      first shot with a `src` renders as the on-page citation — and the
      lightbox behind it carries the whole set. Two audiences, one control:
      a business owner clicks through to the outcome (the CRM record), an
      agency owner keeps arrowing into the machinery (n8n workflows, the
      agent's configuration). Order = lightbox order: outcome first, then
      provenance, then machinery. */
  evidence: Evidence[];
};

export type VoiceChannel = ChannelBase & {
  kind: "voice";
  /** Path under /public. An empty string renders the "not attached yet" state
      and the transcript still reads in full, so the section can ship before
      the audio file does. */
  audioSrc: string;
  /** Real duration in seconds. Used for the resting label and the progress
      rule BEFORE metadata loads, since preload="none" means duration is NaN
      until the user presses play. A wrong value makes the fill rule jump. */
  durationSec: number;
  /** Named so the reader knows what they are about to hear. */
  callContext: string;
};

export type TextChannel = ChannelBase & {
  kind: "text";
  /** Milliseconds between lines during the one-shot reveal. */
  cadenceMs: number;
};

/** Discriminated union on `kind`, matching `Project`'s union on `type` in
    lib/works.ts. TypeScript then guarantees only the voice channel carries
    audio and only the text channel carries a cadence, so a text channel
    cannot accidentally grow a playhead. */
export type Channel = VoiceChannel | TextChannel;

/* ── Voice ───────────────────────────────────────────────────────────────────
   Built on Vapi. `at` values are transcribed from the recording, not
   estimated — Vapi's dashboard exports word-level timings, which beats
   hand-timing every time.

   PENDING: audioSrc, durationSec, the lines, and the evidence dimensions are
   placeholders until the recording is made. The section renders the
   "not attached yet" state while audioSrc is empty. */
const VOICE: VoiceChannel = {
  kind: "voice",
  key: "voice",
  switchLabel: "Voice call",
  railLabel: "A real inbound call, answered by the agent",
  speakerLabels: { bot: "Agent", lead: "Caller" },
  audioSrc: "",
  durationSec: 0,
  callContext:
    "A new patient calls Bright Hollow Family Dental — a demonstration practice — and the agent answers on the first ring",
  lines: [],
  /* PENDING: all srcs empty until the owner captures them. Captions are
     written when the images land — a caption describing an image that does
     not exist yet would drift from what the screenshot actually shows. */
  evidence: [
    {
      src: "",
      width: 0,
      height: 0,
      label: "The contact this call created",
      caption: "",
      redactionNote: "Caller number removed. The call is unedited.",
    },
    {
      src: "",
      width: 0,
      height: 0,
      label: "Vapi call log",
      caption: "",
      redactionNote: "Caller number removed.",
    },
    {
      src: "/conversation/n8n-workflows-list.webp",
      width: 1456,
      height: 1069,
      label: "The 11 n8n workflows behind the agent",
      caption:
        "Every workflow the agent can call, published and versioned. This folder is the whole toolbox; nothing else sits behind the phone line.",
      redactionNote: "Shown as deployed. Nothing staged.",
    },
    {
      src: "",
      width: 0,
      height: 0,
      label: "The agent's configuration",
      caption: "",
      redactionNote:
        "Account details cropped. The prompt shown is the prompt that runs.",
    },
    /* ── The 11 workflow canvases, in the order the life of a call meets
       them — not alphabetical. Each canvas carries its own documentation
       note, written in n8n; the crop is the canvas content only, lossless,
       verified pixel-identical to the source capture. */
    {
      src: "/conversation/n8n-lookup_contact.webp",
      width: 1824,
      height: 648,
      label: "BHFD — lookup_contact",
      caption:
        "Runs first on every call. The caller's number gets looked up in GoHighLevel, and a returning patient is greeted by name instead of being asked questions the practice already answered.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
    {
      src: "/conversation/n8n-upsert_contact.webp",
      width: 1835,
      height: 570,
      label: "BHFD — upsert_contact",
      caption:
        "One tool covers create and update, so the agent can't pick the wrong one. It also refuses incomplete phone numbers rather than saving a record nobody can call back.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
    {
      src: "/conversation/n8n-resolve_appointment_type.webp",
      width: 952,
      height: 679,
      label: "BHFD — resolve_appointment_type",
      caption:
        "Three nodes and no CRM call. It maps what the caller said to one of 7 visit types and the minutes each needs; anything that sounds like pain gets sent to triage before booking.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
    {
      src: "/conversation/n8n-triage_symptom.webp",
      width: 2131,
      height: 665,
      label: "BHFD — triage_symptom",
      caption:
        "Plain code decides how soon a dental problem needs to be seen, from ER down to routine, and writes the urgency onto the record so staff see it even if the caller hangs up. Same symptoms, same answer, every time.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
    {
      src: "/conversation/n8n-check_availability.webp",
      width: 1761,
      height: 638,
      label: "BHFD — check_availability",
      caption:
        "Asks the calendar for real openings in the next 10 days and returns up to 3, spread across different days, already worded the way a receptionist would say them out loud.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
    {
      src: "/conversation/n8n-book_appointment.webp",
      width: 2128,
      height: 611,
      label: "BHFD — book_appointment",
      caption:
        "The core loop. It verifies the patient and the slot, creates the appointment in GoHighLevel, then confirms to the caller; tags and pipeline stage sync right after. Nothing is confirmed unless the booking actually succeeded.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
    {
      src: "/conversation/n8n-reschedule_appointment.webp",
      width: 2131,
      height: 758,
      label: "BHFD — reschedule_appointment",
      caption:
        "Fetches the appointment before touching it. Moved means confirmed at the new time; a taken slot restarts the search; a missing appointment gets admitted, not papered over.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
    {
      src: "/conversation/n8n-cancel_appointment.webp",
      width: 2122,
      height: 457,
      label: "BHFD — cancel_appointment",
      caption:
        "Cancelled, never deleted. The practice keeps the appointment history for follow-ups and no-show tracking, and the record's stage and tags update in the same run.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
    {
      src: "/conversation/n8n-capture_insurance.webp",
      width: 2173,
      height: 674,
      label: "BHFD — capture_insurance",
      caption:
        "Saves the carrier, checks it against the accepted list, and queues a human to verify benefits. The agent never quotes coverage or prices on the phone.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
    {
      src: "/conversation/n8n-update_opportunity.webp",
      width: 1528,
      height: 619,
      label: "BHFD — update_opportunity",
      caption:
        "Moves the patient through the intake pipeline, from new inquiry to completed. The caller never waits on it; the reply goes out first and the CRM catches up in the background.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
    {
      src: "/conversation/n8n-transfer_log.webp",
      width: 1777,
      height: 544,
      label: "BHFD — transfer_log",
      caption:
        "A voice agent can't brief the front desk out loud, so this writes the handover instead: why the call is being passed, noted on the record and tagged, before the transfer happens.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
  ],
};

/* ── Text ────────────────────────────────────────────────────────────────────
   The IronPulse DM bot: the conversation lib/works.ts describes as "two bots
   that hold a real conversation to collect the details".

   PENDING: lines and evidence are placeholders until the redacted thread is
   supplied. */
const TEXT: TextChannel = {
  kind: "text",
  key: "dm",
  switchLabel: "Instagram DM",
  railLabel: "A real DM thread, answered in under a minute",
  speakerLabels: { bot: "Bot", lead: "Lead" },
  cadenceMs: 900,
  lines: [],
  evidence: [
    {
      src: "",
      width: 0,
      height: 0,
      label: "Instagram DM",
      caption: "",
      redactionNote: "Name and handle removed. The conversation is unedited.",
    },
  ],
};

/* Referenced here so the pending channel survives strict unused checks while
   it waits for its content. */
export const PENDING_CHANNELS: Channel[] = [TEXT];

/** An ARRAY on purpose, following lib/whitelabel.ts: the switch renders from
    it, so a third channel (WhatsApp, SMS) appears without touching layout
    code, and the switch hides itself entirely while length === 1.

    VOICE-ONLY until the IronPulse IG thread is exported: shipping the DM
    channel with empty lines would put the claim "A real DM thread" over a
    blank rail, which costs more than the second channel is worth. Move TEXT
    from PENDING_CHANNELS into this array when its lines and evidence exist. */
export const CHANNELS: Channel[] = [VOICE];

/* ── Capabilities ────────────────────────────────────────────────────────────
   The white-label section's quiet-row pattern: owner language on top, the
   LITERAL n8n workflow names underneath as evidence texture. The snake_case
   names are receipts — they read as "this exists in a running system", which
   is exactly the register this page trades in. All 11 workflows surfaced,
   zero feature-grid feel. */
export const CAPABILITIES: { label: string; detail: string }[] = [
  {
    label: "Books and reschedules",
    detail:
      "check_availability · book_appointment · reschedule_appointment · cancel_appointment",
  },
  { label: "Knows the caller", detail: "lookup_contact · upsert_contact" },
  { label: "Captures insurance", detail: "capture_insurance" },
  {
    label: "Triages the reason for the call",
    detail: "triage_symptom · resolve_appointment_type",
  },
  { label: "Hands off to a human", detail: "transfer_log · update_opportunity" },
] as const;

/** Section copy, kept here so nothing in the component is a bare string. */
export const SECTION = {
  /** Two lines, matching how the other section titles are constructed. */
  titleTop: "The bot talks.",
  titleBottom: "You get a booked call.",
  lead:
    "Leads arrive as a DM with no email and no phone number, or as a call nobody is free to answer. Both get a real conversation that collects the details and books the consultation, then hands a qualified contact to the workflows.",
  /** One operational fact, not a stat block: a demonstration practice has no
      honest ROI numbers, and this page does not stage metrics. */
  factLine:
    "Answers on the first ring, around the clock, at about $0.11 a minute.",
  /** Named under the Vapi wordmark. */
  stackNote:
    "Voice on Vapi. Eleven n8n workflows behind it. Every record lands in GoHighLevel.",
  /** The honest limitation, in the voice of the white-label section's. A
      credibility instrument, not a disclaimer. */
  limitation:
    "Bright Hollow is a demonstration practice I built to spec, not a client. The agent pauses about a second and a half before it answers — that's the current cost of it actually checking the calendar before it speaks.",
  /** The bridge to the page's one conversion control. A line, not a button:
      the page has exactly one filled button and it belongs to the final CTA. */
  bridgeText: "Want this answering your phones?",
  bridgeLinkLabel: "Send me a client build",
} as const;
