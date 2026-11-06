// Генератор статических страниц: node tools/build.mjs
// Собирает /index.html и /cases/*.html из данных брендов в tools/brands.
// Сайт после сборки — обычный HTML/CSS/JS, без сборщика и сервера.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { esc, paletteSheet, resetUid } from './lib.mjs';
import podovy from './brands/podovy.mjs';

const brandsAll = [podovy];
const optional = ['nulevoy', 'otves', 'tamada', 'osadok', 'shu'];
for (const name of optional) {
  try { brandsAll.push((await import(`./brands/${name}.mjs`)).default); } catch (e) { if (e.code !== 'ERR_MODULE_NOT_FOUND') throw e; }
}
const brands = brandsAll;
const TOTAL = String(brands.length).padStart(2, '0');

// Адрес, по которому сайт будет опубликован (нужен для og:image). Поменяйте при публикации.
const SITE_URL = 'https://viachkovdesign.github.io/forma/';
const BASE = { bg: '#D9D6D0', ink: '#1C1B19', muted: '#55524C' };
const DARK = { bg: '#1C1B19', ink: '#E4E1DB', muted: '#A7A39B' };

const pad = (n) => String(n).padStart(2, '0');
const headClass = (b) => ({ s: b.headFont[2] ? 't-si' : 't-s', w: 't-w', c: b.headFont[1] < 500 ? 't-cl' : 't-c' })[b.headFont[0]];
const themeAttrs = (t, hall) => `data-bg="${t.bg}" data-ink="${t.ink}" data-muted="${t.muted}"${hall ? ` data-hall="${esc(hall)}"` : ''} style="--sec-bg:${t.bg};--sec-ink:${t.ink};--sec-muted:${t.muted}"`;

const ARROW = '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3 10h13M11 4.5 16.5 10 11 15.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
const MARK = '<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><rect x="1.5" y="1.5" width="29" height="29" fill="none" stroke="currentColor" stroke-width="3"/><path d="M9 30V16a7 7 0 0 1 14 0v14" fill="currentColor"/></svg>';

// CSS встраивается в страницу: так первый экран рисуется без лишнего запроса.
// Исходник стилей — css/main.css (правьте его и пересобирайте).
const cssSource = readFileSync('css/main.css', 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{};,>])\s*/g, '$1')
  .replace(/;}/g, '}');
const inlineCss = (prefix) => cssSource.replaceAll('../vendor/', prefix + 'vendor/');

function head({ title, desc, prefix, og, themeColor, htmlBg }) {
  return `<!doctype html>
<html lang="ru" class="no-js"${htmlBg ? ` style="background:${htmlBg}"` : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="${themeColor}">
<meta property="og:type" content="website">
<meta property="og:locale" content="ru_RU">
<meta property="og:site_name" content="ФОРМА — концепт-проект">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE_URL}${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(title)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${prefix}img/favicon.svg" type="image/svg+xml">
<link rel="icon" href="${prefix}img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${prefix}img/apple-touch-icon.png">
<link rel="preload" href="${prefix}vendor/fonts/unbounded-cyrillic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${prefix}vendor/fonts/golos-cyrillic.woff2" as="font" type="font/woff2" crossorigin>
<style>${inlineCss(prefix)}</style>
<script>(function(h){h.className='js'+(matchMedia('(prefers-reduced-motion: reduce)').matches?' rm':'');setTimeout(function(){if(!window.__formaReady)h.classList.add('js-fail')},2500)})(document.documentElement)</script>
<script defer src="${prefix}vendor/gsap-3.15.1/gsap.min.js"></script>
<script defer src="${prefix}vendor/gsap-3.15.1/ScrollTrigger.min.js"></script>
<script defer src="${prefix}vendor/lenis-1.3.27/lenis.min.js"></script>
<script defer src="${prefix}js/main.js"></script>
</head>`;
}

