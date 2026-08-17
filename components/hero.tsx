"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   Orbit settings — finalized. These constants are the single place to adjust
   the hero; change one and the whole system (rings, dots, connectors, logo
   depth) follows, since every position derives from them.
──────────────────────────────────────────────────────────────────────────── */

/** The one accent color. Used only for the "can't do" emphasis + button hover. */
const ACCENT = "#C0392B";

/** Headline font: "grotesk" | "serif" | "manrope" */
const HEADLINE_FONT: FontKey = "manrope";

/** Logos on flat white tiles (true) vs bare on the background (false). */
const SHOW_TILES = true;

/** Continuous orbital travel on/off. */
const SLOW_ROTATION = true;

/** Seconds per full revolution of the OUTER layer (inner layers run faster). */
const ORBIT_SECONDS = 110;

/** Orbit-plane tilt in degrees (45–70). ~58° ≈ Saturn's rings at an angle. */
const TILT_DEG = 58;

/** Depth cues (scale/opacity/shadow from orbital position) on/off. */
const DEPTH_SCALING = true;

/** Faint orbit-path rings on/off. */
const ORBIT_RINGS = true;

/** Sparse connecting lines + nodes on/off. */
const DOTS_AND_LINES = true;

/** "Scroll to explore" cue on/off. */
const SCROLL_CUE = true;

/* ── Orbital system defaults (all live-tunable in the dev panel) ── */

/** Outer-layer semi-axes as fractions of the plane container. */
const RX_FRAC = 0.5;
const RY_FRAC = 0.38;

/** Orbit center offset from text center, % of plane size (negative = up).
    Lifts the system so the back arc fills the band below the nav. */
const CENTER_OFFSET_PCT = -3.4;

/** Number of orbital layers (2 or 3). */
const LAYER_COUNT: 2 | 3 = 2;

/** Depth → scale range (back … front) and back-logo opacity floor. */
const SCALE_MIN = 0.58;
const SCALE_MAX = 1.26;
const OPACITY_FLOOR = 0.72;

/** Tile box size (px) and how much the mark is enlarged inside it. */
const TILE_PX = 80;
const MARK_SCALE = 1.16;

/* Sizes are per-logo rendered widths (px), tuned to each file's aspect ratio
   so optical mass matches — wide marks (n8n 1.9:1, vapi 3.1:1, make 1.4:1)
   get more width than square icons; gohighlevel's art has built-in padding
   inside its viewBox so it gets extra. */
const LOGOS = [
  { src: "/logos/gohighlevel.svg", label: "GoHighLevel", size: 50 },
  { src: "/logos/n8n.svg",         label: "n8n",         size: 58 },
  { src: "/logos/supabase.svg",    label: "Supabase",    size: 36 },
  { src: "/logos/make.svg",        label: "Make",        size: 50 },
  { src: "/logos/vapi.svg",        label: "Vapi",        size: 60 },
  { src: "/logos/vercel.svg",      label: "Vercel",      size: 40 },
  { src: "/logos/claude.svg",      label: "Claude",      size: 38 },
  { src: "/logos/notion.svg",      label: "Notion",      size: 36 },
  { src: "/logos/slack.svg",       label: "Slack",       size: 36 },
  { src: "/logos/meta.svg",        label: "Meta",        size: 44 },
];

/* ── 3D orbit geometry ───────────────────────────────────────────────────────
   One tilted plane holds everything. Logos ride 2–3 concentric elliptical
   orbits drawn ON that plane. The plane is tilted back with a real CSS
   `rotateX` inside a `perspective` context — the SVG orbit rings/dots render
   there and pick up true perspective (far side narrower, near side wider).

   The logos + connector lines live in a FLAT overlay, positioned by the same
   perspective projection computed in JS — identical tilt, identical
   perspective distance — so they land exactly on the rendered rings while
   staying upright, undistorted, and cheap to animate per frame.

   DEPTH is the normalized true z-coordinate across the WHOLE system, not the
   per-ring angle: outer-ring logos sweep the full back→front range while
   inner-ring logos live in the middle band. Scale / opacity / z-index /
   shadow all derive from that one value, so size always tracks how close a
   logo actually is to the viewer. Inner layers orbit slightly faster for a
   quiet parallax.

   Perspective distance is proportional to the plane size (PERSP_FRAC) so the
   scene reads identically at any viewport; the CSS side uses the same factor
   via calc(), which is what keeps both worlds in exact register. */

