/* LEGAL — 개인정보 처리방침 · 이용 및 저작권 안내
   ─ 이 사이트의 실제 처리 현황만 적는다. 확인되지 않은 값은 TODO 로 남기고 지어내지 않는다.
   ─ 개인정보 처리방침의 항목 순서는 「개인정보 보호법」 제30조제1항 각 호를 따른다.
   ─ 확인된 사실(2026-11-12 코드 기준):
       · 정적 사이트. 자체 서버·데이터베이스·로그인·관리자 페이지가 없다.
       · 문의 폼은 입력값으로 mailto: 링크를 만들 뿐, 사이트가 전송·저장하지 않는다.
       · 쿠키·localStorage·sessionStorage·분석도구(GA 등)를 쓰지 않는다. (코드 전수 확인)
       · 외부 요청은 Google Fonts 한 곳뿐이다.
   ─ TODO(운영자 확인)는 화면에 그대로 노출된다. 확정 전까지 공개하지 말 것. */
(function () {
  'use strict';
  var root = document.getElementById('legal');
  if (!root) { return; }

  var TODO = { ko: '※ 운영자 확인 필요', en: '* To be confirmed by the operator', zh: '※ 需运营方确认' };

  /* 확정된 기업 정보 — 푸터에 이미 공개된 값만 쓴다 */
  var CORP = {
    name: { ko: '주식회사 카리바이오', en: 'KALIBIO Co., Ltd.', zh: '卡里生物股份有限公司' },
    rep: { ko: '김준영', en: 'KIM JOON-YOUNG', zh: '金俊荣' },
    biz: '803-86-03036',
    tel: '+82-61-725-1031',
    mail: 'kalibio1101@naver.com',
    addr: {
      ko: '전남광주통합특별시 순천시 해룡면 율촌산단4로 13, 303호 (전남테크노파크 지식산업센터)',
      en: '303, 13, Yulchonsandan 4-ro, Haeryong-myeon, Suncheon-si, Jeonnam-Gwangju Unified Metropolitan City, South Korea',
      zh: '韩国全南光州统合特别市顺天市海龙面栗村产业园4路13号303室'
    }
  };

  var EFF = '2026-11-12';

  function L(o) {
    var l = document.documentElement.getAttribute('lang');
    if (!/^(ko|en|zh)$/.test(l)) { l = 'ko'; }
    return o && o[l] !== undefined ? o[l] : (o ? o.ko : '');
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ---------- 개인정보 처리방침 ---------- */
  function privacy() {
    return {
      title: { ko: '개인정보 처리방침', en: 'Privacy Policy', zh: '个人信息处理方针' },
      lead: {
        ko: CORP.name.ko + '(이하 “회사”)은 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.',
        en: CORP.name.en + ' (the “Company”) establishes and discloses this Privacy Policy pursuant to Article 30 of the Personal Information Protection Act of the Republic of Korea.',
        zh: CORP.name.zh + '（以下简称“公司”）依据韩国《个人信息保护法》第30条，制定并公开本个人信息处理方针。'
      },
      /* 이 사이트가 실제로 어떻게 동작하는지 먼저 밝힌다 — 처리방침과 실제가 어긋나지 않게 */
      box: {
        ko: '이 웹사이트는 회사 소개용 정적 사이트입니다. 회원가입·로그인·게시판·결제 기능이 없으며, 웹사이트 자체에 개인정보를 저장하는 데이터베이스가 없습니다. 문의 양식은 입력하신 내용으로 메일 작성 화면을 열어 줄 뿐이며, 전송 여부는 이용자가 직접 결정합니다.',
        en: 'This website is a static corporate brochure site. It has no sign-up, login, bulletin board or payment function, and no database that stores personal information. The inquiry form only opens your own mail client with the text you entered; whether to send it is entirely your decision.',
        zh: '本网站为公司介绍用静态网站，不具备注册、登录、留言板或支付功能，网站本身没有存储个人信息的数据库。咨询表单仅以您输入的内容打开邮件撰写窗口，是否发送完全由您决定。'
      },
      secs: [
        {
          h: { ko: '1. 개인정보의 처리 목적', en: '1. Purposes of processing', zh: '1. 个人信息的处理目的' },
          p: [{
            ko: '회사는 다음의 목적으로만 개인정보를 처리합니다. 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행합니다.',
            en: 'The Company processes personal information only for the purposes below. If the purpose changes, the Company will take the necessary measures, such as obtaining separate consent under Article 18 of the Act.',
            zh: '公司仅为下列目的处理个人信息。目的变更时，将依据该法第18条另行取得同意等采取必要措施。'
          }],
          ul: [
            { ko: 'B2B 문의(OEM·ODM, 벌크 구매, 유통 파트너십, 샘플·브로슈어 요청 등)에 대한 확인·상담·회신', en: 'Reviewing, consulting on and replying to B2B inquiries (OEM/ODM, bulk purchase, distribution partnership, sample or brochure requests, etc.)', zh: '对B2B咨询（OEM·ODM、批量采购、分销合作、样品或手册索取等）的确认、咨询与回复' },
            { ko: '상담 과정에서 필요한 거래 조건 협의 및 그 기록의 보관', en: 'Discussing the terms of a possible transaction during that consultation and keeping a record of it', zh: '咨询过程中必要的交易条件协商及其记录保管' }
          ]
        },
        {
          h: { ko: '2. 처리하는 개인정보 항목 및 수집 방법', en: '2. Items processed and how they are collected', zh: '2. 处理的个人信息项目及收集方式' },
          table: [
            [{ ko: '필수 항목', en: 'Required', zh: '必填项目' }, { ko: '회사명, 담당자명, 이메일 주소, 국가, 문의 내용', en: 'Company name, contact person’s name, email address, country, message', zh: '公司名称、负责人姓名、电子邮箱、国家、咨询内容' }],
            [{ ko: '선택 항목', en: 'Optional', zh: '选填项目' }, { ko: '연락처(전화번호), 예상 물량', en: 'Phone number, expected volume', zh: '联系电话、预计数量' }],
            [{ ko: '수집 방법', en: 'Method', zh: '收集方式' }, { ko: '웹사이트 문의 양식에서 작성한 내용을 이용자가 본인의 메일 프로그램으로 회사에 전송', en: 'The visitor sends the text written in the website inquiry form to the Company from their own mail client', zh: '访客通过本人的邮件程序，将在网站咨询表单中填写的内容发送给公司' }]
          ],
          p: [{
            ko: '문의 양식은 웹사이트 서버로 데이터를 전송하지 않습니다. 따라서 이용자가 메일을 보내지 않으면 회사는 입력 내용을 받지 않습니다. 회사가 개인정보를 실제로 처리하기 시작하는 시점은 이용자가 보낸 메일을 수신한 때입니다.',
            en: 'The inquiry form does not transmit data to any web server. If you do not send the email, the Company never receives what you typed. The Company begins processing personal information only when it receives your email.',
            zh: '咨询表单不会向网站服务器发送数据。若您不发送邮件，公司不会收到您填写的内容。公司实际开始处理个人信息的时点，是收到您所发邮件之时。'
          }]
        },
        {
          h: { ko: '3. 개인정보의 처리 및 보유 기간', en: '3. Processing and retention period', zh: '3. 个人信息的处理及保有期限' },
          p: [
            {
              ko: '회사는 문의 처리가 완료된 후 아래 기간까지 보유하며, 기간이 지나면 지체 없이 파기합니다. 다만 관계 법령에 따라 보존 의무가 있는 경우에는 그 기간을 따릅니다.',
              en: 'The Company retains the information for the period below after the inquiry has been handled, and destroys it without delay thereafter, except where a retention obligation applies under other statutes.',
              zh: '公司在咨询处理完成后保有至下述期限，期满后立即销毁。但依相关法令负有保存义务的，依其期限。'
            },
            {
              ko: '보유 기간: ' + L(TODO) + ' — 문의 메일의 실제 보관 기간을 확정해 주세요. (예: 문의 처리 완료 후 1년)',
              en: 'Retention period: ' + L(TODO) + ' — please confirm how long inquiry emails are actually kept (e.g. one year after the inquiry is closed).',
              zh: '保有期限：' + L(TODO) + ' — 请确认咨询邮件的实际保管期限（例如：咨询处理完成后1年）。'
            }
          ]
        },
        {
          h: { ko: '4. 개인정보의 제3자 제공', en: '4. Provision to third parties', zh: '4. 向第三方提供个人信息' },
          p: [{
            ko: '회사는 문의를 통해 받은 개인정보를 제3자에게 제공하지 않습니다. 제공이 필요한 경우에는 사전에 정보주체의 동의를 받습니다.',
            en: 'The Company does not provide personal information received through inquiries to third parties. If provision becomes necessary, prior consent will be obtained.',
            zh: '公司不会将通过咨询收到的个人信息提供给第三方。确有提供必要时，将事先取得信息主体同意。'
          }]
        },
        {
          h: { ko: '5. 개인정보 처리의 위탁', en: '5. Outsourcing of processing', zh: '5. 个人信息处理的委托' },
          p: [{
            ko: '회사는 문의 접수를 위해 아래의 서비스를 이용하고 있으며, 그 범위에서 개인정보가 처리됩니다.',
            en: 'The Company uses the services below to receive inquiries, and personal information is processed to that extent.',
            zh: '公司为接收咨询使用下列服务，个人信息在该范围内被处理。'
          }],
          table: [
            [{ ko: '웹사이트 호스팅', en: 'Website hosting', zh: '网站托管' }, { ko: 'GitHub, Inc. (GitHub Pages) — 웹사이트 파일 제공. 접속 시 IP 주소 등 접속기록이 서비스 제공자 측에 기록될 수 있습니다. ' + L(TODO) + ' 운영 도메인(www.kalibio.co.kr)의 실제 호스팅 사업자를 확정해 주세요.', en: 'GitHub, Inc. (GitHub Pages) — serving website files. Access logs including IP addresses may be recorded by the provider. ' + L(TODO) + ' Please confirm the actual hosting provider for the production domain (www.kalibio.co.kr).', zh: 'GitHub, Inc.（GitHub Pages）— 提供网站文件。访问时IP地址等访问记录可能被服务商记录。' + L(TODO) + ' 请确认运营域名（www.kalibio.co.kr）的实际托管服务商。' }],
            [{ ko: '문의 메일 수신', en: 'Receiving inquiry email', zh: '咨询邮件接收' }, { ko: '네이버 메일 (' + CORP.mail + ') — 문의 메일의 수신 및 보관', en: 'NAVER Mail (' + CORP.mail + ') — receiving and storing inquiry emails', zh: 'NAVER邮箱（' + CORP.mail + '）— 咨询邮件的接收与保管' }],
            [{ ko: '웹 글꼴', en: 'Web fonts', zh: '网页字体' }, { ko: 'Google LLC (Google Fonts) — 글꼴 파일 제공. 자세한 내용은 아래 7항을 참고하십시오.', en: 'Google LLC (Google Fonts) — serving font files. See section 7 below.', zh: 'Google LLC（Google Fonts）— 提供字体文件。详见下文第7项。' }]
          ]
        },
        {
          h: { ko: '6. 개인정보의 파기 절차 및 방법', en: '6. Destruction procedure and method', zh: '6. 个人信息的销毁程序及方法' },
          p: [{
            ko: '보유 기간이 지나거나 처리 목적이 달성되어 개인정보가 불필요하게 되었을 때에는 지체 없이 파기합니다. 전자적 파일 형태의 정보는 복구·재생할 수 없는 방법으로 삭제하고, 종이 문서는 분쇄하거나 소각합니다.',
            en: 'When the retention period expires or the purpose is achieved and the information is no longer needed, it is destroyed without delay. Electronic files are deleted by a method that prevents recovery, and paper documents are shredded or incinerated.',
            zh: '保有期限届满或处理目的达成致个人信息不再必要时，立即销毁。电子文件以无法恢复的方式删除，纸质文件予以粉碎或焚毁。'
          }]
        },
        {
          h: { ko: '7. 개인정보의 국외 이전', en: '7. Transfer of personal information abroad', zh: '7. 个人信息的跨境转移' },
          p: [{
            ko: '이 웹사이트는 화면에 쓰이는 글꼴을 Google Fonts(fonts.googleapis.com, fonts.gstatic.com)에서 불러옵니다. 이 과정에서 방문자의 IP 주소와 브라우저 정보가 Google LLC(미국)의 서버로 전달될 수 있습니다. 전달되는 정보는 글꼴 파일을 내려주기 위한 것이며, 회사는 이 정보를 수집하거나 보관하지 않습니다.',
            en: 'This website loads its typefaces from Google Fonts (fonts.googleapis.com, fonts.gstatic.com). In doing so, a visitor’s IP address and browser information may be sent to servers of Google LLC (United States). That information is used to deliver the font files; the Company neither collects nor retains it.',
            zh: '本网站从Google Fonts（fonts.googleapis.com、fonts.gstatic.com）加载页面字体。此过程中，访客的IP地址及浏览器信息可能被发送至Google LLC（美国）的服务器。该信息用于下发字体文件，公司既不收集也不保管。'
          }, {
            ko: '글꼴 요청을 원하지 않는 경우 브라우저의 확장기능이나 콘텐츠 차단 설정으로 외부 글꼴 로딩을 막을 수 있으며, 이 경우에도 사이트의 내용은 그대로 보실 수 있습니다.',
            en: 'If you prefer not to make these requests, you can block external font loading with a browser extension or content-blocking setting; the site content remains fully readable.',
            zh: '如不希望发生此类请求，可通过浏览器扩展或内容拦截设置阻止外部字体加载，网站内容仍可正常阅读。'
          }]
        },
        {
          h: { ko: '8. 자동으로 개인정보를 수집하는 장치', en: '8. Automatic collection devices (cookies)', zh: '8. 自动收集个人信息的装置（Cookie）' },
          p: [{
            ko: '이 웹사이트는 쿠키(cookie)를 비롯한 자동 수집 장치를 설치·운영하지 않습니다. 방문자 분석 도구(Google Analytics 등)도 사용하지 않으며, 브라우저에 어떠한 식별정보도 저장하지 않습니다.',
            en: 'This website does not install or operate cookies or any other automatic collection device. It uses no visitor-analytics tool (such as Google Analytics) and stores no identifier in your browser.',
            zh: '本网站不设置或运行Cookie等自动收集装置，不使用访客分析工具（如Google Analytics），也不在浏览器中存储任何识别信息。'
          }]
        },
        {
          h: { ko: '9. 정보주체의 권리와 행사 방법', en: '9. Rights of data subjects and how to exercise them', zh: '9. 信息主体的权利及行使方法' },
          p: [{
            ko: '정보주체는 회사에 대하여 언제든지 개인정보의 열람, 정정·삭제, 처리정지 및 동의 철회를 요구할 수 있습니다. 요구는 아래 연락처로 서면, 전화 또는 전자우편으로 하실 수 있으며, 회사는 지체 없이 조치합니다. 법정대리인이나 위임을 받은 자를 통하여 요구하실 수도 있습니다.',
            en: 'You may at any time request access to, correction or deletion of, or suspension of the processing of your personal information, and may withdraw your consent. Requests may be made in writing, by telephone or by email to the contact below, and the Company will act without delay. Requests may also be made through a legal representative or an authorised agent.',
            zh: '信息主体可随时要求查阅、更正·删除、停止处理个人信息并撤回同意。可通过下述联系方式以书面、电话或电子邮件提出，公司将立即处理。亦可通过法定代理人或受委托人提出。'
          }]
        },
        {
          h: { ko: '10. 개인정보 보호책임자', en: '10. Privacy Officer', zh: '10. 个人信息保护负责人' },
          p: [{
            ko: '회사는 「개인정보 보호법」 제31조제2항에 따라 사업주 또는 대표자가 개인정보 보호책임자가 됩니다. 개인정보 처리에 관한 문의, 불만 처리, 피해 구제는 아래로 연락해 주시기 바랍니다.',
            en: 'Pursuant to Article 31(2) of the Act, the Company’s business owner or representative serves as the Privacy Officer. Please direct enquiries, complaints and remedy requests concerning personal information to the contact below.',
            zh: '依据该法第31条第2款，公司的业主或代表人担任个人信息保护负责人。有关个人信息处理的咨询、投诉与救济，请联系下述方式。'
          }],
          table: [
            [{ ko: '개인정보 보호책임자', en: 'Privacy Officer', zh: '个人信息保护负责人' }, { ko: L(CORP.rep) + ' (대표) ' + L(TODO) + ' 별도의 담당자를 두실 경우 성명·부서를 알려 주세요.', en: L(CORP.rep) + ' (Representative) ' + L(TODO) + ' If a separate officer is appointed, please provide the name and department.', zh: L(CORP.rep) + '（代表） ' + L(TODO) + ' 如另设负责人，请提供姓名与部门。' }],
            [{ ko: '전화', en: 'Telephone', zh: '电话' }, { ko: CORP.tel, en: CORP.tel, zh: CORP.tel }],
            [{ ko: '전자우편', en: 'Email', zh: '电子邮件' }, { ko: CORP.mail, en: CORP.mail, zh: CORP.mail }]
          ]
        },
        {
          h: { ko: '11. 권익침해 구제 방법', en: '11. Remedies for infringement', zh: '11. 权益侵害救济方法' },
          p: [{
            ko: '개인정보 침해로 인한 상담·신고가 필요하신 경우 아래 기관에 문의하실 수 있습니다.',
            en: 'For consultation or reporting of personal information infringement, you may contact the following bodies.',
            zh: '如需就个人信息侵害进行咨询或举报，可联系下列机构。'
          }],
          ul: [
            { ko: '개인정보침해 신고센터 (한국인터넷진흥원) — 국번없이 118 / privacy.kisa.or.kr', en: 'Korea Internet & Security Agency, Privacy Infringement Report Centre — 118 / privacy.kisa.or.kr', zh: '个人信息侵害举报中心（韩国互联网振兴院）— 118 / privacy.kisa.or.kr' },
            { ko: '개인정보 분쟁조정위원회 — 1833-6972 / www.kopico.go.kr', en: 'Personal Information Dispute Mediation Committee — 1833-6972 / www.kopico.go.kr', zh: '个人信息纠纷调解委员会 — 1833-6972 / www.kopico.go.kr' },
            { ko: '대검찰청 사이버수사과 — 국번없이 1301 / www.spo.go.kr', en: 'Supreme Prosecutors’ Office, Cyber Investigation Division — 1301 / www.spo.go.kr', zh: '大检察厅网络搜查科 — 1301 / www.spo.go.kr' },
            { ko: '경찰청 사이버수사국 — 국번없이 182 / ecrm.police.go.kr', en: 'National Police Agency, Cyber Bureau — 182 / ecrm.police.go.kr', zh: '警察厅网络搜查局 — 182 / ecrm.police.go.kr' }
          ]
        },
        {
          h: { ko: '12. 개인정보 처리방침의 변경', en: '12. Changes to this Policy', zh: '12. 本方针的变更' },
          p: [{
            ko: '이 개인정보 처리방침은 ' + EFF + '부터 적용됩니다. 내용을 추가·삭제·수정하는 경우에는 변경 사항을 시행 7일 전부터 이 페이지에 공지합니다.',
            en: 'This Privacy Policy takes effect on ' + EFF + '. Where it is amended, the changes will be announced on this page at least seven days before they take effect.',
            zh: '本个人信息处理方针自' + EFF + '起施行。内容增删或修改时，将于施行前7日起在本页面公告。'
          }]
        }
      ]
    };
  }

  /* ---------- 이용 및 저작권 안내 ---------- */
  function notice() {
    return {
      title: { ko: '이용 및 저작권 안내', en: 'Site Use and Copyright', zh: '使用及版权说明' },
      lead: {
        ko: '이 웹사이트의 콘텐츠 이용과 관련하여 아래 사항을 안내드립니다.',
        en: 'The following applies to the use of the content on this website.',
        zh: '关于本网站内容的使用，谨说明如下事项。'
      },
      secs: [
        {
          h: { ko: '1. 콘텐츠의 저작권', en: '1. Copyright in the content', zh: '1. 内容的著作权' },
          p: [{
            ko: '이 웹사이트에 실린 글, 사진, 도표, 로고, 디자인 등 모든 콘텐츠의 저작권은 ' + L(CORP.name) + '에 있습니다. 「저작권법」에 따라 보호되며, 회사의 사전 서면 동의 없이 복제·배포·전송·전시·2차적 저작물 작성 등의 방법으로 이용할 수 없습니다.',
            en: 'Copyright in all content on this website — text, photographs, diagrams, logos and design — belongs to ' + L(CORP.name) + '. It is protected under the Copyright Act of the Republic of Korea and may not be reproduced, distributed, transmitted, displayed or adapted without the Company’s prior written consent.',
            zh: '本网站所载文字、照片、图表、标识、设计等全部内容的著作权归' + L(CORP.name) + '所有，受韩国《著作权法》保护。未经公司事先书面同意，不得以复制、发行、传输、展示或改编等方式使用。'
          }]
        },
        {
          h: { ko: '2. 제품 정보의 성격', en: '2. Nature of the product information', zh: '2. 产品信息的性质' },
          p: [{
            ko: '이 웹사이트에 게시된 제품 정보, 함량, 시험 결과 등은 B2B 상담을 위한 참고 자료입니다. 실제 거래 조건은 개별 계약으로 정해지며, 게시된 내용이 청약이나 품질 보증을 구성하지 않습니다.',
            en: 'Product details, contents and test results shown here are reference material for B2B discussions. Actual terms are set by individual contract; nothing published here constitutes an offer or a warranty of quality.',
            zh: '本网站所载产品信息、含量、检测结果等为B2B洽谈的参考资料。实际交易条件以个别合同约定为准，所载内容不构成要约或质量保证。'
          }]
        },
        {
          h: { ko: '3. 외부 링크', en: '3. External links', zh: '3. 外部链接' },
          p: [{
            ko: '이 웹사이트는 회사 공식몰 등 외부 사이트로 연결되는 링크를 포함할 수 있습니다. 링크된 사이트의 콘텐츠와 개인정보 처리에 대해서는 해당 사이트의 정책이 적용됩니다.',
            en: 'This website may link to external sites such as the Company’s online shop. The content and privacy practices of linked sites are governed by those sites’ own policies.',
            zh: '本网站可能包含指向公司官方商城等外部网站的链接。被链接网站的内容与个人信息处理适用该网站自身的政策。'
          }]
        },
        {
          h: { ko: '4. 전자우편 주소의 무단 수집 거부', en: '4. Refusal of unauthorised email collection', zh: '4. 拒绝擅自收集电子邮箱地址' },
          p: [{
            ko: '이 웹사이트에 게시된 전자우편 주소가 자동 수집 프로그램이나 그 밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부합니다. 수집된 주소로 영리목적의 광고성 정보를 전송하는 행위는 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 제50조에 따라 수신자의 사전 동의를 받아야 합니다.',
            en: 'We refuse the unauthorised collection, by automated programs or other technical means, of email addresses published on this website. Sending commercial advertising to such addresses requires the recipient’s prior consent under Article 50 of the Act on Promotion of Information and Communications Network Utilisation and Information Protection.',
            zh: '本网站拒绝以自动收集程序或其他技术装置擅自收集所载电子邮箱地址。向该等地址发送营利目的广告性信息，依韩国《信息通信网法》第50条须取得接收者事先同意。'
          }]
        }
      ]
    };
  }

  /* ---------- 그리기 ---------- */
  function render(doc) {
    var h = '<h2 class="legal-title" data-page-title>' + esc(L(doc.title)) + '</h2>' +
      '<p class="legal-eff">' + esc(L({ ko: '시행일 ', en: 'Effective ', zh: '施行日 ' })) + EFF + '</p>' +
      '<p class="legal-lead">' + esc(L(doc.lead)) + '</p>';
    if (doc.box) { h += '<p class="legal-box">' + esc(L(doc.box)) + '</p>'; }
    doc.secs.forEach(function (s) {
      h += '<section class="legal-sec"><h3>' + esc(L(s.h)) + '</h3>';
      (s.p || []).forEach(function (t) { h += '<p>' + esc(L(t)) + '</p>'; });
      if (s.ul) {
        h += '<ul class="legal-ul">' + s.ul.map(function (t) { return '<li>' + esc(L(t)) + '</li>'; }).join('') + '</ul>';
      }
      if (s.table) {
        h += '<table class="legal-table"><tbody>' + s.table.map(function (r) {
          return '<tr><th>' + esc(L(r[0])) + '</th><td>' + esc(L(r[1])) + '</td></tr>';
        }).join('') + '</tbody></table>';
      }
      h += '</section>';
    });
    return h;
  }

  function draw() {
    var p = document.getElementById('legal-privacy');
    var n = document.getElementById('legal-notice');
    if (p) { p.innerHTML = render(privacy()); }
    if (n) { n.innerHTML = render(notice()); }
  }

  draw();
  if ('MutationObserver' in window) {
    new MutationObserver(function () { window.setTimeout(draw, 0); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }
})();
