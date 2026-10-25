# Detelgy Presentation Studio — Release 1

A standalone Next.js presentation app with 17 English vision slides. The story follows the professional from fragmented effort toward connected growth. This is a hypothesis-led stakeholder vision, not a validated fundraising deck.

## Run locally

Requires Node.js 20.9 or later (Node 22 recommended) and npm.

```sh
npm ci
npm run dev
```

Open [http://127.0.0.1:3000/en/vision](http://127.0.0.1:3000/en/vision). `/` redirects there. A direct slide link uses a stable ID, for example `/en/vision#s08`, or a displayed slide number, for example `/en/vision?slide=12`. Shared links always open in Explore Mode.

- Left/Right and Page Up/Down: navigate.
- Home/End: first/last slide.
- All slides: keyboard-accessible overview.
- Present: opt into presentation controls and request native fullscreen. Escape exits presentation mode.
- The public viewer header shows the Detelgy logo and configured studio label; the information row shows only the active slide's viewer name and the deck count/duration. Most viewer names reuse the existing chapter label; Mission and Grow the Pie have concise viewer-only names without changing their slide content.
- The viewer footer keeps All slides, centered previous/next navigation, Copy slide link and Fullscreen. The progress segments remain clickable. Speaker Notes and Reading Mode are no longer footer controls.
- Speaker notes and sources remain in the structured deck data for a future private Presenter View; the public viewer receives a copy without them.
- Reading view remains available from the mobile slide-information row and is enabled by default on an initial phone visit. It has no desktop footer entry.
- Link icon: copy the current slide URL.
- Download PDF: prebuilt English PDF.

If a browser or embedded preview blocks fullscreen, Present Mode remains usable within the page and shows a fallback message. Browser print renders all 17 slides in order, including when the current presentation is paused at a checkpoint.

### Explore and Present playback

Explore Mode automatically completes each slide. First-visit entrance sequences are capped at approximately 1.8 seconds; returning to a slide shows its completed state. Opening the overview or updating viewer controls does not remount or replay a slide.

Present Mode uses the same slide components and CSS entrance animations. `lib/presentation-playback.ts` configures optional checkpoints by stable slide ID. The current checkpoints are Before/After (08), Cooperation (11), platform revenue (15), market expansion (16), and the final invitation (17). Remove an entry to make that slide entirely automatic. Checkpoint groups use `data-checkpoint` and `checkpointAttributes`; static rendering defaults to all groups visible.

Right/Down, Space and Page Down advance a checkpoint or slide. Left/Up, Shift+Space and Page Up undo the current checkpoint first, then move backward to the previous slide's completed state. Home/End and overview/progress links jump directly to a slide. Finite entrance/reveal animations lock presentation navigation until completion; continuous ambient animation does not. Wheel gestures retain accumulation, cooldown and momentum protection. F controls fullscreen inside Present Mode. Escape restores the complete Explore view. Checkpoint advances do not create browser-history entries.

In Present Mode, a primary mouse click on ordinary slide content uses that same advance handler. Interactive controls, focusable cards/nodes, custom click handlers and regions marked with `data-interactive` or `data-no-slide-advance` keep their own behavior. Put `data-no-slide-advance` on any custom delegated interactive region to exclude it and its descendants. Text selection, dragging, double-click tails and touch-generated clicks do not advance; touch retains swipe navigation. Clicking a slide in Explore Mode does nothing.

The final CTA remains text because no verified joining/onboarding destination is configured. English is the only released locale, so language switching is not yet available.

## Content and source of truth

The four original Markdown briefs remain unchanged under `content/`. Edit the structured English copy in `content/locales/en.json`. It includes slide titles, diagram labels, UI text, image descriptions, notes and evidence references. Layout and theme metadata are separate in `lib/presentation.ts`.

Presentation-level metadata lives in `lib/presentation-meta.mjs`: the viewer title, release, estimated duration and manually maintained `lastUpdated` revision date. Update that date only after meaningful content changes. Slide count comes from the actual deck collection. The viewer formats the revision month in English, Spanish, Ukrainian (`uk`, with `ua` accepted as an alias) or Russian and simplifies the row on narrow screens. Individual slides carry no date. The PDF title, subject, keywords and modification date use the same editorial metadata; the export manifest records its generation time separately. The approved cover remains unchanged apart from removing its old date.

Stable slide IDs and locale helpers reserve `en`, `es`, `uk` and `ru`. Only English is released. Unreleased locale routes return 404; there is no misleading English fallback or premature language switcher. See [Release 2 plan](docs/release-2-plan.md).

`npm run validate:content` validates the 17-slide order, the 14 original stable IDs, the three inserted IDs, basic content requirements and dictionary shape against English. The added slides use `#mission`, `#coopetition`, and `#grow-pie`; original links such as `#s10` and `#s14` remain stable. The invitation at `#s14` now displays as slide 17. See the [current slide index](docs/current-slide-index.md). Future translations must match the English structure and pass editorial review.

## Project structure

| Path | Purpose |
| --- | --- |
| `app/[locale]/vision/` | Locale-aware presentation and print routes |
| `components/studio.tsx` | Navigation, overview, mobile reading view and fullscreen |
| `lib/presentation-playback.ts` | Declarative checkpoints and shared-link resolution |
| `lib/presentation-meta.mjs` | Shared editorial metadata and localized revision formatting |
| `components/slide.tsx` | Shared editable slide rendering |
| `components/diagrams.tsx` | Native SVG networks and flywheel |
| `styles/tokens.css` | Central color, type, spacing, radius, shadow, motion and canvas tokens |
| `content/locales/en.json` | Canonical copy and notes |
| `public/assets/` | Original brand assets, licensed web font, disclosed illustrative portrait |
| `public/downloads/detelgy-vision-en.pdf` | Prebuilt presentation PDF |
| `scripts/` | Export, content validation and browser QA |
| `qa/slides/` | Historical screenshots at 1920×1080; current QA captures are generated as needed |
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

The export route is `/en/vision/print`. Playwright waits for fonts/images, uses print CSS, preserves selectable text and SVG, then verifies the page count against the presentation data in 16:9. The output is cached as a static file, so downloads need no backend or runtime browser. `qa/pdf-manifest.json` records the source hash and export date.

The checked-in PDF is a prebuilt snapshot. Regenerate it with `npm run export:pdf -- en` whenever the downloadable deck should reflect slide edits, then build so deployment includes the current file. Browser print is a convenient alternative; disable browser headers/footers, choose no margins and enable background graphics. The prebuilt Playwright file is the reference export. Notes and navigation controls are excluded from PDF. PPTX is not implemented.

## Verification

With the local app running:

```sh
npm run validate:content
npm run typecheck
npm run qa
node scripts/viewer-qa.mjs
node scripts/playback-qa.mjs
node scripts/navigation-qa.mjs
node scripts/metadata-qa.mjs
node scripts/click-advance-qa.mjs
npm run export:pdf -- en
npm run build
```

`npm run qa` captures the full deck and checks content against footer/safe-area bounds, direct links, browser history, keyboard navigation, overview, fullscreen, clipboard, root redirect, unavailable locales and small viewport width. `node scripts/viewer-qa.mjs` checks the public header, title and footer at desktop and mobile sizes, including notes exclusion. `node scripts/mission-coopetition-qa.mjs` checks Slides 10–11; `node scripts/grow-pie-qa.mjs` checks the penultimate slide, final-slide order, animation, mobile reading and browser print. The focused checks save screenshots outside Git. Screenshots still require human visual inspection. The delivered inspection record for the original release is [docs/qa-report.md](docs/qa-report.md).

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

The approved spatial direction now covers the original 14 slides; Mission, Coopetition, and Grow the Pie extend the sequence to 17. The original S01, S02 and S10 retain their approved prototype compositions and stable IDs. See [visual decisions](docs/visual-redesign-v2.md), [presentation tokens](docs/design-system-v2-proposal.md), and [QA report](docs/qa-report.md). `npm run qa` recaptures the full deck and verifies controls and text boundaries. The cached PDF in `public/downloads/` contains the current 17-slide presentation; regenerate it after content changes as described above.