function header(prefix, home) {
  const h = home ? '' : `${prefix}index.html`;
  return `<a class="skip" href="#main">К содержимому</a>
<header class="site-header">
  <a class="brand plaque" href="${prefix}index.html"${home ? ' aria-current="page"' : ''}>${MARK}<span>ФОРМА</span><span class="visually-hidden"> — на главную</span></a>
  <nav class="nav plaque" aria-label="Основное меню">
    <ul>
      <li><a href="${h}#works">Работы</a></li>
      <li><a href="${h}#bureau">Бюро</a></li>
      <li><a href="${h}#process">Процесс</a></li>
      <li><a href="${h}#contact">Контакты</a></li>
    </ul>
  </nav>
</header>
<div class="cursor" aria-hidden="true"><span class="cursor__label">Открыть</span><svg class="cursor__arrow" viewBox="0 0 20 20"><path d="M3 10h13M11 4.5 16.5 10 11 15.5" fill="none" stroke="currentColor" stroke-width="2"/></svg></div>`;
}

function footer(prefix) {
  return `<footer class="footer wrap" ${themeAttrs(DARK, 'Выход|подвал')}>
  <p class="footer__big" aria-hidden="true">ФОРМА</p>
  <div class="grid footer__row">
    <div class="footer__col">
      <span class="label">Пишите</span>
      <a href="mailto:hello@forma.example">hello@forma.example</a>
      <span>Адрес вымышленный, как и бюро</span>
    </div>
    <div class="footer__col">
      <span class="label">Где работаем</span>
      <span>Из Екатеринбурга — по всей России</span>
      <a href="${prefix}index.html#contact">Обсудить проект</a>
    </div>
    <p class="concept">Концепт-проект. Бренд вымышленный, заведения и цифры — примеры. Дизайн и разработка — <a href="https://viachkovdesign.github.io">ViachKovDesign</a>.</p>
  </div>
</footer>`;
}

const hallEl = (num, name) => `<div class="hall plaque" aria-hidden="true">${num.includes('/') ? `<span>Зал</span> <b>${num.split('/')[0]}</b><span>/ ${num.split('/')[1]}</span>` : `<b>${num}</b>`} <span class="hall__name">${esc(name)}</span></div>`;

/* ---------------- Главная ---------------- */
function caseCard(b, i) {
  resetUid();
  const v = 'abcdef'[i % 6];
  const n = pad(i + 1);
  const url = `cases/${b.slug}.html`;
  return `<article class="case case--${v} wrap" id="case-${b.slug}" data-card data-slug-card="${b.slug}" ${themeAttrs(b.theme, `${n}/${TOTAL}|${b.kind}`)}>
  <a class="case__media" href="${url}" data-slug="${b.slug}" data-cursor="open" tabindex="-1" aria-hidden="true">
    <div class="frame vt-cover" data-curtain="${b.curtain}" style="--frame-bg:${b.theme.bg}"><div class="frame__inner">${b.cover()}</div></div>
  </a>
  <div class="case__text" data-speed="${[0.25, -0.2, 0.15, -0.3, 0.2, -0.15][i % 6]}">
    <p class="label"><span>Зал ${n}</span><span>${b.year}</span><span>${esc(b.city)}</span></p>
    <h3 class="case__title ${headClass(b)}"><a href="${url}" data-slug="${b.slug}">${esc(b.name)}</a></h3>
    <p class="case__kind">${esc(b.kind)} · ${esc(b.scope.toLowerCase())}</p>
    <p class="case__lead">${esc(b.lead)}</p>
  </div>
</article>`;
}

const principles = [
  ['Начинаем со смены в зале', 'Проводим день в заведении: стоим у кассы, засекаем, сколько секунд гость читает меню и где теряется у входа.'],
  ['Проверяем с другой стороны улицы', 'Вывеску печатаем 1:1 на баннере и смотрим с тротуара напротив, днём и после заката. Логотип, который не читается с 30 метров, не уходит в работу.'],
  ['Меню — инструмент продаж', 'Порядок позиций, размер цен и место для «блюда дня» решаем вместе с шефом и по марже, а не по красоте разворота.'],
  ['Носители — под ваш бюджет и подрядчика', 'Сдаём файлы, которые примет типография и цех наружной рекламы в вашем городе: с допусками, раскладкой на лист и сметой.'],
];
const steps = [
  ['Знакомство с заведением', '1 неделя', 'Смена в зале, разговор с владельцем и шефом, замеры фасада, разбор меню и чеков. <b>Итог:</b> бриф на одну страницу.'],
  ['Концепция', '2 недели', 'Два направления сразу на ваших носителях: вывеска на фото фасада, разворот меню, стакан или коробка. <b>Итог:</b> выбранное направление.'],
  ['Айдентика', '3 недели', 'Логотип и знак, цвета, шрифты, паттерны, правила фото. <b>Итог:</b> брендбук на 30–40 страниц.'],
  ['Носители', '3–5 недель', 'Меню, упаковка, вывеска, навигация, форма персонала, шаблоны для соцсетей. <b>Итог:</b> файлы для производства, согласованные с подрядчиками.'],
  ['Запуск', '1–2 недели', 'Надзор на монтаже вывески, приёмка тиражей, короткое обучение: как самим обновлять меню и ценники. <b>Итог:</b> заведение открывается в новой форме.'],
];

