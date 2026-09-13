# Ghor Lagbe — Phase 1

Property discovery and rental marketplace prototype for the IUB Innovation to Impact (i2i) initiative.

**All listings, owners and images in this build are synthetic seed data.** They do not
represent real rental availability, and no real identity or property verification is performed.

## Run it

Requires Node 18 or newer.

```bash
npm install
npm run dev
```

Open the printed URL (usually http://localhost:5173).

Other commands:

```bash
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build locally
```

## Deploying to Vercel

1. Push this folder to a GitHub repository.
2. On vercel.com, "Add New → Project", import the repo.
3. Framework preset: **Vite**. Build command `npm run build`, output directory `dist`.
4. Deploy. You get a public URL to put in the i2i application and video.

Vercel handles client-side routing for Vite projects automatically. If a deep link such as
`/search` ever 404s on refresh, add a `vercel.json` with a rewrite of `/(.*)` to `/index.html`.

## Project structure

```
src/
  components/
    home/        hero, discovery card, how-it-works, areas, trust
    layout/      app shell, header, mobile nav, footer, page header
    property/    PropertyCard
    ui/          buttons, fields, badges, modal, toast, empty state
  data/          areas, amenities, synthetic demo properties
  hooks/         useAppState (role, shortlist, compare)
  lib/           formatting and class-name helpers
  pages/         one file per route
  routes/        route table
  types/         domain model
  index.css      design tokens
public/photos/   offline SVG placeholder images
```

## Design tokens

Every colour, the type family and the container width live in the `@theme` block at the top of
`src/index.css`. Change a value there and it updates across the whole application.

## What Phase 1 covers

Foundation and design system: routing, app shell, homepage, the reusable component kit, the
TypeScript domain model, and a 10-record demo dataset.

Filtering, sorting, the map panel, match scoring, the comparison table, the listing form and the
inquiry flow are intentionally not implemented yet. Their layouts are already in place to receive
them.

## Product rules that must not be broken

- Synthetic listings are never presented as real availability.
- Verification badges say "(demo)" — the prototype demonstrates the workflow, it does not perform checks.
- Match scoring is rule-based and described as "transparent", never as AI.
