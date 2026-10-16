# Detelgy — Presentation Art Direction V2

**Version:** 2.0 / Creative redirection · **Date:** 2026-10-16  
**Status:** Approved direction for the next visual prototype; precise execution remains subject to design review.  
**Applies to:** `promo.detelgy.com` — 14-slide stakeholder deck, future scrollytelling experience, PDF exports, future video.  
**Primary language for Release 1:** English. **Release 2:** Spanish (`es`), Ukrainian (`uk`), Russian (`ru`).

## 0. How this document relates to the other briefs

Read together with:
- `detelgy-product-brief.md` — factual product and roadmap context;
- `detelgy-icp-personas-jtbd.md` — audiences, jobs, pains, outcomes;
- `detelgy-investor-story.md` — narrative, slide intent, evidence;
- `detelgy-design-style-guide.md` — brand baseline, design tokens, presentation requirements.

**Precedence:** This V2 document **overrides the earlier design guide on composition, density, visual hierarchy, iconography and motion style**. Preserve the original document for brand anchors, accessibility, localization, evidence discipline and exports. Product facts, statuses and investor claims come from the product/story briefs, not this creative guide. If documents conflict, flag rather than silently invent a compromise.

**Primary creative instruction:** Move away from tidy but dense consulting/report slides toward **spatial, editorial, diagram-first storytelling** inspired by the strengths of Prezi (focus, scale, zoom, relationships), **without imitating dizzying Prezi transitions**.

## 1. What the first prototype gets wrong

Two first-round screenshots of slides 02 and 10 were reviewed on 2026-10-16.

### Slide 02 — fragmented ecosystem
- Seven numbered items are distributed across a near-uniform grid. This *describes* fragmentation but doesn't *show* it.
- Similar heading and label sizes give every item equal emphasis.
- Footnotes, sources and repeated page furniture dilute the story.
- Substantial visual space is present, yet it does not create a focal point.

### Slide 10 — customer journey
- Eight small stages arranged in a 4×2 grid feel like a process checklist, not a journey.
- Tiny arrows between cells are not strong enough to express progress or movement.
- Three persona-specific moments in a full-width band become another table.
- Everything appears at once, limiting the sense of discovery.

**Diagnosis:** The current deck is competent as an informational report, but too dry and overloaded for a compelling stakeholder story. **Do not fix by adding icons to every cell or applying entrance animations to the existing grids. Redesign the underlying composition.**

## 2. Creative north star

### **An expert's world expands.**

We follow the change from an isolated professional navigating disconnected tools to someone connected to people, knowledge, recognition and opportunities around the world.

Five emotional beats:
1. **Isolation** — a capable person with limited reach.
2. **Fragmentation** — many useful places, no integrated professional journey.
3. **Connection** — expertise meets peers, mentors and opportunities.
4. **Momentum** — each contribution builds visible reputation.
5. **Expansion** — multiple ways to learn, earn and lead.

The visual language evolves across the presentation: **separate dots → connections → routes → constellations → a coherent global network**. This is a recurring motif, not an infographic repeated unchanged on every slide.

Desired traits: **human, confident, aspirational, intelligent, airy, modern, credible**. Avoid sterile corporate grid templates, sci-fi surveillance, police motifs, stock-photo handshakes and overly glossy “AI startup” imagery.

## 3. Five design laws

1. **One idea per viewport.** Start with the audience takeaway, not the list of things the designer wants to fit.
2. **One hero element.** At least one clear visual or typographic focal point is perceptible from across the room.
3. **Spatial relationships over boxes.** Prefer deliberate placements, curved lines, layers and negative space over repeated card grids.
4. **Progressive disclosure.** Details can arrive on clicks/scroll; the final static slide must still tell a coherent story.
5. **Credibility by design.** Source notes, assumptions and planned-vs-live distinctions remain accessible; don't let cinematic composition obscure substance.

Use a simple editing heuristic: **if five things fight for equal attention, recompose, group or remove them**.

## 4. Art direction: typographic scale and density

The following are **target authoring sizes at 1920×1080**, not literal CSS values for arbitrary browser widths. Scale proportionally in Slide Mode. Do not blindly apply them to the Detelgy app UI.

| Role | Suggested size | Typical use |
|---|---:|---|
| Hero statement | 92–128 px | 1–2 bold lines; 7–12 words max |
| Main slide headline | 72–96 px | One sharp proposition; max ~2 lines |
| Featured concept / stage name | 44–64 px | Journey milestones and large nodes |
| Short supporting sentence | 30–40 px | One or two lines |
| Secondary node label | 26–34 px | Diagram labels; reduce quantity before size |
| Small context / source | 18–24 px | Required credibility layer |

