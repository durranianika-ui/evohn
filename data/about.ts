/**
 * About.
 *
 * Company narrative, values, facilities and accountability. Flat and
 * serialisable — a CMS collection maps onto it without transformation.
 *
 * The narrative is written about the standard rather than about individuals:
 * there are no named personnel here, and accountability is described as a
 * structural arrangement, which is the part a reader can actually check.
 */

export interface Facility {
  name: string;
  location: string;
  role: string;
  detail: string;
  image: string;
}

export interface Value {
  index: string;
  title: string;
  body: string;
}

/**
 * The origin statement.
 *
 * Declared once and read by the About hero, so the page and any other surface
 * that tells this story cannot drift apart.
 */
export const origin =
  "EVOHN began with a documentation problem rather than a chemical one. Material arrived from multiple suppliers with analytical records that could not be read against one another, and nothing reliably tied a vial in the freezer to the analysis that released it. The first work was not synthesis — it was the specification, written before any batch existed, that every release has been judged against since.";

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
    location: "Texas, USA",
    role: "Custody",
    detail:
      "Temperature-controlled storage with retained samples held under the same conditions as released material for the duration of the retest interval. Insulated cold-chain dispatch with in-transit indicators.",
    image: "/facilities/cold-storage.jpg",
  },
];

/**
 * How accountability is arranged.
 *
 * Replaces the named leadership grid. Who signs a release matters less to a
 * reader than whether the party that makes the material is allowed to be the
 * party that passes it — which is a structure, and can be described without
 * attaching a person's name to a claim.
 */
export const accountability: Value[] = [
  {
    index: "01",
    title: "Release is separated from manufacture",
    body: "The decision to release a batch does not sit with the facility that produced it. In-process testing informs manufacturing; it does not release material. The separation is structural rather than procedural, which is why it holds when a schedule is under pressure.",
  },
  {
    index: "02",
    title: "The specification precedes the batch",
    body: "Acceptance criteria are fixed in writing before synthesis begins. A batch is judged against the document that existed when it was ordered, so criteria cannot be fitted to a result after the fact.",
  },
  {
    index: "03",
    title: "Analysis is commissioned outside the supply chain",
    body: "Certificates are issued by accredited laboratories with no commercial interest in the outcome, and each report carries an accession number retrievable from the issuing laboratory directly rather than from us.",
  },
];

/** Headline figures for the About hero. */
export const aboutStats = [
  { value: "≥ 99%", label: "Purity specification" },
  { value: "100%", label: "Batches independently analysed" },
  { value: "2", label: "Accredited laboratories engaged" },
  { value: "0", label: "Batches re-graded to fit a result" },
];
