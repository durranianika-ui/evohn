import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { formatDate } from "@/lib/format";
import { legalDocuments } from "@/data/legal";
import { disclaimer } from "@/data/site";

export const metadata: Metadata = {
  title: "Legal",
  description:
    "Index of the eight documents governing use of the EVOHN catalogue: terms, privacy, shipping, returns, platform use, age verification, research use and the research disclaimer.",
  alternates: { canonical: "/legal" },
};

/**
 * Legal index.
 *
 * A directory, not a document. Each of the eight positions lives at its own
 * address so it can be cited; this page exists so a reader who only knows
 * "legal" can find the one they need.
 */
export default function LegalIndexPage() {
  const pending = legalDocuments.filter((d) => d.requiresLegalReview).length;

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
        title={"Legal and\ncompliance"}
        body="Eight documents, each at its own address so a specific position can be linked to and cited. Together they state what this website is, what it is not, and the single condition attached to everything described on it."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Legal", href: "/legal" },
        ]}
        meta={[
          {
            label: "Documents",
            value: String(legalDocuments.length).padStart(2, "0"),
          },
          {
            label: "Last reviewed",
            value: formatDate(legalDocuments[0].lastReviewed),
          },
          { label: "Awaiting sign-off", value: String(pending).padStart(2, "0") },
        ]}
      />

      <section className="bg-soft text-carbon">
        <div className="container-content py-20 md:py-28">
          <Reveal>
            <p className="type-editorial max-w-[58ch] text-carbon/72">
              {disclaimer.short}
            </p>
          </Reveal>

          <ol className="mt-20 border-t border-carbon/12">
            {legalDocuments.map((doc, i) => (
              <li key={doc.slug}>
                <Reveal distance={14} delay={i * 0.03}>
                  <Link
                    href={doc.path}
                    className="group/doc grid gap-4 border-b border-carbon/12 py-8 transition-colors duration-500 ease-brand hover:bg-mist/50 md:grid-cols-12 md:items-baseline md:gap-8 md:px-4"
                  >
                    <span className="type-label tabular-nums text-carbon/35 md:col-span-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="type-title-s text-carbon md:col-span-4">
                      {doc.title}
                    </span>

                    <span className="type-body-s max-w-[52ch] text-carbon/58 md:col-span-6">
                      {doc.summary}
                    </span>

                    <span
                      aria-hidden
                      className="type-label text-carbon/35 transition-transform duration-500 ease-brand group-hover/doc:translate-x-1.5 md:col-span-1 md:justify-self-end"
                    >
                      &rarr;
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>

          {pending ? (
            <p className="type-body-s mt-14 max-w-[76ch] border border-carbon/15 bg-mist p-7 text-carbon/70">
              <span className="type-label mr-3 block text-carbon sm:inline">
                Awaiting legal review
              </span>
              {pending} of these {legalDocuments.length} documents state
              EVOHN&rsquo;s current position but have not yet been approved by a
              qualified adviser in the relevant jurisdiction. They are published
              for transparency and must not be relied upon as legal advice.
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}
