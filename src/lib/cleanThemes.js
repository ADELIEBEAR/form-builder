import { readableButtonColors } from './buttonColors.js'

// Theme set rebuilt from scratch. One shared base gives every theme the same roomy, rounded,
// calm-motion form; each theme then adds its own canvas, surface and character.
// Accent colors always come from the form's own color pick, and the design tab's options win over all of this.
export const CLEAN_THEMES = [
  // Shapes. Color is chosen separately below the theme list, so no two themes differ by color alone.
  { id:'clean_white', name:'기본 카드', emoji:'', desc:'둥근 카드에 목록형 선택지', thumb:{ borderRadius:7 } },
  { id:'clean_warm', name:'안내형', emoji:'', desc:'위에 제목 줄과 번호 단계가 붙는 신청서', thumb:{ borderRadius:8, borderTop:'4px solid #9aa3af' } },
  { id:'clean_band', name:'컬러 밴드', emoji:'', desc:'위쪽 색 띠 위에 카드가 얹힘', thumb:{ borderRadius:6, boxShadow:'0 -9px 0 #9aa3af' } },
  { id:'clean_sheet', name:'바텀 시트', emoji:'', desc:'아래에서 올라온 시트, 위에는 큰 제목', thumb:{ borderRadius:'9px 9px 0 0', marginTop:6 } },
  { id:'clean_full', name:'풀스크린', emoji:'', desc:'카드 없이 화면 가득, 가운데 큰 제목', thumb:{ borderRadius:0, border:'0', background:'#9aa3af' } },
  { id:'clean_landing', name:'랜딩 + 신청', emoji:'', desc:'긴 소개 페이지(요약·체크 목록·자주 묻는 질문·고정 버튼) 뒤에 신청 질문이 이어짐', thumb:{ borderRadius:0, border:'0', borderTop:'5px solid #9aa3af', borderBottom:'7px solid #9aa3af', background:'#fff' } },
  { id:'clean_app', name:'앱 화면', emoji:'', desc:'위에 제목 바와 굵은 진행 막대, 카드 없이 흰 화면에 큰 버튼', thumb:{ borderRadius:0, border:'0', borderTop:'5px solid #9aa3af', background:'#fff' } },
  { id:'clean_bubble', name:'말풍선', emoji:'', desc:'질문이 말풍선으로, 선택지는 알약으로', thumb:{ borderRadius:'9px 9px 9px 2px' } },
  { id:'clean_chip', name:'칩 선택', emoji:'', desc:'선택지가 가로로 늘어선 알약 칩', thumb:{ borderRadius:12, borderStyle:'dotted' } },
  { id:'clean_grid', name:'타일', emoji:'', desc:'선택지가 두 칸씩 놓이는 큰 타일', thumb:{ borderRadius:5, boxShadow:'inset 15px 0 0 #e5e7eb,inset 16px 0 0 #fff' } },
  { id:'clean_capsule', name:'캡슐', emoji:'', desc:'전부 둥근 알약, 가운데 정렬', thumb:{ borderRadius:14 } },
  { id:'clean_pop', name:'팝', emoji:'', desc:'굵은 테두리와 딱 떨어지는 그림자', thumb:{ borderRadius:7, border:'2px solid #16161a', boxShadow:'0 3px 0 #16161a' } },
  { id:'clean_stack', name:'겹친 종이', emoji:'', desc:'뒤에 종이가 겹쳐 보이는 카드', thumb:{ borderRadius:4, boxShadow:'3px 3px 0 #fff,4px 4px 0 #b6bcc6' } },
  { id:'clean_tab', name:'폴더', emoji:'', desc:'단계 표시가 폴더 탭처럼 위로 튀어나옴', thumb:{ borderRadius:'0 6px 6px 6px', boxShadow:'-0px -6px 0 -1px #9aa3af' } },
  { id:'clean_ticket', name:'티켓', emoji:'', desc:'점선과 양옆 홈이 있는 입장권', thumb:{ borderRadius:5, borderBottom:'2px dashed #9aa3af' } },
  { id:'clean_frame', name:'액자', emoji:'', desc:'이중 테두리와 가운데 제목의 격식 있는 서류', thumb:{ borderRadius:2, outline:'1px solid #9aa3af', outlineOffset:-4 } },
  { id:'clean_note', name:'노트', emoji:'', desc:'왼쪽 색 띠와 밑줄 입력칸', thumb:{ borderRadius:3, borderLeft:'4px solid #9aa3af' } },
  { id:'clean_line', name:'라인', emoji:'', desc:'가는 선만 쓰고 제목 아래 밑줄', thumb:{ borderRadius:1, boxShadow:'inset 0 -8px 0 #fff,inset 0 -9px 0 #9aa3af' } },
  { id:'clean_neumo', name:'소프트 입체', emoji:'', desc:'볼록한 카드와 오목한 입력칸', thumb:{ borderRadius:8, border:'0', background:'#e8ecf1', boxShadow:'2px 2px 5px #b9c1cc,-2px -2px 5px #fff' } },
  { id:'clean_glass', name:'글래스', emoji:'', desc:'번지는 빛 위에 반투명 유리 카드', thumb:{ borderRadius:8, background:'rgba(120,130,220,.35)', border:'1px solid rgba(120,130,220,.6)' } },
  { id:'clean_neon', name:'네온', emoji:'', desc:'빛나는 테두리와 제목', thumb:{ borderRadius:7, background:'#0d0f15', border:'1px solid #7c8cff', boxShadow:'0 0 7px #7c8cff' } },
  // Retired from the picker: these differed only by color. Forms saved with them still render the same.
  { id:'clean_pastel', name:'파스텔', emoji:'', desc:'', hidden:true },
  { id:'clean_graphite', name:'미드나잇', emoji:'', desc:'', hidden:true },
  { id:'clean_mono', name:'모노', emoji:'', desc:'', hidden:true },
  { id:'clean_rose', name:'로즈', emoji:'', desc:'', hidden:true },
  { id:'clean_sage', name:'세이지', emoji:'', desc:'', hidden:true },
  { id:'clean_invert', name:'다크 카드', emoji:'', desc:'', hidden:true },
];

