import { svg, text, layer, rep } from '../lib.mjs';

const L = '#B9DA45'; // лайм
const G = '#1E201C'; // графит
const W = '#F7F7F2'; // бумага
const S = '#8A8C84'; // сталь

// знак-отвес: нить, колпачок, гранёный груз
function bob(cx, top, s = 1, { fill = L, line = fill, len = 0, lw } = {}) {
  const y = top + len;
  let o = len ? `<line x1="${cx}" y1="${top}" x2="${cx}" y2="${y}" stroke="${line}" stroke-width="${lw || 3 * s}"/>` : '';
  o += `<rect x="${cx - 12 * s}" y="${y}" width="${24 * s}" height="${16 * s}" fill="${fill}"/>`;
  o += `<polygon points="${cx - 44 * s},${y + 16 * s} ${cx + 44 * s},${y + 16 * s} ${cx + 44 * s},${y + 74 * s} ${cx},${y + 150 * s} ${cx - 44 * s},${y + 74 * s}" fill="${fill}"/>`;
  return o;
}

const ticks = (x, y0, y1, step, color, long = 5, dir = 1) => {
  let o = '';
  for (let y = y0, i = 0; y <= y1; y += step, i++) o += `<line x1="${x}" y1="${y}" x2="${x + dir * (i % long === 0 ? 40 : 16)}" y2="${y}" stroke="${color}" stroke-width="2"/>`;
  return o;
};

const cover = () => svg({
  w: 1600, h: 1000, slice: true,
  title: 'Кофейня «Отвес»: ключевой визуал',
  desc: 'Лаймовый отвес на длинной нити опускается к линии нулевого уровня на графитовом фоне, по краям — шкалы, как на линейке.',
  body: `<rect width="1600" height="1000" fill="${G}"/>` +
    layer(-0.3, ticks(330, 0, 1000, 20, L) + ticks(1270, 0, 1000, 20, L, 5, -1) + `<line x1="330" y1="0" x2="330" y2="1000" stroke="${L}" stroke-width="2"/><line x1="1270" y1="0" x2="1270" y2="1000" stroke="${L}" stroke-width="2"/>`) +
    layer(-0.12, `<line x1="0" y1="780" x2="1600" y2="780" stroke="${W}" stroke-width="2" stroke-dasharray="10 10"/>` + text(1250, 766, '±0,000', { f: 'w', size: 22, weight: 500, fill: W, anchor: 'end' }) + `<circle cx="1040" cy="780" r="26" fill="none" stroke="${W}" stroke-width="2"/>`) +
    layer(0.25, bob(1040, -60, 1.7, { len: 330, lw: 4 })) +
    layer(0.05, text(400, 330, 'кофе', { f: 'w', size: 80, weight: 300, fill: W }) + text(400, 420, 'за 40 сек', { f: 'w', size: 80, weight: 800, fill: L })),
});

const logo = () => svg({
  w: 1200, h: 760,
  title: 'Кофейня «Отвес»: вертикальная и горизонтальная версии логотипа',
  desc: 'Слева лаймовая вертикальная полоса с буквами О-Т-В-Е-С столбиком и отвесом внизу, справа знак-отвес и надпись «Отвес» широким гротеском, внизу знак в круге.',
  body: `<rect width="1200" height="760" fill="${W}"/>` +
    rep(13, (i) => `<line x1="${60 + i * 90}" y1="0" x2="${60 + i * 90}" y2="760" stroke="${G}" stroke-opacity=".06"/>`) +
    `<rect x="80" y="40" width="170" height="680" fill="${L}"/>` +
    [...'ОТВЕС'].map((c, i) => text(165, 140 + i * 98, c, { f: 'w', size: 84, weight: 800, fill: G, anchor: 'middle' })).join('') +
    bob(165, 600, 0.62, { fill: G, len: 0 }) +
    `<line x1="330" y1="70" x2="330" y2="700" stroke="${G}" stroke-opacity=".2"/>` +
    text(300, 380, '2,4 м', { size: 15, fill: G, anchor: 'end', extra: 'transform="rotate(-90 300 380)"' }) +
    bob(440, 150, 1, { fill: G, len: 70, lw: 4 }) +
    text(520, 330, 'ОТВЕС', { f: 'w', size: 112, weight: 800, fill: G, ls: -4 }) +
    text(524, 380, 'КОФЕ ПО ОТВЕСУ · НОВОСИБИРСК', { size: 18, weight: 500, fill: G, ls: 3.5 }) +
    `<line x1="400" y1="470" x2="1140" y2="470" stroke="${G}" stroke-opacity=".2"/>` +
    `<circle cx="470" cy="590" r="80" fill="${L}"/>` + bob(470, 520, 0.68, { fill: G, len: 18, lw: 3 }) +
    `<circle cx="680" cy="590" r="80" fill="${G}"/>` + bob(680, 520, 0.68, { fill: L, len: 18, lw: 3 }) +
    text(800, 580, 'Знак отдельно —', { size: 18, fill: G }) + text(800, 606, 'стакан, карта, соцсети', { size: 18, fill: G }),
});

