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
  for (const title of ['Connect', 'Grow', 'Build reputation', 'Earn']) {
    assert.equal(await slide.getByRole('heading', { name: title, exact: true }).count(), 1);
  }
  assert.equal(await slide.locator('.ecosystem-card-built').count(), 4);
  assert.equal(await slide.locator('.ecosystem-card-planned').count(), 4);
  assert.match(await slide.locator('.ecosystem-center').innerText(), /Professional\s+growth/);
  assert.match(await slide.locator('.ecosystem-foundation').innerText(), /Global and multilingual by design/);

  const layout = await slide.evaluate((el) => {
    const bounds = (selector) => [...el.querySelectorAll(selector)].map((node) => {
      const r = node.getBoundingClientRect();
      return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
    });
    return { cards: bounds('.ecosystem-card'), hub: bounds('.ecosystem-center')[0], badge: bounds('.ecosystem-foundation')[0], footer: bounds('.slide-footer')[0] };
  });
  const intersect = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  for (let i = 0; i < layout.cards.length; i++) {
    assert(layout.cards[i].bottom < layout.footer.top, 'Feature card enters footer');
    assert(!intersect(layout.cards[i], layout.hub), 'Feature card overlaps hub');
    assert(!intersect(layout.cards[i], layout.badge), 'Feature card overlaps badge');
    for (let j = i + 1; j < layout.cards.length; j++) assert(!intersect(layout.cards[i], layout.cards[j]), 'Feature cards overlap');
  }
  await mkdir('qa/v2', { recursive: true });
  await slide.screenshot({ path: 'qa/v2/s09.png', animations: 'disabled' });
  await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  assert.equal(await slide.locator('.ecosystem-card:visible').count(), 4);
  await page.emulateMedia({ media: 'screen' });
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto(`${baseURL}/en/vision#s09`);
  await ready(page);
  await page.waitForFunction(() => document.querySelector('.scaled-slide [data-slide]')?.getAttribute('data-slide') === 's09');
  await page.screenshot({ path: 'qa/v2/s09-laptop.png', animations: 'disabled' });
  console.log('Slide 09 content, print state, and presentation geometry passed.');
} finally {
  await browser.close();
}
