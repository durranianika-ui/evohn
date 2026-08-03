import type { Metadata } from "next";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { ReviewCard } from "@/components/review/ReviewCard";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { featuredReviews, reviewsByDate, reviewSummary } from "@/data/reviews";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What laboratories, research groups and distribution partners say about working with EVOHN — documentation, batch consistency, handling guidance and cold-chain custody.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  const [lead, ...otherFeatured] = featuredReviews;
  const featuredIds = new Set(featuredReviews.map((r) => r.id));
  const rest = reviewsByDate.filter((r) => !featuredIds.has(r.id));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Reviews", href: "/reviews" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Reviews"
        title={"What the bench\nsays"}
        body="Feedback from principal investigators, laboratory managers, analytical chemists and distribution partners. Every entry marked verified has been matched to a confirmed enquiry record; entries that could not be matched are not published."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Reviews", href: "/reviews" },
        ]}
        meta={[
          { label: "Average rating", value: `${reviewSummary.average} / 5` },
          {
            label: "Reviews published",
            value: String(reviewSummary.count).padStart(2, "0"),
          },
          {
            label: "Verified",
            value: `${reviewSummary.verified} of ${reviewSummary.count}`,
          },
          { label: "Incentivised", value: "None" },
        ]}
      />

      {/* Distribution */}
      <section className="border-b border-carbon/10 bg-soft text-carbon">
        <div className="container-content py-16 md:py-20">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="type-display text-carbon">
                {reviewSummary.average}
              </p>
              <p className="type-label mt-4 text-carbon/45">
                Average across {reviewSummary.count} published reviews
              </p>
            </div>

            <div className="lg:col-span-5 lg:col-start-6">
              <h2 className="type-label text-carbon/45">Distribution</h2>
              <ul className="mt-7 space-y-3">
                {reviewSummary.distribution.map((row) => {
                  const pct = reviewSummary.count
                    ? (row.count / reviewSummary.count) * 100
                    : 0;
                  return (
                    <li key={row.rating} className="flex items-center gap-5">
                      <span className="type-label w-6 shrink-0 tabular-nums text-carbon/62">
                        {row.rating}
                      </span>
                      <span className="h-1 flex-1 bg-carbon/10">
                        <span
                          className="block h-full bg-carbon"
                          style={{ width: `${pct}%` }}
                        />
                      </span>
                      <span className="type-label w-8 shrink-0 text-right tabular-nums text-carbon/45">
                        {row.count}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h2 className="type-label text-carbon/45">How this page works</h2>
              <p className="type-body-s mt-5 text-carbon/62">
                Reviews are unsolicited and never incentivised. The verification
                mark is set only where a submission matches a confirmed enquiry
                record — it is a statement about provenance, not a rating.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      {lead ? (
        <section className="section-y bg-mist/50 text-carbon">
          <div className="container-content">
            <SectionHeading
              eyebrow="Selected"
              title={"Read in full"}
              body="Longer entries, published whole. Nothing here is edited for length or trimmed to the flattering half."
            />

            <div className="mt-16 grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <ReviewCard review={lead} feature className="h-full bg-soft" />
              </div>
              <div className="grid gap-8 lg:col-span-5">
                {otherFeatured.slice(0, 2).map((review, i) => (
                  <Reveal key={review.id} delay={0.08 + i * 0.08}>
                    <ReviewCard review={review} className="h-full bg-soft" />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* All reviews */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <h2 className="type-label text-carbon/45">All reviews</h2>
          <ul className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {rest.map((review, i) => (
              <Reveal key={review.id} delay={(i % 3) * 0.07} as="li">
                <ReviewCard review={review} className="h-full" />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CallToAction
        eyebrow="Enquiries"
        title={"Judge it against\nthe documentation."}
        body="The most useful thing about a supplier is not what other people say — it is whether the certificate matches the vial. Both are published; check them."
        secondary={{ label: "Lab results", href: "/lab-results" }}
      />
    </>
  );
}
