"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Modal from "@/components/modal";
import { TOKENS } from "@/lib/tokens";
import type { Shot } from "@/lib/works";

/* Full gallery viewer. Mounted only while open (the parent unmounts it on
   close), so none of the images are requested during page render. The large
   image loads eagerly once it IS the current slide; neighbours are prefetched
   one step ahead so arrowing feels instant without loading all N up front. */

type Props = {
  open: boolean;
  onClose: () => void;
  shots: Shot[];
  title: string;
  startIndex?: number;
};

export default function GalleryLightbox({
  open,
  onClose,
  shots,
  title,
  startIndex = 0,
}: Props) {
  const [i, setI] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setI(startIndex);
  }, [open, startIndex]);

  /* Changing image resets to fit view — otherwise you land mid-canvas on a
     zoomed pane with no idea where you are. */
  useEffect(() => setZoomed(false), [i]);

  const go = useCallback(
    (dir: -1 | 1) => setI((v) => (v + dir + shots.length) % shots.length),
    [shots.length],
  );

  /* Keep the active thumbnail in view as the user arrows through. */
  useEffect(() => {
    if (!open) return;
    const el = railRef.current?.querySelector<HTMLElement>(`[data-idx="${i}"]`);
    el?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [i, open]);

  if (!open) return null;

  const shot = shots[i];
  /* Count workflows, not canvases: a workflow that spans several screenshots
     is one workflow, so "4 / 20" agrees with the "See all 20 workflows"
     button instead of quietly reporting a larger file count. */
  const total = shots.filter((s) => !s.continuation).length;
  const position = shots.slice(0, i + 1).filter((s) => !s.continuation).length;
  /* Prefetch the immediate neighbours only. */
  const near = new Set([
    i,
    (i + 1) % shots.length,
    (i - 1 + shots.length) % shots.length,
  ]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      onArrow={go}
      variant="gallery"
      title={title}
      subtitle={`${position} / ${total}`}
    >
      {/* min-h-0 down this chain lets the image pane absorb a short viewport
          so the caption and thumbnail rail stay visible; before this the pane
          held its full height and pushed them past the fold at 1440x900. */}
      <div className="relative flex min-h-0 flex-col">
        {/* Two viewing modes:
            FIT  — whole canvas, scaled down to the viewport (orientation)
            100% — native pixels in a scrollable pane (reading node labels)
            These screenshots are ~2560x1400 with small type, so a fit-to-screen
            view alone is never legible. Zoom is the point, not a nicety. */}
        {/* Not a flex container when zoomed: a flex item shrinks to fit even
            with max-w-none, which silently caps the image below 100%. */}
        <div
          className={
            zoomed
              ? "min-h-0 overflow-auto overscroll-contain"
              : "flex min-h-0 items-center justify-center"
          }
          style={{
            background: TOKENS.white,
            height: "min(78vh, 780px)",
            cursor: shot?.src ? (zoomed ? "zoom-out" : "zoom-in") : "default",
          }}
          onClick={() => shot?.src && setZoomed((v) => !v)}
        >
          {shot?.src ? (
            <img
              key={shot.src}
              src={shot.src}
              alt={shot.caption ?? `${title} — workflow ${i + 1}`}
              className={
                zoomed
                  ? "block max-w-none"
                  : "max-h-full w-auto max-w-full object-contain"
              }
              /* Explicit width at 100% so nothing can scale it down. */
              style={zoomed ? { width: "auto" } : undefined}
              loading="eager"
              decoding="async"
            />
          ) : (
            <PlaceholderBox label={`Workflow ${i + 1}`} />
          )}
        </div>

        {shot?.src && (
          <button
            type="button"
            onClick={() => setZoomed((v) => !v)}
            className="absolute right-3 top-3 flex min-h-11 items-center rounded-full border bg-white/95 px-4 text-[12px] transition-colors duration-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ borderColor: TOKENS.line, color: TOKENS.ink }}
          >
            {zoomed ? "Fit to screen" : "Zoom to 100%"}
          </button>
        )}

        {/* Prefetch neighbours off-screen so arrowing is instant. */}
        <div aria-hidden="true" className="hidden">
          {shots.map((s, n) =>
            near.has(n) && s.src ? (
              <img key={s.src} src={s.src} alt="" loading="lazy" />
            ) : null,
          )}
        </div>

        <NavButton side="left" onClick={() => go(-1)} />
        <NavButton side="right" onClick={() => go(1)} />
      </div>

      {/* Caption + counter */}
      <div
        className="flex shrink-0 items-center justify-between gap-4 border-t px-4 py-3"
        style={{ borderColor: TOKENS.line, background: "#FFFFFF" }}
      >
        {/* The caption is what makes a deliberately zoomed-out canvas
            legible, so it gets real width and reading size. */}
        <div className="min-w-0">
          <p
            className="text-[11px] uppercase tracking-[0.16em]"
            style={{ color: TOKENS.ink }}
          >
            {shot?.label ?? " "}
          </p>
          <p
            className="mt-2 max-w-[70ch] text-[13.5px] leading-[1.7]"
            style={{ color: TOKENS.body }}
          >
            {shot?.caption ?? " "}
          </p>
        </div>
        <p
          className="shrink-0 text-[12px] tabular-nums"
          style={{ color: TOKENS.muted }}
        >
          {position} / {total}
        </p>
      </div>

      {/* Thumbnail rail */}
      <div
        ref={railRef}
        className="flex shrink-0 gap-2 overflow-x-auto overscroll-contain border-t px-3 py-3"
        style={{ borderColor: TOKENS.line, background: "#FFFFFF" }}
      >
        {shots.map((s, n) => (
          <button
            key={n}
            type="button"
            data-idx={n}
            onClick={() => setI(n)}
            aria-label={`Show workflow ${n + 1}`}
            aria-current={n === i}
            className="relative h-12 w-20 shrink-0 overflow-hidden rounded border transition-opacity duration-200"
            style={{
              borderColor: n === i ? TOKENS.accent : TOKENS.line,
              opacity: n === i ? 1 : 0.55,
              background: TOKENS.white,
            }}
          >
            {s.src ? (
              /* Rail uses the small copy where one exists — a 12x20px cell has
                 no use for a 300 KB lossless canvas. */
              <img
                src={s.previewSrc || s.src}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <span
                className="flex h-full w-full items-center justify-center text-[10px]"
                style={{ color: TOKENS.muted }}
              >
                {n + 1}
              </span>
            )}
          </button>
        ))}
      </div>
    </Modal>
  );
}

function NavButton({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous workflow" : "Next workflow"}
      className={`absolute top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border bg-white/90 px-3 text-[14px] transition-colors duration-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        side === "left" ? "left-3" : "right-3"
      }`}
      style={{ borderColor: TOKENS.line, color: TOKENS.ink }}
    >
      {side === "left" ? "←" : "→"}
    </button>
  );
}

function PlaceholderBox({ label }: { label: string }) {
  return (
    <div
      className="flex h-[min(70vh,620px)] w-full items-center justify-center"
      style={{ background: "#F4F4F4" }}
    >
      <span
        className="text-[13px] tracking-[0.08em] uppercase"
        style={{ color: TOKENS.muted }}
      >
        {label} — image pending
      </span>
    </div>
  );
}
