# KALIBIO — Global B2B Site

주식회사 카리바이오(KALIBIO Co., Ltd.) 글로벌 B2B 파트너·바이어용 웹사이트.
빌드 과정이 없는 순수 정적 사이트입니다.

## 로컬에서 보기

```bash
cd /Users/jung-yunho/Downloads/kalibiob2b-upgrade_11
python3 -m http.server 8000
```

브라우저에서 <http://localhost:8000> — 끝낼 때는 터미널에서 `Ctrl+C`.

> 파일을 더블클릭해서 `file://` 로 열면 안 됩니다. 언어 전환과 해시 라우팅이
> 동작하지 않습니다. 반드시 위 서버로 여세요.

## 구조

```
index.html              # 단일 페이지(해시 라우팅 SPA)
assets/css/style.css    # 디자인 토큰 + 컴포넌트
assets/js/i18n.js       # KO / EN / ZH 번역 사전 (387키, 3개 언어 전부)
assets/js/app.js        # 라우팅 · 언어 · 드로어 · 폼
assets/img/*.webp|jpg   # 제품 · 원료 사진
assets/docs/*.pdf       # 국문/영문 브로슈어
robots.txt, sitemap.xml # 사이트 루트에 놓일 때만 유효 (아래 참고)
```

## 배포 현황

현재 **GitHub Pages 임시 주소**에 올라가 있습니다.

- 저장소: <https://github.com/yunho1110/kalibiob2b> (public, `main` 브랜치 루트)
- 공개 주소: <https://yunho1110.github.io/kalibiob2b/>

수정 후 반영은 `main` 에 push 하면 1~2분 내 자동 반영됩니다.

```bash
git add -A && git commit -m "메시지" && git push
```

## 실제 도메인으로 옮길 때 (체크리스트)

1. **색인 차단 해제** — 지금은 `noindex` 입니다. github.io 임시 주소가 검색에
   잡히면 나중에 실제 도메인과 중복 콘텐츠가 되기 때문에 막아둔 것입니다.

   ```bash
   sed -i '' 's#content="noindex,nofollow"#content="index,follow,max-image-preview:large"#' index.html
   ```

2. **주소 치환** — `index.html` 의 `<head>`, `robots.txt`, `sitemap.xml` 에
   GitHub Pages 주소가 들어 있습니다.

   ```bash
   NEW="https://b2b.kalibio.co.kr"   # 실제 주소로, 끝에 / 없이
   sed -i '' "s#https://yunho1110\.github\.io/kalibiob2b#$NEW#g" index.html robots.txt sitemap.xml
   ```

   > 본문의 "웹사이트 www.kalibio.co.kr" 링크 2곳은 회사 대표 사이트를 가리키는
   > 것이므로 일부러 그대로 뒀습니다. 치환 대상이 아닙니다.

3. **robots.txt / sitemap.xml 위치** — 사이트 **루트**에 있을 때만 효력이
   있습니다. GitHub Pages 서브경로(`/kalibiob2b/`)에서는 동작하지 않고,
   카페24 쇼핑몰 하위 경로에 올릴 때도 마찬가지입니다. 루트를 못 쓰면 두 파일은
   빼세요.

4. **카페24 쇼핑몰 주의** — `kalibio.co.kr` 은 카페24 **쇼핑몰(EC)** 입니다.
   쇼핑몰 루트(`/`)는 카페24 템플릿 엔진이 생성하므로 `index.html` 을 올려도
   홈을 대체하지 못하고, `robots.txt` 도 이미 카페24가 서비스 중이라 덮을 수
   없습니다. 이 사이트는 **별도 호스팅 + 서브도메인** 전제로 만들어졌습니다.

5. **`www` 정리(별건)** — `kalibio.co.kr` 과 `www.kalibio.co.kr` 이 둘 다 200으로
   응답하고 서로 리다이렉트하지 않습니다. 쇼핑몰 쪽 중복 콘텐츠 문제이니 카페24에서
   한쪽으로 통일하시는 게 좋습니다.

## 데이터 출처

- 임상 수치: 한국바이오임상연구센터(KBRC) 인체적용시험, 피험자 12명
- 원료 성분: 한국광해광업공단(KOMIR) 기술연구원, 2024.4.30~5.22, KS E 3098:2004 등
- 산업 활용 매트릭스: KOMIR 자료

## 알려진 한계

- **섹션별 URL 없음** — 해시 라우팅이라 검색엔진이 보는 주소는 `/` 하나입니다.
  섹션 단위 색인이 필요하면 뷰마다 정적 HTML을 뽑거나 서버 rewrite가 필요합니다.
- **문의 폼에 서버가 없음** — 작성 내용을 메일 앱으로 넘깁니다. 실제로 리드를
  수집하려면 Formspree·Web3Forms 같은 외부 엔드포인트를 `<form action>` 에
  붙이면 됩니다(정적 호스팅 유지 가능).
- **설비 사진 미확보** — 제품 › 주요공정의 "실제 사용 설비" 카드 10개는 사진
  자리가 비어 있습니다.
- **파트너 협력 내용 미기재** — 확인되지 않은 관계를 적지 않았습니다. 로고와
  함께 채워 넣을 자리입니다.
