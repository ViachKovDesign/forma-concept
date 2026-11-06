// Копирует зависимости из node_modules в /vendor (точные версии — в package.json).
import { cpSync, mkdirSync } from 'node:fs';
const nm = 'node_modules/';
const out = 'vendor/';
const copy = (from, to) => { mkdirSync(out + to.split('/').slice(0, -1).join('/'), { recursive: true }); cpSync(nm + from, out + to); };
copy('gsap/dist/gsap.min.js', 'gsap-3.15.1/gsap.min.js');
copy('gsap/dist/ScrollTrigger.min.js', 'gsap-3.15.1/ScrollTrigger.min.js');
copy('lenis/dist/lenis.min.js', 'lenis-1.3.27/lenis.min.js');
copy('lenis/dist/lenis.css', 'lenis-1.3.27/lenis.css');
const fonts = [
  ['@fontsource-variable/unbounded/files/unbounded-cyrillic-wght-normal.woff2', 'unbounded-cyrillic.woff2'],
  ['@fontsource-variable/unbounded/files/unbounded-latin-wght-normal.woff2', 'unbounded-latin.woff2'],
  ['@fontsource-variable/cormorant/files/cormorant-cyrillic-wght-normal.woff2', 'cormorant-cyrillic.woff2'],
  ['@fontsource-variable/cormorant/files/cormorant-latin-wght-normal.woff2', 'cormorant-latin.woff2'],
  ['@fontsource-variable/cormorant/files/cormorant-cyrillic-wght-italic.woff2', 'cormorant-cyrillic-italic.woff2'],
  ['@fontsource-variable/cormorant/files/cormorant-latin-wght-italic.woff2', 'cormorant-latin-italic.woff2'],
  ['@fontsource-variable/golos-text/files/golos-text-cyrillic-wght-normal.woff2', 'golos-cyrillic.woff2'],
  ['@fontsource-variable/golos-text/files/golos-text-latin-wght-normal.woff2', 'golos-latin.woff2'],
];
for (const w of [300, 500, 800]) for (const s of ['cyrillic', 'latin'])
  fonts.push([`@fontsource/fira-sans-extra-condensed/files/fira-sans-extra-condensed-${s}-${w}-normal.woff2`, `firaxc-${s}-${w}.woff2`]);
for (const [from, to] of fonts) copy(from, 'fonts/' + to);
for (const lic of ['gsap/README.md']) {}
console.log('vendor ok');
