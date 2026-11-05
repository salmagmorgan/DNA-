# Developers' DNA — Report Dashboard

Interactive dashboard for The Board Consulting's **Developers' DNA** study: brand equity across Egypt's leading real estate developers. It includes a Positioning Index, Anatomy, Brand Essence and Archetype models, regional funnels, and a Market Blueprint.

It is built as a **reusable template**. All report content lives in JSON files under `src/data/`, and all images live in `public/assets/`. To publish a new study, edition or market, edit the data. You don't need to touch the code.

## Quick start

Requires Node.js 18+ (20 or 22 recommended).

```bash
npm install
npm run dev        # local dev server at http://localhost:5173
npm test           # data integrity checks — run after every data edit
npm run build      # type-check + production build into dist/
npm run preview    # serve the built dist/ locally
```

## Project layout

```
public/assets/
  brand/        TBC monogram, Developers' DNA logo
  logos/        one PNG per developer, named <developer id>.png
  personas/     one JPG per developer, named <developer id>.jpg
  models/       source-deck images of the four models
src/
  data/         ← THE REPORT CONTENT (edit these)
    report.json      page copy: headlines, methodology, takeouts, agenda…
    developers.json  the developers: scores, persona, essence, anatomy, capability…
    zones.json       Positioning Index zones (bands on the Credibility × Premiumness plane)
    regions.json     regional awareness, funnel stages, leaders
    findings.json    key findings (Overview tiles, Takeouts, search)
    models.json      anatomy dimensions + weights, archetypes, essence layers, funnel tiers
    notes.json       "Report notes & data checks" drawer
  lib/          types.ts (data schema), data.ts (loading + derived values), router, theme
  components/   sidebar, search palette, drawer, cursor, shared chips/logos
  models/       interactive Anatomy body, Essence donut, Positioning quadrant
  views/        one file per page
  styles/       global.css (design tokens, light/dark themes)
tests/          data integrity tests
```

## Updating the report for a new study

1. **Developers**: edit `src/data/developers.json`. Each entry's `id` is used everywhere: in regions, compare defaults, and image file names. Add `public/assets/logos/<id>.png` and, optionally, `public/assets/personas/<id>.jpg`.
   - `zone`: the zone id the report assigns. If you leave it out, the developer is placed geometrically from `idx.cred` and `idx.prem`.
   - `anatomy`: all seven dimensions (`lb, heart, legs, rb, mouth, muscles, hands`), each as `{ "s": score/10, "pt": weighted points }`.
   - `archetype`: one of the archetype ids in `models.json`, or `null` if unconfirmed.
2. **Regions**: edit `src/data/regions.json`. Add or remove region keys freely; the region buttons and the comparison table update to match. Funnel tier titles must match `models.json → funnelTiers[].t`.
3. **Copy**: edit `src/data/report.json`. Text fields support `**bold**`, `*italic*`, and line breaks (`\n`).
4. **Zones**: edit `src/data/zones.json`. Keep the list ordered from healthiest to weakest. The Overview stat cards use the first zone as the "best" and the last as the "worst".
5. Run `npm test`. It catches unknown ids, missing images, anatomy weights that don't add up to 100%, broken links between pages, and similar problems.

Most counts are calculated from the data: number of developers, number of zones, Ecosystem Builders (5/5/5 capability), rankings and totals. You don't need to update them by hand.

## Deploying

`npm run build` produces a static `dist/` folder. It uses relative paths and hash-based URLs (e.g. `#/explorer/tmg`), so it works from any static host or sub-path with no server configuration:

- **Vercel / Netlify**: import the repo, set the build command to `npm run build` and the output directory to `dist`.
- **GitHub Pages**: publish `dist/`, for example with the `actions/deploy-pages` action.
- **Anywhere else**: upload the contents of `dist/`.

Every page and developer has a shareable link, e.g. `…/#/explorer/sodic`, `…/#/map/north`, `…/#/index/luxury-icons`.

## Features

- Nine report sections plus a side-by-side Compare view, with deep links to every page
- ⌘K / Ctrl K search across developers, zones, sections and findings
- Interactive Positioning quadrant (click a zone to filter, click a logo for the profile)
- Regional Scope with cross-chart highlighting and a sortable all-region comparison
- Anatomy body diagram and Essence donut (hover to preview, click to pin)
- Light/dark theme (remembered per browser), print / PDF export, mobile layout

---

Source: The Board Consulting, *Developers' DNA Report*, Strategic Insights 2026.
