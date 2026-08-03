import { ButtonExternal } from "@/components/ui/Button";
import {
  CTA_LABEL,
  enquiryMessage,
  whatsappHref,
  whatsappConfigured,
  type EnquiryIntent,
} from "@/lib/whatsapp";
import { site } from "@/data/site";

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
 *
 * While the number in `data/site.ts` is still the placeholder, the action
 * falls back to a pre-composed email rather than emitting a `wa.me` link that
 * would resolve to nothing. Replace the number and every CTA on the site
 * switches over with no further change.
 */
export function WhatsAppCTA({
  product,
  intent = product ? "product" : "general",
  label,
  variant = "solid",
  tone = "light",
  className,
}: WhatsAppCTAProps) {
  const text = label ?? CTA_LABEL[intent];
  const message = enquiryMessage(product, intent);

  const href = whatsappConfigured
    ? whatsappHref(product, intent)
    : `mailto:${site.email}?subject=${encodeURIComponent(
        product ? `Enquiry — ${product}` : "Enquiry",
      )}&body=${encodeURIComponent(message)}`;

  const channel = whatsappConfigured ? "WhatsApp" : "email";

  return (
    <ButtonExternal
      href={href}
      variant={variant}
      tone={tone}
      className={className}
      data-analytics="whatsapp-enquiry"
      aria-label={
        product
          ? `${text} about ${product} by ${channel}`
          : `${text} by ${channel}`
      }
    >
      {text}
    </ButtonExternal>
  );
}