// canvas, surface, text, muted, subtle, border, input
const palettes = {
  clean_warm: ['#fdf8ee','#fff','#2b2622','#6f665c','#8c8276','#efe6d6','#fff'],
  clean_white: ['#f4f5f7','#fff','#1f2328','#5b6470','#868e99','#e3e6ea','#f7f8fa'],
  clean_pastel: ['#f5f3ff','#fff','#232033','#625d78','#8a86a0','#e6e2f3','#faf9ff'],
  clean_band: ['#f3f5f8','#fff','#1f2328','#5b6470','#868e99','#e3e6ea','#f7f8fa'],
  clean_full: ['#141a26','transparent','#ffffff','#d5dae3','#aab2c0','rgba(255,255,255,.18)','rgba(255,255,255,.1)'],
  clean_graphite: ['#0f1115','#191c23','#f2f4f7','#b9c0cb','#8d95a3','#2c313b','#20242d'],
  clean_mono: ['#ffffff','#fff','#111111','#444444','#777777','#111111','#fff'],
  clean_note: ['#f1ede3','#fbf9f4','#2a2723','#69635a','#8f887d','#d9d2c3','transparent'],
  clean_rose: ['#fbeff3','#fff','#3b2b33','#7b626d','#967c87','#f0dde4','#fdf8fa'],
  clean_sage: ['#edf4ee','#fff','#24332a','#586b5f','#7f9085','#d9e6dc','#f7faf7'],
  clean_bubble: ['#f1f3f9','transparent','#1f2430','#5d6575','#8a92a1','#e1e5ee','#fff'],
  clean_capsule: ['#f6f4fd','#fff','#231f33','#625d78','#8a86a0','#e7e3f4','#faf9ff'],
  clean_pop: ['#ffffff','#fff','#16161a','#3f3f46','#6b6b75','#16161a','#fff'],
  clean_ticket: ['#eceef3','#fff','#1f2328','#5b6470','#868e99','#dfe3ea','#f7f8fa'],
  clean_neumo: ['#e8ecf1','#e8ecf1','#27303b','#5c6876','#8793a1','transparent','#e8ecf1'],
  clean_line: ['#ffffff','#fff','#1f2328','#5b6470','#8a929c','#d9dde3','transparent'],
  clean_invert: ['#f1f2f5','#16181d','#f4f5f7','#c2c7d0','#959caa','rgba(255,255,255,.14)','rgba(255,255,255,.07)'],
  clean_glass: ['#0e1224','rgba(255,255,255,.1)','#ffffff','#d7dbea','#aab0c8','rgba(255,255,255,.2)','rgba(255,255,255,.1)'],
  clean_neon: ['#07080c','#0d0f15','#f1f4f9','#b4bccb','#8891a2','#262b38','#12151d'],
  clean_app: ['#ffffff','#ffffff','#191f28','#4e5968','#8b95a1','#e5e8eb','#ffffff'],
  clean_sheet: ['#f4f5f7','#fff','#1f2328','#5b6470','#868e99','#e3e6ea','#f7f8fa'],
  clean_chip: ['#f4f5f7','#fff','#1f2328','#5b6470','#868e99','#e3e6ea','#fff'],
  clean_grid: ['#f4f5f7','#fff','#1f2328','#5b6470','#868e99','#e3e6ea','#f7f8fa'],
  clean_stack: ['#eef0f3','#fff','#1f2328','#5b6470','#868e99','#dfe3ea','#f7f8fa'],
  clean_tab: ['#f1f2f5','#fff','#1f2328','#5b6470','#868e99','#e3e6ea','#f7f8fa'],
  clean_frame: ['#f5f3ee','#fffefb','#26231f','#625c53','#8b8478','#d8d2c6','transparent'],
};

