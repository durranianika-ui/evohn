import type { CategorySlug } from "./categories";

/**
 * Product catalogue.
 *
 * The single authoritative product dataset. Catalogue, search, the homepage
 * collection, category filters, related products and the compound index all
 * read from here, so a compound cannot appear in one surface and be missing
 * from another, and it cannot carry one image on a card and a different one on
 * its page.
 *
 * Contents and classification follow the approved EVOHN Catalogue & Price List
 * 2026: twelve entries, in the order the catalogue prints them. Nothing is
 * listed here that the catalogue does not list.
 *
 * This is a presentation catalogue, not a store: there is deliberately no
 * price, stock, SKU or purchasable unit anywhere in this shape.
 *
 * `dosage` describes the presentation strength printed on the label (Brand
 * Identity Kit §09) — it is not administration guidance.
 *
 * The structure is intentionally flat and serialisable so it can be lifted
 * into a headless CMS without touching a single component. Every long-form
 * field is plain text; nothing here is markup.
 */

export interface ProductSpecs {
  /** CAS registry number. Verify against the batch certificate of analysis. */
  cas: string;
  formula: string;
  molarMass: string;
  purity: string;
  form: string;
  /** Single-letter amino acid sequence where the compound is a peptide. */
  sequence?: string;
  /** Reported circulating half-life, as characterised in the literature. */
  halfLife?: string;
  solubility?: string;
}

/** How extensively the compound appears in the published record. */
export type EvidenceLevel = "Extensively studied" | "Established" | "Emerging";

export interface Compatibility {
  /** Slug of the co-studied compound. */
  slug: string;
  /** Why the two appear together in the literature. */
  note: string;
}

export interface Reference {
  title: string;
  source: string;
  year: string;
}

/* -------------------------------------------------------------------------
   Presentations.

   The catalogue prints every compound in two presentations — the lyophilised
   vial and the pre-filled pen — carrying identical certified material. Both
   are first-class here so the pen is never an afterthought a component has to
   invent, and so a card can show whichever presentation its surface calls for.
   ---------------------------------------------------------------------- */

export type PresentationKind = "vial" | "pen";

export interface Presentation {
  kind: PresentationKind;
  /** Display name — "Vial" or "Pen". */
  name: string;
  /** Strength as printed on this presentation's label. */
  dosage: string;
  /** Approved catalogue render. Resolved by convention — see `renderFor`. */
  image: string;
  /** One line describing what the presentation is. */
  summary: string;
  /** Set where the presentation is not held as a standing line. */
  note?: string;
}

/**
 * The centralised asset mapping.
 *
 * Every product render is named for its slug and presentation, so there is
 * exactly one place a product's imagery is decided. Adding a compound means
 * dropping two files in `public/products` — no component, card or page needs
 * to learn about it. All renders come from the approved 2026 catalogue, which
 * is why the range is visually consistent wherever it appears.
 */
export function renderFor(slug: string, kind: PresentationKind) {
  return `/products/${kind}-${slug}.webp`;
}

const VIAL_SUMMARY =
  "Lyophilised powder in a sealed glass vial under a matte crimp cap, reconstituted with bacteriostatic water before use.";

const PEN_SUMMARY =
  "The same certified material pre-filled into a metered delivery device, ready for use without reconstitution.";

function presentations(
  slug: string,
  vialDosage: string,
  penDosage: string,
  penNote?: string,
): Presentation[] {
  return [
    {
      kind: "vial",
      name: "Vial",
      dosage: vialDosage,
      image: renderFor(slug, "vial"),
      summary: VIAL_SUMMARY,
    },
    {
      kind: "pen",
      name: "Pen",
      dosage: penDosage,
      image: renderFor(slug, "pen"),
      summary: PEN_SUMMARY,
      ...(penNote ? { note: penNote } : {}),
    },
  ];
}

export interface Product {
  slug: string;
  name: string;
  /** Kit label line, e.g. "Weight Loss / GLP-1". */
  subtitle: string;
  category: CategorySlug;
  /** Vial strength. The per-presentation strengths live on `presentations`. */
  dosage: string;
  /** Alternative designations used in the literature, plus search aliases. */
  alsoKnownAs: string[];
  /** Card-length description. One sentence. */
  summary: string;
  /** Long-form characterisation for the detail page. */
  description: string;
  /** One-paragraph mechanism statement, framed as characterisation. */
  mechanism: string;
  evidence: EvidenceLevel;
  /** Areas of published investigation — framed as research, never as benefit. */
  researchFocus: string[];
  applications: string[];
  /** Compounds frequently co-studied with this one. */
  compatibility: Compatibility[];
  /** Selected entries from the published record. */
  references: Reference[];
  storage: string;
  handling: string;
  packaging: string;
  specs: ProductSpecs;
  /** Both presentations, vial first. */
  presentations: Presentation[];
  /** Canonical card image — the vial render. */
  image: string;
  gallery: string[];
  related: string[];
}

/* -------------------------------------------------------------------------
   Shared presentation copy. Identical across the range by design — the vial,
   closure and outer carton are one specification, so the text is one string.
   ---------------------------------------------------------------------- */

const STORAGE =
  "Store lyophilised at −20 °C, protected from light and moisture. Following reconstitution, hold at 2–8 °C and use within the interval stated on the batch certificate of analysis.";

const HANDLING =
  "Allow the vial to reach ambient temperature before breaking the seal so atmospheric moisture does not condense onto the cake. Introduce diluent slowly against the vial wall rather than directly onto the powder, and swirl rather than shake. Avoid repeated freeze-thaw cycles; aliquot where a preparation will be drawn on more than once.";

const PACKAGING =
  "Amber borosilicate vial with butyl stopper and aluminium crimp seal, presented in a matte debossed box with die-cut foam insert and magnetic closure.";

const EDITORIAL = "/editorial/packaging.jpg";

