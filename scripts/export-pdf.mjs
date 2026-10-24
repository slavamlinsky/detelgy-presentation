import {launchBrowser,baseURL,ready} from './browser.mjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {PDFDocument} from 'pdf-lib';
const locale=process.argv[2] || 'en';
if(locale!=='en')throw new Error(`Locale ${locale} has not been released; no English fallback is exported.`);
const deck=JSON.parse(await readFile(`content/locales/${locale}.json`,'utf8'));
const browser=await launchBrowser();
try {
 const page=await browser.newPage({viewport:{width:1920,height:1080}});
 const response=await page.goto(`${baseURL}/${locale}/vision/print`);
 if(!response.ok())throw new Error(`Export route returned ${response.status()}`);
 await ready(page);await page.emulateMedia({media:'print',reducedMotion:'reduce'});
 const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));
 if(broken.length)throw new Error(`Broken assets: ${broken.join(', ')}`);
 await mkdir('public/downloads',{recursive:true});
 const bytes=await page.pdf({printBackground:true,preferCSSPageSize:true,tagged:true,outline:true});
 const pdf=await PDFDocument.load(bytes);if(pdf.getPageCount()!==deck.slides.length)throw new Error(`Expected ${deck.slides.length} pages, got ${pdf.getPageCount()}`);
 pdf.setTitle(`${deck.title} — ${locale.toUpperCase()}`);pdf.setAuthor('Detelgy');pdf.setSubject(deck.description);pdf.setLanguage(locale);
 for(const p of pdf.getPages()){const {width,height}=p.getSize();if(Math.abs(width/height-16/9)>.001)throw new Error('Incorrect page ratio');}
 const path=`public/downloads/detelgy-vision-${locale}.pdf`;await writeFile(path,await pdf.save());
 const inputs=['content/locales/en.json','components/slide.tsx','components/diagrams.tsx','components/prototype-slides.tsx','components/story-slides.tsx','components/mission-coopetition.tsx','components/grow-pie.tsx','app/globals.css','styles/tokens.css'];
 const hash=createHash('sha256');for(const p of inputs)hash.update(await readFile(p));
 await writeFile('qa/pdf-manifest.json',JSON.stringify({locale,pages:deck.slides.length,path,createdAt:new Date().toISOString(),sourceHash:hash.digest('hex'),inputs},null,2));
 console.log(`Exported ${path}: ${deck.slides.length} pages, 16:9, text and SVG preserved.`);
} finally {await browser.close()}
