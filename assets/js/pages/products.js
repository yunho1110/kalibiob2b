/* 제품 — B2B 제품 카탈로그 (10.07 개편)
   ─ '제품'은 KALIBIO 가 공급하는 제품 자체의 정보만 다룬다.
     제조공정·칼륨장석 설명·시험/분석·사업/파트너십·기업 소개는 각 메뉴의 고유 콘텐츠이므로 여기서 다시 설명하지 않고 링크만 건다.
   ─ 구조: PRODUCT(제품 선택) → 제품별 상세(HERO → INFORMATION → LINE-UP → GALLERY → SUPPLY → INQUIRY)
   ─ 라우팅: 해시(#products · #prod-soap · #prod-paste · #prod-set)는 app.js 가 맡고,
     이 파일은 각 블록 안을 채운다. ?p=<제품ID> 는 라인업의 선택 항목을 미리 골라 준다(홈의 카드 링크 호환).
   ─ 제품 정보는 공식몰(kalibio1102.cafe24.com)의 상품 정보를 기준으로 한다. 공식몰에 없는 내용은 넣지 않는다.
   ─ 확인되지 않은 정보(제품 코드·포장 단위·보관 조건·최소 주문량·납기·가격)는 만들지 않는다.
     값이 null 인 항목은 화면에 나오지 않고, 아래 TODO(대표님 확인) 주석으로만 남는다.
   이 파일은 제품 담당자만 수정합니다. */