const drinks = [['01', 'Эспрессо', '30 мл', '120'], ['02', 'Американо', '300 мл', '170'], ['03', 'Капучино', '300 мл', '220'], ['04', 'Флэт уайт', '200 мл', '230'], ['05', 'Фильтр дня', '350 мл', '190']];
const menu = () => svg({
  w: 1200, h: 800,
  title: 'Кофейня «Отвес»: меню-табло над стойкой',
  desc: 'Графитовое табло с пятью напитками: крупные лаймовые номера, названия, объём и цена; внизу подсказка «Назовите номер».',
  body: `<rect width="1200" height="800" fill="#2B2E28"/>` +
    `<rect x="40" y="40" width="1120" height="720" fill="${G}"/>` +
    text(90, 112, 'ТАБЛО', { f: 'w', size: 24, weight: 600, fill: S, ls: 6 }) + text(1110, 112, 'цены в рублях', { size: 18, fill: S, anchor: 'end' }) +
    drinks.map(([n, name, v, p], i) => {
      const y = 214 + i * 100;
      return `<line x1="90" y1="${y + 30}" x2="1110" y2="${y + 30}" stroke="${S}" stroke-opacity=".4"/>` +
        text(90, y, n, { f: 'w', size: 64, weight: 800, fill: L }) +
        text(260, y, name, { f: 'w', size: 46, weight: 500, fill: W }) +
        text(830, y, v, { size: 22, fill: S, anchor: 'end' }) +
        text(1110, y, p, { f: 'w', size: 52, weight: 800, fill: W, anchor: 'end' });
    }).join('') +
    `<rect x="90" y="690" width="520" height="44" fill="${L}"/>` +
    text(110, 720, 'Назовите номер — это быстрее', { f: 'w', size: 22, weight: 600, fill: G }) +
    text(1110, 720, '+ сироп 40 · растительное молоко 60', { size: 18, fill: S, anchor: 'end' }),
});

const cup = (x, base, { body = W, line = G, sleeve = null, scale = true }) => {
  const tw = 300, bw = 220, h = 420;
  let o = `<polygon points="${x - tw / 2},${base - h} ${x + tw / 2},${base - h} ${x + bw / 2},${base} ${x - bw / 2},${base}" fill="${body}"/>`;
  o += `<rect x="${x - tw / 2 - 12}" y="${base - h - 30}" width="${tw + 24}" height="34" rx="8" fill="${line}"/><rect x="${x - 50}" y="${base - h - 46}" width="100" height="18" rx="6" fill="${line}"/>`;
  if (sleeve) o += `<polygon points="${x - 141},${base - 300} ${x + 141},${base - 300} ${x + 128},${base - 150} ${x - 128},${base - 150}" fill="${sleeve}"/>`;
  if (scale) {
    o += `<line x1="${x}" y1="${base - h + 10}" x2="${x}" y2="${base - 120}" stroke="${line}" stroke-width="3"/>` + bob(x, base - 122, 0.42, { fill: line });
    [[100, base - 150], [200, base - 250], [300, base - 350]].forEach(([ml, y]) => {
      o += `<line x1="${x - 70}" y1="${y}" x2="${x - 14}" y2="${y}" stroke="${line}" stroke-width="2"/>` + text(x - 76, y + 6, String(ml), { f: 'w', size: 16, weight: 600, fill: line, anchor: 'end' });
    });
    o += text(x + 18, base - 380, 'мл', { f: 'w', size: 16, weight: 600, fill: line });
  }
  return o;
};

