# Detelgy Presentation Studio — Release 1

A standalone Next.js presentation app with 14 English vision slides. The story follows the professional from fragmented effort toward connected growth. This is a hypothesis-led stakeholder vision, not a validated fundraising deck.

## Run locally

Requires Node.js 20.9 or later (Node 22 recommended) and npm.

```sh
npm ci
npm run dev
```

Open [http://127.0.0.1:3000/en/vision](http://127.0.0.1:3000/en/vision). `/` redirects there. A direct slide link uses a stable ID, for example `/en/vision#s08`.

- Left/Right and Page Up/Down: navigate.
- Home/End: first/last slide.
- All slides: keyboard-accessible overview.
- Present: native fullscreen. Escape exits.
- Speaker notes: context, limitations and sources.
- Reading view: readable content on small screens; enabled by default on an initial phone visit.
- Link icon: copy the current slide URL.
- Download PDF: prebuilt English PDF.

If a browser or embedded preview blocks fullscreen, the app shows a fallback message. Browser print renders all 14 slides in order.

## Content and source of truth

The four original Markdown briefs remain unchanged under `content/`. Edit the structured English copy in `content/locales/en.json`. It includes slide titles, diagram labels, UI text, image descriptions, notes and evidence references. Layout and theme metadata are separate in `lib/presentation.ts`.

Stable slide IDs and locale helpers reserve `en`, `es`, `uk` and `ru`. Only English is released. Unreleased locale routes return 404; there is no misleading English fallback or premature language switcher. See [Release 2 plan](docs/release-2-plan.md).

`npm run validate:content` validates 14 IDs, basic content requirements and dictionary shape against English. Future translations must match the English structure and pass editorial review.

## Project structure

| Path | Purpose |
| --- | --- |
| `app/[locale]/vision/` | Locale-aware presentation and print routes |
| `components/studio.tsx` | Navigation, overview, notes, reading view and fullscreen |
| `components/slide.tsx` | Shared editable slide rendering |
| `components/diagrams.tsx` | Native SVG networks and flywheel |
| `styles/tokens.css` | Central color, type, spacing, radius, shadow, motion and canvas tokens |
| `content/locales/en.json` | Canonical copy and notes |
| `public/assets/` | Original brand assets, licensed web font, disclosed illustrative portrait |
| `public/downloads/detelgy-vision-en.pdf` | Prebuilt presentation PDF |
| `scripts/` | Export, content validation and browser QA |
| `qa/slides/` | All 14 screenshots at 1920×1080 |
| `qa/viewports/` | Desktop, laptop, tablet, mobile and fullscreen captures |
| `qa/pdf/` | Rasterized exported pages for visual QA |
| `docs/` | Design decisions, evidence and release plans |

## Export PDF

Keep the app running in one terminal. In another:

```sh
# macOS: installed Google Chrome is used by default.
# Other environments: install the Playwright browser once.
npx playwright install chromium
npm run export:pdf -- en
```

For another local port, set `BASE_URL`. To use a specific Chromium binary, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

The export route is `/en/vision/print`. Playwright waits for fonts/images, uses print CSS, preserves selectable text and SVG, then verifies 14 pages in 16:9. The output is cached as a static file, so downloads need no backend or runtime browser. `qa/pdf-manifest.json` records the source hash and export date.

**During the current slide-by-slide review, PDF regeneration is deferred until all slide updates are finished.** The checked-in PDF is an earlier snapshot and does not yet include the latest refinements. Continue screenshot QA during iteration, then regenerate and verify the PDF before publishing. Build after the final export so deployment includes the current file. Browser print is a convenient alternative; disable browser headers/footers, choose no margins and enable background graphics. The prebuilt Playwright file is the reference export. Notes and navigation controls are excluded from PDF. PPTX is not implemented.

## Verification

With the local app running:

```sh
npm run validate:content
npm run typecheck
npm run qa
npm run export:pdf -- en
npm run build
```

`npm run qa` captures all 14 slides and checks content against footer/safe-area bounds, direct links, browser history, keyboard navigation, overview, notes, fullscreen, clipboard, root redirect, unavailable locales and small viewport width. Screenshots still require human visual inspection. The delivered inspection record is [docs/qa-report.md](docs/qa-report.md).

PDF verification uses Poppler to rasterize the output and inspect every page. Tools are not required to run the app. If installed locally:

```sh
mkdir -p qa/pdf
pdftoppm -scale-to 1920 -png public/downloads/detelgy-vision-en.pdf qa/pdf/slide
pdfinfo public/downloads/detelgy-vision-en.pdf
```

## Production build and future deployment

```sh
npm run build
npm start
```

For Release 2, create a **separate Vercel project**, choose Next.js, use `npm ci` and `npm run build`, and include the verified `public/downloads` artifacts. No environment secrets, database or application backend are needed. Enable preview deployments first. Public deployment and DNS changes were not performed for Release 1.

After audience/content/translation review, add `promo.detelgy.com` in Vercel and use the exact DNS target it provides. Do not change the main Detelgy application's project or domain. Default metadata is `noindex`; this is not authentication. Use platform protection for confidential versions.

## Design and accuracy

See [design decisions](docs/design-decisions.md), [claims register](docs/claims-register.md), [asset provenance](docs/assets.md), and [image prompts](docs/image-prompts.md).

Product features labeled built are reported implemented by the internal brief and are not independently verified paid operations. Planned services, commercial proposals, personas and growth hypotheses are explicitly distinguished. No fabricated market size, traction, revenue, testimonials or guaranteed results are included.

## V2 visual review

The approved spatial direction now covers all 14 slides. S01, S02 and S10 retain their approved prototype compositions. See [visual decisions](docs/visual-redesign-v2.md), [presentation tokens](docs/design-system-v2-proposal.md), and [QA report](docs/qa-report.md). Full-resolution screenshots are in `qa/slides/`; the complete PDF is in `public/downloads/`. `npm run qa` recaptures the full deck and verifies controls and text boundaries.
