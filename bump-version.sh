#!/bin/sh
# CSS/JS 캐시 무효화 — 커밋 전에 실행한다.
# GitHub Pages 가 정적 파일에 max-age=600 을 주기 때문에, 파일만 바꾸면
# 최대 10분 동안 방문자 브라우저가 예전 CSS/JS 를 계속 쓴다.
python3 - <<'PY'
import re, time
V = time.strftime('%Y%m%d%H%M')
p = 'index.html'
s = open(p, encoding='utf-8').read()
s, n = re.subn(r'(assets/(?:css/style\.css|js/i18n\.js|js/app\.js))(\?v=\d+)?',
               lambda m: m.group(1) + '?v=' + V, s)
open(p, 'w', encoding='utf-8').write(s)
print(f'asset version -> {V}  ({n}곳)')
PY
