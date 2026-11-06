import { svg, text, layer, leader, rep, circleText, paletteSheet } from '../lib.mjs';

const C = '#2B48A3'; // кобальт
const F = '#EEF0F4'; // мука
const K = '#9A5B2E'; // корка
const S = '#1F1E1C'; // сажа
const P = '#FBFBF8'; // бумага

function loaf(cx, cy, s, crust = K, score = '#E2C39A') {
  const p = (x, y) => `${(cx + x * s).toFixed(1)} ${(cy + y * s).toFixed(1)}`;
  let out = `<path d="M ${p(-200, 40)} C ${p(-212, -60)} ${p(-92, -122)} ${p(0, -120)} C ${p(110, -122)} ${p(214, -60)} ${p(200, 40)} C ${p(192, 82)} ${p(-192, 82)} ${p(-200, 40)} Z" fill="${crust}"/>`;
  for (let i = -1; i <= 1; i++) {
    const x1 = i * 112 - 52, y1 = 26, x2 = i * 112 + 52, y2 = -70;
    out += `<path d="M ${p(x1, y1)} Q ${p((x1 + x2) / 2 - 18, (y1 + y2) / 2 - 22)} ${p(x2, y2)} Q ${p((x1 + x2) / 2 + 14, (y1 + y2) / 2 + 12)} ${p(x1, y1)} Z" fill="${score}"/>`;
  }
  return out;
}

function seal(cx, cy, r, { ring = C, fill = 'none', textFill = C, loafFill = C, scoreFill = F, phrase = 'ПОДОВЫЙ · ХЛЕБ НА ЗАКВАСКЕ · ПЕРМЬ · ', size } = {}) {
  const sw = Math.max(2, r / 40);
  let o = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${ring}" stroke-width="${sw}"/>`;
  o += `<circle cx="${cx}" cy="${cy}" r="${r * 0.82}" fill="none" stroke="${ring}" stroke-width="${sw / 2.5}"/>`;
  o += circleText(cx, cy, r * 0.875, phrase.repeat(1), { size: size || r * 0.1, weight: 600, fill: textFill, portion: 0.99 });
  o += loaf(cx, cy + r * 0.05, r * 0.0028, loafFill, scoreFill);
  return o;
}

const cover = () => svg({
  w: 1600, h: 1000, slice: true,
  title: 'Пекарня «Подовый»: ключевой визуал',
  desc: 'Круглая печать с караваем на кобальтовом фоне в полоску, как мешок муки.',
  body: `<rect width="1600" height="1000" fill="${C}"/>` +
    layer(-0.35, rep(14, (i) => `<rect x="${i * 120 - 40}" y="-200" width="${i % 3 === 0 ? 46 : 12}" height="1400" fill="${F}" opacity=".13"/>`)) +
    layer(0.12, `<circle cx="800" cy="500" r="360" fill="${F}"/>` + seal(800, 500, 330, { phrase: 'ХЛЕБ НА ЗАКВАСКЕ · ИЗ ПЕЧИ В 7:30 · ПЕРМЬ · ' })) +
    layer(0.5, `<g transform="translate(0 0)">${loaf(1150, 800, 1.05)}</g>`) +
    layer(-0.15, text(120, 900, 'из печи в 7:30', { f: 's', size: 92, weight: 500, italic: true, fill: F })),
});

