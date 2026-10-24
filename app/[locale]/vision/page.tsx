import { notFound } from 'next/navigation';
import { getDeck } from '@/lib/presentation';
import { Studio } from '@/components/studio';
export default async function Vision({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;
 const deck=getDeck(locale);
 if(!deck)notFound();
 const viewerDeck={...deck,slides:deck.slides.map(slide=>({...slide,note:'',sources:[]}))};
 return <Studio deck={viewerDeck}/>;
}
