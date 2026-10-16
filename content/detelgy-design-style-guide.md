# Detelgy — Presentation Design & Visual Storytelling Guide

**Version:** 1.0 (working specification)  
**Date:** 2026-10-15  
**Primary language:** English  
**Target:** `promo.detelgy.com` — multilingual presentation site  
**Audience:** investors, stakeholders, professional partners, future Industry Leaders  
**Status:** proposed presentation system; validate exact web design tokens against the Detelgy source repository before implementation.

---

## 1. Purpose and design principle

Create a cohesive, premium, credible presentation experience that is recognizably Detelgy, but more cinematic and editorial than the existing application UI.

**Brand story:** Turn expertise into opportunity.  
**User transformation:** Isolated local practitioner → connected, recognized and more successful professional.  
**Primary promise:** Help polygraph professionals strengthen expertise, reputation, connections and earning opportunities.  
**Emotional progression:** Isolation → connection → confidence → recognition → opportunity.

Design for **clarity, professional trust and human achievement**. Avoid a generic cybersecurity, interrogation, surveillance or law-enforcement aesthetic. The protagonist is the professional, not the polygraph machine.

### Brand baseline: currently observable on detelgy.com

- The public site foregrounds a **professional network for certified polygraph experts**, case discussions, peer insights, reputation and community growth.
- It uses community explanations, illustrated product flows, membership benefits, and a global professional narrative.
- The public interface offers English, Spanish, Ukrainian and Russian.
- The presentation should express the **broader future product vision** (community, marketplace, consultations, mentorship, academy, publications), while clearly distinguishing live features from planned ones.
- **Do not infer exact typography, UI spacing or colors from textual website access.** Inspect `detelgy.com` source styles, logo SVG and screenshots during implementation.

## 2. Brand anchors vs proposed improvements

| Dimension | Preserve from Detelgy | Presentation enhancement |
|---|---|---|
| Identity | Existing Detelgy name, logo, brand blue | Larger whitespace and decisive typography |
| Trust | Verified experts, professional profiles, knowledge sharing | Evidence-first diagrams, restrained visual language |
| Community | Human connections and expert collaboration | Human-centered documentary imagery |
| Global | Multilingual and cross-border reach | Fine-line connection maps, language-aware layouts |
| Product | Real Detelgy UI and screenshots | Polished screenshot frames and explanatory callouts |
| Growth | Expertise, reputation, marketplace opportunities | A single narrative arc, not feature catalogs |

**Non-negotiable:** use the actual Detelgy logo artwork; do not ask image models to redraw its lettering or symbol.

## 3. Proposed design tokens (must be verified)

The dark blue `#01255A` is taken from a previously shared Detelgy logo SVG fill; it is a useful anchor, **not a verified complete website palette**. The remaining colors are presentation design proposals, not claims about the site's exact CSS.

| Token | Hex | Role |
|---|---|---|
| `brand.navy` | `#01255A` | Existing SVG blue anchor, headings, brand accents |
| `presentation.ink` | `#08182E` | Cinematic dark slide background |
| `presentation.deepBlue` | `#102C53` | Dark gradient/support surfaces |
| `presentation.paper` | `#FFFFFF` | Data and explanation slides |
| `presentation.canvas` | `#F5F8FC` | Light alternate background |
| `presentation.text` | `#14243B` | Primary copy on light backgrounds |
| `presentation.muted` | `#63738A` | Secondary copy on light backgrounds |
| `presentation.sky` | `#5CA9E6` | Proposed highlight for links, nodes, focal ideas |
| `presentation.ice` | `#D8ECFA` | Light highlights and map lines |
| `presentation.line` | `#DCE5EF` | Grid lines and dividers |
| `presentation.success` | `#27856D` | Minimal, evidence-backed positive status |

### Usage

- Favor **dark / light alternation**, not 14 identical navy slides.
- Dark cinematic backgrounds: cover, problem, transformation, vision.
- Light backgrounds: ICP, JTBD, customer journey, business model, metrics.
- Main emphasis: one accent color per slide, not rainbow-coded cards.
- Do not use green to simply decorate financial or success slides.
- Do not place large amounts of body copy on gradients or photography.
- Validate contrast at real presentation size; body text needs strong foreground/background separation.

