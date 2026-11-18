import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Studio } from '@/components/studio';
import { localeDefinitions } from '@/lib/locales.mjs';
import { getValueProposition } from '@/lib/value-proposition';

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return localeDefinitions.filter(locale => locale.enabled).map(({ code }) => ({ locale: code }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const deck = getValueProposition((await params).locale);
  if (!deck) notFound();

  return {
    title: `Detelgy — ${deck.title}`,
    description: deck.translationStatus === 'released' ? deck.description : '',
  };
}

export default async function ValueProposition({ params }: PageProps) {
  const deck = getValueProposition((await params).locale);
  if (!deck) notFound();
  return <Studio deck={deck} />;
}
