# EVOHN

A premium research-compound catalogue. Next.js 16 (App Router), TypeScript,
Tailwind v4, Framer Motion, Lenis.

## Setup

Node 20 or later.

```bash
npm install
```

There are **no required environment variables**. Two optional ones change how
URLs are emitted:

| Variable | Default | Effect |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://evohn.com` | Origin used for canonicals, the sitemap and JSON-LD |
| `GITHUB_PAGES` | unset | `true` switches the build to a static export |
| `PAGES_BASE_PATH` | `/evohn` | Sub-path the export is served from; set empty for a root deploy |

No secret is read anywhere in this codebase, and none is committed. The site
has no server, no database, no authentication and no third-party analytics.

## Commands

```bash
npm run dev        # dev server
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run test       # vitest, unit + component
npm run build      # production build
npm run verify     # all four, in order
```

Static export, plus the two checks that run against it:

```bash
GITHUB_PAGES=true PAGES_BASE_PATH= npm run build
npm run test:e2e                      # link and integrity check over out/
node scripts/audit-viewports.mjs      # markup-level a11y and responsive sweep
```

## Testing

Two Vitest projects, configured in `vitest.config.mts`:

- **unit** — Node, no DOM. `tests/unit/`. Calculator arithmetic, the search
  index, catalogue filtering and sorting, and the information architecture
  (the primary bar holds exactly seven items; the Science dropdown holds
  exactly the four specified tools; every navigation and footer link resolves
  to a route registered in `data/routes.ts`).
- **dom** — jsdom and Testing Library. `tests/dom/`. Calculator interaction
  and labelling, header dropdown and overlays, mobile drawer, age gate, and
  the enquiry store including corrupt-record and cross-tab behaviour.

`tests/setup.ts` stubs `matchMedia`, `IntersectionObserver` and
`ResizeObserver`, which jsdom does not implement. `matchMedia` defaults to
*not* matching, i.e. a coarse pointer with no reduced-motion preference.

**End to end.** The deployable artefact is a directory of HTML — no server, no
session, no database — so `scripts/check-export.mjs` asserts against that
directory rather than driving a browser over a mock of it. It resolves every
internal href against files that were actually built and fails on dead
anchors, missing metadata, missing or duplicate `h1`s, images without alt,
routes the registry declares but the build did not emit, sitemap entries for
noindex routes, and any surviving reference-site brand or inherited analytics
identifier.

---

## Information architecture

Seven top-level destinations, plus a utility index. The whole structure is
declared in `data/site.ts` and every static address in `data/routes.ts` —
restructuring the site is a data edit, and the navigation test suite fails if a
menu link points at an address the registry does not hold.

### Primary bar

| Item | Route | Notes |
| --- | --- | --- |
| Catalogue | `/catalogue` | Search, domain filters, sort — all URL-persisted |
| Science | dropdown | The only dropdown. Four research tools, numbered |
| Journal | `/journal` | |
| Lab Results | `/lab-results` | |
| Reviews | `/reviews` | |
| About | `/about` | |
| Contact | `/contact` | |

Utility controls at the right: **Search** (a sheet, handing off to `/search`),
**Enquiry list** with a live count, and **Menu** — the full site index, which is
where Stacks, Strips, Quality and FAQ live now that the primary bar is seven
items rather than eleven.

### Every route

```
/                       /catalogue              /products/[slug]
/science                /calculator             /peptide-pedia
/reconstitution-guide   /storage-handling       /quality
/lab-results            /lab-results/[slug]     /journal
/journal/[slug]         /reviews                /about
/faq                    /contact                /wholesale
/business-accounts      /stacks                 /stacks/[slug]
/strips                 /search                 /enquiry
/legal                  /terms                  /privacy
/shipping               /returns                /platform-use
/age-verification       /research-use-only      /research-disclaimer
```

`/search` and `/enquiry` are `noindex` and excluded from both the sitemap and
`robots.txt`: one renders a query the visitor typed, the other renders their own
local selection.

## The enquiry list

There is no cart, because there is no checkout — see the next section. What the
visitor gets instead is the thing a cart is *for*: a persisted selection that
survives moving between pages and composes **one** enquiry rather than six.