## 4. Typography

**Proposed:** `Inter` (or existing Detelgy UI font if consistent and available). For exceptionally short editorial headlines, an optional display face may be tested, but avoid multiple competing typefaces.

For 1920 × 1080 design canvas (scaling proportionately):

| Level | Working size | Recommendation |
|---|---:|---|
| Hero headline | 84–112 px | 1–3 lines, max ~12 words |
| Slide title | 56–76 px | Decisive claim, not a category label |
| Section lead | 34–44 px | Short evidence or contextual sentence |
| Body | 28–36 px | Minimal; avoid dense bullet blocks |
| Labels / chart axes | 22–28 px | Readable on a projected screen |
| Footnotes / sources | 18–22 px | Only where necessary; never hide limitations |

- Use sentence case for most slide titles; no default all-caps headings.
- Keep slide headlines under ~90 characters and ideally much shorter.
- Use real text in HTML/React, not rasterized text inside AI-generated backgrounds.
- Localization must allow +20–35% length expansion without reducing type below legible size.
- For ES, UK and RU ensure font Cyrillic and accented-character coverage.

## 5. Layout and composition

- **Aspect ratio:** 16:9, authored for 1920 × 1080; works in full-screen browser and PDF export.
- **Safe inset:** approximately 100–130 px on desktop; preserve safe areas in screenshots and PDF.
- **Grid:** 12 columns, 24–32 px gutters; design responsive rather than fixed-pixel-only.
- **One slide, one takeaway**; no wall of content.
- Use asymmetric composition on narrative slides; symmetrical structure for comparisons.
- Maintain a consistent small logo position and subtle slide index, unless the slide is a full-bleed cover.
- Prefer 2–4 visible content elements per slide, not 8 cards competing for attention.
- Limit corner rounding; cards should not mimic an app dashboard unless showing actual product UI.

### Slide archetypes

1. **Statement:** oversized headline + one atmospheric visual.
2. **Tension:** two contrasting states or isolated nodes.
3. **Persona:** portrait + clear goals, barriers and situation.
4. **Problem:** one focal pain statement + compact supporting pains.
5. **Framework:** 3–5 concise pillars with visually consistent icons.
6. **Journey:** progressing stages with motivations and value moments.
7. **Flywheel:** 5–7 legible steps with directional connectors.
8. **Evidence:** key number / quote / source and caveat.
9. **Product proof:** real annotated screenshot, never fictitious UI presented as live.
10. **Final vision:** restrained brand statement and CTA.

## 6. Visual storytelling

### Narrative arc

- **Act 1: Today** — A skilled examiner may be professionally isolated, locally visible, dependent on referrals.
- **Act 2: Friction** — Connections, reputation, support and opportunities are fragmented.
- **Act 3: Detelgy** — A professional ecosystem creates better connections and discovery.
- **Act 4: Outcome** — Learn, contribute, become known, find opportunities, earn, lead.
- **Act 5: Business** — Mutual professional success drives engagement and monetization.

### The protagonist

Depict credible working professionals from multiple countries and backgrounds. Avoid stereotypes of any country, gender or age. Favor natural office, conference, mentoring and online collaboration scenes. Polygraph equipment may be contextual but must not dominate the brand narrative.

### Imagery treatment

- Documentary/editorial realism; contemporary office and professional learning environments.
- Natural expressions, real activity, believable equipment/context.
- Cinematic lighting reserved for key narrative slides; clean light backgrounds for analysis.
- Avoid stock-photo handshakes, holographic brains, lie detector needles, neon cyber grids, and spy imagery.
- Use AI-generated persona images as **illustrations**, not representations of actual Detelgy members or testimonials.
- If displaying a real expert's identity, profile, quote or portrait, obtain appropriate permission and check accuracy.

## 7. Diagrams and information design

Use SVG/React diagrams with genuine text so that all language variants stay editable.

### Signature visual patterns

**Before / After:** local, fragmented, solitary → global, connected, recognized. Do not overpromise guaranteed income.  
**Value chain:** Expertise → Visibility → Trust → Opportunities → Income.  
**Four value pillars:** Connect, Grow, Build Reputation, Earn.  
**Global foundation:** Multilingual accessibility supports every pillar.  
**Flywheel:** Participation → Useful content → Discovery / reputation → Trust → Opportunities → Success stories → Participation.  
**Career paths:** Practitioner / Expert / Leader as different routes to professional success, not hierarchical human worth.

