// ISO language codes: Ukrainian is uk; ua is a country code.
/** @type {readonly {code: 'en' | 'uk' | 'es' | 'ru', name: string, shortLabel: string, enabled: boolean}[]} */
export const localeDefinitions = [
  { code: 'en', name: 'English', shortLabel: 'EN', enabled: true },
  { code: 'uk', name: 'Українська', shortLabel: 'УК', enabled: true },
  { code: 'es', name: 'Español', shortLabel: 'ES', enabled: false },
  { code: 'ru', name: 'Русский', shortLabel: 'RU', enabled: false },
];
export function localeDefinition(code) {
  return localeDefinitions.find(locale => locale.code === code && locale.enabled);
}
