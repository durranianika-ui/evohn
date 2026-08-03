import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Business Accounts",
  description:
    "Accounts for laboratories, clinics, research groups and contract organisations — scheduled supply against a study timeline, with the documentation a compliance review expects.",
  alternates: { canonical: "/contact/business" },
};

const POINTS = [
  {
    title: "Scheduled supply",
    body: "Supply planned against a study timeline rather than an order cycle, with advance notice of batch transitions so a long study is never silently split across lots.",
  },
  {
    title: "Batch reservation",
    body: "Where a protocol requires consistency across many months, material can be reserved from a single batch and released against the schedule.",
  },
  {
    title: "Documentation for review",
    body: "Certificates, method conditions, retained-sample policy and custody records, assembled in the form an internal compliance review actually asks for.",
  },
  {
    title: "A named contact",
    body: "Technical questions answered by someone who can read the certificate. No account manager relaying between you and the people who know the answer.",
  },
];

export default function BusinessPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Contact", href: "/contact" },
            { name: "Business Accounts", href: "/contact/business" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Business Accounts"
        title={"Labs, clinics\n& institutions"}
        body="Accounts for laboratories, research groups, clinics and contract organisations. Built around the two things institutional work actually needs: consistency across a study, and documentation that survives a compliance review."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
          { name: "Business Accounts", href: "/contact/business" },
        ]}
        meta={[
          { label: "Typical reply", value: "Within one business day" },
          { label: "Answered by", value: "The research desk" },
          { label: "Batch reservation", value: "Available" },
          { label: "Automated outreach", value: "None" },
        ]}
      />

      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="type-label text-carbon/45">What an account adds</h2>
              <ul className="mt-8 border-t border-carbon/15">
                {POINTS.map((point, i) => (
                  <Reveal key={point.title} delay={i * 0.07} as="li">
                    <div className="border-b border-carbon/12 py-7">
                      <h3 className="type-title-s text-carbon">
                        {point.title}
                      </h3>
                      <p className="type-body-s mt-3 text-carbon/62">
                        {point.body}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ul>

              <Reveal delay={0.3} className="mt-10">
                <WhatsAppCTA intent="specialist" tone="light" />
                <p className="type-body-s mt-6 text-carbon/55">
                  Or write to{" "}
                  <a
                    href={`mailto:${site.labEmail}`}
                    className="underline underline-offset-4"
                  >
                    {site.labEmail}
                  </a>
                  .
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <h2 className="type-display-s max-w-[16ch]">
                Tell us about the study
              </h2>
              <p className="type-body mt-8 max-w-[54ch] text-carbon/62">
                Compounds, duration and whether consistency across a single
                batch matters. That is usually enough for the first reply to be
                useful rather than procedural.
              </p>
              <div className="mt-12">
                <EnquiryForm />
              </div>

              <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-carbon/12 pt-8">
                <Link
                  href="/contact"
                  className="type-label text-carbon/62 transition-colors duration-400 ease-brand hover:text-carbon"
                >
                  General inquiry
                </Link>
                <Link
                  href="/contact/wholesale"
                  className="type-label text-carbon/62 transition-colors duration-400 ease-brand hover:text-carbon"
                >
                  Wholesale &amp; distribution
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallToAction
        eyebrow="Enquiries"
        title={"Consistency across\na long study."}
        body="Batch reservation and scheduled release are the two mechanisms that keep a multi-month protocol on one lot. Ask the desk how they apply to yours."
        secondary={{ label: "Lab results", href: "/lab-results" }}
      />
    </>
  );
}
