import { ButtonExternal } from "@/components/ui/Button";
import { CTA_LABEL, whatsappHref, type EnquiryIntent } from "@/lib/whatsapp";

interface WhatsAppCTAProps {
  /** When supplied, the message names the product and the label becomes product-specific. */
  product?: string;
  intent?: EnquiryIntent;
  /** Override the default label for this intent. */
  label?: string;
  variant?: "solid" | "outline" | "ghost";
  /** The surface this button sits on. */
  tone?: "dark" | "light";
  className?: string;
}

/**
 * The single enquiry action for the entire site.
 *
 * There is no cart, checkout or ordering layer anywhere in this project —
 * every commercial intent resolves to a WhatsApp conversation with the
 * product already named in the opening message.
 */
export function WhatsAppCTA({
  product,
  intent = product ? "product" : "general",
  label,
  variant = "solid",
  tone = "light",
  className,
}: WhatsAppCTAProps) {
  const href = whatsappHref(product, intent);
  const text = label ?? CTA_LABEL[intent];

  return (
    <ButtonExternal
      href={href}
      variant={variant}
      tone={tone}
      className={className}
      data-analytics="whatsapp-enquiry"
      aria-label={
        product ? `${text} about ${product} on WhatsApp` : `${text} on WhatsApp`
      }
    >
      {text}
    </ButtonExternal>
  );
}
