import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { channels, enquiryRoutes, location, supportAreas } from "@/data/contact";
import { breadcrumbSchema, organisationSchema } from "@/lib/schema";
import { whatsappHref, whatsappConfigured } from "@/lib/whatsapp";
import { disclaimer, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the EVOHN research desk — compound questions, certificate retrieval, handling guidance, institutional accounts and distribution enquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          organisationSchema(),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Contact", href: "/contact" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Contact"
        title={"Talk to the\nresearch desk"}
        body="Every enquiry is answered by someone who can read the certificate rather than quote a policy. There is no automated sales follow-up, no sequence, and no cart — the conversation is the whole mechanism."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
        meta={[
          { label: "Typical reply", value: "Within one business day" },
          { label: "Answered by", value: "The research desk" },
          { label: "Automated outreach", value: "None" },
          { label: "Based in", value: `${site.address.city}, UAE` },
        ]}
      />

      {/* Channels + form */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            {/* Channels */}
            <div className="lg:col-span-4">
              <h2 className="type-label text-carbon/45">Channels</h2>

              <ul className="mt-8 border-t border-carbon/15">
                {channels.map((channel, i) => {
                  const href =
                    channel.href === "#whatsapp"
                      ? whatsappConfigured
                        ? whatsappHref(undefined, "general")
                        : `mailto:${site.email}`
                      : channel.href;
                  const external = channel.href === "#whatsapp";

                  return (
                    <Reveal key={channel.label} delay={i * 0.06} as="li">
                      <a
                        href={href}
                        {...(external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="group/ch block border-b border-carbon/12 py-6"
                      >
                        <span className="type-label text-carbon/45">
                          {channel.label}
                        </span>
                        <span className="type-title-s mt-2 block text-carbon">
                          <span className="relative inline">
                            {channel.value}
                            <span
                              aria-hidden
                              className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/ch:w-full motion-reduce:transition-none"
                            />
                          </span>
                        </span>
                        <span className="type-body-s mt-2 block text-carbon/55">
                          {channel.detail}
                        </span>
                      </a>
                    </Reveal>
                  );
                })}
              </ul>

              <Reveal delay={0.25} className="mt-10">
                <WhatsAppCTA intent="specialist" tone="light" />
              </Reveal>

              {/* Hours */}
              <Reveal delay={0.3} className="mt-14">
                <h3 className="type-label text-carbon/45">Desk hours</h3>
                <dl className="mt-6 border-t border-carbon/12">
                  {location.hours.map((row) => (
                    <div
                      key={row.days}
                      className="flex items-baseline justify-between gap-6 border-b border-carbon/12 py-4"
                    >
                      <dt className="type-body-s text-carbon/72">{row.days}</dt>
                      <dd className="type-body-s tabular-nums text-carbon">
                        {row.time}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            {/* Form */}
            <div className="lg:col-span-7 lg:col-start-6">
              <h2 className="type-display-s max-w-[16ch]">
                Send it in writing
              </h2>
              <p className="type-body mt-8 max-w-[54ch] text-carbon/62">
                If a compound, a batch number or a certificate is involved,
                naming it here means the first reply can answer rather than ask.
              </p>

              <div className="mt-12">
                <EnquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry routes */}
      <section className="section-y bg-carbon text-soft">
        <div className="container-content">
          <SectionHeading
            eyebrow="Enquiry routes"
            title={"Pick the path\nthat fits"}
            body="The routes differ in who answers and what documentation is prepared in advance — not in how quickly you get a reply."
          />

          <ul className="mt-20 grid gap-x-10 gap-y-12 md:grid-cols-3">
            {enquiryRoutes.map((route, i) => (
              <Reveal key={route.id} delay={i * 0.08} as="li">
                <article
                  id={route.id}
                  className="flex h-full scroll-mt-28 flex-col border border-soft/12 p-8"
                >
                  <h3 className="type-title text-soft">{route.title}</h3>
                  <p className="type-body-s mt-5 text-soft/62">{route.body}</p>
                  <ul className="mt-8 flex-1 border-t border-soft/12">
                    {route.points.map((point) => (
                      <li
                        key={point}
                        className="type-body-s border-b border-soft/10 py-3.5 text-soft/55"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                  <WhatsAppCTA
                    intent={
                      route.id === "partners"
                        ? "advisor"
                        : route.id === "institutional"
                          ? "specialist"
                          : "information"
                    }
                    variant="outline"
                    tone="dark"
                    className="mt-8 w-full"
                  />
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Support scope */}
      <section className="section-y bg-mist/50 text-carbon">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="type-label text-carbon/45">What we help with</h2>
              <p className="type-display-s mt-8 max-w-[13ch]">
                Most asked, most useful
              </p>
              <p className="type-body-s mt-8 max-w-[38ch] text-carbon/62">
                Whatever you write about, you are writing to the team rather
                than to a queue. No bots, no automated sales sequence.
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <ul className="border-t border-carbon/15">
                {supportAreas.map((area, i) => (
                  <Reveal key={area.title} delay={i * 0.07} as="li">
                    <div className="grid gap-3 border-b border-carbon/12 py-7 md:grid-cols-12 md:gap-10">
                      <h3 className="type-title-s text-carbon md:col-span-5">
                        {area.title}
                      </h3>
                      <p className="type-body-s text-carbon/68 md:col-span-7">
                        {area.body}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="type-label text-carbon/45">Where we are</h2>
              <p className="type-display-s mt-8 max-w-[14ch]">
                {location.city}
              </p>
              <address className="type-body mt-8 not-italic text-carbon/68">
                {location.line1}
                <br />
                {location.line2}
                <br />
                {location.city}, {location.country}
              </address>
              <p className="type-body-s mt-8 max-w-[44ch] text-carbon/55">
                {location.note}
              </p>
              <Link
                href="/about#facilities"
                className="type-label mt-8 inline-flex items-center gap-3 text-carbon"
              >
                Facilities
                <span aria-hidden>&#8594;</span>
              </Link>
            </div>

            {/*
              Map placeholder. A live embed would load a third-party script and
              set cookies on every visit; the panel below reserves the exact
              space one will occupy so dropping an embed in causes no shift.
            */}
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="relative aspect-4/3 w-full overflow-hidden border border-carbon/12 bg-[linear-gradient(var(--color-mist)_0_0)]">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-60"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(17,17,17,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,17,0.06) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center">
                  <span
                    aria-hidden
                    className="relative block size-12 border border-carbon/25"
                  >
                    <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-carbon/25" />
                    <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-carbon/25" />
                  </span>
                  <span className="type-label text-carbon/45">
                    Map — {location.city}, {location.country}
                  </span>
                  <span className="type-body-s max-w-[36ch] text-carbon/45">
                    An interactive map is not embedded by default: it would load
                    third-party code and set cookies on every visit.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Reveal className="mt-16 border-t border-carbon/12 pt-8">
            <p className="type-body-s max-w-[92ch] text-carbon/55">
              {disclaimer.short}
            </p>
          </Reveal>
        </div>
      </section>

      <CallToAction
        eyebrow="Enquiries"
        title={"Or simply\nopen a chat."}
        body="If it is quicker to ask than to write, the desk is on WhatsApp during the hours above."
        secondary={{ label: "Frequently asked", href: "/faq" }}
      />
    </>
  );
}
