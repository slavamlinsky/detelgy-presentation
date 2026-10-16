import {launchBrowser,baseURL,ready} from './browser.mjs';
import assert from 'node:assert/strict';
const browser=await launchBrowser();
try {
 const page=await browser.newPage({viewport:{width:1366,height:768}});
 await page.goto(`${baseURL}/en/vision#s02`);await ready(page);
 const slide=page.locator('.scaled-slide .v2-s02');
 await slide.evaluate(el=>Promise.all(el.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity).map(a=>a.finished)));
 const orbits=slide.locator('.fragment-unit,.fragment-upright');
 const seek=async t=>orbits.evaluateAll((els,time)=>els.forEach(el=>{const a=el.getAnimations()[0];a.pause();a.currentTime=time;}),t);
 const positions=()=>slide.locator('.fragment-surface').evaluateAll(els=>els.map(el=>{const m=el.getCTM();return {x:m.e,y:m.f,a:m.a,b:m.b,c:m.c,d:m.d}}));
 await seek(0);const start=await positions();
 for(const time of [60000,120000,240000,360000,480000]){
  await seek(time);const nodes=await positions();
  nodes.forEach(n=>{assert(Math.abs(Math.hypot(n.x-1380,n.y-535)-350)<.01);assert(Math.abs(n.b)<.001);assert(Math.abs(n.c)<.001);assert(Math.abs(n.a-1)<.001)});
  if(time===60000)await page.screenshot({path:'qa/v2/s02-orbit-60s.png'});
  if(time===120000)await page.screenshot({path:'qa/v2/s02-orbit-120s.png'});
  if(time===480000)nodes.forEach((n,i)=>assert(Math.abs(n.x-start[i].x)<.01&&Math.abs(n.y-start[i].y)<.01));
 }
 console.log('Verified: circular 350px radius, upright cards throughout, seamless 480-second loop.');
}finally{await browser.close()}
