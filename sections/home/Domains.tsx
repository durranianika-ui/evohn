import Link from "next/link";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { categories } from "@/data/categories";
import { productsByCategory } from "@/data/products";

/**
 * The eight research domains, set as an oversized type index.
 * Each row lifts, reveals its swatch as a rule, and shifts on hover.
 */
export function Domains() {
  return (
    <section className="section-y bg-mist text-carbon">
      <div className="container-content">
        <SectionHeading
          eyebrow="Our Research"
          title={"Eight domains.\nOne standard."}
          body="From regenerative peptides to metabolic modulators, every compound in the catalogue passes through the same verification chain. Precision is not a feature of the range — it is the condition of entry."
          size="display"
        />

        <ul className="mt-20 border-t border-carbon/12">
          {categories.map((category, i) => {
            const count = productsByCategory(category.slug).length;

            return (
              <Reveal key={category.slug} as="li" delay={i * 0.04} distance={16}>
                <Link
                  href={`/catalogue?domain=${category.slug}`}
                  className="group/row grid grid-cols-12 items-center gap-4 border-b border-carbon/12 py-7 md:py-9"
                >
                  <span className="type-label col-span-2 tabular-nums text-carbon/62 md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="col-span-10 md:col-span-5">
                    <h3
                      className="type-display-s transition-transform duration-700 ease-brand group-hover/row:translate-x-3 motion-reduce:transition-none"
                    >
                      {category.name}
                    </h3>
                  </div>

                  <p className="type-body-s col-span-9 col-start-3 text-carbon/62 md:col-span-4 md:col-start-7">
                    {category.tagline}
                    <span className="ml-3 tabular-nums text-carbon/62">
                      {String(count).padStart(2, "0")}
                    </span>
                  </p>

                  <div className="col-span-1 flex justify-end md:col-span-2">
                    {/* Swatch grows into a rule on hover. */}
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full ring-1 ring-carbon/15 transition-[width,border-radius] duration-700 ease-brand group-hover/row:w-12 group-hover/row:rounded-none motion-reduce:transition-none"
                      style={{ backgroundColor: category.token }}
                    />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
