import { svg, text, layer, rep, uid } from '../lib.mjs';

const T = '#1FA3A0'; // бирюза
const Rb = '#E2486E'; // малина
const Wh = '#FBF9F6'; // глазурь
const Dk = '#0F2E2D'; // тёмная бирюза
const Dough = '#E7C08A'; // тесто

export const fillings = [
  ['Фисташка', '#9DBF5E'], ['Малина', '#E2486E'], ['Солёная карамель', '#D9913A'], ['Ваниль', '#F3E3B5'],
  ['Шоколад 70%', '#5A3426'], ['Облепиха', '#F0A12A'], ['Смородина', '#5B2A55'], ['Кофе', '#9A6B4A'],
  ['Матча', '#7FA65A'], ['Лимон', '#F2D64B'], ['Манго', '#F4B33D'], ['Кокос', '#F4F1EA'],
];

// заварное пирожное шу (вид сверху/сбоку) с кремом-«шапочкой»
function choux(cx, cy, r, cream = Rb) {
  const f = (v) => v.toFixed(1);
  let o = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${Dough}"/>` +
    `<path d="M ${f(cx - r)} ${cy} A ${r} ${r} 0 0 0 ${f(cx + r)} ${cy} A ${r} ${f(r * 0.55)} 0 0 1 ${f(cx - r)} ${cy} Z" fill="#CF9C5C"/>` +
    `<path d="M ${f(cx - r * 0.62)} ${f(cy - r * 0.28)} A ${f(r * 0.7)} ${f(r * 0.7)} 0 0 1 ${f(cx - r * 0.05)} ${f(cy - r * 0.66)}" fill="none" stroke="#F6DDB0" stroke-width="${f(r * 0.12)}" stroke-linecap="round"/>`;
  // кракелин — точки сеткой
  for (const [dx, dy] of [[-0.35, 0.05], [0.05, -0.25], [0.4, -0.05], [-0.1, 0.32], [0.3, 0.3]]) o += `<circle cx="${f(cx + dx * r)}" cy="${f(cy + dy * r)}" r="${f(r * 0.07)}" fill="#B98448" opacity=".7"/>`;
  return o + `<ellipse cx="${cx}" cy="${f(cy - r * 0.86)}" rx="${f(r * 0.42)}" ry="${f(r * 0.24)}" fill="${cream}"/>`;
}

// эклер с глазурью (вертикальный) — «палочка» восклицательного знака
function eclair(x, y, w, h, glaze = Rb) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w / 2}" fill="${Dough}"/>` +
    `<path d="M ${x + w * 0.1} ${y + w * 0.5} A ${w * 0.4} ${w * 0.4} 0 0 1 ${x + w * 0.9} ${y + w * 0.5} V ${y + h - w * 0.5} q ${-w * 0.1} ${w * 0.25} ${-w * 0.2} 0 q ${-w * 0.1} ${w * 0.35} ${-w * 0.2} 0 q ${-w * 0.1} ${w * 0.2} ${-w * 0.2} 0 q ${-w * 0.1} ${w * 0.3} ${-w * 0.2} 0 Z" fill="${glaze}"/>` +
    rep(4, (i) => `<circle cx="${x + w * (0.3 + (i % 2) * 0.35)}" cy="${y + w * 0.9 + i * (h / 5)}" r="${w * 0.05}" fill="${Wh}" opacity=".8"/>`);
}

const bang = (x, y, s, glaze = Rb) => eclair(x, y, 90 * s, 300 * s, glaze) + choux(x + 45 * s, y + 390 * s, 52 * s, glaze);

const cover = () => svg({
  w: 1600, h: 1000, slice: true,
  title: 'Кондитерская «Шу!»: ключевой визуал',
  desc: 'Бирюзовый фон в горошек из пирожных, огромный восклицательный знак из малинового эклера и пирожного шу, рядом надпись «ШУ» и пирожные с разными начинками.',
  body: `<rect width="1600" height="1000" fill="${T}"/>` +
    layer(-0.3, rep(10, (r) => rep(14, (c) => `<circle cx="${c * 120 + (r % 2) * 60}" cy="${r * 110}" r="22" fill="#33B5B1"/>`))) +
    layer(0.12, text(330, 640, 'ШУ', { f: 'w', size: 290, weight: 800, fill: Wh, ls: -14 })) +
    layer(0.3, bang(1010, 170, 1.3)) +
    layer(0.5, choux(1260, 760, 70, fillings[0][1]) + choux(420, 830, 60, fillings[2][1]) + choux(1180, 300, 48, fillings[9][1]) + choux(560, 230, 40, fillings[6][1])),
});

