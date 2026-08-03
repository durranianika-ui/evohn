import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ArticleCard } from "@/components/journal/ArticleCard";
import { ReviewCard } from "@/components/review/ReviewCard";
import { articlesByDate, featuredArticles } from "@/data/journal";
import { featuredReviews, reviewSummary } from "@/data/reviews";

/**
 * The editorial half of the home page: what the research desk has written,
 * and what the people using the material have said about it.
 */
export function Editorial() {
  const entries = (featuredArticles.length ? featuredArticles : articlesByDate)
    .slice(0, 3);
  const review = featuredReviews[0];

  return (
    <>
      {/* Journal */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="The Journal"
              title={"Notes from the\nresearch desk."}
              size="display"
              body="Writing about method rather than product — how a certificate is read, why purity and identity are different questions, and what actually degrades a peptide in solution."
              className="lg:max-w-3xl"
            />
            <Reveal delay={0.2} className="shrink-0">
              <ButtonLink href="/journal" tone="light" variant="outline">
                Read the Journal
              </ButtonLink>
            </Reveal>
          </div>

          <div className="mt-20 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((article, i) => (
              <Reveal key={article.slug} delay={(i % 3) * 0.08}>
                <ArticleCard
                  article={article}
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 92vw"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      {review ? (
        <section className="section-y bg-mist/50 text-carbon">
          <div className="container-content">
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <p className="type-label text-carbon/45">Reviews</p>
                <p className="type-display mt-8 tabular-nums text-carbon">
                  {reviewSummary.average}
                </p>
                <p className="type-body mt-6 max-w-[32ch] text-carbon/62">
                  Average across {reviewSummary.count} published reviews from
                  laboratories, research groups and distribution partners.
                  Unsolicited, never incentivised.
                </p>
                <Reveal delay={0.16} className="mt-10">
                  <ButtonLink href="/reviews" tone="light" variant="outline">
                    All Reviews
                  </ButtonLink>
                </Reveal>
              </div>

              <div className="lg:col-span-7 lg:col-start-6">
                <Reveal>
                  <ReviewCard review={review} feature className="bg-soft" />
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
