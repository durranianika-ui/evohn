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
    /** Sits under the heading inside the panel. */
    intro?: string;
    links: NavLink[];
  };
}

/**
 * Primary navigation.
 *
 * Seven top-level destinations, in the specified order. Only Science opens a
 * panel; everything else is a plain link, because a bar that drops a menu
 * under every item is a bar nobody can scan.
 *
 * Stacks, Strips, Quality and FAQ are real sections and stay reachable — from
 * the utility index below, from the footer, and from the pages they belong
 * to. They are not in the primary bar, because eleven top-level items is not
 * an information architecture.
 */
export const nav: NavItem[] = [
  { label: "Catalogue", href: "/catalogue" },
  {
    label: "Science",
    menu: {
      heading: "Research Tools",
      intro:
        "Four instruments. They convert, reference and describe — none of them recommends.",
      links: [
        {
          label: "Calculator",
          href: "/calculator",
          description:
            "Reconstitution, mixing and blend arithmetic, worked step by step.",
        },
        {
          label: "Peptide Pedia",
          href: "/peptide-pedia",
          description:
            "The reference library — every compound, searchable and cited.",
        },
        {
          label: "Reconstitution Guide",
          href: "/reconstitution-guide",
          description:
            "Bringing lyophilised material into solution without degrading it.",
        },
        {
          label: "Storage & Handling Guide",
          href: "/storage-handling",
          description:
            "Temperature, light, cycling, and the chemistry behind each rule.",
        },
      ],
    },
  },
  { label: "Journal", href: "/journal" },
  { label: "Lab Results", href: "/lab-results" },
  { label: "Reviews", href: "/reviews" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/**
 * The utility index.
 *
 * Opened by the Menu control at the right of the bar, and reused verbatim as
 * the lower half of the mobile drawer. Every section the site answers on is
 * listed here, so demoting one out of the primary bar never buries it.
 */
export const menuIndex: NavColumn[] = [
  {
    heading: "Catalogue",
    links: [
      { label: "All Compounds", href: "/catalogue" },
      { label: "Research Stacks", href: "/stacks" },
      { label: "Pocket Strips", href: "/strips" },
      { label: "Search", href: "/search" },
    ],
  },
  {
    heading: "Science",
    links: [
      { label: "Science Overview", href: "/science" },
      { label: "Calculator", href: "/calculator" },
      { label: "Peptide Pedia", href: "/peptide-pedia" },
      { label: "Reconstitution Guide", href: "/reconstitution-guide" },
      { label: "Storage & Handling", href: "/storage-handling" },
      { label: "Quality", href: "/quality" },
      { label: "Lab Results", href: "/lab-results" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Journal", href: "/journal" },
      { label: "Reviews", href: "/reviews" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Order",
    links: [
      { label: "Enquiry List", href: "/enquiry" },
      { label: "Wholesale", href: "/wholesale" },
      { label: "Business Accounts", href: "/business-accounts" },
    ],
  },
];

/**
 * Footer link groups.
 *
 * Four columns here; the Legal column is generated from `data/legal.ts` in the
 * footer itself, so publishing a document adds its footer link and its sitemap
 * entry at the same time and neither can be forgotten.
 *
 * There is deliberately no Social column. EVOHN has no verified profile to
 * link to, and inventing one would be a fabricated business detail.
 */
export const footerNav: NavColumn[] = [
  {
    heading: "Order",
    links: [
      { label: "Catalogue", href: "/catalogue" },
      { label: "Enquiry List", href: "/enquiry" },
      { label: "Wholesale", href: "/wholesale" },
      { label: "Business Accounts", href: "/business-accounts" },
    ],
  },
  {
    heading: "Catalogue",
    links: [
      { label: "All Products", href: "/catalogue" },
      { label: "Research Stacks", href: "/stacks" },
      { label: "Pocket Strips", href: "/strips" },
      { label: "Search", href: "/search" },
    ],
  },
  {
    heading: "Science",
    links: [
      { label: "Calculator", href: "/calculator" },
      { label: "Peptide Pedia", href: "/peptide-pedia" },
      { label: "Reconstitution Guide", href: "/reconstitution-guide" },
      { label: "Storage & Handling Guide", href: "/storage-handling" },
      { label: "Lab Results", href: "/lab-results" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Journal", href: "/journal" },
      { label: "Reviews", href: "/reviews" },
      { label: "Quality", href: "/quality" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
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
