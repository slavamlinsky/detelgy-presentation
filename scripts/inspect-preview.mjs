import {launchBrowser,baseURL,ready} from './browser.mjs';
const b=await launchBrowser();const p=await b.newPage();
for(const route of ['/en/vision','/en/vision/print']){await p.goto(baseURL+route);await ready(p);console.log(route,await p.locator('.slide-header .brand').first().evaluate(el=>({html:el.outerHTML,background:getComputedStyle(el).background,width:getComputedStyle(el).width,height:getComputedStyle(el).height,css:[...document.styleSheets].map(s=>{try{return [...s.cssRules].filter(r=>r.cssText.includes('brand-dark')).map(r=>r.cssText)}catch{return []}})})))}await b.close();
