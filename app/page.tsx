import type { Metadata } from "next";
import { Hero } from "@/sections/home/Hero";
import { Standards } from "@/sections/home/Standards";
import { Research } from "@/sections/home/Research";
import { Domains } from "@/sections/home/Domains";
import { Collection } from "@/sections/home/Collection";
import { Transition } from "@/sections/home/Transition";
import { Facilities } from "@/sections/home/Facilities";
import { Researchers } from "@/sections/home/Researchers";
import { Performance } from "@/sections/home/Performance";
import { organisationSchema, websiteSchema } from "@/lib/schema";
import { JsonLd } from "@/components/common/JsonLd";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Home — the reference experience, EVOHN's content.
 *
 * The order is the reference's own homepage order, section for section:
 *
 *   01  Hero          the product film band under the fixed header
 *   02  Standards     philosophy, then the four-card interactive row
 *   03  Research      the dot-wave introduction, one viewport, centred
 *   04  Domains       the oversized interactive domain index
 *   05  Collection    pinned horizontal walk through all nine presentations
 *   06  Transition    the dark-to-light dissolve and the standard band
 *   07  Facilities    built by researchers — statement, then the photo row
 *   08  Researchers   the sticky-column documentation block (existing)
 *   09  Performance   its mirrored pair, carrying the closing statement
 *
 * Verification and Evidence left the homepage in this pass: the reference
 * has no counterpart between the collection and the researcher blocks, and
 * their content remains reachable at /science and /quality, both still
 * linked from the navigation and footer.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={[organisationSchema(), websiteSchema()]} />
      <Hero />
      <Standards />
      <Research />
      <Domains />
      <Collection />
      <Transition />
      <Facilities />
      <Researchers />
      <Performance />
    </>
  );
}
