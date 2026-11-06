import { svg, text, layer, rep, uid, circleText } from '../lib.mjs';

const Y = '#F0BE1C'; // сигнальный жёлтый
const G = '#1C1C1A'; // графит
const B = '#9C9A94'; // бетон
const W = '#F2F0EA'; // известь

// штриховка «опасная зона»
function hazard(x, y, w, h, a = Y, b = G, step = 36) {
  const id = uid('hz');
  return `<defs><pattern id="${id}" width="${step}" height="${step}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="${step}" height="${step}" fill="${a}"/><rect width="${step / 2}" height="${step}" fill="${b}"/></pattern></defs><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})"/>`;
}

// кружок оси, как на строительном чертеже
const axis = (cx, cy, r, label, { fill = Y, stroke = G, ink = G, size } = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${Math.max(2, r / 14)}"/>` +
  text(cx, cy + (size || r * 1.3) * 0.36, label, { f: 'c', size: size || r * 1.3, weight: 800, fill: ink, anchor: 'middle' });

const axisLine = (x1, y1, x2, y2, color = G, w = 3, op = 1) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${w}" stroke-dasharray="34 8 4 8" opacity="${op}"/>`;

// трафаретный словесный знак: сплошной текст + «мостики»
function stencil(x, y, size, str, fill, bg, width) {
  return text(x, y, str, { f: 'c', size, weight: 800, fill, extra: `textLength="${width}" lengthAdjust="spacingAndGlyphs"` }) +
    `<rect x="${x - 4}" y="${y - size * 0.42}" width="${width + 8}" height="${size * 0.06}" fill="${bg}"/>`;
}

function tapHandle(cx, top, h, n, { body = G, ink = Y } = {}) {
  return `<rect x="${cx - 28}" y="${top}" width="56" height="${h}" rx="28" fill="${body}"/>` +
    `<rect x="${cx - 10}" y="${top + h}" width="20" height="34" fill="${B}"/>` +
    `<text class="fc" font-size="34" font-weight="800" fill="${ink}" text-anchor="middle" transform="translate(${cx + 12} ${top + h / 2}) rotate(-90)">${n}</text>`;
}

const cover = () => svg({
  w: 1600, h: 1000, slice: true,
  title: 'Гастробар «Нулевой цикл»: ключевой визуал',
  desc: 'Жёлтый кружок оси с нулём на графитовом чертеже, внизу ряд из двенадцати пронумерованных кранов.',
  body: `<rect width="1600" height="1000" fill="${G}"/>` +
    layer(-0.3, rep(5, (i) => axisLine(200 + i * 300, -100, 200 + i * 300, 1100, Y, 2, 0.35)) + axisLine(-100, 300, 1700, 300, Y, 2, 0.35) + rep(5, (i) => axis(200 + i * 300, 80, 36, 'АБВГД'[i], { fill: G, stroke: Y, ink: Y }))) +
    layer(0.18, axis(800, 430, 290, '0', { size: 420 }) + text(800, 800, 'ВХОД СО ДВОРА · 40 М', { f: 'c', size: 46, weight: 500, fill: Y, anchor: 'middle', ls: 6 })) +
    layer(0.45, rep(12, (i) => tapHandle(305 + i * 90, 860 - (i % 3) * 18, 150, String(i + 1).padStart(2, '0'), { body: i === 6 ? Y : '#2E2E2B', ink: i === 6 ? G : Y }))) +
    layer(-0.1, hazard(0, 0, 1600, 26)),
});

const logo = () => svg({
  w: 1200, h: 760,
  title: 'Гастробар «Нулевой цикл»: логотип и знак на листе чертежа',
  desc: 'Жёлтый кружок оси с цифрой ноль и штрихпунктирной линией, справа трафаретная надпись «Нулевой цикл», в углу штамп чертежа.',
  body: `<rect width="1200" height="760" fill="${W}"/>` +
    `<rect x="60" y="24" width="1116" height="712" fill="none" stroke="${G}" stroke-width="3"/>` +
    axisLine(230, 120, 230, 700, G, 2.5) + axisLine(110, 330, 1150, 330, G, 2.5, 0.25) +
    axis(230, 330, 116, '0', { size: 170 }) +
    stencil(400, 374, 132, 'НУЛЕВОЙ ЦИКЛ', G, W, 700) +
    text(404, 430, 'ГАСТРОБАР · 12 КРАНОВ · ЕКАТЕРИНБУРГ', { f: 'c', size: 30, weight: 500, fill: G, ls: 5 }) +
    `<line x1="400" y1="200" x2="1100" y2="200" stroke="${G}"/><line x1="400" y1="192" x2="400" y2="208" stroke="${G}"/><line x1="1100" y1="192" x2="1100" y2="208" stroke="${G}"/>` +
    text(750, 190, '12x — ширина знака', { size: 15, fill: G, anchor: 'middle' }) +
    `<g transform="translate(736 560)"><rect width="440" height="176" fill="${W}" stroke="${G}" stroke-width="3"/>` +
    `<line x1="0" y1="58" x2="440" y2="58" stroke="${G}" stroke-width="2"/><line x1="0" y1="116" x2="440" y2="116" stroke="${G}" stroke-width="2"/><line x1="150" y1="0" x2="150" y2="176" stroke="${G}" stroke-width="2"/><line x1="330" y1="58" x2="330" y2="176" stroke="${G}" stroke-width="2"/>` +
    text(14, 38, 'Лист 01', { f: 'c', size: 24, weight: 500, fill: G }) + text(166, 38, 'Знак и логотип', { f: 'c', size: 26, weight: 800, fill: G }) +
    text(14, 96, 'Масштаб', { f: 'c', size: 22, weight: 500, fill: G }) + text(166, 96, '1:1', { f: 'c', size: 24, weight: 800, fill: G }) + text(344, 96, 'Изм. 3', { f: 'c', size: 22, weight: 500, fill: G }) +
    text(14, 154, 'Бюро', { f: 'c', size: 22, weight: 500, fill: G }) + text(166, 154, 'ФОРМА', { f: 'c', size: 24, weight: 800, fill: G }) + `<rect x="330" y="116" width="110" height="60" fill="${Y}"/>` + text(385, 156, '2024', { f: 'c', size: 24, weight: 800, fill: G, anchor: 'middle' }) +
    `</g>` +
    axis(130, 640, 30, '0', { size: 42 }) + text(176, 648, 'мин. 10 мм', { size: 15, fill: G }),
});

const beers = [
  ['01', 'Котлован', 'светлый лагер', '4,6%', '260', '360'],
  ['02', 'Опалубка', 'пилснер', '5,0%', '280', '380'],
  ['03', 'Арматура', 'IPA', '6,2%', '320', '440'],
  ['04', 'Бетон М300', 'сухой стаут', '5,4%', '310', '420'],
  ['05', 'Нивелир', 'пшеничное', '5,1%', '290', '390'],
  ['06', 'Фундамент', 'красный эль', '5,6%', '300', '410'],
  ['07', 'Отмостка', 'кислый эль', '4,2%', '330', '450'],
  ['08', 'Прораб', 'портер', '6,0%', '310', '420'],
  ['09', 'Сваи', 'гозе', '4,4%', '320', '430'],
  ['10', 'Бытовка', 'сидр', '5,5%', '300', '410'],
  ['11', 'Смена', 'квас, б/а', '0%', '180', '240'],
];

const menu = () => {
  const cols = [70, 150, 470, 690, 840, 990];
  return svg({
    w: 1200, h: 800,
    title: 'Гастробар «Нулевой цикл»: меню-спецификация кранов',
    desc: 'Меню оформлено как таблица спецификации на чертеже: позиция, название, стиль, крепость и цены за 0,3 и 0,5 литра, внизу штамп с дегустационным сетом.',
    body: `<rect width="1200" height="800" fill="${B}"/>` +
      `<rect x="40" y="30" width="1120" height="740" fill="${W}"/>` +
      `<rect x="56" y="46" width="1088" height="708" fill="none" stroke="${G}" stroke-width="2.5"/>` +
      stencil(70, 128, 70, 'СПЕЦИФИКАЦИЯ КРАНОВ', G, W, 640) +
      text(1130, 120, 'Лист 02 · бар', { f: 'c', size: 26, weight: 500, fill: G, anchor: 'end' }) +
      `<rect x="56" y="152" width="1088" height="44" fill="${Y}"/>` +
      ['Поз.', 'Наименование', 'Стиль', 'Крепость', '0,3 л', '0,5 л'].map((h, i) => text(cols[i] + 6, 182, h, { f: 'c', size: 24, weight: 800, fill: G })).join('') +
      beers.map((r, k) => {
        const y = 196 + k * 40;
        return `<line x1="56" y1="${y + 40}" x2="1144" y2="${y + 40}" stroke="${G}" stroke-opacity=".35"/>` +
          r.map((c, i) => text(cols[i] + 6, y + 29, c, { f: i === 1 || i === 0 ? 'c' : 't', size: i === 1 ? 26 : 19, weight: i < 2 ? 800 : 400, fill: G })).join('');
      }).join('') +
      cols.slice(1).map((x) => `<line x1="${x}" y1="152" x2="${x}" y2="636" stroke="${G}" stroke-opacity=".35"/>`).join('') +
      `<g transform="translate(704 640)"><rect width="440" height="114" fill="${G}"/>` +
      text(20, 40, 'СЕТ «НУЛЕВОЙ ЦИКЛ»', { f: 'c', size: 30, weight: 800, fill: Y, ls: 1 }) +
      text(20, 78, '4 крана по 0,1 л на выбор — 450', { size: 20, fill: W }) +
      text(20, 102, 'Номер крана = номер в меню', { size: 15, fill: B }) + `</g>` +
      text(70, 690, 'Кухня до 23:00. Гриль, хлеб, соленья.', { size: 19, fill: G }) +
      text(70, 720, 'Краны меняются по пятницам — смотрите табличку над стойкой.', { size: 17, fill: '#55534D' }),
  });
};

const pack = () => svg({
  w: 1200, h: 800,
  title: 'Гастробар «Нулевой цикл»: краулер, ручка крана и подставка',
  desc: 'Банка-краулер на литр с номером крана 03, графитовая ручка крана с жёлтым номером и круглая подставка со стрелкой «вход со двора».',
  body: `<rect width="1200" height="800" fill="#D8D5CC"/>` +
    `<rect x="120" y="712" width="980" height="12" fill="#000" opacity=".08"/>` +
    `<rect x="160" y="150" width="300" height="560" rx="18" fill="#B7B6B0"/>` +
    `<rect x="160" y="150" width="300" height="34" rx="12" fill="#8E8D88"/><rect x="160" y="676" width="300" height="34" rx="12" fill="#8E8D88"/>` +
    `<rect x="160" y="200" width="300" height="460" fill="${Y}"/>` + hazard(160, 200, 300, 40) +
    text(310, 430, '03', { f: 'c', size: 230, weight: 800, fill: G, anchor: 'middle' }) +
    text(310, 500, 'АРМАТУРА', { f: 'c', size: 46, weight: 800, fill: G, anchor: 'middle', ls: 2 }) +
    text(310, 540, 'IPA · 6,2% · 1 л', { size: 20, fill: G, anchor: 'middle' }) +
    `<rect x="160" y="580" width="300" height="80" fill="${G}"/>` + text(310, 630, 'НУЛЕВОЙ ЦИКЛ', { f: 'c', size: 34, weight: 800, fill: Y, anchor: 'middle', ls: 2 }) +
    `<rect x="420" y="200" width="12" height="460" fill="#fff" opacity=".22"/>` +
    tapHandle(600, 170, 380, '03') + `<rect x="566" y="580" width="68" height="20" rx="4" fill="${B}"/>` +
    `<circle cx="900" cy="470" r="200" fill="${Y}"/><circle cx="900" cy="470" r="200" fill="none" stroke="${G}" stroke-width="4"/>` +
    circleText(900, 470, 168, 'ВХОД СО ДВОРА · 40 МЕТРОВ · ВХОД СО ДВОРА · 40 МЕТРОВ · ', { f: 'c', size: 26, weight: 800, fill: G }) +
    axis(900, 470, 96, '0', { fill: G, stroke: G, ink: Y, size: 140 }) +
    `<rect x="700" y="690" width="400" height="10" fill="#000" opacity=".06"/>`,
});

const facade = () => svg({
  w: 1200, h: 800,
  title: 'Гастробар «Нулевой цикл»: навигация от улицы до входа во дворе',
  desc: 'Фасад с аркой во двор: над аркой жёлтый световой короб со стрелкой, на асфальте жёлтые стрелки и разметка «40 м», у арки столбики в чёрно-жёлтую полоску и стойка со знаком оси.',
  body: `<rect width="1200" height="800" fill="#A8A49B"/>` +
    rep(16, (i) => `<line x1="0" y1="${i * 40}" x2="1200" y2="${i * 40}" stroke="#958F84" stroke-width="2"/>`) +
    rep(3, (i) => `<rect x="${80 + i * 140}" y="70" width="90" height="140" fill="#3B3B38"/><rect x="${80 + i * 140}" y="70" width="90" height="140" fill="none" stroke="${W}" stroke-width="6"/>`) +
    rep(3, (i) => `<rect x="${760 + i * 140}" y="70" width="90" height="140" fill="#3B3B38"/><rect x="${760 + i * 140}" y="70" width="90" height="140" fill="none" stroke="${W}" stroke-width="6"/>`) +
    `<path d="M 480 640 V 400 A 140 140 0 0 1 760 400 V 640 Z" fill="#26261F"/>` +
    `<path d="M 520 640 V 430 A 100 100 0 0 1 720 430 V 640 Z" fill="#3A3A33"/>` +
    `<rect x="560" y="470" width="120" height="170" fill="#4C4C44"/><rect x="584" y="500" width="72" height="90" fill="${Y}" opacity=".85"/>` +
    text(620, 556, '0', { f: 'c', size: 64, weight: 800, fill: G, anchor: 'middle' }) +
    `<rect x="420" y="130" width="400" height="140" fill="${G}"/><rect x="432" y="142" width="376" height="116" fill="${Y}"/>` +
    text(452, 196, 'НУЛЕВОЙ ЦИКЛ', { f: 'c', size: 44, weight: 800, fill: G }) +
    text(452, 238, 'бар во дворе · 40 м', { f: 'c', size: 28, weight: 500, fill: G, ls: 1 }) +
    `<path d="M 724 186 h 30 v -16 l 30 38 l -30 38 v -16 h -30 Z" fill="${G}"/>` +
    `<rect x="0" y="640" width="1200" height="160" fill="#4A4A46"/>` +
    `<rect x="0" y="640" width="1200" height="10" fill="#6A6A64"/>` +
    rep(3, (i) => `<path d="M ${150 + i * 170} 730 h 70 v -16 l 40 30 l -40 30 v -16 h -70 Z" fill="${Y}"/>`) +
    text(700, 760, '40 М', { f: 'c', size: 34, weight: 800, fill: Y }) +
    rep(2, (i) => `<g>${hazard(452 + i * 300, 560, 36, 90, Y, G, 24)}<rect x="${452 + i * 300}" y="552" width="36" height="10" fill="${G}"/></g>`) +
    `<rect x="958" y="400" width="12" height="260" fill="${G}"/>` + axis(964, 380, 62, '0', { size: 92 }) +
    `<rect x="900" y="470" width="128" height="80" fill="${G}"/>` + text(964, 505, 'ВХОД', { f: 'c', size: 26, weight: 800, fill: Y, anchor: 'middle', ls: 2 }) + text(964, 536, 'В АРКУ ←', { f: 'c', size: 22, weight: 500, fill: W, anchor: 'middle', ls: 1 }),
});

export default {
  slug: 'nulevoy-cikl', name: 'Нулевой цикл', kind: 'Гастробар', city: 'Екатеринбург', year: 2024,
  headFont: ['c', 800], fontName: 'Fira Sans Extra Condensed',
  theme: { bg: '#F0BE1C', ink: '#1A1916', muted: '#4A4231' },
  curtain: 'diag',
  scope: 'Имя, айдентика, меню, навигация',
  lead: 'Двенадцать кранов уральского крафта в цоколе бывшего стройтреста. Вход — со двора.',
  task: 'Бар открылся в цоколе бывшего здания стройтреста: вход со двора, с улицы вывески не видно. Меню на 60 позиций гости не дочитывали и просили «что-нибудь светлое». Нужно было привести людей через арку и сделать так, чтобы краны продавали сами себя.',
  done: ['Имя и трафаретный логотип со знаком оси «0»', 'Меню-спецификация: номер крана = номер в меню', 'Ручки кранов, краулеры, подставки', 'Навигация: короб над аркой, стрелки на асфальте, стойка у входа'],
  results: [['+54%', 'гостей с улицы за первые 3 месяца'], ['+17%', 'средний чек'], ['22%', 'продаж — сет «Нулевой цикл»']],
  typePair: ['Fira Sans Extra Condensed', 'Golos Text'],
  palette: [
    { name: 'Сигнальный', hex: '#F0BE1C', role: 'навигация, знак' },
    { name: 'Графит', hex: '#1C1C1A', role: 'фон, текст' },
    { name: 'Бетон', hex: '#9C9A94', role: 'вторичный фон' },
    { name: 'Известь', hex: '#F2F0EA', role: 'меню, бумага' },
  ],
  sheetBg: '#E9E7E1', sheetInk: G, paletteLayout: 'stack',
  cover,
  exhibits: [
    { title: 'Логотип и знак', tech: 'Трафарет, знак оси, штамп чертежа', note: 'Кружок оси с нулём — так на чертежах обозначают отметку фундамента. Трафарет можно нанести краской прямо на бетон, без подрядчика.', frame: '#E9E7E1', art: logo },
    { title: 'Меню-спецификация', tech: 'Ламинированный лист А3, одна краска + жёлтый', note: 'Вместо 60 позиций — 11 кранов в одной таблице. Номер крана совпадает с номером в меню: гость просто называет цифру.', frame: '#9C9A94', art: menu },
    { title: 'Краулер, кран, подставка', tech: 'Банка 1 л, ручка из бука, картон 1,5 мм', note: 'Номер крана живёт на всех носителях. Подставка — ещё один указатель: её уносят домой, и она напоминает, как найти вход.', frame: '#D8D5CC', art: pack },
    { title: 'Навигация', tech: 'Световой короб, краска по асфальту, стойка', note: 'Путь от тротуара до двери — 40 метров. Три стрелки на асфальте и короб над аркой обошлись дешевле одной большой вывески.', frame: '#A8A49B', art: facade },
    { title: 'Цвет и шрифт', tech: 'Палитра, шрифтовая пара', note: 'Сигнальный жёлтый взят со строительной разметки: его замечают даже в сумерках во дворе.', frame: '#E9E7E1', art: null },
  ],
};