(function () {
  'use strict';

  /* ---------- 문구 ({ko,en,zh}) ---------- */
  var T = {
    heroTitle: { ko: 'KALIBIO가 선보이는 제품', en: 'Products by KALIBIO', zh: 'KALIBIO 推出的产品' },
    heroLead: { ko: 'KALIBIO의 제품 라인업과 제품 정보를 확인해보세요.', en: 'Explore the KALIBIO product line-up and product information.', zh: '了解 KALIBIO 的产品系列与产品信息。' },
    select: { ko: '제품 선택', en: 'Select a product', zh: '选择产品' },
    detail: { ko: '제품 상세 보기 →', en: 'View product details →', zh: '查看产品详情 →' },
    back: { ko: '← 제품 선택으로', en: '← Back to products', zh: '← 返回产品选择' },
    secInfo: { ko: '제품 정보', en: 'Product information', zh: '产品信息' },
    secLineup: { ko: '제품 라인업', en: 'Product line-up', zh: '产品系列' },
    secVariants: { ko: '제품 구성', en: 'Product options', zh: '产品组成' },
    secGallery: { ko: '제품 이미지', en: 'Product images', zh: '产品图片' },
    secSupply: { ko: '공급 정보', en: 'Supply information', zh: '供应信息' },
    interest: { ko: '관심 제품', en: 'Product of interest', zh: '感兴趣的产品' },
    /* 정보 항목 이름 */
    kName: { ko: '제품명', en: 'Product name', zh: '产品名' },
    kType: { ko: '제품 유형', en: 'Product type', zh: '产品类型' },
    kMaterial: { ko: '주요 원료', en: 'Main material', zh: '主要原料' },
    kContent: { ko: '칼륨장석 함량', en: 'Potassium feldspar content', zh: '钾长石含量' },
    kWeight: { ko: '중량', en: 'Weight', zh: '重量' },
    kVolume: { ko: '용량', en: 'Net content', zh: '容量' },
    kForm: { ko: '형태', en: 'Form', zh: '形态' },
    kColor: { ko: '제품 색상', en: 'Color', zh: '产品颜色' },
    kScent: { ko: '향', en: 'Scent', zh: '香型' },
    kIngCount: { ko: '사용 원료 수', en: 'Number of ingredients', zh: '使用原料数' },
    kIngKey: { ko: '핵심 성분', en: 'Key ingredients', zh: '核心成分' },
    kIngNat: { ko: '구성 성분', en: 'Composition', zh: '成分构成' },
    kEffect: { ko: '효과', en: 'Benefits', zh: '功效' },
    kFormula: { ko: '제형', en: 'Formula', zh: '剂型' },
    kFree: { ko: '무첨가', en: 'Free of', zh: '无添加' },
    kPreserv: { ko: '보존제', en: 'Preservative', zh: '防腐剂' },
    kContents: { ko: '구성', en: 'Contents', zh: '组成' },
    kOptions: { ko: '구성 옵션', en: 'Set options', zh: '组合选项' },
    kSupplyForm: { ko: '공급 형태', en: 'Supply form', zh: '供应形态' },
    kMoq: { ko: '최소 주문 수량', en: 'Minimum order', zh: '最低起订量' },
    kLead: { ko: '납기', en: 'Lead time', zh: '交期' },
    kPrice: { ko: '가격', en: 'Price', zh: '价格' },
    ask: { ko: '문의 필요', en: 'On request', zh: '需咨询' },
    kBulk: { ko: '대량 구매', en: 'Bulk purchase', zh: '批量采购' },
    bulk: { ko: '답례품 · 각종 기념품 · 명절 선물 등 대량 구매 문의', en: 'Bulk orders for return gifts, commemorative items, holiday gifts, etc.', zh: '回礼、各类纪念品、节日礼品等批量采购咨询' },
    finished: { ko: '완제품', en: 'Finished product', zh: '成品' },
    finishedSet: { ko: '세트 구성 완제품', en: 'Finished product set', zh: '组合成品' },
    feldspar: { ko: '칼륨장석', en: 'Potassium feldspar', zh: '钾长石' },
    sLineup: { ko: '라인업', en: 'Line-up', zh: '系列' },
    sTypes4: { ko: '4종', en: '4 types', zh: '4种' },
    sOpt3: { ko: '3종', en: '3 options', zh: '3种' },
    sIng28: { ko: '28가지 자연 유래 성분', en: '28 naturally derived', zh: '28种天然来源成分' },
    sSetItems: { ko: '카리비누 · K.28 치약', en: 'KALI Soap · K.28 Toothpaste', zh: '卡里皂 · K.28牙膏' },
    lineupNote: { ko: '칼륨장석 함량만 다른 4종입니다. 중량·형태는 모두 같습니다.', en: 'Four bars that differ only in potassium feldspar content. Weight and form are identical.', zh: '仅钾长石含量不同的4款，重量与形态相同。' },
    setNote: { ko: '아래 3종 구성 중에서 선택합니다.', en: 'Choose from the three set options below.', zh: '可从下列3种组合中选择。' }
  };

  /* ---------- 제품 데이터 (단일 소스) ----------
     출처: 공식몰(kalibio1102.cafe24.com) 상품 상세. 공식몰에 없는 내용은 넣지 않는다.
     - K.28 치약: 공식몰 상세·튜브 라벨에서 확인되는 150g · 28가지 자연 유래 성분만 표시한다.
     TODO(대표님 확인): 제품 코드 · 포장 단위 · 보관 조건 · 최소 주문 수량 · 납기 · 가격 — 공식몰에도 자료가 없다.
     카리비누 05: 향·사용 원료 수·핵심 성분은 10/16 지시서 확정값(연꽃아로마향 · 31종 · 칼륨장석 5%, 은행나무잎 추출물, 병풀추출물 등). */
  var SOAP = [
    { id: 'karisoap-03', no: '03', pct: '3', img: 'assets/img/soap-03.webp',
      color: { ko: '초록색', en: 'Green', zh: '绿色' },
      scent: { ko: '청량한 피톤치드향', en: 'Fresh phytoncide scent', zh: '清爽的植物精气香' }, ing: 18,
      key: { ko: '칼륨장석 3%, 클로렐라불가리스가루 등', en: 'Potassium feldspar 3%, chlorella vulgaris powder, etc.', zh: '钾长石3%、小球藻粉等' } },
    { id: 'karisoap-05', no: '05', pct: '5', img: 'assets/img/soap-05.webp',
      color: { ko: '분홍색', en: 'Pink', zh: '粉色' },
      scent: { ko: '연꽃아로마향', en: 'Lotus aroma scent', zh: '莲花香氛' }, ing: { ko: '31종', en: '31', zh: '31种' },
      key: { ko: '칼륨장석 5%, 은행나무잎 추출물, 병풀추출물 등', en: 'Potassium feldspar 5%, ginkgo leaf extract, centella asiatica extract, etc.', zh: '钾长石5%、银杏叶提取物、积雪草提取物等' } },
    { id: 'karisoap-08', no: '08', pct: '8', img: 'assets/img/soap-08.webp',
      color: { ko: '파란색', en: 'Blue', zh: '蓝色' },
      scent: { ko: '신선하고 깨끗한 아쿠아향', en: 'Fresh, clean aqua scent', zh: '清新洁净的水生香' }, ing: 20,
      key: { ko: '칼륨장석 8%, 편백오일, 은행나무잎추출물, 소나무잎추출물 등', en: 'Potassium feldspar 8%, hinoki cypress oil, ginkgo leaf extract, pine leaf extract, etc.', zh: '钾长石8%、扁柏油、银杏叶提取物、松叶提取物等' } },
    { id: 'karisoap-13', no: '13', pct: '13', img: 'assets/img/soap-13.webp',
      color: { ko: '베이지색', en: 'Beige', zh: '米色' },
      scent: { ko: '상쾌한 은방울꽃향', en: 'Refreshing lily-of-the-valley scent', zh: '清爽的铃兰香' }, ing: 19,
      key: { ko: '칼륨장석 13%, 알로에베라잎추출물 등', en: 'Potassium feldspar 13%, aloe vera leaf extract, etc.', zh: '钾长石13%、芦荟叶提取物等' } }
  ];

  var SETS = [
    { id: 'karisoap-set-4', img: 'assets/img/prod-set-soap4.webp', bg: '#e9e5e1',
      name: { ko: '카리비누 4구 세트', en: 'KALI Soap 4-Bar Set', zh: '卡里皂4块礼盒' },
      contents: { ko: '카리비누 100g × 4개입', en: 'KALI Soap 100g × 4', zh: '卡里皂100g × 4块' } },
    { id: 'k28-set-5', img: 'assets/img/prod-set-k28-5.webp', bg: '#dedfde',
      name: { ko: 'K.28 치약 5개 세트', en: 'K.28 Toothpaste 5-Pack Set', zh: 'K.28牙膏5支礼盒' },
      contents: { ko: 'K.28 치약 150g × 5개', en: 'K.28 Toothpaste 150g × 5', zh: 'K.28牙膏150g × 5支' } },
    { id: 'gift-set', img: 'assets/img/prod-set-k28-soap.webp', bg: '#dededd',
      name: { ko: 'K.28 치약 2개 + 카리비누 2개 세트', en: 'K.28 Toothpaste × 2 + KALI Soap × 2 Set', zh: 'K.28牙膏2支 + 卡里皂2块礼盒' },
      contents: { ko: 'K.28 치약 2개 + 카리비누 2개', en: '2 × K.28 Toothpaste + 2 × KALI Soap', zh: 'K.28牙膏2支 + 卡里皂2块' } }
  ];

  /* 그룹(= 제품 상세 페이지) 정의 */
  var GROUPS = {
    soap: {
      /* 커버 사진은 K2O 라벨을 지운 판을 쓴다 — 함량은 바로 옆 요약 지표와 라인업에 글자로 있다.
         라인업·갤러리는 종류 구분이 되도록 라벨이 있는 원본을 그대로 쓴다. */
      view: 'prod-soap', en: 'SOAP', title: 'KALI SOAP', img: 'assets/img/soap-05-hero.webp', bg: '#d3d3d3',
      type: { ko: '비누', en: 'Soap', zh: '香皂' },
      line: { ko: '칼륨장석을 활용한 KALIBIO의 비누 제품', en: 'KALI SOAP made with potassium feldspar', zh: '运用钾长石的 KALIBIO 香皂产品' },
      cardInfo: { ko: '칼륨장석 3 · 5 · 8 · 13% 4종 · 100g', en: 'Potassium feldspar 3 · 5 · 8 · 13% — 4 types · 100g', zh: '钾长石 3 · 5 · 8 · 13% 4种 · 100g' },
      inqName: 'KALI SOAP',
      lineupTitle: 'KALI SOAP LINE-UP', variantLabel: 'secLineup', lineupNote: 'lineupNote',
      /* 10/21: 상단 요약 지표·한 줄 설명 대신 문장 하나 (HTML — nowrap 으로 어색한 줄바꿈 방지) */
      heroDesc: { ko: '씻어내는 것에서 그치지 않고, 피부에 필요한 것을 채우는 것까지가 <span class="nw">카리비누의 역할입니다.</span>', en: 'KALI Soap does not stop at washing away — it goes on to put back what skin needs.', zh: '卡里香皂不止于清洁，更为肌肤补充所需。' },
      gallery: [
        { src: 'assets/img/soap-03.webp', bg: '#d4d4d4', alt: { ko: '카리비누 03.', en: 'KALI Soap 03.', zh: '卡里皂 03.' } },
        { src: 'assets/img/soap-05.webp', bg: '#d3d3d3', alt: { ko: '카리비누 05.', en: 'KALI Soap 05.', zh: '卡里皂 05.' } },
        { src: 'assets/img/soap-08.webp', bg: '#d3d3d3', alt: { ko: '카리비누 08.', en: 'KALI Soap 08.', zh: '卡里皂 08.' } },
        { src: 'assets/img/soap-13.webp', bg: '#d3d3d3', alt: { ko: '카리비누 13.', en: 'KALI Soap 13.', zh: '卡里皂 13.' } }
      ]
    },
    paste: {
      view: 'prod-paste', en: 'TOOTHPASTE', title: 'K.28 TOOTHPASTE', img: 'assets/img/home-best-k28.webp', bg: '#e2e2e2',
      type: { ko: '치약', en: 'Toothpaste', zh: '牙膏' },
      line: { ko: 'KALIBIO의 치약 제품', en: 'The KALIBIO toothpaste', zh: 'KALIBIO 牙膏产品' },
      cardInfo: { ko: '150g', en: '150g', zh: '150g' },
      inqName: 'K.28 TOOTHPASTE',
      heroDesc: { ko: '매일 쓰는 치약이니까, 자연에서 온 <span class="nw">28가지 성분으로</span> 입속을 개운하게 관리하세요.', en: 'Because you use it every day — keep your mouth feeling fresh with <span class="nw">28 ingredients</span> from nature.', zh: '每天都要用的牙膏，用来自自然的<span class="nw">28种成分</span>让口腔清爽洁净。' },
      gallery: [
        { src: 'assets/img/home-best-k28.webp', bg: '#e2e2e2', alt: { ko: 'K.28 치약과 패키지', en: 'K.28 toothpaste and package', zh: 'K.28牙膏与包装' } },
        { src: 'assets/img/about-k28.webp', bg: '#dbdbdb', alt: { ko: 'K.28 치약', en: 'K.28 toothpaste', zh: 'K.28牙膏' } },
        { src: 'assets/img/k28-lineup.webp', bg: '#cdc8c0', alt: { ko: 'K.28 치약 제품 이미지', en: 'K.28 toothpaste product image', zh: 'K.28牙膏产品图' } }
      ]
    },
    set: {
      view: 'prod-set', en: 'SET', title: 'SOAP & TOOTHPASTE SET', img: 'assets/img/giftset.webp', bg: '#ffffff',
      type: { ko: '세트', en: 'Set', zh: '组合' },
      line: { ko: '카리비누와 K.28 치약 구성 세트', en: 'KALI Soap and K.28 Toothpaste sets', zh: '卡里皂与 K.28 牙膏组合' },
      cardInfo: { ko: '구성 3종 선택', en: '3 set options', zh: '3种组合可选' },
      inqName: 'SOAP & TOOTHPASTE SET',
      lineupTitle: 'SET OPTIONS', variantLabel: 'secVariants', lineupNote: 'setNote',
      stats: [['kOptions', 'sOpt3'], ['kContents', 'sSetItems']],
      gallery: [
        { src: 'assets/img/giftset.webp', bg: '#ffffff', alt: { ko: '카리비누·K.28 치약 세트', en: 'KALI Soap and K.28 Toothpaste set', zh: '卡里皂·K.28牙膏组合' } },
        { src: 'assets/img/prod-set-soap4.webp', bg: '#e9e5e1', alt: { ko: '카리비누 4구 세트', en: 'KALI Soap 4-bar set', zh: '卡里皂4块礼盒' } },
        { src: 'assets/img/prod-set-k28-5.webp', bg: '#dedfde', alt: { ko: 'K.28 치약 5개 세트', en: 'K.28 toothpaste 5-pack set', zh: 'K.28牙膏5支礼盒' } },
        { src: 'assets/img/prod-set-k28-soap.webp', bg: '#dededd', alt: { ko: 'K.28 치약 2개 + 카리비누 2개 세트', en: 'K.28 ×2 + KALI Soap ×2 set', zh: 'K.28牙膏2支 + 卡里皂2块礼盒' } }
      ]
    }
  };
  var ORDER = ['soap', 'paste', 'set'];
  /* ?p=<제품ID> → { 그룹, 선택 항목 } (홈의 베스트 카드 링크와 옛 주소 호환) */
  var BY_ID = {};
  SOAP.forEach(function (p, i) { BY_ID[p.id] = { g: 'soap', i: i }; });
  SETS.forEach(function (p, i) { BY_ID[p.id] = { g: 'set', i: i }; });
  BY_ID['k28-toothpaste'] = { g: 'paste', i: 0 };
  var focusId = null;   /* ?p= 로 지목된 품목 — 라인업에서 표시하고 그 자리로 보낸다 */

  /* ---------- 도우미 ---------- */
  function lang() { var l = document.documentElement.getAttribute('lang'); return /^(ko|en|zh)$/.test(l) ? l : 'ko'; }
  function L(o) { return o ? (o[lang()] !== undefined ? o[lang()] : o.ko) : ''; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function t(k) { return esc(L(T[k])); }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 정보표: 값이 비어 있는(null) 항목은 그리지 않는다 */
  function table(rows, cls) {
    var body = rows.filter(function (r) { return r && r[1] !== null && r[1] !== ''; }).map(function (r) {
      return '<tr><th>' + t(r[0]) + '</th><td>' + r[1] + '</td></tr>';
    }).join('');
    return '<table class="pd-table pk-table ' + (cls || '') + '"><tbody>' + body + '</tbody></table>';
  }
  
  /* ---------- 제품 정보 (공통 + 제품별) ---------- */
  function infoRows(g) {
    if (g === 'soap') {
      return [
        ['kName', 'KALI SOAP · ' + esc(L({ ko: '카리비누', en: 'KALI Soap', zh: '卡里皂' }))],
        ['kType', esc(L({ ko: '비누 (고체 비누)', en: 'Soap (solid bar)', zh: '香皂（固体皂）' }))],
        ['kMaterial', t('feldspar')],
        ['kContent', esc(L({ ko: '3% · 5% · 8% · 13% (4종)', en: '3% · 5% · 8% · 13% (4 types)', zh: '3% · 5% · 8% · 13%（4种）' }))],
        ['kWeight', esc(L({ ko: '100g (개당)', en: '100g per bar', zh: '每块100g' }))],
        ['kForm', esc(L({ ko: '원형 고체 비누 · KALI 로고 각인', en: 'Round solid bar · embossed KALI logo', zh: '圆形固体皂 · 压印 KALI 标志' }))]
      ];
    }
    if (g === 'paste') {
      return [
        ['kName', 'KALIBIO K.28 TOOTHPASTE · ' + esc(L({ ko: 'K.28 치약', en: 'K.28 Toothpaste', zh: 'K.28牙膏' }))],
        ['kType', esc(L(GROUPS.paste.type))],
        ['kMaterial', t('feldspar')],
        ['kVolume', '150g'],
        ['kIngNat', esc(L({ ko: '28가지 자연 유래 성분', en: '28 naturally derived ingredients', zh: '28种天然来源成分' }))],
        ['kEffect', esc(L({ ko: '미네랄 케어, 잇몸 진정 케어, 내추럴 클렌징, 상큼한 숨결', en: 'Mineral care, soothing gum care, natural cleansing, fresh breath', zh: '矿物护理、牙龈舒缓护理、天然清洁、清新口气' }))]
      ];
    }
    return [
      ['kName', 'KALI SOAP & TOOTHPASTE SET'],
      ['kType', esc(L({ ko: '세트 (카리비누 · K.28 치약 구성)', en: 'Set (KALI Soap · K.28 Toothpaste)', zh: '组合（卡里皂 · K.28牙膏）' }))],
      ['kMaterial', t('feldspar')],
      ['kContents', esc(L({ ko: '카리비누 100g · K.28 치약 150g', en: 'KALI Soap 100g · K.28 Toothpaste 150g', zh: '卡里皂100g · K.28牙膏150g' }))],
      ['kOptions', esc(L({ ko: '아래 구성 3종 · 카리비누 세트는 2구 · 3구 · 4구 (개당 100g) · 3구 세트는 비누 종류 상관없이 3개 선택 가능', en: '3 options below · KALI Soap sets of 2, 3 or 4 bars (100g each) · the 3-bar set lets you choose any 3 soaps', zh: '下列3种组合 · 卡里皂组合有2块、3块、4块（每块100g）· 3块组合可任选3种皂' }))]
    ];
  }

  /* ---------- 라인업 / 구성 — 전 품목을 한 화면에 ----------
     대표님 피드백(10/16): 탭으로 한 종씩 보여 주니 카리비누 05 만 본다.
     03 · 05 · 08 · 13 을 동시에 펼쳐 한눈에 비교하게 한다.
     중량·형태처럼 4종이 같은 값은 위 PRODUCT INFORMATION 에 이미 있으므로
     여기서는 종류마다 다른 항목(함량 · 색상 · 향 · 원료 수 · 핵심 성분)만 적는다. */
  function soapName(p) { return L({ ko: '카리비누 ', en: 'KALI Soap ', zh: '卡里皂 ' }) + p.no + '.'; }
  function lineupItems(g) {
    if (g === 'soap') {
      return SOAP.map(function (p) {
        return {
          id: p.id, img: p.img, bg: GROUPS.soap.bg, name: soapName(p), short: p.no + '.',
          rows: [
            ['kContent', p.pct + '%'],
            ['kColor', esc(L(p.color))],
            ['kScent', p.scent ? esc(L(p.scent)) : null],
            ['kIngCount', p.ing ? esc(typeof p.ing === 'object' ? L(p.ing) : L({ ko: p.ing + '가지', en: p.ing, zh: p.ing + '种' })) : null],
            ['kIngKey', p.key ? esc(L(p.key)) : null]
          ]
        };
      });
    }
    return SETS.map(function (sx) {
      return { id: sx.id, img: sx.img, bg: sx.bg, name: L(sx.name), short: L(sx.name), rows: [['kContents', esc(L(sx.contents))]] };
    });
  }
  /* 표가 아니라 dl 로 그린다 — 항목들이 subgrid 로 같은 줄에 맞춰져야 비교가 된다
     (.pk-item-spec 은 display:contents, 각 행이 바깥 격자의 줄을 그대로 쓴다) */
  function lineupGrid(g) {
    var items = lineupItems(g);
    var rowCount = items[0].rows.length;
    return '<ul class="pk-grid pk-grid--' + items.length + '" style="--pk-rows:' + (rowCount + 2) + '">' + items.map(function (it) {
      return '<li class="pk-item" id="v-' + it.id + '">' +
        '<figure class="pk-item-media" style="background:' + it.bg + '"><img src="' + it.img + '" alt="' + esc(it.name) + '" loading="lazy"></figure>' +
        '<h5 class="pk-item-name">' + esc(it.name) + '</h5>' +
        '<dl class="pk-item-spec">' + it.rows.filter(function (r) { return r && r[1] !== null && r[1] !== ''; }).map(function (r) {
          return '<div><dt>' + t(r[0]) + '</dt><dd>' + r[1] + '</dd></div>';
        }).join('') + '</dl></li>';
    }).join('') + '</ul>';
  }

  /* 상세 히어로의 요약 지표 — 확인된 값만 (GROUPS[].stats) */
  function heroStats(g) {
    var st = GROUPS[g].stats;
    if (!st) { return ''; }
    return '<dl class="pk-stats">' + st.map(function (r) {
      return '<div><dt>' + t(r[0]) + '</dt><dd>' + esc(typeof r[1] === 'string' ? L(T[r[1]]) : L(r[1])) + '</dd></div>';
    }).join('') + '</dl>';
  }

  /* ---------- 갤러리 (기존 .pp-gallery 마크업·동작 재사용) ---------- */
  function gallery(g) {
    var list = GROUPS[g].gallery;
    return '<div class="pp-gallery"><figure class="pp-gallery-main" style="background:' + list[0].bg + '"><img src="' + list[0].src + '" alt="' + esc(L(list[0].alt)) + '" loading="lazy"></figure><ul class="pp-thumbs">' +
      list.map(function (it, i) {
        return '<li><button type="button" class="pp-thumb' + (i === 0 ? ' is-on' : '') + '" data-bg="' + it.bg + '" data-src="' + it.src + '" data-alt="' + esc(L(it.alt)) + '" aria-label="' + esc((i + 1) + ' — ' + L(it.alt)) + '" aria-pressed="' + (i === 0) + '">' +
          '<img src="' + it.src + '" alt="" loading="lazy"><span>0' + (i + 1) + '</span></button></li>';
      }).join('') + '</ul></div>';
  }

  /* ---------- 공급 정보 ---------- */
  function supply(g) {
    return table([
      ['kSupplyForm', t(g === 'set' ? 'finishedSet' : 'finished')],
      ['kBulk', t('bulk')],
      ['kMoq', t('ask')],
      ['kLead', t('ask')],
      ['kPrice', t('ask')]
    ]);
  }

  /* ---------- 상세 한 페이지 ---------- */
  function renderGroup(g) {
    var G = GROUPS[g], hasVar = !!G.lineupTitle;
    return '<a class="pd-back" href="#products">' + t('back') + '</a>' +
      '<section class="pp-hero"><figure class="pp-hero-media" style="background:' + G.bg + '"><img src="' + G.img + '" alt="' + esc(G.title) + '"></figure>' +
        '<div class="pp-hero-copy"><p class="pp-label">' + esc(G.en) + '</p><h3 class="pp-hero-title">' + esc(G.title) + '</h3>' +
        (G.heroDesc ? '<p class="pp-hero-desc">' + L(G.heroDesc) + '</p>' : '<p class="pp-hero-lead">' + esc(L(G.line)) + '</p>' + heroStats(g)) + '</div></section>' +
      '<section class="pp-sec"><p class="pp-label">' + t('secInfo') + '</p><h4 class="pp-h">PRODUCT INFORMATION</h4>' +
        table(infoRows(g)) +
        '</section>' +
      (hasVar ? '<section class="pp-sec"><p class="pp-label">' + t(G.variantLabel) + '</p><h4 class="pp-h">' + esc(G.lineupTitle) + '</h4>' +
        '<p class="pk-grid-note">' + t(G.lineupNote) + '</p>' + lineupGrid(g) + '</section>' : '') +
      '<section class="pp-sec"><p class="pp-label">' + t('secGallery') + '</p><h4 class="pp-h">PRODUCT GALLERY</h4>' + gallery(g) + '</section>' +
      '<section class="pp-sec"><p class="pp-label">' + t('secSupply') + '</p><h4 class="pp-h">SUPPLY INFORMATION</h4>' + supply(g) + '</section>';
  }

  /* ---------- 제품 선택 카드 (PRODUCT 메인) ----------
     대표님 피드백(10/16): 선택 화면에서도 카리비누 4종이 보여야 한다. */
  function cardVariants(g) {
    if (!GROUPS[g].lineupTitle) { return ''; }
    return '<span class="pk-card-vars">' + lineupItems(g).map(function (it) {
      return '<span class="pk-cv"><img src="' + it.img + '" alt="" loading="lazy" style="background:' + it.bg + '"><b>' + esc(it.short) + '</b></span>';
    }).join('') + '</span>';
  }


  function renderSelect() {
    return ORDER.map(function (g) {
      var G = GROUPS[g];
      return '<li><a class="pp-card pk-card" href="#' + G.view + '">' +
        '<span class="pp-card-media" style="background:' + G.bg + '"><img src="' + G.img + '" alt="' + esc(G.title) + '" loading="lazy"></span>' +
        '<span class="pk-card-type">' + esc(L(G.type)) + '</span>' +
        '<span class="pp-card-name">' + esc(G.title) + '</span>' +
        '<span class="pp-card-d">' + esc(L(G.line)) + '</span>' +
        '<span class="pk-card-info">' + esc(L(G.cardInfo)) + '</span>' + cardVariants(g) +
        '<span class="pp-card-more">' + t('detail') + '</span></a></li>';
    }).join('');
  }

  /* ---------- 그리기 ---------- */
  var pageEls = {};
  function render() {
    var main = document.getElementById('pkSelect');
    if (main) { main.innerHTML = renderSelect(); }
    var h = document.getElementById('pkHeroTitle'), l = document.getElementById('pkHeroLead');
    if (h) { h.textContent = L(T.heroTitle); }
    if (l) { l.textContent = L(T.heroLead); }
    ORDER.forEach(function (g) {
      var el = pageEls[g] || (pageEls[g] = document.querySelector('[data-pk="' + g + '"]'));
      if (el) { el.innerHTML = renderGroup(g); }
    });
    var f = focusEl();
    if (f) { f.classList.add('is-target'); }
  }
  /* ?p=<제품ID> 로 들어오면 라인업의 그 품목을 표시한다 */
  function applyQuery() {
    var m = /[?&]p=([\w-]+)/.exec(window.location.search);
    focusId = (m && BY_ID[m[1]]) ? m[1] : null;
    return focusId ? BY_ID[focusId] : null;
  }
  function focusEl() { return focusId ? document.getElementById('v-' + focusId) : null; }

  /* ---------- 이벤트 ---------- */
  document.addEventListener('click', function (e) {
    /* 갤러리: 썸네일을 누르면 큰 사진이 부드럽게 바뀐다 */
    var th = e.target.closest && e.target.closest('.pp-thumb');
    if (th) {
      var gal = th.closest('.pp-gallery'), mainImg = gal.querySelector('.pp-gallery-main img'), ths = gal.querySelectorAll('.pp-thumb');
      for (var j = 0; j < ths.length; j++) { ths[j].classList.toggle('is-on', ths[j] === th); ths[j].setAttribute('aria-pressed', ths[j] === th ? 'true' : 'false'); }
      var sw = function () { mainImg.src = th.getAttribute('data-src'); mainImg.alt = th.getAttribute('data-alt'); gal.querySelector('.pp-gallery-main').style.background = th.getAttribute('data-bg'); mainImg.classList.remove('is-out'); };
      if (reduce) { sw(); } else { mainImg.classList.add('is-out'); window.setTimeout(sw, 220); }
      return;
    }
    /* 제품 문의 → 문의 폼의 유형과 관심 제품을 채운다 */
    var ord = e.target.closest && e.target.closest('.js-order');
    if (ord) {
      var sel = document.getElementById('inquiryType');
      if (sel) { sel.value = ord.getAttribute('data-inquiry') || 'bulk'; }
      var nm = ord.getAttribute('data-order'), msg = document.getElementById('message');
      if (msg && nm && msg.value.indexOf(nm) === -1) { msg.value = L(T.interest) + ': ' + nm + '\n' + msg.value; }
    }
  });

  /* ?p= 가 붙은 카드(홈 베스트 등)는 새로고침 없이 이동 */
  function go(url) {
    var prevHash = window.location.hash;
    window.history.pushState(null, '', url);
    if (window.location.hash !== prevHash) { window.dispatchEvent(new HashChangeEvent('hashchange')); }
    window.setTimeout(function () {
      applyQuery(); render();
      var f = focusEl();
      if (f) { f.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); } else { window.scrollTo(0, 0); }
    }, 0);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) { return; }
    var pid = a.getAttribute('data-product');
    if (pid && BY_ID[pid]) { e.preventDefault(); go('?p=' + pid + '#' + GROUPS[BY_ID[pid].g].view); return; }
    /* 상세를 보던 중 일반 메뉴 링크를 누르면 ?p= 를 지우고 그대로 이동 */
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) === '#' && window.location.search) {
      window.history.replaceState(null, '', window.location.pathname + window.location.hash);
      if (href === window.location.hash) { e.preventDefault(); window.scrollTo(0, 0); }
    }
  }, true);

  window.addEventListener('popstate', function () { window.dispatchEvent(new HashChangeEvent('hashchange')); window.setTimeout(function () { applyQuery(); render(); }, 0); });
  if ('MutationObserver' in window) {
    new MutationObserver(function () { window.setTimeout(render, 0); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }
  applyQuery();
  render();
})();
