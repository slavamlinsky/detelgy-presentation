import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pdfSource } from './pdf-source.mjs';

try {
  const manifest = JSON.parse(await readFile('qa/pdf-manifest.json', 'utf8'));
  const { sourceHash } = await pdfSource();
  if (manifest.sourceHash !== sourceHash) throw new Error('Presentation sources changed since the PDF was exported.');
  const bytes = await readFile(manifest.path);
  if (createHash('sha256').update(bytes).digest('hex') !== manifest.pdfHash) throw new Error('PDF does not match its export manifest.');
  console.log(`PDF is current: ${manifest.pages} pages, revision ${manifest.lastUpdated}.`);
} catch (error) {
  console.error(`${error.message}\nRun the local server, then npm run export:pdf -- en, and commit the PDF with qa/pdf-manifest.json.`);
  process.exitCode = 1;
}
