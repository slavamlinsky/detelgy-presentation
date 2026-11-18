import { notFound } from 'next/navigation';
import { ValuePropositionSlide } from '@/components/value-proposition-slide';
import { getValueProposition } from '@/lib/value-proposition';

export default async function Print({ params }: { params: Promise<{ locale: string }> }) {
  const deck = getValueProposition((await params).locale);
  if (!deck || deck.translationStatus !== 'released') notFound();

  return <main className="export-deck">{deck.slides.map((slide, index) => (
    <ValuePropositionSlide key={slide.id} slide={slide} index={index} total={deck.slides.length} />
  ))}</main>;
}
