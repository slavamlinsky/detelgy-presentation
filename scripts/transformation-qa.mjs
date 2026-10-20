import { launchBrowser, baseURL, ready } from './browser.mjs';
import assert from 'node:assert/strict';

const before = ['Limited visibility', 'Knowledge in isolation', 'Limited earning channels'];
const after = ['Professional presence', 'Connected community', 'New earning opportunities'];
const browser = await launchBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(`${baseURL}/en/vision/print`);
  await ready(page);
  await page.emulateMedia({ media: 'print' });
  const slide = page.locator('[data-slide="s08"]');
  assert.deepEqual(await slide.locator('.world-comparison-before').allTextContents(), before);
  assert.deepEqual(await slide.locator('.world-comparison-after').allTextContents(), after);
  assert.equal((await slide.locator('.slide-folio').textContent()).replace(/\s/g,''), '08/14');
  assert.deepEqual(await slide.locator('.world-scene img').evaluateAll(imgs => imgs.map(img => img.getAttribute('src'))), ['/assets/personas/david-before-office-wide.png','/assets/personas/david-connected-office-wide.png']);
  assert((await slide.locator('.world-scene img').evaluateAll(imgs => imgs.map(img => img.complete && img.naturalWidth>0))).every(Boolean));
  assert((await slide.locator('.world-scene img').evaluateAll(imgs => imgs.map(img => Math.abs(img.naturalWidth/img.naturalHeight-16/9)<.08 && getComputedStyle(img).objectFit==='contain'))).every(Boolean));
  const bounds = await slide.locator('.story-title,.transformation-world').evaluateAll(els => els.map(el => {
    const r=el.getBoundingClientRect(), s=el.closest('article').getBoundingClientRect();
    return [r.left-s.left,r.right-s.left,r.top-s.top,r.bottom-s.top];
  }));
  bounds.forEach(([left,right,top,bottom]) => assert(left>=100 && right<=1815 && top>=150 && bottom<995));
  assert((await slide.locator('.world-scene,.world-comparison').evaluateAll(els => els.map(el => getComputedStyle(el).opacity))).every(opacity => opacity==='1'));
  await slide.screenshot({ path: 'qa/v2/s08.png' });
  await page.pdf({ path: 'qa/v2/s08-review.pdf', pageRanges: '8', printBackground: true, preferCSSPageSize: true });

  await page.emulateMedia({ media: 'screen' });
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto(`${baseURL}/en/vision#s08`);
  await ready(page);
  const live=page.locator('.scaled-slide [data-slide="s08"]');
  const timings=await live.evaluate(el => el.getAnimations({subtree:true}).map(a => a.effect.getTiming()));
  assert.equal(timings.length,11);
  assert(timings.every(t => t.iterations===1 && t.delay+t.duration<=2000));
  const frame=async(time,path) => {
    await live.evaluate((el,ms) => el.getAnimations({subtree:true}).forEach(a => {a.pause();a.currentTime=ms}),time);
    await live.screenshot({path});
  };
  await frame(900,'qa/v2/s08-motion-before.png');
  assert(Number(await live.locator('.world-before .world-scene').evaluate(el => getComputedStyle(el).opacity))>.5);
  assert.equal(Number(await live.locator('.world-connected .world-scene').evaluate(el => getComputedStyle(el).opacity)),0);
  await frame(1250,'qa/v2/s08-motion-transition.png');
  assert(Number(await live.locator('.world-seam').evaluate(el => getComputedStyle(el).opacity))>.5);
  assert.equal(Number(await live.locator('.world-comparison[data-pair="0"]').evaluate(el => getComputedStyle(el).opacity)),0);
  await frame(1950,'qa/v2/s08-motion-connected.png');
  assert.equal(await live.locator('.world-connected .world-scene').evaluate(el => Math.round(Number(getComputedStyle(el).opacity))),1);
  assert((await live.locator('.world-comparison').evaluateAll(els => els.map(el => Number(getComputedStyle(el).opacity)))).every(value => value>.98));
  await page.screenshot({path:'qa/v2/s08-laptop.png'});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(() => document.querySelector('.scaled-slide [data-slide="s08"]').getAnimations({subtree:true}).length===0);
  await page.getByRole('button',{name:'Speaker notes',exact:true}).click();
  assert.match(await page.locator('.notes-panel').textContent(), /not a verified result|planned|does not guarantee/i);
  console.log('Passed: three paired outcomes, uncropped 16:9 scenes, static PDF, safe bounds, 1.92s sequence, reduced motion and speaker notes.');
} finally {
  await browser.close();
}
