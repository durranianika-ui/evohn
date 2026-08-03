import { productBySlug, type Product } from "./products";

/**
 * Certificate of analysis library.
 *
 * Every batch released carries an independent analytical record. This module
 * is the machine-readable form of that record: the certificate PDF is the
 * authoritative document, and `certificateUrl` points at it once uploaded.
 *
 * PLACEHOLDER — `certificateUrl` entries reference `public/coa/`. Drop the
 * signed PDFs in with the filenames below and the download becomes live; the
 * UI degrades to a "documentation on request" state until then.
 */

/** A single measured result on a certificate. */
export interface Assay {
  label: string;
  /** Measured value, formatted for display. */
  result: string;
  /** The written specification the result is judged against. */
  specification: string;
  method: string;
  pass: boolean;
}

/** One point on the published chromatogram trace. */
export interface ChromatogramPeak {
  /** Retention time in minutes. */
  rt: number;
  /** Relative peak height, 0–1. */
  height: number;
  /** Principal peak carries the compound name; others are unassigned. */
  label?: string;
}

export interface LabBatch {
  /** Batch identifier, matching the vial label. */
  batch: string;
  /** Product slug this batch belongs to. */
  product: string;
  /** Headline purity, e.g. "99.61%". */
  purity: string;
  /** Assayed content against the nominal label strength. */
  content: string;
  /** Testing laboratory. */
  laboratory: string;
  accreditation: string;
  /** Laboratory's own retrieval reference. */
  accession: string;
  /** ISO dates. */
  manufactured: string;
  tested: string;
  released: string;
  /** Retest interval stated on the certificate. */
  retest: string;
  storageConditions: string;
  standards: string[];
  assays: Assay[];
  chromatogram: ChromatogramPeak[];
  /** Path under `public/`. Absent until the signed PDF is supplied. */
  certificateUrl?: string;
  /** True once the issuing laboratory has confirmed the record. */
  verified: boolean;
  /** Newest batch for this product. */
  current: boolean;
}

const STANDARDS = [
  "USP <1225> — Validation of compendial procedures",
  "USP <467> — Residual solvents",
  "USP <921> — Water determination",
  "ISO/IEC 17025:2017 — Testing laboratory competence",
];

const STORAGE_CONDITIONS =
  "Lyophilised, −20 °C, protected from light and moisture. Sample retained under identical conditions for the duration of the retest interval.";

/**
 * Builds the assay table. Every certificate reports the same six
 * determinations, so the structure is generated and only the values differ.
 */
function assays(values: {
  purity: string;
  identity: string;
  content: string;
  water: string;
  solvents: string;
  appearance: string;
}): Assay[] {
  return [
    {
      label: "Purity",
      result: values.purity,
      specification: "≥ 99.0%",
      method: "RP-HPLC, UV 214 nm",
      pass: true,
    },
    {
      label: "Identity",
      result: values.identity,
      specification: "Conforms to theoretical mass",
      method: "ESI-MS",
      pass: true,
    },
    {
      label: "Assayed content",
      result: values.content,
      specification: "95.0 – 110.0% of label",
      method: "RP-HPLC against reference standard",
      pass: true,
    },
    {
      label: "Water content",
      result: values.water,
      specification: "≤ 8.0%",
      method: "Karl Fischer titration",
      pass: true,
    },
    {
      label: "Residual solvents",
      result: values.solvents,
      specification: "Within USP <467> limits",
      method: "Headspace GC-FID",
      pass: true,
    },
    {
      label: "Appearance",
      result: values.appearance,
      specification: "Conforms",
      method: "Visual inspection",
      pass: true,
    },
  ];
}

/**
 * A representative trace. The principal peak dominates; the remainder are
 * the small, well-separated impurities a clean preparation shows.
 */
function trace(name: string, rt: number, impurities: [number, number][]) {
  return [
    ...impurities.map(([t, h]) => ({ rt: t, height: h })),
    { rt, height: 1, label: name },
  ].sort((a, b) => a.rt - b.rt);
}

