import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA";
import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";
import { categories } from "@/data/categories";
import { disclaimer, footerNav, site } from "@/data/site";
import { legalDocuments } from "@/data/legal";

const year = 2026;

/**
 * Footer.
 *
 * Five link groups — the four declared in `footerNav`, plus a Legal column
 * generated from `data/legal.ts` so publishing a document adds its footer
 * link automatically and none can be orphaned.
 *
 * There is no Social group. EVOHN has no verified profile to link to, and a
 * row of dead icons is worse than an honest absence.
 */
export function Footer() {
  return (
    <footer className="bg-ink text-soft">
      {/* Assurance band — the same proof points that open the home page. */}
      <div className="border-b border-soft/10 py-6">
        <Marquee
          text={site.assurances.join("  ·  ")}
          repeat={2}
          speed={68}
          className="type-label text-soft/35"
        />
      </div>

      <div className="container-content pt-24 pb-10 md:pt-32">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          {/* Brand + enquiry */}
          <div className="lg:col-span-3">
            <Reveal>
              <Wordmark className="text-[1.35rem]" />
              <p className="type-body-s mt-8 max-w-[34ch] text-soft/55">
                {site.tagline}
              </p>
              <WhatsAppCTA intent="information" tone="dark" className="mt-10" />

              <address className="type-body-s mt-10 space-y-1 not-italic text-soft/45">
                <p>{site.address.line2}</p>
                <p>
                  {site.address.city}, {site.address.country}
                </p>
                <p className="pt-3">
                  <a
                    href={`mailto:${site.email}`}
                    className="transition-colors duration-400 ease-brand hover:text-soft"
                  >
                    {site.email}
                  </a>
                </p>
              </address>
            </Reveal>
          </div>

          {/* Structured link groups */}
          {footerNav.map((column) => (
            <nav
              key={column.heading}
              aria-label={column.heading}
              className="lg:col-span-2"
            >
              <h2 className="type-label text-soft/45">{column.heading}</h2>
              <ul className="mt-7 space-y-3.5">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="type-body-s inline-flex min-h-6 items-center text-soft/60 transition-colors duration-400 ease-brand hover:text-soft"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Legal — generated, never hand-maintained. */}
          <nav aria-label="Legal" className="lg:col-span-1">
            <h2 className="type-label text-soft/45">Legal</h2>
            <ul className="mt-7 space-y-3.5">
              {legalDocuments.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    href={doc.path}
                    className="type-body-s inline-flex min-h-6 items-center text-soft/60 transition-colors duration-400 ease-brand hover:text-soft"
                  >
                    {doc.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Research domains — a colour key as much as a link list. */}
        <nav
          aria-label="Research domains"
          className="mt-20 border-t border-soft/10 pt-10"
        >
          <h2 className="type-label text-soft/45">Domains</h2>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/catalogue?domain=${category.slug}`}
                  className="type-body-s inline-flex min-h-6 items-center gap-3 text-soft/60 transition-colors duration-400 ease-brand hover:text-soft"
                >
                  <span
                    className="size-1.5 rounded-dot ring-1 ring-soft/20"
                    style={{ backgroundColor: category.token }}
                    aria-hidden
                  />
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Oversized wordmark as a graphic rule */}
        <div className="mt-24 overflow-hidden md:mt-32" aria-hidden>
          <Wordmark className="block w-full text-center text-[clamp(3rem,15vw,13rem)] leading-none text-soft/8" />
        </div>

        <div className="mt-16 border-t border-soft/10 pt-10">
          <p className="type-body-s max-w-[92ch] text-soft/55">
            {disclaimer.short}
          </p>

          <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="type-label text-soft/55">
              &copy; {year} {site.name}. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <p className="type-label text-soft/40">
                {site.address.country}
              </p>
              <Link
                href="/research-use-only"
                className="type-label inline-flex min-h-6 items-center text-soft/55 transition-colors duration-400 ease-brand hover:text-soft/80"
              >
                Research use only
              </Link>
              <Link
                href="/legal"
                className="type-label inline-flex min-h-6 items-center text-soft/55 transition-colors duration-400 ease-brand hover:text-soft/80"
              >
                Legal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
