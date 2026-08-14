# Science Overview — proposed revision

**STATUS: NOT PUBLISHED — AWAITING APPROVAL**

Nothing in this document is live. `/science` on the branch renders the
existing page, unchanged except for one factual correction forced by the
catalogue rebuild (see "Correction already applied" below). This file sits in
`drafts/`, outside `app/`, so it is not a route, not in the sitemap, not linked
from anywhere, and not included in the static export. Approving it means
applying the changes described here; until then the live page stands.

---

## 1. What the page does today

`/science` runs: hero → four positions (dark) → four research tools → a single
grid mixing research domains with Stacks and Lab Results → enquiry CTA.

It is already restrained where it matters most. There are no efficacy claims,
no therapeutic language, and the research-use position is stated in the hero.
That is the hard part and it is right. The problems below are accuracy,
hierarchy and one significant omission — not compliance failures.

---

## 2. Audit findings

### 2.1 Accuracy

**A. The page calls itself "The standard" and does not show the standard.**
`data/science.ts` exports `specification` — the six release criteria (purity
≥ 99.0%, identity conforms, assayed content 95.0–110.0%, water ≤ 8.0%,
residual solvents to USP <467>, batch-level traceability). Its own doc comment
says "The specification table shown on the Science hub". It is not shown on the
Science hub. It renders on `/lab-results`.

This is the single largest issue. The page argues that quality is written down
before a batch exists, and then does not print the thing that is written down.
The reader is asked to take the argument on trust on the one page that exists
to say trust is not the mechanism.

**B. "Mean purity" as a headline figure.** The hero meta shows
`labSummary.meanPurity` as a top-line statistic. After the catalogue rebuild
there are nine published batches covering seven of the twelve entries. A mean
across a partial set, presented without that qualification, is the kind of
number that reads as a property of the range rather than of the batches
published so far.

**C. The analytical claim now covers a diluent.** The hero reads "verified by
HPLC with identity confirmed by mass spectrometry". Bacteriostatic Water is now
in the catalogue and is not a peptide; its certificate reports sterile and
non-pyrogenic, not an HPLC purity figure. *(Corrected on the branch — see §5.)*

**D. Rhetorical precision in pillar 03.** "a certificate reporting only the
first has described a quarter of the batch." One of four instruments is not one
quarter of the information; the figure is rhetorical but reads as quantitative,
on a page whose whole argument is that numbers mean what they say.

### 2.2 Hierarchy and order

**E. A whole section with no visible heading.** The domain grid's heading is
`sr-only`. A sighted reader meets nine cards with no statement of what they
are.

**F. Two different things in one list.** Research Stacks and Lab Results are
rendered as cards in the same `<ul>` as the research domains, differing only by
a background tint. They are not domains. In the current markup they are
indistinguishable in structure from Neuro or Longevity.

**G. The argument does not land before the directory.** Positions → tools →
domains means the page states four principles and then immediately becomes
navigation. The evidence for the principles never appears.

### 2.3 Repetition

**H.** The domain grid reproduces every `category.description` in full. The
same nine descriptions, in the same words, are on `/catalogue`'s domain rail.
The Science page should say what a domain *is* and let the catalogue enumerate.

### 2.4 Claims and compliance

Reviewed and found acceptable, with no change proposed:

- "supplied for laboratory research only" — correct and prominent.
- "None of them recommends a quantity, a schedule or a compound" — precisely
  the right disclaimer for the tools section, and better than a legal footer.
- "Verification by a party with nothing to gain" — describes a commercial
  arrangement, not an outcome. Defensible.
- "A batch that misses the specification is not re-graded — it is rejected."
  A policy statement about EVOHN's own process. Keep.

Nothing on this page requires removal on compliance grounds.

### 2.5 Content that should not be public

None found. The page carries no internal process detail, no supplier identity,
no commercial term.

---

## 3. Proposed section order

| # | Section | Change |
|---|---------|--------|
| 1 | Hero | Revised copy and meta (§4.1) |
| 2 | The four positions | Pillar 03 reworded (§4.2) |
| 3 | **The release specification** | **New** — the table from `data/science.ts` |
| 4 | Research tools | Unchanged |
| 5 | Research domains | Visible heading, condensed cards (§4.3) |
| 6 | Where to read further | Stacks and Lab Results, separated out (§4.4) |
| 7 | Enquiry CTA | Unchanged |