const step = ':not(.single-page)'

function base([canvas, surface, text, muted, subtle, border, input], c1) {
  return `
:root{--tx:${text};--tx2:${muted};--tx3:${subtle};--bg2:${input};--bd:${border};--bd2:${subtle};--ls-bg:${input}}
body{background:${canvas};color:var(--tx)}body::before,body::after{display:none}
body .card{background:${surface};border:1px solid var(--bd);box-shadow:0 14px 40px rgba(20,24,40,.07);backdrop-filter:none}
.card::before{display:none}
body${step} .card{border-radius:26px;padding:40px 32px 30px}
.ct,.stit,.dt{font-family:inherit;color:var(--tx);background:none;-webkit-text-fill-color:var(--tx);text-shadow:none;font-weight:800;letter-spacing:-.02em;word-break:keep-all}
body${step} .ct{font-size:clamp(21px,5.2vw,26px);line-height:1.38}
.cs,.sdesc,.dd{font-size:15px;font-weight:400;line-height:1.65;color:var(--tx2)}
.cn,.stag{display:inline-flex;align-self:flex-start;width:fit-content;font-family:inherit;font-size:12px;font-weight:800;letter-spacing:.08em;color:${c1};background:color-mix(in srgb,${c1} 12%,transparent);border:0;border-radius:99px;padding:7px 14px;margin-bottom:18px;box-shadow:none}
.cn::after{display:none}
.fi,.ci{background:var(--bg2);color:var(--tx);border:1.5px solid var(--bd);backdrop-filter:none}
body${step} .fi{border-radius:16px;padding:16px 18px;font-size:16px}
body${step} .cg{gap:11px}
body${step} .ci{border-radius:16px;padding:17px 18px;gap:14px}
.ci span,.ci .oi{font-size:16px;font-weight:600}
body${step} .cb{width:24px;height:24px;border-radius:8px}body${step} .cb.rb{border-radius:50%}
.fi:focus{border-color:${c1};box-shadow:0 0 0 4px color-mix(in srgb,${c1} 14%,transparent);transform:none}
.ci:hover:not(.qdisabled){box-shadow:none;border-color:color-mix(in srgb,${c1} 55%,var(--bd));transform:none}
.ci.ck{background:color-mix(in srgb,${c1} 9%,${surface === 'transparent' ? canvas : surface});box-shadow:none;transform:none}
.ci.ck .cb,.la.ck .ld{transform:none}
.ci,.fi,.nb,.sbt,.dcta{transition:border-color .2s ease,background .2s ease,box-shadow .25s ease,opacity .2s ease,transform .2s ease}
body .nb,body .sbt,body .dcta{border-radius:16px;font-size:16px;font-weight:700;padding:17px 28px;text-shadow:none;box-shadow:0 8px 20px color-mix(in srgb,${c1} 24%,transparent)}
body .nb{min-width:0;flex:0 1 auto}
.cf{min-width:0}
@media(max-width:480px){body .nb{flex:1 1 auto;padding-left:18px;padding-right:18px}}
body .nb:hover,body .sbt:hover,body .dcta:hover{transform:none;opacity:.92}
body .nb:active,body .sbt:active{transform:scale(.985)}
.sbt::before,.nb::before{display:none}
.ls{background:var(--ls-bg);border-color:var(--bd);border-radius:14px;color:var(--tx2)}
.qfb{border-radius:14px}
#pw{background:color-mix(in srgb,${c1} 12%,transparent)}#pf{box-shadow:none}#pf::after{display:none}
@media(max-width:480px){body${step} .card{padding:30px 22px 24px;border-radius:22px}}
`;
}