const PERSP_FRAC = 1.6; // perspective distance = 1.6 × plane size
const PLANE_SIZE = "min(94vw, 132vh, 1280px)";

/** Per-layer shape (relative to the outer axes), speed, and starting phase.

    Layers separate by X-RADIUS and SPEED while keeping full depth amplitude
    (inner `b` slightly LARGER): a smaller inner ellipse would thread its near
    arc behind the buttons and its far arc behind the eyebrow, but this shape
    keeps every arc inside the safe channel — above the eyebrow at the back,
    below the buttons at the front — at any orbital angle. It also gives inner
    logos the widest z-range, so the nearest/farthest tiles come from the
    inner band while the outer band sweeps wide — two visibly distinct orbits.

    Phases are chosen so the initial static frame is spread out and clear of
    the text block. */
const LAYER_PRESETS: Record<2 | 3, { a: number; b: number; speed: number; phase: number }[]> = {
  2: [
    { a: 1.0,  b: 1.0,   speed: 1.0,  phase: -64 },
    { a: 0.86, b: 1.055, speed: 1.22, phase: -128 },
  ],
  3: [
    { a: 1.0,  b: 1.0,  speed: 1.0,  phase: -64 },
    { a: 0.88, b: 1.04, speed: 1.18, phase: -118 },
    { a: 0.76, b: 1.09, speed: 1.38, phase: -95 },
  ],
};

type LogoOrbit = {
  a: number;      // semi-major (x) axis, fraction of plane
  b: number;      // semi-minor (in-plane y) axis, fraction of plane
  angle0: number; // starting angle, deg
  speed: number;  // angular speed multiplier
  layer: number;
};

type Layout = {
  per: LogoOrbit[];
  chords: Array<[number, number]>;
  paths: Array<{ a: number; b: number }>;
};

/** Distribute logos round-robin across layers; even spacing within a layer. */
function buildLayout(layerCount: 2 | 3, rx: number, ry: number): Layout {
  const presets = LAYER_PRESETS[layerCount];
  const members: number[][] = presets.map(() => []);
  LOGOS.forEach((_, i) => members[i % layerCount].push(i));

  const per: LogoOrbit[] = [];
  members.forEach((mm, li) =>
    mm.forEach((gi, m) => {
      per[gi] = {
        a: rx * presets[li].a,
        b: ry * presets[li].b,
        angle0: presets[li].phase + (360 / mm.length) * m,
        speed: presets[li].speed,
        layer: li,
      };
    }),
  );

  /* Sparse connectors: pair up neighbors WITHIN a layer (same angular speed,
     so each chord stays attached to its two logos as the layer orbits). */
  const chords: Array<[number, number]> = [];
  members.forEach((mm) => {
    for (let k = 0; k + 1 < mm.length && chords.length < 4; k += 2) {
      chords.push([mm[k], mm[k + 1]]);
    }
  });

  return { per, chords, paths: presets.map((p) => ({ a: rx * p.a, b: ry * p.b })) };
}

/** Project a point at `angleDeg` on an in-plane ellipse (a × b) to screen
    space (offsets from center as fractions of the plane size). `depth` is the
    z-position normalized across the whole system: 0 = farthest possible
    (outer ring, back apex), 1 = nearest (outer ring, front apex). */
function project(angleDeg: number, tiltDeg: number, a: number, b: number, bMax: number) {
  const th = (angleDeg * Math.PI) / 180;
  const tilt = (tiltDeg * Math.PI) / 180;
  const x = a * Math.cos(th);
  const y = b * Math.sin(th);              // plane y; positive = near edge
  const z = y * Math.sin(tilt);            // toward the viewer when y > 0
  const f = PERSP_FRAC / (PERSP_FRAC - z); // same divide the CSS plane gets
  return {
    X: x * f,
    Y: y * Math.cos(tilt) * f,
    depth: ((b / bMax) * Math.sin(th) + 1) / 2,
  };
}

type DepthKnobs = {
  tilt: number;
  depthOn: boolean;
  scaleMin: number;
  scaleMax: number;
  opacityFloor: number;
  bMax: number;
};