### Diagram rules

- Use consistent node sizes and line weights; no unnecessary gradients inside flows.
- Show a single primary reading direction wherever possible.
- Avoid unsupported percentages, growth curves or numerical axes.
- Every market number, quote or asserted traction metric must have a source, date and definition.
- Clearly label *illustrative*, *planned*, and *validated* examples.

## 8. Slide system — 14-slide blueprint styling

| # | Message / content | Archetype | Suggested treatment |
|---:|---|---|---|
| 01 | Where expertise becomes opportunity | Statement | Dark hero; human professional + restrained global connections |
| 02 | A global profession, a fragmented ecosystem | Tension / evidence | Light map/network with cited market context |
| 03 | Our beachhead: independent, growth-oriented examiners | Segment | Light focused segment diagram |
| 04 | Primary ICP: ambitious independent examiner | Persona | Credible photo + friction/opportunity columns |
| 05 | A skilled professional can still be invisible | Today | Dark editorial frame, fragmented activities |
| 06 | Friction spans visibility, learning, clients and income | Problem | Light 4–6 pain clusters; no feature logos |
| 07 | The four jobs experts hire Detelgy to do | JTBD | Structured grid, strong verbs |
| 08 | From isolated specialist to recognized professional | Transformation | Dark split before/after |
| 09 | Connect, Grow, Build Reputation, Earn | Framework | Light pillar diagram, Global by Design beneath |
| 10 | A journey from discovery to leadership | Journey | Clear horizontal or stepped path |
| 11 | More participation can strengthen the ecosystem | Flywheel | Minimal network loop, hypotheses clearly marked |
| 12 | Different professionals follow different success paths | Paths | Three parallel tracks, non-hierarchical |
| 13 | Broader professional opportunity, multiple revenue streams | Economic logic | Light evidence-led system; no invented revenue |
| 14 | The professional home for a global community | Vision | Dark brand-led closing slide |

**Investor adaptation:** this is a stakeholder/vision deck, not a complete fundraising deck. Market sizing, competitors, traction, distribution, unit economics, team, financial forecast, and funding ask should be added only when properly researched and validated.

## 9. Actual product vs future vision

Separate three visual states in authoring metadata:

- `live`: built and verifiable in current Detelgy.
- `planned`: specified or on the roadmap, not yet available.
- `concept`: hypothetical or illustrative opportunity.

Do not fabricate real dashboard screenshots. Annotate actual product screenshots; label future interface mockups as concepts.

## 10. Four-language system

**Languages:** EN (canonical master), ES, UK, RU. Ukrainian language code is `uk`, not `ua`.

**Recommended URLs:**

- `/en/vision`
- `/es/vision`
- `/uk/vision`
- `/ru/vision`

Root `/` should redirect to `/en/vision` initially, optionally honoring a persisted user language choice on later visits.

**Implementation model:** maintain stable language-neutral slide IDs and locale dictionaries, e.g. `content/locales/en/vision.json`, `es/vision.json`, `uk/vision.json`, `ru/vision.json`. Do not translate on every page view. Keep charts, alt text, source footnotes, slide metadata, and downloads localized. Preserve brand name `Detelgy` unchanged.

### Language switch behavior

- Switch language without losing the current slide, e.g. EN slide 08 → ES slide 08.
- Preserve slide ID in route, query or hash and persist chosen language as appropriate.
- Export PDFs using the active locale, with complete localized content.
- Include alternate-language URLs (`hreflang`) and canonical URL rules if public indexing is enabled.
- Add appropriate document `lang` metadata.
- Review translations by speakers knowledgeable about polygraph terminology; automatic output alone is not quality assurance.

## 11. Responsive and motion behavior

