import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { PeptideCalculator } from "@/components/science/PeptideCalculator";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { disclaimer } from "@/data/site";

export const metadata: Metadata = {
  title: "Peptide Calculator",
  description:
    "Work out reconstitution concentration, the volume that contains a given quantity, and where that lands on an insulin syringe. For laboratory research use only.",
  alternates: { canonical: "/calculator" },
};

/** Sibling guide cards — the same pair the reference closes its calculator with. */
const GUIDES = [
  {
    href: "/reconstitution-guide",
    title: "Reconstitution Guide",
    body: "Mixing & dosing basics",
  },
  {
    href: "/storage-handling",
    title: "Storage & Handling",
    body: "Keep peptides stable",
  },
];

export default function CalculatorPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Calculator", href: "/calculator" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Calculator"
        title={"Peptide\ncalculator"}
        body="Work out your reconstitution concentration, the volume to draw, and where that lands on an insulin syringe. Switch to the Mix tab to combine two reconstituted vials into a single solution."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Calculator", href: "/calculator" },
        ]}
        meta={[
          { label: "Inputs", value: "Quantity · Volume · Draw" },
          { label: "Outputs", value: "Concentration · Units" },
          { label: "Basis", value: "Assayed content" },
          { label: "Scope", value: "Arithmetic only" },
        ]}
      />

      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <PeptideCalculator />
        </div>
      </section>

      <section className="border-t border-carbon/10 bg-mist/50 text-carbon">
        <div className="container-content py-20">
          <div className="grid gap-8 sm:grid-cols-2">
            {GUIDES.map((guide, i) => (
              <Reveal key={guide.href} delay={i * 0.08}>
                <Link
                  href={guide.href}
                  className="group/g flex items-center justify-between gap-6 border border-carbon/12 bg-soft p-8 transition-colors duration-500 ease-brand hover:border-carbon/30"
                >
                  <span>
                    <span className="type-title block text-carbon">
                      {guide.title}
                    </span>
                    <span className="type-body-s mt-2 block text-carbon/55">
                      {guide.body}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="type-label shrink-0 transition-transform duration-500 ease-brand group-hover/g:translate-x-1 motion-reduce:transition-none"
                  >
                    &#8594;
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <p className="type-body-s mt-12 max-w-[92ch] text-carbon/55">
            {disclaimer.short}
          </p>
        </div>
      </section>

      <CallToAction
        eyebrow="Enquiries"
        title={"Checking a figure\nagainst a batch?"}
        body="The desk can confirm assayed content and water figures for the specific batch you hold, which is what the calculation should be built on."
        secondary={{ label: "Lab results", href: "/lab-results" }}
      />
    </>
  );
}