/** Depth → position / scale / opacity / stacking / shadow for one logo.
    Values are pre-formatted as stable strings: React's server HTML rounds
    style floats during serialization, so full-precision doubles would
    trigger hydration-mismatch warnings. */
function depthStyle(o: LogoOrbit, angleDeg: number, k: DepthKnobs) {
  const p = project(angleDeg, k.tilt, o.a, o.b, k.bMax);
  const scale = k.depthOn ? k.scaleMin + (k.scaleMax - k.scaleMin) * p.depth : 1;
  const opacity = k.depthOn ? k.opacityFloor + (1 - k.opacityFloor) * p.depth : 1;
  const shadowAlpha = k.depthOn ? 0.1 + 0.22 * p.depth : 0.18;
  return {
    ...p,
    left: `${(50 + p.X * 100).toFixed(4)}%`,
    top: `${(50 + p.Y * 100).toFixed(4)}%`,
    transform: `translate(-50%, -50%) scale(${scale.toFixed(4)})`,
    opacity: opacity.toFixed(3),
    z: Math.round(p.depth * 100),
    shadowAlpha: shadowAlpha.toFixed(3),
  };
}

/* Nodes along the orbit paths: { layer, angle, hollow }. Sparse on purpose. */
const DOT_SPECS = [
  { l: 0, a: 15,  hollow: true },
  { l: 0, a: 100, hollow: false },
  { l: 0, a: 212, hollow: false },
  { l: 0, a: 298, hollow: true },
  { l: 1, a: 62,  hollow: false },
  { l: 1, a: 168, hollow: true },
  { l: 1, a: 255, hollow: false },
  { l: 2, a: 130, hollow: false },
  { l: 2, a: 330, hollow: true },
];

/* ── Headline font ───────────────────────────────────────────────────────────
   Manrope is the chosen face. The other two are kept as ready alternates —
   switch HEADLINE_FONT at the top of this file to try one; all three are
   already loaded in app/layout.tsx. */

type FontKey = "grotesk" | "serif" | "manrope";

const HEADLINE_FONTS: Record<
  FontKey,
  { className: string; style: CSSProperties }
> = {
  grotesk: {
    className: "font-bold tracking-[-0.02em] leading-[1.05]",
    style: {
      fontFamily: "var(--font-grotesk)",
      fontSize: "clamp(2.5rem, 4.6vw, 3.9rem)",
    },
  },
  serif: {
    className: "font-normal tracking-[-0.005em] leading-[1.03]",
    style: {
      fontFamily: "var(--font-serif)",
      fontSize: "clamp(2.8rem, 5.2vw, 4.5rem)",
    },
  },
  manrope: {
    className: "font-extrabold tracking-[-0.025em] leading-[1.06]",
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "clamp(2.45rem, 4.5vw, 3.8rem)",
    },
  },
};

/* ────────────────────────────────────────────────────────────────────────── */

