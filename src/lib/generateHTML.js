import { getConceptCSS } from './themes.js'

function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')
}
function esc2(s) {
  return String(s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'")
}

export function generateFormHTML(title, questions, theme, settings={}, assets={}) {
  const {
    animType = 0, fontFamily = "'Noto Sans KR',sans-serif",
    conceptTheme = 'default',
    useStart = true,
    bgBlur = 0, bgOverlay = 0.5, bgOverlayColor = '#000000',
    allowBack = true, autoNext = false, useConfetti = true, useKb = true,
    startTag = '✦ Form', startBtnText = '시작하기', startDesc = '',
    doneTitle = '제출 완료!', doneDesc = '응답해주셔서 감사합니다 🎉',
    doneCta = '', doneUrl = '',
    scriptUrl = '',
  } = settings

  // assets에서 이미지 데이터 추출
  const { coverImgData = null, qImgData = {}, bgImgData = null } = assets
  const TOTAL = questions.length

  if (!TOTAL) return `<html><body style="background:#0e0e14;color:#7a788f;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;font-size:14px">질문을 추가해주세요.</body></html>`

  const conceptCSS = getConceptCSS(conceptTheme, theme.c1, theme.c2, fontFamily)

  // ── 0번부터 9번까지 모든 애니메이션 CSS ──
  const animCSS = [
    // 0: 슬라이드 업
    `@keyframes siU{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}} @keyframes soU{from{opacity:1}to{opacity:0;transform:translateY(-40px)}} @keyframes siD{from{opacity:0;transform:translateY(-40px)}to{opacity:1;transform:none}} @keyframes soD{from{opacity:1}to{opacity:0;transform:translateY(40px)}} .en{animation:siU .38s ease both}.ex{animation:soU .28s ease both} .ep{animation:siD .38s ease both}.xp{animation:soD .28s ease both}`,
    // 1: 페이드 + 블러
    `@keyframes fdi{from{opacity:0;transform:scale(.94);filter:blur(6px)}to{opacity:1;transform:none;filter:blur(0)}} @keyframes fdo{from{opacity:1;filter:blur(0)}to{opacity:0;transform:scale(1.05);filter:blur(6px)}} .en,.ep{animation:fdi .4s cubic-bezier(.22,1,.36,1) both} .ex,.xp{animation:fdo .28s ease both}`,
    // 2: 플립 X
    `@keyframes fxIn{from{opacity:0;transform:perspective(700px) rotateX(14deg) scale(.97)}to{opacity:1;transform:none}} @keyframes fxOut{from{opacity:1}to{opacity:0;transform:perspective(700px) rotateX(-14deg) scale(.97)}} .en,.ep{animation:fxIn .4s cubic-bezier(.22,1,.36,1) both} .ex,.xp{animation:fxOut .28s ease both}`,
    // 3: 플립 Y
    `@keyframes fyIn{from{opacity:0;transform:perspective(700px) rotateY(-16deg) scale(.97)}to{opacity:1;transform:none}} @keyframes fyOut{from{opacity:1}to{opacity:0;transform:perspective(700px) rotateY(16deg) scale(.97)}} .en{animation:fyIn .42s cubic-bezier(.22,1,.36,1) both}.ex{animation:fyOut .28s ease both}`,
    // 4: 줌 인
    `@keyframes ziIn{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}} @keyframes ziOut{from{opacity:1}to{opacity:0;transform:scale(1.2)}} .en,.ep{animation:ziIn .4s cubic-bezier(.34,1.4,.64,1) both}.ex,.xp{animation:ziOut .28s ease both}`,
    // 5: 슬라이드 좌우
    `@keyframes slIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:none}} @keyframes slOut{from{opacity:1}to{opacity:0;transform:translateX(-60px)}} .en{animation:slIn .38s cubic-bezier(.22,1,.36,1) both}.ex{animation:slOut .28s ease both}`,
    // 6: 바운스
    `@keyframes bnIn{0%{opacity:0;transform:translateY(60px) scale(.9)}60%{transform:translateY(-8px) scale(1.02)}100%{opacity:1;transform:none}} .en,.ep{animation:bnIn .55s cubic-bezier(.22,1,.36,1) both}`,
    // 7: 회전
    `@keyframes rzIn{from{opacity:0;transform:rotate(-8deg) scale(.85)}to{opacity:1;transform:none}} .en,.ep{animation:rzIn .45s cubic-bezier(.22,1,.36,1) both}`,
    // 8: 글리치
    `@keyframes glIn{0%{opacity:0;transform:translateX(-4px)}100%{opacity:1;transform:none}} .en,.ep{animation:glIn .45s ease both}`,
    // 9: 언폴드
    `@keyframes ufIn{from{opacity:0;transform:translateY(-30px) scaleY(.6)}to{opacity:1;transform:none}} .en,.ep{animation:ufIn .42s cubic-bezier(.22,1,.36,1) both}`,
  ][animType] || ''

  const slides = questions.map((q, i) => {
    const imgH = qImgData[q.id]
      ? `<img src="${qImgData[q.id]}" style="width:calc(100% + 68px);margin:-38px -34px 24px;height:180px;object-fit:cover;border-radius:24px 24px 0 0;display:block" alt="">`
      : ''
    
    let field = ''
    if(q.type==='short') field=`<input type="text" class="fi" id="f${q.id}" placeholder="${esc(q.hint||'답변을 입력하세요...')}" onkeydown="if(event.key==='Enter')gn(${i})">`
    else if(q.type==='long') field=`<textarea class="fi" id="f${q.id}" style="height:110px;resize:none;padding-top:13px;line-height:1.6" placeholder="${esc(q.hint||'답변을 입력하세요...')}"></textarea>`
    else if(q.type==='phone') field=`<div style="position:relative"><div style="position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--tx3);pointer-events:none">🇰🇷 +82</div><input type="tel" class="fi" id="f${q.id}" style="padding-left:72px" placeholder="010-0000-0000" inputmode="tel" onkeydown="if(event.key==='Enter')gn(${i})"></div>`
    else if(q.type==='email') field=`<input type="email" class="fi" id="f${q.id}" placeholder="example@email.com" inputmode="email" onkeydown="if(event.key==='Enter')gn(${i})">`
    else if(q.type==='multiple'||q.type==='single') {
      const isM=q.type==='multiple'
      const opts=(q.options||[]).map(o=>`<div class="ci${isM?'':' si'}" onclick="pick(this,'g${q.id}',${isM})"><div class="cb${isM?'':' rb'}"></div><span>${esc(o)}</span></div>`).join('')
      field=`<div class="cg" id="g${q.id}">${opts}${q.other?`<div class="ci" onclick="pickOther(this,'g${q.id}',${isM})"><div class="cb"></div><input class="oi" placeholder="기타..." id="oi${q.id}"></div>`:''}</div>`
    } else if(q.type==='legal') {
      field=`<div class="ls">${esc(q.legalText||'').replace(/\n/g,'<br>')}</div><div class="la" id="la${q.id}" onclick="this.classList.toggle('ck')"><div class="ld"></div><span style="font-size:13px;color:var(--tx2);font-weight:300"><strong style="color:var(--tx);font-weight:500">위 내용에 동의합니다.</strong></span></div>`
    }

    const isLast = i === TOTAL - 1
    const back = allowBack && i > 0 ? `<button class="bb" onclick="gp(${i})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>이전</button>` : '<span></span>'
    
    return `<div class="sl" id="sl${i}" style="display:none">
      <div class="card">${imgH}
        <div class="cn">STEP ${String(i+1).padStart(2,'0')} / ${String(TOTAL).padStart(2,'0')}</div>
        <div class="ct">${esc(q.label||'질문')}</div>
        ${q.hint?`<div class="cs">${esc(q.hint)}</div>`:''}
        <div style="margin-top:6px">${field}</div>
        <div class="em" id="e${i}"></div>
        <div class="cf">${back}<button class="nb" onclick="${isLast?'sub()':'gn('+i+')'}"${isLast?' id="sb"':''}><span class="sp"></span><span class="nl">${isLast?'신청 완료하기 🎉':'다음 질문'}</span></button></div>
      </div>
    </div>`
  }).join('')

  // 유효성 검사 로직
  const vldLogic = questions.map((q, i) => {
    return `case ${i}: {
      const el = document.getElementById('f${q.id}') || document.getElementById('g${q.id}') || document.getElementById('la${q.id}');
      ${q.required ? `if(!checkRequired(${i}, '${q.type}', '${q.id}')) return false;` : ''}
      saveAnswer('${esc2(q.label)}', '${q.type}', '${q.id}');
      break;
    }`
  }).join('\n')

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<title>${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Gmarket+Sans:wght@300;500;700&family=Noto+Sans+KR:wght@300;400;500&family=Gowun+Dodum&display=swap" rel="stylesheet">
<style>
:root{--c1:${theme.c1};--c2:${theme.c2};--tx:#f0eff8;--tx2:#9997ab;--tx3:#7a788f;--bg2:#1a1a28;--bd:rgba(255,255,255,.09);--bd2:rgba(255,255,255,.15)}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:${fontFamily};min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;overflow:hidden;position:relative;background:#0e0e14;color:var(--tx)}

/* ── 배경 레이어 시스템 ── */
#bg-layer{position:fixed;inset:0;z-index:-2;background-image:url('${bgImgData || ''}');background-size:cover;background-position:center;filter:blur(${bgBlur}px);transform:scale(1.1);transition:filter .3s}
#bg-overlay{position:fixed;inset:0;z-index:-1;background:${bgOverlayColor};opacity:${bgOverlay}}

.wrap{position:relative;z-index:1;width:100%;max-width:540px}
.sl{width:100%;display:none;flex-direction:column}
.sl.active{display:flex}
.card{background:rgba(22,22,31,0.92);border:1px solid var(--bd);border-radius:24px;padding:38px 34px 30px;backdrop-filter:blur(20px);box-shadow:0 24px 64px rgba(0,0,0,0.4);position:relative;overflow:hidden}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--c1),var(--c2),transparent)}

.cn{font-family:'Gmarket Sans',sans-serif;font-size:11px;font-weight:700;color:var(--c1);margin-bottom:12px;letter-spacing:1px}
.ct{font-family:'Gmarket Sans',sans-serif;font-size:24px;font-weight:500;line-height:1.4;margin-bottom:8px}
.cs{font-size:14px;color:var(--tx2);margin-bottom:22px;font-weight:300}

.fi{width:100%;background:var(--bg2);border:1.5px solid var(--bd);border-radius:14px;padding:15px;color:#fff;font-family:inherit;font-size:16px;outline:none;transition:border-color .2s}
.fi:focus{border-color:var(--c1)}
.cg{display:flex;flex-direction:column;gap:10px}
.ci{display:flex;align-items:center;gap:12px;background:var(--bg2);border:1.5px solid var(--bd);border-radius:14px;padding:14px;cursor:pointer;transition:all .2s}
.ci.ck{border-color:var(--c1);background:rgba(124,108,252,0.1)}
.cb{width:20px;height:20px;border-radius:6px;border:2px solid var(--bd2);flex-shrink:0}
.rb{border-radius:50%}.ci.ck .cb{background:var(--c1);border-color:var(--c1)}

.cf{display:flex;justify-content:center;margin-top:26px;gap:12px;align-items:center}
.bb{background:none;border:none;color:var(--tx3);cursor:pointer;display:flex;align-items:center;gap:5px;font-family:inherit}
.nb{background:linear-gradient(135deg,var(--c1),var(--c2));color:#fff;border:none;border-radius:14px;padding:15px 30px;font-weight:500;cursor:pointer;font-family:inherit;flex:1;max-width:200px}

.stag{display:inline-block;color:var(--c1);font-family:'Gmarket Sans',sans-serif;font-size:11px;font-weight:700;margin-bottom:16px;background:rgba(124,108,252,0.1);padding:4px 12px;border-radius:20px}
.stit{font-family:'Gmarket Sans',sans-serif;font-size:32px;font-weight:700;margin-bottom:12px;line-height:1.2}
.sdesc{font-size:15px;color:var(--tx2);margin-bottom:24px;line-height:1.6}
.sbt{background:linear-gradient(135deg,var(--c1),var(--c2));color:#fff;border:none;border-radius:14px;padding:16px 32px;cursor:pointer;font-family:inherit;font-weight:600;font-size:16px}

#pf-bar{position:fixed;top:0;left:0;height:4px;background:linear-gradient(90deg,var(--c1),var(--c2));z-index:100;transition:width .3s}
.em{color:#f87171;font-size:12px;margin-top:8px;display:none}

${conceptCSS} ${animCSS}
</style>
</head>
<body>
<div id="pf-bar" style="width:0%"></div>
<div id="bg-layer"></div>
<div id="bg-overlay"></div>

<div class="wrap">
  ${useStart ? `
  <div id="ss" class="sl active" style="display:flex">
    <div class="card">
      ${coverImgData ? `<img src="${coverImgData}" style="width:calc(100% + 68px);margin:-38px -34px 24px;height:220px;object-fit:cover;border-radius:24px 24px 0 0;display:block">` : ''}
      <div class="stag">${esc(startTag)}</div>
      <div class="stit">${esc(title)}</div>
      <div class="sdesc">${esc(startDesc)}</div>
      <button class="sbt" onclick="sf()">${esc(startBtnText)}</button>
    </div>
  </div>` : ''}

  ${slides}

  <div id="done" class="sl">
    <div class="card" style="text-align:center">
      <div style="font-size:50px;margin-bottom:20px">🎉</div>
      <div class="ct">${esc(doneTitle)}</div>
      <div class="cs">${esc(doneDesc)}</div>
      ${doneCta ? `<a href="${doneUrl}" target="_blank" style="display:inline-block;margin-top:20px;padding:12px 24px;background:var(--c1);color:#fff;text-decoration:none;border-radius:12px;font-weight:600">${esc(doneCta)}</a>` : ''}
    </div>
  </div>
</div>

<script>
let cur = ${useStart ? -1 : 0};
const TOTAL = ${TOTAL};
const ans = {};
let anim = false;

function sf() {
  const ss = document.getElementById('ss');
  const sl0 = document.getElementById('sl0');
  if(ss) ss.style.display = 'none';
  if(sl0) sl0.style.display = 'flex';
  cur = 0;
  updateProgress();
}

function updateProgress() {
  const bar = document.getElementById('pf-bar');
  const percent = cur < 0 ? 0 : ((cur + 1) / TOTAL) * 100;
  bar.style.width = percent + '%';
}

function gn(i) {
  if(anim) return;
  if(!vld(i)) return;
  
  const currentSlide = document.getElementById('sl' + i);
  cur++;
  const nextSlide = cur >= TOTAL ? document.getElementById('done') : document.getElementById('sl' + cur);
  
  transition(currentSlide, nextSlide, 'n');
  updateProgress();
}

function gp(i) {
  if(anim || cur <= 0) return;
  
  const currentSlide = document.getElementById('sl' + i);
  cur--;
  const prevSlide = document.getElementById('sl' + cur);
  
  transition(currentSlide, prevSlide, 'p');
  updateProgress();
}

function transition(from, to, dir) {
  anim = true;
  const outCls = dir === 'n' ? 'ex' : 'xp';
  const inCls = dir === 'n' ? 'en' : 'ep';
  
  from.classList.add(outCls);
  setTimeout(() => {
    from.style.display = 'none';
    from.classList.remove(outCls);
    to.style.display = 'flex';
    to.classList.add(inCls);
    setTimeout(() => {
      to.classList.remove(inCls);
      anim = false;
    }, 400);
  }, 300);
}

function pick(el, gid, multi) {
  if(!multi) document.querySelectorAll('#' + gid + ' .ci').forEach(c => c.classList.remove('ck'));
  el.classList.toggle('ck');
  ${autoNext ? "if(!multi) setTimeout(() => gn(cur), 300);" : ""}
}

function vld(i) {
  const err = document.getElementById('e' + i);
  if(err) err.style.display = 'none';
  
  switch(i) {
    ${vldLogic}
  }
  return true;
}

function checkRequired(i, type, id) {
  let valid = true;
  if(type === 'short' || type === 'long' || type === 'phone' || type === 'email') {
    if(!document.getElementById('f' + id).value.trim()) valid = false;
  } else if(type === 'multiple' || type === 'single') {
    if(!document.querySelector('#g' + id + ' .ci.ck')) valid = false;
  } else if(type === 'legal') {
    if(!document.getElementById('la' + id).classList.contains('ck')) valid = false;
  }
  
  if(!valid) {
    const err = document.getElementById('e' + i);
    if(err) {
      err.textContent = '⚠️ 필수 항목입니다.';
      err.style.display = 'block';
    }
  }
  return valid;
}

function saveAnswer(label, type, id) {
  if(type === 'multiple' || type === 'single') {
    const sels = [...document.querySelectorAll('#g' + id + ' .ci.ck span')].map(s => s.textContent);
    ans[label] = sels.join(', ');
  } else if(type === 'legal') {
    ans[label] = '동의함';
  } else {
    ans[label] = document.getElementById('f' + id).value;
  }
}

async function sub() {
  if(anim) return;
  if(!vld(TOTAL - 1)) return;
  
  // 메인 폼에 메시지 전송 (Supabase 저장용)
  window.parent.postMessage({ type: 'FORM_SUBMIT', answers: ans }, '*');
  
  // 완료 화면으로 이동
  const currentSlide = document.getElementById('sl' + (TOTAL - 1));
  const doneSlide = document.getElementById('done');
  transition(currentSlide, doneSlide, 'n');
  cur = TOTAL;
  updateProgress();
}

${useKb ? `
document.addEventListener('keydown', (e) => {
  if(e.key === 'Enter') {
    if(cur === -1) sf();
    else if(cur < TOTAL) gn(cur);
  }
});` : ''}
</script>
</body>
</html>`
}
