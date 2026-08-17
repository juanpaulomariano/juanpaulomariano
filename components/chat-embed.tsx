"use client";

import { useEffect, useRef } from "react";
import { CHAT_EMBED } from "@/lib/chat";

/* ────────────────────────────────────────────────────────────────────────────
   The GoHighLevel chat widget's script injection, and nothing else.

   Isolated in its own module for two reasons. The parent (chat-stage) owns
   POLICY — enabled, capped, failed — and stays testable with this absent.
   And this is the only place in the codebase that appends a third-party
   script, so when GHL changes its loader shape exactly one file moves.

   NOT next/script: we need a watchdog it cannot give us. A loader that
   returns 200 with an empty body (wrong widget id, unpublished widget, GHL
   outage) fires neither onload-failure nor onerror, and the panel would sit
   on "Loading" forever. The poll below resolves the moment the widget
   actually exists, and the timer fails it if it never does.

   NO TEARDOWN, DELIBERATELY. GoHighLevel documents no destroy method; the
   loader registers globals and a custom element that cannot be
   un-registered. Cleanup here clears the two timers and NOTHING ELSE.
   Anyone who later "adds proper cleanup" by removing the script or the
   element will produce a half-mounted widget with orphaned globals, which is
   worse than leaving it. The parent never unmounts this component; it mounts
   once per page load and stays.
──────────────────────────────────────────────────────────────────────────── */

/** How long to wait for the widget to paint before calling it failed. Long
    enough for a cold CDN fetch on a slow connection, short enough that a
    visitor has not concluded the page is broken. */
const WATCHDOG_MS = 6000;

/* Module scope, not a ref: React remounts this component (StrictMode in
   development, and any future re-render of the parent), and a per-instance
   ref would let the loader be appended twice. The script is a page-level
   side effect, so its guard belongs at page level. */
let loaderAppended = false;

/* Every page load starts a fresh conversation.

   The widget persists its session and transcript in localStorage, so a
   returning visitor would land on their old ended chat with a "fetch older
   conversations" link above it. On a portfolio that is wrong twice: the
   section is a demonstration a visitor should be able to run from the top,
   and a shared machine would show one person's conversation to the next.

   The keys are written by GoHighLevel and are not documented, so this
   matches on their observed shape (a v2_/v3_ prefix, or the location id in
   the key) rather than a fixed list, and a rename on their side degrades to
   the old behaviour instead of throwing. Wrapped because storage access
   throws outright in Safari's private mode. */
function clearWidgetSession() {
  /* Match the widget's own keys only — never clear() — so anything this site
     stores is untouched. Observed shapes:
       v2_session_history_<locationId>
       v2_history_<locationId>
       v2_contact_session_<locationId>_session_id
       v3_first_session_event_<locationId>
       <locationId>_<widgetId>_request_token   (sessionStorage) */
  const mine = (key: string) =>
    /^v\d+_/.test(key) || key.includes(CHAT_EMBED.widgetId);

  for (const store of [window.localStorage, window.sessionStorage]) {
    try {
      for (const key of Object.keys(store)) {
        if (mine(key)) store.removeItem(key);
      }
    } catch {
      /* Storage throws outright in Safari private mode. A stale session is a
         cosmetic problem, not a broken one, so there is nothing to recover. */
    }
  }
}

type Props = {
  /** Reports "ready" once the widget paints, "failed" on error or timeout. */
  onStatus: (status: "ready" | "failed") => void;
};

export default function ChatEmbed({ onStatus }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    let pollRef: ReturnType<typeof setInterval> | null = null;
    let settled = false;

    const settle = (status: "ready" | "failed") => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      if (pollRef) clearInterval(pollRef);
      onStatus(status);
    };

    /* GHL's loader does NOT mount into a container you provide. It creates a
       <chat-widget> element and appends it to document.body, wherever that
       lands on the page — verified by inspecting the DOM after load. So the
       job here is to wait for that element to appear and then adopt it into
       this panel.

       Moving a live custom element is safe: appendChild relocates the node
       without re-running its constructor, and the widget keeps its shadow
       root, its state, and any open conversation. */
    const adopt = (el: HTMLElement) => {
      el.style.width = "100%";
      el.style.height = "100%";
      host.appendChild(el);
      settle("ready");
    };

    /* Polling rather than a MutationObserver on body: the loader defines a
       custom element and upgrades it asynchronously, and observing body's
       direct children missed it in testing. A cheap interval is the reliable
       way to catch it however GHL chooses to inject it. */
    const poll = setInterval(() => {
      const el = document.querySelector<HTMLElement>("chat-widget");
      if (el && !host.contains(el)) {
        clearInterval(poll);
        adopt(el);
      }
    }, 120);
    pollRef = poll;

    /* The script is appended ONCE per page load. The guard lives here rather
       than at the top of the effect because StrictMode remounts this
       component: the effect must be free to run again (so the poll restarts
       after its cleanup), while the loader must not be added twice. */
    if (!loaderAppended) {
      loaderAppended = true;
      clearWidgetSession();
      const script = document.createElement("script");
      script.src = CHAT_EMBED.loaderSrc;
      script.setAttribute("data-resources-url", CHAT_EMBED.resourcesSrc);
      script.setAttribute("data-widget-id", CHAT_EMBED.widgetId);
      script.async = true;
      script.onerror = () => settle("failed");
      document.body.appendChild(script);
    }

    /* Loaded is not painted, and the poll is what proves it painted, so the
       watchdog runs from mount rather than from the script's onload. */
    timer = setTimeout(() => settle("failed"), WATCHDOG_MS);

    return () => {
      /* Timers only, never the script or the element. See the header. */
      if (timer) clearTimeout(timer);
      if (pollRef) clearInterval(pollRef);
    };
  }, [onStatus]);

  return <div ref={hostRef} className="h-full w-full" />;
}
