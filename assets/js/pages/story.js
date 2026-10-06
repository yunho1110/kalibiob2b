/* 브랜드 > 스토리 — 배경 전환 + 떠오르며 나타나기 (10.06 지시서)
   - 화면 가운데를 지나는 섹션의 data-tone(dark/light)을 래퍼에 넘겨,
     배경색이 섹션 경계에서 끊기지 않고 부드럽게 바뀌게 한다.
   - .st-rise 요소는 화면에 들어올 때 아래에서 위로 떠오른다.
   이 파일은 스토리 담당자만 수정합니다. */
(function () {
  'use strict';
  var root = document.getElementById('stRoot');
  var page = document.getElementById('brand-story');
  if (!root || !page) { return; }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tones = root.querySelectorAll('[data-tone]');
  var rises = root.querySelectorAll('.st-rise');

  /* 떠오르기 — 한 번 나타난 요소는 다시 숨기지 않는다 */
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
      /* 같은 목록 안에서는 조금씩 늦게 */
      rises[i].style.transitionDelay = (rises[i].classList.contains('st-val') || rises[i].classList.contains('st-tl-item'))
        ? (Array.prototype.indexOf.call(rises[i].parentNode.children, rises[i]) * 90) + 'ms' : '';
      io.observe(rises[i]);
    }
  }

  /* 배경 톤 */
  var ticking = false;
  function updateTone() {
    ticking = false;
    if (page.hidden || page.offsetParent === null) { return; }
    var mid = window.innerHeight * 0.5, tone = 'light';
    for (var i = 0; i < tones.length; i++) {
      if (tones[i] === root) { continue; }
      var r = tones[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) { tone = tones[i].getAttribute('data-tone'); break; }
    }
    if (root.getAttribute('data-tone') !== tone) { root.setAttribute('data-tone', tone); }
  }
  function request() { if (!ticking) { ticking = true; window.requestAnimationFrame(updateTone); } }
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });
  if ('MutationObserver' in window) {
    new MutationObserver(function () { window.setTimeout(updateTone, 0); })
      .observe(page, { attributes: true, attributeFilter: ['hidden'] });
  }
  window.addEventListener('hashchange', function () { window.setTimeout(updateTone, 60); });
  updateTone();
})();
