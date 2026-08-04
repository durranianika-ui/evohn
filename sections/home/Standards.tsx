import { SplitText } from "@/components/motion/SplitText";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/common/SectionHeading";
import { DotField } from "@/components/ui/DotField";
import { pillars } from "@/data/standards";
import { cn } from "@/lib/utils";

/**
 * Philosophy and the four standards — one block, not two.
 *
 * Measured off the reference: this is a single 0.98vh block on the warm mist
 * ground, holding a compact editorial opening and then a *row* of four panels
 * side by side. The panel headings sit at x = 61 / 403 / 745 / 1087 at 1440 —
 * a 342px pitch across one row, roughly 600px tall — which is why the whole
 * block resolves inside one viewport despite carrying both elements.
 *
 * Splitting these into two sections was worth ~0.9vh of the page's excess
 * length and broke the reference's pacing: the statement and the evidence for
 * it are meant to arrive together.
 *
 * Panel grounds alternate graphite / sand / graphite / off-white, so the row
 * reads as one object with internal rhythm rather than four cards.
 */
const tones = ["graphite", "sand", "graphite", "light"] as const;

export function Standards() {
  return (
    <section
      id="mission"
      className="scroll-mt-24 bg-mist py-[clamp(3.5rem,7vh,6rem)] text-carbon"
    >
      <div className="container-home">
        {/* Editorial opening — deliberately compact; the reference gives this
            roughly a fifth of the block and spends the rest on the panels. */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal distance={12}>
              <Eyebrow>Our Philosophy</Eyebrow>
            </Reveal>
            <SplitText
              as="h2"
              text={"Precision before promise."}
              className="type-display-s mt-5 max-w-[18ch]"
            />
          </div>

          <div className="max-w-[46ch]">
            <Reveal delay={0.12}>
              <p className="type-body-s text-carbon/62">
                A compound earns the EVOHN name only after it has been measured.
                Purity is determined by analysis and published per lot, and
                confirmed by a laboratory with no stake in the result.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-6">
              <ArrowLink href="/about">The EVOHN Standard</ArrowLink>
            </Reveal>
          </div>
        </div>

        {/* The four standards, one row. */}
        <Stagger
          className="mt-[clamp(2.5rem,5vh,4rem)] grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
          gap={0.07}
        >
          {pillars.map((pillar, i) => {
            const tone = tones[i] ?? "graphite";
            const dark = tone === "graphite";
            return (
              <StaggerItem key={pillar.title}>
                <article
                  className={cn(
                    "group flex h-full flex-col justify-between overflow-hidden rounded-[14px] p-6 transition-transform duration-500 ease-[var(--ease-brand)] xl:aspect-[0.62] xl:p-7 hover:-translate-y-1",
                    dark && "bg-onyx text-soft",
                    tone === "sand" && "bg-[var(--color-cat-growth)] text-carbon",
                    tone === "light" && "bg-soft text-carbon",
                  )}
                >
                  <h3
                    className={cn(
                      "type-title-s whitespace-pre-line",
                      dark ? "text-soft" : "text-carbon",
                    )}
                  >
                    {pillar.title}
                  </h3>

                  <DotField
                    className="my-6 hidden xl:block"
                    tone={dark ? "light" : "dark"}
                  />

                  <div>
                    <span
                      className={cn(
                        "type-label tabular-nums",
                        dark ? "text-soft/60" : "text-carbon/60",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")} / {String(pillars.length).padStart(2, "0")}
                    </span>
                    <p
                      className={cn(
                        "type-body-s mt-3",
                        dark ? "text-soft/55" : "text-carbon/62",
                      )}
                    >
                      {pillar.body}
                    </p>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal delay={0.2} className="mt-8">
          <p className="type-body-s max-w-[62ch] text-carbon/55">
            Purity figures quoted anywhere on this site are measured values
            published per batch on the certificate of analysis — not
            specifications, and not targets.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
