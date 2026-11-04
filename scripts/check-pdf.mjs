import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pdfSource, pdfManifestPath } from './pdf-source.mjs';
import { localeDefinitions } from '../lib/locales.mjs';

try {
  for (const locale of localeDefinitions.filter(locale=>locale.enabled)) {
    if (locale.code !== 'en') {
      const translation=JSON.parse(await readFile(`content/locales/${locale.code}.json`, 'utf8'));
      if (translation.status !== 'released') continue;
    }
    const manifest=JSON.parse(await readFile(pdfManifestPath(locale.code), 'utf8'));
    const { sourceHash }=await pdfSource(locale.code);
    if (manifest.sourceHash !== sourceHash) throw new Error(`${locale.code}: presentation sources changed since the PDF was exported.`);
    const bytes=await readFile(manifest.path);
    if (createHash('sha256').update(bytes).digest('hex') !== manifest.pdfHash) throw new Error(`${locale.code}: PDF does not match its export manifest.`);
    console.log(`${locale.code}: PDF is current, ${manifest.pages} pages, revision ${manifest.lastUpdated}.`);
  }
} catch (error) {
  console.error(`${error.message}\nRun the local server, then npm run export:pdf -- <locale>, and commit the PDF with its qa/pdf-manifest*.json.`);
  process.exitCode=1;
}
