import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { ContentBlocks } from "@/components/journal/ContentBlocks";
import { DataTable } from "@/components/common/DataTable";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { getSciencePage } from "@/data/science";
import { breadcrumbSchema } from "@/lib/schema";
import { disclaimer } from "@/data/site";

export const metadata: Metadata = {
  title: "Reconstitution Guide",
  description:
    "How lyophilised research compounds are reconstituted: choosing a diluent, the concentration arithmetic, reading a U-100 barrel, and the step-by-step technique. For laboratory research use only.",
  alternates: { canonical: "/reconstitution" },
};

/** The three diluents the reference contrasts, in the same order. */
const DILUENTS = [
  {
    name: "Bacteriostatic water",
    spec: "0.9% benzyl alcohol",
    body: "The preservative inhibits microbial growth across repeated withdrawals, which is what makes a multi-use preparation possible at all. The usual default.",
  },
  {
    name: "Sterile water",
    spec: "No preservative",
    body: "Adequate for a single session, but it offers no protection once the stopper is pierced. Reserved for same-session work.",
  },
  {
    name: "Bacteriostatic saline",
    spec: "0.9% sodium chloride",
    body: "Occasionally used, but the added salt can affect sensitive compounds. Bacteriostatic water is the safer default unless a record says otherwise.",
  },
];

/** The technique, in the reference's own six-step sequence. */
const STEPS = [
  {
    title: "Prepare the materials",
    body: "Work on a clean surface with the lyophilised vial, diluent, alcohol swabs and a sterile syringe. Allow refrigerated material to reach ambient temperature so atmospheric moisture does not condense onto the cake.",
  },
  {
    title: "Swab both stoppers",
    body: "Wipe the stopper of the compound vial and of the diluent vial with separate swabs, and let both air dry before drawing.",
  },
  {
    title: "Draw the diluent",
    body: "Draw the chosen volume. That volume is what sets the final concentration — more diluent yields less compound per unit on the barrel.",
  },
  {
    title: "Introduce it slowly",
    body: "Insert the needle at an angle and let the stream run down the inner wall rather than directly onto the powder. A jet onto lyophilised material generates local shear and foaming.",
  },
  {
    title: "Dissolve gently",
    body: "Swirl the vial, or roll it between your palms, until the solution is clear. Never shake or vortex — agitation at the air-liquid interface shears and aggregates peptide chains.",
  },
  {
    title: "Label and refrigerate",
    body: "Record compound, batch, concentration and date on the vial, then store as the handling guide describes. A preparation without those four fields is not reconstructible.",
  },
];

const PRACTICES = [
  "Swirl or palm-roll — never shake or vortex, which aggregates chains at the air-liquid interface.",
  "Run diluent down the vial wall, not onto the lyophilised cake.",
  "Use a fresh swab on the stopper before every withdrawal.",
  "Label every vial with compound, batch, concentration and reconstitution date.",
  "Observe the reconstituted interval on the batch certificate; discard if the solution turns cloudy or gels. For longer storage, aliquot rather than repeatedly freezing the parent vial.",
];

