/**
 * The Journal.
 *
 * Long-form research writing, modelled as blocks rather than markup so the
 * whole collection lifts into a headless CMS without a parser. A renderer
 * switches on `block.type`; adding a block type is a component change, not a
 * data migration.
 */

export type JournalBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; title: string; text: string }
  | { type: "quote"; text: string; attribution?: string };

export interface JournalTopic {
  slug: string;
  name: string;
  description: string;
}

export interface Article {
  slug: string;
  title: string;
  /** Topic slug — see `journalTopics`. */
  topic: string;
  /** Card-length summary. */
  excerpt: string;
  /** ISO date. Rendered with `Intl.DateTimeFormat`. */
  date: string;
  readMinutes: number;
  /** Promoted to the Journal hero and the home page. */
  featured?: boolean;
  image: string;
  body: JournalBlock[];
}

export const journalTopics: JournalTopic[] = [
  {
    slug: "quality-and-testing",
    name: "Quality & Testing",
    description:
      "How analytical claims are established, verified and reported — and how to read the resulting documents.",
  },
  {
    slug: "laboratory-methods",
    name: "Laboratory Methods",
    description:
      "The instrumentation behind a certificate: what each technique measures and the question it exists to answer.",
  },
  {
    slug: "compound-profiles",
    name: "Compound Profiles",
    description:
      "Research-framed overviews of the mechanisms that define a class of compounds.",
  },
  {
    slug: "handling-and-storage",
    name: "Handling & Storage",
    description:
      "Preparation, stability and the practical decisions that determine whether a result is reproducible.",
  },
];

