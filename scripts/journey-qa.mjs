import assert from 'node:assert/strict';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { readFile } from 'node:fs/promises';
import { PDFDocument } from 'pdf-lib';
import { launchBrowser, baseURL, ready } from './browser.mjs';

const deck = JSON.parse(await readFile('content/locales/en.json', 'utf8'));
const browser = await launchBrowser();
try {
  const print = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  await print.goto(`${baseURL}/en/vision/print`);
  await ready(print);
  const slide = print.locator('[data-slide="s10"]');
  assert.equal(await slide.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(250, 249, 246)');
  assert.equal(await slide.locator('.slide-folio').innerText().then(text => text.replace(/\s/g, '')), '12/17');
  assert.deepEqual(await slide.locator('.v2-route [data-stage] text').allTextContents(), ['Discover', 'Join', 'First Value', 'Engage', 'Grow']);
  assert.equal(await slide.locator('.journey-segment').count(), 5);
  assert.equal(await slide.locator('.v2-value-eyebrow').count(), 0, 'The visible examples label should be removed');
  assert.equal(await slide.locator('.v2-first-values').getAttribute('aria-label'), 'First Value examples');
  assert.equal(await slide.locator('.v2-first-values button').count(), 0, 'Examples should be visible without tabs');
  assert.deepEqual(await slide.locator('.v2-value-examples h3').allInnerTexts(), ['Emerging Professional', 'Independent Examiner', 'Established Expert']);
  assert.deepEqual(await slide.locator('.v2-value-examples strong').allInnerTexts(), [
    'First useful peer exchange', 'First qualified client inquiry', 'First meaningful peer request',
  ]);
  assert.deepEqual(await slide.locator('.v2-value-examples p').allInnerTexts(), [
    'Get helpful advice from a colleague.',
    'Receive interest in your services.',
    'Share expertise with another professional.',
  ]);
  assert.equal(await slide.locator('.v2-persona-marker img').count(), 3);
  assert.equal(await slide.locator('.v2-persona-marker img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), true);
  const safe = await slide.evaluate(el => {
    const root = el.getBoundingClientRect();
    const footer = el.querySelector('.slide-footer').getBoundingClientRect();
    const nodes = [...el.querySelectorAll('.v2-journey-copy h2, .v2-journey-copy p, .v2-first-values h3, .v2-first-values strong, .v2-first-values p')];
    return nodes.filter(node => {
      const box = node.getBoundingClientRect();
      if (!box.width || !box.height) return false;
      return box.left < root.left + 80 || box.right > root.right - 80 || box.bottom > footer.top - 8;
    }).map(node => node.textContent);
  });
  assert.deepEqual(safe, [], 'Slide 12 text must stay within safe areas');
  const clearance = await slide.evaluate(el => el.querySelector('.slide-footer').getBoundingClientRect().top - el.querySelector('.v2-value-examples').getBoundingClientRect().bottom);
  assert(clearance >= 24, `First Value examples need footer clearance: ${clearance}px`);
  await slide.screenshot({ path: join(tmpdir(), 'detelgy-slide-12-1920.png'), animations: 'disabled' });

  await print.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  assert.equal(await slide.locator('.v2-value-examples section:visible').count(), 3);
  await slide.screenshot({ path: join(tmpdir(), 'detelgy-slide-12-print-1920.png'), animations: 'disabled' });
  const pdf = await PDFDocument.load(await print.pdf({ printBackground: true, preferCSSPageSize: true }));
  assert.equal(pdf.getPageCount(), deck.slides.length);
  await print.close();

  const viewer = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  await viewer.goto(`${baseURL}/en/vision#s10`);
  await ready(viewer);
  const active = viewer.locator('.scaled-slide [data-slide="s10"]');
  assert.equal(await active.locator('.v2-value-examples section:visible').count(), 3);
  assert.equal(await active.locator('.journey-segment').first().evaluate(el => getComputedStyle(el).animationName), 'none');
  await viewer.close();

  const animated = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  await animated.goto(`${baseURL}/en/vision#s10`);
  await ready(animated);
  const motion = await animated.locator('.scaled-slide [data-slide="s10"]').evaluate(el => {
    const timing = selector => {
      const css = getComputedStyle(el.querySelector(selector));
      return { name: css.animationName, delay: parseFloat(css.animationDelay) };
    };
    const journey = [
      timing('h2 span'), timing('h2 em'), timing('.v2-journey-copy > p'),
      timing('[data-segment="0"]'), timing('[data-stage="0"]'),
      timing('[data-segment="1"]'), timing('[data-stage="1"]'),
      timing('[data-segment="2"]'), timing('[data-stage="2"]'), timing('.journey-focus-ring'),
      timing('[data-segment="3"]'), timing('[data-stage="3"]'),
      timing('[data-segment="4"]'), timing('[data-stage="4"]'), timing('.journey-arrow'),
    ];
    const examples = [
      timing('.journey-value-branch'),
      timing('.v2-value-examples section:nth-child(1)'),
      timing('.v2-value-examples section:nth-child(2)'),
      timing('.v2-value-examples section:nth-child(3)'),
    ];
    return { journey, examples };
  });
  assert(motion.journey.every((step, i) => step.name !== 'none' && (i === 0 || step.delay > motion.journey[i - 1].delay)), 'Journey entrance should follow the stated sequence');
  assert(motion.examples.every((step, i) => step.name !== 'none' && (i === 0 ? step.delay > motion.journey[8].delay : step.delay > motion.examples[i - 1].delay)), 'Examples should reveal after First Value, left to right');
  await animated.waitForTimeout(3800);
  for (const index of [0, 1, 2, 3, 4]) {
    const stage = animated.locator(`.scaled-slide [data-slide="s10"] [data-stage="${index}"]`);
    const node = stage.locator('.journey-node-interactive');
    const labelBefore = await stage.locator('text').boundingBox();
    await node.hover();
    await animated.waitForTimeout(260);
    const scale = await node.evaluate(el => Number(getComputedStyle(el).transform.match(/^matrix\(([^,]+)/)?.[1]));
    assert(Math.abs(scale - (index === 2 ? 1.1 : 1.08)) < 0.005, `Stage ${index} hover scale should be restrained`);
    const labelAfter = await stage.locator('text').boundingBox();
    assert.deepEqual(labelAfter, labelBefore, `Stage ${index} label should remain stationary`);
  }
  await animated.keyboard.press('Tab');
  const focused = animated.locator('.scaled-slide [data-slide="s10"] [data-stage="2"] .journey-node-interactive');
  await focused.focus();
  await animated.waitForTimeout(260);
  assert.equal(await focused.evaluate(el => el.matches(':focus-visible')), true, 'Journey node should be keyboard focusable');
  const focusScale = await focused.evaluate(el => Number(getComputedStyle(el).transform.match(/^matrix\(([^,]+)/)?.[1]));
  assert(Math.abs(focusScale - 1.1) < 0.005, 'First Value should scale on keyboard focus');
  await animated.close();
  console.log('Slide 12: 1920 screenshot, sequential journey and example reveals, three persona markers, reduced motion, and 17-page print passed.');
} finally {
  await browser.close();
}
