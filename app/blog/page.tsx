import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { ArticleCard } from "@/components/journal/ArticleCard";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import {
  articlesByDate,
  journalTopics,
  topicBySlug,
  articlesByTopic,
} from "@/data/journal";
import { formatDateShort } from "@/lib/format";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "In-depth articles, compound guides and literature reviews from the EVOHN research desk — analytical method, verification, handling and mechanism.",
  alternates: { canonical: "/blog" },
};

/**
 * Research blog.
 *
 * The second reference's listing philosophy: a lead entry, then a dense
 * chronological list grouped by topic rather than a card grid. Entries open
 * at their canonical address under /journal — this page is an index, not a
 * second copy of the writing.
 */
export default function BlogPage() {
  const [lead, ...rest] = articlesByDate;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Blog", href: "/blog" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Research Blog"
        title={"Articles from\nthe research desk"}
        body="In-depth articles, compound guides and literature reviews. Written about method rather than product — what a certificate establishes, why purity and identity are separate questions, and what actually degrades a compound in solution."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
        ]}
        meta={[
          {
            label: "Articles",
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

      {/* Lead */}
      {lead ? (
        <section className="border-b border-carbon/10 bg-soft text-carbon">
          <div className="container-content py-20 md:py-28">
            <p className="type-label text-carbon/45">Latest</p>
            <div className="mt-10">
              <ArticleCard article={lead} feature priority sizes="100vw" />
            </div>
          </div>
        </section>
      ) : null}

      {/* Grouped index */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          {journalTopics.map((topic) => {
            const entries = articlesByTopic(topic.slug);
            if (entries.length === 0) return null;

            return (
              <div key={topic.slug} className="mt-24 first:mt-0">
                <div className="border-b border-carbon/20 pb-7">
                  <h2 className="type-display-s">{topic.name}</h2>
                  <p className="type-body mt-6 max-w-[62ch] text-carbon/62">
                    {topic.description}
                  </p>
                </div>

                <ul>
                  {entries.map((article, i) => (
                    <Reveal key={article.slug} delay={i * 0.05} as="li">
                      <Link
                        href={`/journal/${article.slug}`}
                        className="group/b grid gap-3 border-b border-carbon/12 py-8 md:grid-cols-12 md:gap-8"
                      >
                        <span className="type-label flex gap-5 tabular-nums text-carbon/40 md:col-span-2">
                          <time dateTime={article.date}>
                            {formatDateShort(article.date)}
                          </time>
                        </span>

                        <span className="md:col-span-7">
                          <span className="type-title block text-carbon">
                            <span className="relative inline">
                              {article.title}
                              <span
                                aria-hidden
                                className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/b:w-full motion-reduce:transition-none"
                              />
                            </span>
                          </span>
                          <span className="type-body-s mt-3 block max-w-[62ch] text-carbon/62">
                            {article.excerpt}
                          </span>
                        </span>

                        <span className="type-label text-carbon/40 md:col-span-2">
                          {topicBySlug.get(article.topic)?.name}
                        </span>

                        <span className="type-label tabular-nums text-carbon/40 md:col-span-1 md:text-right">
                          {article.readMinutes} min
                        </span>
                      </Link>
                    </Reveal>
                  ))}
                </ul>
              </div>
            );
          })}

          <p className="type-body-s mt-16 text-carbon/45">
            {rest.length + 1} articles published. Entries open at their
            canonical address in the Journal.
          </p>
        </div>
      </section>

      <CallToAction
        eyebrow="The research desk"
        title={"Ask the question\ndirectly."}
        body="Technical questions are answered by the person who wrote the article, with reference to the actual certificate rather than a general policy."
        secondary={{ label: "Research categories", href: "/research" }}
      />
    </>
  );
}
