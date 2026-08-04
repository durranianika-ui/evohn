import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ArticleCard } from "@/components/journal/ArticleCard";
import { articlesByDate, featuredArticles } from "@/data/journal";

/**
 * Journal preview.
 *
 * One lead entry at feature size beside two standard cards — the asymmetry is
 * the point. A row of three equal cards says "three articles"; this says
 * "start here, then these".
 */
export function Reading() {
  const pool = featuredArticles.length ? featuredArticles : articlesByDate;
  const [lead, ...rest] = pool;
  if (!lead) return null;

  // Fill from the full chronological list if there are not enough featured
  // entries to sit beside the lead.
  const beside = [
    ...rest,
    ...articlesByDate.filter(
      (a) => a.slug !== lead.slug && !rest.some((r) => r.slug === a.slug),
    ),
  ].slice(0, 2);

  return (
    <section className="section-y bg-soft text-carbon">
      <div className="container-content">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Journal"
            title={"Written about\nmethod."}
            body="What a certificate actually establishes, why purity and identity are separate questions, and what degrades a compound once it is in solution. Written for people who will be asked to defend the answer."
            className="lg:max-w-2xl"
          />
          <Reveal delay={0.2} className="shrink-0">
            <ButtonLink href="/journal" tone="light" variant="outline">
              Read the journal
            </ButtonLink>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-x-8 gap-y-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <ArticleCard
              article={lead}
              feature
              sizes="(min-width: 64rem) 55vw, 100vw"
            />
          </Reveal>

          <div className="flex flex-col gap-14 lg:col-span-5">
            {beside.map((article, i) => (
              <Reveal key={article.slug} delay={0.08 + i * 0.07}>
                <ArticleCard
                  article={article}
                  sizes="(min-width: 64rem) 38vw, 100vw"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
