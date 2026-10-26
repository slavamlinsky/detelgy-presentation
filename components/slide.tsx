import { slideMetadata, type Deck, type SlideContent } from "@/lib/presentation";
import { PrototypeSlide } from "./prototype-slides";
import { StorySlide } from "./story-slides";
import { detelgyLinks } from "@/lib/detelgy-links";
export function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`brand ${dark ? "brand-dark" : ""}`}>
      <img src="/assets/detelgy-logo.png" alt="Detelgy" />
    </span>
  );
}
export function Slide({slide,index,ui,total,revealStep=Number.MAX_SAFE_INTEGER}:{slide:SlideContent;index:number;ui:Deck["ui"];total:number;revealStep?:number}) {
 const mark=<Brand dark={slideMetadata[index].theme === "dark"}/>;
 const brand=slide.id === "s14" ? <a className="closing-brand-link" href={detelgyLinks.home} target="_blank" rel="noopener noreferrer" data-no-slide-advance>{mark}</a> : mark;
 return ["s01","s02","s10"].includes(slide.id)
  ? <PrototypeSlide slide={slide} index={index} ui={ui} brand={brand} total={total}/>
  : <StorySlide slide={slide} index={index} ui={ui} brand={brand} total={total} revealStep={revealStep}/>;
}
