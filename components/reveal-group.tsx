"use client";

import type { ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";

/* ────────────────────────────────────────────────────────────────────────────
   RevealGroup — the smallest possible client leaf for the blueprint scroll
   reveals. A server-rendered section wraps its animated block in this instead
   of becoming a client component itself: children pass through as a slot, so
   they stay RSC — only this div hydrates.
──────────────────────────────────────────────────────────────────────────── */
export default function RevealGroup({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const reveal = useReveal<HTMLDivElement>();
  return (
    <div ref={reveal} className={className}>
      {children}
    </div>
  );
}
