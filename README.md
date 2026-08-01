# EVOHN

A premium research-compound catalogue. Next.js 16 (App Router), TypeScript,
Tailwind v4, Framer Motion, Lenis.

```bash
npm run dev     # http://localhost:3000
npm run build   # 45 static routes
npm run lint
```

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

**Imagery** — `components/product/ProductMedia.tsx` asks `lib/media.ts` whether
a file actually exists at render time (build time, for these static routes). If
it does not, it falls back to `VialGlyph`, a vector rendering of the vial drawn
to the kit's §05/§09 proportions — matte cap, torn label edge, wordmark. The
catalogue is therefore presentable at every stage of a photography schedule.

`scripts/ingest-images.mjs` takes a `{ "path/in/public.jpg": "url" }` manifest
and writes optimised progressive JPEGs.

---

## Architecture

```
app/          routes, metadata, sitemap, robots, OG image routes
sections/     page-level compositions (home/*, shared/*)
components/   ui/ · motion/ · product/ · layout/ · common/
data/         products, categories, faq, standards, site config
lib/          whatsapp, schema (JSON-LD), media, utils
constants/    motion curves and durations
```

### Motion

One easing curve, `cubic-bezier(0.62, 0.16, 0.13, 1.01)`, exposed as the
Tailwind `ease-brand` utility and as `EASE_BRAND` for Framer. Durations are
0.4 / 0.6 / 0.7 / 1.2s.

`prefers-reduced-motion` is honoured throughout: Lenis does not initialise,
`SplitText` renders plain text, parallax transforms are dropped, and the
CSS layer collapses all animation.

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

**Before launch:** verify the CAS numbers, molecular formulae and molar masses
in `data/products.ts` against your own certificates of analysis. They are
provided for identification and have not been checked against your batches.
