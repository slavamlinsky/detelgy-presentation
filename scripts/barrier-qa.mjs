import {launchBrowser,baseURL,ready} from './browser.mjs';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await launchBrowser();
try {
 const page=await browser.newPage({viewport:{width:1920,height:1080}});
 await page.goto(`${baseURL}/en/vision/print`);await ready(page);await page.emulateMedia({media:'print'});
 const slide=page.locator('[data-slide="s06"]');
 await slide.screenshot({path:'qa/v2/s06.png'});
 if(process.env.REVIEW_PDF==='1') await page.pdf({path:'qa/v2/s06-review.pdf',pageRanges:'6',printBackground:true,preferCSSPageSize:true});
 assert.equal(await slide.locator('.barrier-panel').count(),3);
 assert((await slide.locator('.barrier-panel-content').evaluateAll(es=>es.map(e=>getComputedStyle(e).opacity))).every(v=>v==='1'));
 assert.equal((await slide.locator('.slide-folio').textContent()).replace(/\s/g,''),'06/17');
 const bounds=await slide.locator('.story-title,.barrier-panel').evaluateAll(es=>es.map(el=>{const r=el.getBoundingClientRect(),s=el.closest('article').getBoundingClientRect();return [r.left-s.left,r.right-s.left,r.bottom-s.top]}));
 bounds.forEach(([l,r,b])=>assert(l>=100&&r<=1815&&b<995));
 await page.emulateMedia({media:'screen'});await page.setViewportSize({width:1366,height:768});
 await page.goto(`${baseURL}/en/vision#s06`);await ready(page);
 const live=page.locator('.scaled-slide .story-s06');
 const animations=await live.evaluate(el=>el.getAnimations({subtree:true}).map(a=>a.effect.getTiming()));
 assert.equal(animations.length,6);assert(animations.every(t=>t.iterations===1));
 assert.deepEqual(animations.map(t=>t.delay).sort((a,b)=>a-b),[100,570,1050,1580,2070,2560]);
 const step=async(ms,path,expected)=>{
  const actual=await live.evaluate((el,time)=>{
   el.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=time});
   return ['.barrier-headline-first','.story-title h2 em','.story-title > p','[data-barrier="0"]','[data-barrier="1"]','[data-barrier="2"]'].map(selector=>Number(getComputedStyle(el.querySelector(selector)).opacity));
  },ms);
  actual.forEach((value,i)=>assert(expected[i] ? value>.98 : value<.02,`Reveal ${i} at ${ms}ms: ${value}`));
  await live.screenshot({path});
 };
 await step(500,'qa/v2/s06-motion-first-line.png',[1,0,0,0,0,0]);
 await step(900,'qa/v2/s06-motion-headline.png',[1,1,0,0,0,0]);
 await step(1500,'qa/v2/s06-motion-subline.png',[1,1,1,0,0,0]);
 await step(2010,'qa/v2/s06-motion-first-card.png',[1,1,1,1,0,0]);
 await step(2500,'qa/v2/s06-motion-second-card.png',[1,1,1,1,1,0]);
 await step(3200,'qa/v2/s06-motion-final.png',[1,1,1,1,1,1]);
 await page.screenshot({path:'qa/v2/s06-laptop.png'});
 const first=live.locator('.barrier-panel').first();const base=await first.evaluate(e=>getComputedStyle(e,'::before').borderTopColor);
 await first.hover();await page.waitForTimeout(220);
 assert.notEqual(await first.evaluate(e=>getComputedStyle(e,'::before').borderTopColor),base);
 await page.mouse.move(0,0);await page.keyboard.press('Tab');await live.locator('.barrier-panel').nth(1).focus();await page.waitForTimeout(220);
 assert.notEqual(await live.locator('.barrier-panel').nth(1).evaluate(e=>getComputedStyle(e,'::before').borderTopColor),base);
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.waitForFunction(()=>document.querySelector('.scaled-slide .story-s06').getAnimations({subtree:true}).length===0);
 const deck=JSON.parse(await readFile('content/locales/en.json','utf8'));
 assert.match(deck.slides.find(item=>item.id==='s06').note,/illustrative hypotheses|illustrative barriers/i);
 console.log('Passed: three barriers, safe bounds, static print visibility, sequential reveal, hover/focus, reduced motion, notes and folio.');
}finally{await browser.close()}
