import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA";
import { VialGlyph } from "@/components/product/VialGlyph";
import { asset, hasAsset } from "@/lib/media";
import Image from "next/image";

const marks = [
  "≥ 99% HPLC Verified",
  "Batch Traceable",
  "Cold-Chain Shipped",
  "Third-Party Tested",
];

/**
 * Opening statement.
 *
 * Follows Brand Identity Kit §11 "WEBSITE DIRECTION": monochrome ground,
 * elegant typography left, large photography right. The headline is the
 * brand's own cover statement.
 */
export function Hero() {
  const heroImage = "/editorial/hero-vial.jpg";

  return (
    <section className="relative isolate overflow-hidden bg-ink text-soft">
      {/* Warm pool of light behind the product — kit §07 photography style. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 h-full w-full max-w-[62rem] opacity-70 lg:w-3/5"
        style={{
          background:
            "radial-gradient(58% 52% at 68% 42%, rgba(214,210,204,0.30) 0%, rgba(214,210,204,0.10) 42%, transparent 72%)",
        }}
      />

      <div className="container-content relative flex min-h-dvh flex-col justify-center pt-26 pb-8">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
          {/* Statement */}
          <div className="lg:col-span-6 xl:col-span-5">
            <Reveal distance={12}>
              <p className="type-label text-soft/55">Research Compounds</p>
            </Reveal>

            <SplitText
              as="h1"
              text={"Scientific\nPrecision."}
              className="type-display-l mt-6 text-soft"
              delay={0.1}
            />

            <Reveal delay={0.5} className="mt-6">
              <p className="type-editorial max-w-[22ch] text-soft/70">
                Luxury performance. Research excellence.
              </p>
            </Reveal>

            <Reveal delay={0.62} className="mt-5">
              <p className="type-body max-w-[46ch] text-soft/55">
                A precision-manufactured catalogue of research compounds —
                analytically verified, independently confirmed, and documented
                from raw material through to the vial in your hand.
              </p>
            </Reveal>

            <Reveal delay={0.74} className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/products" tone="dark">
                View Catalogue
              </ButtonLink>
              <WhatsAppCTA intent="specialist" variant="outline" tone="dark" />
            </Reveal>
          </div>

          {/* Product */}
          <div className="lg:col-span-6 xl:col-span-7">
            <Reveal
              delay={0.25}
              duration={1.2}
              distance={40}
              className="relative mx-auto w-full max-w-md lg:max-w-none"
            >
              {/* Capped against viewport height so the hero resolves within
                  one screen on short laptop displays. */}
              <div className="relative mx-auto aspect-4/5 w-full max-w-[20rem] sm:max-w-[24rem] lg:aspect-auto lg:h-[min(58vh,620px)] lg:max-w-none">
                {hasAsset(heroImage) ? (
                  <Image
                    src={asset(heroImage)}
                    alt="EVOHN research compound vial on stone"
                    fill
                    priority
                    sizes="(min-width: 1024px) 55vw, 90vw"
                    className="object-contain"
                  />
                ) : (
                  <>
                    {/* Stone plinth — kit §07 "premium shadows, stone texture". */}
                    <div
                      aria-hidden
                      className="absolute inset-x-[18%] bottom-[9%] h-[7%] rounded-[50%] blur-xl"
                      style={{
                        background:
                          "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.65) 0%, transparent 70%)",
                      }}
                    />
                    <VialGlyph
                      caption="Semaglutide"
                      className="animate-drift absolute inset-0 mx-auto h-full w-auto motion-reduce:animate-none"
                      seed={3}
                    />
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Verification marks */}
        <Reveal delay={0.9} className="mt-8 border-t border-soft/12 pt-6 lg:mt-10">
          <ul className="grid grid-cols-2 gap-y-5 md:grid-cols-4">
            {marks.map((mark) => (
              <li key={mark} className="type-label flex items-center gap-3 text-soft/55">
                <span className="h-px w-4 bg-soft/30" aria-hidden />
                {mark}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
