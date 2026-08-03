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
  href: string;
  /** Compact dropdown — a single list of links. */
  menu?: NavLink[];
  /** Mega panel — multiple columns plus an optional promoted card. */
  mega?: {
    columns: NavColumn[];
    feature?: {
      eyebrow: string;
      title: string;
      body: string;
      href: string;
      cta: string;
    };
  };
}

export const nav: NavItem[] = [
  {
    label: "Catalogue",
    href: "/catalogue",
    mega: {
      columns: [
        {
          heading: "Research domains",
          links: [
            {
              label: "Weight Loss",
              href: "/categories/weight-loss",
              description: "Incretin signalling",
            },
            {
              label: "Recovery",
              href: "/categories/recovery",
              description: "Tissue repair",
            },
            {
              label: "Longevity",
              href: "/categories/longevity",
              description: "Cellular energetics",
            },
            {
              label: "Growth",
              href: "/categories/growth",
              description: "Somatotropic axis",
            },
          ],
        },
        {
          heading: "More domains",
          links: [
            {
              label: "Neuro",
              href: "/categories/neuro",
              description: "Neuropeptide pathways",
            },
            {
              label: "Metabolism",
              href: "/categories/metabolism",
              description: "Mitochondrial signalling",
            },
            {
              label: "Regeneration",
              href: "/categories/regeneration",
              description: "Matrix remodelling",
            },
            {
              label: "Performance",
              href: "/categories/performance",
              description: "Multi-receptor agonism",
            },
          ],
        },
        {
          heading: "Browse",
          links: [
            {
              label: "All compounds",
              href: "/catalogue",
              description: "The complete collection",
            },
            {
              label: "Research stacks",
              href: "/stacks",
              description: "Multi-compound protocols",
            },
            {
              label: "Compound index",
              href: "/science/compound-index",
              description: "Reference library, A–Z",
            },
            {
              label: "Lab results",
              href: "/lab-results",
              description: "Certificates of analysis",
            },
          ],
        },
      ],
      feature: {
        eyebrow: "Standard",
        title: "Every vial is documented",
        body: "Identity, purity and residual profile are established by an independent laboratory before a batch is released. The certificate travels with the batch.",
        href: "/lab-results",
        cta: "Open the COA library",
      },
    },
  },
  {
    label: "Stacks",
    href: "/stacks",
    menu: [
      {
        label: "All stacks",
        href: "/stacks",
        description: "Curated multi-compound protocols",
      },
      {
        label: "Regenerative",
        href: "/stacks/regenerative-protocol",
        description: "BPC-157 · TB-500 · GHK-Cu",
      },
      {
        label: "Metabolic",
        href: "/stacks/metabolic-protocol",
        description: "Semaglutide · MOTS-c",
      },
      {
        label: "Longevity",
        href: "/stacks/longevity-protocol",
        description: "NAD+ · MOTS-c",
      },
      {
        label: "Somatotropic",
        href: "/stacks/somatotropic-protocol",
        description: "CJC-1295 / Ipamorelin · TB-500",
      },
      {
        label: "Cognitive",
        href: "/stacks/cognitive-protocol",
        description: "Semax · Selank",
      },
    ],
  },
  {
    label: "Science",
    href: "/science",
    mega: {
      columns: [
        {
          heading: "Foundations",
          links: [
            {
              label: "Science hub",
              href: "/science",
              description: "How we establish quality",
            },
            {
              label: "Analytical methods",
              href: "/science/analytical-methods",
              description: "HPLC, MS, KF, endotoxin",
            },
            {
              label: "Purity & identity",
              href: "/science/purity-and-identity",
              description: "Two different questions",
            },
            {
              label: "Manufacturing",
              href: "/science/manufacturing",
              description: "Synthesis to release",
            },
          ],
        },
        {
          heading: "At the bench",
          links: [
            {
              label: "Reconstitution guide",
              href: "/science/reconstitution",
              description: "Preparing lyophilised material",
            },
            {
              label: "Storage & handling",
              href: "/science/storage",
              description: "Stability and cold chain",
            },
            {
              label: "Dilution calculator",
              href: "/science/calculator",
              description: "Concentration and volume",
            },
            {
              label: "Compound index",
              href: "/science/compound-index",
              description: "Reference library, A–Z",
            },
          ],
        },
      ],
      feature: {
        eyebrow: "Quality",
        title: "Verification, not assertion",
        body: "A purity claim is only as good as the laboratory that signed it. Every EVOHN release is assayed by an accredited third party against a written specification.",
        href: "/science/purity-and-identity",
        cta: "Read the standard",
      },
    },
  },
  { label: "Journal", href: "/journal" },
  { label: "Lab Results", href: "/lab-results" },
  { label: "Reviews", href: "/reviews" },
  {
    label: "About",
    href: "/about",
    menu: [
      {
        label: "Our story",
        href: "/about",
        description: "Origin, mission and vision",
      },
      {
        label: "Quality & manufacturing",
        href: "/science/manufacturing",
        description: "Synthesis, purification, release",
      },
      {
        label: "Facilities",
        href: "/about#facilities",
        description: "Where the work happens",
      },
      {
        label: "Leadership",
        href: "/about#leadership",
        description: "The people accountable",
      },
      {
        label: "Frequently asked",
        href: "/faq",
        description: "Documentation and policy",
      },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
    menu: [
      {
        label: "General enquiries",
        href: "/contact",
        description: "Compounds, documentation, support",
      },
      {
        label: "Laboratory & institutional",
        href: "/contact#institutional",
        description: "Accounts for labs and research groups",
      },
      {
        label: "Distribution partners",
        href: "/contact#partners",
        description: "Territory and supply enquiries",
      },
    ],
  },
];

/** Flat list of every top-level destination — used by the mobile drawer. */
export const primaryRoutes = nav.map(({ label, href }) => ({ label, href }));

/** Footer link groups. Independent of the header so each can evolve alone. */
export const footerNav: NavColumn[] = [
  {
    heading: "Catalogue",
    links: [
      { label: "All compounds", href: "/catalogue" },
      { label: "Research stacks", href: "/stacks" },
      { label: "Compound index", href: "/science/compound-index" },
      { label: "Lab results", href: "/lab-results" },
    ],
  },
  {
    heading: "Science",
    links: [
      { label: "Science hub", href: "/science" },
      { label: "Analytical methods", href: "/science/analytical-methods" },
      { label: "Reconstitution", href: "/science/reconstitution" },
      { label: "Storage & handling", href: "/science/storage" },
      { label: "Dilution calculator", href: "/science/calculator" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Journal", href: "/journal" },
      { label: "Reviews", href: "/reviews" },
      { label: "Contact", href: "/contact" },
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