const pack = () => svg({
  w: 1200, h: 800,
  title: 'Кофейня «Отвес»: стаканы и карта гостя',
  desc: 'Белый стакан со шкалой объёма и отвесом по центру, графитовый стакан с лаймовым манжетом и карта гостя с отметками-отвесами.',
  body: `<rect width="1200" height="800" fill="#E3E4DE"/>` +
    `<rect x="100" y="700" width="1000" height="12" fill="#000" opacity=".08"/>` +
    cup(300, 700, { body: W, line: G }) +
    cup(660, 700, { body: G, line: '#3A3D36', sleeve: L, scale: false }) +
    text(660, 524, 'ОТВЕС', { f: 'w', size: 40, weight: 800, fill: G, anchor: 'middle' }) +
    `<g transform="translate(870 420) rotate(-8)"><rect width="250" height="160" rx="12" fill="${L}"/>` +
    text(20, 40, 'ОТВЕС', { f: 'w', size: 22, weight: 800, fill: G }) + text(230, 40, 'карта гостя', { size: 13, fill: G, anchor: 'end' }) +
    rep(6, (i) => `<circle cx="${40 + i * 34}" cy="100" r="13" fill="none" stroke="${G}" stroke-width="2"/>` + (i < 4 ? bob(40 + i * 34, 90, 0.13, { fill: G }) : '')) +
    text(20, 144, '6-й кофе — от нас', { size: 13, fill: G }) + `</g>`,
});

const facade = () => svg({
  w: 1200, h: 800,
  title: 'Кофейня «Отвес»: фасад шириной 2,4 метра между соседями',
  desc: 'Три витрины в ряд: серые соседи слева и справа, в центре узкая кофейня с лаймовой вертикальной вывеской во всю высоту этажа и отвесом внизу; под ней размерная линия 2,4 м.',
  body: `<rect width="1200" height="800" fill="#C9CAC4"/>` +
    rep(6, (i) => `<rect x="${60 + i * 190}" y="50" width="120" height="150" fill="#9EA19A"/><rect x="${60 + i * 190}" y="200" width="120" height="10" fill="#E9E9E4"/>`) +
    `<rect x="0" y="260" width="1200" height="400" fill="#B7B8B1"/>` +
    `<rect x="40" y="290" width="400" height="60" fill="#8F928A"/>` + text(240, 330, 'АПТЕКА', { size: 28, weight: 600, fill: '#D9DAD4', anchor: 'middle', ls: 8 }) +
    `<rect x="60" y="380" width="360" height="280" fill="#6E716B"/>` +
    `<rect x="760" y="290" width="400" height="60" fill="#8F928A"/>` + text(960, 330, 'САЛОН СВЯЗИ', { size: 28, weight: 600, fill: '#D9DAD4', anchor: 'middle', ls: 6 }) +
    `<rect x="780" y="380" width="360" height="280" fill="#6E716B"/>` +
    `<rect x="470" y="260" width="260" height="400" fill="${G}"/>` +
    `<rect x="480" y="270" width="96" height="390" fill="${L}"/>` +
    [...'ОТВЕС'].map((c, i) => text(528, 330 + i * 56, c, { f: 'w', size: 46, weight: 800, fill: G, anchor: 'middle' })).join('') +
    bob(528, 590, 0.38, { fill: G, len: 0 }) +
    `<rect x="590" y="300" width="128" height="230" fill="#3A3D36"/><rect x="590" y="540" width="128" height="120" fill="#2C2F29"/>` +
    `<rect x="604" y="560" width="100" height="10" fill="${L}"/>` + text(654, 600, 'вход', { size: 15, fill: W, anchor: 'middle' }) +
    text(654, 330, '01 эспрессо', { f: 'w', size: 11, weight: 500, fill: L, anchor: 'middle' }) + text(654, 352, '02 американо', { f: 'w', size: 11, weight: 500, fill: L, anchor: 'middle' }) + text(654, 374, '03 капучино', { f: 'w', size: 11, weight: 500, fill: L, anchor: 'middle' }) +
    `<rect x="0" y="660" width="1200" height="140" fill="#9A9C95"/>` +
    `<line x1="470" y1="720" x2="730" y2="720" stroke="${G}" stroke-width="2"/><line x1="470" y1="704" x2="470" y2="736" stroke="${G}" stroke-width="2"/><line x1="730" y1="704" x2="730" y2="736" stroke="${G}" stroke-width="2"/>` +
    `<line x1="462" y1="728" x2="478" y2="712" stroke="${G}" stroke-width="2"/><line x1="722" y1="728" x2="738" y2="712" stroke="${G}" stroke-width="2"/>` +
    text(600, 710, '2 400', { f: 'w', size: 20, weight: 600, fill: G, anchor: 'middle' }),
});