export default function ReconstitutionPage() {
  const page = getSciencePage("reconstitution");
  if (!page) notFound();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Reconstitution Guide", href: "/reconstitution" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Reconstitution Guide"
        title={"How compounds are\nreconstituted"}
        body="Research compounds ship as a lyophilised powder. Before handling, they are returned to solution by adding a sterile diluent. This guide covers the fundamentals, the arithmetic, and the measurement basics for laboratory work."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Reconstitution Guide", href: "/reconstitution" },
        ]}
        meta={[
          { label: "Covers", value: "Diluent · Maths · Technique" },
          { label: "Reading time", value: `${page.readMinutes} minutes` },
          { label: "Companion", value: "Calculator" },
          { label: "Scope", value: "Laboratory handling" },
        ]}
      />

      {/* Actions — the reference places both directly under the standfirst. */}
      <section className="border-b border-carbon/10 bg-soft text-carbon">
        <div className="container-content flex flex-wrap gap-4 py-10">
          <Link
            href="/calculator"
            className="type-label inline-flex min-h-12 items-center gap-3 bg-carbon px-8 py-4 text-soft"
          >
            Open the calculator
            <span aria-hidden>&#8594;</span>
          </Link>
          <Link
            href="/storage"
            className="type-label inline-flex min-h-12 items-center gap-3 border border-carbon/25 px-8 py-4 text-carbon transition-colors duration-400 ease-brand hover:border-carbon"
          >
            Storage &amp; handling
          </Link>
        </div>
      </section>

      {/* Choosing a diluent */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <h2 className="type-display-s max-w-[16ch]">Choosing a diluent</h2>
          <p className="type-editorial mt-8 max-w-[46ch] text-carbon/72">
            Bacteriostatic water is the standard diluent for a multi-use
            research vial.
          </p>
          <p className="type-body mt-8 max-w-prose text-carbon/62">
            The diluent is simply the liquid that dissolves the powder. Its job
            is to carry the compound without degrading it and, ideally, to keep
            the vial usable across repeated withdrawals. Whichever you choose,
            the volume added is what sets the final concentration — the mass in
            the vial never changes.
          </p>

          <ul className="mt-16 grid gap-8 md:grid-cols-3">
            {DILUENTS.map((d, i) => (
              <Reveal key={d.name} delay={i * 0.08} as="li">
                <div className="h-full border-t border-carbon/15 pt-7">
                  <h3 className="type-title text-carbon">{d.name}</h3>
                  <p className="type-label mt-3 text-carbon/45">{d.spec}</p>
                  <p className="type-body-s mt-6 text-carbon/68">{d.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* The arithmetic */}
      <section className="section-y bg-carbon text-soft">
        <div className="container-content">
          <h2 className="type-display-s max-w-[16ch] text-soft">
            The concentration arithmetic
          </h2>
          <p className="type-editorial mt-8 max-w-[46ch] text-soft/72">
            Concentration is the compound mass divided by the diluent volume.
          </p>

          <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
            {[
              {
                label: "Finding the concentration",
                rows: [
                  ["Compound mass", "10 mg"],
                  ["Diluent added", "2 mL"],
                ],
                result: ["Concentration", "5 mg/mL"],
              },
              {
                label: "Finding the volume to draw",
                rows: [
                  ["Target quantity", "0.25 mg"],
                  ["Concentration", "5 mg/mL"],
                ],
                result: ["Volume to draw", "0.05 mL"],
              },
            ].map((block, i) => (
              <Reveal key={block.label} delay={i * 0.1}>
                <div className="border border-soft/12 p-8 md:p-10">
                  <p className="type-label text-soft/45">{block.label}</p>
                  <dl className="mt-7">
                    {block.rows.map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-baseline justify-between gap-6 border-b border-soft/10 py-4"
                      >
                        <dt className="type-body-s text-soft/55">{k}</dt>
                        <dd className="type-title tabular-nums text-soft">
                          {v}
                        </dd>
                      </div>
                    ))}
                    <div className="flex items-baseline justify-between gap-6 pt-6">
                      <dt className="type-label text-soft/45">
                        {block.result[0]}
                      </dt>
                      <dd className="type-display-s tabular-nums text-soft">
                        {block.result[1]}
                      </dd>
                    </div>
                  </dl>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="type-body mt-12 max-w-prose text-soft/62">
            Rather than working these out by hand, the{" "}
            <Link href="/calculator" className="underline underline-offset-4">
              calculator
            </Link>{" "}
            converts between vial size, diluent volume, target quantity and the
            markings on a syringe barrel.
          </p>
        </div>
      </section>

      {/* Reading a syringe */}
      <section className="section-y bg-mist/50 text-carbon">
        <div className="container-content">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="type-display-s max-w-[14ch]">
                Reading an insulin syringe
              </h2>
              <p className="type-editorial mt-8 max-w-[34ch] text-carbon/72">
                A U-100 barrel is marked in units, where 100 units is exactly
                1 mL.
              </p>
              <p className="type-body mt-8 max-w-[44ch] text-carbon/62">
                The conversion is fixed. So if a compound is reconstituted to
                5 mg/mL and a protocol references 0.05 mL, that is 5 units on
                the barrel. Translating a concentration into a mark is exactly
                what the calculator automates.
              </p>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal>
                <DataTable
                  caption="U-100 conversions"
                  head={["Units (IU)", "Volume", "Also written"]}
                  rows={[
                    ["100 units", "1.0 mL", "1 cc"],
                    ["50 units", "0.5 mL", "0.5 cc"],
                    ["20 units", "0.2 mL", "0.2 cc"],
                    ["10 units", "0.1 mL", "0.1 cc"],
                    ["5 units", "0.05 mL", "0.05 cc"],
                  ]}
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Step by step */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <h2 className="type-display-s max-w-[16ch]">Step by step</h2>
          <p className="type-editorial mt-8 max-w-[42ch] text-carbon/72">
            A clean, gentle technique preserves compound integrity.
          </p>

          <ol className="mt-16 border-t border-carbon/15">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.05} as="li">
                <div className="grid gap-3 border-b border-carbon/12 py-8 md:grid-cols-12 md:gap-10">
                  <span className="type-label flex gap-5 text-carbon/45 md:col-span-4">
                    <span className="tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step.title}
                  </span>
                  <p className="type-body-s text-carbon/68 md:col-span-8">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Best practice */}
      <section className="section-y bg-mist/50 text-carbon">
        <div className="container-content">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="type-display-s max-w-[13ch]">Best practice</h2>
              <p className="type-body mt-8 max-w-[36ch] text-carbon/62">
                Small habits protect both the compound and the result.
              </p>
            </div>
            <ul className="space-y-4 border-l border-carbon/15 pl-8 lg:col-span-7 lg:col-start-6">
              {PRACTICES.map((p) => (
                <li key={p} className="type-body text-carbon/72">
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-20 border-t border-carbon/12 pt-8">
            <p className="type-body-s max-w-[92ch] text-carbon/55">
              This guide is educational and describes general laboratory
              handling. It is not medical advice and it is not a dosing
              protocol. {disclaimer.short}
            </p>
          </div>
        </div>
      </section>

      {/* Long-form background */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <h2 className="type-label text-carbon/45">In more depth</h2>
          <div className="mt-12">
            <ContentBlocks blocks={page.body} />
          </div>
        </div>
      </section>

      <CallToAction
        eyebrow="Enquiries"
        title={"Preparing a\nspecific batch?"}
        body="Reconstituted stability is compound-specific and stated on the batch certificate. The desk can confirm the interval for the batch you hold."
        secondary={{ label: "Storage & handling", href: "/storage" }}
      />
    </>
  );
}