The move is small and it is the whole point: **assert, then substantiate, then
navigate.** The specification table goes directly beneath the positions it
evidences, so the reader meets the claim and the proof in that order, and only
then is offered somewhere to go.

---

## 4. Proposed copy

### 4.1 Hero

Title: unchanged — `The\nstandard`

Body:

> Four positions govern every batch EVOHN releases, and the specification they
> produce is published below in full. Beneath them sit four research tools and
> a reference library of {products.length} entries across
> {compoundCategories.length} research domains, supplied for laboratory
> research only.

Meta rows:

| Label | Value |
|---|---|
| Research domains | `compoundCategories.length` |
| Catalogue entries | `products.length` |
| Release criteria | `specification.length` |
| Certificates published | `labSummary.certificates` |

Replacing "Mean purity" with "Certificates published" removes finding B: a
count of published certificates is a fact about what EVOHN has done, and a
mean purity is a claim about material. The count is also the more persuasive
number, because it is checkable.

"Research domains" counts `compoundCategories` — the domains that hold a
compound — so Preparation is not presented as an area of research. The
constant already exists in `data/categories.ts`.

### 4.2 Pillar 03 body

> Chromatography for homogeneity, mass spectrometry for identity, Karl Fischer
> for water, gas chromatography for residual solvents. Each covers a blind spot
> in the others. A certificate reporting purity alone has answered one of those
> four questions and left the rest open — which is not the same as a batch
> having passed.

Removes the invented fraction and keeps the point, which is stronger stated
plainly.

### 4.3 Research domains section

Add a visible heading and standfirst:

> ## Research domains
>
> The catalogue is organised by mechanism rather than by outcome. A domain
> groups compounds that act on the same system, so that comparative work has
> somewhere to start.

Cards drop `category.description` and keep name, count and `category.tagline`.
The full description stays on `/catalogue`, which is where the reader is going
anyway. Fixes findings E and H.

### 4.4 "Where to read further"

Stacks and Lab Results move into their own two-column block beneath the domain
grid, under:

> ## Where to read further

Fixes finding F: they stop being rendered as though they were domains.

---

## 5. Correction already applied to the live page

One change is on the branch rather than in this proposal, because the catalogue
rebuild caused it and leaving it would have shipped a false statement:

The hero asserted HPLC purity and MS identity across the whole library. Adding
Bacteriostatic Water — a diluent, certified sterile and non-pyrogenic rather
than assayed for peptide purity — made that untrue. The sentence now attributes
the analytical claim to the compounds rather than to every entry.

This is a factual correction to existing copy, not part of the rework. If it
should also have waited for approval, revert that one hunk in
`app/science/page.tsx`; the rest of the branch does not depend on it.

---

## 6. Implementation notes

Approving this means:

1. `app/science/page.tsx`
   - hero body and `meta` array (§4.1)
   - new specification section between the positions and the tools, rendering
     `specification` from `@/data/science` through `components/common/DataTable`
     — the same component `/lab-results` already uses, so no new markup
   - visible `<h2>` and standfirst on the domain grid; drop the `sr-only`
   - domain cards lose `category.description`
   - `FORMATS` moves out of the domain `<ul>` into its own section
   - import `compoundCategories` instead of `categories` for the count
2. `data/science.ts`
   - pillar 03 body (§4.2)
   - correct the `specification` doc comment, which claims it renders on the
     Science hub — after this change it will be true in both places
3. `tests/e2e/site-qa.spec.ts` needs no change; `/science` is already covered.

No new dependency, no new component, no data migration. The specification
section reuses `DataTable`, and every figure on the page stays derived from
`data/` rather than typed into the markup.

---

## 7. What is deliberately not changed

- The dark treatment of the positions section. It is the page's strongest
  visual moment and the reason the argument reads as an argument.
- The tools section, including its disclaimer. Both are correct.
- The enquiry CTA copy, which invites a study-design conversation without
  offering advice.
- The research-use-only framing, which is already where it should be.

The brief asked for restraint and evidence-awareness. Most of this page already
has both; the revision is mainly about showing the specification it keeps
referring to, and about not letting a directory outrank the argument.
