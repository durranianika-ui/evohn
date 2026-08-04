import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { pillars } from "@/data/standards";

/**
 * The four-panel verification sequence.
 * Counters run `01 / 04` in the brand's label voice.
 */
export function Pillars() {
  return (
    <section className="section-y-home bg-carbon text-soft">
      <div className="container-home">
        <Stagger className="grid gap-px border border-soft/12 bg-soft/12 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar, i) => (
            <StaggerItem key={pillar.title} className="bg-carbon">
              <article className="flex h-full flex-col justify-between gap-16 p-9 lg:p-11">
                <div>
                  <span className="type-label tabular-nums text-soft/55">
                    {String(i + 1).padStart(2, "0")} / {String(pillars.length).padStart(2, "0")}
                  </span>
                  <h3 className="type-title mt-8 whitespace-pre-line text-soft">
                    {pillar.title}
                  </h3>
                </div>
                <p className="type-body-s text-soft/55">{pillar.body}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.2} className="mt-14">
          <p className="type-body-s max-w-[62ch] text-soft/55">
            Purity figures quoted anywhere on this site are measured values
            published per batch on the certificate of analysis — not
            specifications, and not targets.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
