/* 브랜드 > 스토리 — 스크롤로 이어지는 하나의 비주얼 (10.07 지시서)
   원석(배너) → [기업 기원 직전 사라짐] → ORIGIN → [기업 비전] 세라믹·유리 → [핵심 가치] 흰 KALI.
   - 전부 스크롤 위치로만 계산한다: 자동 재생·시간 전환 없음, 위로 올리면 그대로 되돌아간다.
   - 배경·제목·본문은 움직이지 않고, 비주얼만 transform / opacity 로 움직인다.
   - 767px 이하·모션 감소 설정에서는 여행 비주얼을 끄고 섹션 안 정지 비주얼을 보여 준다 (CSS).
   이 파일은 스토리 담당자만 수정합니다. */
(function () {
  'use strict';
  var root = document.getElementById('stRoot');
  var page = document.getElementById('brand-story');
  if (!root || !page) { return; }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tones = root.querySelectorAll('[data-tone]');
  var rises = root.querySelectorAll('.st-rise');
  var rock = root.querySelector('.st-banner-obj');
  var origin = document.getElementById('bs-origin');
  var vision = document.getElementById('bs-vision');
  var values = document.getElementById('bs-values');
  var vis = root.querySelectorAll('.st-vis');

  /* ---- 떠오르기 (한 번 나타나면 유지) ---- */
  function showAll() { for (var i = 0; i < rises.length; i++) { rises[i].classList.add('is-in'); } }
  if (reduce || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    for (var i = 0; i < rises.length; i++) {
      rises[i].style.transitionDelay = (rises[i].classList.contains('st-val') || rises[i].classList.contains('st-tl-item'))
        ? (Array.prototype.indexOf.call(rises[i].parentNode.children, rises[i]) * 90) + 'ms' : '';
      io.observe(rises[i]);
    }
  }

  function clamp(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }
  function lerp(a, b, p) { return a + (b - a) * p; }
  /* 부드러운 가감속 — Bounce 없이 */
  function ease(p) { return p * p * (3 - 2 * p); }
  function top(el) { return el.getBoundingClientRect().top + window.pageYOffset; }

  /* ---- 배경 톤 (배너·타임라인 바탕색) ---- */
  function updateTone() {
    var mid = window.innerHeight * 0.5, tone = 'light';
    for (var i = 0; i < tones.length; i++) {
      if (tones[i] === root) { continue; }
      var r = tones[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) { tone = tones[i].getAttribute('data-tone'); break; }
    }
    if (root.getAttribute('data-tone') !== tone) { root.setAttribute('data-tone', tone); }
  }

  /* ---- 스크롤 비주얼 ---- */
  function moving() { return !reduce && window.innerWidth >= 768; }

  var banner = root.querySelector('.st-banner');
  function updateRock(y, vh) {
    if (!rock) { return; }
    if (!moving()) { rock.style.transform = ''; rock.style.opacity = ''; return; }
    /* 배너가 화면에 머무는 동안(진행도 0→1) 원석만 천천히 아래로 내려오고,
       배너가 끝나 기업 기원이 들어오기 직전(0.7→1)에 사라진다 — 기업 기원 안으로는 들어가지 않는다 */
    var span = banner.offsetHeight - vh;
    var p = clamp((y - top(banner)) / Math.max(1, span));
    var room = Math.max(0, vh - 40 - rock.offsetTop - rock.offsetHeight - 24);   /* 고정 화면 안에서 내려갈 수 있는 거리 */
    var shift = ease(p) * Math.min(room, vh * 0.32);
    rock.style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0)';
    rock.style.opacity = (1 - clamp((p - 0.7) / 0.3)).toFixed(3);
  }

  function updateVisuals(y, vh) {
    for (var i = 0; i < vis.length; i++) {
      var el = vis[i];
      if (!moving()) { el.style.removeProperty('--y'); el.style.removeProperty('--o'); continue; }
      var sec = el.closest('.st-sec');
      var r = sec.getBoundingClientRect();
      /* 섹션 진행도: 섹션 윗선이 화면 85% 지점에 닿을 때 0 → 섹션 아랫선이 화면 55% 지점에 닿을 때 1 */
      var p = clamp((vh * 0.85 - r.top) / Math.max(1, r.height + vh * 0.3));
      var first = el.getAttribute('data-v') === 'origin';
      /* 들어올 때: ORIGIN 은 위쪽에서 내려오며 나타나고, 나머지는 앞 비주얼과 디졸브 */
      var fadeIn = clamp(p / (first ? 0.22 : 0.16));
      var fadeOut = el.getAttribute('data-v') === 'kali' ? 1 : 1 - clamp((p - 0.84) / 0.16);
      var drop = ease(clamp(p)) * vh * 0.34 - (first ? (1 - clamp(p / 0.22)) * vh * 0.12 : 0);
      el.style.setProperty('--y', drop.toFixed(1) + 'px');
      el.style.setProperty('--o', Math.min(fadeIn, fadeOut).toFixed(3));
    }
  }

  var ticking = false;
  function update() {
    ticking = false;
    if (page.hidden || page.offsetParent === null) { return; }
    var y = window.pageYOffset, vh = window.innerHeight;
    updateTone(); updateRock(y, vh); updateVisuals(y, vh);
  }
  function request() { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } }
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });
  if ('MutationObserver' in window) {
    new MutationObserver(function () { window.setTimeout(update, 0); })
      .observe(page, { attributes: true, attributeFilter: ['hidden'] });
    var about = document.getElementById('about');
    if (about) {
      new MutationObserver(function () { window.setTimeout(update, 0); })
        .observe(about, { attributes: true, attributeFilter: ['class'] });
    }
  }
  window.addEventListener('hashchange', function () { window.setTimeout(update, 60); });
  update();
})();
