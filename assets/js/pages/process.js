/* 브랜드 > 공정 — 스크롤 = 공정 진행 (SCROLL TO EXPERIENCE THE PROCESS)
   HERO 확대·전환 / OVERVIEW 공정 라인 / SOAP·TOOTHPASTE 고정 사진 전환 /
   FINALE 문장·제품 등장을 스크롤 위치 하나로 계산한다.
   - 스크롤 핸들러는 rAF 로 한 번만 돌고, transform·opacity·클래스만 바꾼다.
   - 공정 페이지가 보이지 않을 때(다른 메뉴)는 아무것도 계산하지 않는다.
   - prefers-reduced-motion 이면 확대·흐림 없이 상태만 바꾼다 (CSS 가 sticky 도 푼다).
   이 파일은 공정 담당자만 수정합니다. */
(function () {
  'use strict';
  var root = document.getElementById('prRoot');
  var page = document.getElementById('brand-process');
  if (!root || !page) { return; }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clamp(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }
  function each(list, fn) { for (var i = 0; i < list.length; i++) { fn(list[i], i); } }
  /* sticky 장면 안에서 얼마나 진행했는가 (0 ~ 1) */
  function progress(el) {
    var r = el.getBoundingClientRect();
    var stage = el.querySelector('.pr-sticky');
    var span = r.height - (stage ? stage.offsetHeight : window.innerHeight);
    if (span <= 0) { return r.top < 0 ? 1 : 0; }
    return clamp(-r.top / span);
  }

  /* ---------- 1) HERO ---------- */
  var hero = root.querySelector('.pr-hero');
  var heroMedia = hero.querySelector('.pr-hero-media');
  var heroImgs = hero.querySelectorAll('.pr-hero-img');
  var heroStages = hero.querySelectorAll('.pr-hero-stages li');
  var heroStage = -1;
  function updateHero() {
    var p = progress(hero);
    if (!reduce) { heroMedia.style.setProperty('--pr-zoom', (1 + p * 0.08).toFixed(4)); }
    hero.setAttribute('data-progress-gt', p > 0.02 ? '0' : '');
    var s = p < 0.34 ? 0 : (p < 0.68 ? 1 : 2);
    if (s === heroStage) { return; }
    heroStage = s;
    each(heroImgs, function (img) { img.classList.toggle('is-on', +img.getAttribute('data-stage') === s); });
    /* 이미 지난 단계도 밑줄을 남겨 '원료 → 공정 → 제품' 흐름이 보이게 */
    each(heroStages, function (li) { li.classList.toggle('is-on', +li.getAttribute('data-stage') <= s); });
  }

  /* ---------- 2) OVERVIEW 공정 라인 ---------- */
  var ov = root.querySelector('.pr-ov');
  var ORDER = ['raw', 's1', 's2', 's3', 't1', 't2', 't3', 't4'];
  var nodes = {};
  each(ov.querySelectorAll('[data-node]'), function (n) { nodes[n.getAttribute('data-node')] = n; });
  var ovIdx = -1;
  function setNodes(idx) {
    if (idx === ovIdx) { return; }
    ovIdx = idx;
    var cur = ORDER[idx];
    var branch = cur.charAt(0);
    ORDER.forEach(function (key, i) {
      var n = nodes[key];
      var done = key === 'raw' ? idx > 0
        /* 비누 줄은 치약으로 넘어가도 완료로 남는다 */
        : (key.charAt(0) === branch ? i < idx : (branch === 't' && key.charAt(0) === 's'));
      n.classList.toggle('is-active', i === idx);
      n.classList.toggle('is-done', done && i !== idx);
    });
  }
  function updateOverview() {
    if (reduce) { setNodes(ORDER.length - 1); return; }
    var p = progress(ov);
    setNodes(Math.min(ORDER.length - 1, Math.floor(p * ORDER.length)));
  }

  /* ---------- 4·5) SOAP / TOOTHPASTE ---------- */
  var lines = [];
  each(root.querySelectorAll('.pr-line'), function (sec) {
    var line = {
      sec: sec,
      steps: sec.querySelectorAll('.pr-step'),
      imgs: sec.querySelectorAll('.pr-pin-img'),
      ind: sec.querySelectorAll('.pr-ind li'),
      view: sec.querySelector('.pr-view'),
      pop: sec.querySelector('.pr-pop'),
      cur: 0
    };
    lines.push(line);
    /* + VIEW: 지금 단계의 설명(사이트에 이미 있는 문구)만 보여 준다 */
    line.view.addEventListener('click', function () {
      var open = line.view.getAttribute('aria-expanded') === 'true';
      if (open) { closePop(line); return; }
      var step = line.steps[(line.cur || 1) - 1];
      var parts = ['.pr-step-ko', '.pr-step-sum', '.pr-step-d', '.pr-step-eq'].map(function (q) {
        var el = step.querySelector(q); return el ? el.textContent.trim() : '';
      }).filter(Boolean);
      line.pop.innerHTML = '<strong>' + step.querySelector('.pr-step-en').textContent + '</strong>' +
        parts.map(function (t) { return '<p>' + t.replace(/</g, '&lt;') + '</p>'; }).join('');
      line.pop.hidden = false;
      line.view.setAttribute('aria-expanded', 'true');
    });
  });
  function closePop(line) {
    line.pop.hidden = true;
    line.view.setAttribute('aria-expanded', 'false');
  }
  function setStep(line, n) {
    if (n === line.cur) { return; }
    var prev = line.cur;
    line.cur = n;
    closePop(line);
    each(line.imgs, function (img) {
      var s = +img.getAttribute('data-step');
      if (s === n) { img.classList.remove('is-leaving'); img.classList.add('is-on'); }
      else if (s === prev && !reduce) {
        /* 현재 사진은 살짝 커지며 사라진다 → 다음 사진이 자리를 이어받는다 */
        img.classList.add('is-leaving');
        window.setTimeout(function () { if (line.cur !== s) { img.classList.remove('is-on', 'is-leaving'); } }, 720);
      } else { img.classList.remove('is-on', 'is-leaving'); }
    });
    each(line.ind, function (li) {
      var s = +li.getAttribute('data-step');
      li.classList.toggle('is-active', s === n);
      li.classList.toggle('is-done', s < n);
    });
    each(line.steps, function (st) { st.classList.toggle('is-active', +st.getAttribute('data-step') === n); });
  }
  function updateLines() {
    /* 단계 판정 기준선: 고정 사진 아래쪽(모바일) 또는 화면 가운데(데스크톱) */
    var mobile = window.innerWidth <= 900;
    var mark = mobile ? window.innerHeight * 0.66 : window.innerHeight * 0.5;
    lines.forEach(function (line) {
      var pick = 1;
      each(line.steps, function (st) {
        if (st.getBoundingClientRect().top <= mark) { pick = +st.getAttribute('data-step'); }
      });
      setStep(line, pick);
    });
  }

  /* ---------- 3) SELECTOR ---------- */
  var selBtns = root.querySelectorAll('.pr-select-btn');
  each(selBtns, function (b) {
    /* href="#prSoap" 은 키보드·스크린리더용. 해시를 바꾸면 사이트 라우터가 홈으로
       보내므로, 해시는 그대로 두고 해당 공정으로 부드럽게 스크롤만 한다. */
    b.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById(b.getAttribute('data-target'));
      if (target) {
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        var h = target.querySelector('.pr-title');
        if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      }
    });
  });
  function updateSelector() {
    var mid = window.innerHeight * 0.5, cur = 'prSoap';
    lines.forEach(function (line) { if (line.sec.getBoundingClientRect().top <= mid) { cur = line.sec.id; } });
    each(selBtns, function (b) {
      if (b.getAttribute('data-target') === cur) { b.setAttribute('aria-current', 'true'); }
      else { b.removeAttribute('aria-current'); }
    });
  }

  /* ---------- 6) FINALE ---------- */
  var fin = root.querySelector('.pr-fin');
  var finLines = fin.querySelectorAll('.pr-fin-line');
  var finProduct = fin.querySelector('.pr-fin-product');
  function updateFinale() {
    if (reduce) {
      each(finLines, function (l) { l.classList.add('is-on'); });
      finProduct.style.setProperty('--pr-reveal', '1');
      return;
    }
    var p = progress(fin);
    var at = [0.02, 0.22, 0.42];
    each(finLines, function (l, i) { l.classList.toggle('is-on', p >= at[i]); });
    finProduct.style.setProperty('--pr-reveal', clamp((p - 0.5) / 0.35).toFixed(3));
  }

  /* ---------- 스크롤 루프 ---------- */
  var ticking = false;
  function visible() { return !page.hidden && page.offsetParent !== null; }
  function update() {
    ticking = false;
    if (!visible()) { return; }
    updateHero(); updateOverview(); updateLines(); updateSelector(); updateFinale();
  }
  function request() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });
  /* rAF 는 탭이 숨겨지면 멈춘다 — 공정 메뉴로 들어오는 순간에는 직접 한 번 계산 */
  if ('MutationObserver' in window) {
    new MutationObserver(function () { window.setTimeout(update, 0); })
      .observe(page, { attributes: true, attributeFilter: ['hidden'] });
  }
  window.addEventListener('hashchange', function () { window.setTimeout(update, 60); });
  update();
})();
