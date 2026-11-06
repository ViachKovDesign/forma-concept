/* ФОРМА — поведение сайта.
   Порядок: тема и счётчик залов (работают без GSAP) → курсор → переходы → форма →
   плавный скролл, шторки и параллакс (только если есть GSAP и не включено «уменьшить движение»). */
(() => {
  'use strict';
  const d = document;
  const html = d.documentElement;
  window.__formaReady = true;
  html.classList.remove('js-fail');

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const gsap = window.gsap;
  const ST = window.ScrollTrigger;
  const motion = !!(gsap && ST) && !reduce;
  if (!motion) html.classList.add('is-static');

  const $ = (s, r = d) => r.querySelector(s);
  const $$ = (s, r = d) => Array.from(r.querySelectorAll(s));

  /* ---------- Тема: фон окрашивается цветом кейса, пока он на экране ---------- */
  const themed = $$('[data-bg]');
  const hall = $('.hall');
  const setTheme = (el) => {
    html.style.setProperty('--bg', el.dataset.bg);
    html.style.setProperty('--ink', el.dataset.ink);
    html.style.setProperty('--muted', el.dataset.muted);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = el.dataset.bg;
    if (hall && el.dataset.hall) {
      const [num, name] = el.dataset.hall.split('|');
      hall.innerHTML = num.includes('/') ? `<span>Зал</span> <b>${num.split('/')[0]}</b><span>/ ${num.split('/')[1]}</span> <span class="hall__name">${name || ''}</span>` : `<b>${num}</b> <span class="hall__name">${name || ''}</span>`;
    }
  };
  if (themed.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setTheme(e.target); });
    }, { rootMargin: '-50% 0px -50% 0px' });
    themed.forEach((el) => io.observe(el));
  }

  /* ---------- Курсор ---------- */
  const cursor = $('.cursor');
  if (cursor && fine) {
    html.classList.add('has-cursor');
    let shown = false;
    const setPos = gsap && !reduce
      ? (() => { const xTo = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3' }); const yTo = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3' }); return (x, y) => { xTo(x); yTo(y); }; })()
      : (x, y) => { cursor.style.transform = `translate(${x}px, ${y}px)`; };
    cursor.classList.add('is-hidden');
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      if (!shown) { shown = true; cursor.classList.remove('is-hidden'); if (gsap) gsap.set(cursor, { x: e.clientX, y: e.clientY }); }
      setPos(e.clientX, e.clientY);
    }, { passive: true });
    d.addEventListener('pointerleave', () => { cursor.classList.add('is-hidden'); shown = false; });
    d.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cursor], a, button, input, textarea, select, label');
      cursor.classList.remove('is-open', 'is-link');
      if (!t) return;
      if (t.matches('input, textarea, select')) { cursor.classList.add('is-hidden'); return; }
      cursor.classList.remove('is-hidden');
      if (t.dataset.cursor === 'open') cursor.classList.add('is-open');
      else cursor.classList.add('is-link');
    });
  }

  /* ---------- Переход «обложка → страница кейса» ---------- */
  const crossDocVT = 'onpageswap' in window && typeof d.startViewTransition === 'function';
  const clearNames = () => $$('.vt-cover').forEach((el) => { el.style.viewTransitionName = ''; });
  addEventListener('pageshow', clearNames);

  d.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-slug]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (reduce) return;
    const host = a.closest('[data-card]');
    const media = host && $('.vt-cover', host);
    if (!media) return;
    if (crossDocVT) {
      // Имя «cover» должно быть только у одного элемента на странице
      $$('.chero__cover').forEach((el) => { el.style.viewTransitionName = 'none'; });
      $$('.chero__title').forEach((el) => { el.style.viewTransitionName = 'none'; });
      clearNames();
      media.style.viewTransitionName = 'cover';
      return; // браузер сам сделает переход между документами
    }
    if (!gsap) return;
    e.preventDefault();
    flip(media, a.href, host.dataset.bg);
  });

  function flip(media, href, bg) {
    const r = media.getBoundingClientRect();
    const layerEl = d.createElement('div');
    layerEl.className = 'flip-layer';
    layerEl.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;background:${bg}`;
    const art = $('svg', media);
    if (art) layerEl.appendChild(art.cloneNode(true));
    d.body.appendChild(layerEl);
    gsap.to(layerEl, {
      left: 0, top: 0, width: innerWidth, height: innerHeight, duration: 0.85, ease: 'expo.inOut',
      onComplete: () => { try { sessionStorage.setItem('forma-flip', '1'); } catch (_) { /* приватный режим */ } location.href = href; },
    });
  }

  // Возврат на главную: обложка «съёживается» обратно в свою карточку
  addEventListener('pagereveal', (e) => {
    if (!e.viewTransition || !window.navigation || !navigation.activation || !navigation.activation.from) return;
    const m = (navigation.activation.from.url || '').match(/cases\/([\w-]+)\.html/);
    if (!m) return;
    const card = $(`[data-card][data-slug-card="${m[1]}"] .vt-cover`);
    if (!card || $('.chero__cover')) return;
    card.style.viewTransitionName = 'cover';
    e.viewTransition.finished.finally(() => { card.style.viewTransitionName = ''; });
  });

  /* ---------- Форма (демо) ---------- */
  const form = $('#brief-form');
  if (form) {
    const status = $('.form__status', form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const name = (form.elements.name.value || '').trim();
      status.textContent = `Заявка принята (демо)${name ? ', ' + name : ''}. Это концепт-проект: данные никуда не отправлены.`;
      form.querySelector('button[type="submit"]').disabled = true;
      status.setAttribute('tabindex', '-1');
      status.focus({ preventScroll: true });
    });
  }

  if (!motion) return;

  /* ---------- Плавный скролл ---------- */
  gsap.registerPlugin(ST);
  let lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.075, wheelMultiplier: 0.9, anchors: { offset: -20 } });
    lenis.on('scroll', ST.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Плавное появление после FLIP-перехода
  try {
    if (sessionStorage.getItem('forma-flip')) {
      sessionStorage.removeItem('forma-flip');
      gsap.from('.chero__cover', { opacity: 0.6, duration: 0.6, ease: 'power2.out' });
    }
  } catch (_) { /* нет sessionStorage */ }

  /* ---------- Hero: буквы встают на место ---------- */
  const chars = $$('.hero__char');
  if (chars.length) {
    gsap.to(chars, { y: 0, yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.07, clearProps: 'transform' , onComplete: heroParallax });
    gsap.from('.hero__sub, .plan, .hero__label', { y: 30, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12, delay: 0.3 });
  }
  function heroParallax() {
    chars.forEach((c, i) => {
      gsap.to(c, { yPercent: [-30, 40, -10, 55, 20][i % 5], ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    });
  }
  const plate = $('.chero__plate');
  if (plate) gsap.from(plate.children, { y: 40, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: 0.2 });

  /* ---------- Шторки clip-path ---------- */
  const CURTAINS = {
    up: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
    down: ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)'],
    center: ['inset(50% 50% 50% 50%)', 'inset(0% 0% 0% 0%)'],
    split: ['inset(0% 50% 0% 50%)', 'inset(0% 0% 0% 0%)'],
    diag: ['polygon(0% 100%, 0% 100%, 0% 100%)', 'polygon(0% 100%, 0% -100%, 200% 100%)'],
    iris: ['circle(0% at 50% 60%)', 'circle(75% at 50% 50%)'],
    left: ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)'],
  };
  $$('[data-curtain]').forEach((el) => {
    const [from, to] = CURTAINS[el.dataset.curtain] || CURTAINS.up;
    const inner = $('.frame__inner', el) || el.firstElementChild;
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 35%', scrub: 0.8 } });
    tl.fromTo(el, { clipPath: from }, { clipPath: to, ease: 'none' }, 0);
    if (inner) tl.fromTo(inner, { scale: 1.22 }, { scale: 1, ease: 'none' }, 0);
  });

  /* ---------- Параллакс ---------- */
  // слои внутри SVG-экспонатов двигаются в разные стороны
  $$('.layer[data-depth]').forEach((g) => {
    const depth = parseFloat(g.dataset.depth) || 0;
    const host = g.closest('.frame') || g.closest('svg');
    if (g.closest('.chero__cover')) {
      gsap.fromTo(g, { y: 0 }, { y: depth * 260, ease: 'none', scrollTrigger: { trigger: host, start: 'top top', end: 'bottom top', scrub: true } });
    } else {
      gsap.fromTo(g, { y: -depth * 140 }, { y: depth * 140, ease: 'none', scrollTrigger: { trigger: host, start: 'top bottom', end: 'bottom top', scrub: true } });
    }
  });
  // блоки целиком: этикетки и рамки идут с разной скоростью
  $$('[data-speed]').forEach((el) => {
    const s = parseFloat(el.dataset.speed) || 0;
    gsap.fromTo(el, { y: -s * 100 }, { y: s * 100, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // шрифты могли догрузиться и сдвинуть высоты — пересчитать
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(() => ST.refresh());
})();
