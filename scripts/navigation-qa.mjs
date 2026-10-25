import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { launchBrowser, baseURL, ready } from './browser.mjs';

const browser = await launchBrowser();
const waitForSlide = async (page, id) => page.waitForFunction((slideId) => document.querySelector('.scaled-slide .presentation-slide-layer:last-child [data-slide]')?.getAttribute('data-slide') === slideId, id, { timeout: 8000 });
const settle = (page) => page.waitForTimeout(450);

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${baseURL}/en/vision#s09`);
  await ready(page);
  await waitForSlide(page, 's09');
  const press = async (key, id) => {
    await page.keyboard.press(key);
    await waitForSlide(page, id);
    await settle(page);
    assert.equal(new URL(page.url()).hash, `#${id}`);
  };

  await press('ArrowRight', 'mission');
  await press('ArrowDown', 'coopetition');
  await press('ArrowRight', 's10');
  await press('ArrowLeft', 'coopetition');
  await press('ArrowLeft', 'mission');
  await press('ArrowUp', 's09');
  await press('Space', 'mission');
  await press('Shift+Space', 's09');
  await press('Home', 's01');
  await press('ArrowLeft', 's01');
  await press('End', 's14');
  await press('ArrowRight', 's14');
  assert.equal(await page.getByRole('button', { name: 'Next slide', exact: true }).isDisabled(), true);

  await page.goBack();
  await waitForSlide(page, 's01');
  await page.goForward();
  await waitForSlide(page, 's14');
  await press('Home', 's01');
  await page.getByRole('button', { name: 'All slides', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(new URL(page.url()).hash, '#s01', 'Focused controls should keep keyboard input');
  await page.keyboard.press('Space');
  assert.equal(await page.locator('dialog').evaluate(el => el.open), true, 'Space should activate the focused button');
  await page.keyboard.press('Escape');
  await page.locator('.presentation-stage').click({ position: { x: 8, y: 8 } });

  await page.keyboard.press('f');
  assert.equal(await page.evaluate(() => !!document.fullscreenElement), false, 'Explore entered Present Mode without explicit opt-in');
  await page.getByRole('button', { name: 'Present', exact: true }).first().click();
  await page.waitForFunction(() => !!document.fullscreenElement);
  await page.waitForFunction(() => document.querySelector('.studio')?.classList.contains('is-fullscreen'));
  await page.keyboard.press('f');
  await page.waitForFunction(() => !document.fullscreenElement);
  assert.equal(await page.locator('.studio').getAttribute('data-view-mode'), 'present', 'F should toggle fullscreen independently of presentation mode');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.querySelector('.studio')?.dataset.viewMode === 'explore');

  const stage = page.locator('.presentation-stage');
  const box = await stage.boundingBox();
  await page.mouse.move(box.x + 12, box.y + box.height / 2);
  await page.mouse.wheel(0, 120);
  await waitForSlide(page, 's02');
  await settle(page);
  for (const delta of [25, 18, 12, 8, 5, 4, 3, 2, 2, 1]) {
    await page.mouse.wheel(0, delta);
    await page.waitForTimeout(45);
  }
  assert.equal(new URL(page.url()).hash, '#s02', 'Wheel momentum advanced more than one slide');
  await page.waitForTimeout(850);
  await page.mouse.wheel(0, -120);
  await waitForSlide(page, 's01');
  await settle(page);
  await page.mouse.wheel(0, -120);
  assert.equal(new URL(page.url()).hash, '#s01', 'Wheel crossed the first-slide boundary');

  await page.waitForTimeout(850);
  for (const delta of [10, 12, 15, 18, 20]) await page.mouse.wheel(0, delta);
  await waitForSlide(page, 's02');
  await settle(page);
  const beforeScroll = new URL(page.url()).hash;
  await stage.evaluate((el) => {
    const scroller = document.createElement('div');
    scroller.dataset.navQaScroller = 'true';
    Object.assign(scroller.style, { position: 'absolute', top: '0', left: '0', zIndex: '20', width: '120px', height: '100px', overflowY: 'auto' });
    scroller.innerHTML = '<div style="height:400px;background:#eee"></div>';
    el.append(scroller);
  });
  await page.locator('[data-nav-qa-scroller]').hover();
  await page.mouse.wheel(0, 120);
  assert.equal(new URL(page.url()).hash, beforeScroll, 'Wheel navigation intercepted a nested scroller');
  await page.locator('[data-nav-qa-scroller]').evaluate((el) => el.remove());

  await press('Home', 's01');
  await press('End', 's14');
  await press('Home', 's01');
  await page.keyboard.press('ArrowRight');
  await waitForSlide(page, 's02');
  assert.equal(await page.locator('.presentation-slide-out').count(), 1, 'Outgoing slide is missing during the transition');
  await settle(page);
  assert.equal(await page.locator('.presentation-slide-out').count(), 0, 'Transition did not finish');
  await page.goto(`${baseURL}/en/vision#s08`);
  await waitForSlide(page, 's08');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.keyboard.press('ArrowRight');
  await waitForSlide(page, 's09');
  assert.equal(await page.locator('.presentation-slide-in .ecosystem-card').first().evaluate((el) => getComputedStyle(el).animationPlayState), 'paused', 'Slide entrance started during the crossfade');
  await page.waitForTimeout(160);
  const transitionGeometry = await page.locator('.presentation-slide-stack').evaluate((el) => {
    const layers = [...el.querySelectorAll('.presentation-slide-layer')];
    return layers.map((layer) => {
      const logo = layer.querySelector('.slide-header .brand')?.getBoundingClientRect();
      return { transform: getComputedStyle(layer).transform, logo: logo && { x: logo.x, y: logo.y } };
    });
  });
  assert(transitionGeometry.every((layer) => layer.transform === 'none'), 'Transition moves a slide');
  assert(Math.abs(transitionGeometry[0].logo.x - transitionGeometry[1].logo.x) < 1 && Math.abs(transitionGeometry[0].logo.y - transitionGeometry[1].logo.y) < 1, 'Logo changes position during the fade');
  await page.screenshot({ path: join(tmpdir(), 'detelgy-navigation-transition.png') });
  await settle(page);
  assert.equal(await page.locator('.presentation-slide-in').count(), 0, 'Incoming transition layer remained after crossfade');
  assert.equal(await page.locator('.scaled-slide .ecosystem-card').first().evaluate((el) => getComputedStyle(el).animationPlayState), 'running', 'Slide entrance did not start after the crossfade');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: join(tmpdir(), 'detelgy-navigation-final.png') });

  const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const touchPage = await touchContext.newPage();
  await touchPage.goto(`${baseURL}/en/vision#s09`);
  await waitForSlide(touchPage, 's09');
  const swipe = async (targetSelector, fromX, toX) => touchPage.locator(targetSelector).first().evaluate((el, { fromX, toX }) => {
    const touch = (x) => new Touch({ identifier: 1, target: el, clientX: x, clientY: 400 });
    el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [touch(fromX)], changedTouches: [touch(fromX)] }));
    el.dispatchEvent(new TouchEvent('touchend', { bubbles: true, touches: [], changedTouches: [touch(toX)] }));
  }, { fromX, toX });
  await swipe('.presentation-stage', 300, 100);
  await waitForSlide(touchPage, 'mission');
  await settle(touchPage);
  await swipe('.presentation-stage', 100, 300);
  await waitForSlide(touchPage, 's09');
  await settle(touchPage);
  await swipe('.scaled-slide .ecosystem-card', 300, 100);
  assert.equal(new URL(touchPage.url()).hash, '#s09', 'Swipe on an interactive slide element navigated');
  await touchContext.close();

  const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(`${baseURL}/en/vision#s08`);
  await waitForSlide(reducedPage, 's08');
  await reducedPage.keyboard.press('ArrowRight');
  await waitForSlide(reducedPage, 's09');
  assert.equal(await reducedPage.locator('.presentation-slide-out').count(), 0, 'Reduced motion still showed a slide transition');
  assert.equal(await reducedPage.locator('.scaled-slide .story-s09 .ecosystem-card').first().evaluate((el) => getComputedStyle(el).animationName), 'none');
  await reducedContext.close();

  await page.goto(`${baseURL}/en/vision/print`);
  assert.equal(await page.locator('.slide').count(), 17, 'Static print layout changed');
  assert.equal(await page.locator('.presentation-slide-stack').count(), 0, 'Presentation transition leaked into print layout');

  assert.deepEqual(errors, []);
  console.log('Presentation navigation keyboard, wheel, momentum, touch, history, fullscreen, controls, transitions, and reduced motion passed.');
} finally {
  await browser.close();
}
