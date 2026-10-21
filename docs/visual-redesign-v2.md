# V2 — complete deck

The founder approved the three-slide direction and authorized the remaining slides on 16 October 2026. All fourteen slides now use V2. The original prototype decisions below remain a historical record.

## Full-deck extension

- S03 emphasizes the primary examiner audience with secondary peers connected softly.
- S04 uses a large editorial portrait and three aspirations. The requested name, age, Kyiv location and years of experience are explicitly fictional persona details.
- S05 places an isolated professional between disconnected activities.
- S06 groups the six original pains into visibility, support and opportunity; original items remain in reading view.
- S07 presents four independent professional ambitions in a spacious editorial field.
- S08 uses two wide editorial scenes of the same illustrative David: a modest manual office and a brighter organized workspace. A narrow comparison card is centered across the lower edge of each photograph, with roughly one quarter overlapping the image and the rest below it, so the environment remains the focal point. Each card carries three concise icon-led comparisons and thin illustrative indicators. The earlier five comparisons, capability status, and non-metric nature of the indicators remain qualified in speaker notes.
- S09 connects four product pillars around the professional, with built and planned mechanisms visible.
- S11 uses an open value loop; the hypothesis caveat remains.
- S12 branches into three complementary career paths.
- S13 pairs professional value with proposed revenue mechanisms using open typography.
- S14 closes with a large statement and a restrained network motif.

No new animation, locale, deployment or product capabilities were introduced. Original factual data, reading view and source notes remain available.

---

# V2 — three-slide review prototype

Scope: S01, S02 and S10 only. The other eleven compositions remain V1. The shared dark-background logo now renders white without its white rectangular backing, as separately requested.

## Visual decisions

- **S01:** A 128 px statement and a branching connection graphic replace the portrait. One bright route directs attention toward expanding opportunity. This is a conceptual network, not a performance chart. The shorter visible promise retains the original longer promise in notes.
- **S02:** Large left-aligned statement faces an asymmetric constellation. Three larger islands anchor the seven channels; the professional has no continuous route between them. Node sizes express visual hierarchy, not measured importance. Existing networks' value and the hypothesis caveat remain visible; citations stay in speaker notes.
- **S10:** Five milestones sit on one curved route. Connect is the focal point, paired with the emerging professional's first useful exchange. The practitioner and expert examples remain visible at lower emphasis, so PDF readers receive all three. The original eight steps remain unchanged in `items` and are also spelled out in notes.

All graphic paths, channels, stages and first-value examples have `data-*` hooks for later reveal and focus states. No animation library or new interaction model was introduced. Mobile reading mode, stable hashes, navigation and print use the existing architecture.

## Comparison with V1

Baseline screenshots and the earlier PDF are preserved in `qa/v1/`. V2 screenshots are in `qa/v2/`, including laptop views.

- Cover: photo-led promotion → typographic statement with an opportunity network.
- Fragmentation: numbered explanatory grid → spatial islands with short labels.
- Journey: eight equally weighted cells and three-column band → continuous five-stage path and a single dominant value example.

## Logo asset limitation

The repository contains the original full logo PNG and the original SVG symbol (`favicon.svg`), but no full wordmark SVG was found in the workspace or supplied attachments. The full logo currently uses the genuine transparent PNG with a white CSS treatment on dark backgrounds. This is a temporary rendering treatment, not a fabricated vector asset. Replace its source with the founder's full SVG when supplied, preserving its path geometry and changing only fills for the white variant.

The new cover has no portrait or AI-generated label. No new demographic biography was added to S04 during this three-slide redesign.

## Review boundary

The three-slide review boundary was cleared by the founder. Motion, scrollytelling and translations remain outside this implementation.

## Cover refinement

S01 now uses one spacious ascending trajectory with a distinct starting point, three quiet milestones and an upward arrow destination. The headline and supporting copy are unchanged. No labels or quantitative axes are added: the path is a metaphor for professional development, not measured growth. This supersedes the original branching cover graphic.

### Cover optimization — two-line hierarchy

The headline is now 115 px (10.2% smaller), with “Where expertise becomes” above “opportunity.” The preferred reputation/connections/opportunities subline and global-ecosystem supporting line replace the earlier copy. Three thin-line icons mark identity, peer connection and opportunity along the path; the destination remains the strongest point. No extra labels or character scene were added. Full-size, laptop and PDF cover renders were visually checked; TypeScript passed.

### Cover interaction polish

Five nodes now use radii 24, 25.2, 26.4, 27.6 and 30 px: base, +5%, +10%, +15%, +25%. The three checkpoints retain identity, people and work icons; the destination uses an upward arrow. Hover and keyboard focus brighten the circle and icon and reveal a soft emphasis ring. No tooltip labels are added.

