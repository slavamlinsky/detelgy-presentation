import {launchBrowser,baseURL,ready} from './browser.mjs';
import fs from 'node:fs/promises';
const browser=await launchBrowser();
const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
await page.goto(`${baseURL}/en/vision/print`);await ready(page);
for(const id of ['s01','s02','s10']) await page.locator(`[data-slide="${id}"]`).screenshot({path:`qa/v2/${id}.png`});
await page.setViewportSize({width:1366,height:768});
for(const id of ['s01','s02','s10']){await page.goto(`${baseURL}/en/vision#${id}`);await ready(page);await page.screenshot({path:`qa/v2/${id}-laptop.png`});}
await browser.close();
