import { PairedPanels, type Panel } from "@/components/home/PairedPanels";

/**
 * First half of the paired sequence. Everything here is EVOHN's own claim
 * language, drawn from the verification chain in `data/standards.ts` — each
 * panel describes a process the company performs, not an outcome it promises.
 */
const panels: Panel[] = [
  {
    title: "Certificate of Analysis",
    body: "Every lot ships with the certificate for that lot — measured purity, not a specification carried over from a previous batch.",
    tone: "sand",
  },
  {
    title: "Batch Traceability",
    body: "A lot number resolves to its raw material qualification, synthesis record and analytical result. The chain is documented end to end.",
    tone: "carbon",
  },
  {
    title: "Independent Confirmation",
    body: "An accredited laboratory with no stake in the result repeats the critical analyses. Agreement between two independent results is the standard.",
    tone: "carbon",
  },
];

export function Researchers() {
  return (
    <section className="section-y-home bg-ink text-soft">
      <PairedPanels
        eyebrow="For Researchers"
        title={"Documentation\nyou can audit."}
        body="Analytical records exist to be checked, not admired. Every figure EVOHN publishes is traceable to the instrument run that produced it, and every certificate names the lot it belongs to."
        cta={{ label: "View Lab Results", href: "/lab-results" }}
        panels={panels}
      />
    </section>
  );
}
