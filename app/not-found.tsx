import Link from "next/link";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA";
import { Wordmark } from "@/components/ui/Wordmark";
import { menuIndex } from "@/data/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * 404.
 *
 * A dead end that offers the whole map rather than one "go home" button: the
 * same index the Menu control opens, so whatever the visitor was looking for
 * is one click away if it exists at all.
 *
 * (The previous copy promised "the catalogue index below" and then showed
 * nothing below it.)
 */
export default function NotFound() {
  return (
    <section className="bg-ink text-soft">
      <div className="container-content py-32 md:py-40">
        <Wordmark className="text-[1.1rem] text-soft/55" />

        <p className="type-label mt-16 text-soft/55">Error 404</p>

        <h1 className="type-display mt-8 max-w-[16ch] text-soft">
          This page is not in the catalogue
        </h1>

        <p className="type-body mt-9 max-w-[52ch] text-soft/55">
          The address you followed does not resolve. Everything the site
          currently presents is listed below.
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <ButtonLink href="/catalogue" tone="dark">
            View Catalogue
          </ButtonLink>
          <ButtonLink href="/search" variant="outline" tone="dark">
            Search the site
          </ButtonLink>
          <WhatsAppCTA intent="advisor" variant="outline" tone="dark" />
        </div>

        <div className="mt-24 grid gap-12 border-t border-soft/12 pt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {menuIndex.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="type-label text-soft/40">{column.heading}</h2>
              <ul className="mt-6 space-y-1">
                {column.links.map((link) => (
                  <li key={link.href}>
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
        </div>
      </div>
    </section>
  );
}
