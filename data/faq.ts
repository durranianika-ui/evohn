export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const faqGroups: FaqGroup[] = [
  {
    title: "The Catalogue",
    items: [
      {
        question: "Is this an online store?",
        answer:
          "No. EVOHN maintains a presentation catalogue. There is no cart, checkout, pricing or account layer on this site by design. Every enquiry is handled directly by a specialist over WhatsApp, so that questions of specification, documentation and jurisdiction are addressed before anything else.",
      },
      {
        question: "Why are no prices shown?",
        answer:
          "Presentation, batch and documentation requirements differ by enquiry, and pricing without that context would be misleading. A specialist will provide precise figures once the specification is understood.",
      },
      {
        question: "How do I request information about a compound?",
        answer:
          "Every product page carries an enquiry action that opens WhatsApp with the compound already referenced. You may also write to the address listed on the contact page.",
      },
      {
        question: "Can compounds be supplied to my territory?",
        answer:
          "Availability is determined by the regulations of each jurisdiction. A specialist will confirm what is permissible for your territory before any discussion of supply.",
      },
    ],
  },
  {
    title: "Quality & Documentation",
    items: [
      {
        question: "How is purity established?",
        answer:
          "Each batch is analysed by high-performance liquid chromatography, with identity confirmed by mass spectrometry. The measured result is published on the certificate of analysis for that specific lot — it is a measurement, not a target.",
      },
      {
        question: "What documentation accompanies a batch?",
        answer:
          "A certificate of analysis, the HPLC chromatogram, mass spectrometry identity confirmation, and chain-of-custody records from raw material through to final packaging.",
      },
      {
        question: "Is testing performed independently?",
        answer:
          "Yes. Batches are verified by accredited third-party laboratories in addition to in-house analysis. Independent confirmation is the point at which a result becomes credible.",
      },
      {
        question: "What does batch traceability mean in practice?",
        answer:
          "Every vial carries a lot identifier that resolves to a complete record: raw material source, synthesis run, analytical results, packaging date and cold-chain history.",
      },
    ],
  },
  {
    title: "Handling & Storage",
    items: [
      {
        question: "How should compounds be stored?",
        answer:
          "Lyophilised material is held at −20 °C, protected from light and moisture. Following reconstitution, material is refrigerated at 2–8 °C and used within the interval stated on the batch certificate. Specific guidance appears on every product page.",
      },
      {
        question: "How is cold chain maintained in transit?",
        answer:
          "Temperature-controlled packaging is used from dispatch through to delivery, with monitoring appropriate to the transit duration and destination.",
      },
      {
        question: "What is the shelf life of lyophilised material?",
        answer:
          "Stability varies by compound and is stated on the certificate of analysis for each batch rather than generalised across the catalogue.",
      },
    ],
  },
  {
    title: "Research Stacks",
    items: [
      {
        question: "Are the compounds in a stack supplied pre-mixed?",
        answer:
          "No. Every component arrives in its own vial with its own batch number and its own certificate of analysis. Pre-mixing would make a result untraceable to the analysis that produced it, and it would force the whole preparation onto the shortest stability window in the set.",
      },
      {
        question: "Can I request a single component from a stack?",
        answer:
          "Yes. Every compound in every grouping is listed individually in the catalogue. A stack describes how compounds are studied together; it does not restrict how they are supplied.",
      },
      {
        question: "Is the protocol information administration guidance?",
        answer:
          "No. It describes how the grouping is handled and sequenced in the published record — reconstitution order, documentation, and the constraints imposed by differing stability profiles. Nothing in it is guidance on administration, and none of it should be read as such.",
      },
      {
        question: "Which stack should I be looking at?",
        answer:
          "That depends on the endpoint you are measuring rather than the outcome you are interested in. Describe the measurement to a specialist and they will say which grouping the literature would point at — including when the honest answer is a single compound rather than a set.",
      },
    ],
  },
  {
    title: "Lab Results",
    items: [
      {
        question: "Where do I find the certificate for my batch?",
        answer:
          "Every published certificate is in the lab results library, indexed by compound. The batch number printed on the vial matches the batch number on the certificate exactly — if it does not, tell us before you open the vial.",
      },
      {
        question: "Why are superseded batches still published?",
        answer:
          "Because a result produced months ago needs the certificate that released the material it used, not the one that happens to be current. Archived batches remain on the site permanently for that reason.",
      },
      {
        question: "Can I confirm a certificate with the laboratory directly?",
        answer:
          "Yes, and you should. Every certificate carries an accession number issued by the testing laboratory, which the laboratory can retrieve independently of us. That is the point of publishing it. The desk will arrange the confirmation rather than vouch for it.",
      },
      {
        question: "Why does the assayed content differ from the label?",
        answer:
          "The label states nominal strength; the certificate states what the laboratory found. The two are rarely identical. Where a compound is consumed stoichiometrically rather than acting catalytically, the assayed figure is the one to build the calculation on.",
      },
      {
        question: "What happens to a batch that misses specification?",
        answer:
          "It is rejected. There is no re-grade and no intermediate category, because an intermediate category is where standards erode quietly.",
      },
    ],
  },
  {
    title: "Compliance",
    items: [
      {
        question: "Are these compounds approved for human use?",
        answer:
          "EVOHN makes no representation that any compound described on this site is approved for human or veterinary use in any territory. Material is presented for informational and reference purposes only.",
      },
      {
        question: "Does EVOHN provide medical guidance?",
        answer:
          "No. Nothing on this site constitutes medical advice, a diagnosis, or a therapeutic claim. Product entries describe compounds as characterised in published scientific literature.",
      },
    ],
  },
];

export const allFaqItems = faqGroups.flatMap((g) => g.items);
