import Link from "next/link";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";

export interface Crumb {
  name: string;
  href: string;
}

/**
 * Shared interior page opening.
 *
 * Every route on this site opens dark, which is what allows the navigation
 * to use a single light-on-dark top state throughout.
 */
export function PageHero({
  eyebrow,
  title,
  body,
  crumbs,
  meta,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  crumbs?: Crumb[];
  /** Small key/value pairs shown along the foot of the hero. */
  meta?: { label: string; value: string }[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-soft">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 78% 20%, rgba(214,210,204,0.16) 0%, transparent 68%)",
        }}
      />

      <div className="container-content relative pt-40 pb-24 md:pt-48 md:pb-32">
        {crumbs?.length ? (
          <Reveal distance={10}>
            <nav aria-label="Breadcrumb">
              <ol className="type-label flex flex-wrap items-center gap-2.5 text-soft/55">
                {crumbs.map((crumb, i) => (
                  <li key={crumb.href} className="flex items-center gap-2.5">
                    {i > 0 ? <span aria-hidden>/</span> : null}
                    {i === crumbs.length - 1 ? (
                      <span aria-current="page" className="text-soft/70">
                        {crumb.name}
                      </span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="transition-colors duration-400 ease-brand hover:text-soft"
                      >
                        {crumb.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>
        ) : null}

        <Reveal distance={12} delay={crumbs ? 0.08 : 0}>
          <p className="type-label mt-10 text-soft/55">{eyebrow}</p>
        </Reveal>

        <SplitText
          as="h1"
          text={title}
          className="type-display mt-8 max-w-[16ch] text-soft"
          delay={0.1}
        />

        {body ? (
          <Reveal delay={0.3} className="mt-10">
            <p className="type-body max-w-[56ch] text-soft/55">{body}</p>
          </Reveal>
        ) : null}

        {meta?.length ? (
          <Reveal delay={0.4} className="mt-16 border-t border-soft/12 pt-8">
            <dl className="grid grid-cols-2 gap-y-6 md:grid-cols-4">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="type-label text-soft/55">{item.label}</dt>
                  <dd className="type-body-s mt-2 text-soft/75">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
