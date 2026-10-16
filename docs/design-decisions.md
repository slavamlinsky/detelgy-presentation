# Design decisions — Release 1

## Direction

A person-led editorial story, with a cinematic portrait cover, light analytical slides and dark transformation/vision slides. Large live typography, open layouts, restrained rules and SVG diagrams take precedence over product-like UI cards. The shared canvas is 1920×1080 with 112 px safe insets. Every slide has one narrative purpose.

The same fictional portrait appears on the cover and persona slide to maintain the protagonist. Both instances visibly disclose that it is AI-generated. It is neither a real member nor a testimonial. Network diagrams are conceptual, not maps of existing users.

## Brand evidence and deliberate differences

The original logo PNG and favicon SVG were retrieved unchanged from the public Detelgy website on 15 October 2026. The public stylesheet `/_next/static/chunks/e644a31796842960.css` uses Geist and defines `--main: #235784` and `--main-hover: #4a6fa4`. These values are preserved as website-reference tokens.

The guide's `#01255A` logo anchor is retained as `--brand-navy`; it is not described as the entire official website palette. Ink `#08182E`, paper, pale blue and sky accents are presentation proposals from the guide. Larger type, flatter layouts and minimal rounding intentionally differ from the public website's gradient background and application-oriented UI. Original logo artwork sits on a small white field on dark slides, preserving its colors.

No main application source checkout was found in the inspected workspace or local Detelgy materials. The public stylesheet is observable evidence, not a complete source-token audit. The main application and website were not modified. The inspected local `WORK/Detelgy.com` folder contains reference materials and visual experiments, not the application source.

Geist is locally hosted for consistent rendering and PDF embedding under its SIL Open Font License (license included beside the web asset). No font bundle is offered as a separate downloadable deliverable. Cyrillic coverage must be verified and supplemented in Release 2.

## Conservative resolution of document differences

- The task explicitly limits Release 1 to English. The story's four-locale acceptance criteria and the guide's language-switcher suggestion are deferred. `en`, `es`, `uk`, `ru` are reserved; unavailable translations return 404 rather than silently displaying English.
- Routes use the style guide's `/en/vision` and stable story IDs (`#s01` through `#s14`). The story also proposes `/en`; the explicit presentation route is more extensible.
- “Built” means reported implemented in the internal product brief, not verified live paid operations. On-slide footnotes communicate this limit. Paid marketplace transactions, consulting, mentoring, Academy and publications are labeled planned.
- Fragmentation, persona pains, JTBD, first-value moments and the flywheel remain hypotheses. No invented metrics, biographies, testimonials, endorsements or guaranteed outcomes.
- Draft prices are omitted to avoid presenting proposals as commercial commitments. Free / Plus / Pro and revenue mechanisms remain explicitly proposed.
- Public indexing defaults to noindex. This does not provide access control. Production deployment and an audience decision belong to Release 2.

## Interaction and export

The stage scales an authored canvas without rearranging presentation elements. A separate reading view makes the same structured content readable on phones. Arrow keys, Page Up/Down and Home/End navigate. Native fullscreen and Escape use browser behavior. Browser history tracks slide hashes. A native modal dialog supplies a keyboard-operable overview.

The same Slide component renders interactive, print and PDF views. Playwright generates a cached locale-specific PDF with selectable text and vector diagrams. It is a presentation export, not a screenshot collection. No runtime PDF server or backend is introduced. Regenerate the PDF after changing content, styles or assets.

## Build tool choice

The production build uses Next.js's supported Webpack compiler (`next build --webpack`). Turbopack's CSS worker repeatedly failed to bind a local port in the execution environment. Webpack builds the same App Router application successfully; this does not add a runtime dependency or change deployment requirements.
