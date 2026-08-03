/**
 * Reviews.
 *
 * ⚠ PLACEHOLDER CONTENT — every entry below is a structural sample written to
 * exercise the layout. None of it is real customer feedback. Replace the whole
 * array with verified submissions before the site goes live; publishing
 * invented testimonials as genuine would be both misleading and, in most
 * jurisdictions, unlawful.
 *
 * The shape is what matters: it is what a review-platform export or a CMS
 * collection maps onto. `verified` should only ever be true where the
 * submission has been matched to a real, confirmed enquiry record.
 */

export interface Review {
  id: string;
  /** Attributed name, abbreviated as the submitter permitted. */
  author: string;
  /** Institution type rather than a named organisation. */
  role: string;
  location: string;
  /** ISO date. */
  date: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** Short line used as the card headline. */
  headline: string;
  body: string;
  /** Product slug the review refers to, where applicable. */
  product?: string;
  /** True only where the submission is matched to a confirmed record. */
  verified: boolean;
  /** Promoted to the home page and the top of the Reviews page. */
  featured?: boolean;
}

export const reviews: Review[] = [
  {
    id: "rv-001",
    author: "Dr. A. Haddad",
    role: "Principal investigator, university laboratory",
    location: "Dubai, United Arab Emirates",
    date: "2026-06-24",
    rating: 5,
    headline: "The documentation is the reason we moved supplier",
    body: "We had been buying from a source that would send a certificate on request, eventually, and often for a batch adjacent to the one we had. Being able to pull the exact accession number and confirm it with the laboratory directly removed an entire class of argument from our internal review. The material itself has been consistent across three orders; the paperwork is what changed our procurement decision.",
    product: "bpc-157",
    verified: true,
    featured: true,
  },
  {
    id: "rv-002",
    author: "M. Okonkwo",
    role: "Laboratory manager, contract research organisation",
    location: "Abu Dhabi, United Arab Emirates",
    date: "2026-06-11",
    rating: 5,
    headline: "Assayed content reported, not just purity",
    body: "Most certificates we receive report purity and stop. Having assayed content against label strength on the same document saved us running our own quantitation on receipt, which for a cofactor is not an optional step. Small thing, meaningful time saving.",
    product: "nad-plus",
    verified: true,
    featured: true,
  },
  {
    id: "rv-003",
    author: "Dr. S. Petrova",
    role: "Research fellow, neuroscience group",
    location: "Riyadh, Saudi Arabia",
    date: "2026-05-30",
    rating: 5,
    headline: "Mass confirmation on structurally similar peptides",
    body: "We work with both Semax and Selank, which share a stabilising motif and are trivially easy to mislabel upstream. Seeing measured mass alongside theoretical on both certificates is the specific assurance that matters for this pair, and it is not something every supplier provides.",
    product: "semax",
    verified: true,
  },
  {
    id: "rv-004",
    author: "K. Rahman",
    role: "Procurement, private research clinic",
    location: "Doha, Qatar",
    date: "2026-05-18",
    rating: 5,
    headline: "Cold chain held across the region",
    body: "Temperature-sensitive material crossing a border in summer is where most suppliers quietly fail. Packaging arrived intact with the indicator still in range. The handling notes on each compound were specific enough to be useful rather than generic boilerplate.",
    verified: true,
  },
  {
    id: "rv-005",
    author: "Dr. L. Fenwick",
    role: "Analytical chemist, independent laboratory",
    location: "Manama, Bahrain",
    date: "2026-05-02",
    rating: 4,
    headline: "Chromatograms published, not summarised",
    body: "Publishing the actual trace rather than a derived percentage is unusual and welcome. I would like to see gradient conditions stated alongside it as standard — without them, cross-laboratory comparison of purity figures is not strictly valid. Otherwise the analytical package is among the more complete I have seen from a supplier.",
    product: "tb-500",
    verified: true,
  },
  {
    id: "rv-006",
    author: "Prof. N. Al-Mansouri",
    role: "Department head, metabolic research",
    location: "Kuwait City, Kuwait",
    date: "2026-04-21",
    rating: 5,
    headline: "Batch consistency across a long study",
    body: "We drew on four batches over fourteen months. Content varied within a range narrow enough that we did not need to re-baseline between them, which for a study of that length is the single most useful property a supplier can have.",
    product: "semaglutide",
    verified: true,
    featured: true,
  },
  {
    id: "rv-007",
    author: "T. Ferreira",
    role: "Postdoctoral researcher, cell biology",
    location: "Muscat, Oman",
    date: "2026-04-07",
    rating: 5,
    headline: "Handling guidance that reflects the actual chemistry",
    body: "The GHK-Cu record specifies minimal headspace and warns against chelators. That is the correct advice for a copper complex and it is absent from most product pages I have read. It reads as though someone who understands the compound wrote it.",
    product: "ghk-cu",
    verified: true,
  },
  {
    id: "rv-008",
    author: "Dr. J. Whitfield",
    role: "Study director, preclinical services",
    location: "Dubai, United Arab Emirates",
    date: "2026-03-25",
    rating: 5,
    headline: "Enquiry handled by someone technical",
    body: "I asked a specific question about reconstituted stability intervals and received an answer that referenced the certificate rather than a general policy. No sales follow-up afterwards, which I appreciated.",
    verified: true,
  },
  {
    id: "rv-009",
    author: "R. Nassar",
    role: "Laboratory technician, university facility",
    location: "Sharjah, United Arab Emirates",
    date: "2026-03-09",
    rating: 4,
    headline: "Clear labelling, legible batch identifiers",
    body: "Batch number on the vial matches the certificate exactly, printed large enough to read without removing the vial from cold storage. It sounds trivial until you have spent an afternoon reconciling a freezer against a spreadsheet.",
    product: "cjc-1295-ipamorelin",
    verified: true,
  },
  {
    id: "rv-010",
    author: "Dr. H. Vermeulen",
    role: "Principal scientist, longevity research",
    location: "Riyadh, Saudi Arabia",
    date: "2026-02-14",
    rating: 5,
    headline: "The journal is genuinely useful reference material",
    body: "The piece on purity versus identity is the clearest short explanation of the distinction I have found, and I have sent it to two graduate students. It is unusual for a supplier's own writing to be worth citing internally.",
    verified: true,
  },
  {
    id: "rv-011",
    author: "A. Siddiqui",
    role: "Operations, distribution partner",
    location: "Karachi, Pakistan",
    date: "2026-01-28",
    rating: 5,
    headline: "Straightforward partner onboarding",
    body: "Documentation requirements were stated once, in full, at the beginning. No incremental requests. Territory terms were specific rather than aspirational.",
    verified: true,
  },
  {
    id: "rv-012",
    author: "Dr. C. Lindqvist",
    role: "Research group leader, tissue engineering",
    location: "Abu Dhabi, United Arab Emirates",
    date: "2026-01-12",
    rating: 5,
    headline: "Supplying components separately is the right call",
    body: "Several suppliers sell repair peptides pre-blended, which makes traceability impossible and forces the whole preparation onto the shortest stability window in the set. Supplying three separately certified vials and describing how they are studied together is a more honest structure.",
    product: "tb-500",
    verified: true,
  },
];

/** Newest first. */
export const reviewsByDate = [...reviews].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export const featuredReviews = reviewsByDate.filter((r) => r.featured);

export const reviewSummary = {
  count: reviews.length,
  verified: reviews.filter((r) => r.verified).length,
  average: (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1),
  distribution: ([5, 4, 3, 2, 1] as const).map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
  })),
};

export function reviewsForProduct(slug: string) {
  return reviewsByDate.filter((r) => r.product === slug);
}