export default {
  slug: 'otves', name: 'Отвес', kind: 'Кофейня', city: 'Новосибирск', year: 2025,
  headFont: ['w', 800], fontName: 'Unbounded',
  theme: { bg: '#B9DA45', ink: '#1A1C17', muted: '#3F4A22' },
  curtain: 'iris',
  scope: 'Знак, вывеска, меню-табло, стаканы',
  lead: 'Кофе с собой в витрине шириной 2,4 метра у метро. У бариста 40 секунд на гостя.',
  task: 'Кофейня шириной 2,4 метра зажата между аптекой и салоном связи у метро. Утром на гостя есть 40 секунд, а витрина терялась среди вывесок соседей. Нужен знак, который видно с другой стороны проспекта, и меню, которое читается из очереди.',
  done: ['Знак-отвес и вертикальный логотип во всю высоту этажа', 'Меню-табло: пять напитков с номерами', 'Стаканы со шкалой объёма и манжеты', 'Карта гостя с отметками-отвесами'],
  results: [['−35%', 'время заказа: с 62 до 40 секунд'], ['+210', 'стаканов в будний день'], ['31%', 'гостей пользуются картой']],
  typePair: ['Unbounded', 'Golos Text'],
  palette: [
    { name: 'Лайм', hex: '#B9DA45', role: 'вывеска, акцент' },
    { name: 'Графит', hex: '#1E201C', role: 'табло, стакан' },
    { name: 'Бумага', hex: '#F7F7F2', role: 'стакан, фон' },
    { name: 'Сталь', hex: '#8A8C84', role: 'подписи' },
  ],
  sheetBg: '#F1F2EC', sheetInk: G, paletteLayout: 'circles',
  cover,
  exhibits: [
    { title: 'Логотип и знак', tech: 'Вертикальная и горизонтальная версии', note: 'Отвес — инструмент, который показывает строгую вертикаль. Узкий фасад стал преимуществом: вывеска идёт сверху вниз и читается издалека.', frame: '#ECEDE6', art: logo },
    { title: 'Меню-табло', tech: 'Световой короб 1200 × 800 мм', note: 'Пять напитков вместо двадцати. Номер говорить быстрее, чем «капучино на овсяном»: очередь движется, бариста не переспрашивает.', frame: '#2B2E28', art: menu },
    { title: 'Стаканы и карта', tech: 'Бумажный стакан 300 мл, манжет, карта 85 × 55 мм', note: 'Шкала на стакане показывает объём — гость видит, что платит за 300 мл, а не «за большой».', frame: '#E3E4DE', art: pack },
    { title: 'Фасад', tech: 'Вертикальный световой короб 2,9 м', note: 'Соседи оставлены серыми, чтобы показать, как лаймовая полоса работает на реальной улице. Вывеска видна с другой стороны проспекта — 46 метров.', frame: '#C9CAC4', art: facade },
    { title: 'Цвет и шрифт', tech: 'Палитра, шрифтовая пара', note: 'Лайм — единственный цвет, которого нет ни у одного соседа в радиусе двух кварталов. Мы проверили 38 вывесок.', frame: '#F1F2EC', art: null },
  ],
};
