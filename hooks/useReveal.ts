"use client";

import { useCallback, useRef } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   useReveal — arms a container for the blueprint-motion scroll reveals.

   Contract (see blueprint-motion.css and IMPLEMENTATION.md):
   - The returned callback ref goes on the container that owns [data-reveal]
     children. The hook adds `.reveal` + `.reveal-armed` on mount, then
     `.is-revealed` on FIRST intersection, then disconnects. Reveals never
     re-trigger on scroll-up.
   - Arming happens in the ref callback (before paint), so there is no flash
     of visible-then-hidden content; and because the hidden CSS state is gated
     on `.reveal-armed`, a JS failure leaves the page fully visible.
   - Client components call it directly. A server-rendered section wraps only
     its animated block in a small client leaf that calls this — never convert
     a whole section to a client component for motion.
──────────────────────────────────────────────────────────────────────────── */
export function useReveal<T extends HTMLElement = HTMLElement>(
  threshold = 0.2,
) {
  const io = useRef<IntersectionObserver | null>(null);

  return useCallback(
    (node: T | null) => {
      io.current?.disconnect();
      io.current = null;
      if (!node) return;

      node.classList.add("reveal", "reveal-armed");

      /* Slight negative bottom margin so a sliver of a section peeking over
         the fold does not fire the reveal before anyone can see it. */
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            node.classList.add("is-revealed");
            observer.disconnect();
            io.current = null;
          }
        },
        { threshold, rootMargin: "0px 0px -10% 0px" },
      );
      observer.observe(node);
      io.current = observer;
    },
    [threshold],
  );
}
