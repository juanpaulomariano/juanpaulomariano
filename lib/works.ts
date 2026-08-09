/* ────────────────────────────────────────────────────────────────────────────
   Selected Works content. Edit copy, stages, and image lists here — nothing in
   this file touches layout.

   All prose is FINAL and pre-audited. Do not rewrite, summarise, or "improve"
   any string in this file.

   Gallery order is the array order. `preview: true` marks the shots shown on
   the calm proof wall at rest; everything else is one click away in the
   lightbox. Any `src` that is an empty string renders as a placeholder box.

   Screenshots live in /public/works/{project}/ as lossless WebP at source
   resolution, with small lossy copies in /public/works/previews/ for the
   proof-wall cards.
──────────────────────────────────────────────────────────────────────────── */

export type Shot = {
  /** Full canvas, lossless WebP at native resolution — used by the lightbox. */
  src: string;
  /** True when this canvas is a continuation of the previous entry's workflow
      (WF-01A spans three canvases, Glow Theory's WF-01/WF-03 span two). Used
      only to count workflows for the lightbox counter, so "4 / 20" matches the
      "See all 20 workflows" button instead of counting image files. */
  continuation?: boolean;
  /** Caption shown under the large image. This is what makes a deliberately
      zoomed-out canvas legible, so it is required, not optional. */
  caption: string;
  /** Short label above the caption (the workflow's name). */
  label: string;
  /** Marks this shot as one of the calm proof-wall thumbnails. */
  preview?: boolean;
  /** Small lossy copy for the proof-wall card (~260px wide on screen). */
  previewSrc?: string;
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
};

export type VideoProject = Base & {
  type: "video";
  /** Mux playback ID — NOT a raw MP4 URL, and never an API token. */
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
  galleryIntro: string;
  galleryButton: string;
  screenshots: Shot[];
};

export type Project = VideoProject | ProgressProject | PipelineProject;

/* ── IronPulse ───────────────────────────────────────────────────────────────
   Note on numbering: the source set has no WF-12 canvas, and WF-19 (member
   pause handling) has a canvas but no written caption. WF-17, WF-18 and WF-23
   share one written caption covering the upsell track, so each keeps its own
   image entry under that caption. */