- `lib/enquiry.tsx` — the provider and the hook.
- `lib/local-store.ts` — a `useSyncExternalStore` adapter over `localStorage`.
  Reading storage in an effect renders once with a guess and again with the
  truth; subscribing to it as an external store does not. It also keeps a
  second tab honest, and degrades to memory-only when a write fails in private
  browsing rather than silently reverting what the visitor just did.
- Nothing is transmitted. The list leaves the browser only when the visitor
  presses send, and only as the message they can read in full on `/enquiry`
  first.

The same adapter backs the entrance notice, whose acknowledgement expires after
30 days so a declaration made a year ago is not treated as one made today.

## The calculator

`lib/calculator.ts` holds every number the tool produces. It is pure and total:
same inputs, same output, no clock, no randomness, no I/O, and no throw. The
React layer in `components/science/` owns strings, focus and layout only —
which is what makes the arithmetic testable without a DOM.

### Modes and formulas

All three normalise to milligrams and millilitres internally, then convert back
for display, so a microgram target against a milligram vial gives the same
answer as the equivalent milligram target.

**Reconstitute** — a lyophilised vial and a volume of diluent.

```
concentration      = vial quantity ÷ diluent volume            (mg/mL)
volume to draw     = target quantity ÷ concentration           (mL)
insulin units      = volume to draw × 100                      (U-100)
whole withdrawals  = ⌊ vial quantity ÷ target quantity ⌋
days covered       = ⌊ withdrawals ÷ per week × 7 ⌋            (optional)
```

**Mix** — several vials already in solution, drawn into one container.

```
total volume       = Σ volume drawn
mass from vial i   = concentration_i × volume drawn_i
final conc. of i   = mass_i ÷ total volume
mass fraction of i = mass_i ÷ Σ mass
```

**Blend** — one vial holding several compounds in a fixed ratio.

```
share of i         = ratio_i ÷ Σ ratio          (any scale; 2:1 = 20:10 = 0.2:0.1)
mass of i          = total vial quantity × share_i
concentration of i = mass_i ÷ diluent volume
volume to draw     = target quantity of the chosen component ÷ its concentration
mass of i in draw  = concentration_i × volume to draw
```

The last line is the point of the mode: the components share one vial and one
draw, so fixing the quantity of one fixes the quantity of every other. The
result panel states that explicitly rather than leaving it to be inferred.

### Syringes

`30u`, `50u`, `100u`, `1 mL`, `3 mL`. The three insulin barrels are graduated
at 100 marks to the millilitre irrespective of capacity, so a 30-unit barrel
holds 0.3 mL. The two volumetric barrels are read in millilitres and carry no
unit graduation — `maxUnits` is `null` for those, and the barrel diagram
switches its scale accordingly.

### Failure model

Nothing throws. A calculation that cannot be performed returns
`{ ok: false, errors }` with **every** problem listed at once, so the interface
shows all of them rather than revealing them one at a time. Conditions that are
computable but worth flagging — more diluent than the vial holds, a draw that
overruns the chosen barrel, a draw below the readable graduation, a target
larger than the vial contains — come back as `warnings` on a successful result,
because the arithmetic is still correct.

`parseField` maps an empty or malformed field to `NaN`, never to `0`. Zero
would be a division by zero one step later.

Rounding is applied once, at the end, to values about to be displayed — never
between steps, where it would compound — and nudges past binary representation
error so `1.005` at two places gives `1.01` rather than `1.00`. Displayed
precision follows magnitude: a 0.004 mL draw shows four decimals, a 2.5 mL draw
shows two.

### What it will not do

It converts between quantity, volume and concentration. It does not select a
quantity, propose a schedule, judge whether a value is sensible, or know
anything about biology. A frequency, where one is given, is used for exactly
one thing: dividing whole withdrawals into days. The position is stated on the
page itself and in full at `/platform-use`.

---

## What this is — and is not

A **presentation catalogue**. There is deliberately no cart, checkout, pricing,
stock, account, quantity selector or payment path anywhere in the codebase.
Every commercial action resolves to a WhatsApp conversation.

