import type { Metadata } from "next";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { ArticleCard } from "@/components/journal/ArticleCard";
import { JournalBrowser } from "@/components/journal/JournalBrowser";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import {
  articlesByDate,
  featuredArticles,
  journalTopics,
} from "@/data/journal";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Research-framed writing on analytical method, verification and laboratory handling — the reasoning behind how every EVOHN batch is evaluated.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  const [lead, ...rest] = featuredArticles.length
    ? featuredArticles
    : articlesByDate;

  const entries = articlesByDate.map((article) => ({
    slug: article.slug,
    topic: article.topic,
    card: (
      <ArticleCard
        article={article}
        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 92vw"
      />
    ),
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Journal", href: "/journal" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="The Journal"
        title={"Notes from the\nresearch desk"}
        body="Writing about method rather than product. How a certificate is read, why purity and identity are different questions, what actually degrades a peptide in solution — the reasoning that sits behind every release decision, set down so it can be checked."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Journal", href: "/journal" },
        ]}
        meta={[
          {
            label: "Entries",
            value: String(articlesByDate.length).padStart(2, "0"),
          },
          {
            label: "Topics",
            value: String(journalTopics.length).padStart(2, "0"),
          },
          { label: "Written by", value: "The research desk" },
          { label: "Editorial policy", value: "Method over product" },
        ]}
      />

      {/* Lead entry */}
      {lead ? (
        <section className="border-b border-carbon/10 bg-soft text-carbon">
          <div className="container-content py-20 md:py-28">
            <p className="type-label text-carbon/45">Latest</p>
            <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <ArticleCard article={lead} feature priority sizes="60vw" />
              </div>

              <div className="lg:col-span-4 lg:col-start-9">
                <p className="type-label text-carbon/45">Also this month</p>
                <ul className="mt-8 border-t border-carbon/12">
                  {rest.slice(0, 3).map((article, i) => (
                    <Reveal key={article.slug} delay={i * 0.08} as="li">
                      <a
                        href={`/journal/${article.slug}`}
                        className="group/entry block border-b border-carbon/12 py-6"
                      >
                        <span className="type-title-s block text-carbon">
                          <span className="relative inline">
                            {article.title}
                            <span
                              aria-hidden
                              className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/entry:w-full motion-reduce:transition-none"
                            />
                          </span>
                        </span>
                        <span className="type-label mt-3 block text-carbon/45">
                          {article.readMinutes} min read
                        </span>
                      </a>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* All entries */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <h2 className="sr-only">All journal entries</h2>
          <JournalBrowser entries={entries} topics={journalTopics} />
        </div>
      </section>

      <CallToAction
        eyebrow="The research desk"
        title={"Ask the question\ndirectly."}
        body="If something here is unclear, or you want the reasoning behind a specific result on a specific certificate, the desk answers technical questions itself."
        secondary={{ label: "Science hub", href: "/science" }}
      />
    </>
  );
}
