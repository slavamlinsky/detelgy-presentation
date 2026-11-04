import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {launchBrowser,baseURL,ready} from './browser.mjs';
const uk=JSON.parse(await readFile('content/locales/uk.json','utf8'));
const browser=await launchBrowser();
const current=page=>page.locator('.scaled-slide .presentation-slide-layer:last-child .slide');
try {
 const page=await browser.newPage({viewport:{width:1920,height:1080},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 for(const id of ['s08','s09']) {
  const slide=uk.slides.find(slide=>slide.id===id),number=id.slice(1);
  await page.goto(`${baseURL}/uk/vision#${id}`);await ready(page);await current(page).waitFor();
  if(uk.status==='draft') assert((await page.locator('.translation-notice').innerText()).includes(`${uk.slides.length} із 17`));
  assert(!(await page.content()).includes(slide.note.slice(0,80)));
  await page.screenshot({path:join(tmpdir(),`detelgy-uk-slide${number}-viewer.png`),fullPage:true});
  await page.emulateMedia({media:'print'});
  const printed=page.locator(`.print-only [data-slide="${id}"]`);
  await printed.screenshot({path:join(tmpdir(),`detelgy-uk-slide${number}-1920.png`)});
  const headlineLines=await printed.locator('h2').evaluate(el=>el.offsetHeight/parseFloat(getComputedStyle(el).lineHeight));
  assert(headlineLines <= (id==='s08'?2.2:3.2),`Unexpected headline wrapping on ${id}: ${headlineLines}`);
  if(id==='s08') {
   assert.deepEqual(await printed.locator('.world-scene img').evaluateAll(nodes=>nodes.map(node=>node.alt)),slide.imageAlts);
   assert.deepEqual(await printed.locator('.world-comparison-label > span').allTextContents(),slide.items.map(item=>item.title).concat(slide.items.map(item=>item.body)));
   assert(await printed.locator('.world-overlay').evaluateAll(cards=>cards.every(card=>card.scrollHeight<=card.clientHeight+1)),'Comparison card overflow');
   assert.equal(await printed.locator('[data-reveal-hidden]').count(),0);
  } else {
   assert.deepEqual(await printed.locator('.ecosystem-card h3').allTextContents(),slide.items.map(item=>item.title));
   assert.deepEqual(await printed.locator('.ecosystem-card-built > span:first-child').allTextContents(),Array(4).fill(uk.ui.status.built));
   assert.deepEqual(await printed.locator('.ecosystem-card-planned > span:first-child').allTextContents(),Array(4).fill(uk.ui.status.planned));
   const fit=await printed.evaluate(el=>{
    const hub=el.querySelector('.ecosystem-center').getBoundingClientRect(),cx=(hub.left+hub.right)/2,cy=(hub.top+hub.bottom)/2;
    const quadrants=[[-1,-1],[1,-1],[1,1],[-1,1]];
    return [...el.querySelectorAll('.ecosystem-card')].every((card,index)=>{
     const r=card.getBoundingClientRect(),[x,y]=quadrants[index];
     return ((r.left+r.right)/2-cx)*x>100 && ((r.top+r.bottom)/2-cy)*y>100 && card.scrollHeight<=card.clientHeight+1 && [...card.querySelectorAll('p')].every(row=>row.children[0].getBoundingClientRect().right<=row.children[1].getBoundingClientRect().left);
    });
   });
   assert(fit,'Ecosystem geometry, badge overlap or text overflow');
   assert.equal(await printed.locator('.ecosystem-connections path').count(),4);
  }
  await page.emulateMedia({media:'screen'});
  if(id==='s08') {
   await page.getByRole('button',{name:uk.ui.present,exact:true}).first().click();
   await page.waitForFunction(()=>document.querySelector('.studio').dataset.playbackBusy==='false');
   assert.equal(await current(page).locator('.world-connected').isVisible(),false);
   await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>document.querySelector('.studio').dataset.playbackBusy==='false');
   assert.equal(await current(page).locator('.world-connected').isVisible(),true);
   assert.equal(await current(page).getAttribute('data-slide'),'s08');await page.keyboard.press('Escape');
  } else {
   const cards=current(page).locator('.ecosystem-card');
   for(let i=0;i<4;i++){await cards.nth(i).hover();assert.notEqual(await cards.nth(i).evaluate(el=>getComputedStyle(el).boxShadow),'none');}
   await page.mouse.move(0,0);await page.keyboard.press('Tab');await cards.first().focus();
   assert(await cards.first().evaluate(el=>el.matches(':focus-visible')));
  }
 }
 const phone=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 for(const id of ['s08','s09']) {
  await phone.goto(`${baseURL}/uk/vision#${id}`);await ready(phone);
  assert(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await phone.screenshot({path:join(tmpdir(),`detelgy-uk-slide${id.slice(1)}-mobile.png`),fullPage:true});
 }
 await page.goto(`${baseURL}/en/vision#s09`);await ready(page);
 assert.deepEqual(await current(page).locator('.ecosystem-card h3').allTextContents(),['Connect','Grow','Earn','Build reputation']);
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto(`${baseURL}/uk/vision#s09`);await ready(page);
 assert.deepEqual(await current(page).locator('.ecosystem-card').evaluateAll(nodes=>nodes.map(el=>el.getAnimations()[0]?.effect.getTiming().delay)),[1150,1320,1490,1660]);
 await current(page).evaluate(el=>Promise.all(el.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity).map(a=>a.finished)));
 await page.goto(`${baseURL}/uk/vision#s08`);await ready(page);
 await current(page).evaluate(el=>Promise.all(el.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity).map(a=>a.finished)));
 assert.equal(await current(page).locator('.world-connected').isVisible(),true);
 await page.getByRole('button',{name:uk.ui.present,exact:true}).first().click();
 await page.waitForFunction(()=>document.querySelector('.studio').dataset.playbackBusy==='false');
 assert.equal(await current(page).locator('.world-connected').isVisible(),false);
 await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>document.querySelector('.studio').dataset.playbackBusy==='false');
 assert.equal(await current(page).locator('.world-connected').isVisible(),true);
 await page.keyboard.press('Escape');
 assert.deepEqual(errors,[]);
 console.log('Ukrainian Slides 08–09 passed: text fit, comparison and ecosystem cards, diagonal geometry, badge clearance, reveal checkpoint, keyboard focus, mobile and English preservation.');
} finally {await browser.close();}
