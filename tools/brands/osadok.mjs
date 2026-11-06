import { svg, text, layer, rep, uid } from '../lib.mjs';

const P = '#D49AA3'; // розе
const I = '#22151A'; // чернила
const M = '#7A3B48'; // вино
const Gr = '#BFB8B4'; // серый
const W = '#F4EFEE'; // бумага

const bottleD = (x, y, w, h) => `M ${x} ${y + h} V ${y + h * 0.45} Q ${x} ${y + h * 0.3} ${x + w * 0.36} ${y + h * 0.26} V ${y} H ${x + w * 0.64} V ${y + h * 0.26} Q ${x + w} ${y + h * 0.3} ${x + w} ${y + h * 0.45} V ${y + h} Z`;

// волнистые пласты осадка
function strata(x, y, w, n, h, colors) {
  let o = '';
  for (let k = 0; k < n; k++) {
    const yy = y + k * h;
    const amp = 6 + (k % 3) * 3;
    let d = `M ${x} ${yy}`;
    for (let i = 0; i <= 8; i++) d += ` Q ${x + (i + 0.5) * (w / 8)} ${yy + (i % 2 ? amp : -amp)} ${x + (i + 1) * (w / 8)} ${yy}`;
    d += ` V ${y + n * h + 400} H ${x} Z`;
    o += `<path d="${d}" fill="${colors[k % colors.length]}"/>`;
  }
  return o;
}

function bottle(x, y, w, h, sed = 0.22, { glass = M, layerC = P } = {}) {
  const id = uid('bt');
  return `<defs><clipPath id="${id}"><path d="${bottleD(x, y, w, h)}"/></clipPath></defs><path d="${bottleD(x, y, w, h)}" fill="${glass}"/>` +
    `<g clip-path="url(#${id})">${strata(x - 10, y + h * (1 - sed), w + 20, 3, h * sed / 3, [layerC, '#C2858F', '#B06F7B'])}</g>`;
}

function glass(cx, top, s, { stroke = P, sed = true } = {}) {
  const id = uid('gl');
  const bowl = `M ${cx - 90 * s} ${top} C ${cx - 100 * s} ${top + 140 * s} ${cx - 70 * s} ${top + 210 * s} ${cx} ${top + 214 * s} C ${cx + 70 * s} ${top + 210 * s} ${cx + 100 * s} ${top + 140 * s} ${cx + 90 * s} ${top} Z`;
  let o = `<defs><clipPath id="${id}"><path d="${bowl}"/></clipPath></defs>`;
  if (sed) o += `<g clip-path="url(#${id})">${strata(cx - 110 * s, top + 120 * s, 220 * s, 4, 26 * s, ['#E7BCC3', P, '#C2858F', '#A8636F'])}</g>`;
  o += `<path d="${bowl}" fill="none" stroke="${stroke}" stroke-width="${5 * s}"/>`;
  o += `<line x1="${cx}" y1="${top + 214 * s}" x2="${cx}" y2="${top + 360 * s}" stroke="${stroke}" stroke-width="${5 * s}"/><line x1="${cx - 60 * s}" y1="${top + 362 * s}" x2="${cx + 60 * s}" y2="${top + 362 * s}" stroke="${stroke}" stroke-width="${6 * s}"/>`;
  return o;
}

const cover = () => svg({
  w: 1600, h: 1000, slice: true,
  title: 'Винный бар «Осадок»: ключевой визуал',
  desc: 'Тёмный фон, силуэты бутылок с розовыми пластами осадка на дне, в центре бокал со слоями, внизу волнистые пласты и надпись «Осадок — это нормально».',
  body: `<rect width="1600" height="1000" fill="${I}"/>` +
    layer(-0.3, bottle(250, 140, 150, 560, 0.25) + bottle(440, 220, 130, 480, 0.4) + bottle(1050, 180, 140, 520, 0.18) + bottle(1220, 120, 160, 580, 0.3)) +
    layer(0.2, glass(800, 230, 1.45)) +
    layer(0.45, strata(-20, 780, 1640, 4, 34, ['#5A2A35', M, '#A8636F', P])) +
    layer(-0.12, text(800, 150, 'ОСАДОК — ЭТО НОРМАЛЬНО', { f: 'c', size: 54, weight: 300, fill: P, anchor: 'middle', ls: 10 })),
});

