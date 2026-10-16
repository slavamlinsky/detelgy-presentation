# Asset provenance

All local copies are presentation assets. No main application files were changed.

| Local file | Origin | Treatment |
| --- | --- | --- |
| `public/assets/detelgy-logo.png` | https://detelgy.com/_next/static/media/detelgy-logo.d003665c.png | Original artwork, retrieved 15 Oct 2026, unmodified; native aspect ratio preserved |
| `public/assets/favicon.svg` | https://detelgy.com/favicon-light.svg | Original artwork, unmodified |
| `public/assets/GeistVF.woff` | https://detelgy.com/_next/static/media/GeistVF-s.p.4c3c0b96.woff | Website font self-hosted for deterministic rendering; SIL OFL license included |
| `public/assets/Geist-LICENSE.txt` | https://raw.githubusercontent.com/vercel/geist-font/main/LICENSE.txt | Official license |
| `public/assets/professional-portrait.png` | Built-in imagegen, 15 Oct 2026 | Fictional professional illustration, disclosed on S01/S04; no member identity or testimonial |
| `components/diagrams.tsx` | Authored editable SVG | Conceptual diagrams, no claimed geographic/user data |
| Lucide icons | `lucide-react` package | ISC licensed line icons; bundled package license applies |

Public stylesheet reference: https://detelgy.com/_next/static/chunks/e644a31796842960.css, inspected read-only on 15 Oct 2026. It defines Geist, `--main: #235784`, `--main-hover: #4a6fa4`, and a gradient-oriented website background. The presentation's additional palette and spacing are documented proposals.

The portrait prompt and future Magnific direction are in `image-prompts.md`. Retain the original aspect ratio for the cover. The persona crop deliberately uses the same fictional protagonist.

## Slide 03 — editorial persona prototypes
`components/audience-personas.tsx` contains an original, coherent SVG character set for three complementary audiences. These are conceptual illustrations, not real members or demographic definitions. Shared proportions, directional shading, layered jackets and a restrained blue palette provide a vector prototype for future 2.5D scroll-story assets.

For final illustrated assets: commission or generate one coordinated set of three waist-up professional figures (emerging, independent examiner, established expert), consistent lighting, perspective and mature editorial styling, transparent backgrounds, minimum 900px height. Preserve the center figure's 17% size emphasis, with no rank badges or sequential progression. Avoid demographic coding of audience roles; the figures represent examples, not eligibility criteria.

### Slide 03 portrait replacement — 17 October 2026
The earlier SVG prototype set is replaced with three coordinated dimensional character portraits generated using the built-in image tool, inspired by the user's reference. Final transparent PNG assets: `public/assets/personas/emerging-3d.png`, `examiner-3d.png`, and `expert-3d.png`. Full prompts and reference roles: `docs/persona-image-prompts.md`. These are fictional illustrated characters, not actual members; this qualification remains in speaker notes. The earlier commission brief is superseded by these integrated assets.
