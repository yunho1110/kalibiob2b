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
      var drawerLinks = drawer.querySelectorAll('a');
      for (var k = 0; k < drawerLinks.length; k++) {
        drawerLinks[k].addEventListener('click', closeDrawer);
      }
    }

    /* ===== Hash routing ===== */
    var VALID_VIEWS = ['home', 'about', 'business', 'material', 'products', 'partnership', 'contact'];
    var HASH_ALIASES = { hero: 'home', why: 'about', partners: 'partnership', technology: 'material' };
    var SUBVIEW_GROUPS = {
      about: ['about-overview', 'about-story', 'about-vision', 'about-milestones'],
      material: ['mat-components', 'mat-value', 'mat-efficacy', 'mat-cert'],
      products: ['products-soap', 'products-toothpaste', 'products-process', 'products-oem']
    };
    var SUBVIEW_DEFAULT = { about: 'about-overview', material: 'mat-components', products: 'products-soap' };
    var SUBSECTIONS = {};
    Object.keys(SUBVIEW_GROUPS).forEach(function (view) {
      SUBVIEW_GROUPS[view].forEach(function (id) { SUBSECTIONS[id] = view; });
    });
    /* old bookmarks keep working after the technology view was split in two */
    var LEGACY_SUBS = {
      'tech-raw': 'mat-components', 'tech-eco': 'mat-value', 'tech-industry': 'mat-value',
      'tech-clinical': 'mat-efficacy', 'tech-cert': 'mat-cert', 'tech-process': 'products-process'
    };
    Object.keys(LEGACY_SUBS).forEach(function (old) {
      SUBSECTIONS[old] = SUBSECTIONS[LEGACY_SUBS[old]];
    });

    var appContent = document.getElementById('appContent');

    function currentHash() { return (window.location.hash || '').replace('#', ''); }

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
        var stale = document.querySelectorAll('[data-subview].active');
        for (var s = 0; s < stale.length; s++) { stale[s].classList.remove('active'); }
        return;
      }
      var active = (target && group.indexOf(target) !== -1) ? target : SUBVIEW_DEFAULT[viewId];
      for (var i = 0; i < group.length; i++) {
        var el = document.getElementById(group[i]);
        if (el) { el.hidden = (group[i] !== active); }
      }
      var tabs = document.querySelectorAll('[data-subview]');
      for (var j = 0; j < tabs.length; j++) {
        tabs[j].classList.toggle('active', tabs[j].getAttribute('data-subview') === active);
      }
    }

    function showView(viewId) {
      var views = document.querySelectorAll('.view');
      for (var i = 0; i < views.length; i++) {
        views[i].classList.toggle('is-active', views[i].id === viewId);
      }
      var navAnchors = document.querySelectorAll('.sidebar-nav a[data-view], .drawer-nav a[data-view]');
      for (var j = 0; j < navAnchors.length; j++) {
        navAnchors[j].classList.toggle('active', navAnchors[j].getAttribute('data-view') === viewId);
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
        var willOpen = !group.classList.contains('open');
        group.classList.toggle('open', willOpen);
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

    function route() {
      var viewId = getViewFromHash();
      showView(viewId);
      showSubview(viewId, getSubsectionFromHash());
      var resetScroll = function () {
        window.scrollTo(0, 0);
        if (appContent) { appContent.scrollTop = 0; }
      };
      resetScroll();
      setTimeout(function () { resetScroll(); revealAll(); }, 0);
    }

    window.addEventListener('hashchange', route);
    if (!window.location.hash && window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '#home');
    }
    route();

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') { return; }
      if (drawer && drawer.classList.contains('open')) { closeDrawer(); }
      var openGroups = document.querySelectorAll('.main-nav .nav-group.open');
      for (var g = 0; g < openGroups.length; g++) { openGroups[g].classList.remove('open'); }
      if (certLb && certLb.classList.contains('open')) { closeCertLb(); }
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
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var type = form.inquiryType.options[form.inquiryType.selectedIndex].text;
        var subject = encodeURIComponent('[Partnership Inquiry] ' + type + ' - ' + form.company.value);
        var body = encodeURIComponent(
          'Inquiry Type: ' + type + '\n' +
          'Company: ' + form.company.value + '\n' +
          'Country: ' + form.country.value + '\n' +
          'Expected Volume: ' + form.volume.value + '\n\n' +
          'Message:\n' + form.message.value
        );
        window.location.href = 'mailto:kalibio1101@naver.com?subject=' + subject + '&body=' + body;
      });
    }

    /* ===== Certificate lightbox ===== */
    var certLb = document.getElementById('certLightbox');
    var certLbImg = document.getElementById('certLightboxImg');
    var certLbClose = document.getElementById('certLightboxClose');

    function openCertLb(src, alt) {
      if (!certLb) { return; }
      certLbImg.setAttribute('src', src);
      certLbImg.setAttribute('alt', alt || '');
      certLb.classList.add('open');
      certLb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeCertLb() {
      if (!certLb) { return; }
      certLb.classList.remove('open');
      certLb.setAttribute('aria-hidden', 'true');
      certLbImg.setAttribute('src', '');
      document.body.style.overflow = '';
    }
    var certCards = document.querySelectorAll('.cert-card');
    for (var c = 0; c < certCards.length; c++) {
      (function (card) {
        var img = card.querySelector('.cert-thumb img');
        if (!img) { return; }
        card.setAttribute('data-has-image', 'true');
        card.querySelector('.cert-thumb').addEventListener('click', function () {
          openCertLb(img.getAttribute('src'), img.getAttribute('alt'));
        });
      })(certCards[c]);
    }
    if (certLbClose) { certLbClose.addEventListener('click', closeCertLb); }
    if (certLb) {
      certLb.addEventListener('click', function (e) { if (e.target === certLb) { closeCertLb(); } });
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
