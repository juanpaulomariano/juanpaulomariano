"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Modal from "@/components/modal";
import { TOKENS } from "@/lib/tokens";

/* Mux Player is code-split and only requested when the modal opens, so it
   never competes with the hero for LCP. `ssr: false` keeps it out of the
   server bundle — it's a web component and needs the DOM. */
const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
  ssr: false,
  loading: () => <Spinner />,
});

type Props = {
  open: boolean;
  onClose: () => void;
  playbackId: string;
  posterSrc: string;
  posterTime: number;
  title: string;
};

/** Mux's auto-generated thumbnail, used when no posterSrc is supplied. */
export function muxPoster(playbackId: string, time: number) {
  if (!playbackId) return "";
  return `https://image.mux.com/${playbackId}/thumbnail.jpg?width=1280&time=${time}`;
}

export default function VideoModal({
  open,
  onClose,
  playbackId,
  posterSrc,
  posterTime,
  title,
}: Props) {
  const [errored, setErrored] = useState(false);
  const poster = posterSrc || muxPoster(playbackId, posterTime);

  return (
    <Modal open={open} onClose={onClose} title={title} variant="media">
      <div className="relative aspect-video w-full bg-black">
        {!playbackId ? (
          <Notice
            heading="Video not configured yet"
            body="Add a Mux playback ID to lib/works.ts to enable playback."
          />
        ) : errored ? (
          <Notice
            heading="This video couldn't load"
            body="The stream is unavailable right now. Close this and try again in a moment."
          />
        ) : (
          <MuxPlayer
            streamType="on-demand"
            playbackId={playbackId}
            poster={poster || undefined}
            metadata={{ video_title: "PSD Limo — walkthrough" }}
            autoPlay
            onError={() => setErrored(true)}
            style={{ height: "100%", width: "100%" }}
          />
        )}
      </div>
    </Modal>
  );
}

function Spinner() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-black">
      <div
        className="h-7 w-7 animate-spin rounded-full border-2 border-white/25"
        style={{ borderTopColor: "#FFFFFF" }}
      />
    </div>
  );
}

/* Error / unconfigured state: readable message on a white surface rather
   than an unexplained black box. The modal stays fully usable. */
function Notice({ heading, body }: { heading: string; body: string }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2 px-8 text-center"
      style={{ background: TOKENS.white }}
    >
      <p className="text-[15px] font-medium" style={{ color: TOKENS.ink }}>
        {heading}
      </p>
      <p className="max-w-[36em] text-[13px]" style={{ color: TOKENS.muted }}>
        {body}
      </p>
    </div>
  );
}
