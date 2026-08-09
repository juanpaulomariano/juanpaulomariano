/* ────────────────────────────────────────────────────────────────────────────
   Selected Works content. Edit copy, stats, stages, and image lists here —
   nothing in this file touches layout.

   Gallery order is CURATED — the array order is the order shown, best-first.
   It is deliberately NOT filename order. `preview: true` marks the 3–4 most
   visually complex canvases used as the calm proof-wall thumbnails.
   Any `src` that is an empty string renders as a labeled placeholder box.

   Screenshots live in /public/works/{project}/ as WebP (converted from the
   source PNGs in assets/ — 39 MB → 1.7 MB, since these canvases are mostly
   flat white). Re-export from assets/ if you ever need the originals.
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
  /** Workflow count for the gallery button. Set explicitly because some
      workflows span several canvases (IronPulse WF-01A is 3 screenshots),
      so `screenshots.length` would overstate the real number of workflows
      and contradict the verified stat above. */
  workflowCount: number;
};

export type Project = VideoProject | ProgressProject | PipelineProject;

/* Screenshot sets ──────────────────────────────────────────────────────────
   Order is CURATED, best-first — the lightbox shows them in array order, and
   the opening images should be the ones that best demonstrate the work.
   Captions are the workflows' real names, read from each canvas.
   `preview: true` marks the calm proof-wall thumbnails (the visually complex
   branching canvases, deliberately not WF-01). */

const IRONPULSE_SHOTS: Shot[] = [
  { src: "/works/ironpulse/wf-11.webp",    caption: "WF-11 — Member retention, at risk", preview: true },
  { src: "/works/ironpulse/wf-01b.webp",   caption: "WF-01B — Speed to lead, post data capture", preview: true },
  { src: "/works/ironpulse/wf-05.webp",    caption: "WF-05 — FFC no-show recovery", preview: true },
  { src: "/works/ironpulse/wf-07.webp",    caption: "WF-07 — Post-FFC sales follow-up", preview: true },
  { src: "/works/ironpulse/wf-01a-1.webp", caption: "WF-01A — Conversation AI data capture gate" },
  { src: "/works/ironpulse/wf-01a-2.webp", caption: "WF-01A-2 — Contact data captured" },
  { src: "/works/ironpulse/wf-01a-3.webp", caption: "WF-01A-3 — Partial / no contact data captured" },
  { src: "/works/ironpulse/wf-02.webp",    caption: "WF-02 — Speed to lead, website opt-in" },
  { src: "/works/ironpulse/wf-03.webp",    caption: "WF-03 — FFC booking confirmation" },
  { src: "/works/ironpulse/wf-04.webp",    caption: "WF-04 — FFC pre-appointment reminders" },
  { src: "/works/ironpulse/wf-06.webp",    caption: "WF-06 — FFC reschedule handling" },
  { src: "/works/ironpulse/wf-08.webp",    caption: "WF-08 — Enrollment confirmation" },
  { src: "/works/ironpulse/wf-09.webp",    caption: "WF-09 — New member onboarding" },
  { src: "/works/ironpulse/wf-10.webp",    caption: "WF-10 — New member check-in, weeks 1–4" },
  { src: "/works/ironpulse/wf-13.webp",    caption: "WF-13 — Short-term lead nurture" },
  { src: "/works/ironpulse/wf-14.webp",    caption: "WF-14 — Long-term lead nurture" },
  { src: "/works/ironpulse/wf-15.webp",    caption: "WF-15 — Review request system" },
  { src: "/works/ironpulse/wf-16.webp",    caption: "WF-16 — Referral request system" },
  { src: "/works/ironpulse/wf-17.webp",    caption: "WF-17 — Nutrition coaching upsell" },
  { src: "/works/ironpulse/wf-18.webp",    caption: "WF-18 — Transformation program upsell" },
  { src: "/works/ironpulse/wf-19.webp",    caption: "WF-19 — Member pause handling" },
  { src: "/works/ironpulse/wf-20.webp",    caption: "WF-20 — Dead lead reactivation" },
  { src: "/works/ironpulse/wf-23.webp",    caption: "WF-23 — Program upgrade upsell" },
];

const GLOWTHEORY_SHOTS: Shot[] = [
  { src: "/works/glowtheory/wf-03-a.webp", caption: "WF-03A — Lead follow-up sequence", preview: true },
  { src: "/works/glowtheory/wf-12.webp",   caption: "WF-12 — Overdue reactivation", preview: true },
  { src: "/works/glowtheory/wf-09.webp",   caption: "WF-09 — Post-visit follow-up", preview: true },
  { src: "/works/glowtheory/wf-07.webp",   caption: "WF-07 — No-show handler", preview: true },
  { src: "/works/glowtheory/wf-01-a.webp", caption: "WF-01A — New lead capture, source tagging" },
  { src: "/works/glowtheory/wf-01-b.webp", caption: "WF-01B — New lead entry, interest tagging" },
  { src: "/works/glowtheory/wf-02.webp",   caption: "WF-02 — Speed-to-lead response" },
  { src: "/works/glowtheory/wf-03-b.webp", caption: "WF-03B — Inbound reply handler" },
  { src: "/works/glowtheory/wf-04.webp",   caption: "WF-04 — Engaged but not booked handler" },
  { src: "/works/glowtheory/wf-05.webp",   caption: "WF-05 — Booking confirmation" },
  { src: "/works/glowtheory/wf-06.webp",   caption: "WF-06 — Appointment reminder" },
  { src: "/works/glowtheory/wf-08.webp",   caption: "WF-08 — Cancellation handler" },
  { src: "/works/glowtheory/wf-10.webp",   caption: "WF-10 — Review request" },
  { src: "/works/glowtheory/wf-11.webp",   caption: "WF-11 — Rebooking reminder" },
  { src: "/works/glowtheory/wf-13.webp",   caption: "WF-13 — Lapsed win-back" },
  { src: "/works/glowtheory/wf-14.webp",   caption: "WF-14 — Birthday / anniversary" },
  { src: "/works/glowtheory/wf-15.webp",   caption: "WF-15 — Referral program" },
  { src: "/works/glowtheory/wf-16.webp",   caption: "WF-16 — Do-not-contact" },
];

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
    workflowCount: 20,
    screenshots: IRONPULSE_SHOTS,
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
    workflowCount: 16,
    screenshots: GLOWTHEORY_SHOTS,
  },
];
