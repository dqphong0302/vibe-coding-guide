/* Trình chiếu slide — menu trái tự sinh, slide trượt bên phải. */
(function () {
  'use strict';

  var slides = [], links = [], i = 0, maxSeen = 0;
  var viewport, navList, bar, barLabel, barMsg, count, actLabel, nav, backdrop;
  var btnPrev, btnNext, tapPrev, tapNext;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function buildNav() {
    var html = '', lastAct = null;
    slides.forEach(function (s, n) {
      var act = s.getAttribute('data-act') || '';
      var h = s.querySelector('h2');
      var isAct = s.classList.contains('act-open') || s.classList.contains('cover');
      if (act !== lastAct) {
        html += '<p class="grp">' + esc(act) + '</p>';
        lastAct = act;
      }
      html += '<a href="#s' + (n + 1) + '" data-go="' + n + '"' + (isAct ? ' class="is-act"' : '') + '>' +
        '<em>' + String(n + 1).padStart(2, '0') + '</em>' +
        '<span>' + esc(h ? h.textContent : 'Slide ' + (n + 1)) + '</span></a>';
    });
    navList.innerHTML = html;
    links = Array.prototype.slice.call(navList.querySelectorAll('a[data-go]'));
  }

  /* Tự co nội dung cho vừa khung 16:9. Vì mọi kích thước dùng đơn vị cqw
     nên tỉ lệ co tính một lần là đúng ở mọi bề rộng, kể cả khi in PDF. */
  function fitAll() {
    if (window.innerWidth <= 900) {
      slides.forEach(function (s) {
        var f = s.querySelector('.s-fit');
        if (f) { f.style.transform = ''; f.style.width = ''; f.style.height = ''; }
      });
      return;
    }
    slides.forEach(function (s) {
      var inner = s.querySelector('.s-inner');
      var fit = s.querySelector('.s-fit');
      if (!inner || !fit) return;
      var wasHidden = !s.classList.contains('on');
      if (wasHidden) { s.style.visibility = 'hidden'; s.style.opacity = '0'; s.classList.add('on'); }
      fit.style.transform = 'none';
      fit.style.width = '100%';
      fit.style.height = 'auto';
      var need = fit.scrollHeight;
      var have = inner.clientHeight;
      var k = (need > have && have > 0) ? Math.max(0.6, have / need) : 1;
      fit.style.transform = k < 1 ? 'scale(' + k.toFixed(4) + ')' : 'none';
      fit.style.width = k < 1 ? (100 / k).toFixed(3) + '%' : '100%';
      fit.style.height = k < 1 ? (100 / k).toFixed(3) + '%' : '100%';
      if (wasHidden) { s.classList.remove('on'); s.style.visibility = ''; s.style.opacity = ''; }
    });
  }

  function show(n, opts) {
    opts = opts || {};
    if (n < 0) n = 0;
    if (n > slides.length - 1) n = slides.length - 1;
    if (n === i && opts.first !== true) return;

    viewport.classList.toggle('rev', n < i);
    slides[i].classList.remove('on');
    i = n;
    slides[i].classList.add('on');
    if (i > maxSeen) maxSeen = i;

    links.forEach(function (a, k) {
      a.classList.toggle('on', k === i);
      a.classList.toggle('seen', k < maxSeen);
    });

    var pct = (maxSeen + 1) / slides.length * 100;
    bar.style.width = pct + '%';
    barLabel.textContent = (i + 1) + '/' + slides.length;
    barMsg.textContent = slides[i].getAttribute('data-act') || '';
    count.textContent = (i + 1) + ' / ' + slides.length;
    actLabel.textContent = slides[i].getAttribute('data-act') || '';

    btnPrev.disabled = tapPrev.disabled = (i === 0);
    btnNext.disabled = tapNext.disabled = (i === slides.length - 1);

    try { history.replaceState(null, '', '#s' + (i + 1)); } catch (e) {}

    var a = links[i];
    if (a && a.scrollIntoView) a.scrollIntoView({ block: 'nearest' });
    if (opts.scroll !== false && window.innerWidth <= 900) {
      viewport.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }

  function next() { show(i + 1); }
  function prev() { show(i - 1); }

  function drawer(open) {
    nav.classList.toggle('open', open);
    backdrop.classList.toggle('open', open);
  }

  function fullscreen() {
    var el = document.querySelector('.deck-main'), d = document;
    if (!d.fullscreenElement) {
      (el.requestFullscreen || el.webkitRequestFullscreen || function () {}).call(el);
    } else {
      (d.exitFullscreen || d.webkitExitFullscreen || function () {}).call(d);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    viewport = document.getElementById('viewport');
    if (!viewport) return;
    slides = Array.prototype.slice.call(viewport.querySelectorAll('.slide'));
    if (!slides.length) return;

    navList = document.getElementById('nav-list');
    bar = document.getElementById('nav-bar');
    barLabel = document.getElementById('nav-bar-label');
    barMsg = document.getElementById('nav-bar-msg');
    count = document.getElementById('deck-count');
    actLabel = document.getElementById('deck-act');
    nav = document.getElementById('deck-nav');
    backdrop = document.getElementById('backdrop');
    btnPrev = document.getElementById('btn-prev');
    btnNext = document.getElementById('btn-next');
    tapPrev = document.querySelector('.tapzone.prev');
    tapNext = document.querySelector('.tapzone.next');

    slides.forEach(function (s, n) {
      var inner = s.querySelector('.s-inner');
      var fit = document.createElement('div');
      fit.className = 's-fit';
      while (inner.firstChild) fit.appendChild(inner.firstChild);
      inner.appendChild(fit);
      var t = document.createElement('span');
      t.className = 's-num';
      t.textContent = (n + 1) + ' / ' + slides.length;
      inner.appendChild(t);
    });

    buildNav();
    fitAll();
    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(fitAll, 180);
    });

    navList.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-go]');
      if (!a) return;
      e.preventDefault();
      show(+a.dataset.go);
      if (window.innerWidth <= 900) drawer(false);
    });

    btnPrev.addEventListener('click', prev);
    btnNext.addEventListener('click', next);
    tapPrev.addEventListener('click', prev);
    tapNext.addEventListener('click', next);
    document.getElementById('btn-fs').addEventListener('click', fullscreen);
    ['btn-print', 'btn-print2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', function () { window.print(); });
    });
    document.getElementById('btn-menu').addEventListener('click', function () { drawer(true); });
    document.getElementById('nav-close').addEventListener('click', function () { drawer(false); });
    backdrop.addEventListener('click', function () { drawer(false); });

    document.addEventListener('keydown', function (e) {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      var k = e.key;
      if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') { e.preventDefault(); next(); }
      else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); prev(); }
      else if (k === 'Home') { e.preventDefault(); show(0); }
      else if (k === 'End') { e.preventDefault(); show(slides.length - 1); }
      else if (k === 'Escape') { drawer(false); }
      else if (k === 'f' || k === 'F') { fullscreen(); }
    });

    var x0 = null, y0 = null;
    viewport.addEventListener('touchstart', function (e) {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    viewport.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.6) { dx < 0 ? next() : prev(); }
      x0 = y0 = null;
    }, { passive: true });

    var m = /^#s(\d+)$/.exec(location.hash);
    var start = m ? Math.min(slides.length, Math.max(1, +m[1])) - 1 : 0;
    slides.forEach(function (s) { s.classList.remove('on'); });
    slides[0].classList.add('on');
    i = 0;
    show(start, { first: true, scroll: false });
  });
})();
