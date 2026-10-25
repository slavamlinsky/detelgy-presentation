import {launchBrowser,baseURL,ready} from './browser.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import deck from '../content/locales/en.json' with { type: 'json' };
const browser=await launchBrowser();
try {
 const page=await browser.newPage({viewport:{width:1920,height:1080},reducedMotion:'reduce'});
 await page.goto(`${baseURL}/en/vision/print`);await ready(page);
 const geometry=await page.locator('article.slide').evaluateAll(slides=>slides.map(s=>{
  const base=s.getBoundingClientRect();
  return ['.slide-header .brand','.slide-folio'].map(sel=>{
   const el=s.querySelector(sel),r=el.getBoundingClientRect(),css=getComputedStyle(el);
   return {x:r.x-base.x,y:r.y-base.y,width:r.width,height:r.height,fontSize:css.fontSize};
  });
 }));
 assert.equal(geometry.length,deck.slides.length);
 geometry.forEach((g)=>{for(let i=0;i<2;i++)assert.deepEqual(g[i],geometry[0][i]);});
 await fs.mkdir('qa/chrome',{recursive:true});
 for(const id of ['s01','s02','s09','s14'])await page.locator(`[data-slide="${id}"]`).screenshot({path:`qa/chrome/${id}.png`});
 await page.setViewportSize({width:1366,height:768});
 await page.goto(`${baseURL}/en/vision#s01`);await ready(page);
 await page.screenshot({path:'qa/chrome/s01-laptop.png'});
 console.log(`All ${deck.slides.length} slides have identical logo and folio bounds and font sizes.`,JSON.stringify(geometry[0]));
}finally{await browser.close()}
