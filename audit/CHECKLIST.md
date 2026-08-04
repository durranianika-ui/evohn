# Homepage parity — state of play

Durable record for this reconstruction. Reference geometry:
`audit/roehn/geometry.json`. Reference motion: `audit/roehn/motion.json`.
Comparison: `audit/comparison.txt`.

Re-measure with:

```bash
node scripts/audit-capture.mjs --target evohn-after --base http://127.0.0.1:3456
node scripts/audit-compare.mjs --against evohn-after
node scripts/audit-motion.mjs --target evohn-after --base http://127.0.0.1:3456
node scripts/audit-motion-report.mjs --target evohn-after
```

## Verified reference structure (measured, 1440x900)

Eight blocks inside `<main>`, footer separate:

| # | vh | ground | block |
|---|------|-----------|-------|
| 1 | 1.00 | `#0a0a0a` | Hero |
| 2 | 0.98 | `#edeae3` | Philosophy **+ four-panel row** |
| 3 | 2.18 | `#111110` | Research domains |
| 4 | 4.00 | inherit | Product collection (pinned, `sticky h-dvh`) |
| 5 | 1.60 | `#f5f4f0` | Facility |
| 6 | 0.89 | `#0a0a0a` | Certifications |
| 7 | 2.51 | `#0a0a0a` | For Researchers |
| 8 | 2.51 | `#0a0a0a` | For Performance |

Container solves exactly to `max-width: 1368px; padding-inline: 16px`.

## Geometry — done

Every block is inside the 0.35vh tolerance at all seven audit widths. Worst
remaining deltas, and they are content differences rather than layout faults:

| block | worst delta | where |
|---|---|---|
| Verification | −0.50vh | 430 — the reference's counterpart is image-driven and grows as the viewport narrows; ours is data-driven and does not |
| Performance | +0.38vh | 390/360 — the closing statement sits in flow on a phone, where nothing is sticky |
| Domains | −0.32vh | 768 |

Total document length runs −0.12vh to +1.12vh against the reference. The
residual at phone widths is the footer, which carries content the reference's
does not: eight legal documents, the domain colour key and the research-use
disclaimer. Cutting those is a content decision, not a layout fix.

- [x] 1. Homepage-scoped container (`container-home`), shared container untouched
- [x] 2. Merge Philosophy + Pillars into one mist block, four-panel row
- [x] 3. Four panels: graphite / sand / graphite / off-white
- [x] 4. Fold Standard + CallToAction out of the top level
- [x] 5. Trim Collection heading block
- [x] 6. Domains to 2.18vh
- [x] 7. Total page length within tolerance
- [x] 8. Seven-viewport responsive pass
- [x] 9. Playwright e2e suite
- [x] 10. Accessibility scan (axe) — homepage clean; see the debt below
- [x] 11. Lighthouse (production)
- [x] 12. Internal-page regression
- [x] 13. Final geometry + screenshot audit

## Motion — done

Measured off the reference with `audit-motion.mjs`, which records what moves
across 21 scroll stops and diffs computed style before and after hover.

| effect | reference | EVOHN |
|---|---|---|
| Researcher/performance panels | sticky, tops 80/100/120px, stacking | matched |
| Collection cards | 42vw open / 15vw closed, 0.4 opacity, detail expands | matched (605x602 vs 216x214; reference 605x612 / 216x342) |
| Header | always transparent; hides down, returns up, 400ms | matched |
| Headline reveal | per character, 8px rise, fade | matched |
| Philosophy block | scale 0.95 + 19px over 1000ms | matched |
| Button hover | arrow arrives from −24px | matched |
| Easing | `cubic-bezier(.62,.16,.13,1.01)` | already identical |

## Lighthouse — production build, desktop preset

| category | score |
|---|---|
| Performance | 77 |
| Accessibility | 97 |
| Best practices | 100 |
| SEO | 100 |

FCP 0.9s · LCP 4.7s · TBT 240ms · CLS 0 · main-thread work 3.5s · 48 KiB
unused JS. LCP is the one number worth attacking: the run measures the page
with the entrance notice up, and the hero film loads behind it.

## Known debt

**Contrast.** The axe scan fails on five internal routes — calculator (28
nodes), legal (16), catalogue (11), contact (6), enquiry (1) — and at 768 on
the homepage. Every finding is the same thing: muted text set at 40–62%
opacity over a light ground, which lands between 2.2:1 and 4.1:1 against the
4.5:1 threshold. It predates this branch, and it is not accidental — the
reference's own muted text is `#8A8880` on light, which fails the same check.
Raising it site-wide (360 call sites across 59 files) would pass the audit and
move the page away from the reference it is being matched to. That trade is
the owner's to make, not a bug to quietly fix.
