/* ────────────────────────────────────────────────────────────────────────────
   Conversation AI section content (section 03): the recorded Vapi voice call.

   The section stages ONE call — a new patient phoning Bright Hollow Family
   Dental, a demonstration practice — and lets the visitor answer it. The
   website chat surface lives in section 04 as a live GoHighLevel widget;
   these are deliberately different objects (a recording you replay versus a
   bot you type to) and they do not share a component.

   Nothing in this file touches layout.

   The voice transcript is PRIMARY CONTENT, not a caption track. `at` is the
   second each line begins in the recording and the rail highlights from it,
   but if the audio is missing or fails to load the transcript still renders
   complete and readable. That is deliberate — see components/call-stage.tsx.

   Line order is playback order and `at` must be ASCENDING. The sync loop finds
   the last line whose `at` has passed, so an out-of-order entry silently
   breaks the highlight without erroring.

   All prose here is REAL: a verbatim transcription of the recorded call. Do
   not rewrite, tighten, or "improve" any line. If a line is awkward or has a
   false start, that is what was actually said, and cleaning it up is the
   fastest way to make the section look fabricated.

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
  /** Name shown in the call surface header, like a caller ID. */
  surfaceTitle: string;
  /** What each speaker is called in the rail's gutter. Context-specific:
      a receptionist call reads "Agent / Caller", which a generic pair like
      "Bot / User" would flatten into interface language. */
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

/** A CRM write the call performed, shown in the stage's status ticker at the
    moment it happened. `at` follows the same ascending-seconds contract as
    Line.at. These are REAL events (contact created, slot checked, appointment
    written) at their real transcript moments — the ticker is receipts in
    motion, and an invented event would be the section lying at its most
    visible moment. */
export type TickerEvent = {
  at: number;
  text: string;
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
  /** The CRM writes, in playback order. Empty until the recording lands and
      the moments can be authored against the real call. */
  tickerEvents: TickerEvent[];
};

/** One channel kind today. Kept as a named type (rather than using
    VoiceChannel everywhere) because CHANNELS is still an array and a future
    surface would join it here — but it is no longer a union pretending a
    second kind exists. */
export type Channel = VoiceChannel;

/* ── Voice ───────────────────────────────────────────────────────────────────
   Built on Vapi. `at` values are transcribed from the recording, not
   estimated — Vapi's dashboard exports word-level timings, which beats
   hand-timing every time.

   The recording is a real inbound call placed to the deployed agent on
   2026-08-16, 3:06 long. The evidence screenshots are still pending owner
   capture; those entries keep empty srcs and are filtered out on the page. */
