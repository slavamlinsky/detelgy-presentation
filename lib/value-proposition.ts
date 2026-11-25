import 'server-only';
import english from '@/content/value-proposition/en.json';
import russian from '@/content/value-proposition/ru.json';
import { getDeck } from './decks';
import type { Deck, Locale } from './presentation';

const fallbackLocale = 'ru';
const content: Partial<Record<Locale, typeof russian>> = { en: english, ru: russian };

const draftLabels = {
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
  const slides = source.slides.map(slide => ({ ...slide, footer: slide.footer ?? '', eyebrow: '', note: '', sources: [] }));
  const fallbackSlideIds = translation ? [] : slides.map(slide => slide.id);

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
    fallbackSlideIds,
    translatedSlideCount: slides.length - fallbackSlideIds.length,
    downloadHref: translation ? `/downloads/detelgy-value-proposition-${locale}.pdf` : undefined,
    slides,
  };
}
