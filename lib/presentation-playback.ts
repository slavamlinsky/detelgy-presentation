import type { SlideContent } from './presentation';

export type PresentationCheckpoint = { id: string; label: string };
export type SlidePlayback = { checkpoints: readonly PresentationCheckpoint[] };

// Stable content IDs, rather than displayed slide numbers, keep shared links intact.
// Each checkpoint reveals the matching data-checkpoint group using the slide's CSS.
export const presentationPlayback: Readonly<Record<string, SlidePlayback>> = {
  s08: { checkpoints: [{ id: 'transformation', label: 'Reveal With Detelgy' }] },
  coopetition: { checkpoints: [{ id: 'cooperation', label: 'Reveal Cooperation' }] },
  s13: { checkpoints: [{ id: 'revenue', label: 'Reveal platform revenue' }] },
  'grow-pie': { checkpoints: [{ id: 'expansion', label: 'Reveal the growing market' }] },
  s14: { checkpoints: [{ id: 'invitation', label: 'Reveal the closing invitation' }] },
};

export function checkpointsFor(id: string) {
  return presentationPlayback[id]?.checkpoints ?? [];
}

export function checkpointAttributes(step: number, checkpoint = 1) {
  const hidden = step < checkpoint;
  return {
    'data-checkpoint': checkpoint,
    'data-reveal-hidden': hidden ? true : undefined,
    'aria-hidden': hidden ? true : undefined,
  } as const;
}

export function slideIndexFromUrl(url: URL, slides: readonly Pick<SlideContent, 'id'>[]) {
  const hashIndex = slides.findIndex(slide => slide.id === url.hash.slice(1));
  if (hashIndex >= 0) return hashIndex;
  const requested = url.searchParams.get('slide');
  if (requested && /^\d+$/.test(requested)) {
    const index = Number(requested) - 1;
    if (index >= 0 && index < slides.length) return index;
  }
  const queryIndex = slides.findIndex(slide => slide.id === requested);
  return Math.max(0, queryIndex);
}

export function slideNavigationUrl(current: URL, id: string, index: number) {
  const url = new URL(current);
  url.hash = id;
  if (url.searchParams.has('slide')) url.searchParams.set('slide', String(index + 1));
  return `${url.pathname}${url.search}${url.hash}`;
}
