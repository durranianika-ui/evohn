import Link from "next/link";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { StackMedia } from "@/components/product/StackMedia";
import { stacks, stackComponents } from "@/data/stacks";
import { getCategory } from "@/data/categories";

/**
 * Research stacks on the home page.
 *
 * The lead stack takes a full plate; the remainder are listed as a rail so
 * the section communicates that the grouping is a system rather than a
 * product line.
 */
export function Stacks() {
  const [lead, ...rest] = stacks;
  if (!lead) return null;

  const leadCategory = getCategory(lead.category);
  const leadComponents = stackComponents(lead);

  return (
    <section className="section-y-home bg-mist/50 text-carbon">
      <div className="container-home">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Research Stacks"
            title={"Compounds studied\nas one system."}
            size="display"
            body="Where the published record examines several compounds together, presenting them separately misrepresents how the work is done. Every component is certified independently — nothing is pre-mixed."
            className="lg:max-w-3xl"
          />
          <Reveal delay={0.2} className="shrink-0">
            <ButtonLink href="/stacks" tone="light" variant="outline">
              All Stacks
            </ButtonLink>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Lead stack */}
          <article className="group/lead lg:col-span-7">
            <Link href={`/stacks/${lead.slug}`} className="block">
              <div className="overflow-hidden">
                <StackMedia
                  stack={lead}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="aspect-4/3 w-full transition-transform duration-[1.2s] ease-brand group-hover/lead:scale-[1.035] motion-reduce:transition-none"
                />
              </div>

              <div className="mt-8 flex items-center gap-4">
                <span
                  aria-hidden
                  className="size-2 rounded-full ring-1 ring-carbon/15"
                  style={{ backgroundColor: leadCategory.token }}
                />
                <span className="type-label text-carbon/60">
                  {lead.eyebrow} · {leadComponents.length} compounds
                </span>
              </div>

              <h3 className="type-display-s mt-5">
                <span className="relative inline">
                  {lead.name}
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-[width] duration-700 ease-brand group-hover/lead:w-full motion-reduce:transition-none"
                  />
                </span>
              </h3>

              <p className="type-body mt-6 max-w-[52ch] text-carbon/62">
                {lead.tagline}
              </p>
            </Link>
          </article>

          {/* Remaining stacks */}
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="type-label text-carbon/60">Also available</p>
            <ul className="mt-8 border-t border-carbon/15">
              {rest.map((stack, i) => {
                const category = getCategory(stack.category);
                return (
                  <Reveal key={stack.slug} delay={i * 0.07} as="li">
                    <Link
                      href={`/stacks/${stack.slug}`}
                      className="group/s flex items-start gap-4 border-b border-carbon/12 py-6"
                    >
                      <span
                        aria-hidden
                        className="mt-2 size-1.5 shrink-0 rounded-full ring-1 ring-carbon/15"
                        style={{ backgroundColor: category.token }}
                      />
                      <span>
                        <span className="type-title-s block text-carbon">
                          <span className="relative inline">
                            {stack.name}
                            <span
                              aria-hidden
                              className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/s:w-full motion-reduce:transition-none"
                            />
                          </span>
                        </span>
                        <span className="type-body-s mt-2 block text-carbon/55">
                          {stackComponents(stack)
                            .map((c) => c.product.name)
                            .join(" · ")}
                        </span>
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