const logo = () => svg({
  w: 1200, h: 760,
  title: 'Пекарня «Подовый»: логотип, знак-печать и сетка построения',
  desc: 'Слева круглая печать с караваем и надписью по кругу, справа словесный знак антиквой, вокруг — пунктир охранного поля и минимальные размеры.',
  body: `<rect width="1200" height="760" fill="${F}"/>` +
    rep(30, (i) => `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="760" stroke="${C}" stroke-opacity=".07"/>`) +
    rep(19, (i) => `<line x1="0" y1="${i * 40}" x2="1200" y2="${i * 40}" stroke="${C}" stroke-opacity=".07"/>`) +
    `<circle cx="320" cy="360" r="262" fill="none" stroke="${C}" stroke-dasharray="6 8" stroke-opacity=".5"/>` +
    `<line x1="320" y1="70" x2="320" y2="650" stroke="${C}" stroke-dasharray="2 6" stroke-opacity=".5"/>` +
    `<line x1="30" y1="360" x2="610" y2="360" stroke="${C}" stroke-dasharray="2 6" stroke-opacity=".5"/>` +
    seal(320, 360, 230) +
    text(320, 500, 'С 2025', { size: 18, weight: 600, fill: C, anchor: 'middle', ls: 4 }) +
    text(560, 150, 'R = 6x', { size: 15, fill: C, extra: 'opacity=".8"' }) +
    `<rect x="640" y="210" width="500" height="250" fill="none" stroke="${C}" stroke-dasharray="6 8" stroke-opacity=".5"/>` +
    text(680, 352, 'Подовый', { f: 's', size: 132, weight: 600, fill: C }) +
    text(684, 404, 'ПЕКАРНЯ · ХЛЕБ НА ЗАКВАСКЕ', { size: 18, weight: 500, fill: S, ls: 3.2 }) +
    text(648, 232, 'x', { f: 's', size: 22, italic: true, fill: C }) +
    text(1120, 452, 'x', { f: 's', size: 22, italic: true, fill: C }) +
    `<line x1="640" y1="560" x2="1140" y2="560" stroke="${C}" stroke-opacity=".35"/>` +
    seal(700, 640, 46, { size: 7.5 }) + text(760, 646, '18 мм', { size: 16, fill: S }) +
    seal(890, 640, 30, { size: 5.2 }) + text(932, 646, '12 мм — минимум', { size: 16, fill: S }),
});

const items = (x, y0, list) => list.map(([n, sub, pr], i) => {
  const y = y0 + i * 66;
  return text(x, y, n, { size: 22, weight: 500, fill: S }) + text(x, y + 24, sub, { size: 15, fill: '#5E6170' }) + leader(x + 290, x + 380, y - 6, C) + text(x + 440, y, pr, { size: 22, weight: 600, fill: S, anchor: 'end' });
}).join('');

const menu = () => svg({
  w: 1200, h: 780,
  title: 'Пекарня «Подовый»: разворот меню',
  desc: 'Две полосы меню: «Хлеб» и «Сдоба и завтрак», цены справа, внизу расписание выпечки 7:30, 11:00 и 16:00 и скидка на вчерашний хлеб.',
  body: `<rect width="1200" height="780" fill="#D9DDE7"/>` +
    `<rect x="88" y="68" width="1040" height="660" fill="#000" opacity=".12"/>` +
    `<rect x="80" y="60" width="1040" height="660" fill="${P}"/>` +
    `<rect x="590" y="60" width="20" height="660" fill="#000" opacity=".05"/>` +
    `<line x1="600" y1="60" x2="600" y2="720" stroke="#000" stroke-opacity=".12"/>` +
    rep(2, (k) => {
      const x = 80 + k * 520;
      return `<rect x="${x}" y="60" width="520" height="34" fill="${C}"/>` + rep(10, (i) => `<rect x="${x + 20 + i * 50}" y="60" width="${i % 2 ? 6 : 16}" height="34" fill="${F}" opacity=".35"/>`);
    }) +
    text(130, 180, 'Хлеб', { f: 's', size: 76, weight: 600, fill: C }) +
    text(132, 214, 'на закваске, подовый — без формы', { size: 16, fill: '#5E6170' }) +
    items(132, 280, [['Подовый пшеничный', '800 г · закваска 18 часов', '210'], ['Ржаной с кориандром', '700 г · заварной', '190'], ['Цельнозерновой', '750 г · с семечками', '230'], ['Чиабатта', '300 г', '120'], ['Багет на закваске', '280 г', '110']]) +
    `<line x1="132" y1="618" x2="550" y2="618" stroke="${C}" stroke-opacity=".3"/>` +
    text(132, 664, 'Из печи: 7:30 · 11:00 · 16:00', { f: 's', size: 30, weight: 600, italic: true, fill: C }) +
    text(650, 180, 'Сдоба и завтрак', { f: 's', size: 64, weight: 600, fill: C }) +
    text(652, 214, 'с 7:30 до 12:00', { size: 16, fill: '#5E6170' }) +
    items(652, 280, [['Булочка с кардамоном', '90 г', '140'], ['Ржаной круассан', '80 г', '160'], ['Тост, масло и соль', 'на вчерашнем подовом', '180'], ['Каша на солоде', 'ржаной солод, сливки', '220'], ['Фильтр-кофе', '250 мл', '150']]) +
    `<rect x="650" y="606" width="420" height="80" fill="${C}"/>` +
    text(672, 640, 'Вчерашний хлеб — для тостов', { size: 18, weight: 600, fill: F }) +
    text(672, 668, '−40% после 19:00', { f: 's', size: 26, weight: 600, italic: true, fill: F }) +
    text(560, 706, '2', { size: 14, fill: '#5E6170', anchor: 'end' }) + text(1090, 706, '3', { size: 14, fill: '#5E6170', anchor: 'end' }),
});

