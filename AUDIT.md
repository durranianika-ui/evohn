# EVOHN — pre-redesign audit

Recorded at the head of branch `redesign/evohn-roehn-experience-reviva-navigation`,
against commit `3201a22` on `main`.

## 1. Architecture as found

| Concern | Finding |
| --- | --- |
| Framework | Next.js 16.2.12, React 19.2.4, **App Router** |
| Language | TypeScript 5, `strict: true` |
| Styling | Tailwind CSS v4 (`@theme` tokens in `app/globals.css`), no config file |
| Animation | `framer-motion` 12.43, `lenis` 1.3.25 (smooth scroll) |
| Forms | `react-hook-form` 7.83 |
| Icons | `lucide-react` 1.28 |
| Content | Static TypeScript modules under `data/` — no CMS, no database |
| Commerce | **None by design.** No cart, no pricing, no checkout, no auth. Every CTA resolves to a WhatsApp deep link (`lib/whatsapp.ts`) |
| Images | 12 product JPEGs + 3 editorial JPEGs in `public/`; `lib/media.ts` checks the filesystem at build time and falls back to vector plates |
| Fonts | `next/font/google` — Cormorant Garamond (display), Inter (sans), with `Helvetica Neue` preferred ahead of Inter in the token stack |
| Deployment | Static export to GitHub Pages (`GITHUB_PAGES=true`, basePath `/evohn`); `gh-pages` branch |
| Tests | **None.** No test runner, no test files, no CI |

## 2. Baseline verification (before any change)

| Check | Command | Result |
| --- | --- | --- |
| Install | `npm install` | already installed, lockfile clean |
| Types | `npx tsc --noEmit` | pass, 0 errors |
| Lint | `npx eslint` | pass, 0 problems |
| Tests | — | none exist |
| Build | `npm run build` | pass, 80 static pages |

## 3. Route inventory as found

```
/                       /catalogue            /catalogue/[slug]
/about                  /blog                 /calculator
/contact                /contact/business     /contact/wholesale
/faq                    /journal              /journal/[slug]
/lab-results            /lab-results/[slug]   /legal
/peptide-pedia          /quality              /reconstitution
/research               /reviews              /stacks
/stacks/[slug]          /storage              /strips
```

## 4. Gap list

### 4.1 Routing — specified address vs. address as built

| Specified | As found | Action |
| --- | --- | --- |
| `/science` | `/research` | rename; rebuild as the Science hub the dropdown points at |
| `/products/[slug]` | `/catalogue/[slug]` | move product detail to `/products/[slug]` |
| `/reconstitution-guide` | `/reconstitution` | rename |
| `/storage-handling` | `/storage` | rename |
| `/wholesale` | `/contact/wholesale` | promote to top level |
| `/business-accounts` | `/contact/business` | promote to top level |
| `/terms` … `/research-disclaimer` (8 routes) | one combined `/legal` | split into eight addressable documents |
| `/search` | — | build |
| `/journal` (single index) | `/journal` **and** `/blog` | `/blog` is a second index over the same articles — fold into `/journal` |

`data/science.ts` exports `sciencePillars` whose `href` values point at
`/science/manufacturing`, `/science/purity-and-identity` and
`/science/analytical-methods`. None of those routes exist. The export is
currently unreferenced, so nothing renders a broken link today — but the data
is dead and the addresses are wrong.

### 4.2 Navigation — Reviva parity

- Primary nav carries **eleven** top-level items (Catalogue, Stacks, Strips,
  Science, Journal, Lab Results, Reviews, Research, Blog, About, Contact).
  The specification calls for **seven**: Catalogue, Science, Journal, Lab
  Results, Reviews, About, Contact.
- No search control.
- No cart / enquiry control with a live item count.
- No utility menu control, so demoting Stacks / Strips / Quality / FAQ out of
  the primary bar currently has nowhere to put them on desktop.
- Science dropdown order is Peptide Pedia → Calculator → Guides; the
  specification orders it Calculator → Peptide Pedia → Reconstitution →
  Storage, and asks for an index number on each row.
- Dropdowns close on `Escape` and on route change, have `aria-expanded` /
  `aria-haspopup`, and use a 140 ms close grace — all correct and kept.

### 4.3 Homepage — ROEHN sequencing

Built: Hero → Philosophy → Pillars → Domains → Collection → Stacks →
Verification → Editorial → Standard → CTA.

Missing against the specified sequence: age-verification layer (01), trust
marquee (03), lab-results preview (10), research-resources panel (11),
journal preview (12), reviews / trust section (13).

### 4.4 Features absent entirely

- **Custom cursor** (§8) — nothing. The only `cursor` reference in the tree is
  a Tailwind class.
- **Age verification / research-use gate** (§17) — nothing.
- **Search** (§6) — nothing.
- **Enquiry list with live count** (§5) — nothing. Note the business has no
  ecommerce, so the honest analogue of a cart is a persisted enquiry list that
  composes a WhatsApp message, not a checkout.

### 4.5 Calculator (§9)

- Modes: **Reconstitute** and **Mix** only. **Blend is missing.**
- Mix is two fixed vials and a shared volume — the specification asks for
  addable/removable rows, per-row concentration and contribution, unit
  validation and a full breakdown.
- Syringes: 30u / 50u / 100u / 1 mL. **3 mL missing.**
- Arithmetic lives inside `useMemo` closures — not extractable, not testable.
- No working-formula display.
- Legal notice is a single 12-word line.

### 4.6 Design tokens (§3)

Colour, type ramp, spacing, container widths and two easing curves are already
centralised in `@theme` and map to the brand kit. **Missing tokens:** radius,
shadow, border width, z-index, breakpoint and named animation durations.

### 4.7 Testing (§25)

No runner, no unit tests, no component tests, no end-to-end coverage, no link
checking.

## 5. Preserved without change

The WhatsApp CTA layer, the `data/`-driven content model, `lib/media.ts`
build-time asset resolution, the static-export configuration and the GitHub
Pages base-path handling are all working and are carried through the redesign
untouched. No working integration is replaced with a mock.

## 6. Items flagged for the brand owner

Pre-existing placeholders inherited from `main`, unchanged by this work and
still requiring real values before launch:

- `site.whatsapp` is `+971XXXXXXXXX`.
- `data/lab-results.ts` batch records are illustrative.
- `data/reviews.ts` testimonials are illustrative.

The brand-identity board referenced in the brief is **not present** in the
repository or in any project asset directory. The colour and type tokens in
`app/globals.css` were derived from it in an earlier session and are carried
forward as the source of truth; they have not been re-verified against the
board in this pass.
