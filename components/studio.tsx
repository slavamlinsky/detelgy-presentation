'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Download, Maximize, Minimize, Grid2X2, Link2, X, BookOpen, Play, ChevronRight, Globe2 } from 'lucide-react';
import { Brand, Slide } from './slide';
import { pdfHref, type Deck, type Locale } from '@/lib/presentation';

const TRANSITION_MS = 400;
const WHEEL_COOLDOWN_MS = 780;
const WHEEL_QUIET_MS = 320;
const WHEEL_THRESHOLD = 75;

type SlideTransition = { from: number };
type WheelGesture = { lastAt: number; total: number; direction: -1 | 0 | 1; committed: boolean };

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof Element && !!target.closest('button, a, input, textarea, select, summary, [contenteditable], [role="button"], [role="slider"], [role="tab"], [role="link"], [tabindex]:not([tabindex="-1"])');
}

function hasScrollableWithin(target: EventTarget | null, boundary: Element): boolean {
  let node = target instanceof Element ? target : null;
  while (node && node !== boundary) {
    if (node instanceof HTMLElement) {
      const overflow = getComputedStyle(node).overflowY;
      if (/(auto|scroll)/.test(overflow) && node.scrollHeight > node.clientHeight + 1) return true;
    }
    node = node.parentElement;
  }
  return false;
}

