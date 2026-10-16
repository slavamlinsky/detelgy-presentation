# Full V2 deck QA — 16 October 2026

- All fourteen slides use the approved V2 direction. Screenshots captured at 1920×1080 in `qa/slides/` and visually reviewed, including full-resolution checks of the denser persona, platform, loop and career-path scenes.
- TypeScript, content validation and production build passed.
- Final `npm run qa` passed with no page errors or visible text overflow. It covers all 14 slides, keyboard navigation, hash history, overview, notes, fullscreen, clipboard and desktop/tablet/mobile viewport checks.
- The first dev-browser run encountered a transient Next.js Performance.measure timing error. Subsequent completed runs passed without suppressing page errors.
- Expanded bounds checks cover all new story text and ignore intentionally hidden supporting copy.
- PDF regenerated: 14 pages, 16:9, selectable text and native SVG. All pages rasterized and visually reviewed.
- Original full logo remains PNG, rendered white on dark backgrounds; full wordmark SVG still needed.
- No production deployment or new production-server smoke run. The local preview remains available for review.

# Earlier prototype verification

## V2 prototype — 16 October 2026

- Redesigned scope: S01, S02, S10. Other compositions remain V1; shared dark logo treatment is white.
- `npm run typecheck`, `npm run build`, `npm run validate:content`: passed.
- `npm run qa`: passed all 14 slide bounds checks, including V2 HTML and SVG text. No browser page errors. Keyboard navigation, hash history, overview, notes, fullscreen, clipboard and responsive widths passed.
- Captured and manually inspected all three V2 slides at 1920×1080 and within a 1366×768 laptop viewport. No clipped text or diagram labels observed.
- PDF regenerated with 14 pages at 16:9. Rasterized pages 1, 2 and 10 at 1920×1080 and manually inspected: typography, diagrams and positions agree with browser captures.
- Source manifest includes the prototype component. PDF uses browser text and vector SVG, not screenshot pages.
- V1 baseline: `qa/v1/`. V2 review images: `qa/v2/`. Full regression screenshots: `qa/slides/`. Machine report: `qa/report.json`.

## Limitations / review boundary

- Full wordmark SVG is still needed; original PNG currently receives a white CSS treatment on dark scenes. The available SVG is the symbol only.
- English only. No production deployment, motion prototype, or redesign of the other eleven slides.
- The earlier production smoke report belongs to V1; V2 has a passing production build and browser QA against the development preview, not a new deployed-production smoke run.
- PDF has no interactive speaker-notes drawer. Visible hypothesis caveats remain in the PDF; detailed sources are accessible in web speaker notes.
