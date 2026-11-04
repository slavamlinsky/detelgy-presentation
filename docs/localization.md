# Presentation localization

English (`en`) is canonical and released. Ukrainian uses the ISO language code `uk` and is fully translated and released at `/uk/vision`, including its downloadable PDF. `ua` is not a language route. Spanish and Russian are reserved in `lib/locales.mjs` and stay unavailable until their content is registered.

## Slide-by-slide workflow

1. Open the canonical slide in `content/locales/en.json` and copy its **complete object** into the `slides` array in `content/locales/uk.json`.
2. Translate its visible copy, viewer title/chapter, accessible descriptions and presenter notes. Retain its stable `id`, structural fields, item order, feature status values and supporting references. Do not change the canonical English object.
3. Inspect the corresponding component for any inline SVG labels, hover text, CTA text or image descriptions that still need to be moved into the slide dictionary. This groundwork does not translate or refactor approved slide designs; those strings must be handled with each slide's translation.
4. Run `npm run validate:content` and `npm run translation:status -- uk`.
5. Review `/uk/vision#<stable-id>` at presentation scale, on mobile, with keyboard/focus, in reduced motion and in Present Mode. Verify Ukrainian line wrapping before marking the slide ready.

Only add a slide object once its translation is ready for review. Missing objects are intentionally pending; do not copy all English slides into the Ukrainian file as placeholders. The loader replaces whole slides and preserves canonical order even if translations are added in a different order.

During draft translation, the localized viewer shows progress and explicitly identifies English fallback slides. Released, complete translations show no draft notice. Fallback slides retain English slide labels and language attributes; viewer controls remain Ukrainian. Speaker notes and source references are stripped from the public viewer on the server. Translated notes belong with their slide and remain private to a future presenter view.

`npm run translation:status -- uk` lists every displayed slide number, stable ID and translation status. Translated-slide count is derived from the actual overrides; it is not edited manually.

## Locale routing and viewer UI

- `lib/locales.mjs` is the locale registry. The header selector lists enabled locales with their native names.
- `lib/decks.ts` loads content on the server. `lib/resolve-translation.mjs` resolves whole-slide overrides; `lib/translation-schema.mjs` validates shape, structural values, unique IDs and release completeness.
- Each translation dictionary contains a complete `ui` object, plus its localized `viewerTitle`, description, explicit `status` and slide overrides.
- Language switching preserves the active stable slide ID, displayed slide query and other URL query parameters. It returns to Explore Mode; switching language never activates a presenter checkpoint.
- Browser history keeps locale changes. Both hash and `?slide=` deep links work in either language.
- Locale root layouts render the correct server-side `<html lang>`. The `/` entry route keeps its English redirect. The font, slides, navigation model and animation system are shared.

## Release and PDF

Keep `status: "draft"` during translation. After all 17 slides (including component-level copy) pass review, change it to `"released"`. Validation rejects a released translation with missing slides. PDF export is blocked for drafts, and the header does not offer a mixed-language PDF.

Then run the server and `npm run export:pdf -- uk`. This writes `public/downloads/detelgy-vision-uk.pdf` and `qa/pdf-manifest-uk.json`; the header then offers the Ukrainian download. Commit both files. English keeps its existing filename and `qa/pdf-manifest.json`.

`npm run check:pdf` checks every released locale. Shared rendering/source/asset changes invalidate all released PDFs; editing only `uk.json` does not invalidate the English PDF. Build does not generate PDFs automatically. The revision date remains manually maintained in `lib/presentation-meta.mjs`; do not change it just because a build or translation preview was opened.

For an additional locale: enable it in the registry, add its complete UI/metadata dictionary, register its server-side loader and an unavailable manifest in `lib/presentation.ts`, and apply this same draft/release workflow. Do not expose a PDF or call a locale released before translation and export are complete.

## Verification

`node scripts/localization-qa.mjs` checks draft validation, partial override resolution, rejected malformed translations, locale switching, deep links/history, native language attributes, English fallback integrity, PDF gates, presenter checkpoints and mobile layout. Screenshots are written to the operating system temporary directory, not Git.
