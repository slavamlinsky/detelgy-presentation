import { Brand } from "./brand";
import { slideMetadata, type Deck, type SlideContent } from "@/lib/presentation";
import { ValuePropositionSlide } from "./value-proposition-slide";
import { PrototypeSlide } from "./prototype-slides";
import { StorySlide } from "./story-slides";
import { detelgyLinks } from "@/lib/detelgy-links";
export function Slide({slide,index,ui,total,revealStep=Number.MAX_SAFE_INTEGER}:{slide:SlideContent;index:number;ui:Deck["ui"];total:number;revealStep?:number}) {
 if (slide.id.startsWith("vp-")) return <ValuePropositionSlide slide={slide} index={index} total={total}/>;
 const mark=<Brand dark={slideMetadata[index].theme === "dark"}/>;
 const brand=slide.id === "s14" ? <a className="closing-brand-link" href={detelgyLinks.home} target="_blank" rel="noopener noreferrer" data-no-slide-advance>{mark}</a> : mark;
 return ["s01","s02","s10"].includes(slide.id)
  ? <PrototypeSlide slide={slide} index={index} ui={ui} brand={brand} total={total}/>
  : <StorySlide slide={slide} index={index} ui={ui} brand={brand} total={total} revealStep={revealStep}/>;
}
