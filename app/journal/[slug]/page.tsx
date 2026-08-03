import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { ContentBlocks } from "@/components/journal/ContentBlocks";
import { ArticleCard } from "@/components/journal/ArticleCard";
import { Figure } from "@/components/common/Figure";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import {
  articles,
  getArticle,
  relatedArticles,
  topicBySlug,
} from "@/data/journal";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { formatDate } from "@/lib/format";
import { site } from "@/data/site";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata(
  props: PageProps<"/journal/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/journal/${article.slug}` },
    openGraph: {
      type: "article",
      title: `${article.title} | ${site.name}`,
      description: article.excerpt,
      url: `${site.url}/journal/${article.slug}`,
      publishedTime: article.date,
    },
  };
}

export default async function ArticlePage(
  props: PageProps<"/journal/[slug]">,
) {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) notFound();

  const topic = topicBySlug.get(article.topic);
  const related = relatedArticles(article);

  return (
    <>
      <JsonLd
        data={[
          articleSchema(article),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Journal", href: "/journal" },
            { name: article.title, href: `/journal/${article.slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow={topic?.name ?? "Journal"}
        title={article.title}
        body={article.excerpt}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Journal", href: "/journal" },
          { name: article.title, href: `/journal/${article.slug}` },
        ]}
        meta={[
          { label: "Published", value: formatDate(article.date) },
          { label: "Reading time", value: `${article.readMinutes} minutes` },
          { label: "Topic", value: topic?.name ?? "Journal" },
          { label: "Author", value: "The research desk" },
        ]}
      />

      <article>
        {/* Lead image */}
        <section className="bg-soft">
          <div className="container-content -mt-16 md:-mt-24">
            <Reveal duration={1}>
              <Figure
                src={article.image}
                alt=""
                placeholderLabel={topic?.name}
                priority
                sizes="100vw"
                className="aspect-16/9 w-full"
              />
            </Reveal>
          </div>
        </section>

        {/* Body */}
        <section className="section-y bg-soft text-carbon">
          <div className="container-content">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Standing column — topic, date, and the way back. */}
              <aside className="lg:col-span-3">
                <div className="lg:sticky lg:top-32">
                  <p className="type-label text-carbon/45">Filed under</p>
                  <p className="type-title-s mt-4 text-carbon">
                    {topic?.name}
                  </p>
                  <p className="type-body-s mt-4 max-w-[34ch] text-carbon/55">
                    {topic?.description}
                  </p>

                  <dl className="type-body-s mt-10 space-y-4 border-t border-carbon/12 pt-6">
                    <div>
                      <dt className="type-label text-carbon/45">Published</dt>
                      <dd className="mt-1.5 text-carbon/72">
                        <time dateTime={article.date}>
                          {formatDate(article.date)}
                        </time>
                      </dd>
                    </div>
                    <div>
                      <dt className="type-label text-carbon/45">Reading time</dt>
                      <dd className="mt-1.5 text-carbon/72">
                        {article.readMinutes} minutes
                      </dd>
                    </div>
                  </dl>

                  <Link
                    href="/journal"
                    className="type-label mt-10 inline-flex items-center gap-3 text-carbon/62 transition-colors duration-400 ease-brand hover:text-carbon"
                  >
                    <span aria-hidden>&#8592;</span>
                    All entries
                  </Link>
                </div>
              </aside>

              <div className="lg:col-span-8 lg:col-start-5">
                <ContentBlocks blocks={article.body} />
              </div>
            </div>
          </div>
        </section>
      </article>

      {/* Related */}
      {related.length ? (
        <section className="section-y bg-mist/50 text-carbon">
          <div className="container-content">
            <div className="flex flex-wrap items-end justify-between gap-8">
              <h2 className="type-display-s max-w-[16ch]">Continue reading</h2>
              <Link
                href="/journal"
                className="type-label inline-flex items-center gap-3 text-carbon/62 transition-colors hover:text-carbon"
              >
                The Journal
                <span aria-hidden>&#8594;</span>
              </Link>
            </div>

            <div className="mt-14 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {related.map((entry, i) => (
                <Reveal key={entry.slug} delay={i * 0.08}>
                  <ArticleCard
                    article={entry}
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 92vw"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CallToAction
        eyebrow="The research desk"
        title={"Ask the question\ndirectly."}
        body="Technical questions are answered by the person who wrote this, with reference to the actual certificate rather than a general policy."
        secondary={{ label: "Lab results", href: "/lab-results" }}
      />
    </>
  );
}
