# KALIBIO — Global B2B Site

주식회사 카리바이오(KALIBIO Co., Ltd.) 글로벌 B2B 파트너·바이어용 웹사이트.

## 구조

```
index.html              # 단일 페이지(해시 라우팅 SPA)
assets/css/style.css    # 디자인 시스템 + 컴포넌트
assets/js/i18n.js       # KO / EN / ZH 번역 사전
assets/js/app.js        # 라우팅 · 언어전환 · 폼 · 라이트박스
assets/img/*.webp|jpg   # 제품 · 원료 사진
assets/docs/*.pdf       # 국문/영문 브로슈어
```

## 로컬 실행

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## 데이터 출처

- 임상 수치: 한국바이오임상연구센터(KBRC) 인체적용시험, 피험자 12명
- 원료 성분: 한국광해광업공단(KOMIR) 기술연구원, 2024.4.30~5.22, KS E 3098:2004 등
- 산업 활용 매트릭스: KOMIR 자료