const logo = () => {
  const id = uid('wm');
  return svg({
    w: 1200, h: 760,
    title: 'Винный бар «Осадок»: логотип с «осадком» в буквах',
    desc: 'Высокие узкие буквы «ОСАДОК», нижняя треть каждой буквы залита розовым, как осадок в бутылке; слева знак — бокал с пластами.',
    body: `<rect width="1200" height="760" fill="${W}"/>` +
      `<defs><clipPath id="${id}"><text x="380" y="470" class="fc" font-size="270" font-weight="300" textLength="740" lengthAdjust="spacingAndGlyphs">ОСАДОК</text></clipPath></defs>` +
      text(380, 470, 'ОСАДОК', { f: 'c', size: 270, weight: 300, fill: I, extra: 'textLength="740" lengthAdjust="spacingAndGlyphs"' }) +
      `<g clip-path="url(#${id})">${strata(360, 400, 780, 3, 26, [P, '#C2858F', M])}</g>` +
      glass(220, 210, 1.05, { stroke: I }) +
      `<line x1="380" y1="520" x2="1130" y2="520" stroke="${I}" stroke-opacity=".25"/>` +
      text(380, 570, 'ВИННЫЙ БАР · НАТУРАЛЬНОЕ ВИНО · ПЕТРОГРАДСКАЯ СТОРОНА', { size: 17, weight: 500, fill: I, ls: 3 }) +
      text(380, 640, 'Высота «осадка» — треть буквы. На вывеске пласты подсвечиваются.', { size: 16, fill: '#6A5257' }),
  });
};

const levels = [
  ['прозрачное', 0, [['Рислинг, Мозель', '650'], ['Пино нуар, Эльзас', '790']]],
  ['лёгкая дымка', 1, [['Пет-нат розе, Луара', '690'], ['Гамэ, Божоле', '720']]],
  ['мутное', 2, [['Ркацители, Кахетия', '720'], ['Шенен, Анжу', '840']]],
  ['очень мутное', 3, [['Мюскаде на осадке', '760'], ['Орандж, Крым', '700']]],
  ['с осадком', 4, [['Пет-нат без дегоржажа', '760'], ['Кидеш, Кубань', '680']]],
];

const menu = () => svg({
  w: 1200, h: 800,
  title: 'Винный бар «Осадок»: винная карта по шкале мутности',
  desc: 'Винная карта разбита на пять колонок от прозрачного вина к вину с осадком; над каждой — бокал с нарастающим слоем осадка, под ним два вина и цена за бокал.',
  body: `<rect width="1200" height="800" fill="#5A2A35"/>` +
    `<rect x="50" y="40" width="1100" height="720" fill="${W}"/>` +
    text(100, 130, 'ШКАЛА МУТНОСТИ', { f: 'c', size: 72, weight: 300, fill: I, ls: 4 }) +
    text(1100, 128, 'цена за бокал 150 мл', { size: 17, fill: '#6A5257', anchor: 'end' }) +
    `<line x1="100" y1="400" x2="1100" y2="400" stroke="${I}" stroke-opacity=".3"/>` +
    `<polygon points="100,410 1100,410 1100,420 100,414" fill="${P}"/>` +
    levels.map(([name, lv, wines], i) => {
      const x = 100 + i * 205;
      const id = uid('lv');
      const bowl = `M ${x + 40} 180 C ${x + 34} 260 ${x + 56} 300 ${x + 90} 302 C ${x + 124} 300 ${x + 146} 260 ${x + 140} 180 Z`;
      const fillH = [0, 14, 30, 48, 70][lv];
      return `<defs><clipPath id="${id}"><path d="${bowl}"/></clipPath></defs>` +
        `<path d="${bowl}" fill="${P}" opacity="${0.15 + lv * 0.12}"/>` +
        (fillH ? `<g clip-path="url(#${id})"><rect x="${x + 30}" y="${302 - fillH}" width="120" height="${fillH}" fill="${M}" opacity=".85"/></g>` : '') +
        `<path d="${bowl}" fill="none" stroke="${I}" stroke-width="3"/><line x1="${x + 90}" y1="302" x2="${x + 90}" y2="360" stroke="${I}" stroke-width="3"/><line x1="${x + 66}" y1="362" x2="${x + 114}" y2="362" stroke="${I}" stroke-width="3"/>` +
        text(x, 460, `0${lv + 1}`, { f: 'c', size: 40, weight: 300, fill: M }) +
        text(x, 494, name.toUpperCase(), { f: 'c', size: 24, weight: 500, fill: I, ls: 1 }) +
        wines.map(([w, p], k) => text(x, 546 + k * 60, w, { size: 15, fill: I }) + text(x, 568 + k * 60, p, { size: 15, weight: 600, fill: M })).join('');
    }).join('') +
    `<rect x="100" y="680" width="1000" height="50" fill="${I}"/>` +
    text(120, 712, 'СЕТ «ТРИ СЛОЯ»: прозрачное, мутное и с осадком по 50 мл — 750', { f: 'c', size: 24, weight: 500, fill: P, ls: 1 }),
});

