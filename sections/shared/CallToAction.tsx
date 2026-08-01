import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/common/SectionHeading";
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA";
import { ButtonLink } from "@/components/ui/Button";

interface CallToActionProps {
  eyebrow?: string;
  title?: string;
  body?: string;
  /** Names the compound in the WhatsApp message. */
  product?: string;
  /** Adds a secondary link back into the catalogue. */
  secondary?: { label: string; href: string };
}

/**
 * The closing panel used at the foot of every page.
 * There is no form and no checkout — the action is a conversation.
 */
export function CallToAction({
  eyebrow = "Enquiries",
  title = "Your research\ndeserves certainty.",
  body = "Every enquiry is handled by a specialist. Ask about specification, documentation, or what can be supplied to your territory — before anything else is discussed.",
  product,
  secondary,
}: CallToActionProps) {
  return (
    <section className="section-y bg-ink text-soft">
      <div className="container-content">
        <div className="flex flex-col items-center text-center">
          <Reveal distance={12}>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>

          <SplitText
            as="h2"
            text={title}
            className="type-display mt-8 max-w-[16ch] text-soft"
          />

          <Reveal delay={0.14} className="mt-9 max-w-[54ch]">
            <p className="type-body text-soft/55">{body}</p>
          </Reveal>

          <Reveal delay={0.24} className="mt-12 flex flex-wrap justify-center gap-4">
            <WhatsAppCTA
              product={product}
              intent={product ? "product" : "advisor"}
              tone="dark"
            />
            {secondary ? (
              <ButtonLink href={secondary.href} variant="outline" tone="dark">
                {secondary.label}
              </ButtonLink>
            ) : null}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
