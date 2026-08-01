/**
 * Single source of truth for brand-level content.
 * Editing this file is the intended way to update contact details,
 * navigation and legal copy — no component changes required.
 */

export const site = {
  name: "EVOHN",
  /** Brand Identity Kit — cover statement. */
  tagline: "Scientific Precision. Luxury Performance. Research Excellence.",
  description:
    "EVOHN presents a precision-manufactured research peptide catalogue. Analytically verified, batch traceable, and documented at every step.",
  /**
   * Canonical origin. Override with NEXT_PUBLIC_SITE_URL when the build is
   * served from somewhere else (a preview deployment, GitHub Pages) so
   * canonicals, the sitemap and JSON-LD all point at the right host.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://evohn.com",
  locale: "en_GB",

  /**
   * PLACEHOLDER — replace with the live number.
   * Digits are stripped automatically when the wa.me link is built,
   * so any formatting here is safe.
   */
  whatsapp: "+971XXXXXXXXX",
  email: "enquiries@evohn.com",

  /** Brand Identity Kit §12 "BRAND VOICE". */
  voice: {
    are: ["Scientific", "Precise", "Dedicated", "Trusted"],
    areNot: ["Loud", "Flashy", "Overpromising", "Trendy"],
  },
} as const;

export const nav = [
  { label: "Catalogue", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Science", href: "/science" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Informational-use disclaimer. Shown in the footer and on every
 * product page. Deliberately makes no therapeutic or medical claim.
 */
export const disclaimer = {
  short:
    "This catalogue is presented for informational purposes only. It is not an offer of sale, and it makes no medical or therapeutic claim.",
  long: "All content on this website is provided for informational and reference purposes only. Nothing presented here constitutes medical advice, a therapeutic claim, a diagnosis, or an offer to sell. Product entries describe compounds as characterised in published scientific literature; they do not represent statements of efficacy or safety. Availability, presentation and permitted use are subject to the regulations of each jurisdiction, and it is the responsibility of the reader to ensure compliance with applicable local law. EVOHN makes no representation that any compound described is approved for human or veterinary use in any territory.",
} as const;
