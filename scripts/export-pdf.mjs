import {launchBrowser,baseURL,ready} from './browser.mjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {PDFDocument} from 'pdf-lib';
import {validateTranslation} from '../lib/translation-schema.mjs';
import {resolveTranslation} from '../lib/resolve-translation.mjs';
import {localeDefinition} from '../lib/locales.mjs';
import {pdfSource,pdfManifestPath} from './pdf-source.mjs';
import {presentationMeta,presentationRevisionDate} from '../lib/presentation-meta.mjs';
const locale=process.argv[2] || 'en';
if(!localeDefinition(locale))throw new Error(`Unsupported locale: ${locale}`);
const route=process.argv[3] || 'vision';
if (!['vision', 'value-proposition'].includes(route)) throw new Error(`Unsupported presentation: ${route}`);

let deck;
if (route === 'value-proposition') {
 deck=JSON.parse(await readFile(`content/value-proposition/${locale}.json`, 'utf8'));
} else {
 const english=JSON.parse(await readFile('content/locales/en.json','utf8'));
 deck=english;
 if(locale!=='en'){
  const translation=JSON.parse(await readFile(`content/locales/${locale}.json`,'utf8'));
  validateTranslation(english,translation);
  if(translation.status!=='released')throw new Error(`Locale ${locale} is a draft; export requires a complete, released translation.`);
  deck=resolveTranslation(english,translation);
 }
}
const revision=route === 'vision' ? presentationMeta : deck.revision;
const browser=await launchBrowser();
try {
 const page=await browser.newPage({viewport:{width:1920,height:1080}});
 const response=await page.goto(`${baseURL}/${locale}/${route}/print`);
 if(!response.ok())throw new Error(`Export route returned ${response.status()}`);
 await ready(page);await page.emulateMedia({media:'print',reducedMotion:'reduce'});
 const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));
 if(broken.length)throw new Error(`Broken assets: ${broken.join(', ')}`);
 await mkdir('public/downloads',{recursive:true});
 const bytes=await page.pdf({printBackground:true,preferCSSPageSize:true,tagged:true,outline:true});
 const pdf=await PDFDocument.load(bytes);if(pdf.getPageCount()!==deck.slides.length)throw new Error(`Expected ${deck.slides.length} pages, got ${pdf.getPageCount()}`);
 pdf.setTitle(route === 'vision' ? `${deck.title} — ${deck.viewerTitle ?? presentationMeta.title}` : `Detelgy — ${deck.title}`);pdf.setAuthor('Detelgy');pdf.setLanguage(locale);
 pdf.setSubject(`${deck.description} Presentation revision: ${revision.lastUpdated}. Release ${revision.release}.`);
 pdf.setKeywords([`Revision ${revision.lastUpdated}`,`Release ${revision.release}`]);
 pdf.setModificationDate(presentationRevisionDate(revision.lastUpdated));
 for(const p of pdf.getPages()){const {width,height}=p.getSize();if(Math.abs(width/height-16/9)>.001)throw new Error('Incorrect page ratio');}
 const path=`public/downloads/detelgy-${route}-${locale}.pdf`;
 const output=await pdf.save();await writeFile(path,output);
 if (route === 'vision') {
  const {inputs,sourceHash}=await pdfSource(locale);
  const pdfHash=createHash('sha256').update(output).digest('hex');
  await writeFile(pdfManifestPath(locale),JSON.stringify({locale,pages:deck.slides.length,path,lastUpdated:revision.lastUpdated,release:revision.release,createdAt:new Date().toISOString(),sourceHash,pdfHash,inputs},null,2));
 }
 console.log(`Exported ${path}: ${deck.slides.length} pages, 16:9, text and SVG preserved.`);
} finally {await browser.close()}