- Desktop: cinematic full-screen 16:9 slide mode.
- Smaller screens: fit the slide without clipping, with optional scrollable reading mode where appropriate.
- Keyboard: ←/→ slide navigation, Home/End, Escape from full-screen.
- Touch: visible next/previous controls, swipe only if it does not interfere with text selection.
- Motion: fade, subtle slide or progressive diagram revelation; typically 200–450 ms, no gratuitous parallax.
- Support `prefers-reduced-motion` and keyboard accessibility.
- Keep transitions consistent and do not autoplay sound.

## 12. Exports and shareability

- Browser presentation must render with real type, sharp vector diagrams and image assets.
- PDF export: 16:9, one slide per page, correct locale, legible footnotes, no broken content or clipped characters.
- Ensure font availability/embedding as permitted; do not distribute font files.
- PPTX export is a **later enhancement** unless a reliable editable implementation is verified. Avoid promising fully editable PowerPoint if slides are raster-only.
- Shared links should open a specific presentation and slide; social preview image, title, description and favicon should be localized when feasible.

## 13. promo.detelgy.com information architecture

**Initial single-presentation scope:**

```text
promo.detelgy.com/
  /en/vision
  /es/vision
  /uk/vision
  /ru/vision
```

**Potential expansion:**

```text
/{locale}/vision
/{locale}/partners
/{locale}/industry-leaders
/{locale}/investors
```

Use a separate Vercel project and deployment, not an unreviewed modification of the main Detelgy application. Match existing brand assets and source-of-truth product facts; do not expose private investor details by default on publicly indexable pages.

## 14. Two-release implementation plan

### Release 1 — English design and technical foundation

- Build all 14 EN slides with real content and reusable components.
- Inspect existing Detelgy logo/colors/fonts and replace any provisional token values.
- Build working presentation navigation, full-screen mode and PDF export.
- Implement locale infrastructure and language selector (unfinished locales clearly disabled or hidden on production).
- Conduct screenshot-based visual QA at desktop and mobile sizes.
- Check legal/permission concerns for portraits, quotes, member data and source images.
- Ship an EN preview (or EN public version if approved).

### Release 2 — Localization and public site

- Complete ES, UK and RU copy; terminology and layout review.
- Ensure every slide, chart, note, image alt description and PDF export is localized.
- Add locale routes and stable language switching.
- Review accessibility, responsive behavior, share previews and SEO tags.
- Deploy to Vercel and connect `promo.detelgy.com` DNS.
- Optional: add the vision video once produced and approved.

## 15. Codex implementation constraints

1. Read `detelgy-product-brief.md`, `detelgy-icp-personas-jtbd.md`, and `detelgy-investor-story.md` before implementing slides.
2. Read this style guide; use it as the presentation visual source of truth after validating brand-specific tokens.
3. Inspect actual Detelgy site/app design tokens, fonts and original logo; do not guess and silently call them canonical.
4. Separate content, presentation layout, translations, navigation and export logic.
5. Use native HTML/SVG content for text and diagrams; images may be supporting layers.
6. Keep business claims traceable to a source, or visibly label them hypotheses/planned concepts.
7. Prefer a simple maintainable site over building an entire slide-editor SaaS.
8. Capture screenshots of **every slide**, detect cropping/overflow, and iterate before completion.
9. Provide a concise release checklist and record limitations of PDF/PPTX exports.
10. Do not add imagined product capabilities merely to fill space.

## 16. Visual QA checklist

- [ ] Recognizably Detelgy; exact original logo used
- [ ] One meaningful proposition per slide
- [ ] Strong headline hierarchy
- [ ] Readable at 1080p and laptop scale
- [ ] Balanced sequence of dark cinematic and light evidence slides
- [ ] No invented market numbers, endorsements or product UI
- [ ] Correct citation/source notes and roadmap labels
- [ ] No cropped graphics or orphan words
- [ ] Sufficient contrast, keyboard accessibility and reduced-motion handling
- [ ] Responsive small-screen presentation
- [ ] PDF pages visually match web slides
- [ ] Translations preserve meaning and fit available space (Release 2)
- [ ] Consistent brand treatment, text spacing and iconography
- [ ] Proper asset permissions and image alt descriptions

---

**Final creative direction:** Not “a software toolkit for polygraph examiners,” but **a credible, human, global professional success story**. Present community, marketplace, mentorship, education and publishing as interconnected mechanisms through which experts can become more capable, visible, connected and commercially successful.