const pack = () => svg({
  w: 1200, h: 800,
  title: 'Винный бар «Осадок»: пакет для бутылки и этикетка домашнего вина',
  desc: 'Высокий розовый бумажный пакет для бутылки с пластами внизу и вертикальной надписью, рядом тёмная бутылка с белой этикеткой «Осадок № 1, пет-нат».',
  body: `<rect width="1200" height="800" fill="#E9E1E0"/>` +
    `<rect x="120" y="720" width="960" height="10" fill="#000" opacity=".08"/>` +
    `<polygon points="210,120 470,120 470,720 210,720" fill="${P}"/><polygon points="210,120 470,120 456,140 224,140" fill="#C68C95"/>` +
    `<g clip-path="url(#osadok-bag)">${strata(200, 600, 290, 3, 40, ['#C2858F', M, I])}</g><defs><clipPath id="osadok-bag"><rect x="210" y="120" width="260" height="600"/></clipPath></defs>` +
    `<text class="fc" font-size="100" font-weight="300" fill="${I}" letter-spacing="6" transform="translate(378 590) rotate(-90)">ОСАДОК</text>` +
    text(240, 180, 'натуральное', { size: 15, fill: I }) + text(240, 200, 'вино навынос', { size: 15, fill: I }) +
    bottle(640, 150, 170, 570, 0.12, { glass: '#2E2A26', layerC: '#6E5A48' }) +
    `<rect x="640" y="440" width="170" height="200" fill="${W}"/>` +
    `<g clip-path="url(#osadok-lbl)">${strata(630, 590, 190, 3, 18, [P, '#C2858F', M])}</g><defs><clipPath id="osadok-lbl"><rect x="640" y="440" width="170" height="200"/></clipPath></defs>` +
    text(725, 492, 'ОСАДОК', { f: 'c', size: 36, weight: 300, fill: I, anchor: 'middle', ls: 3 }) +
    text(725, 540, '№ 1', { f: 'c', size: 30, weight: 500, fill: M, anchor: 'middle' }) +
    text(725, 570, 'пет-нат, 2024', { size: 13, fill: I, anchor: 'middle' }) +
    `<rect x="890" y="380" width="200" height="200" fill="${I}"/>` + glass(990, 410, 0.5) + text(990, 612, 'подставка', { size: 14, fill: I, anchor: 'middle' }),
});

const facade = () => svg({
  w: 1200, h: 800,
  title: 'Винный бар «Осадок»: вход через парадную',
  desc: 'Петербургский фасад с рустом: высокая арочная парадная с деревянной дверью и веерным окном, рядом розовая эмалевая табличка «Осадок, вниз 12 ступеней», фонарь на кронштейне и подвальные окна с тёплым светом.',
  body: `<rect width="1200" height="800" fill="#C9C1B6"/>` +
    rep(14, (i) => `<line x1="0" y1="${i * 44}" x2="1200" y2="${i * 44}" stroke="#B3AA9D" stroke-width="3"/>`) +
    rep(4, (i) => `<rect x="${80 + i * 290}" y="40" width="120" height="190" fill="#4B4F57"/><rect x="${70 + i * 290}" y="228" width="140" height="12" fill="#DCD5CB"/><rect x="${70 + i * 290}" y="26" width="140" height="18" fill="#DCD5CB"/>`) +
    `<path d="M 420 640 V 380 A 180 180 0 0 1 780 380 V 640 Z" fill="#DCD5CB"/>` +
    `<path d="M 446 640 V 384 A 154 154 0 0 1 754 384 V 640 Z" fill="#3D2A22"/>` +
    `<path d="M 470 384 A 130 130 0 0 1 730 384 Z" fill="#2B2F3A"/>` + rep(7, (i) => { const a = Math.PI + (i + 1) * Math.PI / 8; return `<line x1="600" y1="384" x2="${(600 + Math.cos(a) * 130).toFixed(1)}" y2="${(384 + Math.sin(a) * 130).toFixed(1)}" stroke="#DCD5CB" stroke-width="4"/>`; }) +
    `<rect x="470" y="400" width="124" height="230" fill="#4A342A"/><rect x="606" y="400" width="124" height="230" fill="#4A342A"/>` +
    `<rect x="490" y="420" width="84" height="120" fill="none" stroke="#5E453A" stroke-width="4"/><rect x="626" y="420" width="84" height="120" fill="none" stroke="#5E453A" stroke-width="4"/>` +
    `<rect x="808" y="430" width="150" height="110" rx="8" fill="${P}"/><rect x="814" y="436" width="138" height="98" rx="5" fill="none" stroke="${I}" stroke-width="2"/>` +
    text(883, 478, 'ОСАДОК', { f: 'c', size: 30, weight: 300, fill: I, anchor: 'middle', ls: 3 }) + text(883, 506, 'вниз 12 ступеней', { size: 13, fill: I, anchor: 'middle' }) + text(883, 524, '18:00–02:00', { size: 12, fill: I, anchor: 'middle' }) +
    `<path d="M 330 330 h 60 M 340 330 q 20 30 50 0" stroke="${I}" stroke-width="4" fill="none"/><rect x="372" y="330" width="4" height="40" fill="${I}"/><path d="M 356 370 h 36 l -6 46 h -24 Z" fill="#F2D9A0"/><rect x="352" y="366" width="44" height="8" fill="${I}"/>` +
    `<rect x="0" y="640" width="1200" height="160" fill="#8C8478"/>` +
    rep(2, (i) => `<rect x="${80 + i * 860}" y="660" width="200" height="90" fill="#F0C77A"/><rect x="${80 + i * 860}" y="660" width="200" height="90" fill="none" stroke="#DCD5CB" stroke-width="8"/>`) +
    text(180, 712, 'натуральное вино', { f: 'c', size: 22, weight: 500, fill: M, anchor: 'middle' }) +
    text(1040, 704, 'вход', { f: 'c', size: 22, weight: 500, fill: M, anchor: 'middle' }) + text(1040, 730, 'через парадную', { f: 'c', size: 22, weight: 500, fill: M, anchor: 'middle' }) +
    `<rect x="0" y="640" width="1200" height="8" fill="#6F685E"/>`,
});

