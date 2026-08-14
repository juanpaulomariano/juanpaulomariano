"use client";

import { EASE, TOKENS, TYPE, TYPE_STYLE } from "@/lib/tokens";
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

   EVERY LINE IS MOUNTED FROM FRAME ZERO. The cursor changes opacity and colour
   only, never `display` and never mount state. A thread that grows as messages
   arrive pushes the page under the reader's cursor, which is the one failure
   this codebase has already solved three separate ways. It also means a screen
   reader gets the complete transcript immediately as a static document, rather
   than a live region firing once per line.

   Only the current line carries the accent, mirroring the pipeline's nodes:
   passed = body, current = ink with an accent gutter, ahead = muted.
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
      lines.length - 1 once the run has finished. */
  cursor: number;
  /** Voice channels show a timestamp in the gutter, text channels show the
      speaker. Derived by the caller from the channel kind. */
  showTimestamps: boolean;
  reduced: boolean;
  /** Names what the reader is looking at, under the rail. */
  railLabel: string;
};

export default function TranscriptRail({
  lines,
  cursor,
  showTimestamps,
  reduced,
  railLabel,
}: Props) {
  /* With reduced motion the whole transcript is simply present: no reveal, no
     highlight tracking. That is the same end state the run reaches, so nothing
     is withheld — only the motion is. */
  const settled = reduced;

  return (
    <div>
      <ol className="transcript-reserve">
        {lines.map((line, i) => {
          const past = settled || i < cursor;
          const current = !settled && i === cursor;
          const seen = settled || i <= cursor;

          return (
            <li
              key={`${line.speaker}-${i}`}
              className="flex gap-4 border-t py-3 first:border-t-0 sm:gap-6"
              style={{
                borderColor: TOKENS.hair,
                /* Opacity, never mount state: the row occupies its full height
                   from the first frame so the rail never changes size. */
                opacity: seen ? 1 : 0,
                transition: reduced
                  ? "none"
                  : `opacity 280ms ${EASE.enter}, color 220ms ease`,
              }}
            >
              {/* Gutter: a timestamp for voice, a speaker for text. Fixed width
                  and tabular figures so the text column starts on the same
                  x-position on every row regardless of the value. */}
              <span
                className="w-[3.25rem] shrink-0 tabular-nums"
                style={{
                  color: current ? TOKENS.accent : TOKENS.muted,
                  fontSize: TYPE.micro,
                  ...TYPE_STYLE.micro,
                  transition: reduced ? "none" : "color 220ms ease",
                }}
              >
                {showTimestamps && line.at !== undefined
                  ? clock(line.at)
                  : line.speaker === "bot"
                    ? "Bot"
                    : "Them"}
              </span>

              {/* On voice the speaker still has to be identifiable, since the
                  gutter is spent on the clock. A second quiet column rather
                  than a coloured bubble. */}
              {showTimestamps && (
                <span
                  className="w-[2.5rem] shrink-0"
                  style={{
                    color: TOKENS.muted,
                    fontSize: TYPE.micro,
                    ...TYPE_STYLE.micro,
                  }}
                >
                  {line.speaker === "bot" ? "Bot" : "Them"}
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
