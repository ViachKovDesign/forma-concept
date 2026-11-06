import { svg, text, layer, rep, uid } from '../lib.mjs';

const R = '#8F1D2C'; // гранат
const V = '#3E5B3A'; // лоза
const O = '#D4A23A'; // охра
const Ch = '#F3ECE4'; // мел
const D = '#2A1416'; // тёмный

const arch = (x, y, w, h) => `M ${x} ${y + h} V ${y + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V ${y + h} Z`;

// детерминированный «случай» для зёрен граната
function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

function pomegranateHalf(cx, cy, r, seed = 7) {
  const rand = rng(seed);
  let o = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${R}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.9}" fill="#F2D6CC"/>`;
  // перегородки
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2 + 0.3;
    o += `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(a) * r * 0.88).toFixed(1)}" y2="${(cy + Math.sin(a) * r * 0.88).toFixed(1)}" stroke="#F8E6DE" stroke-width="${r * 0.05}"/>`;
  }
  const step = r * 0.13;
  for (let y = -r; y <= r; y += step * 0.86) {
    for (let x = -r; x <= r; x += step) {
      const ox = x + ((Math.round(y / (step * 0.86)) % 2) * step) / 2 + (rand() - 0.5) * step * 0.25;
      const oy = y + (rand() - 0.5) * step * 0.25;
      const dist = Math.hypot(ox, oy);
      if (dist > r * 0.8 || dist < r * 0.12) continue;
      const rr = step * (0.38 + rand() * 0.1);
      o += `<ellipse cx="${(cx + ox).toFixed(1)}" cy="${(cy + oy).toFixed(1)}" rx="${rr.toFixed(1)}" ry="${(rr * 1.15).toFixed(1)}" fill="${rand() > 0.15 ? '#B3203A' : '#7E1426'}"/><circle cx="${(cx + ox - rr * 0.3).toFixed(1)}" cy="${(cy + oy - rr * 0.35).toFixed(1)}" r="${(rr * 0.25).toFixed(1)}" fill="#fff" opacity=".55"/>`;
    }
  }
  return o;
}

// рог для вина
const horn = (x, y, s, rot, fill = O) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M 0 0 C 60 -10 150 -40 210 -120 L 230 -104 C 180 -20 90 30 6 34 Z" fill="${fill}"/><path d="M 0 0 L 6 34" stroke="${D}" stroke-width="6"/><circle cx="220" cy="-112" r="9" fill="${D}"/></g>`;

// ромбовый орнамент-кайма
const diamonds = (x, y, n, s, fill) => rep(n, (i) => `<polygon points="${x + i * s * 2},${y} ${x + i * s * 2 + s},${y - s * 0.7} ${x + i * s * 2 + s * 2},${y} ${x + i * s * 2 + s},${y + s * 0.7}" fill="${fill}"/>`);

const cover = () => svg({
  w: 1600, h: 1000, slice: true,
  title: 'Ресторан «Тамада и сын»: ключевой визуал',
  desc: 'Разрезанный гранат в арке окна на гранатовом фоне, два скрещённых рога и надпись «за встречу!».',
  body: `<rect width="1600" height="1000" fill="${R}"/>` +
    layer(-0.3, rep(9, (i) => `<path d="${arch(i * 190 - 60, 120, 150, 900)}" fill="none" stroke="#B0394A" stroke-width="3"/>`)) +
    layer(0.12, `<path d="${arch(530, 120, 540, 900)}" fill="${Ch}"/>` + pomegranateHalf(800, 520, 210, 11) + `<path d="M 780 300 l 8 -34 l 12 22 l 12 -22 l 8 34 Z" fill="${R}"/>`) +
    layer(0.45, horn(1020, 860, 1.3, -10) + `<g transform="translate(580 860) scale(-1 1)">${horn(0, 0, 1.3, -10)}</g>`) +
    layer(-0.1, text(800, 940, 'за встречу!', { f: 's', size: 84, weight: 500, italic: true, fill: Ch, anchor: 'middle' })),
});

