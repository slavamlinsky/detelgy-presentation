import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {launchBrowser,baseURL,ready} from './browser.mjs';
const uk=JSON.parse(await readFile('content/locales/uk.json','utf8'));
const content=uk.slides.find(slide=>slide.id==='s03');
const browser=await launchBrowser();
const current=page=>page.locator('.scaled-slide .presentation-slide-layer:last-child .story-s03');
try {
 const page=await browser.newPage({viewport:{width:1920,height:1080},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(`${baseURL}/uk/vision#s03`);await ready(page);await current(page).waitFor();
 const slide=current(page);
 assert.equal(await slide.locator('h2 em').innerText(),content.accent);
 assert.equal(await slide.locator('.audience-primary').innerText(),content.microcopy.toUpperCase());
 assert.deepEqual(await slide.locator('.audience-person h3').allTextContents(),content.items.map(item=>item.title));
 if(uk.status==='draft') assert((await page.locator('.translation-notice').innerText()).includes(`${uk.slides.length} із 17`));
 assert(!(await page.content()).includes(content.note.slice(0,80)));
 await page.screenshot({path:join(tmpdir(),'detelgy-uk-slide03-viewer.png'),fullPage:true});
 await page.emulateMedia({media:'print',reducedMotion:'reduce'});
 const printed=page.locator('.print-only .story-s03');
 await printed.screenshot({path:join(tmpdir(),'detelgy-uk-slide03-1920.png')});
 const geometry=await printed.evaluate(el=>{
  const heading=el.querySelector('.story-title h2');
  const canvas=el.getBoundingClientRect();
  return {lines:heading.offsetHeight/parseFloat(getComputedStyle(heading).lineHeight),
   fits:[...el.querySelectorAll('.audience-person h3,.audience-jtbd,.story-title > p')].every(node=>{const box=node.getBoundingClientRect();return box.right<=canvas.right && box.bottom<=canvas.bottom && node.scrollWidth<=node.clientWidth+1;})};
 });
 assert(geometry.lines<=2.2,`Headline wrapped into ${geometry.lines} lines`);assert(geometry.fits,'Text overflows the slide');
 assert((await printed.locator('.audience-jtbd').evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).opacity))).every(opacity=>opacity==='1'));
 await page.emulateMedia({media:'screen',reducedMotion:'no-preference'});
 await slide.evaluate(el=>Promise.all(el.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity).map(a=>a.finished)));
 const cards=slide.locator('.audience-person');
 for(let i=0;i<3;i++) {
  await cards.nth(i).hover();await page.waitForTimeout(240);
  assert.equal(await cards.nth(i).locator('.audience-jtbd').evaluate(el=>getComputedStyle(el).opacity),'1');
  assert.equal(await cards.nth(i).locator('.audience-jtbd').textContent(),content.items[i].body);
 }
 await page.mouse.move(0,0);await page.keyboard.press('Tab');await cards.nth(1).focus();await page.waitForTimeout(240);
 assert.equal(await cards.nth(1).locator('.audience-jtbd').evaluate(el=>getComputedStyle(el).opacity),'1');
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.getByRole('button',{name:uk.ui.present,exact:true}).first().click();
 await page.waitForFunction(()=>document.querySelector('.studio').dataset.playbackBusy==='false');
 assert.equal((await slide.locator('.slide-folio').innerText()).replace(/\s/g,''),'03/17');
 await page.keyboard.press('Escape');
 const phone=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 await phone.goto(`${baseURL}/uk/vision#s03`);await ready(phone);
 assert(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await phone.screenshot({path:join(tmpdir(),'detelgy-uk-slide03-mobile.png'),fullPage:true});
 await page.goto(`${baseURL}/en/vision#s03`);await ready(page);
 assert.equal(await current(page).locator('.audience-primary').innerText(),'PRIMARY FOCUS');
 assert.deepEqual(await current(page).locator('.audience-person h3').allTextContents(),['Emerging Professional','Growth-oriented Examiner','Established Expert']);
 assert.deepEqual(errors,[]);
 console.log('Ukrainian Slide 03 passed: two-line headline, localized personas and primary label, no overflow, hover/focus, print, Present Mode, mobile and unchanged English.');
} finally {await browser.close();}
