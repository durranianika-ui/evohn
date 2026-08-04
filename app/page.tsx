import type { Metadata } from "next";
import { Hero } from "@/sections/home/Hero";
import { TrustBand } from "@/sections/home/TrustBand";
import { Philosophy } from "@/sections/home/Philosophy";
import { Pillars } from "@/sections/home/Pillars";
import { Domains } from "@/sections/home/Domains";
import { Collection } from "@/sections/home/Collection";
import { Stacks } from "@/sections/home/Stacks";
import { Verification } from "@/sections/home/Verification";
import { Evidence } from "@/sections/home/Evidence";
import { Resources } from "@/sections/home/Resources";
import { Reading } from "@/sections/home/Reading";
import { Voices } from "@/sections/home/Voices";
import { Standard } from "@/sections/home/Standard";
import { CallToAction } from "@/sections/shared/CallToAction";
import { organisationSchema, websiteSchema } from "@/lib/schema";
import { JsonLd } from "@/components/common/JsonLd";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Home.
 *
 * Fourteen movements. The tones below were measured against the rendered
 * page, not asserted — no two adjacent sections share a ground except where
 * the pairing is deliberate (Hero into TrustBand, Standard into the closing
 * call, both of which read as one dark movement):
 *
 *   dark   Hero            the statement
 *   dark   TrustBand       the figures, immediately, before any more claims
 *   light  Philosophy      why the standard exists
 *   dark   Pillars         the four numbered standards
 *   mist   Domains         the eight research domains
 *   light  Collection      six compounds
 *   mist   Stacks          how compounds are studied together
 *   dark   Verification    how a batch is actually verified
 *   light  Evidence        three real certificates
 *   dark   Resources       the four research tools
 *   light  Reading         the journal
 *   mist   Voices          what comes back from the bench
 *   dark   Standard        the closing brand statement
 *   dark   CallToAction    the one thing to do next
 *
 * The former `Editorial` section was removed here: it rendered its own
 * journal preview and its own review block, which `Reading` and `Voices`
 * now do with a lead-plus-two composition and a computed review aggregate.
 * Two of each on one page was the duplication, not the depth.
 *
 * The order is an argument, read top to bottom: what we believe, how we prove
 * it, what the catalogue holds, how those compounds are studied, the evidence
 * for the claim, the tools built on it, what we have written, who says so, and
 * who we are.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={[organisationSchema(), websiteSchema()]} />
      <Hero />
      <TrustBand />
      <Philosophy />
      <Pillars />
      <Domains />
      <Collection />
      <Stacks />
      <Verification />
      <Evidence />
      <Resources />
      <Reading />
      <Voices />
      <Standard />
      <CallToAction secondary={{ label: "View Catalogue", href: "/catalogue" }} />
    </>
  );
}
