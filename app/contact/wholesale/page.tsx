import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Wholesale & Distribution",
  description:
    "Territory enquiries and supply relationships for distribution partners. Documentation requirements are stated once, in full, at the outset.",
  alternates: { canonical: "/contact/wholesale" },
};

const POINTS = [
  {
    title: "Territory and exclusivity",
    body: "Availability is determined by the regulations of each jurisdiction before anything else is discussed. We would rather decline a territory than supply into one where the presentation is not permissible.",
  },
  {
    title: "Documentation package",
    body: "Certificates of analysis, batch traceability records, retained-sample policy and manufacturing attestations are assembled once and provided in full — not released incrementally as a negotiation proceeds.",
  },
  {
    title: "Cold chain and custody",
    body: "Insulated dispatch with in-transit indicators, and a written custody arrangement covering what happens when an indicator arrives out of range.",
  },
  {
    title: "Supply continuity",
    body: "Batch scheduling against a partner's forecast, with advance notice of batch transitions so a downstream customer is never handed a different lot without warning.",
  },
];

export default function WholesalePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Contact", href: "/contact" },
            { name: "Wholesale & Distribution", href: "/contact/wholesale" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Wholesale & Distribution"
        title={"Partnerships\n& resale"}
        body="Volume supply for distributors and resellers. The first conversation is about jurisdiction and documentation, not about volume — because the second only matters once the first is settled."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
          { name: "Wholesale", href: "/contact/wholesale" },
        ]}
        meta={[
          { label: "Typical reply", value: "Within one business day" },
          { label: "Answered by", value: "Head of Supply" },
          { label: "Requirements", value: "Stated once, in full" },
          { label: "Territories", value: "Assessed individually" },
        ]}
      />

      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="type-label text-carbon/45">What we cover</h2>
              <ul className="mt-8 border-t border-carbon/15">
                {POINTS.map((point, i) => (
                  <Reveal key={point.title} delay={i * 0.07} as="li">
                    <div className="border-b border-carbon/12 py-7">
                      <h3 className="type-title-s text-carbon">
                        {point.title}
                      </h3>
                      <p className="type-body-s mt-3 text-carbon/62">
                        {point.body}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ul>

              <Reveal delay={0.3} className="mt-10">
                <WhatsAppCTA intent="advisor" tone="light" />
                <p className="type-body-s mt-6 text-carbon/55">
                  Or write to{" "}
                  <a
                    href={`mailto:${site.partnersEmail}`}
                    className="underline underline-offset-4"
                  >
                    {site.partnersEmail}
                  </a>
                  .
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <h2 className="type-display-s max-w-[16ch]">
                Tell us the territory
              </h2>
              <p className="type-body mt-8 max-w-[54ch] text-carbon/62">
                Naming the jurisdiction and the compounds you intend to
                distribute means the first reply can answer rather than ask.
              </p>
              <div className="mt-12">
                <EnquiryForm />
              </div>

              <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-carbon/12 pt-8">
                <Link
                  href="/contact"
                  className="type-label text-carbon/62 transition-colors duration-400 ease-brand hover:text-carbon"
                >
                  General inquiry
                </Link>
                <Link
                  href="/contact/business"
                  className="type-label text-carbon/62 transition-colors duration-400 ease-brand hover:text-carbon"
                >
                  Business accounts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallToAction
        eyebrow="Enquiries"
        title={"Start with the\ndocumentation."}
        body="Every certificate is already published. Reviewing the library before a first conversation tells you more than any commercial discussion will."
        secondary={{ label: "Lab results", href: "/lab-results" }}
      />
    </>
  );
}
