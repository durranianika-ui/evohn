import type { CategorySlug } from "./categories";

/**
 * Product catalogue.
 *
 * This is a presentation catalogue, not a store: there is deliberately no
 * price, stock, SKU or purchasable unit anywhere in this shape.
 *
 * `dosage` describes the presentation strength printed on the vial label
 * (Brand Identity Kit §09) — it is not administration guidance.
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

export interface Product {
  slug: string;
  name: string;
  /** Kit label line, e.g. "Weight Loss / GLP-1". */
  subtitle: string;
  category: CategorySlug;
  dosage: string;
  /** Alternative designations used in the literature. */
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

export const products: Product[] = [
  {
    slug: "semaglutide",
    name: "Semaglutide",
    subtitle: "Weight Loss / GLP-1",
    category: "weight-loss",
    dosage: "5 mg / vial",
    alsoKnownAs: ["GLP-1 analogue", "NN9535"],
    summary:
      "A GLP-1 analogue studied for metabolic regulation, and for its role in appetite and glucose pathways.",
    description:
      "Semaglutide is a synthetic thirty-one amino acid analogue of human glucagon-like peptide-1, modified by fatty-acid acylation to extend plasma half-life and by amino acid substitution to resist dipeptidyl peptidase-4 degradation. It is characterised in the published literature as a selective agonist at the GLP-1 receptor, a class B G-protein coupled receptor expressed across pancreatic, gastric and central nervous tissue.",
    mechanism:
      "Characterised as a selective GLP-1 receptor agonist. Receptor engagement is described as coupling to Gαs and raising intracellular cyclic AMP, with downstream protein kinase A activity examined in relation to glucose-dependent insulin secretion. The C18 diacid side chain is studied for the albumin binding that underlies the extended circulating profile.",
    evidence: "Extensively studied",
    researchFocus: [
      "Incretin receptor signalling",
      "Glucose-dependent insulinotropic response",
      "Appetite and satiety pathway modelling",
      "Gastric emptying kinetics",
    ],
    applications: [
      "Metabolic pathway characterisation",
      "Receptor binding and selectivity assays",
      "Preclinical model development",
      "Comparative incretin analogue studies",
    ],
    compatibility: [
      {
        slug: "mots-c",
        note: "Co-studied where incretin signalling and mitochondrial energy sensing are examined in the same metabolic model.",
      },
      {
        slug: "bpc-157",
        note: "Paired in gastrointestinal models where mucosal integrity is a covariate of interest.",
      },
      {
        slug: "tirzepatide",
        note: "Compared directly in single- versus dual-agonist receptor pharmacology.",
      },
    ],
    references: [
      {
        title: "Discovery of the once-weekly GLP-1 analogue semaglutide",
        source: "Journal of Medicinal Chemistry",
        year: "2015",
      },
      {
        title: "GLP-1 receptor agonists: mechanisms of action",
        source: "Cell Metabolism",
        year: "2018",
      },
      {
        title: "Central GLP-1 receptor populations and energy balance",
        source: "Molecular Metabolism",
        year: "2021",
      },
    ],
    storage: STORAGE,
    handling: HANDLING,
    packaging: PACKAGING,
    specs: {
      cas: "910463-68-2",
      formula: "C₁₈₇H₂₉₁N₄₅O₅₉",
      molarMass: "≈ 4113.58 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
      halfLife: "≈ 165 h (reported)",
      solubility: "Soluble in bacteriostatic water and sterile saline",
    },
    image: "/products/semaglutide.webp",
    gallery: ["/products/semaglutide.webp", "/editorial/packaging.jpg"],
    related: ["tirzepatide", "retatrutide", "mots-c"],
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    subtitle: "Weight Loss / GIP-GLP-1",
    category: "weight-loss",
    dosage: "10 mg / vial",
    alsoKnownAs: ["Dual incretin agonist", "LY3298176"],
    summary:
      "A dual GIP and GLP-1 receptor agonist examined for its combined incretin mechanism.",
    description:
      "Tirzepatide is a synthetic thirty-nine amino acid peptide engineered to act as a dual agonist at both the glucose-dependent insulinotropic polypeptide receptor and the glucagon-like peptide-1 receptor. Literature characterises the molecule's C20 fatty diacid moiety as the basis for albumin binding and extended circulation, with the dual-receptor profile producing a signalling pattern distinct from single-receptor analogues.",
    mechanism:
      "Described as an imbalanced dual agonist with greater relative potency at the GIP receptor than the GLP-1 receptor. Published work examines how concurrent GIP engagement alters β-arrestin recruitment and receptor internalisation relative to GLP-1 mono-agonists, and how that biased profile is reflected in adipocyte and islet models.",
    evidence: "Extensively studied",
    researchFocus: [
      "Dual incretin receptor engagement",
      "Insulinotropic signalling cascades",
      "Comparative receptor selectivity",
      "Adipocyte metabolic response",
    ],
    applications: [
      "Dual-agonist mechanism research",
      "Metabolic disease model characterisation",
      "Receptor pharmacology assays",
      "Structure-activity relationship studies",
    ],
    compatibility: [
      {
        slug: "semaglutide",
        note: "The standard comparator when isolating the contribution of GIP receptor engagement.",
      },
      {
        slug: "retatrutide",
        note: "Studied in sequence to trace the step from dual to triple receptor architecture.",
      },
      {
        slug: "mots-c",
        note: "Examined alongside mitochondrial peptides where substrate utilisation is the endpoint.",
      },
    ],
    references: [
      {
        title: "Tirzepatide, a dual GIP and GLP-1 receptor agonist",
        source: "Molecular Metabolism",
        year: "2018",
      },
      {
        title: "Biased agonism at the GIP receptor",
        source: "Nature Communications",
        year: "2022",
      },
      {
        title: "Incretin co-agonism and adipose tissue signalling",
        source: "Diabetologia",
        year: "2023",
      },
    ],
    storage: STORAGE,
    handling: HANDLING,
    packaging: PACKAGING,
    specs: {
      cas: "2023788-19-2",
      formula: "C₂₂₅H₃₄₈N₄₈O₆₈",
      molarMass: "≈ 4813.45 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
      halfLife: "≈ 120 h (reported)",
      solubility: "Soluble in bacteriostatic water and sterile saline",
    },
    image: "/products/tirzepatide.webp",
    gallery: ["/products/tirzepatide.webp", "/editorial/packaging.jpg"],
    related: ["semaglutide", "retatrutide", "mots-c"],
  },
  {
    slug: "retatrutide",
    name: "Retatrutide",
    subtitle: "Performance / Triple Agonist",
    category: "performance",
    dosage: "10 mg / vial",
    alsoKnownAs: ["Triple agonist", "LY3437943"],
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
        slug: "tirzepatide",
        note: "The immediate comparator for isolating the glucagon receptor contribution.",
      },
      {
        slug: "semaglutide",
        note: "Used as the single-receptor baseline in three-arm comparative designs.",
      },
      {
        slug: "nad-plus",
        note: "Co-studied where hepatic energy metabolism and redox state are examined together.",
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
    image: "/products/retatrutide.webp",
    gallery: ["/products/retatrutide.webp", "/editorial/packaging.jpg"],
    related: ["tirzepatide", "semaglutide", "pt-141"],
  },
  {
    slug: "bpc-157",
    name: "BPC-157",
    subtitle: "Recovery / Pentadecapeptide",
    category: "recovery",
    dosage: "5 mg / vial",
    alsoKnownAs: ["Body Protection Compound-157", "Pentadecapeptide BPC 157"],
    summary:
      "A synthetic pentadecapeptide investigated for angiogenic and cytoprotective signalling.",
    description:
      "BPC-157 is a synthetic fifteen amino acid peptide corresponding to a partial sequence of body protection compound, a protein isolated from human gastric juice. Preclinical literature examines its action on angiogenesis, growth factor receptor expression and nitric oxide pathway modulation, with particular attention to fibroblast migration and tendon-to-bone interface models.",
    mechanism:
      "Published models describe upregulation of vascular endothelial growth factor receptor 2 and downstream activation of the VEGFR2-Akt-eNOS axis, alongside modulation of the nitric oxide system. Effects on focal adhesion kinase and paxillin are studied as the basis for the fibroblast migration observed in tendon and ligament preparations.",
    evidence: "Extensively studied",
    researchFocus: [
      "Angiogenic signalling and VEGFR2 pathways",
      "Fibroblast migration and adhesion",
      "Nitric oxide pathway modulation",
      "Gastrointestinal mucosal integrity models",
    ],
    applications: [
      "Soft-tissue repair research",
      "Musculoskeletal model characterisation",
      "Cytoprotection assays",
      "Growth factor pathway investigation",
    ],
    compatibility: [
      {
        slug: "tb-500",
        note: "The most frequently paired combination in tissue-repair literature — complementary angiogenic and cytoskeletal mechanisms.",
      },
      {
        slug: "ghk-cu",
        note: "Studied together where matrix remodelling and vascularisation are examined in one dermal model.",
      },
      {
        slug: "cjc-1295-ipamorelin",
        note: "Co-examined where growth factor receptor expression is a shared endpoint.",
      },
    ],
    references: [
      {
        title: "BPC 157 and the VEGFR2-Akt-eNOS signalling pathway",
        source: "Journal of Applied Physiology",
        year: "2016",
      },
      {
        title: "Pentadecapeptide BPC 157 in tendon healing models",
        source: "Journal of Orthopaedic Research",
        year: "2018",
      },
      {
        title: "Cytoprotection and the nitric oxide system",
        source: "Current Pharmaceutical Design",
        year: "2020",
      },
    ],
    storage: STORAGE,
    handling: HANDLING,
    packaging: PACKAGING,
    specs: {
      cas: "137525-51-0",
      formula: "C₆₂H₉₈N₁₆O₂₂",
      molarMass: "≈ 1419.53 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
      sequence: "GEPPPGKPADDAGLV",
      halfLife: "Short; rapid clearance reported in vivo",
      solubility: "Readily soluble in bacteriostatic water",
    },
    image: "/products/bpc-157.webp",
    gallery: ["/products/bpc-157.webp", "/editorial/packaging.jpg"],
    related: ["tb-500", "ghk-cu", "mots-c"],
  },
  {
    slug: "tb-500",
    name: "TB-500",
    subtitle: "Recovery / Thymosin β4",
    category: "recovery",
    dosage: "5 mg / vial",
    alsoKnownAs: ["Thymosin beta-4 fragment", "Tβ4"],
    summary:
      "A synthetic thymosin beta-4 preparation examined for actin regulation and cell migration.",
    description:
      "TB-500 is a synthetic preparation corresponding to thymosin beta-4, a forty-three amino acid actin-sequestering peptide present in most mammalian cell types. Literature characterises its principal mechanism as regulation of the G-actin to F-actin equilibrium, with downstream examination of cell migration, endothelial differentiation and extracellular matrix organisation.",
    mechanism:
      "The actin-binding domain is described as sequestering monomeric G-actin, shifting the polymerisation equilibrium and altering cytoskeletal turnover. Downstream work examines endothelial tube formation, upregulation of laminin-5 and myocardin, and modulation of inflammatory cytokine expression in remodelling models.",
    evidence: "Established",
    researchFocus: [
      "G-actin sequestration and cytoskeletal dynamics",
      "Endothelial cell migration",
      "Extracellular matrix organisation",
      "Inflammatory signalling modulation",
    ],
    applications: [
      "Cell motility research",
      "Tissue remodelling model characterisation",
      "Cytoskeletal assay development",
      "Comparative repair peptide studies",
    ],
    compatibility: [
      {
        slug: "bpc-157",
        note: "The canonical pairing: cytoskeletal mobilisation examined alongside angiogenic signalling.",
      },
      {
        slug: "ghk-cu",
        note: "Combined where matrix synthesis and cell migration are measured in the same preparation.",
      },
      {
        slug: "cjc-1295-ipamorelin",
        note: "Studied together in musculoskeletal models with a somatotropic covariate.",
      },
    ],
    references: [
      {
        title: "Thymosin β4 and actin sequestration",
        source: "Annals of the New York Academy of Sciences",
        year: "2012",
      },
      {
        title: "Tβ4 in endothelial migration and angiogenesis",
        source: "Journal of Cell Science",
        year: "2015",
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
      cas: "77591-33-4",
      formula: "C₂₁₂H₃₅₀N₅₆O₇₈S",
      molarMass: "≈ 4963.44 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
      halfLife: "Extended relative to shorter repair peptides",
      solubility: "Readily soluble in bacteriostatic water",
    },
    image: "/products/tb-500-bpc-157.webp",
    gallery: ["/products/tb-500-bpc-157.webp", "/editorial/packaging.jpg"],
    related: ["bpc-157", "ghk-cu", "cjc-1295-ipamorelin"],
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    subtitle: "Metabolism / Mitochondrial",
    category: "metabolism",
    dosage: "10 mg / vial",
    alsoKnownAs: ["Mitochondrial ORF of the 12S rRNA type-c"],
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
        slug: "semaglutide",
        note: "Combined where incretin signalling and cellular energy sensing are measured together.",
      },
      {
        slug: "bpc-157",
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
    image: "/products/mots-c.webp",
    gallery: ["/products/mots-c.webp", "/editorial/packaging.jpg"],
    related: ["nad-plus", "semaglutide", "bpc-157"],
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    subtitle: "Longevity / Coenzyme",
    category: "longevity",
    dosage: "500 mg / vial",
    alsoKnownAs: ["Nicotinamide adenine dinucleotide", "Coenzyme I"],
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
    image: "/products/nad-plus.webp",
    gallery: ["/products/nad-plus.webp", "/editorial/packaging.jpg"],
    related: ["mots-c", "ghk-cu", "cjc-1295-ipamorelin"],
  },
  {
    slug: "cjc-1295-ipamorelin",
    name: "CJC-1295 / Ipamorelin",
    subtitle: "Growth / Secretagogue",
    category: "growth",
    dosage: "5 mg + 5 mg / vial",
    alsoKnownAs: ["CJC-1295 no-DAC with Ipamorelin", "GHRH analogue blend"],
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
        slug: "tb-500",
        note: "Co-studied where somatotropic input accompanies cytoskeletal remodelling endpoints.",
      },
      {
        slug: "nad-plus",
        note: "Examined together in models linking growth signalling to mitochondrial capacity.",
      },
      {
        slug: "bpc-157",
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
    image: "/products/cjc-1295-ipamorelin.webp",
    gallery: ["/products/cjc-1295-ipamorelin.webp", "/editorial/packaging.jpg"],
    related: ["tb-500", "nad-plus", "mots-c"],
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    subtitle: "Regeneration / Copper Peptide",
    category: "regeneration",
    dosage: "50 mg / vial",
    alsoKnownAs: ["Copper tripeptide-1", "Glycyl-L-histidyl-L-lysine copper"],
    summary:
      "A copper-binding tripeptide examined for collagen synthesis and matrix remodelling.",
    description:
      "GHK-Cu is the copper(II) complex of the tripeptide glycyl-L-histidyl-L-lysine, a sequence found in human plasma with high affinity for copper ions. Published work characterises its role in extracellular matrix turnover, examining effects on collagen and glycosaminoglycan synthesis, metalloproteinase and inhibitor balance, and broad gene expression modulation in dermal fibroblast models.",
    mechanism:
      "The tripeptide is described as a physiological copper carrier, exchanging Cu(II) with albumin at a defined affinity and delivering it to cells. Downstream literature reports modulation of several hundred genes in fibroblast models, with particular attention to the balance between matrix metalloproteinases and their tissue inhibitors.",
    evidence: "Extensively studied",
    researchFocus: [
      "Collagen and glycosaminoglycan synthesis",
      "Matrix metalloproteinase regulation",
      "Copper ion transport and delivery",
      "Dermal fibroblast gene expression",
    ],
    applications: [
      "Extracellular matrix research",
      "Dermal model characterisation",
      "Metalloprotein assay development",
      "Wound biology investigation",
    ],
    compatibility: [
      {
        slug: "bpc-157",
        note: "Combined where vascularisation and matrix synthesis are measured in one dermal preparation.",
      },
      {
        slug: "tb-500",
        note: "Paired to examine matrix deposition alongside cell migration.",
      },
      {
        slug: "nad-plus",
        note: "Co-studied where redox state is treated as an input to matrix turnover.",
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
    image: "/products/ghk-cu.webp",
    gallery: ["/products/ghk-cu.webp", "/editorial/packaging.jpg"],
    related: ["bpc-157", "tb-500", "nad-plus"],
  },
  {
    slug: "selank",
    name: "Selank",
    subtitle: "Neuro / Heptapeptide",
    category: "neuro",
    dosage: "10 mg / vial",
    alsoKnownAs: ["Tuftsin analogue", "TP-7"],
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
        source: "Journal of Molecular Neuroscience",
        year: "2016",
      },
      {
        title: "Tuftsin analogues in neuropeptide research",
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
    image: "/products/selank.webp",
    gallery: ["/products/selank.webp", "/editorial/packaging.jpg"],
    related: ["semax", "nad-plus", "mots-c"],
  },
  {
    slug: "semax",
    name: "Semax",
    subtitle: "Neuro / ACTH Fragment",
    category: "neuro",
    dosage: "10 mg / vial",
    alsoKnownAs: ["ACTH(4-10) analogue", "N-acetyl semax"],
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
      "Comparative nootropic peptide investigation",
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
        slug: "bpc-157",
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
    image: "/products/semax.webp",
    gallery: ["/products/semax.webp", "/editorial/packaging.jpg"],
    related: ["selank", "nad-plus", "mots-c"],
  },
  {
    slug: "pt-141",
    name: "PT-141",
    subtitle: "Performance / Melanocortin",
    category: "performance",
    dosage: "10 mg / vial",
    alsoKnownAs: ["Bremelanotide", "PT-141 acetate"],
    summary:
      "A cyclic heptapeptide melanocortin receptor agonist studied for central signalling pathways.",
    description:
      "PT-141, also designated bremelanotide, is a synthetic cyclic heptapeptide and an active metabolite of the melanocortin analogue melanotan II. Literature characterises it as a non-selective agonist across melanocortin receptor subtypes with notable activity at MC3R and MC4R, and examines centrally-mediated signalling distinct from peripheral vascular mechanisms.",
    mechanism:
      "Described as engaging MC3R and MC4R in hypothalamic preparations, with downstream signalling examined in the medial preoptic area. The cyclic lactam architecture is studied for the conformational constraint that underlies receptor affinity and resistance to enzymatic cleavage.",
    evidence: "Established",
    researchFocus: [
      "Melanocortin receptor agonism",
      "MC3R and MC4R selectivity",
      "Centrally-mediated signalling pathways",
      "Cyclic peptide stability",
    ],
    applications: [
      "Melanocortin system research",
      "Receptor subtype profiling",
      "Central nervous system model studies",
      "Cyclic peptide structure-activity investigation",
    ],
    compatibility: [
      {
        slug: "semax",
        note: "Examined alongside neuropeptides where central signalling is the measured endpoint.",
      },
      {
        slug: "retatrutide",
        note: "Compared where melanocortin and incretin routes to energy balance are contrasted.",
      },
      {
        slug: "selank",
        note: "Co-studied in central nervous system models with distinct receptor families.",
      },
    ],
    references: [
      {
        title: "Bremelanotide and melanocortin receptor pharmacology",
        source: "British Journal of Pharmacology",
        year: "2010",
      },
      {
        title: "MC4R signalling in the medial preoptic area",
        source: "Journal of Neuroscience",
        year: "2014",
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
      cas: "189691-06-3",
      formula: "C₅₀H₆₈N₁₄O₁₀",
      molarMass: "≈ 1025.16 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
      halfLife: "≈ 2.7 h (reported)",
      solubility: "Soluble in bacteriostatic water",
    },
    image: "/products/pt-141.webp",
    gallery: ["/products/pt-141.webp", "/editorial/packaging.jpg"],
    related: ["retatrutide", "selank", "semax"],
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

/** Alphabetical listing for the compound index. */
export const productsAlphabetical = [...products].sort((a, b) =>
  a.name.localeCompare(b.name),
);