Screen-only entrance: headline 0–400 ms, subline 180–580 ms, supporting line 260–660 ms, trajectory 350–1450 ms, nodes staggered from 350 ms, destination 1450–1700 ms. All motion uses CSS; no animation dependency. Reduced-motion and print render the finished composition immediately. `scripts/cover-motion-qa.mjs` verifies timing, radii, hover, focus, reduced-motion and print fallback. TypeScript and those checks passed; the regenerated 14-page PDF cover was visually inspected.

### Visible sizing and sliding labels

After laptop-scale review, the subtle percentage steps were replaced with 18 / 25 / 32 / 39 / 48 px radii. Icons scale proportionally. Each milestone reveals a short left-sliding label on hover or keyboard focus; labels stay hidden in print. The browser checks confirm the size sequence and visible hover label, as well as the existing motion and print fallbacks.

### Slide 02 — four disconnected worlds

Replaced seven visible channels with Visibility, Clients, Peers and Learning. A larger navy expert anchors the diagram; four interrupted connections replace the decorative dotted arcs. The preferred profiles/clients/peers/learning subline replaces the earlier copy. Removed the rhetorical question and shortened the footer to a working-hypothesis source note. Original channels and factual caveats remain in structured content, reading view and speaker notes. Full-size and laptop captures checked; TypeScript passed and PDF regenerated.

### Slide 02 — interaction polish

Audience takeaway: a professional's world spans four disconnected places. The headline now fits two contrasting lines at 88 px. The subline uses exactly the requested profiles/clients/peers/learning wording. Secondary examples appear only on outer-node hover or keyboard focus; a related broken connector gains emphasis. Center hover/focus adds a 3.5% scale increase and soft ring, lightly emphasizing all four links and outer nodes without revealing their details. No repeating pulse or icon replacement.

Entrance lasts 1.45 seconds: headline, supporting text, expert, then four staggered fragments with connector drawing. Reduced-motion and print bypass the entrance; print hides secondary details and hover emphasis. TypeScript passed. `scripts/fragment-motion-qa.mjs` passed all four detail/link checks, focus, center highlighting, reduced motion and print checks. Full-resolution still, laptop hover captures and regenerated PDF page 2 were visually inspected. Existing detailed channels and sources remain in content and notes.


## Slide 02 refinement and deck footer policy — 16 October 2026

The central label is “Polygraph Examiner”; a static, faint globe grid reinforces the global context behind the four fragments. Existing staggered entrance, hover and focus details remain. The latest consolidated brief specifies the supporting sentence without reviews; services and reviews remain in Clients hover detail.

Visible slide footers contain only the folio; existing branding/date remain in headers. Internal research annotations, implementation notes and generic disclaimers belong in speaker notes. Former footer qualifications are retained in notes alongside existing sources. Specific market statistics and external research findings require concise on-slide citations; hypotheses must not be presented as validated findings. The cover ecosystem signoff remains supporting copy, not a footer annotation.

Per user instruction, continue screenshot QA after updates and defer PDF regeneration until all slide updates are finished. The existing downloadable PDF is therefore an earlier snapshot.


### Slide 02 atmospheric globe refinement
Globe opacity rises from 0.12 to 0.138 (+15%). One narrow meridian ellipse is removed to reduce intersections. An inner SVG group drifts six degrees over 90 seconds, gently alternating direction; node geometry remains fixed. Motion is screen-only, independent of hover, and disabled for reduced motion and print. PDF export remains deferred.


### Slide 02 motion revision: stationary globe, drifting fragments
Supersedes all globe rotation experiments. The muted-blue globe is static (0.20 opacity, 1.8px stroke). Each category and its broken connector drifts within its original quadrant on a small 22×14px elliptical route over 90 seconds. Counter-rotation keeps icons and text upright. Hover or keyboard focus on any outer node or the center pauses all four routes, preserving existing emphasis and progressive details. Motion runs only on the active screen slide with no reduced-motion preference. PDF regeneration remains deferred.

### Slide 02 full circular orbit — 17 October 2026
Supersedes the local elliptical drift: all four category cards now travel clockwise around the fixed examiner on one 300px-radius circle, completing a revolution every 240 seconds. Cards counter-rotate so icons, labels and hover details stay upright; broken connectors rotate with their category. Hover/focus pauses both rotations together. Globe stays static. Verified quarter-turn positions, upright transforms, seamless loop, interaction, reduced motion, and static print styles. PDF generation remains deferred.


### Slide 02 orbit spacing and speed
Orbit slowed to 480 seconds (eight minutes), with radius increased from 300px to 350px so card centers sit near the globe perimeter. Broken connectors extend to the new positions. Upright labels, hover/focus pause and accessibility behavior are preserved.

## Slide 03 — Who We Serve redesign
Audience takeaway: different career stages share one ambition to grow; independent examiners are the initial focus, complemented by emerging professionals and established experts.

