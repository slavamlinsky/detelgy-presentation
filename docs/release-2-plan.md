# Release 2 implementation plan

1. Approve the English narrative and glossary. Revalidate live product status, commercial proposals and hypotheses before external distribution. Keep research outcomes in the claims register.
2. Add reviewed `es.json`, `uk.json`, `ru.json` dictionaries matching all English keys, including UI labels, diagrams, image descriptions, notes and source disclosures. Use `uk`, never `ua`. Validate structure with `npm run validate:content`.
3. Replace the English-only dictionary lookup with an explicit locale registry. Add each approved locale to `releasedLocales`. Set document `lang`, localized metadata and approved canonical/hreflang rules. Never use automatic English fallback for untranslated content.
4. Add a language selector using `slideHref(locale, currentSlide.id)` so the current slide survives switching. Respect explicit URLs. Optional persisted preference must not override them.
5. Verify font coverage for Cyrillic and accented characters. Test 20–35% text expansion; revise line breaks or layouts before reducing type. Native-speaking professionals must review terminology and claims.
6. Enable export for approved locales only. Build four distinct PDFs using the same print route and locale content, then verify 14 pages, selectable text, diagrams and matching locale metadata. Do not enable a download until its artifact passes QA.
7. Run screenshot and interaction QA for each locale at 1920×1080, laptop and phone sizes. Confirm direct links, history, language preservation, keyboard use, fullscreen, reading view and print.
8. Deploy a separate Vercel project. Begin with a protected preview if needed. Choose the public audience and indexing policy explicitly; noindex alone is not privacy protection. Revalidate product and image permissions before public distribution.
9. Add `promo.detelgy.com` to that project and use the exact DNS records provided by Vercel. Verify TLS and redirects without changing the main app.
10. Optional approved video: add a poster, captions/transcript, user-controlled playback and reduced-motion behavior. Keep it out of PDF and avoid autoplay audio.

Not implemented in Release 1: translations, a language selector, public hosting/domain changes, video, a visual editor, PPTX export, market sizing or financial forecasts.