const logo = () => svg({
  w: 1200, h: 760,
  title: 'Ресторан «Тамада и сын»: монограмма в арке и надпись',
  desc: 'Слева арка с монограммой «Т и С» курсивной антиквой, справа надпись «Тамада и сын», над ней скрещённые рога, сверху и снизу ромбовый орнамент.',
  body: `<rect width="1200" height="760" fill="${Ch}"/>` +
    diamonds(40, 50, 28, 20, R) + diamonds(40, 710, 28, 20, R) +
    `<path d="${arch(110, 120, 320, 520)}" fill="${R}"/>` + `<path d="${arch(130, 140, 280, 490)}" fill="none" stroke="${O}" stroke-width="3"/>` +
    text(200, 470, 'Т', { f: 's', size: 300, weight: 500, italic: true, fill: Ch, anchor: 'middle' }) +
    text(268, 420, 'и', { f: 's', size: 70, weight: 500, italic: true, fill: O, anchor: 'middle' }) +
    text(338, 560, 'С', { f: 's', size: 300, weight: 500, italic: true, fill: Ch, anchor: 'middle' }) +
    `<circle cx="800" cy="230" r="46" fill="${R}"/><path d="M 784 190 l 5 -22 l 11 14 l 11 -14 l 5 22 Z" fill="${R}"/><path d="M 778 214 a 28 28 0 0 1 22 -12" fill="none" stroke="${Ch}" stroke-width="5" stroke-linecap="round" opacity=".6"/>` +
    text(800, 400, 'Тамада и сын', { f: 's', size: 112, weight: 500, italic: true, fill: R, anchor: 'middle' }) +
    text(800, 452, 'ГРУЗИНСКАЯ КУХНЯ · КАЗАНЬ · С 2009', { size: 18, weight: 500, fill: D, anchor: 'middle', ls: 3.5 }) +
    `<line x1="560" y1="520" x2="1040" y2="520" stroke="${R}" stroke-opacity=".3"/>` +
    text(560, 580, 'Монограмма — для посуды, салфеток, печати на коробках.', { size: 17, fill: D }) +
    text(560, 608, 'Надпись — для фасада, меню и соцсетей.', { size: 17, fill: D }),
});

const toast = (x, y, n, title, items) =>
  text(x, y, n, { size: 14, weight: 600, fill: O, ls: 3 }) +
  text(x, y + 46, title, { f: 's', size: 38, weight: 500, italic: true, fill: R }) +
  items.map(([name, p], i) => text(x, y + 92 + i * 34, name, { size: 18, fill: D }) + text(x + 440, y + 92 + i * 34, p, { size: 18, weight: 600, fill: D, anchor: 'end' })).join('');

const menu = () => svg({
  w: 1200, h: 800,
  title: 'Ресторан «Тамада и сын»: меню по тостам',
  desc: 'Разворот меню, где разделы названы тостами: «за встречу» — закуски, «за хозяев» — хинкали, «за тех, кто в пути» — обед за 40 минут, «за детей» — десерты.',
  body: `<rect width="1200" height="800" fill="#5E1520"/>` +
    `<rect x="70" y="50" width="1060" height="700" fill="${Ch}"/>` +
    `<line x1="600" y1="50" x2="600" y2="750" stroke="${R}" stroke-opacity=".25"/>` +
    diamonds(90, 82, 25, 10, R) + diamonds(90, 718, 25, 10, R) +
    toast(120, 140, 'ПЕРВЫЙ ТОСТ', 'за встречу', [['Пхали, три вида', '520'], ['Аджапсандали', '460'], ['Сулугуни на кеци', '490']]) +
    toast(120, 430, 'ВТОРОЙ ТОСТ', 'за хозяев', [['Хинкали с говядиной, 5 шт.', '450'], ['Хинкали с бараниной, 5 шт.', '520'], ['Хинкали с грибами, 5 шт.', '420']]) +
    text(650, 154, 'ТРЕТИЙ ТОСТ', { size: 14, weight: 600, fill: O, ls: 3 }) +
    text(650, 200, 'за тех, кто в пути', { f: 's', size: 38, weight: 500, italic: true, fill: R }) +
    `<path d="${arch(700, 222, 340, 270)}" fill="${R}"/>` +
    text(870, 350, 'Обед за 40 минут', { f: 's', size: 38, weight: 600, italic: true, fill: Ch, anchor: 'middle' }) +
    text(870, 386, 'суп · 3 хинкали · лимонад', { size: 17, fill: Ch, anchor: 'middle' }) +
    text(870, 448, '590', { f: 's', size: 50, weight: 600, fill: O, anchor: 'middle' }) +
    text(870, 516, 'пн–пт, 12:00–16:00', { size: 16, fill: D, anchor: 'middle' }) +
    toast(650, 556, 'ЧЕТВЁРТЫЙ ТОСТ', 'за детей', [['Пеламуши', '290'], ['Чурчхела с орехом', '220']]),
});

