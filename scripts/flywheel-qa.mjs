import assert from 'node:assert/strict';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { readFile } from 'node:fs/promises';
import { PDFDocument } from 'pdf-lib';
import { launchBrowser, baseURL, ready } from './browser.mjs';

const deck = JSON.parse(await readFile('content/locales/en.json', 'utf8'));
const content = deck.slides[12];
assert.equal(content.id, 's11');
assert.equal(content.items.length, 5);
assert.match(content.note, /hypothesis/);

const browser = await launchBrowser();
try {
  const print = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  await print.goto(`${baseURL}/en/vision/print`);
  await ready(print);
  const slide = print.locator('[data-slide="s11"]');
  assert.equal(await slide.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(234, 244, 252)');
  assert.equal(await slide.locator('.brand-dark').count(), 0, 'Light slide uses the navy logo');
  assert.equal(await slide.locator('.slide-folio').innerText().then(s => s.replace(/\s/g, '')), '13/17');
  assert.equal(await slide.locator('.story-title h2').innerText(), 'Every contribution creates momentum.');
  assert.equal(await slide.locator('.flywheel-microcopy').innerText(), 'Even small actions create value.');
  assert.equal(await slide.locator('.flywheel-hub text').allTextContents().then(t => t.join(' ')), 'Professional Growth');
  assert.deepEqual(await slide.locator('.flywheel-stage-label').allTextContents(), [
    'Contribute', 'Gain visibility', 'Build trust', 'Find opportunities', 'Return & share',
  ]);
  assert.equal(await slide.locator('.flywheel-connector').count(), 5);
  const connectorLabelCollisions = await slide.locator('.growth-flywheel').evaluate(svg => {
    const labels = [...svg.querySelectorAll('.flywheel-stage-label')].map(el => el.getBBox());
    return [...svg.querySelectorAll('.flywheel-connector')].flatMap((path, connector) => {
      const length = path.getTotalLength();
      return labels.flatMap((box, label) => {
        for (let i = 0; i <= 100; i++) {
          const point = path.getPointAtLength(length * i / 100);
          if (point.x >= box.x - 8 && point.x <= box.x + box.width + 8 && point.y >= box.y - 8 && point.y <= box.y + box.height + 8) {
            return [{ connector, label }];
          }
        }
        return [];
      });
    });
  });
  assert.deepEqual(connectorLabelCollisions, [], 'Connector lines must not cross stage labels');
  const layout = await slide.evaluate(el => {
    const root = el.getBoundingClientRect();
    const footer = el.querySelector('.slide-footer').getBoundingClientRect();
    const visible = [...el.querySelectorAll('.story-title h2, .story-title p, .flywheel-microcopy, .flywheel-stage-label, .flywheel-hub text')]
      .map(node => node.getBoundingClientRect());
    const lead = el.querySelector('.story-title > p').getBoundingClientRect();
    const microcopy = el.querySelector('.flywheel-microcopy').getBoundingClientRect();
    return {
      safe: visible.every(r => r.left >= root.left + 100 && r.right <= root.right - 100 && r.top >= root.top + 140 && r.bottom < footer.top - 30),
      microcopySpacing: microcopy.top - lead.bottom >= 80 && footer.top - microcopy.bottom >= 50,
      copy: [...el.querySelectorAll('.story-title h2, .story-title > p')].flatMap(node => {
        const range = document.createRange();
        range.selectNodeContents(node);
        return [...range.getClientRects()];
      }),
      rightLabels: [...el.querySelectorAll('.flywheel-stage-label')].map(node => node.getBoundingClientRect()),
    };
  });
  assert(layout.safe, 'Flywheel text should stay in slide safe areas');
  assert(layout.microcopySpacing, 'Microcopy should have breathing room below the paragraph and above the footer');
  for (const label of layout.rightLabels) {
    for (const copy of layout.copy) {
      assert(label.right <= copy.left || label.left >= copy.right || label.bottom <= copy.top || label.top >= copy.bottom, `Flywheel label overlaps copy: ${JSON.stringify({ label, copy })}`);
    }
  }
  await slide.screenshot({ path: join(tmpdir(), 'detelgy-slide-13-1920.png'), animations: 'disabled' });
  await print.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  assert.equal(await slide.locator('.flywheel-stage:visible').count(), 5);
  const pdf = await PDFDocument.load(await print.pdf({ printBackground: true, preferCSSPageSize: true }));
  assert.equal(pdf.getPageCount(), 17);
  await print.close();

  const reduced = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  await reduced.goto(`${baseURL}/en/vision#s11`);
  await ready(reduced);
  const staticSlide = reduced.locator('.scaled-slide [data-slide="s11"]');
  assert.equal(await staticSlide.locator('.flywheel-connector').first().evaluate(el => getComputedStyle(el).animationName), 'none');
  assert.equal(await staticSlide.locator('.flywheel-node-visual').first().evaluate(el => getComputedStyle(el).transitionDuration), '0s');
  await reduced.close();

  const animated = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  await animated.goto(`${baseURL}/en/vision#s11`);
  await ready(animated);
  const active = animated.locator('.scaled-slide [data-slide="s11"]');
  const sequence = await active.evaluate(el => {
    const delay = selector => {
      const style = getComputedStyle(el.querySelector(selector));
      return { name: style.animationName, delay: parseFloat(style.animationDelay) };
    };
    return [
      delay('.story-title h2'), delay('.story-title > p'), delay('.flywheel-hub'),
      delay('[data-flywheel-stage="0"]'),
      ...[0, 1, 2, 3].flatMap(i => [delay(`[data-connector="${i}"]`), delay(`[data-flywheel-stage="${i + 1}"]`)]),
      delay('[data-connector="4"]'),
    ];
  });
  assert(sequence.every((step, i) => step.name !== 'none' && (i === 0 || step.delay > sequence[i - 1].delay)), 'Flywheel entrance should build clockwise after the copy and hub');
  await animated.waitForTimeout(3600);
  for (const index of [0, 1, 2, 3, 4]) {
    const stage = active.locator(`[data-flywheel-stage="${index}"]`);
    const node = stage.locator('.flywheel-node');
    const labelBefore = await stage.locator('.flywheel-stage-label').boundingBox();
    await node.hover();
    await animated.waitForTimeout(260);
    const scale = await node.locator('.flywheel-node-visual').evaluate(el => Number(getComputedStyle(el).transform.match(/^matrix\(([^,]+)/)?.[1]));
    assert(Math.abs(scale - 1.08) < 0.005, `Stage ${index} should scale on hover`);
    assert.deepEqual(await stage.locator('.flywheel-stage-label').boundingBox(), labelBefore, 'Flywheel text should stay stationary');
  }
  await animated.keyboard.press('Tab');
  const focus = active.locator('[data-flywheel-stage="2"] .flywheel-node');
  await focus.focus();
  await animated.waitForTimeout(260);
  assert.equal(await focus.evaluate(el => el.matches(':focus-visible')), true);
  const focusScale = await focus.locator('.flywheel-node-visual').evaluate(el => Number(getComputedStyle(el).transform.match(/^matrix\(([^,]+)/)?.[1]));
  assert(Math.abs(focusScale - 1.08) < 0.005, 'Keyboard focus should match hover');
  await animated.close();
  console.log('Slide 13: 1920 layout, clockwise sequence, hover/focus, reduced motion, and 17-page print passed.');
} finally {
  await browser.close();
}