const pack = () => {
  const loafD = (cx, cy, s) => { const p = (x, y) => `${cx + x * s} ${cy + y * s}`; return `M ${p(-200, 40)} C ${p(-212, -60)} ${p(-92, -122)} ${p(0, -120)} C ${p(110, -122)} ${p(214, -60)} ${p(200, 40)} C ${p(192, 82)} ${p(-192, 82)} ${p(-200, 40)} Z`; };
  return svg({
    w: 1200, h: 800,
    title: 'Пекарня «Подовый»: бумажный пакет и бандероль на хлеб',
    desc: 'Белый пакет с кобальтовыми полосами как у мешка муки и печатью, рядом каравай с бумажной лентой «7:30».',
    body: `<rect width="1200" height="800" fill="#D5DAE6"/>` +
      `<rect x="150" y="710" width="980" height="14" fill="#000" opacity=".08"/>` +
      `<polygon points="560,170 600,190 600,710 560,710" fill="#E1E0DA"/>` +
      `<polygon points="${rep(20, (i) => `${180 + i * 19},${i % 2 ? 158 : 170} `)}560,170 560,710 180,710" fill="${P}"/>` +
      `<rect x="214" y="170" width="30" height="540" fill="${C}"/><rect x="254" y="170" width="8" height="540" fill="${C}"/><rect x="272" y="170" width="30" height="540" fill="${C}"/>` +
      seal(430, 420, 104, { fill: P, size: 13 }) +
      text(430, 600, 'ХЛЕБ НА ЗАКВАСКЕ', { size: 15, weight: 600, fill: C, anchor: 'middle', ls: 3 }) +
      text(430, 624, 'ПЕРМЬ', { size: 15, weight: 600, fill: C, anchor: 'middle', ls: 3 }) +
      `<defs><clipPath id="podovy-band"><path d="${loafD(860, 560, 1.1)}"/></clipPath></defs>` +
      `<ellipse cx="860" cy="660" rx="230" ry="16" fill="#000" opacity=".1"/>` +
      loaf(860, 560, 1.1) +
      `<g clip-path="url(#podovy-band)"><rect x="800" y="380" width="96" height="300" fill="${C}"/><rect x="800" y="380" width="4" height="300" fill="${F}"/><rect x="892" y="380" width="4" height="300" fill="${F}"/></g>` +
      `<text class="fs" font-size="34" font-weight="600" font-style="italic" fill="${F}" transform="translate(860 560) rotate(-90)" text-anchor="middle" dy="12">7:30</text>`,
  });
};

