import type { CategorySlug } from "./categories";
import { productBySlug, type Product } from "./products";

/**
 * Research stacks.
 *
 * A stack groups mechanistically related compounds under a single research
 * theme. Like the catalogue this is a presentation layer: there is no price,
 * bundle, saving or purchasable unit anywhere in the shape.
 *
 * `protocol` describes how the grouping is handled and sequenced in the
 * published record. It is a description of laboratory practice, not
 * administration guidance.
 */

export interface StackComponent {
  /** Product slug. Resolved to the full record by `stackComponents`. */
  slug: string;
  /** The part this compound plays within the grouping. */
  role: string;
}

export interface ProtocolNote {
  label: string;
  detail: string;
}

export interface StackFaq {
  question: string;
  answer: string;
}

export interface Stack {
  slug: string;
  name: string;
  /** Short label above the title. */
  eyebrow: string;
  /** One line, used on cards. */
  tagline: string;
  /** Which domain the stack belongs to — drives the accent colour. */
  category: CategorySlug;
  /** Two or three paragraphs of orientation. */
  overview: string[];
  /** What the grouping is assembled to investigate. */
  purpose: string;
  /** The research context the grouping suits. */
  idealUse: string[];
  /** The mechanistic case for studying these compounds together. */
  scientificSummary: string;
  includes: StackComponent[];
  protocol: ProtocolNote[];
  storage: string;
  /** Journal slugs that expand on the stack's science. */
  researchLinks: string[];
  faqs: StackFaq[];
  image: string;
  gallery: string[];
}

const SHARED_STORAGE =
  "Every component is supplied lyophilised and is stored independently at −20 °C, protected from light and moisture. Components are not pre-mixed: each vial carries its own batch number and its own certificate of analysis, and each is reconstituted separately. Once in solution, hold at 2–8 °C and observe the interval stated on the batch certificate for that specific component — the shortest interval in the group governs the group.";

