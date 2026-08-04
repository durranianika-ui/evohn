import type { Metadata } from "next";
import { Hero } from "@/sections/home/Hero";
import { TrustBand } from "@/sections/home/TrustBand";
import { Philosophy } from "@/sections/home/Philosophy";
import { Pillars } from "@/sections/home/Pillars";
import { Domains } from "@/sections/home/Domains";
import { Collection } from "@/sections/home/Collection";
import { Stacks } from "@/sections/home/Stacks";
import { Editorial } from "@/sections/home/Editorial";
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
 * Fifteen movements, alternating dark and light so the page has a pulse
 * rather than a scroll length:
 *
 *   dark   Hero            the statement
 *   dark   TrustBand       the figures, immediately, before any more claims
 *   light  Philosophy      why the standard exists
 *   dark   Pillars         the four numbered standards
 *   light  Domains         the eight research domains
 *   light  Collection      six compounds
 *   dark   Stacks          how compounds are studied together
 *   dark   Editorial       the facility, at full bleed
 *   dark   Verification    how a batch is actually verified
 *   light  Evidence        three real certificates
 *   dark   Resources       the four research tools
 *   light  Reading         the journal
 *   mist   Voices          what comes back from the bench
 *   light  Standard        the closing brand statement
 *   dark   CallToAction    the one thing to do next
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
      <Editorial />
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
