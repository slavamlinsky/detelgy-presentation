import assert from 'node:assert/strict';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { readFile } from 'node:fs/promises';
import { PDFDocument } from 'pdf-lib';
import { launchBrowser, baseURL, ready } from './browser.mjs';

const deck = JSON.parse(await readFile('content/locales/en.json', 'utf8'));
const content = deck.slides[14];
assert.equal(content.id, 's13');
assert.deepEqual(content.columns, ['Value for professionals', 'Revenue for the platform']);
assert.deepEqual(content.valueItems.map(item => item.title), [
  'Professional visibility', 'Client opportunities', 'Knowledge & connections',
]);
assert.deepEqual(content.items.map(item => item.status), ['planned', 'planned', 'planned']);
assert.match(content.note, /No revenue/);
assert.match(content.note, /planned recurring revenue model/);
assert.match(content.note, /completed marketplace transactions/);
assert.match(content.note, /future revenue opportunities/);

const browser = await launchBrowser();
try {
  const print = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  await print.goto(`${baseURL}/en/vision/print`);
  await ready(print);
  const slide = print.locator('[data-slide="s13"]');
  assert.equal(await slide.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(250, 249, 246)');
  assert.equal((await slide.locator('.slide-folio').innerText()).replace(/\s/g, ''), '15/17');
  assert.equal(await slide.locator('.story-title h2 em').innerText(), 'Monetize the value created.');
  assert.deepEqual(await slide.locator('.business-column-heading').allTextContents(), content.columns);
  assert.deepEqual(await slide.locator('.business-column-heading').evaluateAll(elements => elements.map(el => getComputedStyle(el).fontSize)), ['44px', '44px']);
  assert.deepEqual(await slide.locator('.business-column-value h4').allTextContents(), content.valueItems.map(item => item.title));
  assert.deepEqual(await slide.locator('.business-column-value .business-card > p').allTextContents(), content.valueItems.map(item => item.body));
  assert.deepEqual(await slide.locator('.business-column-revenue h4').allTextContents(), content.items.map(item => item.title));
  assert.deepEqual(await slide.locator('.business-column-revenue .business-card > p').allTextContents(), content.items.map(item => item.body));
  assert.equal(await slide.locator('.business-status').count(), 0);
  assert.equal(await slide.locator('.business-arrow').count(), 0);
  const layout = await slide.evaluate(el => {
    const root = el.getBoundingClientRect();
    const footer = el.querySelector('.slide-footer').getBoundingClientRect();
    const columns = [...el.querySelectorAll('.business-column')].map(column => {
      const cards = [...column.querySelectorAll('.business-card')].map(card => {
        const rect = card.getBoundingClientRect();
        return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height };
      });
      return { cards };
    });
    return { columns, footerTop: footer.top - root.top, rootTop: root.top };
  });
  const [left, right] = layout.columns.map(column => column.cards);
  assert.equal(left.length, 3);
  assert.equal(right.length, 3);
  assert(left.every((card, index) => Math.abs(card.height - right[index].height) < 1));
  assert(left.every(card => Math.abs(card.height - left[0].height) < 1));
  assert(left.every((card, index) => Math.abs(card.top - right[index].top) < 1));
  assert(Math.abs(left[0].width - right[0].width) < 1);
  assert(left[0].right + 30 < right[0].left);
  assert(left[2].bottom - layout.rootTop < layout.footerTop - 50, JSON.stringify({ bottom: left[2].bottom - layout.rootTop, footer: layout.footerTop }));
  const cardStyles = await slide.locator('.business-card').evaluateAll(elements => elements.map(el => {
    const style = getComputedStyle(el);
    return { padding: style.padding, radius: style.borderRadius, background: style.backgroundColor };
  }));
  assert.equal(new Set(cardStyles.map(style => style.padding)).size, 1);
  assert.equal(new Set(cardStyles.map(style => style.radius)).size, 1);
  assert.equal(new Set(cardStyles.slice(0, 3).map(style => style.background)).size, 1);
  assert.equal(new Set(cardStyles.slice(3).map(style => style.background)).size, 1);
  assert.notEqual(cardStyles[0].background, cardStyles[3].background);
  await slide.screenshot({ path: join(tmpdir(), 'detelgy-slide-15-1920.png'), animations: 'disabled' });
  await print.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  const pdf = await PDFDocument.load(await print.pdf({ printBackground: true, preferCSSPageSize: true }));
  assert.equal(pdf.getPageCount(), 17);
  await print.close();

  const reduced = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  await reduced.goto(`${baseURL}/en/vision#s13`);
  await ready(reduced);
  const staticSlide = reduced.locator('.scaled-slide [data-slide="s13"]');
  assert.equal(await staticSlide.locator('.business-card').first().evaluate(el => getComputedStyle(el).animationName), 'none');
  await reduced.close();

  const animated = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  await animated.goto(`${baseURL}/en/vision#s13`);
  await ready(animated);
  const active = animated.locator('.scaled-slide [data-slide="s13"]');
  const sequence = await active.evaluate(el => {
    const delay = selector => parseFloat(getComputedStyle(el.querySelector(selector)).animationDelay);
    return [
      delay('.business-headline-first'), delay('.story-title h2 em'),
      delay('.business-column-value .business-column-heading'),
      ...[0, 1, 2].map(index => delay(`[data-value-card="${index}"]`)),
      delay('.business-column-revenue .business-column-heading'),
      ...[0, 1, 2].map(index => delay(`[data-revenue-card="${index}"]`)),
    ];
  });
  assert(sequence.every((delay, index) => index === 0 || delay > sequence[index - 1]));
  await animated.waitForTimeout(2700);
  assert.equal(await active.locator('.business-card:visible').count(), 6);
  await animated.close();
  console.log('Slide 15: independent columns, copy, hidden planned statuses, alignment, reveal order, reduced motion, and 17-page PDF pass.');
} finally {
  await browser.close();
}