const facade = () => svg({
  w: 1200, h: 800,
  title: 'Пекарня «Подовый»: фасад с вывеской, маркизой и кронштейном',
  desc: 'Первый этаж панельного дома: кобальтовый короб с надписью «Подовый», полосатая маркиза, витрина с хлебом на полках, круглая вывеска на кронштейне и штендер «Горячий хлеб 7:30».',
  body: `<rect width="1200" height="800" fill="#CFD4E0"/>` +
    rep(6, (i) => `<line x1="${i * 220 + 40}" y1="0" x2="${i * 220 + 40}" y2="400" stroke="#B4BACB" stroke-width="3"/>`) +
    `<line x1="0" y1="190" x2="1200" y2="190" stroke="#B4BACB" stroke-width="3"/>` +
    rep(5, (i) => `<rect x="${i * 220 + 100}" y="50" width="110" height="100" fill="#8F9ABA"/><line x1="${i * 220 + 155}" y1="50" x2="${i * 220 + 155}" y2="150" stroke="${P}" stroke-width="6"/><rect x="${i * 220 + 92}" y="150" width="126" height="8" fill="${P}"/>`) +
    rep(5, (i) => `<rect x="${i * 220 + 100}" y="236" width="110" height="100" fill="#8F9ABA"/><line x1="${i * 220 + 155}" y1="236" x2="${i * 220 + 155}" y2="336" stroke="${P}" stroke-width="6"/><rect x="${i * 220 + 92}" y="336" width="126" height="8" fill="${P}"/>`) +
    `<rect x="0" y="396" width="1200" height="290" fill="#E9EAEE"/>` +
    `<rect x="140" y="400" width="840" height="64" fill="${C}"/>` +
    text(560, 448, 'Подовый', { f: 's', size: 50, weight: 600, fill: F, anchor: 'middle' }) +
    text(700, 440, 'хлеб на закваске', { size: 15, fill: F, extra: 'opacity=".85"' }) +
    rep(28, (i) => `<rect x="${140 + i * 30}" y="464" width="30" height="40" fill="${i % 2 ? F : C}"/>`) +
    rep(14, (i) => `<path d="M ${140 + i * 60} 504 a 30 18 0 0 0 60 0 Z" fill="${C}"/>`) +
    `<rect x="170" y="540" width="580" height="146" fill="#1E2A4A"/>` +
    `<line x1="170" y1="600" x2="750" y2="600" stroke="#5B6789" stroke-width="4"/><line x1="170" y1="662" x2="750" y2="662" stroke="#5B6789" stroke-width="4"/>` +
    rep(6, (i) => loaf(220 + i * 92, 584, 0.17)) + rep(7, (i) => loaf(210 + i * 82, 646, 0.14, '#B9763F')) +
    text(460, 530, 'из печи: 7:30 · 11:00 · 16:00', { f: 's', size: 22, italic: true, weight: 600, fill: '#1E2A4A', anchor: 'middle' }) +
    `<rect x="790" y="530" width="150" height="156" fill="${C}"/><rect x="808" y="548" width="114" height="80" fill="#1E2A4A"/><rect x="900" y="640" width="10" height="30" fill="${F}"/>` +
    `<path d="M 1000 420 L 1150 420 M 1000 408 L 1000 470 M 1020 420 Q 1050 460 1090 420" stroke="${S}" stroke-width="5" fill="none"/>` +
    `<line x1="1100" y1="420" x2="1100" y2="452" stroke="${S}" stroke-width="3"/>` +
    `<circle cx="1100" cy="516" r="66" fill="${F}"/>` + seal(1100, 516, 60, { size: 9.5 }) +
    `<rect x="0" y="686" width="1200" height="114" fill="#A9AFBF"/><rect x="0" y="686" width="1200" height="8" fill="#8D93A6"/>` +
    `<polygon points="1010,600 1070,600 1090,760 990,760" fill="${S}"/><rect x="1004" y="616" width="72" height="100" fill="${F}"/>` +
    text(1040, 646, 'ГОРЯЧИЙ', { size: 12, weight: 700, fill: C, anchor: 'middle', ls: 1 }) + text(1040, 668, 'ХЛЕБ', { size: 12, weight: 700, fill: C, anchor: 'middle', ls: 1 }) +
    text(1040, 702, '7:30', { f: 's', size: 26, weight: 700, italic: true, fill: C, anchor: 'middle' }),
});

