/* Design tokens — single source of truth for both the hero and the works
   section. Change a value here and it propagates everywhere. */

export const TOKENS = {
  /** Surfaces. The palette is neutral end to end — the hero is pure white and
      the works section sits on a barely-there grey, so the two read as one
      sheet of paper rather than two differently-tinted panels. */
  white: "#FFFFFF",
  warm: "#FAFAFA",

  /** Text. Neutral greys, no warm cast. */
  ink: "#0A0A0A",
  body: "#444444",
  muted: "#767676",
  faint: "#5E5E5E",

  /** The one accent. Used sparingly: emphasis, active rail, pipeline fill. */
  accent: "#C0392B",

  /** Hairline rules. `line` for visible structure, `hair` for the faintest
      technical rules that should register as texture, not as borders. */
  line: "#E4E4E4",
  hair: "#EFEFEF",
} as const;

/** Shared easing curves (see ui-animation defaults). */
export const EASE = {
  /** Entrances, transform hover. */
  enter: "cubic-bezier(0.22, 1, 0.36, 1)",
  /** Slides, travel along a track. */
  move: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;
