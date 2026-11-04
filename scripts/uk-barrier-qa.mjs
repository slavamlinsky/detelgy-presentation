import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {launchBrowser,baseURL,ready} from './browser.mjs';
const uk=JSON.parse(await readFile('content/locales/uk.json','utf8'));
const content=uk.slides.find(slide=>slide.id==='s06');
const browser=await launchBrowser();
const current=page=>page.locator('.scaled-slide .presentation-slide-layer:last-child .story-s06');
try {
 const page=await browser.newPage({viewport:{width:1920,height:1080}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(`${baseURL}/uk/vision#s06`);await ready(page);await current(page).waitFor();
 const slide=current(page);
 const delays=await slide.evaluate(el=>['.barrier-headline-first','.story-title h2 em','.story-title > p',...Array.from({length:3},(_,i)=>`[data-barrier="${i}"]`)].map(selector=>el.querySelector(selector).getAnimations()[0]?.effect.getTiming().delay));
 assert.deepEqual(delays,[100,570,1050,1580,2070,2560]);
 await slide.evaluate(el=>Promise.all(el.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity).map(a=>a.finished)));
 assert.equal(await slide.locator('.barrier-system').getAttribute('aria-label'),content.diagramAlt);
 assert.deepEqual(await slide.locator('.barrier-panel h3').allTextContents(),content.displayItems.map(item=>item.body));
 if(uk.status==='draft') assert((await page.locator('.translation-notice').innerText()).includes(`${uk.slides.length} із 17`));
 assert(!(await page.content()).includes(content.note.slice(0,80)));
 for(let i=0;i<3;i++) {
  const card=slide.locator('.barrier-panel').nth(i);await card.hover();await page.waitForTimeout(240);
  assert.equal(await card.locator('p').evaluate(el=>getComputedStyle(el).opacity),'1');
 }
 await page.mouse.move(0,0);await page.keyboard.press('Tab');await slide.locator('.barrier-panel').first().focus();await page.waitForTimeout(240);
 assert.equal(await slide.locator('.barrier-panel p').first().evaluate(el=>getComputedStyle(el).opacity),'1');
 await page.emulateMedia({reducedMotion:'reduce'});await page.mouse.click(5,5);
 await page.screenshot({path:join(tmpdir(),'detelgy-uk-slide06-viewer.png'),fullPage:true});
 await page.emulateMedia({media:'print'});
 const printed=page.locator('.print-only .story-s06');
 await printed.screenshot({path:join(tmpdir(),'detelgy-uk-slide06-1920.png')});
 const bounds=await printed.evaluate(el=>{
  const h2=el.querySelector('h2');
  return {lines:h2.offsetHeight/parseFloat(getComputedStyle(h2).lineHeight),fits:[...el.querySelectorAll('.barrier-panel')].every(card=>{
   const box=card.getBoundingClientRect();return [...card.querySelectorAll('h3,p')].every(text=>{const r=text.getBoundingClientRect();return r.bottom<=box.bottom+1 && r.right<=box.right && text.scrollWidth<=text.clientWidth+1;});
  })};
 });
 assert(bounds.lines<=2.2,`Headline has ${bounds.lines} lines`);assert(bounds.fits,'Barrier copy exceeds panel');
 assert.equal((await printed.locator('.slide-folio').innerText()).replace(/\s/g,''),'06/17');
 await page.emulateMedia({media:'screen'});
 await page.getByRole('button',{name:uk.ui.present,exact:true}).first().click();
 await page.waitForFunction(()=>document.querySelector('.studio').dataset.playbackBusy==='false');
 assert.equal(await slide.locator('.barrier-panel').last().evaluate(el=>getComputedStyle(el).opacity),'1');
 await page.keyboard.press('Escape');
 const phone=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 await phone.goto(`${baseURL}/uk/vision#s06`);await ready(phone);
 assert(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 assert(!(await current(phone).innerText()).includes(uk.ui.status.planned));
 await phone.screenshot({path:join(tmpdir(),'detelgy-uk-slide06-mobile.png'),fullPage:true});
 await page.goto(`${baseURL}/en/vision#s06`);await ready(page);
 assert.deepEqual(await current(page).locator('.barrier-category').allTextContents(),['Visibility','Support','Opportunity']);
 await phone.goto(`${baseURL}/en/vision#s09`);await ready(phone);
 assert((await phone.locator('.reading-content').innerText()).includes('Planned'),'Roadmap labels disappeared');
 assert.deepEqual(errors,[]);
 console.log('Ukrainian Slide 06 passed: two-line headline, barrier text bounds, sequential entrance, hover/focus, reduced motion, print, Present Mode, mobile, unchanged English and accurate slide status labels.');
} finally {await browser.close();}
