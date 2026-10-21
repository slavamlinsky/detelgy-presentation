import { ClipboardCheck, Megaphone, Settings2, BookOpen } from 'lucide-react';
import type { SlideContent } from '@/lib/presentation';
export function WorkloadScene({slide}:{slide:SlideContent}) {
  const icons=[ClipboardCheck,Megaphone,Settings2,BookOpen];
  return <div className="workload-scene">
    <div className="workload-person"><img src="/assets/personas/david-workload.png" alt="Illustrated David, composed at his desk with a notebook"/></div>
    <div className="workload-grid">{slide.items.map((item,i)=>{const Icon=icons[i];return <section className="workload-demand" data-demand={i} key={item.title} tabIndex={0}>
      <Icon size={40} strokeWidth={1.35} aria-hidden="true"/>
      <h3>{item.title}</h3>
      <p>{item.body}</p>
    </section>})}</div>
  </div>;
}
