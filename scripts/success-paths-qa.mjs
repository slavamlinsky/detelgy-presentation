import assert from 'node:assert/strict';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { PDFDocument } from 'pdf-lib';
import { launchBrowser, baseURL, ready } from './browser.mjs';

const browser = await launchBrowser();
try {
  const print = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  await print.goto(`${baseURL}/en/vision/print`);
  await ready(print);
  const slide = print.locator('[data-slide="s12"]');
  assert.equal(await slide.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(8, 24, 46)');
  assert.equal(await slide.locator('.brand-dark').count(), 1);
  assert.equal((await slide.locator('.slide-folio').innerText()).replace(/\s/g, ''), '14/17');
  assert.deepEqual(await slide.locator('.success-path-card h3').allTextContents(), ['Practitioner', 'Expert', 'Leader']);
  const iconSizes = await slide.locator('.success-path-icon').evaluateAll(icons => icons.map(icon => ({
    box: [icon.getBoundingClientRect().width, icon.getBoundingClientRect().height],
    svg: [icon.querySelector('svg').getBoundingClientRect().width, icon.querySelector('svg').getBoundingClientRect().height],
  })));
  assert.deepEqual(iconSizes, Array(3).fill({ box: [68, 68], svg: [44, 44] }));
  assert.equal(await slide.locator('.success-path-lines path').count(), 3);
  assert.equal(await slide.locator('.success-path-origin strong').innerText(), 'Your ambition');
  assert.equal(await slide.locator('.success-path-origin').evaluate(el => getComputedStyle(el).left), '790px');
  const layout = await slide.evaluate(el => {
    const root = el.getBoundingClientRect();
    const rect = selector => el.querySelector(selector).getBoundingClientRect();
    const cards = [...el.querySelectorAll('.success-path-card')].map(card => {
      const { left, top, right, bottom } = card.getBoundingClientRect();
      return { left: left - root.left, top: top - root.top, right: right - root.left, bottom: bottom - root.top };
    });
    const lines = [...el.querySelectorAll('.success-path-lines path')].map(path => {
      const end = path.getPointAtLength(path.getTotalLength());
      return { x: end.x, y: end.y };
    });
    const heading = rect('.story-title h2');
    const support = rect('.story-title > p');
    const footer = rect('.slide-footer');
    const diagram = rect('.success-branch-scene');
    return {
      cards,
      lines,
      diagramTop: diagram.top - root.top,
      headingRight: heading.right - root.left,
      supportRight: support.right - root.left,
      footerTop: footer.top - root.top,
    };
  });
  assert(layout.cards.every(card => card.left > layout.headingRight + 150 && card.left > layout.supportRight + 150));
  assert(layout.cards.every(card => card.left === 1190));
  assert(layout.cards.every(card => card.bottom < layout.footerTop - 60 && card.right <= 1808));
  assert(layout.cards.every((card, index) => Math.abs(layout.lines[index].x - card.left) < 2 && Math.abs(layout.lines[index].y + layout.diagramTop - (card.top + card.bottom) / 2) < 2));
  assert(layout.cards[0].bottom < layout.cards[1].top && layout.cards[1].bottom < layout.cards[2].top);
  const iconAlignment = await slide.locator('.success-path-icon').evaluateAll(boxes => boxes.map(box => {
    const boxRect = box.getBoundingClientRect();
    const svgRect = box.querySelector('svg').getBoundingClientRect();
    return {
      x: Math.abs((svgRect.left + svgRect.right) / 2 - (boxRect.left + boxRect.right) / 2),
      y: Math.abs((svgRect.top + svgRect.bottom) / 2 - (boxRect.top + boxRect.bottom) / 2),
    };
  }));
  assert(iconAlignment.every(offset => offset.x < 2 && offset.y < 2), 'Every icon should be centered inside its own box');
  await slide.screenshot({ path: join(tmpdir(), 'detelgy-slide-14-1920.png'), animations: 'disabled' });
  await print.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  const pdf = await PDFDocument.load(await print.pdf({ printBackground: true, preferCSSPageSize: true }));
  assert.equal(pdf.getPageCount(), 17);
  await print.close();

  const reduced = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  await reduced.goto(`${baseURL}/en/vision#s12`);
  await ready(reduced);
  const staticSlide = reduced.locator('.scaled-slide [data-slide="s12"]');
  assert.equal(await staticSlide.locator('.success-path-lines path').first().evaluate(el => getComputedStyle(el).animationName), 'none');
  assert.equal(await staticSlide.locator('.success-path-card').first().evaluate(el => getComputedStyle(el).transitionDuration), '0s');
  const reducedOrigin = staticSlide.locator('.success-path-origin');
  await reducedOrigin.focus();
  assert.equal(await reducedOrigin.evaluate(el => getComputedStyle(el, '::before').animationName), 'none');
  assert.equal(await reducedOrigin.locator('.success-path-origin-mark').evaluate(el => getComputedStyle(el).transform), 'none');
  await reduced.close();

  const animated = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  await animated.goto(`${baseURL}/en/vision#s12`);
  await ready(animated);
  const active = animated.locator('.scaled-slide [data-slide="s12"]');
  const sequence = await active.evaluate(el => {
    const delay = selector => parseFloat(getComputedStyle(el.querySelector(selector)).animationDelay);
    return [
      delay('.success-headline-first'), delay('.story-title h2 em'), delay('.story-title > p'),
      delay('.success-path-origin'),
      ...[0, 1, 2].flatMap(index => [delay(`[data-success-line="${index}"]`), delay(`[data-success-path="${index}"]`)]),
    ];
  });
  assert(sequence.every((delay, index) => index === 0 || delay > sequence[index - 1]));
  await animated.waitForTimeout(3150);
  const origin = active.locator('.success-path-origin');
  const labelBefore = await origin.locator('strong').boundingBox();
  const linesBefore = await active.locator('.success-path-lines').boundingBox();
  await origin.hover();
  await animated.waitForTimeout(270);
  await active.screenshot({ path: join(tmpdir(), 'detelgy-slide-14-hover.png') });
  const originScale = await origin.locator('.success-path-origin-mark').evaluate(el => Number(getComputedStyle(el).transform.match(/^matrix\(([^,]+)/)?.[1]));
  assert(Math.abs(originScale - 1.09) < 0.005);
  assert.deepEqual(await origin.locator('strong').boundingBox(), labelBefore);
  assert.deepEqual(await active.locator('.success-path-lines').boundingBox(), linesBefore);
  const pulse = await origin.evaluate(el => {
    const style = getComputedStyle(el, '::before');
    return { name: style.animationName, duration: style.animationDuration, count: style.animationIterationCount };
  });
  assert.deepEqual(pulse, { name: 'ambition-halo-pulse', duration: '0.82s', count: '1' });
  await animated.waitForTimeout(850);
  assert.equal(await origin.evaluate(el => getComputedStyle(el, '::before').opacity), '0');
  await animated.mouse.move(100, 100);
  await animated.waitForTimeout(270);
  assert.equal(await origin.locator('.success-path-origin-mark').evaluate(el => getComputedStyle(el).transform), 'none');
  await origin.focus();
  await animated.waitForTimeout(270);
  const focusScale = await origin.locator('.success-path-origin-mark').evaluate(el => Number(getComputedStyle(el).transform.match(/^matrix\(([^,]+)/)?.[1]));
  assert(Math.abs(focusScale - 1.09) < 0.005);
  assert.deepEqual(await origin.locator('strong').boundingBox(), labelBefore);
  for (const index of [0, 1, 2]) {
    const card = active.locator(`[data-success-path="${index}"]`);
    await card.hover();
    await animated.waitForTimeout(240);
    const scale = await card.evaluate(el => Number(getComputedStyle(el).transform.match(/^matrix\(([^,]+)/)?.[1]));
    assert(Math.abs(scale - 1.02) < 0.005);
  }
  await active.locator('[data-success-path="1"]').focus();
  assert.equal(await active.locator('[data-success-path="1"]').evaluate(el => el === document.activeElement), true);
  await animated.close();
  console.log('Slide 14: static layout, connector endpoints, animation order, hover/focus, reduced motion, and 17-page PDF pass.');
} finally {
  await browser.close();
}