const IRONPULSE_SHOTS: Shot[] = [
  {
    src: "/works/ironpulse/wf-01a-1.webp",
    previewSrc: "/works/previews/ironpulse-wf-01a-1.webp",
    label: "WF-01A — Catch the DM lead",
    caption:
      "The moment someone messages on Instagram or Facebook, this starts a bot that begins collecting their contact details. Nothing else can run until it does its job.",
    preview: true,
  },
  {
    src: "/works/ironpulse/wf-01a-2.webp",
    continuation: true,
    previewSrc: "/works/previews/ironpulse-wf-01a-2.webp",
    label: "WF-01A-2 — Details captured",
    caption:
      "There is no trigger on this one. The AI chatbot fires it automatically once it has captured both a phone number and an email. Once the bot has both an email and a phone number, the lead is marked qualified and the follow-up machine switches on.",
    preview: true,
  },
  {
    src: "/works/ironpulse/wf-01a-3.webp",
    continuation: true,
    label: "WF-01A-3 — Partial or no details",
    caption:
      "If the bot only gets one detail, or none, the lead is sorted accordingly so the system talks to them through whatever channel it actually has.",
  },
  {
    src: "/works/ironpulse/wf-01b.webp",
    previewSrc: "/works/previews/ironpulse-wf-01b.webp",
    label: "WF-01B — First reply in under a minute",
    caption:
      "A qualified lead gets their first message within a minute, then a short sequence that keeps nudging them toward booking a free consultation until they do.",
    preview: true,
  },
  {
    src: "/works/ironpulse/wf-02.webp",
    label: "WF-02 — Website leads",
    caption:
      "Leads who come through the website instead of a DM skip the bot and drop straight into the same fast follow-up.",
  },
  {
    src: "/works/ironpulse/wf-03.webp",
    label: "WF-03 — Booking confirmed",
    caption:
      "When a lead books, they get an instant confirmation, and the system clears out any old appointment tags so the record is clean.",
  },
  {
    src: "/works/ironpulse/wf-04.webp",
    label: "WF-04 — Appointment reminders",
    caption:
      "Reminders go out a day before, two hours before, and thirty minutes before, and stop themselves if the person cancels.",
  },
  {
    src: "/works/ironpulse/wf-05.webp",
    label: "WF-05 — No-show recovery",
    caption:
      "If someone misses their consultation, a same-day message and a few follow-ups over five days try to get them rebooked before the team steps in.",
  },
  {
    src: "/works/ironpulse/wf-06.webp",
    label: "WF-06 — Reschedules",
    caption:
      "GoHighLevel has no real “rescheduled” status, so this handles a cancel-and-rebook as one clean move instead of two conflicting ones.",
  },
  {
    src: "/works/ironpulse/wf-07.webp",
    previewSrc: "/works/previews/ironpulse-wf-07.webp",
    label: "WF-07 — After the consultation",
    caption:
      "Once someone attends, this pushes toward enrollment and waits for a confirmed payment, not just a promise to join.",
    preview: true,
  },
  {
    src: "/works/ironpulse/wf-08.webp",
    label: "WF-08 — Enrollment",
    caption:
      "The moment a member is marked active, six things fire at once: welcome, onboarding, check-ins, a review request, a referral ask, and the upsell track.",
  },
  {
    src: "/works/ironpulse/wf-09.webp",
    label: "WF-09 — New member onboarding",
    caption:
      "Ten minutes after enrollment, the member gets the onboarding email for their specific program, so a nutrition client and a personal-training client hear different things.",
  },
  {
    src: "/works/ironpulse/wf-10.webp",
    label: "WF-10 — First-month check-ins",
    caption:
      "Four check-ins across the first thirty days, and they stop on their own if the member pauses or cancels.",
  },
  {
    src: "/works/ironpulse/wf-11.webp",
    label: "WF-11 — At-risk recovery",
    caption:
      "When a coach flags a member as slipping, three timed touchpoints try to save the relationship, and it auto-cancels only if there's no response after two weeks.",
  },
  {
    src: "/works/ironpulse/wf-13.webp",
    label: "WF-13 — Short-term nurture",
    caption:
      "Leads who went cold get one of three different tracks depending on whether they attended, no-showed, or never booked. Nobody gets the same generic email.",
  },
  {
    src: "/works/ironpulse/wf-14.webp",
    label: "WF-14 — Long-term nurture",
    caption:
      "A slower ninety-day sequence for leads who need more time, feeding into a loop that keeps trying to re-engage them.",
  },
  {
    src: "/works/ironpulse/wf-15.webp",
    label: "WF-15 — Review requests",
    caption:
      "Thirty days in, active members are asked for a review, and only active members, so the ask always lands at a good moment.",
  },
  {
    src: "/works/ironpulse/wf-16.webp",
    label: "WF-16 — Referral requests",
    caption:
      "Sixty days in, happy members are invited to refer a friend, once per membership, no repeats.",
  },
  {
    src: "/works/ironpulse/wf-17.webp",
    label: "WF-17 — Upsells",
    caption:
      "Timed offers for nutrition coaching, the transformation program, and program upgrades, each one skipping members who already bought.",
  },
  {
    src: "/works/ironpulse/wf-18.webp",
    label: "WF-18 — Upsells",
    caption:
      "Timed offers for nutrition coaching, the transformation program, and program upgrades, each one skipping members who already bought.",
  },
  {
    src: "/works/ironpulse/wf-23.webp",
    label: "WF-23 — Upsells",
    caption:
      "Timed offers for nutrition coaching, the transformation program, and program upgrades, each one skipping members who already bought.",
  },
  {
    /* WF-19 has a canvas but no written caption in the copy deck, and WF-12
       has a caption but no canvas. Marking this one as a continuation keeps
       the lightbox counter at 20 so it agrees with the button and with the
       "20 workflows" claim in the description. */
    src: "/works/ironpulse/wf-19.webp",
    continuation: true,
    label: "WF-19 — Member pause handling",
    caption:
      "A member who pauses instead of cancelling is held in place, with the check-ins and upsells switched off until they come back.",
  },
  {
    src: "/works/ironpulse/wf-20.webp",
    label: "WF-20 — Dead-lead reactivation",
    caption:
      "Every ninety days, old dead leads get one more try through whatever channel their details allow. The system never fully gives up.",
  },
];

/* ── Glow Theory ─────────────────────────────────────────────────────────────
   WF-01 and WF-03 each span two canvases (A/B); both are shown under their
   written caption. */

