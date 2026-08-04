import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ReviewCard } from "@/components/review/ReviewCard";
import { featuredReviews, reviewsByDate, reviewSummary } from "@/data/reviews";

/**
 * Reviews preview.
 *
 * The aggregate figures are computed from the records, so the average is
 * arithmetically true rather than asserted, and the verified count is the
 * number actually matched to a confirmed order — not the total.
 *
 * The records themselves are still illustrative and are flagged as such in
 * the README and the audit; this section renders whatever is in `data/`, so
 * replacing them with real submissions requires no code change.
 */
export function Voices() {
  const shown = (featuredReviews.length ? featuredReviews : reviewsByDate).slice(
    0,
    3,
  );
  if (!shown.length) return null;

  return (
    <section className="section-y bg-mist text-carbon">
      <div className="container-content">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="From the bench"
            title={"What comes\nback."}
            body="Feedback from the laboratories the material goes to. Reported as written, with the institution type rather than the institution name, and marked verified only where the submission is matched to a confirmed record."
            className="lg:max-w-2xl"
          />

          <Reveal delay={0.15} className="shrink-0">
            <div className="flex items-end gap-10">
              <div>
                <p className="type-display-s tabular-nums text-carbon">
                  {reviewSummary.average}
                </p>
                <p className="type-label mt-2 text-carbon/45">
                  Mean of {reviewSummary.count}
                </p>
              </div>
              <div>
                <p className="type-display-s tabular-nums text-carbon">
                  {String(reviewSummary.verified).padStart(2, "0")}
                </p>
                <p className="type-label mt-2 text-carbon/45">Verified</p>
              </div>
            </div>
          </Reveal>
        </div>

        <ul className="mt-20 grid gap-x-8 gap-y-10 md:grid-cols-3">
          {shown.map((review, i) => (
            <Reveal key={review.id} delay={i * 0.07} as="li" className="h-full">
              <ReviewCard review={review} className="h-full" />
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1} className="mt-16">
          <ButtonLink href="/reviews" tone="light" variant="outline">
            Read every review
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