export default function Hero() {
  /* Settings are finalized — every value below is a module constant at the top
     of this file. The live tuning panel that produced them has been removed. */
  const font = HEADLINE_FONT;
  const tiles = SHOW_TILES;
  const spin = SLOW_ROTATION;
  const tilt = TILT_DEG;
  const depthOn = DEPTH_SCALING;
  const ringsOn = ORBIT_RINGS;
  const dotsOn = DOTS_AND_LINES;
  const cueOn = SCROLL_CUE;
  const rx = RX_FRAC;
  const ry = RY_FRAC;
  const yOff = CENTER_OFFSET_PCT;
  const layers = LAYER_COUNT;
  const scaleMin = SCALE_MIN;
  const scaleMax = SCALE_MAX;
  const opacityFloor = OPACITY_FLOOR;

  const layout = buildLayout(layers, rx, ry);
  const knobs: DepthKnobs = {
    tilt,
    depthOn,
    scaleMin,
    scaleMax,
    opacityFloor,
    bMax: ry * Math.max(...LAYER_PRESETS[layers].map((p) => p.b)),
  };

  /* Orbit phase lives in a ref so the rAF loop owns it without re-rendering;
     React renders read it so toggles never snap logos back to their start. */
  const phaseRef = useRef(0);
  const layoutRef = useRef(layout);
  const knobsRef = useRef(knobs);
  layoutRef.current = layout;
  knobsRef.current = knobs;

  const logoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);

  useEffect(() => {
    if (!spin) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const paint = () => {
      const lay = layoutRef.current;
      const k = knobsRef.current;
      const pts = lay.per.map((o) =>
        depthStyle(o, o.angle0 + phaseRef.current * o.speed, k),
      );
      pts.forEach((s, i) => {
        const el = logoRefs.current[i];
        if (!el) return;
        el.style.left = s.left;
        el.style.top = s.top;
        el.style.transform = s.transform;
        el.style.opacity = s.opacity;
        el.style.zIndex = `${s.z}`;
        el.style.setProperty("--tile-shadow-a", s.shadowAlpha);
      });
      lay.chords.forEach(([a, b], ci) => {
        const line = lineRefs.current[ci];
        if (!line) return;
        line.setAttribute("x1", (500 + pts[a].X * 1000).toFixed(2));
        line.setAttribute("y1", (500 + pts[a].Y * 1000).toFixed(2));
        line.setAttribute("x2", (500 + pts[b].X * 1000).toFixed(2));
        line.setAttribute("y2", (500 + pts[b].Y * 1000).toFixed(2));
        const mid = (pts[a].depth + pts[b].depth) / 2;
        line.setAttribute("stroke-opacity", (0.06 + 0.1 * mid).toFixed(3));
      });
    };

    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      phaseRef.current =
        (phaseRef.current + ((now - last) / 1000) * (360 / ORBIT_SECONDS)) % 360;
      last = now;
      paint();
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [spin]);

  const headline = HEADLINE_FONTS[font];

  /* Static positions for SSR / reduced motion / spin off — same math the
     rAF loop uses, at the current phase. */
  const staticPts = layout.per.map((o) =>
    depthStyle(o, o.angle0 + phaseRef.current * o.speed, knobs),
  );

  /* Both orbit containers share this shift so the CSS 3D rings and the
     JS-projected logos move together and stay in register. */
  const centerShift: CSSProperties = {
    transform: `translateY(calc(var(--plane-s) * ${yOff / 100}))`,
  };

  return (
    <section
      style={
        {
          "--accent": ACCENT,
          "--plane-s": PLANE_SIZE,
        } as CSSProperties
      }
      className="relative flex min-h-screen flex-col overflow-hidden bg-white text-[#0A0A0A]"
    >
      {/* ── Top bar ── */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10">
        <a href="/" className="text-[15px] font-medium tracking-[-0.01em]">
          Juan Paulo Mariano
        </a>
        <div className="flex items-center gap-7">
          {/* Every link resolves to a real section id. "About" used to link to
              an id that never existed, while the two showcase sections had no
              nav entry at all — the inverse of what a visitor needs. */}
          <nav className="hidden items-center gap-7 sm:flex" aria-label="Primary">
            <a href="#work" className="nav-link text-[13.5px] text-[#444444] transition-colors duration-200 hover:text-[#0A0A0A]">
              Work
            </a>
            {/* Voice and chat are named by their surface, not both as "AI":
                once the page carries two conversation sections, one generic
                label sends the visitor to the wrong one. */}
            <a href="#ai" className="nav-link text-[13.5px] text-[#444444] transition-colors duration-200 hover:text-[#0A0A0A]">
              Voice AI
            </a>
            <a href="#chat" className="nav-link text-[13.5px] text-[#444444] transition-colors duration-200 hover:text-[#0A0A0A]">
              Chat AI
            </a>
            <a href="#whitelabel" className="nav-link text-[13.5px] text-[#444444] transition-colors duration-200 hover:text-[#0A0A0A]">
              White-label
            </a>
            <a href="#contact" className="nav-link text-[13.5px] text-[#444444] transition-colors duration-200 hover:text-[#0A0A0A]">
              Contact
            </a>
          </nav>
          <a
            href="#contact"
            className="rounded-full bg-[#0A0A0A] px-4 py-1.5 text-[13.5px] font-medium text-white transition-colors duration-300 hover:bg-[var(--accent)]"
          >
            Book a call
          </a>
        </div>
      </header>

      {/* ── Stage: center block + orbital system share this container's center ── */}
      <div className="relative flex flex-1 items-center justify-center">
        {/* One tilted 3D plane: rings + dots render inside a real CSS
            perspective/rotateX context and get true foreshortening. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 hidden items-center justify-center lg:flex"
          style={{ perspective: `calc(var(--plane-s) * ${PERSP_FRAC})`, ...centerShift }}
        >
          <div
            style={{
              width: "var(--plane-s)",
              height: "var(--plane-s)",
              transform: `rotateX(${tilt}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <svg viewBox="0 0 1000 1000" className="h-full w-full overflow-visible">
              {ringsOn && (
                <>
                  {layout.paths.map((p, li) => (
                    <ellipse
                      key={`path-${li}`}
                      cx={500}
                      cy={500}
                      rx={1000 * p.a}
                      ry={1000 * p.b}
                      fill="none"
                      stroke="#7A7A7A"
                      strokeWidth={li === 0 ? 1.3 : 1}
                      opacity={li === 0 ? 0.12 : 0.09}
                    />
                  ))}
                  {/* one ambient outer whisper beyond the logo orbits */}
                  <ellipse
                    cx={500}
                    cy={500}
                    rx={1000 * rx * 1.12}
                    ry={1000 * ry * 1.12}
                    fill="none"
                    stroke="#7A7A7A"
                    strokeWidth={1}
                    opacity={0.05}
                  />
                </>
              )}
              {dotsOn &&
                DOT_SPECS.filter((d) => d.l < layers).map((d) => {
                  const th = (d.a * Math.PI) / 180;
                  const path = layout.paths[d.l];
                  const depth = (Math.sin(th) + 1) / 2;
                  return (
                    <circle
                      key={`${d.l}-${d.a}`}
                      cx={500 + 1000 * path.a * Math.cos(th)}
                      cy={500 + 1000 * path.b * Math.sin(th)}
                      r={d.hollow ? 4 : 3}
                      fill={d.hollow ? "#FFFFFF" : "#8A8A8A"}
                      stroke={d.hollow ? "#8A8A8A" : "none"}
                      strokeWidth={d.hollow ? 1.2 : 0}
                      opacity={0.1 + 0.22 * depth}
                    />
                  );
                })}
            </svg>
          </div>
        </div>

        {/* Flat overlay, same box as the plane: logos + connectors positioned by
            the identical projection, so they sit exactly on the rings above. */}
        <div
          className="pointer-events-none absolute inset-0 z-0 hidden items-center justify-center lg:flex"
          style={centerShift}
        >
          <div
            className="relative"
            style={{ width: "var(--plane-s)", height: "var(--plane-s)" }}
          >
            {dotsOn && (
              <svg
                aria-hidden="true"
                viewBox="0 0 1000 1000"
                className="absolute inset-0 h-full w-full overflow-visible"
              >
                {layout.chords.map(([a, b], ci) => (
                  <line
                    key={ci}
                    ref={(el) => {
                      lineRefs.current[ci] = el;
                    }}
                    x1={(500 + staticPts[a].X * 1000).toFixed(2)}
                    y1={(500 + staticPts[a].Y * 1000).toFixed(2)}
                    x2={(500 + staticPts[b].X * 1000).toFixed(2)}
                    y2={(500 + staticPts[b].Y * 1000).toFixed(2)}
                    stroke="#7A7A7A"
                    strokeWidth={1}
                    strokeOpacity={(
                      0.06 +
                      0.1 * ((staticPts[a].depth + staticPts[b].depth) / 2)
                    ).toFixed(3)}
                  />
                ))}
              </svg>
            )}

            {LOGOS.map((logo, i) => (
              <div
                key={logo.label}
                ref={(el) => {
                  logoRefs.current[i] = el;
                }}
                className="absolute"
                style={
                  {
                    left: staticPts[i].left,
                    top: staticPts[i].top,
                    transform: staticPts[i].transform,
                    opacity: staticPts[i].opacity,
                    zIndex: staticPts[i].z,
                    "--tile-shadow-a": staticPts[i].shadowAlpha,
                  } as CSSProperties
                }
              >
                <div
                  className="assemble"
                  style={{ "--assemble-delay": `${100 + i * 50}ms` } as CSSProperties}
                >
                  <div
                    className={`group pointer-events-auto relative flex items-center justify-center transition-[transform,background-color,border-color] duration-200 ease-out hover:scale-[1.08] ${
                      tiles
                        ? "rounded-xl border border-black/10 bg-white hover:border-black/20"
                        : ""
                    }`}
                    style={
                      tiles
                        ? {
                            width: TILE_PX,
                            height: TILE_PX,
                            boxShadow:
                              "0 20px 40px -16px rgba(10,10,10,var(--tile-shadow-a,0.18)), 0 2px 8px -2px rgba(10,10,10,0.06)",
                          }
                        : undefined
                    }
                  >
                    <img
                      src={logo.src}
                      alt={logo.label}
                      width={Math.round(logo.size * MARK_SCALE)}
                      style={{
                        width: Math.round(logo.size * MARK_SCALE),
                        height: "auto",
                      }}
                      draggable={false}
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0A0A0A] px-2 py-1 text-[11px] leading-none text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    >
                      {logo.label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center block. `hero-enter` staggers the four children below on
            mount (eyebrow → h1 → dek → CTAs); the logo displays are NOT
            tagged — the mobile row already enters via `.assemble` and the
            desktop orbit is its own animated system, and one entrance per
            element is the kit's law. */}
        <div className="hero-enter relative z-10 flex flex-col items-center px-6 py-16 text-center">
          <p
            data-hero
            style={{ "--i": 0 } as CSSProperties}
            className="text-[12px] tracking-[0.14em] text-[#5E5E5E]"
          >
            GoHighLevel · Automation · Custom builds
          </p>

          <h1
            data-hero
            className={`mt-5 max-w-[14em] text-balance ${headline.className}`}
            style={{ ...headline.style, "--i": 1 } as CSSProperties}
          >
            Your best client keeps asking for things GoHighLevel{" "}
            <em
              className={font === "serif" ? "italic" : "not-italic"}
              style={{ color: "var(--accent)" }}
            >
              can’t do
            </em>
            .
          </h1>

          {/* body role (14.5px/1.75) — was a one-off 15px/1.7, which put the
              hero's dek half a pixel away from every other paragraph on the
              page for no reason. */}
          <p
            data-hero
            style={{ "--i": 2 } as CSSProperties}
            className="mt-6 max-w-[34em] text-[14.5px] leading-[1.75] text-[#444444]"
          >
            I build the CRM, the automation, and the custom code for when the
            platform runs out. Under your brand, handed off clean. That’s the
            short version — the rest is in the work.
          </p>

          <div
            data-hero
            style={{ "--i": 3 } as CSSProperties}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="#contact"
              className="rounded-full bg-[#0A0A0A] px-6 py-3 text-[13.5px] font-medium text-white transition-colors duration-300 hover:bg-[var(--accent)]"
            >
              Send me a client build
            </a>
            <a
              href="#work"
              className="rounded-full border-[0.5px] border-black/20 px-6 py-3 text-[13.5px] font-medium text-[#0A0A0A] transition-colors duration-300 hover:border-black/45 hover:bg-black/[0.03]"
            >
              See my work
            </a>
          </div>

          {/* Mobile: the orbit collapses into a wrapped logo row — no 3D */}
          <div className="mt-14 flex max-w-[24rem] flex-wrap items-center justify-center gap-x-8 gap-y-6 lg:hidden">
            {LOGOS.map((logo, i) => (
              <div
                key={logo.label}
                className="assemble"
                style={{ "--assemble-delay": `${100 + i * 50}ms` } as CSSProperties}
              >
                <img
                  src={logo.src}
                  alt={logo.label}
                  title={logo.label}
                  width={Math.round(logo.size * 0.72)}
                  style={{ width: Math.round(logo.size * 0.72), height: "auto" }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue. The visual is the kit's rail-and-tick (a tick drifting
            down a hairline), replacing the mouse outline + cue-wheel — the
            label is untouched. Same footprint, still the page's one quiet
            loop. */}
        {cueOn && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-[5] hidden -translate-x-1/2 flex-col items-center gap-2.5 lg:flex">
            <div className="scroll-rail">
              <div className="scroll-tick" />
            </div>
            <span className="text-[10px] uppercase leading-none tracking-[0.22em] text-[#9C9C9C]">
              scroll to explore
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
