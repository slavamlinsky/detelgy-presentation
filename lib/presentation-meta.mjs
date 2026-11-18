// Editorial revision metadata. Change lastUpdated only after meaningful content edits.
// Keep this module usable by both the viewer and the standalone PDF export script.
export const presentationMeta = Object.freeze({
  title: 'Our vision for the profession',
  release: 1,
  lastUpdated: '2026-11-17',
  estimatedDuration: '15–20 min',
});

const revisionLocales = {
  en: { locale: 'en-US', label: 'Updated' },
  es: { locale: 'es-ES', label: 'Actualizado' },
  uk: { locale: 'uk-UA', label: 'Оновлено' },
  ru: { locale: 'ru-RU', label: 'Обновлено' },
};

/** @param {string} lastUpdated */
export function presentationRevisionDate(lastUpdated = presentationMeta.lastUpdated) {
  return new Date(`${lastUpdated}T00:00:00Z`);
}

/**
 * @param {string} locale
 * @param {string} lastUpdated
 */
export function formatPresentationUpdated(locale = 'en', lastUpdated = presentationMeta.lastUpdated) {
  const language = locale.toLowerCase().split('-')[0];
  const format = revisionLocales[language === 'ua' ? 'uk' : language] ?? revisionLocales.en;
  const date = new Intl.DateTimeFormat(format.locale, {
    month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(presentationRevisionDate(lastUpdated));
  return `${format.label} ${date}`;
}

/**
 * @param {string} locale
 * @param {string} estimatedDuration
 */
export function formatPresentationDuration(locale = 'en', estimatedDuration = presentationMeta.estimatedDuration) {
  const language = locale.toLowerCase().split('-')[0];
  return ['uk', 'ua', 'ru'].includes(language)
    ? estimatedDuration.replace('min', language === 'ru' ? 'мин' : 'хв')
    : estimatedDuration;
}
