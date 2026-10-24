import {readFile,readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const canonical=JSON.parse(await readFile('content/locales/en.json','utf8'));
function keys(value,prefix='') {return Object.entries(value).flatMap(([key,v])=>{const path=`${prefix}.${key}`;return v && typeof v==='object' ? keys(v,path) : [path]}).sort()}
for(const name of await readdir('content/locales')){
 if(!name.endsWith('.json'))continue;
 const deck=JSON.parse(await readFile(`content/locales/${name}`,'utf8'));
 assert.equal(deck.locale,name.slice(0,-5));assert.equal(deck.slides.length,canonical.slides.length);
 const originalIds=Array.from({length:14},(_,i)=>`s${String(i+1).padStart(2,'0')}`);
 assert.deepEqual(deck.slides.map(s=>s.id),[...originalIds.slice(0,9),'mission','coopetition',...originalIds.slice(9,13),'grow-pie',originalIds[13]]);
 assert.deepEqual(keys(deck),keys(canonical),`${name}: translation shape differs from English`);
 for(const s of deck.slides){for(const field of ['title','chapter','lead','eyebrow','note','footer'])assert.equal(typeof s[field],'string');assert(s.sources.length>0);assert(s.title.length>0);}
 console.log(`${name}: ${deck.slides.length} slides, original deep-link IDs preserved, complete schema and evidence notes.`);
}
