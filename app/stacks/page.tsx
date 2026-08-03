import type { Metadata } from "next";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { StackCard } from "@/components/stack/StackCard";
import { SectionHeading } from "@/components/common/SectionHeading";
import { DataTable } from "@/components/common/DataTable";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { stacks, stackComponents } from "@/data/stacks";
import { getCategory } from "@/data/categories";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Research Stacks",
  description:
    "Curated multi-compound research groupings. Each stack assembles mechanistically related compounds under a single research theme — separately certified, described as a protocol rather than a bundle.",
  alternates: { canonical: "/stacks" },
};

export default function StacksPage() {
  const compoundCount = new Set(
    stacks.flatMap((s) => s.includes.map((i) => i.slug)),
  ).size;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Stacks", href: "/stacks" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Research Stacks"
        title={"Compounds studied\nas one system"}
        body="Where the published record examines several compounds together, presenting them separately misrepresents how the work is actually done. A stack is that grouping made explicit: the mechanistic case for studying them as a set, the sequence the literature uses, and the handling that follows. Every component is certified independently — nothing is pre-mixed."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Stacks", href: "/stacks" },
        ]}
        meta={[
          { label: "Stacks", value: String(stacks.length).padStart(2, "0") },
          {
            label: "Compounds involved",
            value: String(compoundCount).padStart(2, "0"),
          },
          { label: "Certification", value: "Per component" },
          { label: "Supply", value: "Never pre-mixed" },
        ]}
      />

      {/* Why stacks are structured this way */}
      <section className="border-b border-carbon/10 bg-soft text-carbon">
        <div className="container-content py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-3 md:gap-14">
            {[
              {
                index: "01",
                title: "Separately certified",
                body: "Each vial carries its own batch number and its own certificate. Pre-mixing would make a result untraceable to the analysis that produced it.",
              },
              {
                index: "02",
                title: "Sequential, not additive",
                body: "The mechanisms in a stack are usually upstream and downstream of one another. Published designs stagger introduction so contributions can be resolved separately.",
              },
              {
                index: "03",
                title: "Governed by the shortest window",
                body: "Components have different stability profiles. Where several are in solution at once, the shortest interval on the relevant certificate governs the preparation.",
              },
            ].map((item, i) => (
              <Reveal key={item.index} delay={i * 0.08}>
                <p className="type-label tabular-nums text-carbon/35">
                  {item.index}
                </p>
                <h2 className="type-title mt-5 text-carbon">{item.title}</h2>
                <p className="type-body-s mt-4 max-w-[38ch] text-carbon/62">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The stacks */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <h2 className="sr-only">All research stacks</h2>
          <div className="flex flex-col gap-24 md:gap-32">
            {stacks.map((stack, i) => (
              <StackCard
                key={stack.slug}
                stack={stack}
                index={i}
                reversed={i % 2 === 1}
                priority={i === 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section-y bg-mist/50 text-carbon">
        <div className="container-content">
          <SectionHeading
            eyebrow="At a glance"
            title={"Which grouping\nfits the question"}
            body="Stacks differ by the level at which they operate. Some hold one mechanism at several stages; others hold several levels of one system. The distinction determines what a result can be attributed to."
          />

          <Reveal className="mt-16">
            <DataTable
              caption="Research stacks compared"
              head={["Stack", "Domain", "Components", "Assembled to examine"]}
              rows={stacks.map((stack) => [
                stack.name,
                getCategory(stack.category).name,
                stackComponents(stack)
                  .map((c) => c.product.name)
                  .join(" · "),
                stack.purpose,
              ])}
            />
          </Reveal>
        </div>
      </section>

      <CallToAction
        eyebrow="Enquiries"
        title={"Not sure which\ngrouping applies?"}
        body="Describe the endpoint you are measuring and a specialist will say which grouping the literature would point you at — including when the answer is a single compound rather than a set."
        secondary={{ label: "Full catalogue", href: "/catalogue" }}
      />
    </>
  );
}