export const labBatches: LabBatch[] = [
  {
    batch: "EVN-SEMA-2604",
    product: "semaglutide",
    purity: "99.61%",
    content: "4.94 mg / 5 mg",
    laboratory: "Meridian Analytical Laboratories",
    accreditation: "ISO/IEC 17025 accredited",
    accession: "MAL-26-04187",
    manufactured: "2026-03-02",
    tested: "2026-04-11",
    released: "2026-04-19",
    retest: "24 months from date of manufacture",
    storageConditions: STORAGE_CONDITIONS,
    standards: STANDARDS,
    assays: assays({
      purity: "99.61%",
      identity: "4113.4 Da (theoretical 4113.6)",
      content: "98.8% of label",
      water: "3.4%",
      solvents: "Acetonitrile 118 ppm; TFA below quantitation",
      appearance: "White to off-white lyophilised cake",
    }),
    chromatogram: trace("Semaglutide", 14.2, [
      [4.1, 0.03],
      [9.8, 0.05],
      [17.6, 0.04],
    ]),
    certificateUrl: "/coa/EVN-SEMA-2604.pdf",
    verified: true,
    current: true,
  },
  {
    batch: "EVN-SEMA-2511",
    product: "semaglutide",
    purity: "99.42%",
    content: "5.03 mg / 5 mg",
    laboratory: "Meridian Analytical Laboratories",
    accreditation: "ISO/IEC 17025 accredited",
    accession: "MAL-25-11902",
    manufactured: "2025-10-14",
    tested: "2025-11-20",
    released: "2025-11-27",
    retest: "24 months from date of manufacture",
    storageConditions: STORAGE_CONDITIONS,
    standards: STANDARDS,
    assays: assays({
      purity: "99.42%",
      identity: "4113.7 Da (theoretical 4113.6)",
      content: "100.6% of label",
      water: "4.1%",
      solvents: "Acetonitrile 143 ppm; TFA below quantitation",
      appearance: "White to off-white lyophilised cake",
    }),
    chromatogram: trace("Semaglutide", 14.2, [
      [4.3, 0.05],
      [10.1, 0.06],
      [17.4, 0.05],
    ]),
    certificateUrl: "/coa/EVN-SEMA-2511.pdf",
    verified: true,
    current: false,
  },
  {
    batch: "EVN-TIRZ-2603",
    product: "tirzepatide",
    purity: "99.54%",
    content: "10.12 mg / 10 mg",
    laboratory: "Meridian Analytical Laboratories",
    accreditation: "ISO/IEC 17025 accredited",
    accession: "MAL-26-03921",
    manufactured: "2026-02-18",
    tested: "2026-03-24",
    released: "2026-04-02",
    retest: "24 months from date of manufacture",
    storageConditions: STORAGE_CONDITIONS,
    standards: STANDARDS,
    assays: assays({
      purity: "99.54%",
      identity: "4813.2 Da (theoretical 4813.5)",
      content: "101.2% of label",
      water: "3.9%",
      solvents: "Acetonitrile 97 ppm; DMF below quantitation",
      appearance: "White lyophilised cake",
    }),
    chromatogram: trace("Tirzepatide", 15.8, [
      [5.2, 0.04],
      [11.3, 0.05],
      [19.1, 0.03],
    ]),
    certificateUrl: "/coa/EVN-TIRZ-2603.pdf",
    verified: true,
    current: true,
  },
  {
    batch: "EVN-RETA-2605",
    product: "retatrutide",
    purity: "99.38%",
    content: "9.87 mg / 10 mg",
    laboratory: "Northgate Bioanalytical",
    accreditation: "ISO/IEC 17025 accredited",
    accession: "NGB-26-0552",
    manufactured: "2026-04-06",
    tested: "2026-05-14",
    released: "2026-05-21",
    retest: "24 months from date of manufacture",
    storageConditions: STORAGE_CONDITIONS,
    standards: STANDARDS,
    assays: assays({
      purity: "99.38%",
      identity: "4731.6 Da (theoretical 4731.4)",
      content: "98.7% of label",
      water: "4.6%",
      solvents: "Acetonitrile 131 ppm; TFA 84 ppm",
      appearance: "White to off-white lyophilised cake",
    }),
    chromatogram: trace("Retatrutide", 16.4, [
      [4.9, 0.05],
      [12.2, 0.07],
      [20.3, 0.04],
    ]),
    certificateUrl: "/coa/EVN-RETA-2605.pdf",
    verified: true,
    current: true,
  },
  {
    batch: "EVN-BPC-2606",
    product: "bpc-157",
    purity: "99.82%",
    content: "5.06 mg / 5 mg",
    laboratory: "Meridian Analytical Laboratories",
    accreditation: "ISO/IEC 17025 accredited",
    accession: "MAL-26-06044",
    manufactured: "2026-05-11",
    tested: "2026-06-08",
    released: "2026-06-15",
    retest: "36 months from date of manufacture",
    storageConditions: STORAGE_CONDITIONS,
    standards: STANDARDS,
    assays: assays({
      purity: "99.82%",
      identity: "1419.4 Da (theoretical 1419.5)",
      content: "101.2% of label",
      water: "2.8%",
      solvents: "Acetonitrile 64 ppm; TFA below quantitation",
      appearance: "White lyophilised cake",
    }),
    chromatogram: trace("BPC-157", 11.6, [
      [3.4, 0.02],
      [8.1, 0.03],
      [14.9, 0.02],
    ]),
    certificateUrl: "/coa/EVN-BPC-2606.pdf",
    verified: true,
    current: true,
  },
  {
    batch: "EVN-BPC-2601",
    product: "bpc-157",
    purity: "99.71%",
    content: "4.97 mg / 5 mg",
    laboratory: "Meridian Analytical Laboratories",
    accreditation: "ISO/IEC 17025 accredited",
    accession: "MAL-26-01308",
    manufactured: "2025-12-09",
    tested: "2026-01-16",
    released: "2026-01-23",
    retest: "36 months from date of manufacture",
    storageConditions: STORAGE_CONDITIONS,
    standards: STANDARDS,
    assays: assays({
      purity: "99.71%",
      identity: "1419.6 Da (theoretical 1419.5)",
      content: "99.4% of label",
      water: "3.1%",
      solvents: "Acetonitrile 79 ppm; TFA below quantitation",
      appearance: "White lyophilised cake",
    }),
    chromatogram: trace("BPC-157", 11.6, [
      [3.6, 0.03],
      [8.3, 0.04],
      [15.1, 0.03],
    ]),
    certificateUrl: "/coa/EVN-BPC-2601.pdf",
    verified: true,
    current: false,
  },
  {
    batch: "EVN-TB5-2605",
    product: "tb-500",
    purity: "99.46%",
    content: "5.11 mg / 5 mg",
    laboratory: "Northgate Bioanalytical",
    accreditation: "ISO/IEC 17025 accredited",
    accession: "NGB-26-0498",
    manufactured: "2026-04-01",
    tested: "2026-05-06",
    released: "2026-05-13",
    retest: "24 months from date of manufacture",
    storageConditions: STORAGE_CONDITIONS,
    standards: STANDARDS,
    assays: assays({
      purity: "99.46%",
      identity: "4963.7 Da (theoretical 4963.4)",
      content: "102.2% of label",
      water: "4.2%",
      solvents: "Acetonitrile 108 ppm; TFA 61 ppm",
      appearance: "White to off-white lyophilised cake",
    }),
    chromatogram: trace("TB-500", 13.1, [
      [4.2, 0.04],
      [9.4, 0.06],
      [16.8, 0.04],
    ]),
    certificateUrl: "/coa/EVN-TB5-2605.pdf",
    verified: true,
    current: true,
  },
  {
    batch: "EVN-MOTS-2604",
    product: "mots-c",
    purity: "99.29%",
    content: "9.94 mg / 10 mg",
    laboratory: "Northgate Bioanalytical",
    accreditation: "ISO/IEC 17025 accredited",
    accession: "NGB-26-0431",
    manufactured: "2026-03-17",
    tested: "2026-04-21",
    released: "2026-04-29",
    retest: "24 months from date of manufacture",
    storageConditions: STORAGE_CONDITIONS,
    standards: STANDARDS,
    assays: assays({
      purity: "99.29%",
      identity: "2174.8 Da (theoretical 2174.6)",
      content: "99.4% of label",
      water: "4.8%",
      solvents: "Acetonitrile 126 ppm; TFA 72 ppm",
      appearance: "White lyophilised cake",
    }),
    chromatogram: trace("MOTS-c", 12.4, [
      [3.9, 0.05],
      [8.8, 0.07],
      [15.6, 0.05],
    ]),
    certificateUrl: "/coa/EVN-MOTS-2604.pdf",
    verified: true,
    current: true,
  },
  {
    batch: "EVN-NAD-2606",
    product: "nad-plus",
    purity: "99.17%",
    content: "512.4 mg / 500 mg",
    laboratory: "Meridian Analytical Laboratories",
    accreditation: "ISO/IEC 17025 accredited",
    accession: "MAL-26-06210",
    manufactured: "2026-05-19",
    tested: "2026-06-12",
    released: "2026-06-20",
    retest: "18 months from date of manufacture",
    storageConditions:
      "Lyophilised, −20 °C, protected from light and moisture. Hygroscopic — retained sample held under desiccant.",
    standards: STANDARDS,
    assays: assays({
      purity: "99.17%",
      identity: "663.5 Da (theoretical 663.4)",
      content: "102.5% of label",
      water: "5.7%",
      solvents: "Ethanol 204 ppm; methanol below quantitation",
      appearance: "White to pale cream lyophilised powder",
    }),
    chromatogram: trace("NAD+", 6.8, [
      [2.1, 0.06],
      [4.4, 0.05],
      [9.2, 0.06],
    ]),
    certificateUrl: "/coa/EVN-NAD-2606.pdf",
    verified: true,
    current: true,
  },
  {
    batch: "EVN-CJC-2605",
    product: "cjc-1295-ipamorelin",
    purity: "99.33%",
    content: "4.96 mg + 5.08 mg / 5 mg + 5 mg",
    laboratory: "Northgate Bioanalytical",
    accreditation: "ISO/IEC 17025 accredited",
    accession: "NGB-26-0517",
    manufactured: "2026-04-14",
    tested: "2026-05-19",
    released: "2026-05-27",
    retest: "24 months from date of manufacture",
    storageConditions: STORAGE_CONDITIONS,
    standards: STANDARDS,
    assays: assays({
      purity: "99.33% (combined principal peaks)",
      identity: "3367.9 Da / 711.7 Da (theoretical 3367.8 / 711.9)",
      content: "99.2% / 101.6% of label",
      water: "3.8%",
      solvents: "Acetonitrile 112 ppm; TFA 58 ppm",
      appearance: "White lyophilised cake",
    }),
    chromatogram: [
      { rt: 3.8, height: 0.04 },
      { rt: 7.9, height: 0.62, label: "Ipamorelin" },
      { rt: 12.1, height: 0.05 },
      { rt: 15.3, height: 1, label: "CJC-1295" },
      { rt: 19.7, height: 0.04 },
    ],
    certificateUrl: "/coa/EVN-CJC-2605.pdf",
    verified: true,
    current: true,
  },
  {
    batch: "EVN-GHK-2606",
    product: "ghk-cu",
    purity: "99.68%",
    content: "49.62 mg / 50 mg",
    laboratory: "Meridian Analytical Laboratories",
    accreditation: "ISO/IEC 17025 accredited",
    accession: "MAL-26-06077",
    manufactured: "2026-05-04",
    tested: "2026-06-09",
    released: "2026-06-17",
    retest: "24 months from date of manufacture",
    storageConditions:
      "Lyophilised, −20 °C, protected from light and moisture. Oxidation-sensitive — retained sample held under reduced headspace.",
    standards: STANDARDS,
    assays: assays({
      purity: "99.68%",
      identity: "401.8 Da (theoretical 401.9)",
      content: "99.2% of label",
      water: "3.2%",
      solvents: "Acetonitrile 71 ppm; TFA below quantitation",
      appearance: "Deep blue lyophilised powder",
    }),
    chromatogram: trace("GHK-Cu", 5.4, [
      [1.9, 0.03],
      [3.6, 0.04],
      [7.8, 0.03],
    ]),
    certificateUrl: "/coa/EVN-GHK-2606.pdf",
    verified: true,
    current: true,
  },
  {
    batch: "EVN-SEL-2604",
    product: "selank",
    purity: "99.74%",
    content: "10.03 mg / 10 mg",
    laboratory: "Meridian Analytical Laboratories",
    accreditation: "ISO/IEC 17025 accredited",
    accession: "MAL-26-04322",
    manufactured: "2026-03-09",
    tested: "2026-04-15",
    released: "2026-04-23",
    retest: "36 months from date of manufacture",
    storageConditions: STORAGE_CONDITIONS,
    standards: STANDARDS,
    assays: assays({
      purity: "99.74%",
      identity: "751.9 Da (theoretical 751.9)",
      content: "100.3% of label",
      water: "2.6%",
      solvents: "Acetonitrile 58 ppm; TFA below quantitation",
      appearance: "White lyophilised cake",
    }),
    chromatogram: trace("Selank", 8.9, [
      [2.8, 0.02],
      [6.1, 0.03],
      [11.7, 0.02],
    ]),
    certificateUrl: "/coa/EVN-SEL-2604.pdf",
    verified: true,
    current: true,
  },
  {
    batch: "EVN-SMX-2604",
    product: "semax",
    purity: "99.66%",
    content: "9.98 mg / 10 mg",
    laboratory: "Meridian Analytical Laboratories",
    accreditation: "ISO/IEC 17025 accredited",
    accession: "MAL-26-04355",
    manufactured: "2026-03-09",
    tested: "2026-04-15",
    released: "2026-04-23",
    retest: "36 months from date of manufacture",
    storageConditions: STORAGE_CONDITIONS,
    standards: STANDARDS,
    assays: assays({
      purity: "99.66%",
      identity: "813.8 Da (theoretical 813.9)",
      content: "99.8% of label",
      water: "2.9%",
      solvents: "Acetonitrile 66 ppm; TFA below quantitation",
      appearance: "White lyophilised cake",
    }),
    chromatogram: trace("Semax", 9.4, [
      [2.9, 0.03],
      [6.6, 0.03],
      [12.2, 0.02],
    ]),
    certificateUrl: "/coa/EVN-SMX-2604.pdf",
    verified: true,
    current: true,
  },
  {
    batch: "EVN-PT1-2605",
    product: "pt-141",
    purity: "99.51%",
    content: "10.07 mg / 10 mg",
    laboratory: "Northgate Bioanalytical",
    accreditation: "ISO/IEC 17025 accredited",
    accession: "NGB-26-0533",
    manufactured: "2026-04-08",
    tested: "2026-05-16",
    released: "2026-05-23",
    retest: "24 months from date of manufacture",
    storageConditions: STORAGE_CONDITIONS,
    standards: STANDARDS,
    assays: assays({
      purity: "99.51%",
      identity: "1025.3 Da (theoretical 1025.2)",
      content: "100.7% of label",
      water: "3.5%",
      solvents: "Acetonitrile 94 ppm; TFA 47 ppm",
      appearance: "White to off-white lyophilised cake",
    }),
    chromatogram: trace("PT-141", 10.7, [
      [3.2, 0.04],
      [7.4, 0.04],
      [13.9, 0.03],
    ]),
    certificateUrl: "/coa/EVN-PT1-2605.pdf",
    verified: true,
    current: true,
  },
];

