import { site } from "./site";

/**
 * Legal and compliance documents.
 *
 * Eight separately addressable documents, each with its own route, so a
 * specific position can be linked to and cited rather than buried in a single
 * scroll. The wording states EVOHN's actual position — an informational
 * catalogue with no sale mechanism — and deliberately claims nothing that the
 * business cannot evidence.
 *
 * `requiresLegalReview` is not decorative. Every document carrying it renders a
 * visible review banner, and the flag is asserted in the test suite so it
 * cannot be silently cleared. Clearing it is a decision for a qualified
 * adviser in the relevant jurisdiction, not for a content edit.
 */

export interface LegalSection {
  heading: string;
  /** Paragraphs. Plain text — nothing here is markup. */
  body: string[];
  /** Optional bulleted points rendered under the paragraphs. */
  points?: string[];
}

export interface LegalDocument {
  slug: string;
  /** Route this document is served at. */
  path: string;
  /** Short label used in the footer and the legal index. */
  label: string;
  /** Page heading. */
  title: string;
  /** One line, shown in the index and used as the meta description. */
  summary: string;
  /** ISO date the wording was last read end-to-end. */
  lastReviewed: string;
  /** True until a qualified adviser has signed the wording off. */
  requiresLegalReview: boolean;
  sections: LegalSection[];
}

const REVIEWED = "2026-08-04";

