/* 제품 — B2B 제품 목록 · 필터 · 상세 화면 (10.06 지시서, 다은)
   ─ 제품 데이터는 이 파일의 PRODUCTS 한 곳에서만 관리한다. 목록과 상세가 같이 쓴다.
   ─ 문구는 i18n.js 의 기존 키(products.* / specs.* / k28b.*)를 우선 쓰고,
     없는 것만 여기 {ko,en,zh} 로 둔다.
   ─ 상세 URL: index.html?p=<제품ID>#prod-soap  (해시 라우팅은 app.js 그대로 사용)
   ─ 가격·최소 주문 수량·납기·인증은 확인된 데이터가 없어 '문의 필요'로 표시한다.
   이 파일은 제품 담당자만 수정합니다. */
(function () {
  'use strict';

  /* ---------- 공통 문구 ---------- */
  var TXT = {
    all: { ko: '전체', en: 'All', zh: '全部' },
    soap: { ko: '비누 단독형', en: 'Soap Only', zh: '香皂单品型' },
    paste: { ko: '치약', en: 'Toothpaste', zh: '牙膏' },
    set: { ko: '비누·치약 세트형', en: 'Soap + Toothpaste Set', zh: '香皂·牙膏组合型' },
    detail: { ko: '상세 보기', en: 'View Details', zh: '查看详情' },
    back: { ko: '← 제품 목록으로', en: '← Back to Products', zh: '← 返回产品列表' },
    useFor: { ko: '권장 활용처', en: 'Recommended For', zh: '推荐用途' },
    overview: { ko: '제품 개요', en: 'Overview', zh: '产品概要' },
    compo: { ko: '구성품 및 옵션', en: 'Contents & Options', zh: '组成与选项' },
    quality: { ko: '품질 및 신뢰 정보', en: 'Quality & Trust', zh: '品质与信赖' },
    order: { ko: '주문 정보', en: 'Order Information', zh: '订购信息' },
    moq: { ko: '최소 주문 수량', en: 'Minimum Order', zh: '最低起订量' },
    lead: { ko: '납기', en: 'Lead Time', zh: '交期' },
    price: { ko: '가격', en: 'Price', zh: '价格' },
    ask: { ko: '문의 필요', en: 'On request', zh: '需咨询' },
    optAsk: { ko: '패키지·수량·구성 변경은 기업 주문 문의로 협의합니다.', en: 'Packaging, quantity and composition can be arranged through a corporate order inquiry.', zh: '包装、数量及组合调整可通过企业订购咨询协商。' },
    q1: { ko: '칼륨장석 성분: 한국광해광업공단 기술연구원 시험 (2024.4.30~5.22)', en: 'Potassium feldspar composition: tested by KOMIR Research Institute (30 Apr – 22 May 2024)', zh: '钾长石成分：韩国矿害矿业公团技术研究院检测 (2024.4.30~5.22)' },
    q2: { ko: '칼륨장석 분말 인체적용시험: 한국바이오임상연구센터 · 피험자 12명', en: 'Human application study of the powder: Korea Bio Research Center · 12 subjects', zh: '钾长石粉体人体应用试验：韩国生物临床研究中心 · 受试者12名' },
    orderNote: { ko: '이 제품으로 문의하면 문의 내용에 제품명이 자동으로 입력됩니다.', en: 'The product name is filled in for you when you inquire from this page.', zh: '从此页面咨询时，产品名称会自动填入。' },
    interest: { ko: '관심 제품', en: 'Product of interest', zh: '感兴趣的产品' }
  };
  var USES = [
    { t: { ko: '기업 행사', en: 'Corporate Events', zh: '企业活动' },
      d: { ko: '창립 기념일·세미나·박람회 등 행사 기념품으로', en: 'Keepsakes for anniversaries, seminars and trade shows', zh: '用作周年庆、研讨会、展会等活动纪念品' } },
    { t: { ko: '고객 증정', en: 'Client Gifts', zh: '客户赠礼' },
      d: { ko: '주요 고객·파트너사에 전하는 감사 선물로', en: 'A thank-you gift for key clients and partners', zh: '赠予重要客户与合作伙伴的感谢礼物' } },
    { t: { ko: '임직원 복지', en: 'Employee Welfare', zh: '员工福利' },
      d: { ko: '명절·기념일 임직원 복지 선물로', en: 'Holiday and anniversary gifts for employees', zh: '节日与纪念日员工福利礼品' } }
  ];

  /* ---------- 제품 데이터 (단일 소스) ----------
     name/bullets/specs 는 i18n 키, 그 외는 인라인 문구. type: soap | paste | set */
  var SOAP_USES = [0, 1, 2], SET_USES = [0, 1, 2];
  var PRODUCTS = [
    { id: 'karisoap-03', type: 'soap', view: 'prod-soap', img: 'assets/img/soap-03.webp', hover: 'assets/img/home-best-03.webp',
      name: 'products.soap03.name', size: '100g', bullets: ['products.soap03.b1', 'products.soap03.b2', 'products.soap03.b3'],
      specs: ['specs.e03', 'specs.i03', 'specs.u03'], uses: SOAP_USES },
    { id: 'karisoap-05', type: 'soap', view: 'prod-soap', img: 'assets/img/soap-05.webp', hover: 'assets/img/home-best-05.webp',
      name: 'products.soap05.name', size: '100g', bullets: ['products.soap05.b1', 'products.soap05.b2', 'products.soap05.b3'],
      specs: ['specs.e05', 'specs.i05', 'specs.u05'], uses: SOAP_USES },
    { id: 'karisoap-08', type: 'soap', view: 'prod-soap', img: 'assets/img/soap-08.webp',
      name: 'products.soap08.name', size: '100g', bullets: ['products.soap08.b1', 'products.soap08.b2', 'products.soap08.b3'],
      specs: ['specs.e08', 'specs.i08', 'specs.u08'], uses: SOAP_USES },
    { id: 'karisoap-13', type: 'soap', view: 'prod-soap', img: 'assets/img/soap-13.webp',
      name: 'products.soap13.name', size: '100g', bullets: ['products.soap13.b1', 'products.soap13.b2', 'products.soap13.b3'],
      specs: ['specs.e13', 'specs.i13', 'specs.u13'], uses: SOAP_USES },
    { id: 'karisoap-set-4', type: 'soap', view: 'prod-soap', img: 'assets/img/prod-set-soap4.webp', isSet: true,
      nameTxt: { ko: '카리비누 4구 세트', en: 'KALI Soap 4-Bar Set', zh: '卡里皂4块礼盒' },
      compo: { ko: '카리비누 4개 (구성 비누는 문의 시 선택)', en: '4 bars of KALI Soap (variants chosen on inquiry)', zh: '卡里皂4块（品种于咨询时选择）' },
      featTxt: [
        { ko: '카리비누 단독형 선물세트', en: 'A soap-only gift set', zh: '香皂单品型礼盒' },
        { ko: '칼륨장석 3%·5%·8%·13% 라인업에서 구성 선택', en: 'Choose from the 3% / 5% / 8% / 13% potassium feldspar line-up', zh: '可从钾长石3%·5%·8%·13%系列中选择' }
      ], uses: SET_USES },
    { id: 'k28-toothpaste', type: 'paste', view: 'prod-paste', img: 'assets/img/home-best-k28.webp', hover: 'assets/img/home-best-k28-hover.webp',
      name: 'products.k28.name', size: '150g', bullets: ['products.k28.b1', 'products.k28.b2', 'products.k28.b3'],
      specs: ['specs.ek28', 'specs.ik28', 'specs.uk28'], strengths: true, uses: SOAP_USES },
    { id: 'k28-set-5', type: 'paste', view: 'prod-paste', img: 'assets/img/prod-set-k28-5.webp', isSet: true,
      nameTxt: { ko: 'K.28 치약 5개 세트', en: 'K.28 Toothpaste 5-Pack Set', zh: 'K.28牙膏5支礼盒' },
      compo: { ko: 'K.28 치약 5개', en: '5 tubes of K.28 Toothpaste', zh: 'K.28牙膏5支' },
      featTxt: [
        { ko: '28가지 자연 유래 성분, 70일 저온 숙성', en: '28 naturally derived ingredients, 70-day cold aging', zh: '28种天然来源成分，70天低温熟成' },
        { ko: '합성 계면활성제(SLS) 무첨가', en: 'No synthetic surfactants (SLS)', zh: '不添加合成表面活性剂(SLS)' }
      ], strengths: true, uses: SET_USES },
    { id: 'gift-set', type: 'set', view: 'prod-soap', img: 'assets/img/prod-set-k28-soap.webp', isSet: true,
      nameTxt: { ko: '카리비누·K.28 치약 세트', en: 'KALI Soap + K.28 Toothpaste Set', zh: '卡里皂·K.28牙膏礼盒' },
      compo: { ko: 'K.28 치약 2개 + 카리비누 2개', en: '2 × K.28 Toothpaste + 2 × KALI Soap', zh: 'K.28牙膏2支 + 卡里皂2块' },
      featTxt: [
        { ko: '비누와 치약을 함께 담은 세트형 구성', en: 'Soap and toothpaste together in one set', zh: '香皂与牙膏同装的组合型' },
        { ko: '칼륨장석을 담은 데일리 케어 두 가지를 한 번에', en: 'Two potassium-feldspar daily-care products at once', zh: '一次送出两款含钾长石的日常护理产品' }
      ], strengths: true, uses: SET_USES }
  ];
  var BY_ID = {};
  PRODUCTS.forEach(function (p) { BY_ID[p.id] = p; });

  /* ---------- 번역 도우미 ---------- */
  function lang() { var l = document.documentElement.getAttribute('lang'); return /^(ko|en|zh)$/.test(l) ? l : 'ko'; }
  function L(o) { return o ? (o[lang()] !== undefined ? o[lang()] : o.ko) : ''; }
  function K(key) {
    var cur = window.I18N, parts = key.split('.');
    for (var i = 0; i < parts.length && cur; i++) { cur = cur[parts[i]]; }
    return cur ? L(cur) : '';
  }
  function strip(html) { var d = document.createElement('div'); d.innerHTML = html; return d.textContent; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function nameOf(p) { return p.name ? strip(K(p.name)) + (p.size ? ' ' + p.size : '') : L(p.nameTxt); }
  function typeOf(p) { return L(TXT[p.type]); }
  function feats(p) { return p.bullets ? p.bullets.map(K) : p.featTxt.map(L); }
  function urlOf(p) { return '?p=' + p.id + '#' + p.view; }

  var grid = document.getElementById('prodGrid');
  var filterBox = document.getElementById('prodFilter');
  var usesBox = document.getElementById('prodUses');
  var list = document.getElementById('prodList');
  var detail = document.getElementById('prodDetail');
  var groupSoap = document.getElementById('prod-soap');
  if (!grid || !detail) { return; }

  var FILTERS = ['all', 'soap', 'set', 'paste'];
  var activeFilter = null; /* null = 메뉴(비누/치약)에 맞춘 기본값 */

  function defaultFilter() { return groupSoap && groupSoap.hidden ? 'paste' : 'soap'; }

  /* ---------- 목록 ---------- */
  function renderList() {
    var f = activeFilter || defaultFilter();
    filterBox.innerHTML = FILTERS.map(function (k) {
      return '<button type="button" class="pl-chip" data-filter="' + k + '" aria-pressed="' + (k === f) + '">' + esc(L(TXT[k])) + '</button>';
    }).join('');
    grid.innerHTML = PRODUCTS.filter(function (p) { return f === 'all' || p.type === f; }).map(function (p) {
      var fs = feats(p).slice(0, 3).map(function (t) { return '<li>' + t + '</li>'; }).join('');
      var useTxt = p.uses.map(function (i) { return L(USES[i].t); }).join(' · ');
      return '<li><a class="pc" href="' + urlOf(p) + '" data-product="' + p.id + '">' +
        '<span class="pc-media"><img src="' + p.img + '" alt="' + esc(nameOf(p)) + '" loading="lazy" onerror="this.onerror=null;this.src=\'assets/img/favicon.svg\';this.classList.add(\'is-fallback\')"></span>' +
        '<span class="pc-type">' + esc(typeOf(p)) + '</span>' +
        '<span class="pc-name">' + esc(nameOf(p)) + '</span>' +
        '<ul class="pc-feats">' + fs + '</ul>' +
        '<span class="pc-use"><b>' + esc(L(TXT.useFor)) + '</b> ' + esc(useTxt) + '</span>' +
        '<span class="pc-btn">' + esc(L(TXT.detail)) + '</span>' +
        '</a></li>';
    }).join('');
    usesBox.innerHTML = USES.map(function (u) {
      return '<li><h4>' + esc(L(u.t)) + '</h4><p>' + esc(L(u.d)) + '</p></li>';
    }).join('');
  }

  /* ---------- 상세 ---------- */
  function renderDetail(p) {
    var specs = '';
    if (p.specs) {
      var heads = ['specs.effect', 'specs.ingr', 'specs.use'];
      specs = '<table class="pd-table"><tbody>' + p.specs.map(function (k, i) {
        return '<tr><th>' + K(heads[i]) + '</th><td>' + K(k) + '</td></tr>';
      }).join('') + '</tbody></table>';
    }
    var strengths = '';
    if (p.strengths && window.I18N && window.I18N.k28b) {
      strengths = '<h3 class="pd-h">' + K('k28b.badge') + '</h3><ul class="pd-strengths">' +
        [1, 2, 3, 4].map(function (n) { return '<li><b>' + K('k28b.b' + n) + '</b><span>' + K('k28b.b' + n + 'd') + '</span></li>'; }).join('') + '</ul>';
    }
    var compo = p.compo ? L(p.compo) : nameOf(p);
    detail.innerHTML =
      '<a class="pd-back" href="#' + p.view + '">' + esc(L(TXT.back)) + '</a>' +
      '<div class="pd-top">' +
        '<div class="pd-media"><img src="' + p.img + '" alt="' + esc(nameOf(p)) + '"></div>' +
        '<div class="pd-info">' +
          '<span class="pd-type">' + esc(typeOf(p)) + '</span>' +
          '<h3 class="pd-name">' + esc(nameOf(p)) + '</h3>' +
          '<h4 class="pd-h">' + esc(L(TXT.overview)) + '</h4>' +
          '<ul class="pd-feats">' + feats(p).map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' +
          specs +
          '<h4 class="pd-h">' + esc(L(TXT.compo)) + '</h4>' +
          '<p class="pd-p">' + esc(compo) + '</p><p class="pd-p pd-muted">' + esc(L(TXT.optAsk)) + '</p>' +
          '<h4 class="pd-h">' + esc(L(TXT.useFor)) + '</h4>' +
          '<ul class="pd-uses">' + p.uses.map(function (i) { return '<li><b>' + esc(L(USES[i].t)) + '</b> ' + esc(L(USES[i].d)) + '</li>'; }).join('') + '</ul>' +
          '<h4 class="pd-h">' + esc(L(TXT.quality)) + '</h4>' +
          '<ul class="pd-quality"><li>' + esc(L(TXT.q1)) + '</li><li>' + esc(L(TXT.q2)) + '</li></ul>' +
          '<h4 class="pd-h">' + esc(L(TXT.order)) + '</h4>' +
          '<dl class="pd-order"><dt>' + esc(L(TXT.moq)) + '</dt><dd>' + esc(L(TXT.ask)) + '</dd><dt>' + esc(L(TXT.lead)) + '</dt><dd>' + esc(L(TXT.ask)) + '</dd><dt>' + esc(L(TXT.price)) + '</dt><dd>' + esc(L(TXT.ask)) + '</dd></dl>' +
          '<div class="pd-actions"><a href="#contact" class="btn btn-primary js-order" data-order="' + esc(nameOf(p)) + '">' + K('products.orderCta') + '</a>' +
          '<a class="btn btn-outline" href="#' + p.view + '">' + esc(L(TXT.back).replace('← ', '')) + '</a></div>' +
          '<p class="pd-note">' + esc(L(TXT.orderNote)) + '</p>' +
        '</div>' +
      '</div>' + strengths;
  }

  /* ---------- 상태 ---------- */
  var baseTitle = null;
  function currentId() {
    var m = /[?&]p=([\w-]+)/.exec(window.location.search);
    return m && BY_ID[m[1]] ? m[1] : null;
  }
  function render() {
    var id = currentId();
    var inProducts = document.getElementById('products').classList.contains('is-active');
    if (id && inProducts) {
      var p = BY_ID[id];
      renderDetail(p);
      list.hidden = true; detail.hidden = false;
      document.title = nameOf(p) + ' | 주식회사 카리바이오';
      var meta = document.querySelector('meta[name="description"]');
      if (meta) { if (baseTitle === null) { baseTitle = meta.getAttribute('content'); } meta.setAttribute('content', nameOf(p) + ' — ' + strip(feats(p)[0] || '')); }
    } else {
      detail.hidden = true; list.hidden = false;
      if (baseTitle !== null) { document.querySelector('meta[name="description"]').setAttribute('content', baseTitle); }
      renderList();
    }
  }

  /* 같은 해시 안에서 ?p= 만 바뀌는 이동은 pushState 로 처리 (페이지 새로고침 없음).
     해시가 달라지면 app.js 가 뷰를 바꾸도록 hashchange 를 직접 알린다. */
  function go(url) {
    var prevHash = window.location.hash;
    window.history.pushState(null, '', url);
    if (window.location.hash !== prevHash) {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
    window.setTimeout(function () { render(); window.scrollTo(0, 0); }, 0);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) { return; }
    var pid = a.getAttribute('data-product');
    if (pid && BY_ID[pid]) { e.preventDefault(); go(urlOf(BY_ID[pid])); return; }
    /* 상세(?p=)를 보던 중 일반 메뉴 링크를 누르면 ?p= 를 지우고 그대로 이동 */
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) === '#' && window.location.search) {
      window.history.replaceState(null, '', window.location.pathname + window.location.hash);
      if (href === window.location.hash) { e.preventDefault(); render(); window.scrollTo(0, 0); }
    }
  }, true);

  /* 기업 주문 문의 → 문의 폼의 유형과 관심 제품을 채운다 */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.js-order');
    if (!a) { return; }
    var sel = document.getElementById('inquiryType');
    if (sel) { sel.value = 'bulk'; }
    var name = a.getAttribute('data-order');
    var msg = document.getElementById('message');
    if (msg && name && msg.value.indexOf(name) === -1) {
      msg.value = L(TXT.interest) + ': ' + name + '\n' + msg.value;
    }
  });

  filterBox.addEventListener('click', function (e) {
    var b = e.target.closest('[data-filter]');
    if (!b) { return; }
    activeFilter = b.getAttribute('data-filter');
    renderList();
  });

  /* ?p= 가 붙은 항목 사이를 뒤로/앞으로 이동하면 브라우저가 hashchange 를 보내지 않는다.
     app.js 가 뷰를 다시 고르도록 직접 알린다. */
  window.addEventListener('popstate', function () {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    window.setTimeout(render, 0);
  });
  window.addEventListener('hashchange', function () { activeFilter = null; window.setTimeout(render, 0); });
  /* app.js 가 비누/치약 블록의 hidden 을 바꾸거나 언어를 바꾸면 다시 그린다 */
  if ('MutationObserver' in window) {
    new MutationObserver(function () { window.setTimeout(render, 0); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    var prodView = document.getElementById('products');
    new MutationObserver(function () { window.setTimeout(render, 0); })
      .observe(prodView, { attributes: true, attributeFilter: ['class'] });
    if (groupSoap) {
      new MutationObserver(function () { activeFilter = null; window.setTimeout(render, 0); })
        .observe(groupSoap, { attributes: true, attributeFilter: ['hidden'] });
    }
  }
  render();
})();
