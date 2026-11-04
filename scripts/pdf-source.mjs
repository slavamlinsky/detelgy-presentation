import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { localeDefinition } from '../lib/locales.mjs';
import { join } from 'node:path';

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(entries.map(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  }));
  return groups.flat();
}

export function pdfManifestPath(locale = 'en') {
  if (!localeDefinition(locale)) throw new Error(`Unsupported locale: ${locale}`);
  return locale === 'en' ? 'qa/pdf-manifest.json' : `qa/pdf-manifest-${locale}.json`;
}

export async function pdfSource(locale = 'en') {
  if (!localeDefinition(locale)) throw new Error(`Unsupported locale: ${locale}`);
  const inputs = (await Promise.all(['app', 'components', 'lib', 'styles', 'public/assets'].map(filesIn))).flat();
  inputs.push('content/locales/en.json', 'scripts/export-pdf.mjs', 'scripts/pdf-source.mjs');
  if (locale !== 'en') inputs.push(`content/locales/${locale}.json`);
  inputs.sort();
  const hash = createHash('sha256');
  for (const path of inputs) hash.update(path).update('\0').update(await readFile(path)).update('\0');
  return { inputs, sourceHash: hash.digest('hex') };
}
