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
  title: "Storage & Handling Guide",
  description:
    "How to keep research compounds stable: lyophilised versus reconstituted, refrigeration versus freezing, transport, and shelf life. For laboratory research use only.",
  alternates: { canonical: "/storage" },
};

/** The four states a vial passes through, in order of custody. */
const STATES = [
  {
    state: "Lyophilised, sealed",
    temp: "−20 °C",
    body: "The stable state. Water has been removed, so hydrolysis, deamidation and oxidation all proceed orders of magnitude more slowly. Protect from light and moisture.",
  },
  {
    state: "In transit",
    temp: "2–8 °C",
    body: "Acceptable short-term for lyophilised material under insulated cold chain. If an in-transit indicator arrives out of range, tell the desk before opening the vial.",
  },
  {
    state: "Reconstituted",
    temp: "2–8 °C",
    body: "The protection lyophilisation provided has been deliberately reversed. Observe the interval stated on the batch certificate — it is compound-specific, not general.",
  },
  {
    state: "Aliquoted",
    temp: "−20 °C, one thaw",
    body: "Where a preparation will be drawn on more than once, aliquot at the moment of reconstitution. Repeated freeze-thaw cycles aggregate peptide chains cumulatively.",
  },
];

export default function StoragePage() {
  const page = getSciencePage("storage");
  if (!page) notFound();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Storage & Handling Guide", href: "/storage" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Storage & Handling Guide"
        title={"Keeping compounds\nstable"}
        body="Degradation is not one process but four, with different chemistry and different countermeasures. Reading a handling note is largely a matter of identifying which of the four it is guarding against — because the instruction names the threat."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Storage & Handling Guide", href: "/storage" },
        ]}
        meta={[
          { label: "Lyophilised", value: "−20 °C, dark" },
          { label: "Reconstituted", value: "2–8 °C" },
          { label: "Freeze-thaw", value: "Cumulative damage" },
          { label: "Interval", value: "Per certificate" },
        ]}
      />

      <section className="border-b border-carbon/10 bg-soft text-carbon">
        <div className="container-content flex flex-wrap gap-4 py-10">
          <Link
            href="/reconstitution"
            className="type-label inline-flex min-h-12 items-center gap-3 bg-carbon px-8 py-4 text-soft"
          >
            Reconstitution guide
            <span aria-hidden>&#8594;</span>
          </Link>
          <Link
            href="/calculator"
            className="type-label inline-flex min-h-12 items-center gap-3 border border-carbon/25 px-8 py-4 text-carbon transition-colors duration-400 ease-brand hover:border-carbon"
          >
            Open the calculator
          </Link>
        </div>
      </section>

      {/* States of custody */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <h2 className="type-display-s max-w-[16ch]">Four states, four rules</h2>
          <p className="type-editorial mt-8 max-w-[46ch] text-carbon/72">
            A vial passes through each of these, and the handling changes at
            every step.
          </p>

          <ol className="mt-16 border-t border-carbon/15">
            {STATES.map((s, i) => (
              <Reveal key={s.state} delay={i * 0.06} as="li">
                <div className="grid gap-3 border-b border-carbon/12 py-8 md:grid-cols-12 md:gap-10">
                  <span className="type-label flex gap-5 text-carbon/45 md:col-span-4">
                    <span className="tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.state}
                  </span>
                  <span className="type-title-s tabular-nums text-carbon md:col-span-2">
                    {s.temp}
                  </span>
                  <p className="type-body-s text-carbon/68 md:col-span-6">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Degradation pathways — long form */}
      <section className="section-y bg-mist/50 text-carbon">
        <div className="container-content">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="type-display-s max-w-[13ch]">
                What actually degrades a compound
              </h2>
              <p className="type-body mt-8 max-w-[36ch] text-carbon/62">
                Four pathways, four triggers. Handling advice that treats every
                compound alike protects against the average threat and the
                specific one badly.
              </p>
            </div>
            <div className="lg:col-span-8 lg:col-start-5">
              <ContentBlocks blocks={page.body} />
            </div>
          </div>
        </div>
      </section>

      {/* Reference table */}
      {page.table ? (
        <section className="section-y bg-soft text-carbon">
          <div className="container-content">
            <Reveal>
              <DataTable
                caption={page.table.caption}
                head={page.table.head}
                rows={page.table.rows}
              />
            </Reveal>

            <div className="mt-16 border-t border-carbon/12 pt-8">
              <p className="type-body-s max-w-[92ch] text-carbon/55">
                This guide is educational and describes general laboratory
                handling. Stability intervals are compound-specific and stated
                on the certificate of analysis for each batch rather than
                generalised across the catalogue. {disclaimer.short}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <CallToAction
        eyebrow="Enquiries"
        title={"An indicator arrived\nout of range?"}
        body="Tell the desk before opening the vial. Custody questions are answered against the actual dispatch record rather than a general policy."
        secondary={{ label: "Lab results", href: "/lab-results" }}
      />
    </>
  );
}
