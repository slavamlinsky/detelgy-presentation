import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(entries.map(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  }));
  return groups.flat();
}

export async function pdfSource() {
  const inputs = (await Promise.all(['app', 'components', 'content/locales', 'lib', 'styles', 'public/assets'].map(filesIn))).flat();
  inputs.push('scripts/export-pdf.mjs', 'scripts/pdf-source.mjs');
  inputs.sort();
  const hash = createHash('sha256');
  for (const path of inputs) hash.update(path).update('\0').update(await readFile(path)).update('\0');
  return { inputs, sourceHash: hash.digest('hex') };
}
