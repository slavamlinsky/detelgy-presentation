import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {launchBrowser,baseURL,ready} from './browser.mjs';
const uk=JSON.parse(await readFile('content/locales/uk.json','utf8'));
const content=uk.slides.find(slide=>slide.id==='s05');
const browser=await launchBrowser();
const current=page=>page.locator('.scaled-slide .presentation-slide-layer:last-child .story-s05');
try {
 const page=await browser.newPage({viewport:{width:1920,height:1080}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(`${baseURL}/uk/vision#s05`);await ready(page);await current(page).waitFor();
 const slide=current(page);
 const delays=await slide.evaluate(el=>['.story-title h2','.story-title > p','.workload-person',...Array.from({length:4},(_,i)=>`[data-demand="${i}"]`)].map(selector=>el.querySelector(selector).getAnimations()[0]?.effect.getTiming().delay));
 assert.deepEqual(delays,[0,250,500,850,1000,1150,1300]);
 await slide.evaluate(el=>Promise.all(el.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity).map(a=>a.finished)));
 assert.deepEqual(await slide.locator('.workload-demand h3').allTextContents(),content.items.map(item=>item.title));
 assert.equal(await slide.locator('.workload-person img').getAttribute('alt'),content.diagramAlt);
 if(uk.status==='draft') assert((await page.locator('.translation-notice').innerText()).includes(`${uk.slides.length} із 17`));
 assert(!(await page.content()).includes(content.note.slice(0,80)));
 const cards=slide.locator('.workload-demand');
 for(let i=0;i<4;i++) {
  await page.mouse.move(0,0);
  const before=await cards.nth(i).evaluate(el=>getComputedStyle(el).borderColor);
  await cards.nth(i).hover();await page.waitForTimeout(220);
  assert.notEqual(await cards.nth(i).evaluate(el=>getComputedStyle(el).borderColor),before);
 }
 await page.mouse.move(0,0);await page.keyboard.press('Tab');await cards.first().focus();
 assert(await cards.first().evaluate(el=>el.matches(':focus-visible')));
 await page.emulateMedia({reducedMotion:'reduce'});await page.mouse.click(5,5);
 await page.screenshot({path:join(tmpdir(),'detelgy-uk-slide05-viewer.png'),fullPage:true});
 await page.emulateMedia({media:'print'});
 const printed=page.locator('.print-only .story-s05');
 await printed.screenshot({path:join(tmpdir(),'detelgy-uk-slide05-1920.png')});
 const geometry=await printed.evaluate(el=>{
  const title=el.querySelector('h2'),lead=el.querySelector('.story-title > p');
  const canvas=el.getBoundingClientRect(),folio=el.querySelector('.slide-folio').getBoundingClientRect();
  return {titleLines:title.offsetHeight/parseFloat(getComputedStyle(title).lineHeight),leadLines:lead.offsetHeight/parseFloat(getComputedStyle(lead).lineHeight),fits:[...el.querySelectorAll('.workload-demand')].every(card=>{
   const box=card.getBoundingClientRect();return box.bottom<folio.top && box.right<=canvas.right && [...card.querySelectorAll('h3,p')].every(text=>{const r=text.getBoundingClientRect();return r.bottom<=box.bottom && text.scrollWidth<=text.clientWidth+1;});
  })};
 });
 assert(geometry.titleLines<=2.2,`Headline has ${geometry.titleLines} lines`);
 assert(geometry.leadLines<=2.2,`Subline has ${geometry.leadLines} lines`);assert(geometry.fits,'Card text/grid overflow');
 assert.equal((await printed.locator('.slide-folio').innerText()).replace(/\s/g,''),'05/17');
 await page.emulateMedia({media:'screen'});
 await page.getByRole('button',{name:uk.ui.present,exact:true}).first().click();
 await page.waitForFunction(()=>document.querySelector('.studio').dataset.playbackBusy==='false');
 assert.equal(await cards.last().evaluate(el=>getComputedStyle(el).opacity),'1');await page.keyboard.press('Escape');
 const phone=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 await phone.goto(`${baseURL}/uk/vision#s05`);await ready(phone);
 assert(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await phone.screenshot({path:join(tmpdir(),'detelgy-uk-slide05-mobile.png'),fullPage:true});
 await page.goto(`${baseURL}/en/vision#s05`);await ready(page);
 assert.deepEqual(await current(page).locator('.workload-demand h3').allTextContents(),['Professional Practice','Marketing & Clients','Business Management','Professional Growth']);
 assert.equal(await current(page).locator('.workload-person img').getAttribute('alt'),'Illustrated Dmytro, composed at his desk with a notebook');
 assert.deepEqual(errors,[]);
 console.log('Ukrainian Slide 05 passed: headline/subline fit, four card bounds, localized portrait alt, ordered entrance, hover/focus, static print, Present Mode, mobile and unchanged English.');
} finally {await browser.close();}
