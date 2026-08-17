import type { Metadata } from "next";
import { Instrument_Serif, Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

/* `metadataBase` is required for the generated opengraph-image to resolve to
   an absolute URL. Without it Next emits a relative path and every social
   platform silently drops the preview. */
export const metadata: Metadata = {
  metadataBase: new URL("https://juanpaulomariano.com"),
  title: "Juan Paulo Mariano — GoHighLevel automation architect",
  description:
    "CRM, automation, and custom code for when the platform runs out. Built under your brand, handed off clean.",
  openGraph: {
    title: "Juan Paulo Mariano — GoHighLevel automation architect",
    description:
      "CRM, automation, and custom code for when the platform runs out. Built under your brand, handed off clean.",
    url: "https://juanpaulomariano.com",
    siteName: "Juan Paulo Mariano",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Juan Paulo Mariano — GoHighLevel automation architect",
    description:
      "CRM, automation, and custom code for when the platform runs out. Built under your brand, handed off clean.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${spaceGrotesk.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body style={{ fontFamily: "var(--font-sans)" }}>{children}</body>
    </html>
  );
}
