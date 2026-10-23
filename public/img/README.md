# Decorative art for the wedding site

Every file here is a **flat SVG placeholder** (leaf sprigs, petals, circles and
specks) so the site looks finished today. Replace each one with a real
transparent PNG that has the **same base name**, then change one line in
`src/config/dates.ts`:

```ts
export const ASSET_EXT: "svg" | "png" = "png";
```

All layers read their path through `asset()` in that file, so nothing else
needs editing.

## Export guidelines

- Transparent background (PNG-24 with alpha)
- Export at **2x** the size you expect it to display (sizes below are already 2x)
- **Under 250 KB each.** Run them through TinyPNG / Squoosh / `pngquant`
- Keep the subject anchored the way the placeholder is (e.g. the eucalyptus
  branch enters from the top-left corner)
- Palette: wine and rose (the leaf sprigs), blush, champagne gold — nothing bright or saturated

| File | Size (px) | Used in (parallax speed) | Notes |
|---|---|---|---|
| `eucalyptus-branch-left.png` | 900 × 1200 | Hero (0.15), Feast | Enters from the top-left, droops down-right |
| `eucalyptus-branch-right.png` | 900 × 1200 | Hero (0.25) | Mirror of the left branch |
| `olive-branch.png` | 800 × 1000 | Our Story (0.20), RSVP (0.20) | Slim leaves along a gentle arc |
| `peony-cluster.png` | 800 × 800 | Bride & Groom (0.25), Gallery corners (0.15) | Blush peonies with a few leaves |
| `botanical-sprig.png` | 600 × 900 | Events (0.20, low opacity), Venue (0.20) | Single upright stem with alternating leaves |
| `herb-sprig.png` | 500 × 700 | Feast (0.35) | Small paired leaflets |
| `gold-dust.png` | 1600 × 900 | Hero (0.40), Events, Muhurtham (0.40), Footer | Scattered champagne specks; stretches to cover its section |
| `soft-petals.png` | 600 × 900 | Hero (0.55, rotates), Our Story, RSVP | Loose blush petals |
| `gold-line-arch.png` | 900 × 1200 | Bride & Groom (0.10), Venue (0.10) | Thin nested arch outlines |
| `gold-rings-glow.png` | 1200 × 1200 | Muhurtham (0.15) | Soft radial glow with abstract concentric circles — centred |

`og-image.jpg` (1200 × 630) is the link-preview card shown by WhatsApp /
Facebook / iMessage; it is baked into the page at build time (see `seo.ogImage`
in `src/config/dates.ts`).
