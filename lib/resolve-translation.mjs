// Whole-slide replacements prevent accidental mixtures of translated and English fields.
export function resolveTranslation(english, translation) {
  const byId = new Map(translation.slides.map(slide => [slide.id, slide]));
  const fallbackSlideIds = english.slides.filter(slide => !byId.has(slide.id)).map(slide => slide.id);
  return {
    ...english,
    ...translation,
    ui: translation.ui,
    slides: english.slides.map(slide => byId.get(slide.id) ?? slide),
    fallbackSlideIds,
    translatedSlideCount: english.slides.length - fallbackSlideIds.length,
    translationStatus: translation.status,
  };
}