const logo = () => svg({
  w: 1200, h: 760,
  title: 'Кондитерская «Шу!»: логотип, где восклицательный знак — эклер и пирожное',
  desc: 'Надпись «ШУ» широким гротеском, восклицательный знак из малинового эклера и круглого пирожного шу; внизу знак в бирюзовом круге и строчная версия.',
  body: `<rect width="1200" height="760" fill="${Wh}"/>` +
    text(120, 400, 'ШУ', { f: 'w', size: 240, weight: 800, fill: Dk, ls: -10 }) +
    bang(690, 91, 0.7) +
    text(124, 470, 'КОНДИТЕРСКАЯ · ЭКЛЕРЫ И ШУ · НИЖНИЙ НОВГОРОД', { size: 18, weight: 500, fill: Dk, ls: 3 }) +
    `<line x1="150" y1="560" x2="1050" y2="560" stroke="${Dk}" stroke-opacity=".15"/>` +
    `<circle cx="230" cy="650" r="70" fill="${T}"/>` + bang(209, 590, 0.21, Wh) +
    `<circle cx="410" cy="650" r="70" fill="${Rb}"/>` + bang(389, 590, 0.21, Wh) +
    text(520, 662, 'шу!', { f: 'w', size: 54, weight: 800, fill: T }) +
    text(720, 640, 'Знак без надписи —', { size: 17, fill: Dk }) + text(720, 666, 'для ленты, наклейки, фартука', { size: 17, fill: Dk }),
});

const menu = () => svg({
  w: 1200, h: 800,
  title: 'Кондитерская «Шу!»: карта начинок',
  desc: 'Двенадцать пирожных шу сеткой четыре на три, у каждого свой цвет крема и подпись начинки; справа цены на коробки на 6 и 12 штук.',
  body: `<rect width="1200" height="800" fill="${Dk}"/>` +
    `<rect x="40" y="40" width="1120" height="720" rx="28" fill="${Wh}"/>` +
    text(90, 130, '12 начинок', { f: 'w', size: 60, weight: 800, fill: Dk, ls: -2 }) +
    text(92, 168, 'Цвет крема на шу = цвет начинки. Выбирайте глазами.', { size: 18, fill: '#3C5A58' }) +
    fillings.map(([name, c], i) => {
      const x = 150 + (i % 4) * 190, y = 290 + Math.floor(i / 4) * 160;
      return choux(x, y, 46, c) + text(x, y + 82, name, { size: 16, weight: 500, fill: Dk, anchor: 'middle' });
    }).join('') +
    `<rect x="880" y="220" width="240" height="480" rx="20" fill="${T}"/>` +
    text(900, 270, 'ШУ ШТУЧНО', { f: 'w', size: 18, weight: 700, fill: Dk }) + text(900, 316, '190', { f: 'w', size: 44, weight: 800, fill: Wh }) +
    text(900, 400, 'КОРОБКА НА 6', { f: 'w', size: 18, weight: 700, fill: Dk }) + text(900, 446, '1 090', { f: 'w', size: 44, weight: 800, fill: Wh }) +
    text(900, 530, 'КОРОБКА НА 12', { f: 'w', size: 18, weight: 700, fill: Dk }) + text(900, 576, '2 090', { f: 'w', size: 44, weight: 800, fill: Wh }) +
    text(900, 650, 'лента в подарок', { size: 16, fill: Dk }),
});