const GLOWTHEORY_SHOTS: Shot[] = [
  {
    src: "/works/glowtheory/wf-01-a.webp",
    previewSrc: "/works/previews/glowtheory-wf-01-a.webp",
    label: "WF-01 — New lead, sorted",
    caption:
      "Every new inquiry is captured, tagged by treatment, and checked against existing clients so a regular asking about a new service is never treated like a stranger.",
    preview: true,
  },
  {
    src: "/works/glowtheory/wf-01-b.webp",
    continuation: true,
    label: "WF-01 — New lead, sorted",
    caption:
      "Every new inquiry is captured, tagged by treatment, and checked against existing clients so a regular asking about a new service is never treated like a stranger.",
  },
  {
    src: "/works/glowtheory/wf-02.webp",
    previewSrc: "/works/previews/glowtheory-wf-02.webp",
    label: "WF-02 — Answered in under a minute",
    caption:
      "Within a minute, the lead gets a message written for the exact treatment they asked about. A Botox inquiry and a laser inquiry read differently.",
    preview: true,
  },
  {
    src: "/works/glowtheory/wf-03-a.webp",
    label: "WF-03 — Follow-up sequence",
    caption:
      "If they don't reply, a few messages over five days keep the door open, and every one checks first whether they've already booked so nobody gets a stale nudge.",
  },
  {
    src: "/works/glowtheory/wf-03-b.webp",
    continuation: true,
    label: "WF-03 — Follow-up sequence",
    caption:
      "If they don't reply, a few messages over five days keep the door open, and every one checks first whether they've already booked so nobody gets a stale nudge.",
  },
  {
    src: "/works/glowtheory/wf-04.webp",
    label: "WF-04 — Lead lost",
    caption:
      "When follow-up runs its course with no reply, the lead is closed out cleanly so the pipeline always reflects reality.",
  },
  {
    src: "/works/glowtheory/wf-05.webp",
    previewSrc: "/works/previews/glowtheory-wf-05.webp",
    label: "WF-05 — Booking confirmed",
    caption:
      "On booking, the client gets confirmation plus the right prep for their treatment, avoid blood thinners for Botox, arrive makeup-free for a facial.",
    preview: true,
  },
  {
    src: "/works/glowtheory/wf-06.webp",
    label: "WF-06 — Reminders",
    caption:
      "A reminder two days out and again the day of, each one checking the appointment still stands before it sends.",
  },
  {
    src: "/works/glowtheory/wf-07.webp",
    label: "WF-07 — No-show handling",
    caption:
      "A missed appointment gets an understanding reschedule note, but after two no-shows the system stops and hands it to the front desk for a personal call.",
  },
  {
    src: "/works/glowtheory/wf-08.webp",
    label: "WF-08 — Cancellations",
    caption:
      "A cancellation triggers a rebooking offer and tracks the client through a dedicated stage instead of quietly losing them.",
  },
  {
    src: "/works/glowtheory/wf-09.webp",
    previewSrc: "/works/previews/glowtheory-wf-09.webp",
    label: "WF-09 — After the visit",
    caption:
      "Same-day thank-you, then aftercare matched to the treatment, and for a two-treatment visit it sends both sets and books the sooner return date.",
    preview: true,
  },
  {
    src: "/works/glowtheory/wf-10.webp",
    label: "WF-10 — Review requests",
    caption:
      "Clients are asked to rate their visit first. Happy ones go to the public review page; unhappy ones route quietly to the front desk before anything goes public.",
  },
  {
    src: "/works/glowtheory/wf-11.webp",
    label: "WF-11 — Rebooking nudge",
    caption:
      "Based on the treatment, the system knows when each client should return and reaches out a week ahead, ninety days for Botox, a month for facials.",
  },
  {
    src: "/works/glowtheory/wf-12.webp",
    label: "WF-12 — Overdue clients",
    caption:
      "If the window passes with no booking, a gentle escalating sequence brings them back without nagging.",
  },
  {
    src: "/works/glowtheory/wf-13.webp",
    label: "WF-13 — Lapsed win-back",
    caption:
      "Clients quiet for six months get one strong win-back offer before the system lets them go.",
  },
  {
    src: "/works/glowtheory/wf-14.webp",
    label: "WF-14 — Birthdays",
    caption:
      "A birthday message with an optional treat, sent automatically, skipped for anyone who opted out.",
  },
  {
    src: "/works/glowtheory/wf-15.webp",
    label: "WF-15 — Referrals",
    caption:
      "After a client leaves a review or hits their third visit, the referral invite goes out on its own.",
  },
  {
    src: "/works/glowtheory/wf-16.webp",
    label: "WF-16 — Opt-outs",
    caption:
      "When someone says stop, every automation halts at once, and if they have an upcoming appointment the front desk is told to check rather than cancel blindly.",
  },
];

