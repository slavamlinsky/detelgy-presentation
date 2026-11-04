import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { validateTranslation } from '../lib/translation-schema.mjs';
import { localeDefinitions } from '../lib/locales.mjs';
const canonical = JSON.parse(await readFile('content/locales/en.json', 'utf8'));
const originalIds = Array.from({length:14},(_,i)=>`s${String(i+1).padStart(2,'0')}`);
assert.deepEqual(canonical.slides.map(s=>s.id),[...originalIds.slice(0,9),'mission','coopetition',...originalIds.slice(9,13),'grow-pie',originalIds[13]]);
for (const slide of canonical.slides) {
  for (const field of ['title','chapter','lead','eyebrow','note','footer']) assert.equal(typeof slide[field], 'string');
  assert(slide.sources.length > 0); assert(slide.title.length > 0);
}
for (const name of await readdir('content/locales')) {
  if (!name.endsWith('.json')) continue;
  const deck = JSON.parse(await readFile(`content/locales/${name}`, 'utf8'));
  assert.equal(deck.locale, name.slice(0,-5));
  assert(localeDefinitions.some(locale=>locale.code===deck.locale), `${name}: unregistered locale`);
  if (deck.locale === 'en') console.log('en: 17 canonical slides, stable IDs and evidence notes preserved.');
  else {
    validateTranslation(canonical, deck);
    console.log(`${deck.locale}: ${deck.status}, ${deck.slides.length}/${canonical.slides.length} translated slides, complete viewer dictionary.`);
  }
}
