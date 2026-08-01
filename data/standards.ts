/**
 * The verification narrative used on the home page and the science page.
 * Deliberately factual: each item describes a process, not an outcome.
 */

export interface Standard {
  title: string;
  body: string;
}

/** Home page — the four-panel scroll sequence. */
export const pillars: Standard[] = [
  {
    title: "Analytical\nPurity",
    body: "Every batch is analysed by HPLC and the measured result is published per lot. A number that is measured, not claimed.",
  },
  {
    title: "Cold-Chain\nIntegrity",
    body: "Temperature-controlled from synthesis through to delivery, so that what was verified is what arrives.",
  },
  {
    title: "Independent\nVerification",
    body: "Accredited third-party laboratories confirm in-house analysis. Trust is a consequence of transparency.",
  },
  {
    title: "Manufacturing\nStandards",
    body: "Produced under good manufacturing practice protocols within certified facilities, documented at every stage.",
  },
];

/** Science page — the full verification chain. */
export const verificationChain: Standard[] = [
  {
    title: "Raw Material Qualification",
    body: "Every incoming amino acid and reagent is identity-tested and traced to a qualified supplier before it enters synthesis. Nothing proceeds on a supplier's word alone.",
  },
  {
    title: "Solid-Phase Synthesis",
    body: "Sequential assembly under controlled conditions, with in-process monitoring at each coupling step and documented deviation handling.",
  },
  {
    title: "Purification",
    body: "Preparative reverse-phase chromatography isolates the target sequence from truncation and deletion products, with fraction analysis governing collection.",
  },
  {
    title: "HPLC Verification",
    body: "Purity is determined by high-performance liquid chromatography. The measured value — typically 99% or above — is published on the certificate for that specific lot.",
  },
  {
    title: "Identity Confirmation",
    body: "Mass spectrometry confirms molecular weight against the theoretical value, establishing that the correct molecule was made, not merely a pure one.",
  },
  {
    title: "Lyophilisation",
    body: "Controlled freeze-drying under vacuum produces a stable amorphous cake, with residual moisture measured and recorded.",
  },
  {
    title: "Third-Party Analysis",
    body: "An accredited independent laboratory repeats the critical analyses. Agreement between two independent results is the standard.",
  },
  {
    title: "Cold-Chain Dispatch",
    body: "Temperature-controlled packaging and monitoring from the moment a batch leaves the facility until it is received.",
  },
];

/** Facility capabilities — About page. */
export const capabilities: Standard[] = [
  {
    title: "ISO Cleanroom",
    body: "Classified environments with monitored particulate counts, differential pressure and gowning protocol.",
  },
  {
    title: "Analytical Laboratory",
    body: "HPLC, mass spectrometry and Karl Fischer titration operated under documented method validation.",
  },
  {
    title: "Synthesis Suite",
    body: "Automated solid-phase peptide synthesis with in-process monitoring and full batch record capture.",
  },
  {
    title: "Cold Storage",
    body: "Validated −20 °C and 2–8 °C storage with continuous monitoring and alarmed excursion handling.",
  },
];
