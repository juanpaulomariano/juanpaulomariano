/* ────────────────────────────────────────────────────────────────────────────
   Selected Works content. Edit copy, stats, stages, and image lists here —
   nothing in this file touches layout.

   TO SUPPLY LATER:
   • PSD Limo   → muxPlaybackId, posterSrc (optional), posterTime
   • IronPulse  → 20 screenshots under /works/ironpulse/
   • Glow Theory→ 16 screenshots under /works/glowtheory/

   Gallery order is CURATED — the array order is the order shown, best-first.
   It is deliberately NOT filename order. `preview: true` marks the 3–4 most
   visually complex canvases used as the calm proof-wall thumbnails.
   Any `src` that is an empty string renders as a labeled placeholder box.
──────────────────────────────────────────────────────────────────────────── */

export type Stat = { value: string; label: string };

export type Shot = {
  /** Path under /public. Empty string → placeholder box. */
  src: string;
  /** Optional short caption shown under the large image in the lightbox. */
  caption?: string;
  /** Marks this shot as one of the calm proof-wall thumbnails. */
  preview?: boolean;
};

type Base = {
  key: string;
  railLabel: string;
  railSublabel: string;
  inProgress: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  stats: Stat[];
};

export type VideoProject = Base & {
  type: "video";
  /** Mux playback ID — NOT a raw MP4 URL. */
  muxPlaybackId: string;
  /** Hand-supplied poster. Empty → Mux auto-thumbnail at posterTime. */
  posterSrc: string;
  /** Seconds into the video for the auto-generated thumbnail. */
  posterTime: number;
};

export type ProgressProject = Base & { type: "progress" };

export type PipelineProject = Base & {
  type: "pipeline";
  stages: string[];
  proofSentence: string;
  screenshots: Shot[];
};

export type Project = VideoProject | ProgressProject | PipelineProject;

/** Build a placeholder shot list until the real screenshots land. */
function pending(dir: string, count: number, previews: number[]): Shot[] {
  return Array.from({ length: count }, (_, i) => ({
    src: "", // ← replace with `/works/${dir}/wf-XX.png`
    caption: undefined,
    preview: previews.includes(i),
  }));
}

export const PROJECTS: Project[] = [
  {
    key: "psd-limo",
    type: "video",
    railLabel: "PSD Limo",
    railSublabel: "Chauffeur · booking + CRM",
    inProgress: false,
    eyebrow: "Chauffeur booking platform",
    title: "PSD Limo",
    subtitle: "Custom Next.js build, synced to GoHighLevel",
    description:
      "A booking and dispatch platform with Xendit payments, wired into a GoHighLevel CRM. Here's a walkthrough of it running.",
    stats: [
      { value: "12", label: "workflows" },
      { value: "23", label: "custom fields" },
      { value: "Live", label: "Xendit payments" },
    ],
    /* Public playback ID — safe in client code. Never put a Mux API token
       or token secret here; those are server-side credentials. */
    muxPlaybackId: "KfpTEgo01VGJp9dLYIgFLD00v6uswZ7A00DzhdWzoER5Fk",
    posterSrc: "", // ← optional: "/works/psd-poster.jpg" (else Mux thumbnail)
    posterTime: 12, // ← seconds into the video for the auto-thumbnail
  },
  {
    key: "mercer",
    type: "progress",
    railLabel: "Mercer",
    railSublabel: "Apparel · custom + GHL",
    inProgress: true,
    eyebrow: "Apparel storefront",
    title: "Mercer",
    subtitle: "Custom-built storefront, integrated with GoHighLevel",
    description:
      "A custom apparel storefront on Next.js and Supabase, integrated with GoHighLevel the same way PSD Limo is. Currently in build.",
    stats: [
      { value: "Next.js", label: "+ Supabase" },
      { value: "GHL", label: "integrated" },
      { value: "2026", label: "shipping" },
    ],
  },
  {
    key: "ironpulse",
    type: "pipeline",
    railLabel: "IronPulse",
    railSublabel: "Fitness · 20 workflows",
    inProgress: false,
    eyebrow: "Boutique fitness studio · Laguna, Philippines",
    title: "IronPulse Fitness & Wellness",
    subtitle:
      "Leads arrive by Instagram and Facebook DM, with no email or phone",
    description:
      "Two AI bots capture a lead's details from a DM, then 20 workflows run the whole journey to enrolled member. A collision-prevention flag stops workflows from firing over each other — the bug that breaks most GHL builds.",
    stages: ["DM in", "Qualified", "FFC booked", "Enrolled", "Active member"],
    stats: [
      { value: "20", label: "workflows" },
      { value: "3", label: "pipelines" },
      { value: "0", label: "logical errors after audit" },
    ],
    proofSentence: "All 20 workflows, individually built and documented.",
    screenshots: pending("ironpulse", 20, [0, 1, 2, 3]),
  },
  {
    key: "glow-theory",
    type: "pipeline",
    railLabel: "Glow Theory",
    railSublabel: "Med spa · 16 workflows",
    inProgress: false,
    eyebrow: "Med spa · Scottsdale, Arizona",
    title: "Glow Theory Med Spa",
    subtitle: "Built as a snapshot any med spa can buy, activate, and run solo",
    description:
      "16 workflows across seven treatment types, each with its own pre-care, aftercare, and rebooking interval. 22 edge-case bugs were caught and fixed in the architecture audit before launch.",
    stages: ["New lead", "Contacted", "Booked", "Active client", "Rebooking"],
    stats: [
      { value: "16", label: "workflows" },
      { value: "7", label: "treatment paths" },
      { value: "22", label: "bugs caught pre-launch" },
    ],
    proofSentence: "All 16 workflows, individually built and documented.",
    screenshots: pending("glowtheory", 16, [0, 1, 2, 3]),
  },
];
