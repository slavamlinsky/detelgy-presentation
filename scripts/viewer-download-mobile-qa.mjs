import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { launchBrowser, baseURL, ready } from './browser.mjs';
const browser=await launchBrowser();
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 for(const locale of ['en','uk']) {
  await page.goto(`${baseURL}/${locale}/vision#s14`);await ready(page);
  assert.equal(await page.locator('.translation-notice').count(),0);
  const link=page.locator('a.download-control');assert(await link.isVisible());
  const request=page.waitForEvent('download');await link.click();const download=await request;
  assert.equal(download.suggestedFilename(),`detelgy-vision-${locale}.pdf`);
  const path=await download.path();assert(path);
  const downloaded=await readFile(path),original=await readFile(`public/downloads/detelgy-vision-${locale}.pdf`);
  assert.equal(createHash('sha256').update(downloaded).digest('hex'),createHash('sha256').update(original).digest('hex'));
  assert.equal(downloaded.subarray(0,5).toString(),'%PDF-');
  console.log(`${locale}: actual Download PDF returns current ${downloaded.length}-byte file.`);
 }
 await page.emulateMedia({reducedMotion:'no-preference'});
 for(let i=0;i<3;i++) {
  await page.locator('.language-selector [role=combobox]').click();await page.getByRole('listbox').waitFor();
  await page.waitForFunction(()=>{const e=document.querySelector('[role=listbox]');return e&&getComputedStyle(e).opacity==='1'});
  assert.equal(await page.getByRole('option').count(),2);await page.keyboard.press('Escape');await page.getByRole('listbox').waitFor({state:'detached'});
 }
 const phone=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 for(const width of [320,390,430,768,1024]) {
  await phone.setViewportSize({width,height:844});
  await phone.goto(`${baseURL}/uk/vision#s14`);await ready(phone);
  assert.equal(await phone.locator('.reading-content,.mobile-reading-toggle').count(),0,'Mobile should only show the 16:9 slide');
  assert.equal(await phone.locator('.translation-notice').count(),0);
  assert(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Page overflow at ${width}px`);
  const canvas=await phone.locator('.slide-viewport').boundingBox();assert(Math.abs(canvas.width/canvas.height-16/9)<.01,`Slide aspect ratio at ${width}px`);
  for(const el of await phone.locator('.studio-header .ui-select-trigger,.studio-header .download-control,.studio-header .control.primary,.deck-controls').all()) {
   const r=await el.boundingBox();assert(r.x>=-1&&r.x+r.width<=width+1,`Control outside viewport at ${width}px`);
  }
  await phone.screenshot({path:join(tmpdir(),`detelgy-studio-mobile-${width}.png`),fullPage:true});
 }
 await phone.setViewportSize({width:390,height:844});
 for(let i=0;i<17;i++) {
  await phone.goto(`${baseURL}/uk/vision?slide=${i+1}`);await ready(phone);
  const canvas=await phone.locator('.slide-viewport').boundingBox();assert(Math.abs(canvas.width/canvas.height-16/9)<.01);
  assert(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 }
 await phone.locator('.overview-control').click();await phone.locator('.overview-dialog').waitFor({state:'visible'});
 await phone.locator('.overview-grid button').nth(11).tap();await phone.waitForURL('**/uk/vision?slide=12#s10');
 assert.deepEqual(errors,[]);
 console.log('Studio passed: all 17 mobile slides preserve 16:9, 320–1024px header/control fit, no draft notice, no reading-mode toggle, touch overview, normal-motion dropdown reopening and both real PDF downloads.');
}finally{await browser.close();}
