"use client";

import { TOKENS, TYPE, TYPE_STYLE } from "@/lib/tokens";
import type { Line } from "@/lib/conversation";

/* ────────────────────────────────────────────────────────────────────────────
   The transcript rail. Both channels render through this: a voice call driven
   by the audio clock and a DM thread driven by a timer produce the same
   component with the same markup, which is what makes the section read as one
   machine rather than two features.

   Hairline-ruled rows, not chat bubbles. Bubbles are rounded cards, and this
   page groups with rules and negative space instead ("no outer card, no
   rounded container"). Rows also give the two channels typographic parity,
   which bubbles would destroy: an SMS bubble and a call transcript look like
   different objects.

   EVERY LINE IS VISIBLE, ALWAYS. The transcript is primary content: a visitor
   who never presses play still reads the whole call, JS-disabled renders it as
   a complete static document, and an audio failure costs the motion, never the
   artifact. Playback therefore INKS the transcript rather than revealing it —
   COLOR encodes state, opacity encodes nothing:

     ahead = muted   ·   passed = body   ·   current = ink

   (An earlier draft revealed lines from opacity 0 as the cursor passed. That
   contradicted the thesis exactly when it mattered: at rest, and on error, the
   rail was a blank column.)

   The accent is spent on one meaning only: the CURRENT line's gutter turns
   accent while the AGENT is speaking. A caller's current line stays ink, so
   "the AI is talking now" is the one thing the page's single accent says here.
──────────────────────────────────────────────────────────────────────────── */

/** Seconds to `m:ss`, for the voice gutter. */
function clock(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Props = {
  lines: Line[];
  /** Index of the line currently being spoken. -1 before anything starts;
      lines.length once the run has settled (finished or errored), which marks
      every line as passed and none as current. */
  cursor: number;
  /** Voice channels show a timestamp in the gutter, text channels show the
      speaker. Derived by the caller from the channel kind. */
  showTimestamps: boolean;
  /** What each speaker is called: "Agent"/"Caller" on a call,
      "Bot"/"Lead" on a DM thread. */
  speakerLabels: { bot: string; lead: string };
  reduced: boolean;
  /** Names what the reader is looking at, under the rail. */
  railLabel: string;
};

export default function TranscriptRail({
  lines,
  cursor,
  showTimestamps,
  speakerLabels,
  reduced,
  railLabel,
}: Props) {
  /* With reduced motion the whole transcript is simply settled: no highlight
     tracking. That is the same end state the run reaches, so nothing is
     withheld — only the motion is. */
  const settled = reduced;

  /* No lines yet (content pending): render nothing rather than a label
     claiming a transcript that is not there. */
  if (lines.length === 0) return null;

  return (
    <div>
      <ol className="transcript-reserve">
        {lines.map((line, i) => {
          const past = settled || i < cursor;
          const current = !settled && i === cursor;
          const speakerName =
            line.speaker === "bot" ? speakerLabels.bot : speakerLabels.lead;
          /* The accent means exactly one thing here: the agent is speaking
             right now. */
          const accentNow = current && line.speaker === "bot";

          return (
            <li
              key={`${line.speaker}-${i}`}
              className="flex gap-4 border-t py-3 first:border-t-0 sm:gap-6"
              style={{ borderColor: TOKENS.hair }}
            >
              {/* Gutter: a timestamp for voice, a speaker for text. Fixed width
                  and tabular figures so the text column starts on the same
                  x-position on every row regardless of the value. */}
              <span
                className="w-[3.25rem] shrink-0 tabular-nums"
                style={{
                  color: accentNow
                    ? TOKENS.accent
                    : current
                      ? TOKENS.ink
                      : TOKENS.muted,
                  fontSize: TYPE.micro,
                  ...TYPE_STYLE.micro,
                  transition: reduced ? "none" : "color 220ms ease",
                }}
              >
                {showTimestamps && line.at !== undefined
                  ? clock(line.at)
                  : speakerName}
              </span>

              {/* On voice the speaker still has to be identifiable, since the
                  gutter is spent on the clock. A second quiet column rather
                  than a coloured bubble. */}
              {showTimestamps && (
                <span
                  className="w-[2.5rem] shrink-0"
                  style={{
                    color: accentNow ? TOKENS.accent : TOKENS.muted,
                    fontSize: TYPE.micro,
                    ...TYPE_STYLE.micro,
                    transition: reduced ? "none" : "color 220ms ease",
                  }}
                >
                  {speakerName}
                </span>
              )}

              <span
                className="min-w-0"
                style={{
                  color: current
                    ? TOKENS.ink
                    : past
                      ? TOKENS.body
                      : TOKENS.muted,
                  fontSize: TYPE.body,
                  ...TYPE_STYLE.body,
                  transition: reduced ? "none" : "color 220ms ease",
                }}
              >
                {line.text}
              </span>
            </li>
          );
        })}
      </ol>

      <p
        className="mt-4"
        style={{
          color: TOKENS.muted,
          fontSize: TYPE.small,
          ...TYPE_STYLE.small,
        }}
      >
        {railLabel}
      </p>
    </div>
  );
}
