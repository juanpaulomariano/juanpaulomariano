import type { Metadata } from "next";
import { TOKENS, TYPE, TYPE_STYLE } from "@/lib/tokens";

/* ────────────────────────────────────────────────────────────────────────────
   Privacy.

   The site collected nothing until section 04 embedded a live chat agent.
   That widget is a third party that receives whatever a visitor types, so
   this page exists to say where the words go, in the same plain register the
   rest of the page uses about its own limitations.

   No section numeral: this is not part of the numbered argument.
──────────────────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Privacy · Juan Paulo Mariano",
  description:
    "What this site collects, what the chat agent sends to GoHighLevel and OpenAI, and how to have it deleted.",
};

const UPDATED = "17 August 2026";

function P({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mt-4 max-w-[68ch]"
      style={{ color: TOKENS.body, fontSize: TYPE.body, ...TYPE_STYLE.body }}
    >
      {children}
    </p>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mt-10"
      style={{
        fontFamily: "var(--font-grotesk)",
        color: TOKENS.ink,
        fontSize: TYPE.subsection,
        ...TYPE_STYLE.subsection,
      }}
    >
      {children}
    </h2>
  );
}

export default function Privacy() {
  return (
    <main className="px-6 py-20 sm:px-10 sm:py-24" style={{ background: TOKENS.white }}>
      <div className="mx-auto max-w-[1320px]">
        <div className="border-t pt-5" style={{ borderColor: TOKENS.ink }} />

        <div className="mt-10 max-w-[68ch]">
          <h1
            style={{
              fontFamily: "var(--font-grotesk)",
              color: TOKENS.ink,
              fontSize: TYPE.section,
              ...TYPE_STYLE.section,
            }}
          >
            Privacy
          </h1>
          <p
            className="mt-3"
            style={{
              color: TOKENS.muted,
              fontSize: TYPE.small,
              ...TYPE_STYLE.small,
            }}
          >
            Last updated {UPDATED}
          </p>

          <P>
            I set no cookies of my own, run no analytics of my own, and use no
            tracking pixels. There is one exception, and it is the chat agent
            below.
          </P>

          <H>The chat agent</H>
          <P>
            Section 04 embeds a live chat agent built on GoHighLevel. It does
            not load with the page: it loads when that section scrolls into
            view, so if you never reach it, nothing is ever requested and no
            third party knows you were here.
          </P>
          <P>
            Once it loads, your browser contacts GoHighLevel&apos;s servers, and
            their widget emits its own Google Analytics events. I cannot
            disable that from my side, so I am telling you instead. Anything
            you then type is sent to GoHighLevel and to OpenAI, which generates
            the replies.
          </P>
          <P>
            The name and email the widget asks for, along with anything you
            say in the conversation, become a contact record in a GoHighLevel
            sub-account I control. If you book an appointment, that booking is
            a real calendar record.
          </P>
          <P>
            Bright Hollow Family Dental is not a real dental practice. It is a
            demonstration I built to show what these systems do. No real
            appointment exists, nobody is waiting to treat you, and no one will
            contact you about it.
          </P>

          <H>The contact form</H>
          <P>
            Emails you send me come to me directly and go nowhere else. I do
            not add anyone to a mailing list, and there is no mailing list to
            add anyone to.
          </P>

          <H>Deleting your data</H>
          <P>
            Email{" "}
            <a
              href="mailto:contact@juanpaulomariano.com"
              className="border-b pb-px transition-colors duration-200 hover:border-[#C0392B] hover:text-[#C0392B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ color: TOKENS.ink, borderColor: TOKENS.ink }}
            >
              contact@juanpaulomariano.com
            </a>{" "}
            and I will remove your contact record and any conversation
            attached to it. You do not need to explain why.
          </P>

          <p
            className="mt-12 border-t pt-6"
            style={{
              borderColor: TOKENS.hair,
              color: TOKENS.muted,
              fontSize: TYPE.small,
              ...TYPE_STYLE.small,
            }}
          >
            <a
              href="/"
              className="border-b pb-px transition-colors duration-200 hover:border-[#C0392B] hover:text-[#C0392B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ color: TOKENS.ink, borderColor: TOKENS.ink }}
            >
              Back to the site
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
