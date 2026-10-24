import { launchBrowser, baseURL, ready } from './browser.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const titles = ['Become Better', 'Build Reputation', 'Find Opportunities', 'Monetize Expertise'];
const descriptions = [
  'Learn from experienced peers.',
  'Earn trust and professional recognition.',
  'Connect with clients and partners.',
  'Create new income opportunities.',
];
const browser = await launchBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(`${baseURL}/en/vision/print`);
  await ready(page);
  await page.emulateMedia({ media: 'print' });
  const slide = page.locator('[data-slide="s07"]');
  assert.equal(await slide.count(), 1);
  assert.equal(await slide.locator('.ambition').count(), 4);
  assert.deepEqual(await slide.locator('.ambition h3').allTextContents(), titles);
  assert.deepEqual(await slide.locator('.ambition p').allTextContents(), descriptions);
  const descriptionLines = await slide.locator('.ambition p').evaluateAll(els => els.map(el => el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)));
  assert(descriptionLines.every(lines => lines < 1.1), `Descriptions should fit one line at 1920×1080: ${descriptionLines.join(', ')}`);
  assert.equal(await slide.locator('.story-title > p').textContent(), 'Every professional defines success differently.');
  assert.equal(await slide.locator('.ambition-index').count(), 0);
  assert.equal(await slide.locator('.ambition-art svg').first().evaluate(el => Math.round(el.getBoundingClientRect().width)), 202);
  assert.equal((await slide.locator('.slide-folio').textContent()).replace(/\s/g, ''), '07/17');
  assert.equal(await slide.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(250, 249, 246)');
  assert((await slide.locator('.ambition-art,.ambition-copy').evaluateAll(els => els.map(el => getComputedStyle(el).opacity))).every(v => v === '1'));
  const bounds = await slide.locator('.story-title,.ambition').evaluateAll(els => els.map(el => {
    const r = el.getBoundingClientRect(), s = el.closest('article').getBoundingClientRect();
    return [r.left - s.left, r.right - s.left, r.top - s.top, r.bottom - s.top];
  }));
  bounds.forEach(([left,right,top,bottom]) => assert(left >= 100 && right <= 1815 && top >= 150 && bottom < 995));
  await slide.screenshot({ path: 'qa/v2/s07.png' });
  await page.pdf({ path: 'qa/v2/s07-review.pdf', pageRanges: '7', printBackground: true, preferCSSPageSize: true });

  await page.emulateMedia({ media: 'screen' });
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto(`${baseURL}/en/vision#s07`);
  await ready(page);
  const live = page.locator('.scaled-slide [data-slide="s07"]');
  const animations = await live.evaluate(el => el.getAnimations({ subtree: true }).map(a => a.effect.getTiming()));
  assert.equal(animations.length, 10);
  assert(animations.every(t => t.iterations === 1));
  assert.deepEqual(animations.map(t => t.delay).sort((a,b) => a-b), [80,530,1020,1150,1190,1320,1360,1490,1530,1660]);
  await live.evaluate(el => Promise.all(el.getAnimations({ subtree: true }).map(a => a.finished)));
  await page.screenshot({ path: 'qa/v2/s07-laptop.png' });
  const first = live.locator('.ambition').first();
  const base = await first.locator('.ambition-wash').evaluate(el => getComputedStyle(el).fill);
  await first.hover();
  await page.waitForTimeout(250);
  assert.notEqual(await first.locator('.ambition-wash').evaluate(el => getComputedStyle(el).fill), base);
  await page.screenshot({ path: 'qa/v2/s07-hover.png' });
  await page.mouse.move(0,0);
  const second = live.locator('.ambition').nth(1);
  await second.focus();
  await page.waitForTimeout(250);
  assert.notEqual(await second.locator('.ambition-wash').evaluate(el => getComputedStyle(el).fill), base);
  assert.equal(await second.evaluate(el => el === document.activeElement), true);
  await page.screenshot({ path: 'qa/v2/s07-focus.png' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => document.querySelector('.scaled-slide [data-slide="s07"]').getAnimations({ subtree: true }).length === 0);
  const deck = JSON.parse(await readFile('content/locales/en.json', 'utf8'));
  assert.match(deck.slides.find(item => item.id === 's07').note, /not a mandatory sequence|does not guarantee income growth/i);
  console.log('Passed: static layout, PDF export, four ambitions, timed reveals, hover/focus, reduced motion and notes.');
} finally {
  await browser.close();
}
