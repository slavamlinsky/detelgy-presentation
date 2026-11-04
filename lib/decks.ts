import 'server-only';
import english from '@/content/locales/en.json';
import ukrainian from '@/content/locales/uk.json';
import { localeDefinition } from './locales.mjs';
import { validateTranslation } from './translation-schema.mjs';
import { resolveTranslation } from './resolve-translation.mjs';
import { presentationMeta } from './presentation-meta.mjs';
import type { Deck } from './presentation';

export function getDeck(locale: string): Deck | undefined {
  if (!localeDefinition(locale)) return undefined;
  if (locale === 'en') return {
    ...english, viewerTitle: presentationMeta.title, translationStatus: 'released',
    fallbackSlideIds: [], translatedSlideCount: english.slides.length,
  } as Deck;
  if (locale === 'uk') {
    validateTranslation(english, ukrainian);
    return {...resolveTranslation(english, ukrainian), fallbackUi: english.ui} as Deck;
  }
}
