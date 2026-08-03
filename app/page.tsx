import type { Metadata } from "next";
import { Hero } from "@/sections/home/Hero";
import { Philosophy } from "@/sections/home/Philosophy";
import { Pillars } from "@/sections/home/Pillars";
import { Domains } from "@/sections/home/Domains";
import { Collection } from "@/sections/home/Collection";
import { Stacks } from "@/sections/home/Stacks";
import { Verification } from "@/sections/home/Verification";
import { Editorial } from "@/sections/home/Editorial";
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
 * The order is an argument, read top to bottom: what we believe, how we prove
 * it, what the catalogue holds, how those compounds are studied together, the
 * evidence for the claim, what we have written about it, and who we are.
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
      <Stacks />
      <Verification />
      <Editorial />
      <Standard />
      <CallToAction secondary={{ label: "View Catalogue", href: "/catalogue" }} />
    </>
  );
}
