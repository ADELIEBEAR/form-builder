import { getConceptCSS, resolveThemeId } from './themes.js'
import { getSinglePagePath, singlePageCSS, singlePageJS } from './singlePage.js'
import { formRefinementCSS } from './formRefinement.js'
import { getThemeFontURL, getThemeTypeface } from './themeAtmosphere.js'
import { getFeaturedThemePolish } from './featuredThemePolish.js'
import { normalizeQuestions } from './questionModel.js'
import { getAnswerKeys } from './answerKeys.js'
import { readableButtonColors } from './buttonColors.js'
import { isPhoneQuestion, isValidPhone } from './phoneValidation.js'
import { getLookCSS } from './formLook.js'

function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')
}
function esc2(s) {
  return String(s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/</g,'\\u003c').replace(/\r/g,'\\r').replace(/\n/g,'\\n').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029')
}
const scriptJSON = value => JSON.stringify(value).replace(/</g, '\\u003c')

export function generateFormHTML(title, questions, theme, settings={}, assets={}) {
  const {
    animType=0, fontFamily="'Noto Sans KR',sans-serif",
    conceptTheme: savedTheme='default',
    useStart=true,
    bgBlur=0, bgOverlay=0.5, bgOverlayColor='#000000',
    allowBack=true, autoNext=false, useConfetti=true, useKb: keyboardEnabled=true,
    layout='steps', submitBtnText='제출하기', waitForSubmit=false,
    startTag='✦ Form', startBtnText='시작하기', startDesc='',
    doneTitle='제출 완료!', doneDesc='응답해주셔서 감사합니다 🎉',
    doneCta='', doneUrl='', donePdfUrl='',
    look={},
    scriptUrl='https://script.google.com/macros/s/AKfycby-KqvP9P5agWpkwa_GgH9xKaVQHzwbRZ_JerZOQ-fyHa1SpzRk5jZNSWfMCeg_LctKWw/exec',
  } = settings
  const conceptTheme = resolveThemeId(savedTheme)
  const singlePage = layout === 'single'
  const useKb = keyboardEnabled && !singlePage
  const submitPdfUrl = donePdfUrl || (/\.pdf(\?|#|$)/i.test(doneUrl) ? doneUrl : '')
  const coverImgData = Object.hasOwn(assets, 'coverImgData') ? assets.coverImgData : settings.coverImgData ?? null
  const normalized = normalizeQuestions(questions, assets.qImgData ?? settings.qImgData ?? {})
  questions = normalized.questions
  const qImgData = normalized.qImgData
  const answerKeys = getAnswerKeys(questions)
  const bgImgData = Object.hasOwn(assets, 'bgImgData') ? assets.bgImgData : settings.bgImgData ?? null
  const TOTAL = questions.length
  // Optional description and badge per choice; the first <span> stays the answer text.
  const badgeKind = text => /hot|인기/i.test(text) ? 'hot' : /event|이벤트/i.test(text) ? 'event' : /추천|best/i.test(text) ? 'pick' : /free|무료/i.test(text) ? 'free' : 'new'
  const optLabel = (q, o, oi) => {
    const meta = q.optionDetail ? q.optionMeta?.[oi] || {} : {}
    if (!meta.desc && !meta.badge) return `<span>${esc(o)}</span>`
    return `<div class="ot"><span>${esc(o)}</span>${meta.badge?`<em class="ob ob-${badgeKind(meta.badge)}">${esc(meta.badge)}</em>`:''}${meta.desc?`<small class="od">${esc(meta.desc)}</small>`:''}</div>`
  }

  if (!TOTAL) return `<html><body style="background:#f7f8fa;color:#8c8f96;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;font-size:14px">질문을 추가해주세요.</body></html>`

  const hasQuiz = questions.some(q => q.type === 'quiz')

  // 퀴즈 정답 데이터
  const quizData = scriptJSON(
    questions.reduce((acc, q, i) => {
      if (q.type === 'quiz') acc[i] = { correct: q.correctAnswer ?? 0, explanation: q.explanation || '' }
      return acc
    }, {})
  )

  // 분기 맵: { questionIdx: { optionIdx: targetQuestionIdx | 'done' } }
  const branchMap = scriptJSON(
    questions.reduce((acc, q, i) => {
      if ((q.type === 'single' || q.type === 'quiz') && q.branches?.length) {
        const map = {}
        q.branches.forEach(b => { if (b.targetIdx != null) map[b.optionIdx] = b.targetIdx })
        if (Object.keys(map).length) acc[i] = map
      }
      return acc
    }, {})
  )

  // 질문 id 배열
  const qIds = scriptJSON(questions.map(q => q.id))

  const conceptCSS = getConceptCSS(conceptTheme, theme.c1, theme.c2, fontFamily)
  const featuredThemePolish = getFeaturedThemePolish(conceptTheme)
  const solidButton = conceptTheme.startsWith('clean_')
  const buttonColors = readableButtonColors(theme.c1, solidButton ? theme.c1 : theme.c2)
  const buttonText = buttonColors.text
  const buttonAngle = conceptTheme === 'ocean' ? 110 : conceptTheme === 'glass' ? 115 : 135
  const buttonBackground = solidButton ? buttonColors.c1 : `linear-gradient(${buttonAngle}deg,${buttonColors.c1},${buttonColors.c2})`
  const themeFontURL = getThemeFontURL(getThemeTypeface(conceptTheme, fontFamily))
  const animCSS = [
    `@keyframes siU{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@keyframes soU{from{opacity:1}to{opacity:0;transform:translateY(-8px)}}@keyframes siD{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:none}}@keyframes soD{from{opacity:1}to{opacity:0;transform:translateY(8px)}}.en{animation:siU .38s cubic-bezier(.22,1,.36,1) both}.ex{animation:soU .22s ease both}.ep{animation:siD .38s cubic-bezier(.22,1,.36,1) both}.xp{animation:soD .22s ease both}`,
    `@keyframes fdi{from{opacity:0;transform:scale(.94);filter:blur(6px)}to{opacity:1;transform:none;filter:blur(0)}}@keyframes fdo{from{opacity:1;filter:blur(0)}to{opacity:0;transform:scale(1.05);filter:blur(6px)}}.en,.ep{animation:fdi .4s cubic-bezier(.22,1,.36,1) both}.ex,.xp{animation:fdo .28s ease both}`,
    `@keyframes fxIn{from{opacity:0;transform:perspective(700px) rotateX(14deg) scale(.97)}to{opacity:1;transform:none}}@keyframes fxOut{from{opacity:1}to{opacity:0;transform:perspective(700px) rotateX(-14deg) scale(.97)}}.en,.ep{animation:fxIn .4s cubic-bezier(.22,1,.36,1) both}.ex,.xp{animation:fxOut .28s ease both}`,
    `@keyframes fyIn{from{opacity:0;transform:perspective(700px) rotateY(-16deg) scale(.97)}to{opacity:1;transform:none}}@keyframes fyInR{from{opacity:0;transform:perspective(700px) rotateY(16deg) scale(.97)}to{opacity:1;transform:none}}@keyframes fyOut{from{opacity:1}to{opacity:0;transform:perspective(700px) rotateY(16deg) scale(.97)}}@keyframes fyOutR{from{opacity:1}to{opacity:0;transform:perspective(700px) rotateY(-16deg) scale(.97)}}.en{animation:fyIn .42s cubic-bezier(.22,1,.36,1) both}.ex{animation:fyOut .28s ease both}.ep{animation:fyInR .42s cubic-bezier(.22,1,.36,1) both}.xp{animation:fyOutR .28s ease both}`,
    `@keyframes ziIn{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}}@keyframes ziOut{from{opacity:1;transform:none}to{opacity:0;transform:scale(1.2)}}.en,.ep{animation:ziIn .4s cubic-bezier(.34,1.4,.64,1) both}.ex,.xp{animation:ziOut .28s ease both}`,
    `@keyframes slIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:none}}@keyframes slOut{from{opacity:1}to{opacity:0;transform:translateX(-60px)}}@keyframes slInR{from{opacity:0;transform:translateX(-60px)}to{opacity:1;transform:none}}@keyframes slOutR{from{opacity:1}to{opacity:0;transform:translateX(60px)}}.en{animation:slIn .38s cubic-bezier(.22,1,.36,1) both}.ex{animation:slOut .28s ease both}.ep{animation:slInR .38s cubic-bezier(.22,1,.36,1) both}.xp{animation:slOutR .28s ease both}`,
    `@keyframes bnIn{0%{opacity:0;transform:translateY(60px) scale(.9)}60%{transform:translateY(-8px) scale(1.02)}80%{transform:translateY(4px)}100%{opacity:1;transform:none}}@keyframes bnOut{0%{opacity:1}100%{opacity:0;transform:translateY(-30px) scale(.95)}}.en,.ep{animation:bnIn .55s cubic-bezier(.22,1,.36,1) both}.ex,.xp{animation:bnOut .28s ease both}`,
    `@keyframes rzIn{from{opacity:0;transform:rotate(-8deg) scale(.85)}to{opacity:1;transform:none}}@keyframes rzOut{from{opacity:1}to{opacity:0;transform:rotate(8deg) scale(.85)}}.en,.ep{animation:rzIn .45s cubic-bezier(.22,1,.36,1) both}.ex,.xp{animation:rzOut .28s ease both}`,
    `@keyframes glIn{0%{opacity:0;transform:translateX(-4px) skewX(3deg)}20%{transform:translateX(3px) skewX(-2deg)}40%{transform:translateX(-2px) skewX(1deg)}100%{opacity:1;transform:none}}@keyframes glOut{0%{opacity:1}50%{transform:translateX(4px) skewX(-3deg)}100%{opacity:0;transform:translateX(-4px)}}.en,.ep{animation:glIn .45s ease both}.ex,.xp{animation:glOut .28s ease both}`,
    `@keyframes ufIn{from{opacity:0;transform:translateY(-30px) scaleY(.6);transform-origin:top}to{opacity:1;transform:none}}@keyframes ufOut{from{opacity:1}to{opacity:0;transform:translateY(30px) scaleY(.6);transform-origin:bottom}}.en,.ep{animation:ufIn .42s cubic-bezier(.22,1,.36,1) both}.ex,.xp{animation:ufOut .28s ease both}`,
  ][animType] || ''

  const slides = questions.map((q, i) => {
    const imgH = qImgData[q.id] && singlePage
      ? `<img class="question-image" src="${esc(qImgData[q.id])}" loading="lazy" decoding="async" alt="">`
      : qImgData[q.id]
      ? `<img class="question-image" src="${qImgData[q.id]}" loading="lazy" decoding="async" alt="">`
      : ''
    let field = ''
    if (q.type === 'short') {
      field = `<input type="text" class="fi" id="f${q.id}" placeholder="${esc(q.placeholder||'답변을 입력하세요...')}">`
    } else if (q.type === 'long') {
      field = `<textarea class="fi" id="f${q.id}" style="height:110px;resize:none;padding-top:13px;line-height:1.6" placeholder="${esc(q.placeholder||'답변을 입력하세요...')}"></textarea>`
    } else if (q.type === 'phone') {
      field = `<div style="position:relative"><div style="position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--tx3);pointer-events:none">🇰🇷 +82</div><input type="tel" class="fi" id="f${q.id}" style="padding-left:72px" placeholder="010-0000-0000" inputmode="tel"></div>`
    } else if (q.type === 'email') {
      field = `<input type="email" class="fi" id="f${q.id}" placeholder="example@email.com" inputmode="email">`
    } else if (q.type === 'multiple') {
      const opts = (q.options||[]).map((o, oi) => `<div class="ci" onclick="pick(this,'g${q.id}',true)"><div class="cb"></div>${optLabel(q, o, oi)}</div>`).join('')
      const other = q.other ? `<div class="ci" onclick="pickOther(this,'g${q.id}',true)"><div class="cb"></div><input class="oi" placeholder="기타..." id="oi${q.id}" onclick="event.stopPropagation()"></div>` : ''
      field = `<div class="cg" id="g${q.id}">${opts}${other}</div>`
    } else if (q.type === 'single') {
      const opts = (q.options||[]).map((o, oi) => `<div class="ci si" data-oi="${oi}" onclick="pick(this,'g${q.id}',false)"><div class="cb rb"></div>${optLabel(q, o, oi)}</div>`).join('')
      const other = q.other ? `<div class="ci si" onclick="pickOther(this,'g${q.id}',false)"><div class="cb rb"></div><input class="oi" placeholder="기타..." id="oi${q.id}" onclick="event.stopPropagation()"></div>` : ''
      field = `<div class="cg" id="g${q.id}">${opts}${other}</div>`
    } else if (q.type === 'quiz') {
      const opts = (q.options||[]).map((o, oi) => `<div class="ci si qo" data-oi="${oi}" onclick="pickQuiz(this,'g${q.id}',${i})"><div class="cb rb"></div><span>${esc(o)}</span></div>`).join('')
      field = `<div class="cg" id="g${q.id}">${opts}</div><div class="qfb" id="qfb${i}" style="display:none"></div>`
    } else if (q.type === 'legal') {
      field = `<div class="ls">${esc(q.legalText||'').replace(/\n/g,'<br>')}</div><div class="la" id="la${q.id}" onclick="this.classList.toggle('ck')"><div class="ld"></div><span style="font-size:13px;color:var(--tx2);font-weight:300"><strong style="color:var(--tx);font-weight:500">위 내용에 동의합니다.</strong></span></div>`
    }

    if (singlePage) {
      if (['single', 'multiple', 'quiz'].includes(q.type)) {
        const multi = q.type === 'multiple'
        const inputType = multi ? 'checkbox' : 'radio'
        const options = (q.options || []).map((option, oi) => `<label class="ci${multi?'':' si'}" data-oi="${oi}"><input class="native-choice" type="${inputType}" name="g${q.id}" onchange="pick(this.parentElement,'g${q.id}',${multi})"><div class="cb${multi?'':' rb'}"></div><span>${esc(option)}</span></label>`).join('')
        const other = q.other && q.type !== 'quiz' ? `<label class="ci${multi?'':' si'}"><input class="native-choice" type="${inputType}" name="g${q.id}" aria-label="기타" onchange="if(${multi}&&!this.checked)pick(this.parentElement,'g${q.id}',true);else pickOther(this.parentElement,'g${q.id}',${multi})"><div class="cb${multi?'':' rb'}"></div><input class="oi" placeholder="기타..." aria-label="기타 답변" id="oi${q.id}" onfocus="pickOther(this.parentElement,'g${q.id}',${multi})"></label>` : ''
        field = `<div class="cg" id="g${q.id}" role="group" aria-labelledby="label${q.id}">${options}${other}</div>`
      } else if (q.type === 'legal') {
        field = `<div class="ls">${esc(q.legalText||'').replace(/\n/g,'<br>')}</div><label class="la" id="la${q.id}"><input class="native-choice" type="checkbox" onchange="this.parentElement.classList.toggle('ck',this.checked)"><div class="ld"></div><span>위 내용에 동의합니다.</span></label>`
      }
      field = field.replace(/ onkeydown="[^"]*"/g, '').replace(/class="fi"/g, `class="fi" aria-labelledby="label${q.id}" aria-describedby="hint${q.id} e${i}" aria-required="${!!q.required}"`)
      return `<section class="single-question" id="sl${i}" aria-labelledby="label${q.id}">
        ${imgH}<div class="question-heading"><label class="ct" id="label${q.id}" for="f${q.id}">${esc(q.label||'질문')}</label><span class="required">${q.required?'필수':'선택'}</span></div>
        <div class="cs" id="hint${q.id}"${q.hint?'':' hidden'}>${esc(q.hint||'')}</div>
        ${field}<div class="em" id="e${i}" role="alert"></div>
      </section>`
    }

    const isLast = i === TOTAL - 1
    const back = allowBack
      ? `<button class="bb" onclick="gp(${i})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>이전</button>`
      : '<span></span>'

    const nextBtn = q.type === 'quiz'
      ? `<button class="nb" id="qcb${i}" onclick="quizCheck(${i})"><span class="nl">정답 확인</span><svg class="na" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
<button class="nb" id="qnb${i}" onclick="gn(${i})" style="display:none"><span class="nl">${isLast?'결과 보기 🎉':'다음 질문'}</span><svg class="na" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>`
      : `<button class="nb" onclick="${isLast?'sub()':'gn('+i+')'}"${isLast?' id="sb"':''}><span class="sp"></span><span class="nl">${isLast?'신청 완료하기 🎉':'다음 질문'}</span><svg class="na" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>`

    return `<div class="sl" id="sl${i}" style="display:none">
  <div class="card">${imgH}
    ${TOTAL<=8?`<div class="steps" style="--n:${TOTAL}">${questions.map((_,j)=>`<i${j<i?' class="dn"':j===i?' class="on"':''}>${j+1}</i>`).join('')}</div>`:''}
    <div class="cn">STEP ${String(i+1).padStart(2,'0')} / ${String(TOTAL).padStart(2,'0')}</div>
    <div class="ct">${esc(q.label||'질문')}</div>
    ${q.hint?`<div class="cs">${esc(q.hint)}</div>`:''}
    <div style="margin-top:6px">${field}</div>
    <div class="em" id="e${i}"></div>
    <div class="cf">${back}${nextBtn}</div>
  </div>
</div>`
  }).join('')

  const vldCases = questions.map((question, i) => {
    const q = { ...question, label: answerKeys[i] }
    if (q.type==='short'||q.type==='long') {
      const isNameField = ['이름','성함','성명','닉네임','name'].some(word => String(q.label || '').toLowerCase().includes(word.toLowerCase()))
      const isPhoneField = isPhoneQuestion(question)
      return `case ${i}:{const v=document.getElementById('f${q.id}')?.value.trim()||'';${q.required?`if(!v){er(${i},'답변을 입력해주세요.');return false;}`:''}${isNameField?`if(v){const nv=v.replace(/[\s._\-·•・,，。!@#$%^&*+=~\`|\\/?:;\[\]{}<>"']/g,'');const lw=nv.toLowerCase();const badWords=['샘플','sample','demo','dummy','asdf','qwer','확인용','삭제','연습'];if(!nv||nv.length<2||/^[0-9]+$/.test(nv)||/^[ㄱ-ㅎㅏ-ㅣ]+$/.test(nv)||(/^(.)\\1+$/.test(nv)&&nv.length<=4)||badWords.some(w=>lw.includes(w.toLowerCase()))){er(${i},'정확한 이름을 입력해주세요.');return false;}}`:''}${isPhoneField?`if(v&&!validPhone(v)){er(${i},'올바른 전화번호를 입력해주세요.');return false;}`:''}ans['${esc2(q.label||'q'+i)}']=v;break;}`
    }
    if (q.type==='phone') return `case ${i}:{const v=document.getElementById('f${q.id}')?.value.trim()||'';${q.required?`if(!v){er(${i},'전화번호를 입력해주세요.');return false;}`:''}if(v&&!validPhone(v)){er(${i},'올바른 전화번호를 입력해주세요.');return false;}ans['${esc2(q.label||'전화번호')}']=v;break;}`
    if (q.type==='email') return `case ${i}:{const v=document.getElementById('f${q.id}')?.value.trim()||'';if((${!!q.required}&&!v)||(v&&!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v))){er(${i},'올바른 이메일을 입력해주세요.');return false;}ans['${esc2(q.label||'이메일')}']=v;break;}`
    if (q.type==='multiple') return `case ${i}:{const sel=[...document.querySelectorAll('#g${q.id} .ci.ck')].map(el=>{const oi=el.querySelector('.oi');return oi?oi.value||'기타':el.querySelector('span').textContent;});${q.required?`if(!sel.length){er(${i},'하나 이상 선택해주세요.');return false;}`:''}ans['${esc2(q.label||'q'+i)}']=sel.join(', ');break;}`
    if (q.type==='single') return `case ${i}:{const el=document.querySelector('#g${q.id} .ci.ck');const oi=el?.querySelector('.oi');const sel=oi?oi.value||'기타':el?.querySelector('span')?.textContent||'';${q.required?`if(!sel){er(${i},'선택해주세요.');return false;}`:''}ans['${esc2(q.label||'q'+i)}']=sel;break;}`
    if (q.type==='quiz') return `case ${i}:{const el=document.querySelector('#g${q.id} .ci.ck');${q.required?`if(!el){er(${i},'보기를 선택해주세요.');return false;}`:''}break;}`
    if (q.type==='legal') return `case ${i}:{${q.required?`if(!document.getElementById('la${q.id}')?.classList.contains('ck')){er(${i},'동의가 필요합니다.');return false;}`:''}ans['${esc2(q.label||'동의')}']=document.getElementById('la${q.id}')?.classList.contains('ck')?'동의':'미동의';break;}`
    return `case ${i}:break;`
  }).join('\n')

  const firstShortLabel = answerKeys[questions.findIndex(q=>q.type==='short')] || ''

  const startPoints = (Array.isArray(look.points) ? look.points : []).map(p => String(p || '').trim()).filter(Boolean).slice(0, 3)
  // Landing sections under the start screen, written one line at a time:
  // "a | b" item, "^" small lead line, "!" highlight line, a line opening with a lone "*" footnote, anything else heading. *word* inside a heading is accented.
  const accent = text => esc(text).replace(/\*([^*]+)\*/g, '<em class="ac">$1</em>')
  const landParse = text => {
    const part = { lead: [], head: [], hl: [], fn: [], items: [] }
    String(text || '').split('\n').forEach((raw, ln) => {
      const line = raw.trim()
      if (!line) return
      if (line[0] === '^') part.lead.push({ ln, t: line.slice(1).trim() })
      else if (line[0] === '!') part.hl.push({ ln, t: line.slice(1).trim() })
      else if (line[0] === '*' && line.indexOf('*', 1) < 0) part.fn.push({ ln, t: line })
      else if (line.includes('|')) part.items.push({ ln, c: line.split('|').map(cell => cell.trim()) })
      else part.head.push({ ln, t: line })
    })
    return part
  }
  const startButton = `<button class="sbt" onclick="sf()" onmousedown="rp(event,this)"><span>${esc(startBtnText)}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>`
  // data-le marks a text the editor preview may rewrite in place: look key, source line, cell (-1 = the whole line).
  const landSection = (cls, key, item, { button = false, hlFirst = false } = {}) => {
    const part = landParse(look[key])
    if (!Object.values(part).some(list => list.length)) return ''
    const le = (ln, c = -1) => ` data-le="${key}:${ln}:${c}"`
    const hl = part.hl.map(x => `<div class="lhl"${le(x.ln)}>${accent(x.t)}</div>`).join('')
    return `<section class="lsn ls-${cls}">${part.lead.map(x => `<div class="ll"${le(x.ln)}>${esc(x.t)}</div>`).join('')}`
      + (part.head.length ? `<div class="lh">${part.head.map(x => `<span${le(x.ln)}>${accent(x.t)}</span>`).join('<br>')}</div>` : '')
      + (part.items.length && item ? `<div class="${cls}">${part.items.map(x => item(x.c, c => le(x.ln, c))).join('')}</div>` : '')
      + (hlFirst ? hl : '') + (button ? startButton : '') + (hlFirst ? '' : hl)
      + part.fn.map(x => `<div class="lfn"${le(x.ln)}>${esc(x.t)}</div>`).join('') + '</section>'
  }
  const LAND_ICONS = {
    시계: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', 집: '<path d="M4 11l8-7 8 7v9h-5v-6h-4v6H4z"/>',
    사람: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>', 책: '<path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3z"/><path d="M5 17a3 3 0 013-3h11"/>',
    선물: '<path d="M3 9h18v4H3zM5 13v8h14v-8M12 9v12M12 9c-2-5-7-3-4 0M12 9c2-5 7-3 4 0"/>', 돈: '<circle cx="12" cy="12" r="9"/><path d="M8.5 9l1.8 6 1.7-5 1.7 5 1.8-6M8 12h8"/>',
    전화: '<path d="M6 3h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A17 17 0 014 5a2 2 0 012-2z"/>', 별: '<path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 17l-5.4 2.8 1.1-6.1L3.2 9.4l6.1-.8z"/>',
    체크: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  }
  const stars = n => /^[1-5]$/.test(n || '') ? `<u>${'★'.repeat(Number(n))}</u>` : ''
  // Landing sections belong to the landing theme only: switching themes hides them without deleting what was written.
  const landHTML = conceptTheme !== 'clean_landing' ? '' : [
    landSection('lst', 'landStats', (r, e) => `<div><b${e(0)}>${esc(r[0])}</b><span${e(1)}>${esc(r[1] || '')}</span></div>`),
    // name | text, name | note | text, or name | note | text | 1-5 stars
    landSection('lrv', 'landReviews', (r, e) => {
      const long = r.length > 2
      return `<div><i>${esc([...r[0]][0] || '')}</i><span><b${e(0)}>${esc(r[0])}</b>${long && r[1] ? `<small${e(1)}>${esc(r[1])}</small>` : ''}</span>${stars(r[3])}<p${e(long ? 2 : 1)}>${esc(r[long ? 2 : 1] || '')}</p></div>`
    }),
    landSection('lcd', 'landCards', (r, e) => `<div><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${LAND_ICONS[r[0]] || LAND_ICONS.체크}</svg></i><b${e(1)}>${esc(r[1] || '')}</b></div>`, { button: true }),
    landSection('lck', 'landChecks', (r, e) => `<div><i></i><p><b${e(0)}>${esc(r[0])}</b>${r[1] ? `<small${e(1)}>${esc(r[1])}</small>` : ''}</p></div>`),
    landSection('lfq', 'landFaq', (r, e) => `<details><summary><span${e(0)}>${esc(r[0])}</span></summary><p${e(1)}>${esc(r[1] || '')}</p></details>`),
    landSection('lend', 'landEnd', null, { button: true, hlFirst: true }),
    look.landFooter ? `<section class="lsn ls-lft">${String(look.landFooter).split('\n').map((t, ln) => t.trim() ? `<span data-le="landFooter:${ln}:-1">${esc(t.trim())}</span>` : '').filter(Boolean).join('\n')}</section>` : '',
  ].join('')
  const startHTML = useStart && !singlePage ? `<div id="ss" class="sl active" style="display:flex"><div class="card">
    ${look.ticker?`<div class="tick"><div>${`<span>${esc(look.ticker)}</span>`.repeat(8)}</div></div>`:''}
    ${coverImgData?`<img class="cover-image" src="${coverImgData}" loading="eager" decoding="async" alt="">`:'' }
    <div class="stag">${esc(startTag)}</div>
    <div class="stit">${esc(title).split('\n').map((line, i) => `<span class="${i ? 'tl' : 'tl t1'}">${line}</span>`).join('<br>')}</div>
    ${startDesc?`<div class="sdesc">${esc(startDesc)}</div>`:''}
    ${startPoints.length?`<div class="spts">${startPoints.map(p=>`<span>${esc(p)}</span>`).join('')}</div>`:''}
    <button class="sbt" onclick="sf()" onmousedown="rp(event,this)"><span>${esc(startBtnText)}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
    <div style="font-size:12px;color:var(--tx3);margin-top:14px">총 ${TOTAL}개 질문</div>
    ${look.footnote?`<div class="sfoot">${esc(look.footnote)}</div>`:''}
    ${landHTML}
  </div></div>${landHTML?`<button id="lcta" class="sbt" onclick="sf()"><span>${esc(startBtnText)}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>`:''}` : ''

  const confJS = useConfetti?`function cf(){const w=document.getElementById('cfw'),colors=['${theme.c1}','${theme.c2}','#f0eff8','#4ade80','#fbbf24','#f472b6','#38bdf8'];for(let i=0;i<90;i++){const p=document.createElement('div'),c=colors[i%colors.length],sz=5+Math.random()*8;p.style.cssText='position:absolute;top:-12px;left:'+Math.random()*100+'vw;width:'+sz+'px;height:'+sz+'px;background:'+c+';border-radius:'+(Math.random()>.5?'50%':'3px')+';animation:cff '+(1.6+Math.random()*1.6)+'s '+(Math.random()*.9)+'s linear forwards';w.appendChild(p);}setTimeout(()=>w.innerHTML='',4500);}`:''
  const kbJS = useKb?`document.addEventListener('keydown',e=>{
    if(e.defaultPrevented||e.isComposing||e.keyCode===229||e.repeat||e.ctrlKey||e.altKey||e.metaKey||anim||submitted)return;
    const target=e.target,tag=target?.tagName;
    if(target?.isContentEditable||['TEXTAREA','SELECT','BUTTON','A'].includes(tag))return;
    if(e.key==='Enter'||(e.key==='ArrowRight'&&tag!=='INPUT')){
      e.preventDefault();
      if(cur<0)sf();else if(cur<TOTAL){const q=QS[cur];if(q&&q.type==='quiz')quizCheck(cur);else gn(cur);}
    }
    if((e.key==='ArrowLeft'||e.key==='Backspace')&&tag!=='INPUT'&&${allowBack}&&(cur>0||HIST.length>0)){e.preventDefault();gp(cur);}
  });`:''

  const doneScoreHTML = hasQuiz ? `<div id="qscore" style="margin:10px 0 4px;font-size:15px;font-weight:600"></div>` : ''

  return `<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<title>${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Gmarket+Sans:wght@300;500;700&display=swap" rel="stylesheet">
<link href="${themeFontURL}" rel="stylesheet">
<style>
:root{--c1:${theme.c1};--c2:${theme.c2};--tx:#f0eff8;--tx2:#9997ab;--tx3:#7a788f;--bg2:#1a1a28;--bd:rgba(255,255,255,.09);--bd2:rgba(255,255,255,.15);--ls-bg:rgba(255,255,255,.025)}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:${fontFamily};min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;overflow:hidden;-webkit-font-smoothing:antialiased;position:relative}
${bgImgData?`#bg-img{position:fixed;inset:0;z-index:-2;background-image:url('${bgImgData}');background-size:cover;background-position:center;filter:blur(${bgBlur}px);transform:scale(${bgBlur>0?1.05:1});transition:filter .3s}#bg-overlay{position:fixed;inset:0;z-index:-1;background:${bgOverlayColor};opacity:${bgOverlay}}`:''}
#pw{position:fixed;top:0;left:0;right:0;height:3px;background:rgba(255,255,255,.06);z-index:50}
#pf{height:100%;background:linear-gradient(90deg,var(--c1),var(--c2));border-radius:0 3px 3px 0;transition:width .6s cubic-bezier(.4,0,.2,1);position:relative}
#pf::after{content:'';position:absolute;right:-2px;top:-2px;bottom:-2px;width:7px;border-radius:50%;background:var(--c2);box-shadow:0 0 10px 2px var(--c2)}
#sc{position:fixed;top:14px;right:18px;font-size:12px;color:var(--tx3);z-index:50;font-variant-numeric:tabular-nums;transition:opacity .3s}
#gb{position:fixed;top:10px;left:14px;z-index:50;display:none;align-items:center;gap:5px;font-size:13px;color:var(--tx3);background:none;border:none;cursor:pointer;font-family:inherit;transition:color .2s,transform .2s;padding:6px 4px}
#gb:hover{color:var(--tx);transform:translateX(-3px)}#gb.v{display:flex}
#kh{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);font-size:11px;color:rgba(122,120,143,.5);display:flex;align-items:center;gap:6px;pointer-events:none;z-index:10;transition:opacity .5s;white-space:nowrap}
@media(hover:none),(max-width:600px){#kh{display:none}}
#kh kbd{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:5px;padding:2px 8px;font-family:monospace;font-size:11px}
.wrap{position:relative;z-index:1;width:100%;max-width:540px}
.fhead{display:none;align-items:center;justify-content:center;gap:12px;margin-bottom:20px}
.fhead b{display:block;font-size:17px;font-weight:800;color:var(--tx);line-height:1.35;word-break:keep-all}
.fhead span{font-size:13px;color:var(--tx3)}
.steps{display:none;align-items:center;justify-content:center;margin-bottom:24px;--sg:clamp(8px,4.2vw,26px)}
.steps i{position:relative;box-sizing:border-box;flex:0 0 auto;width:min(30px,calc((100% - (var(--n) - 1)*var(--sg))/var(--n)));aspect-ratio:1;font-style:normal;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;line-height:1;background:color-mix(in srgb,var(--c1) 14%,transparent);color:var(--c1);transition:background .3s,color .3s,box-shadow .3s}
.steps i+i{margin-left:var(--sg)}
.steps i+i::before{content:'';position:absolute;right:calc(100% + 3px);top:50%;width:calc(var(--sg) - 6px);height:2px;margin-top:-1px;border-radius:2px;background:color-mix(in srgb,var(--c1) 20%,transparent);transition:background .3s}
.steps i.on,.steps i.dn{background:var(--c1);color:#fff}
.steps i.on{box-shadow:0 0 0 4px color-mix(in srgb,var(--c1) 22%,transparent)}
.steps i.dn{font-size:0}
.steps i.dn::after{content:'';width:34%;height:18%;border-left:2px solid currentColor;border-bottom:2px solid currentColor;transform:translateY(-15%) rotate(-45deg)}
.steps i.dn+i::before{background:var(--c1)}
body.single-page .steps,body.single-page .fhead{display:none}
.ot{flex:1;min-width:0;display:flex;flex-wrap:wrap;align-items:center;gap:3px 8px}
.ci .ot span{flex:0 1 auto}
.ob{font-style:normal;font-size:10px;font-weight:800;letter-spacing:.06em;line-height:1;padding:4px 8px;border-radius:99px;background:color-mix(in srgb,var(--c1) 16%,transparent);color:var(--c1);animation:obIn .5s cubic-bezier(.22,1,.36,1) both,obGlow 2.4s ease-in-out .5s infinite}
.ob-hot{background:#ffe4e1;color:#d92d20}.ob-event{background:#efe5ff;color:#6d3fd6}.ob-pick{background:#dff5e6;color:#17803d}.ob-free{background:#fff1c9;color:#a16207}
.od{flex-basis:100%;font-size:13px;line-height:1.5;color:var(--tx2)}
@keyframes obIn{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}}
@keyframes obGlow{0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 0 4px color-mix(in srgb,currentColor 16%,transparent)}}
.sl{width:100%;display:none;flex-direction:column}.sl.active{display:flex}
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
.ci:hover:not(.qdisabled){border-color:color-mix(in srgb,var(--c1) 55%,transparent);transform:translateY(-1px);box-shadow:0 4px 18px rgba(124,108,252,.13)}
.ci.ck{border-color:var(--c1);background:color-mix(in srgb,var(--c1) 10%,transparent);transform:translateY(-1px);box-shadow:0 4px 20px color-mix(in srgb,var(--c1) 22%,transparent)}
.ci.qcorrect{border-color:#22c55e!important;background:rgba(34,197,94,.12)!important;box-shadow:0 4px 20px rgba(34,197,94,.2)!important;transform:none!important}
.ci.qwrong{border-color:#f87171!important;background:rgba(248,113,113,.1)!important;animation:shk .35s ease;transform:none!important}
.ci.qdisabled{pointer-events:none}
.cb{width:22px;height:22px;border-radius:6px;border:2px solid var(--bd2);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .22s cubic-bezier(.34,1.56,.64,1)}
.rb{border-radius:50%}
.ci.ck .cb{background:var(--c1);border-color:var(--c1);transform:scale(1.1)}
.ci.qcorrect .cb{background:#22c55e!important;border-color:#22c55e!important;transform:scale(1.1)}
.ci.qwrong .cb{background:#f87171!important;border-color:#f87171!important}
.cb::after{content:'';width:9px;height:9px;border-radius:2px;background:#fff;opacity:0;transform:scale(0) rotate(-20deg);transition:all .22s cubic-bezier(.34,1.56,.64,1)}.rb::after{border-radius:50%;width:8px;height:8px}
.ci.ck .cb::after,.ci.qcorrect .cb::after,.ci.qwrong .cb::after{opacity:1;transform:scale(1) rotate(0)}
.ci span,.ci .oi{font-size:15px;flex:1;line-height:1.4;color:var(--tx)}
.oi{background:transparent;border:none;outline:none;color:var(--tx);font-family:inherit}
.qfb{margin-top:12px;border-radius:12px;padding:13px 16px;font-size:13px;line-height:1.65;animation:fbIn .3s ease}
.qfb.ok{background:rgba(34,197,94,.1);border:1.5px solid rgba(34,197,94,.3);color:#4ade80}
.qfb.ng{background:rgba(248,113,113,.09);border:1.5px solid rgba(248,113,113,.25);color:#f87171}
@keyframes fbIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.ls{background:rgba(255,255,255,.025);border:1.5px solid var(--bd);border-radius:12px;padding:14px 16px;max-height:140px;overflow-y:auto;font-size:12px;color:var(--tx2);line-height:1.75;margin-bottom:14px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.1) transparent}
.la{display:flex;align-items:center;gap:11px;cursor:pointer;user-select:none;padding:8px 4px}
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
.tick{overflow:hidden;white-space:nowrap;background:#111;border-radius:10px;margin-bottom:18px;padding:9px 0}.tick div{display:inline-block;animation:tick 16s linear infinite}.tick span{display:inline-block;padding:0 18px;font-size:13px;font-weight:800;letter-spacing:.04em;color:var(--c1);text-shadow:0 0 10px var(--c1)}@keyframes tick{to{transform:translateX(-50%)}}
.spts{display:flex;align-self:stretch;margin:4px 0 24px}.spts span{flex:1;min-width:0;padding:2px 8px;font-size:13px;font-weight:700;line-height:1.45;color:var(--tx);text-align:center;word-break:keep-all}.spts span+span{border-left:1px solid var(--bd)}
.lsn{align-self:stretch;margin-top:46px;text-align:left}.lh{font-size:21px;font-weight:800;line-height:1.4;text-align:center;margin-bottom:18px;color:var(--tx);word-break:keep-all}.ac{font-style:normal;color:var(--c1)}.ll{font-size:13px;color:var(--tx3);text-align:center;margin-bottom:12px}.lhl{margin-top:14px;font-size:14px;font-weight:800;color:var(--c1);text-align:center}.lfn{margin-top:4px;font-size:11.5px;line-height:1.7;color:var(--tx3);text-align:center}.lsn>div+.lfn{margin-top:14px}.lfn+.lfn{margin-top:0}
.lst{display:flex;background:var(--c1);border-radius:18px;padding:18px 6px}.lst div{flex:1;min-width:0;text-align:center;color:#fff;padding:0 4px}.lst b{display:block;font-size:17px;font-weight:800}.lst span{font-size:11.5px;opacity:.9}
.ls-lst+.ls-lrv{margin-top:14px}.lrv>div{display:flex;flex-wrap:wrap;align-items:center;gap:0 12px;border:1px solid var(--bd);border-radius:16px;padding:16px;margin-bottom:10px;background:var(--bg2)}.lrv i{flex:0 0 40px;height:40px;border-radius:50%;display:grid;place-items:center;font-style:normal;font-size:16px;font-weight:800;color:var(--c1);background:color-mix(in srgb,var(--c1) 13%,transparent)}.lrv span{flex:1;min-width:0}.lrv b{display:block;font-size:14px;color:var(--tx)}.lrv small{display:block;font-size:12.5px;font-weight:800;color:var(--c1)}.lrv u{text-decoration:none;font-size:13px;letter-spacing:1px;color:#f5a623}.lrv p{flex:0 0 100%;margin-top:10px;font-size:14px;line-height:1.65;color:var(--tx2)}
.lcd{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px}.lcd>div{border:1px solid var(--bd);border-radius:16px;padding:16px 6px;text-align:center;background:var(--bg2)}.lcd i{display:grid;place-items:center;width:42px;height:42px;margin:0 auto 10px;border-radius:50%;color:var(--c1);background:color-mix(in srgb,var(--c1) 12%,transparent)}.lcd svg{width:22px;height:22px}.lcd b{font-size:13px;line-height:1.45;color:var(--tx);word-break:keep-all}.lsn>.sbt{width:100%;justify-content:center}
.lck>div{display:flex;align-items:center;gap:14px;border-radius:14px;padding:15px 16px;margin-bottom:10px;background:color-mix(in srgb,var(--tx) 5%,transparent)}.lck i{flex:0 0 24px;height:24px;border-radius:50%;background:var(--c1) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 12.5l4 4 8-9'/%3E%3C/svg%3E") center/14px no-repeat}.lck b{display:block;font-size:15px;color:var(--tx)}.lck small{display:block;margin-top:3px;font-size:12.5px;color:var(--tx3)}
.lfq details{border:1px solid var(--bd);border-radius:14px;margin-bottom:10px;background:var(--bg2)}.lfq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:12px;padding:16px;font-size:15px;font-weight:700;color:var(--tx)}.lfq summary::-webkit-details-marker{display:none}.lfq summary::after{content:'+';color:var(--c1);font-weight:800}.lfq details[open] summary::after{content:'\\2212'}.lfq p{padding:0 16px 16px;font-size:14px;line-height:1.7;color:var(--tx2)}
.ls-lend{background:#1b1c1f;border-radius:22px;padding:38px 20px 30px;text-align:center}.ls-lend .lh{color:#fff;font-size:23px}.ls-lend .ll{color:#b9bdc4}.ls-lend .lhl{display:inline-block;margin:0 0 20px;padding:9px 18px;border-radius:99px;font-size:13px;border:1px solid color-mix(in srgb,var(--c1) 55%,transparent);background:color-mix(in srgb,var(--c1) 18%,transparent);color:color-mix(in srgb,var(--c1) 55%,#fff)}
.ls-lft{margin-top:14px;background:#101113;border-radius:22px;padding:26px 20px;text-align:center;font-size:12px;line-height:1.8;color:#8f959e;white-space:pre-line}.ls-lft::first-line{color:#fff;font-weight:800;font-size:13px}
#lcta{display:none;position:fixed;left:0;right:0;bottom:0;z-index:60;width:100%;justify-content:center;border-radius:0!important;padding:18px 20px;font-size:17px;font-weight:800;box-shadow:0 -6px 20px rgba(0,0,0,.12)!important}body:has(#ss.active) #lcta{display:flex}body:has(#lcta) #ss .card{padding-bottom:96px!important}
.sfoot{margin-top:12px;font-size:11.5px;line-height:1.7;color:var(--tx3);white-space:pre-line}
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
${fontFamily!=="'Noto Sans KR',sans-serif"?`body{font-family:${fontFamily}!important}.ct,.stit{font-family:${fontFamily}!important}`:''}
.nb{background:linear-gradient(135deg,${theme.c1},${theme.c2})!important}.nb:hover{box-shadow:0 8px 28px color-mix(in srgb,${theme.c1} 40%,transparent)!important}
.sbt{background:linear-gradient(135deg,${theme.c1},${theme.c2})!important}
.ci.ck{border-color:${theme.c1}!important}.ci.ck .cb{background:${theme.c1}!important;border-color:${theme.c1}!important}
.cn{color:${theme.c1}!important}.card::before{background:linear-gradient(90deg,transparent,${theme.c1},${theme.c2},transparent)!important}
#pf{background:linear-gradient(90deg,${theme.c1},${theme.c2})!important}
${animCSS}
@media(prefers-reduced-motion:reduce){.en,.ex,.ep,.xp{animation-duration:.01s!important}}
@media(max-width:480px){.card{padding:28px 22px 22px;border-radius:20px}.ct{font-size:19px}}
${singlePage ? singlePageCSS : ''}
${formRefinementCSS}
${featuredThemePolish}
body .nb,body .sbt,body .dcta,body.single-page .single-submit{color:${buttonText}!important}
body .nb,body .sbt,body .dcta,body.single-page .single-submit{background:${buttonBackground}!important}
body .nb:hover,body .sbt:hover,body .dcta:hover,body.single-page .single-submit:hover{color:${buttonText}!important;background:${buttonBackground}!important}
body .nb .sp,body .sbt .sp{border-color:color-mix(in srgb,${buttonText} 30%,transparent);border-top-color:${buttonText}}
${getLookCSS(look)}
${bgImgData && conceptTheme.startsWith('clean_') ? 'body{background:transparent}' : ''}
</style></head><body${singlePage?' class="single-page"':''}>
${bgImgData?'<div id="bg-img"></div><div id="bg-overlay"></div>':''}
<div id="pw"><div id="pf"></div></div>
<div id="sc"></div>
<button id="gb" onclick="gp(cur)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>이전</button>
<div id="cfw"></div>
${useKb?'<div id="kh"><kbd>Enter</kbd> 또는 <kbd>→</kbd> 로 다음으로</div>':''}
<div id="tst"></div>
<div class="wrap">
<div class="fhead"><div><b>${esc(title)}</b><span>${esc(look.headerSub || `총 ${TOTAL}개 질문`)}</span></div></div>
  ${startHTML}
  ${singlePage?`<main class="card single-sheet" id="single-form">
    <header class="single-header">
      ${coverImgData?`<img class="single-cover" src="${esc(coverImgData)}" decoding="async" alt="">`:''}
      <h1 class="single-title">${esc(title||'신청서')}</h1>
      ${startDesc?`<p class="single-desc">${esc(startDesc)}</p>`:''}
    </header>`:''}
  ${slides}
  ${singlePage?`<footer class="single-footer"><button class="nb single-submit" id="sb" type="button" onclick="submitSingle()"><span class="sp"></span><span class="nl">${esc(submitBtnText||'제출하기')}</span></button></footer></main>`:''}
  <div class="sl" id="done"><div class="card done-card">
    <div class="dr"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
    <div class="dt">${esc(doneTitle)}</div>
    ${doneScoreHTML}
    <div class="dd"><span class="dn" id="dn"></span>${esc(doneDesc)}</div>
    ${doneCta&&doneUrl?`<a class="dcta" href="${esc(doneUrl)}" target="_blank">${esc(doneCta)} →</a>`:''}
    <button class="drst" onclick="rst()">다시 제출하기</button>
  </div></div>
</div>
<script>
const SU='${esc2(scriptUrl)}';
const SINGLE_PAGE=${singlePage};
const WAIT_FOR_SUBMIT=${!!waitForSubmit};
const TOTAL=${TOTAL};
const QUIZ=${quizData};
const BRANCH=${branchMap};
const QS=${scriptJSON(questions.map(q=>({id:q.id,type:q.type,required:!!q.required})))};
const ANSWER_KEYS=${scriptJSON(answerKeys)};
const getFormPath=${getSinglePagePath.toString()};
const HIST=[];
let cur=${singlePage?'0':'-1'},anim=false,submitted=false;
let qzScore=0,qzTotal=0,qzDone={};
const ans={};
upUI();
${!useStart&&!singlePage?'initFirst();':''}
function initFirst(){cur=0;const s=document.getElementById('sl0');if(s){s.style.display='flex';s.classList.add('active');const i=s.querySelector('input,textarea');if(i)setTimeout(()=>i.focus(),80);}upUI();}
function sid(i){return i<0?'ss':i>=TOTAL?'done':'sl'+i}
function upUI(){
  if(SINGLE_PAGE)return;
  if(cur<0||cur>=TOTAL){document.getElementById('pf').style.width=cur>=TOTAL?'100%':'0%';document.getElementById('sc').style.opacity='0';document.getElementById('gb').className='';return;}
  document.getElementById('pf').style.width=((cur+1)/TOTAL*100)+'%';
  document.getElementById('sc').textContent=(cur+1)+' / '+TOTAL;
  document.getElementById('sc').style.opacity='1';
  document.getElementById('gb').className=(${allowBack}&&(cur>0||HIST.length>0))?'v':'';
}
function go(f,t,d){
  if(anim)return;anim=true;
  const fe=document.getElementById(sid(f)),te=document.getElementById(sid(t));
  if(!fe||!te){anim=false;return;}
  const oc=d==='n'?'ex':'xp',ic=d==='n'?'en':'ep';
  fe.classList.add(oc);fe.classList.remove('active');
  setTimeout(()=>{fe.style.display='none';fe.classList.remove(oc);te.style.display='flex';te.classList.add(ic);te.classList.add('active');setTimeout(()=>{te.classList.remove(ic);anim=false;const i=te.querySelector('input[type=text],input[type=tel],input[type=email],textarea');if(i)i.focus();},380);},280);
}
function sf(){
  if(anim)return;
  try{window.scrollTo(0,0)}catch(e){}
  const p=cur;
  cur=0;
  HIST.length=0;
  const fromEl=document.getElementById(p<0?'ss':'sl'+p);
  const toEl=document.getElementById('sl0');
  if(!fromEl||!toEl){anim=false;return;}
  if(p<0){
    // 시작화면→첫질문
    anim=true;
    fromEl.classList.add('ex');fromEl.classList.remove('active');
    setTimeout(()=>{fromEl.style.display='none';fromEl.classList.remove('ex');
      toEl.style.display='flex';toEl.classList.add('en');toEl.classList.add('active');
      setTimeout(()=>{toEl.classList.remove('en');anim=false;
        const inp=toEl.querySelector('input[type=text],input[type=tel],input[type=email],textarea');
        if(inp)inp.focus();
      },380);
    },280);
  } else {
    go(p,0,'n');
  }
  upUI();
}
function gn(s){
  if(SINGLE_PAGE)return;
  if(anim||submitted||s!==cur)return;
  if(QS[s]?.type==='quiz'&&!qzDone[s]&&document.querySelector('#g'+QS[s].id+' .ci.ck')){quizCheck(s);return;}
  if(!vld(s))return;
  const br=BRANCH[s];
  let next=s+1;
  if(br){
    const el=document.querySelector('#g'+QS[s].id+' .ci.ck');
    const oi=el?parseInt(el.dataset.oi??-1):-1;
    if(oi>=0&&br[oi]!=null){const t=br[oi];if(t==='done'){finishForm();return;}const target=Number(t);if(Number.isInteger(target)&&target>=0&&target<TOTAL)next=target;}
  }
  if(next>=TOTAL||next===s){finishForm();return;}
  const back=HIST.indexOf(next);
  if(back>=0){
    // A locked quiz answer cannot be changed, so returning would loop forever.
    if(QS[s].type==='quiz'){finishForm();return;}
    HIST.length=back;
    const f=cur;cur=next;go(f,cur,'p');upUI();return;
  }
  HIST.push(cur);
  const f=cur;cur=next;
  go(f,cur,'n');upUI();
}
function gp(s){
  if(anim||submitted)return;
  const prev=HIST.length>0?HIST.pop():(cur>0?cur-1:0);
  const f=cur;cur=prev;go(f,cur,'p');upUI();
}
function pick(el,gid,multi){
  if(el.classList.contains('qdisabled'))return;
  if(!multi)document.querySelectorAll('#'+gid+' .ci').forEach(c=>c.classList.remove('ck'));
  el.classList.toggle('ck');el.style.transform='scale(0.96)';setTimeout(()=>el.style.transform='',100);
  if(SINGLE_PAGE){syncChoices(gid);updateSinglePath();}
  ${autoNext&&!singlePage?`if(!multi){const s=cur;if(document.querySelectorAll('#'+gid+' .ci.ck').length===1)setTimeout(()=>{if(cur===s)gn(s);},320);}`:''}}
function syncChoices(gid){document.querySelectorAll('#'+gid+' .ci').forEach(el=>{const input=el.querySelector('.native-choice');if(input)input.checked=el.classList.contains('ck');});}
function pickOther(el,gid,multi){if(!multi)document.querySelectorAll('#'+gid+' .ci').forEach(c=>c.classList.remove('ck'));el.classList.add('ck');if(SINGLE_PAGE){syncChoices(gid);updateSinglePath();}el.querySelector('.oi')?.focus();}
function pickQuiz(el,gid,qi){
  if(qzDone[qi])return;
  document.querySelectorAll('#'+gid+' .ci').forEach(c=>c.classList.remove('ck'));
  el.classList.add('ck');
}
function quizCheck(qi){
  if(qzDone[qi]){gn(qi);return;}
  const qd=QUIZ[qi];if(!qd)return;
  const gid='g'+QS[qi].id;
  const sel=document.querySelector('#'+gid+' .ci.ck');
  if(!sel){if(!QS[qi].required){gn(qi);return;}er(qi,'보기를 선택해주세요.');return;}
  const selOi=parseInt(sel.dataset.oi);
  const ok=selOi===qd.correct;
  qzDone[qi]=true;qzTotal++;if(ok)qzScore++;
  ans[ANSWER_KEYS[qi]]=(ok?'✅정답':'❌오답')+'(선택:'+sel.querySelector('span').textContent+')';
  document.querySelectorAll('#'+gid+' .ci').forEach(c=>{
    c.classList.add('qdisabled');
    const oi=parseInt(c.dataset.oi);
    if(oi===qd.correct)c.classList.add('qcorrect');
    else if(c.classList.contains('ck'))c.classList.add('qwrong');
  });
  const fb=document.getElementById('qfb'+qi);
  if(fb){
    fb.style.display='block';
    fb.className='qfb '+(ok?'ok':'ng');
    fb.textContent=ok?'✅ 정답입니다!':'❌ 오답입니다.';
    if(qd.explanation){const detail=document.createElement('span');detail.style.cssText='font-size:12px;opacity:.85';detail.textContent='💡 '+qd.explanation;fb.append(document.createElement('br'),detail);}
  }
  const cb=document.getElementById('qcb'+qi),nb=document.getElementById('qnb'+qi);
  if(cb)cb.style.display='none';
  if(nb)nb.style.display='flex';
}
function er(i,m){const e=document.getElementById('e'+i);e.textContent='⚠ '+m;e.classList.add('on');}
function ce(){document.querySelectorAll('.em').forEach(e=>{e.textContent='';e.classList.remove('on')});document.querySelectorAll('.fi').forEach(f=>f.classList.remove('er'));}
function vld(s){ce();switch(s){${vldCases}default:break;}return true;}
const validPhone = ${isValidPhone.toString()};
function responsePath(){
  const selected={};
  QS.forEach((q,i)=>{if(q.type!=='single'&&q.type!=='quiz')return;const el=document.querySelector('#g'+q.id+' .ci.ck');if(el?.dataset.oi!=null)selected[i]=el.dataset.oi;});
  return getFormPath(TOTAL,BRANCH,selected);
}
function setSubmissionBusy(busy){
  document.querySelectorAll('.nb,.sbt,#gb,.bb').forEach(button=>{button.disabled=busy;button.classList.remove('ld2');});
  const button=document.getElementById(SINGLE_PAGE?'sb':QS[cur]?.type==='quiz'?'qnb'+cur:'sb');
  if(button){button.disabled=busy;if(busy)button.classList.add('ld2');}
}
function finishForm(){
  if(submitted)return;
  const path=responsePath(),keys=new Set(path.map(i=>ANSWER_KEYS[i]));
  Object.keys(ans).forEach(key=>{if(!keys.has(key))delete ans[key];});
  qzScore=0;qzTotal=0;
  path.forEach(i=>{
    if(QS[i].type!=='quiz')return;
    const selected=document.querySelector('#g'+QS[i].id+' .ci.ck');
    if(!selected)return;
    const ok=Number(selected.dataset.oi)===Number(QUIZ[i].correct);
    qzTotal++;if(ok)qzScore++;
    ans[ANSWER_KEYS[i]]=(ok?'✅정답':'❌오답')+'(선택:'+selected.querySelector('span').textContent+')';
  });
  submitted=true;
  ans._ts=new Date().toLocaleString('ko-KR');
  ans._formTitle=${JSON.stringify(title || '').replace(/</g, '\\u003c')};
  try{window.parent.postMessage({type:'FORM_SUBMIT',answers:ans,pdfUrl:'${esc2(submitPdfUrl)}'},'*');}catch(e){}
  if(WAIT_FOR_SUBMIT){setSubmissionBusy(true);return;}
  completeForm();
}
function completeForm(){
  if(SU){try{Promise.resolve(fetch(SU,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(ans)})).catch(()=>{});}catch(e){}}
  const f=cur;cur=TOTAL;
  const dn=document.getElementById('dn');
  if(dn){const nk='${esc2(firstShortLabel)}';if(ans[nk])dn.textContent=ans[nk]+', ';}
  ${hasQuiz?`const sc=document.getElementById('qscore');if(sc&&qzTotal>0){const p=Math.round(qzScore/qzTotal*100);sc.textContent='🏆 점수: '+qzScore+' / '+qzTotal+' ('+p+'%)';sc.style.color=p>=70?'#4ade80':p>=40?'#fbbf24':'#f87171';}`:'' }
  document.getElementById('sc').style.opacity='0';document.getElementById('gb').className='';
  ${useKb?"document.getElementById('kh').style.opacity='0';":""}
  if(SINGLE_PAGE){document.getElementById('single-form').hidden=true;document.getElementById('done').style.display='flex';window.scrollTo(0,0);}
  else go(f,TOTAL,'n');
  document.getElementById('pf').style.width='100%';
  ${useConfetti?'if(!qzTotal||qzScore===qzTotal)setTimeout(cf,420);else if(qzScore>0)setTimeout(cf,420);':''}
  tst('✅ 완료되었습니다!','ok');
}
async function sub(){
  if(SINGLE_PAGE){submitSingle();return;}
  gn(cur);
}
function rst(){
  if(anim)return;
  submitted=false;ce();setSubmissionBusy(false);
  document.querySelectorAll('input').forEach(el=>el.value='');
  document.querySelectorAll('input[type=checkbox],input[type=radio]').forEach(el=>el.checked=false);
  document.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));
  document.querySelectorAll('textarea').forEach(el=>el.value='');
  document.querySelectorAll('.ci,.la').forEach(el=>el.classList.remove('ck','qcorrect','qwrong','qdisabled'));
  document.querySelectorAll('.qfb').forEach(el=>{el.style.display='none';});
  document.querySelectorAll('[id^="qcb"]').forEach(el=>el.style.display='flex');
  document.querySelectorAll('[id^="qnb"]').forEach(el=>el.style.display='none');
  const sb=document.getElementById('sb');if(sb){sb.classList.remove('ld2');sb.disabled=false;}
  Object.keys(ans).forEach(k=>delete ans[k]);
  Object.keys(qzDone).forEach(k=>delete qzDone[k]);
  qzScore=0;qzTotal=0;HIST.length=0;
  if(SINGLE_PAGE){document.getElementById('done').style.display='none';document.getElementById('single-form').hidden=false;cur=0;updateSinglePath();window.scrollTo(0,0);return;}
  document.getElementById('pf').style.width='0%';document.getElementById('sc').style.opacity='0';
  ${useKb?"document.getElementById('kh').style.opacity='1';":""}
  const f=cur;cur=-1;
  ${!useStart?"document.getElementById('done').style.display='none';initFirst();":"go(f,-1,'p');upUI();"}
}
${confJS}
function rp(e,btn){const r=btn.getBoundingClientRect(),sz=Math.max(r.width,r.height)*2,el=document.createElement('span');el.className='rp';el.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+(e.clientX-r.left-sz/2)+'px;top:'+(e.clientY-r.top-sz/2)+'px';btn.appendChild(el);setTimeout(()=>el.remove(),560);}
function tst(m,t){const el=document.getElementById('tst');el.textContent=m;el.className=t+' on';setTimeout(()=>el.className='',3200);}
${kbJS}
${singlePage ? singlePageJS : `
window.addEventListener('message',event=>{
  if(event.source!==window.parent||!WAIT_FOR_SUBMIT||!submitted)return;
  if(event.data?.type==='SUBMIT_SUCCESS'&&cur<TOTAL){completeForm();return;}
  if(event.data?.type==='SUBMIT_ERROR'&&cur<TOTAL){
    submitted=false;
    setSubmissionBusy(false);
    tst(event.data.message||'저장하지 못했습니다. 다시 제출해주세요.','fail');
  }
});
`}
${useKb?"setTimeout(()=>document.getElementById('kh').style.opacity='0',5000);":""}
<\/script></body></html>`
}