const VOICE: VoiceChannel = {
  kind: "voice",
  key: "voice",
  switchLabel: "Voice call",
  surfaceTitle: "Bright Hollow Family Dental",
  /* Names what the reader is looking at and dates it, because a recording
     without a date invites the question. */
  railLabel: "A real call to the agent, recorded 16 August 2026",
  speakerLabels: { bot: "Agent", lead: "Caller" },
  audioSrc: "/conversation/bhfd-call.mp3",
  durationSec: 186,
  /* The four workflow executions Vapi logged during this call.

     TIMING NOTE (applies to tickerEvents AND lines): the shipped audio is
     the call captured from a screen recording, which starts 3.92s before
     Vapi's clock does — the file holds digital silence until 5.52s, where
     the agent's greeting begins, and Vapi logs that greeting at 1.60s. Every
     value below is Vapi's timing PLUS 3.92s, verified against the audio's
     own energy at seven points across the call. Do not "correct" these back
     to the raw log values; that is what put the highlight out of sync. */
  tickerEvents: [
    { at: 71.61, text: "upsert_contact · Juan Paulo Mariano created" },
    { at: 107.44, text: "resolve_appointment_type · new patient cleaning" },
    { at: 118.54, text: "check_availability · three openings returned" },
    { at: 155.12, text: "book_appointment · Monday, August 17 at 10:30 AM" },
  ],
  lines: [
    { speaker: "bot", at: 5.52, text: "Thank you for calling Bright Hollow Family Dental. This is June. Can I help you today?" },
    { speaker: "lead", at: 10.74, text: "Hey, June. Uh, so I've got an event coming out this month. And I'm thinking of like, get my teeth cleaned, you know, before the event." },
    { speaker: "bot", at: 22.36, text: "Sure. I can help with that. Are you already a patient here, or would this be your first visit with us?" },
    { speaker: "lead", at: 28.24, text: "Yes. This will be the first visit. And, actually, my my friend from work actually recommended your clinic." },
    { speaker: "bot", at: 38.05, text: "Got it. Thank you for letting me know. I'll just need a few details to get you set up. Can I get your first and last name?" },
    { speaker: "lead", at: 45.59, text: "It's Juan Paulo Mariano." },
    { speaker: "bot", at: 48.68, text: "Thanks, Juan Paulo. And what's your date of birth?" },
    { speaker: "lead", at: 51.92, text: "I was born on March 20 ninth of 2003." },
    { speaker: "bot", at: 56.25, text: "Thank you. And what's the best phone number to reach you on?" },
    { speaker: "lead", at: 60.56, text: "The best phone number to reach me on is plus 6 3 9 5 0 6 6 5 50 45." },
    { speaker: "bot", at: 68.67, text: "Alright. Just getting you into the system here." },
    { speaker: "bot", at: 73.38, text: "Thanks for waiting, Juan Paulo." },
    { speaker: "bot", at: 75.04, text: "Are you just looking for a cleaning? Or would you also like a full checkup during your visit?" },
    { speaker: "lead", at: 80.36, text: "I'm just looking for a cleaning. And, also, I would like to ask if you guys accept Cigna as an insurance because I have Cigna." },
    { speaker: "bot", at: 89.50, text: "We do accept Cigna DPPO here. If you have your member ID handy, I can add that to your record for the team to verify. Do you have it with you, or would you like to provide it later?" },
    { speaker: "lead", at: 100.69, text: "Now I'll just bring it on the day of my appointment." },
    { speaker: "bot", at: 104.88, text: "That's fine. Team will go over your benefits with you when you come in." },
    { speaker: "bot", at: 108.57, text: "Let me check our next openings for a new patient cleaning. 1 moment. Just a sec. Okay. Let me pull up the schedule." },
    { speaker: "bot", at: 117.86, text: "See what we've got." },
    { speaker: "bot", at: 119.90, text: "I have Monday, August seventeenth at 10 30 AM," },
    { speaker: "bot", at: 122.69, text: "Tuesday, August eighteenth at 8 AM, or Wednesday, August nineteenth at 8 AM. Would any of those work for you?" },
    { speaker: "lead", at: 130.11, text: "Wait. Hold on. Uh, let me check my schedule first." },
    { speaker: "bot", at: 134.15, text: "Of course. Take your time. Let me know when you're ready." },
    { speaker: "lead", at: 138.15, text: "Okay. I just I just saw it, and I think Monday works for me. Yeah. Yeah. Book that Monday 1 for me." },
    { speaker: "bot", at: 144.74, text: "So that's Monday, August seventeenth at 10 30 AM. Shall I book that for you?" },
    { speaker: "lead", at: 149.86, text: "Yes. Please proceed." },
    { speaker: "bot", at: 152.90, text: "Perfect. Okay. Putting that in for you now." },
    { speaker: "bot", at: 156.04, text: "You are all set. New patient exam on Monday, August seventeenth at 10 30 AM." },
    { speaker: "bot", at: 162.05, text: "Else I can help you with, Juan Paulo?" },
    { speaker: "lead", at: 164.81, text: "No. I I think that's all. So thank you so much." },
    { speaker: "bot", at: 169.61, text: "You're very welcome, Juan Paulo. We're looking forward to meeting you. You'll be in good hands here. Have a great day. And we'll see you Monday." },
    { speaker: "lead", at: 179.78, text: "Okay. Goodbye." },
  ],
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
      label: "BHFD · lookup_contact",
      caption:
        "Runs first on every call. The caller's number gets looked up in GoHighLevel, and a returning patient is greeted by name instead of being asked questions the practice already answered.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
    {
      src: "/conversation/n8n-upsert_contact.webp",
      width: 1835,
      height: 570,
      label: "BHFD · upsert_contact",
      caption:
        "One tool covers create and update, so the agent can't pick the wrong one. It also refuses incomplete phone numbers rather than saving a record nobody can call back.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
    {
      src: "/conversation/n8n-resolve_appointment_type.webp",
      width: 952,
      height: 679,
      label: "BHFD · resolve_appointment_type",
      caption:
        "Three nodes and no CRM call. It maps what the caller said to one of 7 visit types and the minutes each needs; anything that sounds like pain gets sent to triage before booking.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
    {
      src: "/conversation/n8n-triage_symptom.webp",
      width: 2131,
      height: 665,
      label: "BHFD · triage_symptom",
      caption:
        "Plain code decides how soon a dental problem needs to be seen, from ER down to routine, and writes the urgency onto the record so staff see it even if the caller hangs up. Same symptoms, same answer, every time.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
    {
      src: "/conversation/n8n-check_availability.webp",
      width: 1761,
      height: 638,
      label: "BHFD · check_availability",
      caption:
        "Asks the calendar for real openings in the next 10 days and returns up to 3, spread across different days, already worded the way a receptionist would say them out loud.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
    {
      src: "/conversation/n8n-book_appointment.webp",
      width: 2128,
      height: 611,
      label: "BHFD · book_appointment",
      caption:
        "The core loop. It verifies the patient and the slot, creates the appointment in GoHighLevel, then confirms to the caller; tags and pipeline stage sync right after. Nothing is confirmed unless the booking actually succeeded.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
    {
      src: "/conversation/n8n-reschedule_appointment.webp",
      width: 2131,
      height: 758,
      label: "BHFD · reschedule_appointment",
      caption:
        "Fetches the appointment before touching it. Moved means confirmed at the new time; a taken slot restarts the search; a missing appointment gets admitted, not papered over.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
    {
      src: "/conversation/n8n-cancel_appointment.webp",
      width: 2122,
      height: 457,
      label: "BHFD · cancel_appointment",
      caption:
        "Cancelled, never deleted. The practice keeps the appointment history for follow-ups and no-show tracking, and the record's stage and tags update in the same run.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
    {
      src: "/conversation/n8n-capture_insurance.webp",
      width: 2173,
      height: 674,
      label: "BHFD · capture_insurance",
      caption:
        "Saves the carrier, checks it against the accepted list, and queues a human to verify benefits. The agent never quotes coverage or prices on the phone.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
    {
      src: "/conversation/n8n-update_opportunity.webp",
      width: 1528,
      height: 619,
      label: "BHFD · update_opportunity",
      caption:
        "Moves the patient through the intake pipeline, from new inquiry to completed. The caller never waits on it; the reply goes out first and the CRM catches up in the background.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
    {
      src: "/conversation/n8n-transfer_log.webp",
      width: 1777,
      height: 544,
      label: "BHFD · transfer_log",
      caption:
        "A voice agent can't brief the front desk out loud, so this writes the handover instead: why the call is being passed, noted on the record and tagged, before the transfer happens.",
      redactionNote: "Cropped to the canvas. Nothing else changed.",
    },
  ],
};

/** An ARRAY on purpose, following lib/whitelabel.ts: the section renders
    from it, so an added surface needs no layout change, and the channel
    switch hides itself entirely while length === 1.

    The IronPulse Instagram DM channel that once waited here has been
    retired: that account is no longer accessible, so the thread cannot be
    exported, and the work stays documented in Selected Work rather than
    promising a demo that will never arrive. The website chat surface is
    section 04's live GoHighLevel bot, which is a different object from a
    replayed transcript. */
export const CHANNELS: Channel[] = [VOICE];

/* ── Capabilities ────────────────────────────────────────────────────────────
   The white-label section's quiet-row pattern: owner language on top, the
   LITERAL n8n workflow names underneath as evidence texture. The snake_case
   names are receipts — they read as "this exists in a running system", which
   is exactly the register this page trades in. All 11 workflows surfaced,
   zero feature-grid feel. */
/** `galleryTarget` names the workflow whose canvas the row opens in the
    gallery — the interaction that turns the list from claims into receipts:
    click a capability, land on the flow that implements it. */
export const CAPABILITIES: {
  label: string;
  detail: string;
  galleryTarget: string;
}[] = [
  {
    label: "Books and reschedules",
    detail:
      "check_availability · book_appointment · reschedule_appointment · cancel_appointment",
    galleryTarget: "book_appointment",
  },
  {
    label: "Knows the caller",
    detail: "lookup_contact · upsert_contact",
    galleryTarget: "lookup_contact",
  },
  {
    label: "Captures insurance",
    detail: "capture_insurance",
    galleryTarget: "capture_insurance",
  },
  {
    label: "Triages the reason for the call",
    detail: "triage_symptom · resolve_appointment_type",
    galleryTarget: "triage_symptom",
  },
  {
    label: "Hands off to a human",
    detail: "transfer_log · update_opportunity",
    galleryTarget: "transfer_log",
  },
] as const;

/* ── The stage ──────────────────────────────────────────────────────────────
   Copy for the incoming-call staging. The stage is a presentation device and
   every string on it must still be true: the caller really is a new patient,
   the practice really is Bright Hollow, and the answer control really plays
   a recording (the rail label under the transcript says so in as many
   words). No "connecting…" theater, no invented time-of-day. */
export const STAGE = {
  /** Small line above the caller's name. */
  incomingLabel: "Incoming call",
  /** Who is calling. The recording's caller identifies as a new patient. */
  callerLabel: "New patient",
  /** Under the caller's name: where the call is landing. */
  calleeLine: "for Bright Hollow Family Dental",
  /** The answer control's label while a recording is attached. The real
      duration is appended by the component. */
  answerLabel: "Answer the call",
  /** Honest pending state, same contract as before the redesign. */
  pendingNote: "Recording not attached yet",
  /** Header status once the run settles. */
  endedLabel: "Call ended",
  /** The receipts strip under the stage. */
  receiptsLine:
    "Behind this call: 11 documented n8n workflows writing to GoHighLevel.",
} as const;

/** Section copy, kept here so nothing in the component is a bare string. */
export const SECTION = {
  /** Two lines, matching how the other section titles are constructed. */
  titleTop: "The bot talks.",
  titleBottom: "You get a booked call.",
  lead:
    "A call nobody is free to answer still gets a real conversation: the agent collects the details, books the visit, and writes the record.",
  /** One operational fact, not a stat block: a demonstration practice has no
      honest ROI numbers, and this page does not stage metrics. The per-minute
      cost that used to sit here was removed rather than left to go stale —
      an unverified number is worth less than no number on a page that trades
      on being checkable. */
  factLine:
    "Answers on the first ring, at two in the morning, on a public holiday.",
  /** Named under the Vapi wordmark. */
  stackNote: "Voice on Vapi. Every record lands in GoHighLevel.",
  /** The honest limitation, in the voice of the white-label section's. A
      credibility instrument, not a disclaimer.

      The latency claim is measured from this recording, not estimated:
      replies land in about 1.6 seconds, and the availability check runs 11
      from "let me check" to the first slot offered. Saying "short pause"
      would undersell what a listener actually hears, and a visitor who
      counts is the reader this section is written for. */
  limitation:
    "Bright Hollow is a demonstration practice I built to spec, not a client. The agent replies in about a second and a half, and takes eleven to read the calendar out loud, which is what it sounds like when a booking is real.",
  /** The bridge to the page's one conversion control. A line, not a button:
      the page has exactly one filled button and it belongs to the final CTA. */
  bridgeText: "Want this answering your phones?",
  bridgeLinkLabel: "Send me a client build",
} as const;