The product data shape has no `price` or `availability` field, and the
`schema.org/Product` JSON-LD is emitted **without an `offers` node** — claiming
an offer without a price would be both untrue and a structured-data violation.

---

## Brand

All colour and typography derives from the EVOHN Brand Identity Kit. Tokens
live in one place: the `@theme` block at the top of `app/globals.css`.

### Colour

Core values are the kit's, verbatim (§02 "CORE COLORS"):

| Token | Value | Kit name |
| --- | --- | --- |
| `--color-carbon` | `#111111` | Matte Black |
| `--color-soft` | `#F6F5F2` | Soft White |
| `--color-warm` | `#D6D2CC` | Warm Grey |

Every other neutral (`--color-ink`, `--color-onyx`, `--color-graphite`,
`--color-mist`, `--color-stone`, `--color-ash`) is a shade or tint of one of
those three. No hue exists in this project that is not in the kit.

The eight category colours (§02 "PRODUCT COLORS" / §05) were sampled from the
kit artwork and corrected for its photographic cast, since the kit prints hex
values only for the core three.

### Typography

The kit specifies **Canela Regular** (primary) and **Helvetica Neue**
(secondary).

- Canela is licensed by Commercial Type and cannot be served from a public font
  CDN. **Cormorant Garamond** stands in — a high-contrast display serif with
  comparable proportions at the light weights used here.
- Helvetica Neue is preferred where the visitor's OS provides it; **Inter**
  is the fallback.

**To switch to licensed Canela:** drop the woff2 files into `app/fonts`, swap
the `Cormorant_Garamond` call in `app/layout.tsx` for `next/font/local`, and
keep the CSS variable name `--font-cormorant`. Nothing else changes.

### Two places the kit is ambiguous

Both resolved deliberately — flagging them so they can be overruled:

1. **TB-500 vs TB-600.** The kit's product strip labels this vial `TB-600`;
   `TB-500` is the standard designation for the thymosin β4 fragment. The
   catalogue uses **TB-500** (`data/products.ts`).
2. **Ivory and Sand sample identically** in the kit's swatch row, but the
   NAD+ and CJC-1295 vial labels clearly differ. Ivory is set as the lighter
   warm off-white (`#E5E2DE`, from the NAD+ label) and Sand as the warm tan
   (`#D6C8B4`), per the labels rather than the swatch row.

Additionally, the kit assigns **Retatrutide to Performance**; the catalogue
follows the kit even though the compound would sit naturally under Weight Loss.
One line in `data/products.ts` changes it.

---

## WhatsApp

The number is a placeholder in **one place** — `data/site.ts`:

```ts
whatsapp: "+971XXXXXXXXX",
```

Replace it and every CTA on the site updates. Formatting is irrelevant;
non-digits are stripped when the `wa.me` link is built.

While the placeholder is in place, `whatsappConfigured` is false and every CTA
— including the enquiry form on `/contact` — falls back to a pre-composed
`mailto:` rather than emitting a `wa.me` link that resolves to nothing.

`lib/whatsapp.ts` owns the message copy. Product CTAs pre-fill:

> Hello, I'm interested in **[PRODUCT NAME]**. I would like more information.

The five CTA voices (Enquire Now / Talk to Specialist / Request Information /
Speak with Advisor / View Product) map to the `EnquiryIntent` union.

---

## Design system

Every token lives in the `@theme` block at the top of `app/globals.css`. There
is no second place to look, and no component hard-codes a colour, a duration or
a z-index.

