// Editorial revision metadata. Change lastUpdated only after meaningful content edits.
// Keep this module usable by both the viewer and the standalone PDF export script.
export const presentationMeta = Object.freeze({
  title: 'Our vision for the profession',
  release: 1,
  lastUpdated: '2026-10-26',
  estimatedDuration: '15–20 min',
});

const revisionLocales = {
  en: { locale: 'en-US', label: 'Updated' },
  es: { locale: 'es-ES', label: 'Actualizado' },
  uk: { locale: 'uk-UA', label: 'Оновлено' },
  ru: { locale: 'ru-RU', label: 'Обновлено' },
};

export function presentationRevisionDate() {
  return new Date(`${presentationMeta.lastUpdated}T00:00:00Z`);
}

export function formatPresentationUpdated(locale = 'en') {
  const language = locale.toLowerCase().split('-')[0];
  const format = revisionLocales[language === 'ua' ? 'uk' : language] ?? revisionLocales.en;
  const date = new Intl.DateTimeFormat(format.locale, {
    month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(presentationRevisionDate());
  return `${format.label} ${date}`;
}