Use font weight, contrast, whitespace and size before adding shapes. Long headings should be edited, not automatically shrunk. **Avoid all-caps eyebrows on every slide**; use occasionally as a subtle chapter cue. Highlight a single key word or phrase with blue, not six phrases.

**Density budget per viewport:** typically 1 headline + 1 brief support line + 1 dominant graphic + 3–5 visible concepts. Six or more concepts need either grouping, separate reveals, or a legitimate analytical exception. An 8-stage model may exist in source content but need not appear simultaneously as eight equal boxes.

**Whitespace:** on narrative slides reserve roughly 25–40% as *intentional negative space*. Keep footer/navigation minimal and low contrast. Remove repeated large branded headers if they weaken the story; retain brand identity through color, motifs and a small logo where appropriate.

## 5. Composition vocabulary

Use a *small intentional family* of visual structures rather than one slide template:

1. **Statement canvas:** enormous headline, small supporting line, subtle branded linework.
2. **Hero + constellation:** dominant concept or human on one side; 3–5 organically placed connected nodes on the other.
3. **Fragmented islands:** separated clusters with no/faint links; visually resolves later into a connected system.
4. **Continuous journey:** one flowing path with emphasized milestones, not a spreadsheet of steps.
5. **Orbit / ecosystem:** single professional at center, interconnected opportunities around it; avoid symmetric bubbles of equal size.
6. **Before / after panorama:** two strongly contrasting states with one visual transformation across them.
7. **Flywheel:** one clear loop with directional flow and restrained labels; no tiny crowded arrows.
8. **Evidence insert:** occasional structured, information-dense analytical view; treat as a purposeful rhythm change, not default composition.
9. **Visual editorial portrait:** believable professional imagery, generous cropping, headline in safe negative space.
10. **Full-bleed finale:** emotional, simple and memorable.

Use varied alignment, deliberate asymmetry, generous visual scale, and sectional contrast. Avoid multiple rows of equally sized cards, seven numbered circles, thick borders, large tinted panels for every item and excessive micro-copy.

## 6. Brand treatment and palettes

Preserve the **actual Detelgy logo** and brand DNA. Verify original logo/CSS token values from repository rather than assuming complete site styles. Existing proposed tokens in `detelgy-design-style-guide.md` remain a starting point, especially dark navy (`#01255A` from an earlier SVG), deep ink, soft sky blue and off-white.

**Visual rhythm:**  
- **Dark scenes** for isolation, network reveal, dramatic transitions and vision.  
- **Light scenes** for clarity, personas, evidence, JTBD and economics.  
- **Bridging scenes** can transition through pale blue and graphic network strokes.

Don't alternate dark/light mechanically. Color change should track the emotional narrative. Keep accent usage disciplined; avoid rainbow personas unless genuinely necessary and accessible. No visual claim that unverified projections are measured outcomes.

## 7. Signature Detelgy graphic motifs

### Motif A — Nodes and bridges
Simple open circles, professional identities and fine lines. Disconnected clusters express fragmentation; bridges express discovery and connection. Allow varied node sizes to signal conceptual priority, *not unverified quantitative dominance*.

### Motif B — The growth path
A single directional curved trajectory that can continue across frames. Use as a narrative backbone for Customer Journey and scrollytelling. Large milestones, not tiny pipeline arrows.

### Motif C — Reputation signal
An expanding ring, subtle signal pulse or visible accumulation of contributions. Use sparingly: credibility should come from product evidence, not fake engagement scores.

### Motif D — Human + ecosystem
A genuine, non-stereotyped professional image or simplified avatar shape with an adjacent web of peers, mentorship, services and publications. Avoid imagery suggesting lie detection is infallible.

### Motif E — Opportunity expansion
An expanding field of paths for practice growth, consulting, mentorship and learning. Represent *opportunities*, not guaranteed revenue.

**Icons:** Use a coherent Lucide-like thin-line system with a single stroke language. Icons only where they accelerate comprehension. Avoid icons for decorative symmetry; prefer **0–5 meaningful icons on a typical slide**. Keep icons secondary to headline and dominant visual.

## 8. Art-direction treatments for all 14 slides

