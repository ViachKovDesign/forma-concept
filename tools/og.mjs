// Снимает OG-картинки 1200×630 и иконки через Playwright.
// Запуск: python3 -m http.server 8080 (в корне) и затем node tools/og.mjs
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright'); // глобальный Playwright или npm i -D playwright
import { readdirSync } from 'node:fs';
const base = process.env.BASE || 'http://localhost:8080/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, reducedMotion: 'reduce' });
const OG_CSS = {
  home: '.hall,.skip,.plan,.hero__top .label:last-child{display:none!important}.hero{min-height:630px!important;padding:96px 48px 48px!important}.hero__bottom .hero__sub{grid-column:1/-1;font-size:2.6rem;max-width:18em}',
  case: '.hall,.skip,.chero__lead{display:none!important}.chero__plate{margin:0 0 40px 40px}',
};
const shoot = async (url, out) => {
  await page.goto(base + url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: url.startsWith('cases') ? OG_CSS.case : OG_CSS.home });
  await page.waitForTimeout(300);
  await page.screenshot({ path: out });
};
await shoot('index.html', 'img/og.png');
for (const f of readdirSync('cases')) await shoot(`cases/${f}`, `img/og-${f.replace('.html', '')}.png`);
// иконки
for (const [size, out] of [[32, 'img/favicon-32.png'], [180, 'img/apple-touch-icon.png']]) {
  await page.setViewportSize({ width: size, height: size });
  await page.goto(base + 'index.html');
  await page.setContent(`<style>html,body{margin:0}</style><img src="${base}img/favicon.svg" width="${size}" height="${size}">`);
  await page.waitForTimeout(200);
  await page.screenshot({ path: out, omitBackground: true });
}
await browser.close();
console.log('OG и иконки готовы');
