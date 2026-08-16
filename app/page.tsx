import ChatAi from "@/components/chat-ai";
import ConversationAi from "@/components/conversation-ai";
import FinalCta from "@/components/final-cta";
import Hero from "@/components/hero";
import SelectedWorks from "@/components/selected-works";
import Whitelabel from "@/components/whitelabel";

/* Page rhythm is deliberate: airy white hero, one dark work section as the
   single visual reset, then white for the rest.

   Conversation AI sits directly after Selected Work on purpose: Selected Work
   claims these systems hold real conversations, and this is where a reader who
   just read that claim gets to hear one.

   Chat AI follows it so the two conversation demos sit together — the same
   Bright Hollow receptionist on the phone, then on the website. White-label
   and the close come after, once the machine has been shown working. */
export default function Home() {
  return (
    <main>
      <Hero />
      <SelectedWorks />
      <ConversationAi />
      <ChatAi />
      <Whitelabel />
      <FinalCta />
    </main>
  );
}
