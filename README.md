# EVOHN

A premium research-compound catalogue. Next.js 16 (App Router), TypeScript,
Tailwind v4, Framer Motion, Lenis.

```bash
npm run dev     # http://localhost:3000
npm run build   # 86 static routes
npm run lint
```

---

## Information architecture

Nine top-level destinations, defined entirely in `data/site.ts`. Restructuring
the site is a data edit — `NavItem` supports a plain link, a compact dropdown
(`menu`) and a full-width mega panel (`mega`), and the header renders whichever
shape it finds.

| Route | What it holds |
| --- | --- |
| `/` | The argument, top to bottom: belief → proof → catalogue → stacks → evidence → writing → company |
| `/catalogue` | Filterable, searchable compound index; `/catalogue/[slug]` per compound |
| `/categories/[slug]` | One of eight research domains |
| `/stacks` | Multi-compound groupings; `/stacks/[slug]` with protocol, storage, FAQs |
| `/science` | Hub, plus `/science/[slug]` long-form, `/science/calculator`, `/science/compound-index` |
| `/journal` | Editorial index; `/journal/[slug]` per entry |
| `/lab-results` | COA library; `/lab-results/[slug]` per compound, every batch |
| `/reviews` | Testimonials with verification marks |
| `/about`, `/contact`, `/faq`, `/legal` | Company, enquiry routes, policy |

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
app/          routes, metadata, sitemap, robots, OG image routes, loading states
sections/     page-level compositions (home/*, shared/*)
components/   ui/ · motion/ · product/ · stack/ · journal/ · lab/ · review/
              · contact/ · science/ · layout/ · common/
data/         products, stacks, journal, lab-results, reviews, science, about,
              contact, categories, faq, standards, site config
lib/          whatsapp, schema (JSON-LD), media, format, utils
constants/    motion curves and durations
```

### Motion

One easing curve, `cubic-bezier(0.62, 0.16, 0.13, 1.01)`, exposed as the
Tailwind `ease-brand` utility and as `EASE_BRAND` for Framer. Durations are
0.4 / 0.6 / 0.7 / 1.2s.

`prefers-reduced-motion` is honoured throughout: Lenis does not initialise,
`SplitText` renders plain text, parallax transforms are dropped, and the
CSS layer collapses all animation.

### Loading states

`components/common/Skeleton.tsx` holds the shimmer primitives, used by the
catalogue's client-side filtering.

They are **not** wired up as route-segment `loading.tsx` files, and should not
be. A `loading.tsx` creates a Suspense boundary; Next's static prerender
postpones that boundary's content to be resumed at request time, and under
`output: "export"` there is no server to resume it — the boundary never fills
and the route renders as a permanent skeleton. This was tested and reverted.
Every route here is prerendered HTML, so there is no fetch to wait on anyway.

### Accessibility

Verified across all routes: AA contrast (the muted text tiers were computed
against each surface — `/55` minimum on dark, `/62` on light), single `h1` per
page, unbroken heading order, alt text on every image, keyboard-operable
disclosure and filter controls with correct ARIA, a skip link, visible focus
rings, and no horizontal overflow at 375px or 1440px.

The loading curtain lifts on `document.fonts.ready` — subject to a 750ms floor
and a 2.2s ceiling — rather than a fixed timer, so it covers the font swap this
typographic design would otherwise show, instead of delaying the hero for no
reason.

---

## Legal

`data/site.ts` holds the disclaimer copy; `app/legal/page.tsx` expands it.
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
