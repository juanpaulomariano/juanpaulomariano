import { TOKENS, TYPE, TYPE_STYLE } from "@/lib/tokens";

/* ────────────────────────────────────────────────────────────────────────────
   Final CTA — the page returns to air after the dark work section and the
   product demo. Deliberately the quietest section on the page: one line, one
   sentence, two links. Nothing here exists to fill space.
──────────────────────────────────────────────────────────────────────────── */

export default function FinalCta() {
  return (
    <section
      id="contact"
      className="px-6 py-20 sm:px-10 sm:py-24"
      style={{ background: TOKENS.white }}
    >
      <div className="mx-auto max-w-[1320px]">
        <div
          className="border-t pt-5"
          style={{ borderColor: TOKENS.ink }}
        >
          {/* Numeral only, like every other section. The "Contact" eyebrow is
              gone: the headline and the two links below say what this is. */}
          <div className="flex justify-end">
            <span
              className="tabular-nums tracking-[0.2em]"
              style={{
                color: TOKENS.muted,
                fontSize: TYPE.micro,
                ...TYPE_STYLE.micro,
              }}
            >
              06
            </span>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-[44rem] text-center sm:mt-16">
          <h2
            className="mx-auto max-w-[15em] text-balance"
            style={{
              fontFamily: "var(--font-grotesk)",
              color: TOKENS.ink,
              fontSize: TYPE.section,
              ...TYPE_STYLE.section,
            }}
          >
            Tell me what the platform can&apos;t do yet.
          </h2>
          <p
            className="mx-auto mt-6 max-w-[42ch]"
            style={{ color: TOKENS.muted, fontSize: TYPE.body, ...TYPE_STYLE.body }}
          >
            If you have a client build that runs past what GoHighLevel does out
            of the box, send me the shape of it. I&apos;ll tell you straight
            whether it&apos;s worth building.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:paumirasol800@gmail.com"
              className="rounded-full bg-[#0A0A0A] px-6 py-3 text-[13.5px] font-medium text-white transition-colors duration-300 hover:bg-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ "--accent": TOKENS.accent } as React.CSSProperties}
            >
              Send me a client build
            </a>
            <a
              href="#work"
              className="rounded-full border-[0.5px] px-6 py-3 text-[13.5px] font-medium transition-colors duration-300 hover:bg-black/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ borderColor: "rgba(0,0,0,0.2)", color: TOKENS.ink }}
            >
              See the work again
            </a>
          </div>
        </div>

        {/* Footer line. One rule, one row, nothing decorative. */}
        <div
          className="mt-20 flex flex-col items-center justify-between gap-3 border-t pt-6 text-[11px] sm:mt-24 sm:flex-row"
          style={{ borderColor: TOKENS.hair, color: TOKENS.muted }}
        >
          <span>Juan Paulo Mariano</span>
          <span className="flex items-center gap-4">
            <span>GoHighLevel automation architect · Full-stack developer</span>
            {/* Section 04 sends visitor input to a third party, so where it
                goes has to be reachable from every page. */}
            <a
              href="/privacy"
              className="border-b pb-px transition-colors duration-200 hover:border-[#C0392B] hover:text-[#C0392B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ borderColor: TOKENS.line }}
            >
              Privacy
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
