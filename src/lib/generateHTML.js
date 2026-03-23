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
    allowBack=true, autoNext=false, useConfetti=true, useKb=true,
    startTag='✦ Form', startBtnText='시작하기', startDesc='',
    doneTitle='제출 완료!', doneDesc='응답해주셔서 감사합니다 🎉',
    doneCta='', doneUrl='',
    scriptUrl='https://script.google.com/macros/s/여기에_URL_입력/exec',
  } = settings
  const { coverImgData=null, qImgData={} } = assets
  const TOTAL = questions.length

  if (!TOTAL) return `<html><body style="background:#0e0e14;color:var(--tx3);font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;font-size:14px">질문을 추가해주세요.</body></html>`

  const conceptCSS = getConceptCSS(conceptTheme, theme.c1, theme.c2, fontFamily)
const animCSS = [
    // 0: 슬라이드 업
    `@keyframes siU{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}
@keyframes soU{from{opacity:1}to{opacity:0;transform:translateY(-40px)}}
@keyframes siD{from{opacity:0;transform:translateY(-40px)}to{opacity:1;transform:none}}
@keyframes soD{from{opacity:1}to{opacity:0;transform:translateY(40px)}}
.en{animation:siU .38s ease both}.ex{animation:soU .28s ease both}
.ep{animation:siD .38s ease both}.xp{animation:soD .28s ease both}`,

    // 1: 페이드 + 블러
    `@keyframes fdi{from{opacity:0;transform:scale(.94);filter:blur(6px)}to{opacity:1;transform:none;filter:blur(0)}}
@keyframes fdo{from{opacity:1;filter:blur(0)}to{opacity:0;transform:scale(1.05);filter:blur(6px)}}
.en,.ep{animation:fdi .4s cubic-bezier(.22,1,.36,1) both}
.ex,.xp{animation:fdo .28s ease both}`,

    // 2: 플립 X
    `@keyframes fxIn{from{opacity:0;transform:perspective(700px) rotateX(14deg) scale(.97)}to{opacity:1;transform:none}}
@keyframes fxOut{from{opacity:1}to{opacity:0;transform:perspective(700px) rotateX(-14deg) scale(.97)}}
.en,.ep{animation:fxIn .4s cubic-bezier(.22,1,.36,1) both}
.ex,.xp{animation:fxOut .28s ease both}`,

    // 3: 플립 Y (카드 뒤집기)
    `@keyframes fyIn{from{opacity:0;transform:perspective(700px) rotateY(-16deg) scale(.97)}to{opacity:1;transform:none}}
@keyframes fyInR{from{opacity:0;transform:perspective(700px) rotateY(16deg) scale(.97)}to{opacity:1;transform:none}}
@keyframes fyOut{from{opacity:1}to{opacity:0;transform:perspective(700px) rotateY(16deg) scale(.97)}}
@keyframes fyOutR{from{opacity:1}to{opacity:0;transform:perspective(700px) rotateY(-16deg) scale(.97)}}
.en{animation:fyIn .42s cubic-bezier(.22,1,.36,1) both}.ex{animation:fyOut .28s ease both}
.ep{animation:fyInR .42s cubic-bezier(.22,1,.36,1) both}.xp{animation:fyOutR .28s ease both}`,

    // 4: 줌 인
    `@keyframes ziIn{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}}
@keyframes ziOut{from{opacity:1;transform:none}to{opacity:0;transform:scale(1.2)}}
.en,.ep{animation:ziIn .4s cubic-bezier(.34,1.4,.64,1) both}
.ex,.xp{animation:ziOut .28s ease both}`,

    // 5: 슬라이드 좌우
    `@keyframes slIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:none}}
@keyframes slOut{from{opacity:1}to{opacity:0;transform:translateX(-60px)}}
@keyframes slInR{from{opacity:0;transform:translateX(-60px)}to{opacity:1;transform:none}}
@keyframes slOutR{from{opacity:1}to{opacity:0;transform:translateX(60px)}}
.en{animation:slIn .38s cubic-bezier(.22,1,.36,1) both}.ex{animation:slOut .28s ease both}
.ep{animation:slInR .38s cubic-bezier(.22,1,.36,1) both}.xp{animation:slOutR .28s ease both}`,

    // 6: 바운스
    `@keyframes bnIn{0%{opacity:0;transform:translateY(60px) scale(.9)}60%{transform:translateY(-8px) scale(1.02)}80%{transform:translateY(4px)}100%{opacity:1;transform:none}}
@keyframes bnOut{0%{opacity:1}100%{opacity:0;transform:translateY(-30px) scale(.95)}}
.en,.ep{animation:bnIn .55s cubic-bezier(.22,1,.36,1) both}
.ex,.xp{animation:bnOut .28s ease both}`,

    // 7: 회전 + 줌
    `@keyframes rzIn{from{opacity:0;transform:rotate(-8deg) scale(.85)}to{opacity:1;transform:none}}
@keyframes rzOut{from{opacity:1}to{opacity:0;transform:rotate(8deg) scale(.85)}}
.en,.ep{animation:rzIn .45s cubic-bezier(.22,1,.36,1) both}
.ex,.xp{animation:rzOut .28s ease both}`,

    // 8: 글리치
    `@keyframes glIn{0%{opacity:0;transform:translateX(-4px) skewX(3deg)}20%{transform:translateX(3px) skewX(-2deg)}40%{transform:translateX(-2px) skewX(1deg)}100%{opacity:1;transform:none}}
@keyframes glOut{0%{opacity:1}50%{transform:translateX(4px) skewX(-3deg)}100%{opacity:0;transform:translateX(-4px)}}
.en,.ep{animation:glIn .45s ease both}
.ex,.xp{animation:glOut .28s ease both}`,

    // 9: 언폴드 (위에서 펼쳐짐)
    `@keyframes ufIn{from{opacity:0;transform:translateY(-30px) scaleY(.6);transform-origin:top}to{opacity:1;transform:none}}
@keyframes ufOut{from{opacity:1}to{opacity:0;transform:translateY(30px) scaleY(.6);transform-origin:bottom}}
.en,.ep{animation:ufIn .42s cubic-bezier(.22,1,.36,1) both}
.ex,.xp{animation:ufOut .28s ease both}`,
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
    <div class="ct">${esc(q.label||'질문')}</div>
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

  const firstShortLabel = questions.find(q=>q.type==='short')?.label||''

  const startHTML = useStart?`<div id="ss" class="sl active" style="display:flex"><div class="card">
    ${coverImgData?`<img src="${coverImgData}" style="width:calc(100% + 68px);margin:-38px -34px 24px;height:200px;object-fit:cover;border-radius:24px 24px 0 0;display:block" alt="">`:'' }
    <div class="stag">${esc(startTag)}</div>
    <div class="stit">${esc(title).replace(/\n/g,'<br>')}</div>
    ${startDesc?`<div class="sdesc">${esc(startDesc)}</div>`:''}
    <button class="sbt" onclick="sf()" onmousedown="rp(event,this)"><span>${esc(startBtnText)}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
    <div style="font-size:12px;color:var(--tx3);margin-top:14px">총 ${TOTAL}개 질문</div>
  </div></div>`:''


  const confJS = useConfetti?`function cf(){const w=document.getElementById('cfw'),colors=['${theme.c1}','${theme.c2}','#f0eff8','#4ade80','#fbbf24','#f472b6','#38bdf8'];for(let i=0;i<90;i++){const p=document.createElement('div'),c=colors[i%colors.length],sz=5+Math.random()*8;p.style.cssText='position:absolute;top:-12px;left:'+Math.random()*100+'vw;width:'+sz+'px;height:'+sz+'px;background:'+c+';border-radius:'+(Math.random()>.5?'50%':'3px')+';animation:cff '+(1.6+Math.random()*1.6)+'s '+(Math.random()*.9)+'s linear forwards';w.appendChild(p);}setTimeout(()=>w.innerHTML='',4500);}`:''
  const kbJS = useKb?`document.addEventListener('keydown',e=>{if(document.activeElement?.tagName==='TEXTAREA')return;if(e.key==='Enter'||e.key==='ArrowRight'){if(cur<0)sf();else if(cur<TOTAL)gn(cur);}if((e.key==='ArrowLeft'||e.key==='Backspace')&&document.activeElement?.tagName!=='INPUT'){if(${allowBack}&&cur>0)gp(cur);}});`:''

  return `<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<title>${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Gmarket+Sans:wght@300;500;700&family=Noto+Sans+KR:wght@300;400;500&family=Gowun+Dodum&display=swap" rel="stylesheet">
<style>
:root{--c1:${theme.c1};--c2:${theme.c2};--tx:#f0eff8;--tx2:#9997ab;--tx3:#7a788f;--bg2:#1a1a28;--bd:rgba(255,255,255,.09);--bd2:rgba(255,255,255,.15);--ls-bg:rgba(255,255,255,.025)}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:${fontFamily};min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;overflow:hidden;-webkit-font-smoothing:antialiased}
/* concept theme handles background */
#pw{position:fixed;top:0;left:0;right:0;height:3px;background:rgba(255,255,255,.06);z-index:50}
#pf{height:100%;background:linear-gradient(90deg,var(--c1),var(--c2));border-radius:0 3px 3px 0;transition:width .6s cubic-bezier(.4,0,.2,1);position:relative}
#pf::after{content:'';position:absolute;right:-2px;top:-2px;bottom:-2px;width:7px;border-radius:50%;background:var(--c2);box-shadow:0 0 10px 2px var(--c2)}
#sc{position:fixed;top:14px;right:18px;font-size:12px;color:var(--tx3);z-index:50;font-variant-numeric:tabular-nums;transition:opacity .3s}
#gb{position:fixed;top:10px;left:14px;z-index:50;display:none;align-items:center;gap:5px;font-size:13px;color:var(--tx3);background:none;border:none;cursor:pointer;font-family:inherit;transition:color .2s,transform .2s;padding:6px 4px}
#gb:hover{color:var(--tx);transform:translateX(-3px)}#gb.v{display:flex}
#kh{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);font-size:11px;color:rgba(122,120,143,.5);display:flex;align-items:center;gap:6px;pointer-events:none;z-index:10;transition:opacity .5s;white-space:nowrap}
#kh kbd{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:5px;padding:2px 8px;font-family:monospace;font-size:11px}
.wrap{position:relative;z-index:1;width:100%;max-width:540px}
.sl{width:100%;display:none;flex-direction:column}
.sl.active{display:flex}
.sl.ex2{position:absolute;top:0;left:0;right:0;pointer-events:none}
.card{background:var(--card-bg,rgba(22,22,31,.95));border:1px solid var(--bd);border-radius:24px;padding:38px 34px 30px;backdrop-filter:blur(20px);position:relative;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.35)}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--c1),var(--c2),transparent 80%)}
.cn{font-family:'Gmarket Sans',sans-serif;font-size:11px;font-weight:700;letter-spacing:.13em;color:var(--c1);margin-bottom:12px}
.ct{font-family:'Gmarket Sans',sans-serif;font-size:clamp(18px,4.5vw,24px);font-weight:500;line-height:1.4;margin-bottom:8px}
.cs{font-size:14px;color:var(--tx2);font-weight:300;line-height:1.65;margin-bottom:22px}
.fi{width:100%;background:var(--bg2);border:1.5px solid var(--bd);border-radius:14px;padding:15px 18px;font-size:16px;color:var(--tx);font-family:inherit;outline:none;-webkit-appearance:none;transition:border-color .2s,box-shadow .2s,transform .15s}
.fi::placeholder{color:var(--tx3)}.fi:focus{border-color:var(--c1);box-shadow:0 0 0 4px color-mix(in srgb,var(--c1) 18%,transparent);transform:translateY(-1px)}
.fi.er{border-color:#f87171;box-shadow:0 0 0 4px rgba(248,113,113,.1);animation:shk .35s ease}
@keyframes shk{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
.cg{display:flex;flex-direction:column;gap:10px}
.ci{display:flex;align-items:center;gap:13px;background:var(--bg2);border:1.5px solid var(--bd);border-radius:14px;padding:14px 17px;cursor:pointer;transition:border-color .2s,background .2s,transform .15s,box-shadow .2s;user-select:none}
.ci:hover{border-color:color-mix(in srgb,var(--c1) 55%,transparent);transform:translateY(-1px);box-shadow:0 4px 18px rgba(124,108,252,.13)}
.ci.ck{border-color:var(--c1);background:color-mix(in srgb,var(--c1) 10%,transparent);transform:translateY(-1px);box-shadow:0 4px 20px color-mix(in srgb,var(--c1) 22%,transparent)}
.cb{width:22px;height:22px;border-radius:6px;border:2px solid var(--bd2);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .22s cubic-bezier(.34,1.56,.64,1)}
.rb{border-radius:50%}.ci.ck .cb{background:var(--c1);border-color:var(--c1);transform:scale(1.1)}
.cb::after{content:'';width:9px;height:9px;border-radius:2px;background:#fff;opacity:0;transform:scale(0) rotate(-20deg);transition:all .22s cubic-bezier(.34,1.56,.64,1)}.rb::after{border-radius:50%;width:8px;height:8px}
.ci.ck .cb::after{opacity:1;transform:scale(1) rotate(0)}.ci span,.ci .oi{font-size:15px;flex:1;line-height:1.4;color:var(--tx)}
.oi{background:transparent;border:none;outline:none;color:var(--tx);font-family:inherit}
.ls{background:rgba(255,255,255,.025);border:1.5px solid var(--bd);border-radius:12px;padding:14px 16px;max-height:140px;overflow-y:auto;font-size:12px;color:var(--tx2);line-height:1.75;margin-bottom:14px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.1) transparent}
.la{display:flex;align-items:center;gap:11px;cursor:pointer;user-select:none;padding:8px 4px}.la-text{font-size:13px;color:var(--tx2);font-weight:300}.la-strong{color:var(--tx);font-weight:500}
.ld{width:22px;height:22px;border-radius:6px;border:2px solid var(--bd2);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .22s cubic-bezier(.34,1.56,.64,1)}
.la.ck .ld{background:var(--c1);border-color:var(--c1);transform:scale(1.1)}.ld::after{content:'';width:9px;height:9px;border-radius:2px;background:#fff;opacity:0;transform:scale(0);transition:all .22s cubic-bezier(.34,1.56,.64,1)}.la.ck .ld::after{opacity:1;transform:scale(1)}
.em{font-size:12px;color:#f87171;margin-top:8px;min-height:16px;display:none;align-items:center;gap:5px}.em.on{display:flex;animation:fdi .2s ease}
@keyframes fdi{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:none}}
.cf{display:flex;align-items:center;justify-content:center;margin-top:26px;gap:12px}
.bb{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--tx3);background:none;border:none;cursor:pointer;font-family:inherit;padding:10px 4px;transition:color .2s,transform .2s;flex-shrink:0}
.bb:hover{color:var(--tx);transform:translateX(-3px)}
.nb{flex:0;min-width:160px;display:flex;align-items:center;justify-content:center;gap:9px;background:linear-gradient(135deg,var(--c1),var(--c2));color:#fff;border:none;border-radius:14px;padding:15px 28px;font-size:15px;font-weight:500;font-family:inherit;cursor:pointer;transition:opacity .2s,transform .2s,box-shadow .2s;position:relative;overflow:hidden;white-space:nowrap}
.nb::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,transparent 40%,rgba(255,255,255,.1))}.nb:hover{opacity:.9;transform:translateY(-2px);box-shadow:0 8px 28px color-mix(in srgb,var(--c1) 40%,transparent)}.nb:active{transform:scale(.97)}.nb:disabled{opacity:.4;cursor:not-allowed;transform:none}
.sp{width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:none;flex-shrink:0}.nb.ld2 .sp{display:block}.nb.ld2 .nl,.nb.ld2 .na{display:none}
.stag{display:inline-flex;align-items:center;gap:6px;font-family:'Gmarket Sans',sans-serif;font-size:11px;font-weight:700;letter-spacing:.12em;color:var(--c1);background:color-mix(in srgb,var(--c1) 12%,transparent);border:1px solid color-mix(in srgb,var(--c1) 28%,transparent);border-radius:99px;padding:5px 14px;margin-bottom:16px}
.stag::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--c1);animation:pulse 1.6s ease-in-out infinite}
.stit{font-family:'Gmarket Sans',sans-serif;font-size:clamp(22px,5.5vw,34px);font-weight:700;line-height:1.2;margin-bottom:12px;white-space:pre-line;background:linear-gradient(135deg,#f0eff8 30%,var(--c2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sdesc{font-size:14px;color:var(--tx2);font-weight:300;line-height:1.75;margin-bottom:24px}
.sbt{display:inline-flex;align-items:center;gap:9px;background:linear-gradient(135deg,var(--c1),var(--c2));color:#fff;border:none;border-radius:14px;padding:16px 32px;font-size:15px;font-weight:500;font-family:inherit;cursor:pointer;transition:opacity .2s,transform .2s,box-shadow .2s;position:relative;overflow:hidden}
.sbt::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,transparent 40%,rgba(255,255,255,.1))}.sbt:hover{opacity:.9;transform:translateY(-2px);box-shadow:0 8px 28px color-mix(in srgb,var(--c1) 40%,transparent)}
.done-card{text-align:center;padding:52px 34px 44px;display:flex;flex-direction:column;align-items:center}
.dr{width:80px;height:80px;border-radius:50%;background:rgba(74,222,128,.1);border:2px solid rgba(74,222,128,.3);display:flex;align-items:center;justify-content:center;margin:0 auto 22px;animation:pop .55s cubic-bezier(.34,1.56,.64,1) both}
@keyframes pop{from{transform:scale(0) rotate(-30deg);opacity:0}to{transform:scale(1) rotate(0);opacity:1}}.dr svg{opacity:0;animation:chin .3s .35s ease forwards}@keyframes chin{to{opacity:1}}
.dt{font-family:'Gmarket Sans',sans-serif;font-size:26px;font-weight:700;margin-bottom:12px;animation:fup .4s .4s ease both}
.dd{font-size:14px;color:var(--tx2);line-height:1.85;font-weight:300;white-space:pre-line;animation:fup .4s .5s ease both}.dn{font-weight:500;color:var(--c2)}
.dcta{margin-top:22px;display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--c1),var(--c2));color:#fff;border:none;border-radius:12px;padding:13px 26px;font-size:14px;font-weight:500;font-family:inherit;cursor:pointer;animation:fup .4s .6s ease both;text-decoration:none;transition:opacity .2s,transform .2s}.dcta:hover{opacity:.88;transform:translateY(-1px)}
.drst{margin-top:14px;font-size:12px;color:var(--tx3);background:none;border:none;cursor:pointer;text-decoration:underline;text-underline-offset:3px;font-family:inherit;animation:fup .4s .65s ease both}
@keyframes fup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
#tst{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);background:var(--card-bg,rgba(22,22,31,.95));border:1px solid var(--bd);border-radius:12px;padding:11px 20px;font-size:13px;z-index:400;transition:transform .35s cubic-bezier(.34,1.2,.64,1);pointer-events:none;white-space:nowrap;backdrop-filter:blur(12px)}
#tst.on{transform:translateX(-50%) translateY(0)}#tst.ok{border-color:rgba(74,222,128,.35);color:#4ade80}#tst.fail{border-color:rgba(248,113,113,.35);color:#f87171}
#cfw{position:fixed;inset:0;pointer-events:none;z-index:300;overflow:hidden}
.rp{position:absolute;border-radius:50%;background:rgba(255,255,255,.28);transform:scale(0);animation:rpa .55s linear;pointer-events:none}@keyframes rpa{to{transform:scale(4);opacity:0}}
@keyframes cff{0%{opacity:1;transform:translateY(0) rotate(0)}80%{opacity:1}100%{transform:translateY(110vh) rotate(760deg);opacity:0}}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.6)}}
@keyframes spin{to{transform:rotate(360deg)}}
${conceptCSS}
/* ── 색상/폰트 오버라이드 (사용자 선택값 우선) ── */
${conceptTheme !== 'default' ? `
body { font-family: ${fontFamily} !important; }
.ct, .stit { font-family: ${fontFamily} !important; }
` : ''}
/* 색상 테마 오버라이드 */
.nb { background: linear-gradient(135deg,${theme.c1},${theme.c2}) !important; }
.nb:hover { box-shadow: 0 8px 28px color-mix(in srgb, ${theme.c1} 40%, transparent) !important; }
.sbt { background: linear-gradient(135deg,${theme.c1},${theme.c2}) !important; }
.ci.ck { border-color: ${theme.c1} !important; }
.ci.ck .cb { background: ${theme.c1} !important; border-color: ${theme.c1} !important; }
.cn { color: ${theme.c1} !important; }
.card::before { background: linear-gradient(90deg,transparent,${theme.c1},${theme.c2},transparent) !important; }
#pf { background: linear-gradient(90deg,${theme.c1},${theme.c2}) !important; }
${animCSS}
@media(max-width:480px){.card{padding:28px 22px 22px;border-radius:20px}.ct{font-size:19px}}
</style></head><body>
<div id="pw"><div id="pf"></div></div>
<div id="sc"></div>
<button id="gb" onclick="gp(cur)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>이전</button>
<div id="cfw"></div>
${useKb?'<div id="kh"><kbd>Enter</kbd> 또는 <kbd>→</kbd> 로 다음으로</div>':''}
<div id="tst"></div>
<div class="wrap">
  ${startHTML}
  ${slides}
  <div class="sl" id="done"><div class="card done-card">
    <div class="dr"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
    <div class="dt">${esc(doneTitle)}</div>
    <div class="dd"><span class="dn" id="dn"></span>${esc(doneDesc)}</div>
    ${doneCta&&doneUrl?`<a class="dcta" href="${esc(doneUrl)}" target="_blank">${esc(doneCta)} →</a>`:''}
    <button class="drst" onclick="rst()">다시 제출하기</button>
  </div></div>
</div>
<script>
const SU='${scriptUrl.replace(/'/g,"\\'")}';
const TOTAL=${TOTAL};
let cur=-1,anim=false;
const ans={};
upUI();
${!useStart?'initFirst();':''}
function initFirst(){
  cur=0;
  const sl0=document.getElementById('sl0');
  if(sl0){sl0.style.display='flex';sl0.classList.add('active');const inp=sl0.querySelector('input,textarea');if(inp)setTimeout(()=>inp.focus(),80);}
  upUI();
}
function sid(i){return i<0?'ss':i>=TOTAL?'done':'sl'+i}
function upUI(){if(cur<0||cur>=TOTAL){document.getElementById('pf').style.width=cur>=TOTAL?'100%':'0%';document.getElementById('sc').style.opacity='0';document.getElementById('gb').className='';return;}document.getElementById('pf').style.width=((cur+1)/TOTAL*100)+'%';document.getElementById('sc').textContent=(cur+1)+' / '+TOTAL;document.getElementById('sc').style.opacity='1';document.getElementById('gb').className=${allowBack}&&cur>0?'v':'';}
function go(f,t,d){if(anim)return;anim=true;const from=document.getElementById(sid(f)),to=document.getElementById(sid(t));if(!from||!to){anim=false;return;}const outCls=d==='n'?'ex':'xp';const inCls=d==='n'?'en':'ep';from.classList.add(outCls);from.classList.remove('active');setTimeout(()=>{from.style.display='none';from.classList.remove(outCls);to.style.display='flex';to.classList.add(inCls);to.classList.add('active');setTimeout(()=>{to.classList.remove(inCls);anim=false;const inp=to.querySelector('input[type=text],input[type=tel],input[type=email],textarea');if(inp)inp.focus();},380);},280);}
function sf(){
  if(cur===0)return;
  const prev=cur;
  cur=0;
  if(prev<0){
    // 시작화면에서 넘어올 때 - ss 없으면 바로 sl0 보여주기
    const ss=document.getElementById('ss');
    const sl0=document.getElementById('sl0');
    if(ss){go(prev,0,'n');}
    else if(sl0){sl0.style.display='flex';sl0.classList.add('active');const inp=sl0.querySelector('input,textarea');if(inp)setTimeout(()=>inp.focus(),60);}
    upUI();
  } else {
    go(prev,0,'n');upUI();
  }
}
function gn(s){if(anim)return;if(!vld(s))return;const f=cur;cur++;go(f,cur,'n');upUI();}
function gp(s){if(anim||cur<=0)return;const f=cur;cur--;go(f,cur,'p');upUI();}
function pick(el,gid,multi){if(!multi)document.querySelectorAll('#'+gid+' .ci').forEach(c=>c.classList.remove('ck'));el.classList.toggle('ck');el.style.transform='scale(0.96)';setTimeout(()=>el.style.transform='',100);${autoNext?`if(!multi){const s=document.querySelectorAll('#'+gid+' .ci.ck').length;if(s===1)setTimeout(()=>gn(cur),320);}`:''}}
function pickOther(el,gid,multi){if(!multi)document.querySelectorAll('#'+gid+' .ci').forEach(c=>c.classList.remove('ck'));el.classList.add('ck');el.querySelector('.oi')?.focus();}
function er(i,m){const e=document.getElementById('e'+i);e.textContent='⚠ '+m;e.classList.add('on');}
function ce(){document.querySelectorAll('.em').forEach(e=>{e.textContent='';e.classList.remove('on')});document.querySelectorAll('.fi').forEach(f=>f.classList.remove('er'));}
function vld(s){ce();switch(s){${vld}default:break;}return true;}
async function sub(){if(anim)return;if(!vld(${TOTAL-1}))return;const btn=document.getElementById('sb');btn.classList.add('ld2');btn.disabled=true;ans._ts=new Date().toLocaleString('ko-KR');try{await fetch(SU,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(ans)});const dn=document.getElementById('dn');if(dn){const nk='${esc2(firstShortLabel)}';if(ans[nk])dn.textContent=ans[nk]+', ';}document.getElementById('sc').style.opacity='0';document.getElementById('gb').className='';${useKb?"document.getElementById('kh').style.opacity='0';":''} go(${TOTAL-1},TOTAL,'n');document.getElementById('pf').style.width='100%';cur=TOTAL;${useConfetti?'setTimeout(cf,420);':''}tst('✅ 신청이 완료되었습니다!','ok');}catch(e){btn.classList.remove('ld2');btn.disabled=false;tst('❌ 오류가 발생했습니다.','fail');}}
function rst(){document.querySelectorAll('input').forEach(el=>el.value='');document.querySelectorAll('textarea').forEach(el=>el.value='');document.querySelectorAll('.ci,.la').forEach(el=>el.classList.remove('ck'));const sb=document.getElementById('sb');if(sb){sb.classList.remove('ld2');sb.disabled=false;}Object.keys(ans).forEach(k=>delete ans[k]);document.getElementById('pf').style.width='0%';document.getElementById('sc').style.opacity='0';${useKb?"document.getElementById('kh').style.opacity='1';":""}const f=cur;cur=-1;${!useStart?'setTimeout(initFirst,460);':'go(f,-1,\'p\');upUI();'}}
${confJS}
function rp(e,btn){const r=btn.getBoundingClientRect(),sz=Math.max(r.width,r.height)*2,el=document.createElement('span');el.className='rp';el.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+(e.clientX-r.left-sz/2)+'px;top:'+(e.clientY-r.top-sz/2)+'px';btn.appendChild(el);setTimeout(()=>el.remove(),560);}
function tst(m,t){const el=document.getElementById('tst');el.textContent=m;el.className=t+' on';setTimeout(()=>el.className='',3200);}
${kbJS}
${useKb?"setTimeout(()=>document.getElementById('kh').style.opacity='0',5000);":""}
<\/script></body></html>`
}