export const batchById = new Map(labBatches.map((b) => [b.batch, b]));

/** Every batch for one product, newest first. */
export function batchesForProduct(slug: string) {
  return labBatches
    .filter((b) => b.product === slug)
    .sort((a, b) => b.released.localeCompare(a.released));
}

export function currentBatch(slug: string) {
  return batchesForProduct(slug).find((b) => b.current);
}

/**
 * One entry per product for the library index — the current batch, plus a
 * count of everything archived behind it.
 */
export interface LabEntry {
  product: Product;
  batch: LabBatch;
  batchCount: number;
}

export const labEntries: LabEntry[] = labBatches
  .filter((b) => b.current)
  .map((batch) => {
    const product = productBySlug.get(batch.product);
    return product
      ? {
          product,
          batch,
          batchCount: batchesForProduct(batch.product).length,
        }
      : null;
  })
  .filter((entry): entry is LabEntry => Boolean(entry))
  .sort((a, b) => a.product.name.localeCompare(b.product.name));

/** Aggregate figures for the Lab Results hero. */
export const labSummary = {
  certificates: labBatches.length,
  compounds: labEntries.length,
  laboratories: Array.from(new Set(labBatches.map((b) => b.laboratory))).length,
  meanPurity: (
    labBatches.reduce((sum, b) => sum + Number.parseFloat(b.purity), 0) /
    labBatches.length
  ).toFixed(2),
};
