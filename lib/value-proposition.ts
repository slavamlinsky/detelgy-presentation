import 'server-only';
import russian from '@/content/value-proposition/ru.json';
import { getDeck } from './decks';
import type { Deck, Locale } from './presentation';

const fallbackLocale = 'ru';
const content: Partial<Record<Locale, typeof russian>> = { ru: russian };

const draftLabels = {
  en: {
    title: 'Value Proposition',
    slideFallback: 'Slides are shown in Russian while the translation is in progress.',
  },
  es: {
    title: 'Propuesta de valor',
    slideFallback: 'Las diapositivas se muestran en ruso mientras se prepara la traducción.',
  },
  uk: {
    title: 'Ціннісна пропозиція',
    slideFallback: 'Слайди відображаються російською, поки готується переклад.',
  },
};

export function getValueProposition(locale: string): Deck | undefined {
  const viewer = getDeck(locale);
  if (!viewer) return undefined;

  const translation = content[locale as Locale];
  const source = translation ?? russian;
  const draft = translation ? undefined : draftLabels[locale as keyof typeof draftLabels];
  const slides = source.slides.map(slide => ({ ...slide, eyebrow: '', note: '', sources: [] }));

  return {
    route: 'value-proposition',
    locale,
    title: draft?.title ?? source.title,
    viewerTitle: draft?.title ?? source.title,
    description: source.description,
    revision: source.revision,
    ui: { ...viewer.ui, slideFallback: draft?.slideFallback ?? viewer.ui.slideFallback },
    translationStatus: translation ? 'released' : 'draft',
    fallbackLocale,
    fallbackSlideIds: translation ? [] : slides.map(slide => slide.id),
    translatedSlideCount: translation ? slides.length : 0,
    downloadHref: translation ? `/downloads/detelgy-value-proposition-${locale}.pdf` : undefined,
    slides,
  };
}
