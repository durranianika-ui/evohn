import { site } from "./site";

/**
 * Contact.
 *
 * Channels, enquiry routes, topics and support scope. The enquiry form posts
 * nowhere by design — there is no backend in this build — so it composes a
 * WhatsApp message from the fields instead, which keeps the single-channel
 * commitment intact.
 */

export interface Channel {
  label: string;
  value: string;
  href: string;
  detail: string;
  /** Opens off-site. */
  external?: boolean;
}

export interface EnquiryRoute {
  id: string;
  title: string;
  body: string;
  points: string[];
  cta: string;
}

export interface SupportArea {
  title: string;
  body: string;
}

export const channels: Channel[] = [
  {
    label: "WhatsApp",
    value: "Message the desk",
    href: "#whatsapp",
    detail: "Fastest route. Typical reply within a few hours during desk hours.",
    external: true,
  },
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    detail: "General enquiries, documentation requests and catalogue questions.",
  },
  {
    label: "Laboratory desk",
    value: site.labEmail,
    href: `mailto:${site.labEmail}`,
    detail:
      "Certificate verification, batch queries and method questions, answered by the research desk.",
  },
  {
    label: "Partnerships",
    value: site.partnersEmail,
    href: `mailto:${site.partnersEmail}`,
    detail: "Distribution, territory and institutional supply enquiries.",
  },
];

export const enquiryRoutes: EnquiryRoute[] = [
  {
    id: "researchers",
    title: "Researchers",
    body: "Compound characterisation, documentation and handling questions — answered by someone who can read the certificate rather than quote a policy.",
    points: [
      "Compound and specification questions",
      "Certificate of analysis retrieval",
      "Handling, storage and stability guidance",
    ],
    cta: "Request information",
  },
  {
    id: "institutional",
    title: "Laboratory & institutional",
    body: "Accounts for laboratories, research groups and contract organisations, including recurring supply against a study schedule.",
    points: [
      "Institutional accounts",
      "Scheduled supply against a study timeline",
      "Retained sample and documentation requirements",
    ],
    cta: "Talk to specialist",
  },
  {
    id: "partners",
    title: "Distribution partners",
    body: "Territory enquiries and supply relationships. Documentation requirements are stated once, in full, at the outset.",
    points: [
      "Territory and distribution",
      "Regulatory documentation packages",
      "Cold-chain and custody arrangements",
    ],
    cta: "Speak with advisor",
  },
];

export const supportAreas: SupportArea[] = [
  {
    title: "Certificate retrieval and verification",
    body: "Every published certificate carries an accession number that the issuing laboratory can retrieve independently. If you need a historical batch, or confirmation direct from the laboratory, the desk will arrange it.",
  },
  {
    title: "Specification and method questions",
    body: "Questions about gradient conditions, detection wavelength, or how a particular determination was made are answered with reference to the actual certificate rather than a general statement.",
  },
  {
    title: "Handling and stability",
    body: "Compound-specific guidance on reconstitution, diluent choice, aliquoting and reconstituted stability intervals — including where the guidance differs from the generic advice.",
  },
  {
    title: "Custody and logistics",
    body: "Cold-chain arrangements, in-transit temperature control, and what to do if an indicator arrives out of range. The answer to the last one is: tell us before you open it.",
  },
];

/** Options in the enquiry form's topic selector. */
export const enquiryTopics = [
  "Compound information",
  "Certificate of analysis",
  "Handling and storage",
  "Research stacks",
  "Institutional account",
  "Distribution partnership",
  "Something else",
] as const;

export type EnquiryTopic = (typeof enquiryTopics)[number];

/** Where the desk is, for the location panel. */
export const location = {
  ...site.address,
  note: "Correspondence address and regional dispatch. Synthesis, lyophilisation and independent analysis are contracted — see Facilities.",
  hours: site.hours,
};
