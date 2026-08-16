#!/usr/bin/env node
/* ────────────────────────────────────────────────────────────────────────────
   Write the GoHighLevel credentials to .env.local, prompting in the terminal.

   Run it yourself; never paste a token into a chat transcript:

     node scripts/set-ghl-env.mjs

   The token is read with echo OFF (nothing appears as you type, the way sudo
   behaves) and is written straight to .env.local, which .gitignore covers.
   Everything this script PRINTS is masked, so the value cannot leak through
   terminal output that a tool or a screenshot might capture.

   The location id is not a secret — it ships publicly in the chat widget
   snippet on the site — but it lives here too so both values sit in one place.

   Re-running updates only the keys you answer; press Enter to keep an existing
   value. Other keys in the file are preserved.
──────────────────────────────────────────────────────────────────────────── */

import { createInterface } from "node:readline";
import { readFileSync, writeFileSync, existsSync, chmodSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ENV_PATH = resolve(ROOT, ".env.local");

/** Mask a secret for display: first 4 and last 4, dots between. */
function mask(v) {
  if (!v) return "(empty)";
  if (v.length <= 12) return `${v.slice(0, 2)}${"·".repeat(6)}`;
  return `${v.slice(0, 4)}${"·".repeat(8)}${v.slice(-4)} (${v.length} chars)`;
}

/** Parse an existing .env file into a Map, preserving key order. */
function readEnv(path) {
  const out = new Map();
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out.set(m[1], m[2]);
  }
  return out;
}

/** Prompt with the terminal echo suppressed, so nothing is displayed. */
function askHidden(query) {
  return new Promise((res) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const onData = (char) => {
      // Redraw the prompt without the typed characters.
      const s = char.toString();
      if (s === "\n" || s === "\r" || s === "") {
        process.stdin.removeListener("data", onData);
        return;
      }
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(query);
    };
    process.stdin.on("data", onData);
    rl.question(query, (answer) => {
      rl.close();
      process.stdout.write("\n");
      res(answer.trim());
    });
  });
}

function askVisible(query) {
  return new Promise((res) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(query, (answer) => {
      rl.close();
      res(answer.trim());
    });
  });
}

const env = readEnv(ENV_PATH);

console.log("\nGoHighLevel credentials → .env.local");
console.log("Press Enter to keep an existing value.\n");

const currentLoc = env.get("GHL_LOCATION_ID") ?? "";
const loc = await askVisible(
  `  Sub-account (location) id${currentLoc ? ` [${currentLoc}]` : ""}: `,
);
if (loc) env.set("GHL_LOCATION_ID", loc);
else if (currentLoc) env.set("GHL_LOCATION_ID", currentLoc);

const currentTok = env.get("GHL_PIT_TOKEN") ?? "";
console.log(
  currentTok ? `  Current token: ${mask(currentTok)}` : "  No token stored yet.",
);
const tok = await askHidden("  Private Integration Token (hidden): ");
if (tok) env.set("GHL_PIT_TOKEN", tok);
else if (currentTok) env.set("GHL_PIT_TOKEN", currentTok);

const body =
  [...env.entries()].map(([k, v]) => `${k}=${v}`).join("\n") + "\n";
writeFileSync(ENV_PATH, body, { encoding: "utf8", mode: 0o600 });
try {
  chmodSync(ENV_PATH, 0o600);
} catch {
  /* Windows ignores POSIX modes; the gitignore rule is the real guard. */
}

console.log("\n  Wrote .env.local");
console.log(`    GHL_LOCATION_ID = ${env.get("GHL_LOCATION_ID") || "(empty)"}`);
console.log(`    GHL_PIT_TOKEN   = ${mask(env.get("GHL_PIT_TOKEN"))}`);
console.log("\n  .env.local is gitignored. Tell Claude you're done — do not");
console.log("  paste the token into the chat.\n");
