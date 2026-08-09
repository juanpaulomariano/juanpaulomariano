/* ────────────────────────────────────────────────────────────────────────────
   White-label section content.

   An ARRAY on purpose: today there is exactly one real example, and the
   section renders no navigation while `length === 1`. Adding a second entry
   later turns on arrows/dots without touching layout code — see the guard in
   components/whitelabel.tsx.

   Screenshots are cropped from the originals in assets/Whitelabel CSS/ to
   remove the browser chrome, so the live address bar in the frame is the only
   URL on screen.
──────────────────────────────────────────────────────────────────────────── */

export type WhitelabelExample = {
  brandName: string;
  /** The white-labeled view: what a client logs into. */
  clientSrc: string;
  /** The same screen without the white-label layer. */
  stockSrc: string;
  clientDomain: string;
  stockDomain: string;
};

export const WHITELABEL_EXAMPLES: WhitelabelExample[] = [
  {
    brandName: "Juan Paulo Mariano",
    clientSrc: "/whitelabel/blueprint.webp",
    stockSrc: "/whitelabel/stock.webp",
    clientDomain: "crm.juanpaulomariano.com",
    stockDomain: "app.gohighlevel.com",
  },
];

/** Flash labels shown briefly after flipping to the underneath view. */
export const CHANGE_LABELS = [
  "Custom domain",
  "Reorganized navigation",
  "Branded sidebar",
  "Custom logo",
];

/** The quiet capabilities row under the caption. */
export const CAPABILITIES: { label: string; detail: string }[] = [
  { label: "Custom domain", detail: "Your URL, not app.gohighlevel.com" },
  { label: "Branding", detail: "Logo, colors, interface" },
  { label: "Navigation", detail: "Renamed and regrouped menu" },
  { label: "Client app", detail: "Branded mobile experience" },
];

export const CAPTIONS = {
  client:
    "Your domain, your logo, your navigation. This is what a client logs into.",
  stock: "The same platform underneath. Your client never sees this.",
} as const;
