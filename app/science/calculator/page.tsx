import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { DilutionCalculator } from "@/components/science/DilutionCalculator";
import { DataTable } from "@/components/common/DataTable";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { disclaimer } from "@/data/site";

export const metadata: Metadata = {
  title: "Dilution Calculator",
  description:
    "Convert between quantity, diluent volume and concentration when preparing lyophilised research compounds — with the working shown so the result can be checked.",
  alternates: { canonical: "/science/calculator" },
};

export default function CalculatorPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Science", href: "/science" },
            { name: "Dilution Calculator", href: "/science/calculator" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="At the bench"
        title={"Dilution\ncalculator"}
        body="Concentration is quantity divided by volume, and a great many preparation errors come from treating one of those as fixed. This converts between all three and shows the arithmetic, so the figure that ends up in a preparation record is one you have checked rather than one you have been given."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Science", href: "/science" },
          { name: "Calculator", href: "/science/calculator" },
        ]}
        meta={[
          { label: "Inputs", value: "Quantity · Volume · Target" },
          { label: "Outputs", value: "Concentration · Draw volume" },
          { label: "Basis", value: "Assayed content" },
          { label: "Scope", value: "Arithmetic only" },
        ]}
      />

      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <DilutionCalculator />
        </div>
      </section>

      {/* Worked reference */}
      <section className="section-y bg-mist/50 text-carbon">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="type-label text-carbon/45">Worked reference</h2>
              <p className="type-display-s mt-8 max-w-[13ch]">
                Common preparations
              </p>
              <p className="type-body-s mt-8 max-w-[38ch] text-carbon/62">
                The same vial at different dilutions. Nothing about the quantity
                in the vial changes across these rows — only the volume it is
                dissolved into, and therefore the concentration.
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <Reveal>
                <DataTable
                  caption="A 5 mg vial at four dilutions"
                  head={[
                    "Diluent",
                    "Concentration",
                    "0.25 mg draws",
                    "U-100 graduation",
                  ]}
                  rows={[
                    ["1 mL", "5.00 mg/mL", "0.050 mL", "5.0 units"],
                    ["2 mL", "2.50 mg/mL", "0.100 mL", "10.0 units"],
                    ["3 mL", "1.67 mg/mL", "0.150 mL", "15.0 units"],
                    ["5 mL", "1.00 mg/mL", "0.250 mL", "25.0 units"],
                  ]}
                />
              </Reveal>

              <Reveal delay={0.14} className="mt-12">
                <div className="border border-carbon/12 bg-soft p-8">
                  <p className="type-label text-carbon/45">
                    Two figures that shift the answer
                  </p>
                  <ul className="type-body-s mt-5 space-y-3 text-carbon/68">
                    <li>
                      <strong className="font-normal text-carbon">
                        Assayed content.
                      </strong>{" "}
                      The certificate states what the laboratory found, which is
                      rarely identical to the label. For a compound consumed
                      stoichiometrically, that difference goes straight into the
                      result.
                    </li>
                    <li>
                      <strong className="font-normal text-carbon">
                        Water content.
                      </strong>{" "}
                      Karl Fischer titration reports how much of the weighed
                      mass is water rather than compound. The effect stacks with
                      any content variance.
                    </li>
                  </ul>
                  <Link
                    href="/journal/understanding-concentration-and-dilution"
                    className="type-label mt-8 inline-flex items-center gap-3 text-carbon"
                  >
                    The arithmetic in full
                    <span aria-hidden>&#8594;</span>
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.2} className="mt-10">
                <p className="type-body-s text-carbon/55">
                  {disclaimer.short}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <CallToAction
        eyebrow="At the bench"
        title={"Preparing a\nvial next?"}
        body="The reconstitution guide covers what happens either side of this arithmetic — how to introduce diluent without undoing the protection lyophilisation provides."
        secondary={{ label: "Reconstitution guide", href: "/science/reconstitution" }}
      />
    </>
  );
}
