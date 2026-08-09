import FinalCta from "@/components/final-cta";
import Hero from "@/components/hero";
import SelectedWorks from "@/components/selected-works";
import Whitelabel from "@/components/whitelabel";

/* Page rhythm is deliberate: airy white hero, one dark work section as the
   single visual reset, then white again for the product demo and the close. */
export default function Home() {
  return (
    <main>
      <Hero />
      <SelectedWorks />
      <Whitelabel />
      <FinalCta />
    </main>
  );
}