const pack = () => {
  const dots = uid('dots');
  return svg({
    w: 1200, h: 800,
    title: 'Кондитерская «Шу!»: подарочная коробка на 6 и пакет',
    desc: 'Бирюзовая коробка, вид сверху: в окне шесть пирожных разных цветов, через угол малиновая лента-наклейка «Шу!»; рядом белый пакет в бирюзовый горошек.',
    body: `<rect width="1200" height="800" fill="#D7ECEA"/>` +
      `<defs><pattern id="${dots}" width="44" height="44" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="8" fill="${T}"/><circle cx="33" cy="33" r="8" fill="${T}"/></pattern></defs>` +
      `<rect x="96" y="166" width="560" height="460" rx="14" fill="#000" opacity=".1"/>` +
      `<rect x="80" y="150" width="560" height="460" rx="14" fill="${T}"/>` +
      `<rect x="140" y="220" width="440" height="300" rx="24" fill="${Wh}"/>` +
      rep(6, (i) => choux(220 + (i % 3) * 140, 300 + Math.floor(i / 3) * 140, 50, fillings[[0, 1, 2, 5, 6, 9][i]][1])) +
      `<rect x="140" y="220" width="440" height="300" rx="24" fill="none" stroke="${Dk}" stroke-opacity=".15" stroke-width="4"/>` +
      text(140, 572, 'ШУ!', { f: 'w', size: 40, weight: 800, fill: Wh }) + text(580, 572, '6 штук · хранить 48 ч', { size: 16, fill: Dk, anchor: 'end' }) +
      `<g transform="translate(560 150) rotate(45)"><rect x="-30" y="-20" width="160" height="56" fill="${Rb}"/>` + text(50, 18, 'ШУ!', { f: 'w', size: 26, weight: 800, fill: Wh, anchor: 'middle' }) + `</g>` +
      `<rect x="770" y="250" width="320" height="420" fill="${Wh}"/><rect x="770" y="250" width="320" height="420" fill="url(#${dots})" opacity=".9"/>` +
      `<rect x="830" y="380" width="200" height="160" rx="80" fill="${Wh}"/>` + text(930, 482, 'ШУ!', { f: 'w', size: 50, weight: 800, fill: Rb, anchor: 'middle' }) +
      `<path d="M 860 250 C 860 170 1000 170 1000 250" fill="none" stroke="${Rb}" stroke-width="12"/>` +
      `<rect x="770" y="670" width="320" height="10" fill="#000" opacity=".06"/>`,
  });
};

const facade = () => svg({
  w: 1200, h: 800,
  title: 'Кондитерская «Шу!»: витрина и вывеска-«капсула»',
  desc: 'Фасад в белой плитке, над витриной бирюзовая вывеска-капсула с надписью «Шу!», в витрине трёхъярусная стойка с цветными пирожными, малиновая дверь и круглый кронштейн с восклицательным знаком.',
  body: `<rect width="1200" height="800" fill="#E8E4DE"/>` +
    rep(30, (i) => `<line x1="${i * 40}" y1="200" x2="${i * 40}" y2="660" stroke="#D5D0C8" stroke-width="2"/>`) + rep(12, (i) => `<line x1="0" y1="${200 + i * 40}" x2="1200" y2="${200 + i * 40}" stroke="#D5D0C8" stroke-width="2"/>`) +
    `<rect x="0" y="0" width="1200" height="200" fill="#C5D3D1"/>` + rep(5, (i) => `<rect x="${60 + i * 240}" y="40" width="140" height="120" fill="#8DA6A4"/>`) +
    `<rect x="160" y="230" width="640" height="130" rx="65" fill="${T}"/>` +
    text(480, 330, 'ШУ!', { f: 'w', size: 96, weight: 800, fill: Wh, anchor: 'middle', ls: -2 }) +
    `<rect x="160" y="400" width="640" height="260" rx="10" fill="${Dk}"/><rect x="176" y="416" width="608" height="244" rx="4" fill="#1B4644"/>` +
    `<rect x="470" y="440" width="20" height="220" fill="${Wh}"/>` +
    [[600, 470, 170], [640, 540, 250], [660, 616, 330]].map(([, y, w], k) => `<rect x="${480 - w / 2}" y="${y}" width="${w}" height="10" rx="5" fill="${Wh}"/>` + rep(Math.round(w / 50), (i) => choux(480 - w / 2 + 25 + i * 50, y - 22, 18, fillings[(i + k * 3) % 12][1]))).join('') +
    rep(4, (i) => `<rect x="${600 + (i % 2) * 90}" y="${450 + Math.floor(i / 2) * 100}" width="70" height="50" rx="6" fill="${Wh}"/>` + text(635 + (i % 2) * 90, 482 + Math.floor(i / 2) * 100, '190', { f: 'w', size: 18, weight: 800, fill: Dk, anchor: 'middle' })) +
    `<rect x="850" y="380" width="160" height="280" rx="80" fill="${Rb}"/><rect x="876" y="410" width="108" height="140" rx="54" fill="#F59AB0"/><circle cx="986" cy="590" r="8" fill="${Wh}"/>` +
    `<path d="M 1060 260 h 100 M 1072 260 q 30 40 70 0" stroke="${Dk}" stroke-width="6" fill="none"/><rect x="1108" y="260" width="4" height="30" fill="${Dk}"/>` +
    `<circle cx="1110" cy="350" r="62" fill="${T}"/>` + bang(1098, 296, 0.22, Wh) +
    `<rect x="0" y="660" width="1200" height="140" fill="#B9B4AC"/><rect x="0" y="660" width="1200" height="8" fill="#9F9A92"/>`,
});