export const legalDocuments: LegalDocument[] = [
  {
    slug: "terms",
    path: "/terms",
    label: "Terms",
    title: "Terms of use",
    summary:
      "The terms governing access to this website and the information presented on it.",
    lastReviewed: REVIEWED,
    requiresLegalReview: true,
    sections: [
      {
        heading: "Acceptance",
        body: [
          `These terms govern your access to and use of this website. By continuing past the entrance notice you confirm that you have read them and that you accept them. If you do not accept them, do not use the site.`,
          `${site.name} may revise these terms. The date at the head of this document records when the wording was last read end to end; a revision takes effect when it is published here.`,
        ],
      },
      {
        heading: "What this website is",
        body: [
          `This website is an informational catalogue. It describes compounds as they are characterised in the published scientific record and publishes the analytical documentation held for released batches.`,
          `It is not a shop. It displays no price, no stock figure and no purchasable unit, it contains no ordering mechanism, and nothing on it constitutes an offer, an invitation to treat, or a contract. Any supply arrangement is agreed separately and in writing, and is subject to verification of the recipient and of the regulatory position that applies to them.`,
        ],
      },
      {
        heading: "Permitted use",
        body: [
          `You may read, print and cite the material here for lawful research, reference and evaluation purposes. You may not represent it as your own, republish it commercially, or present any part of it as a therapeutic claim.`,
        ],
        points: [
          "Do not use the site to imply that any compound is approved for human or veterinary use.",
          "Do not scrape, mirror or redistribute the catalogue or the analytical documents in bulk.",
          "Do not misrepresent your identity, your organisation or your intended use when making an enquiry.",
        ],
      },
      {
        heading: "Accuracy",
        body: [
          `Analytical figures reflect measurements recorded for specific historical batches. Reference data such as CAS numbers, molecular formulae and reported half-lives are given for identification and should be verified against the certificate of analysis supplied with the lot in question.`,
          `${site.name} takes reasonable care over the accuracy of what is published here but does not warrant that every entry is complete or current at the moment you read it.`,
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          `The ${site.name} name, wordmark, visual identity, photography and written content are the property of ${site.name} and may not be reproduced without written permission.`,
          `Compound names are used descriptively for identification. Their use does not imply affiliation with, or endorsement by, the holder of any associated mark.`,
        ],
      },
      {
        heading: "Liability",
        body: [
          `Nothing in these terms excludes liability that cannot lawfully be excluded. Subject to that, ${site.name} accepts no liability for any decision taken on the basis of information published on this website.`,
        ],
      },
      {
        heading: "Governing law",
        body: [
          `These terms are governed by the law of the United Arab Emirates. The governing-law and jurisdiction position requires confirmation by a qualified adviser before this document is relied upon.`,
        ],
      },
    ],
  },

  {
    slug: "privacy",
    path: "/privacy",
    label: "Privacy",
    title: "Privacy",
    summary:
      "What this website collects, what it does not collect, and where the information you send goes.",
    lastReviewed: REVIEWED,
    requiresLegalReview: true,
    sections: [
      {
        heading: "What this site collects",
        body: [
          `This website is a static site. It has no account system, no login, no advertising network and no third-party analytics or tracking script embedded in its pages.`,
          `Two pieces of information are written to your own browser and never leave it:`,
        ],
        points: [
          "Your acknowledgement of the entrance notice, so it is not shown again on every visit.",
          "Your enquiry list, so a selection survives moving between pages.",
        ],
      },
      {
        heading: "Where that information lives",
        body: [
          `Both are stored in your browser's local storage on your own device. Neither is transmitted to ${site.name}, neither is readable by us, and clearing your browser data removes both permanently.`,
        ],
      },
      {
        heading: "What you send us",
        body: [
          `An enquiry form or a WhatsApp enquiry sends us what you type into it — typically a name, a contact address, an organisation and the substance of your question. We use it to answer you and to keep a record of the exchange. We do not sell it, and we do not add you to a marketing list on the strength of an enquiry alone.`,
          `WhatsApp enquiries are carried by WhatsApp and are subject to that service's own handling of your data, which is outside our control.`,
        ],
      },
      {
        heading: "Retention",
        body: [
          `Enquiry correspondence is retained for as long as it is needed to answer you and to meet record-keeping obligations, and is then deleted. The specific retention periods require confirmation by a qualified adviser.`,
        ],
      },
      {
        heading: "Your rights",
        body: [
          `You may ask what we hold about you, ask for it to be corrected, or ask for it to be deleted. Write to ${site.email}. The applicable data-protection regime and the rights that attach to it depend on where you are, and require confirmation by a qualified adviser.`,
        ],
      },
      {
        heading: "Hosting",
        body: [
          `The site is served as static files by its hosting provider, which will record standard server request logs. Those logs are held by the provider under its own terms.`,
        ],
      },
    ],
  },

  {
    slug: "shipping",
    path: "/shipping",
    label: "Shipping",
    title: "Shipping and handling",
    summary:
      "How material is packed and moved when a supply arrangement has been agreed, and what this website does not do.",
    lastReviewed: REVIEWED,
    requiresLegalReview: true,
    sections: [
      {
        heading: "This website does not ship",
        body: [
          `There is no ordering mechanism on this site and therefore no order to dispatch. This document describes how material moves under a supply arrangement that has already been agreed separately and in writing.`,
        ],
      },
      {
        heading: "Cold chain",
        body: [
          `Lyophilised material is packed against a temperature excursion appropriate to the compound and the transit time, and is released only where the receiving party has confirmed it can accept and store it correctly on arrival.`,
          `Where a compound's stability window makes a controlled shipment impractical for a given destination or season, the shipment is not sent.`,
        ],
      },
      {
        heading: "Documentation",
        body: [
          `Every consignment travels with the certificate of analysis for the lot it contains, so the analytical record and the physical material never separate.`,
        ],
      },
      {
        heading: "Territories",
        body: [
          `The regulatory status of the compounds described varies by territory, and it is the responsibility of the receiving party to establish that receipt and possession are lawful where they are. ${site.name} does not undertake to move material into a territory where doing so would not be lawful.`,
          `The list of territories served, the carriers used and the incoterms applied require confirmation by a qualified adviser before publication.`,
        ],
      },
      {
        heading: "On arrival",
        body: [
          `Inspect the consignment on receipt. Record the condition of the temperature indicator before opening. Report a compromised shipment to ${site.labEmail} the same day, with the batch number and photographs of the packaging as received.`,
        ],
      },
    ],
  },

  {
    slug: "returns",
    path: "/returns",
    label: "Returns",
    title: "Returns and analytical disputes",
    summary:
      "What happens when material does not match its certificate, and why a return is not the usual remedy.",
    lastReviewed: REVIEWED,
    requiresLegalReview: true,
    sections: [
      {
        heading: "This website has no returns process",
        body: [
          `Nothing is sold through this site, so there is nothing here to return. This document sets out the position taken under a supply arrangement agreed separately.`,
        ],
      },
      {
        heading: "Why material is not usually returned",
        body: [
          `A compound that has left controlled storage cannot be returned to stock: its handling history is no longer documented, and undocumented material is not material we would release to anyone else. Physically returning a vial therefore serves no analytical purpose.`,
          `The remedy is analytical, not logistical. Where a consignment is disputed, the question is what the material actually is — and that is answered by testing, not by shipping it back.`,
        ],
      },
      {
        heading: "Raising an analytical dispute",
        body: [
          `Write to ${site.labEmail} with the batch number, the certificate reference, the analysis you have run and the result you obtained.`,
        ],
        points: [
          "The retained sample for that lot is re-tested against the original method.",
          "Where the two results disagree, the lot is quarantined and every recipient of it is contacted.",
          "The outcome is recorded against the batch record and published with the lot's analytical history.",
        ],
      },
      {
        heading: "Damaged or excursed consignments",
        body: [
          `A consignment that arrives with a compromised temperature indicator or damaged primary packaging is treated as an excursion, not a return. Report it the same day with photographs as received; the material must not be used in the interim.`,
        ],
      },
      {
        heading: "Statutory rights",
        body: [
          `Nothing here limits any right that cannot lawfully be limited. The interaction between this position and consumer or commercial law in a given territory requires confirmation by a qualified adviser.`,
        ],
      },
    ],
  },

  {
    slug: "platform-use",
    path: "/platform-use",
    label: "Platform Use",
    title: "Platform use",
    summary:
      "How the research tools on this site may be used, and the limits of what they compute.",
    lastReviewed: REVIEWED,
    requiresLegalReview: true,
    sections: [
      {
        heading: "The tools are arithmetic",
        body: [
          `The calculator, the reference library and the handling guides published here perform conversions and present published information. They convert between quantity, volume and concentration; they summarise how a compound appears in the literature; they describe storage chemistry.`,
          `They do not select a quantity, recommend a schedule, evaluate a study design, or make any judgement about whether a compound should be used at all. Those are decisions for the person designing the work, and this platform takes none of them.`,
        ],
      },
      {
        heading: "Your inputs are your own",
        body: [
          `The calculator runs entirely in your browser. Values you type are not transmitted, not logged and not retained by ${site.name}. Closing the tab discards them.`,
        ],
      },
      {
        heading: "Verify before you rely",
        body: [
          `Arithmetic published here is deterministic and unit-tested, but it operates on the numbers you supply. A figure entered from the wrong line of a certificate produces a confidently wrong answer.`,
        ],
        points: [
          "Check the assayed content on the certificate, not the label strength, where the two differ.",
          "Check the unit before reading the result.",
          "Confirm any figure that will inform a decision against an independent calculation.",
        ],
      },
      {
        heading: "Acceptable use",
        body: [
          `Do not automate access to these tools at a rate that degrades them for others, do not embed them in another product as if they were your own, and do not present their output as clinical or veterinary guidance.`,
        ],
      },
    ],
  },

  {
    slug: "age-verification",
    path: "/age-verification",
    label: "Age Verification",
    title: "Age verification",
    summary:
      "Why this site asks you to confirm your age and your research context before entering.",
    lastReviewed: REVIEWED,
    requiresLegalReview: true,
    sections: [
      {
        heading: "What is asked",
        body: [
          `Before the catalogue is shown, the entrance notice asks you to confirm two things: that you are at least 18 years of age, and that you are accessing the site in a research, laboratory or professional capacity rather than seeking material for personal use.`,
        ],
      },
      {
        heading: "Why it is asked",
        body: [
          `The compounds described here are supplied for laboratory research only. They are not medicines, they are not approved for human or veterinary administration, and presenting them to a general audience without that context would be misleading.`,
          `The notice is an honest statement of who the catalogue is for. It is a declaration you make, not an identity check — ${site.name} does not verify the declaration and does not collect any document from you.`,
        ],
      },
      {
        heading: "What is stored",
        body: [
          `Your acknowledgement is written to your own browser's local storage so the notice is not repeated on every page. Nothing is transmitted to ${site.name}. Clearing your browser data restores the notice on your next visit.`,
        ],
      },
      {
        heading: "Declining",
        body: [
          `Declining the notice returns you to a page explaining the position and does not open the catalogue. There is no penalty for declining and no attempt to ask again in a different form.`,
        ],
      },
      {
        heading: "Limits of this mechanism",
        body: [
          `A self-declaration is not an age-assurance system and is not represented as one. Whether it is sufficient in a given territory — and whether a stronger mechanism is required — needs confirmation by a qualified adviser.`,
        ],
      },
    ],
  },

  {
    slug: "research-use-only",
    path: "/research-use-only",
    label: "Research Use Only",
    title: "Research use only",
    summary:
      "The single condition attached to everything described on this website.",
    lastReviewed: REVIEWED,
    requiresLegalReview: true,
    sections: [
      {
        heading: "The condition",
        body: [
          `Every compound described on this website is characterised for laboratory research use only. None is offered, presented or intended for human consumption, for veterinary use, for clinical administration, or for use as a food, a cosmetic or a supplement.`,
        ],
      },
      {
        heading: "What that means in practice",
        body: [
          `Material described here is for use in controlled laboratory settings by people competent to handle it.`,
        ],
        points: [
          "Not for diagnostic use.",
          "Not for therapeutic use.",
          "Not for administration to humans or to animals.",
          "Not for compounding, dispensing or resale as a finished preparation.",
        ],
      },
      {
        heading: "No approval is claimed",
        body: [
          `No statement on this website has been evaluated by any medicines regulator. ${site.name} does not represent that any compound described is registered, approved or permitted for any particular use in any particular jurisdiction.`,
          `Regulatory status varies by territory and changes. Establishing the position that applies to you is your responsibility.`,
        ],
      },
      {
        heading: "Analytical documentation",
        body: [
          `Certificates of analysis published here establish what a batch is — its identity and its purity. They establish nothing about whether it is safe or effective for any purpose, and they must not be presented as if they did.`,
        ],
      },
    ],
  },

  {
    slug: "research-disclaimer",
    path: "/research-disclaimer",
    label: "Research Disclaimer",
    title: "Research disclaimer",
    summary:
      "How to read the scientific descriptions, purity figures and literature references published here.",
    lastReviewed: REVIEWED,
    requiresLegalReview: true,
    sections: [
      {
        heading: "Descriptions are characterisations, not claims",
        body: [
          `Where this site describes what a compound does, it is reporting how that compound has been characterised in published scientific literature. It is not asserting that the compound produces that effect, that the effect is beneficial, or that the finding generalises beyond the model it was observed in.`,
          `A mechanism described in a cell line is a mechanism described in a cell line. This site does not silently upgrade it into an outcome.`,
        ],
      },
      {
        heading: "Purity figures",
        body: [
          `A purity figure is a measurement of one lot, by one method, on one date. It is not a specification, not a guarantee, and not a prediction about a future batch. The method and the date are published alongside every figure precisely so it can be read correctly.`,
          `Purity and identity are separate questions. A high-purity result establishes that the material is overwhelmingly one substance; the identity confirmation establishes which substance that is. Neither substitutes for the other.`,
        ],
      },
      {
        heading: "Evidence levels",
        body: [
          `Where a compound carries an evidence level, that label describes how extensively it appears in the published record — nothing more. It is not a safety rating, not an efficacy rating and not a recommendation.`,
        ],
      },
      {
        heading: "References",
        body: [
          `Literature cited here is given so you can read the source yourself. Citation is not endorsement of a study's conclusions, and the absence of a citation is not evidence of absence.`,
        ],
      },
      {
        heading: "No medical advice",
        body: [
          `Nothing on this website is medical, clinical, veterinary or pharmaceutical advice. No content here should be interpreted as indicating that any compound is safe or effective for the diagnosis, treatment, cure or prevention of any condition. If you need medical advice, consult a qualified clinician.`,
        ],
      },
    ],
  },
];

export const legalBySlug = new Map(legalDocuments.map((d) => [d.slug, d]));

export function getLegalDocument(slug: string): LegalDocument {
  const doc = legalBySlug.get(slug);
  if (!doc) throw new Error(`Unknown legal document: ${slug}`);
  return doc;
}

/** Footer "Legal" column — the eight documents, in the order specified. */
export const legalNavLinks = legalDocuments.map((d) => ({
  label: d.label,
  href: d.path,
}));
