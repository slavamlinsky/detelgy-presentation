import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { PDFDocument } from 'pdf-lib';
import { launchBrowser, baseURL, ready } from './browser.mjs';
import { presentationMeta } from '../lib/presentation-meta.mjs';

const manifest = JSON.parse(await readFile('qa/pdf-manifest.json', 'utf8'));
const browser = await launchBrowser();
try {
  const page = await browser.newPage({ acceptDownloads: true });
  await page.goto(`${baseURL}/en/vision#s14`);
  await ready(page);
  const link = page.locator('.download-control');
  assert.equal(await link.getAttribute('href'), `/downloads/detelgy-vision-en.pdf?v=${manifest.sourceHash.slice(0, 12)}`);
  const waiting = page.waitForEvent('download');
  await link.click();
  const download = await waiting;
  assert.equal(await download.failure(), null);
  const bytes = await readFile(await download.path());
  assert.equal(createHash('sha256').update(bytes).digest('hex'), manifest.pdfHash);
  const pdf = await PDFDocument.load(bytes, { updateMetadata: false });
  assert.equal(pdf.getPageCount(), 17);
  assert.equal(pdf.getTitle(), `Detelgy Vision — ${presentationMeta.title}`);
  assert(pdf.getSubject().includes(presentationMeta.lastUpdated));
  console.log('PDF download passed: versioned URL, exact current file, 17 pages and current revision metadata.');
} finally { await browser.close(); }
