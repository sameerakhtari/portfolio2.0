# Sameer Akhtari · Portfolio 2.0

An engineering journal that moves from graphite studies to connected, colored systems. Sameer is an **Engineer I at DigitalOcean**, working across software, Linux, cloud infrastructure, networking, automation and physical hardware.

## Run locally

Use Node.js 24 LTS (Node 22.13+ is the minimum) and npm.

```bash
npm run install:ci
npm run dev
```

The normal local development URL is printed by the server (port 5173). In the managed Sites workspace, use `sites-preview start <absolute-checkout-path>` and its preview URL. The checkout-local execution profile is intentionally ignored by Git.

No application environment variables, database, API keys or authentication are required. Fonts and artwork are served locally.

## Verify the delivery

```bash
npm run verify
```

This runs TypeScript, ESLint, seven behavioral/data tests, the production build, and HTTP checks against the built Worker in Miniflare. Production checks cover all 19 content pages, missing routes, development-route exclusion, canonical metadata, the sitemap, robots and referenced assets.

Individual commands:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:production
npm start
```

`npm start` serves the built Worker locally. A build is required first. The production checker starts and disposes its own isolated runtime; it does not deploy.

## Routes

| Path                      | Content                                                                |
| ------------------------- | ---------------------------------------------------------------------- |
| `/`                       | Ten connected chapters, from education to current practice and contact |
| `/projects`               | Filterable index of ten systems and experiments                        |
| `/projects/[slug]`        | Ten case studies with architectural diagrams and status                |
| `/lab`                    | Ten lab layers, service inventory and four historical generations      |
| `/notes`, `/notes/[slug]` | Three structured engineering field notes                               |
| `/about`                  | Current professional profile and print-friendly résumé                 |
| `/contact`                | Email, GitHub, LinkedIn and profile links                              |
| `/dev/pigment`            | Development-only pigment and missing-image test bench                  |
| `/dev/review`             | Development-only responsive iframe review at 320–1280px                |

Development routes return 404 in production and are excluded from the sitemap. Invalid project and note slugs also return real 404 responses.

## Architecture

- **Vinext / Vite / React / TypeScript** with Next-style App Router files, built for a Cloudflare Worker. Vinext is pinned to the starter's beta release; this is not a static GitHub Pages export.
- **DOM and CSS** own all essential content and navigation. Warm paper, Space Grotesk and IBM Plex Mono carry the editorial layout.
- **SVG** owns diagram topology, focusable inspection nodes, path fronts and semantic relationships.
- **Three.js** supplies procedural hardware geometry and local material coloring. The large 3D module is loaded only when a hardware scene approaches the viewport.
- **WebGL / Canvas2D** share the pigment arrival field. No mandatory browser plugin or remote asset service is required.
- **Shadcn/Radix UI** controls supply tabs, switches and sliders.

The required Sites starter build integration and vendor licenses are retained. Database bindings are unset. The portfolio does not call the starter's optional database/authentication helpers.

### Pigment and motion

`lib/pigment.ts` defines a seeded spatial arrival field around branching capillaries. A local point receives pigment according to distance from a channel and travel time along it. A noisy frontier creates irregular spread instead of a rectangular image wipe. Reverse scrolling revisits the same field.

`LiquidImage` derives a graphite layer using edge extraction, then composites the campus artwork through that field. If WebGL is unavailable, Canvas2D computes a lower-resolution equivalent. An image failure retains a readable university caption.

`hardware-scene.ts` injects the same field into Three.js materials. Graphite geometry and edge lines remain visible while colored surfaces appear. Without WebGL2, `software-renderer.ts` projects the same geometry to Canvas2D; if rendering fails entirely, a semantic SVG remains.

Scrolling is native, with damped progress and short desktop sticky chapters. Mobile uses normal document flow. Observers suspend inactive rendering, pixel ratio is capped, and geometry, materials, listeners and animation frames are disposed on unmount. System reduced-motion preference and the persistent Motion switch present complete static content. Keyboard and tap controls expose diagram explanations without requiring hover.

See [the storyboard](docs/storyboard.md) for the scene-by-scene design and [testing guide](docs/testing.md) for verification instructions.

## Edit content

| File               | What to update                                                                       |
| ------------------ | ------------------------------------------------------------------------------------ |
| `data/profile.ts`  | Identity, contact links, employment, education, coursework and domains               |
| `data/projects.ts` | Projects, statuses, facts, technologies, case-study sections and public source links |
| `data/homelab.ts`  | Service inventory, layers, generations and dated cluster observations                |
| `data/diagrams.ts` | Diagram nodes, causal arrival order, relationships and explanations                  |
| `data/notes.ts`    | Field notes and their problem / constraint / result / next-step entries              |
| `data/site.ts`     | Canonical origin, default metadata and journey chapters                              |

To add a project, add a unique lowercase slug and a complete `Project` record to `data/projects.ts`. The index, detail route, next-project navigation and sitemap derive from this array. Choose an existing diagram type or implement its visual in the case-study route. Run the full verification command.

To add a field note, append a unique slug and structured entries to `data/notes.ts`; its route and sitemap entry are derived automatically.

Statuses are editorial records, not live monitoring. The 290-pod figure and software versions are explicitly a July–August 2026 observation. Prometheus/Grafana/Loki expansion remains **in progress**. The current role is Engineer I; February 2024 dates the DigitalOcean journey, not a claimed promotion date. Unverified credentials are omitted.

## Assets and replacement

- `public/images/muet.webp`: watercolor/graphite adaptation of a verified photograph of MUET's Administration Building. Retain its CC BY-SA 4.0 attribution and license. See [asset credits](docs/asset-credits.md).
- `public/og.png`: 1200×630 social share artwork, with Sameer's name and current role.
- `public/favicon.svg`: compact `sa/` identity.
- Fonts come from pinned Fontsource packages and are bundled locally.
- Hardware views are procedural schematics. They are not exact replicas of undocumented boards or chassis.

Authentic personal hardware photographs were unavailable for this delivery. To replace a schematic, add an optimized, licensed local image and descriptive alternative text, preserving the accessible content outside the image. The current HTML profile has a print action; no obsolete résumé PDF is linked. A verified current PDF can be added later.

## Deploy

Source is maintained at [sameerakhtari/portfolio2.0](https://github.com/sameerakhtari/portfolio2.0). Pushing this repository is separate from publishing the website.

The build emits `dist/server/wrangler.json`, a Worker entry, and `dist/client` assets. For a Cloudflare account configured with Wrangler:

```bash
npm run verify
npm run deploy
```

Review the generated Worker name and account before deploying. Set the domain through the hosting provider, and update `site.origin` in `data/site.ts` if it is different from `https://sameerakhtari.com`. Rebuild after changing it so canonical links, structured data, robots and the sitemap agree. If using Sites hosting instead, use the Sites publishing workflow rather than manually editing generated deployment files.

Only source, the lockfile and optimized assets belong in Git. Dependencies, build output, local credentials, preview state, uploaded briefs and working reference images are ignored. No build artifacts are uploaded by a repository workflow.

## Working with a coding agent

Read [.agent/INSTRUCTIONS.md](.agent/INSTRUCTIONS.md) and the public design
decisions. Use a private handoff supplied by the project owner for execution
progress. Reconstruct missing state from actual Git and source.

Execution logs, security findings, private memory and Graphify output stay outside
the public repository. The public file check runs with `npm run verify`; see the
[testing guide](docs/testing.md) to enable the staged-file Git hook.
