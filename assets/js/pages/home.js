/* 메인 화면 — Full-screen Hero 자동 진행 (10.06 지시서, 윤서)
   사진 1 → 2 → 3 → 4 는 디졸브, 4 → 5 는 오브젝트만 모핑, 이후 1 로 돌아간다.
   이 파일은 메인 담당자만 수정합니다. */
(function () {
  'use strict';
  var hero = document.getElementById('homeHero');
  if (!hero) { return; }

  var imgs = hero.querySelectorAll('.hh-img');
  var copies = hero.querySelectorAll('.hh-copy');
  var byNum = {};
  for (var i = 0; i < imgs.length; i++) { byNum[imgs[i].getAttribute('data-slide')] = imgs[i]; }

  /* 각 사진이 머무는 시간(ms). 5 → 1 은 다시 디졸브. */
  /* 1 → 2 는 3초 대기 후 전환 (지시서). 나머지는 그대로. */
  var HOLD = { 1: 3000, 2: 4200, 3: 4200, 4: 2600, 5: 4600 };
  var FADE = 1600, MORPH = 800;
  var current = 1, z = 1, timer = null;

  function showCopy(n) {
    for (var c = 0; c < copies.length; c++) {
      var nums = copies[c].getAttribute('data-copy').split(' ');
      copies[c].classList.toggle('is-on', nums.indexOf(String(n)) !== -1);
    }
  }

  function dissolveTo(n) {
    var next = byNum[n];
    next.style.zIndex = ++z;
    next.classList.add('is-on');
    /* 덮인 사진들은 디졸브가 끝난 뒤 내린다 */
    window.setTimeout(function () {
      for (var k in byNum) {
        if (k !== String(n)) { byNum[k].classList.remove('is-on', 'is-morphing', 'is-melting'); }
      }
    }, FADE + 50);
  }

  function morphTo5() {
    var glass = byNum[5], ceramic = byNum[4];
    glass.style.zIndex = ++z;
    ceramic.classList.add('is-melting');
    glass.classList.add('is-on', 'is-morphing');
    window.setTimeout(function () { ceramic.classList.remove('is-melting'); }, MORPH + 50);
  }

  function step() {
    var next = current === 5 ? 1 : current + 1;
    /* 메인 화면이 안 보일 때는 진행을 멈춰 둔다 (다른 메뉴로 갔다가 돌아오면 이어서) */
    var view = document.getElementById('home');
    if (document.hidden || (view && !view.classList.contains('is-active'))) {
      timer = window.setTimeout(step, 1000);
      return;
    }
    if (next === 5) { morphTo5(); } else { dissolveTo(next); }
    /* 4 와 5 는 같은 문구 — 모핑 중에도 그대로 둔다 */
    showCopy(next);
    current = next;
    timer = window.setTimeout(step, HOLD[current]);
  }

  byNum[1].style.zIndex = z;
  showCopy(1);
  timer = window.setTimeout(step, HOLD[1]);

  /* 모든 사진을 미리 받아 두어 전환 순간에 빈 화면이 생기지 않게 한다 */
  for (var p = 0; p < imgs.length; p++) { if (imgs[p].decode) { imgs[p].decode().catch(function () {}); } }
})();
