import type { Metadata } from "next";
import { PageHero } from "@/sections/shared/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA";
import { ArrowLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/common/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { disclaimer, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Speak with an EVOHN specialist about specification, analytical documentation, or availability in your territory.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    label: "WhatsApp",
    value: site.whatsapp,
    note: "Fastest route to a specialist.",
  },
  {
    label: "Email",
    value: site.email,
    note: "For documentation requests and formal correspondence.",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ])}
      />

      <PageHero
        eyebrow="Enquiries"
        title={"Speak with\na specialist."}
        body="There is no order form on this site. Every enquiry begins as a conversation about specification, documentation and what is permissible in your territory."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />

      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <Reveal>
                <h2 className="type-display-s">Direct.</h2>
                <p className="type-body mt-8 max-w-[42ch] text-carbon/62">
                  A specialist will confirm the current batch, provide its
                  analytical documentation, and establish what can be supplied
                  to your jurisdiction before anything else is discussed.
                </p>
              </Reveal>

              <Reveal delay={0.12} className="mt-12 flex flex-wrap gap-4">
                <WhatsAppCTA intent="specialist" tone="light" />
                <WhatsAppCTA
                  intent="information"
                  variant="outline"
                  tone="light"
                />
              </Reveal>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <dl className="border-t border-carbon/12">
                {channels.map((channel, i) => (
                  <Reveal key={channel.label} delay={i * 0.1}>
                    <div className="grid grid-cols-12 gap-6 border-b border-carbon/12 py-9">
                      <dt className="type-label col-span-12 text-carbon/62 md:col-span-3">
                        {channel.label}
                      </dt>
                      <dd className="col-span-12 md:col-span-9">
                        <p className="type-title-s">{channel.value}</p>
                        <p className="type-body-s mt-2 text-carbon/62">
                          {channel.note}
                        </p>
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>

              <Reveal delay={0.24} className="mt-12">
                <ArrowLink href="/products">Browse the catalogue</ArrowLink>
              </Reveal>
            </div>
          </div>

          <Reveal delay={0.3} className="mt-24 border-t border-carbon/12 pt-8">
            <p className="type-body-s max-w-[92ch] text-carbon/62">
              {disclaimer.short}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
