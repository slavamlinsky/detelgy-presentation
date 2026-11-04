function shape(value, prefix = '') {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = `${prefix}.${key}`;
    return child && typeof child === 'object' ? shape(child, path) : [path];
  }).sort();
}
function validateValues(source, target, path) {
  for (const [key, value] of Object.entries(source)) {
    const location = `${path}.${key}`;
    if (value && typeof value === 'object') {
      if (!target[key] || typeof target[key] !== 'object' || Array.isArray(value) !== Array.isArray(target[key])) throw new Error(`${location}: object/array structure must match English`);
      validateValues(value, target[key], location);
    }
    else {
      if (typeof value !== typeof target[key]) throw new Error(`${location}: expected ${typeof value}`);
      if (typeof value === 'string' && value.trim() && !target[key].trim()) throw new Error(`${location}: translation is empty`);
      if (['id', 'status', 'secondaryStatus'].includes(key) && value !== target[key]) throw new Error(`${location}: structural value must match English`);
    }
  }
}
export function validateTranslation(english, translation) {
  if (!['draft', 'released'].includes(translation.status)) throw new Error('Translation status must be draft or released.');
  if (!Array.isArray(translation.slides)) throw new Error('Translation slides must be an array.');
  if (JSON.stringify(shape(english.ui)) !== JSON.stringify(shape(translation.ui))) throw new Error('Viewer UI dictionary must match English keys.');
  validateValues(english.ui, translation.ui, 'ui');
  for (const field of ['title', 'description', 'viewerTitle']) {
    if (typeof translation[field] !== 'string' || !translation[field].trim()) throw new Error(`Translation ${field} is required.`);
  }
  const seen = new Set();
  for (const slide of translation.slides) {
    const original = english.slides.find(candidate => candidate.id === slide.id);
    if (!original) throw new Error(`Unknown slide ID: ${slide.id}`);
    if (seen.has(slide.id)) throw new Error(`Duplicate slide ID: ${slide.id}`);
    seen.add(slide.id);
    if (JSON.stringify(shape(original)) !== JSON.stringify(shape(slide))) throw new Error(`${slide.id}: supply the complete slide with the same fields and item structure as English.`);
    validateValues(original, slide, slide.id);
  }
  if (translation.status === 'released' && seen.size !== english.slides.length) throw new Error('A released translation must include every slide.');
}