const extras = {
  clean_warm: (c1, p) => {
    const ink = `color-mix(in srgb,${c1} 72%,#231c14)`
    return `
body{background:color-mix(in srgb,${c1} 7%,#fffdf8);justify-content:flex-start;padding-top:30px;overflow-x:hidden;overflow-y:auto}
#sc{display:none}
.fhead{display:flex}.steps{display:flex}
.steps i{background:color-mix(in srgb,${c1} 16%,${p[1]});color:color-mix(in srgb,${c1} 62%,${p[1]})}
.steps i.on,.steps i.dn{background:${ink};color:#fff}
.steps i.dn+i::before{background:${ink}}
body .card{border:0;border-radius:28px;box-shadow:0 18px 50px color-mix(in srgb,${c1} 14%,transparent)}
body .card::before{display:block;height:5px;background:${c1}!important}
.cn,.stag{color:${ink}!important;background:color-mix(in srgb,${c1} 14%,${p[1]})}
.ct,.stit,.dt{color:${ink};-webkit-text-fill-color:${ink}}
body .nb{flex:1}body .sbt{width:100%;justify-content:center}
body .nb,body .sbt,body .dcta{border-radius:18px;padding:18px 28px;font-size:17px}
.ci{padding:19px 18px}.cb{width:26px;height:26px}`
  },
  clean_white: () => '',
  clean_pastel: (c1, p) => `
body{background:color-mix(in srgb,${c1} 13%,#ffffff)}
body .card{border:0;box-shadow:0 20px 50px color-mix(in srgb,${c1} 18%,transparent)}
.fi,.ci{background:color-mix(in srgb,${c1} 5%,${p[1]});border-color:color-mix(in srgb,${c1} 16%,${p[1]})}
.ct,.stit,.dt{color:color-mix(in srgb,${c1} 55%,#17142a);-webkit-text-fill-color:color-mix(in srgb,${c1} 55%,#17142a)}
body .nb,body .sbt,body .dcta{border-radius:999px}`,
  clean_band: c1 => {
    const band = readableButtonColors(c1)
    return `
body{justify-content:flex-start;padding-top:34px;overflow-x:hidden;overflow-y:auto}
body::before{display:block!important;content:'';position:fixed;top:0;left:0;right:0;height:236px;background:${band.c1};z-index:0}
.fhead{display:flex}.fhead b{color:${band.text}}.fhead span{color:${band.text};opacity:.78}
 18%,transparent);color:${band.text};box-shadow:none}
#gb,#sc{color:${band.text}}#pw{background:color-mix(in srgb,${band.text} 22%,transparent)}
body .card{border:0;box-shadow:0 18px 46px rgba(20,24,40,.14)}`
  },
  clean_full: c1 => `
body{background:color-mix(in srgb,${c1} 34%,#0d1015)}
body .card{border:0;box-shadow:none;padding:14px 6px;text-align:center}
body:not(.single-page) .ct{font-size:clamp(24px,6.4vw,31px)}
.cn,.stag{align-self:center;margin-left:auto;margin-right:auto;color:#fff;background:rgba(255,255,255,.14)}
.ci{text-align:left}
.ci.ck{background:rgba(255,255,255,.22)}
.ci:hover:not(.qdisabled),.fi:focus{border-color:rgba(255,255,255,.6)}
.fi:focus{box-shadow:0 0 0 4px rgba(255,255,255,.12)}
.fi::placeholder{color:rgba(255,255,255,.5)}
.cf{justify-content:center}
body .nb,body .sbt,body .dcta{border-radius:999px;box-shadow:0 10px 28px rgba(0,0,0,.28)}
#pw{background:rgba(255,255,255,.14)}`,
  // Phone-app sheet: fixed title bar with a back arrow, thick progress bar, no card, button pinned under the content.
  clean_app: c1 => `
html body{justify-content:flex-start;padding:108px 20px 28px;overflow-x:hidden;overflow-y:auto}
.fhead{display:flex;position:fixed;top:0;left:0;right:0;height:54px;margin:0;padding:0 20px 0 max(52px,calc(50% - 218px));justify-content:flex-start;background:#fff;border-bottom:1px solid var(--bd);z-index:40}
.fhead b{font-size:15px}.fhead span{display:none}
#gb{top:9px;left:max(10px,calc(50% - 262px));font-size:0;gap:0;padding:8px;color:var(--tx)}#gb svg{width:20px;height:20px}
#pw{top:72px;left:max(20px,calc(50% - 270px));right:max(20px,calc(50% - 270px));height:6px;border-radius:99px;overflow:hidden;background:#eef0f2}#pf{border-radius:99px}
#sc{top:84px;right:max(20px,calc(50% - 270px));font-weight:700}
html body:has(#ss.active){padding-top:54px}body:has(#ss.active) #pw{display:none}
body .card{border:0;box-shadow:none;background:transparent;overflow:visible}
body${step} .card{padding:0;border-radius:0}
body .cn{display:none}
body${step} .ct{font-size:clamp(20px,5.2vw,23px)}
.cf{margin-top:16px}.cf .bb{display:none}
body .nb{flex:1 1 auto}
body .nb,body .sbt,body .dcta{border-radius:16px;box-shadow:0 10px 24px color-mix(in srgb,${c1} 30%,transparent)}
#ss .card{min-height:calc(100vh - 82px);min-height:calc(100dvh - 82px);display:flex;flex-direction:column;align-items:center;text-align:center;padding-top:26px}
#ss .stag{align-self:center}
#ss .tick{align-self:stretch;margin:-26px -20px 26px;border-radius:0}
#ss .cover-image{margin-bottom:22px}
body #ss .sbt{margin-top:auto;width:100%;justify-content:center}`,
  clean_graphite: c1 => `
body .card{box-shadow:0 20px 60px rgba(0,0,0,.45),0 0 0 1px color-mix(in srgb,${c1} 14%,transparent)}
.cn,.stag{background:color-mix(in srgb,${c1} 22%,transparent);color:color-mix(in srgb,${c1} 55%,#ffffff)}
.fi::placeholder{color:var(--tx3)}`,
  clean_mono: () => `
body .card{border:2px solid #111;box-shadow:7px 7px 0 #111}
body:not(.single-page) .card{border-radius:12px}
body:not(.single-page) .ct{font-size:clamp(23px,6vw,29px);font-weight:900;letter-spacing:-.03em}
.cn,.stag{background:#111;color:#fff;border-radius:4px;letter-spacing:.12em}
.fi,.ci{border:2px solid #111}
body:not(.single-page) .fi,body:not(.single-page) .ci{border-radius:8px}
.ci.ck{background:#111}.ci.ck span{color:#fff}
body .nb,body .sbt,body .dcta{border-radius:8px;box-shadow:4px 4px 0 #111}
body .nb:active,body .sbt:active{transform:translate(2px,2px);box-shadow:2px 2px 0 #111}`,
  clean_note: c1 => `
body .card{border:0;box-shadow:0 10px 30px rgba(60,50,30,.1)}
body:not(.single-page) .card{border-radius:14px;padding-left:40px}
body .card::before{display:block;top:0;bottom:0;left:0;right:auto;width:7px;height:auto;background:${c1}!important}
.cn,.stag{background:transparent;padding:0;border-radius:0;letter-spacing:.14em}
.fi{border:0;border-bottom:2px solid var(--bd2)}
body:not(.single-page) .fi{border-radius:0;padding:14px 2px}
.fi:focus{box-shadow:none;border-bottom-color:${c1}}
.ci{border:0;border-bottom:1px solid var(--bd)}
body:not(.single-page) .ci{border-radius:0;padding:16px 4px}
body:not(.single-page) .cg{gap:0}
.ci.ck{background:color-mix(in srgb,${c1} 9%,transparent)}
body .nb,body .sbt,body .dcta{border-radius:10px;box-shadow:none}`,
  clean_rose: () => `body .card{border:0;box-shadow:0 18px 46px rgba(170,90,120,.14)}body .nb,body .sbt,body .dcta{border-radius:999px}`,
  clean_sage: () => `body .card{border:0;box-shadow:0 18px 46px rgba(60,110,80,.13)}`,
  clean_bubble: c1 => `
body{background:color-mix(in srgb,${c1} 9%,#f5f6fa)}
body .card{border:0;box-shadow:none}
body:not(.single-page) .card{padding:10px 4px}
body:not(.single-page) .ct{display:block;background:#fff;padding:18px 20px;border-radius:22px 22px 22px 6px;box-shadow:0 8px 24px rgba(20,30,60,.08);font-size:clamp(18px,4.6vw,21px);font-weight:700;margin-bottom:12px}
.cs{padding-left:6px}
.fi,.ci{border-color:transparent;box-shadow:0 4px 14px rgba(20,30,60,.06)}
body:not(.single-page) .ci{border-radius:999px;padding:15px 22px}
body:not(.single-page) .fi{border-radius:999px;padding:16px 24px}
.ci.ck{border-color:${c1};background:#fff}
body .nb,body .sbt,body .dcta{border-radius:999px}`,
  clean_capsule: c1 => `
body{background:color-mix(in srgb,${c1} 10%,#ffffff)}
body .card{border:0;text-align:center;box-shadow:0 20px 50px color-mix(in srgb,${c1} 16%,transparent)}
body:not(.single-page) .card{border-radius:40px}
.cn,.stag{align-self:center;margin-left:auto;margin-right:auto}
body:not(.single-page) .ci{border-radius:999px;padding:16px 22px;text-align:left}
body:not(.single-page) .fi{border-radius:999px;padding:16px 24px;text-align:center}
.cf{justify-content:center}
body .nb,body .sbt,body .dcta{border-radius:999px}
body .nb{flex:1 1 auto}`,
  clean_pop: c1 => {
    const on = readableButtonColors(c1)
    return `
body{background:${on.c1}}
#gb,#sc{color:${on.text}}#pw{background:color-mix(in srgb,${on.text} 20%,transparent)}
body .card{border:3px solid #16161a;box-shadow:0 10px 0 #16161a}
body:not(.single-page) .card{border-radius:30px}
body:not(.single-page) .ct{font-weight:900;letter-spacing:-.03em}
.cn,.stag{background:#16161a;color:#fff}
.fi,.ci{border:2.5px solid #16161a}
.ci.ck{background:color-mix(in srgb,${c1} 28%,#ffffff)}
.ci:hover:not(.qdisabled){border-color:#16161a}
body .nb,body .sbt,body .dcta{border:3px solid #16161a;border-radius:18px;box-shadow:0 5px 0 #16161a}
body .nb:active,body .sbt:active{transform:translateY(3px);box-shadow:0 2px 0 #16161a}`
  },
  clean_ticket: (c1, p) => `
body .card{border:0;box-shadow:0 14px 34px rgba(20,24,40,.1)}
body:not(.single-page) .card{border-radius:18px}
body .card::before{display:block;height:8px;background:${c1}!important}
.cn,.stag{background:transparent;padding:0;border-radius:0;letter-spacing:.2em;font-family:ui-monospace,Menlo,Consolas,monospace}
.cf{position:relative;border-top:2px dashed ${p[5]};padding-top:22px}
.cf::before,.cf::after{content:'';position:absolute;top:-13px;width:24px;height:24px;border-radius:50%;background:${p[0]}}
.cf::before{left:-44px}.cf::after{right:-44px}
@media(max-width:480px){.cf::before{left:-34px}.cf::after{right:-34px}}
body .nb,body .sbt,body .dcta{border-radius:10px}`,
  clean_neumo: () => `
body .card{border:0;box-shadow:14px 14px 32px #c7ced8,-14px -14px 32px #ffffff}
.fi{border:0;box-shadow:inset 4px 4px 9px #ccd3dc,inset -4px -4px 9px #ffffff}
.fi:focus{box-shadow:inset 5px 5px 11px #c5ccd6,inset -5px -5px 11px #ffffff}
.ci{border:0;box-shadow:5px 5px 12px #cdd4dd,-5px -5px 12px #ffffff}
.ci:hover:not(.qdisabled){box-shadow:6px 6px 14px #c8cfd9,-6px -6px 14px #ffffff}
.ci.ck{background:#e8ecf1;box-shadow:inset 4px 4px 9px #ccd3dc,inset -4px -4px 9px #ffffff}
.cn,.stag{background:#e8ecf1;box-shadow:inset 2px 2px 5px #cfd6de,inset -2px -2px 5px #ffffff}
body .nb,body .sbt,body .dcta{box-shadow:6px 6px 14px #c4cbd5,-6px -6px 14px #ffffff}`,
  clean_line: c1 => `
body .card{box-shadow:none}
body:not(.single-page) .card{border-radius:6px}
body:not(.single-page) .ct{display:block;font-weight:600;padding-bottom:14px;border-bottom:2px solid ${c1}}
.cn,.stag{background:transparent;padding:0;border-radius:0;letter-spacing:.18em}
.fi,.ci{border-width:1px}
body:not(.single-page) .fi,body:not(.single-page) .ci{border-radius:4px}
.ci span,.ci .oi{font-weight:500}
body:not(.single-page) .cb{border-radius:3px}
body .nb,body .sbt,body .dcta{border-radius:4px;box-shadow:none}`,
  clean_invert: () => `
body .card{border:0;box-shadow:0 24px 60px rgba(20,24,40,.28)}
.cn,.stag{background:rgba(255,255,255,.1);color:#fff}
.ci.ck{background:rgba(255,255,255,.16)}
.fi::placeholder{color:var(--tx3)}`,
  clean_glass: c1 => `
body::before,body::after{display:block!important;content:'';position:fixed;border-radius:50%;filter:blur(90px);z-index:0}
body::before{width:360px;height:360px;top:-90px;left:-80px;background:${c1};opacity:.6}
body::after{width:320px;height:320px;bottom:-90px;right:-70px;background:color-mix(in srgb,${c1} 45%,#ff5fa2);opacity:.5}
body .card{backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);box-shadow:0 20px 60px rgba(0,0,0,.3)}
.cn,.stag{background:rgba(255,255,255,.14);color:#fff}
.ci.ck{background:rgba(255,255,255,.24)}
.ci:hover:not(.qdisabled),.fi:focus{border-color:rgba(255,255,255,.6)}
.fi:focus{box-shadow:0 0 0 4px rgba(255,255,255,.12)}
.fi::placeholder{color:rgba(255,255,255,.5)}
#pw{background:rgba(255,255,255,.14)}`,
  clean_neon: c1 => `
body .card{border-color:color-mix(in srgb,${c1} 60%,transparent);box-shadow:0 0 0 1px color-mix(in srgb,${c1} 40%,transparent),0 0 40px color-mix(in srgb,${c1} 38%,transparent)}
.ct,.stit,.dt{text-shadow:0 0 22px color-mix(in srgb,${c1} 60%,transparent)}
.cn,.stag{background:transparent;border:1px solid ${c1};color:color-mix(in srgb,${c1} 60%,#ffffff)}
.ci.ck{border-color:${c1};background:color-mix(in srgb,${c1} 14%,#0d0f15);box-shadow:0 0 18px color-mix(in srgb,${c1} 40%,transparent)}
.fi:focus{box-shadow:0 0 0 3px color-mix(in srgb,${c1} 30%,transparent),0 0 20px color-mix(in srgb,${c1} 35%,transparent)}
body .nb,body .sbt,body .dcta{box-shadow:0 0 26px color-mix(in srgb,${c1} 55%,transparent)}
.fi::placeholder{color:var(--tx3)}`,
  clean_sheet: c1 => {
    const on = readableButtonColors(c1)
    return `
body{background:${on.c1};justify-content:flex-end;padding:0;overflow-x:hidden;overflow-y:auto}
.wrap{max-width:560px;display:flex;flex-direction:column;min-height:100vh;justify-content:flex-end}
.fhead{display:flex;flex-direction:column;align-items:flex-start;gap:14px;margin:0;padding:56px 26px 30px}
.fhead b{color:${on.text};font-size:clamp(24px,6.6vw,32px);letter-spacing:-.03em}
.fhead span{color:${on.text};opacity:.8;font-size:14px}
 18%,transparent);color:${on.text};box-shadow:none}
#gb,#sc{color:${on.text}}#pw{background:color-mix(in srgb,${on.text} 22%,transparent)}
body .card{border:0;box-shadow:0 -10px 40px rgba(0,0,0,.18)}
body:not(.single-page) .card{border-radius:30px 30px 0 0;padding:34px 26px 40px;min-height:52vh}
body:not(.single-page) .card::after{content:'';position:absolute;top:12px;left:50%;width:44px;height:5px;margin-left:-22px;border-radius:99px;background:var(--bd)}
body .nb{flex:1 1 auto}body .sbt{width:100%;justify-content:center}
@media(max-width:480px){body:not(.single-page) .card{border-radius:26px 26px 0 0}}`
  },
  clean_chip: c1 => {
    const on = readableButtonColors(c1)
    return `
body:not(.single-page) .cg{flex-direction:row;flex-wrap:wrap;gap:9px}
body:not(.single-page) .ci{flex:0 1 auto;border-radius:999px;padding:12px 18px;gap:0}
body:not(.single-page) .ci .cb{display:none}
.ci span,.ci .oi{flex:0 1 auto}
.ci.ck{background:${on.c1};border-color:${on.c1}}
.ci.ck span,.ci.ck .oi{color:${on.text}}
.ci .ot{flex:0 1 auto}.ci .od{display:none}
body .nb,body .sbt,body .dcta{border-radius:999px}`
  },
  clean_grid: c1 => `
body:not(.single-page) .cg{display:grid;grid-template-columns:1fr 1fr;gap:10px}
body:not(.single-page) .ci{flex-direction:column;align-items:flex-start;justify-content:space-between;min-height:104px;padding:16px;border-radius:20px;gap:12px}
.ci span,.ci .oi{flex:0 0 auto;width:100%}
.ci .ot{flex:0 0 auto;width:100%}
.ci.ck{border-color:${c1};box-shadow:0 0 0 3px color-mix(in srgb,${c1} 18%,transparent)}`,
  clean_stack: (c1, p) => `
body .card{border:1px solid var(--bd);box-shadow:8px 8px 0 -1px ${p[1]},8px 8px 0 0 var(--bd),16px 16px 0 -1px ${p[1]},16px 16px 0 0 var(--bd)}
body:not(.single-page) .card{border-radius:10px;margin-right:16px}
body:not(.single-page) .fi,body:not(.single-page) .ci{border-radius:8px}
.cn,.stag{border-radius:4px}
body .nb,body .sbt,body .dcta{border-radius:8px;box-shadow:none}`,
  clean_tab: (c1, p) => `
body .card{border:0;box-shadow:0 14px 36px rgba(20,24,40,.1);overflow:visible}
body:not(.single-page) .card{border-radius:0 22px 22px 22px;margin-top:38px}
body:not(.single-page) .cn{position:absolute;left:0;bottom:100%;margin:0;height:38px;align-items:center;padding:0 20px;border-radius:16px 16px 0 0;background:${p[1]};color:${c1}}
.steps{margin-top:4px}`,
  clean_frame: c1 => `
body .card{border:1px solid var(--bd2);box-shadow:none;text-align:center;outline:1px solid var(--bd);outline-offset:-10px}
body:not(.single-page) .card{border-radius:4px;padding:50px 36px 40px}
body:not(.single-page) .ct{font-weight:700;letter-spacing:0}
body:not(.single-page) .ct::after{content:'';display:block;width:36px;height:2px;margin:16px auto 0;background:${c1}}
.cn,.stag{align-self:center;margin-left:auto;margin-right:auto;background:transparent;padding:0;border-radius:0;letter-spacing:.3em}
.fi{border:0;border-bottom:1px solid var(--bd2);text-align:center}
body:not(.single-page) .fi{border-radius:0}
.fi:focus{box-shadow:none;border-bottom-color:${c1}}
.ci{text-align:left;border-width:1px}
body:not(.single-page) .ci{border-radius:2px}
.cf{justify-content:center}
body .nb,body .sbt,body .dcta{border-radius:2px;box-shadow:none;letter-spacing:.06em}`,
};