| Slide | Mode | Primary visual direction | What to avoid |
|---|---|---|---|
| S01 Promise | Cinematic editorial | Bold oversized transformation headline and one restrained branded connection motif | Generic product dashboard cover |
| S02 Fragmentation | Spatial diagram | 6–7 channel **islands** arranged deliberately around an implied professional center; disconnected groups and one focal question | 7 numbered items in a tidy grid |
| S03 Segment | Analytical editorial | One primary ICP large; secondary audiences indicated softly | Equal-priority audience cards |
| S04 Persona | Human-centered | One professional portrait/illustration with 3 large surrounding tensions or aspirations | Resume/profile facts in dense list |
| S05 Life today | Narrative scene | One expert at center; disconnected tools and channels as distant satellites | Repeated small callout boxes |
| S06 Core pains | Kinetic typographic | 3 big thematic pains at first; optional progressive second layer | 7 equal complaint cards |
| S07 JTBD | Conceptual diagram | Four powerful verbs with simple iconography and one path linking outcomes | Four generic SaaS feature tiles |
| S08 Before/After | Contrast transformation | Wide split scene or landscape transition; 3–4 paired contrasts | Exhaustive comparison table |
| S09 Growth platform | Ecosystem graphic | Five value pillars as connected systems orbiting the professional | Product feature dump |
| S10 Journey | Continuous path | **5 major milestones** on a big sweeping route; subsidiary stages disclosed only when needed; three Aha examples as focused reveals | 8 miniature stages in a 4×2 grid |
| S11 Flywheel | Loop | Large central circular value cycle, phases brought into focus sequentially | Small uniformly spaced cards |
| S12 Paths to success | Branching paths | One shared starting point branching to Practitioner, Expert and Leader | 3 lengthy biography columns |
| S13 Economics | Before/after value landscape | From a single revenue stream to a few distinct opportunity streams; assumptions clearly labelled | Fabricated numerical uplift charts |
| S14 Vision | Cinematic finale | Confident human/global composition, one memorable mission line and Detelgy logo | Feature recap |

**Story may be recomposed, not distorted.** Keep important explanatory material available in speaker notes, optional detail panels or the analytical appendix where applicable. Any slide that currently carries essential citations should retain a legible source note or an accessible source drawer; do not silently delete evidence.

## 9. Detailed corrective direction — S02

**Current:** heading and 7 scattered but evenly weighted entries plus a right-hand source column and footer.

**New headline (candidate):**  
> **A global profession.**  
> **Still disconnected.**

**Supporting phrase:** Professional identity, clients, peers and learning live in separate places.

**Composition:**
- Left 45%: headline in large type with abundant negative space.
- Right 55%: asymmetric **fragmented constellation** (website, referrals, groups, association, education, social, local discovery).
- Use 3–4 *larger cluster labels*, with smaller satellites representing remaining channels. This is not a pie chart and conveys no measured proportions.
- A pale broken arc / unconnected strokes imply disconnected professional journeys without falsely claiming channels provide no value.
- Place the caveat about fragmentation being a working hypothesis in a legible compact note; preserve links to verified association examples in sources/notes.

**Proposed reveal:** 1) statement; 2) islands emerge; 3) dashed non-connections become visible; 4) final question: “What if expertise could move between them?”  
**Static export:** all labels and the main message remain visible and coherent, without relying on staged animation.

## 10. Detailed corrective direction — S10

**Current:** 8 stages as 4×2 uniform process cells and an always-visible band with three persona moments.

**New headline (candidate):**  
> **From joining to growing.**

**Supporting phrase:** The first valuable moment is different for every professional.

**Composition:**
- A **single sweeping journey path** across the slide with **five large stages**: `Discover → Join → Connect → Build reputation → Grow`.
- Use human-scaled visual hierarchy; the current stage is large, previous/future ones quieter (not necessarily hidden).
- Under the active milestone, show **one persona-specific Aha Moment** as a single spotlight callout at a time; include Practitioner, Established Expert, Emerging Professional states for presenter interaction.
- The full eight-step logical flow remains in structured content/notes; it is *grouped for visual storytelling*, not deleted.
- At a static PDF state show the main five-stage journey and a compact 3-line set of distinct first-value examples if required.

**Proposed reveal:** line traces and anchors appear with step progress. Use optional click-to-reveal for persona examples. No aggressive camera movement.

## 11. Motion system — design now, build after visual approval

**First make three static samples outstanding.** Motion must reinforce meaning and be a progressive enhancement, never a mask for weak design.

