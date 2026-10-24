import {launchBrowser,baseURL,ready} from './browser.mjs';
import assert from 'node:assert/strict';
const browser=await launchBrowser();
try {
 const page=await browser.newPage({viewport:{width:1920,height:1080}});
 await page.goto(`${baseURL}/en/vision/print`);await ready(page);
 await page.emulateMedia({media:'print'});
 const printed=page.locator('[data-slide="s03"]');
 await printed.screenshot({path:'qa/v2/s03.png'});
 assert((await printed.locator('.audience-jtbd').evaluateAll(es=>es.map(e=>getComputedStyle(e).opacity))).every(v=>v==='1'));
 await page.emulateMedia({media:'screen'});
 await page.setViewportSize({width:1366,height:768});
 await page.goto(`${baseURL}/en/vision#s03`);await ready(page);
 const slide=page.locator('.scaled-slide .story-s03');
 await slide.evaluate(el=>Promise.all(el.getAnimations({subtree:true}).map(a=>a.finished)));
 await page.screenshot({path:'qa/v2/s03-laptop.png'});
 const cards=slide.locator('.audience-person');
 assert.equal(await cards.count(),3);
 for(let i=0;i<3;i++){
  await cards.nth(i).hover();await page.waitForTimeout(250);
  assert.equal(await cards.nth(i).locator('.audience-jtbd').evaluate(e=>getComputedStyle(e).opacity),'1');
 }
 await page.screenshot({path:'qa/v2/s03-hover.png'});
 await page.mouse.move(0,0);await page.keyboard.press('Tab');await cards.nth(1).focus();await page.waitForTimeout(250);
 assert.equal(await cards.nth(1).locator('.audience-jtbd').evaluate(e=>getComputedStyle(e).opacity),'1');
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.waitForFunction(()=>document.querySelector('.scaled-slide .story-s03').getAnimations({subtree:true}).length===0);
 assert.equal((await slide.locator('.slide-folio').textContent()).replace(/\s/g,''),'03/17');
 console.log('Passed: 3 personas, hover/focus details, reduced motion, print content and slide number.');
}finally{await browser.close()}
