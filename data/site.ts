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
  labEmail: "laboratory@evohn.com",
  partnersEmail: "partners@evohn.com",

  /** Registered presence. Shown on Contact and in the footer. */
  address: {
    line1: "EVOHN Research",
    line2: "Dubai Science Park, Al Barsha South",
    city: "Dubai",
    country: "United Arab Emirates",
  },

  /** Support desk hours, in local time. */
  hours: [
    { days: "Monday – Friday", time: "09:00 – 18:00 GST" },
    { days: "Saturday", time: "10:00 – 15:00 GST" },
    { days: "Sunday", time: "Closed" },
  ],

  /** Brand Identity Kit §12 "BRAND VOICE". */
  voice: {
    are: ["Scientific", "Precise", "Dedicated", "Trusted"],
    areNot: ["Loud", "Flashy", "Overpromising", "Trendy"],
  },

  /** Headline proof points, reused by the marquee and trust strips. */
  assurances: [
    "≥ 99% analytical purity",
    "Independent third-party verification",
    "Certificate of analysis per batch",
    "HPLC & mass spectrometry tested",
    "Full batch traceability",
    "Cold-chain controlled handling",
    "Informational catalogue — no sale",
    "Documented at every step",
  ],
} as const;

/* ==========================================================================
   NAVIGATION
   --------------------------------------------------------------------------
   The information architecture is expressed entirely here. `NavItem` covers
   three shapes: a plain link, a link with a compact dropdown, and a link with
   a full-width mega panel. Components read the shape and render accordingly,
   so restructuring the site is a data edit.
   ========================================================================== */

export interface NavLink {
  label: string;
  href: string;
  /** One-line explanation shown inside dropdowns and mega panels. */
  description?: string;
}

export interface NavColumn {
  heading: string;
  links: NavLink[];
}

export interface NavItem {
  label: string;
  /** Present on plain links. Dropdown triggers are buttons and have none. */
  href?: string;
  /** Dropdown panel: one heading and a list of link/description rows. */
  menu?: {
    heading: string;
    links: NavLink[];
  };
}

/**
 * Primary navigation.
 *
 * The order, the labels, the dropdown groupings and the row descriptions
 * mirror the reference information architecture one-for-one. Four sections
 * are additions the brief specifies — Stacks and Strips sit after the
 * catalogue, Research and Blog before About, which is where the second
 * reference places them relative to its own shop and about links.
 *
 * Nothing else is added. A dropdown here is one heading and a flat list of
 * link/description rows; there are no mega panels and no promoted cards,
 * because the reference has neither.
 */
export const nav: NavItem[] = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Stacks", href: "/stacks" },
  { label: "Strips", href: "/strips" },
  {
    label: "Science",
    menu: {
      heading: "Research Tools",
      links: [
        {
          label: "Peptide Pedia",
          href: "/peptide-pedia",
          description: "Explore peptide science",
        },
        {
          label: "Calculator",
          href: "/calculator",
          description: "Reconstitution & dosing tools",
        },
        {
          label: "Reconstitution Guide",
          href: "/reconstitution",
          description: "Mixing & dosing basics",
        },
        {
          label: "Storage & Handling Guide",
          href: "/storage",
          description: "Keep peptides stable",
        },
      ],
    },
  },
  { label: "Journal", href: "/journal" },
  { label: "Lab Results", href: "/lab-results" },
  { label: "Reviews", href: "/reviews" },
  { label: "Research", href: "/research" },
  { label: "Blog", href: "/blog" },
  {
    label: "About",
    menu: {
      heading: "EVOHN",
      links: [
        {
          label: "Our Mission",
          href: "/#mission",
          description: "Why EVOHN exists",
        },
        {
          label: "Quality",
          href: "/quality",
          description: "Third-party verified purity",
        },
        {
          label: "FAQ",
          href: "/faq",
          description: "Common questions answered",
        },
      ],
    },
  },
  {
    label: "Contact",
    menu: {
      heading: "Get In Touch",
      links: [
        {
          label: "General Inquiry",
          href: "/contact",
          description: "Questions & support",
        },
        {
          label: "Wholesale & Distribution",
          href: "/contact/wholesale",
          description: "Partnerships & resale",
        },
        {
          label: "Business Accounts",
          href: "/contact/business",
          description: "Labs, clinics & institutions",
        },
      ],
    },
  },
];

/**
 * Footer link groups — the reference's own footer columns, which differ
 * from its header and are reproduced here in the same four groups.
 */
export const footerNav: NavColumn[] = [
  {
    heading: "Catalogue",
    links: [
      { label: "All Compounds", href: "/catalogue" },
      { label: "Research Stacks", href: "/stacks" },
      { label: "Pocket Strips", href: "/strips" },
      { label: "Lab Results", href: "/lab-results" },
    ],
  },
  {
    heading: "Science",
    links: [
      { label: "Peptide Pedia", href: "/peptide-pedia" },
      { label: "Calculator", href: "/calculator" },
      { label: "Reconstitution Guide", href: "/reconstitution" },
      { label: "Storage & Handling", href: "/storage" },
      { label: "Quality", href: "/quality" },
    ],
  },
  {
    heading: "Research",
    links: [
      { label: "Research Categories", href: "/research" },
      { label: "Blog", href: "/blog" },
      { label: "Journal", href: "/journal" },
      { label: "Reviews", href: "/reviews" },
    ],
  },
  {
    heading: "Contact",
    links: [
      { label: "General Inquiry", href: "/contact" },
      { label: "Wholesale & Distribution", href: "/contact/wholesale" },
      { label: "Business Accounts", href: "/contact/business" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];

/**
 * Informational-use disclaimer. Shown in the footer and on every
 * product page. Deliberately makes no therapeutic or medical claim.
 */
export const disclaimer = {
  short:
    "This catalogue is presented for informational purposes only. It is not an offer of sale, and it makes no medical or therapeutic claim.",
  long: "All content on this website is provided for informational and reference purposes only. Nothing presented here constitutes medical advice, a therapeutic claim, a diagnosis, or an offer to sell. Product entries describe compounds as characterised in published scientific literature; they do not represent statements of efficacy or safety. Availability, presentation and permitted use are subject to the regulations of each jurisdiction, and it is the responsibility of the reader to ensure compliance with applicable local law. EVOHN makes no representation that any compound described is approved for human or veterinary use in any territory.",
} as const;