export default {
  slug: 'shu', name: 'Шу!', kind: 'Кондитерская', city: 'Нижний Новгород', year: 2025,
  headFont: ['w', 800], fontName: 'Unbounded',
  theme: { bg: '#1FA3A0', ink: '#061514', muted: '#0E2A29' },
  plateInvert: true,
  curtain: 'down',
  scope: 'Логотип, карта начинок, коробки, вывеска',
  lead: 'Эклеры и заварные пирожные с двенадцатью начинками. Половина покупок — на подарок.',
  task: 'Кондитерская делает эклеры и шу с двенадцатью начинками, но коробки ничем не отличались от торта из супермаркета, и подарочные покупки уходили к конкурентам. Нужно было, чтобы коробка сама стала подарком, а на витрине было легко выбрать начинку.',
  done: ['Логотип, где восклицательный знак — эклер и шу', 'Цветовой код двенадцати начинок', 'Подарочная коробка с окном, лента-наклейка, пакет', 'Вывеска-капсула, ценники и кронштейн'],
  results: [['34%', 'выручки — подарочные коробки'], ['+28%', 'повторных покупок'], ['1 900', 'отметок в соцсетях за полгода']],
  typePair: ['Unbounded', 'Golos Text'],
  palette: [
    { name: 'Бирюза', hex: '#1FA3A0', role: 'коробка, вывеска' },
    { name: 'Малина', hex: '#E2486E', role: 'лента, акцент' },
    { name: 'Глазурь', hex: '#FBF9F6', role: 'фон' },
    { name: 'Глубина', hex: '#0F2E2D', role: 'текст' },
    { name: 'Тесто', hex: '#E7C08A', role: 'иллюстрации' },
  ],
  sheetBg: '#F4F8F7', sheetInk: Dk, paletteLayout: 'columns',
  cover,
  exhibits: [
    { title: 'Логотип и знак', tech: 'Широкий гротеск, знак из пирожных', note: 'Восклицательный знак собран из двух главных продуктов. Короткое имя читается как удивление — именно это гость говорит, открывая коробку.', frame: '#F1EEE9', art: logo },
    { title: 'Карта начинок', tech: 'Настольная карта и ценники на витрину', note: 'Каждой начинке — свой цвет крема. Код повторяется на витрине и в приложении доставки, поэтому выбрать можно, не читая.', frame: '#0F2E2D', art: menu },
    { title: 'Коробка и пакет', tech: 'Картон 400 г, окно из ПЭТ, лента-наклейка', note: 'Коробку не нужно перевязывать: лента-наклейка закрывает её и сразу делает подарочной. Упаковка занимает 20 секунд вместо двух минут.', frame: '#D7ECEA', art: pack },
    { title: 'Витрина и вывеска', tech: 'Световой короб-капсула, кронштейн', note: 'Капсула повторяет форму эклера. Пирожные стоят на ярусах по цветам начинок — витрина работает как меню.', frame: '#E8E4DE', art: facade },
    { title: 'Цвет и шрифт', tech: 'Палитра, шрифтовая пара', note: 'Бирюза — редкий цвет в кондитерских, где обычно розовый и золото. Малина появляется только на ленте и в знаке.', frame: '#F4F8F7', art: null },
  ],
};
