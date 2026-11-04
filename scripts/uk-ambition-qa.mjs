import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {launchBrowser,baseURL,ready} from './browser.mjs';
const uk=JSON.parse(await readFile('content/locales/uk.json','utf8'));
const content=uk.slides.find(slide=>slide.id==='s07');
const browser=await launchBrowser();
const current=page=>page.locator('.scaled-slide .presentation-slide-layer:last-child .story-s07');
try {
 const page=await browser.newPage({viewport:{width:1920,height:1080}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(`${baseURL}/uk/vision#s07`);await ready(page);await current(page).waitFor();
 const slide=current(page);
 const delays=await slide.locator('.ambition-art').evaluateAll(nodes=>nodes.map(node=>node.getAnimations()[0]?.effect.getTiming().delay));
 assert.deepEqual(delays,[1020,1190,1360,1530]);
 await slide.evaluate(el=>Promise.all(el.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity).map(a=>a.finished)));
 assert.equal(await slide.locator('.story-title h2 em').innerText(),content.accent);
 assert.deepEqual(await slide.locator('.ambition h3').allTextContents(),content.items.map(item=>item.title));
 assert.equal(await slide.locator('.ambition-field').getAttribute('aria-label'),content.diagramAlt);
 if(uk.status==='draft') assert((await page.locator('.translation-notice').innerText()).includes(`${uk.slides.length} із 17`));
 assert(!(await page.content()).includes(content.note.slice(0,80)));
 const ambitions=slide.locator('.ambition');
 for(let i=0;i<4;i++) {
  await page.mouse.move(0,0);const color=await ambitions.nth(i).locator('h3').evaluate(el=>getComputedStyle(el).color);
  await ambitions.nth(i).hover();await page.waitForTimeout(240);
  assert.notEqual(await ambitions.nth(i).locator('h3').evaluate(el=>getComputedStyle(el).color),color);
 }
 await page.mouse.move(0,0);await page.keyboard.press('Tab');await ambitions.first().focus();
 assert(await ambitions.first().evaluate(el=>el.matches(':focus-visible')));
 await page.emulateMedia({reducedMotion:'reduce'});await page.mouse.click(5,5);
 await page.screenshot({path:join(tmpdir(),'detelgy-uk-slide07-viewer.png'),fullPage:true});
 await page.emulateMedia({media:'print'});
 const printed=page.locator('.print-only .story-s07');
 await printed.screenshot({path:join(tmpdir(),'detelgy-uk-slide07-1920.png')});
 const geometry=await printed.evaluate(el=>{
  const title=el.querySelector('.story-title h2'),canvas=el.getBoundingClientRect();
  return {titleLines:title.offsetHeight/parseFloat(getComputedStyle(title).lineHeight),descriptionLines:[...el.querySelectorAll('.ambition p')].map(p=>p.offsetHeight/parseFloat(getComputedStyle(p).lineHeight)),fits:[...el.querySelectorAll('.ambition')].every(item=>{
   const r=item.getBoundingClientRect();return r.right<=canvas.right && r.bottom<canvas.bottom-80 && [...item.querySelectorAll('h3,p')].every(text=>text.scrollWidth<=text.clientWidth+1);
  })};
 });
 assert(geometry.titleLines<=1.2,`Headline has ${geometry.titleLines} lines`);
 assert(geometry.descriptionLines.every(lines=>lines<=1.2),`Description wrapping: ${geometry.descriptionLines}`);assert(geometry.fits);
 assert.equal(await printed.locator('.ambition-index').count(),0);
 assert.equal((await printed.locator('.slide-folio').innerText()).replace(/\s/g,''),'07/17');
 assert((await printed.locator('.ambition-copy').evaluateAll(nodes=>nodes.map(el=>getComputedStyle(el).opacity))).every(opacity=>opacity==='1'));
 await page.emulateMedia({media:'screen'});
 await page.getByRole('button',{name:uk.ui.present,exact:true}).first().click();
 await page.waitForFunction(()=>document.querySelector('.studio').dataset.playbackBusy==='false');
 assert.equal(await ambitions.last().locator('.ambition-copy').evaluate(el=>getComputedStyle(el).opacity),'1');await page.keyboard.press('Escape');
 const phone=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 await phone.goto(`${baseURL}/uk/vision#s07`);await ready(phone);
 assert(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await phone.screenshot({path:join(tmpdir(),'detelgy-uk-slide07-mobile.png'),fullPage:true});
 await page.goto(`${baseURL}/en/vision#s07`);await ready(page);
 assert.deepEqual(await current(page).locator('.ambition h3').allTextContents(),['Become Better','Build Reputation','Find Opportunities','Monetize Expertise']);
 assert.deepEqual(errors,[]);
 console.log('Ukrainian Slide 07 passed: headline and one-line description fit, four ambitions, hover/focus, staggered entrance, static print, Present Mode, mobile and unchanged English.');
} finally {await browser.close();}
