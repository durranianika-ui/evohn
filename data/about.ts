/**
 * About.
 *
 * Company narrative, timeline, facilities and the people accountable for
 * release decisions. Flat and serialisable — a CMS collection maps onto it
 * without transformation.
 */

export interface TimelineEntry {
  year: string;
  title: string;
  body: string;
}

export interface Facility {
  name: string;
  location: string;
  role: string;
  detail: string;
  image: string;
}

export interface Leader {
  name: string;
  role: string;
  discipline: string;
  bio: string;
  image: string;
}

export interface Value {
  index: string;
  title: string;
  body: string;
}

export const mission = {
  eyebrow: "Our mission",
  title: "Make quality\nsomething you can check",
  body: [
    "EVOHN exists because the research compound market asks to be trusted rather than inspected. Purity is asserted rather than demonstrated. Certificates arrive on request, eventually, and often for an adjacent batch. Documentation is treated as an obstacle to a sale rather than as the product of the work.",
    "We built the opposite arrangement. Every batch is analysed by a laboratory outside our supply chain, against a specification written before the batch existed. Every certificate is published as a matter of course rather than disclosed on demand. Every vial carries the batch identifier that ties it to the analysis that released it.",
    "None of that is generous. It is the minimum standard for material intended to produce results that someone will later have to defend.",
  ],
};

export const values: Value[] = [
  {
    index: "01",
    title: "Verification over assertion",
    body: "A claim we make about our own material is not evidence. We commission analysis from parties with nothing to gain from the answer, and we publish what comes back — including the batches that took a second attempt to release.",
  },
  {
    index: "02",
    title: "Traceability is not optional",
    body: "A result is only defensible if it can be tied to the material that produced it. Batch identifiers appear on the vial, the certificate and the retained sample, and they never diverge.",
  },
  {
    index: "03",
    title: "Reject rather than re-grade",
    body: "A batch either meets the specification agreed before synthesis or it does not. There is no intermediate category. Intermediate categories are where standards erode quietly.",
  },
  {
    index: "04",
    title: "Precision in language",
    body: "We describe compounds as the published literature characterises them. We do not make therapeutic claims, and we do not translate a mechanism into a promise. The distinction matters more here than the marketing costs us.",
  },
];

export const timeline: TimelineEntry[] = [
  {
    year: "2021",
    title: "A procurement problem",
    body: "EVOHN began as an internal frustration inside a contract research group: four suppliers, four incompatible certificate formats, and no reliable way to tie a batch in the freezer to the analysis that released it. The first work was not chemistry. It was a specification document.",
  },
  {
    year: "2022",
    title: "The written standard",
    body: "The acceptance criteria that still govern every release were agreed and fixed: ≥ 99.0% purity by RP-HPLC, mass confirmation of identity, assayed content against label, water by Karl Fischer, residual solvents to USP <467>. Written before any batch existed, so the criteria could never be fitted to a result.",
  },
  {
    year: "2023",
    title: "Independent analysis from the first batch",
    body: "Rather than building an in-house laboratory, EVOHN contracted accredited third parties from the outset. In-process testing informs manufacturing; it does not release material. Keeping the two functions structurally separate was a decision taken before the first vial was filled.",
  },
  {
    year: "2024",
    title: "The catalogue takes shape",
    body: "Twelve compounds across eight research domains, each selected for the depth of its published record rather than the strength of its demand. Compounds without a literature base substantial enough to describe honestly were left out — and still are.",
  },
  {
    year: "2025",
    title: "Publication as default",
    body: "The certificate library moved from disclosure-on-request to publication as standard. Every batch, every result, retrievable by accession number from the issuing laboratory. The change was operationally trivial and reputationally decisive.",
  },
  {
    year: "2026",
    title: "Documented at every step",
    body: "Retained samples, batch-level traceability, published chromatograms and a research desk that writes about method rather than product. The current standard, and the floor for what comes next.",
  },
];

export const facilities: Facility[] = [
  {
    name: "Synthesis and purification",
    location: "Contracted, European Union",
    role: "Manufacture",
    detail:
      "Solid-phase synthesis under a written specification, with preparative chromatography sized so that purity is never traded against yield. Coupling is monitored throughout; incomplete couplings are the origin of the deletion sequences identity testing later has to catch.",
    image: "/facilities/synthesis.jpg",
  },
  {
    name: "Lyophilisation and fill",
    location: "Contracted, European Union",
    role: "Presentation",
    detail:
      "Freeze-drying cycles developed per compound rather than applied generically, targeting a cake with sufficient structure to reconstitute cleanly and low enough residual moisture to remain stable. Fill into amber borosilicate with butyl closure and aluminium crimp.",
    image: "/facilities/lyophilisation.jpg",
  },
  {
    name: "Independent analysis",
    location: "Accredited laboratories, EU and US",
    role: "Verification",
    detail:
      "Two ISO/IEC 17025 accredited laboratories outside the supply chain, engaged so that no single analytical relationship becomes load-bearing. Each report carries an accession number retrievable from the issuing laboratory directly.",
    image: "/facilities/analysis.jpg",
  },
  {
    name: "Cold storage and dispatch",
    location: "Dubai, United Arab Emirates",
    role: "Custody",
    detail:
      "Temperature-controlled storage with retained samples held under the same conditions as released material for the duration of the retest interval. Insulated cold-chain dispatch across the region with in-transit indicators.",
    image: "/facilities/cold-storage.jpg",
  },
];

export const leadership: Leader[] = [
  {
    name: "Dr. Yusuf Rahimi",
    role: "Founder & Scientific Director",
    discipline: "Analytical chemistry",
    bio: "Fifteen years in analytical method development and validation, latterly building release testing programmes for contract manufacture. Holds the final release decision on every batch, and the standing instruction that a batch off specification is rejected rather than re-graded.",
    image: "/team/scientific-director.jpg",
  },
  {
    name: "Dr. Marta Kovaleva",
    role: "Head of Quality",
    discipline: "Pharmaceutical quality systems",
    bio: "Background in quality assurance for sterile manufacture, with responsibility for specification authorship, laboratory qualification and the audit of contracted facilities. Owns the document that every batch is judged against.",
    image: "/team/head-of-quality.jpg",
  },
  {
    name: "Samir Al-Hashimi",
    role: "Head of Supply",
    discipline: "Cold-chain logistics",
    bio: "Responsible for custody from fill to delivery: storage conditions, retained sample management, in-transit temperature control and the regional dispatch network. The person who ensures the analytical record still describes the material when it arrives.",
    image: "/team/head-of-supply.jpg",
  },
  {
    name: "Dr. Elena Castellanos",
    role: "Research Desk",
    discipline: "Peptide chemistry",
    bio: "Writes the Journal and the Science section, and answers the technical enquiries that arrive through it. Her brief is explicitly editorial rather than commercial: explain the method, cite the record, decline to overstate.",
    image: "/team/research-desk.jpg",
  },
];

/** Headline figures for the About hero. */
export const aboutStats = [
  { value: "≥ 99%", label: "Purity specification" },
  { value: "100%", label: "Batches independently analysed" },
  { value: "2", label: "Accredited laboratories engaged" },
  { value: "0", label: "Batches re-graded to fit a result" },
];
