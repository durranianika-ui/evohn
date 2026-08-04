# Homepage parity — remaining work

Durable state for this reconstruction. Update as items complete.
Reference geometry: `audit/roehn/geometry.json`. Comparison: `audit/comparison.txt`.

## Verified reference structure (measured, 1440x900)

Eight blocks inside `<main>`, footer separate:

| # | vh | ground | block |
|---|------|-----------|-------|
| 1 | 1.00 | `#0a0a0a` | Hero |
| 2 | 0.98 | `#edeae3` | Philosophy **+ four-panel standards row** |
| 3 | 2.18 | `#111110` | Research domains |
| 4 | 4.00 | inherit | Product collection (pinned, `sticky h-dvh`) |
| 5 | 1.60 | `#f5f4f0` | Facility |
| 6 | 0.89 | `#0a0a0a` | Certifications |
| 7 | 2.51 | `#0a0a0a` | For Researchers |
| 8 | 2.51 | `#0a0a0a` | For Performance |

Blocks sum to 15.67vh; reference document is 16.74vh, so the footer is ~1.07vh.

> Correction to the issued brief: it assigned ~2.18vh to the merged
> Philosophy+Pillars block. Measurement puts that block at **0.98vh** — the four
> panels are a single side-by-side row inside it (panel headings measured at
> x = 61 / 403 / 745 / 1087, one row, ~600px tall). The 2.18vh block is the
> research domains. Following the measurements, per "latest measurements are
> the source of truth".

## Reference container (solved exactly)

`max-width: 1368px; padding-inline: 16px`

Confirms at every width: 1920 → (1920−1368)/2 = 276 ✓ · 1440 → 36 ✓ ·
1280/768/430/390/360 → 16 ✓ (below max-width, padding only).
Evohn currently runs +48px desktop, +24 at 768, +8 mobile.

## Tasks

- [ ] 1. Homepage-scoped container (`container-home`), shared container untouched
- [ ] 2. Merge Philosophy + Pillars into one mist block, four-panel row
- [ ] 3. Four panels: graphite / sand / graphite / off-white
- [ ] 4. Fold Standard + CallToAction out of the top level
- [ ] 5. Trim Collection heading block
- [ ] 6. Domains to 2.18vh
- [ ] 7. Total page length within tolerance
- [ ] 8. Seven-viewport responsive pass
- [ ] 9. Playwright e2e suite
- [ ] 10. Accessibility scan (axe)
- [ ] 11. Lighthouse (production)
- [ ] 12. Internal-page regression
- [ ] 13. Final geometry + screenshot audit
