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
  evidence: Evidence;
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
  evidence: {
    src: "",
    width: 0,
    height: 0,
    label: "The contact this call created",
    caption: "",
    redactionNote: "Caller number removed. The call is unedited.",
  },
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
  evidence: {
    src: "",
    width: 0,
    height: 0,
    label: "Instagram DM",
    caption: "",
    redactionNote: "Name and handle removed. The conversation is unedited.",
  },
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
