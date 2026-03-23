import { getConceptCSS } from './themes.js'

function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')
}
function esc2(s) {
  return String(s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'")
}

export function generateFormHTML(title, questions, theme, settings={}, assets={}) {
  const {
    animType=0, fontFamily="'Noto Sans KR',sans-serif",
    conceptTheme='default',
    useStart=true,
    bgBlur=0, bgOverlay=0.5, bgOverlayColor='#000000',
    allowBack=true, autoNext=false, useConfetti=true, useKb=true,
    startTag='✦ Form', startBtnText='시작하기', startDesc='',
    doneTitle='제출 완료!', doneDesc='응답해주셔서 감사합니다 🎉',
    doneCta='', doneUrl='',
    scriptUrl='',
  } = settings
  
  const { coverImgData=null, qImgData={}, bgImgData=null } = assets
  const TOTAL = questions.length

  if (!TOTAL) return `<html><body style="background:#0e0e14;color:#7a788f;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">질문을 추가해주세요.</body></html>`

  const conceptCSS = getConceptCSS(conceptTheme, theme.c1, theme.c2, fontFamily)

  // ── 0번부터 9번까지 모든 애니메이션 CSS (완벽 복구) ──
  const animCSS = [
    `@keyframes siU{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}} @keyframes soU{from{opacity:1}to{opacity:0;transform:translateY(-40px)}} @keyframes siD{from{opacity:0;transform:translateY(-40px)}to{opacity:1;transform:none}} @keyframes soD{from{opacity:1}to{opacity:0;transform:translateY(40px)}} .en{animation:siU .38s ease both}.ex{animation:soU .28s ease both} .ep{animation:siD .38s ease both}.xp{animation:soD .28s ease both}`,
    `@keyframes fdi{from{opacity:0;transform:scale(.94);filter:blur(6px)}to{opacity:1;transform:none;filter:blur(0)}} @keyframes fdo{from{opacity:1;filter:blur(0)}to{opacity:0;transform:scale(1.05);filter:blur(6px)}} .en,.ep{animation:fdi .4s cubic-bezier(.22,1,.36,1) both} .ex,.xp{animation:fdo .28s ease both}`,
    `@keyframes fxIn{from{opacity:0;transform:perspective(700px) rotateX(14deg) scale(.97)}to{opacity:1;transform:none}} @keyframes fxOut{from{opacity:1}to{opacity:0;transform:perspective(700px) rotateX(-14deg) scale(.97)}} .en,.ep{animation:fxIn .4s cubic-bezier(.22,1,.36,1) both} .ex,.xp{animation:fxOut .28s ease both}`,
    `@keyframes fyIn{from{opacity:0;transform:perspective(700px) rotateY(-16deg) scale(.97)}to{opacity:1;transform:none}} @keyframes fyInR{from{opacity:0;transform:perspective(700px) rotateY(16deg) scale(.97)}to{opacity:1;transform:none}} @keyframes fyOut{from{opacity:1}to{opacity:0;transform:perspective(700px) rotateY(16deg) scale(.97)}} @keyframes fyOutR{from{opacity:1}to{opacity:0;transform:perspective(700px) rotateY(-16deg) scale(.97)}} .en{animation:fyIn .42s cubic-bezier(.22,1,.36,1) both}.ex{animation:fyOut .28s ease both} .ep{animation:fyInR .42s cubic-bezier(.22,1,.36,1) both}.xp{animation:fyOutR .28s ease both}`,
    `@keyframes ziIn{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}} @keyframes ziOut{from{opacity:1;transform:none}to{opacity:0;transform:scale(1.2)}} .en,.ep{animation:ziIn .4s cubic-bezier(.34,1.4,.64,1) both} .ex,.xp{animation:ziOut .28s ease both}`,
    `@keyframes slIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:none}} @keyframes slOut{from{opacity:1}to{opacity:0;transform:translateX(-60px)}} @keyframes slInR{from{opacity:0;transform:translateX(-60px)}to{opacity:1;transform:none}} @keyframes slOutR{from{opacity:1}to{opacity:0;transform:translateX(60px)}} .en{animation:slIn .38s cubic-bezier(.22,1,.36,1) both}.ex{animation:slOut .28s ease both} .ep{animation:slInR .38s cubic-bezier(.22,1,.36,1) both}.xp{animation:slOutR .28s ease both}`,
    `@keyframes bnIn{0%{opacity:0;transform:translateY(60px) scale(.9)}60%{transform:translateY(-8px) scale(1.02)}80%{transform:translateY(4px)}100%{opacity:1;transform:none}} @keyframes bnOut{0%{opacity:1}100%{opacity:0;transform:translateY(-30px) scale(.95)}} .en,.ep{animation:bnIn .55s cubic-bezier(.22,1,.36,1) both} .ex,.xp{animation:bnOut .28s ease both}`,
    `@keyframes rzIn{from{opacity:0;transform:rotate(-8deg) scale(.85)}to{opacity:1;transform:none}} @keyframes rzOut{from{opacity:1}to{opacity:0;transform:rotate(8deg) scale(.85)}} .en,.ep{animation:rzIn .45s cubic-bezier(.22,1,.36,1) both} .ex,.xp{animation:rzOut .28s ease both}`,
    `@keyframes glIn{0%{opacity:0;transform:translateX(-4px) skewX(3deg)}20%{transform:translateX(3px) skewX(-2deg)}40%{transform:translateX(-2px) skewX(1deg)}100%{opacity:1;transform:none}} @keyframes glOut{0%{opacity:1}50%{transform:translateX(4px) skewX(-3deg)}100%{opacity:0;transform:translateX(-4px)}} .en,.ep{animation:glIn .45s ease both} .ex,.xp{animation:glOut .28s ease both}`,
    `@keyframes ufIn{from{opacity:0;transform:translateY(-30px) scaleY(.6);transform-origin:top}to{opacity:1;transform:none}} @keyframes ufOut{from{opacity:1}to{opacity:0;transform:translateY(30px) scaleY(.6);transform-origin:bottom}} .en,.ep{animation:ufIn .42s cubic-bezier(.22,1,.36,1) both} .ex,.xp{animation:ufOut .28s ease both}`,
  ][animType] || ''

  const slides = questions.map((q,i) => {
    const imgH = qImgData[q.id]
      ? `<img src="${qImgData[q.id]}" style="width:calc(100% + 68px);margin:-38px -34px 24px;height:180px;object-fit:cover;border-radius:24px 24px 0 0;display:block" alt="">`
      : ''
    let field=''
    if(q.type==='short') field=`<input type="text" class="fi" id="f${q.id}" placeholder="${esc(q.hint||'답변을 입력하세요...')}" onkeydown="if(event.key==='Enter')gn(${i})">`
    else if(q.type==='long') field=`<textarea class="fi" id="f${q.id}" style="height:110px;resize:none;padding-top:13px;line-height:1.6" placeholder="${esc(q.hint||'답변을 입력하세요...')}"></textarea>`
    else if(q.type==='phone') field=`<div style="position:relative"><div style="position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--tx3);pointer-events:none">🇰🇷 +82</div><input type="tel" class="fi" id="f${q.id}" style="padding-left:72px" placeholder="010-0000-0000" inputmode="tel" onkeydown="if(event.key==='Enter')gn(${i})"></div>`
    else if(q.type==='email') field=`<input type="email" class="fi" id="f${q.id}" placeholder="example@email.com" inputmode="email" onkeydown="if(event.key==='Enter')gn(${i})">`
    else if(q.type==='multiple'||q.type==='single') {
      const isM=q.type==='multiple'
      const opts=(q.options||[]).map(o=>`<div class="ci${isM?'':' si'}" onclick="pick(this,'g${q.id}',${isM})"><div class="cb${isM?'':' rb'}"></div><span>${esc(o)}</span></div>`).join('')
      const other=q.other?`<div class="ci${isM?'':' si'}" onclick="pickOther(this,'g${q.id}',${isM})"><div class="cb${isM?'':' rb'}"></div><input class="oi" placeholder="기타..." id="oi${q.id}" onclick="event.stopPropagation()"></div>`:''
      field=`<div class="cg" id="g${q.id}">${opts}${other}</div>`
    } else if(q.type==='legal') {
      field=`<div class="ls">${esc(q.legalText||'').replace(/\n/g,'<br>')}</div><div class="la" id="la${q.id}" onclick="this.classList.toggle('ck')"><div class="ld"></div><span style="font-size:13px;color:var(--tx2);font-weight:300"><strong style="color:var(--tx);font-weight:500">위 내용에 동의합니다.</strong></span></div>`
    }
    const isLast=i===TOTAL-1
    const back=allowBack&&i>0?`<button class="bb" onclick="gp(${i})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>이전</button>`:'<span></span>'
    return `<div class="sl" id="sl${i}" style="display:none">
  <div class="card">${imgH}
    <div class="cn">STEP ${String(i+1).padStart(2,'0')} / ${String(TOTAL).padStart(2,'0')}</div>
    <div class="ct">${esc(q.label||'질문').replace(/\n/g,'<br>')}</div>
    ${q.hint?`<div class="cs">${esc(q.hint)}</div>`:''}
    <div style="margin-top:6px">${field}</div>
    <div class="em" id="e${i}"></div>
    <div class="cf">${back}<button class="nb" onclick="${isLast?'sub()':'gn('+i+')'}"${isLast?' id="sb"':''}><span class="sp"></span><span class="nl">${isLast?'신청 완료하기 🎉':'다음 질문'}</span><svg class="na" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></div>
  </div>
</div>`
  }).join('')

  const vld = questions.map((q,i) => {
    if(q.type==='short'||q.type==='long') return `case ${i}:{const v=document.getElementById('f${q.id}')?.value.trim()||'';${q.required?`if(!v){er(${i},'답변을 입력해주세요.');return false;}`:''}ans['${esc2(q.label||'q'+i)}']=v;break;}`
    if(q.type==='phone') return `case ${i}:{const v=document.getElementById('f${q.id}')?.value.trim()||'';${q.required?`if(!v||!/^0\\d{1,2}-?\\d{3,4}-?\\d{4}$/.test(v)){er(${i},'올바른 전화번호를 입력해주세요.');return false;}`:''}ans['${esc2(q.label||'전화번호')}']=v;break;}`
    if(q.type==='email') return `case ${i}:{const v=document.getElementById('f${q.id}')?.value.trim()||'';${q.required?`if(!v||!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v)){er(${i},'올바른 이메일을 입력해주세요.');return false;}`:''}ans['${esc2(q.label||'이메일')}']=v;break;}`
    if(q.type==='multiple'||q.type==='single') return `case ${i}:{const sel=[...document.querySelectorAll('#g${q.id} .ci.ck')].map(el=>{const oi=el.querySelector('.oi');return oi?oi.value||'기타':el.querySelector('span').textContent;});${q.required?`if(!sel.length){er(${i},'하나 이상 선택해주세요.');return false;}`:''}ans['${esc2(q.label||'q'+i)}']=sel.join(', ');break;}`
    if(q.type==='legal') return `case ${i}:{${q.required?`if(!document.getElementById('la${q.id}')?.classList.contains('ck')){er(${i},'동의가 필요합니다.');return false;}`:''}ans['${esc2(q.label||'동의')}']=document.getElementById('la${q.id}')?.classList.contains('ck')?'동의':'미동의';break;}`
    return `case ${i}:break;`
  }).join('\n')

  const startHTML = useStart?`<div id="ss" class="sl active" style="display:flex"><div class="card">
    ${coverImgData?`<img src="${coverImgData}" style="width:calc(100% + 68px);margin:-38px -34px 24px;height:200px;object-fit:cover;border-radius:24px 24px 0 0;display:block" alt="">`:'' }
    <div class="stag">${esc(startTag)}</div>
    <div class="stit">${esc(title).replace(/\n/g,'<br>')}</div>
    ${startDesc?`<div class="sdesc">${esc(startDesc)}</div>`:''}
    <button class="sbt" onclick="sf()" onmousedown="rp(event,this)"><span>${esc(startBtnText)}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
    <div style="font-size:12px;color:var(--tx3);margin-top:14px">총 ${TOTAL}개 질문</div>
  </div></div>`:''

  return `<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<title>${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Gmarket+Sans:wght@300;500;700&family=Noto+Sans+KR:wght@300;400;500&family=Gowun+Dodum&display=swap" rel="stylesheet">
<style>
:root{--c1:${theme.c1};--c2:${theme.c2};--tx:#f0eff8;--tx2:#9997ab;--tx3:#7a788f;--bg2:#1a1a28;--bd:rgba(255,255,255,.09);--bd2:rgba(255,255,255,.15)}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:${fontFamily};min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;overflow:hidden;-webkit-font-smoothing:antialiased;position:relative;background:#0e0e14;color:var(--tx)}

/* ── 배경 레이어 (Fix) ── */
#bg-layer{position:fixed;inset:0;z-index:-2;background-image:url('${bgImgData || ''}');background-size:cover;background-position:center;filter:blur(${bgBlur}px);transform:scale(1.1);transition:filter .3s}
#bg-overlay{position:fixed;inset:0;z-index:-1;background:${bgOverlayColor};opacity:${bgOverlay}}

#pw{position:fixed;top:0;left:0;right:0;height:3px;background:rgba(255,255,255,.06);z-index:50}
#pf{height:100%;background:linear-gradient(90deg,var(--c1),var(--c2));border-radius:0 3px 3px 0;transition:width .6s cubic-bezier(.4,0,.2,1);position:relative}
#sc{position:fixed;top:14px;right:18px;font-size:12px;color:var(--tx3);z-index:50;font-variant-numeric:tabular-nums}
#gb{position:fixed;top:10px;left:14px;z-index:50;display:none;align-items:center;gap:5px;font-size:13px;color:var(--tx3);background:none;border:none;cursor:pointer}
#gb.v{display:flex}

.wrap{position:relative;z-index:1;width:100%;max-width:540px}
.sl{width:100%;display:none;flex-direction:column}
.sl.active{display:flex}
.card{background:rgba(22,22,31,.95);border:1px solid var(--bd);border-radius:24px;padding:38px 34px 30px;backdrop-filter:blur(20px);position:relative;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.35)}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--c1),var(--c2),transparent 80%)}

.cn{font-family:'Gmarket Sans',sans-serif;font-size:11px;font-weight:700;color:var(--c1);margin-bottom:12px}
.ct{font-family:'Gmarket Sans',sans-serif;font-size:clamp(18px,4.5vw,24px);font-weight:500;line-height:1.4;margin-bottom:8px;white-space:pre-line}
.stit{font-family:'Gmarket Sans',sans-serif;font-size:clamp(22px,5.5vw,34px);font-weight:700;line-height:1.2;margin-bottom:12px;white-space:pre-line}
.cs{font-size:14px;color:var(--tx2);font-weight:300;line-height:1.65;margin-bottom:22px}

.fi{width:100%;background:var(--bg2);border:1.5px solid var(--bd);border-radius:14px;padding:15px 18px;font-size:16px;color:var(--tx);font-family:inherit;outline:none}
.ci{display:flex;align-items:center;gap:13px;background:var(--bg2);border:1.5px solid var(--bd);border-radius:14px;padding:14px 17px;cursor:pointer;transition:all .2s;margin-bottom:10px}
.ci.ck{border-color:var(--c1);background:color-mix(in srgb,var(--c1) 10%,transparent)}
.cb{width:22px;height:22px;border-radius:6px;border:2px solid var(--bd2);flex-shrink:0}
.ci.ck .cb{background:var(--c1);border-color:var(--c1)}

.cf{display:flex;align-items:center;justify-content:center;margin-top:26px;gap:12px}
.nb{flex:1;max-width:200px;display:flex;align-items:center;justify-content:center;gap:9px;background:linear-gradient(135deg,var(--c1),var(--c2));color:#fff;border:none;border-radius:14px;padding:15px 28px;font-size:15px;font-weight:500;cursor:pointer}
.sbt{display:inline-flex;align-items:center;gap:9px;background:linear-gradient(135deg,var(--c1),var(--c2));color:#fff;border:none;border-radius:14px;padding:16px 32px;font-size:15px;font-weight:600;cursor:pointer}

${conceptCSS} ${animCSS}
</style></head><body>
<div id="bg-layer"></div><div id="bg-overlay"></div>
<div id="pw"><div id="pf"></div></div>
<div id="sc"></div>
<button id="gb" onclick="gp(cur)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>이전</button>
<div class="wrap">
  ${startHTML} ${slides}
  <div class="sl" id="done"><div class="card" style="text-align:center;padding:50px 30px;">
    <div style="font-size:60px;margin-bottom:20px">🎉</div>
    <div class="stit">${esc(doneTitle)}</div>
    <div class="cs">${esc(doneDesc)}</div>
  </div></div>
</div>
<script>
const TOTAL=${TOTAL}; let cur=${useStart?-1:0}, anim=false; const ans={};
if(!${useStart}) { document.getElementById('sl0').style.display='flex'; document.getElementById('sl0').classList.add('active'); upUI(); }
function sf(){ go(-1,0,'n'); cur=0; upUI(); }
function gn(i){ if(anim)return; if(!vld(i))return; cur++; go(i,cur,'n'); upUI(); }
function gp(i){ if(anim||cur<=0)return; cur--; go(i,cur,'p'); upUI(); }
function go(f,t,d){
  anim=true; const from=document.getElementById(f<0?'ss':'sl'+f), to=document.getElementById(t>=TOTAL?'done':'sl'+t);
  const outCls=d==='n'?'ex':'xp', inCls=d==='n'?'en':'ep';
  from.classList.add(outCls); from.classList.remove('active');
  setTimeout(()=>{
    from.style.display='none'; from.classList.remove(outCls);
    to.style.display='flex'; to.classList.add(inCls); to.classList.add('active');
    setTimeout(()=>{ to.classList.remove(inCls); anim=false; if(t>=TOTAL) sub(); },400);
  },300);
}
function upUI(){
  const pf=document.getElementById('pf'), sc=document.getElementById('sc'), gb=document.getElementById('gb');
  if(cur<0){ pf.style.width='0%'; sc.style.opacity='0'; gb.classList.remove('v'); }
  else{ pf.style.width=((cur+1)/TOTAL*100)+'%'; sc.textContent=(cur+1)+' / '+TOTAL; sc.style.opacity='1'; gb.className=cur>0?'v':''; }
}
function vld(i){ switch(i){ ${vld} default:break; } return true; }
function er(i,m){ const e=document.getElementById('e'+i); e.textContent='⚠ '+m; e.style.display='block'; }
function ce(){ document.querySelectorAll('.em').forEach(e=>e.style.display='none'); }
function pick(el,gid,multi){ if(!multi)document.querySelectorAll('#'+gid+' .ci').forEach(c=>c.classList.remove('ck')); el.classList.toggle('ck'); }
async function sub(){ window.parent.postMessage({type:'FORM_SUBMIT',answers:ans},'*'); }
function rp(e,btn){ /* Ripple effect */ }
<\/script></body></html>`
}
