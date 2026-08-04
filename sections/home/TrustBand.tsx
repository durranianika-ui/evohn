import { Marquee } from "@/components/motion/Marquee";
import { site } from "@/data/site";
import { labSummary } from "@/data/lab-results";

/**
 * Trust band.
 *
 * Sits immediately under the hero, so the first thing after the statement is
 * the evidence rather than more statement. A single dark strip between two
 * dark sections — it reads as a rule, not as a section.
 *
 * The three figures are computed from the batch records, never typed. If a
 * certificate is added or withdrawn the band changes with it, which is the
 * only way a number on a marketing surface stays true.
 */
export function TrustBand() {
  const figures = [
    {
      value: `${labSummary.meanPurity}%`,
      label: "Mean assayed purity",
    },
    {
      value: String(labSummary.certificates).padStart(2, "0"),
      label: "Published certificates",
    },
    {
      value: String(labSummary.laboratories).padStart(2, "0"),
      label: "Independent laboratories",
    },
  ];

  return (
    <section
      aria-label="Verification summary"
      className="border-y border-soft/10 bg-ink text-soft"
    >
      <div className="container-content grid gap-10 py-12 lg:grid-cols-12 lg:items-center lg:gap-8">
        <dl className="grid grid-cols-3 gap-6 lg:col-span-5">
          {figures.map((figure) => (
            <div key={figure.label}>
              <dt className="type-label text-soft/40">{figure.label}</dt>
              <dd className="type-title mt-2.5 tabular-nums text-soft">
                {figure.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="lg:col-span-7">
          <Marquee
            text={site.assurances.join("  ·  ")}
            repeat={2}
            speed={58}
            className="type-label text-soft/35"
          />
        </div>
      </div>
    </section>
  );
}
