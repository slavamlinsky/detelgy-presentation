import 'server-only';
import english from '@/content/locales/en.json';
import russian from '@/content/locales/ru.json';
import spanish from '@/content/locales/es.json';
import ukrainian from '@/content/locales/uk.json';
import { localeDefinition } from './locales.mjs';
import { validateTranslation } from './translation-schema.mjs';
import { resolveTranslation } from './resolve-translation.mjs';
import { presentationMeta } from './presentation-meta.mjs';
import type { Deck } from './presentation';

const translations = { es: spanish, ru: russian, uk: ukrainian };

export function getDeck(locale: string): Deck | undefined {
  if (!localeDefinition(locale)) return undefined;
  if (locale === 'en') return {
    ...english, viewerTitle: presentationMeta.title, translationStatus: 'released',
    fallbackSlideIds: [], translatedSlideCount: english.slides.length,
  } as Deck;
  const translation = translations[locale as keyof typeof translations];
  if (translation) {
    validateTranslation(english, translation);
    return {...resolveTranslation(english, translation), fallbackUi: english.ui} as Deck;
  }
}
