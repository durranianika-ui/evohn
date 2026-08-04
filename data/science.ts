import type { JournalBlock } from "./journal";

/**
 * The Science section.
 *
 * The hub summarises how quality is established; each sub-page carries the
 * long-form treatment. Bodies reuse the Journal's block model so one renderer
 * serves both — adding a page is a data edit.
 */

export type ContentBlock = JournalBlock;

/* --------------------------------------------------------------------------
   HUB
   ----------------------------------------------------------------------- */

export interface Pillar {
  index: string;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
}

export const sciencePillars: Pillar[] = [
  {
    index: "01",
    title: "Synthesis under a written specification",
    body: "Every compound is produced to a specification agreed before the first coupling: sequence, target purity, permitted impurity profile, residual solvent ceiling. A batch that misses the specification is not re-graded — it is rejected.",
    href: "/quality",
    linkLabel: "How material is made",
  },
  {
    index: "02",
    title: "Verification by a party with nothing to gain",
    body: "Identity and purity are established by an accredited laboratory outside the supply chain. In-process testing informs manufacturing decisions; it does not substitute for independent analysis, and the two are never conflated.",
    href: "/journal/purity-versus-identity",
    linkLabel: "Purity and identity",
  },
  {
    index: "03",
    title: "Four instruments, four questions",
    body: "Chromatography for homogeneity, mass spectrometry for identity, Karl Fischer for water, gas chromatography for residual solvents. Each covers a blind spot in the others, and a certificate reporting only the first has described a quarter of the batch.",
    href: "/journal/how-to-read-a-certificate-of-analysis",
    linkLabel: "Analytical methods",
  },
  {
    index: "04",
    title: "The record travels with the batch",
    body: "A certificate names a batch, and the batch number is printed on the vial. Any result can be traced to the analysis that released the material it came from, and to the laboratory that signed it.",
    href: "/lab-results",
    linkLabel: "Open the COA library",
  },
];

export interface StandardRow {
  label: string;
  value: string;
  note: string;
}

/** The specification table shown on the Science hub. */
export const specification: StandardRow[] = [
  {
    label: "Purity",
    value: "≥ 99.0%",
    note: "Principal peak area by reversed-phase HPLC at 214 nm.",
  },
  {
    label: "Identity",
    value: "Conforms",
    note: "Measured mass within tolerance of theoretical by ESI-MS.",
  },
  {
    label: "Assayed content",
    value: "95.0 – 110.0%",
    note: "Against nominal label strength, referenced to a standard.",
  },
  {
    label: "Water content",
    value: "≤ 8.0%",
    note: "Karl Fischer titration. Directly affects mass-based calculation.",
  },
  {
    label: "Residual solvents",
    value: "USP <467>",
    note: "Headspace GC-FID against compendial limits.",
  },
  {
    label: "Traceability",
    value: "Batch-level",
    note: "Vial label, certificate and retained sample share one identifier.",
  },
];

/* --------------------------------------------------------------------------
   SUB-PAGES
   ----------------------------------------------------------------------- */

export interface SciencePage {
  slug: string;
  title: string;
  eyebrow: string;
  /** Meta description and hero standfirst. */
  intro: string;
  readMinutes: number;
  body: ContentBlock[];
  /** Optional reference table rendered after the body. */
  table?: { caption: string; head: string[]; rows: string[][] };
  /** Related science pages, by slug. */
  related: string[];
}

