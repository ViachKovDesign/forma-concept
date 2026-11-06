// Набор скриншотов для проверки: node tools/shots.mjs (нужен запущенный сервер на :8080)
// Сохраняет в /screenshots. Полные страницы — JPEG, состояния — PNG.
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');

const base = process.env.BASE || 'http://localhost:8080/';
const out = 'screenshots/';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const errors = [];
const sizes = [[375, 812], [768, 1024], [1280, 800], [1920, 1080]];
const cases = ['podovy', 'otves'];

async function newPage(w, h, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: opts.reduce ? 'reduce' : 'no-preference', javaScriptEnabled: opts.js !== false, hasTouch: !!opts.touch, isMobile: !!opts.touch });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${page.url()}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`${page.url()}: ${e.message}`));
  return page;
}
const settle = async (page) => { await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(500); };
const noHScroll = async (page, label) => {
  const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  if (sw > iw) errors.push(`${label}: горизонтальный скролл ${sw} > ${iw}`);
};

// 1. Полные страницы без анимаций (видно всё содержимое) на четырёх ширинах
for (const [w, h] of sizes) {
  const page = await newPage(w, h, { reduce: true, touch: w < 800 });
  for (const url of ['index.html', ...cases.map((c) => `cases/${c}.html`)]) {
    await page.goto(base + url, { waitUntil: 'networkidle' });
    await settle(page);
    await noHScroll(page, `${url} @${w}`);
    const name = url === 'index.html' ? 'home' : 'case-' + url.split('/')[1].replace('.html', '');
    await page.screenshot({ path: `${out}${name}-${w}-full.jpg`, fullPage: true, type: 'jpeg', quality: 70 });
    await page.screenshot({ path: `${out}${name}-${w}.png` });
  }
  await page.context().close();
}

// 2. Состояния с анимацией (десктоп 1280)
{
  const page = await newPage(1280, 800);
  await page.goto(base + 'index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${out}state-hero-intro.png` });

  // шторка на середине: верх кадра кейса ~ на 65% высоты экрана
  const top = await page.evaluate(() => document.querySelector('#case-otves .frame').getBoundingClientRect().top + scrollY);
  await page.evaluate((y) => scrollTo(0, y - 800 * 0.62), top);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${out}state-curtain-mid.png` });

  // кейс на экране — фон окрашен
  await page.evaluate((y) => scrollTo(0, y - 120), top);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${out}state-case-color.png` });

  // курсор «Открыть»
  const box = await page.locator('#case-otves .case__media').boundingBox();
  await page.mouse.move(box.x + box.width * 0.4, box.y + Math.min(box.height, 400) * 0.5, { steps: 8 });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}state-cursor-open.png` });

  // курсор над ссылкой — стрелка
  const nav = await page.locator('.nav a').first().boundingBox();
  await page.mouse.move(nav.x + nav.width / 2, nav.y + nav.height / 2, { steps: 8 });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}state-cursor-link.png` });

  // переход «обложка → кейс»: снимок в середине анимации
  await page.evaluate((y) => scrollTo(0, y - 120), top);
  await page.waitForTimeout(1200);
  const b2 = await page.locator('#case-otves .case__media').boundingBox();
  await page.mouse.click(b2.x + 200, b2.y + 150);
  await page.waitForTimeout(380);
  await page.screenshot({ path: `${out}state-transition-mid.png` }).catch(() => {});
  await page.waitForURL('**/cases/otves.html');
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${out}state-transition-end.png` });

  // «Следующий кейс» со шторкой
  await page.evaluate(() => { const n = document.querySelector('.next'); scrollTo(0, n.getBoundingClientRect().top + scrollY - 300); });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${out}state-next-case.png` });

  // форма
  await page.goto(base + 'index.html#contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.fill('#f-name', 'Анна');
  await page.fill('#f-place', 'Пекарня «Утро»');
  await page.fill('#f-city', 'Тула');
  await page.locator('.chip:has-text("Вывеска и навигация")').click();
  await page.click('button[type="submit"]');
  await page.waitForTimeout(500);
  await page.locator('.form').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}state-form-sent.png` });
  await page.context().close();
}

// 3. Без JS и «уменьшить движение»
{
  const page = await newPage(1280, 800, { js: false });
  for (const url of ['index.html', 'cases/podovy.html']) {
    await page.goto(base + url, { waitUntil: 'networkidle' });
    await settle(page);
    await page.screenshot({ path: `${out}nojs-${url === 'index.html' ? 'home' : 'case-podovy'}-1280-full.jpg`, fullPage: true, type: 'jpeg', quality: 65 });
  }
  await page.context().close();
  const rm = await newPage(1280, 800, { reduce: true });
  await rm.goto(base + 'index.html', { waitUntil: 'networkidle' });
  await settle(rm);
  const top = await rm.evaluate(() => document.querySelector('#case-tamada-i-syn').getBoundingClientRect().top + scrollY);
  await rm.evaluate((y) => scrollTo(0, y), top);
  await rm.waitForTimeout(600);
  await rm.screenshot({ path: `${out}reduced-motion-case-visible.png` });
  await rm.context().close();
}

await browser.close();
console.log(errors.length ? 'ОШИБКИ:\n' + errors.join('\n') : 'Ошибок в консоли нет, горизонтального скролла нет');
