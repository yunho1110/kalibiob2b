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
    var hamburger = document.getElementById('hamburgerBtn');
    var drawer = document.getElementById('mobileDrawer');
    var drawerCloseBtn = document.getElementById('drawerCloseBtn');

    function openDrawer() {
      if (!drawer) { return; }
      /* Expand the section the visitor is already in, so its sub-pages are
         visible the moment the menu opens rather than hidden behind a chevron. */
      var activeView = (document.querySelector('.view.is-active') || {}).id;
      var groups = drawer.querySelectorAll('.nav-group[data-group]');
      for (var g = 0; g < groups.length; g++) {
        var match = groups[g].getAttribute('data-group') === activeView;
        groups[g].classList.toggle('open', match);
        var tg = groups[g].querySelector('.nav-toggle');
        if (tg) { tg.setAttribute('aria-expanded', match ? 'true' : 'false'); }
      }
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      if (hamburger) { hamburger.setAttribute('aria-expanded', 'true'); }
      document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
      if (!drawer) { return; }
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      if (hamburger) { hamburger.setAttribute('aria-expanded', 'false'); }
      document.body.style.overflow = '';
    }
    if (hamburger && drawer) {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.addEventListener('click', function () {
        if (drawer.classList.contains('open')) { closeDrawer(); } else { openDrawer(); }
      });
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
    }

    /* ===== Hash routing ===== */
    var VALID_VIEWS = ['home', 'material', 'business', 'products', 'about', 'partnership', 'contact'];
    var HASH_ALIASES = { hero: 'home', why: 'about', partners: 'partnership', technology: 'material' };
    var SUBVIEW_GROUPS = {
      material: ['mat-story', 'mat-comp', 'mat-uses', 'mat-props', 'mat-tests'],
      business: ['biz-material', 'biz-goods', 'biz-oem'],
      products: ['prod-soap', 'prod-paste', 'prod-process'],
      about: ['about-info', 'about-origin', 'about-vision', 'about-why', 'about-principles'],
      partnership: ['part-current', 'part-global'],
      contact: ['contact-form', 'contact-faq']
    };
    var SUBVIEW_DEFAULT = {
      material: 'mat-story', business: 'biz-material', products: 'prod-soap',
      about: 'about-info', partnership: 'part-current', contact: 'contact-form'
    };
    var SUBSECTIONS = {};
    Object.keys(SUBVIEW_GROUPS).forEach(function (view) {
      SUBVIEW_GROUPS[view].forEach(function (id) { SUBSECTIONS[id] = view; });
    });
    /* old bookmarks keep working after the technology view was split in two */
    var LEGACY_SUBS = {
      'tech-raw': 'mat-comp', 'tech-eco': 'mat-uses', 'tech-industry': 'mat-uses',
      'tech-clinical': 'mat-props', 'tech-cert': 'mat-tests', 'tech-process': 'prod-process',
      'mat-components': 'mat-comp', 'mat-value': 'mat-uses', 'mat-efficacy': 'mat-props',
      'mat-cert': 'mat-tests', 'products-soap': 'prod-soap', 'products-toothpaste': 'prod-paste',
      'products-process': 'prod-process', 'products-oem': 'biz-oem',
      'about-overview': 'about-info', 'about-story': 'about-origin', 'about-milestones': 'about-info'
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
      for (var i = 0; i < group.length; i++) {
        var el = document.getElementById(group[i]);
        if (el) { el.hidden = (group[i] !== active); }
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
        var isCurrent = navGroups[k].getAttribute('data-group') === viewId;
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
      if (true) { /* every route change opens its page at the top */
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
      var entry = window.location.hash;
      var base = window.location.pathname + window.location.search;
      var canRewrite = !!(window.history && window.history.replaceState) && entry && entry !== '#home';
      if (canRewrite) {
        routedHash = entry.replace('#', '');
        window.history.replaceState(null, '', base);
      }
      route(true, false);
      if (canRewrite) {
        window.history.replaceState(null, '', base + entry);
        routedHash = null;
      }
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

    /* ===== Certificate lightbox ===== */
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
