import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { CallToAction } from "@/sections/shared/CallToAction";
import { StackMedia } from "@/components/product/StackMedia";
import { ProductCard } from "@/components/product/ProductCard";
import { ArticleCard } from "@/components/journal/ArticleCard";
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA";
import { StickyEnquiryBar } from "@/components/common/StickyEnquiryBar";
import { Accordion } from "@/components/ui/Accordion";
import { PurityMeter } from "@/components/lab/PurityMeter";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/common/JsonLd";
import { getCategory } from "@/data/categories";
import { stacks, getStack, stackComponents } from "@/data/stacks";
import { resolveArticles } from "@/data/journal";
import { currentBatch } from "@/data/lab-results";
import { breadcrumbSchema } from "@/lib/schema";
import { disclaimer, site } from "@/data/site";

export function generateStaticParams() {
  return stacks.map((stack) => ({ slug: stack.slug }));
}

export async function generateMetadata(
  props: PageProps<"/stacks/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const stack = getStack(slug);
  if (!stack) return {};

  return {
    title: stack.name,
    description: stack.tagline,
    alternates: { canonical: `/stacks/${stack.slug}` },
    openGraph: {
      type: "website",
      title: `${stack.name} | ${site.name}`,
      description: stack.tagline,
      url: `${site.url}/stacks/${stack.slug}`,
    },
  };
}

