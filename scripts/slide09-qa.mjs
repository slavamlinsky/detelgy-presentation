import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { launchBrowser, baseURL, ready } from './browser.mjs';

const browser = await launchBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(`${baseURL}/en/vision/print`);
  await ready(page);
  const slide = page.locator('[data-slide="s09"]');
  assert.equal(await slide.locator('.ecosystem-card').count(), 4);
  assert.deepEqual(await slide.locator('.ecosystem-card h3').allTextContents(), ['Connect', 'Grow', 'Earn', 'Build reputation']);
  for (const title of ['Connect', 'Grow', 'Earn', 'Build reputation']) {
    assert.equal(await slide.getByRole('heading', { name: title, exact: true }).count(), 1);
  }
  assert.equal(await slide.locator('.ecosystem-card-built').count(), 4);
  assert.equal(await slide.locator('.ecosystem-card-planned').count(), 4);
  assert.deepEqual(await slide.locator('.ecosystem-card-built > span:first-child').allTextContents(), ['Live', 'Live', 'Live', 'Live']);
  assert.deepEqual(await slide.locator('.ecosystem-card-planned > span:first-child').allTextContents(), ['Planned', 'Planned', 'Planned', 'Planned']);
  assert.deepEqual(await slide.locator('.ecosystem-headline-line').allTextContents(), ['Different tools.', 'One ecosystem.']);
  assert.equal(await slide.locator('.story-title h2 em').innerText(), 'Professional success.');
  assert.match(await slide.locator('.ecosystem-center').innerText(), /Professional\s+growth/);
  assert.match(await slide.locator('.ecosystem-foundation').innerText(), /Global and multilingual by design/);

  const layout = await slide.evaluate((el) => {
    const bounds = (selector) => [...el.querySelectorAll(selector)].map((node) => {
      const r = node.getBoundingClientRect();
      return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
    });
    const svg = el.querySelector('.ecosystem-connections');
    const matrix = svg.getScreenCTM();
    const connectors = [...svg.querySelectorAll('path')].map((path) => {
      const screenPoint = (length) => {
        const point = path.getPointAtLength(length);
        const screen = new DOMPoint(point.x, point.y).matrixTransform(matrix);
        return { x: screen.x, y: screen.y };
      };
      return { start: screenPoint(0), end: screenPoint(path.getTotalLength()), length: path.getTotalLength() };
    });
    const cardOverflow = [...el.querySelectorAll('.ecosystem-card')].map((card) => card.scrollHeight > card.clientHeight + 1);
    return { cards: bounds('.ecosystem-card'), hub: bounds('.ecosystem-center')[0], badge: bounds('.ecosystem-foundation')[0], footer: bounds('.slide-footer')[0], slide: el.getBoundingClientRect().toJSON(), connectors, cardOverflow };
  });
  const intersect = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  const center = (r) => ({ x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 });
  const hubCenter = center(layout.hub);
  const quadrants = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  assert.equal(layout.connectors.length, 4, 'Each card needs a connector');
  for (let i = 0; i < layout.cards.length; i++) {
    const card = layout.cards[i];
    const cardCenter = center(card);
    const [xSign, ySign] = quadrants[i];
    assert((cardCenter.x - hubCenter.x) * xSign > 100, 'Card is not in its diagonal horizontal quadrant');
    assert((cardCenter.y - hubCenter.y) * ySign > 100, 'Card is not in its diagonal vertical quadrant');
    assert(card.left > layout.slide.left + 75 && card.right < layout.slide.right - 75, `Feature card ${i} is outside slide safe area`);
    assert(card.bottom < layout.footer.top, 'Feature card enters footer');
    assert(!layout.cardOverflow[i], 'Feature card text overflows');
    assert(!intersect(layout.cards[i], layout.hub), 'Feature card overlaps hub');
    assert(!intersect(layout.cards[i], layout.badge), 'Feature card overlaps badge');
    for (let j = i + 1; j < layout.cards.length; j++) assert(!intersect(layout.cards[i], layout.cards[j]), 'Feature cards overlap');
    const connector = layout.connectors[i];
    const radiusX = (layout.hub.right - layout.hub.left) / 2;
    const radiusY = (layout.hub.bottom - layout.hub.top) / 2;
    const hubEdge = ((connector.end.x - hubCenter.x) / radiusX) ** 2 + ((connector.end.y - hubCenter.y) / radiusY) ** 2;
    assert(hubEdge > .8 && hubEdge < 1.2, 'Connector does not terminate at hub edge');
    const endpoint = connector.start;
    const edgeDistance = Math.min(Math.abs(endpoint.x - card.left), Math.abs(endpoint.x - card.right), Math.abs(endpoint.y - card.top), Math.abs(endpoint.y - card.bottom));
    assert(edgeDistance < 8, `Connector does not start at card edge (${i}: ${edgeDistance.toFixed(1)}px)`);
    assert(connector.length > 50, 'Connector is too short to read');
  }
  await mkdir('qa/v2', { recursive: true });
  await slide.screenshot({ path: 'qa/v2/s09.png', animations: 'disabled' });
  await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  assert.equal(await slide.locator('.ecosystem-card:visible').count(), 4);
  await page.emulateMedia({ media: 'screen', reducedMotion: 'no-preference' });
  await page.goto(`${baseURL}/en/vision#s09`);
  await page.waitForFunction(() => document.querySelector('.scaled-slide [data-slide]')?.getAttribute('data-slide') === 's09');
  const animation = await page.locator('.scaled-slide .story-s09').evaluate((el) => {
    const details = (selector) => [...el.querySelectorAll(selector)].map((node) => {
      const style = getComputedStyle(node);
      return { name: style.animationName, delay: parseFloat(style.animationDelay) * 1000 };
    });
    return {
      title: details('.ecosystem-headline-line, .story-title h2 em'),
      card: details('.ecosystem-card'),
      connector: details('.ecosystem-connections path'),
      hub: details('.ecosystem-center'),
    };
  });
  assert.deepEqual(animation.title.map((a) => a.delay), [100, 260, 420], JSON.stringify(animation));
  assert.deepEqual(animation.card.map((a) => a.delay), [1150, 1320, 1490, 1660]);
  assert.deepEqual(animation.connector.map((a) => a.delay), [1260, 1430, 1600, 1770]);
  assert.equal(animation.hub[0].delay, 2360);
  assert(animation.card.every((a) => a.name === 'ecosystem-card-reveal'));
  await page.waitForTimeout(3100);
  const settled = await page.locator('.scaled-slide .story-s09').evaluate((el) => {
    const opacity = (selector) => [...el.querySelectorAll(selector)].map((node) => Number(getComputedStyle(node).opacity));
    return { cards: opacity('.ecosystem-card'), hub: opacity('.ecosystem-center'), paths: [...el.querySelectorAll('.ecosystem-connections path')].map((path) => parseFloat(getComputedStyle(path).strokeDashoffset)) };
  });
  assert(settled.cards.every((value) => value === 1) && settled.hub[0] === 1, 'Entrance did not settle to the visible state');
  assert(settled.paths.every((value) => value === 0), 'Connector lines did not finish drawing');
  const firstCard = page.locator('.scaled-slide .story-s09 .ecosystem-card').first();
  await firstCard.focus();
  assert.equal(await firstCard.evaluate((el) => el.matches(':focus-visible')), true, 'Feature card lacks keyboard focus');
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => document.querySelector('.scaled-slide [data-slide]')?.getAttribute('data-slide') === 's10');
  await page.keyboard.press('ArrowLeft');
  await page.waitForFunction(() => document.querySelector('.scaled-slide [data-slide]')?.getAttribute('data-slide') === 's09');
  assert(await page.locator('.scaled-slide .story-s09 .ecosystem-card').first().evaluate((el) => el.getAnimations().some((animation) => animation.currentTime !== null && animation.currentTime < 1000)), 'Entrance does not replay on return');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('.scaled-slide .story-s09 .ecosystem-card').first().evaluate((el) => getComputedStyle(el).animationName), 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto(`${baseURL}/en/vision#s09`);
  await ready(page);
  await page.waitForFunction(() => document.querySelector('.scaled-slide [data-slide]')?.getAttribute('data-slide') === 's09');
  await page.waitForTimeout(3200);
  await page.screenshot({ path: 'qa/v2/s09-laptop.png', animations: 'disabled' });
  console.log('Slide 09 content, geometry, animation timing, replay, focus, reduced motion, and print state passed.');
} finally {
  await browser.close();
}
