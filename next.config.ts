import type { NextConfig } from "next";

/* Security headers, added when section 04 began loading a third-party script.

   These four are enforcing because none of them can break the chat widget:
   the widget has no business asking for a camera, a microphone, or a
   payment method, and denying those costs nothing.

   A Content-Security-Policy is NOT here on purpose. The widget pulls from
   several leadconnectorhq origins at runtime, plus Google Analytics and its
   own fonts, and none of that is documented. A guessed connect-src would
   break the live demo in production while working in development, which is
   the worst way to find out. The honest sequence is to observe real
   violations from a report-only policy first and promote it afterwards. */
const SECURITY_HEADERS = [
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
];

const nextConfig: NextConfig = {
  /* The dev-only overlay badge sits over the page's lower-left corner and
     reads as a stray UI element while reviewing the design. It never ships to
     production; this just keeps the local view honest. */
  devIndicators: false,

  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
