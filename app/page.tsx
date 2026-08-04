import type { Metadata } from "next";
import { Hero } from "@/sections/home/Hero";
import { Standards } from "@/sections/home/Standards";
import { Domains } from "@/sections/home/Domains";
import { Collection } from "@/sections/home/Collection";
import { Verification } from "@/sections/home/Verification";
import { Evidence } from "@/sections/home/Evidence";
import { Researchers } from "@/sections/home/Researchers";
import { Performance } from "@/sections/home/Performance";
import { organisationSchema, websiteSchema } from "@/lib/schema";
import { JsonLd } from "@/components/common/JsonLd";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Home.
 *
 * Eight blocks, matching the reference measured at all seven audit widths.
 * Target heights in viewport multiples, with the ground each sits on:
 *
 *   1  1.00  #0a0a0a  Hero            one viewport, film behind
 *   2  0.98  #edeae3  Standards       philosophy and the four-panel row
 *   3  2.18  #111110  Domains         the eight research domains
 *   4  4.00  inherit  Collection      pinned, four viewports of horizontal travel
 *   5  1.60  #f5f4f0  Verification    how a batch is actually verified
 *   6  0.89  #0a0a0a  Evidence        the certification grid
 *   7  2.51  #0a0a0a  Researchers     sticky column, panels travelling past
 *   8  2.51  #0a0a0a  Performance     the same composition, mirrored
 *
 * That sums to 15.67vh; the reference document is 16.74vh, the balance being
 * the footer at ~1.06vh.
 *
 * Four sections previously at this level are gone from the homepage and only
 * the homepage: TrustBand, Stacks, Resources, Reading and Voices have no
 * reference counterpart, and Standard and CallToAction were standalone blocks
 * the reference does not have — their content now closes the Performance
 * block, which is where the reference puts its own final statement before the
 * footer. Everything remains reachable at /stacks, /science, /journal,
 * /reviews and /quality, all still linked from the navigation and footer.
 *
 * Philosophy and Pillars were merged rather than stacked: the reference treats
 * the statement and the evidence for it as one continuous composition, and
 * running them as two blocks was worth roughly 0.9vh of excess page length.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={[organisationSchema(), websiteSchema()]} />
      <Hero />
      <Standards />
      <Domains />
      <Collection />
      <Verification />
      <Evidence />
      <Researchers />
      <Performance />
    </>
  );
}
