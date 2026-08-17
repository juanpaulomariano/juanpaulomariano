import { ImageResponse } from "next/og";

/* The social card. Generated from the page's own tokens rather than exported
   as a raster, so it cannot drift from the site the way a hand-made PNG does.

   Deliberately plain: the hairline rule, the numeral grammar, the single
   accent. A link preview is the first frame of the page, and a gradient-and-
   glow card would promise a different site than the one it opens. */

export const alt = "Juan Paulo Mariano — GoHighLevel automation architect";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* ImageResponse runs in an isolated renderer that cannot see the CSS
   variables `next/font` installs, so without this the card silently falls
   back to a system sans and stops looking like the site. The file is fetched
   at generation time and the result is cached by Next alongside the image.

   Failure here must not take the route down: a card in the fallback font is
   worse than the real thing but far better than a 500 and no preview at all,
   so the fetch is guarded and the font list simply goes empty. */
async function grotesk(weight: 500 | 700): Promise<ArrayBuffer | null> {
  const url =
    weight === 700
      ? "https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@latest/latin-700-normal.ttf"
      : "https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@latest/latin-500-normal.ttf";
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const [bold, medium] = await Promise.all([grotesk(700), grotesk(500)]);
  const fonts = [
    ...(bold
      ? [{ name: "Space Grotesk", data: bold, weight: 700 as const, style: "normal" as const }]
      : []),
    ...(medium
      ? [{ name: "Space Grotesk", data: medium, weight: 500 as const, style: "normal" as const }]
      : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: fonts.length ? "Space Grotesk" : "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderTop: "2px solid #0A0A0A",
            paddingTop: 22,
          }}
        >
          <div style={{ display: "flex", color: "#767676", fontSize: 22 }}>
            juanpaulomariano.com
          </div>
          <div style={{ display: "flex", color: "#767676", fontSize: 22 }}>
            GoHighLevel
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#767676",
              fontSize: 68,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
            }}
          >
            CRM and automation
          </div>
          <div
            style={{
              display: "flex",
              color: "#0A0A0A",
              fontSize: 68,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
            }}
          >
            for when the platform runs out.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              color: "#444444",
              fontSize: 27,
              lineHeight: 1.5,
            }}
          >
            Built under your brand, handed off clean.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", width: 54, height: 6, background: "#C0392B" }} />
          <div style={{ display: "flex", color: "#0A0A0A", fontSize: 26, fontWeight: 500 }}>
            Juan Paulo Mariano
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