Motion vocabulary:
- **Reveal:** opacity + 12–24 px translation, 300–500 ms.
- **Sequential focus:** 90–160 ms offset between related nodes; total opening sequence should not demand long waiting.
- **Path draw:** line length grows to connect revealed nodes; understated.
- **Attention shift:** focal element smoothly changes emphasis while others reduce contrast slightly.
- **Spatial zoom/pan:** very small controlled transforms for chapter transitions; no disorienting spins or rapid scale jumps.
- **Dark-to-light scene transition:** simple crossfade/color interpolation, not expensive effects for their own sake.

Modes:
- **Slide Mode:** optional automatic intro, plus click/arrow to reveal conceptual steps before navigating. Preserve intuitive backward navigation.
- **Scroll Mode (later POC):** scroll-linked chapter progress, reversibility and only selective sticky/pinned scenes. Don't hijack normal scrolling.
- **PDF/print/screenshot:** force fully revealed, deterministic static rendering; do not export invisible fragments.

Respect `prefers-reduced-motion`, motion off switch if practical, keyboard navigation, focus order, touch input, performant transform/opacity animation and stable layout. Heavy GSAP ScrollTrigger use is *not required for Release 1*; consider it for a small scrollytelling POC after the slide system is approved.

## 12. Responsiveness and multilingual constraints

- **Slide Mode:** design at 16:9 and scale to viewport without clipping; prefer letterboxing when necessary rather than squeezing everything into two columns on narrow mobile screens.
- **Scroll Mode:** later use true responsive re-composition (large pinned diagrams become vertical progressive sections on small screens).
- Large type must survive longer ES/UK/RU translations: write concise text, allow flexible line breaks and preserve minimum readable sizes.
- Locale switch should preserve chapter/slide, but this is **Release 2**, not current scope.
- Maintain accessible contrast and readable source text. Provide static fallback and alt descriptions for meaningful conceptual diagrams.

## 13. Implementation strategy: do not redesign all slides in one pass

**Milestone A — Static visual exploration**
1. Audit first-round S02 and S10 screenshots against V2 principles.
2. Build static revisions of **S01, S02 and S10**: statement, fragmented constellation, sweeping journey.
3. Capture 1920×1080 screenshots and one narrower viewport screenshot for each.
4. Review composition: can a viewer state the main message in three seconds?
5. Iterate the designs before building the other eleven slides.

**Milestone B — Whole deck**
6. Convert remaining slides to assigned archetypes, preserving factual content and evidence.
7. Audit repetition: no adjacent slides with the same grid/card structure unless necessary.
8. Validate PDF exports, print states and text legibility.

**Milestone C — Motion prototypes**
9. Add subtle reveal to S02 and path progression to S10; review comfort, performance and storytelling value.
10. Scale motion patterns selectively, not globally.

**Milestone D — Future scrollytelling POC**
11. Prototype only “Isolation → Connection” as a scrolling chapter after the deck's static art direction is approved.
12. Evaluate whether shared content and motifs truly translate to both modes; avoid creating two separate content truths.

## 14. Quality gates / acceptance checklist

**Content**
- [ ] User transformation is clear without speaker narration.
- [ ] 14-slide factual story is preserved; planned vs live features remain distinguishable.
- [ ] No fabricated market metrics, testimonials, income results or partnerships.
- [ ] Sources and uncertainty markers are accessible and legible.

**Visual**
- [ ] The two previously flat slides (S02, S10) have truly new *spatial* compositions, not the same grid with bigger fonts.
- [ ] At least one unambiguous focal point per slide.
- [ ] Narrative screens present no more than 3–5 equal-weight concepts at once.
- [ ] Hero typography is appropriately large; supporting copy is short and readable.
- [ ] Consistent network, path and signal motifs without monotony.
- [ ] Icons have a consistent style and semantic use.
- [ ] No uncontrolled overflow at 16:9, fullscreen or export size.

**Engineering**
- [ ] Reusable React/SVG primitives rather than raster screenshots of slides.
- [ ] Existing logo and brand assets preserved.
- [ ] No unauthorized modifications to the main Detelgy repo.
- [ ] Content separate from layout and prepared for four languages.
- [ ] PDF rendering fully revealed and deterministic.
- [ ] Motion is optional, accessible, reversible and not required for comprehension.

## 15. Creative decision rule

If a slide is accurate but looks like a report, **first change the information hierarchy and visual metaphor**, not the color, icon count or animation library. Use graphics to make *relationships understandable*, not to fill empty space.

**Final creative target:** The deck should feel as if the audience is **traveling through an expert's expanding professional world** — with room to breathe, clear evidence and moments of visual delight.
