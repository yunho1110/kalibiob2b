/* KALIBIO B2B site — application logic
   Depends on: assets/js/i18n.js (defines window.I18N) */
(function () {
  'use strict';

  function getPath(obj, path) {
    return path.split('.').reduce(function (o, k) {
      return (o && o[k] !== undefined) ? o[k] : undefined;
    }, obj);
  }

  var SUPPORTED = ['ko', 'en', 'zh'];
  var currentLang = 'ko';
  /* Set once routing is wired up, so switching language also re-reads the
     nav labels that the big page heading is built from. */
  var onLangApplied = null;

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) { lang = 'ko'; }
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang);

    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var entry = getPath(window.I18N, el.getAttribute('data-i18n'));
      if (entry && entry[lang] !== undefined) { el.innerHTML = entry[lang]; }
    }

    /* attribute-targeted translations: data-i18n-attr="placeholder:key" */
    var attrNodes = document.querySelectorAll('[data-i18n-attr]');
    for (var a = 0; a < attrNodes.length; a++) {
      var spec = attrNodes[a].getAttribute('data-i18n-attr').split(':');
      var val = getPath(window.I18N, spec[1]);
      if (val && val[lang] !== undefined) { attrNodes[a].setAttribute(spec[0], val[lang]); }
    }

    var langBtns = document.querySelectorAll('.lang-btn');
    for (var j = 0; j < langBtns.length; j++) {
      langBtns[j].classList.toggle('active', langBtns[j].getAttribute('data-lang') === lang);
    }

    if (onLangApplied) { onLangApplied(); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    setLang('ko');

    var langButtons = document.querySelectorAll('.lang-btn');
    for (var i = 0; i < langButtons.length; i++) {
      langButtons[i].addEventListener('click', function () {
        setLang(this.getAttribute('data-lang'));
      });
    }

    /* ===== Mobile drawer ===== */
    var menuToggles = document.querySelectorAll('.js-menu-toggle');
    var drawer = document.getElementById('mobileDrawer');
    var drawerCloseBtn = document.getElementById('drawerCloseBtn');

    function setToggleState(v) {
      for (var i = 0; i < menuToggles.length; i++) { menuToggles[i].setAttribute('aria-expanded', v); }
    }
    function openDrawer() {
      if (!drawer) { return; }
      /* 처음 열 때는 상위 메뉴(+)만 보인다 — 하위 메뉴는 누르면 펼쳐진다 */
      var groups = drawer.querySelectorAll('.nav-group[data-group]');
      for (var g = 0; g < groups.length; g++) {
        groups[g].classList.remove('open');
        var tg = groups[g].querySelector('.nav-toggle');
        if (tg) { tg.setAttribute('aria-expanded', 'false'); }
        var pl = groups[g].querySelector('.nav-row > a');
        if (pl) { pl.setAttribute('aria-expanded', 'false'); }
      }
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      setToggleState('true');
      document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
      if (!drawer) { return; }
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      setToggleState('false');
      document.body.style.overflow = '';
    }
    if (drawer) {
      for (var mt = 0; mt < menuToggles.length; mt++) {
        menuToggles[mt].setAttribute('aria-expanded', 'false');
        menuToggles[mt].addEventListener('click', function () {
          if (drawer.classList.contains('open')) { closeDrawer(); } else { openDrawer(); }
        });
      }
    }
    if (drawerCloseBtn) { drawerCloseBtn.addEventListener('click', closeDrawer); }
    if (drawer) {
      /* Parent rows that own a sub-list must NOT close the drawer — tapping them
         opens the list instead (see the handler further down). */
      var drawerLinks = drawer.querySelectorAll('a');
      for (var k = 0; k < drawerLinks.length; k++) {
        var owner = drawerLinks[k].closest('.nav-group');
        if (drawerLinks[k].closest('.nav-row') && owner && owner.querySelector('.nav-sub')) { continue; }
        drawerLinks[k].addEventListener('click', closeDrawer);
      }
      /* 데스크톱에서는 패널 바깥이 어둡게 깔린 페이지다 — 바깥을 누르면 닫는다 */
      document.addEventListener('click', function (e) {
        if (!drawer.classList.contains('open')) { return; }
        if (drawer.contains(e.target) || e.target.closest('.js-menu-toggle')) { return; }
        closeDrawer();
      });
    }

    /* ===== Hash routing ===== */
    var VALID_VIEWS = ['home', 'material', 'business', 'products', 'about', 'partnership', 'contact'];
    var HASH_ALIASES = { hero: 'home', why: 'about', partners: 'partnership', technology: 'material' };
    var SUBVIEW_GROUPS = {
      material: ['mat-story'],
      business: ['biz-areas'],
      products: ['prod-soap', 'prod-paste'],
      about: ['brand-story', 'brand-process'],
      partnership: ['part-current'],
      contact: ['contact-form', 'contact-faq']
    };
    /* 메뉴 한 칸이 여러 블록을 묶는 경우. 없으면 같은 id 블록 하나를 쓴다. */
    var SUBVIEW_BLOCKS = {
      'about-origin': ['about-origin', 'about-history'],
      'mat-story': ['mat-story', 'mat-comp', 'mat-uses', 'mat-tests', 'mat-props'],
      'about-values': ['about-principles']
    };
    function blocksOf(subId) { return SUBVIEW_BLOCKS[subId] || [subId]; }

    /* 스크롤 스토리텔링을 쓰는 뷰: 소메뉴를 숨기지 않고 한 페이지로 이어 붙인다 */
    var STORY_VIEWS = { material: true, partnership: true };
    var lastStoryView = null;

    var SUBVIEW_DEFAULT = {
      material: 'mat-story', business: 'biz-areas', products: 'prod-soap',
      about: 'brand-story', partnership: 'part-current', contact: 'contact-form'
    };
    var SUBSECTIONS = {};
    Object.keys(SUBVIEW_GROUPS).forEach(function (view) {
      SUBVIEW_GROUPS[view].forEach(function (id) { SUBSECTIONS[id] = view; });
    });
    /* old bookmarks keep working after the technology view was split in two */
    var LEGACY_SUBS = {
      'tech-raw': 'mat-story', 'tech-eco': 'mat-uses', 'tech-industry': 'mat-uses',
      'tech-clinical': 'mat-tests', 'tech-cert': 'mat-tests', 'tech-process': 'prod-proc-soap',
      'mat-components': 'mat-story', 'mat-comp': 'mat-story', 'mat-value': 'mat-uses',
      'mat-efficacy': 'mat-tests', 'mat-props': 'mat-tests',
      'mat-cert': 'mat-tests', 'products-soap': 'prod-soap', 'products-toothpaste': 'prod-paste',
      'products-process': 'prod-proc-soap', 'prod-process': 'prod-proc-soap', 'products-oem': 'biz-areas',
      'biz-material': 'biz-areas', 'biz-goods': 'biz-areas', 'biz-oem': 'biz-areas',
      'ba-material': 'biz-areas', 'ba-goods': 'biz-areas', 'ba-oem': 'biz-areas',
      'about-overview': 'about-info', 'about-story': 'about-origin', 'about-milestones': 'about-origin',
      'about-why': 'brand-story', 'about-principles': 'brand-story',
      'about-info': 'brand-story', 'about-origin': 'brand-story',
      'about-vision': 'brand-story', 'about-values': 'brand-story',
      'prod-process': 'brand-process', 'prod-proc-soap': 'brand-process',
      'prod-proc-paste': 'brand-process',
      'mat-uses': 'mat-story', 'mat-tests': 'mat-story', 'part-global': 'part-current',
      'biz-material': 'biz-areas', 'biz-goods': 'biz-areas', 'biz-oem': 'biz-areas',
      'ba-material': 'biz-areas', 'ba-goods': 'biz-areas', 'ba-oem': 'biz-areas'
    };
    Object.keys(LEGACY_SUBS).forEach(function (old) {
      SUBSECTIONS[old] = SUBSECTIONS[LEGACY_SUBS[old]];
    });

    var appContent = document.getElementById('appContent');

    var routedHash = null;
    function currentHash() {
      if (routedHash !== null) { return routedHash; }
      return (window.location.hash || '').replace('#', '');
    }

    function getViewFromHash() {
      var h = currentHash();
      if (HASH_ALIASES[h]) { return HASH_ALIASES[h]; }
      if (SUBSECTIONS[h]) { return SUBSECTIONS[h]; }
      return VALID_VIEWS.indexOf(h) !== -1 ? h : 'home';
    }

    function getSubsectionFromHash() {
      var h = currentHash();
      if (LEGACY_SUBS[h]) { return LEGACY_SUBS[h]; }
      return SUBSECTIONS[h] ? h : null;
    }

    function showSubview(viewId, target) {
      var group = SUBVIEW_GROUPS[viewId];
      if (!group) {
        /* a view without sub-pages must not leave a stale menu highlight behind */
        var stale = document.querySelectorAll('[data-subview].active, [data-subview][aria-current]');
        for (var s = 0; s < stale.length; s++) { stale[s].classList.remove('active'); stale[s].removeAttribute('aria-current'); }
        return null;
      }
      var active = (target && group.indexOf(target) !== -1) ? target : SUBVIEW_DEFAULT[viewId];
      if (!STORY_VIEWS[viewId]) {
        for (var i = 0; i < group.length; i++) {
          var blocks = blocksOf(group[i]);
          for (var b = 0; b < blocks.length; b++) {
            var el = document.getElementById(blocks[b]);
            if (el) { el.hidden = (group[i] !== active); }
          }
        }
      }
      var tabs = document.querySelectorAll('[data-subview]');
      for (var j = 0; j < tabs.length; j++) {
        var isTabActive = tabs[j].getAttribute('data-subview') === active;
        tabs[j].classList.toggle('active', isTabActive);
        if (isTabActive) { tabs[j].setAttribute('aria-current', 'page'); } else { tabs[j].removeAttribute('aria-current'); }
      }
      return active;
    }

    function showView(viewId) {
      var views = document.querySelectorAll('.view');
      for (var i = 0; i < views.length; i++) {
        views[i].classList.toggle('is-active', views[i].id === viewId);
      }
      var navAnchors = document.querySelectorAll('.sidebar-nav a[data-view], .drawer-nav a[data-view], .main-nav a[data-view]');
      for (var j = 0; j < navAnchors.length; j++) {
        var isNavActive = navAnchors[j].getAttribute('data-view') === viewId;
        navAnchors[j].classList.toggle('active', isNavActive);
        if (isNavActive) { navAnchors[j].setAttribute('aria-current', 'page'); } else { navAnchors[j].removeAttribute('aria-current'); }
      }
      /* Mark the owning group, but never force a dropdown open — on desktop the
         sub-menu is a hover/click panel, not a permanently expanded tree. */
      var navGroups = document.querySelectorAll('.nav-group[data-group]');
      for (var k = 0; k < navGroups.length; k++) {
        var isCurrent = navGroups[k].getAttribute('data-group').split(' ').indexOf(viewId) !== -1;
        navGroups[k].classList.toggle('is-current', isCurrent);
        navGroups[k].classList.remove('open');
        var toggleBtn = navGroups[k].querySelector('.nav-toggle');
        if (toggleBtn) { toggleBtn.setAttribute('aria-expanded', 'false'); }
      }
      closeDrawer();
    }

    var navToggles = document.querySelectorAll('.nav-toggle');
    for (var t = 0; t < navToggles.length; t++) {
      navToggles[t].addEventListener('click', function (e) {
        e.preventDefault();
        var group = this.closest('.nav-group');
        if (!group) { return; }
        collapseDrawerGroups(group);
        var willOpen = !group.classList.contains('open');
        group.classList.toggle('open', willOpen);
        this.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    }

    /* Only one drawer section stays open at a time, so the list never gets long. */
    function collapseDrawerGroups(keep) {
      var open = document.querySelectorAll('.drawer-nav .nav-group.open');
      for (var i = 0; i < open.length; i++) {
        if (open[i] === keep) { continue; }
        open[i].classList.remove('open');
        var t = open[i].querySelector('.nav-toggle');
        if (t) { t.setAttribute('aria-expanded', 'false'); }
        var pa = open[i].querySelector('.nav-row > a');
        if (pa) { pa.setAttribute('aria-expanded', 'false'); }
      }
    }

    /* On the phone there is no hover. Tapping a top-level item used to jump
       straight into the section, so its sub-pages were never seen. Now it opens
       the list; the section is reached by choosing one of those sub-pages. */
    var drawerParents = document.querySelectorAll('.drawer-nav .nav-group > .nav-row > a');
    for (var dp = 0; dp < drawerParents.length; dp++) {
      drawerParents[dp].addEventListener('click', function (e) {
        var group = this.closest('.nav-group');
        if (!group || !group.querySelector('.nav-sub')) { return; }
        e.preventDefault();
        collapseDrawerGroups(group);
        var willOpen = !group.classList.contains('open');
        group.classList.toggle('open', willOpen);
        var t = group.querySelector('.nav-toggle');
        if (t) { t.setAttribute('aria-expanded', willOpen ? 'true' : 'false'); }
        this.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    }

    /* Click outside closes an open desktop dropdown. Scoped to .main-nav so it
       never collapses the drawer accordion, whose groups are opened deliberately. */
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.nav-group')) { return; }
      var open = document.querySelectorAll('.main-nav .nav-group.open');
      for (var i = 0; i < open.length; i++) {
        open[i].classList.remove('open');
        var t = open[i].querySelector('.nav-toggle');
        if (t) { t.setAttribute('aria-expanded', 'false'); }
      }
    });

    function revealAll() {
      var pending = document.querySelectorAll('.view.is-active .reveal:not(.is-visible)');
      for (var i = 0; i < pending.length; i++) { pending[i].classList.add('is-visible'); }
    }

    /* ===== Page title, driven by the already-translated nav text so this
       never needs its own string table. The big heading at the top of each
       view now names the sub-page the visitor is on, which is why the view
       name and its lead line were removed from the markup. ===== */
    function updateNavContext(viewId, subId) {
      var slot = document.querySelector('.view.is-active [data-page-title]');
      if (viewId === 'home') {
        document.title = '주식회사 카리바이오 — 천연 미네랄 소재';
        return;
      }
      var viewLink = document.querySelector('.main-nav [data-view="' + viewId + '"]');
      if (!viewLink) {
        /* 한 대메뉴가 여러 뷰를 묶는 경우(비즈니스 = business + partnership)
           그 그룹의 대메뉴 이름을 쓴다. */
        var groups = document.querySelectorAll('.main-nav .nav-group[data-group]');
        for (var gi = 0; gi < groups.length; gi++) {
          if (groups[gi].getAttribute('data-group').split(' ').indexOf(viewId) !== -1) {
            viewLink = groups[gi].querySelector('.nav-parent');
            break;
          }
        }
      }
      var viewName = viewLink ? viewLink.textContent.trim() : '';
      var subName = '';
      if (subId) {
        var subLink = document.querySelector('.main-nav [data-subview="' + subId + '"]');
        subName = subLink ? subLink.textContent.trim() : '';
      }
      document.title = (subName ? subName + ' · ' : '') + viewName + ' | 주식회사 카리바이오';
      if (slot) { slot.textContent = subName || viewName; }

      /* Several sub-pages open with a heading that repeats the page title we
         just set. Showing the same words twice reads as a mistake, so the
         inner one steps aside where it is an exact repeat. */
      var heads = document.querySelectorAll('.view.is-active .tech-block:not([hidden]) > .block-title, .view.is-active .product-group:not([hidden]) > .block-title');
      for (var h = 0; h < heads.length; h++) {
        var norm = function (t) { return t.replace(/\s+/g, ''); };
        var dup = norm(heads[h].textContent) === norm(subName || viewName);
        heads[h].hidden = dup;
      }
    }

    /* ===== Focus the new content's heading after a user-driven navigation,
       so keyboard/screen-reader users land somewhere meaningful. Never runs
       on the very first page load. ===== */
    function focusActiveTitle(viewId, subId) {
      var titleEl = null;
      if (subId) {
        var subEl = document.getElementById(subId);
        titleEl = subEl && subEl.querySelector('.block-title');
      }
      if (!titleEl) {
        var viewEl = document.getElementById(viewId);
        titleEl = viewEl && viewEl.querySelector('.section-title, .hero-headline');
      }
      if (!titleEl) { return; }
      if (!titleEl.hasAttribute('tabindex')) { titleEl.setAttribute('tabindex', '-1'); }
      titleEl.focus({ preventScroll: true });
    }

    /* A hash change can come from a normal in-page link click (should still
       jump to the top of the new page/subview) or from the browser's
       back/forward navigation (should leave scroll position alone, since the
       visitor is returning to where they were). We tag the former by
       watching clicks on internal hash links just before the browser acts on
       them; anything else that changes the hash is treated as history
       navigation. */
    var lastView = null;
    var lastSub = null;
    var scrollGuardUntil = 0;
    var scrollGuardRunning = false;
    var releaseGuard = function () { scrollGuardUntil = 0; };
    window.addEventListener('wheel', releaseGuard, { passive: true });
    window.addEventListener('touchstart', releaseGuard, { passive: true });
    window.addEventListener('keydown', releaseGuard);

    var navigatedByClick = false;
    document.addEventListener('click', function (e) {
      var link = e.target && e.target.closest && e.target.closest('a[href^="#"]');
      if (link) { navigatedByClick = true; }
    }, true);

    function route(isInitial, isHistoryNav) {
      var viewId = getViewFromHash();
      showView(viewId);
      var activeSub = showSubview(viewId, getSubsectionFromHash());
      lastView = viewId;
      lastSub = activeSub;
      updateNavContext(viewId, activeSub);
      revealAll();
      /* 스토리 뷰에서는 해시가 '다른 페이지'가 아니라 '같은 페이지 안의 구간'을
         가리킨다. 이때 맨 위로 되돌리는 가드가 걸리면 구간 이동이 막힌다. */
      var staysInStory = STORY_VIEWS[viewId] && lastStoryView === viewId;
      lastStoryView = STORY_VIEWS[viewId] ? viewId : null;
      if (!staysInStory) { /* every route change opens its page at the top */
        /* The browser performs its own fragment jump once the document has
           finished loading, which lands the visitor mid-page under the fixed
           header. Reset on the next frame and again on load so a deep link
           still opens at the top of its page. */
        var toTop = function () {
          window.scrollTo(0, 0);
          if (appContent) { appContent.scrollTop = 0; }
        };
        toTop();
        /* Every hash here names a page, but the browser also treats it as an
           anchor and jumps to that element once it is rendered — which lands
           the visitor mid-page, under the fixed header. Hold the top for a
           moment, and stop the moment the visitor scrolls on their own. */
        scrollGuardUntil = Date.now() + 1200;
        if (!scrollGuardRunning) {
          scrollGuardRunning = true;
          (function hold() {
            if (Date.now() > scrollGuardUntil) { scrollGuardRunning = false; return; }
            if (window.scrollY !== 0) { toTop(); }
            requestAnimationFrame(hold);
          })();
        }
      }
      if (!isInitial) { focusActiveTitle(viewId, activeSub); }
    }

    /* Re-label the heading only — a language switch must not move the page. */
    onLangApplied = function () {
      if (lastView) { updateNavContext(lastView, lastSub); }
    };

    window.addEventListener('hashchange', function () {
      var isHistoryNav = !navigatedByClick;
      navigatedByClick = false;
      route(false, isHistoryNav);
    });
    if (window.history && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (!window.location.hash && window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '#home');
    }

    /* A deep link such as index.html#mat-tests names a page for us, but to the
       browser it is also an anchor: once that element is rendered it scrolls
       there, dropping the visitor into the middle of the page beneath the
       fixed header. Clearing the hash before routing and writing it back with
       replaceState afterwards gives us the route without the jump. */
    (function openAtTop() {
      /* 해시는 페이지 이름이지만 브라우저에겐 앵커이기도 하다. URL 에 남아
         있는 동안 브라우저는 그 요소로 계속 스크롤을 시도하고, 늦게 뜨는
         이미지가 레이아웃을 바꿀 때마다 다시 시도한다. 그래서 로드 내내
         해시를 URL 에서 빼두고, 브라우저가 더 찾지 않을 때 되돌려 놓는다. */
      var entry = window.location.hash || '#home';
      var base = window.location.pathname + window.location.search;
      var canRewrite = !!(window.history && window.history.replaceState);

      if (!canRewrite) { route(true, false); return; }

      routedHash = entry.replace('#', '');
      window.history.replaceState(null, '', base);
      route(true, false);

      var restore = function () {
        if (routedHash === null) { return; }
        window.history.replaceState(null, '', window.location.pathname + window.location.search + entry);
        routedHash = null;
      };
      if (document.readyState === 'complete') { window.setTimeout(restore, 60); }
      else { window.addEventListener('load', function () { window.setTimeout(restore, 60); }); }
    })();

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') { return; }
      if (drawer && drawer.classList.contains('open')) { closeDrawer(); }
      var openGroups = document.querySelectorAll('.main-nav .nav-group.open');
      for (var g = 0; g < openGroups.length; g++) { openGroups[g].classList.remove('open'); }
    });

    /* ===== Product CTA prefills the inquiry type ===== */
    var productCtas = document.querySelectorAll('.product-cta');
    for (var m = 0; m < productCtas.length; m++) {
      productCtas[m].addEventListener('click', function () {
        var sel = document.getElementById('inquiryType');
        var val = this.getAttribute('data-inquiry');
        if (sel && val) { sel.value = val; }
      });
    }

    /* ===== Contact form → mailto ===== */
    var form = document.getElementById('contactForm');
    var formNote = document.getElementById('formNote');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var type = form.inquiryType.options[form.inquiryType.selectedIndex].text;
        var subject = encodeURIComponent('[Partnership Inquiry] ' + type + ' - ' + form.company.value);
        var body = encodeURIComponent(
          'Inquiry Type: ' + type + '\n' +
          'Company: ' + form.company.value + '\n' +
          'Name: ' + form.name.value + '\n' +
          'Email: ' + form.email.value + '\n' +
          'Phone: ' + form.phone.value + '\n' +
          'Country: ' + form.country.value + '\n' +
          'Expected Volume: ' + form.volume.value + '\n\n' +
          'Message:\n' + form.message.value
        );
        window.location.href = 'mailto:kalibio1101@naver.com?subject=' + subject + '&body=' + body;
        if (formNote) { formNote.hidden = false; }
      });
    }

    /* ===== 브랜드 > 스토리 — 패럴랙스 =====
       왼쪽 글이 지나가는 동안 오른쪽 이미지는 고정된 채 구간마다 바뀌고,
       구간에 지정된 배경색으로 띠 전체가 교차한다.
       구간 판정은 뷰포트 중앙선을 지나는 구간을 기하로 계산한다. */
    var bsSecs = document.querySelectorAll('.bs-sec');
    if (bsSecs.length) {
      var bsImgs = document.querySelectorAll('.bs-img');
      var bsScroll = document.querySelector('.bs-scroll');
      var bsAt = null;
      var setBs = function (n, bg) {
        if (n === bsAt) { return; }
        bsAt = n;
        for (var i = 0; i < bsImgs.length; i++) {
          bsImgs[i].classList.toggle('is-on', bsImgs[i].getAttribute('data-bs') === n);
        }
        if (bsScroll && bg) { bsScroll.setAttribute('data-bg', bg); }
      };
      var syncBs = function () {
        var mid = window.innerHeight / 2, pick = null;
        for (var i = 0; i < bsSecs.length; i++) {
          var r = bsSecs[i].getBoundingClientRect();
          if (r.top <= mid && r.bottom >= mid) { pick = bsSecs[i]; break; }
          if (!pick && r.top > mid) { pick = bsSecs[i]; break; }
        }
        if (!pick) { pick = bsSecs[bsSecs.length - 1]; }
        setBs(pick.getAttribute('data-bs'), pick.getAttribute('data-bg'));
      };
      var bsLast = 0, bsTrail = null;
      var onBsScroll = function () {
        var now = Date.now();
        if (now - bsLast >= 60) { bsLast = now; syncBs(); }
        window.clearTimeout(bsTrail);
        bsTrail = window.setTimeout(function () { bsLast = Date.now(); syncBs(); }, 90);
      };
      window.addEventListener('scroll', onBsScroll, { passive: true });
      window.addEventListener('resize', onBsScroll, { passive: true });
      /* 탭이 화면에 없으면 scroll 이벤트가 오지 않는 경우가 있어 보강 */
      if ('IntersectionObserver' in window) {
        var bsObs = new IntersectionObserver(function () { syncBs(); },
          { threshold: [0, 0.25, 0.5, 0.75, 1] });
        for (var q = 0; q < bsSecs.length; q++) { bsObs.observe(bsSecs[q]); }
      }
      syncBs();
    }

    /* ===== 제품 및 주요 공정: 중메뉴(제품 / 주요 공정)를 눌러야 소메뉴가 열린다 ===== */
    var subHeads = document.querySelectorAll('.nav-sub-head.is-toggle');
    for (var sh = 0; sh < subHeads.length; sh++) {
      subHeads[sh].addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var grp = this.parentNode;
        var willOpen = !grp.classList.contains('open');
        /* 같은 드롭다운 안에서는 하나만 열어 둔다 */
        var siblings = grp.parentNode.querySelectorAll('.nav-sub-group');
        for (var q = 0; q < siblings.length; q++) {
          siblings[q].classList.remove('open');
          var b = siblings[q].querySelector('.nav-sub-head.is-toggle');
          if (b) { b.setAttribute('aria-expanded', 'false'); }
        }
        grp.classList.toggle('open', willOpen);
        this.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    }
    /* 현재 보고 있는 소메뉴가 속한 묶음은 펼쳐 둔다 */
    var openOwningGroup = function () {
      var active = document.querySelectorAll('.nav-sub-items .nav-sub-link.active');
      for (var a = 0; a < active.length; a++) {
        var g = active[a].closest('.nav-sub-group');
        if (g) {
          g.classList.add('open');
          var btn = g.querySelector('.nav-sub-head.is-toggle');
          if (btn) { btn.setAttribute('aria-expanded', 'true'); }
        }
      }
    };
    window.addEventListener('hashchange', function () { window.setTimeout(openOwningGroup, 30); });
    openOwningGroup();

    /* ===== 사업 분야 사진 넘기기 (화살표 + 막대 표시) =====
       사진이 한 장뿐이면 조작 요소를 감춘다. */
    var shotSets = document.querySelectorAll('[data-ba-shots]');
    for (var si = 0; si < shotSets.length; si++) {
      (function (box) {
        var imgs = box.querySelectorAll('.ba-track img');
        var dots = box.querySelector('.ba-dots');
        var prev = box.querySelector('.ba-prev');
        var next = box.querySelector('.ba-next');
        if (imgs.length < 2) {
          if (prev) { prev.hidden = true; }
          if (next) { next.hidden = true; }
          if (dots) { dots.hidden = true; }
          return;
        }
        var at = 0;
        for (var d = 0; d < imgs.length; d++) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'ba-dot';
          b.setAttribute('aria-label', (d + 1) + '번째 사진');
          (function (idx) { b.addEventListener('click', function () { go(idx); }); })(d);
          dots.appendChild(b);
        }
        function go(n) {
          at = (n + imgs.length) % imgs.length;
          for (var k = 0; k < imgs.length; k++) { imgs[k].classList.toggle('is-on', k === at); }
          var ds = dots.querySelectorAll('.ba-dot');
          for (var j = 0; j < ds.length; j++) { ds[j].classList.toggle('is-on', j === at); }
        }
        prev.addEventListener('click', function () { go(at - 1); });
        next.addEventListener('click', function () { go(at + 1); });
        go(0);
      })(shotSets[si]);
    }

    /* ===== Reveal on scroll ===== */
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      var reveals = document.querySelectorAll('.reveal');
      for (var r = 0; r < reveals.length; r++) { observer.observe(reveals[r]); }
    } else {
      var allReveals = document.querySelectorAll('.reveal');
      for (var s = 0; s < allReveals.length; s++) { allReveals[s].classList.add('is-visible'); }
    }
  });
})();
