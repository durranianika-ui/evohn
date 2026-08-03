import { Marquee } from "@/components/motion/Marquee";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Eyebrow } from "@/components/common/SectionHeading";
import { ArrowLink } from "@/components/ui/Button";
import { capabilities } from "@/data/standards";
import { site } from "@/data/site";

export function Standard() {
  return (
    <section className="bg-carbon text-soft">
      {/* Continuous band — the brand statement, repeated. */}
      <div className="border-y border-soft/12 py-7">
        <Marquee
          text={`The ${site.name} Standard`}
          className="type-display-s text-soft/40"
          speed={54}
        />
      </div>

      <div className="container-content section-y">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Reveal distance={12}>
              <Eyebrow>The Facility</Eyebrow>
            </Reveal>

            <SplitText
              as="h2"
              text={"Built by\nscientists."}
              className="type-display mt-8 text-soft"
            />

            <Reveal delay={0.14} className="mt-10">
              <p className="type-body max-w-[46ch] text-soft/55">
                Classified cleanrooms, analytical laboratories and precision
                formulation suites, staffed by people who understand what a
                research programme depends on. Every compound is synthesised,
                verified and dispatched under documented protocol.
              </p>
            </Reveal>

            <Reveal delay={0.24} className="mt-12">
              <ArrowLink href="/quality" className="text-soft">
                Our Science
              </ArrowLink>
            </Reveal>
          </div>

          <Stagger className="lg:col-span-6 lg:col-start-7">
            <ul className="border-t border-soft/12">
              {capabilities.map((item, i) => (
                <StaggerItem key={item.title} distance={18}>
                  <li className="flex gap-8 border-b border-soft/12 py-8">
                    <span className="type-label shrink-0 tabular-nums text-soft/55">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="type-title-s text-soft">{item.title}</h3>
                      <p className="type-body-s mt-3 max-w-[46ch] text-soft/55">
                        {item.body}
                      </p>
                    </div>
                  </li>
                </StaggerItem>
              ))}
            </ul>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
