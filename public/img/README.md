# Decorative art for the wedding site

Every file here is a **flat SVG placeholder**. Replace each one with a real
transparent PNG that has the **same base name**, then change one line in
`src/config/dates.ts`:

```ts
export const ASSET_EXT: "svg" | "png" = "png";
```

All layers, the kasavu dividers and the footer/couple borders read their path
through `asset()` in that file, so nothing else needs editing.

## Export guidelines

- Transparent background (PNG-24 with alpha)
- Export at **2x** the size you expect it to display (sizes below are already 2x)
- **Under 300 KB each.** Run them through TinyPNG / Squoosh / `pngquant`
- Keep the subject anchored the way the placeholder is (e.g. fronds grow out of
  the bottom-left corner; the code mirrors them for the right side)

| File | Size (px) | Used in | Notes |
|---|---|---|---|
| `gopuram.png` | 1600 × 600 | Hero (back layer) | Temple gopuram silhouette, sits on the bottom edge |
| `nilavilakku.png` | 600 × 900 | Hero sides, Footer | Brass lamp, lit wicks |
| `marigold-garland.png` | 1600 × 300 | Hero top, RSVP top | Hangs from the top edge (thoranam) |
| `coconut-fronds.png` | 900 × 900 | Hero bottom corners | Anchored bottom-left; mirrored in code |
| `jasmine-petals.png` | 400 × 400 | Hero, Blessings | A single flower/petal; shown 5–8 times at different sizes |
| `kasavu-border.png` | 1600 × 80 | Between every section, Couple, Footer | **Must tile horizontally** (gold zari on cream) |
| `elephant-nettipattam.png` | 800 × 800 | Events (sides, low opacity) | Caparisoned elephant head |
| `lotus.png` | 500 × 500 | Events | Lotus bloom |
| `mural-corner.png` | 600 × 600 | Gallery (four corners) | Kerala-mural corner ornament, drawn for the **top-left**; mirrored in code |
| `peacock-feather.png` | 400 × 900 | Invitation, RSVP | Mayilpeeli, quill at the bottom |
| `flute.png` | 1000 × 220 | RSVP | Bamboo flute (odakuzhal) with tassel |
| `temple-bell.png` | 300 × 700 | Events (top corners) | Chain at the top edge — swings from the top |
| `thookku-vilakku.png` | 400 × 900 | Invitation (top corners) | Hanging brass lamp, chain at the top edge |
| `nirapara.png` | 600 × 600 | Bride & Groom | Para filled with paddy and a coconut flower |
| `shankhu.png` | 500 × 400 | Events | Conch |
| `chirathu.png` | 300 × 220 | Gallery | Small clay oil lamp, lit |
| `kolam.png` | 600 × 600 | Bride & Groom, Footer | Radial kolam — rotates on scroll, so keep it centred and symmetric |
| `vettila.png` | 500 × 400 | Events | Betel leaves with areca nut |

## Photos

Real photos live in `/public/photos` (bride/groom portraits cropped from the
pre-wedding shoot, plus `gallery-1…9.webp`), generated from the originals in
`/public/amal& arya`. They are referenced from `couple.bridePhoto`,
`couple.groomPhoto` and the `gallery` list in `src/config/dates.ts` and don't
use `ASSET_EXT`. Portrait (4:5) photos suit the gallery tiles best.

## Other files

- `/public/video/opener.mp4` is the opening temple-door video (portrait,
  720 × 1280, 8 s). The site is revealed at `intro.revealAtSeconds` (5 s) in
  `src/config/dates.ts`; keep a replacement under ~7 MB so it starts quickly
  on mobile data.

- `og-image.jpg` is the 1200 × 630 link-preview card — what WhatsApp,
  Facebook, iMessage and X show when someone shares the site's link. It's
  referenced by `seo.ogImage` in `src/config/dates.ts`. To replace it, crop
  your new art to a 1.91:1 (1200 × 630) landscape — most sharing surfaces
  centre-crop to that ratio, so keep the couple's names/monogram near the
  middle rather than at the very top or bottom edge.
- Background music is read from `audioUrl` in the config (default
  `/audio/nadaswaram.mp3`, i.e. `public/audio/nadaswaram.mp3`). Until that file
  exists, the music button shows "Music unavailable" when pressed.
