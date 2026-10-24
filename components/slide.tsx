import { slideMetadata, type Deck, type SlideContent } from "@/lib/presentation";
import { PrototypeSlide } from "./prototype-slides";
import { StorySlide } from "./story-slides";
export function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`brand ${dark ? "brand-dark" : ""}`}>
      <img src="/assets/detelgy-logo.png" alt="Detelgy" />
    </span>
  );
}
export function Slide({slide,index,ui,total}:{slide:SlideContent;index:number;ui:Deck["ui"];total:number}) {
 const brand=<Brand dark={slideMetadata[index].theme === "dark"}/>;
 return ["s01","s02","s10"].includes(slide.id)
  ? <PrototypeSlide slide={slide} index={index} ui={ui} brand={brand} total={total}/>
  : <StorySlide slide={slide} index={index} ui={ui} brand={brand} total={total}/>;
}