export function Studio({deck}:{deck:Deck}) {
 const [active,setActive]=useState(0),[scale,setScale]=useState(0.5),[overview,setOverview]=useState(false),[reading,setReading]=useState(false),[full,setFull]=useState(false),[message,setMessage]=useState('');
 const [transition,setTransition]=useState<SlideTransition|null>(null);
 const stage=useRef<HTMLDivElement>(null), root=useRef<HTMLDivElement>(null), dialog=useRef<HTMLDialogElement>(null), overviewButton=useRef<HTMLButtonElement>(null);
 const activeRef=useRef(0), transitionTimer=useRef<ReturnType<typeof setTimeout>|null>(null), transitionLocked=useRef(false), wheelRef=useRef<WheelGesture>({lastAt:0,total:0,direction:0,committed:false}), wheelCooldownUntil=useRef(0), touchStart=useRef<{x:number;y:number}|null>(null);
 const slide=deck.slides[active], ui=deck.ui;
 useEffect(()=>{if(window.matchMedia('(max-width:640px)').matches)setReading(true)},[]);
 const go=useCallback((index:number)=>{
  const next=Math.max(0,Math.min(deck.slides.length-1,index));
  const previous=activeRef.current;
  if(next===previous || transitionLocked.current)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  activeRef.current=next;
  if(!reduced){
   transitionLocked.current=true;
   setTransition({from:previous});
   transitionTimer.current=setTimeout(()=>{setTransition(null);transitionLocked.current=false;transitionTimer.current=null},TRANSITION_MS);
  }
  setActive(next);
  window.history.pushState(null,'',`${window.location.pathname}${window.location.search}#${deck.slides[next].id}`);
 },[deck.slides]);
 useEffect(()=>{
  const sync=()=>{
   const index=deck.slides.findIndex(s=>s.id===window.location.hash.slice(1));
   const next=index<0?0:index;
   if(next===activeRef.current)return;
   if(transitionTimer.current)clearTimeout(transitionTimer.current);
   transitionTimer.current=null;
   transitionLocked.current=false;
   setTransition(null);
   activeRef.current=next;
   setActive(next);
  };
  sync();window.addEventListener('hashchange',sync);window.addEventListener('popstate',sync);
  return()=>{window.removeEventListener('hashchange',sync);window.removeEventListener('popstate',sync);if(transitionTimer.current)clearTimeout(transitionTimer.current)};
 },[deck.slides]);
 useEffect(()=>{const el=stage.current;if(!el)return;const resize=()=>setScale(Math.min(el.clientWidth/1920,el.clientHeight/1080));const ro=new ResizeObserver(resize);ro.observe(el);resize();return()=>ro.disconnect()},[reading]);
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{
  if(overview || e.repeat || e.altKey || e.ctrlKey || e.metaKey || isInteractiveTarget(e.target))return;
  const current=activeRef.current;
  if(e.key==='f' || e.key==='F'){e.preventDefault();void fullscreen();return}
  if(e.key==='Home'){e.preventDefault();go(0);return}
  if(e.key==='End'){e.preventDefault();go(deck.slides.length-1);return}
  const forward=['ArrowRight','ArrowDown','PageDown'].includes(e.key) || ((e.key===' ' || e.code==='Space') && !e.shiftKey);
  const backward=['ArrowLeft','ArrowUp','PageUp'].includes(e.key) || ((e.key===' ' || e.code==='Space') && e.shiftKey);
  if(forward || backward){e.preventDefault();go(current+(forward?1:-1))}
 };window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[go,overview,deck.slides.length]);
 useEffect(()=>{
  const el=stage.current;if(!el)return;
  const onWheel=(e:WheelEvent)=>{
   if(overview || isInteractiveTarget(e.target) || Math.abs(e.deltaX)>Math.abs(e.deltaY) || hasScrollableWithin(e.target,el))return;
   const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?el.clientHeight:1);
   if(!delta)return;
   e.preventDefault();
   const now=performance.now();
   const gesture=wheelRef.current;
   if(now-gesture.lastAt>WHEEL_QUIET_MS){gesture.total=0;gesture.direction=0;gesture.committed=false}
   gesture.lastAt=now;
   if(gesture.committed || now<wheelCooldownUntil.current || transitionLocked.current)return;
   const direction=delta>0?1:-1;
   if(gesture.direction!==direction){gesture.total=0;gesture.direction=direction}
   gesture.total+=Math.abs(delta);
   if(gesture.total<WHEEL_THRESHOLD)return;
   gesture.committed=true;
   wheelCooldownUntil.current=now+WHEEL_COOLDOWN_MS;
   go(activeRef.current+direction);
  };
  el.addEventListener('wheel',onWheel,{passive:false});
  return()=>el.removeEventListener('wheel',onWheel);
 },[go,overview]);
 useEffect(()=>{
  const el=stage.current;if(!el)return;
  const start=(e:TouchEvent)=>{
   touchStart.current=null;
   if(overview || e.touches.length!==1 || isInteractiveTarget(e.target))return;
   touchStart.current={x:e.touches[0].clientX,y:e.touches[0].clientY};
  };
  const end=(e:TouchEvent)=>{
   const origin=touchStart.current;touchStart.current=null;
   if(!origin || e.changedTouches.length!==1 || transitionLocked.current)return;
   const dx=e.changedTouches[0].clientX-origin.x,dy=e.changedTouches[0].clientY-origin.y;
   if(Math.abs(dx)<60 || Math.abs(dx)<Math.abs(dy)*1.25)return;
   go(activeRef.current+(dx<0?1:-1));
  };
  const cancel=()=>{touchStart.current=null};
  el.addEventListener('touchstart',start,{passive:true});el.addEventListener('touchend',end,{passive:true});el.addEventListener('touchcancel',cancel);
  return()=>{el.removeEventListener('touchstart',start);el.removeEventListener('touchend',end);el.removeEventListener('touchcancel',cancel)};
 },[go,overview]);
 useEffect(()=>{const onFull=()=>setFull(!!document.fullscreenElement);document.addEventListener('fullscreenchange',onFull);return()=>document.removeEventListener('fullscreenchange',onFull)},[]);
 useEffect(()=>{if(overview){dialog.current?.showModal();}else if(dialog.current?.open){dialog.current.close();overviewButton.current?.focus();}},[overview]);
 useEffect(()=>{if(!message)return;const id=setTimeout(()=>setMessage(''),3500);return()=>clearTimeout(id)},[message]);
 async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await root.current?.requestFullscreen()}catch{setMessage(ui.fullscreenFailed)}}
 async function copy(){try{await navigator.clipboard.writeText(`${window.location.origin}/${deck.locale}/vision#${slide.id}`);setMessage(ui.copied)}catch{setMessage(ui.copyFailed)}}
 return <div className={`studio ${reading?'reading-mode':''} ${full?'is-fullscreen':''}`} ref={root}>
  <header className="studio-header"><a className="studio-identity" href="/en/vision" aria-label={deck.title}><Brand/><span className="identity-divider"/><span>{ui.studio}</span></a><div className="studio-actions"><span className="locale-indicator"><Globe2 size={15}/> {ui.localeCode}</span><a className="control download-control" aria-label={ui.download} href={pdfHref(deck.locale as Locale)} download><Download size={16}/><span>{ui.download}</span></a><button className="control primary" onClick={fullscreen}><Play size={14} fill="currentColor"/><span>{full?ui.exitFullscreen:ui.present}</span></button></div></header>
  <div className="workspace"><div className="deck-heading"><h1>{slide.viewerTitle ?? slide.chapter}</h1><button className="mobile-reading-toggle control" onClick={()=>setReading(!reading)} aria-label={reading?ui.slides:ui.read} aria-pressed={reading}><BookOpen size={16}/><span>{reading?ui.slides:ui.read}</span></button><span className="deck-count">{deck.slides.length} {ui.slideCountLabel} <span>·</span> {ui.duration}</span></div>
   <div className="presentation-stage" ref={stage}><div className="slide-viewport" style={{width:1920*scale,height:1080*scale}}><div className="scaled-slide" style={{transform:`scale(${scale})`}}><div className="presentation-slide-stack">
    {transition&&<div className="presentation-slide-layer presentation-slide-out" aria-hidden="true" inert><Slide slide={deck.slides[transition.from]} index={transition.from} ui={ui} total={deck.slides.length}/></div>}
    <div key={slide.id} className={`presentation-slide-layer${transition?' presentation-slide-in':''}`} aria-hidden={transition?true:undefined} inert={!!transition}><Slide slide={slide} index={active} ui={ui} total={deck.slides.length}/></div>
   </div></div></div></div>
   {reading && <section className="reading-content" aria-label={ui.read}><p className="tiny-label">{slide.eyebrow}</p><h2>{slide.title}</h2><p>{slide.lead}</p>{slide.items.map(item=><div key={item.title}><h3>{item.title}</h3>{item.body&&<p>{item.body}</p>}{item.label&&<small>{item.label}</small>}{item.outcome&&<p>{item.outcome}</p>}{item.status&&<small>{ui.status[item.status as keyof typeof ui.status]}</small>}{item.detail&&<p>{item.detail} ({ui.status.planned})</p>}{item.steps&&<p>{item.steps.join(' → ')}</p>}</div>)}{slide.moments?.map(item=><p key={item.title}><strong>{item.title}:</strong> {item.body}</p>)}{slide.foundation&&<p>{slide.foundation}</p>}{slide.formula&&<p>{slide.formula}</p>}{slide.closing&&<p>{slide.closing}</p>}{slide.cta&&<p>{slide.cta}</p>}</section>}
   <nav className="deck-controls" aria-label={ui.navigationLabel}><div className="control-group"><button className="control overview-control" aria-label={ui.overview} ref={overviewButton} onClick={()=>setOverview(true)}><Grid2X2 size={17}/><span>{ui.overview}</span></button></div><div className="navigation"><button className="icon-control" aria-label={ui.previous} title={ui.previous} onClick={()=>go(active-1)} disabled={active===0}><ArrowLeft size={19}/></button><span aria-live="polite" className="counter">{String(active+1).padStart(2,'0')} <span>/ {deck.slides.length}</span></span><button className="icon-control" aria-label={ui.next} title={ui.next} onClick={()=>go(active+1)} disabled={active===deck.slides.length-1}><ArrowRight size={19}/></button></div><div className="control-group end-controls"><button className="icon-control" aria-label={ui.copy} title={ui.copy} onClick={copy}><Link2 size={17}/></button><button className="icon-control" aria-label={full?ui.exitFullscreen:ui.present} title={full?ui.exitFullscreen:ui.present} onClick={fullscreen}>{full?<Minimize size={18}/>:<Maximize size={18}/>}</button></div></nav>
   <div className="progress-track">{deck.slides.map((s,i)=><button key={s.id} aria-label={`${i+1}. ${s.chapter}`} aria-current={i===active?'step':undefined} onClick={()=>go(i)} className={i===active?'active':''}><span/></button>)}</div>
   <footer className="workspace-footer"><span>{ui.keyboard}</span></footer>
  </div>
  <dialog ref={dialog} className="overview-dialog" onCancel={()=>setOverview(false)} onClick={e=>{if(e.target===dialog.current)setOverview(false)}}><div className="overview-heading"><div><p className="tiny-label">{ui.overviewHint}</p><h2>{deck.title}</h2></div><button className="icon-control" onClick={()=>setOverview(false)} aria-label={ui.close}><X/></button></div><div className="overview-grid">{deck.slides.map((s,i)=><button key={s.id} aria-current={i===active?'step':undefined} className={i===active?'active':''} onClick={()=>{go(i);setOverview(false)}}><span>{String(i+1).padStart(2,'0')}</span><div><small>{s.chapter}</small><strong>{s.title}</strong></div><ChevronRight size={18}/></button>)}</div></dialog>
  {message&&<div className="toast" role="status">{message}</div>}
  <div className="print-only">{deck.slides.map((s,i)=><Slide key={s.id} slide={s} index={i} ui={ui} total={deck.slides.length}/>)}</div>
 </div>
}