export const products: Product[] = [
  {
    slug: "nad-plus",
    name: "NAD+",
    subtitle: "Longevity / Coenzyme",
    category: "longevity",
    dosage: "500 mg / vial",
    alsoKnownAs: [
      "Nicotinamide adenine dinucleotide",
      "Coenzyme I",
      "NAD",
      "NAD plus",
    ],
    summary:
      "An endogenous pyridine dinucleotide coenzyme central to cellular redox biochemistry.",
    description:
      "Nicotinamide adenine dinucleotide is an endogenous coenzyme present in every living cell, cycling between oxidised and reduced states as an electron carrier. Literature examines its function as a required cofactor for sirtuin deacetylases, poly-ADP-ribose polymerases and CD38 hydrolase, and the relationship between cellular concentration and mitochondrial oxidative capacity.",
    mechanism:
      "Functions as an obligate electron acceptor in catabolic oxidation and as the substrate consumed by NAD-dependent enzymes. Published work examines how the balance between synthesis via the salvage pathway and consumption by PARPs, sirtuins and CD38 determines the free pool available for oxidative phosphorylation.",
    evidence: "Extensively studied",
    researchFocus: [
      "Sirtuin-dependent deacetylation",
      "PARP-mediated DNA repair signalling",
      "Mitochondrial oxidative phosphorylation",
      "Cellular redox state characterisation",
    ],
    applications: [
      "Cellular ageing research",
      "Redox biochemistry assays",
      "Mitochondrial function characterisation",
      "Enzyme cofactor studies",
    ],
    compatibility: [
      {
        slug: "mots-c",
        note: "Paired where cofactor availability and energy sensing are examined as one system.",
      },
      {
        slug: "ghk-cu",
        note: "Co-studied in dermal models linking redox state to matrix synthesis.",
      },
      {
        slug: "cjc-1295-ipamorelin",
        note: "Examined together where somatotropic signalling and mitochondrial capacity intersect.",
      },
    ],
    references: [
      {
        title: "NAD+ metabolism and its roles in cellular processes",
        source: "Nature Reviews Molecular Cell Biology",
        year: "2021",
      },
      {
        title: "Sirtuins, NAD+ and the mitochondrial unfolded protein response",
        source: "Cell",
        year: "2013",
      },
      {
        title: "NAD+ salvage pathway flux and cellular concentration",
        source: "Journal of Biological Chemistry",
        year: "2019",
      },
    ],
    storage:
      "Store lyophilised at −20 °C, protected from light and moisture. NAD+ is hygroscopic and light-sensitive; minimise exposure during handling. Following reconstitution, hold at 2–8 °C and use within the interval stated on the batch certificate of analysis.",
    handling:
      "Hygroscopic. Keep the vial closed until the moment of reconstitution and return unused material to cold storage promptly. Prepare in subdued light and avoid prolonged exposure at ambient temperature, which accelerates degradation of the oxidised form.",
    packaging: PACKAGING,
    specs: {
      cas: "53-84-9",
      formula: "C₂₁H₂₇N₇O₁₄P₂",
      molarMass: "≈ 663.43 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
      halfLife: "Rapid turnover; pool-dependent",
      solubility: "Freely soluble in water; pH-sensitive in solution",
    },
    presentations: presentations("nad-plus", "500 mg / vial", "500 mg / pen"),
    image: renderFor("nad-plus", "vial"),
    gallery: [
      renderFor("nad-plus", "vial"),
      renderFor("nad-plus", "pen"),
      EDITORIAL,
    ],
    related: ["mots-c", "ghk-cu", "cjc-1295-ipamorelin"],
  },
  {
    slug: "retatrutide",
    name: "Retatrutide",
    subtitle: "Weight Loss / GLP-1",
    category: "weight-loss",
    dosage: "10 mg / vial",
    alsoKnownAs: [
      "Triple agonist",
      "LY3437943",
      "Reta",
      "GLP-1 triagonist",
    ],
    summary:
      "A triple receptor agonist studied across GIP, GLP-1 and glucagon signalling pathways.",
    description:
      "Retatrutide is a synthetic peptide characterised in the literature as a single molecule with agonist activity at three distinct receptors: glucose-dependent insulinotropic polypeptide, glucagon-like peptide-1, and glucagon. The triple-agonist architecture is studied for the way concurrent glucagon receptor engagement modifies energy expenditure signalling relative to dual and single agonists.",
    mechanism:
      "Characterised as engaging GIPR, GLP-1R and GCGR from one backbone. The glucagon arm is examined for hepatic effects on lipid handling and for its contribution to energy expenditure, which distinguishes the pharmacology from incretin-only agonists that act principally on insulin secretion and appetite pathways.",
    evidence: "Emerging",
    researchFocus: [
      "Triple receptor agonism",
      "Glucagon receptor contribution to energy signalling",
      "Comparative incretin pharmacology",
      "Hepatic lipid metabolism pathways",
    ],
    applications: [
      "Multi-receptor mechanism research",
      "Energy expenditure model characterisation",
      "Comparative agonist profiling",
      "Preclinical metabolic investigation",
    ],
    compatibility: [
      {
        slug: "mots-c",
        note: "Examined alongside mitochondrial peptides where substrate utilisation is the endpoint.",
      },
      {
        slug: "nad-plus",
        note: "Co-studied where hepatic energy metabolism and redox state are examined together.",
      },
      {
        slug: "tesamorelin",
        note: "Contrasted where metabolic and somatotropic routes to substrate handling are compared.",
      },
    ],
    references: [
      {
        title: "A GIP/GLP-1/glucagon receptor triagonist",
        source: "Nature Metabolism",
        year: "2022",
      },
      {
        title: "Glucagon receptor agonism and hepatic lipid flux",
        source: "Journal of Hepatology",
        year: "2023",
      },
      {
        title: "Multi-receptor peptide design principles",
        source: "Peptide Science",
        year: "2024",
      },
    ],
    storage: STORAGE,
    handling: HANDLING,
    packaging: PACKAGING,
    specs: {
      cas: "2381089-83-2",
      formula: "C₂₂₁H₃₄₂N₄₆O₆₈",
      molarMass: "≈ 4731.40 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
      halfLife: "≈ 144 h (reported)",
      solubility: "Soluble in bacteriostatic water and sterile saline",
    },
    presentations: presentations("retatrutide", "10 mg / vial", "10 mg / pen"),
    image: renderFor("retatrutide", "vial"),
    gallery: [
      renderFor("retatrutide", "vial"),
      renderFor("retatrutide", "pen"),
      EDITORIAL,
    ],
    related: ["mots-c", "nad-plus", "tesamorelin"],
  },
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    subtitle: "Growth / GHRH Analogue",
    category: "growth",
    dosage: "10 mg / vial",
    alsoKnownAs: ["GRF(1-44) analogue", "TH9507", "Tesamorelin acetate"],
    summary:
      "A stabilised growth hormone-releasing factor analogue studied for somatotropic signalling.",
    description:
      "Tesamorelin is a synthetic forty-four amino acid analogue of human growth hormone-releasing hormone, modified at the N-terminus with a trans-3-hexenoyl group that slows enzymatic cleavage relative to the native sequence. The published record characterises it as a receptor agonist acting on the pituitary somatotroph, and examines the pulsatile secretion pattern that follows from stimulating the axis at its physiological control point.",
    mechanism:
      "Described as binding the GHRH receptor on somatotrophs and raising intracellular cyclic AMP, increasing the amplitude of endogenous secretory pulses rather than imposing a continuous signal. The N-terminal modification is studied for the resistance to dipeptidyl peptidase-4 cleavage that extends the interval over which the analogue remains intact.",
    evidence: "Established",
    researchFocus: [
      "GHRH receptor signalling",
      "Pulsatile secretion architecture",
      "IGF-1 axis characterisation",
      "Peptide stabilisation by N-terminal modification",
    ],
    applications: [
      "Somatotropic axis research",
      "Neuroendocrine model characterisation",
      "Comparative GHRH analogue studies",
      "Peptide stability profiling",
    ],
    compatibility: [
      {
        slug: "cjc-1295-ipamorelin",
        note: "The standard comparison: one GHRH-receptor input examined against a combined GHRH and secretagogue-receptor input.",
      },
      {
        slug: "nad-plus",
        note: "Examined together where growth signalling and mitochondrial capacity are measured in the same model.",
      },
      {
        slug: "retatrutide",
        note: "Contrasted where somatotropic and incretin routes to substrate handling are compared.",
      },
    ],
    references: [
      {
        title: "Growth hormone-releasing factor analogues and receptor activation",
        source: "Journal of Clinical Endocrinology & Metabolism",
        year: "2010",
      },
      {
        title: "Enzymatic stabilisation of GHRH by N-terminal modification",
        source: "Peptides",
        year: "2012",
      },
      {
        title: "Pulsatility in the somatotropic axis",
        source: "Endocrine Reviews",
        year: "2016",
      },
    ],
    storage: STORAGE,
    handling: HANDLING,
    packaging: PACKAGING,
    specs: {
      cas: "218949-48-5",
      formula: "C₂₂₁H₃₆₆N₇₂O₆₇S",
      molarMass: "≈ 5135.86 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
      sequence: "YADAIFTNSYRKVLGQLSARKLLQDIMSRQQGESNQERGARAR",
      halfLife: "Short in circulation; extended relative to native GHRH",
      solubility: "Soluble in bacteriostatic water",
    },
    presentations: presentations("tesamorelin", "10 mg / vial", "10 mg / pen"),
    image: renderFor("tesamorelin", "vial"),
    gallery: [
      renderFor("tesamorelin", "vial"),
      renderFor("tesamorelin", "pen"),
      EDITORIAL,
    ],
    related: ["cjc-1295-ipamorelin", "nad-plus", "retatrutide"],
  },
  {
    slug: "bpc-157-tb-500",
    name: "BPC-157 + TB-500",
    subtitle: "Recovery / Co-Study Pair",
    category: "recovery",
    dosage: "5 mg + 5 mg / vial",
    alsoKnownAs: [
      "BPC-157",
      "TB-500",
      "Body Protection Compound-157",
      "Thymosin beta-4 fragment",
      "Pentadecapeptide BPC 157",
      "Tβ4",
    ],
    summary:
      "The two most frequently paired repair peptides, presented together for co-study.",
    description:
      "This preparation presents BPC-157 and TB-500 in a single vial, in the proportion in which the tissue-repair literature most often examines them. BPC-157 is a synthetic fifteen amino acid peptide corresponding to a partial sequence of body protection compound, a protein isolated from human gastric juice. TB-500 is a synthetic preparation corresponding to thymosin beta-4, a forty-three amino acid actin-sequestering peptide present in most mammalian cell types. The two are studied together because their characterised mechanisms are complementary rather than overlapping.",
    mechanism:
      "BPC-157 is described in published models as upregulating vascular endothelial growth factor receptor 2 with downstream activity along the VEGFR2-Akt-eNOS axis, alongside modulation of the nitric oxide system and effects on focal adhesion kinase that underlie the fibroblast migration reported in tendon preparations. TB-500 is characterised as sequestering monomeric G-actin, shifting the polymerisation equilibrium and altering cytoskeletal turnover. The pairing is examined as angiogenic signalling and cytoskeletal mobilisation measured in one model.",
    evidence: "Extensively studied",
    researchFocus: [
      "Angiogenic signalling and VEGFR2 pathways",
      "G-actin sequestration and cytoskeletal dynamics",
      "Fibroblast and endothelial cell migration",
      "Extracellular matrix organisation",
    ],
    applications: [
      "Soft-tissue repair research",
      "Musculoskeletal model characterisation",
      "Cell motility and cytoprotection assays",
      "Combination mechanism investigation",
    ],
    compatibility: [
      {
        slug: "ghk-cu",
        note: "Studied together where matrix remodelling and vascularisation are examined in one dermal model.",
      },
      {
        slug: "cjc-1295-ipamorelin",
        note: "Co-examined where growth factor receptor expression is a shared endpoint.",
      },
      {
        slug: "snap-8",
        note: "Paired where dermal repair is measured alongside matrix-active signalling.",
      },
    ],
    references: [
      {
        title: "BPC 157 and the VEGFR2-Akt-eNOS signalling pathway",
        source: "Journal of Applied Physiology",
        year: "2016",
      },
      {
        title: "Thymosin β4 and actin sequestration",
        source: "Annals of the New York Academy of Sciences",
        year: "2012",
      },
      {
        title: "Actin-binding peptides in tissue remodelling",
        source: "Expert Opinion on Biological Therapy",
        year: "2019",
      },
    ],
    storage: STORAGE,
    handling: HANDLING,
    packaging: PACKAGING,
    specs: {
      cas: "137525-51-0 / 77591-33-4",
      formula: "C₆₂H₉₈N₁₆O₂₂ / C₂₁₂H₃₅₀N₅₆O₇₈S",
      molarMass: "≈ 1419.53 / 4963.44 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
      sequence: "GEPPPGKPADDAGLV (BPC-157)",
      halfLife: "Short for BPC-157; extended for TB-500",
      solubility: "Readily soluble in bacteriostatic water",
    },
    presentations: presentations(
      "bpc-157-tb-500",
      "5 mg + 5 mg / vial",
      "5 mg + 5 mg / pen",
    ),
    image: renderFor("bpc-157-tb-500", "vial"),
    gallery: [
      renderFor("bpc-157-tb-500", "vial"),
      renderFor("bpc-157-tb-500", "pen"),
      EDITORIAL,
    ],
    related: ["ghk-cu", "snap-8", "cjc-1295-ipamorelin"],
  },
  {
    slug: "cjc-1295-ipamorelin",
    name: "CJC-1295 / Ipamorelin",
    subtitle: "Growth / Secretagogue",
    category: "growth",
    dosage: "5 mg + 5 mg / vial",
    alsoKnownAs: [
      "CJC-1295 no-DAC with Ipamorelin",
      "GHRH analogue blend",
      "CJC-1295",
      "Ipamorelin",
    ],
    summary:
      "A GHRH analogue paired with a selective ghrelin receptor agonist for somatotropic research.",
    description:
      "This preparation combines CJC-1295, a synthetic analogue of growth hormone-releasing hormone modified at four positions to resist enzymatic cleavage, with Ipamorelin, a selective pentapeptide agonist at the growth hormone secretagogue receptor GHS-R1a. The literature examines the two mechanisms as complementary inputs to the somatotropic axis, and Ipamorelin specifically for its selectivity relative to earlier secretagogues.",
    mechanism:
      "CJC-1295 is characterised as engaging the GHRH receptor on somatotrophs, raising cyclic AMP and increasing the amplitude of secretory pulses. Ipamorelin is described as acting at GHS-R1a through a distinct Gq-coupled route, without the cortisol and prolactin cross-reactivity reported for earlier secretagogues. The two inputs are studied as additive rather than redundant.",
    evidence: "Established",
    researchFocus: [
      "GHRH receptor signalling",
      "GHS-R1a selectivity profiling",
      "Pulsatile secretion patterns",
      "IGF-1 axis characterisation",
    ],
    applications: [
      "Somatotropic axis research",
      "Neuroendocrine model characterisation",
      "Receptor selectivity assays",
      "Comparative secretagogue studies",
    ],
    compatibility: [
      {
        slug: "tesamorelin",
        note: "The standard comparison: a combined receptor input examined against a single GHRH-receptor analogue.",
      },
      {
        slug: "nad-plus",
        note: "Examined together in models linking growth signalling to mitochondrial capacity.",
      },
      {
        slug: "bpc-157-tb-500",
        note: "Paired where growth factor receptor expression is the shared measurement.",
      },
    ],
    references: [
      {
        title: "Ipamorelin, the first selective growth hormone secretagogue",
        source: "European Journal of Endocrinology",
        year: "1998",
      },
      {
        title: "CJC-1295 and sustained GHRH receptor activation",
        source: "Journal of Clinical Endocrinology & Metabolism",
        year: "2006",
      },
      {
        title: "Pulsatility in the somatotropic axis",
        source: "Endocrine Reviews",
        year: "2016",
      },
    ],
    storage: STORAGE,
    handling: HANDLING,
    packaging: PACKAGING,
    specs: {
      cas: "863288-34-0 / 170851-70-4",
      formula: "C₁₅₂H₂₅₂N₄₄O₄₂ / C₃₈H₄₉N₉O₅",
      molarMass: "≈ 3367.80 / 711.85 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
      halfLife: "≈ 30 min (CJC-1295 no-DAC) / ≈ 2 h (Ipamorelin)",
      solubility: "Soluble in bacteriostatic water",
    },
    presentations: presentations(
      "cjc-1295-ipamorelin",
      "5 mg + 5 mg / vial",
      "5 mg + 5 mg / pen",
    ),
    image: renderFor("cjc-1295-ipamorelin", "vial"),
    gallery: [
      renderFor("cjc-1295-ipamorelin", "vial"),
      renderFor("cjc-1295-ipamorelin", "pen"),
      EDITORIAL,
    ],
    related: ["tesamorelin", "nad-plus", "bpc-157-tb-500"],
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    subtitle: "Metabolism / Mitochondrial",
    category: "metabolism",
    dosage: "10 mg / vial",
    alsoKnownAs: [
      "Mitochondrial ORF of the 12S rRNA type-c",
      "MOTSc",
      "Mitochondrial-derived peptide",
    ],
    summary:
      "A mitochondrial-derived peptide studied for AMPK activation and metabolic homeostasis.",
    description:
      "MOTS-c is a sixteen amino acid peptide encoded within the mitochondrial 12S ribosomal RNA gene, one of a small class of mitochondrial-derived peptides. Published work examines its translocation to the nucleus under metabolic stress and its characterised action on the AMP-activated protein kinase pathway and folate-methionine cycle intermediates.",
    mechanism:
      "Described as inhibiting the folate cycle and accumulating AICAR, which in turn activates AMPK. Under metabolic stress the peptide is reported to translocate to the nucleus and associate with stress-response transcription factors, positioning it as a signal between the mitochondrial and nuclear genomes.",
    evidence: "Established",
    researchFocus: [
      "AMPK pathway activation",
      "Mitochondrial-nuclear signalling",
      "Folate-methionine cycle intermediates",
      "Glucose utilisation in skeletal muscle models",
    ],
    applications: [
      "Mitochondrial biology research",
      "Metabolic homeostasis characterisation",
      "Exercise physiology model studies",
      "Cellular energy sensing assays",
    ],
    compatibility: [
      {
        slug: "nad-plus",
        note: "The standard longevity pairing — energy sensing examined alongside redox cofactor availability.",
      },
      {
        slug: "retatrutide",
        note: "Combined where incretin signalling and cellular energy sensing are measured together.",
      },
      {
        slug: "bpc-157-tb-500",
        note: "Co-studied in models where mitochondrial function accompanies tissue repair.",
      },
    ],
    references: [
      {
        title: "The mitochondrial-derived peptide MOTS-c",
        source: "Cell Metabolism",
        year: "2015",
      },
      {
        title: "MOTS-c nuclear translocation under metabolic stress",
        source: "Cell Metabolism",
        year: "2018",
      },
      {
        title: "Mitochondrial-derived peptides as signalling molecules",
        source: "Trends in Endocrinology & Metabolism",
        year: "2021",
      },
    ],
    storage: STORAGE,
    handling: HANDLING,
    packaging: PACKAGING,
    specs: {
      cas: "1627580-64-6",
      formula: "C₁₀₁H₁₅₂N₂₈O₂₂S₂",
      molarMass: "≈ 2174.62 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
      sequence: "MRWQEMGYIFYPRKLR",
      halfLife: "Short; rapid clearance reported",
      solubility: "Soluble in bacteriostatic water",
    },
    presentations: presentations("mots-c", "10 mg / vial", "10 mg / pen"),
    image: renderFor("mots-c", "vial"),
    gallery: [
      renderFor("mots-c", "vial"),
      renderFor("mots-c", "pen"),
      EDITORIAL,
    ],
    related: ["nad-plus", "retatrutide", "bpc-157-tb-500"],
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    subtitle: "Longevity / Copper Peptide",
    category: "longevity",
    dosage: "50 mg / vial",
    alsoKnownAs: [
      "Copper tripeptide-1",
      "Glycyl-L-histidyl-L-lysine copper",
      "GHK",
      "Copper peptide",
    ],
    summary:
      "A copper-binding tripeptide examined for collagen synthesis and matrix remodelling.",
    description:
      "GHK-Cu is the copper(II) complex of the tripeptide glycyl-L-histidyl-L-lysine, a sequence found in human plasma with high affinity for copper ions. Published work characterises its role in extracellular matrix turnover, examining effects on collagen and glycosaminoglycan synthesis, metalloproteinase and inhibitor balance, and broad gene expression modulation in dermal fibroblast models. Plasma concentration of the tripeptide is reported to decline with age, which is why it is examined alongside the longevity compounds rather than only as a dermal agent.",
    mechanism:
      "The tripeptide is described as a physiological copper carrier, exchanging Cu(II) with albumin at a defined affinity and delivering it to cells. Downstream literature reports modulation of several hundred genes in fibroblast models, with particular attention to the balance between matrix metalloproteinases and their tissue inhibitors.",
    evidence: "Extensively studied",
    researchFocus: [
      "Collagen and glycosaminoglycan synthesis",
      "Matrix metalloproteinase regulation",
      "Copper ion transport and delivery",
      "Age-related change in plasma tripeptide concentration",
    ],
    applications: [
      "Extracellular matrix research",
      "Cellular ageing characterisation",
      "Metalloprotein assay development",
      "Dermal model investigation",
    ],
    compatibility: [
      {
        slug: "bpc-157-tb-500",
        note: "Combined where vascularisation, cell migration and matrix synthesis are measured in one preparation.",
      },
      {
        slug: "nad-plus",
        note: "Co-studied where redox state is treated as an input to matrix turnover.",
      },
      {
        slug: "snap-8",
        note: "Examined together where matrix-active and expression-active peptides share a dermal model.",
      },
    ],
    references: [
      {
        title: "GHK-Cu and human gene expression",
        source: "BioMed Research International",
        year: "2014",
      },
      {
        title: "Copper peptides in extracellular matrix remodelling",
        source: "Journal of Investigative Dermatology",
        year: "2012",
      },
      {
        title: "GHK: a plasma tripeptide and copper carrier",
        source: "International Journal of Molecular Sciences",
        year: "2018",
      },
    ],
    storage:
      "Store lyophilised at −20 °C, protected from light and moisture. The copper complex is oxidation-sensitive; minimise headspace and exposure. Following reconstitution, hold at 2–8 °C and use within the interval stated on the batch certificate of analysis.",
    handling:
      "Oxidation-sensitive. Minimise headspace when aliquoting and avoid contact with reducing agents or chelators that would strip the copper centre. The characteristic blue solution colour is expected; note any change in the batch record.",
    packaging: PACKAGING,
    specs: {
      cas: "89030-95-5",
      formula: "C₁₄H₂₂CuN₆O₄",
      molarMass: "≈ 401.91 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
      sequence: "GHK (copper-complexed)",
      halfLife: "Short in circulation; matrix-bound fraction persists",
      solubility: "Soluble in water; deep blue in solution",
    },
    presentations: presentations("ghk-cu", "50 mg / vial", "50 mg / pen"),
    image: renderFor("ghk-cu", "vial"),
    gallery: [
      renderFor("ghk-cu", "vial"),
      renderFor("ghk-cu", "pen"),
      EDITORIAL,
    ],
    related: ["bpc-157-tb-500", "snap-8", "nad-plus"],
  },
  {
    slug: "semax",
    name: "Semax",
    subtitle: "Neuro / ACTH Fragment",
    category: "neuro",
    dosage: "10 mg / vial",
    alsoKnownAs: ["ACTH(4-10) analogue", "N-acetyl semax", "Semax acetate"],
    summary:
      "A synthetic ACTH(4-10) analogue examined for neurotrophic and neuroprotective pathways.",
    description:
      "Semax is a synthetic heptapeptide analogue of the adrenocorticotropic hormone fragment ACTH(4-10), extended with a proline-glycine-proline sequence that confers resistance to enzymatic degradation while removing corticotropic activity. Published work examines its action on brain-derived neurotrophic factor and nerve growth factor expression, and on dopaminergic and serotonergic signalling.",
    mechanism:
      "Characterised as raising BDNF and NGF transcript levels in hippocampal and cortical preparations without the adrenocorticotropic activity of the parent fragment. Additional work examines effects on the dopaminergic and serotonergic systems and on markers of cerebral perfusion in ischaemia models.",
    evidence: "Established",
    researchFocus: [
      "BDNF and NGF expression",
      "Dopaminergic and serotonergic signalling",
      "Neuroprotective pathway characterisation",
      "Cerebral perfusion models",
    ],
    applications: [
      "Neurotrophic factor research",
      "Central nervous system model studies",
      "Peptide stability profiling",
      "Comparative regulatory peptide investigation",
    ],
    compatibility: [
      {
        slug: "selank",
        note: "Co-administered in the literature where neurotrophic and anxiolytic endpoints are measured together.",
      },
      {
        slug: "nad-plus",
        note: "Studied alongside redox cofactors in neuronal energy models.",
      },
      {
        slug: "bpc-157-tb-500",
        note: "Examined together where neurovascular repair is the shared endpoint.",
      },
    ],
    references: [
      {
        title: "Semax and BDNF expression in the rat hippocampus",
        source: "Neuroscience Letters",
        year: "2013",
      },
      {
        title: "ACTH(4-10) analogues without corticotropic activity",
        source: "Regulatory Peptides",
        year: "2009",
      },
      {
        title: "Neuroprotective peptides in ischaemia models",
        source: "Brain Research",
        year: "2017",
      },
    ],
    storage: STORAGE,
    handling: HANDLING,
    packaging: PACKAGING,
    specs: {
      cas: "80714-61-0",
      formula: "C₃₇H₅₁N₉O₁₀S",
      molarMass: "≈ 813.93 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
      sequence: "MEHFPGP",
      halfLife: "Extended relative to the parent ACTH fragment",
      solubility: "Readily soluble in water",
    },
    presentations: presentations("semax", "10 mg / vial", "10 mg / pen"),
    image: renderFor("semax", "vial"),
    gallery: [
      renderFor("semax", "vial"),
      renderFor("semax", "pen"),
      EDITORIAL,
    ],
    related: ["selank", "nad-plus", "mots-c"],
  },
  {
    slug: "selank",
    name: "Selank",
    subtitle: "Neuro / Heptapeptide",
    category: "neuro",
    dosage: "10 mg / vial",
    alsoKnownAs: ["Tuftsin analogue", "TP-7", "Selank acetate"],
    summary:
      "A synthetic heptapeptide derived from tuftsin, studied for neuropeptide signalling.",
    description:
      "Selank is a synthetic heptapeptide constructed from the immunomodulatory tetrapeptide tuftsin extended by a proline-glycine-proline stabilising sequence. Literature examines its influence on brain-derived neurotrophic factor expression, monoaminergic turnover and enkephalin degradation kinetics in preclinical central nervous system models.",
    mechanism:
      "The proline-glycine-proline extension is described as conferring resistance to peptidase cleavage, extending the window over which the tuftsin core is available. Published work examines inhibition of enkephalin-degrading enzymes and changes in GABAergic and serotonergic gene expression in hippocampal preparations.",
    evidence: "Emerging",
    researchFocus: [
      "BDNF expression modulation",
      "Monoaminergic turnover",
      "Enkephalin degradation kinetics",
      "GABAergic pathway characterisation",
    ],
    applications: [
      "Neuropeptide research",
      "Central nervous system model studies",
      "Neurotrophic factor assays",
      "Comparative regulatory peptide investigation",
    ],
    compatibility: [
      {
        slug: "semax",
        note: "The standard cognitive pairing — complementary neurotrophic and monoaminergic profiles.",
      },
      {
        slug: "nad-plus",
        note: "Co-studied where neuronal energy metabolism is a covariate.",
      },
      {
        slug: "mots-c",
        note: "Examined together in models linking mitochondrial function to neural signalling.",
      },
    ],
    references: [
      {
        title: "Selank and enkephalin degradation kinetics",
        source: "Bulletin of Experimental Biology and Medicine",
        year: "2011",
      },
      {
        title: "Regulatory peptides and hippocampal gene expression",
        source: "Neurochemical Research",
        year: "2015",
      },
      {
        title: "Tuftsin-derived peptides in the central nervous system",
        source: "Peptides",
        year: "2019",
      },
    ],
    storage: STORAGE,
    handling: HANDLING,
    packaging: PACKAGING,
    specs: {
      cas: "129954-34-3",
      formula: "C₃₃H₅₇N₁₁O₉",
      molarMass: "≈ 751.88 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
      sequence: "TKPRPGP",
      halfLife: "Extended relative to unmodified tuftsin",
      solubility: "Readily soluble in water",
    },
    presentations: presentations("selank", "10 mg / vial", "10 mg / pen"),
    image: renderFor("selank", "vial"),
    gallery: [
      renderFor("selank", "vial"),
      renderFor("selank", "pen"),
      EDITORIAL,
    ],
    related: ["semax", "nad-plus", "mots-c"],
  },
  {
    slug: "snap-8",
    name: "SNAP-8",
    subtitle: "Regeneration / Octapeptide",
    category: "regeneration",
    dosage: "10 mg / vial",
    alsoKnownAs: [
      "Acetyl octapeptide-3",
      "Acetyl glutamyl heptapeptide-3",
      "Acetyl octapeptide-1",
    ],
    summary:
      "An acetylated octapeptide examined for its interaction with the SNARE complex.",
    description:
      "SNAP-8 is a synthetic acetylated octapeptide extending the sequence of the SNAP-25 protein N-terminus. The published record examines it as a competitive analogue within the soluble N-ethylmaleimide-sensitive factor attachment protein receptor complex — the SNARE assembly that mediates vesicle docking — and characterises its behaviour in dermal and neuromuscular junction models.",
    mechanism:
      "Described as competing with SNAP-25 for a position in the SNARE complex, so that the assembly forms less efficiently. The literature examines the consequence for vesicle docking and catecholamine release in cell models, and the acetylation at the N-terminus is studied for the stability it confers on a short sequence.",
    evidence: "Emerging",
    researchFocus: [
      "SNARE complex assembly",
      "Vesicle docking and exocytosis",
      "Competitive peptide analogue behaviour",
      "Dermal matrix and expression models",
    ],
    applications: [
      "Exocytosis pathway research",
      "Dermal model characterisation",
      "Peptide analogue competition assays",
      "Comparative short-peptide stability studies",
    ],
    compatibility: [
      {
        slug: "ghk-cu",
        note: "Examined together where matrix-active and expression-active peptides share a dermal model.",
      },
      {
        slug: "bpc-157-tb-500",
        note: "Paired where dermal repair is measured alongside matrix-active signalling.",
      },
      {
        slug: "semax",
        note: "Co-studied where vesicular release is examined alongside neurotrophic signalling.",
      },
    ],
    references: [
      {
        title: "SNARE complex assembly and vesicle fusion",
        source: "Nature Structural & Molecular Biology",
        year: "2008",
      },
      {
        title: "Peptide analogues of SNAP-25 in cell models",
        source: "International Journal of Cosmetic Science",
        year: "2013",
      },
      {
        title: "Short acetylated peptides and enzymatic stability",
        source: "Journal of Peptide Science",
        year: "2017",
      },
    ],
    storage: STORAGE,
    handling: HANDLING,
    packaging: PACKAGING,
    specs: {
      cas: "868844-74-0",
      formula: "C₄₀H₆₈N₁₄O₁₆",
      molarMass: "≈ 1025.06 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
      sequence: "Ac-EEMQRRAD-NH₂",
      halfLife: "Not established in circulation; examined topically",
      solubility: "Readily soluble in water",
    },
    presentations: presentations("snap-8", "10 mg / vial", "10 mg / pen"),
    image: renderFor("snap-8", "vial"),
    gallery: [
      renderFor("snap-8", "vial"),
      renderFor("snap-8", "pen"),
      EDITORIAL,
    ],
    related: ["ghk-cu", "bpc-157-tb-500", "semax"],
  },
  {
    slug: "melanotan-ii",
    name: "Melanotan II",
    subtitle: "Performance / Melanocortin",
    category: "performance",
    dosage: "10 mg / vial",
    alsoKnownAs: ["MT-2", "Melanotan 2", "MT2", "Melanocortin analogue"],
    summary:
      "A cyclic heptapeptide melanocortin receptor agonist studied for central signalling pathways.",
    description:
      "Melanotan II is a synthetic cyclic lactam heptapeptide analogue of alpha-melanocyte-stimulating hormone. The literature characterises it as a non-selective agonist across melanocortin receptor subtypes, with reported activity at MC1R, MC3R, MC4R and MC5R, and examines the cyclic architecture as the basis for both receptor affinity and resistance to enzymatic cleavage.",
    mechanism:
      "Described as engaging melanocortin receptors with the conformational constraint of the cyclic lactam bridge holding the pharmacophore in an active orientation. Published work examines MC1R engagement in melanocyte preparations and MC3R and MC4R engagement in hypothalamic models, and treats the lack of subtype selectivity as the defining feature of the molecule.",
    evidence: "Established",
    researchFocus: [
      "Melanocortin receptor agonism",
      "Receptor subtype selectivity profiling",
      "Cyclic peptide conformational constraint",
      "Melanogenesis pathway characterisation",
    ],
    applications: [
      "Melanocortin system research",
      "Receptor subtype profiling",
      "Cyclic peptide structure-activity investigation",
      "Central nervous system model studies",
    ],
    compatibility: [
      {
        slug: "retatrutide",
        note: "Compared where melanocortin and incretin routes to energy balance are contrasted.",
      },
      {
        slug: "semax",
        note: "Examined alongside neuropeptides where central signalling is the measured endpoint.",
      },
      {
        slug: "ghk-cu",
        note: "Co-studied in dermal models with distinct receptor and matrix mechanisms.",
      },
    ],
    references: [
      {
        title: "Cyclic lactam analogues of alpha-MSH",
        source: "Journal of Medicinal Chemistry",
        year: "1989",
      },
      {
        title: "Melanocortin receptor subtypes and ligand selectivity",
        source: "British Journal of Pharmacology",
        year: "2010",
      },
      {
        title: "Cyclic peptide constraint and receptor affinity",
        source: "Journal of Medicinal Chemistry",
        year: "2017",
      },
    ],
    storage: STORAGE,
    handling: HANDLING,
    packaging: PACKAGING,
    specs: {
      cas: "121062-08-6",
      formula: "C₅₀H₆₉N₁₅O₉",
      molarMass: "≈ 1024.18 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
      sequence: "Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-NH₂",
      halfLife: "≈ 1–2 h (reported)",
      solubility: "Soluble in bacteriostatic water",
    },
    presentations: presentations("melanotan-ii", "10 mg / vial", "10 mg / pen"),
    image: renderFor("melanotan-ii", "vial"),
    gallery: [
      renderFor("melanotan-ii", "vial"),
      renderFor("melanotan-ii", "pen"),
      EDITORIAL,
    ],
    related: ["retatrutide", "semax", "ghk-cu"],
  },
  {
    slug: "bacteriostatic-water",
    name: "Bacteriostatic Water",
    subtitle: "Preparation / Diluent",
    category: "preparation",
    dosage: "10 mL / vial",
    alsoKnownAs: [
      "Bacteriostatic water for injection",
      "BAC water",
      "Sterile water for injection",
      "Diluent",
    ],
    summary:
      "The reconstitution medium for the range — sterile water preserved with benzyl alcohol.",
    description:
      "Bacteriostatic water is sterile water for injection containing benzyl alcohol as a bacteriostatic preservative, which is what allows a vial to be entered more than once without the contamination risk that attends unpreserved water. It is the standard diluent for the lyophilised range, and it is supplied to the same analytical and cold-chain standard as the compounds it is used to prepare.",
    mechanism:
      "The benzyl alcohol content is bacteriostatic rather than bactericidal: it inhibits microbial growth in the vial between entries. It is not an active compound and it has no pharmacology of its own in this context. Compatibility is the property that matters, and it is stated per compound on the certificate of analysis.",
    evidence: "Established",
    researchFocus: [
      "Diluent compatibility",
      "Reconstituted solution stability",
      "Preservative efficacy over multiple entries",
      "pH and osmolality of prepared solutions",
    ],
    applications: [
      "Reconstitution of lyophilised material",
      "Serial dilution preparation",
      "Solution stability characterisation",
      "Multi-entry vial handling",
    ],
    compatibility: [
      {
        slug: "nad-plus",
        note: "The diluent used across the range; NAD+ solutions are pH-sensitive and are prepared immediately before use.",
      },
      {
        slug: "bpc-157-tb-500",
        note: "Readily reconstituted in bacteriostatic water, which is the diluent stated on the certificate.",
      },
      {
        slug: "ghk-cu",
        note: "Prepared in bacteriostatic water; avoid diluents carrying chelators that would strip the copper centre.",
      },
    ],
    references: [
      {
        title: "Benzyl alcohol as a pharmaceutical preservative",
        source: "Journal of Pharmaceutical Sciences",
        year: "2011",
      },
      {
        title: "Reconstitution and stability of lyophilised peptides",
        source: "International Journal of Pharmaceutics",
        year: "2016",
      },
      {
        title: "Preservative efficacy in multi-dose parenteral containers",
        source: "PDA Journal of Pharmaceutical Science and Technology",
        year: "2018",
      },
    ],
    storage:
      "Store at controlled room temperature, protected from light. Do not freeze. Once entered, hold at 2–8 °C and observe the in-use interval stated on the certificate of analysis.",
    handling:
      "Swab the closure before each entry. Introduce the diluent slowly against the vial wall of the compound being prepared rather than directly onto the cake, and swirl rather than shake. Discard if the solution is not clear and colourless.",
    packaging:
      "Clear borosilicate vial with butyl stopper and aluminium crimp seal, presented in the matte debossed box used across the range.",
    specs: {
      cas: "7732-18-5 (water) / 100-51-6 (benzyl alcohol)",
      formula: "H₂O with 0.9% benzyl alcohol",
      molarMass: "≈ 18.02 g/mol (water)",
      purity: "Sterile, non-pyrogenic",
      form: "Clear colourless solution",
      solubility: "Miscible; the diluent for the range",
    },
    presentations: presentations(
      "bacteriostatic-water",
      "10 mL / vial",
      "10 mL / pen",
      "Supplied on request rather than as a standing line.",
    ),
    image: renderFor("bacteriostatic-water", "vial"),
    gallery: [
      renderFor("bacteriostatic-water", "vial"),
      renderFor("bacteriostatic-water", "pen"),
      EDITORIAL,
    ],
    related: ["nad-plus", "bpc-157-tb-500", "ghk-cu"],
  },
];

export const productBySlug = new Map(products.map((p) => [p.slug, p]));

export function getProduct(slug: string) {
  return productBySlug.get(slug);
}

export function productsByCategory(category: CategorySlug) {
  return products.filter((p) => p.category === category);
}

export function relatedProducts(product: Product) {
  return product.related
    .map((slug) => productBySlug.get(slug))
    .filter((p): p is Product => Boolean(p));
}

/** Resolve `compatibility` entries to the products they name. */
export function compatibleProducts(product: Product) {
  return product.compatibility
    .map((entry) => {
      const target = productBySlug.get(entry.slug);
      return target ? { product: target, note: entry.note } : null;
    })
    .filter((entry): entry is { product: Product; note: string } =>
      Boolean(entry),
    );
}

/** One presentation of one product, by kind. */
export function getPresentation(product: Product, kind: PresentationKind) {
  return product.presentations.find((p) => p.kind === kind);
}

/** The pen render for a product, for the surfaces that lead with the pen. */
export function penImage(product: Product) {
  return getPresentation(product, "pen")?.image ?? product.image;
}

/** Alphabetical listing for the compound index. */
export const productsAlphabetical = [...products].sort((a, b) =>
  a.name.localeCompare(b.name),
);
