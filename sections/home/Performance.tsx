import { PairedPanels, type Panel } from "@/components/home/PairedPanels";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SplitText } from "@/components/motion/SplitText";

/**
 * Second half of the paired sequence, mirrored. The reference flips the
 * editorial column to the other side here, which is what makes the two blocks
 * read as one movement rather than a repeated template.
 */
const panels: Panel[] = [
  {
    title: "Analytical Purity",
    body: "Purity is determined by high-performance liquid chromatography and the measured value for that lot is published. Measured, not claimed.",
    tone: "carbon",
  },
  {
    title: "Identity Confirmation",
    body: "Mass spectrometry confirms molecular weight against the theoretical value — establishing the correct molecule was made, not merely a pure one.",
    tone: "sand",
  },
  {
    title: "Cold-Chain Integrity",
    body: "Temperature-controlled from synthesis through to delivery, with monitored packaging, so that what was verified is what arrives.",
    tone: "carbon",
  },
];

export function Performance() {
  return (
    <section className="section-y-home bg-ink text-soft">
      <PairedPanels
        eyebrow="For Performance"
        title={"Consistency is\nthe whole point."}
        body="A compound that varies between lots is not a research input, it is a variable. EVOHN controls the process end to end so the material behaves the same way on the second order as it did on the first."
        cta={{ label: "The EVOHN Standard", href: "/quality" }}
        panels={panels}
        reverse
        closing={
          /* The closing statement, and the one thing to do next.

             This was a standalone CallToAction block, then a full-width row
             under the panels — worth 684px at 1440, which ran this block
             0.42vh past the reference while its twin ran 0.34vh short. The
             reference has neither: it resolves its final statement inside the
             held column of this same block, where the column has 1400px of
             spare height and the statement stays in view while the last
             panels pass. */
          <div className="border-t border-soft/12 pt-9">
            <SplitText
              as="p"
              text={"Your research\ndeserves certainty."}
              className="type-display-s max-w-[20ch] text-soft"
            />
            <Reveal delay={0.18} className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/catalogue" tone="dark">
                View Catalogue
              </ButtonLink>
              <ButtonLink href="/contact" tone="dark" variant="outline">
                Speak to a Specialist
              </ButtonLink>
            </Reveal>
          </div>
        }
      />
    </section>
  );
}
