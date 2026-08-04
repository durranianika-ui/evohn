import type { Metadata } from "next";
import { PageHero } from "@/sections/shared/PageHero";
import { SearchPage } from "@/components/search/SearchPage";
import { searchIndex } from "@/lib/search";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search the EVOHN catalogue, reference library, journal and batch records.",
  alternates: { canonical: "/search" },
  // A results page renders a query the visitor typed. There is nothing here
  // for an index to hold, and every destination it lists is indexed already.
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Search"
        title="Search"
        body="Compound names and their alternative designations, batch numbers, journal titles, research domains, handling guidance and every legal position — one index across the whole site."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Search", href: "/search" },
        ]}
        meta={[
          {
            label: "Indexed entries",
            value: String(searchIndex.length).padStart(3, "0"),
          },
          { label: "Scope", value: "Whole site" },
          { label: "Runs", value: "In your browser" },
        ]}
      />
      <section className="bg-soft text-carbon">
        <SearchPage />
      </section>
    </>
  );
}
