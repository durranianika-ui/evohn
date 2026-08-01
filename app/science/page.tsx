import type { Metadata } from "next";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { SectionHeading, Eyebrow } from "@/components/common/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { JsonLd } from "@/components/common/JsonLd";
import { verificationChain } from "@/data/standards";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Science",
  description:
    "How EVOHN establishes purity: solid-phase synthesis, preparative purification, HPLC quantification, mass spectrometry identity confirmation and independent third-party analysis.",
  alternates: { canonical: "/science" },
};

const methods = [
  {
    label: "HPLC",
    name: "High-Performance Liquid Chromatography",
    body: "Separates the target sequence from truncation, deletion and oxidation products. Integrating the resulting chromatogram gives the purity figure published on the certificate — a measured area, not an estimate.",
  },
  {
    label: "MS",
    name: "Mass Spectrometry",
    body: "Confirms the observed molecular weight against the theoretical value for the sequence. Purity establishes that a sample is clean; identity establishes that it is the right molecule.",
  },
  {
    label: "KF",
    name: "Karl Fischer Titration",
    body: "Quantifies residual moisture in the lyophilised cake. Water content governs long-term stability and is recorded for every batch.",
  },
  {
    label: "AA",
    name: "Amino Acid Analysis",
    body: "Hydrolyses the peptide and quantifies its constituent residues, independently corroborating both composition and net peptide content.",
  },
];

const documents = [
  { title: "Certificate of Analysis", note: "Per lot" },
  { title: "HPLC Chromatogram", note: "Per lot" },
  { title: "Mass Spectrometry Report", note: "Per lot" },
  { title: "Chain-of-Custody Record", note: "Per lot" },
  { title: "Cold-Chain Log", note: "Per shipment" },
  { title: "Third-Party Verification", note: "Independent" },
];

export default function SciencePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Science", href: "/science" },
        ])}
      />

      <PageHero
        eyebrow="Analytical Standards"
        title={"Measured.\nNot claimed."}
        body="Purity is a measurement with a method, an instrument and an operator behind it. Everything below describes how that measurement is produced, and how it is checked by someone with nothing to gain from the result."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Science", href: "/science" },
        ]}
        meta={[
          { label: "Purity Method", value: "RP-HPLC" },
          { label: "Identity Method", value: "ESI-MS" },
          { label: "Verification", value: "Third-party" },
          { label: "Traceability", value: "Per lot" },
        ]}
      />

      {/* The chain */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <SectionHeading
            eyebrow="The Chain"
            title={"Eight stages.\nNone optional."}
            body="A batch moves through the sequence below in order. A deviation at any stage is documented and resolved before the next begins — there is no route that skips a step."
            size="display"
          />

          <Stagger className="mt-20 grid gap-px border border-carbon/12 bg-carbon/12 md:grid-cols-2 xl:grid-cols-4">
            {verificationChain.map((stage, i) => (
              <StaggerItem key={stage.title} className="bg-soft">
                <article className="flex h-full flex-col gap-8 p-9 lg:p-10">
                  <span className="type-label tabular-nums text-carbon/62">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="type-title-s">{stage.title}</h3>
                  <p className="type-body-s text-carbon/62">{stage.body}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Methods */}
      <section className="section-y bg-carbon text-soft">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-4">
              <Reveal distance={12}>
                <Eyebrow>Instrumentation</Eyebrow>
              </Reveal>
              <SplitText
                as="h2"
                text={"Four ways\nof knowing."}
                className="type-display mt-8 text-soft"
              />
              <Reveal delay={0.16} className="mt-10">
                <p className="type-body-s max-w-[42ch] text-soft/55">
                  No single technique establishes that a compound is what it
                  claims to be. Each answers a different question, and the
                  answers are only convincing together.
                </p>
              </Reveal>
            </div>

            <Stagger className="lg:col-span-7 lg:col-start-6">
              <ul className="border-t border-soft/12">
                {methods.map((method) => (
                  <StaggerItem key={method.label} distance={18}>
                    <li className="grid grid-cols-12 gap-6 border-b border-soft/12 py-9">
                      <span className="type-label col-span-12 text-soft/55 md:col-span-2">
                        {method.label}
                      </span>
                      <div className="col-span-12 md:col-span-10">
                        <h3 className="type-title-s text-soft">{method.name}</h3>
                        <p className="type-body-s mt-3 max-w-[54ch] text-soft/55">
                          {method.body}
                        </p>
                      </div>
                    </li>
                  </StaggerItem>
                ))}
              </ul>
            </Stagger>
          </div>
        </div>
      </section>

      {/* Documentation */}
      <section className="section-y bg-mist text-carbon">
        <div className="container-content">
          <SectionHeading
            eyebrow="Documentation"
            title="What accompanies a batch."
            body="Every lot resolves to a complete record. If a document below cannot be produced for a given batch, that batch is not released."
          />

          <Stagger className="mt-16 grid gap-px border border-carbon/12 bg-carbon/12 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc, i) => (
              <StaggerItem key={doc.title} className="bg-mist">
                <div className="flex h-full items-start justify-between gap-6 p-8 lg:p-10">
                  <div>
                    <h3 className="type-title-s">{doc.title}</h3>
                    <p className="type-label mt-3 text-carbon/62">{doc.note}</p>
                  </div>
                  <span className="type-label tabular-nums text-carbon/62">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.2} className="mt-16 border-t border-carbon/12 pt-8">
            <p className="type-body-s max-w-[86ch] text-carbon/62">
              Documentation is provided on request for a specific lot. Figures
              published anywhere on this site describe historical measured
              results and are not a specification, a guarantee, or a therapeutic
              claim.
            </p>
          </Reveal>
        </div>
      </section>

      <CallToAction
        eyebrow="Documentation"
        title={"Request a certificate\nof analysis."}
        body="A specialist can provide the analytical documentation for a specific lot, including the chromatogram and independent verification."
        secondary={{ label: "View Catalogue", href: "/products" }}
      />
    </>
  );
}
