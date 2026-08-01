import { site } from "@/data/site";

/**
 * Every call-to-action on this site resolves to WhatsApp.
 * There is no cart, checkout, pricing or account layer by design.
 */

export type EnquiryIntent =
  | "general"
  | "product"
  | "specialist"
  | "information"
  | "advisor";

/** The five CTA voices used across the site. */
export const CTA_LABEL: Record<EnquiryIntent, string> = {
  general: "Enquire Now",
  product: "Enquire Now",
  specialist: "Talk to Specialist",
  information: "Request Information",
  advisor: "Speak with Advisor",
};

/** wa.me accepts digits only — strip formatting and the leading `+`. */
function toWaNumber(raw: string) {
  return raw.replace(/\D/g, "");
}

/**
 * Build the pre-filled message.
 * With a product: "Hello, I'm interested in [PRODUCT NAME]. I would like more information."
 */
export function enquiryMessage(productName?: string, intent: EnquiryIntent = "general") {
  if (productName) {
    return `Hello, I'm interested in ${productName}. I would like more information.`;
  }

  switch (intent) {
    case "specialist":
      return "Hello, I would like to speak with an EVOHN specialist.";
    case "advisor":
      return "Hello, I would like to speak with an EVOHN advisor.";
    case "information":
      return "Hello, I would like to request information about the EVOHN catalogue.";
    default:
      return "Hello, I would like more information about the EVOHN catalogue.";
  }
}

/** Resolve a fully-formed WhatsApp deep link. */
export function whatsappHref(productName?: string, intent: EnquiryIntent = "general") {
  const number = toWaNumber(site.whatsapp);
  const text = encodeURIComponent(enquiryMessage(productName, intent));
  return `https://wa.me/${number}?text=${text}`;
}

/**
 * True once the placeholder has been replaced with a real number.
 * Used to suppress a broken link during the placeholder phase.
 */
export const whatsappConfigured = /^\d{8,15}$/.test(toWaNumber(site.whatsapp));
