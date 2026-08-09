/* Design tokens — single source of truth for both the hero and the works
   section. Change a value here and it propagates everywhere. */

export const TOKENS = {
  /** Page background (hero) and the warm surface used by the works section. */
  white: "#FFFFFF",
  warm: "#FAF7F2",

  /** Text. */
  ink: "#0A0A0A",
  body: "#444444",
  muted: "#6B655D",
  faint: "#5E5E5E",

  /** The one accent. Used sparingly: emphasis, active rail, pipeline fill. */
  accent: "#C0392B",

  /** Hairline borders — flat surfaces, no heavy shadows. */
  line: "#E5E5E5",
} as const;

/** Shared easing curves (see ui-animation defaults). */
export const EASE = {
  /** Entrances, transform hover. */
  enter: "cubic-bezier(0.22, 1, 0.36, 1)",
  /** Slides, travel along a track. */
  move: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;