const pack = () => {
  const id = uid('box');
  return svg({
    w: 1200, h: 800,
    title: 'Ресторан «Тамада и сын»: коробка для хинкали и пакет навынос',
    desc: 'Квадратная гранатовая коробка с арочным окном и монограммой, по крышке рассыпан узор из зёрен граната; рядом светлый пакет с аркой и надписью.',
    body: `<rect width="1200" height="800" fill="#E6DCD2"/>` +
      `<defs><pattern id="${id}" width="56" height="56" patternUnits="userSpaceOnUse"><ellipse cx="14" cy="14" rx="6" ry="7" fill="#A92B3C"/><ellipse cx="42" cy="42" rx="6" ry="7" fill="#A92B3C"/></pattern></defs>` +
      `<rect x="96" y="176" width="480" height="480" fill="#000" opacity=".1"/>` +
      `<rect x="80" y="160" width="480" height="480" fill="${R}"/><rect x="80" y="160" width="480" height="480" fill="url(#${id})"/>` +
      `<path d="${arch(210, 230, 220, 330)}" fill="${Ch}"/>` +
      text(290, 470, 'Т', { f: 's', size: 150, weight: 500, italic: true, fill: R, anchor: 'middle' }) + text(352, 506, 'С', { f: 's', size: 150, weight: 500, italic: true, fill: R, anchor: 'middle' }) +
      text(320, 600, 'ХИНКАЛИ · ОСТОРОЖНО, ГОРЯЧО', { size: 14, weight: 600, fill: Ch, anchor: 'middle', ls: 2.5 }) +
      `<rect x="684" y="236" width="400" height="460" fill="#000" opacity=".08"/>` +
      `<polygon points="680,230 1080,230 1080,690 680,690" fill="${Ch}"/><polygon points="680,230 1080,230 1060,260 700,260" fill="#E8DED3"/>` +
      `<path d="M 800 230 C 800 140 960 140 960 230" fill="none" stroke="${R}" stroke-width="10"/>` +
      `<path d="${arch(790, 320, 180, 260)}" fill="none" stroke="${R}" stroke-width="5"/>` +
      text(880, 520, 'Т&С', { f: 's', size: 70, weight: 500, italic: true, fill: R, anchor: 'middle' }) +
      text(880, 640, 'Тамада и сын', { f: 's', size: 40, weight: 500, italic: true, fill: R, anchor: 'middle' }) +
      diamonds(700, 670, 9, 10, O),
  });
};

const facade = () => {
  const glow = uid('glow');
  return svg({
    w: 1200, h: 800,
    title: 'Ресторан «Тамада и сын»: вечерний фасад',
    desc: 'Старый казанский дом вечером: три арочных окна с тёплым светом и длинным столом внутри, над центральной аркой светящаяся надпись «Тамада и сын», на втором этаже резной зелёный балкон.',
    body: `<defs><filter id="${glow}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="6"/></filter></defs>` +
      `<rect width="1200" height="800" fill="#23263A"/>` +
      `<rect x="40" y="90" width="1120" height="610" fill="#C9AE84"/>` +
      `<rect x="40" y="80" width="1120" height="24" fill="#B49971"/>` +
      rep(5, (i) => `<rect x="${110 + i * 210}" y="150" width="110" height="150" fill="#3B3247"/><rect x="${104 + i * 210}" y="140" width="122" height="14" fill="#E5D4B6"/>`) +
      `<rect x="300" y="310" width="600" height="20" fill="${V}"/>` +
      rep(20, (i) => `<rect x="${306 + i * 30}" y="250" width="8" height="60" fill="${V}"/>`) + `<rect x="300" y="240" width="600" height="14" fill="${V}"/>` +
      rep(10, (i) => `<polygon points="${315 + i * 60},270 ${330 + i * 60},255 ${345 + i * 60},270 ${330 + i * 60},285" fill="none" stroke="#5E8257" stroke-width="3"/>`) +
      rep(3, (i) => `<path d="${arch(150 + i * 330, 400, 240, 300)}" fill="#F2C46B"/>` +
        `<rect x="${170 + i * 330}" y="610" width="200" height="16" fill="#6B3A22"/>` + rep(4, (k) => `<circle cx="${190 + i * 330 + k * 54}" cy="590" r="18" fill="#4A2A20"/>`) +
        `<path d="${arch(150 + i * 330, 400, 240, 300)}" fill="none" stroke="#E5D4B6" stroke-width="10"/>`) +
      `<g filter="url(#${glow})">${text(600, 382, 'Тамада и сын', { f: 's', size: 60, weight: 600, italic: true, fill: '#FF5A6E', anchor: 'middle' })}</g>` +
      text(600, 382, 'Тамада и сын', { f: 's', size: 60, weight: 600, italic: true, fill: '#FFD3D8', anchor: 'middle' }) +
      `<rect x="0" y="700" width="1200" height="100" fill="#3A3B48"/><rect x="0" y="700" width="1200" height="6" fill="#55566A"/>` +
      `<rect x="40" y="320" width="1120" height="8" fill="#B49971"/>`,
  });
};

