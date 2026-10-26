import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PDFDocument } from 'pdf-lib';
import { launchBrowser, baseURL, ready } from './browser.mjs';
import { presentationMeta, formatPresentationUpdated, presentationRevisionDate } from '../lib/presentation-meta.mjs';

const deck = JSON.parse(await readFile('content/locales/en.json', 'utf8'));
assert.equal(presentationMeta.title, 'Our vision for the profession');
assert.equal(presentationMeta.lastUpdated, '2026-10-26');
assert.equal(presentationRevisionDate().toISOString(), '2026-10-26T00:00:00.000Z');
for (const [locale, expected] of [['en', /^Updated Oct 2026$/], ['es', /^Actualizado oct 2026$/], ['uk', /^Оновлено жовт\. 2026/], ['ua', /^Оновлено жовт\. 2026/], ['ru', /^Обновлено окт\. 2026/]]) {
  assert.match(formatPresentationUpdated(locale), expected);
}
assert.equal(formatPresentationUpdated('ua'), formatPresentationUpdated('uk'));
const expectedMetadata = `${deck.slides.length} slides · ${presentationMeta.estimatedDuration} · Updated Oct 2026`;
const browser = await launchBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text().slice(0, 600)); });
  // A future calendar date must not alter the editorial revision date.
  await page.clock.setFixedTime(new Date('2035-04-01T10:00:00Z'));
  await page.goto(`${baseURL}/en/vision#s01`);
  await ready(page);
  assert.equal(await page.locator('.studio-identity').innerText(), presentationMeta.title);
  assert.equal(await page.locator('.deck-count').getAttribute('title'), expectedMetadata);
  assert.equal(await page.locator('.metadata-updated').getAttribute('datetime'), presentationMeta.lastUpdated);
  assert.match(await page.locator('.metadata-updated').innerText(), /Updated Oct 2026$/);
  assert.equal(await page.getByRole('link', { name: 'Download PDF' }).isVisible(), true);
  assert.equal(await page.getByRole('button', { name: 'Present', exact: true }).first().isVisible(), true);
  await page.screenshot({ path: join(tmpdir(), 'detelgy-viewer-metadata-desktop.png') });

  for (const width of [768, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${width}px viewer overflow`);
    assert.equal(await page.locator('.metadata-updated').isVisible(), width > 360);
    assert.equal(await page.locator('.metadata-duration').isVisible(), width > 640);
    assert.equal(await page.locator('.deck-count').evaluate(el => el.scrollWidth <= el.clientWidth + 1), true, `${width}px metadata overflow`);
    assert.equal(await page.getByRole('button', { name: 'Present', exact: true }).first().isVisible(), true);
    if (width === 390) await page.screenshot({ path: join(tmpdir(), 'detelgy-viewer-metadata-mobile.png') });
  }
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(`${baseURL}/en/vision#grow-pie`);
  await ready(page);
  await page.getByRole('button', { name: 'Present', exact: true }).first().click();
  await page.waitForFunction(() => document.querySelector('.studio')?.dataset.playbackBusy === 'false');
  assert.equal(await page.locator('.deck-heading').isVisible(), false);
  assert.equal(await page.locator('.metadata-updated').isVisible(), false);
  const current = page.locator('.scaled-slide .slide');
  assert.equal(await current.getAttribute('data-reveal-step'), '0');
  await page.keyboard.press('Space');
  assert.equal(await current.getAttribute('data-reveal-step'), '1');
  assert.equal(await current.locator('.slide-header > :not(.brand)').count(), 0);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.querySelector('.studio')?.dataset.viewMode === 'explore');

  await page.goto(`${baseURL}/en/vision/print`);
  await ready(page);
  await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  const slides = page.locator('.slide');
  assert.equal(await slides.count(), deck.slides.length);
  assert.equal(await page.locator('.slide-header > :not(.brand)').count(), 0, 'A date container remains');
  assert.equal(await page.locator('.slide-header .brand').count(), deck.slides.length);
  assert.equal(await page.locator('[data-reveal-hidden]').count(), 0);
  assert.equal(await page.locator('.studio-header,.deck-controls,.metadata-updated').count(), 0);
  assert(!(await slides.allTextContents()).some(text => text.includes('October 2026')));
  const geometry = await slides.evaluateAll(elements => elements.map(slide => {
    const canvas = slide.getBoundingClientRect();
    return ['.slide-header .brand', '.slide-folio'].map(selector => {
      const rect = slide.querySelector(selector).getBoundingClientRect();
      return { x: rect.x - canvas.x, y: rect.y - canvas.y, width: rect.width, height: rect.height };
    });
  }));
  geometry.forEach(bounds => assert.deepEqual(bounds, geometry[0]));
  await slides.first().screenshot({ path: join(tmpdir(), 'detelgy-dateless-cover-1920.png') });
  await slides.last().screenshot({ path: join(tmpdir(), 'detelgy-dateless-closing-1920.png') });

  const response = await page.request.get(`${baseURL}/downloads/detelgy-vision-en.pdf`);
  assert.equal(response.status(), 200);
  const pdf = await PDFDocument.load(await response.body(), { updateMetadata: false });
  assert.equal(pdf.getPageCount(), deck.slides.length);
  assert.equal(pdf.getTitle(), `Detelgy Vision — ${presentationMeta.title}`);
  assert(pdf.getSubject().includes(`Presentation revision: ${presentationMeta.lastUpdated}`));
  assert.equal(pdf.getModificationDate().toISOString(), presentationRevisionDate().toISOString());
  assert(pdf.getKeywords().includes(presentationMeta.lastUpdated));
  const manifest = JSON.parse(await readFile('qa/pdf-manifest.json', 'utf8'));
  assert.equal(manifest.lastUpdated, presentationMeta.lastUpdated);
  assert.deepEqual(errors, []);
  console.log('Passed: shared metadata, EN/ES/UK/UA/RU date formatting, fixed editorial date under a future clock, desktop/mobile header, all 17 dateless slides, stable logo/folio geometry, Present checkpoint, and PDF title/revision metadata.');
} finally { await browser.close(); }