export default async function StackPage(props: PageProps<"/stacks/[slug]">) {
  const { slug } = await props.params;
  const stack = getStack(slug);
  if (!stack) notFound();

  const category = getCategory(stack.category);
  const components = stackComponents(stack);
  const reading = resolveArticles(stack.researchLinks);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Stacks", href: "/stacks" },
            { name: stack.name, href: `/stacks/${stack.slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow={stack.eyebrow}
        title={stack.name}
        body={stack.tagline}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Stacks", href: "/stacks" },
          { name: stack.name, href: `/stacks/${stack.slug}` },
        ]}
        meta={[
          { label: "Research domain", value: category.name },
          {
            label: "Components",
            value: String(components.length).padStart(2, "0"),
          },
          { label: "Certification", value: "Per component" },
          { label: "Supply", value: "Never pre-mixed" },
        ]}
      />

      {/* Hero plate + overview */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <Reveal duration={1}>
            <StackMedia
              stack={stack}
              priority
              sizes="100vw"
              className="aspect-16/9 w-full"
            />
          </Reveal>

          <div className="mt-16 grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="type-label text-carbon/45">Overview</h2>
              <p className="type-display-s mt-8 max-w-[13ch]">
                What this grouping is
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              {stack.overview.map((paragraph, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p className="type-body mt-7 max-w-prose text-carbon/72 first:mt-0">
                    {paragraph}
                  </p>
                </Reveal>
              ))}

              <Reveal delay={0.2} className="mt-12 border-t border-carbon/12 pt-8">
                <h3 className="type-label text-carbon/45">Purpose</h3>
                <p className="type-editorial mt-5 max-w-[36ch] text-carbon">
                  {stack.purpose}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Included compounds */}
      <section className="section-y bg-carbon text-soft">
        <div className="container-content">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <h2 className="type-label text-soft/55">Included peptides</h2>
              <p className="type-display-s mt-7 max-w-[16ch] text-soft">
                {String(components.length).padStart(2, "0")} independently
                certified vials
              </p>
            </div>
            <p className="type-body-s max-w-[42ch] text-soft/55">
              Each component carries its own batch number and its own
              certificate of analysis. A stack result is only traceable if every
              batch identifier is recorded.
            </p>
          </div>

          <ul className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {components.map((entry, i) => {
              const batch = currentBatch(entry.product.slug);
              return (
                <Reveal key={entry.product.slug} delay={i * 0.08} as="li">
                  <div className="flex h-full flex-col border border-soft/12 p-8">
                    <p className="type-label tabular-nums text-soft/40">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="type-title mt-5 text-soft">
                      <Link
                        href={`/catalogue/${entry.product.slug}`}
                        className="group/c relative inline-block"
                      >
                        {entry.product.name}
                        <span
                          aria-hidden
                          className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/c:w-full motion-reduce:transition-none"
                        />
                      </Link>
                    </h3>
                    <p className="type-label mt-3 text-soft/45">
                      {entry.product.dosage}
                    </p>
                    <p className="type-body-s mt-6 flex-1 text-soft/62">
                      {entry.role}
                    </p>
                    {batch ? (
                      <PurityMeter
                        purity={batch.purity}
                        tone="dark"
                        className="mt-8"
                      />
                    ) : null}
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Scientific summary + ideal use */}
      <section className="section-y bg-mist/50 text-carbon">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <h2 className="type-label text-carbon/45">Scientific summary</h2>
              <p className="type-body mt-8 max-w-prose text-carbon/72">
                {stack.scientificSummary}
              </p>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <h2 className="type-label text-carbon/45">Ideal research use</h2>
              <Stagger>
                <ul className="mt-8 border-t border-carbon/12">
                  {stack.idealUse.map((item, i) => (
                    <StaggerItem key={item} distance={14}>
                      <li className="flex gap-6 border-b border-carbon/12 py-5">
                        <span className="type-label shrink-0 tabular-nums text-carbon/35">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="type-body-s text-carbon/72">
                          {item}
                        </span>
                      </li>
                    </StaggerItem>
                  ))}
                </ul>
              </Stagger>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol information */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="type-label text-carbon/45">
                Protocol information
              </h2>
              <p className="type-display-s mt-8 max-w-[14ch]">
                How the set is handled
              </p>
              <p className="type-body-s mt-8 max-w-[40ch] text-carbon/62">
                A description of laboratory practice as the published record
                reports it. Nothing here is administration guidance, and none of
                it should be read as such.
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <ol className="border-t border-carbon/12">
                {stack.protocol.map((note, i) => (
                  <Reveal key={note.label} delay={i * 0.07} as="li">
                    <div className="grid gap-3 border-b border-carbon/12 py-7 sm:grid-cols-12 sm:gap-8">
                      <span className="type-label flex gap-4 text-carbon/45 sm:col-span-4">
                        <span className="tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {note.label}
                      </span>
                      <span className="type-body-s text-carbon/72 sm:col-span-8">
                        {note.detail}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </ol>

              <Reveal delay={0.2} className="mt-12">
                <h3 className="type-label text-carbon/45">Storage</h3>
                <p className="type-body mt-5 max-w-prose text-carbon/72">
                  {stack.storage}
                </p>
                <Link
                  href="/science/storage"
                  className="type-label mt-8 inline-flex items-center gap-3 border border-carbon/20 px-7 py-4 text-carbon transition-colors duration-400 ease-brand hover:border-carbon"
                >
                  Storage &amp; handling guide
                  <span aria-hidden>&#8594;</span>
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Research links */}
      {reading.length ? (
        <section className="section-y bg-carbon text-soft">
          <div className="container-content">
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div>
                <h2 className="type-label text-soft/55">Research links</h2>
                <p className="type-display-s mt-7 max-w-[16ch] text-soft">
                  Further reading
                </p>
              </div>
              <Link
                href="/journal"
                className="type-label inline-flex items-center gap-3 text-soft/70 transition-colors hover:text-soft"
              >
                The Journal
                <span aria-hidden>&#8594;</span>
              </Link>
            </div>

            <div className="mt-16 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {reading.map((article, i) => (
                <Reveal key={article.slug} delay={i * 0.08}>
                  <ArticleCard article={article} tone="dark" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQs */}
      <section className="section-y bg-mist/50 text-carbon">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="type-label text-carbon/45">
                Frequently asked
              </h2>
              <p className="type-display-s mt-8 max-w-[13ch]">
                About this grouping
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <Accordion items={stack.faqs} />
              <p className="type-body-s mt-12 text-carbon/55">
                {disclaimer.short}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Components as cards */}
      <section className="section-y bg-soft text-carbon">
        <div className="container-content">
          <h2 className="type-label text-carbon/45">
            Compounds in this grouping
          </h2>
          <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {components.map((entry, i) => (
              <Reveal key={entry.product.slug} delay={i * 0.08}>
                <ProductCard
                  product={entry.product}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                />
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-16 flex flex-wrap gap-4">
            <WhatsAppCTA
              product={stack.name}
              label="Request information"
              tone="light"
            />
            <WhatsAppCTA
              product={stack.name}
              intent="specialist"
              variant="outline"
              tone="light"
            />
          </Reveal>
        </div>
      </section>

      <CallToAction
        eyebrow="Enquiries"
        title={"Discuss the\nprotocol."}
        body={`Ask a specialist about the ${stack.name} — component batches, current documentation, and what can be supplied to your territory.`}
        product={stack.name}
        secondary={{ label: "All stacks", href: "/stacks" }}
      />

      <StickyEnquiryBar product={stack.name} />
    </>
  );
}
