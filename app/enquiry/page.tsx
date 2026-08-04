import type { Metadata } from "next";
import { PageHero } from "@/sections/shared/PageHero";
import { EnquiryList } from "@/components/enquiry/EnquiryList";

export const metadata: Metadata = {
  title: "Enquiry List",
  description:
    "The compounds you have selected, and the enquiry they compose. Stored in your browser only.",
  alternates: { canonical: "/enquiry" },
  // The page renders the visitor's own local selection. There is nothing here
  // for an index to hold.
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Enquiry"
        title="Your list"
        body="EVOHN publishes no prices and takes no orders on this website. This list is a way to raise one enquiry covering several compounds instead of several separate messages — nothing more, and nothing is committed by building it."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Enquiry List", href: "/enquiry" },
        ]}
        meta={[
          { label: "Stored", value: "In your browser" },
          { label: "Transmitted", value: "Only when you send" },
          { label: "Commitment", value: "None" },
        ]}
      />
      <section className="bg-soft text-carbon">
        <EnquiryList />
      </section>
    </>
  );
}