| Family | Tokens |
| --- | --- |
| Colour — core | `--color-carbon` `--color-soft` `--color-warm` |
| Colour — neutrals | `--color-ink` `--color-onyx` `--color-graphite` `--color-mist` `--color-stone` `--color-ash` |
| Colour — categories | `--color-cat-*` (eight, one per research domain) |
| Type families | `--font-display` `--font-sans` |
| Type scale | `--text-eyebrow` → `--text-display-l` (nine steps) |
| Spacing | `--spacing-gutter` `--spacing-section` `--spacing-section-lg` |
| Containers | `--container-content` `--container-prose` `--container-narrow` |
| Breakpoints | `--breakpoint-xs` → `--breakpoint-2xl` |
| Borders | `--border-hair` `--border-rule` |
| Radius | `--radius-none` `--radius-pill` `--radius-dot` |
| Shadows | `--shadow-panel` `--shadow-drawer` `--shadow-lift` |
| Z-index | `--z-base` `--z-raised` `--z-sticky` `--z-header` `--z-drawer` `--z-overlay` `--z-gate` `--z-cursor` |
| Easing | `--ease-brand` `--ease-soft` |
| Duration | `--duration-instant` `--duration-fast` `--duration-mid` `--duration-slow` `--duration-xslow` |

Composed type styles (`type-display-l`, `type-editorial`, `type-label`,
`type-body`, …) are declared as Tailwind v4 `@utility` rules in the same file,
so hierarchy is applied by name rather than by reassembling five utilities at
each call site.

`constants/motion.ts` mirrors the easing and duration tokens for Framer, which
cannot read CSS custom properties.

### Motion

One signature curve — `cubic-bezier(0.62, 0.16, 0.13, 1.01)` — exposed as the
`ease-brand` utility and as `EASE_BRAND`. Five durations. Every transition on
the site resolves to one of those pairs.

The primitives live in `components/motion/`: `Reveal` and `Stagger` (scroll
reveals), `SplitText` (masked word reveal), `Marquee`, `Parallax`, `Curtain`
(the entrance), `PageTransition`, `SmoothScroll` (Lenis) and `Cursor`.

`prefers-reduced-motion` is honoured throughout: Lenis does not initialise,
`SplitText` renders plain text, reveals collapse to a fade, the cursor does not
mount at all, and the CSS layer reduces every remaining animation to 0.01ms.

### The pointer

`components/motion/Cursor.tsx`. A dot that follows the mouse and grows into a
labelled disc over anything worth clicking. No trailing particles, no spring
overshoot, no rotation.

It does not mount for a coarse pointer, a touch device, or a visitor who has
asked for reduced motion — and it re-evaluates on change, so docking a laptop
or pairing a mouse mid-session is picked up. The native arrow is suppressed
only once the replacement has decided to mount (`html[data-cursor="on"]` in
`globals.css`), so nothing can strand a visitor with no pointer at all. Text
fields, selects, media and disabled controls keep their native cursor
unconditionally.

Position is written straight to the DOM inside one `requestAnimationFrame`
loop, which stops itself when the dot has arrived. There is no React state in
the hot path.

Any element can declare a state with `data-cursor="view" | "drag" | "text"` and
an optional `data-cursor-label`. Ordinary links and buttons need no attribute —
they are detected structurally, with one `closest()` per pointer move.

---

## Adding content

Everything is typed, flat and serialisable — ready to lift into a headless CMS
without touching a component.

**A product** — append to `data/products.ts`. It appears automatically in the
catalogue, its category page, the sitemap, and gets its own social card. Drop
`public/products/<slug>.jpg` in and the photograph is picked up on the next
build.

**A category** — append to `data/categories.ts` and add a colour token to
`app/globals.css`.

**A stack** — append to `data/stacks.ts`. Component slugs resolve against
`data/products.ts`; the page, the nav dropdown, the sitemap and the
"included in research stacks" panel on each compound all follow.

**A journal entry** — append to `data/journal.ts`. Bodies are block arrays
(`paragraph` · `heading` · `list` · `callout` · `quote`), rendered by
`components/journal/ContentBlocks.tsx`. Science pages reuse the same model.

**A batch** — append to `data/lab-results.ts`. Set `current: true` on the newest
and `false` on the one it supersedes; superseded batches stay published.

---

## Imagery

Every image slot asks `lib/media.ts` whether the file actually exists at render
time (build time, for these static routes) and falls back gracefully when it
does not — so the site is presentable at every stage of a photography schedule.

| Missing file falls back to | Used by |
| --- | --- |
| `VialGlyph` — vector vial, kit §05/§09 proportions | Compound plates |
| `StackMedia` — one glyph per component, shallow arc | Stack plates |
| `Figure` — registration mark on the warm ground | Editorial, journal, facilities, team |

