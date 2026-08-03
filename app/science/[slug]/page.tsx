import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { ContentBlocks } from "@/components/journal/ContentBlocks";
import { DataTable } from "@/components/common/DataTable";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import {
  sciencePages,
  getSciencePage,
  relatedSciencePages,
} from "@/data/science";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/data/site";

export function generateStaticParams() {
  return sciencePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata(
  props: PageProps<"/science/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const page = getSciencePage(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.intro,
    alternates: { canonical: `/science/${page.slug}` },
    openGraph: {
      type: "article",
      title: `${page.title} | ${site.name}`,
      description: page.intro,
      url: `${site.url}/science/${page.slug}`,
    },
  };
}

export default async function SciencePageRoute(
  props: PageProps<"/science/[slug]">,
) {
  const { slug } = await props.params;
  const page = getSciencePage(slug);
  if (!page) notFound();

  const related = relatedSciencePages(page);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Science", href: "/science" },
            { name: page.title, href: `/science/${page.slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        body={page.intro}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Science", href: "/science" },
          { name: page.title, href: `/science/${page.slug}` },
        ]}
        meta={[
          { label: "Reading time", value: `${page.readMinutes} minutes` },
          { label: "Section", value: page.eyebrow },
          { label: "Written by", value: "The research desk" },
          { label: "Applies to", value: "Every released batch" },
        ]}
      />

      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Standing column — the rest of the section, always reachable. */}
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-32">
                <p className="type-label text-carbon/45">In this section</p>
                <ul className="mt-6 border-t border-carbon/12">
                  {sciencePages.map((entry) => {
                    const current = entry.slug === page.slug;
                    return (
                      <li key={entry.slug}>
                        <Link
                          href={`/science/${entry.slug}`}
                          aria-current={current ? "page" : undefined}
                          className={
                            current
                              ? "type-body-s block border-b border-carbon/12 py-4 text-carbon"
                              : "type-body-s block border-b border-carbon/12 py-4 text-carbon/55 transition-colors duration-400 ease-brand hover:text-carbon"
                          }
                        >
                          {entry.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <Link
                  href="/science"
                  className="type-label mt-8 inline-flex items-center gap-3 text-carbon/62 transition-colors duration-400 ease-brand hover:text-carbon"
                >
                  <span aria-hidden>&#8592;</span>
                  Science hub
                </Link>
              </div>
            </aside>

            <div className="lg:col-span-8 lg:col-start-5">
              <ContentBlocks blocks={page.body} />

              {page.table ? (
                <Reveal className="mt-20">
                  <DataTable
                    caption={page.table.caption}
                    head={page.table.head}
                    rows={page.table.rows}
                  />
                </Reveal>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="section-y bg-mist/50 text-carbon">
          <div className="container-content">
            <h2 className="type-display-s max-w-[16ch]">Related reading</h2>
            <ul className="mt-14 grid gap-x-10 gap-y-10 md:grid-cols-2">
              {related.map((entry, i) => (
                <Reveal key={entry.slug} delay={i * 0.08} as="li">
                  <Link
                    href={`/science/${entry.slug}`}
                    className="group/rel block h-full border border-carbon/12 bg-soft p-8"
                  >
                    <p className="type-label text-carbon/45">{entry.eyebrow}</p>
                    <h3 className="type-title mt-5 text-carbon">
                      <span className="relative inline">
                        {entry.title}
                        <span
                          aria-hidden
                          className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/rel:w-full motion-reduce:transition-none"
                        />
                      </span>
                    </h3>
                    <p className="type-body-s mt-5 text-carbon/62">
                      {entry.intro}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <CallToAction
        eyebrow="Enquiries"
        title={"Ask about a\nspecific result."}
        body="The desk answers method questions with reference to the actual certificate rather than a general policy."
        secondary={{ label: "Lab results", href: "/lab-results" }}
      />
    </>
  );
}
