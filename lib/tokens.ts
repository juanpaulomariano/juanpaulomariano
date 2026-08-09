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

  /* ── Dark surface ──────────────────────────────────────────────────────
     Used by exactly one section (Selected Work). It is the page's single
     visual reset between the white hero and the white sections after it, so
     the contrast comes from purpose rather than from constant colour changes.
     Do not introduce a second dark section. */
  darkBg: "#0A0A0A",
  darkInk: "#FFFFFF",
  /** Body copy on dark. Light enough to read comfortably at 14-15px. */
  darkBody: "#B4B4B4",
  /** Labels and inactive items on dark. */
  darkMuted: "#8A8A8A",
  /** Hairlines on dark, in the same two weights as the light surface. */
  darkLine: "rgba(255,255,255,0.20)",
  darkHair: "rgba(255,255,255,0.10)",
} as const;

/** Shared easing curves (see ui-animation defaults). */
export const EASE = {
  /** Entrances, transform hover. */
  enter: "cubic-bezier(0.22, 1, 0.36, 1)",
  /** Slides, travel along a track. */
  move: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;
