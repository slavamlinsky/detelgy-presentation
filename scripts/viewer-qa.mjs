import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { launchBrowser, baseURL, ready } from './browser.mjs';

const deck = JSON.parse(await readFile('content/locales/en.json', 'utf8'));
const browser = await launchBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(`${baseURL}/en/vision#s07`);
  await ready(page);
  assert.equal(await page.title(), deck.title);
  assert.equal(await page.locator('.studio-identity').innerText(), `Vision`);
  assert.equal(await page.locator('.deck-heading h1').innerText(), deck.slides.find(s => s.id === 's07').chapter);
  assert.match(await page.locator('.deck-count').innerText(), new RegExp(`^${deck.slides.length} slides`));
  assert.equal(await page.locator('.deck-heading .tiny-label').count(), 0);
  assert.equal(await page.locator('.deck-controls button').count(), 5);
  assert.equal(await page.getByRole('button', { name: 'Speaker notes' }).count(), 0);
  assert.equal(await page.locator('.notes-panel').count(), 0);
  assert.equal((await page.content()).includes(deck.slides.find(s => s.id === 's07').note.slice(0, 32)), false, 'Public viewer serialized speaker notes');
  assert.equal(await page.locator('.workspace-footer').innerText(), deck.ui.keyboard);
  const centerOffset = await page.locator('.deck-controls').evaluate(el => {
    const outer = el.getBoundingClientRect(), center = el.querySelector('.navigation').getBoundingClientRect();
    return Math.abs((center.left + center.right) / 2 - (outer.left + outer.right) / 2);
  });
  assert(centerOffset < 1, `Footer navigation shifted ${centerOffset}px off center`);
  await page.screenshot({ path: join(tmpdir(), 'detelgy-viewer-desktop.png') });
  for (const [id, label] of [['mission', 'Your success comes first'], ['grow-pie', 'Grow the pie']]) {
    await page.goto(`${baseURL}/en/vision#${id}`);
    await ready(page);
    await page.waitForFunction(expected => document.querySelector('.deck-heading h1')?.textContent === expected, label);
    assert.equal(await page.locator('.deck-heading h1').innerText(), label);
    if (id === 'mission') await page.screenshot({ path: join(tmpdir(), 'detelgy-viewer-mission.png') });
  }
  await page.goto(`${baseURL}/en/vision#s07`);
  await ready(page);
  await page.waitForFunction(() => document.querySelector('.deck-heading h1')?.textContent === 'Jobs to be done');

  await page.getByRole('button', { name: 'All slides' }).click();
  assert.equal(await page.locator('.overview-dialog').evaluate(el => el.open), true);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Next slide' }).click();
  await page.waitForURL('**#s08');
  assert.equal(await page.locator('.deck-heading h1').innerText(), deck.slides.find(s => s.id === 's08').chapter);
  await page.goBack();
  await page.waitForURL('**#s07');
  await page.waitForFunction(() => document.querySelector('.deck-heading h1')?.textContent === 'Jobs to be done');
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy slide link' }).click();
  assert((await page.evaluate(() => navigator.clipboard.readText())).endsWith('/en/vision#s07'));
  await page.getByRole('button', { name: 'Present', exact: true }).last().click();
  await page.waitForFunction(() => !!document.fullscreenElement);
  await page.waitForFunction(() => document.querySelector('.studio')?.classList.contains('is-fullscreen'));
  assert.equal(await page.locator('.workspace-footer').isVisible(), false);
  await page.evaluate(() => document.exitFullscreen());
  await page.waitForFunction(() => !document.fullscreenElement);

  for (const width of [768, 390, 320]) {
    await page.setViewportSize({ width, height: width === 768 ? 1024 : 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${width}px overflows horizontally`);
    assert.equal(await page.locator('.deck-heading h1').isVisible(), true);
    assert.equal(await page.locator('.deck-count').isVisible(), true);
    assert.equal(await page.getByRole('button', { name: 'All slides' }).isVisible(), true);
    assert.equal(await page.getByRole('button', { name: 'Next slide' }).isVisible(), true);
    assert.equal(await page.getByRole('button', { name: 'Copy slide link' }).isVisible(), true);
    assert.equal(await page.getByRole('button', { name: 'Present', exact: true }).first().isVisible(), true);
    if (width === 390) await page.screenshot({ path: join(tmpdir(), 'detelgy-viewer-mobile.png') });
  }
  await page.getByRole('button', { name: 'Reading view' }).click();
  assert.equal(await page.locator('.reading-content').isVisible(), true);
  await page.getByRole('button', { name: 'Slide view' }).click();
  assert.equal(await page.locator('.reading-content').count(), 0);
  assert.deepEqual(errors, []);
  console.log('Viewer header, chapter name, centered footer, overview, navigation, link, fullscreen, and responsive layouts passed.');
} finally {
  await browser.close();
}
