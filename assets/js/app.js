/* KALIBIO B2B site — application logic
   Depends on: assets/js/i18n.js (defines window.I18N) */
(function () {
  'use strict';

  var SUPPORTED = ['ko', 'en', 'zh'];
  var LANG_KEY = 'kalibio.lang';
  var CONTACT_EMAIL = 'kalibio1101@naver.com';

  var currentLang = 'ko';
  /* Set once routing is wired up, so switching language also re-reads the
     nav labels that the big page heading is built from. */
  var onLangApplied = null;

  function getPath(obj, path) {
    return path.split('.').reduce(function (o, k) {
      return (o && o[k] !== undefined) ? o[k] : undefined;
    }, obj);
  }

  /* Look up a translated string for the language currently applied. */
  function t(key) {
    var entry = getPath(window.I18N, key);
    return (entry && entry[currentLang] !== undefined) ? entry[currentLang] : '';
  }

  /* ===================================================================
     Language
     -------------------------------------------------------------------
     Resolution order: an explicit ?lang= in the URL, then the visitor's
     previous choice, then the browser's own language, then Korean. The
     choice is written back to both localStorage and the URL, so a reload,
     a bookmark and a shared link all keep the language the reader picked.
     =================================================================== */
  function readStored() {
    try { return window.localStorage.getItem(LANG_KEY); } catch (e) { return null; }
  }
  function writeStored(lang) {
    try { window.localStorage.setItem(LANG_KEY, lang); } catch (e) { /* private mode */ }
  }
  function langFromUrl() {
    var m = /[?&]lang=([a-zA-Z-]+)/.exec(window.location.search);
    return m ? m[1].toLowerCase().slice(0, 2) : null;
  }
  function langFromBrowser() {
    var list = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < list.length; i++) {
      var code = String(list[i]).toLowerCase().slice(0, 2);
      if (SUPPORTED.indexOf(code) !== -1) { return code; }
    }
    return null;
  }
  function resolveLang() {
    var candidates = [langFromUrl(), readStored(), langFromBrowser()];
    for (var i = 0; i < candidates.length; i++) {
      if (candidates[i] && SUPPORTED.indexOf(candidates[i]) !== -1) { return candidates[i]; }
    }
    return 'ko';
  }
  function syncLangInUrl(lang) {
    if (!(window.history && window.history.replaceState)) { return; }
    var params = new URLSearchParams(window.location.search);
    if (lang === 'ko') { params.delete('lang'); } else { params.set('lang', lang); }
    var qs = params.toString();
    var url = window.location.pathname + (qs ? '?' + qs : '') + window.location.hash;
    window.history.replaceState(window.history.state, '', url);
  }

  function setLang(lang, opts) {
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
      var isActive = langBtns[j].getAttribute('data-lang') === lang;
      langBtns[j].classList.toggle('active', isActive);
      langBtns[j].setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }

    if (!opts || opts.persist !== false) { writeStored(lang); }
    syncLangInUrl(lang);
    if (onLangApplied) { onLangApplied(); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    /* Content ships visible in the HTML. Only once this script is running do
       the reveal animations get armed, so a failed or blocked script can
       never leave the page blank. */
    document.documentElement.classList.add('js-reveal');

    setLang(resolveLang(), { persist: false });

    var langButtons = document.querySelectorAll('.lang-btn');
    for (var i = 0; i < langButtons.length; i++) {
      langButtons[i].addEventListener('click', function () {
        setLang(this.getAttribute('data-lang'));
      });
    }

    /* =================================================================
       Mobile drawer — a real modal dialog
       -----------------------------------------------------------------
       Closed, it is display:none, so its links leave the tab order
       entirely instead of sitting invisibly in front of the page at every
       width. Open, focus moves inside, Tab cycles within it, the page
       behind is inert, and closing returns focus to the button that
       opened it.
       ================================================================= */
    var hamburger = document.getElementById('hamburgerBtn');
    var drawer = document.getElementById('mobileDrawer');
    var drawerCloseBtn = document.getElementById('drawerCloseBtn');
    var backdropLayers = [
      document.getElementById('appContent'),
      document.getElementById('siteNav'),
      document.getElementById('appTopbar')
    ].filter(Boolean);
    var mountTimer = null;

    function focusablesIn(root) {
      var sel = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
      return Array.prototype.filter.call(root.querySelectorAll(sel), function (el) {
        return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
      });
    }

    function setBackdropInert(on) {
      backdropLayers.forEach(function (el) {
        if (on) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
        else { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
      });
    }

    function openDrawer() {
      if (!drawer || drawer.classList.contains('open')) { return; }
      window.clearTimeout(mountTimer);

      /* Expand the section the visitor is already in, so its sub-pages are
         visible the moment the menu opens rather than hidden behind a chevron. */
      var activeView = (document.querySelector('.view.is-active') || {}).id;
      var groups = drawer.querySelectorAll('.nav-group[data-group]');
      for (var g = 0; g < groups.length; g++) {
        var match = groups[g].getAttribute('data-group') === activeView;
        groups[g].classList.toggle('open', match);
        var row = groups[g].querySelector('.nav-row');
        if (row) { row.setAttribute('aria-expanded', match ? 'true' : 'false'); }
      }

      drawer.classList.add('is-mounted');
      drawer.setAttribute('aria-hidden', 'false');
      /* Reading a layout property flushes the style change above, so the
         transform transition has a starting value. Doing it synchronously
         rather than in requestAnimationFrame matters: rAF is throttled in
         background tabs, and the menu would mount without ever sliding in. */
      void drawer.offsetHeight;
      drawer.classList.add('open');
      if (hamburger) { hamburger.setAttribute('aria-expanded', 'true'); }
      setBackdropInert(true);
      document.body.style.overflow = 'hidden';

      var first = focusablesIn(drawer)[0];
      if (first) { first.focus(); }
    }

    function closeDrawer(opts) {
      if (!drawer || !drawer.classList.contains('is-mounted')) { return; }
      var wasOpen = drawer.classList.contains('open');
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      if (hamburger) { hamburger.setAttribute('aria-expanded', 'false'); }
      setBackdropInert(false);
      document.body.style.overflow = '';

      /* keep it mounted until the slide-up finishes, then drop it out of
         the tab order completely */
      window.clearTimeout(mountTimer);
      mountTimer = window.setTimeout(function () {
        drawer.classList.remove('is-mounted');
      }, 320);

      if (wasOpen && (!opts || opts.restoreFocus !== false) && hamburger) {
        hamburger.focus();
      }
    }

    if (hamburger && drawer) {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.addEventListener('click', function () {
        if (drawer.classList.contains('open')) { closeDrawer(); } else { openDrawer(); }
      });
    }
    if (drawerCloseBtn) { drawerCloseBtn.addEventListener('click', function () { closeDrawer(); }); }

    /* Tab cycles inside the open drawer instead of escaping to the page. */
    if (drawer) {
      drawer.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab' || !drawer.classList.contains('open')) { return; }
        var items = focusablesIn(drawer);
        if (!items.length) { return; }
        var first = items[0];
        var last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      });
    }

    /* Choosing a sub-page closes the menu; the parent rows are disclosure
       controls and are handled separately below. */
    if (drawer) {
      var drawerLinks = drawer.querySelectorAll('a[href^="#"]');
      for (var k = 0; k < drawerLinks.length; k++) {
        drawerLinks[k].addEventListener('click', function () {
          closeDrawer({ restoreFocus: false });
        });
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
      contact: ['contact-form', 'contact-faq', 'contact-privacy']
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
        for (var s = 0; s < stale.length; s++) {
          stale[s].classList.remove('active');
          stale[s].removeAttribute('aria-current');
        }
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
        if (isTabActive) { tabs[j].setAttribute('aria-current', 'page'); }
        else { tabs[j].removeAttribute('aria-current'); }
      }
      return active;
    }

    function showView(viewId) {
      var views = document.querySelectorAll('.view');
      for (var i = 0; i < views.length; i++) {
        views[i].classList.toggle('is-active', views[i].id === viewId);
      }
      /* the drawer's top-level rows are buttons, not links, so they are
         matched by [data-view] rather than by tag */
      var navItems = document.querySelectorAll('.main-nav [data-view], .drawer-nav [data-view]');
      for (var j = 0; j < navItems.length; j++) {
        var isNavActive = navItems[j].getAttribute('data-view') === viewId;
        navItems[j].classList.toggle('active', isNavActive);
        if (isNavActive && navItems[j].tagName === 'A') {
          navItems[j].setAttribute('aria-current', 'page');
        } else {
          navItems[j].removeAttribute('aria-current');
        }
      }
      /* Mark the owning group, but never force a dropdown open — on desktop the
         sub-menu is a hover/focus panel, not a permanently expanded tree. */
      var navGroups = document.querySelectorAll('.main-nav .nav-group[data-group]');
      for (var k = 0; k < navGroups.length; k++) {
        navGroups[k].classList.toggle('is-current', navGroups[k].getAttribute('data-group') === viewId);
        navGroups[k].classList.remove('open');
      }
    }

    /* Only one drawer section stays open at a time, so the list never gets long. */
    function collapseDrawerGroups(keep) {
      var open = document.querySelectorAll('.drawer-nav .nav-group.open');
      for (var i = 0; i < open.length; i++) {
        if (open[i] === keep) { continue; }
        open[i].classList.remove('open');
        var row = open[i].querySelector('.nav-row');
        if (row) { row.setAttribute('aria-expanded', 'false'); }
      }
    }

    /* On the phone there is no hover. The whole row is the disclosure button —
       it carries aria-expanded itself, so the state is announced on the element
       the visitor actually taps. */
    var drawerRows = document.querySelectorAll('.drawer-nav .nav-row');
    for (var dr = 0; dr < drawerRows.length; dr++) {
      drawerRows[dr].addEventListener('click', function () {
        var group = this.closest('.nav-group');
        if (!group) { return; }
        collapseDrawerGroups(group);
        var willOpen = !group.classList.contains('open');
        group.classList.toggle('open', willOpen);
        this.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    }

    /* Click outside closes an open desktop dropdown. */
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.nav-group')) { return; }
      var open = document.querySelectorAll('.main-nav .nav-group.open');
      for (var i = 0; i < open.length; i++) { open[i].classList.remove('open'); }
    });

    function revealAll() {
      var pending = document.querySelectorAll('.view.is-active .reveal:not(.is-visible)');
      for (var i = 0; i < pending.length; i++) { pending[i].classList.add('is-visible'); }
    }

    /* ===== Page title, driven by the already-translated nav text so this
       never needs its own string table. The suffix comes from the dictionary
       too, so an English page no longer ends in a Korean company name. ===== */
    function updateNavContext(viewId, subId) {
      var slot = document.querySelector('.view.is-active [data-page-title]');
      var siteName = t('meta.siteName');
      if (viewId === 'home') {
        document.title = t('meta.homeTitle');
        return;
      }
      var viewLink = document.querySelector('.main-nav [data-view="' + viewId + '"]');
      var viewName = viewLink ? viewLink.textContent.trim() : '';
      var subName = '';
      if (subId) {
        var subLink = document.querySelector('.main-nav [data-subview="' + subId + '"]');
        subName = subLink ? subLink.textContent.trim() : '';
      }
      document.title = (subName ? subName + ' · ' : '') + viewName + ' | ' + siteName;
      if (slot) { slot.textContent = subName || viewName; }

      /* Several sub-pages open with a heading that repeats the page title we
         just set. Showing the same words twice reads as a mistake, so the
         inner one steps aside where it is an exact repeat. */
      var heads = document.querySelectorAll(
        '.view.is-active .tech-block:not([hidden]) > .block-title, ' +
        '.view.is-active .product-group:not([hidden]) > .block-title');
      var norm = function (x) { return x.replace(/\s+/g, ''); };
      for (var h = 0; h < heads.length; h++) {
        heads[h].hidden = norm(heads[h].textContent) === norm(subName || viewName);
      }
    }

    /* ===== Focus the new content's heading after a user-driven navigation,
       so keyboard/screen-reader users land somewhere meaningful. Never runs
       on the very first page load. ===== */
    function focusActiveTitle(viewId, subId) {
      var titleEl = null;
      if (subId) {
        var subEl = document.getElementById(subId);
        titleEl = subEl && subEl.querySelector('.block-title:not([hidden])');
      }
      if (!titleEl) {
        var viewEl = document.getElementById(viewId);
        titleEl = viewEl && viewEl.querySelector('.section-title, .home-tagline');
      }
      if (!titleEl) { return; }
      if (!titleEl.hasAttribute('tabindex')) { titleEl.setAttribute('tabindex', '-1'); }
      titleEl.focus({ preventScroll: true });
    }

    /* Every hash here names a page, but the browser also treats it as an
       anchor and jumps to that element once it is rendered — which lands the
       visitor mid-page, under the fixed header. Hold the top briefly, and let
       go the moment the visitor scrolls by any means: wheel, touch, keyboard,
       or dragging the scrollbar (which fires none of the first three). */
    var lastView = null;
    var lastSub = null;
    var scrollGuardUntil = 0;
    var scrollGuardRunning = false;
    var userScrolled = false;
    var releaseGuard = function () { userScrolled = true; scrollGuardUntil = 0; };
    /* pointerdown covers dragging the scrollbar, which fires none of the
       other three and used to leave the guard fighting the visitor. */
    window.addEventListener('wheel', releaseGuard, { passive: true });
    window.addEventListener('touchstart', releaseGuard, { passive: true });
    window.addEventListener('pointerdown', releaseGuard, { passive: true });
    window.addEventListener('keydown', releaseGuard);
    /* Never shorten an active guard — only extend it. */
    window.addEventListener('load', function () {
      if (!userScrolled && scrollGuardUntil) {
        scrollGuardUntil = Math.max(scrollGuardUntil, Date.now() + 250);
      }
    });

    function route(isInitial) {
      var viewId = getViewFromHash();
      showView(viewId);
      var activeSub = showSubview(viewId, getSubsectionFromHash());
      lastView = viewId;
      lastSub = activeSub;
      updateNavContext(viewId, activeSub);
      revealAll();

      var toTop = function () {
        window.scrollTo(0, 0);
        if (appContent) { appContent.scrollTop = 0; }
      };
      toTop();
      userScrolled = false;
      scrollGuardUntil = Date.now() + 1200;
      if (!scrollGuardRunning) {
        scrollGuardRunning = true;
        /* setTimeout rather than requestAnimationFrame: rAF stops in a
           background tab, and the guard has to survive the visitor switching
           away and back mid-navigation. */
        (function hold() {
          if (userScrolled || Date.now() > scrollGuardUntil) { scrollGuardRunning = false; return; }
          if (window.scrollY !== 0) { toTop(); }
          window.setTimeout(hold, 16);
        })();
      }

      if (!isInitial) { focusActiveTitle(viewId, activeSub); }
    }

    /* Re-label the heading only — a language switch must not move the page. */
    onLangApplied = function () {
      if (lastView) { updateNavContext(lastView, lastSub); }
    };

    window.addEventListener('hashchange', function () { route(false); });

    if (window.history && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    /* A deep link such as index.html#mat-tests names a page for us, but to the
       browser it is also an anchor: while that fragment is in the URL, the
       browser keeps trying to scroll to the matching element — and it retries
       as late-loading images settle the layout, which is well past any
       plausible timer. So the fragment is taken out of the URL for the whole
       load, and written back only once the browser has stopped looking for
       it. The route itself is driven from the captured value meanwhile. */
    (function openAtTop() {
      /* "#home" is an element id too, so it scrolls the hero out of frame
         exactly like the others — it goes through the same path, and an
         entirely missing hash is normalised to it. */
      var entry = window.location.hash || '#home';
      var base = window.location.pathname + window.location.search;
      var canRewrite = !!(window.history && window.history.replaceState);

      if (!canRewrite) { route(true); return; }

      routedHash = entry.replace('#', '');
      window.history.replaceState(null, '', base);
      route(true);

      var restore = function () {
        if (routedHash === null) { return; }
        window.history.replaceState(null, '', window.location.pathname + window.location.search + entry);
        routedHash = null;
      };
      /* after load, plus a frame for the final layout pass */
      if (document.readyState === 'complete') {
        window.setTimeout(restore, 60);
      } else {
        window.addEventListener('load', function () { window.setTimeout(restore, 60); });
      }
      /* safety net if `load` never fires (a stalled image, a blocked request) */
      window.setTimeout(restore, 4000);
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

    /* =================================================================
       Contact form
       -----------------------------------------------------------------
       This is a static site, so the form hands the message to the
       visitor's mail app. That can silently do nothing — no mail client
       configured, webmail-only desktops, some mobile browsers — so it
       must never claim the inquiry was received. It says what it is
       actually doing, shows the address, and offers the composed message
       on the clipboard so it can be pasted into webmail.
       ================================================================= */
    var form = document.getElementById('contactForm');
    var formNote = document.getElementById('formNote');

    function composeMessage() {
      var type = form.inquiryType.options[form.inquiryType.selectedIndex].text;
      return [
        'Inquiry Type: ' + type,
        'Company: ' + form.company.value,
        'Name: ' + form.name.value,
        'Email: ' + form.email.value,
        'Phone: ' + form.phone.value,
        'Country: ' + form.country.value,
        'Expected Volume: ' + form.volume.value,
        '',
        'Message:',
        form.message.value
      ].join('\n');
    }

    function copyToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
      return new Promise(function (resolve, reject) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
        document.body.removeChild(ta);
        ok ? resolve() : reject();
      });
    }

    function showNote(html, isError) {
      if (!formNote) { return; }
      formNote.innerHTML = html;
      formNote.classList.toggle('form-note--error', !!isError);
      formNote.hidden = false;
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var consent = document.getElementById('privacyConsent');
        if (consent && !consent.checked) {
          showNote(t('contact.consentRequired'), true);
          consent.focus();
          return;
        }

        var type = form.inquiryType.options[form.inquiryType.selectedIndex].text;
        var body = composeMessage();
        var href = 'mailto:' + CONTACT_EMAIL +
          '?subject=' + encodeURIComponent('[Partnership Inquiry] ' + type + ' - ' + form.company.value) +
          '&body=' + encodeURIComponent(body);

        showNote(
          '<strong>' + t('contact.noteTitle') + '</strong>' +
          t('contact.noteBody') +
          ' <a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a>' +
          ' <button type="button" class="btn btn-outline form-copy" id="copyInquiry">' +
          t('contact.noteCopy') + '</button>'
        );

        var copyBtn = document.getElementById('copyInquiry');
        if (copyBtn) {
          copyBtn.addEventListener('click', function () {
            var self = this;
            copyToClipboard(body).then(function () {
              self.textContent = t('contact.noteCopied');
            }, function () {
              self.textContent = CONTACT_EMAIL;
            });
          });
        }

        window.location.href = href;
      });
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
