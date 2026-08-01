import type { Metadata } from "next";
import { Hero } from "@/sections/home/Hero";
import { Philosophy } from "@/sections/home/Philosophy";
import { Pillars } from "@/sections/home/Pillars";
import { Domains } from "@/sections/home/Domains";
import { Collection } from "@/sections/home/Collection";
import { Standard } from "@/sections/home/Standard";
import { CallToAction } from "@/sections/shared/CallToAction";
import { organisationSchema, websiteSchema } from "@/lib/schema";
import { JsonLd } from "@/components/common/JsonLd";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

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
      <CallToAction secondary={{ label: "View Catalogue", href: "/products" }} />
    </>
  );
}