export default {
  slug: 'podovy', name: 'Подовый', kind: 'Пекарня', city: 'Пермь', year: 2025,
  headFont: ['s', 600, false], fontClass: 'ff-serif', fontName: 'Cormorant',
  theme: { bg: '#2B48A3', ink: '#F4F2EC', muted: '#CDD5EE' },
  curtain: 'up',
  scope: 'Айдентика, меню, упаковка, вывеска',
  lead: 'Хлеб на закваске на первом этаже панельного дома в Мотовилихе.',
  task: 'Пекарня печёт подовый хлеб на закваске, но с улицы её путали с магазином у дома: витрина в плёнке, ценники от руки. Утренний поток к остановке проходил мимо, не зная, что в 7:30 здесь уже горячий хлеб. Нужно было за три секунды объяснить: тут пекут, а не перепродают.',
  done: ['Печать-знак с караваем и словесный знак антиквой', 'Меню из двух полос с расписанием выпечки', 'Пакет в полоску, как мешок муки, и бандероль на хлеб', 'Короб, маркиза, кронштейн и штендер «Горячий хлеб 7:30»'],
  results: [['+38%', 'чеков до 10:00'], ['15:00', 'хлеб распродан в 5 из 7 дней'], ['9 из 10', 'гостей узнают пакет на улице']],
  typePair: ['Cormorant', 'Golos Text'],
  palette: [
    { name: 'Кобальт', hex: '#2B48A3', role: 'вывеска, полосы' },
    { name: 'Мука', hex: '#EEF0F4', role: 'фон, пакет' },
    { name: 'Корка', hex: '#9A5B2E', role: 'иллюстрации' },
    { name: 'Сажа', hex: '#1F1E1C', role: 'текст' },
  ],
  sheetBg: '#F6F7FA', sheetInk: S, paletteLayout: 'columns',
  cover,
  exhibits: [
    { title: 'Логотип и знак', tech: 'Печать, сетка построения, охранное поле', note: 'Каравай с тремя надрезами — так выглядит подовый хлеб после печи. Печать работает от 12 мм на ценнике до двух метров на кронштейне.', frame: '#E6E9F0', art: logo },
    { title: 'Разворот меню', tech: 'Бумага 300 г, печать в одну краску', note: 'Расписание выпечки стоит в меню на месте, где обычно пишут слоган. Вчерашний хлеб продаётся как отдельная позиция, а не прячется.', frame: '#D9DDE7', art: menu },
    { title: 'Пакет и бандероль', tech: 'Крафт белёный, флексопечать', note: 'Полосы мешка муки видно в руках у прохожих — пакет стал наружной рекламой у остановки. Бандероль — одна краска и одна высечка на весь ассортимент.', frame: '#D5DAE6', art: pack },
    { title: 'Фасад', tech: 'Короб, маркиза, кронштейн, штендер', note: 'Короб читается с остановки напротив (32 м). Штендер с временем выпечки выносят только утром — это единственное объявление пекарни.', frame: '#CFD4E0', art: facade },
    { title: 'Цвет и шрифт', tech: 'Палитра, шрифтовая пара', note: 'Один яркий цвет вместо пяти: кобальт держит всю систему, корка появляется только в иллюстрациях хлеба.', frame: '#F6F7FA', art: null },
  ],
};