export const articles: Article[] = [
  {
    slug: "how-to-read-a-certificate-of-analysis",
    title: "How to Read a Certificate of Analysis",
    topic: "quality-and-testing",
    excerpt:
      "A certificate is a structured claim, not a seal of approval. Knowing which sections carry weight — and which are decoration — is the difference between verification and reassurance.",
    date: "2026-06-18",
    readMinutes: 8,
    featured: true,
    image: "/journal/certificate-of-analysis.jpg",
    body: [
      {
        type: "paragraph",
        text: "Most people read a certificate of analysis the way they read a receipt: they look for the number at the bottom and move on. The number at the bottom is usually a purity figure, and on its own it is close to meaningless. A certificate is a structured set of claims, each answering a different question, and the value of the document lies in whether those questions were asked by someone with no stake in the answer.",
      },
      {
        type: "heading",
        text: "The header is the part people skip",
      },
      {
        type: "paragraph",
        text: "Before any result, a credible certificate identifies four things: what was tested, which batch it came from, who tested it, and when. A missing batch identifier is disqualifying. Without it the document describes an unnamed sample and cannot be tied to the vial in front of you — which is the entire purpose of the exercise.",
      },
      {
        type: "list",
        items: [
          "Sample identity — the compound name as submitted, not as marketed.",
          "Batch or lot number — must match the vial label exactly.",
          "Testing laboratory — named, with an accession or report number that the laboratory itself can retrieve.",
          "Date of analysis — a certificate describes a moment, not a permanent state.",
        ],
      },
      {
        type: "heading",
        text: "Purity and identity are different claims",
      },
      {
        type: "paragraph",
        text: "Purity asks how much of the sample is the principal component. Identity asks whether that principal component is the compound named on the label. High-performance liquid chromatography answers the first; mass spectrometry answers the second. A certificate reporting 99.4% purity with no mass confirmation has told you that the sample is homogeneous. It has not told you what it is homogeneous with.",
      },
      {
        type: "callout",
        title: "The failure mode to look for",
        text: "A structurally related peptide — a deletion sequence, a truncated analogue — can present as a clean, single-peak chromatogram. Purity alone cannot distinguish it from the intended compound. Only a mass measurement can.",
      },
      {
        type: "heading",
        text: "Content is not the same as strength",
      },
      {
        type: "paragraph",
        text: "The label says 5 mg. The certificate reports assayed content, which is what the laboratory actually found. Those two figures are rarely identical, and the gap matters more in some work than others. Where a compound acts catalytically, a small variance is tolerable. Where it is consumed stoichiometrically — as a cofactor is — the assayed figure is the one to build the calculation on.",
      },
      {
        type: "heading",
        text: "What a good certificate includes beyond purity",
      },
      {
        type: "list",
        items: [
          "Residual solvent analysis — what remains from synthesis and purification.",
          "Water content by Karl Fischer titration — directly affects the accuracy of any mass-based calculation.",
          "Endotoxin or bioburden result where the material's intended handling warrants it.",
          "Appearance and solubility observations — the cheapest test in the set, and the one that catches gross problems first.",
        ],
      },
      {
        type: "heading",
        text: "Independence is the whole argument",
      },
      {
        type: "paragraph",
        text: "A manufacturer testing its own material is not producing verification; it is producing a claim about a claim. The question a certificate exists to settle is whether someone with nothing to gain looked at the sample and wrote down what they found. If the certificate does not name a laboratory you can contact independently, it has not settled that question.",
      },
    ],
  },
  {
    slug: "purity-versus-identity",
    title: "Purity Versus Identity: Two Questions, Two Instruments",
    topic: "quality-and-testing",
    excerpt:
      "A high purity result does not confirm what a compound is. Purity asks how much of a sample is one thing; identity asks whether that thing is what the label claims.",
    date: "2026-05-27",
    readMinutes: 6,
    featured: true,
    image: "/journal/purity-identity.jpg",
    body: [
      {
        type: "paragraph",
        text: "There is a persistent confusion in how analytical results are quoted, and it survives because both figures are expressed in the same confident language. Purity and identity sound like two ways of saying the same thing. They are not. They are answers to questions that do not overlap, produced by instruments that measure entirely different properties.",
      },
      {
        type: "heading",
        text: "What purity actually measures",
      },
      {
        type: "paragraph",
        text: "In reversed-phase HPLC, a sample is carried through a column that separates components by their affinity for the stationary phase. What emerges is a chromatogram: a trace with peaks, each corresponding to something that came off the column at a particular time. Purity is the area of the principal peak expressed as a percentage of total peak area. It is a statement about homogeneity — that the sample is overwhelmingly one substance.",
      },
      {
        type: "quote",
        text: "A chromatogram tells you the sample is one thing. It does not tell you which thing.",
      },
      {
        type: "heading",
        text: "Where that leaves a deletion sequence",
      },
      {
        type: "paragraph",
        text: "Solid-phase peptide synthesis builds a chain one residue at a time, and coupling is never perfectly efficient. A chain that failed to accept a residue continues to be extended and emerges as a deletion sequence: a peptide one amino acid short of the target. Depending on which residue is missing, it may have almost identical retention behaviour. It can co-elute. It can present as a clean single peak.",
      },
      {
        type: "heading",
        text: "What mass spectrometry adds",
      },
      {
        type: "paragraph",
        text: "Mass spectrometry ionises the sample and measures mass-to-charge ratio. A peptide missing one glycine residue is 57 daltons lighter than the intended sequence — invisible to a retention-time measurement, unmistakable on a mass spectrum. This is why identity confirmation is not an optional supplement to purity testing. It is the half of the question that purity cannot reach.",
      },
      {
        type: "callout",
        title: "Reading the pair together",
        text: "High purity with confirmed identity means the sample is overwhelmingly one substance and that substance is the named compound. Either result alone leaves a gap large enough to invalidate a study.",
      },
      {
        type: "heading",
        text: "The practical test",
      },
      {
        type: "paragraph",
        text: "When you next read a certificate, find the purity figure — then look for the mass. If the document reports one without the other, it has answered half a question and presented it as a whole one.",
      },
    ],
  },
  {
    slug: "third-party-verification-explained",
    title: "Third-Party Verification: Why Independence Is the Point",
    topic: "quality-and-testing",
    excerpt:
      "Testing is not the same as verification. What separates them is whether the party producing the number has any stake in what it says.",
    date: "2026-05-09",
    readMinutes: 6,
    image: "/journal/third-party.jpg",
    body: [
      {
        type: "paragraph",
        text: "Every manufacturer tests. In-process testing is how a synthesis is controlled at all — you cannot purify what you have not measured. But in-process testing exists to inform a decision the manufacturer is making, and that is a fundamentally different activity from producing an independent record of what a batch contains.",
      },
      {
        type: "heading",
        text: "What 'third party' has to mean",
      },
      {
        type: "list",
        items: [
          "No ownership relationship between the testing laboratory and the manufacturer.",
          "No commercial dependence that would make an unfavourable result costly to report.",
          "An accreditation — ISO/IEC 17025 is the relevant standard — that subjects the laboratory's own methods to periodic external audit.",
          "A retrievable record: the laboratory can confirm the report independently when asked.",
        ],
      },
      {
        type: "heading",
        text: "Accreditation is not a logo",
      },
      {
        type: "paragraph",
        text: "ISO/IEC 17025 is a competence standard for testing laboratories. It covers method validation, equipment calibration, personnel qualification, and — the part that matters most here — impartiality. An accredited laboratory has to demonstrate that its results are not shaped by who is paying for them. That is the specific assurance the accreditation exists to provide.",
      },
      {
        type: "callout",
        title: "The verification you can perform yourself",
        text: "A report number that the issuing laboratory can look up is the single most useful field on a certificate. It converts the document from an assertion into something checkable by a party with no relationship to either side.",
      },
      {
        type: "heading",
        text: "Why publication changes the incentive",
      },
      {
        type: "paragraph",
        text: "A certificate available on request is disclosed to the people who ask. A certificate published as a matter of course is disclosed to everyone, including anyone inclined to check it against the laboratory's own records. The second arrangement is harder to game, and the difficulty is the point.",
      },
    ],
  },
  {
    slug: "analytical-methods-explained",
    title: "The Instruments Behind a Certificate",
    topic: "laboratory-methods",
    excerpt:
      "HPLC, mass spectrometry, Karl Fischer titration and residual solvent analysis are not interchangeable. Each exists because it answers a question the others cannot.",
    date: "2026-04-22",
    readMinutes: 9,
    featured: true,
    image: "/journal/analytical-methods.jpg",
    body: [
      {
        type: "paragraph",
        text: "A certificate of analysis is the output of several instruments, each answering a narrow question. Read as a set, they describe a batch. Read individually, each is easy to over-interpret. What follows is what each technique measures, and — more usefully — what it cannot.",
      },
      {
        type: "heading",
        text: "High-performance liquid chromatography",
      },
      {
        type: "paragraph",
        text: "HPLC separates a mixture by pushing it through a packed column under pressure. Components partition between the mobile and stationary phases according to their physicochemical properties and emerge at characteristic times. In reversed-phase mode — the standard for peptides — separation is driven by hydrophobicity. The output is a chromatogram, and purity is calculated from relative peak area.",
      },
      {
        type: "list",
        items: [
          "Answers: how homogeneous is this sample?",
          "Cannot answer: what is the principal component?",
          "Common pitfall: co-elution, where two components emerge together and read as one peak.",
        ],
      },
      {
        type: "heading",
        text: "Mass spectrometry",
      },
      {
        type: "paragraph",
        text: "The sample is ionised and the resulting ions separated by mass-to-charge ratio. For peptides, electrospray ionisation produces a series of multiply charged species from which the molecular weight is deconvoluted. A measured mass within a few daltons of the theoretical value is strong evidence of identity; a systematic offset is strong evidence of a specific structural difference.",
      },
      {
        type: "list",
        items: [
          "Answers: what is the molecular weight, and does it match the named compound?",
          "Cannot answer: how much of the sample is that compound.",
          "Common pitfall: reporting a mass without reporting the deviation from theoretical.",
        ],
      },
      {
        type: "heading",
        text: "Karl Fischer titration",
      },
      {
        type: "paragraph",
        text: "A specific chemical determination of water content, and one of the least glamorous entries on a certificate. It matters because lyophilised material is weighed as a mass, and any water in that mass is not compound. A cake with 8% residual moisture delivers 8% less material than the label implies, before any other variance is considered.",
      },
      {
        type: "heading",
        text: "Residual solvent analysis",
      },
      {
        type: "paragraph",
        text: "Synthesis and purification use organic solvents — acetonitrile, trifluoroacetic acid, dimethylformamide among them. Residual solvent analysis, typically by gas chromatography, quantifies what remains. It is a direct read on how carefully the material was worked up, and it is the section most often omitted from thin certificates.",
      },
      {
        type: "callout",
        title: "Reading them together",
        text: "Purity from HPLC, identity from MS, water from KF, and cleanliness from residual solvents. Each covers a blind spot in the others. A certificate reporting only the first has described a quarter of the batch.",
      },
      {
        type: "heading",
        text: "Appearance and solubility",
      },
      {
        type: "paragraph",
        text: "The simplest observations on the document, and the first to catch a gross problem. A cake that has collapsed, discoloured, or fails to go into solution as expected is telling you something no instrument needs to confirm. Where a compound has a characteristic solution colour — the deep blue of a copper complex, for instance — its absence is a result in itself.",
      },
    ],
  },
  {
    slug: "understanding-chromatograms",
    title: "Reading a Chromatogram Without Being Misled",
    topic: "laboratory-methods",
    excerpt:
      "The trace on a certificate contains more information than the percentage derived from it. Baseline, peak shape and what sits at the shoulders all carry meaning.",
    date: "2026-04-03",
    readMinutes: 7,
    image: "/journal/chromatogram.jpg",
    body: [
      {
        type: "paragraph",
        text: "A purity percentage is a summary statistic calculated from a chromatogram. Like most summary statistics it discards information, and some of what it discards is the information you would most want. Where the full trace is published, it is worth spending a minute on it.",
      },
      {
        type: "heading",
        text: "Baseline",
      },
      {
        type: "paragraph",
        text: "A flat, quiet baseline indicates a clean system and a well-prepared sample. Drift — a baseline that climbs or falls across the run — is common in gradient methods and not in itself a problem, but a noisy baseline makes small peaks unresolvable and can inflate an apparent purity by hiding what should have been integrated.",
      },
      {
        type: "heading",
        text: "Peak shape",
      },
      {
        type: "list",
        items: [
          "Symmetrical and narrow — the expected result for a well-behaved compound on a suitable column.",
          "Tailing — often an interaction with the stationary phase; can conceal a closely eluting impurity in the tail.",
          "Fronting — usually column overload; the sample was too concentrated for the method as run.",
          "Shouldered — a strong indication of a co-eluting species that the integration has absorbed into the main peak.",
        ],
      },
      {
        type: "heading",
        text: "Where the impurities sit",
      },
      {
        type: "paragraph",
        text: "Not all impurities are equally interesting. Material eluting far from the principal peak is typically unrelated — solvent, reagent, an artefact of the injection. Material eluting close to the principal peak is the concerning kind, because structural similarity is exactly what produces similar retention. A 99.2% result with everything else clustered at the shoulder deserves more scrutiny than a 98.6% result with impurities scattered across the run.",
      },
      {
        type: "callout",
        title: "The gradient matters",
        text: "Two laboratories can report different purities for the same material simply by running different gradients. A shallower gradient resolves more. This is why method conditions belong on the certificate, and why comparing percentages across laboratories without them is unreliable.",
      },
      {
        type: "heading",
        text: "What the trace cannot tell you",
      },
      {
        type: "paragraph",
        text: "It cannot tell you what the principal peak is. However clean the chromatogram, identity remains a separate question requiring a separate instrument. The trace establishes that there is one dominant substance; the mass spectrum establishes which.",
      },
    ],
  },
  {
    slug: "reconstitution-and-solution-stability",
    title: "Reconstitution and Solution Stability",
    topic: "handling-and-storage",
    excerpt:
      "Lyophilisation removes water to arrest degradation. Reconstitution reverses that protection, and everything that follows is a stability decision.",
    date: "2026-03-28",
    readMinutes: 8,
    featured: true,
    image: "/journal/reconstitution.jpg",
    body: [
      {
        type: "paragraph",
        text: "Freeze-drying is not a packaging convenience. Water is the medium in which hydrolysis, deamidation and oxidation proceed, and removing it slows all three by orders of magnitude. A lyophilised cake at −20 °C is a compound in suspended animation. Adding diluent ends that state deliberately, and every handling decision after it is a decision about how fast the clock now runs.",
      },
      {
        type: "heading",
        text: "Before the seal is broken",
      },
      {
        type: "paragraph",
        text: "Allow the vial to reach ambient temperature first. A vial opened cold draws in atmospheric moisture, which condenses onto a cake specifically engineered to have none. The material has begun degrading before any diluent is introduced, and the damage is invisible.",
      },
      {
        type: "heading",
        text: "Introducing diluent",
      },
      {
        type: "list",
        items: [
          "Direct the stream against the vial wall, not onto the cake. A jet of liquid onto lyophilised material generates local shear and foaming.",
          "Swirl gently; do not shake. Agitation at an air-liquid interface denatures peptides — the foam is the visible symptom of that.",
          "Allow time. A cake that appears not to dissolve often simply has not been given the two or three minutes it needs.",
          "Record the diluent and the volume. Concentration is meaningless without both.",
        ],
      },
      {
        type: "heading",
        text: "Why bacteriostatic water is the usual choice",
      },
      {
        type: "paragraph",
        text: "Bacteriostatic water contains 0.9% benzyl alcohol, which inhibits microbial growth and therefore permits a preparation to be drawn on more than once. Sterile water contains no preservative and is intended for single use. The choice is between a preparation that survives multiple withdrawals and one that does not, and it should be recorded because it affects how long the solution remains valid.",
      },
      {
        type: "callout",
        title: "Freeze-thaw is cumulative",
        text: "Each cycle takes a measurable toll. Where a preparation will be used more than once, aliquot at the moment of reconstitution rather than repeatedly returning the parent vial to the freezer.",
      },
      {
        type: "heading",
        text: "When a solution looks wrong",
      },
      {
        type: "paragraph",
        text: "Cloudiness, visible particulate, or a solution noticeably more viscous than expected are all worth investigating rather than dismissing. Some peptides gel at concentration because of intermolecular association — a physical phenomenon, not necessarily degradation. Others cloud because they have exceeded solubility at the working pH. The distinction matters, and it is usually resolved by checking the concentration against the compound's documented solubility before assuming the material is at fault.",
      },
      {
        type: "heading",
        text: "The interval on the certificate",
      },
      {
        type: "paragraph",
        text: "Reconstituted stability is compound-specific and is stated on the batch certificate. Where several compounds are in solution simultaneously, the shortest interval in the set governs the whole preparation — not the average, and not the longest.",
      },
    ],
  },
  {
    slug: "peptide-stability-and-degradation",
    title: "How Peptides Degrade, and What Slows It Down",
    topic: "handling-and-storage",
    excerpt:
      "Hydrolysis, oxidation, deamidation and aggregation each have a different trigger. Knowing which one a compound is prone to determines how it should be handled.",
    date: "2026-03-11",
    readMinutes: 7,
    image: "/journal/stability.jpg",
    body: [
      {
        type: "paragraph",
        text: "Degradation is not one process. It is four, with different chemistry, different triggers and different countermeasures. Handling advice that treats all peptides identically is handling advice that protects against the average threat and the specific one badly.",
      },
      {
        type: "heading",
        text: "Hydrolysis",
      },
      {
        type: "paragraph",
        text: "Cleavage of the peptide backbone by water. It is accelerated by temperature and by pH excursion in either direction, and it is the reason lyophilised storage exists. Countermeasure: keep water out. Once in solution, keep it cold and keep the pH near neutral unless the compound documents otherwise.",
      },
      {
        type: "heading",
        text: "Oxidation",
      },
      {
        type: "paragraph",
        text: "Methionine, cysteine and tryptophan residues are susceptible to attack by dissolved oxygen, accelerated by light and by trace metal ions. Compounds carrying a metal centre — copper complexes in particular — have an additional and more consequential exposure. Countermeasure: minimise headspace, work in subdued light, avoid contact with reducing agents and chelators.",
      },
      {
        type: "heading",
        text: "Deamidation",
      },
      {
        type: "paragraph",
        text: "Asparagine and glutamine residues convert to their acidic counterparts through a cyclic intermediate. The result is a molecule one dalton heavier with an altered charge state, which frequently shifts retention and can present as a shoulder on a chromatogram. It is strongly pH-dependent and is one of the quiet reasons diluent choice should be recorded.",
      },
      {
        type: "heading",
        text: "Aggregation",
      },
      {
        type: "paragraph",
        text: "Not a chemical change but a physical one: individual molecules associate into higher-order structures. It is driven by concentration, by agitation, and above all by exposure at an air-liquid interface. This is the mechanism behind the standing instruction to swirl rather than shake — foam is aggregation happening where you can see it.",
      },
      {
        type: "callout",
        title: "Reading a compound's handling note",
        text: "When a record specifies subdued light, it is guarding against oxidation. When it specifies minimal headspace, the same. When it warns against freeze-thaw, it is guarding against aggregation. The instruction identifies the threat.",
      },
      {
        type: "heading",
        text: "What temperature actually buys",
      },
      {
        type: "paragraph",
        text: "Reaction rates fall roughly exponentially with temperature. The step from ambient to 2–8 °C is significant; the step from 2–8 °C to −20 °C is larger still. That is the entire argument for cold chain: not that warmth destroys material immediately, but that every degree compresses the window in which a result remains reproducible.",
      },
    ],
  },
  {
    slug: "understanding-concentration-and-dilution",
    title: "Concentration, Volume and the Arithmetic Behind Both",
    topic: "handling-and-storage",
    excerpt:
      "Concentration depends on two numbers, and most preparation errors come from changing one while thinking about the other.",
    date: "2026-02-19",
    readMinutes: 5,
    image: "/journal/dilution.jpg",
    body: [
      {
        type: "paragraph",
        text: "Concentration is quantity divided by volume. Both halves are variables, and a great many preparation errors originate in treating one as fixed. Five milligrams in one millilitre and five milligrams in two millilitres are the same quantity of material at half the concentration, and any calculation downstream that assumed otherwise is wrong by a factor of two.",
      },
      {
        type: "heading",
        text: "The working relationship",
      },
      {
        type: "list",
        items: [
          "Concentration (mg/mL) = quantity (mg) ÷ diluent volume (mL).",
          "Volume required (mL) = target quantity (mg) ÷ concentration (mg/mL).",
          "Doubling the diluent halves the concentration; the quantity in the vial has not changed.",
        ],
      },
      {
        type: "heading",
        text: "Where assayed content enters",
      },
      {
        type: "paragraph",
        text: "The label states nominal strength. The certificate states what the laboratory found. Where the two differ — and they usually do, if only slightly — the assayed figure is the one that belongs in the calculation. This matters most for compounds consumed stoichiometrically rather than acting catalytically, where content variance translates directly into experimental variance.",
      },
      {
        type: "callout",
        title: "Water content compounds the error",
        text: "Karl Fischer results describe how much of the weighed mass is water rather than compound. A cake with meaningful residual moisture delivers less material than the mass suggests, and the effect stacks with any content variance.",
      },
      {
        type: "heading",
        text: "Recording the preparation",
      },
      {
        type: "paragraph",
        text: "A preparation record needs four fields to be reconstructible: batch number, diluent, volume added, and date of reconstitution. Any one missing and the concentration becomes an assumption rather than a measurement — which is a difficult position to be in when a result needs defending months later.",
      },
    ],
  },
  {
    slug: "complementary-mechanisms-in-tissue-repair",
    title: "Complementary Mechanisms in Tissue Repair",
    topic: "compound-profiles",
    excerpt:
      "Vascular supply, cell migration and matrix deposition are sequential stages, not parallel effects. The literature groups repair compounds accordingly.",
    date: "2026-02-04",
    readMinutes: 8,
    image: "/journal/tissue-repair.jpg",
    body: [
      {
        type: "paragraph",
        text: "Soft-tissue repair is often described as though it were a single process with a single rate. It is not. It is a sequence, and the compounds most studied in the field each act at a different point in that sequence — which is why comparative work rarely examines one without reference to the others.",
      },
      {
        type: "heading",
        text: "Stage one: vascular supply",
      },
      {
        type: "paragraph",
        text: "Nothing repairs without perfusion. BPC-157 is characterised in the preclinical literature as acting on the VEGFR2-Akt-eNOS axis, with associated modulation of the nitric oxide system. Work on focal adhesion kinase and paxillin is examined as the basis for the fibroblast behaviour reported in tendon and ligament preparations.",
      },
      {
        type: "heading",
        text: "Stage two: cellular mobilisation",
      },
      {
        type: "paragraph",
        text: "Cells reach the site by migrating, and migration is a cytoskeletal problem. TB-500 corresponds to thymosin beta-4, whose actin-binding domain sequesters monomeric G-actin and shifts the polymerisation equilibrium that governs motility. Downstream literature examines endothelial tube formation and laminin-5 upregulation as consequences.",
      },
      {
        type: "heading",
        text: "Stage three: what gets deposited",
      },
      {
        type: "paragraph",
        text: "Migrated fibroblasts synthesise matrix, and the composition of that matrix determines the mechanical character of the result. GHK-Cu is described as a physiological copper carrier that exchanges Cu(II) with albumin and delivers it to cells, with reported modulation of several hundred genes in fibroblast models — particularly the balance between matrix metalloproteinases and their tissue inhibitors.",
      },
      {
        type: "callout",
        title: "Why the sequence matters experimentally",
        text: "Because the mechanisms are sequential, an effect at a later stage may reflect a change at an earlier one. Study designs that stagger introduction rather than combining from the outset are attempting to resolve exactly that ambiguity.",
      },
      {
        type: "heading",
        text: "The comparative question",
      },
      {
        type: "paragraph",
        text: "The value of examining the three together is not additive potency. It is attribution: knowing which stage a change occurred at. A design that combines all three from the first time point produces a result that is difficult to assign, and the published literature reflects that constraint in how it is structured.",
      },
    ],
  },
  {
    slug: "incretin-receptor-pharmacology",
    title: "From Single to Triple: Incretin Receptor Architecture",
    topic: "compound-profiles",
    excerpt:
      "The progression from GLP-1 mono-agonism through dual and triple receptor engagement is one of the clearest structure-activity narratives in current metabolic research.",
    date: "2026-01-21",
    readMinutes: 9,
    image: "/journal/incretin.jpg",
    body: [
      {
        type: "paragraph",
        text: "Few areas of peptide chemistry offer as legible a progression as the incretin field. Three generations of molecule, each adding a receptor to the previous architecture, with the pharmacological consequence of each addition documented as it happened. Read in order, the sequence is close to a controlled experiment.",
      },
      {
        type: "heading",
        text: "Single: GLP-1 receptor agonism",
      },
      {
        type: "paragraph",
        text: "Semaglutide is characterised as a selective agonist at the GLP-1 receptor, a class B G-protein coupled receptor expressed across pancreatic, gastric and central nervous tissue. Engagement couples to Gαs and raises intracellular cyclic AMP, with downstream protein kinase A activity examined in relation to glucose-dependent insulin secretion. The C18 diacid side chain provides albumin binding and the extended circulating profile.",
      },
      {
        type: "heading",
        text: "Dual: adding the GIP receptor",
      },
      {
        type: "paragraph",
        text: "Tirzepatide engages both GIPR and GLP-1R from a single thirty-nine residue backbone, and the literature describes it as an imbalanced agonist — relatively more potent at GIPR. That imbalance is itself the subject of study: published work examines how concurrent GIP engagement alters β-arrestin recruitment and receptor internalisation relative to a GLP-1 mono-agonist, producing a signalling pattern that is not the sum of the two acting separately.",
      },
      {
        type: "heading",
        text: "Triple: adding glucagon",
      },
      {
        type: "paragraph",
        text: "Retatrutide extends the architecture to GCGR. The glucagon arm is mechanistically distinct from the incretin arms: rather than acting principally on insulin secretion and appetite pathways, it is examined for hepatic effects on lipid handling and for a contribution to energy expenditure. This is the addition that changes the character of the pharmacology rather than its magnitude.",
      },
      {
        type: "callout",
        title: "Why the progression is useful",
        text: "Holding the experimental model constant while stepping through single, dual and triple architecture isolates the contribution of each receptor. Few structure-activity questions in peptide research are this cleanly separable.",
      },
      {
        type: "heading",
        text: "What the comparison does not settle",
      },
      {
        type: "paragraph",
        text: "Receptor count is not a proxy for anything on its own. An imbalanced dual agonist and a balanced one behave differently; a triple agonist with weak activity at its third receptor behaves like a dual. The published designs that matter are the ones that report relative potency at each receptor rather than simply enumerating them.",
      },
    ],
  },
  {
    slug: "mitochondrial-derived-peptides",
    title: "Mitochondrial-Derived Peptides and the Retrograde Signal",
    topic: "compound-profiles",
    excerpt:
      "A small class of peptides encoded in the mitochondrial genome appears to carry information from the organelle back to the nucleus.",
    date: "2026-01-08",
    readMinutes: 7,
    image: "/journal/mitochondria.jpg",
    body: [
      {
        type: "paragraph",
        text: "For most of the twentieth century the mitochondrial genome was understood as a small, functionally narrow remnant encoding components of the respiratory chain. The identification of open reading frames producing short bioactive peptides changed that picture, and MOTS-c is the most extensively characterised of them.",
      },
      {
        type: "heading",
        text: "Encoded where you would not expect",
      },
      {
        type: "paragraph",
        text: "MOTS-c is a sixteen amino acid peptide encoded within the mitochondrial 12S ribosomal RNA gene — a sequence whose primary function is structural. That a coding sequence should be nested inside a structural RNA gene is unusual enough that the finding took time to be accepted, and it remains one of the more striking results in the field.",
      },
      {
        type: "heading",
        text: "The proposed mechanism",
      },
      {
        type: "paragraph",
        text: "Published work describes MOTS-c as inhibiting the folate cycle, causing AICAR to accumulate, which in turn activates AMP-activated protein kinase — the cell's principal energy sensor. Under metabolic stress the peptide is reported to translocate to the nucleus and associate with stress-response transcription factors, which is the observation that positions it as a signal between the two genomes rather than simply a metabolic effector.",
      },
      {
        type: "quote",
        text: "The interesting claim is not that a mitochondrial peptide affects metabolism. It is that the mitochondrion appears to be reporting its own state to the nucleus in a language the nucleus reads.",
      },
      {
        type: "heading",
        text: "Distinguishing signal from substrate",
      },
      {
        type: "paragraph",
        text: "This is why MOTS-c and NAD+ are frequently studied together and frequently confused. NAD+ is a substrate — consumed stoichiometrically by sirtuins, PARPs and CD38, with the free pool set by the balance of synthesis and consumption. MOTS-c is a signal. Measured only downstream, substrate limitation and signalling change can look identical, and separating them is the reason the two appear in the same experimental designs.",
      },
      {
        type: "heading",
        text: "What remains open",
      },
      {
        type: "paragraph",
        text: "The receptor question, principally. The mechanism by which an intracellularly generated peptide exerts effects consistent with extracellular signalling is not fully resolved, and the literature is candid about it. This is an active area rather than a settled one, and results should be read accordingly.",
      },
    ],
  },
  {
    slug: "the-somatotropic-axis",
    title: "Two Doors Into the Somatotropic Axis",
    topic: "compound-profiles",
    excerpt:
      "GHRH receptor agonism and GHS-R1a agonism are separate routes to the same axis, acting through different G-protein pathways.",
    date: "2025-12-12",
    readMinutes: 7,
    image: "/journal/somatotropic.jpg",
    body: [
      {
        type: "paragraph",
        text: "The somatotropic axis is pulsatile, and that single fact structures most of the research around it. A system that operates in bursts cannot be characterised by a single measurement, and compounds acting on it are described in terms of pulse amplitude and frequency rather than a steady level.",
      },
      {
        type: "heading",
        text: "The first door: GHRH receptor",
      },
      {
        type: "paragraph",
        text: "CJC-1295 is a synthetic analogue of growth hormone-releasing hormone modified at four positions to resist enzymatic cleavage — principally by dipeptidyl peptidase-4, which rapidly inactivates the native hormone. It engages the GHRH receptor on somatotrophs, raising cyclic AMP through Gαs and increasing the amplitude of secretory pulses.",
      },
      {
        type: "heading",
        text: "The second door: GHS-R1a",
      },
      {
        type: "paragraph",
        text: "Ipamorelin is a selective pentapeptide agonist at the growth hormone secretagogue receptor, acting through a Gq-coupled route and therefore a different intracellular cascade. Its significance in the literature is as much about what it does not do: earlier secretagogues carried cortisol and prolactin cross-reactivity that confounded interpretation, and Ipamorelin's selectivity was the advance that made clean characterisation possible.",
      },
      {
        type: "callout",
        title: "Additive, not redundant",
        text: "Because the two routes use different receptors and different G-protein coupling, the literature treats their inputs as additive. Supplying both allows that assumption to be tested rather than inherited.",
      },
      {
        type: "heading",
        text: "Why sampling schedules dominate the design",
      },
      {
        type: "paragraph",
        text: "In a pulsatile system a single time point can miss the effect entirely — or catch a trough and report it as a null result. Published designs allocate substantially more attention to sampling schedule than is typical for receptor-level work, and results from studies that do not report their schedule are difficult to interpret.",
      },
      {
        type: "heading",
        text: "The asymmetry to account for",
      },
      {
        type: "paragraph",
        text: "The two components have markedly different reported clearance — roughly thirty minutes for CJC-1295 without DAC against approximately two hours for Ipamorelin. Treating the pair as a single agent with one time course discards that difference, and with it much of what makes the combination worth studying.",
      },
    ],
  },
  {
    slug: "regulatory-neuropeptides",
    title: "Regulatory Neuropeptides and the Proline-Glycine-Proline Motif",
    topic: "compound-profiles",
    excerpt:
      "Semax and Selank share a stabilising extension and almost nothing else. That combination makes them unusually useful as controls for one another.",
    date: "2025-11-26",
    readMinutes: 6,
    image: "/journal/neuropeptides.jpg",
    body: [
      {
        type: "paragraph",
        text: "Short peptides have a chronic problem: they are cleared quickly. The Russian regulatory-peptide series addressed it with a specific structural solution — a proline-glycine-proline extension appended to a biologically active core — and two members of that series, Semax and Selank, have become the most documented examples.",
      },
      {
        type: "heading",
        text: "What the extension does",
      },
      {
        type: "paragraph",
        text: "The PGP motif confers resistance to peptidase cleavage, extending the window over which the active core remains available. It is a pharmacokinetic modification rather than a pharmacodynamic one: it does not alter what the core does, only how long it persists to do it.",
      },
      {
        type: "heading",
        text: "Two different cores",
      },
      {
        type: "list",
        items: [
          "Semax derives from ACTH(4-10) and is characterised as raising BDNF and NGF transcript levels in hippocampal and cortical preparations — without the adrenocorticotropic activity of the parent fragment.",
          "Selank derives from tuftsin, an immunomodulatory tetrapeptide, and is examined for inhibition of enkephalin-degrading enzymes alongside changes in GABAergic and serotonergic gene expression.",
        ],
      },
      {
        type: "heading",
        text: "Why the pairing is methodologically useful",
      },
      {
        type: "paragraph",
        text: "Two compounds sharing a stability architecture but not a mechanism are close to an ideal control pair. Where a difference appears between them, pharmacokinetics is largely excluded as the explanation, because the property governing clearance is common to both. That is a rare position to be in.",
      },
      {
        type: "callout",
        title: "The identity caveat",
        text: "Sharing a structural motif also means a purity result alone does not establish which peptide is in the vial. Mass confirmation is not optional for this pair — it is the only thing separating them analytically.",
      },
      {
        type: "heading",
        text: "How the literature handles overlap",
      },
      {
        type: "paragraph",
        text: "Both compounds touch serotonergic signalling, and published designs commonly run separate arms before any combined arm so that overlapping effects can be attributed correctly. A combined-only design produces a result that neither compound can claim.",
      },
    ],
  },
];

export const articleBySlug = new Map(articles.map((a) => [a.slug, a]));
export const topicBySlug = new Map(journalTopics.map((t) => [t.slug, t]));

export function getArticle(slug: string) {
  return articleBySlug.get(slug);
}

/** Newest first — the order the Journal index presents. */
export const articlesByDate = [...articles].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export const featuredArticles = articlesByDate.filter((a) => a.featured);

export function articlesByTopic(topic: string) {
  return articlesByDate.filter((a) => a.topic === topic);
}

/** Resolve journal slugs referenced from a stack or product record. */
export function resolveArticles(slugs: string[]) {
  return slugs
    .map((slug) => articleBySlug.get(slug))
    .filter((a): a is Article => Boolean(a));
}

/** Same topic first, then most recent — used beneath an article. */
export function relatedArticles(article: Article, limit = 3) {
  const sameTopic = articlesByDate.filter(
    (a) => a.slug !== article.slug && a.topic === article.topic,
  );
  const rest = articlesByDate.filter(
    (a) => a.slug !== article.slug && a.topic !== article.topic,
  );
  return [...sameTopic, ...rest].slice(0, limit);
}
