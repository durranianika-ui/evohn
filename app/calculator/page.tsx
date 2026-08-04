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
    "Reconstitution, mixing and blend arithmetic with the working shown. Concentration, draw volume, syringe units and component breakdown. For laboratory research use only.",
  alternates: { canonical: "/calculator" },
};

/**
 * The legal position on the tool.
 *
 * Rendered as content rather than a footnote, because a calculator that
 * converts between mass and volume in a research context is exactly the sort
 * of thing that gets mistaken for guidance if nobody says otherwise.
 *
 * REQUIRES LEGAL REVIEW — see /platform-use.
 */
const NOTICE = [
  "This tool is educational and mathematical. It converts between quantity, volume and concentration, and it does nothing else.",
  "It is not medical advice, not a prescription, and not a recommendation to administer anything to anybody. It does not propose a quantity, a schedule or a compound — those belong to a study design.",
  "It is provided for lawful laboratory and research reference. Confirm any figure that will inform a decision against an independent calculation and against the certificate of analysis for the batch in hand.",
];

/** Sibling guide cards — the same pair the reference closes its calculator with. */
const GUIDES = [
  {
    href: "/reconstitution-guide",
    title: "Reconstitution Guide",
    body: "Bringing lyophilised material into solution without degrading it",
  },
  {
    href: "/storage-handling",
    title: "Storage & Handling",
    body: "Temperature, light, cycling, and the chemistry behind each rule",
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
        body="Three modes over one arithmetic core. Reconstitute a lyophilised vial, mix several solutions into one container, or resolve a multi-compound blend into its components. Every result shows its working."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Calculator", href: "/calculator" },
        ]}
        meta={[
          { label: "Modes", value: "Reconstitute · Mix · Blend" },
          { label: "Syringes", value: "30u · 50u · 100u · 1 mL · 3 mL" },
          { label: "Basis", value: "Assayed content" },
          { label: "Scope", value: "Arithmetic only" },
        ]}
      />

      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <PeptideCalculator />
        </div>
      </section>

      {/* The notice is a section, not a footnote. */}
      <section className="border-y border-carbon/10 bg-ink text-soft">
        <div className="container-content py-20 md:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <h2 className="type-display-s max-w-[14ch] text-soft lg:col-span-5">
              What this tool is
            </h2>
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="space-y-6">
                {NOTICE.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="type-body max-w-[62ch] text-soft/60"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <Link
                href="/platform-use"
                className="type-label group/pu mt-9 inline-flex min-h-11 items-center gap-3 text-soft/75 transition-colors duration-400 ease-brand hover:text-soft"
              >
                The full platform-use position
                <span
                  aria-hidden
                  className="transition-transform duration-500 ease-brand group-hover/pu:translate-x-1.5 motion-reduce:transition-none"
                >
                  &#8594;
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-carbon/10 bg-mist/50 text-carbon">
        <div className="container-content py-20">
          <div className="grid gap-8 sm:grid-cols-2">
            {GUIDES.map((guide, i) => (
              <Reveal key={guide.href} delay={i * 0.08}>
                <Link
                  href={guide.href}
                  className="group/g flex items-center justify-between gap-6 border border-carbon/12 bg-soft p-6 transition-colors duration-500 ease-brand hover:border-carbon/30 md:p-8"
                >
                  <span className="min-w-0">
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
