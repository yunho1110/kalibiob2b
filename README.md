# KALIBIO — Global B2B Site

주식회사 카리바이오(KALIBIO Co., Ltd.) 글로벌 B2B 파트너·바이어용 웹사이트.
빌드 과정이 없는 순수 정적 사이트입니다.

## ⚠️ 먼저 읽어주세요 — 수정본이 사라지는 이유

**GitHub 웹의 "Add files via upload" 로 옛 폴더를 올리면 그동안의 수정이 통째로 덮입니다.**
실제로 2026-09 에 이 일이 일어나 접근성·대비·SEO 수정이 전부 사라졌습니다.

- 로컬에 `kalibio-site` 같은 **오래된 사본이 있으면 지우세요.**
- 이 저장소를 clone 해서 그 폴더에서만 작업하세요.

```bash
git clone https://github.com/yunho1110/kalibiob2b.git
cd kalibiob2b
# 수정 후
git add -A && git commit -m "메시지" && git push
```

## 로컬에서 보기

```bash
python3 -m http.server 8000
```

<http://localhost:8000> — 파일을 더블클릭해 `file://` 로 열면 언어 전환과
해시 라우팅이 동작하지 않습니다.

## 구조

```
index.html              # 단일 페이지(해시 라우팅 SPA)
assets/css/style.css    # 디자인 시스템 + 컴포넌트
assets/js/i18n.js       # KO / EN / ZH 번역 사전 (한 문자열당 한 줄)
assets/js/app.js        # 라우팅 · 언어 · 드로어 · 폼
assets/img/             # 제품 · 원료 · 설비 · 협력기관 로고
assets/docs/*.pdf       # 국문/영문 브로슈어
```

## 배포

- 저장소: <https://github.com/yunho1110/kalibiob2b> (public, `main` 루트)
- 공개 주소: <https://yunho1110.github.io/kalibiob2b/>
- `main` 에 push 하면 1~2분 내 자동 반영됩니다.

### 실제 도메인으로 옮길 때

1. **색인 차단 해제** — 지금은 `<meta name="robots" content="noindex,nofollow">`.
   github.io 임시 주소가 검색에 잡히면 실제 도메인과 중복 콘텐츠가 되기 때문입니다.
   실제 도메인에 올릴 때 이 줄을 지우세요.
2. **robots.txt / sitemap.xml** — 서브경로에서는 효력이 없어 지웠습니다.
   루트 도메인을 쓰게 되면 그때 다시 만드세요.
3. **카페24 주의** — `kalibio.co.kr` 은 카페24 **쇼핑몰(EC)** 입니다. 쇼핑몰 루트는
   카페24 템플릿이 생성하므로 `index.html` 을 올려도 홈을 대체하지 못합니다.
   이 사이트는 **별도 호스팅 + 서브도메인** 전제입니다.

## 데이터 출처

- 임상 수치: 한국바이오임상연구센터(KBRC) 인체적용시험, 피험자 12명
- 원료 성분: 한국광해광업공단(KOMIR) 기술연구원, 2024.4.30~5.22, KS E 3098:2004 등
- 산업 활용 매트릭스: KOMIR 자료

## 알려진 한계

- **대비 미달 43건** — 위 업로드 사고로 이전 접근성 수정이 사라진 상태입니다.
  홈 '칼륨장석 알아보기' 버튼은 배경과 같은 색(1.00:1)이라 사실상 보이지 않습니다.
- **섹션별 URL 없음** — 해시 라우팅이라 검색엔진이 보는 주소는 `/` 하나입니다.
- **문의 폼에 서버 없음** — 메일 앱으로 넘깁니다. 실제 수집은 외부 폼 엔드포인트 필요.
- 카리비누 4종 카드 내용은 기업소개 PPT 원본과 대조되지 않았습니다.
