import type { Metadata } from "next";
import { PageHero } from "@/sections/shared/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { disclaimer, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Legal & Disclaimer",
  description:
    "Informational-use disclaimer, regulatory position and terms governing the EVOHN catalogue.",
  alternates: { canonical: "/legal" },
  robots: { index: true, follow: true },
};

const clauses = [
  {
    title: "Informational Purpose",
    body: disclaimer.long,
  },
  {
    title: "No Offer of Sale",
    body: "This website is a presentation catalogue. It does not display pricing, availability or stock, contains no ordering mechanism, and nothing on it constitutes an offer, an invitation to treat, or a contract. Any supply arrangement is agreed separately and is subject to verification of the recipient and the applicable regulatory position.",
  },
  {
    title: "Regulatory Compliance",
    body: "The regulatory status of the compounds described varies by territory. It is the responsibility of the reader to determine and comply with the laws applicable to them. EVOHN does not represent that any compound described is registered, approved or permitted for any particular use in any particular jurisdiction.",
  },
  {
    title: "Analytical Information",
    body: "Purity figures, molecular data and analytical descriptions reflect measurements recorded for specific historical batches, or values reported in published scientific literature. They are not specifications, guarantees, or predictions of the characteristics of any future batch. Reference data such as CAS numbers and molecular formulae are provided for identification and should be verified against the certificate of analysis supplied with a given lot.",
  },
  {
    title: "No Medical Advice",
    body: "Nothing on this website is medical, clinical or pharmaceutical advice. No statement here has been evaluated by any medicines regulator. No content should be interpreted as indicating that any compound is safe or effective for the diagnosis, treatment, cure or prevention of any condition.",
  },
  {
    title: "Intellectual Property",
    body: `The ${site.name} name, wordmark, visual identity and the content of this website are the property of ${site.name} and may not be reproduced without written permission. Compound names are used descriptively for identification and do not imply any affiliation with, or endorsement by, the holders of any associated marks.`,
  },
];

export default function LegalPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Legal", href: "/legal" },
        ])}
      />

      <PageHero
        eyebrow="Legal"
        title="Disclaimer."
        body="The terms below govern the use of this website and the information presented on it."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Legal", href: "/legal" },
        ]}
      />

      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <div className="mx-auto max-w-prose">
            {clauses.map((clause, i) => (
              <Reveal key={clause.title} delay={0.04 * i}>
                <article className="border-b border-carbon/12 py-12 first:pt-0">
                  <span className="type-label tabular-nums text-carbon/62">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="type-display-s mt-5">{clause.title}</h2>
                  <p className="type-body mt-7 text-carbon/62">{clause.body}</p>
                </article>
              </Reveal>
            ))}

            <Reveal className="pt-12">
              <p className="type-label text-carbon/62">
                Last updated — July 2026
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
