import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { TableOfContents } from "@/components/common/TableOfContents";
import { breadcrumbSchema } from "@/lib/schema";
import { formatDate } from "@/lib/format";
import { slugifyHeading } from "@/lib/utils";
import { legalDocuments, type LegalDocument } from "@/data/legal";

/**
 * One renderer for all eight legal documents.
 *
 * Each has its own route so a specific position can be cited, but they share
 * this layout: a sticky index on the left, numbered clauses on the right, the
 * review date at the head, and the sibling documents at the foot so a reader
 * who landed on one can reach the rest without going via the footer.
 */
export function LegalDocumentPage({ doc }: { doc: LegalDocument }) {
  const entries = doc.sections.map((s) => ({
    id: slugifyHeading(s.heading),
    label: s.heading,
  }));

  const siblings = legalDocuments.filter((d) => d.slug !== doc.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Legal", href: "/legal" },
          { name: doc.label, href: doc.path },
        ])}
      />

      <PageHero
        eyebrow="Legal"
        title={doc.title}
        body={doc.summary}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Legal", href: "/legal" },
          { name: doc.label, href: doc.path },
        ]}
        meta={[
          { label: "Last reviewed", value: formatDate(doc.lastReviewed) },
          {
            label: "Status",
            value: doc.requiresLegalReview
              ? "Pending adviser sign-off"
              : "Approved",
          },
          { label: "Clauses", value: String(doc.sections.length).padStart(2, "0") },
        ]}
      />

      {/* The review banner is content, not chrome — it prints with the
          document, because a printed copy of unapproved wording must carry
          the same warning the screen does. */}
      {doc.requiresLegalReview ? (
        <div className="border-b border-carbon/12 bg-mist">
          <div className="container-content py-6">
            <p className="type-body-s max-w-[86ch] text-carbon/70">
              <span className="type-label mr-3 text-carbon">
                Awaiting legal review
              </span>
              This wording states EVOHN&rsquo;s current position and has not yet
              been approved by a qualified adviser in the relevant
              jurisdiction. It is published for transparency and must not be
              relied upon as legal advice.
            </p>
          </div>
        </div>
      ) : null}

      <section className="bg-soft text-carbon">
        <div className="container-content grid gap-16 py-20 md:py-28 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-3">
            <TableOfContents
              entries={entries}
              className="lg:sticky lg:top-32"
              label="Clauses"
            />
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <ol className="space-y-16">
              {doc.sections.map((section, i) => (
                <li key={section.heading}>
                  <Reveal distance={16}>
                    <article
                      id={slugifyHeading(section.heading)}
                      className="scroll-mt-32 border-t border-carbon/12 pt-8"
                    >
                      <div className="flex items-baseline gap-5">
                        <span className="type-label tabular-nums text-carbon/35">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h2 className="type-title-s text-carbon">
                          {section.heading}
                        </h2>
                      </div>

                      <div className="mt-6 space-y-5 sm:pl-10">
                        {section.body.map((paragraph) => (
                          <p
                            key={paragraph.slice(0, 48)}
                            className="type-body max-w-[72ch] text-carbon/70"
                          >
                            {paragraph}
                          </p>
                        ))}

                        {section.points?.length ? (
                          <ul className="mt-6 space-y-3 border-l border-carbon/15 pl-6">
                            {section.points.map((point) => (
                              <li
                                key={point}
                                className="type-body-s max-w-[68ch] text-carbon/62"
                              >
                                {point}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ol>

            <p className="type-label mt-16 border-t border-carbon/12 pt-8 text-carbon/45">
              Last reviewed {formatDate(doc.lastReviewed)}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-carbon/10 bg-mist text-carbon">
        <div className="container-content py-16">
          <h2 className="type-label text-carbon/45">Other documents</h2>
          <ul className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {siblings.map((sibling) => (
              <li key={sibling.slug}>
                <Link
                  href={sibling.path}
                  className="type-body-s block border-t border-carbon/15 py-4 text-carbon/62 transition-colors duration-400 ease-brand hover:text-carbon"
                >
                  {sibling.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
