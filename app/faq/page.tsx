import type { Metadata } from "next";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { faqGroups } from "@/data/faq";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers on the EVOHN catalogue, analytical documentation, storage and cold-chain handling, and regulatory position.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "FAQ", href: "/faq" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Frequently Asked"
        title="Questions."
        body="If something is not covered below, a specialist will answer it directly."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "FAQ", href: "/faq" },
        ]}
      />

      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <div className="flex flex-col gap-20 lg:gap-28">
            {faqGroups.map((group, i) => (
              <div key={group.title} className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-4">
                  <Reveal distance={12}>
                    <div className="lg:sticky lg:top-32">
                      <span className="type-label tabular-nums text-carbon/62">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h2 className="type-display-s mt-5">{group.title}</h2>
                    </div>
                  </Reveal>
                </div>

                <div className="lg:col-span-7 lg:col-start-6">
                  <Reveal delay={0.08}>
                    <Accordion items={group.items} tone="light" />
                  </Reveal>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CallToAction
        eyebrow="Still Unanswered"
        title={"Ask a specialist\ndirectly."}
        secondary={{ label: "Contact", href: "/contact" }}
      />
    </>
  );
}