export default {
  slug: 'osadok', name: 'Осадок', kind: 'Винный бар', city: 'Санкт-Петербург', year: 2024,
  headFont: ['c', 300], fontName: 'Fira Sans Extra Condensed Light',
  theme: { bg: '#D49AA3', ink: '#22151A', muted: '#55303A' },
  curtain: 'split',
  scope: 'Логотип, винная карта, упаковка, табличка',
  lead: 'Бар натурального вина на 28 мест в подвале дома с парадной на Петроградской стороне.',
  task: 'В баре сорок вин по бокалам, почти все — без фильтрации. Гости пугались мутного вина и спрашивали, не испорчено ли оно, а выбирать из сорока позиций не хотели. Нужно было превратить осадок из страха в повод для разговора и упростить выбор.',
  done: ['Логотип с «осадком» в нижней трети букв', 'Винная карта по шкале мутности из пяти уровней', 'Пакет для бутылки, этикетка домашнего вина, подставки', 'Эмалевая табличка у парадной и надписи на подвальных окнах'],
  results: [['+40%', 'продажи вина по бокалам'], ['1 из 3', 'гостей берёт сет «Три слоя»'], ['15%', 'выручки — бутылки навынос']],
  typePair: ['Fira Sans Extra Condensed', 'Golos Text'],
  palette: [
    { name: 'Розе', hex: '#D49AA3', role: 'основной' },
    { name: 'Чернила', hex: '#22151A', role: 'текст, фон' },
    { name: 'Вино', hex: '#7A3B48', role: 'пласты' },
    { name: 'Камень', hex: '#BFB8B4', role: 'вторичный' },
    { name: 'Бумага', hex: '#F4EFEE', role: 'карта' },
  ],
  sheetBg: '#F4EFEE', sheetInk: I, paletteLayout: 'stack',
  cover,
  exhibits: [
    { title: 'Логотип', tech: 'Узкий гротеск, заливка «осадком»', note: 'Нижняя треть букв залита розовым — как осадок на дне бутылки. Знак честно показывает то, чего гости боялись.', frame: '#ECE5E3', art: logo },
    { title: 'Винная карта', tech: 'Лист А3, печать в две краски', note: 'Вместо стран и сортов — шкала от прозрачного к плотному. Гость выбирает «насколько мутное», а дальше помогает сомелье.', frame: '#5A2A35', art: menu },
    { title: 'Пакет и этикетка', tech: 'Крафт с тонировкой, этикетка на верже', note: 'Пласты на пакете — тот же приём, что в логотипе. Бутылку несут по улице, и знак работает как вывеска.', frame: '#E9E1E0', art: pack },
    { title: 'Парадная', tech: 'Эмалевая табличка, надписи на стекле', note: 'В историческом центре большую вывеску не согласовать. Табличка 30 × 22 см и тёплый свет подвальных окон работают вместо неё.', frame: '#C9C1B6', art: facade },
    { title: 'Цвет и шрифт', tech: 'Палитра, шрифтовая пара', note: 'Цвета взяты из бокала: от розового на просвет до плотного винного у дна.', frame: '#F4EFEE', art: null },
  ],
};
