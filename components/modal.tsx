"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { TOKENS } from "@/lib/tokens";

/* ────────────────────────────────────────────────────────────────────────────
   One accessible modal, used by BOTH the video player and the gallery
   lightbox. Owns: focus trap, focus restore, Escape, backdrop click, body
   scroll lock, role="dialog" + aria-modal + aria-labelledby.

   Content-specific chrome (Mux player, image + arrows) is passed as children;
   `onArrow` lets the gallery take over ArrowLeft/ArrowRight without
   reimplementing any of the dialog mechanics.
──────────────────────────────────────────────────────────────────────────── */

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog. */
  title: string;
  /** Optional line rendered under the title region, visible to sighted users. */
  subtitle?: string;
  /** "media" = wide, video-shaped. "gallery" = full-bleed image viewer. */
  variant?: "media" | "gallery";
  /** Gallery keyboard navigation. */
  onArrow?: (dir: -1 | 1) => void;
  children: ReactNode;
};

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  variant = "media",
  onArrow,
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  /* Remember the trigger so focus can return to it on close. */
  useEffect(() => {
    if (open) restoreRef.current = document.activeElement as HTMLElement;
  }, [open]);

  /* Body scroll lock. Padding compensates for the scrollbar so the page
     behind doesn't shift horizontally when it disappears. */
  useEffect(() => {
    if (!open) return;
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open]);

  /* Move focus into the dialog on open; restore it on close. */
  useEffect(() => {
    if (!open) {
      restoreRef.current?.focus?.();
      return;
    }
    const id = requestAnimationFrame(() => closeRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (onArrow && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        e.preventDefault();
        onArrow(e.key === "ArrowLeft" ? -1 : 1);
        return;
      }
      if (e.key !== "Tab") return;

      /* Focus trap: cycle within the panel. */
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const list = Array.from(nodes).filter((n) => n.offsetParent !== null);
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || !panelRef.current?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onArrow, onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onKeyDown]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* Backdrop — click to dismiss. */}
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-[#0A0A0A]/70"
      />

      <div
        ref={panelRef}
        className={`relative flex w-full flex-col ${
          variant === "media" ? "max-w-5xl" : "max-w-6xl"
        }`}
      >
        <div className="mb-2.5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="truncate text-[14px] font-medium text-white"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 truncate text-[12px] text-white/60">
                {subtitle}
              </p>
            )}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-white/25 px-3 py-1 text-[12px] text-white transition-colors duration-200 hover:border-white/60 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Close
          </button>
        </div>

        <div
          className="overflow-hidden rounded-lg"
          style={{ background: variant === "media" ? "#000" : TOKENS.white }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