export const sciencePages: SciencePage[] = [
  {
    slug: "analytical-methods",
    title: "Analytical Methods",
    eyebrow: "Science",
    intro:
      "A certificate is the output of four instruments, each answering a question the others cannot reach. What each measures, what it misses, and why the set is read together.",
    readMinutes: 9,
    body: [
      {
        type: "paragraph",
        text: "No single instrument characterises a batch. Chromatography establishes homogeneity but is blind to identity; mass spectrometry establishes identity but says nothing about how much. Read as a set the four determinations describe a batch adequately. Read individually each is easy to over-interpret, and over-interpretation is the most common failure in how analytical results are quoted.",
      },
      {
        type: "heading",
        text: "Reversed-phase high-performance liquid chromatography",
      },
      {
        type: "paragraph",
        text: "The sample is driven through a packed column under pressure. Components partition between mobile and stationary phases according to hydrophobicity and emerge at characteristic retention times. Detection at 214 nm targets the peptide bond itself rather than aromatic side chains, which makes the response comparatively uniform across sequences. Purity is the principal peak area as a proportion of total integrated area.",
      },
      {
        type: "callout",
        title: "The limit of the technique",
        text: "Two structurally similar species can co-elute and integrate as one peak. A clean chromatogram establishes that the sample is overwhelmingly one substance; it cannot establish which.",
      },
      {
        type: "heading",
        text: "Electrospray ionisation mass spectrometry",
      },
      {
        type: "paragraph",
        text: "The sample is ionised at atmospheric pressure and the resulting ions separated by mass-to-charge ratio. Peptides typically produce a series of multiply charged species from which molecular weight is deconvoluted. A measured mass within tolerance of theoretical is strong evidence of identity; a systematic offset is strong evidence of a specific structural difference — a deletion sequence one residue short, for instance, or an oxidised methionine sixteen daltons heavy.",
      },
      {
        type: "heading",
        text: "Karl Fischer titration",
      },
      {
        type: "paragraph",
        text: "A specific chemical determination of water content. Lyophilised material is dispensed by mass, and any water in that mass is not compound. A cake carrying meaningful residual moisture delivers proportionally less material than the label implies, and the error compounds with any variance in assayed content.",
      },
      {
        type: "heading",
        text: "Headspace gas chromatography",
      },
      {
        type: "paragraph",
        text: "Synthesis and purification consume organic solvents — acetonitrile, trifluoroacetic acid, dimethylformamide among them. Headspace GC-FID quantifies what survived the work-up against the limits in USP <467>. It is the least discussed section of a certificate and one of the most informative, because it is a direct read on how carefully the material was finished.",
      },
      {
        type: "heading",
        text: "Visual determination",
      },
      {
        type: "paragraph",
        text: "The cheapest test in the set and the first to catch a gross problem. A collapsed cake, an unexpected colour, or material that fails to go into solution as documented is a result in itself. Where a compound has a characteristic solution appearance — the deep blue of a copper complex — its absence is diagnostic.",
      },
    ],
    table: {
      caption: "What each determination establishes",
      head: ["Determination", "Method", "Answers", "Cannot answer"],
      rows: [
        [
          "Purity",
          "RP-HPLC, UV 214 nm",
          "How homogeneous the sample is",
          "What the principal component is",
        ],
        [
          "Identity",
          "ESI-MS",
          "Whether the mass matches the named compound",
          "How much of the sample it represents",
        ],
        [
          "Content",
          "RP-HPLC vs reference standard",
          "How much compound is present against label",
          "Whether impurities are related or unrelated",
        ],
        [
          "Water",
          "Karl Fischer titration",
          "How much of the weighed mass is water",
          "Anything about the compound itself",
        ],
        [
          "Solvents",
          "Headspace GC-FID",
          "What remains from synthesis and work-up",
          "Whether the compound has degraded",
        ],
      ],
    },
    related: ["purity-and-identity", "manufacturing"],
  },
  {
    slug: "purity-and-identity",
    title: "Purity and Identity",
    eyebrow: "Science",
    intro:
      "Two questions that sound alike and are not. Purity asks how much of a sample is one thing; identity asks whether that thing is what the label claims.",
    readMinutes: 7,
    body: [
      {
        type: "paragraph",
        text: "The confusion survives because both figures are quoted in the same confident language, and because a high purity number is genuinely reassuring. It is simply reassuring about the wrong thing. Purity and identity are answers to non-overlapping questions produced by instruments measuring entirely different properties, and a certificate reporting one without the other has answered half a question and presented it as whole.",
      },
      {
        type: "heading",
        text: "What a purity figure is",
      },
      {
        type: "paragraph",
        text: "It is a proportion of integrated peak area. The principal peak, expressed against everything else the detector saw. It is a statement about homogeneity — that the sample is overwhelmingly one substance — and nothing more than that.",
      },
      {
        type: "quote",
        text: "A chromatogram tells you the sample is one thing. It does not tell you which thing.",
      },
      {
        type: "heading",
        text: "Why deletion sequences are the specific risk",
      },
      {
        type: "paragraph",
        text: "Solid-phase synthesis extends a chain one residue at a time, and coupling efficiency is never one hundred per cent. A chain that failed to accept a residue continues to be extended and emerges as a deletion sequence — a peptide one amino acid short of target. Depending on which residue is missing, its hydrophobicity may be almost unchanged, its retention behaviour almost identical. It can co-elute with the target and present as a single clean peak.",
      },
      {
        type: "heading",
        text: "What mass measurement adds",
      },
      {
        type: "paragraph",
        text: "A peptide missing one glycine is 57 daltons lighter than intended. Invisible to a retention-time measurement; unmistakable on a mass spectrum. This is the whole argument for identity confirmation: it is not a supplementary check on purity but the half of the question purity structurally cannot reach.",
      },
      {
        type: "callout",
        title: "Reading the pair",
        text: "High purity with confirmed identity means the sample is overwhelmingly one substance and that substance is the named compound. Either result alone leaves a gap wide enough to invalidate a study.",
      },
      {
        type: "heading",
        text: "Where it matters most",
      },
      {
        type: "paragraph",
        text: "Compounds sharing a structural motif are the acute case. Semax and Selank both carry a proline-glycine-proline stabilising extension; a purity result cannot distinguish them, and only a mass measurement will. Any catalogue holding structurally related compounds has an obligation to report identity as standard rather than on request.",
      },
    ],
    related: ["analytical-methods", "manufacturing"],
  },
  {
    slug: "manufacturing",
    title: "Manufacturing and Release",
    eyebrow: "Science",
    intro:
      "From the first coupling to the moment a batch is released, with the decision points that determine whether material is fit to ship.",
    readMinutes: 8,
    body: [
      {
        type: "paragraph",
        text: "Quality is not inspected into a batch at the end. It is either designed into the process or it is absent, and final testing simply reports which. What follows is the sequence a batch passes through and the point at which each question is settled.",
      },
      {
        type: "heading",
        text: "Specification, before anything is made",
      },
      {
        type: "paragraph",
        text: "A written specification precedes synthesis: sequence, target purity, permitted impurity profile, residual solvent ceiling, water content limit, and the analytical methods by which each will be judged. Agreeing the acceptance criteria before the result exists is what prevents the criteria from being adjusted to fit it.",
      },
      {
        type: "heading",
        text: "Solid-phase synthesis",
      },
      {
        type: "paragraph",
        text: "The chain is assembled on a resin support, one residue at a time, with protecting groups managing side-chain reactivity. Each coupling is monitored; incomplete couplings are the origin of the deletion sequences that identity testing later has to catch. Longer sequences accumulate more opportunities for incompletion, which is why purity targets are harder to hold as chain length increases.",
      },
      {
        type: "heading",
        text: "Cleavage and purification",
      },
      {
        type: "paragraph",
        text: "The completed chain is cleaved from the resin and the protecting groups removed, typically under strongly acidic conditions. Crude material then goes onto preparative chromatography, where fractions are collected and only those meeting the purity target are pooled. This is the step where yield is traded against purity, and the trade is made in favour of purity by policy rather than by case.",
      },
      {
        type: "heading",
        text: "Lyophilisation",
      },
      {
        type: "paragraph",
        text: "Pooled material is frozen and the water removed by sublimation under vacuum. The objective is a cake with sufficient structure to reconstitute cleanly and low enough residual moisture to remain stable in storage. Collapse, discolouration or a cake that resists reconstitution are all indications that the cycle was wrong for the material.",
      },
      {
        type: "heading",
        text: "Fill, seal and label",
      },
      {
        type: "paragraph",
        text: "Material is filled into amber borosilicate vials, closed with a butyl stopper and sealed with an aluminium crimp. The batch identifier is printed at the fill stage, which is the moment the physical vial and the analytical record become one traceable object.",
      },
      {
        type: "heading",
        text: "Independent analysis and release",
      },
      {
        type: "paragraph",
        text: "A sample goes to an accredited laboratory outside the supply chain. The certificate returns against the specification agreed at the outset. A batch meeting it is released and the certificate published; a batch that does not is rejected. There is no intermediate category, because an intermediate category is where standards go to erode.",
      },
      {
        type: "callout",
        title: "Retained samples",
        text: "A portion of every batch is held under the same conditions as the released material for the duration of the retest interval, so that a question raised months later can be answered against the actual material rather than a memory of it.",
      },
    ],
    table: {
      caption: "Release decision points",
      head: ["Stage", "Question settled", "Failure consequence"],
      rows: [
        [
          "Specification",
          "What will count as acceptable",
          "Criteria cannot later be fitted to the result",
        ],
        [
          "Synthesis",
          "Whether couplings completed",
          "Deletion sequences enter the crude material",
        ],
        [
          "Purification",
          "Whether the purity target is achievable",
          "Yield is sacrificed; the target is not",
        ],
        [
          "Lyophilisation",
          "Whether the cake is stable and reconstitutes",
          "Cycle is redeveloped for the material",
        ],
        [
          "Independent analysis",
          "Whether the batch meets specification",
          "Rejection — there is no re-grade",
        ],
      ],
    },
    related: ["analytical-methods", "purity-and-identity"],
  },
  {
    slug: "reconstitution",
    title: "Reconstitution Guide",
    eyebrow: "At the bench",
    intro:
      "Lyophilisation arrests degradation by removing water. Reconstitution reverses that protection deliberately — and every decision after it sets how fast the clock now runs.",
    readMinutes: 8,
    body: [
      {
        type: "paragraph",
        text: "Freeze-drying is not packaging convenience. Water is the medium in which hydrolysis, deamidation and oxidation proceed, and its removal slows all three by orders of magnitude. A lyophilised cake held at −20 °C is a compound in suspended animation. Adding diluent ends that state on purpose.",
      },
      {
        type: "heading",
        text: "Before the seal is broken",
      },
      {
        type: "list",
        items: [
          "Bring the vial to ambient temperature. A vial opened cold draws in atmospheric moisture, which condenses onto a cake engineered to have none.",
          "Inspect the cake. Note collapse, discolouration or shrinkage against the appearance stated on the certificate.",
          "Confirm the batch number on the vial matches the certificate you intend to reference.",
          "Decide the diluent and the final volume before starting, and record both.",
        ],
      },
      {
        type: "heading",
        text: "Introducing diluent",
      },
      {
        type: "list",
        items: [
          "Direct the stream against the vial wall, never onto the cake. A jet onto lyophilised material generates local shear and foaming.",
          "Swirl gently; do not shake. Agitation at an air-liquid interface denatures peptides — foam is that process made visible.",
          "Allow two to three minutes. Cakes that appear insoluble have usually simply not been given time.",
          "Do not force a cake into solution with heat unless the compound record explicitly permits it.",
        ],
      },
      {
        type: "heading",
        text: "Choosing a diluent",
      },
      {
        type: "paragraph",
        text: "Bacteriostatic water contains 0.9% benzyl alcohol, which inhibits microbial growth and therefore permits a preparation to be drawn on more than once. Sterile water contains no preservative and is single-use by design. The choice determines how long a preparation remains valid and belongs in the record for that reason, not as bookkeeping.",
      },
      {
        type: "callout",
        title: "Freeze-thaw is cumulative",
        text: "Each cycle takes a measurable toll through aggregation. Where a preparation will be used more than once, aliquot at the moment of reconstitution rather than repeatedly returning the parent vial to cold storage.",
      },
      {
        type: "heading",
        text: "When a solution looks wrong",
      },
      {
        type: "paragraph",
        text: "Cloudiness, visible particulate, or unexpected viscosity are worth investigating rather than dismissing. Some peptides gel at concentration through intermolecular association — a physical phenomenon rather than degradation. Others cloud because they have exceeded solubility at the working pH. Check the concentration against documented solubility before concluding the material is at fault.",
      },
      {
        type: "heading",
        text: "The record",
      },
      {
        type: "paragraph",
        text: "Four fields make a preparation reconstructible: batch number, diluent, volume added, date of reconstitution. Any one missing and the concentration becomes an assumption rather than a measurement — an uncomfortable position when a result needs defending months later.",
      },
    ],
    related: ["storage", "calculator"],
  },
  {
    slug: "storage",
    title: "Storage and Handling",
    eyebrow: "At the bench",
    intro:
      "Four degradation pathways, four different triggers. Handling advice that treats all peptides alike protects against the average threat and the specific one badly.",
    readMinutes: 7,
    body: [
      {
        type: "paragraph",
        text: "Degradation is not one process but four, with different chemistry and different countermeasures. Reading a compound's handling note is largely a matter of identifying which of the four it is guarding against — because the instruction names the threat.",
      },
      {
        type: "heading",
        text: "Hydrolysis",
      },
      {
        type: "paragraph",
        text: "Cleavage of the backbone by water, accelerated by temperature and by pH excursion in either direction. It is the reason lyophilised storage exists at all. Countermeasure: keep water out; once in solution, keep it cold and near neutral unless the compound documents otherwise.",
      },
      {
        type: "heading",
        text: "Oxidation",
      },
      {
        type: "paragraph",
        text: "Methionine, cysteine and tryptophan are susceptible to dissolved oxygen, accelerated by light and by trace metal ions. Compounds carrying a metal centre have an additional exposure. Countermeasure: minimise headspace, work in subdued light, avoid reducing agents and chelators.",
      },
      {
        type: "heading",
        text: "Deamidation",
      },
      {
        type: "paragraph",
        text: "Asparagine and glutamine convert to acidic counterparts through a cyclic intermediate, producing a molecule one dalton heavier with an altered charge state. Strongly pH-dependent, and one of the quiet reasons diluent choice belongs in the record.",
      },
      {
        type: "heading",
        text: "Aggregation",
      },
      {
        type: "paragraph",
        text: "A physical rather than chemical change: molecules associating into higher-order structures, driven by concentration, agitation and exposure at an air-liquid interface. This is the mechanism behind swirling rather than shaking.",
      },
      {
        type: "callout",
        title: "What temperature buys",
        text: "Reaction rates fall roughly exponentially with temperature. Ambient to 2–8 °C is significant; 2–8 °C to −20 °C is larger still. Cold chain is not about preventing immediate destruction but about widening the window in which a result stays reproducible.",
      },
    ],
    table: {
      caption: "Storage reference",
      head: ["State", "Temperature", "Light", "Typical window"],
      rows: [
        [
          "Lyophilised, sealed",
          "−20 °C",
          "Protected",
          "Per retest interval on certificate",
        ],
        [
          "Lyophilised, in transit",
          "2–8 °C acceptable short-term",
          "Protected",
          "Days",
        ],
        [
          "Reconstituted",
          "2–8 °C",
          "Protected",
          "Per interval stated on certificate",
        ],
        [
          "Reconstituted, aliquoted",
          "−20 °C, single thaw",
          "Protected",
          "Per interval; one thaw only",
        ],
      ],
    },
    related: ["reconstitution", "analytical-methods"],
  },
];

export const sciencePageBySlug = new Map(sciencePages.map((p) => [p.slug, p]));

export function getSciencePage(slug: string) {
  return sciencePageBySlug.get(slug);
}

export function relatedSciencePages(page: SciencePage) {
  return page.related
    .map((slug) => sciencePageBySlug.get(slug))
    .filter((p): p is SciencePage => Boolean(p));
}