// The landing theme is the app sheet plus a long full-bleed landing page as its start screen.
palettes.clean_landing = palettes.clean_app
extras.clean_landing = (c1, p) => extras.clean_app(c1, p) + `
body:has(#ss.active) .fhead{display:none}
html body:has(#ss.active){padding-top:0}
#ss .card{padding-top:0;margin:0 -20px;padding-left:20px;padding-right:20px;background:#f1f2f4}
#ss .tick{order:-1;position:sticky;top:0;z-index:30;margin:0 -20px 34px}
#ss .stag{font-size:15px;letter-spacing:0;color:#fff!important;background:${c1};border:2px solid #fff;border-radius:10px;padding:8px 16px;box-shadow:0 6px 16px color-mix(in srgb,${c1} 35%,transparent)}
#ss .stag::before{display:none}
#ss .stit{font-family:'Gmarket Sans',sans-serif;font-size:clamp(46px,15.5vw,68px);font-weight:700;line-height:1.08;letter-spacing:-.04em;margin-bottom:14px;filter:drop-shadow(0 3px 0 #fff) drop-shadow(0 8px 12px rgba(0,0,0,.14))}
#ss .stit .t1:not(:only-of-type){font-size:.6em;color:${c1};-webkit-text-fill-color:${c1}}
#ss .cover-image{order:1;margin:18px 0 0}
#ss .card>.sbt,#ss .card>.sbt+div{display:none}
#ss .sfoot{order:1}
#ss .lsn{order:2;margin:0 -20px;padding:48px 20px;border-radius:0;background:#fff}
#ss .ls-lst{padding-bottom:0}#ss .ls-lst+.ls-lrv{padding-top:14px}
#ss .ls-lcd,#ss .ls-lfq{background:#f6f7f8}
html body:has(#lcta) #ss .card{padding-bottom:58px!important}#ss .ls-lend{background:#1b1c1f}#ss .ls-lft{background:#101113;margin-top:0;padding:28px 20px 34px}`

export function getCleanThemeCSS(id, c1) {
  const palette = palettes[id];
  if (!palette) return null;
  return base(palette, c1) + (extras[id]?.(c1, palette) || '');
}
