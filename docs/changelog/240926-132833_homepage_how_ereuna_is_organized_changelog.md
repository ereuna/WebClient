# Homepage: "How Ereuna is organized" section (replaces "How it works")

Branch: `feature/homepage-how-ereuna-is-organized`

## Why

The old homepage section ("HOW IT WORKS — Checkpoint to running model, in four steps":
Upload / Physics check / Model card / Infer & fine-tune, plus an `ereuna login / clone / pull`
CLI block) read like a generic model hub (Hugging Face style) rather than a geothermal ML
company. It was replaced with a section describing how Ereuna's geothermal work is organized,
laid out after the Medusa "alternating text / isometric illustration" pattern.

## What changed

| File | Change |
|---|---|
| `src/components/HowEreunaIsOrganized.jsx` | **New.** Section header + four alternating rows (text ⇄ illustration). |
| `src/illustrations/OrganizedIso.jsx` | **New.** Four isometric SVG illustrations, one per row. |
| `src/index.css` | Added `.org-row` rules: 2-column alternating grid, stacks to 1 column below 860px. |
| `src/pages/HomePage.jsx` | Renders `HowEreunaIsOrganized` in place of `Pipeline`. |
| `src/components/Pipeline.jsx` | **Deleted** (HomePage was its only consumer). |

### Copy (as supplied)

- Eyebrow: `HOW EREUNA IS ORGANIZED`
- Heading: *From a geothermal question to a tested answer*
- 01 · Domains — Seven research areas, from exploration and drilling to reservoir and production engineering.
- 02 · Fields — Work anchored to real Kenyan geothermal fields and the wells published about them.
- 03 · Workbench — Run the chain yourself: simulate a reservoir, sample virtual wells, train, validate.
- 04 · Benchmarks — Models scored on held-out wells and calibrated uncertainty, not a single error number.

Only the Benchmarks row has a link (`/benchmarks`), because it is the only one with an existing route.

### Illustrations — what each one depicts

| Row | Drawing | Maps to copy |
|---|---|---|
| Domains | Seven tiles on one tray, one lifted out ("ONE DOMAIN"); a derrick on the first tile, a steam plant on the last; a range arrow labelled `EXPLORATION & DRILLING → RESERVOIR & PRODUCTION ENGINEERING`. | "Seven research areas, from … to …". Only range endpoints are labelled — the copy does not name all seven. |
| Fields | Terrain slab of the Kenya Rift: two normal faults (ticks on the downthrown side) bound the rift floor; offset strata on the cut face; Menengai (north) and Olkaria (south) field outlines with wells; one well linked to a stack of `PUBLISHED WELL DATA` sheets showing a temperature-vs-depth trace. | "real Kenyan geothermal fields and the wells published about them". |
| Workbench | `▶ RUN` control feeding four stations on one chain: simulated reservoir (mesh + heat plume) → same block pierced by dashed *virtual* wells → board with a network → board with a prediction band, observations, and a check. | "Run the chain yourself: simulate a reservoir, sample virtual wells, train, validate." |
| Benchmarks | Reservoir block with training wells and held-out wells (accent, dashed ring); one held-out bore on the cut face links to a per-well card (prediction band vs observations with depth); a separate calibration plot (expected vs observed, near the diagonal). | "held-out wells and calibrated uncertainty, not a single error number" — two evaluation views, no score value. |

### Design notes / tradeoffs

- **Projection helper instead of hand-typed polygons.** Existing illustrations (e.g. `GeothermalIso.jsx`)
  hard-code screen coordinates. These four use a small `makeIso(ox, oy, u)` 2:1 dimetric helper plus
  `Box` / `IsoCircle` / `Leader` / `Chevron` primitives, so the geometry is defined in world units and can
  be adjusted without recomputing points. Drawing order follows depth `x + y`.
- **Upright boards face +x.** On a +y-facing board, the 2:1 shear flattens a rising curve almost to
  horizontal; +x-facing boards keep the Validate plot legible.
- **Mixed styling approach.** The codebase uses inline styles only; a media query cannot be inline, so the
  responsive grid lives in three small `.org-row*` classes in `index.css`. Everything else stays inline.

### Content-integrity check (ereuna-geothermal-rewrite-brief.md §2)

- No numbers, well IDs, metric values, dates, logos, or partner names were added. Plots are unitless.
- Place names used: Olkaria, Menengai, East African Rift, Kenya — all covered by whitelist item W9, as
  geography only (no access/partnership wording).
- "Seven" comes from the supplied copy.

## Removed

- The `ereuna login / clone / pull` CLI block and the `/illustrations/04-physics-gate-validator.png` banner
  that belonged to the old section. The PNG asset itself is still in `public/` (unused by this section).

## Verification

- `npx eslint` on the three touched JS files: clean.
- `npm run build`: succeeds (the >500 kB chunk warning pre-dates this change).
- Visually checked in the browser at 1300px (alternating rows) and ~780px (stacked, text above art,
  including flipped rows).

## Follow-ups (not done)

- `src/illustrations/PipelineIcons.jsx` has no importers — dead code candidate.
- The CTA below this section reads "FROM OLKARIA TO MENENGAI TO WAIRAKEI"; Wairakei (New Zealand) is not
  in the brief's whitelist.
- If the seven research areas get canonical names, the Domains tiles can be labelled individually.
