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
