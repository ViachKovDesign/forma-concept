// Общие помощники для генерации SVG-экспонатов и HTML.
let uidCounter = 0;
export const uid = (p = 'u') => `${p}${(++uidCounter).toString(36)}`;
export const resetUid = () => { uidCounter = 0; };

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Обёртка SVG с доступным названием.
 * opts: { w, h, title, desc, body, slice, cls }
 */
export function svg({ w, h, title, desc = '', body, slice = false, cls = '' }) {
  const t = uid('t');
  const d = uid('d');
  return `<svg class="art ${cls}" viewBox="0 0 ${w} ${h}" ${slice ? 'preserveAspectRatio="xMidYMid slice"' : ''} role="img" aria-labelledby="${t}${desc ? ' ' + d : ''}" focusable="false" xmlns="http://www.w3.org/2000/svg"><title id="${t}">${esc(title)}</title>${desc ? `<desc id="${d}">${esc(desc)}</desc>` : ''}${body}</svg>`;
}

// Текст. f: s — антиква (Cormorant), w — широкий гротеск (Unbounded), c — узкий (Fira XC), t — текстовый (Golos)
export function text(x, y, str, { f = 't', size = 24, weight = 400, fill = 'currentColor', anchor = 'start', ls = 0, italic = false, extra = '' } = {}) {
  return `<text x="${x}" y="${y}" class="f${f}" font-size="${size}" font-weight="${weight}" fill="${fill}"${anchor !== 'start' ? ` text-anchor="${anchor}"` : ''}${ls ? ` letter-spacing="${ls}"` : ''}${italic ? ' font-style="italic"' : ''} ${extra}>${esc(str)}</text>`;
}

// Слой для параллакса: depth -1..1 (знак — направление)
export const layer = (depth, body) => `<g class="layer" data-depth="${depth}">${body}</g>`;

// Пунктирная «подводка» между названием и ценой
export const leader = (x1, x2, y, color, op = 0.6) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="2" stroke-dasharray="1 7" stroke-linecap="round" opacity="${op}"/>`;

// Повтор
export const rep = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).join('');

// Круговой текст
export function circleText(cx, cy, r, str, opts = {}) {
  const id = uid('cp');
  const len = Math.round(2 * Math.PI * r * (opts.portion || 0.985));
  return `<defs><path id="${id}" d="M ${cx - r} ${cy} a ${r} ${r} 0 1 1 ${2 * r} 0 a ${r} ${r} 0 1 1 ${-2 * r} 0"/></defs><text class="f${opts.f || 't'}" font-size="${opts.size || 24}" font-weight="${opts.weight || 500}" fill="${opts.fill || 'currentColor'}" ${opts.italic ? 'font-style="italic"' : ''}><textPath href="#${id}" textLength="${len}" lengthAdjust="spacing">${esc(str)}</textPath></text>`;
}

// Палитра и шрифтовая пара — три разных раскладки, чтобы листы не были одинаковыми
export function paletteSheet(b, layout = 'columns') {
  const W = 1200, H = 760;
  const sw = b.palette;
  const [hf, hw, hi] = b.headFont; // семейство, вес, курсив
  let body = `<rect width="${W}" height="${H}" fill="${b.sheetBg}"/>`;
  const ink = b.sheetInk;
  if (layout === 'columns') {
    const colW = 760 / sw.length;
    sw.forEach((c, i) => {
      const x = 60 + i * colW;
      const tall = 420 - i * 40;
      body += `<rect x="${x}" y="${560 - tall}" width="${colW - 12}" height="${tall}" fill="${c.hex}"/>`;
      body += text(x + 14, 600, c.name, { size: 22, weight: 600, fill: ink });
      body += text(x + 14, 630, c.hex.toUpperCase(), { size: 18, fill: ink, extra: 'opacity=".7"' });
      body += text(x + 14, 656, c.role, { size: 16, fill: ink, extra: 'opacity=".7"' });
    });
  } else if (layout === 'circles') {
    sw.forEach((c, i) => {
      const r = 140 - i * 20;
      const cx = 200 + i * 155;
      body += `<circle cx="${cx}" cy="300" r="${r}" fill="${c.hex}" stroke="${ink}" stroke-opacity=".15"/>`;
      body += text(cx - 60, 520, c.name, { size: 22, weight: 600, fill: ink });
      body += text(cx - 60, 548, c.hex.toUpperCase(), { size: 18, fill: ink, extra: 'opacity=".7"' });
      body += text(cx - 60, 574, c.role, { size: 16, fill: ink, extra: 'opacity=".7"' });
    });
  } else {
    // stack — горизонтальные пласты разной толщины
    let y = 60;
    const hs = [190, 120, 80, 50, 30];
    sw.forEach((c, i) => {
      const h = hs[i] || 30;
      body += `<rect x="60" y="${y}" width="760" height="${h}" fill="${c.hex}" stroke="${ink}" stroke-opacity=".12"/>`;
      body += text(840, y + Math.min(h, 60) / 2 + 8, `${c.name} · ${c.hex.toUpperCase()}`, { size: 20, weight: 600, fill: ink });
      y += h + 8;
    });
    body += text(840, y + 30, 'Пропорции пластов = доля цвета', { size: 16, fill: ink, extra: 'opacity=".7"' });
    body += text(840, y + 54, 'на носителях бренда', { size: 16, fill: ink, extra: 'opacity=".7"' });
  }
  // шрифтовая пара
  const x0 = layout === 'stack' ? 60 : 880;
  const y0 = layout === 'stack' ? 600 : 120;
  if (layout === 'stack') {
    body += text(x0, y0 + 60, 'Аа', { f: hf, size: 120, weight: hw, italic: hi, fill: ink });
    body += text(x0 + 200, y0 + 20, b.typePair[0], { size: 20, weight: 600, fill: ink });
    body += text(x0 + 200, y0 + 48, 'заголовки, вывеска', { size: 16, fill: ink, extra: 'opacity=".7"' });
    body += text(x0 + 470, y0 + 60, 'Аа', { f: 't', size: 120, weight: 400, fill: ink });
    body += text(x0 + 660, y0 + 20, b.typePair[1], { size: 20, weight: 600, fill: ink });
    body += text(x0 + 660, y0 + 48, 'меню, цены, состав', { size: 16, fill: ink, extra: 'opacity=".7"' });
  } else {
    body += `<line x1="${x0 - 30}" y1="70" x2="${x0 - 30}" y2="690" stroke="${ink}" stroke-opacity=".2"/>`;
    body += text(x0, y0 + 100, 'Аа', { f: hf, size: 140, weight: hw, italic: hi, fill: ink });
    body += text(x0, y0 + 140, b.typePair[0], { size: 20, weight: 600, fill: ink });
    body += text(x0, y0 + 166, 'заголовки, вывеска', { size: 16, fill: ink, extra: 'opacity=".7"' });
    body += text(x0, y0 + 330, 'Аа', { f: 't', size: 140, weight: 400, fill: ink });
    body += text(x0, y0 + 370, b.typePair[1], { size: 20, weight: 600, fill: ink });
    body += text(x0, y0 + 396, 'меню, цены, состав', { size: 16, fill: ink, extra: 'opacity=".7"' });
  }
  return svg({ w: W, h: H, title: `${b.name}: цветовая палитра и шрифтовая пара`, desc: sw.map((c) => `${c.name} ${c.hex}`).join(', ') + `. Шрифты: ${b.typePair.join(' и ')}.`, body });
}