function indexPage() {
  const plan = brands.map((b, i) => `<li><a href="#case-${b.slug}"><span class="plan__n">${pad(i + 1)}</span><span class="plan__name">${esc(b.name)}</span><span class="plan__kind">${esc(b.kind)}, ${esc(b.city)}</span></a></li>`).join('');
  const chars = [...'ФОРМА'].map((c) => `<span class="hero__char">${c}</span>`).join('');
  return `${head({ title: 'ФОРМА — бюро брендинга ресторанов, кафе и баров (концепт)', desc: 'Концепт-портфолио вымышленного бюро «ФОРМА»: айдентика, меню, упаковка и вывески для пекарен, баров, кофеен и ресторанов. Шесть залов-кейсов.', prefix: '', og: 'img/og.png', themeColor: BASE.bg })}
<body>
${header('', true)}
${hallEl('Вход', 'вестибюль')}
<main id="main">
  <section class="hero wrap" aria-labelledby="hero-title" ${themeAttrs(BASE, 'Вход|вестибюль')}>
    <div class="hero__top">
      <p class="hero__label label">Бюро брендинга ресторанов, кафе и&nbsp;баров.<br>Екатеринбург, с&nbsp;2016 года, 64&nbsp;заведения</p>
      <p class="label">Экспозиция: 6 залов</p>
    </div>
    <h1 class="hero__title" id="hero-title" aria-label="ФОРМА — бюро брендинга заведений">${chars}</h1>
    <div class="hero__bottom">
      <p class="hero__sub">Айдентика для <span class="ff-serif">хлеба</span>, <span class="ff-wide">кофе</span> и <span class="ff-cond">вина</span>&nbsp;— от вывески, которую видно с остановки, до стаканчика в руке гостя.</p>
      <nav class="plan" aria-labelledby="plan-title">
        <h2 class="label" id="plan-title">План экспозиции</h2>
        <ol>${plan}</ol>
      </nav>
    </div>
  </section>

  <section class="works" id="works" aria-labelledby="works-title">
    <div class="works__head wrap" ${themeAttrs(BASE, 'Залы|работы')}>
      <h2 id="works-title">Работы</h2>
      <p class="label">Шесть залов — шесть заведений. У каждого свой шрифт, свой цвет и свой набор экспонатов: знак, меню, упаковка, фасад.</p>
    </div>
    ${brands.map(caseCard).join('\n')}
  </section>

  <section class="section wrap bureau" id="bureau" aria-labelledby="bureau-title" ${themeAttrs(BASE, 'Бюро|администрация')}>
    <p class="label section__kicker">Бюро</p>
    <h2 class="bureau__title" id="bureau-title">Мы делаем так, чтобы заведение <em>узнавали с другой стороны улицы</em>, а меню читалось из очереди.</h2>
    <div class="grid bureau__text">
      <p>Нас девять: четыре дизайнера, иллюстратор, верстальщик, технолог печати, менеджер и руководитель. Работаем только с едой и напитками — от пекарни на 12 метрах до ресторана на 200 мест. Отвечаем не за «красиво», а за то, чтобы гость нашёл вход, понял меню и унёс с собой пакет, который заметят другие.</p>
    </div>
    <ol class="grid principles">
      ${principles.map(([h, p], i) => `<li class="principle"><span class="principle__n">Принцип ${pad(i + 1)}</span><h3>${h}</h3><p>${p}</p></li>`).join('')}
    </ol>
  </section>

  <section class="section wrap process" id="process" aria-labelledby="process-title" ${themeAttrs(DARK, 'Процесс|мастерская')}>
    <p class="label section__kicker">Процесс · 10–13 недель</p>
    <h2 class="process__title" id="process-title">Пять этапов<br>от первой смены<br>до открытия</h2>
    <ol class="steps">
      ${steps.map(([h, t, p], i) => `<li class="step"><span class="step__n" aria-hidden="true">${pad(i + 1)}</span><h3><span class="visually-hidden">Этап ${i + 1}. </span>${h}</h3><span class="step__time label">${t}</span><p>${p}</p></li>`).join('')}
    </ol>
  </section>

  <section class="section wrap contact" id="contact" aria-labelledby="contact-title" ${themeAttrs(BASE, 'Касса|обсудить проект')}>
    <p class="label section__kicker">Обсудить проект</p>
    <h2 class="contact__title" id="contact-title">Расскажите о&nbsp;заведении</h2>
    <div class="grid">
      <div class="contact__intro">
        <p>Ответим в течение рабочего дня: зададим пять вопросов, назовём сроки и вилку бюджета. Если нужна только вывеска или только меню — тоже берёмся.</p>
        <p class="label">Демо-форма: данные никуда не отправляются</p>
      </div>
      <form class="form" id="brief-form" action="#contact" method="get">
        <div class="field"><label for="f-name">Имя</label><input id="f-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="f-place">Заведение</label><input id="f-place" name="place" placeholder="Пекарня «…»" required></div>
        <div class="field field--wide"><label for="f-city">Город</label><input id="f-city" name="city" autocomplete="address-level2" required></div>
        <fieldset>
          <legend>Что нужно</legend>
          <div class="chips">
            ${['Логотип и айдентика', 'Меню', 'Упаковка', 'Вывеска и навигация', 'Всё под ключ'].map((t, i) => `<label class="chip"><input type="checkbox" name="need" value="${t}"${i === 0 ? '' : ''}><span>${t}</span></label>`).join('')}
          </div>
        </fieldset>
        <fieldset>
          <legend>Бюджет</legend>
          <div class="chips">
            ${['до 300 тыс. руб.', '300–700 тыс. руб.', '700 тыс. – 1,5 млн руб.', 'больше 1,5 млн руб.'].map((t, i) => `<label class="chip"><input type="radio" name="budget" value="${t}"${i === 1 ? ' checked' : ''}><span>${t}</span></label>`).join('')}
          </div>
        </fieldset>
        <div class="field field--wide"><label for="f-msg">Пара слов о задаче</label><textarea id="f-msg" name="msg" rows="3" placeholder="Открываемся в марте, фасад во двор, гости не находят вход"></textarea></div>
        <div class="form__foot">
          <button class="btn" type="submit">Отправить заявку ${ARROW}</button>
          <p class="form__note">Нажимая кнопку, вы ничего не отправляете: это концепт-проект.</p>
        </div>
        <p class="form__status" role="status" aria-live="polite"></p>
      </form>
    </div>
  </section>
</main>
${footer('')}
</body>
</html>
`;
}

