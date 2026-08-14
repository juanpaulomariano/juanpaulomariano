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

/* ── Type scale ──────────────────────────────────────────────────────────────
   Roles, not sizes. Two elements that do the same job on the page must use the
   same role; the steps BETWEEN roles are the hierarchy and are meant to be
   visible. This exists because the sizes had drifted: the three section titles
   measured 62.4 / 57.6 / 41.6px at 1440, so the page was quietly saying the
   white-label section mattered a third less than the other two, and six
   near-identical body sizes (15 / 14.5 / 14 / 13.5 / 13 / 12.5) were doing the
   same work as each other.

   Values are strings for `fontSize`, so a role can carry its own clamp. Pair
   each with the matching entry in TYPE_STYLE for weight, leading and tracking.

   Rule for anyone editing: if you need a size that is not here, you are either
   adding a genuinely new role (add it here, name it) or you are re-drifting
   (use the closest existing role). Do not inline a one-off px value. */
export const TYPE = {
  /** The page's single largest element. Hero only, never reused. */
  hero: "clamp(2.45rem, 4.5vw, 3.8rem)",
  /** Top-level section headings. All three sections share this exactly. */
  section: "clamp(2.1rem, 4.2vw, 3.4rem)",
  /** A project or subsection heading, subordinate to a section title. */
  subsection: "clamp(1.7rem, 2.8vw, 2.3rem)",
  /** The one line that states what a thing is, above the body copy. */
  lead: "16px",
  /** An item in a navigable index (the Selected Work rail). Sits between lead
      and body: large enough to scan as a list of names, small enough that it
      never competes with the subsection heading it selects. */
  indexItem: "17px",
  /** Default running text. */
  body: "14.5px",
  /** Secondary text: captions, sublabels, supporting detail. */
  small: "13px",
  /** Interface text: nav, buttons, controls. */
  ui: "13.5px",
  /** Smallest readable tier: metadata, footnotes, legal. */
  micro: "12.5px",
} as const;

/** Weight, leading and tracking that belong with each TYPE role. Kept beside
    the sizes so a role is a complete style, not just a number. */
export const TYPE_STYLE = {
  hero: { fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.025em" },
  section: { fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.025em" },
  subsection: { fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.025em" },
  lead: { fontWeight: 400, lineHeight: 1.5, letterSpacing: "-0.005em" },
  indexItem: { fontWeight: 600, lineHeight: 1.3, letterSpacing: "-0.015em" },
  body: { fontWeight: 400, lineHeight: 1.75, letterSpacing: "normal" },
  small: { fontWeight: 400, lineHeight: 1.6, letterSpacing: "normal" },
  ui: { fontWeight: 500, lineHeight: 1.4, letterSpacing: "normal" },
  micro: { fontWeight: 400, lineHeight: 1.5, letterSpacing: "normal" },
} as const;

/** Shared easing curves (see ui-animation defaults). */
export const EASE = {
  /** Entrances, transform hover. */
  enter: "cubic-bezier(0.22, 1, 0.36, 1)",
  /** Slides, travel along a track. */
  move: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;
