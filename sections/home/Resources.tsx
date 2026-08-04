import Link from "next/link";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { nav } from "@/data/site";

/**
 * Research resources.
 *
 * The four tools from the Science menu, on the home page, as a dark full-width
 * band. Read from `nav` rather than restated, so the menu and this section can
 * never disagree about what the tools are or where they live.
 */
export function Resources() {
  const science = nav.find((item) => item.label === "Science");
  const tools = science?.menu?.links ?? [];
  if (!tools.length) return null;

  return (
    <section className="section-y bg-ink text-soft">
      <div className="container-content">
        <SectionHeading
          eyebrow="Research Tools"
          title={"Instruments,\nnot advice."}
          body="Four tools that convert, reference and describe. None of them selects a quantity, proposes a schedule or evaluates a study — those are decisions for whoever designs the work, and this site takes none of them."
          className="max-w-2xl"
        />

        <ol className="mt-20 border-t border-soft/12">
          {tools.map((tool, i) => (
            <Reveal key={tool.href} delay={i * 0.05} as="li">
              <Link
                href={tool.href}
                className="group/res grid gap-4 border-b border-soft/12 py-9 transition-colors duration-500 ease-brand hover:bg-soft/4 md:grid-cols-12 md:items-baseline md:gap-10 md:px-4 md:py-11"
              >
                <span
                  aria-hidden
                  className="type-label tabular-nums text-soft/30 md:col-span-1"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="type-title text-soft md:col-span-4">
                  <span className="relative inline">
                    {tool.label}
                    <span
                      aria-hidden
                      className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-[width] duration-500 ease-brand group-hover/res:w-full motion-reduce:transition-none"
                    />
                  </span>
                </h3>

                <p className="type-body-s max-w-[54ch] text-soft/55 md:col-span-6">
                  {tool.description}
                </p>

                <span
                  aria-hidden
                  className="type-label text-soft/35 transition-transform duration-500 ease-brand group-hover/res:translate-x-1.5 motion-reduce:transition-none md:col-span-1 md:justify-self-end"
                >
                  &rarr;
                </span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
