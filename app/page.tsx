import type { Metadata } from "next";
import { Hero } from "@/sections/home/Hero";
import { Philosophy } from "@/sections/home/Philosophy";
import { Pillars } from "@/sections/home/Pillars";
import { Domains } from "@/sections/home/Domains";
import { Collection } from "@/sections/home/Collection";
import { Standard } from "@/sections/home/Standard";
import { Verification } from "@/sections/home/Verification";
import { Evidence } from "@/sections/home/Evidence";
import { CallToAction } from "@/sections/shared/CallToAction";
import { organisationSchema, websiteSchema } from "@/lib/schema";
import { JsonLd } from "@/components/common/JsonLd";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Home.
 *
 * The sequence and the grounds below were measured off the reference at
 * 1440x900 — eight blocks, not fourteen, with these heights and these
 * background changes:
 *
 *   0  dark   Hero           900px   #0a0a0a  one viewport, film behind
 *   1  mist   Philosophy     886px   #edeae3  the single ground change up top
 *   2  onyx   Pillars       2140px   #111110  the four standards
 *   3  dark   Domains       3600px            pinned — four viewports of scroll
 *   4  light  Collection    1443px   #f5f4f0  the horizontal collection
 *   5  dark   Standard       805px   #0a0a0a  the repeating brand line
 *   6  dark   Verification  2258px   #0a0a0a  how a batch is verified
 *   7  dark   Evidence      2258px   #0a0a0a  the certification grid
 *
 * The closing call keeps the dark ground it inherits, so 5 through 8 read as
 * one long dark movement rather than four separate panels — which is what the
 * reference does with its own tail.
 *
 * Five sections were removed from this page, not deleted from the site:
 * TrustBand, Stacks, Resources, Reading and Voices have no counterpart in the
 * reference sequence and were what made the page read as a dashboard. Their
 * content still lives on `/stacks`, `/science`, `/journal` and `/reviews`,
 * all of which remain linked from the navigation and the footer.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={[organisationSchema(), websiteSchema()]} />
      <Hero />
      <Philosophy />
      <Pillars />
      <Domains />
      <Collection />
      <Standard />
      <Verification />
      <Evidence />
      <CallToAction secondary={{ label: "View Catalogue", href: "/catalogue" }} />
    </>
  );
}
