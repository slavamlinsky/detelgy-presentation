import { notFound } from 'next/navigation';
import { getDeck } from '@/lib/presentation';
import { Slide } from '@/components/slide';
export default async function Print({params}:{params:Promise<{locale:string}>}) { const {locale}=await params; const deck=getDeck(locale); if(!deck)notFound(); return <div className="export-deck">{deck.slides.map((slide,index)=><Slide key={slide.id} slide={slide} index={index} ui={deck.ui} total={deck.slides.length}/>)}</div>; }