export default {
  slug: 'tamada-i-syn', name: 'Тамада и сын', kind: 'Грузинский ресторан', city: 'Казань', year: 2023,
  headFont: ['s', 500, true], fontName: 'Cormorant Italic',
  theme: { bg: '#8F1D2C', ink: '#F7EEE8', muted: '#E3C2BE' },
  plateInvert: true,
  curtain: 'center',
  scope: 'Айдентика, меню, упаковка, фасад',
  lead: 'Семейный ресторан на 120 мест: отец ведёт зал, сын стоит на кухне.',
  task: 'Ресторан на 120 мест знали как место для дней рождения: в выходные зал полный, в будни — полупустой. Нужно было показать, что «Тамада» — это и обед на сорок минут, и доставка, не потеряв тепла семейного дела.',
  done: ['Монограмма «Т и С» в арке и надпись курсивной антиквой', 'Меню по тостам с отдельным обеденным предложением', 'Коробка для хинкали и пакет для доставки', 'Светящаяся надпись на фасаде и подсветка арок'],
  results: [['+46%', 'гостей в будний обед'], ['18%', 'выручки — доставка'], ['+12%', 'средний чек банкета']],
  typePair: ['Cormorant Italic', 'Golos Text'],
  palette: [
    { name: 'Гранат', hex: '#8F1D2C', role: 'основной' },
    { name: 'Мел', hex: '#F3ECE4', role: 'фон, бумага' },
    { name: 'Охра', hex: '#D4A23A', role: 'орнамент' },
    { name: 'Лоза', hex: '#3E5B3A', role: 'дерево, балкон' },
  ],
  sheetBg: '#F6F1EB', sheetInk: D, paletteLayout: 'circles',
  cover,
  exhibits: [
    { title: 'Монограмма и надпись', tech: 'Арка, курсивная антиква, орнамент', note: 'Арка повторяет окна самого здания — дома конца XIX века. Монограмма помещается на дно тарелки и на печать сургучом для подарочных наборов.', frame: '#EFE7DE', art: logo },
    { title: 'Меню по тостам', tech: 'Разворот 2 × А4, мелованная бумага', note: 'Разделы названы тостами — так меню рассказывает о застолье. Обеденное предложение стоит на самом видном месте правой полосы.', frame: '#5E1520', art: menu },
    { title: 'Коробка и пакет', tech: 'Микрогофрокартон, крафт с печатью в одну краску', note: 'Хинкали едут в коробке с окном-аркой: её узнают на столе в офисе, и это лучшая реклама доставки.', frame: '#E6DCD2', art: pack },
    { title: 'Фасад вечером', tech: 'Гибкий неон, подсветка арок', note: 'Светящаяся надпись читается с перекрёстка, а тёплый свет в арках показывает длинный стол — главный повод зайти.', frame: '#23263A', art: facade },
    { title: 'Цвет и шрифт', tech: 'Палитра, шрифтовая пара', note: 'Гранатовый — цвет зёрен и вина. Охра появляется только в орнаменте, лоза — только в дереве.', frame: '#F6F1EB', art: null },
  ],
};
