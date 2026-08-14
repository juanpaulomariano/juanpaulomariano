import ConversationAi from "@/components/conversation-ai";
import FinalCta from "@/components/final-cta";
import Hero from "@/components/hero";
import SelectedWorks from "@/components/selected-works";
import Whitelabel from "@/components/whitelabel";

/* Page rhythm is deliberate: airy white hero, one dark work section as the
   single visual reset, then white for the rest.

   Conversation AI sits directly after Selected Work on purpose. The IronPulse
   description there claims the system "runs two bots that hold a real
   conversation"; this section is where a reader who just read that claim gets
   to hear and read the conversation itself. */
export default function Home() {
  return (
    <main>
      <Hero />
      <SelectedWorks />
      <ConversationAi />
      <Whitelabel />
      <FinalCta />
    </main>
  );
}
