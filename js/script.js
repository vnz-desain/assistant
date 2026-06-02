/**
 * ============================================================
 * MEA ASSISTANT V2 — SCRIPT
 * ============================================================
 * Semua logic diambil dari config/theme.js (SITE object).
 * Tidak ada hardcode konten di file ini.
 *
 * Modul:
 *   1. DOM BUILDER  — render nav, cards, status, cta, footer
 *   2. BG LOADER    — load hero image + fallback
 *   3. NAV BEHAVIOR — scroll state, toggle, dropdown
 *   4. SCROLL ANIM  — IntersectionObserver reveal
 *   5. ANCHOR SCROLL
 * ============================================================
 */

(function () {
  'use strict';

  /* Guard ─────────────────────────────────────────────────── */
  if (typeof SITE === 'undefined') {
    console.error('[MEA] config/theme.js missing. Aborting.');
    return;
  }


  /* ══════════════════════════════════════════════════════════
     1. DOM BUILDER
     Generates all dynamic content from SITE config.
  ══════════════════════════════════════════════════════════ */

  /* ── Helper: create element with optional class + text ── */
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls)  e.className   = cls;
    if (text) e.textContent = text;
    return e;
  }

  /* ── NAV ── */
  function buildNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    /* Logo */
    var logo = el('div', 'nav-logo', SITE.nav.logo);
    nav.appendChild(logo);

    /* Toggle (hamburger) */
    var toggle = el('button', 'nav-toggle');
    toggle.id = 'navToggle';
    toggle.setAttribute('aria-label', 'Toggle menu');
    toggle.setAttribute('aria-expanded', 'false');
    for (var i = 0; i < 3; i++) toggle.appendChild(el('span'));
    nav.appendChild(toggle);

    /* Links list */
    var ul = el('ul', 'nav-links');
    ul.id = 'navLinks';

    SITE.nav.items.forEach(function (item) {
      var li = el('li', 'nav-item');

      if (item.type === 'dropdown') {
        li.classList.add('has-dropdown');

        /* Trigger button */
        var btn = el('button', 'nav-btn', item.label);
        btn.setAttribute('aria-haspopup', 'true');
        btn.setAttribute('aria-expanded', 'false');

        /* Chevron SVG */
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'nav-chevron');
        svg.setAttribute('width', '10');
        svg.setAttribute('height', '10');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('aria-hidden', 'true');
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M6 9l6 6 6-6');
        svg.appendChild(path);
        btn.appendChild(svg);

        /* Dropdown list */
        var ddUl = el('ul', 'nav-dropdown');
        item.children.forEach(function (child) {
          var ddLi = el('li');
          var a    = el('a', '', child.label);
          a.href   = child.href;
          ddLi.appendChild(a);
          ddUl.appendChild(ddLi);
        });

        li.appendChild(btn);
        li.appendChild(ddUl);

      } else {
        /* Direct link */
        var a = el('a', 'nav-direct', item.label);
        a.href = item.href;
        if (item.extern) {
          a.target = '_blank';
          a.rel    = 'noopener noreferrer';
        }
        li.appendChild(a);
      }

      ul.appendChild(li);
    });

    nav.appendChild(ul);
  }

  /* ── PLATFORM CARDS ── */
  function buildPlatform() {
    var grid = document.getElementById('cards');
    if (!grid) return;

    SITE.platform.cards.forEach(function (c, i) {
      var card = el('div', 'card reveal delay-' + (i + 1));

      card.appendChild(el('div', 'card-icon', c.icon));
      card.appendChild(el('h3', '', c.title));
      card.appendChild(el('p', '', c.desc));

      var badge = el('span', 'badge' + (c.badgeClass ? ' ' + c.badgeClass : ''), c.badge);
      card.appendChild(badge);

      grid.appendChild(card);
    });
  }

  /* ── STATUS ── */
  function buildStatus() {
    var wrap = document.getElementById('statusWrap');
    if (!wrap) return;

    SITE.status.forEach(function (s) {
      var card = el('div', 'status-card reveal');

      card.appendChild(el('span', 'status-label', s.label));
      card.appendChild(el('span', 'status-value', s.value));

      wrap.appendChild(card);
    });
  }

  /* ── CTA ── */
  function buildCTA() {
    var inner = document.getElementById('ctaInner');
    if (!inner) return;

    var h2 = el('h2');
    h2.style.whiteSpace = 'pre-line';
    h2.textContent = SITE.cta.heading;
    inner.appendChild(h2);

    inner.appendChild(el('p', '', SITE.cta.sub));

    var btns = el('div', 'hero-btns');
    SITE.cta.buttons.forEach(function (b) {
      var a = el('a', 'btn ' + (b.primary ? 'btn-primary' : 'btn-secondary'), b.label);
      a.href = b.href;
      btns.appendChild(a);
    });
    inner.appendChild(btns);
  }

  /* ── FOOTER ── */
  function buildFooter() {
    var footer = document.getElementById('footer');
    if (!footer) return;

    footer.appendChild(el('span', 'footer-logo', SITE.footer.name));
    footer.appendChild(el('span', 'footer-sub',  SITE.footer.sub));
  }

  /* Run all builders */
  buildNav();
  buildPlatform();
  buildStatus();
  buildCTA();
  buildFooter();


  /* ══════════════════════════════════════════════════════════
     2. BACKGROUND LOADER
     Tries primary → alt → gradient fallback.
  ══════════════════════════════════════════════════════════ */

  var bgImg = document.querySelector('.hero-bg-img');

  function tryLoad(src, onOk, onFail) {
    var probe = new Image();
    probe.onload  = function () { onOk(src); };
    probe.onerror = function () { onFail(); };
    probe.src = src;
  }

  function applyBg(src) {
    if (!bgImg) return;
    bgImg.src = src;
    bgImg.decode
      ? bgImg.decode().then(function () { bgImg.classList.add('is-loaded'); }).catch(function () { bgImg.classList.add('is-loaded'); })
      : (bgImg.classList.add('is-loaded'));
  }

  if (bgImg) {
    tryLoad(
      SITE.assets.heroBg,
      applyBg,
      function () {
        tryLoad(SITE.assets.heroBgAlt, applyBg, function () {
          console.info('[MEA BG] Using CSS gradient fallback.');
        });
      }
    );
  }


  /* ══════════════════════════════════════════════════════════
     3. NAV BEHAVIOR
  ══════════════════════════════════════════════════════════ */

  var navEl     = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks  = document.getElementById('navLinks');

  /* ── Scroll state ── */
  var scrollTick = false;
  function onScroll() {
    if (!scrollTick) {
      requestAnimationFrame(function () {
        if (navEl) navEl.classList.toggle('scrolled', window.scrollY > 50);
        scrollTick = false;
      });
      scrollTick = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Dropdowns ── */
  var ddItems = document.querySelectorAll('.nav-item.has-dropdown');

  function closeAllDD(except) {
    ddItems.forEach(function (item) {
      if (item === except) return;
      item.classList.remove('open');
      var b = item.querySelector('.nav-btn');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }

  ddItems.forEach(function (item) {
    var btn = item.querySelector('.nav-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      if (open) closeAllDD(item);
    });
    /* Close when child link is tapped */
    item.querySelectorAll('.nav-dropdown a').forEach(function (a) {
      a.addEventListener('click', function () {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        closeMenu();
      });
    });
  });

  document.addEventListener('click', function (e) {
    if (navEl && !navEl.contains(e.target)) closeAllDD();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeAllDD(); closeMenu(); }
  });

  /* ── Mobile menu ── */
  function closeMenu() {
    if (!navToggle || !navLinks) return;
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    closeAllDD();
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
      if (!open) closeAllDD();
    });

    /* Close menu on direct link click */
    navLinks.querySelectorAll('.nav-direct').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    /* Close on outside tap */
    document.addEventListener('click', function (e) {
      if (navLinks.classList.contains('open') && navEl && !navEl.contains(e.target)) {
        closeMenu();
      }
    });
  }


  /* ══════════════════════════════════════════════════════════
     4. SCROLL ANIMATIONS
  ══════════════════════════════════════════════════════════ */

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-visible');
        observer.unobserve(el);
        /* Free GPU layer after animation */
        el.addEventListener('transitionend', function cleanup() {
          el.style.willChange = 'auto';
          el.removeEventListener('transitionend', cleanup);
        }, { once: true });
      });
    }, { threshold: SITE.animation.threshold, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    /* Fallback: show everything */
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }


  /* ══════════════════════════════════════════════════════════
     5. SMOOTH ANCHOR SCROLL
  ══════════════════════════════════════════════════════════ */

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMenu();
    });
  });

})();
