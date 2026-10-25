import type { SlideContent } from "@/lib/presentation";
import { Handshake, Target } from "lucide-react";
import { checkpointAttributes } from "@/lib/presentation-playback";

export function MissionContent({ slide }: { slide: SlideContent }) {
  const [opening] = slide.title.split(slide.accent);
  return <div className="mission-composition">
    <span className="mission-eyebrow">{slide.eyebrow}</span>
    <h2><span>{opening}</span><em>{slide.accent}</em></h2>
    <p className="mission-promise">{slide.lead}</p>
    <img className="mission-illustration" src="/assets/mission-elevator.png" alt="Professionals arrive individually at an elevator, enter one by one, and rise together inside the lift." />
    <p className="mission-statement">{slide.closing}</p>
  </div>;
}

export function CoopetitionContent({ slide, step = 1 }: { slide: SlideContent; step?: number }) {
  return <div className="coop-composition">
    <svg className="coop-network" viewBox="0 0 680 300" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M27 223 C99 156 150 176 213 133 S328 72 396 115 S514 208 635 133" />
        <path d="M107 76 C165 51 219 66 270 104 S377 184 450 163 S555 87 657 59" />
        <path d="M213 133 C233 193 304 224 364 211 S447 172 450 163" />
      </g>
      <g fill="currentColor">
        <circle cx="107" cy="76" r="5" /><circle cx="213" cy="133" r="7" />
        <circle cx="396" cy="115" r="6" /><circle cx="450" cy="163" r="7" />
        <circle cx="635" cy="133" r="5" /><circle cx="364" cy="211" r="5" />
      </g>
    </svg>
    <span className="coop-eyebrow">{slide.eyebrow}</span>
    <h2><span>{slide.title.split("\n")[0]}</span><em>{slide.accent}</em></h2>
    <p className="coop-explainer">{slide.lead}</p>
    <div className="coop-dimensions">
      {slide.items.map((item, index) => <section className={`coop-dimension coop-dimension-${index}`} key={item.title} tabIndex={0} {...(index === 1 ? checkpointAttributes(step) : {})} inert={index === 1 && step < 1}>
        <h3>{index === 0 ? <Target aria-hidden="true" /> : <Handshake aria-hidden="true" />}{item.title}</h3>
        <ul>{item.body?.split(" · ").map(term => <li key={term}>{term}</li>)}</ul>
      </section>)}
      <div className="coop-convergence" {...checkpointAttributes(step)} aria-hidden="true"><span /><span /></div>
    </div>
    <div className="coop-outcome" {...checkpointAttributes(step)}><span>{slide.formula}</span><p>{slide.closing}</p></div>
  </div>;
}