export const PROJECTS: Project[] = [
  {
    key: "psd-limo",
    type: "video",
    railLabel: "PSD Limo",
    railSublabel: "Chauffeur booking + CRM",
    inProgress: false,
    eyebrow: "Chauffeur booking platform",
    title: "PSD Limo",
    subtitle: "A custom Next.js booking site wired into GoHighLevel",
    description:
      "PSD Limo is a chauffeur company that was taking bookings by hand and chasing payments after the ride. I built them a booking site where a customer picks a car, pays through Xendit on the spot, and lands in a GoHighLevel CRM that already knows who they are. The dispatch side updates itself, so the office stops copying details between a form, a calendar, and a chat thread. The video walks through a real booking from the first click to the driver being assigned.",
    /* Public playback ID — safe in client code. Never put a Mux API token or
       token secret here; those are server-side credentials. */
    muxPlaybackId: "KfpTEgo01VGJp9dLYIgFLD00v6uswZ7A00DzhdWzoER5Fk",
    posterSrc: "",
    posterTime: 12,
  },
  {
    key: "mercer",
    type: "progress",
    railLabel: "Mercer",
    railSublabel: "Apparel · custom + GHL",
    inProgress: true,
    eyebrow: "Apparel storefront",
    title: "Mercer",
    subtitle: "A custom storefront built on the same foundation as PSD Limo",
    description:
      "Mercer is an apparel brand that outgrew an off-the-shelf store. I'm building them a custom storefront on Next.js and Supabase, connected to GoHighLevel the same way PSD Limo is, so every order, customer, and follow-up lives in one place instead of three. It's in build now. I'll add the walkthrough here once it ships.",
  },
  {
    key: "ironpulse",
    type: "pipeline",
    railLabel: "IronPulse",
    railSublabel: "Fitness · Laguna, PH",
    inProgress: false,
    eyebrow: "Boutique fitness studio · Laguna, Philippines",
    title: "IronPulse Fitness & Wellness",
    subtitle: "Turns Instagram and Facebook DMs into paying members, on its own",
    description:
      "IronPulse gets almost all its leads through Instagram and Facebook DMs, and those leads arrive with no email and no phone number, just a social handle. That's the hard part: you can't follow up with someone you can't contact. So the system runs two bots that hold a real conversation to collect the details, then hands the lead to a chain of workflows that books the free consultation, chases no-shows, onboards new members, and wins back the ones who drift. A flag sits over the whole thing so two automations never fire on the same person at once, which is the bug that quietly breaks most GoHighLevel builds. It ran clean through a full audit with no logic errors.",
    stages: [
      "DM comes in",
      "Details captured",
      "Consultation booked",
      "Enrolled",
      "Active member",
    ],
    galleryIntro: "All 20 workflows, one by one.",
    galleryButton: "See all 20 workflows",
    screenshots: IRONPULSE_SHOTS,
  },
  {
    key: "glow-theory",
    type: "pipeline",
    railLabel: "Glow Theory",
    railSublabel: "Med spa · Scottsdale, AZ",
    inProgress: false,
    eyebrow: "Med spa · Scottsdale, Arizona",
    title: "Glow Theory Med Spa",
    subtitle: "A ready-made system any med spa can buy, switch on, and run alone",
    description:
      "Glow Theory is built differently from the others. It isn't wired for one owner, it's a ready-made system any med spa can buy, switch on, and run without a single call to me. That constraint shaped everything: no outside tools, every staff action is a simple yes-or-no, and when the system isn't sure what to do, it stays quiet and asks a human instead of guessing. It answers new leads in under a minute, sends care instructions matched to each treatment, and quietly brings clients back when they're due. Before a single workflow was built, I ran the whole design through an audit that caught 22 edge-case bugs, then audited the fixes to make sure they didn't create new ones.",
    stages: ["New lead", "Contacted", "Booked", "Active client", "Rebooking"],
    galleryIntro: "All 16 workflows, one by one.",
    galleryButton: "See all 16 workflows",
    screenshots: GLOWTHEORY_SHOTS,
  },
];
