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

## What works

- **Renter intake** (`/intake`) — six questions that drive everything downstream.
- **Match scoring** — transparent, rule-based, weighted budget 35 / location 25 / property type 20 / move-in 10 / preferences 10. Every score comes with its reasons.
- **Search** — 200 synthetic listings, ten filters, five sort orders, filters as a sidebar on desktop and a bottom sheet on mobile.
- **Property detail** — gallery, match breakdown, full cost breakdown, amenities, rules, nearby distances, trust states.
- **Compare** — up to three places side by side, with the strongest figure in each row highlighted.
- **Shortlist** — save and revisit.
- **Inquiry** — structured, carrying the renter's budget and move-in date; lands in the demo owner inbox.
- **Owner dashboard** — listing performance, inquiry inbox, and the confirm-availability action.

Still to come: the map panel and the owner listing form.

## Regenerating the dataset

```bash
node scripts/generate-listings.mjs
```

Writes 200 records to `src/data/listings.json`. The generator is deterministic, so reruns produce
the same dataset. Roughly a quarter of listings deliberately withhold part of their cost and about
a third are stale — the filters and trust features need imperfect data to act on.

## Product rules that must not be broken

- Synthetic listings are never presented as real availability.
- Verification badges say "(demo)" — the prototype demonstrates the workflow, it does not perform checks.
- Match scoring is rule-based and described as "transparent", never as AI.
