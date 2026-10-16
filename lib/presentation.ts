import english from '@/content/locales/en.json';
export const locales = ['en', 'es', 'uk', 'ru'] as const;
export type Locale = typeof locales[number];
export const releasedLocales: readonly Locale[] = ['en'];
export type SlideId = `s${string}`;
export type FeatureStatus = 'built' | 'planned' | 'concept';
export interface SlideItem { title: string; body?: string; label?: string; outcome?: string; detail?: string; status?: string; secondaryStatus?: string; steps?: string[]; }
export interface SlideContent { id: string; chapter: string; title: string; accent: string; lead: string; eyebrow: string; items: SlideItem[]; footer: string; note: string; sources: string[]; displayItems?: SlideItem[]; persona?: {name:string;detail:string;label:string}; stages?: string[]; prompt?: string; diagramAlt?: string; momentsLabel?: string; columns?: string[]; center?: string; foundation?: string; moments?: SlideItem[]; closing?: string; cta?: string; }
export interface Deck { locale: string; title: string; description: string; ui: typeof english.ui; slides: SlideContent[]; }
export function getDeck(locale: string): Deck | undefined { return locale === 'en' ? english : undefined; }
export function slideHref(locale: Locale, id: string) { return `/${locale}/vision#${id}`; }
export function pdfHref(locale: Locale) { return `/downloads/detelgy-vision-${locale}.pdf`; }
export const slideMetadata = [
  { id: 's01', layout: 'cover', theme: 'dark' },
  { id: 's02', layout: 'fragmentation', theme: 'light' },
  { id: 's03', layout: 'segments', theme: 'light' },
  { id: 's04', layout: 'persona', theme: 'light' },
  { id: 's05', layout: 'islands', theme: 'dark' },
  { id: 's06', layout: 'problems', theme: 'light' },
  { id: 's07', layout: 'jobs', theme: 'light' },
  { id: 's08', layout: 'comparison', theme: 'dark' },
  { id: 's09', layout: 'pillars', theme: 'light' },
  { id: 's10', layout: 'journey', theme: 'light' },
  { id: 's11', layout: 'flywheel', theme: 'dark' },
  { id: 's12', layout: 'paths', theme: 'light' },
  { id: 's13', layout: 'business', theme: 'light' },
  { id: 's14', layout: 'closing', theme: 'dark' },
] as const;
