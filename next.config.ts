import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* The dev-only overlay badge sits over the page's lower-left corner and
     reads as a stray UI element while reviewing the design. It never ships to
     production; this just keeps the local view honest. */
  devIndicators: false,
};

export default nextConfig;
