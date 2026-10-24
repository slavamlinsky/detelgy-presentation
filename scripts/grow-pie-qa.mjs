import assert from 'node:assert/strict';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { readFile } from 'node:fs/promises';
import { PDFDocument } from 'pdf-lib';
import { launchBrowser, baseURL, ready } from './browser.mjs';

const deck = JSON.parse(await readFile('content/locales/en.json', 'utf8'));
const last = deck.slides.at(-1);
const penultimate = deck.slides.at(-2);
assert.equal(penultimate.id, 'grow-pie');
assert.equal(last.id, 's14');
const browser = await launchBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${baseURL}/en/vision/print`);
  await ready(page);
  assert.equal(await page.locator('article.slide').count(), deck.slides.length);
  const slide = page.locator('[data-slide="grow-pie"]');
  const invitation = page.locator('[data-slide="s14"]');
  assert.equal((await slide.locator('.slide-folio').textContent()).replace(/\s/g, ''), `${deck.slides.length - 1}/${deck.slides.length}`);
  assert.equal((await invitation.locator('.slide-folio').textContent()).replace(/\s/g, ''), `${deck.slides.length}/${deck.slides.length}`);
  assert.equal(await slide.locator('.pie-disc-share').count(), 2);
  assert.match(await slide.locator('.pie-final').innerText(), /because you succeed\. Not instead of you\./);
  const bounds = await slide.evaluate(el => {
    const root = el.getBoundingClientRect(), footer = el.querySelector('.slide-footer').getBoundingClientRect();
    return [...el.querySelectorAll('main h2, main p, main figcaption, main .pie-eyebrow')].filter(node => {
      const r = node.getBoundingClientRect();
      return r.left < root.left + 80 || r.right > root.right - 80 || r.bottom > footer.top - 8;
    }).map(node => node.textContent);
  });
  assert.deepEqual(bounds, [], 'Grow the Pie text overflows its safe area');
  const spacing = await slide.evaluate(el => {
    const rect = selector => el.querySelector(selector).getBoundingClientRect();
    return { existingGap: rect('.pie-disc-left circle').top - rect('.pie-state-existing').bottom,
      growingGap: rect('.pie-disc-right circle').top - rect('.pie-state-growing').bottom,
      conclusionGap: rect('.pie-final').top - rect('.pie-disc-right circle').bottom };
  });
  assert(spacing.existingGap >= 8 && spacing.growingGap >= 8 && spacing.conclusionGap >= 8, `Visual elements collide: ${JSON.stringify(spacing)}`);
  await slide.screenshot({ path: join(tmpdir(), 'detelgy-grow-pie-1920.png'), animations: 'disabled' });
  await invitation.screenshot({ path: join(tmpdir(), 'detelgy-invitation-1920.png'), animations: 'disabled' });
  await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  const printed = await PDFDocument.load(await page.pdf({ printBackground: true, preferCSSPageSize: true }));
  assert.equal(printed.getPageCount(), deck.slides.length);
  await page.emulateMedia({ media: 'screen', reducedMotion: 'reduce' });
  await page.goto(`${baseURL}/en/vision#s13`);
  await ready(page);
  await page.keyboard.press('ArrowRight');
  await page.waitForURL('**#grow-pie');
  await page.waitForTimeout(450);
  await page.keyboard.press('ArrowRight');
  await page.waitForURL('**#s14');
  await page.goBack();
  await page.waitForURL('**#grow-pie');
  assert.equal(await page.locator('.scaled-slide .pie-disc-right .pie-disc-inner').evaluate(el => getComputedStyle(el).animationName), 'none', 'Reduced motion should show the finished graphic');
  await page.keyboard.press('End');
  await page.waitForURL('**#s14');
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mobile.goto(`${baseURL}/en/vision#grow-pie`);
  await ready(mobile);
  assert.equal(await mobile.locator('.reading-content').isVisible(), true);
  assert.match(await mobile.locator('.reading-content').innerText(), /We want to succeed because you succeed/);
  await mobile.close();
  const laptop = await browser.newPage({ viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' });
  await laptop.goto(`${baseURL}/en/vision#grow-pie`);
  await ready(laptop);
  const fitsLaptop = await laptop.locator('.slide-viewport').evaluate(el => {
    const r = el.getBoundingClientRect();
    return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight;
  });
  assert.equal(fitsLaptop, true, 'Presentation canvas does not fit a smaller laptop');
  await laptop.screenshot({ path: join(tmpdir(), 'detelgy-grow-pie-laptop.png') });
  await laptop.close();
  const animated = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  await animated.goto(`${baseURL}/en/vision#grow-pie`);
  await ready(animated);
  assert.equal(await animated.locator('.scaled-slide .pie-disc-right .pie-disc-inner').evaluate(el => getComputedStyle(el).animationName), 'pie-grow');
  const delays = await animated.locator('.scaled-slide .story-grow-pie').evaluate(el => {
    const delay = selector => parseFloat(getComputedStyle(el.querySelector(selector)).animationDelay);
    return [delay('.pie-headline-first'), delay('.pie-disc-left'), delay('.pie-disc-right .pie-disc-inner'), delay('.pie-headline-second'), delay('.pie-support'), delay('.pie-final')];
  });
  assert(delays.every((value, index) => index === 0 || value > delays[index - 1]), `Reveal order is not sequential: ${delays}`);
  await animated.close();
  assert.deepEqual(errors, []);
  console.log(`Grow the Pie: penultimate order, ${deck.slides.length}-page print, safe area, mobile reading, navigation, and history passed.`);
} finally { await browser.close(); }
