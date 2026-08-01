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
 * into a headless CMS without touching a single component.
 */

export interface ProductSpecs {
  /** CAS registry number. Verify against the batch certificate of analysis. */
  cas: string;
  formula: string;
  molarMass: string;
  purity: string;
  form: string;
}

export interface Product {
  slug: string;
  name: string;
  /** Kit label line, e.g. "Weight Loss / GLP-1". */
  subtitle: string;
  category: CategorySlug;
  dosage: string;
  /** Card-length description. One sentence. */
  summary: string;
  /** Long-form characterisation for the detail page. */
  description: string;
  /** Areas of published investigation — framed as research, never as benefit. */
  researchFocus: string[];
  applications: string[];
  storage: string;
  packaging: string;
  specs: ProductSpecs;
  image: string;
  gallery: string[];
  related: string[];
}

export const products: Product[] = [
  {
    slug: "semaglutide",
    name: "Semaglutide",
    subtitle: "Weight Loss / GLP-1",
    category: "weight-loss",
    dosage: "5 mg / vial",
    summary:
      "A GLP-1 analogue studied for metabolic regulation, and for its role in appetite and glucose pathways.",
    description:
      "Semaglutide is a synthetic thirty-one amino acid analogue of human glucagon-like peptide-1, modified by fatty-acid acylation to extend plasma half-life and by amino acid substitution to resist dipeptidyl peptidase-4 degradation. It is characterised in the published literature as a selective agonist at the GLP-1 receptor, a class B G-protein coupled receptor expressed across pancreatic, gastric and central nervous tissue.",
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
    storage:
      "Store lyophilised at −20 °C, protected from light and moisture. Following reconstitution, hold at 2–8 °C and use within the interval stated on the batch certificate of analysis.",
    packaging:
      "Amber borosilicate vial with butyl stopper and aluminium crimp seal, presented in a matte debossed box with die-cut foam insert and magnetic closure.",
    specs: {
      cas: "910463-68-2",
      formula: "C₁₈₇H₂₉₁N₄₅O₅₉",
      molarMass: "≈ 4113.58 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
    },
    image: "/products/semaglutide.jpg",
    gallery: ["/products/semaglutide.jpg", "/editorial/packaging.jpg"],
    related: ["tirzepatide", "retatrutide", "mots-c"],
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    subtitle: "Weight Loss / GIP-GLP-1",
    category: "weight-loss",
    dosage: "10 mg / vial",
    summary:
      "A dual GIP and GLP-1 receptor agonist examined for its combined incretin mechanism.",
    description:
      "Tirzepatide is a synthetic thirty-nine amino acid peptide engineered to act as a dual agonist at both the glucose-dependent insulinotropic polypeptide receptor and the glucagon-like peptide-1 receptor. Literature characterises the molecule's C20 fatty diacid moiety as the basis for albumin binding and extended circulation, with the dual-receptor profile producing a signalling pattern distinct from single-receptor analogues.",
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
    storage:
      "Store lyophilised at −20 °C, protected from light and moisture. Following reconstitution, hold at 2–8 °C and use within the interval stated on the batch certificate of analysis.",
    packaging:
      "Amber borosilicate vial with butyl stopper and aluminium crimp seal, presented in a matte debossed box with die-cut foam insert and magnetic closure.",
    specs: {
      cas: "2023788-19-2",
      formula: "C₂₂₅H₃₄₈N₄₈O₆₈",
      molarMass: "≈ 4813.45 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
    },
    image: "/products/tirzepatide.jpg",
    gallery: ["/products/tirzepatide.jpg", "/editorial/packaging.jpg"],
    related: ["semaglutide", "retatrutide", "mots-c"],
  },
  {
    slug: "retatrutide",
    name: "Retatrutide",
    subtitle: "Performance / Triple Agonist",
    category: "performance",
    dosage: "10 mg / vial",
    summary:
      "A triple receptor agonist studied across GIP, GLP-1 and glucagon signalling pathways.",
    description:
      "Retatrutide is a synthetic peptide characterised in the literature as a single molecule with agonist activity at three distinct receptors: glucose-dependent insulinotropic polypeptide, glucagon-like peptide-1, and glucagon. The triple-agonist architecture is studied for the way concurrent glucagon receptor engagement modifies energy expenditure signalling relative to dual and single agonists.",
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
    storage:
      "Store lyophilised at −20 °C, protected from light and moisture. Following reconstitution, hold at 2–8 °C and use within the interval stated on the batch certificate of analysis.",
    packaging:
      "Amber borosilicate vial with butyl stopper and aluminium crimp seal, presented in a matte debossed box with die-cut foam insert and magnetic closure.",
    specs: {
      cas: "2381089-83-2",
      formula: "C₂₂₁H₃₄₂N₄₆O₆₈",
      molarMass: "≈ 4731.40 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
    },
    image: "/products/retatrutide.jpg",
    gallery: ["/products/retatrutide.jpg", "/editorial/packaging.jpg"],
    related: ["tirzepatide", "semaglutide", "pt-141"],
  },
  {
    slug: "bpc-157",
    name: "BPC-157",
    subtitle: "Recovery / Pentadecapeptide",
    category: "recovery",
    dosage: "5 mg / vial",
    summary:
      "A synthetic pentadecapeptide investigated for angiogenic and cytoprotective signalling.",
    description:
      "BPC-157 is a synthetic fifteen amino acid peptide corresponding to a partial sequence of body protection compound, a protein isolated from human gastric juice. Preclinical literature examines its action on angiogenesis, growth factor receptor expression and nitric oxide pathway modulation, with particular attention to fibroblast migration and tendon-to-bone interface models.",
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
    storage:
      "Store lyophilised at −20 °C, protected from light and moisture. Following reconstitution, hold at 2–8 °C and use within the interval stated on the batch certificate of analysis.",
    packaging:
      "Amber borosilicate vial with butyl stopper and aluminium crimp seal, presented in a matte debossed box with die-cut foam insert and magnetic closure.",
    specs: {
      cas: "137525-51-0",
      formula: "C₆₂H₉₈N₁₆O₂₂",
      molarMass: "≈ 1419.53 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
    },
    image: "/products/bpc-157.jpg",
    gallery: ["/products/bpc-157.jpg", "/editorial/packaging.jpg"],
    related: ["tb-500", "ghk-cu", "mots-c"],
  },
  {
    slug: "tb-500",
    name: "TB-500",
    subtitle: "Recovery / Thymosin β4",
    category: "recovery",
    dosage: "5 mg / vial",
    summary:
      "A synthetic thymosin beta-4 preparation examined for actin regulation and cell migration.",
    description:
      "TB-500 is a synthetic preparation corresponding to thymosin beta-4, a forty-three amino acid actin-sequestering peptide present in most mammalian cell types. Literature characterises its principal mechanism as regulation of the G-actin to F-actin equilibrium, with downstream examination of cell migration, endothelial differentiation and extracellular matrix organisation.",
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
    storage:
      "Store lyophilised at −20 °C, protected from light and moisture. Following reconstitution, hold at 2–8 °C and use within the interval stated on the batch certificate of analysis.",
    packaging:
      "Amber borosilicate vial with butyl stopper and aluminium crimp seal, presented in a matte debossed box with die-cut foam insert and magnetic closure.",
    specs: {
      cas: "77591-33-4",
      formula: "C₂₁₂H₃₅₀N₅₆O₇₈S",
      molarMass: "≈ 4963.44 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
    },
    image: "/products/tb-500.jpg",
    gallery: ["/products/tb-500.jpg", "/editorial/packaging.jpg"],
    related: ["bpc-157", "ghk-cu", "cjc-1295-ipamorelin"],
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    subtitle: "Metabolism / Mitochondrial",
    category: "metabolism",
    dosage: "10 mg / vial",
    summary:
      "A mitochondrial-derived peptide studied for AMPK activation and metabolic homeostasis.",
    description:
      "MOTS-c is a sixteen amino acid peptide encoded within the mitochondrial 12S ribosomal RNA gene, one of a small class of mitochondrial-derived peptides. Published work examines its translocation to the nucleus under metabolic stress and its characterised action on the AMP-activated protein kinase pathway and folate-methionine cycle intermediates.",
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
    storage:
      "Store lyophilised at −20 °C, protected from light and moisture. Following reconstitution, hold at 2–8 °C and use within the interval stated on the batch certificate of analysis.",
    packaging:
      "Amber borosilicate vial with butyl stopper and aluminium crimp seal, presented in a matte debossed box with die-cut foam insert and magnetic closure.",
    specs: {
      cas: "1627580-64-6",
      formula: "C₁₀₁H₁₅₂N₂₈O₂₂S₂",
      molarMass: "≈ 2174.62 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
    },
    image: "/products/mots-c.jpg",
    gallery: ["/products/mots-c.jpg", "/editorial/packaging.jpg"],
    related: ["nad-plus", "semaglutide", "bpc-157"],
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    subtitle: "Longevity / Coenzyme",
    category: "longevity",
    dosage: "500 mg / vial",
    summary:
      "An endogenous pyridine dinucleotide coenzyme central to cellular redox biochemistry.",
    description:
      "Nicotinamide adenine dinucleotide is an endogenous coenzyme present in every living cell, cycling between oxidised and reduced states as an electron carrier. Literature examines its function as a required cofactor for sirtuin deacetylases, poly-ADP-ribose polymerases and CD38 hydrolase, and the relationship between cellular concentration and mitochondrial oxidative capacity.",
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
    storage:
      "Store lyophilised at −20 °C, protected from light and moisture. NAD+ is hygroscopic and light-sensitive; minimise exposure during handling. Following reconstitution, hold at 2–8 °C and use within the interval stated on the batch certificate of analysis.",
    packaging:
      "Amber borosilicate vial with butyl stopper and aluminium crimp seal, presented in a matte debossed box with die-cut foam insert and magnetic closure.",
    specs: {
      cas: "53-84-9",
      formula: "C₂₁H₂₇N₇O₁₄P₂",
      molarMass: "≈ 663.43 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
    },
    image: "/products/nad-plus.jpg",
    gallery: ["/products/nad-plus.jpg", "/editorial/packaging.jpg"],
    related: ["mots-c", "ghk-cu", "cjc-1295-ipamorelin"],
  },
  {
    slug: "cjc-1295-ipamorelin",
    name: "CJC-1295 / Ipamorelin",
    subtitle: "Growth / Secretagogue",
    category: "growth",
    dosage: "5 mg + 5 mg / vial",
    summary:
      "A GHRH analogue paired with a selective ghrelin receptor agonist for somatotropic research.",
    description:
      "This preparation combines CJC-1295, a synthetic analogue of growth hormone-releasing hormone modified at four positions to resist enzymatic cleavage, with Ipamorelin, a selective pentapeptide agonist at the growth hormone secretagogue receptor GHS-R1a. The literature examines the two mechanisms as complementary inputs to the somatotropic axis, and Ipamorelin specifically for its selectivity relative to earlier secretagogues.",
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
    storage:
      "Store lyophilised at −20 °C, protected from light and moisture. Following reconstitution, hold at 2–8 °C and use within the interval stated on the batch certificate of analysis.",
    packaging:
      "Amber borosilicate vial with butyl stopper and aluminium crimp seal, presented in a matte debossed box with die-cut foam insert and magnetic closure.",
    specs: {
      cas: "863288-34-0 / 170851-70-4",
      formula: "C₁₅₂H₂₅₂N₄₄O₄₂ / C₃₈H₄₉N₉O₅",
      molarMass: "≈ 3367.80 / 711.85 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
    },
    image: "/products/cjc-1295-ipamorelin.jpg",
    gallery: ["/products/cjc-1295-ipamorelin.jpg", "/editorial/packaging.jpg"],
    related: ["tb-500", "nad-plus", "mots-c"],
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    subtitle: "Regeneration / Copper Peptide",
    category: "regeneration",
    dosage: "50 mg / vial",
    summary:
      "A copper-binding tripeptide examined for collagen synthesis and matrix remodelling.",
    description:
      "GHK-Cu is the copper(II) complex of the tripeptide glycyl-L-histidyl-L-lysine, a sequence found in human plasma with high affinity for copper ions. Published work characterises its role in extracellular matrix turnover, examining effects on collagen and glycosaminoglycan synthesis, metalloproteinase and inhibitor balance, and broad gene expression modulation in dermal fibroblast models.",
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
    storage:
      "Store lyophilised at −20 °C, protected from light and moisture. The copper complex is oxidation-sensitive; minimise headspace and exposure. Following reconstitution, hold at 2–8 °C and use within the interval stated on the batch certificate of analysis.",
    packaging:
      "Amber borosilicate vial with butyl stopper and aluminium crimp seal, presented in a matte debossed box with die-cut foam insert and magnetic closure.",
    specs: {
      cas: "89030-95-5",
      formula: "C₁₄H₂₂CuN₆O₄",
      molarMass: "≈ 401.91 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
    },
    image: "/products/ghk-cu.jpg",
    gallery: ["/products/ghk-cu.jpg", "/editorial/packaging.jpg"],
    related: ["bpc-157", "tb-500", "nad-plus"],
  },
  {
    slug: "selank",
    name: "Selank",
    subtitle: "Neuro / Heptapeptide",
    category: "neuro",
    dosage: "10 mg / vial",
    summary:
      "A synthetic heptapeptide derived from tuftsin, studied for neuropeptide signalling.",
    description:
      "Selank is a synthetic heptapeptide constructed from the immunomodulatory tetrapeptide tuftsin extended by a proline-glycine-proline stabilising sequence. Literature examines its influence on brain-derived neurotrophic factor expression, monoaminergic turnover and enkephalin degradation kinetics in preclinical central nervous system models.",
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
    storage:
      "Store lyophilised at −20 °C, protected from light and moisture. Following reconstitution, hold at 2–8 °C and use within the interval stated on the batch certificate of analysis.",
    packaging:
      "Amber borosilicate vial with butyl stopper and aluminium crimp seal, presented in a matte debossed box with die-cut foam insert and magnetic closure.",
    specs: {
      cas: "129954-34-3",
      formula: "C₃₃H₅₇N₁₁O₉",
      molarMass: "≈ 751.88 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
    },
    image: "/products/selank.jpg",
    gallery: ["/products/selank.jpg", "/editorial/packaging.jpg"],
    related: ["semax", "nad-plus", "mots-c"],
  },
  {
    slug: "semax",
    name: "Semax",
    subtitle: "Neuro / ACTH Fragment",
    category: "neuro",
    dosage: "10 mg / vial",
    summary:
      "A synthetic ACTH(4-10) analogue examined for neurotrophic and neuroprotective pathways.",
    description:
      "Semax is a synthetic heptapeptide analogue of the adrenocorticotropic hormone fragment ACTH(4-10), extended with a proline-glycine-proline sequence that confers resistance to enzymatic degradation while removing corticotropic activity. Published work examines its action on brain-derived neurotrophic factor and nerve growth factor expression, and on dopaminergic and serotonergic signalling.",
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
    storage:
      "Store lyophilised at −20 °C, protected from light and moisture. Following reconstitution, hold at 2–8 °C and use within the interval stated on the batch certificate of analysis.",
    packaging:
      "Amber borosilicate vial with butyl stopper and aluminium crimp seal, presented in a matte debossed box with die-cut foam insert and magnetic closure.",
    specs: {
      cas: "80714-61-0",
      formula: "C₃₇H₅₁N₉O₁₀S",
      molarMass: "≈ 813.93 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
    },
    image: "/products/semax.jpg",
    gallery: ["/products/semax.jpg", "/editorial/packaging.jpg"],
    related: ["selank", "nad-plus", "mots-c"],
  },
  {
    slug: "pt-141",
    name: "PT-141",
    subtitle: "Performance / Melanocortin",
    category: "performance",
    dosage: "10 mg / vial",
    summary:
      "A cyclic heptapeptide melanocortin receptor agonist studied for central signalling pathways.",
    description:
      "PT-141, also designated bremelanotide, is a synthetic cyclic heptapeptide and an active metabolite of the melanocortin analogue melanotan II. Literature characterises it as a non-selective agonist across melanocortin receptor subtypes with notable activity at MC3R and MC4R, and examines centrally-mediated signalling distinct from peripheral vascular mechanisms.",
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
    storage:
      "Store lyophilised at −20 °C, protected from light and moisture. Following reconstitution, hold at 2–8 °C and use within the interval stated on the batch certificate of analysis.",
    packaging:
      "Amber borosilicate vial with butyl stopper and aluminium crimp seal, presented in a matte debossed box with die-cut foam insert and magnetic closure.",
    specs: {
      cas: "189691-06-3",
      formula: "C₅₀H₆₈N₁₄O₁₀",
      molarMass: "≈ 1025.16 g/mol",
      purity: "≥ 99% by HPLC",
      form: "Lyophilised powder",
    },
    image: "/products/pt-141.jpg",
    gallery: ["/products/pt-141.jpg", "/editorial/packaging.jpg"],
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
