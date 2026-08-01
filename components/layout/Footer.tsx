import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA";
import { Reveal } from "@/components/motion/Reveal";
import { categories } from "@/data/categories";
import { disclaimer, nav, site } from "@/data/site";

const year = 2026;

export function Footer() {
  return (
    <footer className="bg-ink text-soft">
      <div className="container-content pt-24 pb-10 md:pt-32">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          {/* Brand + enquiry */}
          <div className="lg:col-span-5">
            <Reveal>
              <Wordmark className="text-[1.35rem]" />
              <p className="type-body-s mt-8 max-w-[34ch] text-soft/55">
                {site.tagline}
              </p>
              <WhatsAppCTA
                intent="information"
                tone="dark"
                className="mt-10"
              />
            </Reveal>
          </div>

          {/* Categories */}
          <nav aria-label="Categories" className="lg:col-span-3">
            <h2 className="type-label text-soft/55">Catalogue</h2>
            <ul className="mt-7 space-y-3.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="type-body-s inline-flex items-center gap-3 text-soft/60 transition-colors duration-400 ease-brand hover:text-soft"
                  >
                    <span
                      className="size-1.5 rounded-full ring-1 ring-soft/20"
                      style={{ backgroundColor: category.token }}
                      aria-hidden
                    />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Pages */}
          <nav aria-label="Footer" className="lg:col-span-2">
            <h2 className="type-label text-soft/55">Navigate</h2>
            <ul className="mt-7 space-y-3.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="type-body-s text-soft/60 transition-colors duration-400 ease-brand hover:text-soft"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h2 className="type-label text-soft/55">Contact</h2>
            <ul className="mt-7 space-y-3.5">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="type-body-s text-soft/60 transition-colors duration-400 ease-brand hover:text-soft"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <span className="type-body-s text-soft/60">{site.whatsapp}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Oversized wordmark as a graphic rule */}
        <div className="mt-24 overflow-hidden md:mt-32" aria-hidden>
          <Wordmark className="block w-full text-center text-[clamp(3rem,15vw,13rem)] leading-none text-soft/8" />
        </div>

        <div className="mt-16 border-t border-soft/10 pt-10">
          <p className="type-body-s max-w-[92ch] text-soft/55">
            {disclaimer.short}
          </p>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="type-label text-soft/55">
              &copy; {year} {site.name}. All rights reserved.
            </p>
            <div className="flex gap-8">
              <Link
                href="/legal"
                className="type-label text-soft/55 transition-colors duration-400 ease-brand hover:text-soft/70"
              >
                Legal &amp; Disclaimer
              </Link>
              <Link
                href="/contact"
                className="type-label text-soft/55 transition-colors duration-400 ease-brand hover:text-soft/70"
              >
                Enquiries
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