/* ---------------- Страница кейса ---------------- */
function casePage(b, i) {
  resetUid();
  const n = pad(i + 1);
  const next = brands[(i + 1) % brands.length];
  const nn = pad(((i + 1) % brands.length) + 1);
  const hc = headClass(b);
  const exhibits = b.exhibits.map((ex, k) => {
    const art = ex.art ? ex.art() : paletteSheet(b, b.paletteLayout);
    const curtains = ['up', 'split', 'diag', 'center', 'left', 'down'];
    return `<figure class="exhibit grid" aria-labelledby="ex-${k}">
      <div class="exhibit__art"><div class="frame" data-curtain="${curtains[(k + i) % curtains.length]}" style="--frame-bg:${ex.frame}"><div class="frame__inner frame__inner--static">${art}</div></div></div>
      <figcaption class="exhibit__tag tag" data-speed="${k % 2 ? -0.25 : 0.25}">
        <span class="tag__n">${pad(k + 1)}</span>
        <span class="tag__title" id="ex-${k}">${esc(ex.title)}</span>
        <span class="tag__tech">${esc(ex.tech)}</span>
        <span class="tag__note">${esc(ex.note)}</span>
      </figcaption>
    </figure>`;
  }).join('\n');
  const desc = `${b.kind} «${b.name}», ${b.city}, ${b.year}. ${b.task.split('. ')[0]}. Концепт-кейс бюро «ФОРМА».`;
  return `${head({ title: `${b.kind} «${b.name}» — кейс бюро ФОРМА (концепт)`, desc, prefix: '../', og: `img/og-${b.slug}.png`, themeColor: b.theme.bg, htmlBg: b.theme.bg })}
<body>
${header('../', false)}
${hallEl(`${n}/${TOTAL}`, b.kind)}
<main id="main">
  <section class="chero" aria-labelledby="case-title" ${themeAttrs(b.theme, `${n}/${TOTAL}|${b.kind}`)}>
    <div class="chero__cover" style="background:${b.theme.bg}">${b.cover()}</div>
    <div class="chero__plate${b.plateInvert ? ' chero__plate--inv' : ''}">
      <p class="label"><span>Зал ${n} / ${TOTAL}</span><span>${esc(b.kind)}</span><span>${esc(b.city)}</span><span>${b.year}</span></p>
      <h1 class="chero__title ${hc}" id="case-title">${esc(b.name)}</h1>
      <p class="chero__lead">${esc(b.lead)}</p>
    </div>
  </section>

  <section class="brief wrap grid" aria-label="Задача и решение" ${themeAttrs(BASE, `${n}/${TOTAL}|${b.kind}`)}>
    <div class="brief__task">
      <h2 class="label">Задача заведения</h2>
      <p>${esc(b.task)}</p>
    </div>
    <div class="brief__done">
      <h2 class="label">Что сделали</h2>
      <ol>${b.done.map((t, k) => `<li><span>${pad(k + 1)}</span>${esc(t)}</li>`).join('')}</ol>
    </div>
    <dl class="meta">
      <div><dt class="label">Заведение</dt><dd>${esc(b.kind)} «${esc(b.name)}»</dd></div>
      <div><dt class="label">Город</dt><dd>${esc(b.city)}</dd></div>
      <div><dt class="label">Год</dt><dd>${b.year}</dd></div>
      <div><dt class="label">Шрифтовая пара</dt><dd>${esc(b.typePair.join(' + '))}</dd></div>
    </dl>
  </section>

  <section class="expo wrap" aria-labelledby="expo-title" ${themeAttrs(BASE, `${n}/${TOTAL}|${b.kind}`)}>
    <div class="expo__head">
      <h2 class="${hc}" id="expo-title">Экспозиция</h2>
      <p class="label">${b.exhibits.length} экспонатов · все визуалы нарисованы в SVG</p>
    </div>
    ${exhibits}
  </section>

  <section class="results wrap" aria-labelledby="res-title" ${themeAttrs(b.theme, `${n}/${TOTAL}|${b.kind}`)}>
    <h2 class="label" id="res-title">Результат через полгода · пример</h2>
    <ul class="grid results__list">
      ${b.results.map(([v, t]) => `<li class="result"><b class="${hc}">${esc(v)}</b><span>${esc(t)}</span></li>`).join('')}
    </ul>
    <p class="label results__note">Цифры — пример: бренд и заведение вымышленные</p>
  </section>

  <section class="next wrap" aria-label="Следующий кейс" data-card data-slug-card="${next.slug}" ${themeAttrs(next.theme, `${nn}/${TOTAL}|следующий зал`)}>
    <a class="next__link" href="${next.slug}.html" data-slug="${next.slug}" data-cursor="open">
      <span class="next__text">
        <span class="label">Следующий зал · ${nn} / ${TOTAL}</span>
        <span class="next__title ${headClass(next)}">${esc(next.name)}</span>
        <span>${esc(next.kind)}, ${esc(next.city)}</span>
      </span>
      <span class="next__media"><span class="frame vt-cover" data-curtain="${next.curtain}" style="--frame-bg:${next.theme.bg};display:block"><span class="frame__inner" style="display:block">${next.cover()}</span></span></span>
    </a>
    <a class="backlink" href="../index.html#case-${b.slug}">← Ко всем залам</a>
  </section>
</main>
${footer('../')}
</body>
</html>
`;
}

mkdirSync('cases', { recursive: true });
writeFileSync('index.html', indexPage());
brands.forEach((b, i) => writeFileSync(`cases/${b.slug}.html`, casePage(b, i)));
console.log(`Собрано: index.html + ${brands.length} кейсов`);
