import { chromium } from 'playwright';
export async function launchBrowser(){
 return chromium.launch({headless:true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : process.platform==='darwin' ? {channel:'chrome'} : {})});
}
export const baseURL=process.env.BASE_URL || 'http://127.0.0.1:3000';
export async function ready(page){await page.evaluate(()=>document.fonts.ready);await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode().catch(()=>{}))));}