**Drop-in manifest.** Add any of these to `public/` and they are picked up on
the next build with no code change:

```
public/products/<slug>.jpg          12 compounds — see data/products.ts
public/stacks/<slug>.jpg            5 stacks — see data/stacks.ts
public/journal/<name>.jpg           13 entries — see `image` in data/journal.ts
public/facilities/<name>.jpg        synthesis · lyophilisation · analysis · cold-storage
public/team/<name>.jpg              4 portraits — see data/about.ts
public/editorial/*.jpg              hero-vial · packaging · philosophy-vial
public/coa/<BATCH>.pdf              signed certificates — see data/lab-results.ts
```

Until a certificate PDF is present, the download control degrades to
"Signed PDF on request" rather than emitting a broken link.

**Product photography direction** (for the shoot): short, wide pharmaceutical
vials — roughly 22 mm across and 35 mm tall, thick borosilicate glass with a
heavy base heel, aluminium crimp collar and a coloured flip-off cap in the
compound's category colour. Clinical printed label, minimal branding, studio
key light with soft contact shadow on a warm neutral ground. Cosmetic or
supplement-bottle proportions are wrong for this catalogue.

`scripts/ingest-images.mjs` takes a `{ "path/in/public.jpg": "url" }` manifest
and writes optimised progressive JPEGs.

---

## Architecture

```
app/          routes, metadata, sitemap, robots, OG image routes
sections/     page-level compositions (home/*, shared/*)
components/   ui/ · motion/ · product/ · stack/ · journal/ · lab/ · review/
              · contact/ · science/ · search/ · enquiry/ · legal/
              · layout/ · common/
data/         products, stacks, strips, journal, lab-results, reviews, science,
              about, contact, categories, faq, standards, legal, routes, site
lib/          calculator, search, catalogue, enquiry, local-store, query,
              whatsapp, schema (JSON-LD), media, format, utils
constants/    motion curves and durations
scripts/      check-export · audit-viewports · ingest-images
tests/        unit/ · dom/ · setup
```

### Two things `data/` owns that are easy to miss

- **`data/routes.ts`** is the registry of every static address. The sitemap is
  generated from it, the export checker asserts each entry was actually built,
  and the navigation tests fail if a menu or footer link points anywhere that
  is not in it.
- **`data/legal.ts`** carries a `requiresLegalReview` flag per document. Every
  document holding it renders a visible review banner — on screen and in
  print — and the flag is asserted in the test suite so it cannot be cleared
  by a content edit. Clearing it is a decision for a qualified adviser.

### Loading states

`components/common/Skeleton.tsx` holds the shimmer primitives, used by the
catalogue's client-side filtering.

They are **not** wired up as route-segment `loading.tsx` files, and should not
be. A `loading.tsx` creates a Suspense boundary; Next's static prerender
postpones that boundary's content to be resumed at request time, and under
`output: "export"` there is no server to resume it — the boundary never fills
and the route renders as a permanent skeleton. This was tested and reverted.
Every route here is prerendered HTML, so there is no fetch to wait on anyway.

The same constraint is why `lib/query.ts` exists instead of `useSearchParams`:
that hook forces the calling subtree into a Suspense bailout, with the same
result.

### Accessibility

Target: WCAG 2.2 AA. Verified across every route, at ten viewport widths from
320×568 to 1920×1080:

- **Contrast.** Every text tier was measured against the surface it sits on,
  with alpha flattened over the real background rather than assumed. Muted
  tiers bottom out at `/55` on dark and `/62` on light.
- **Structure.** Exactly one `h1` per page, unbroken heading order, semantic
  landmarks, a skip link.
- **Targets.** WCAG 2.2 SC 2.5.8 — every control that is not inline within
  running prose carries a 24px minimum box; the primary controls are 44px.
- **Keyboard.** Every disclosure, filter, tab group and overlay is operable
  without a mouse. The tab groups and segmented controls use radio semantics,
  so the arrow keys move within the group and only the selected option is in
  the tab order. Overlays trap focus and restore it on close.
