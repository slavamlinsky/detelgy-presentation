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
  assert.deepEqual((await slide.locator('.world-before .world-comparison > span:first-child').allTextContents()), before);
  assert.deepEqual((await slide.locator('.world-connected .world-comparison > span:first-child').allTextContents()), after);
  const icons=await slide.locator('.world-comparison-label svg').evaluateAll(els=>els.map(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height,stroke:el.getAttribute('stroke-width'),name:el.getAttribute('class')})));
  assert.equal(icons.length,6);
  assert(icons.every(icon=>icon.width===16 && icon.height===16 && icon.stroke==='1.75'));
  assert.deepEqual(icons.slice(0,3).map(icon=>icon.name), icons.slice(3).map(icon=>icon.name));
  assert.equal(await slide.locator('.world-progress svg').count(),0);
  assert.equal((await slide.locator('.slide-folio').textContent()).replace(/\s/g,''), '08/14');
  assert.deepEqual(await slide.locator('.world-scene img').evaluateAll(imgs => imgs.map(img => img.getAttribute('src'))), ['/assets/personas/david-before-office-wide.png','/assets/personas/david-connected-office-wide.png']);
  assert((await slide.locator('.world-scene img').evaluateAll(imgs => imgs.map(img => img.complete && img.naturalWidth>0))).every(Boolean));
  assert((await slide.locator('.world-scene img').evaluateAll(imgs => imgs.map(img => Math.abs(img.naturalWidth/img.naturalHeight-16/9)<.08 && getComputedStyle(img).objectFit==='contain'))).every(Boolean));
  const indicators=await slide.locator('.world-state').evaluateAll(states => states.map(state =>
    [...state.querySelectorAll('.world-comparison')].map(row => {
      const track=row.querySelector('.world-progress');
      const fill=track.querySelector('.world-progress-fill');
      return { width:track.getBoundingClientRect().width, height:track.getBoundingClientRect().height, ratio:fill.getBoundingClientRect().width/track.getBoundingClientRect().width };
    })
  ));
  const [beforeIndicators,afterIndicators]=indicators;
  assert(beforeIndicators.every((b,i) => b.width===220 && b.height===2 && b.ratio>.25 && b.ratio<.4 && afterIndicators[i].width===b.width && afterIndicators[i].height===2 && afterIndicators[i].ratio>.75 && afterIndicators[i].ratio<.85));
  assert.equal(new Set(beforeIndicators.map(b => Math.round(b.ratio*100))).size,3);
  assert.equal(new Set(afterIndicators.map(a => Math.round(a.ratio*100))).size,3);
  const spacing=await slide.evaluate(el => {
    const box=selector => el.querySelector(selector).getBoundingClientRect();
    const before=box('.world-before .world-scene'), after=box('.world-connected .world-scene');
    const overlay=box('.world-before .world-overlay'), connectedOverlay=box('.world-connected .world-overlay'), arrow=box('.world-seam');
    const rows=[...el.querySelectorAll('.world-before .world-comparison')].map(row=>row.getBoundingClientRect());
    const tracks=[...el.querySelectorAll('.world-before .world-progress')].map(track=>track.getBoundingClientRect());
    const labels=[...el.querySelectorAll('.world-before .world-comparison > span:first-child')].map(label=>label.getBoundingClientRect());
    return {
      supportToImage: before.top-box('.story-title > p').bottom,
      sectionToImage: before.top-box('.world-before .world-state-title').bottom,
      panelGap: after.left-before.right,
      cardWidthRatio: overlay.width/before.width,
      cardCentered: Math.abs((overlay.left+overlay.right)/2-(before.left+before.right)/2)<1 && Math.abs((connectedOverlay.left+connectedOverlay.right)/2-(after.left+after.right)/2)<1,
      cardOverlapRatio: (before.bottom-overlay.top)/overlay.height,
      cardBelowImage: overlay.bottom>before.bottom && connectedOverlay.bottom>after.bottom,
      overlayPadTop: rows[0].top-overlay.top,
      overlayPadBottom: overlay.bottom-rows.at(-1).bottom,
      rowGaps: rows.slice(1).map((row,index)=>row.top-rows[index].bottom),
      labelLineGaps: tracks.map((track,index)=>track.top-labels[index].bottom),
      linesInside: tracks.every(track=>track.top>=overlay.top && track.bottom<=overlay.bottom),
      arrowInGap: arrow.left>=before.right && arrow.right<=after.left,
      footerGap: box('.slide-folio').top-Math.max(overlay.bottom,connectedOverlay.bottom),
    };
  });
  assert(spacing.supportToImage > 90 && spacing.sectionToImage>=18 && spacing.panelGap>=120 && spacing.cardWidthRatio>=.6 && spacing.cardWidthRatio<=.66 && spacing.cardCentered && spacing.cardOverlapRatio>=.2 && spacing.cardOverlapRatio<=.3 && spacing.cardBelowImage && spacing.overlayPadTop>=14 && spacing.overlayPadBottom>=14 && spacing.rowGaps.every(gap=>gap>=11 && gap<=14) && spacing.labelLineGaps.every(gap=>gap>=6 && gap<=8) && spacing.linesInside && spacing.arrowInGap && spacing.footerGap>=20, JSON.stringify(spacing));
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
  assert.equal(timings.length,22);
  assert(timings.every(t => t.iterations===1 && t.delay+t.duration<=2600));
  const frame=async(time,path) => {
    await live.evaluate((el,ms) => el.getAnimations({subtree:true}).forEach(a => {a.pause();a.currentTime=ms}),time);
    await live.screenshot({path});
  };
  await frame(900,'qa/v2/s08-motion-before.png');
  assert(Number(await live.locator('.world-before .world-scene').evaluate(el => getComputedStyle(el).opacity))>.5);
  assert.equal(Number(await live.locator('.world-connected .world-scene').evaluate(el => getComputedStyle(el).opacity)),0);
  await frame(1250,'qa/v2/s08-motion-transition.png');
  assert(Number(await live.locator('.world-seam').evaluate(el => getComputedStyle(el).opacity))>.5);
  assert.equal(Number(await live.locator('.world-connected .world-comparison[data-pair="0"]').evaluate(el => getComputedStyle(el).opacity)),0);
  await frame(2550,'qa/v2/s08-motion-connected.png');
  assert.equal(await live.locator('.world-connected .world-scene').evaluate(el => Math.round(Number(getComputedStyle(el).opacity))),1);
  assert((await live.locator('.world-comparison').evaluateAll(els => els.map(el => Number(getComputedStyle(el).opacity)))).every(value => value>.98));
  assert((await live.locator('.world-progress-fill').evaluateAll(els => els.map(el => getComputedStyle(el).transform))).every(value => value==='matrix(1, 0, 0, 1, 0, 0)'));
  await page.screenshot({path:'qa/v2/s08-laptop.png'});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(() => document.querySelector('.scaled-slide [data-slide="s08"]').getAnimations({subtree:true}).length===0);
  assert((await live.locator('.world-progress-fill').evaluateAll(els => els.map(el => getComputedStyle(el).transform))).every(value => value==='none'));
  await page.getByRole('button',{name:'Speaker notes',exact:true}).click();
  const notes=await page.locator('.notes-panel').textContent();
  assert.match(notes, /not a verified result|planned|does not guarantee/i);
  assert.match(notes, /not measured performance or quantified outcomes/i);
  console.log('Passed: paired labels, illustrative indicators, static PDF, safe bounds, staggered fills, reduced motion and speaker notes.');
} finally {
  await browser.close();
}