export const stacks: Stack[] = [
  {
    slug: "regenerative-protocol",
    name: "Regenerative Protocol",
    eyebrow: "Stack 01",
    tagline:
      "Angiogenic signalling, cytoskeletal mobilisation and matrix synthesis in one preparation.",
    category: "recovery",
    overview: [
      "The most frequently assembled grouping in the tissue-repair literature. BPC-157, TB-500 and GHK-Cu act on three different stages of the same process — vascular supply, cell migration, and the matrix those cells deposit — which is why comparative work rarely examines one without reference to the others.",
      "Assembled here as three independently certified vials rather than a blend, so that a single component can be withheld, substituted or titrated without discarding the group. Each vial carries its own analytical record.",
    ],
    purpose:
      "To make the three principal mechanisms of soft-tissue remodelling available in one documented set, so that their contributions can be separated rather than confounded.",
    idealUse: [
      "Soft-tissue and connective-tissue repair models",
      "Comparative studies isolating angiogenic from cytoskeletal contribution",
      "Dermal preparations where matrix deposition is the measured endpoint",
      "Method development requiring a well-characterised positive control set",
    ],
    scientificSummary:
      "BPC-157 is characterised as acting on the VEGFR2-Akt-eNOS axis, establishing vascular supply. TB-500 sequesters monomeric G-actin and shifts the polymerisation equilibrium that governs cell migration into the affected region. GHK-Cu delivers copper to fibroblasts and modulates the balance between matrix metalloproteinases and their tissue inhibitors, determining what those migrated cells deposit. The published rationale for the grouping is sequential rather than additive: each mechanism is upstream of the next.",
    includes: [
      {
        slug: "bpc-157",
        role: "Angiogenic and cytoprotective signalling — establishes vascular supply.",
      },
      {
        slug: "tb-500",
        role: "Actin sequestration and cell migration — mobilises the cellular response.",
      },
      {
        slug: "ghk-cu",
        role: "Copper delivery and matrix regulation — governs what is deposited.",
      },
    ],
    protocol: [
      {
        label: "Sequencing in the literature",
        detail:
          "Published designs commonly stagger introduction rather than combining from the outset, so that the angiogenic and cytoskeletal contributions can be resolved separately in the time course.",
      },
      {
        label: "Reconstitution",
        detail:
          "Each component is reconstituted independently in bacteriostatic water. GHK-Cu is prepared last where the three are handled in one session, because the copper complex is the most oxidation-sensitive of the group.",
      },
      {
        label: "Preparation order",
        detail:
          "Diluent is introduced against the vial wall and the vial swirled, never shaken. TB-500 and BPC-157 tolerate standard handling; GHK-Cu should be prepared with minimal headspace.",
      },
      {
        label: "Documentation",
        detail:
          "Record the batch number of each component separately. Because the vials are not pre-mixed, a group result is only traceable if all three batch identifiers are captured.",
      },
    ],
    storage: SHARED_STORAGE,
    researchLinks: [
      "complementary-mechanisms-in-tissue-repair",
      "reconstitution-and-solution-stability",
      "how-to-read-a-certificate-of-analysis",
    ],
    faqs: [
      {
        question: "Are the components pre-mixed in a single vial?",
        answer:
          "No. Each compound is supplied in its own vial with its own batch number and certificate of analysis. Pre-mixing would make it impossible to trace a result to a specific analytical record, and it would force the whole group onto the shortest stability window in the set.",
      },
      {
        question: "Can a single component be requested on its own?",
        answer:
          "Yes. Every compound in this grouping is listed individually in the catalogue. The stack exists to describe how they are studied together, not to restrict how they are supplied.",
      },
      {
        question: "Why is GHK-Cu handled differently from the other two?",
        answer:
          "The copper(II) centre is oxidation-sensitive. Minimising headspace and avoiding contact with reducing agents or chelators preserves the complex; the characteristic blue solution colour is the immediate visual indicator that it is intact.",
      },
      {
        question: "Does the stack carry a combined certificate?",
        answer:
          "No — and deliberately so. Analytical results describe a batch of a single compound. A combined certificate would obscure which batch produced which result.",
      },
    ],
    image: "/stacks/regenerative-protocol.jpg",
    gallery: ["/stacks/regenerative-protocol.jpg", "/editorial/packaging.jpg"],
  },
  {
    slug: "metabolic-protocol",
    name: "Metabolic Protocol",
    eyebrow: "Stack 02",
    tagline:
      "Incretin receptor signalling examined alongside mitochondrial energy sensing.",
    category: "weight-loss",
    overview: [
      "Metabolic research increasingly separates two questions that were once treated as one: what a compound does at the receptor, and what the cell does with the energy that follows. This grouping pairs a receptor-level agonist with a mitochondrial-derived signalling peptide so that both can be observed in the same model.",
      "Semaglutide supplies a well-characterised, extensively documented incretin arm. MOTS-c supplies the intracellular energy-sensing arm through AMPK. Neither is a proxy for the other, which is precisely why the pairing is informative.",
    ],
    purpose:
      "To hold receptor-level incretin signalling and cellular energy sensing in one experimental frame, rather than inferring one from the other.",
    idealUse: [
      "Metabolic pathway characterisation across receptor and cellular levels",
      "Substrate utilisation studies in skeletal muscle preparations",
      "Comparative work separating appetite signalling from energy expenditure",
      "Exercise physiology models with a metabolic covariate",
    ],
    scientificSummary:
      "Semaglutide is characterised as a selective GLP-1 receptor agonist coupling to Gαs, raising cyclic AMP and driving glucose-dependent insulin secretion, with central receptor populations examined in relation to satiety. MOTS-c operates at a different level entirely: encoded in the mitochondrial 12S rRNA gene, it is described as inhibiting the folate cycle, accumulating AICAR and thereby activating AMPK, with reported nuclear translocation under metabolic stress. Studying them together allows receptor-driven and energy-state-driven effects to be attributed separately.",
    includes: [
      {
        slug: "semaglutide",
        role: "GLP-1 receptor agonism — the receptor-level metabolic input.",
      },
      {
        slug: "mots-c",
        role: "AMPK activation via the folate cycle — the cellular energy-sensing input.",
      },
    ],
    protocol: [
      {
        label: "Study design",
        detail:
          "Published designs typically run both arms independently before combining them, so that the additive and interactive components can be distinguished from the outset.",
      },
      {
        label: "Reconstitution",
        detail:
          "Both compounds reconstitute readily in bacteriostatic water. Semaglutide's acylated side chain makes it tolerant of standard handling; MOTS-c is the shorter-lived of the two in solution.",
      },
      {
        label: "Timing",
        detail:
          "The two have markedly different reported clearance profiles — one measured in days, the other rapid. Time-course designs should be built around the shorter of the two rather than the longer.",
      },
      {
        label: "Documentation",
        detail:
          "Record purity and content values from each certificate. Comparative metabolic work is sensitive to content variance, so the assayed content figure matters more here than the nominal label strength.",
      },
    ],
    storage: SHARED_STORAGE,
    researchLinks: [
      "incretin-receptor-pharmacology",
      "mitochondrial-derived-peptides",
      "understanding-concentration-and-dilution",
    ],
    faqs: [
      {
        question: "Why pair a receptor agonist with a mitochondrial peptide?",
        answer:
          "Because they answer different questions. A receptor agonist tells you what happens when a specific signalling route is engaged; a mitochondrial-derived peptide tells you what the cell's own energy sensor does. Observing both in one model prevents attributing a downstream effect to the wrong mechanism.",
      },
      {
        question: "Can tirzepatide or retatrutide be substituted for semaglutide?",
        answer:
          "In published comparative work, yes — the substitution is the point. Moving from single to dual to triple receptor agonism while holding the mitochondrial arm constant is a common way to isolate the contribution of each additional receptor.",
      },
      {
        question: "Do the two compounds share a stability window?",
        answer:
          "No. They have different reported clearance and solution-stability profiles. Where both are in solution simultaneously, the shorter interval on the relevant certificate governs the preparation.",
      },
    ],
    image: "/stacks/metabolic-protocol.jpg",
    gallery: ["/stacks/metabolic-protocol.jpg", "/editorial/packaging.jpg"],
  },
  {
    slug: "longevity-protocol",
    name: "Longevity Protocol",
    eyebrow: "Stack 03",
    tagline:
      "Redox cofactor availability studied alongside mitochondrial energy signalling.",
    category: "longevity",
    overview: [
      "Cellular ageing research keeps returning to the same pair of variables: how much NAD+ is available to the enzymes that consume it, and how the cell reports its own energy state. This grouping places a cofactor and a signalling peptide side by side so that supply and signal can be examined together.",
      "NAD+ is not a modulator — it is a substrate, consumed by sirtuins, PARPs and CD38. MOTS-c is a signal. Confusing the two is one of the more common errors in the literature, and studying them together makes the distinction unavoidable.",
    ],
    purpose:
      "To separate cofactor availability from energy-state signalling in models of cellular ageing and mitochondrial capacity.",
    idealUse: [
      "Cellular ageing and senescence model characterisation",
      "Sirtuin and PARP activity assays where cofactor pool is a variable",
      "Mitochondrial oxidative capacity studies",
      "Redox biochemistry method development",
    ],
    scientificSummary:
      "NAD+ functions as an obligate electron acceptor in catabolic oxidation and as the substrate consumed by NAD-dependent enzymes; the free pool available for oxidative phosphorylation is set by the balance between salvage-pathway synthesis and consumption by PARPs, sirtuins and CD38. MOTS-c, by contrast, is a signalling peptide encoded in the mitochondrial genome, characterised as activating AMPK through folate-cycle inhibition and AICAR accumulation. One is the currency; the other is the message about how much currency remains.",
    includes: [
      {
        slug: "nad-plus",
        role: "Redox cofactor — the substrate consumed by sirtuins, PARPs and CD38.",
      },
      {
        slug: "mots-c",
        role: "Mitochondrial signalling peptide — reports and responds to energy state.",
      },
    ],
    protocol: [
      {
        label: "Handling priority",
        detail:
          "NAD+ is hygroscopic and light-sensitive and sets the handling standard for the group. Prepare it in subdued light, keep the vial closed until the moment of reconstitution, and return unused material to cold storage promptly.",
      },
      {
        label: "Reconstitution",
        detail:
          "NAD+ is freely soluble but pH-sensitive in solution; the diluent used should be recorded, because pH shifts alter the degradation rate of the oxidised form. MOTS-c reconstitutes conventionally.",
      },
      {
        label: "Aliquoting",
        detail:
          "Both components suffer from repeated freeze-thaw cycles. Where a preparation will be drawn on more than once, aliquot at the point of reconstitution rather than returning the parent vial to the freezer.",
      },
      {
        label: "Documentation",
        detail:
          "Record the assayed content for NAD+ specifically. Because it is consumed stoichiometrically rather than acting catalytically, content variance translates directly into experimental variance.",
      },
    ],
    storage: SHARED_STORAGE,
    researchLinks: [
      "mitochondrial-derived-peptides",
      "peptide-stability-and-degradation",
      "third-party-verification-explained",
    ],
    faqs: [
      {
        question: "Why is NAD+ handled more carefully than the peptides?",
        answer:
          "It is hygroscopic and light-sensitive, and it is consumed rather than recycled in the reactions of interest. Both properties mean handling error shows up directly in the result, where a signalling peptide is more forgiving.",
      },
      {
        question: "Is the pairing additive?",
        answer:
          "Not in a simple sense. One supplies a substrate pool; the other modulates a sensing pathway. The published rationale is that observing them together lets you tell substrate limitation apart from signalling change — an effect that looks identical if you measure only downstream.",
      },
      {
        question: "Does the group have a shared certificate?",
        answer:
          "No. Each vial is certified independently. For NAD+ in particular the assayed content figure should be read from the certificate rather than assumed from the label strength.",
      },
    ],
    image: "/stacks/longevity-protocol.jpg",
    gallery: ["/stacks/longevity-protocol.jpg", "/editorial/packaging.jpg"],
  },
  {
    slug: "somatotropic-protocol",
    name: "Somatotropic Protocol",
    eyebrow: "Stack 04",
    tagline:
      "Two independent inputs to the growth axis, examined alongside tissue remodelling.",
    category: "growth",
    overview: [
      "The somatotropic axis has two distinct pharmacological entry points, and the literature treats them as complementary rather than interchangeable. CJC-1295 engages the GHRH receptor; Ipamorelin engages GHS-R1a through a separate G-protein route. Supplied together, they allow the additive question to be asked directly.",
      "TB-500 is included because growth-axis studies frequently carry a tissue-remodelling endpoint, and actin dynamics are the most direct way to measure it. The grouping is therefore two inputs and one readout.",
    ],
    purpose:
      "To make both routes into the somatotropic axis available in one documented set, with a cytoskeletal readout for downstream remodelling.",
    idealUse: [
      "Somatotropic axis and pulsatility characterisation",
      "Receptor selectivity profiling across GHRH-R and GHS-R1a",
      "Neuroendocrine model development",
      "Musculoskeletal remodelling studies with an endocrine input",
    ],
    scientificSummary:
      "CJC-1295 is characterised as a GHRH analogue modified at four positions to resist dipeptidyl peptidase cleavage, engaging the GHRH receptor on somatotrophs and raising cyclic AMP to increase secretory pulse amplitude. Ipamorelin is a selective pentapeptide agonist at GHS-R1a acting through a Gq-coupled route, notable in the literature for the absence of the cortisol and prolactin cross-reactivity reported for earlier secretagogues. TB-500 supplies the remodelling readout through G-actin sequestration and the resulting shift in polymerisation equilibrium.",
    includes: [
      {
        slug: "cjc-1295-ipamorelin",
        role: "Dual somatotropic input — GHRH receptor and GHS-R1a in one preparation.",
      },
      {
        slug: "tb-500",
        role: "Cytoskeletal readout — actin dynamics as the remodelling endpoint.",
      },
      {
        slug: "nad-plus",
        role: "Metabolic context — mitochondrial capacity as a covariate of growth signalling.",
      },
    ],
    protocol: [
      {
        label: "Pulsatility",
        detail:
          "The axis is pulsatile by nature, and published designs are built around that. Sampling schedules matter more here than in receptor-level work, because a single time point can miss the effect entirely.",
      },
      {
        label: "Reconstitution",
        detail:
          "The CJC-1295 / Ipamorelin preparation and TB-500 both reconstitute conventionally in bacteriostatic water. NAD+ requires the subdued-light handling described on its own record.",
      },
      {
        label: "Half-life asymmetry",
        detail:
          "The two somatotropic components have markedly different reported clearance — roughly thirty minutes against approximately two hours. Time-course designs should account for the asymmetry rather than treating the pair as a single agent.",
      },
      {
        label: "Documentation",
        detail:
          "The blended preparation carries content values for both constituents on its certificate. Record both; the ratio, not just the total, is the experimentally relevant figure.",
      },
    ],
    storage: SHARED_STORAGE,
    researchLinks: [
      "the-somatotropic-axis",
      "peptide-stability-and-degradation",
      "how-to-read-a-certificate-of-analysis",
    ],
    faqs: [
      {
        question: "Why combine a GHRH analogue with a secretagogue?",
        answer:
          "They act on different receptors through different G-protein routes. The literature treats the inputs as additive rather than redundant, and supplying both allows that assumption to be tested rather than inherited.",
      },
      {
        question: "What does the certificate report for a blended vial?",
        answer:
          "Content is reported for each constituent separately, alongside overall purity. The ratio between the two is what determines comparability between batches, so both figures should be recorded.",
      },
      {
        question: "Why include NAD+ in a growth-axis grouping?",
        answer:
          "Because somatotropic signalling and mitochondrial capacity intersect, and studies that measure only the endocrine arm cannot distinguish a signalling change from a capacity change. It is included as a covariate, not as an intervention.",
      },
    ],
    image: "/stacks/somatotropic-protocol.jpg",
    gallery: ["/stacks/somatotropic-protocol.jpg", "/editorial/packaging.jpg"],
  },
  {
    slug: "cognitive-protocol",
    name: "Cognitive Protocol",
    eyebrow: "Stack 05",
    tagline:
      "Two regulatory neuropeptides with complementary neurotrophic and monoaminergic profiles.",
    category: "neuro",
    overview: [
      "Semax and Selank are the two most extensively documented members of the Russian regulatory-peptide series, and they are rarely studied apart. Both are short peptides stabilised by a proline-glycine-proline extension; both act on neurotrophic expression; neither does so by the same route.",
      "The grouping is assembled for comparative neuropeptide work — the case where the question is not whether a peptide has an effect, but which of two mechanisms accounts for it.",
    ],
    purpose:
      "To place two mechanistically distinct regulatory neuropeptides in one comparative frame with a shared stabilising architecture.",
    idealUse: [
      "Neurotrophic factor expression assays",
      "Comparative regulatory peptide characterisation",
      "Central nervous system model development",
      "Peptide stability studies where the PGP extension is the variable",
    ],
    scientificSummary:
      "Semax is characterised as an ACTH(4-10) analogue that raises BDNF and NGF transcript levels in hippocampal and cortical preparations without the adrenocorticotropic activity of the parent fragment, with additional work on dopaminergic and serotonergic signalling. Selank derives from the immunomodulatory tetrapeptide tuftsin and is examined for inhibition of enkephalin-degrading enzymes alongside changes in GABAergic and serotonergic gene expression. Both share the proline-glycine-proline extension that confers peptidase resistance — which makes the pair a natural control for one another on stability while differing on mechanism.",
    includes: [
      {
        slug: "semax",
        role: "Neurotrophic arm — BDNF and NGF expression, monoaminergic signalling.",
      },
      {
        slug: "selank",
        role: "Regulatory arm — enkephalin degradation kinetics, GABAergic expression.",
      },
      {
        slug: "nad-plus",
        role: "Energy context — neuronal mitochondrial capacity as a covariate.",
      },
    ],
    protocol: [
      {
        label: "Comparative design",
        detail:
          "Because both compounds share the same stabilising extension, published designs often use one as the stability control for the other, isolating mechanism from pharmacokinetics.",
      },
      {
        label: "Reconstitution",
        detail:
          "Both are readily soluble in water and tolerate conventional handling. Neither is notably light- or oxidation-sensitive, which is unusual in this catalogue and simplifies session planning.",
      },
      {
        label: "Sequencing",
        detail:
          "Where both are examined in one model, the literature commonly runs them in separate arms before any combined arm, so that overlapping monoaminergic effects can be attributed correctly.",
      },
      {
        label: "Documentation",
        detail:
          "Record purity for both. Sequence-confirmed identity matters particularly here, because the two share a structural motif and a purity figure alone does not establish which peptide is in the vial.",
      },
    ],
    storage: SHARED_STORAGE,
    researchLinks: [
      "regulatory-neuropeptides",
      "purity-versus-identity",
      "reconstitution-and-solution-stability",
    ],
    faqs: [
      {
        question: "Why does identity testing matter more for this grouping?",
        answer:
          "Both peptides carry the same proline-glycine-proline stabilising motif. A purity result tells you a sample is homogeneous; it does not tell you which of two structurally related peptides you are holding. Mass spectrometry answers that question, and it is reported on every certificate.",
      },
      {
        question: "Are the two compounds interchangeable?",
        answer:
          "No. They share an architecture but not a mechanism — one derives from an ACTH fragment, the other from tuftsin. The shared architecture is what makes them useful as controls for one another, not what makes them substitutable.",
      },
      {
        question: "Why is NAD+ part of a cognitive grouping?",
        answer:
          "Neuronal tissue is metabolically demanding, and neurotrophic endpoints are sensitive to mitochondrial capacity. It is included so that an energy-limited result is not mistaken for a signalling result.",
      },
    ],
    image: "/stacks/cognitive-protocol.jpg",
    gallery: ["/stacks/cognitive-protocol.jpg", "/editorial/packaging.jpg"],
  },
];

export const stackBySlug = new Map(stacks.map((s) => [s.slug, s]));

export function getStack(slug: string) {
  return stackBySlug.get(slug);
}

/** Resolve a stack's component slugs to full product records. */
export function stackComponents(stack: Stack) {
  return stack.includes
    .map((entry) => {
      const product = productBySlug.get(entry.slug);
      return product ? { product, role: entry.role } : null;
    })
    .filter((entry): entry is { product: Product; role: string } =>
      Boolean(entry),
    );
}

/** Stacks that include a given compound — shown on the product page. */
export function stacksContaining(productSlug: string) {
  return stacks.filter((stack) =>
    stack.includes.some((entry) => entry.slug === productSlug),
  );
}
