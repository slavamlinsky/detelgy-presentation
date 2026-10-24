import {launchBrowser,ready} from './browser.mjs';
import {PDFDocument} from 'pdf-lib';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {readFile} from 'node:fs/promises';
const deck=JSON.parse(await readFile('content/locales/en.json','utf8'));
const origin=process.env.BASE_URL||'http://127.0.0.1:3001';const b=await launchBrowser();
try{
 const page=await b.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce'});
 const response=await page.goto(origin+'/en/vision#s08');assert.equal(response.status(),200);await ready(page);
 await page.waitForFunction(()=>document.querySelector('.scaled-slide article')?.dataset.slide==='s08');
 const downloadPromise=page.waitForEvent('download');await page.getByRole('link',{name:'Download PDF'}).click();const download=await downloadPromise;assert.equal(download.suggestedFilename(),'detelgy-vision-en.pdf');assert.equal(await download.failure(),null);
 const file=await page.request.get(origin+'/downloads/detelgy-vision-en.pdf');assert.equal(file.status(),200);const pdf=await PDFDocument.load(await file.body());
 const printed=await PDFDocument.load(await page.pdf({preferCSSPageSize:true,printBackground:true}));assert.equal(printed.getPageCount(),deck.slides.length);
 if(process.env.REQUIRE_CURRENT_PDF==='1')assert.equal(pdf.getPageCount(),deck.slides.length);
 for(const locale of ['es','uk','ru','fr'])assert.equal((await page.request.get(`${origin}/${locale}/vision`)).status(),404);
 await page.screenshot({path:'qa/viewports/production-1366.png'});
 const phone=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});await phone.goto(origin+'/en/vision');await ready(phone);await phone.waitForSelector('.reading-content');await phone.screenshot({path:'qa/viewports/mobile-default.png',fullPage:true});
 assert.equal(await phone.locator('.reading-content').isVisible(),true);
 const manifest={productionRoute:200,pdfDownload:pdf.getPageCount()===deck.slides.length?'current':'stale',pdfPages:pdf.getPageCount(),browserPrintPages:deck.slides.length,unreleasedLocales:404,mobileDefaultReading:true,reducedMotion:true};
 await writeFile('qa/production-smoke.json',JSON.stringify(manifest,null,2));console.log(manifest);
}finally{await b.close()}
