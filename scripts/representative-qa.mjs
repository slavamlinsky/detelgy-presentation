import {launchBrowser,baseURL,ready} from './browser.mjs';
import {mkdir} from 'node:fs/promises';
const browser=await launchBrowser();
try {
const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
await page.goto(`${baseURL}/en/vision/print`);await ready(page);
await mkdir('qa/representative',{recursive:true});
for(const id of ['s01','s06','s08']) await page.locator(`[data-slide="${id}"]`).screenshot({path:`qa/representative/${id}.png`,animations:'disabled'});
console.log('Three representative slides captured.');
} finally {await browser.close()}
