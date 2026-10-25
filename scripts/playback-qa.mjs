import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PDFDocument } from 'pdf-lib';
import { launchBrowser, baseURL, ready } from './browser.mjs';

const deck = JSON.parse(await readFile('content/locales/en.json', 'utf8'));
const checkpointIds = ['s08', 'coopetition', 's13', 'grow-pie', 's14'];
const current = page => page.locator('.scaled-slide .presentation-slide-layer:last-child .slide');
const waitForSlide = (page, id) => page.waitForFunction(id => document.querySelector('.scaled-slide .presentation-slide-layer:last-child .slide')?.dataset.slide === id, id);
const idle = page => page.waitForFunction(() => document.querySelector('.studio')?.dataset.playbackBusy === 'false' && !document.querySelector('.presentation-slide-in'));
const complete = page => page.waitForFunction(() => {
  const slide = document.querySelector('.scaled-slide .presentation-slide-layer:last-child .slide');
  return slide && !slide.querySelector('[data-reveal-hidden]') && slide.getAnimations({ subtree: true }).every(animation => !(animation instanceof CSSAnimation) || animation.effect.getComputedTiming().iterations === Infinity || animation.playState === 'finished');
}, null, { timeout: 5000 });
const browser = await launchBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text().slice(0, 600)); });

  // Every selected checkpoint must auto-complete from a shared Explore link.
  for (const id of checkpointIds) {
    const index = deck.slides.findIndex(slide => slide.id === id);
    await page.goto(`${baseURL}/en/vision?slide=${index + 1}&present=true`);
    await ready(page);
    await waitForSlide(page, id);
    await complete(page);
    assert.equal(await page.locator('.studio').getAttribute('data-view-mode'), 'explore');
    assert.equal(await page.evaluate(() => !!document.fullscreenElement), false);
    assert.equal(await current(page).locator('[data-reveal-hidden]').count(), 0);
    assert.equal(await page.getByRole('button', { name: 'All slides', exact: true }).isVisible(), true);
    if (id === 's13') await page.screenshot({ path: join(tmpdir(), 'detelgy-explore-slide15.png') });
  }
  await page.goto(`${baseURL}/en/vision?slide=12`);
  await waitForSlide(page, 's10');
  await page.keyboard.press('ArrowRight');
  await waitForSlide(page, 's11');
  await idle(page);
  assert.equal(new URL(page.url()).searchParams.get('slide'), '13');
  await page.goBack();
  await waitForSlide(page, 's10');
  await page.goForward();
  await waitForSlide(page, 's11');
  await complete(page);
  await page.keyboard.press('ArrowLeft');
  await waitForSlide(page, 's10');
  await idle(page);
  await complete(page);
  const node = await current(page).elementHandle();
  await page.getByRole('button', { name: 'All slides', exact: true }).click();
  await page.keyboard.press('Escape');
  assert.equal(await node.evaluate(el => el === document.querySelector('.scaled-slide .presentation-slide-layer:last-child .slide')), true, 'UI changes remounted the slide');

  // Presentation entry, blocked repeat navigation, forward/backward checkpoints,
  // remote keys, final-slide boundary, and switching back to complete Explore.
  for (const id of checkpointIds) {
    await page.goto(`${baseURL}/en/vision#${id}`);
    await waitForSlide(page, id);
    await page.getByRole('button', { name: 'Present', exact: true }).first().click();
    await page.waitForFunction(() => document.querySelector('.studio')?.dataset.viewMode === 'present');
    assert.equal(await current(page).getAttribute('data-reveal-step'), '0');
    assert((await current(page).locator('[data-reveal-hidden]').count()) > 0);
    await page.keyboard.press('PageDown');
    assert.equal(await current(page).getAttribute('data-reveal-step'), '0', 'Navigation interrupted the entrance');
    await idle(page);
    await page.screenshot({ path: join(tmpdir(), `detelgy-present-${id}-paused.png`) });
    await page.keyboard.press('PageDown');
    assert.equal(await current(page).getAttribute('data-reveal-step'), '1');
    await page.keyboard.press('ArrowRight');
    assert.equal(await current(page).getAttribute('data-slide'), id, 'Fast advance skipped the checkpoint animation');
    await idle(page);
    assert.equal(await current(page).locator('[data-reveal-hidden]').count(), 0);
    await page.keyboard.press('Shift+Space');
    assert.equal(await current(page).getAttribute('data-reveal-step'), '0');
    await idle(page);
    await page.keyboard.press('Space');
    await idle(page);
    const index = deck.slides.findIndex(slide => slide.id === id);
    if (index < deck.slides.length - 1) {
      await page.keyboard.press('ArrowRight');
      await waitForSlide(page, deck.slides[index + 1].id);
      await idle(page);
      await page.keyboard.press('ArrowLeft');
      await waitForSlide(page, id);
      await idle(page);
      assert.equal(await current(page).getAttribute('data-reveal-step'), '1', 'Backward navigation did not restore the completed slide');
    } else {
      assert.equal(await page.getByRole('button', { name: 'Next slide', exact: true }).isDisabled(), true);
    }
    await page.keyboard.press('ArrowLeft');
    await idle(page);
    assert.equal(await current(page).getAttribute('data-reveal-step'), '0');
    await page.keyboard.press('Escape');
    await complete(page);
    assert.equal(await page.locator('.studio').getAttribute('data-view-mode'), 'explore');
    assert.equal(await current(page).locator('[data-reveal-hidden]').count(), 0);
  }

  // Reduced-motion checkpoints remain intentional; the content itself is instant.
  const reduced = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  await reduced.goto(`${baseURL}/en/vision#grow-pie`);
  await waitForSlide(reduced, 'grow-pie');
  await complete(reduced);
  await reduced.getByRole('button', { name: 'Present', exact: true }).first().click();
  await idle(reduced);
  assert.equal(await current(reduced).getAttribute('data-reveal-step'), '0');
  await reduced.keyboard.press('Space');
  await idle(reduced);
  assert.equal(await current(reduced).getAttribute('data-reveal-step'), '1');
  await reduced.keyboard.press('Escape');

  // Fullscreen rejection must not disable Present Mode or trap the user in it.
  const fallback = await browser.newPage({ reducedMotion: 'reduce' });
  await fallback.addInitScript(() => { Element.prototype.requestFullscreen = () => Promise.reject(new Error('Unavailable in this test browser')); });
  await fallback.goto(`${baseURL}/en/vision#s14`);
  await waitForSlide(fallback, 's14');
  await fallback.getByRole('button', { name: 'Present', exact: true }).first().click();
  await idle(fallback);
  assert.equal(await fallback.locator('.studio').getAttribute('data-view-mode'), 'present');
  assert.equal(await fallback.evaluate(() => !!document.fullscreenElement), false);
  await fallback.keyboard.press('Space');
  await idle(fallback);
  await fallback.keyboard.press('Escape');
  assert.equal(await fallback.locator('.studio').getAttribute('data-view-mode'), 'explore');

  // Mobile Explore, readable fallback, and opt-in Present Mode.
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await phone.goto(`${baseURL}/en/vision?slide=15`);
  await waitForSlide(phone, 's13');
  await complete(phone);
  await phone.locator('.reading-content').waitFor();
  assert.equal(await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
  await phone.screenshot({ path: join(tmpdir(), 'detelgy-playback-mobile.png'), fullPage: true });
  await phone.getByRole('button', { name: 'Present', exact: true }).first().click();
  await idle(phone);
  assert.equal(await phone.locator('.reading-content').count(), 0);
  assert.equal(await current(phone).getAttribute('data-reveal-step'), '0');
  await phone.keyboard.press('Escape');

  // Unreleased locales are intentionally unavailable; no language switch is offered.
  for (const locale of ['es', 'uk', 'ru']) assert.equal((await page.request.get(`${baseURL}/${locale}/vision?slide=12`)).status(), 404);
  assert.equal(await page.locator('select[aria-label*="language" i]').count(), 0);
  // No verified joining URL exists in the deck. Do not invent a CTA destination.
  await page.goto(`${baseURL}/en/vision#s14`);
  await waitForSlide(page, 's14');
  assert.equal(await current(page).locator('.closing-invitation a').count(), 0);
  assert.equal((await page.content()).includes(deck.slides[7].note.slice(0, 60)), false, 'Private notes leaked into the viewer');

  // Browser print during a paused presentation uses the complete static deck.
  await page.getByRole('button', { name: 'Present', exact: true }).first().click();
  await idle(page);
  assert((await current(page).locator('[data-reveal-hidden]').count()) > 0);
  await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  assert.equal(await page.locator('.print-only [data-reveal-hidden]').count(), 0);
  assert.equal(await page.locator('.studio-header').isVisible(), false);
  const printed = await PDFDocument.load(await page.pdf({ preferCSSPageSize: true, printBackground: true }));
  assert.equal(printed.getPageCount(), 17);
  await page.goto(`${baseURL}/en/vision/print`);
  await ready(page);
  assert.equal(await page.locator('.slide').count(), 17);
  assert.equal(await page.locator('[data-reveal-hidden]').count(), 0);
  assert.equal(await page.locator('.studio-header,.deck-controls,.reading-content').count(), 0);
  assert.deepEqual(errors, []);
  console.log('Passed: automatic Explore, query/hash links, history, revisits, five Present checkpoints, animation locks, remote keys, backward behavior, Escape, fullscreen fallback, reduced motion, mobile, private notes and complete 17-page print.');
} finally { await browser.close(); }
