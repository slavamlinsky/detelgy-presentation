import { launchBrowser,baseURL,ready } from './browser.mjs';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const deck=JSON.parse(await readFile('content/locales/en.json','utf8'));
const browser=await launchBrowser(); const errors=[]; const results=[];
try {
 const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
 const waitForTransition=()=>page.locator('.presentation-slide-in').waitFor({state:'detached'});
 page.on('pageerror',e=>errors.push(e.message));
 await mkdir('qa/slides',{recursive:true}); await mkdir('qa/viewports',{recursive:true});
 await page.goto(`${baseURL}/en/vision/print`);await ready(page);
 assert.equal(await page.locator('.slide').count(),deck.slides.length);
 for(const s of deck.slides){
  const el=page.locator(`[data-slide="${s.id}"]`);await el.screenshot({path:`qa/slides/${s.id}.png`,animations:'disabled'});
  const overflow=await el.evaluate(slide=>{const r=slide.getBoundingClientRect(); const footer=slide.querySelector('.slide-footer').getBoundingClientRect();return [...slide.querySelectorAll('.slide-main h2,.slide-main h3,.slide-main p,.slide-main small,.slide-main section,.slide-main .global-foundation,.slide-main .closing-statement,.v2-slide main h2,.v2-slide main p,.v2-slide svg text,.v2-first-values section,.story-content h2,.story-content h3,.story-content p,.story-content small,.story-content section>span,.story-portrait span')].flatMap(node=>{const b=node.getBoundingClientRect();if(!b.width || !b.height)return [];return b.bottom>footer.top-8||b.right>r.right-80||b.left<r.left+80?[{text:node.textContent.slice(0,80),bottom:Math.round(b.bottom-r.top),footer:Math.round(footer.top-r.top)}]:[]})});
  results.push({slide:s.id,overflow});
 }
 await page.goto(`${baseURL}/en/vision#s08`);await ready(page);
 await page.waitForFunction(()=>document.querySelector('.scaled-slide [data-slide]')?.getAttribute('data-slide')==='s08');
 await page.keyboard.press('ArrowRight');await page.waitForURL('**#s09');await waitForTransition();
 await page.keyboard.press('Home');await page.waitForURL('**#s01');await waitForTransition();
 assert.equal(await page.getByRole('button',{name:'Previous slide',exact:true}).isDisabled(),true);
 await page.keyboard.press('End');await page.waitForURL('**#s14');await waitForTransition();
 assert.equal(await page.getByRole('button',{name:'Next slide',exact:true}).isDisabled(),true);
 await page.goBack();await page.waitForURL('**#s01');
 await page.getByRole('button',{name:'All slides',exact:true}).click();
 assert.equal(await page.locator('dialog').evaluate(d=>d.open),true);
 await page.locator('.overview-grid button').nth(5).click();await page.waitForURL('**#s06');
 assert.equal(await page.getByRole('button',{name:'Speaker notes',exact:true}).count(),0);
 assert.equal(await page.locator('.notes-panel').count(),0);
 await page.locator('body').click({position:{x:5,y:90}});await waitForTransition();
 await page.keyboard.press('Home');await page.waitForURL('**#s01');await waitForTransition();
 await page.screenshot({path:'qa/viewports/desktop-1920.png'});
 await page.locator('.studio-actions button').click();await page.waitForFunction(()=>!!document.fullscreenElement);
 await page.screenshot({path:'qa/viewports/fullscreen.png'});
 await page.evaluate(()=>document.exitFullscreen());await page.waitForFunction(()=>!document.fullscreenElement);
 await page.context().grantPermissions(['clipboard-read','clipboard-write']);
 await page.getByRole('button',{name:'Copy slide link',exact:true}).click();
 assert((await page.evaluate(()=>navigator.clipboard.readText())).endsWith('/en/vision#s01'));
 await page.getByRole('button',{name:'Next slide',exact:true}).click();await waitForTransition();await page.evaluate(()=>document.activeElement instanceof HTMLElement&&document.activeElement.blur());await page.keyboard.press('ArrowRight');await page.waitForURL('**#s03');await waitForTransition();
 await page.keyboard.press('Home');await page.waitForURL('**#s01');await waitForTransition();
 for(const size of [{width:1366,height:768},{width:390,height:844},{width:768,height:1024}]){
  await page.setViewportSize(size);await page.screenshot({path:`qa/viewports/${size.width}x${size.height}.png`});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Viewport horizontal overflow');
 }
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'Reading view',exact:true}).click();
 assert.equal(await page.locator('.reading-content').isVisible(),true);
 await page.getByRole('button',{name:'Slide view',exact:true}).click();
 assert.equal(await page.locator('.reading-content').count(),0);
 await page.getByRole('button',{name:'Reading view',exact:true}).click();
 await page.screenshot({path:'qa/viewports/mobile-reading.png',fullPage:true});
 await page.getByRole('button',{name:'Next slide',exact:true}).click();await page.waitForURL('**#s02');
 await page.getByRole('button',{name:'All slides',exact:true}).click();await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').evaluate(d=>d.open),false);
 const unknown=await page.goto(`${baseURL}/es/vision`);assert.equal(unknown.status(),404);
 await page.goto(baseURL);await page.waitForURL('**/en/vision');
 assert.deepEqual(errors,[]);
 await writeFile('qa/report.json',JSON.stringify({date:new Date().toISOString(),results,consoleErrors:errors,interactionChecks:'passed',viewports:[1920,1366,768,390]},null,2));
 assert.deepEqual(results.filter(x=>x.overflow.length),[], 'Content enters the footer or safe margins');
 console.log(JSON.stringify(results.filter(x=>x.overflow.length),null,2));console.log('Screenshot and interaction QA complete.');
} finally {await browser.close()}
