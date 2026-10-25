import assert from 'node:assert/strict';
import { launchBrowser, baseURL, ready } from './browser.mjs';

const current = page => page.locator('.scaled-slide .presentation-slide-layer:last-child .slide');
const waitSlide = (page, id) => page.waitForFunction(id => document.querySelector('.scaled-slide .presentation-slide-layer:last-child .slide')?.dataset.slide === id, id);
const idle = page => page.waitForFunction(() => document.querySelector('.studio')?.dataset.playbackBusy === 'false' && !document.querySelector('.presentation-slide-in'));
const clickBackground = page => current(page).click({ position: { x: 12, y: 12 } });
const enter = async page => {
  await page.getByRole('button', { name: 'Present', exact: true }).first().click();
  await page.waitForFunction(() => document.querySelector('.studio')?.dataset.viewMode === 'present');
  await idle(page);
};
const open = async (page, id) => {
  await page.goto(`${baseURL}/en/vision#${id}`);
  await ready(page);
  await waitSlide(page, id);
};
const browser = await launchBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await open(page, 's03');
  await clickBackground(page);
  await current(page).locator('h2').click();
  assert.equal(await current(page).getAttribute('data-slide'), 's03', 'Explore click advanced');
  await enter(page);
  await clickBackground(page);
  await waitSlide(page, 's04');
  await idle(page);
  await current(page).locator('h2').click();
  await waitSlide(page, 's05');
  await idle(page);
  await current(page).locator('.workload-demand svg').first().click();
  assert.equal(await current(page).getAttribute('data-slide'), 's05', 'Interactive card descendant advanced');

  // Exercise semantic controls, nested opt-out regions, and a custom click handler.
  await current(page).evaluate(slide => {
    const fixture = document.createElement('div');
    fixture.id = 'click-qa';
    Object.assign(fixture.style, { position: 'absolute', top: '160px', left: '950px', width: '700px', zIndex: '20', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#fff', color: '#000', padding: '12px' });
    fixture.innerHTML = '<button id="qa-button"><span>Button child</span></button><a id="qa-link" href="#s05"><span>Link child</span></a><input id="qa-input" aria-label="test input"><select id="qa-select"><option>Choice</option></select><textarea id="qa-textarea"></textarea><div id="qa-editable" contenteditable="true"><span>Editable child</span></div><div id="qa-marked" data-interactive><span>Marked child</span></div><div id="qa-optout" data-no-slide-advance><span>Opt-out child</span></div><div id="qa-role" role="button"><span>Role child</span></div><label id="qa-label">Input label<input type="checkbox"></label><div id="qa-switch" role="switch"><span>Switch child</span></div><nav id="qa-nav"><span>Navigation child</span></nav><div id="qa-handler"><span>Handler child</span></div><div id="qa-draggable" draggable="true"><span>Drag target</span></div>';
    fixture.querySelector('#qa-handler').onclick = () => { fixture.dataset.handled = 'yes'; };
    slide.append(fixture);
  });
  for (const selector of ['#qa-button span', '#qa-link span', '#qa-input', '#qa-select', '#qa-textarea', '#qa-editable span', '#qa-marked span', '#qa-optout span', '#qa-role span', '#qa-label', '#qa-switch span', '#qa-nav span', '#qa-handler span', '#qa-draggable span']) {
    await page.locator(selector).click();
    if (selector === '#qa-select') await page.keyboard.press('Enter');
    assert.equal(await current(page).getAttribute('data-slide'), 's05', `${selector} advanced`);
  }
  assert.equal(await page.locator('.studio').getAttribute('data-view-mode'), 'present');
  assert.equal(await page.locator('#click-qa').getAttribute('data-handled'), 'yes', 'Custom click handler was blocked');
  await page.locator('#click-qa').evaluate(el => el.remove());

  // A click clearing an existing selection must not navigate.
  await current(page).locator('h2').evaluate(el => {
    const range = document.createRange(); range.selectNodeContents(el);
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
  });
  await clickBackground(page);
  assert.equal(await current(page).getAttribute('data-slide'), 's05', 'Clearing text selection advanced');
  await page.evaluate(() => window.getSelection().removeAllRanges());
  const bounds = await current(page).boundingBox();
  await page.mouse.move(bounds.x + 15, bounds.y + 15);
  await page.mouse.down();
  await page.mouse.move(bounds.x + 65, bounds.y + 15, { steps: 5 });
  await page.mouse.up();
  assert.equal(await current(page).getAttribute('data-slide'), 's05', 'Dragging advanced');
  await page.evaluate(() => window.getSelection().removeAllRanges());
  // Controls outside the slide still execute exactly once.
  await page.getByRole('button', { name: 'Next slide', exact: true }).click();
  await waitSlide(page, 's06');
  await idle(page);
  await page.keyboard.press('Escape');
  await clickBackground(page);
  assert.equal(await current(page).getAttribute('data-slide'), 's06', 'Click advanced after leaving Present');

  // Checkpoint first, then slide; final slide never advances beyond the deck.
  await open(page, 'grow-pie');
  await enter(page);
  assert.equal(await current(page).getAttribute('data-reveal-step'), '0');
  await clickBackground(page);
  await idle(page);
  assert.equal(await current(page).getAttribute('data-slide'), 'grow-pie');
  assert.equal(await current(page).getAttribute('data-reveal-step'), '1');
  await clickBackground(page);
  await waitSlide(page, 's14');
  await idle(page);
  assert.equal(await current(page).getAttribute('data-reveal-step'), '0');
  await clickBackground(page);
  await idle(page);
  assert.equal(await current(page).getAttribute('data-reveal-step'), '1');
  await clickBackground(page);
  assert.equal(await current(page).getAttribute('data-slide'), 's14');
  await page.keyboard.press('Escape');

  // Real mouse events during normal entrance/reveal animations, plus double-clicks.
  const animated = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await open(animated, 's01');
  await animated.getByRole('button', { name: 'Present', exact: true }).first().click();
  await clickBackground(animated);
  assert.equal(await current(animated).getAttribute('data-slide'), 's01', 'Entrance click advanced');
  await idle(animated);
  await current(animated).dblclick({ position: { x: 12, y: 12 } });
  await waitSlide(animated, 's02');
  await idle(animated);
  assert.equal(await current(animated).getAttribute('data-slide'), 's02', 'Double-click skipped a slide');
  await animated.keyboard.press('Escape');
  await open(animated, 'grow-pie');
  await enter(animated);
  await clickBackground(animated);
  await clickBackground(animated);
  assert.equal(await current(animated).getAttribute('data-slide'), 'grow-pie', 'Repeated click skipped a reveal');
  await idle(animated);
  await clickBackground(animated);
  await waitSlide(animated, 's14');
  await animated.keyboard.press('Escape');

  // Touch taps must not synthesize a mouse advance; swipe remains a single action.
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  await open(phone, 's03');
  await enter(phone);
  await current(phone).tap({ position: { x: 12, y: 12 } });
  assert.equal(await current(phone).getAttribute('data-slide'), 's03', 'Touch tap synthesized a mouse advance');
  await phone.locator('.presentation-stage').evaluate(el => {
    const touch = x => new Touch({ identifier: 1, target: el, clientX: x, clientY: 200 });
    el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [touch(300)] }));
    el.dispatchEvent(new TouchEvent('touchend', { bubbles: true, touches: [], changedTouches: [touch(100)] }));
  });
  await waitSlide(phone, 's04');
  await idle(phone);
  await current(phone).tap({ position: { x: 12, y: 12 } });
  assert.equal(await current(phone).getAttribute('data-slide'), 's04');
  assert.deepEqual(errors, []);
  console.log('Passed: Present-only background/content clicks, shared checkpoints, first/last boundaries, semantic/custom interactive regions, selection, drag, navigation controls, double-click and animation locks, reduced motion, mode switching, and touch/swipe isolation.');
} finally { await browser.close(); }