Ice-blue #E6F2FC canvas, navy #102541 headline and #24699E second line, with #526D86 supporting copy. Three coherent SVG character prototypes replace the branching diagram. Center artwork is 17% larger with a deeper blue backdrop. Visible labels are minimal, with one JTBD revealed on hover/focus. Primary audience appears first, peers follow, then two quiet non-directional connecting lines. Reduced motion is static; print styles expose the JTBD text without hover. Speaker notes retain qualifications and explicitly distinguish audiences from product levels or a fixed sequence. PDF regeneration deferred per user preference. Asset brief recorded in docs/assets.md.


### Slide 03 growth motif
The compass rose was removed after user feedback about its resemblance to the NATO emblem. A faint, asymmetric botanical sprout now supports the growth message behind the secondary copy. Portraits and layout remain unchanged.


## Slide 04 — Meet David, primary persona
Slide 04 now introduces who the independent examiner is and what he wants; barriers remain for Slide 05. The existing portrait occupies 38% of the content width on #E8F3FC. David · 46, Kyiv, Ukraine, Independent Polygraph Examiner and the Illustrative persona label remain legible over the portrait. The headline is two lines with a deeper-blue second line. Experience, Goal and Ambition are large, unboxed editorial blocks. Existing sources and notes are preserved, with David's fictional narrative context added. Portrait → headline → three dimensions reveal in 1.15 seconds, with reduced-motion and print fallbacks. Only a single-slide review PDF is generated for this request; the full deck PDF remains deferred.


### Slide 04 entrance refinement
Sequence: photo (0–450ms), caption (450–800ms), headline (800–1150ms), Experience / Goal / Ambition at 1150 / 1330 / 1510ms. Fully revealed by 1860ms. Reduced motion and print remain fully visible. Review PDF export is now opt-in via `node scripts/persona-qa.mjs --pdf`.

## Slide 05 — The hidden workload
The takeaway is that a capable examiner faces competing responsibilities beyond examinations. The six-island network is replaced with an illustrated David at his desk surrounded by four unboxed demands: Serve Clients, Find New Business, Build Connections, Keep Growing. The existing dark navy canvas, white headline and sky-blue second line retain editorial hierarchy. No connector network, orbit, or continuous motion. David reveals first, followed by the four demands at 250ms intervals; everything is visible by 1.6 seconds. Reduced motion and print show the complete state. Notes preserve the hypothesis qualification and the value of existing communities. Slides 04 and 06 are unchanged from the Slide 04 checkpoint. Screenshot QA at 1920×1080 and laptop scale, static print visibility, animation timings and reduced motion verified. Full-deck PDF remains deferred.

### Slide 05 structured two-column refinement
Supersedes the floating-demand composition at the user's request. David anchors the left column; the right column contains the two-line headline, balanced two-line supporting copy, and a strict 2×2 grid. Four lightly bordered cards each have a small icon, title and concise supporting sentence. Content remains visible without hover; hover/focus adds tonal, border and icon emphasis. Entrance order is headline, subline, David, then the four cards, completed in 1.65 seconds. Screenshots, hover/focus, reduced motion and fully visible print styling verified. No other slide content changed.

## Slide 06 — barriers to growth
Slide 06 now acts as a moment of friction between Slide 05's portrait-and-card workload and Slide 07's professional ambitions. On an ice-blue canvas, three staggered frosted thresholds represent Visibility, Support and Opportunity. The headline acknowledges existing expertise; the doors remain closed, since this slide establishes barriers rather than solving them. Short explanations stay readable in the static state and gain contrast on hover or focus. Its first headline line, second line, supporting copy, and three barriers reveal in distinct beats, finishing in about three seconds. Reduced-motion and print states are fully visible. The six earlier exploratory pain themes remain named in speaker notes; the three visible barriers are explicitly illustrative hypotheses, not universal findings. Screenshot, one-page PDF, bounds, focus/hover, animation and notes checks passed.

## Slide 07 — four dimensions of professional success
The four ambitions are independent Jobs To Be Done, not chronological stages. A warm off-white canvas carries a single editorial headline, a two-line supporting sentence, and four equal visual vignettes. Custom line illustrations depict peer learning, professional credibility, collaboration, and potential earning paths. The former wave and tiny icons are removed. Each illustration and its text reveal together in a restrained stagger; hover or focus adds blue emphasis without hiding essential content. Speaker notes retain the working-hypothesis and no-guaranteed-outcome qualifications. Slide 06 and Slide 08 remain unchanged. The 1920×1080 still, laptop view, single-page PDF rendering, animation timings, hover/focus, reduced motion, content validation, and production build were checked.

Final polish removes the visible 01–04 numbering, since the ambitions are independent. The supporting line is now “Every professional defines success differently.” The four illustrations grow from 180 to 202 px (+12%); the last illustration shows parallel routes toward examinations, consultations and mentorship instead of a currency symbol. The composition, motion, interactions, notes and 07 / 14 folio remain intact. The refreshed print screenshot and single-slide PDF were visually inspected.
