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
  /** Number of workflows, when it differs from the screenshot count (some
      workflows span several canvases). Shown as context in the header so
      "12 / 23 canvases" never appears to contradict "20 workflows". */
  unitLabel?: string;
};

export default function GalleryLightbox({
  open,
  onClose,
  shots,
  title,
  startIndex = 0,
  unitLabel = "",
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
      subtitle={`${i + 1} / ${shots.length}${unitLabel ? ` ${unitLabel}` : ""}`}
    >
      <div className="relative">
        {/* Two viewing modes:
            FIT  — whole canvas, scaled down to the viewport (orientation)
            100% — native pixels in a scrollable pane (reading node labels)
            These screenshots are ~2560x1400 with small type, so a fit-to-screen
            view alone is never legible. Zoom is the point, not a nicety. */}
        {/* Not a flex container when zoomed: a flex item shrinks to fit even
            with max-w-none, which silently caps the image below 100%. */}
        <div
          className={zoomed ? "overflow-auto" : "flex items-center justify-center"}
          style={{
            background: TOKENS.warm,
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
                  : "max-h-[min(78vh,780px)] w-auto max-w-full object-contain"
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
            className="absolute right-3 top-3 rounded-full border bg-white/95 px-3 py-1.5 text-[12px] transition-colors duration-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
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
        className="flex items-center justify-between gap-4 border-t px-4 py-3"
        style={{ borderColor: TOKENS.line, background: "#FFFFFF" }}
      >
        <p className="min-w-0 text-[13px]" style={{ color: TOKENS.muted }}>
          {shot?.caption ?? " "}
        </p>
        <p
          className="shrink-0 text-[12px] tabular-nums"
          style={{ color: TOKENS.muted }}
        >
          {i + 1} / {shots.length}
          {unitLabel ? ` ${unitLabel}` : ""}
        </p>
      </div>

      {/* Thumbnail rail */}
      <div
        ref={railRef}
        className="flex gap-2 overflow-x-auto border-t px-3 py-3"
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
              background: TOKENS.warm,
            }}
          >
            {s.src ? (
              <img
                src={s.src}
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
      className={`absolute top-1/2 -translate-y-1/2 rounded-full border bg-white/90 px-3 py-2 text-[14px] transition-colors duration-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
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
      style={{ background: "#EFEBE4" }}
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