- **Motion.** `prefers-reduced-motion` is honoured everywhere, and the custom
  pointer does not mount at all under it.
- **Images.** Alt on every image; decorative plates carry an empty alt.
- **Overflow.** No horizontal overflow at any audited width.

The custom pointer never replaces keyboard focus feedback: the focus ring is a
separate `:focus-visible` outline that is unaffected by it.

The loading curtain lifts on `document.fonts.ready` — subject to a 750ms floor
and a 2.2s ceiling — rather than a fixed timer, so it covers the font swap this
typographic design would otherwise show, instead of delaying the hero for no
reason.

### Security and data handling

- No secret is read anywhere in this codebase, and none is committed. There is
  no server, no database, no authentication, and no third-party analytics or
  tracking script in any page.
- The only persisted state is the enquiry list and the entrance
  acknowledgement, both in the visitor's own `localStorage`. Both parsers
  reject anything that is not the exact shape they wrote, because storage is
  writable by anyone with a console.
- The calculator runs entirely in the browser. Entered values are never
  transmitted, logged or retained.
- Every external link carries `rel="noopener noreferrer"`, asserted by
  `scripts/audit-viewports.mjs`.
- The enquiry list is capped at 40 entries — a longer list is a stuck key or a
  scraper, not a research enquiry.
- `npm audit` reports zero vulnerabilities at the pinned versions.

---

## Legal

`data/site.ts` holds the short disclaimer; `data/legal.ts` holds the eight
full documents, each served at its own address so a specific position can be
cited rather than buried in one scroll.
Product entries describe compounds as characterised in published literature.
The detail-page section that would conventionally be "Benefits" is titled
**Research Focus** and framed as areas of published investigation — no
therapeutic or efficacy claim is made anywhere on the site.

**Before launch:**

1. **Verify the chemistry.** CAS numbers, molecular formulae and molar masses in
   `data/products.ts` are provided for identification and have **not** been
   checked against your batches.
2. **Replace every batch record.** `data/lab-results.ts` is illustrative
   structure, not real analysis. Batch numbers, purities, accession numbers,
   laboratories and dates must all be replaced with your actual certificates
   before the library is published — presenting invented analytical results as
   genuine would be indefensible.
3. **Replace every review.** `data/reviews.ts` carries a warning to the same
   effect. Entries are structural samples written to exercise the layout, not
   customer feedback. Publishing them as genuine would be misleading and, in
   most jurisdictions, unlawful. `verified` should only ever be true where a
   submission is matched to a real, confirmed enquiry record.
4. **Replace the WhatsApp number** in `data/site.ts`.
5. **Check the About narrative.** Timeline, facilities and leadership in
   `data/about.ts` are written to the brand's positioning and need confirming
   against the real company before they go live.
6. **Have the eight legal documents reviewed.** `data/legal.ts` holds
   `/terms`, `/privacy`, `/shipping`, `/returns`, `/platform-use`,
   `/age-verification`, `/research-use-only` and `/research-disclaimer`. Each
   states EVOHN's actual position and each carries
   `requiresLegalReview: true`, which renders a visible banner on the page and
   in print. A qualified adviser in the relevant jurisdiction must approve the
   wording before that flag is cleared — the test suite asserts it, so it
   cannot be cleared by accident. The specific points needing a decision are
   marked in the text: governing law and jurisdiction, data-protection regime
   and retention periods, territories served and incoterms, the interaction
   between the returns position and consumer law, and whether a
   self-declaration is sufficient age assurance where you trade.

---

## Deployment

Static export to GitHub Pages, from the `gh-pages` branch:

```bash
GITHUB_PAGES=true npm run build     # basePath /evohn
```

For a root deployment (a custom domain, or any host serving from `/`):

```bash
GITHUB_PAGES=true PAGES_BASE_PATH= NEXT_PUBLIC_SITE_URL=https://evohn.com npm run build
```

`out/` is the artefact and is not tracked on `main`. Run both checks against it
before publishing:

```bash
npm run test:e2e
node scripts/audit-viewports.mjs
```
