import assert from 'node:assert/strict';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { launchBrowser, baseURL, ready } from './browser.mjs';
const browser = await launchBrowser();
const current = page => page.locator('.scaled-slide .presentation-slide-layer:last-child .slide');
const idle = page => page.waitForFunction(() => document.querySelector('.studio')?.dataset.playbackBusy === 'false' && !document.querySelector('.presentation-slide-in'));
try {
 const page = await browser.newPage({viewport:{width:1920,height:1080}, reducedMotion:'reduce'});
 await page.goto(`${baseURL}/en/vision#s14`); await ready(page); await idle(page);
 async function checkLinks() {
  for (const [selector, url] of [['.closing-primary','https://detelgy.com/request-access'],['.closing-secondary','https://detelgy.com'],['.closing-brand-link','https://detelgy.com']]) {
   const link=current(page).locator(selector);
   assert.equal(await link.getAttribute('href'),url);
   assert.equal(await link.getAttribute('target'),'_blank');
   assert.match(await link.getAttribute('rel'),/noopener noreferrer/);
   const popupPromise=page.waitForEvent('popup');
   await link.click(); const popup=await popupPromise;
   await popup.waitForURL(url+'**');
   await popup.close();
   assert.equal(await current(page).getAttribute('data-slide'),'s14');
  }
 }
 await checkLinks();
 await page.getByRole('button',{name:'Present',exact:true}).first().click(); await idle(page);
 assert.equal(await current(page).locator('.closing-invitation').getAttribute('inert'),'');
 await page.keyboard.press('ArrowRight'); await idle(page);
 await checkLinks();
 assert.equal(await current(page).getAttribute('data-reveal-step'),'1');
 await current(page).locator('.closing-secondary').focus();
 await page.keyboard.press('Shift+Tab');
 assert.equal(await page.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle),'solid');
 await page.mouse.click(5,5); await idle(page);
 await page.screenshot({path:join(tmpdir(),'detelgy-closing-cta.png')});
 const rects=await current(page).evaluate(slide=>({slide:slide.getBoundingClientRect().toJSON(),cta:slide.querySelector('.closing-actions').getBoundingClientRect().toJSON()}));
 assert(rects.cta.bottom < rects.slide.bottom && rects.cta.right < rects.slide.right);
 await page.emulateMedia({media:'print'});
 assert.equal(await page.locator('.print-only .closing-primary').isVisible(),true);
 await page.emulateMedia({media:'screen'});
 await page.keyboard.press('Escape');
 await page.setViewportSize({width:390,height:844});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await page.screenshot({path:join(tmpdir(),'detelgy-closing-cta-mobile.png'),fullPage:true});
 console.log('Final CTA: Explore/Present links, checkpoint, focus, boundaries, mobile overflow and print visibility passed.');
} finally { await browser.close(); }
